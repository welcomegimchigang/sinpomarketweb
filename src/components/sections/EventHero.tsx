import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Camera, Footprints, Sparkles, ChevronDown } from 'lucide-react';
import { FESTIVAL_INFO } from '../../data/marketData';
import { EventCountdown } from './EventCountdown';
import { EventTreasureMap } from './EventTreasureMap';

export const EventHero: React.FC = () => {
  return (
    <section
      id="about"
      className="relative w-full overflow-hidden bg-[#1c130b] text-white scroll-mt-36"
    >
      {/* Background Poster Image */}
      <div
        role="img"
        aria-label="신포국제시장 디지털 보물찾기 행사 공식 포스터 배경"
        className="absolute inset-0 bg-cover bg-center filter brightness-[38%] contrast-[110%]"
        style={{
          backgroundImage: `url('/sinpoposter.png')`,
        }}
      />
      {/* Dark Vignette Overlay for Typography & Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1c130b]/92 via-[#1c130b]/75 to-[#1c130b]/85" />

      {/* ambient glow */}
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-[#8C6239]/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#00ACC1]/15 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        {/* Left: copy */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded bg-[#E5A93C] px-3 py-1 text-[11px] font-black tracking-widest text-[#2a1b0e]">
              <Footprints className="h-3.5 w-3.5" />
              SPECIAL EVENT 2026
            </span>
            <span className="inline-flex items-center gap-1.5 rounded border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] text-gray-300">
              <Camera className="h-3.5 w-3.5 text-[#00ACC1]" />
              앱 설치 없이 카메라로 즉시 참여
            </span>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold tracking-[0.25em] text-[#E5A93C]">
              신포국제시장
            </p>
            <h1 className="text-4xl font-black leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
              디지털{' '}
              <span className="bg-gradient-to-r from-[#F3C15F] via-[#E5A93C] to-[#C88B25] bg-clip-text text-transparent">
                보물찾기
              </span>
            </h1>
            <p className="text-lg font-bold text-amber-100/90 sm:text-xl">
              “{FESTIVAL_INFO.subTitle}”
            </p>
          </div>

          <p className="max-w-xl text-sm leading-relaxed text-gray-300 sm:text-base break-keep">
            바닥에 숨겨진 발자국을 따라 걷다 보면 어느새 시장 구석구석!
            <br className="hidden sm:inline" />{' '}
            골목 곳곳 {FESTIVAL_INFO.qrCount}개의 QR코드를 찾아 온누리상품권과 푸짐한 경품을 받아가세요.
          </p>

          <EventCountdown />

          <div className="grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
              <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-[#E5A93C]" />
              <div>
                <span className="block text-[11px] font-semibold text-gray-400">일시</span>
                <span className="block text-sm font-bold">{FESTIVAL_INFO.period}</span>
                <span className="block text-[11px] text-gray-400">매일 {FESTIVAL_INFO.hours}</span>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#E5A93C]" />
              <div>
                <span className="block text-[11px] font-semibold text-gray-400">장소</span>
                <span className="block text-sm font-bold">신포국제시장 전역</span>
                <span className="block text-[11px] text-gray-400">우현로49번길 11-5 일원</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href="#how-to-play"
              className="flex items-center gap-2 rounded bg-[#E5A93C] px-6 py-3 text-sm font-black text-[#2a1b0e] shadow-lg shadow-[#E5A93C]/20 transition-colors hover:bg-[#F3C15F]"
            >
              <Footprints className="h-4 w-4" />
              참여 방법 보기
            </a>
            <a
              href="#rewards"
              className="flex items-center gap-2 rounded border border-[#00ACC1] px-6 py-3 text-sm font-bold text-[#00ACC1] transition-colors hover:bg-[#00ACC1] hover:text-white"
            >
              <Sparkles className="h-4 w-4" />
              경품 &amp; 수령 안내
            </a>
            <Link
              href="/#location"
              className="rounded border border-white/20 px-5 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10"
            >
              오시는 길
            </Link>
          </div>
        </div>

        {/* Right: treasure map */}
        <EventTreasureMap />
      </div>

      <a
        href="#how-to-play"
        aria-label="아래로 스크롤"
        className="relative mx-auto hidden w-fit pb-6 text-[#E5A93C]/70 transition-colors hover:text-[#E5A93C] lg:block"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </a>
    </section>
  );
};
