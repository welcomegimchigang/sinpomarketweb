"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Hand,
} from 'lucide-react';
import { HISTORY_ITEMS } from '../../data/marketData';

const TOTAL_PAGES = 10;

const CHAPTER_BOOKMARKS = [
  { label: '표지', pageIndex: 0 },
  { label: '1장 · 1883 개항·푸성귀전', pageIndex: 1 },
  { label: '2장 · 1929 공설시장 연혁', pageIndex: 3 },
  { label: '3장 · 1950-70 신포·쫄면', pageIndex: 5 },
  { label: '4장 · 2010-2026 국제시장', pageIndex: 7 },
  { label: '뒷표지', pageIndex: 9 },
];

const TIMELINE_STEPS = [
  {
    year: '1929. 12',
    label: '제1공설시장 개장',
    desc: '1883년 개항 어물전·푸성귀전을 잇는 인천 최초 근대적 상설시장 개장',
  },
  {
    year: '1932. 07',
    label: '제2공설시장 준공',
    desc: '시장 규모 확장 및 근대 공설시장 체제 확립',
  },
  {
    year: '6·25전쟁 전후',
    label: '‘신포시장’ 명칭 사용',
    desc: '전란 전후 시민들의 삶터로 자리 잡으며 신포시장 명칭 정착',
  },
  {
    year: '1971년',
    label: '신포상가 신축 & 쫄면 탄생',
    desc: '1971년 신포상가 신축 및 1970년대 초 경동 광신제면에서 원조 쫄면 탄생',
  },
  {
    year: '2010. 03',
    label: '‘신포국제시장’ 명칭 변경',
    desc: '문화관광시장 지원대상 선정 및 ‘신포국제시장’으로 새 도약',
  },
];

