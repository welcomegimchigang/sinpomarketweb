import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Sparkles, ArrowRight, Utensils, Footprints } from 'lucide-react';
import { HistorySection } from '../../components/sections/HistorySection';
import { ThemeCardsSection } from '../../components/sections/ThemeCardsSection';
import { buildPageMetadata, DEFAULT_OG_IMAGE } from '../../lib/seo';

const HISTORY_TITLE = '신포국제시장 100년 역사 이야기 | 1883 푸성귀전부터 工자형 3대 테마까지';
const HISTORY_DESCRIPTION =
  '1883년 개항기 어물전·푸성귀전에서 1929년 제1공설시장 개장, 1971년 신포상가 신축, 2010년 신포국제시장 도약까지! 동화책을 넘기듯 만나보는 신포 100년의 역사와 工자형 골목 20개 스토리 & 퀴즈 아카이브입니다.';

export const metadata: Metadata = buildPageMetadata({
  title: HISTORY_TITLE,
  description: HISTORY_DESCRIPTION,
  path: '/history/',
  imageUrl: DEFAULT_OG_IMAGE,
  imageAlt: '신포국제시장 100년 역사 및 푸성귀전 스토리 아카이브',
});

export default function HistoryPage() {
  return (
    <>
      {/* History Story Hero */}
      <section
        id="overview"
        className="relative overflow-hidden bg-gradient-to-br from-[#2a1b0e] via-[#3a2614] to-[#1c130b] text-white py-16 sm:py-24 border-b border-[#8C6239]/30 scroll-mt-36"
      >
        <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-[#E5A93C]/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#8C6239]/25 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E5A93C]/20 border border-[#E5A93C]/40 px-3.5 py-1 text-xs font-bold tracking-widest text-amber-200">
            <BookOpen className="w-3.5 h-3.5 text-[#E5A93C]" />
            SINPO STORYBOOK · SINCE 1883
          </span>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
            한 권의 책처럼 펼쳐지는
            <br />
            <span className="text-[#E5A93C]">신포국제시장 100년 이야기</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed break-keep">
            1883년 개항기 나물과 채소를 펼쳐놓고 팔던 작은 장터 ‘푸성귀전’에서 시작해,
            1929년 제1공설시장 개장과 오늘날의 신포국제시장에 이르기까지 골목마다 켜켜이 쌓인 이야기를 만나보세요.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="#history"
              className="px-6 py-3 bg-[#E5A93C] hover:bg-[#F3C15F] text-[#2a1b0e] text-sm font-black rounded transition-colors shadow-sm"
            >
              100년 연혁 타임라인 보기
            </a>
            <a
              href="#theme-cards"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/25 text-white text-sm font-bold rounded transition-colors"
            >
              工자형 3대 테마 20개 테마 카드 읽기
            </a>
          </div>
        </div>
      </section>

      {/* 100년 연혁 & 시대별 스토리 */}
      <HistorySection />

      {/* 工자형 3대 테마 (과거·현재·미래) 20개 테마 카드 아카이브 */}
      <ThemeCardsSection />

      {/* 하단 브릿지 CTA: 현재 홍보 홈(/) & 디지털 보물찾기(/event) 이동 */}
      <section className="bg-[#fff8ec] py-16 border-t border-[#8C6239]/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8C6239] block">
            EXPLORE TODAY&apos;S SINPO
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2a1b0e]">
            이야기로 만난 신포, 이제 직접 맛보고 탐험해 볼까요?
          </h2>
          <p className="text-xs sm:text-sm text-[#6b5640] max-w-xl mx-auto">
            현재 신포국제시장의 4대 대표 먹거리(닭강정·공갈빵·오색만두·원조 쫄면)와
            2026 디지털 보물찾기 이벤트를 확인해 보세요.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/#food"
              className="flex items-center gap-2 rounded bg-[#8C6239] px-6 py-3 text-sm font-bold text-white hover:bg-[#724f2c] transition-colors"
            >
              <Utensils className="w-4 h-4" />
              오늘의 신포 먹거리·주차 안내
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/event"
              className="flex items-center gap-2 rounded bg-[#00acc1] px-6 py-3 text-sm font-bold text-white hover:bg-[#0097a7] transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              디지털 보물찾기 이벤트 참여하기
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
