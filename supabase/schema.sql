-- =====================================================================
-- 신포국제시장 디지털 보물찾기 : 서버 추첨 시스템 (Supabase / Postgres)
-- Supabase 대시보드 > SQL Editor 에 전체를 붙여넣고 한 번 실행하세요.
-- 다시 실행해도 스캔 기록(treasure.scans)은 지워지지 않습니다.
-- =====================================================================

create schema if not exists treasure;

-- ---------------------------------------------------------------------
-- 1. 테이블 (treasure 스키마는 외부 API에 노출되지 않습니다)
-- ---------------------------------------------------------------------
create table if not exists treasure.spots (
  id    int primary key,            -- QR 번호 1 ~ 20
  slug  text unique not null,       -- QR 주소의 난수 슬러그
  zone  text not null check (zone in ('PAST', 'NOW', 'FUTURE')),
  x     numeric not null,           -- 2차원 평면 좌표 (단위 무관, 비율만 의미)
  y     numeric not null
);

create table if not exists treasure.scans (
  id          bigint generated always as identity primary key,
  device_id   uuid not null,                         -- 휴대폰(브라우저) 고유 번호
  spot_id     int  not null references treasure.spots(id),
  created_at  timestamptz not null default now(),
  event_day   date not null,                         -- 한국 시간 기준 날짜
  ip          text,                                  -- 참고용
  user_agent  text,                                  -- 참고용
  tier        text not null check (tier in ('FIRST', 'SECOND', 'NOTE', 'STAMP')),
  code        text unique,                           -- 경품 인증번호 (STAMP 는 없음)
  multiplier  numeric,                               -- 추첨 당시 배율 (분석용)
  claimed_at  timestamptz                            -- 부스 수령 처리 시각
);

create index if not exists scans_device_idx on treasure.scans (device_id, created_at desc);
create index if not exists scans_day_spot_idx on treasure.scans (event_day, spot_id);

create table if not exists treasure.prize_releases (
  id          int generated always as identity primary key,
  release_at  timestamptz not null,                  -- 이 시각부터 풀림
  tier        text not null check (tier in ('FIRST', 'SECOND', 'NOTE')),
  qty         int  not null check (qty > 0)
);

create table if not exists treasure.settings (
  key   text primary key,
  value text not null
);

alter table treasure.spots          enable row level security;
alter table treasure.scans          enable row level security;
alter table treasure.prize_releases enable row level security;
alter table treasure.settings       enable row level security;

-- ---------------------------------------------------------------------
-- 2. 기본 설정값 (이미 있는 값은 덮어쓰지 않습니다)
--    행사 중에도 Table Editor 에서 value 만 바꾸면 즉시 반영됩니다.
-- ---------------------------------------------------------------------
insert into treasure.settings (key, value) values
  ('base_first',      '0.20'),                   -- 1등 기본 확률
  ('base_second',     '0.40'),                   -- 2등 기본 확률
  ('max_multiplier',  '1.5'),                    -- 최대 배율 (최소는 1/1.5)
  ('warmup_devices',  '30'),                     -- 이 인원 전까지는 모든 QR 동일 확률
  ('first_total',     '6'),                      -- 1등 총 수량
  ('second_total',    '10'),                     -- 2등 총 수량
  ('note_total',      '80'),                     -- 노트 총 수량
  ('event_days',      '2026-11-27,2026-11-28'),
  ('open_time',       '12:00'),
  ('close_time',      '18:00'),
  ('test_mode',       'false'),                  -- 'true' 면 시간 제한 없이 전체 재고로 테스트
  ('staff_pin',       'CHANGE-ME')               -- 반드시 직접 바꾸세요 (8자 이상 권장)
on conflict (key) do nothing;

