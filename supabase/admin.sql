-- =====================================================================
-- 관리자 페이지(/admin)용 함수. schema.sql 을 먼저 실행한 뒤 실행하세요.
-- 비밀번호는 평문이 아니라 해시로만 저장됩니다. 설정 방법:
--   select treasure.set_admin_password('원하는비밀번호');
-- =====================================================================

insert into treasure.settings (key, value) values ('admin_password_hash', '')
on conflict (key) do nothing;

create or replace function treasure.set_admin_password(p_password text)
returns text language plpgsql set search_path = treasure, public as $$
begin
  if length(coalesce(p_password, '')) < 8 then
    raise exception '비밀번호는 8자 이상이어야 합니다';
  end if;
  update treasure.settings
     set value = encode(sha256(convert_to(p_password, 'UTF8')), 'hex')
   where key = 'admin_password_hash';
  return 'ok';
end;
$$;

create or replace function treasure.admin_ok(p_password text)
returns boolean language plpgsql set search_path = treasure, public as $$
declare
  v_hash text := treasure.cfg('admin_password_hash');
begin
  if v_hash is null or v_hash = '' or p_password is null
     or encode(sha256(convert_to(p_password, 'UTF8')), 'hex') <> v_hash then
    perform pg_sleep(0.5);   -- 무작위 대입 지연
    return false;
  end if;
  return true;
end;
$$;

-- 대시보드 : 설정 · QR별 현황 · 집계 · 최근 스캔 300건
create or replace function public.admin_dashboard(p_password text)
returns json
language plpgsql security definer set search_path = treasure, public as $$
declare
  v_day date := treasure.today();
begin
  if not treasure.admin_ok(p_password) then
    return json_build_object('status', 'denied');
  end if;

  return json_build_object(
    'status', 'ok',
    'now',    now(),
    'open',   treasure.is_open(),
    'settings', (
      select json_object_agg(key, value) from treasure.settings
      where key not in ('staff_pin', 'admin_password_hash')
    ),
    'spots', (
      select json_agg(json_build_object(
        'id', sp.id, 'zone', sp.zone, 'x', sp.x, 'y', sp.y,
        'n', mm.n, 's', mm.s, 'm', mm.m,
        'scans', (select count(*) from treasure.scans sc where sc.spot_id = sp.id)
      ) order by sp.id)
      from treasure.spots sp
      join treasure.multipliers(v_day) mm on mm.spot_id = sp.id
    ),
    'totals', json_build_object(
      'scans',         (select count(*) from treasure.scans),
      'scans_today',   (select count(*) from treasure.scans where event_day = v_day),
      'devices',       (select count(distinct device_id) from treasure.scans),
      'devices_today', (select count(distinct device_id) from treasure.scans where event_day = v_day),
      'first',         (select count(*) from treasure.scans where tier = 'FIRST'),
      'second',        (select count(*) from treasure.scans where tier = 'SECOND'),
      'note',          (select count(*) from treasure.scans where tier = 'NOTE'),
      'claimed',       (select count(*) from treasure.scans where claimed_at is not null)
    ),
    'available', json_build_object(
      'first',  treasure.available('FIRST'),
      'second', treasure.available('SECOND'),
      'note',   treasure.available('NOTE')
    ),
    'scans', (
      select coalesce(json_agg(t order by t.id desc), '[]'::json)
      from (
        select id, device_id, spot_id, created_at, tier, code, multiplier, ip, claimed_at
        from treasure.scans order by id desc limit 300
      ) t
    )
  );
end;
$$;

-- QR 좌표 일괄 저장 : p_spots = [{"id":1,"x":10,"y":20}, ...]
create or replace function public.admin_save_spots(p_password text, p_spots json)
returns json
language plpgsql security definer set search_path = treasure, public as $$
declare
  v_count int;
begin
  if not treasure.admin_ok(p_password) then
    return json_build_object('status', 'denied');
  end if;
  update treasure.spots sp
     set x = (e ->> 'x')::numeric, y = (e ->> 'y')::numeric
    from json_array_elements(p_spots) e
   where sp.id = (e ->> 'id')::int;
  get diagnostics v_count = row_count;
  return json_build_object('status', 'ok', 'updated', v_count);
exception when others then
  return json_build_object('status', 'invalid');
end;
$$;

-- 설정값 수정 (허용된 항목만, 형식 검사 포함)
create or replace function public.admin_update_setting(p_password text, p_key text, p_value text)
returns json
language plpgsql security definer set search_path = treasure, public as $$
declare
  v text := trim(p_value);
  d text;
begin
  if not treasure.admin_ok(p_password) then
    return json_build_object('status', 'denied');
  end if;

  if p_key in ('base_first', 'base_second') then
    if v::numeric < 0 or v::numeric > 1 then raise exception 'range'; end if;
  elsif p_key = 'max_multiplier' then
    if v::numeric < 1 or v::numeric > 5 then raise exception 'range'; end if;
  elsif p_key in ('warmup_devices', 'first_total', 'second_total', 'note_total') then
    if v::int < 0 then raise exception 'range'; end if;
  elsif p_key = 'test_mode' then
    if v not in ('true', 'false') then raise exception 'range'; end if;
  elsif p_key in ('open_time', 'close_time') then
    perform v::time;
  elsif p_key = 'event_days' then
    foreach d in array string_to_array(v, ',') loop
      perform trim(d)::date;
    end loop;
    v := replace(v, ' ', '');
  else
    return json_build_object('status', 'invalid');
  end if;

  update treasure.settings set value = v where key = p_key;
  return json_build_object('status', 'ok');
exception when others then
  return json_build_object('status', 'invalid');
end;
$$;

-- 스캔 기록 수령 여부 수정
create or replace function public.admin_set_claimed(p_password text, p_id bigint, p_claimed boolean)
returns json
language plpgsql security definer set search_path = treasure, public as $$
begin
  if not treasure.admin_ok(p_password) then
    return json_build_object('status', 'denied');
  end if;
  update treasure.scans
     set claimed_at = case when p_claimed then coalesce(claimed_at, now()) else null end
   where id = p_id;
  return json_build_object('status', case when found then 'ok' else 'notfound' end);
end;
$$;

-- 스캔 기록 삭제 (삭제하면 그 경품은 다시 재고로 돌아갑니다)
create or replace function public.admin_delete_scan(p_password text, p_id bigint)
returns json
language plpgsql security definer set search_path = treasure, public as $$
begin
  if not treasure.admin_ok(p_password) then
    return json_build_object('status', 'denied');
  end if;
  delete from treasure.scans where id = p_id;
  return json_build_object('status', case when found then 'ok' else 'notfound' end);
end;
$$;

revoke all on all functions in schema treasure from public, anon, authenticated;

revoke all on function public.admin_dashboard(text)                  from public;
revoke all on function public.admin_save_spots(text, json)           from public;
revoke all on function public.admin_update_setting(text, text, text) from public;
revoke all on function public.admin_set_claimed(text, bigint, boolean) from public;
revoke all on function public.admin_delete_scan(text, bigint)        from public;

grant execute on function public.admin_dashboard(text)                  to anon, authenticated;
grant execute on function public.admin_save_spots(text, json)           to anon, authenticated;
grant execute on function public.admin_update_setting(text, text, text) to anon, authenticated;
grant execute on function public.admin_set_claimed(text, bigint, boolean) to anon, authenticated;
grant execute on function public.admin_delete_scan(text, bigint)        to anon, authenticated;
