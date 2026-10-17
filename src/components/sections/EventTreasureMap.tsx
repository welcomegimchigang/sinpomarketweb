import React from 'react';
import { Gift, MapPin, QrCode } from 'lucide-react';

interface Spot {
  id: number;
  name: string;
  x: number; // viewBox 400 기준
  y: number; // viewBox 480 기준
  align: 'left' | 'right';
}

const VB_W = 400;
const VB_H = 480;

const SPOTS: Spot[] = [
  { id: 1, name: '고객지원센터', x: 60, y: 420, align: 'right' },
  { id: 2, name: '푸성귀전', x: 150, y: 330, align: 'right' },
  { id: 3, name: '등대골목', x: 290, y: 290, align: 'left' },
  { id: 4, name: '한줄골목', x: 240, y: 170, align: 'left' },
  { id: 5, name: '신포옛길', x: 110, y: 110, align: 'right' },
];

const TREASURE = { x: 310, y: 52 };

const PATH_D =
  'M60 420 C 100 385, 120 350, 150 330 S 260 335, 290 290 S 305 205, 240 170 S 120 165, 110 110 S 240 70, 310 52';

export const EventTreasureMap: React.FC = () => {
  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      {/* glow */}
      <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-[#E5A93C]/20 via-transparent to-[#00ACC1]/20 blur-2xl" />

      <div
        role="img"
        aria-label="신포국제시장 골목 탐험 보물지도 일러스트 (고객지원센터, 푸성귀전, 등대골목, 한줄골목, 신포옛길 코스)"
        className="relative aspect-[400/480] w-full overflow-hidden rounded-2xl border border-[#E5A93C]/30 bg-[#f4e6c8] shadow-2xl shadow-black/40"
      >
        {/* parchment texture */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 15%, rgba(140,98,57,0.22), transparent 45%), radial-gradient(circle at 85% 85%, rgba(140,98,57,0.28), transparent 50%)',
          }}
        />
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {/* grid (alley blocks) */}
          <g stroke="#8C6239" strokeOpacity="0.14" strokeWidth="1">
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2={VB_H} />
            ))}
            {Array.from({ length: 11 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 48} x2={VB_W} y2={i * 48} />
            ))}
          </g>
          {/* path shadow */}
          <path d={PATH_D} fill="none" stroke="#8C6239" strokeOpacity="0.18" strokeWidth="9" strokeLinecap="round" />
          {/* animated dashed footprint path */}
          <path
            d={PATH_D}
            fill="none"
            stroke="#8C6239"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="2 12"
            className="animate-dash"
          />
        </svg>

        {/* spots */}
        {SPOTS.map((spot) => (
          <div
            key={spot.id}
            className="absolute"
            style={{ left: `${(spot.x / VB_W) * 100}%`, top: `${(spot.y / VB_H) * 100}%` }}
          >
            <span className="absolute -translate-x-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#8C6239] text-[11px] font-black text-white shadow-md">
              {spot.id}
            </span>
            <span
              className={`absolute -translate-y-1/2 whitespace-nowrap rounded bg-white/90 px-2 py-0.5 text-[10px] font-bold text-[#5a3d20] shadow-sm ${
                spot.align === 'right' ? 'left-5' : 'right-5'
              }`}
            >
              {spot.name}
            </span>
          </div>
        ))}

        {/* QR hints */}
        {[
          { x: 100, y: 372 },
          { x: 222, y: 318 },
          { x: 275, y: 225 },
          { x: 160, y: 150 },
        ].map((q, i) => (
          <span
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded bg-[#00ACC1] text-white shadow"
            style={{ left: `${(q.x / VB_W) * 100}%`, top: `${(q.y / VB_H) * 100}%` }}
          >
            <QrCode className="h-3 w-3" />
          </span>
        ))}

        {/* treasure */}
        <div
          className="absolute"
          style={{ left: `${(TREASURE.x / VB_W) * 100}%`, top: `${(TREASURE.y / VB_H) * 100}%` }}
        >
          <span className="absolute -translate-x-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E5A93C]/60" />
            <span className="relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-[#F3C15F] to-[#C88B25] text-white shadow-lg">
              <Gift className="h-5 w-5" />
            </span>
          </span>
        </div>

        {/* legend */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-lg bg-[#2a1b0e]/85 px-3 py-2 text-[10px] font-semibold text-amber-100 backdrop-blur-sm">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 text-[#E5A93C]" /> 발자국 로드
          </span>
          <span className="flex items-center gap-1.5">
            <QrCode className="h-3 w-3 text-[#00ACC1]" /> 숨은 QR
          </span>
          <span className="flex items-center gap-1.5">
            <Gift className="h-3 w-3 text-[#E5A93C]" /> 보물
          </span>
        </div>
      </div>
    </div>
  );
};