-- ---------------------------------------------------------------------
-- 3. QR 20개 (좌표는 工자 구조 기준 초안입니다. 실제 부착 위치로 고쳐주세요)
--    우측 세로길 = 과거(1~4) / 가운데 윗길·아랫길 = 오늘(5~13) / 좌측 세로길 = 미래(14~20)
-- ---------------------------------------------------------------------
insert into treasure.spots (id, slug, zone, x, y) values
  ( 1, 's01-8f3k9m', 'PAST',   100, 10),
  ( 2, 's02-4p7v2n', 'PAST',   100, 25),
  ( 3, 's03-9x2q5w', 'PAST',   100, 40),
  ( 4, 's04-6m8t3r', 'PAST',   100, 55),
  ( 5, 's05-2k9b7y', 'NOW',     85, 45),
  ( 6, 's06-7h4n8c', 'NOW',     68, 45),
  ( 7, 's07-5v3p9j', 'NOW',     50, 45),
  ( 8, 's08-3w6z4q', 'NOW',     50, 15),
  ( 9, 's09-9d2r7f', 'NOW',     50, 30),
  (10, 's10-4g8m5k', 'NOW',     35, 30),
  (11, 's11-7t3x9p', 'NOW',     68, 15),
  (12, 's12-2n6v8w', 'NOW',     32, 15),
  (13, 's13-8q4k3m', 'NOW',     15, 30),
  (14, 's14-5b9r2x', 'FUTURE',   0, 55),
  (15, 's15-3c7p6n', 'FUTURE',   0, 47),
  (16, 's16-9m4w8t', 'FUTURE',   0, 39),
  (17, 's17-6f2k7q', 'FUTURE',   0, 31),
  (18, 's18-4x9n3v', 'FUTURE',   0, 23),
  (19, 's19-8p5t2r', 'FUTURE',   0, 15),
  (20, 's20-7k3m9w', 'FUTURE',   0,  7)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- 4. 경품이 풀리는 일정 : 2시간마다 1등 1개 · 2등 2개 (안 나간 건 이월)
--    2등은 일정상 12개지만 second_total(10)에서 멈춥니다 → 조기 소진
-- ---------------------------------------------------------------------
insert into treasure.prize_releases (release_at, tier, qty)
select v.release_at, v.tier, v.qty
from (values
  ('2026-11-27 12:00+09'::timestamptz, 'FIRST',  1),
  ('2026-11-27 12:00+09'::timestamptz, 'SECOND', 2),
  ('2026-11-27 14:00+09'::timestamptz, 'FIRST',  1),
  ('2026-11-27 14:00+09'::timestamptz, 'SECOND', 2),
  ('2026-11-27 16:00+09'::timestamptz, 'FIRST',  1),
  ('2026-11-27 16:00+09'::timestamptz, 'SECOND', 2),
  ('2026-11-28 12:00+09'::timestamptz, 'FIRST',  1),
  ('2026-11-28 12:00+09'::timestamptz, 'SECOND', 2),
  ('2026-11-28 14:00+09'::timestamptz, 'FIRST',  1),
  ('2026-11-28 14:00+09'::timestamptz, 'SECOND', 2),
  ('2026-11-28 16:00+09'::timestamptz, 'FIRST',  1),
  ('2026-11-28 16:00+09'::timestamptz, 'SECOND', 2),
  ('2026-11-27 12:00+09'::timestamptz, 'NOTE',  80)
) as v(release_at, tier, qty)
where not exists (select 1 from treasure.prize_releases);

-- ---------------------------------------------------------------------
-- 5. 내부 함수
-- ---------------------------------------------------------------------
create or replace function treasure.cfg(p_key text)
returns text language sql stable set search_path = treasure, public as $$
  select value from treasure.settings where key = p_key
$$;

create or replace function treasure.today()
returns date language sql stable as $$
  select (now() at time zone 'Asia/Seoul')::date
$$;

create or replace function treasure.is_test()
returns boolean language sql stable set search_path = treasure, public as $$
  select coalesce(treasure.cfg('test_mode') = 'true', false)
$$;

create or replace function treasure.is_open()
returns boolean language sql stable set search_path = treasure, public as $$
  select treasure.is_test() or (
    treasure.today()::text = any (string_to_array(treasure.cfg('event_days'), ','))
    and (now() at time zone 'Asia/Seoul')::time >= treasure.cfg('open_time')::time
    and (now() at time zone 'Asia/Seoul')::time <  treasure.cfg('close_time')::time
  )
$$;

-- 지금 당첨 가능한 수량 = (지금까지 풀린 수량, 총 수량 한도 내) - (이미 당첨된 수량)
create or replace function treasure.available(p_tier text)
returns int language sql stable set search_path = treasure, public as $$
  select greatest(
    least(
      (select coalesce(sum(qty), 0) from treasure.prize_releases
        where tier = p_tier and (release_at <= now() or treasure.is_test())),
      treasure.cfg(lower(p_tier) || '_total')::int
    ) - (select count(*) from treasure.scans where tier = p_tier),
    0
  )::int
