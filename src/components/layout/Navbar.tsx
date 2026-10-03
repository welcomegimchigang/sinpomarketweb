"use client";

import React, { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top Logo Center area */}
        <div className="pt-4 pb-2.5 flex flex-col items-center justify-center border-b border-gray-100">
          <a href="#" className="flex items-center gap-3 group">
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
          </a>
          <span className="text-[11px] text-gray-500 font-semibold tracking-wider mt-1">
            디지털 보물찾기 : 발자국 따라 떠나는 신포 골목 탐험 • 2026. 11. 1(일) ~ 11. 2(월)
          </span>
        </div>

        {/* Navigation & Utilities Row */}
        <div className="py-2.5 flex items-center justify-between">
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-[14px] font-medium text-[#444444]">
            <a
              href="#about"
              className="hover:text-[#8C6239] transition-colors py-1 hover:font-bold"
            >
              행사개요
            </a>
            <a
              href="#how-to-play"
              className="hover:text-[#8C6239] transition-colors py-1 hover:font-bold text-[#8C6239] font-bold"
            >
              참여방법
            </a>
            <a
              href="#features"
              className="hover:text-[#8C6239] transition-colors py-1 hover:font-bold"
            >
              핵심포인트
            </a>
            <a
              href="#rewards"
              className="hover:text-[#8C6239] transition-colors py-1 hover:font-bold text-[#00acc1] font-bold"
            >
              경품안내
            </a>
            <a
              href="#food"
              className="hover:text-[#8C6239] transition-colors py-1 hover:font-bold"
            >
              스토리마켓
            </a>
            <a
              href="#history"
              className="hover:text-[#8C6239] transition-colors py-1 hover:font-bold"
            >
              100년역사
            </a>
            <a
              href="#location"
              className="hover:text-[#8C6239] transition-colors py-1 hover:font-bold"
            >
              오시는길
            </a>
          </nav>

          {/* Right Area: Language Flags & Search */}
          <div className="hidden md:flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-2 pr-3 border-r border-gray-200 text-sm">
              <span className="text-base cursor-pointer hover:opacity-80" role="img" aria-label="USA" title="English">🇺🇸</span>
              <span className="text-base cursor-pointer hover:opacity-80" role="img" aria-label="Japan" title="日本語">🇯🇵</span>
              <span className="text-base cursor-pointer hover:opacity-80" role="img" aria-label="China" title="简体中文">🇨🇳</span>
            </div>

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
            <span className="text-xs font-bold text-[#8C6239]">
              11.1~11.2 디지털 보물찾기
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs">🇺🇸 🇯🇵 🇨🇳</span>
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

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-2 text-sm font-medium">
          <a
            href="#about"
            onClick={closeMenu}
            className="block py-2 text-gray-700 hover:text-[#8C6239]"
          >
            행사개요
          </a>
          <a
            href="#how-to-play"
            onClick={closeMenu}
            className="block py-2 text-[#8C6239] font-bold"
          >
            3단계 참여방법
          </a>
          <a
            href="#features"
            onClick={closeMenu}
            className="block py-2 text-gray-700 hover:text-[#8C6239]"
          >
            핵심포인트 (40개 QR & 동적확률)
          </a>
          <a
            href="#rewards"
            onClick={closeMenu}
            className="block py-2 text-[#00acc1] font-bold"
          >
            경품안내 & 수령처
          </a>
          <a
            href="#food"
            onClick={closeMenu}
            className="block py-2 text-gray-700 hover:text-[#8C6239]"
          >
            스토리마켓 (신포 먹거리)
          </a>
          <a
            href="#location"
            onClick={closeMenu}
            className="block py-2 text-gray-700 hover:text-[#8C6239]"
          >
            오시는 길 & 주차안내
          </a>
        </div>
      )}
    </header>
  );
};
