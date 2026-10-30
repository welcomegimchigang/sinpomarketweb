import React from 'react';
import Link from 'next/link';
import { Footprints, QrCode, Gift, ArrowRight } from 'lucide-react';
import { FESTIVAL_INFO } from '../../data/marketData';

export const EventBanner: React.FC = () => {
  return (
    <section id="event-banner" className="py-14 sm:py-16 bg-[#fbfbfb] border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-amber-500 to-[#8C6239] rounded-lg p-6 sm:p-10 text-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <span className="inline-block bg-black/25 text-white px-3 py-0.5 rounded text-xs font-bold tracking-wider">
              NOW OPEN · {FESTIVAL_INFO.period}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              {FESTIVAL_INFO.name}
            </h2>
            <p className="text-sm sm:text-base text-white/90 max-w-xl">
              {FESTIVAL_INFO.subTitle}. 골목 곳곳에 숨은 QR코드 20개를 찾고
              올리브영 3만원권, 다이소 1만원권, 인천대학교 기념 노트 등 경품을 받아가세요.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-white/90 pt-1">
              <span className="flex items-center gap-1.5">
                <Footprints className="w-4 h-4" /> 발자국 따라 걷기
              </span>
              <span className="flex items-center gap-1.5">
                <QrCode className="w-4 h-4" /> QR 스캔
              </span>
              <span className="flex items-center gap-1.5">
                <Gift className="w-4 h-4" /> 경품 받기
              </span>
            </div>
          </div>
          {/* Poster preview thumbnail */}
          <Link
            href="/event"
            className="group relative hidden lg:block shrink-0 overflow-hidden rounded-lg border-2 border-white/30 shadow-md transition-transform hover:scale-105"
            title="신포국제시장 디지털 보물찾기 공식 포스터"
          >
            <img
              src="/newsinpoposter.png"
              alt="신포국제시장 디지털 보물찾기 공식 포스터"
              className="h-36 w-auto object-cover"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
              <span className="rounded bg-black/75 px-2 py-1 text-[10px] font-bold text-amber-200">
                포스터 보기
              </span>
            </div>
          </Link>

          <Link
            href="/event"
            className="shrink-0 px-7 py-3.5 bg-white text-gray-900 font-bold text-sm rounded hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-sm"
          >
            이벤트 자세히 보기
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
