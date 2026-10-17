import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { EventHero } from '../../components/sections/EventHero';
import { EventStats } from '../../components/sections/EventStats';
import { EventSteps } from '../../components/sections/EventSteps';
import { EventFeatures } from '../../components/sections/EventFeatures';
import { EventRewards } from '../../components/sections/EventRewards';
import { EventNews } from '../../components/sections/EventNews';
import { EventFaq } from '../../components/sections/EventFaq';
import { buildPageMetadata, EVENT_OG_IMAGE, SITE_URL } from '../../lib/seo';

const EVENT_TITLE = '신포국제시장 디지털 보물찾기 (2026.11.13~14) | 발자국 따라 골목 탐험';
const EVENT_DESCRIPTION =
  '2026년 11월 13일부터 14일까지 신포국제시장에서 열리는 디지털 보물찾기! 시장 바닥 발자국을 따라 숨은 40개 QR코드를 스마트폰으로 스캔하세요. 온누리상품권 10만원과 푸짐한 경품이 즉석에서 쏟아집니다.';

export const metadata: Metadata = buildPageMetadata({
  title: EVENT_TITLE,
  description: EVENT_DESCRIPTION,
  path: '/event/',
  imageUrl: EVENT_OG_IMAGE,
  imageAlt: '신포국제시장 디지털 보물찾기 행사 공식 포스터 및 안내',
});

// Event 구조화 데이터 (Schema.org Event)
const eventJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: '신포국제시장 디지털 보물찾기 : 발자국 따라 떠나는 신포 골목 탐험',
  description: EVENT_DESCRIPTION,
  image: [EVENT_OG_IMAGE],
  startDate: '2026-11-13T12:00:00+09:00',
  endDate: '2026-11-14T18:00:00+09:00',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: '신포국제시장 전역',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '우현로49번길 11-5',
      addressLocality: '인천광역시',
      addressRegion: '제물포구',
      postalCode: '22314',
      addressCountry: 'KR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 37.4705,
      longitude: 126.6268,
    },
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'KRW',
    availability: 'https://schema.org/InStock',
    url: `${SITE_URL}/event/`,
    validFrom: '2026-10-01T00:00:00+09:00',
  },
  organizer: {
    '@type': 'Organization',
    name: '신포터즈팀 (인천대학교 경제학과 지역사회동행 PBL)',
    url: 'https://instagram.com/sinpo.dream',
  },
};

export default function EventPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <EventHero />
      <EventStats />
      <EventSteps />
      <EventFeatures />
      <EventRewards />
      <EventNews />
      <EventFaq />

      {/* 오시는 길 CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#3a2713] to-[#1c130b] py-16 text-white">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#E5A93C]/15 blur-3xl" />
        <div className="relative mx-auto max-w-6xl space-y-4 px-4 text-center sm:px-6">
          <MapPin className="mx-auto h-9 w-9 text-[#E5A93C]" />
          <h2 className="text-2xl font-black sm:text-3xl">지금, 신포 골목으로 떠나볼까요?</h2>
          <p className="text-sm text-gray-300">
            신포역 3번 출구에서 도보 5분! 대중교통과 공영주차장 정보를 확인하세요.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/#location"
              className="flex items-center gap-2 rounded bg-[#E5A93C] px-6 py-3 text-sm font-black text-[#2a1b0e] transition-colors hover:bg-[#F3C15F]"
            >
              오시는 길 &amp; 주차 안내
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/"
              className="rounded border border-white/25 px-6 py-3 text-sm font-medium text-gray-200 transition-colors hover:bg-white/10"
            >
              신포시장 둘러보기
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
