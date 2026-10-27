import React from 'react';
import { FESTIVAL_INFO } from '../../data/marketData';

export const EventStats: React.FC = () => {
  const stats = [
    { value: String(FESTIVAL_INFO.qrCount), unit: '개', label: '골목에 숨은 20개 QR코드' },
    { value: '2', unit: '일', label: '11.13(금) ~ 11.14(토)' },
    { value: '즉석', unit: '추첨', label: '대기 없는 QR 실시간 당첨' },
    { value: '100', unit: '%', label: '꽝 없는 스토리텔링' },
  ];

  return (
    <section aria-label="행사 한눈에 보기" className="bg-[#E5A93C]">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-6 px-4 py-8 sm:px-6 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <div
            key={stat.label}
            className={`px-2 text-center text-[#2a1b0e] ${
              idx !== 0 ? 'lg:border-l lg:border-[#2a1b0e]/20' : ''
            } ${idx % 2 === 1 ? 'border-l border-[#2a1b0e]/20 lg:border-l' : ''}`}
          >
            <div className="flex items-end justify-center gap-0.5">
              <span className="font-mono text-4xl font-black leading-none sm:text-5xl">{stat.value}</span>
              <span className="pb-1 text-lg font-black">{stat.unit}</span>
            </div>
            <p className="mt-2 text-xs font-semibold text-[#2a1b0e]/80 sm:text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