$$;

-- 전체 남은 수량 = 총 수량 - 이미 당첨된 수량
create or replace function treasure.remaining(p_tier text)
returns int language sql stable set search_path = treasure, public as $$
  select greatest(
    treasure.cfg(lower(p_tier) || '_total')::int
      - (select count(*) from treasure.scans where tier = p_tier),
    0
  )::int
$$;

-- QR별 배율
--   n_i  : 오늘 i번 QR을 찍은 기기 수
--   d_ij : i번과 j번 사이 거리
--   s_i  = Σ_j (n_j − n_i)·d_ij ÷ ( 평균 n × Σ_j d_ij )   → −1 ~ +1 로 자름
--   m_i  = max_multiplier ^ s_i                            (참여 기기가 warmup 미만이면 1)
create or replace function treasure.multipliers(p_day date)
returns table (spot_id int, n int, s numeric, m numeric)
language sql stable set search_path = treasure, public as $$
  with c as (
    select sp.id, sp.x, sp.y, coalesce(k.cnt, 0)::numeric as cnt
    from treasure.spots sp
    left join (
      select sc.spot_id as sid, count(distinct sc.device_id) as cnt
      from treasure.scans sc
      where sc.event_day = p_day
      group by sc.spot_id
    ) k on k.sid = sp.id
  ),
  tot as (
    select
      (select avg(cnt) from c) as avg_n,
      (select count(distinct sc.device_id) from treasure.scans sc where sc.event_day = p_day) as devices
  ),
  pair as (
    select a.id, a.cnt,
      sum((b.cnt - a.cnt) * sqrt(power(a.x - b.x, 2) + power(a.y - b.y, 2))) as num,
      sum(sqrt(power(a.x - b.x, 2) + power(a.y - b.y, 2)))                  as den
    from c a
    join c b on b.id <> a.id
    group by a.id, a.cnt
  ),
  scored as (
    select pair.id, pair.cnt,
      case
        when tot.devices < treasure.cfg('warmup_devices')::int
          or tot.avg_n = 0 or pair.den = 0 then 0::numeric
        else greatest(-1::numeric, least(1::numeric, pair.num / (tot.avg_n * pair.den)))
      end as score
    from pair cross join tot
  )
  select scored.id,
         scored.cnt::int,
         round(scored.score, 4),
         round(power(treasure.cfg('max_multiplier')::numeric, scored.score), 4)
  from scored
$$;

create or replace function treasure.stamps(p_device_id uuid)
returns json language sql stable set search_path = treasure, public as $$
  select to_json(coalesce(array_agg(distinct spot_id order by spot_id), '{}'::int[]))
  from treasure.scans where device_id = p_device_id
$$;

create or replace function treasure.result_json(p treasure.scans, p_repeat boolean)
returns json language sql stable set search_path = treasure, public as $$
  select json_build_object(
    'status',     'ok',
    'repeat',     p_repeat,
    'spot',       (p).spot_id,
    'tier',       (p).tier,
    'code',       (p).code,
    'scanned_at', (p).created_at,
    'claimed_at', (p).claimed_at,
    'stamps',     treasure.stamps((p).device_id)
  )
$$;

-- ---------------------------------------------------------------------
-- 6. 공개 함수 ① QR 스캔 + 추첨
-- ---------------------------------------------------------------------
create or replace function public.scan_and_draw(p_slug text, p_device_id uuid)
returns json
language plpgsql security definer set search_path = treasure, public as $$
declare
  v_spot     treasure.spots%rowtype;
  v_last     treasure.scans%rowtype;
  v_row      treasure.scans%rowtype;
  v_day      date := treasure.today();
  v_m        numeric := 1;
  v_p1       numeric;
  v_p2       numeric;
  v_r        double precision;
  v_want     text;
  v_tier     text;
  v_code     text;
  v_headers  json;
  v_ip       text;
  v_ua       text;
