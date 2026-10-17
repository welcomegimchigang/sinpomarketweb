import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  GOOGLE_SITE_VERIFICATION,
  NAVER_SITE_VERIFICATION,
  GA_MEASUREMENT_ID,
} from '../lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: '신포국제시장 | 1883년부터 이어온 인천 대표 전통시장',
    template: `%s | ${SITE_NAME}`,
  },
  description:
    '1883년 개항과 함께 시작된 140년 전통의 신포국제시장. 원조 닭강정, 쫄면, 화덕만두 등 대표 먹거리부터 정겨운 테마 골목 탐방, 대중교통 및 공영주차장 정보까지 신포시장의 모든 여행 정보를 한눈에 만나보세요.',
  keywords: [
    '신포국제시장',
    '신포시장',
    '신포 닭강정',
    '신포 화덕만두',
    '신포 쫄면',
    '인천 전통시장',
    '인천 가볼만한곳',
    '신포국제시장 디지털 보물찾기',
    '신포시장 맛집',
  ],
  authors: [{ name: '신포국제시장 프로젝트팀' }],
  creator: '신포국제시장 프로젝트팀',
  publisher: '신포국제시장',
  formatDetection: {
    telephone: false,
  },
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  openGraph: {
    title: '신포국제시장 | 1883년부터 이어온 인천 대표 전통시장',
    description:
      '1883년 개항과 함께 시작된 140년 전통의 신포국제시장. 원조 닭강정, 쫄면, 화덕만두 등 대표 먹거리부터 정겨운 테마 골목 탐방, 대중교통 및 공영주차장 정보까지 신포시장의 모든 여행 정보를 한눈에 만나보세요.',
    url: `${SITE_URL}/`,
    siteName: SITE_NAME,
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: '신포국제시장 - 1883년부터 이어온 인천의 맛과 정',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '신포국제시장 | 1883년부터 이어온 인천 대표 전통시장',
    description:
      '1883년 개항과 함께 시작된 140년 전통의 신포국제시장. 닭강정, 쫄면, 화덕만두 등 대표 먹거리와 정겨운 골목 탐방 안내.',
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  verification: {
    google: GOOGLE_SITE_VERIFICATION || 'google-site-verification-code',
    other: {
      'naver-site-verification': NAVER_SITE_VERIFICATION || 'naver-site-verification-code',
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#8C6239',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// 사이트 전체 기본 구조화 데이터 (WebSite + ShoppingCenter)
const siteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: '1883년부터 이어온 140년 전통의 인천 대표 전통시장, 신포국제시장',
      inLanguage: 'ko-KR',
    },
    {
      '@type': 'ShoppingCenter',
      '@id': `${SITE_URL}/#market`,
      name: SITE_NAME,
      alternateName: 'Sinpo International Market',
      url: SITE_URL,
      image: DEFAULT_OG_IMAGE,
      description:
        '1883년 인천 개항과 함께 태동한 140여 년 역사의 대표 전통시장. 닭강정, 쫄면, 화덕만두 등 원조 먹거리와 정겨운 골목길.',
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
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          opens: '10:00',
          closes: '20:00',
        },
      ],
      sameAs: ['https://instagram.com/sinpo.dream'],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-sans">
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
            >
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
