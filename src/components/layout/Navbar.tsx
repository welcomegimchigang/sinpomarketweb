"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Menu, X } from 'lucide-react';

const MAIN_LINKS = [
  { href: '/', label: '현재 시장안내', mobileLabel: '현재 시장안내 (홈)' },
  { href: '/#certifications', label: '공식인증·유산', mobileLabel: '인천지역유산 & K-관광마켓' },
  { href: '/#food', label: '스토리마켓', mobileLabel: '스토리마켓 (4대 먹거리)' },
  { href: '/#location', label: '오시는길·주차', mobileLabel: '오시는 길 & 주차안내' },
  { href: '/#faq', label: '이용FAQ', mobileLabel: '시장 이용 FAQ' },
];

const HISTORY_LINK = {
  href: '/history',
  label: '100년 역사관',
  mobileLabel: '신포 100년 역사관 (과거·테마카드)',
};

const EVENT_LINK = {
  href: '/event',
  label: '디지털 보물찾기',
  mobileLabel: '디지털 보물찾기 (이벤트)',
};

const HISTORY_SUB_LINKS = [
  { href: '#overview', label: '역사관 소개' },
  { href: '#history', label: '공설시장 100년 타임라인' },
  { href: '#theme-cards', label: '工자형 3대 테마 카드 (20선)' },
];

const EVENT_SUB_LINKS = [
  { href: '#about', label: '행사개요' },
  { href: '#how-to-play', label: '참여방법' },
  { href: '#features', label: '핵심포인트' },
  { href: '#rewards', label: '경품안내' },
  { href: '#news', label: '공지사항' },
  { href: '#faq', label: 'FAQ' },
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const rawPath = usePathname() || '/';
  const pathname = rawPath.length > 1 ? rawPath.replace(/\/$/, '') : rawPath;
  const isEventPage = pathname === '/event';
  const isHistoryPage = pathname === '/history';
  const isHomePage = pathname === '/';

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top Logo Center area */}
        <div className="pt-4 pb-2.5 flex flex-col items-center justify-center border-b border-gray-100">
          <Link href="/" className="flex items-center gap-3 group" onClick={closeMenu}>
            {/* Traditional Seal / Stamp Icon */}
            <div className="w-10 h-10 rounded-lg bg-[#8C6239] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <span className="font-serif font-black text-xl tracking-tighter leading-none select-none">
                新浦
              </span>
            </div>
            {/* Title */}
            <span className="text-2xl sm:text-3xl font-black text-[#222222] tracking-normal font-sans">
              신 포 국 제 시 장
            </span>
          </Link>
          <span className="text-[11px] text-gray-500 font-semibold tracking-wider mt-1 text-center">
            {isEventPage
              ? '2026 신포국제시장 디지털 보물찾기 • 인천대 신포터즈 기획·운영 (11.27 ~ 11.28)'
              : isHistoryPage
              ? '1883 푸성귀전에서 1929 공설시장까지 • 한 권의 책으로 읽는 신포 100년 역사관'
              : '2025 인천지역유산 • 2023·2026 K-관광마켓 1·2기 연속 선정 • 인천대 신포터즈 운영'}
          </span>
        </div>

        {/* Navigation & Utilities Row */}
        <div className="py-2.5 flex items-center justify-between">
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 text-[14px] font-medium text-[#444444]">
            {MAIN_LINKS.map((link) => {
              const active = link.href === '/' && isHomePage;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`hover:text-[#8C6239] transition-colors py-1 hover:font-bold ${
                    active ? 'text-[#8C6239] font-bold' : ''
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Page 2: 100년 역사관 (/history) */}
            <Link
              href={HISTORY_LINK.href}
              className={`px-3 py-1 rounded-full border transition-colors font-bold ${
                isHistoryPage
                  ? 'bg-[#8C6239] text-white border-[#8C6239]'
                  : 'text-[#8C6239] border-[#8C6239] hover:bg-[#8C6239] hover:text-white'
              }`}
            >
              {HISTORY_LINK.label}
            </Link>

            {/* Page 3: 디지털 보물찾기 (/event) */}
            <Link
              href={EVENT_LINK.href}
              className={`px-3 py-1 rounded-full border transition-colors font-bold ${
                isEventPage
                  ? 'bg-[#00acc1] text-white border-[#00acc1]'
                  : 'text-[#00acc1] border-[#00acc1] hover:bg-[#00acc1] hover:text-white'
              }`}
            >
              {EVENT_LINK.label}
            </Link>
          </nav>

          {/* Right Area: Guidebook Hint Shortcut */}
          <div className="hidden md:flex items-center gap-3 text-gray-600">
            <Link
              href="/history#theme-cards"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C6239] bg-[#fcfaf7] hover:bg-[#f3ead8] border border-[#8C6239]/30 px-3 py-1.5 rounded-full transition-colors"
              title="보물찾기 힌트가 담긴 여행 가이드북 보기"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>보물찾기 힌트북</span>
            </Link>
          </div>

          {/* Mobile Bar */}
          <div className="flex md:hidden items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Link href="/history" onClick={closeMenu} className="text-xs font-bold text-[#8C6239]">
                100년 역사관
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/event" onClick={closeMenu} className="text-xs font-bold text-[#00acc1]">
                디지털 보물찾기
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="p-1.5 text-gray-700 hover:text-[#8C6239]"
                aria-label="메뉴 열기"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* History Sub Navigation (역사 페이지에서만 노출) */}
      {isHistoryPage && (
        <div className="border-t border-gray-100 bg-[#fcfaf7]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-5 overflow-x-auto py-2 text-xs font-medium text-gray-600 whitespace-nowrap">
            <span className="text-[#8C6239] font-bold shrink-0">HISTORY</span>
            {HISTORY_SUB_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-[#8C6239] transition-colors shrink-0"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Event Sub Navigation (이벤트 페이지에서만 노출) */}
      {isEventPage && (
        <div className="border-t border-gray-100 bg-[#f6fbfc]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-5 overflow-x-auto py-2 text-xs font-medium text-gray-600 whitespace-nowrap">
            <span className="text-[#00acc1] font-bold shrink-0">EVENT</span>
            {EVENT_SUB_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-[#00acc1] transition-colors shrink-0"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-2 text-sm font-medium">
          {MAIN_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className={`block py-2 hover:text-[#8C6239] ${
                link.href === '/' && isHomePage ? 'text-[#8C6239] font-bold' : 'text-gray-700'
              }`}
            >
              {link.mobileLabel}
            </Link>
          ))}
          <Link
            href={HISTORY_LINK.href}
            onClick={closeMenu}
            className="block py-2 text-[#8C6239] font-bold"
          >
            {HISTORY_LINK.mobileLabel}
          </Link>
          <Link
            href={EVENT_LINK.href}
            onClick={closeMenu}
            className="block py-2 text-[#00acc1] font-bold"
          >
            {EVENT_LINK.mobileLabel}
          </Link>
        </div>
      )}
    </header>
  );
};
