"use client";

import React, { useState } from 'react';
import { TrendingUp, Users } from 'lucide-react';

interface AlleySim {
  id: string;
  name: string;
  visitors: number; // 0 ~ 100 혼잡도(예시)
}

const ALLEYS: AlleySim[] = [
  { id: 'main', name: '메인 통로', visitors: 92 },
  { id: 'lighthouse', name: '등대골목', visitors: 58 },
  { id: 'pusunggwi', name: '푸성귀전', visitors: 34 },
  { id: 'hanjul', name: '한줄골목', visitors: 14 },
];

const BASE_ODDS = 3; // % (시뮬레이션용 가정치)
const calcOdds = (visitors: number) => BASE_ODDS + (100 - visitors) * 0.12;

export const OddsSimulator: React.FC = () => {
  const [selected, setSelected] = useState<string>('hanjul');
  const current = ALLEYS.find((a) => a.id === selected) ?? ALLEYS[0];
  const odds = calcOdds(current.visitors);
  const gaugeWidth = Math.min(100, (odds / 16) * 100);

  return (
    <div className="rounded-2xl border border-[#00ACC1]/30 bg-gradient-to-br from-[#10272b] to-[#181818] p-6 shadow-xl sm:p-8">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded bg-[#00ACC1] px-2.5 py-1 text-[11px] font-black tracking-wider text-white">
          <TrendingUp className="h-3.5 w-3.5" />
          동적 확률 체험
        </span>
        <span className="text-xs text-gray-400">골목을 눌러 당첨 확률이 어떻게 달라지는지 확인해 보세요.</span>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_1.1fr] md:items-center">
        {/* alley picker */}
        <div className="grid grid-cols-2 gap-2.5">
          {ALLEYS.map((alley) => {
            const active = alley.id === selected;
            return (
              <button
                key={alley.id}
                type="button"
                onClick={() => setSelected(alley.id)}
                className={`rounded-lg border px-3 py-3 text-left transition-all ${
                  active
                    ? 'border-[#E5A93C] bg-[#E5A93C]/15 text-white'
                    : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/30'
                }`}
              >
                <span className="block text-sm font-bold">{alley.name}</span>
                <span className="mt-1 flex items-center gap-1 text-[11px] text-gray-400">
                  <Users className="h-3 w-3" />
                  방문 {alley.visitors >= 70 ? '많음' : alley.visitors >= 40 ? '보통' : '적음'}
                </span>
              </button>
            );
          })}
        </div>

        {/* gauge */}
        <div className="space-y-5">
          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs text-gray-400">
              <span>방문객 혼잡도</span>
              <span className="font-mono font-bold text-gray-200">{current.visitors}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gray-400 to-gray-200 transition-all duration-500"
                style={{ width: `${current.visitors}%` }}
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-end justify-between">
              <span className="text-xs text-gray-400">QR 당첨 확률 (예시)</span>
              <span className="font-mono text-4xl font-black leading-none text-[#E5A93C] tabular-nums">
                {odds.toFixed(1)}
                <span className="text-xl">%</span>
              </span>
            </div>
            <div className="h-3.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#C88B25] via-[#E5A93C] to-[#F3C15F] transition-all duration-500"
                style={{ width: `${gaugeWidth}%` }}
              />
            </div>
          </div>

          <p className="text-[11px] leading-relaxed text-gray-500">
            * 이해를 돕기 위한 가상의 시뮬레이션입니다. 실제 당첨 확률과 수치는 행사 중 골목별 방문객 데이터에 따라 실시간으로 자동 갱신됩니다.
          </p>
        </div>
      </div>
    </div>
  );
};
