"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X } from 'lucide-react';

const MAIN_LINKS = [
  { href: '/', label: '시장소개', mobileLabel: '시장소개' },
  { href: '/#food', label: '스토리마켓', mobileLabel: '스토리마켓 (신포 먹거리)' },
  { href: '/#history', label: '100년역사', mobileLabel: '100년 역사' },
  { href: '/#location', label: '오시는길', mobileLabel: '오시는 길 & 주차안내' },
  { href: '/#faq', label: '이용안내', mobileLabel: '이용안내 & FAQ' },
];

const EVENT_LINK = { href: '/event', label: '디지털 보물찾기', mobileLabel: '디지털 보물찾기 (이벤트)' };

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const rawPath = usePathname() || '/';
  const pathname = rawPath.length > 1 ? rawPath.replace(/\/$/, '') : rawPath;
  const isEventPage = pathname === '/event';
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
              ? '디지털 보물찾기 : 발자국 따라 떠나는 신포 골목 탐험 • 2026. 11. 13(금) ~ 11. 14(토)'
              : '1883년부터 이어온 인천의 맛과 정 • 140년 전통의 대표 시장'}
          </span>
        </div>

        {/* Navigation & Utilities Row */}
        <div className="py-2.5 flex items-center justify-between">
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-[14px] font-medium text-[#444444]">
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

          {/* Right Area: Search */}
          <div className="hidden md:flex items-center gap-4 text-gray-600">
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="보물찾기 힌트 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="text-xs px-2.5 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#8C6239]"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="text-xs text-gray-400 hover:text-gray-700"
                  >
                    닫기
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="p-1 hover:text-[#8C6239] transition-colors"
                  aria-label="검색창 열기"
                >
                  <Search className="w-4 h-4 text-gray-500 hover:text-[#8C6239]" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Bar */}
          <div className="flex md:hidden items-center justify-between w-full">
            <Link href="/event" onClick={closeMenu} className="text-xs font-bold text-[#8C6239]">
              11.13~11.14 디지털 보물찾기
            </Link>
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
