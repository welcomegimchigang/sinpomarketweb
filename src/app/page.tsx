import React from 'react';
import type { Metadata } from 'next';
import { MarketHero } from '../components/sections/MarketHero';
import { MarketHighlights } from '../components/sections/MarketHighlights';
import { MarketCertifications } from '../components/sections/MarketCertifications';
import { EventBanner } from '../components/sections/EventBanner';
import { FoodSection } from '../components/sections/FoodSection';
import { LocationSection } from '../components/sections/LocationSection';
import { MarketFaq } from '../components/sections/MarketFaq';
import { QuizDemoModal } from '../components/ui/QuizDemoModal';
import { buildPageMetadata, DEFAULT_OG_IMAGE } from '../lib/seo';
import { MARKET_FAQ_ITEMS } from '../data/marketData';

export const metadata: Metadata = buildPageMetadata({
  title: '신포국제시장 (신포시장) | 2025 인천지역유산 & K-관광마켓 1·2기 연속 선정',
  description:
    '2025 인천지역유산 및 2023·2026 K-관광마켓 1·2기 연속 선정에 빛나는 신포국제시장(신포시장). 원조 닭강정, 공갈빵, 오색만두, 쫄면(광신제면) 등 대표 먹거리부터 신포역 4번 출구 도보 3분·답동성당 2시간 무료 주차 꿀팁까지 한눈에 만나보세요.',
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
      <MarketCertifications />
      <FoodSection />
      <EventBanner />
      <LocationSection />
      <MarketFaq />
      <QuizDemoModal />
    </>
  );
}
