import React from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight, Sparkles, Award, BookOpen } from 'lucide-react';
import { MARKET_INFO } from '../../data/marketData';

export const MarketHero: React.FC = () => {
  return (
    <section id="intro" className="relative w-full overflow-hidden bg-stone-900 border-b border-gray-200">
      {/* Background Market Image */}
      <div
        role="img"
        aria-label="신포국제시장 전통 상가 골목 전경 실사"
        className="absolute inset-0 bg-cover bg-center filter brightness-[55%] contrast-[110%]"
        style={{
          backgroundImage: `url('/sinpoimg.jpeg')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/60" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 md:py-32 flex flex-col items-start text-white">
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="bg-[#8C6239] text-white text-[11px] sm:text-xs font-bold px-3 py-1 rounded tracking-wider shadow-sm">
            SINPO INTERNATIONAL MARKET
          </span>
          <a
            href="#certifications"
            className="inline-flex items-center gap-1 bg-amber-400/20 hover:bg-amber-400/30 border border-amber-300/40 text-amber-200 text-[11px] sm:text-xs font-bold px-3 py-1 rounded transition-colors"
          >
            <Award className="w-3.5 h-3.5 text-amber-300" />
            2023·2026 K-관광마켓 2회 연속 선정 &amp; 2025 인천지역유산
          </a>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight mb-4 drop-shadow-lg">
          {MARKET_INFO.name} <span className="text-2xl sm:text-4xl md:text-5xl font-bold text-amber-200/90 block sm:inline font-sans">(신포시장)</span>
        </h1>

        <p className="text-lg sm:text-2xl md:text-3xl text-amber-300 font-bold mb-5 drop-shadow">
          “{MARKET_INFO.tagline}”
        </p>

        <div className="text-sm sm:text-base md:text-lg text-gray-200 leading-relaxed max-w-4xl mb-8 drop-shadow break-keep space-y-1.5">
          <p className="block">
            1883년 인천 개항기 어물전·푸성귀전에서 시작해 1929년 공설시장을 거쳐 100년 넘게 인천 시민과 함께해 온 대표 전통시장입니다.
          </p>
          <p className="block text-gray-300 text-xs sm:text-sm md:text-base">
            원조 닭강정, 공갈빵, 오색만두, 그리고 인천 중구 광신제면에서 탄생한 쫄면까지 오늘의 활기찬 신포를 만나보세요.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-gray-200 mb-8">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-amber-400" />
            {MARKET_INFO.address} (수인분당선 신포역 4번 출구 도보 약 3분)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/#food"
            className="px-6 py-3 bg-[#8C6239] hover:bg-[#724f2c] text-white text-sm font-bold rounded transition-colors shadow-sm flex items-center gap-2"
          >
            스토리마켓 둘러보기
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/history"
            className="px-6 py-3 bg-[#E5A93C] hover:bg-[#d4982b] text-[#2a1b0e] text-sm font-black rounded transition-colors shadow-sm flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            100년 역사관 보러가기
          </Link>
          <Link
            href="/event"
            className="px-6 py-3 bg-[#00acc1] hover:bg-[#0097a7] text-white text-sm font-bold rounded transition-colors shadow-sm flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            디지털 보물찾기 보러가기
          </Link>
          <Link
            href="/#location"
            className="px-5 py-3 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-gray-200 text-sm font-medium rounded border border-white/30 transition-colors"
          >
            오시는 길
          </Link>
        </div>
      </div>
    </section>
  );
};
