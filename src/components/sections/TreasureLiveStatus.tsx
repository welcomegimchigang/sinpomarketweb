"use client";

import React, { useEffect, useState } from 'react';
import { Trophy, Award, Gift, Clock, TrendingUp, MapPin } from 'lucide-react';
import type { PublicQrSpot } from '../../data/qrSpots';
import { getTreasureStatus, isTreasureConfigured, TreasureStatus } from '../../lib/treasure';

const REFRESH_MS = 30000;

const ZONE_NAME = {
  PAST: '과거의 신포 · 푸성귀전 골목',
  NOW: '오늘의 신포 · 메인시장',
  FUTURE: '미래의 신포 · 등대공원 골목',
} as const;

function formatKstTime(iso: string): string {
  return new Date(iso).toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * 실시간 경품 현황 + 지금 당첨 확률이 높은 골목
 * 서버(get_status)가 추첨과 동일한 계산으로 내려주는 값을 그대로 표시합니다.
 */
export const TreasureLiveStatus: React.FC<{ spots: PublicQrSpot[] }> = ({ spots }) => {
  const [status, setStatus] = useState<TreasureStatus | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!isTreasureConfigured) return;
    let alive = true;

    const load = async () => {
      try {
        const next = await getTreasureStatus();
        if (alive) {
          setStatus(next);
          setFailed(false);
        }
      } catch {
        if (alive) setFailed(true);
      }
    };

    load();
    const timer = setInterval(load, REFRESH_MS);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  const labelOf = (spotNumber: number) =>
    spots.find((s) => s.spotNumber === spotNumber)?.locationLabel ?? `QR #${spotNumber}`;

  const cells = status
    ? [
        {
          key: 'first',
          icon: Trophy,
          name: '1등 BBQ 반반세트',
          remaining: status.remaining.first,
          now: status.available.first,
        },
        {
          key: 'second',
          icon: Award,
          name: '2등 스타벅스 든든한 아침식사 세트',
          remaining: status.remaining.second,
          now: status.available.second,
        },
        {
          key: 'note',
          icon: Gift,
          name: '참가상 인천대 노트',
          remaining: status.remaining.note,
          now: null as number | null,
        },
      ]
    : [];

  return (
    <div className="rounded-2xl border border-[#00ACC1]/30 bg-gradient-to-br from-[#10272b] to-[#181818] p-5 text-white shadow-xl sm:p-7">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded bg-[#00ACC1] px-2.5 py-1 text-[11px] font-black tracking-wider text-white">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          실시간 보물 현황
        </span>
        {status && (
          <span className="text-[11px] text-gray-400">
            {status.open ? '지금 보물찾기 진행 중 · 30초마다 갱신' : '행사 시간(12:00~18:00)에 추첨이 열립니다'}
          </span>
        )}
      </div>

      {!status ? (
        <p className="py-4 text-center text-xs text-gray-400">
          {!isTreasureConfigured || failed
            ? '실시간 현황은 행사 기간(11.27 ~ 11.28, 12:00 ~ 18:00)에 표시됩니다.'
            : '실시간 현황을 불러오는 중입니다...'}
        </p>
      ) : (
        <div className="space-y-5">
          {/* 남은 경품 */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {cells.map((cell) => {
              const Icon = cell.icon;
              const soldOut = cell.remaining === 0;
              return (
                <div
                  key={cell.key}
                  className={`rounded-xl border p-3.5 ${
                    soldOut ? 'border-white/10 bg-white/5 opacity-70' : 'border-[#E5A93C]/30 bg-[#E5A93C]/10'
                  }`}
                >
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-amber-200">
                    <Icon className="h-3.5 w-3.5 text-[#E5A93C]" />
                    {cell.name}
                  </span>
                  {soldOut ? (
                    <span className="mt-1.5 block text-lg font-black text-gray-300">조기 소진</span>
                  ) : (
                    <span className="mt-1 block font-mono text-3xl font-black leading-none text-[#E5A93C] tabular-nums">
                      {cell.remaining}
                      <span className="ml-1 font-sans text-xs font-bold text-amber-100">개 남음</span>
                    </span>
                  )}
                  {!soldOut && cell.now !== null && status.open && (
                    <span className="mt-1.5 block text-[11px] text-gray-300">
                      {cell.now > 0 ? `지금 ${cell.now}개 당첨 가능` : '이번 시간대 물량 소진'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {status.next_release_at && (
            <p className="flex items-center gap-1.5 text-xs font-semibold text-[#4dd0e1]">
              <Clock className="h-3.5 w-3.5" />
              다음 경품 오픈: {formatKstTime(status.next_release_at)}
            </p>
          )}

          {/* 지금 확률 높은 골목 */}
          {status.open && (
            <div className="border-t border-white/10 pt-4">
              <span className="mb-2.5 flex items-center gap-1.5 text-xs font-black text-white">
                <TrendingUp className="h-4 w-4 text-[#E5A93C]" />
                지금 당첨 확률이 높은 골목
              </span>
              {status.hot.length === 0 ? (
                <p className="text-xs text-gray-400">
                  {status.warmed
                    ? '지금은 골목별 당첨 확률이 비슷합니다.'
                    : '아직은 모든 골목의 당첨 확률이 같습니다. 참여가 늘면 한산한 골목의 확률이 올라갑니다.'}
                </p>
              ) : (
                <ul className="space-y-2">
                  {status.hot.map((hot) => (
                    <li
                      key={hot.spot}
                      className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                    >
                      <span className="flex min-w-0 items-start gap-2">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#E5A93C]" />
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-bold text-white">
                            {labelOf(hot.spot)}
                          </span>
                          <span className="block text-[11px] text-gray-400">{ZONE_NAME[hot.zone]}</span>
                        </span>
                      </span>
                      <span className="shrink-0 rounded bg-[#E5A93C] px-2 py-0.5 font-mono text-[11px] font-black text-[#2a1b0e]">
                        확률 ×{hot.m.toFixed(1)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
