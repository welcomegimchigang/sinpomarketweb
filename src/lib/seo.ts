import type { Metadata } from 'next';

/**
 * 신포국제시장 웹사이트 SEO 기본 설정
 * 도메인: https://sinpomarket.co.kr (www 제외)
 */
export const SITE_URL = 'https://sinpomarket.co.kr';
export const SITE_NAME = '신포국제시장';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
export const EVENT_OG_IMAGE = `${SITE_URL}/og-event.png`;

// [검색엔진 소유권 확인 코드 및 애널리틱스 ID]
export const GOOGLE_SITE_VERIFICATION = ''; // 구글 서치 콘솔 인증 코드 (예: 'abc123xyz...')
export const NAVER_SITE_VERIFICATION = '8652f10ba07f300b5bc044f8e1a75520'; // 네이버 서치어드바이저 인증 코드
export const GA_MEASUREMENT_ID = 'G-XJ2RH8ENVC'; // 구글 애널리틱스 4 (GA4) 측정 ID

interface PageSeoParams {
  title: string;
  description: string;
  path: string; // 예: '/' 또는 '/event/'
  imageUrl?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
}

/**
 * 각 페이지별 Next.js 메타데이터 생성기
 * - canonical URL 지정
 * - 네이버 & 구글 표준 Open Graph 및 Twitter 카드 완비
 */
export function buildPageMetadata({
  title,
  description,
  path,
  imageUrl = DEFAULT_OG_IMAGE,
  imageAlt = '신포국제시장 대표 이미지',
  type = 'website',
}: PageSeoParams): Metadata {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const canonicalUrl = `${SITE_URL}${cleanPath}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: 'ko_KR',
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}
