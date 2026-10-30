"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Camera,
  Footprints,
  Sparkles,
  ChevronDown,
  FileImage,
  Map as MapIcon,
  ZoomIn,
  X,
  Download,
} from 'lucide-react';
import { FESTIVAL_INFO } from '../../data/marketData';
import { EventCountdown } from './EventCountdown';
import { EventTreasureMap } from './EventTreasureMap';

export const EventHero: React.FC = () => {
  const [viewMode, setViewMode] = useState<'poster' | 'map'>('poster');
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);

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
            골목 곳곳 {FESTIVAL_INFO.qrCount}개의 QR코드를 찾아 올리브영 3만원권, 다이소 1만원권 등 푸짐한 경품을 받아가세요.
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
            <button
              type="button"
              onClick={() => {
                setViewMode('poster');
                setIsPosterModalOpen(true);
              }}
              className="flex items-center gap-2 rounded bg-[#E5A93C] px-5 py-3 text-sm font-black text-[#2a1b0e] shadow-lg shadow-[#E5A93C]/20 transition-colors hover:bg-[#F3C15F]"
            >
              <FileImage className="h-4 w-4" />
              공식 포스터 크게 보기
            </button>
            <a
              href="#how-to-play"
              className="flex items-center gap-2 rounded border border-[#E5A93C]/60 bg-[#E5A93C]/10 px-5 py-3 text-sm font-bold text-amber-200 transition-colors hover:bg-[#E5A93C]/20"
            >
              <Footprints className="h-4 w-4 text-[#E5A93C]" />
              참여 방법 보기
            </a>
            <a
              href="#rewards"
              className="flex items-center gap-2 rounded border border-[#00ACC1] px-5 py-3 text-sm font-bold text-[#00ACC1] transition-colors hover:bg-[#00ACC1] hover:text-white"
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

        {/* Right: Interactive Switcher between Official Poster and Treasure Map */}
        <div className="flex flex-col items-center">
          {/* View mode toggle pills */}
          <div className="mb-4 inline-flex items-center rounded-full border border-white/15 bg-black/40 p-1 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setViewMode('poster')}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-black transition-all ${
                viewMode === 'poster'
                  ? 'bg-[#E5A93C] text-[#2a1b0e] shadow-md'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <FileImage className="h-3.5 w-3.5" />
              공식 행사 포스터
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-black transition-all ${
                viewMode === 'map'
                  ? 'bg-[#E5A93C] text-[#2a1b0e] shadow-md'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <MapIcon className="h-3.5 w-3.5" />
              골목 보물지도
            </button>
          </div>

          {/* Poster or Map Card */}
          {viewMode === 'poster' ? (
            <div className="relative mx-auto w-full max-w-[400px]">
              {/* Outer gold glow */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#E5A93C]/30 via-[#8C6239]/20 to-[#00ACC1]/25 blur-xl" />

              <div
                onClick={() => setIsPosterModalOpen(true)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-[#E5A93C]/60 bg-[#1c130b] shadow-2xl transition-all duration-300 hover:scale-[1.01] hover:border-[#E5A93C]"
              >
                <img
                  src="/sinpoposter.png"
                  alt="신포국제시장 디지털 보물찾기 행사 공식 포스터"
                  className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Hover overlay hint */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 p-4 text-center opacity-0 backdrop-blur-xs transition-opacity duration-200 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#E5A93C] px-4 py-2 text-xs font-black text-[#2a1b0e] shadow-xl">
                    <ZoomIn className="h-4 w-4" />
                    포스터 크게 보기
                  </span>
                  <span className="mt-2 text-[11px] text-gray-200">
                    클릭하면 고해상도 원본으로 확인할 수 있습니다
                  </span>
                </div>

                {/* Bottom badge */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-lg bg-black/70 px-3 py-1.5 text-[11px] font-bold text-amber-200 backdrop-blur-sm">
                  <span>공식 행사 포스터 (2026.11.27~28)</span>
                  <span className="flex items-center gap-1 text-[10px] text-gray-300">
                    <ZoomIn className="h-3 w-3 text-[#E5A93C]" />
                    클릭 확대
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <EventTreasureMap />
          )}
        </div>
      </div>

      {/* Poster Lightbox / Modal */}
      {isPosterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
            onClick={() => setIsPosterModalOpen(false)}
          />

          <div className="relative z-10 flex max-h-[92vh] max-w-2xl flex-col overflow-hidden rounded-2xl bg-[#1c130b] border border-[#E5A93C]/40 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-black/60 px-5 py-3 text-white">
              <div className="flex items-center gap-2">
                <span className="rounded bg-[#E5A93C] px-2 py-0.5 text-[10px] font-black text-[#2a1b0e]">
                  OFFICIAL POSTER
                </span>
                <span className="text-xs font-bold text-amber-100 sm:text-sm">
                  신포국제시장 디지털 보물찾기 공식 포스터
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/sinpoposter.png"
                  download="신포국제시장_디지털보물찾기_포스터.png"
                  className="rounded p-1.5 text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                  title="포스터 원본 다운로드"
                >
                  <Download className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setIsPosterModalOpen(false)}
                  className="rounded p-1.5 text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="닫기"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Scrollable Image */}
            <div className="overflow-y-auto p-4 flex items-center justify-center bg-black/40">
              <img
                src="/sinpoposter.png"
                alt="신포국제시장 디지털 보물찾기 행사 공식 포스터 고해상도 원본"
                className="max-h-[78vh] w-auto rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      )}

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