begin
  if p_device_id is null then
    return json_build_object('status', 'invalid');
  end if;

  select * into v_spot from treasure.spots where slug = lower(trim(p_slug));
  if not found then
    return json_build_object('status', 'invalid');
  end if;

  if not treasure.is_open() then
    return json_build_object(
      'status', 'closed',
      'spot',   v_spot.id,
      'stamps', treasure.stamps(p_device_id)
    );
  end if;

  -- 동시에 여러 명이 찍어도 한 번에 한 명씩만 추첨 (재고 초과 당첨 방지)
  perform pg_advisory_xact_lock(20261127);

  -- 같은 QR을 연속으로 찍으면 추첨 없이 직전 결과를 그대로 돌려줌
  select * into v_last
  from treasure.scans
  where device_id = p_device_id and event_day = v_day
  order by created_at desc, id desc
  limit 1;

  if found and v_last.spot_id = v_spot.id then
    return treasure.result_json(v_last, true);
  end if;

  -- 배율과 확률
  select mm.m into v_m from treasure.multipliers(v_day) mm where mm.spot_id = v_spot.id;
  v_m  := coalesce(v_m, 1);
  v_p1 := treasure.cfg('base_first')::numeric  * v_m;
  v_p2 := treasure.cfg('base_second')::numeric * v_m;

  v_r := random();
  if v_r < v_p1 then
    v_want := 'FIRST';
  elsif v_r < v_p1 + v_p2 then
    v_want := 'SECOND';
  end if;

  -- 큰 경품은 기기당 하루 1개
  if v_want is not null and exists (
    select 1 from treasure.scans
    where device_id = p_device_id and event_day = v_day and tier in ('FIRST', 'SECOND')
  ) then
    v_want := null;
  end if;

  -- 재고 확인 : 1등이 없으면 2등으로, 2등도 없으면 참가로
  if v_want = 'FIRST' and treasure.available('FIRST') > 0 then
    v_tier := 'FIRST';
  elsif v_want is not null and treasure.available('SECOND') > 0 then
    v_tier := 'SECOND';
  end if;

  -- 참가상 노트 : 기기당 1권, 수량 한도 내
  if v_tier is null then
    if treasure.available('NOTE') > 0 and not exists (
      select 1 from treasure.scans where device_id = p_device_id and tier = 'NOTE'
    ) then
      v_tier := 'NOTE';
    else
      v_tier := 'STAMP';
    end if;
  end if;

  if v_tier <> 'STAMP' then
    v_code := 'SINPO-' || lpad(v_spot.id::text, 2, '0') || '-'
              || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
  end if;

  -- 참고용 접속 정보
  begin
    v_headers := current_setting('request.headers', true)::json;
    v_ip := split_part(coalesce(v_headers ->> 'x-forwarded-for', ''), ',', 1);
    v_ua := left(v_headers ->> 'user-agent', 300);
  exception when others then
    v_ip := null;
    v_ua := null;
  end;

  insert into treasure.scans (device_id, spot_id, event_day, ip, user_agent, tier, code, multiplier)
  values (p_device_id, v_spot.id, v_day, nullif(v_ip, ''), v_ua, v_tier, v_code, v_m)
  returning * into v_row;

  return treasure.result_json(v_row, false);
end;
$$;

-- ---------------------------------------------------------------------
-- 7. 공개 함수 ② 실시간 현황 (남은 수량 · 다음 오픈 · 확률 높은 골목)
-- ---------------------------------------------------------------------
create or replace function public.get_status()
returns json
language plpgsql stable security definer set search_path = treasure, public as $$
declare
  v_day   date := treasure.today();
  v_open  boolean := treasure.is_open();
  v_hot   json := '[]'::json;
  v_warm  boolean := false;
begin
  if v_open then
    select (count(distinct device_id) >= treasure.cfg('warmup_devices')::int) into v_warm
    from treasure.scans where event_day = v_day;

    select coalesce(json_agg(json_build_object('spot', t.spot_id, 'zone', t.zone, 'm', t.m)), '[]'::json)
    into v_hot
    from (
      select mm.spot_id, sp.zone, mm.m
      from treasure.multipliers(v_day) mm
      join treasure.spots sp on sp.id = mm.spot_id
      where mm.m > 1.02
      order by mm.m desc, mm.spot_id
      limit 3
    ) t;
  end if;

  return json_build_object(
    'open',      v_open,
    'warmed',    v_warm,
    'available', json_build_object(
                   'first',  case when v_open then treasure.available('FIRST')  else 0 end,
                   'second', case when v_open then treasure.available('SECOND') else 0 end),
    'remaining', json_build_object(
                   'first',  treasure.remaining('FIRST'),
                   'second', treasure.remaining('SECOND'),
                   'note',   treasure.remaining('NOTE')),
    'next_release_at', (
      select min(release_at) from treasure.prize_releases
      where tier in ('FIRST', 'SECOND') and release_at > now()
    ),
    'hot', v_hot
  );
