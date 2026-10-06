import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const metadata: Metadata = {
  title: '신포국제시장 : 1883년부터 이어온 인천의 맛과 정',
  description: '인천 개항과 함께 시작된 140년 전통의 신포국제시장. 닭강정, 쫄면, 화덕만두 등 원조 먹거리와 정겨운 골목, 오시는 길과 주차 정보를 한눈에 확인하세요.',
  keywords: [
    '신포국제시장',
    '신포시장',
    '신포 닭강정',
    '신포 화덕만두',
    '신포 쫄면',
    '인천 전통시장',
    '인천 제물포구 가볼만한곳',
    '신포 디지털 보물찾기',
  ],
  authors: [{ name: '신포국제시장 상인회' }],
  openGraph: {
    title: '신포국제시장 : 1883년부터 이어온 인천의 맛과 정',
    description: '140년 전통의 인천 대표 시장. 원조 먹거리와 골목 탐방, 2026 디지털 보물찾기까지.',
    type: 'website',
    locale: 'ko_KR',
    siteName: '신포국제시장',
  },
  twitter: {
    card: 'summary_large_image',
    title: '신포국제시장 : 1883년부터 이어온 인천의 맛과 정',
    description: '140년 전통의 인천 대표 시장, 신포국제시장을 소개합니다.',
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
      <body className="antialiased min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
