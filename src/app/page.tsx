import React from 'react';
import type { Metadata } from 'next';
import { MarketHero } from '../components/sections/MarketHero';
import { MarketHighlights } from '../components/sections/MarketHighlights';
import { EventBanner } from '../components/sections/EventBanner';
import { FoodSection } from '../components/sections/FoodSection';
import { HistorySection } from '../components/sections/HistorySection';
import { LocationSection } from '../components/sections/LocationSection';
import { MarketFaq } from '../components/sections/MarketFaq';
import { buildPageMetadata, DEFAULT_OG_IMAGE } from '../lib/seo';
import { MARKET_FAQ_ITEMS } from '../data/marketData';

export const metadata: Metadata = buildPageMetadata({
  title: '신포국제시장 (신포시장) | 1883년 전통 인천 대표 시장 먹거리·주차',
  description:
    '1883년 개항 140년 전통의 신포국제시장(신포시장). 원조 닭강정, 쫄면, 화덕만두 등 대표 먹거리 맛집부터 골목 탐방, 신포시장 대중교통 및 주차 꿀팁까지 알찬 여행 정보를 한눈에 만나보세요.',
  path: '/',
  imageUrl: DEFAULT_OG_IMAGE,
  imageAlt: '신포국제시장 (신포시장) 전경 및 대표 먹거리',
});

// 메인 홈 FAQ 구조화 데이터 (Schema.org FAQPage)
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: MARKET_FAQ_ITEMS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <MarketHero />
      <MarketHighlights />
      <EventBanner />
      <FoodSection />
      <HistorySection />
      <LocationSection />
      <MarketFaq />
    </>
  );
}
