import React from 'react';
import type { Metadata } from 'next';
import { MarketHero } from '../components/sections/MarketHero';
import { MarketHighlights } from '../components/sections/MarketHighlights';
import { EventBanner } from '../components/sections/EventBanner';
import { FoodSection } from '../components/sections/FoodSection';
import { HistorySection } from '../components/sections/HistorySection';
import { LocationSection } from '../components/sections/LocationSection';
import { buildPageMetadata, DEFAULT_OG_IMAGE } from '../lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: '신포국제시장 | 1883년부터 이어온 인천의 맛과 정',
  description:
    '1883년 개항과 함께 시작된 140년 전통의 신포국제시장. 원조 닭강정, 쫄면, 화덕만두 등 대표 먹거리부터 정겨운 테마 골목 탐방, 대중교통 및 공영주차장 정보까지 신포시장의 모든 여행 정보를 한눈에 만나보세요.',
  path: '/',
  imageUrl: DEFAULT_OG_IMAGE,
  imageAlt: '신포국제시장 전경 및 대표 먹거리',
});

export default function Home() {
  return (
    <>
      <MarketHero />
      <MarketHighlights />
      <EventBanner />
      <FoodSection />
      <HistorySection />
      <LocationSection />
    </>
  );
}
