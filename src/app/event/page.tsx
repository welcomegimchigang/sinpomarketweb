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

export const metadata: Metadata = {
  title: '신포국제시장 디지털 보물찾기 : 발자국 따라 떠나는 신포 골목 탐험',
  description:
    '2026. 11. 13(금) ~ 11. 14(토) 12:00~18:00 신포국제시장 전역! 바닥 발자국을 따라 숨겨진 40개 QR코드를 스마트폰 카메라로 스캔하고 온누리상품권과 푸짐한 경품을 받으세요.',
  openGraph: {
    title: '신포국제시장 디지털 보물찾기 : 발자국 따라 떠나는 신포 골목 탐험',
    description:
      '스마트폰 카메라로 숨은 40개 QR코드를 찾아라! 실시간 동적 확률 UP! 100% 스토리텔링 & 푸짐한 온누리상품권 경품',
    type: 'website',
    locale: 'ko_KR',
    siteName: '신포국제시장',
  },
  twitter: {
    card: 'summary_large_image',
    title: '신포국제시장 디지털 보물찾기 (11.13~11.14)',
    description: '발자국 따라 떠나는 신포 골목 탐험! 40개 숨은 QR코드를 찾고 온누리상품권을 받으세요.',
  },
};

export default function EventPage() {
  return (
    <>
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
