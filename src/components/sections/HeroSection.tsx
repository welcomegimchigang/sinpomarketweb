import React from 'react';
import { FESTIVAL_INFO } from '../../data/marketData';
import { Footprints, QrCode, Sparkles, MapPin, Calendar, Camera } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section id="about" className="relative w-full overflow-hidden bg-stone-900 border-b border-gray-200">
      {/* Background Vintage Archive Market Image */}
      <div
        className="absolute inset-0 bg-cover bg-center filter grayscale-[25%] brightness-[60%] contrast-[115%]"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=80')`,
        }}
      />
      {/* Dark Vignette Overlay for Crisp Typography */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/70" />

      {/* Hero Content */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24 flex flex-col justify-center items-start text-white">
        {/* Top Tag Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="bg-[#8C6239] text-white text-[11px] sm:text-xs font-bold px-3 py-1 rounded tracking-wider flex items-center gap-1.5 shadow-sm">
            <Footprints className="w-3.5 h-3.5" />
            2026 신포 골목 특별 기획 행사
          </span>
          <span className="bg-white/20 backdrop-blur-sm text-gray-200 text-[11px] sm:text-xs font-medium px-2.5 py-1 rounded border border-white/20 flex items-center gap-1">
            <Camera className="w-3.5 h-3.5 text-amber-300" />
            앱 설치 없이 스마트폰 카메라로 즉시 참여
          </span>
        </div>

        {/* Main Event Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-3 drop-shadow-lg">
          신포국제시장 디지털 보물찾기
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-2xl md:text-3xl text-amber-300 font-bold tracking-normal mb-3 drop-shadow flex items-center gap-2">
          <span>“발자국 따라 떠나는 신포 골목 탐험”</span>
        </p>

        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg text-gray-200 font-normal leading-relaxed max-w-3xl drop-shadow mb-8">
          시장 바닥에 숨겨진 특별한 발자국을 따라 등대골목, 푸성귀전 등 숨은 명소로 떠나보세요! <br className="hidden sm:inline" />
          골목 곳곳에 숨겨진 40개의 QR코드를 스마트폰으로 스캔하면 온누리상품권과 푸짐한 경품이 쏟아집니다.
        </p>

        {/* Key Event Meta Box (4 Info Blocks) */}
        <div className="w-full max-w-4xl bg-black/60 backdrop-blur-md border border-white/20 rounded-lg p-4 sm:p-5 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="border-b sm:border-b-0 sm:border-r border-white/10 pb-2 sm:pb-0 sm:pr-3">
            <span className="text-amber-400 font-bold block mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> 일시
            </span>
            <span className="text-white font-bold text-sm block">
              {FESTIVAL_INFO.period}
            </span>
            <span className="text-gray-300 text-[11px] block mt-0.5">
              12:00 ~ 18:00 (2일간)
            </span>
          </div>

          <div className="border-b sm:border-b-0 lg:border-r border-white/10 pb-2 sm:pb-0 sm:pr-3">
            <span className="text-amber-400 font-bold block mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> 장소
            </span>
            <span className="text-white font-bold text-sm block">
              신포국제시장 전역
            </span>
            <span className="text-gray-300 text-[11px] block mt-0.5">
              신포동 6-6 일원
            </span>
          </div>

          <div className="border-b sm:border-b-0 sm:border-r border-white/10 pb-2 sm:pb-0 sm:pr-3">
            <span className="text-amber-400 font-bold block mb-1 flex items-center gap-1">
              <QrCode className="w-3.5 h-3.5" /> 미션 규모
            </span>
            <span className="text-white font-bold text-sm block">
              총 40개 숨은 QR코드
            </span>
            <span className="text-gray-300 text-[11px] block mt-0.5">
              실시간 동적 확률 UP!
            </span>
          </div>

          <div>
            <span className="text-amber-400 font-bold block mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 참여 대상
            </span>
            <span className="text-white font-bold text-sm block">
              방문객 누구나 참여
            </span>
            <span className="text-gray-300 text-[11px] block mt-0.5">
              별도 앱 설치 불필요
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="#how-to-play"
            className="px-6 py-3 bg-[#8C6239] hover:bg-[#724f2c] text-white text-sm font-bold rounded transition-colors shadow-sm flex items-center gap-2"
          >
            <Footprints className="w-4 h-4" />
            <span>3단계 참여방법 보기</span>
          </a>
          <a
            href="#rewards"
            className="px-6 py-3 bg-[#00acc1] hover:bg-[#0097a7] text-white text-sm font-bold rounded transition-colors shadow-sm flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>경품 혜택 & 발표 시간 확인</span>
          </a>
          <a
            href="#location"
            className="px-5 py-3 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-gray-200 text-sm font-medium rounded border border-white/30 transition-colors"
          >
            오시는 길 & 주차안내
          </a>
        </div>
      </div>
    </section>
  );
};
