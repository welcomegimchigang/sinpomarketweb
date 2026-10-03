import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '신포국제시장 디지털 보물찾기 : 발자국 따라 떠나는 신포 골목 탐험',
  description: '2026. 11. 1(일) ~ 11. 2(월) 12:00~18:00 신포국제시장 전역(신포동 6-6 일원)! 바닥 발자국을 따라 숨겨진 40개 QR코드를 스마트폰 카메라로 스캔하고 온누리상품권 10만원과 푸짐한 경품을 받으세요.',
  keywords: [
    '신포국제시장',
    '신포국제시장 디지털 보물찾기',
    '신포 골목 탐험',
    '신포시장 축제',
    '온누리상품권',
    '신포 닭강정',
    '신포 화덕만두',
    '인천 중구 가볼만한곳',
  ],
  authors: [{ name: '신포국제시장 상인회' }],
  openGraph: {
    title: '신포국제시장 디지털 보물찾기 : 발자국 따라 떠나는 신포 골목 탐험',
    description: '스마트폰 카메라로 숨은 40개 QR코드를 찾아라! 실시간 동적 확률 UP! 100% 스토리텔링 & 푸짐한 온누리상품권 경품',
    type: 'website',
    locale: 'ko_KR',
    siteName: '신포국제시장 디지털 보물찾기',
  },
  twitter: {
    card: 'summary_large_image',
    title: '신포국제시장 디지털 보물찾기 (11.1~11.2)',
    description: '발자국 따라 떠나는 신포 골목 탐험! 40개 숨은 QR코드를 찾고 온누리상품권을 받으세요.',
  },
};

export const viewport: Viewport = {
  themeColor: '#8C6239',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen flex flex-col font-sans">{children}</body>
    </html>
  );
}