export const HistorySection: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const templateRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pageFlipRef = useRef<any>(null);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');
  const [isReady, setIsReady] = useState<boolean>(false);

  const handlePrev = useCallback(() => {
    if (pageFlipRef.current) {
      pageFlipRef.current.flipPrev();
    }
  }, []);

  const handleNext = useCallback(() => {
    if (pageFlipRef.current) {
      pageFlipRef.current.flipNext();
    }
  }, []);

  const handleGoToPage = useCallback((pageIdx: number) => {
    if (pageFlipRef.current) {
      pageFlipRef.current.flip(pageIdx);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let flipInstance: any = null;

    const initBook = async () => {
      if (!mountRef.current || !templateRef.current) return;

      const { PageFlip } = await import('page-flip');
      if (!isMounted || !mountRef.current || !templateRef.current) return;

      // Clear previous mount container safely
      mountRef.current.innerHTML = '';
      const bookEl = document.createElement('div');
      bookEl.className = 'w-full';

      // Clone template pages so StPageFlip DOM mutations never conflict with React reconciliation
      const sourcePages = templateRef.current.querySelectorAll('.storybook-page-item');
      sourcePages.forEach((node) => {
        bookEl.appendChild(node.cloneNode(true));
      });

      mountRef.current.appendChild(bookEl);

      flipInstance = new PageFlip(bookEl, {
        width: 480,
        height: 650,
        size: 'stretch' as never,
        minWidth: 380, // blockWidth < 760px 일 때 자동으로 1페이지 모바일(portrait) 모드로 전환
        maxWidth: 540,
        minHeight: 520,
        maxHeight: 720,
        drawShadow: true,
        flippingTime: 850,
        usePortrait: true,
        startZIndex: 0,
        autoSize: true,
        maxShadowOpacity: 0.55,
        showCover: true,
        mobileScrollSupport: true,
        swipeDistance: 25,
        clickEventForward: true,
        useMouseEvents: true,
        showPageCorners: true,
        disableFlipByClick: false,
      });

      const clonedPages = bookEl.querySelectorAll('.storybook-page-item');
      flipInstance.loadFromHTML(clonedPages as unknown as HTMLElement[]);

      // 모바일 소형 화면(320px~375px)에서 가로 스크롤이 절대 발생하지 않도록 minWidth 인라인 스타일 보정
      bookEl.style.minWidth = '0px';
      bookEl.style.maxWidth = '100%';

      flipInstance.on('init', (e: { data: { page: number; mode: 'portrait' | 'landscape' } }) => {
        if (!isMounted) return;
        setCurrentPage(e.data.page ?? 0);
        setOrientation(e.data.mode ?? 'landscape');
        setIsReady(true);
      });

      flipInstance.on('flip', (e: { data: number }) => {
        if (!isMounted) return;
        setCurrentPage(typeof e.data === 'number' ? e.data : 0);
      });

      flipInstance.on('changeOrientation', (e: { data: 'portrait' | 'landscape' }) => {
        if (!isMounted) return;
        setOrientation(e.data);
      });

      pageFlipRef.current = flipInstance;
    };

    initBook();

    return () => {
      isMounted = false;
      if (flipInstance) {
        try {
          flipInstance.destroy();
        } catch {
          // ignore cleanup errors on detached nodes
        }
      }
      pageFlipRef.current = null;
    };
  }, []);

  // 키보드 좌우 화살표 키 지원 (현재 동화책 섹션이 화면에 보일 때만 동작)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return;
      }
      const sectionEl = document.getElementById('history');
      if (sectionEl) {
        const rect = sectionEl.getBoundingClientRect();
        const inView = rect.top < window.innerHeight * 0.75 && rect.bottom > window.innerHeight * 0.25;
        if (!inView) return;
      }
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handlePrev, handleNext]);

  // 현재 페이지 라벨 계산 (양면 모드 vs 단면 모드)
  const getPageStatusLabel = () => {
    if (currentPage === 0) return `표지 (1 / ${TOTAL_PAGES})`;
    if (currentPage >= TOTAL_PAGES - 1) return `뒷표지 (${TOTAL_PAGES} / ${TOTAL_PAGES})`;
    if (orientation === 'landscape') {
      const leftNum = currentPage % 2 === 1 ? currentPage + 1 : currentPage;
      const rightNum = Math.min(leftNum + 1, TOTAL_PAGES);
      return `${leftNum}–${rightNum} / ${TOTAL_PAGES} 페이지`;
    }
    return `${currentPage + 1} / ${TOTAL_PAGES} 페이지`;
  };

  const progressPercent = Math.round(((currentPage + 1) / TOTAL_PAGES) * 100);

  const era1 = HISTORY_ITEMS[0];
  const era2 = HISTORY_ITEMS[1];
  const era3 = HISTORY_ITEMS[2];

  return (
    <section
      id="history"
      className="scroll-mt-28 py-14 sm:py-20 bg-gradient-to-b from-[#23160c] via-[#2e1d10] to-[#1f130a] text-white border-b border-[#8C6239]/30 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        {/* Section Heading */}
        <div className="text-center mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E5A93C] tracking-widest uppercase mb-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            INTERACTIVE 3D STORYBOOK · SINPO 100 YEARS
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#f9eed8] tracking-tight font-storybook">
            책장을 넘기며 읽는 신포 100년 동화
          </h2>
          <div className="w-14 h-[2px] bg-[#E5A93C] mx-auto mt-3 mb-3" />
          <p className="text-xs sm:text-sm text-amber-100/80 max-w-2xl mx-auto leading-relaxed">
            1883년 개항기 ‘푸성귀전’에서 1929년 제1공설시장, 그리고 오늘날의 신포국제시장까지.
            <br className="hidden sm:inline" />{' '}
            <strong>페이지 모서리를 클릭·드래그(스와이프)</strong>하거나 <strong>좌우 화살표 버튼(키보드 ← →)</strong>으로 책장을 한 장씩 넘겨보세요.
          </p>
        </div>

        {/* Chapter Quick-Jump Bookmark Bar */}
        <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto pb-3 mb-5 no-scrollbar">
          {CHAPTER_BOOKMARKS.map((bm) => {
            const isCurrent =
              bm.pageIndex === 0
                ? currentPage === 0
                : bm.pageIndex === 9
                ? currentPage === 9
                : currentPage === bm.pageIndex ||
                  (orientation === 'landscape' && currentPage === bm.pageIndex + 1);

            return (
              <button
                key={bm.label}
                type="button"
                onClick={() => handleGoToPage(bm.pageIndex)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all border ${
                  isCurrent
                    ? 'bg-[#E5A93C] text-[#2a1b0e] border-[#E5A93C] shadow-md'
                    : 'bg-white/10 text-amber-100/85 border-white/15 hover:bg-white/20'
                }`}
              >
                {bm.label}
              </button>
            );
          })}
        </div>

        {/* Interactive Flipbook Stage */}
        <div className="relative sinpo-storybook-stage max-w-5xl mx-auto">
          {/* Desktop Floating Side Prev/Next Buttons */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentPage === 0}
            aria-label="이전 페이지 넘기기"
            className="hidden lg:flex absolute -left-14 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#E5A93C] hover:bg-[#F3C15F] disabled:opacity-30 disabled:pointer-events-none text-[#2a1b0e] items-center justify-center shadow-lg transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentPage >= TOTAL_PAGES - 1}
            aria-label="다음 페이지 넘기기"
            className="hidden lg:flex absolute -right-14 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#E5A93C] hover:bg-[#F3C15F] disabled:opacity-30 disabled:pointer-events-none text-[#2a1b0e] items-center justify-center shadow-lg transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Book Desk Mat Frame */}
          <div className="relative rounded-2xl bg-[#180e07]/90 border border-[#8C6239]/40 p-2 sm:p-5 md:p-7 shadow-2xl">
            {/* Mode & Touch Hint Badge */}
            <div className="flex items-center justify-between gap-2 mb-3 px-1 text-[11px] text-amber-200/80">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <Hand className="w-3.5 h-3.5 text-[#E5A93C]" />
                {orientation === 'portrait'
                  ? '모바일 단면 모드 · 좌우로 스와이프하거나 모서리를 터치하세요'
                  : '데스크톱 양면 펼침 모드 · 책 모서리를 드래그하거나 클릭하세요'}
              </span>
              <span className="font-mono font-bold text-[#E5A93C] shrink-0">
                {getPageStatusLabel()}
              </span>
            </div>

            {/* StPageFlip Mount Container */}
            <div
              ref={mountRef}
              className={`sinpo-storybook-mount w-full min-h-[500px] sm:min-h-[580px] flex items-center justify-center transition-opacity duration-300 ${
                isReady ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        </div>

        {/* Bottom Controls & Progress Bar */}
        <div className="max-w-3xl mx-auto mt-6 space-y-3">
          {/* Progress Bar */}
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#8C6239] via-[#E5A93C] to-[#F3C15F] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentPage === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-35 disabled:pointer-events-none text-xs sm:text-sm font-bold text-amber-100 border border-white/15 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-[#E5A93C]" />
              <span>이전 장</span>
            </button>

            <div className="flex items-center gap-2 text-center">
              <span className="text-xs sm:text-sm font-bold text-amber-200">
                {getPageStatusLabel()}
              </span>
              {currentPage > 0 && (
                <button
                  type="button"
                  onClick={() => handleGoToPage(0)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-[11px] text-amber-300 transition-colors"
                  title="표지로 돌아가기"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>처음으로</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentPage >= TOTAL_PAGES - 1}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#E5A93C] hover:bg-[#F3C15F] disabled:opacity-35 disabled:pointer-events-none text-xs sm:text-sm font-black text-[#2a1b0e] shadow-md transition-colors"
            >
              <span>다음 장</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ============================================================
            Hidden Page Templates (Cloned into StPageFlip & kept for SEO)
            ============================================================ */}
        <div ref={templateRef} className="sr-only" aria-hidden="false">
          {/* [PAGE 1 / INDEX 0] 앞표지 (Front Hardcover) */}
          <div className="storybook-page-item storybook-hardcover p-6 sm:p-8 flex flex-col justify-between h-full">
            <div className="border-2 border-[#E5A93C]/45 rounded-xl p-5 sm:p-7 h-full flex flex-col justify-between relative">
              {/* Corner Ornaments */}
              <span className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-[#E5A93C]" />
              <span className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-[#E5A93C]" />
              <span className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-[#E5A93C]" />
              <span className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-[#E5A93C]" />

              <div className="text-center pt-2">
                <span className="inline-block px-3 py-0.5 rounded-full border border-[#E5A93C]/50 bg-[#E5A93C]/15 text-[10px] font-mono font-bold tracking-[0.25em] text-[#E5A93C]">
                  SINPO HERITAGE ARCHIVE
                </span>
              </div>

              <div className="my-auto text-center space-y-4 py-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#8C6239] border-2 border-[#E5A93C] flex items-center justify-center shadow-lg">
                  <span className="font-storybook font-black text-3xl text-amber-100">
                    新浦
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold tracking-[0.2em] text-amber-300/90">
                    1883 푸성귀전에서 2026 오늘까지
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-black text-amber-100 leading-snug font-storybook">
                    신포국제시장
                    <br />
                    100년의 이야기
                  </h3>
                </div>

                <div className="w-16 h-[1.5px] bg-[#E5A93C]/70 mx-auto" />

                <p className="text-xs text-amber-100/80 max-w-xs mx-auto leading-relaxed">
                  작은 채소 장터에서 시작해 인천 최초의 근대 공설시장을 거쳐 세계인이 찾는 시장이 되기까지의 시간 여행
                </p>

                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-black/35 border border-[#E5A93C]/30 text-[11px] font-mono text-amber-200">
                  <span>1883</span>
                  <span>→</span>
                  <span>1929</span>
                  <span>→</span>
                  <span>1971</span>
                  <span>→</span>
                  <span>2010</span>
                  <span>→</span>
                  <span>2026</span>
                </div>
              </div>

              <div className="text-center pt-3 border-t border-[#E5A93C]/25">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E5A93C] animate-pulse">
                  <span>책장 모서리를 넘겨 이야기를 펼쳐보세요</span>
                  <span>→</span>
                </span>
                <span className="block text-[10px] font-mono text-amber-200/60 mt-1">
                  COVER · 01 / {TOTAL_PAGES}
                </span>
              </div>
            </div>
          </div>

          {/* [PAGE 2 / INDEX 1] 제1장 왼쪽 화보 (1883년 개항과 푸성귀전) */}
          <div className="storybook-page-item storybook-paper-left p-5 sm:p-7 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between border-b border-[#8C6239]/25 pb-2.5 mb-3">
                <span className="text-[11px] font-mono font-black text-white bg-[#8C6239] px-2.5 py-0.5 rounded">
                  제1장 · 1883년
                </span>
                <span className="text-[11px] font-bold text-[#8C6239]">
                  {era1.badge}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-[#2c1d10] font-storybook mb-1">
                신포시장의 시작에는 ‘푸성귀’가 있었다
              </h3>
              <p className="text-xs text-[#5c4328] mb-3 leading-relaxed">
                1883년 인천항 개항 이후 형성된 조선인의 어물전과 중국 상인들의 채소 장터 ‘푸성귀전’
              </p>

              {/* Historical Photo Plate */}
              <div className="space-y-2.5">
                <div className="relative rounded-lg overflow-hidden border-2 border-[#c8b082] bg-[#e9dcc0] shadow-sm">
                  <img
                    src="/history/image2.jpg"
                    alt="신포국제시장 푸성귀전 조형물"
                    loading="lazy"
                    className="w-full h-44 sm:h-48 object-cover sepia-[0.15]"
                  />
                  <div className="bg-[#2c1d10]/85 text-amber-100 px-3 py-1.5 text-[11px] flex items-center justify-between">
                    <span className="font-bold">🗿 푸성귀전(菜市) 조형물</span>
                    <span className="text-[10px] text-amber-300">개항기 채소 장터 재현</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg overflow-hidden border border-[#c8b082] bg-white/60 p-2">
                    <img
                      src="/history/image1.jpg"
                      alt="옛 신포시장 골목 풍경"
                      loading="lazy"
                      className="w-full h-20 object-cover rounded mb-1"
                    />
                    <span className="block text-[10px] font-bold text-[#3d2814] text-center">
                      옛 신포시장 골목과 상회
                    </span>
                  </div>
                  <div className="rounded-lg border border-[#c8b082] bg-[#fffaf0]/80 p-2.5 flex flex-col justify-center">
                    <span className="text-[11px] font-black text-[#8C6239] mb-1">
                      📖 낱말 풀이
                    </span>
                    <p className="text-[11px] text-[#4a3520] leading-snug">
                      • <strong>푸성귀</strong>: 나물과 채소
                      <br />• <strong>전(廛)</strong>: 물건을 펼쳐놓고 장사하던 가게·장터
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2.5 border-t border-[#8C6239]/20 flex items-center justify-between text-[11px] font-mono text-[#7a5a38]">
              <span>CHAPTER I · VISUAL ARCHIVE</span>
              <span className="font-bold">02 / {TOTAL_PAGES}</span>
            </div>
          </div>

          {/* [PAGE 3 / INDEX 2] 제1장 오른쪽 이야기 (1883년 ~ 1930년대) */}
          <div className="storybook-page-item storybook-paper-right p-5 sm:p-7 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between border-b border-[#8C6239]/25 pb-2.5 mb-3">
                <span className="text-xs font-bold font-mono text-[#8C6239] bg-amber-100/80 px-2.5 py-0.5 rounded">
                  {era1.period}
                </span>
                <span className="text-xs font-bold text-[#6e5032]">
                  {era1.era}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-[#2c1d10] font-storybook leading-snug mb-3">
                {era1.title}
              </h3>

              <p className="text-xs sm:text-[13px] text-[#3d2b18] leading-relaxed mb-4">
                {era1.description}
              </p>

              <div className="rounded-lg bg-[#fffaf0]/85 border border-[#d6c299] p-3.5 mb-4 space-y-2">
                <span className="block text-[11px] font-black text-[#8C6239] uppercase tracking-wider">
                  핵심 역사 팩트 (KEY FACTS)
                </span>
                {era1.keyFacts.map((fact, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-[#3d2b18]">
                    <span className="text-[#8C6239] font-black mt-0.5">•</span>
                    <span className="leading-snug">{fact}</span>
                  </div>
                ))}
              </div>

              {era1.highlightQuote && (
                <blockquote className="rounded-lg border-l-4 border-[#8C6239] bg-amber-50/70 p-3 text-xs text-[#4a3319] italic font-storybook leading-relaxed">
                  {era1.highlightQuote}
                </blockquote>
              )}
            </div>

            <div className="pt-2.5 border-t border-[#8C6239]/20 flex items-center justify-between text-[11px] font-mono text-[#7a5a38]">
              <span>1883 개항과 푸성귀전</span>
              <span className="font-bold">03 / {TOTAL_PAGES}</span>
            </div>
          </div>

          {/* [PAGE 4 / INDEX 3] 제2장 왼쪽 화보 (1929~1932년 근대 공설시장 개장) */}
          <div className="storybook-page-item storybook-paper-left p-5 sm:p-7 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between border-b border-[#8C6239]/25 pb-2.5 mb-3">
                <span className="text-[11px] font-mono font-black text-white bg-[#8C6239] px-2.5 py-0.5 rounded">
                  제2장 · 1929 ~ 2010
                </span>
                <span className="text-[11px] font-bold text-[#8C6239]">
                  공설시장 100년 연혁
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-[#2c1d10] font-storybook mb-1">
                100년 동안 이름도, 모습도 달라졌습니다
              </h3>
              <p className="text-xs text-[#5c4328] mb-3 leading-relaxed">
                인천 최초의 근대적 상설시장 ‘제1·제2공설시장’에서 오늘날 ‘신포국제시장’으로 이어진 변천사
              </p>

              {/* Timeline Graphic Image from Word Doc */}
              <div className="rounded-lg overflow-hidden border-2 border-[#c8b082] bg-white p-3 shadow-sm mb-3">
                <img
                  src="/history/image4.png"
                  alt="1929 제1공설시장부터 2010 신포국제시장까지의 연혁 일러스트"
                  loading="lazy"
                  className="w-full h-36 sm:h-40 object-contain"
                />
                <p className="text-[10px] text-center font-bold text-[#6e5032] mt-1 pt-1 border-t border-gray-100">
                  ▲ 1929 제1공설시장 → 1932 제2공설시장 → 신포시장 → 1971 신포상가 → 2010 신포국제시장
                </p>
              </div>

              <div className="rounded-lg border border-[#c8b082] bg-[#fffaf0]/85 p-3">
                <span className="block text-[11px] font-black text-[#8C6239] mb-1">
                  🏛️ 인천 최초 근대 상설시장의 가치
                </span>
                <p className="text-xs text-[#3d2b18] leading-relaxed">
                  1929년 12월 제1공설시장 개장과 1932년 7월 제2공설시장 준공은 노점 형태의 장터를 근대적 상설시장으로 발전시킨 역사적 전환점이었습니다.
                </p>
              </div>
            </div>

            <div className="pt-2.5 border-t border-[#8C6239]/20 flex items-center justify-between text-[11px] font-mono text-[#7a5a38]">
              <span>CHAPTER II · PUBLIC MARKET</span>
              <span className="font-bold">04 / {TOTAL_PAGES}</span>
            </div>
          </div>

          {/* [PAGE 5 / INDEX 4] 제2장 오른쪽 이야기 (공설시장 5단계 타임라인) */}
          <div className="storybook-page-item storybook-paper-right p-5 sm:p-7 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between border-b border-[#8C6239]/25 pb-2.5 mb-3">
                <span className="text-xs font-bold font-mono text-[#8C6239] bg-amber-100/80 px-2.5 py-0.5 rounded">
                  1929 → 1932 → 1971 → 2010
                </span>
                <span className="text-xs font-bold text-[#6e5032]">
                  100년 연혁표
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-[#2c1d10] font-storybook mb-3">
                장터에서 공설시장으로, 다시 국제시장으로
              </h3>

              <div className="space-y-2">
                {TIMELINE_STEPS.map((step, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-[#d6c299] bg-[#fffaf0]/90 p-2.5 flex items-start gap-2.5"
                  >
                    <span className="shrink-0 font-mono text-[11px] font-black text-white bg-[#8C6239] px-2 py-0.5 rounded mt-0.5">
                      {step.year}
                    </span>
                    <div>
                      <h4 className="text-xs font-black text-[#2c1d10]">{step.label}</h4>
                      <p className="text-[11px] text-[#5c4328] leading-snug mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2.5 border-t border-[#8C6239]/20 flex items-center justify-between text-[11px] font-mono text-[#7a5a38]">
              <span>공설시장 100년 타임라인</span>
              <span className="font-bold">05 / {TOTAL_PAGES}</span>
            </div>
          </div>

          {/* [PAGE 6 / INDEX 5] 제3장 왼쪽 화보 (1950~1970년대 신포시장과 원조 먹거리) */}
          <div className="storybook-page-item storybook-paper-left p-5 sm:p-7 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between border-b border-[#8C6239]/25 pb-2.5 mb-3">
                <span className="text-[11px] font-mono font-black text-white bg-[#8C6239] px-2.5 py-0.5 rounded">
                  제3장 · 1950 ~ 1970년대
                </span>
                <span className="text-[11px] font-bold text-[#8C6239]">
                  {era2.badge}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-[#2c1d10] font-storybook mb-1">
                오래된 시장에서 태어난 대한민국 국민의 맛
              </h3>
              <p className="text-xs text-[#5c4328] mb-3 leading-relaxed">
                닭강정, 공갈빵, 오색만두, 그리고 1970년대 초 인천 중구에서 탄생한 ‘쫄면’의 고향
              </p>

              <div className="rounded-lg overflow-hidden border-2 border-[#c8b082] bg-white p-2 shadow-sm mb-3">
                <img
                  src="/history/image6.png"
                  alt="신포국제시장 대표 먹거리 닭강정, 공갈빵, 쫄면"
                  loading="lazy"
                  className="w-full h-36 sm:h-40 object-cover rounded"
                />
                <p className="text-[10px] text-center font-bold text-[#6e5032] mt-1.5">
                  🍗 닭강정 · 🥖 공갈빵 · 🥟 오색만두 · 🍜 원조 쫄면
                </p>
              </div>

              <div className="rounded-lg border border-[#c8b082] bg-[#fffaf0]/90 p-3 space-y-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-black text-[#8C6239]">
                  <Sparkles className="w-3 h-3" />
                  1970년대 초 ‘광신제면’ 쫄면 탄생 비화
                </span>
                <p className="text-[11px] text-[#3d2b18] leading-relaxed">
                  인천 중구 경동의 <strong>광신제면</strong>에서 냉면을 만들던 중 실수로 뽑힌 굵은 면발을 인근 분식점에서 채소와 매콤한 양념에 비벼 판매하며 대한민국 국민 분식 ‘쫄면’이 탄생했습니다.
                </p>
              </div>
            </div>

            <div className="pt-2.5 border-t border-[#8C6239]/20 flex items-center justify-between text-[11px] font-mono text-[#7a5a38]">
              <span>CHAPTER III · ORIGIN OF TASTE</span>
              <span className="font-bold">06 / {TOTAL_PAGES}</span>
            </div>
          </div>

          {/* [PAGE 7 / INDEX 6] 제3장 오른쪽 이야기 (1950년대 ~ 2010년) */}
          <div className="storybook-page-item storybook-paper-right p-5 sm:p-7 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between border-b border-[#8C6239]/25 pb-2.5 mb-3">
                <span className="text-xs font-bold font-mono text-[#8C6239] bg-amber-100/80 px-2.5 py-0.5 rounded">
                  {era2.period}
                </span>
                <span className="text-xs font-bold text-[#6e5032]">
                  {era2.era}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-[#2c1d10] font-storybook leading-snug mb-3">
                {era2.title}
              </h3>

              <p className="text-xs sm:text-[13px] text-[#3d2b18] leading-relaxed mb-4">
                {era2.description}
              </p>

              <div className="rounded-lg bg-[#fffaf0]/85 border border-[#d6c299] p-3.5 mb-4 space-y-2">
                <span className="block text-[11px] font-black text-[#8C6239] uppercase tracking-wider">
                  핵심 역사 팩트 (KEY FACTS)
                </span>
                {era2.keyFacts.map((fact, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-[#3d2b18]">
                    <span className="text-[#8C6239] font-black mt-0.5">•</span>
                    <span className="leading-snug">{fact}</span>
                  </div>
                ))}
              </div>

              {era2.highlightQuote && (
                <blockquote className="rounded-lg border-l-4 border-[#8C6239] bg-amber-50/70 p-3 text-xs text-[#4a3319] italic font-storybook leading-relaxed">
                  {era2.highlightQuote}
                </blockquote>
              )}
            </div>

            <div className="pt-2.5 border-t border-[#8C6239]/20 flex items-center justify-between text-[11px] font-mono text-[#7a5a38]">
              <span>신포시장에서 신포국제시장으로</span>
              <span className="font-bold">07 / {TOTAL_PAGES}</span>
            </div>
          </div>

          {/* [PAGE 8 / INDEX 7] 제4장 왼쪽 화보 (2010 ~ 2026년 현재) */}
          <div className="storybook-page-item storybook-paper-left p-5 sm:p-7 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between border-b border-[#8C6239]/25 pb-2.5 mb-3">
                <span className="text-[11px] font-mono font-black text-white bg-[#8C6239] px-2.5 py-0.5 rounded">
                  제4장 · 2023 ~ 2026 현재
                </span>
                <span className="text-[11px] font-bold text-[#8C6239]">
                  {era3.badge}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-[#2c1d10] font-storybook mb-1">
                골목마다 만나는 오늘과 내일의 신포
              </h3>
              <p className="text-xs text-[#5c4328] mb-3 leading-relaxed">
                등대공원·푸성귀전·수산물·수선·칼국수골목이 어우러진 工자형 문화관광시장
              </p>

              <div className="space-y-2.5">
                <div className="rounded-lg overflow-hidden border-2 border-[#c8b082] bg-white shadow-sm">
                  <img
                    src="/history/image5.png"
                    alt="신포국제시장 골목 지도 (등대공원, 푸성귀전 조형물, 수선골목, 수산물골목, 칼국수골목)"
                    loading="lazy"
                    className="w-full h-40 sm:h-44 object-contain bg-white p-1"
                  />
                  <div className="bg-[#2c1d10]/85 text-amber-100 px-3 py-1 text-[10px] flex items-center justify-between">
                    <span>🗺️ 한눈에 보는 신포 골목 지도</span>
                    <span className="text-amber-300">工자형 테마 공간</span>
                  </div>
                </div>

                <div className="rounded-lg overflow-hidden border border-[#c8b082] bg-[#fffaf0]/90 p-2.5 flex items-center gap-3">
                  <img
                    src="/sinpoimg.jpeg"
                    alt="오늘날의 신포국제시장 아케이드 전경"
                    loading="lazy"
                    className="w-20 h-14 object-cover rounded shrink-0"
                  />
                  <p className="text-[11px] text-[#3d2b18] leading-snug">
                    <strong>빨간 등대(등대공원)</strong>가 밝히는 다음 100년: 청년몰·ESG·스마트 관광이 공존하는 살아있는 시장
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2.5 border-t border-[#8C6239]/20 flex items-center justify-between text-[11px] font-mono text-[#7a5a38]">
              <span>CHAPTER IV · PRESENT &amp; FUTURE</span>
              <span className="font-bold">08 / {TOTAL_PAGES}</span>
            </div>
          </div>

          {/* [PAGE 9 / INDEX 8] 제4장 오른쪽 이야기 (2023 ~ 2026년 현재) */}
          <div className="storybook-page-item storybook-paper-right p-5 sm:p-7 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between border-b border-[#8C6239]/25 pb-2.5 mb-3">
                <span className="text-xs font-bold font-mono text-[#8C6239] bg-amber-100/80 px-2.5 py-0.5 rounded">
                  {era3.period}
                </span>
                <span className="text-xs font-bold text-[#6e5032]">
                  {era3.era}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-[#2c1d10] font-storybook leading-snug mb-3">
                {era3.title}
              </h3>

              <p className="text-xs sm:text-[13px] text-[#3d2b18] leading-relaxed mb-4">
                {era3.description}
              </p>

              <div className="rounded-lg bg-[#fffaf0]/85 border border-[#d6c299] p-3.5 mb-4 space-y-2">
                <span className="block text-[11px] font-black text-[#8C6239] uppercase tracking-wider">
                  핵심 역사 팩트 (KEY FACTS)
                </span>
                {era3.keyFacts.map((fact, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-[#3d2b18]">
                    <span className="text-[#8C6239] font-black mt-0.5">•</span>
                    <span className="leading-snug">{fact}</span>
                  </div>
                ))}
              </div>

              {era3.highlightQuote && (
                <blockquote className="rounded-lg border-l-4 border-[#8C6239] bg-amber-50/70 p-3 text-xs text-[#4a3319] italic font-storybook leading-relaxed">
                  {era3.highlightQuote}
                </blockquote>
              )}
            </div>

            <div className="pt-2.5 border-t border-[#8C6239]/20 flex items-center justify-between text-[11px] font-mono text-[#7a5a38]">
              <span>세계인이 찾는 관광시장</span>
              <span className="font-bold">09 / {TOTAL_PAGES}</span>
            </div>
          </div>

          {/* [PAGE 10 / INDEX 9] 뒷표지 (Back Hardcover) */}
          <div className="storybook-page-item storybook-hardcover p-6 sm:p-8 flex flex-col justify-between h-full">
            <div className="border-2 border-[#E5A93C]/45 rounded-xl p-5 sm:p-7 h-full flex flex-col justify-between relative text-center">
              <div className="pt-2">
                <span className="inline-block px-3 py-0.5 rounded-full border border-[#E5A93C]/40 bg-[#E5A93C]/10 text-[10px] font-mono font-bold tracking-[0.2em] text-[#E5A93C]">
                  EPILOGUE · NEXT 100 YEARS
                </span>
              </div>

              <div className="my-auto space-y-4 py-4">
                <div className="w-12 h-12 mx-auto rounded-full border border-[#E5A93C] bg-[#8C6239]/40 flex items-center justify-center text-amber-200 font-storybook font-bold text-lg">
                  完
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-amber-100 font-storybook leading-snug">
                  과거를 품고, 미래를 밝히는 곳
                  <br />
                  <span className="text-[#E5A93C]">신포의 이야기는 계속됩니다</span>
                </h3>

                <p className="text-xs text-amber-100/80 max-w-xs mx-auto leading-relaxed">
                  1883년 작은 푸성귀전에서 시작된 100년의 역사는 이제 여러분의 발걸음과 함께 다음 100년으로 이어집니다.
                </p>

                <div className="rounded-lg bg-black/35 border border-[#E5A93C]/30 p-3 text-[11px] text-amber-200/90 space-y-1 max-w-xs mx-auto">
                  <p className="font-bold text-[#E5A93C]">👇 아래 이어지는 15개 테마 카드</p>
                  <p className="text-[10px] text-amber-100/75">
                    시장 골목 QR코드에 담긴 과거·현재·미래 15편의 상세 카드 이야기도 아래에서 함께 읽어보세요.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5A93C]/25">
                <span className="block text-[11px] text-amber-300 font-semibold">
                  신포국제시장 · SINPO INTERNATIONAL MARKET
                </span>
                <span className="block text-[10px] font-mono text-amber-200/60 mt-1">
                  BACK COVER · {TOTAL_PAGES} / {TOTAL_PAGES}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
