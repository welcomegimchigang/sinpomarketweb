import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { QR_SPOTS, PUBLIC_QR_SPOTS, findQrSpotByParam } from '../../../data/qrSpots';
import { QrSpotClient } from '../../../components/sections/QrSpotClient';
import { SITE_URL, EVENT_OG_IMAGE } from '../../../lib/seo';

interface QrPageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams(): { id: string }[] {
  return QR_SPOTS.map((spot) => ({
    id: spot.secretSlug,
  }));
}

export function generateMetadata({ params }: QrPageProps): Metadata {
  const spot = findQrSpotByParam(params.id);
  if (!spot) {
    return {
      title: '보물 QR 스팟 | 신포국제시장 디지털 보물찾기',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `[QR #${spot.spotCode}] ${spot.card.title} (${spot.guideHeaderCode}) | 신포국제시장 디지털 보물찾기`;
  const description = `${spot.card.mainCopy} — 신포국제시장 디지털 보물찾기 QR #${spot.spotCode} (${spot.chapterTitle}) 미션 및 즉석 리워드 당첨 확인 페이지입니다.`;
  const canonicalUrl = `${SITE_URL}/qr/${spot.secretSlug}/`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: [
        {
          url: EVENT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default function QrSpotPage({ params }: QrPageProps) {
  const spot = findQrSpotByParam(params.id);

  if (!spot) {
    notFound();
  }

  return <QrSpotClient spot={spot} allSpots={PUBLIC_QR_SPOTS} />;
}
