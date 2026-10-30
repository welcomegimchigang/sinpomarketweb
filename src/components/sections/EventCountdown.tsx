"use client";

import React, { useEffect, useState } from 'react';

// 행사 시작(2026.11.27 12:00 KST) / 종료(2026.11.28 18:00 KST)
const EVENT_START = new Date('2026-11-27T12:00:00+09:00').getTime();
const EVENT_END = new Date('2026-11-28T18:00:00+09:00').getTime();

type Phase = 'before' | 'live' | 'after';

const pad = (n: number) => String(n).padStart(2, '0');

export const EventCountdown: React.FC = () => {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  let phase: Phase = 'before';
  let diff = 0;
  if (now !== null) {
    if (now < EVENT_START) {
      phase = 'before';
      diff = EVENT_START - now;
    } else if (now <= EVENT_END) {
      phase = 'live';
    } else {
      phase = 'after';
    }
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  if (phase === 'live') {
    return (
      <div className="inline-flex items-center gap-2.5 rounded-lg border border-[#E5A93C]/40 bg-[#E5A93C]/10 px-4 py-3 text-[#E5A93C]">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E5A93C] opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#E5A93C]" />
        </span>
        <span className="text-sm font-bold">지금 보물찾기 진행 중! (매일 12:00 ~ 18:00)</span>
      </div>
    );
  }

  if (phase === 'after') {
    return (
      <div className="inline-block rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold text-gray-300">
        2026 디지털 보물찾기가 종료되었습니다. 참여해 주셔서 감사합니다.
      </div>
    );
  }

  const cells = [
    { label: 'DAYS', value: now === null ? '--' : String(days) },
    { label: 'HOURS', value: now === null ? '--' : pad(hours) },
    { label: 'MIN', value: now === null ? '--' : pad(minutes) },
    { label: 'SEC', value: now === null ? '--' : pad(seconds) },
  ];

  return (
    <div>
      <p className="mb-2 text-[11px] font-bold tracking-[0.2em] text-[#E5A93C]">
        D-DAY COUNTDOWN · 11.27(금) 12:00 OPEN
      </p>
      <div className="flex items-stretch gap-2 sm:gap-3">
        {cells.map((cell, idx) => (
          <React.Fragment key={cell.label}>
            <div className="min-w-[62px] sm:min-w-[74px] rounded-lg border border-white/10 bg-white/5 px-2 py-2.5 text-center backdrop-blur-sm">
              <span className="block font-mono text-2xl sm:text-3xl font-black leading-none text-white tabular-nums">
                {cell.value}
              </span>
              <span className="mt-1.5 block text-[9px] font-semibold tracking-widest text-gray-400">
                {cell.label}
              </span>
            </div>
            {idx < cells.length - 1 && (
              <span className="self-center font-black text-[#E5A93C]/60">:</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
