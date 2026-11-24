-- =====================================================================
-- 실물 QR 번호에 맞춰 슬러그를 다시 연결합니다. (이미 운영 중인 DB용, 한 번만 실행)
-- Supabase 대시보드 > SQL Editor 에 전체를 붙여넣고 실행하세요.
--
--   실물 1~9번   = 슬러그 s12 ~ s20
--   실물 10~20번 = 슬러그 s01 ~ s11
--
-- 좌표(x, y)와 구역(zone)은 번호(id)에 그대로 남습니다.
-- 이미 쌓인 스캔 기록도 같은 규칙으로 번호를 옮깁니다.
--   (예: s12 주소로 찍혀 12번으로 기록된 스캔 → 1번)
-- 이미 발급된 인증번호(SINPO-12-XXXX)의 글자는 바뀌지 않습니다.
-- 두 번 실행해도 두 번째는 아무것도 하지 않습니다.
-- =====================================================================
do $$
begin
  if (select slug from treasure.spots where id = 1) is distinct from 's01-8f3k9m' then
    raise notice '이미 적용되었거나 예상한 상태가 아닙니다. 아무것도 바꾸지 않았습니다.';
    return;
  end if;

  -- slug 는 unique 라서 임시값을 거쳐 바꿉니다
  update treasure.spots set slug = 'tmp-' || slug;

  update treasure.spots sp
     set slug = v.slug
    from (values
      ( 1, 's12-2n6v8w'), ( 2, 's13-8q4k3m'), ( 3, 's14-5b9r2x'), ( 4, 's15-3c7p6n'),
      ( 5, 's16-9m4w8t'), ( 6, 's17-6f2k7q'), ( 7, 's18-4x9n3v'), ( 8, 's19-8p5t2r'),
      ( 9, 's20-7k3m9w'), (10, 's01-8f3k9m'), (11, 's02-4p7v2n'), (12, 's03-9x2q5w'),
      (13, 's04-6m8t3r'), (14, 's05-2k9b7y'), (15, 's06-7h4n8c'), (16, 's07-5v3p9j'),
      (17, 's08-3w6z4q'), (18, 's09-9d2r7f'), (19, 's10-4g8m5k'), (20, 's11-7t3x9p')
    ) as v(id, slug)
   where sp.id = v.id;

  update treasure.scans
     set spot_id = case when spot_id >= 12 then spot_id - 11 else spot_id + 9 end;

  raise notice '완료 : 슬러그 20개를 실물 번호에 맞췄습니다.';
end;
$$;

-- 확인용
select id, slug, zone, x, y from treasure.spots order by id;