end;
$$;

-- ---------------------------------------------------------------------
-- 8. 공개 함수 ③④ 부스 스태프 : 인증번호 조회 / 수령 처리
-- ---------------------------------------------------------------------
create or replace function treasure.pin_ok(p_pin text)
returns boolean language plpgsql set search_path = treasure, public as $$
declare
  v_pin text := treasure.cfg('staff_pin');
begin
  if v_pin is null or v_pin = '' or v_pin = 'CHANGE-ME' or p_pin is distinct from v_pin then
    perform pg_sleep(0.5);   -- 무작위 대입 지연
    return false;
  end if;
  return true;
end;
$$;

create or replace function treasure.staff_json(p treasure.scans)
returns json language sql stable set search_path = treasure, public as $$
  select json_build_object(
    'status',     'found',
    'code',       (p).code,
    'tier',       (p).tier,
    'spot',       (p).spot_id,
    'scanned_at', (p).created_at,
    'claimed_at', (p).claimed_at
  )
$$;

create or replace function public.staff_lookup(p_code text, p_pin text)
returns json
language plpgsql security definer set search_path = treasure, public as $$
declare
  v_row treasure.scans%rowtype;
begin
  if not treasure.pin_ok(p_pin) then
    return json_build_object('status', 'denied');
  end if;
  select * into v_row from treasure.scans where code = upper(trim(p_code));
  if not found then
    return json_build_object('status', 'notfound');
  end if;
  return treasure.staff_json(v_row);
end;
$$;

create or replace function public.staff_claim(p_code text, p_pin text)
returns json
language plpgsql security definer set search_path = treasure, public as $$
declare
  v_row treasure.scans%rowtype;
begin
  if not treasure.pin_ok(p_pin) then
    return json_build_object('status', 'denied');
  end if;
  update treasure.scans
     set claimed_at = coalesce(claimed_at, now())
   where code = upper(trim(p_code))
  returning * into v_row;
  if not found then
    return json_build_object('status', 'notfound');
  end if;
  return treasure.staff_json(v_row);
end;
$$;

-- ---------------------------------------------------------------------
-- 9. 권한 : 외부(anon)에서는 아래 4개 함수만 호출 가능
-- ---------------------------------------------------------------------
revoke all on schema treasure from public, anon, authenticated;
revoke all on all tables in schema treasure from public, anon, authenticated;
revoke all on all functions in schema treasure from public, anon, authenticated;

revoke all on function public.scan_and_draw(text, uuid) from public;
revoke all on function public.get_status()              from public;
revoke all on function public.staff_lookup(text, text)  from public;
revoke all on function public.staff_claim(text, text)   from public;

grant execute on function public.scan_and_draw(text, uuid) to anon, authenticated;
grant execute on function public.get_status()              to anon, authenticated;
grant execute on function public.staff_lookup(text, text)  to anon, authenticated;
grant execute on function public.staff_claim(text, text)   to anon, authenticated;

-- =====================================================================
-- 운영 메모 (필요할 때 SQL Editor 에서 한 줄씩 실행)
--
-- 스태프 PIN 설정 :
--   update treasure.settings set value = '원하는PIN' where key = 'staff_pin';
-- 테스트 모드 켜기 / 끄기 :
--   update treasure.settings set value = 'true'  where key = 'test_mode';
--   update treasure.settings set value = 'false' where key = 'test_mode';
-- 리허설 기록 전부 지우기 (행사 시작 전에 반드시 실행) :
--   truncate treasure.scans restart identity;
-- 확률 조정 :
--   update treasure.settings set value = '0.10' where key = 'base_first';
-- QR 좌표 수정 :
--   update treasure.spots set x = 12, y = 34 where id = 7;
-- 지금 QR별 인원과 배율 보기 :
--   select * from treasure.multipliers(treasure.today()) order by spot_id;
-- 한 사람(기기)의 동선 보기 :
--   select device_id, spot_id, created_at, tier from treasure.scans order by device_id, created_at;
-- =====================================================================
