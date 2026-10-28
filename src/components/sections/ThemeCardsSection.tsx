"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  QrCode,
  MapPin,
  Sparkles,
  Compass,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  RotateCcw,
  Hand,
  Layers,
  Stamp,
  Route,
  Bookmark,
  Navigation,
} from 'lucide-react';
import { THEME_ZONES, THEME_CARDS } from '../../data/marketData';
import { ThemeCard, ThemeCategory, ThemeZoneInfo } from '../../types';

// 총 27페이지 구성
// 0: 앞표지 ("신포국제시장 100년 여행 가이드")
// 1: 목차 Left (工자형 공간 안내 & Chapter 1 목차)
// 2: 목차 Right (Chapter 2 & Chapter 3 목차)
// 3: Chapter 1 간지 (과거의 신포)
// 4~7: PAST 01 ~ PAST 04 (4장: 스토리 2 + 퀴즈 2)
// 8: Chapter 2 간지 (오늘의 신포)
// 9~17: NOW 01 ~ NOW 09 (9장: 스토리 7 + 퀴즈 2)
// 18: Chapter 3 간지 (미래의 신포)
// 19~25: FUTURE 01 ~ FUTURE 07 (7장: 스토리 6 + 퀴즈 1)
// 26: 뒷표지 (마무리 문구 + 디지털 보물찾기 버튼)
const TOTAL_PAGES = 27;

const PAGE_INDEX = {
  COVER: 0,
  TOC_LEFT: 1,
  TOC_RIGHT: 2,
  CH1_DIVIDER: 3,
  PAST_START: 4, // 4..7
  CH2_DIVIDER: 8,
  NOW_START: 9, // 9..17
  CH3_DIVIDER: 18,
  FUTURE_START: 19, // 19..25
  BACK_COVER: 26,
} as const;

interface EnrichedGuidePage {
  card: ThemeCard;
  pageIndex: number; // 0-based index in StPageFlip
  pageNumber: number; // 1-based display page number (1..22)
  guideHeaderCode: string; // "PAST 01", "NOW 01", "FUTURE 01" 등 시간 흐름 순서 번호
  chapterTitle: string; // "과거의 신포", "오늘의 신포", "미래의 신포"
  chapterNumber: number; // 1, 2, 3
}

const THEME_META: Record<
  ThemeCategory,
  {
    chapterNum: number;
    chapterLabel: string;
    shortTab: string;
    accentHex: string;
    badgeBg: string;
    badgeText: string;
    headerBorder: string;
    accentText: string;
    stampClass: string;
    routeDotBg: string;
    routeLineBg: string;
    memoBg: string;
    dividerBg: string;
    tabBgActive: string;
    tabBgIdle: string;
  }
> = {
  PAST: {
    chapterNum: 1,
    chapterLabel: '과거의 신포',
    shortTab: 'PAST · 과거',
    accentHex: '#8C6239',
    badgeBg: 'bg-[#8C6239]',
    badgeText: 'text-white',
    headerBorder: 'border-[#8C6239]/35',
    accentText: 'text-[#8C6239]',
    stampClass: 'bg-[#f8efe2] text-[#6e4925] border-[#8C6239]/55',
    routeDotBg: 'bg-[#8C6239]',
    routeLineBg: 'bg-[#8C6239]/30',
    memoBg: 'bg-[#f9f2e4] border-[#8C6239]/30',
    dividerBg: 'from-[#4a2e18] via-[#382110] to-[#28160a]',
    tabBgActive: 'bg-[#8C6239] text-white border-[#6e4925]',
    tabBgIdle: 'bg-[#f3e7d3] text-[#5c3d1e] border-[#d5be97] hover:bg-[#ead8ba]',
  },
  NOW: {
    chapterNum: 2,
    chapterLabel: '오늘의 신포',
    shortTab: 'NOW · 오늘',
    accentHex: '#E5A93C',
    badgeBg: 'bg-[#E5A93C]',
    badgeText: 'text-[#2a1b0e]',
    headerBorder: 'border-[#E5A93C]/45',
    accentText: 'text-[#9e690c]',
    stampClass: 'bg-[#fff7e2] text-[#7c5108] border-[#d99722]/65',
    routeDotBg: 'bg-[#d99722]',
    routeLineBg: 'bg-[#E5A93C]/40',
    memoBg: 'bg-[#fff9eb] border-[#E5A93C]/40',
    dividerBg: 'from-[#5c3d10] via-[#452c09] to-[#2e1c05]',
    tabBgActive: 'bg-[#E5A93C] text-[#2a1b0e] border-[#c78b20]',
    tabBgIdle: 'bg-[#fbf0d5] text-[#6e490a] border-[#e2c684] hover:bg-[#f6e4b8]',
  },
  FUTURE: {
    chapterNum: 3,
    chapterLabel: '미래의 신포',
    shortTab: 'FUTURE · 미래',
    accentHex: '#00ACC1',
    badgeBg: 'bg-[#00ACC1]',
    badgeText: 'text-white',
    headerBorder: 'border-[#00ACC1]/35',
    accentText: 'text-[#007c8a]',
    stampClass: 'bg-[#e8f8fa] text-[#006978] border-[#00ACC1]/55',
    routeDotBg: 'bg-[#00838F]',
    routeLineBg: 'bg-[#00ACC1]/35',
    memoBg: 'bg-[#eefafb] border-[#00ACC1]/30',
    dividerBg: 'from-[#0d464f] via-[#08333a] to-[#052126]',
    tabBgActive: 'bg-[#00ACC1] text-white border-[#00838F]',
    tabBgIdle: 'bg-[#e2f4f7] text-[#00606b] border-[#a5dce3] hover:bg-[#ccecf1]',
  },
};

// STORY FLOW 문자열을 점과 선의 여행 경로 노드 배열로 분해 (원문 텍스트 100% 보존)
function parseStoryFlowNodes(subContent: string): { nodes: string[]; connector: '→' | '↔' } {
  if (subContent.includes('↔')) {
    return {
      nodes: subContent.split('↔').map((s) => s.trim()).filter(Boolean),
      connector: '↔',
    };
  }
  return {
    nodes: subContent.split('→').map((s) => s.trim()).filter(Boolean),
    connector: '→',
  };
}

export const ThemeCardsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const templateRef = useRef<HTMLDivElement | null>(null);
  const pageFlipRef = useRef< any >(null);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const [isReady, setIsReady] = useState<boolean>(false);

  // 시간 흐름 순서대로 카드 정렬 및 페이지 번호 매핑 (PAST 01~02 → NOW 01~07 → FUTURE 01~06)
  const pastCards = THEME_CARDS.filter((c) => c.theme === 'PAST');
  const nowCards = THEME_CARDS.filter((c) => c.theme === 'NOW');
  const futureCards = THEME_CARDS.filter((c) => c.theme === 'FUTURE');

  const pastPages: EnrichedGuidePage[] = pastCards.map((card, idx) => ({
    card,
    pageIndex: PAGE_INDEX.PAST_START + idx,
    pageNumber: PAGE_INDEX.PAST_START + idx + 1,
    guideHeaderCode: `PAST ${String(idx + 1).padStart(2, '0')}`,
    chapterTitle: '과거의 신포',
    chapterNumber: 1,
  }));

  const nowPages: EnrichedGuidePage[] = nowCards.map((card, idx) => ({
    card,
    pageIndex: PAGE_INDEX.NOW_START + idx,
    pageNumber: PAGE_INDEX.NOW_START + idx + 1,
    guideHeaderCode: `NOW ${String(idx + 1).padStart(2, '0')}`,
    chapterTitle: '오늘의 신포',
    chapterNumber: 2,
  }));

  const futurePages: EnrichedGuidePage[] = futureCards.map((card, idx) => ({
    card,
    pageIndex: PAGE_INDEX.FUTURE_START + idx,
    pageNumber: PAGE_INDEX.FUTURE_START + idx + 1,
    guideHeaderCode: `FUTURE ${String(idx + 1).padStart(2, '0')}`,
    chapterTitle: '미래의 신포',
    chapterNumber: 3,
  }));

  const pastZone = THEME_ZONES.find((z) => z.id === 'PAST')!;
  const nowZone = THEME_ZONES.find((z) => z.id === 'NOW')!;
  const futureZone = THEME_ZONES.find((z) => z.id === 'FUTURE')!;

  const handlePrev = useCallback(() => {
    if (pageFlipRef.current) {
      pageFlipRef.current.flipPrev('top');
    }
  }, []);

  const handleNext = useCallback(() => {
    if (pageFlipRef.current) {
      pageFlipRef.current.flipNext('top');
    }
  }, []);

  const flipToPage = useCallback((pageIdx: number) => {
    if (pageFlipRef.current) {
      pageFlipRef.current.flip(pageIdx, 'top');
    }
  }, []);

  // StPageFlip 초기화 및 목차 페이지 클릭 이벤트 위임
  useEffect(() => {
    let isMounted = true;
    let flipInstance: any = null;

    const initGuidebook = async () => {
      if (!mountRef.current || !templateRef.current) return;

      const { PageFlip } = await import('page-flip');
      if (!isMounted || !mountRef.current || !templateRef.current) return;

      mountRef.current.innerHTML = '';
      const bookEl = document.createElement('div');
      bookEl.className = 'sinpo-guidebook-canvas mx-auto';

      const sourcePages = templateRef.current.querySelectorAll('.guidebook-page-item');
      sourcePages.forEach((node) => {
        bookEl.appendChild(node.cloneNode(true));
      });

      mountRef.current.appendChild(bookEl);

      flipInstance = new PageFlip(bookEl, {
        width: 470,
        height: 670,
        size: 'stretch',
        // minWidth 380 설정 시 컨테이너 폭 < 760px(모바일)에서 자동으로 1페이지(portrait) 모드로 전환
        minWidth: 380,
        maxWidth: 550,
        minHeight: 540,
        maxHeight: 740,
        drawShadow: true,
        flippingTime: 780,
        usePortrait: true,
        startZIndex: 0,
        autoSize: true,
        maxShadowOpacity: 0.45,
        showCover: true,
        mobileScrollSupport: true,
        swipeDistance: 25,
        clickEventForward: true,
        useMouseEvents: true,
      });

      const clonedPages = bookEl.querySelectorAll('.guidebook-page-item') as unknown as HTMLElement[];
      flipInstance.loadFromHTML(clonedPages);

      // 소형 모바일(320px~375px)에서도 가로 스크롤이 절대 발생하지 않도록 인라인 minWidth 해제
      bookEl.style.minWidth = '0px';
      bookEl.style.maxWidth = '100%';

      flipInstance.on('flip', (e: any) => {
        if (isMounted && typeof e.data === 'number') {
          setCurrentPage(e.data);
        }
      });

      flipInstance.on('changeOrientation', (e: any) => {
        if (isMounted && (e.data === 'portrait' || e.data === 'landscape')) {
          setOrientation(e.data);
        }
      });

      flipInstance.on('init', (e: any) => {
        if (isMounted) {
          if (e?.data?.mode === 'portrait' || e?.data?.mode === 'landscape') {
            setOrientation(e.data.mode);
          }
          setIsReady(true);
        }
      });

      pageFlipRef.current = flipInstance;
    };

    initGuidebook();

    // 책 내부 목차 버튼([data-goto-page]) 클릭 시 해당 페이지로 즉시 이동
    const mountEl = mountRef.current;
    const handleInternalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const btn = target.closest('[data-goto-page]') as HTMLElement | null;
      if (btn && pageFlipRef.current) {
        const pageStr = btn.getAttribute('data-goto-page');
        const targetIdx = Number(pageStr);
        if (!Number.isNaN(targetIdx)) {
          e.preventDefault();
          e.stopPropagation();
          pageFlipRef.current.flip(targetIdx, 'top');
        }
      }
    };

    if (mountEl) {
      mountEl.addEventListener('click', handleInternalClick);
    }

    return () => {
      isMounted = false;
      if (mountEl) {
        mountEl.removeEventListener('click', handleInternalClick);
      }
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

  // 키보드 좌우 화살표 지원 (가이드북 섹션이 화면에 보일 때 동작)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return;
      }
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
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

  // 현재 활성 챕터 판별 (인덱스 탭 하이라이트 및 상단 진행 표시용)
  const getActiveSection = (): 'COVER' | 'TOC' | ThemeCategory | 'BACK' => {
    if (currentPage === PAGE_INDEX.COVER) return 'COVER';
    if (currentPage === PAGE_INDEX.TOC_LEFT || currentPage === PAGE_INDEX.TOC_RIGHT) return 'TOC';
    if (currentPage >= PAGE_INDEX.CH1_DIVIDER && currentPage < PAGE_INDEX.CH2_DIVIDER) return 'PAST';
    if (currentPage >= PAGE_INDEX.CH2_DIVIDER && currentPage < PAGE_INDEX.CH3_DIVIDER) return 'NOW';
    if (currentPage >= PAGE_INDEX.CH3_DIVIDER && currentPage < PAGE_INDEX.BACK_COVER) return 'FUTURE';
    return 'BACK';
  };

  const activeSection = getActiveSection();

  const getActiveChapterBadge = () => {
    switch (activeSection) {
      case 'COVER':
        return { label: '가이드북 표지', color: 'bg-[#3b2412] text-[#f9eed8]' };
      case 'TOC':
        return { label: '목차 · 공간 안내', color: 'bg-[#5c3d1e] text-[#f9eed8]' };
      case 'PAST':
        return { label: 'Chapter 1 · 과거의 신포 (PAST)', color: 'bg-[#8C6239] text-white' };
      case 'NOW':
        return { label: 'Chapter 2 · 오늘의 신포 (NOW)', color: 'bg-[#E5A93C] text-[#2a1b0e]' };
      case 'FUTURE':
        return { label: 'Chapter 3 · 미래의 신포 (FUTURE)', color: 'bg-[#00ACC1] text-white' };
      case 'BACK':
        return { label: '뒷표지 · 보물찾기 안내', color: 'bg-[#3b2412] text-[#f9eed8]' };
    }
  };

  const getPageStatusLabel = () => {
    if (currentPage === 0) return `앞표지 (1 / ${TOTAL_PAGES})`;
    if (currentPage >= TOTAL_PAGES - 1) return `뒷표지 (${TOTAL_PAGES} / ${TOTAL_PAGES})`;
    if (orientation === 'landscape') {
      const leftNum = currentPage % 2 === 1 ? currentPage + 1 : currentPage;
      const rightNum = Math.min(leftNum + 1, TOTAL_PAGES);
      return `${leftNum}–${rightNum} / ${TOTAL_PAGES} 페이지`;
    }
    return `${currentPage + 1} / ${TOTAL_PAGES} 페이지`;
  };

  const progressPercent = Math.round(((currentPage + 1) / TOTAL_PAGES) * 100);
  const currentBadge = getActiveChapterBadge();

  // 챕터 구분 페이지(간지) 렌더링 헬퍼
  const renderChapterDividerPage = (
    pageIndex: number,
    chapterNum: number,
    zone: ThemeZoneInfo,
    chapterPages: EnrichedGuidePage[]
  ) => {
    const isLeft = pageIndex % 2 === 1;
    const meta = THEME_META[zone.id];
    const pageNumber = pageIndex + 1;

    return (
      <div
        key={`divider-${zone.id}`}
        className={`guidebook-page-item ${isLeft ? 'guidebook-paper-left' : 'guidebook-paper-right'}`}
      >
        <div
          className={`relative h-full w-full p-5 sm:p-7 flex flex-col justify-between bg-gradient-to-br ${meta.dividerBg} text-[#fcf5e5] overflow-hidden`}
        >
          {/* 배경 워터마크 장식 */}
          <div className="pointer-events-none absolute -right-8 -bottom-8 opacity-10">
            <Compass className="w-48 h-48 text-white" />
          </div>

          {/* 상단 챕터 러닝 헤더 */}
          <div>
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/20">
              <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase text-amber-200">
                <Bookmark className="w-3.5 h-3.5" />
                CHAPTER 0{chapterNum} DIVIDER
              </span>
              <span
                className={`px-2.5 py-0.5 rounded text-[10px] sm:text-xs font-black ${meta.badgeBg} ${meta.badgeText}`}
              >
                {zone.qrLabel}
              </span>
            </div>

            {/* 마스킹 테이프 장식 + 챕터 타이틀 */}
            <div className="mt-5 sm:mt-7 relative">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-mono font-extrabold tracking-widest text-amber-300 mb-2">
                Chapter {chapterNum} · {meta.chapterLabel}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight font-storybook text-white leading-tight">
                {zone.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm font-bold text-amber-200/95 leading-snug">
                {zone.subtitle}
              </p>
            </div>

            {/* 工자형 구역 위치 및 테마 요약 박스 */}
            <div className="mt-5 rounded-xl bg-black/25 border border-white/15 p-3.5 sm:p-4 space-y-2 backdrop-blur-sm">
              <div className="flex items-start gap-2 text-xs sm:text-sm font-bold text-amber-300">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span>위치: {zone.location}</span>
              </div>
              <p className="text-xs text-white/85 leading-relaxed pl-6 break-keep">
                {zone.summary}
              </p>
            </div>

            {/* 해당 챕터 수록 페이지 미리보기 (누르면 이동) */}
            <div className="mt-4">
              <div className="text-[10px] font-mono uppercase tracking-wider text-amber-200/80 mb-2 flex items-center gap-1.5">
                <Route className="w-3 h-3" />
                <span>CHAPTER {chapterNum} GUIDE ROUTE ({chapterPages.length} PAGES)</span>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {chapterPages.map((item) => (
                  <button
                    key={item.card.id}
                    type="button"
                    data-goto-page={item.pageIndex}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 transition flex items-center justify-between gap-2 text-[11px] sm:text-xs [&>*]:pointer-events-none"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono font-black text-amber-300 shrink-0">
                        {item.guideHeaderCode}
                      </span>
                      <span className="font-bold text-white truncate">{item.card.title}</span>
                    </div>
                    <span className="font-mono text-[10px] text-amber-200/80 shrink-0">
                      p.{item.pageNumber} →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 하단 페이지 번호 */}
          <div className="pt-2.5 border-t border-white/20 flex items-center justify-between text-[10px] sm:text-xs font-mono text-amber-200/80">
            <span>SINPO TRAVEL GUIDE · CH.{chapterNum}</span>
            <span>— {String(pageNumber).padStart(2, '0')} —</span>
          </div>
        </div>
      </div>
    );
  };

  // 본문 카드 1개 = 가이드북 1페이지 렌더링 헬퍼 (원문 데이터 100% 유지)
  const renderCardGuidePage = (item: EnrichedGuidePage) => {
    const { card, pageIndex, pageNumber, guideHeaderCode, chapterTitle } = item;
    const isLeft = pageIndex % 2 === 1;
    const meta = THEME_META[card.theme];
    const zoneInfo = THEME_ZONES.find((z) => z.id === card.theme);
    const isQuizCard = card.code.startsWith('QUIZ');
    const flowData = card.subContent ? parseStoryFlowNodes(card.subContent) : null;

    return (
      <div
        key={card.id}
        className={`guidebook-page-item ${isLeft ? 'guidebook-paper-left' : 'guidebook-paper-right'}`}
      >
        {/* 오른쪽 측면에 살짝 보이는 컬러 인덱스 탭 마커 장식 */}
        <div className="relative h-full w-full p-4 sm:p-6 flex flex-col justify-between">
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute top-6 ${
              isLeft ? 'left-0 rounded-r' : 'right-0 rounded-l'
            } w-1.5 h-14 ${meta.badgeBg} opacity-85`}
          />

          <div>
            {/* 1. 상단 가이드북식 머리말 ("PAST 01 · 과거의 신포" 등) */}
            <div
              className={`flex items-center justify-between gap-1.5 pb-2.5 mb-3 border-b-2 ${meta.headerBorder}`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-mono font-black tracking-wide shrink-0 ${meta.badgeBg} ${meta.badgeText}`}
                >
                  {guideHeaderCode} · {chapterTitle}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#2a1b0e]/10 text-[#2a1b0e] text-[9px] sm:text-[10px] font-bold shrink-0">
                  {isQuizCard ? '현장 QR 퀴즈' : '골목 스토리'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] sm:text-[11px] font-mono font-extrabold text-[#5c3d1e]">
                  {card.cardNumber}
                </span>
              </div>
            </div>

            {/* 2. 카드 제목 & 가이드북 큰 헤드라인 인용문(mainCopy) */}
            <div className="mb-3">
              <h3 className="text-base sm:text-xl font-black text-[#2a1b0e] tracking-tight font-storybook leading-snug mb-2">
                {card.title}
              </h3>

              {/* 인용 문구("신포시장의 시작에는 ...")를 가이드북의 큰 헤드라인처럼 강조 */}
              <div className="relative rounded-lg bg-white/85 border-l-4 border-[#8C6239] px-3 py-2 shadow-sm">
                <p
                  className={`text-xs sm:text-[15px] font-black leading-snug break-keep ${meta.accentText}`}
                >
                  “{card.mainCopy}”
                </p>
              </div>
            </div>

            {/* 3. 본문 설명 (body 원문 그대로) */}
            <p className="text-[11.5px] sm:text-[13px] text-[#3a2818] leading-relaxed mb-3 break-keep whitespace-pre-line">
              {card.body}
            </p>

            {/* 4. STORY FLOW (점과 선으로 이어진 여행 경로 타임라인 도식) */}
            {card.subContent && flowData && (
              <div className="mb-3 rounded-xl bg-white/90 border border-[#d8c39e] p-2.5 sm:p-3 shadow-sm">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-mono font-black uppercase tracking-wider text-[#8C6239]">
                    <Route className="w-3 h-3" />
                    STORY FLOW · TRAVEL ROUTE
                  </span>
                  <span className="text-[9px] font-mono text-[#8a6d4b]">
                    {flowData.nodes.length} STOPS
                  </span>
                </div>

                {/* 점(Dot)과 선(Line)으로 이어진 타임라인 도식 */}
                <div className="relative pl-1 space-y-1.5">
                  {flowData.nodes.map((nodeText, idx) => {
                    const isLast = idx === flowData.nodes.length - 1;
                    return (
                      <div key={`${card.id}-flow-${idx}`} className="relative flex items-start gap-2">
                        {/* 수직 연결선 */}
                        {!isLast && (
                          <span
                            aria-hidden="true"
                            className={`
                              absolute left-[7px] top-3.5 bottom-[-8px] w-[2px] ${meta.routeLineBg}
                            `}
                          />
                        )}
                        {/* 정류장 점(Dot) */}
                        <span
                          aria-hidden="true"
                          className={`relative z-10 mt-1 w-3.5 h-3.5 rounded-full ${meta.routeDotBg} text-white text-[8px] font-mono font-black flex items-center justify-center shrink-0 shadow-sm`}
                        >
                          {idx + 1}
                        </span>
                        {/* 경로 텍스트 */}
                        <div className="text-[10.5px] sm:text-[11.5px] font-bold text-[#2c1d10] leading-snug break-keep">
                          <span>{nodeText}</span>
                          {!isLast && (
                            <span className="ml-1 font-mono text-[10px] text-[#8C6239] font-black">
                              {flowData.connector}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. 해시태그 (여행 스탬프/스티커 느낌) */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {card.keywords.map((kw, idx) => (
                <span
                  key={kw}
                  className={`guidebook-stamp-tag px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-extrabold ${
                    idx % 2 === 0 ? '-rotate-1' : 'rotate-1'
                  } ${meta.stampClass}`}
                >
                  <Stamp className="w-2.5 h-2.5 mr-1 opacity-70 shrink-0" />#{kw}
                </span>
              ))}
            </div>
          </div>

          {/* 6. 하단 여백 마스킹테이프 & 여행자 노트 한 줄 문구 (footerQuote + 탐험 구역 안내) */}
          <div className="pt-2">
            <div className={`relative rounded-xl border p-2.5 sm:p-3 ${meta.memoBg} shadow-sm`}>
              {/* 마스킹 테이프 장식 */}
              <div
                aria-hidden="true"
                className="guidebook-masking-tape pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 w-20 h-4 -rotate-2 rounded-sm"
              />

              <p className="text-[11px] sm:text-xs font-storybook font-bold italic text-[#3b2614] leading-snug break-keep mb-1.5">
                “{card.footerQuote}”
              </p>

              {zoneInfo && (
                <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-dashed border-[#8C6239]/25 text-[9.5px] sm:text-[10.5px] text-[#6e5236]">
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 shrink-0 text-[#8C6239]" />
                    <span className="truncate">탐험 구역: {zoneInfo.location}</span>
                  </span>
                  <span className="shrink-0 font-bold text-[#8C6239]">
                    {zoneInfo.qrLabel}
                  </span>
                </div>
              )}
            </div>

            {/* 페이지 하단 번호 */}
            <div className="mt-2 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-[#7c5b38]">
              <span>SINPO 100 GUIDEBOOK</span>
              <span className="font-bold">— {String(pageNumber).padStart(2, '0')} —</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      id="theme-cards"
      className="scroll-mt-28 py-14 sm:py-22 bg-gradient-to-b from-[#faf6ee] via-[#f3ead8] to-[#faf6ee] border-b border-[#dccab0]"
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        {/* 섹션 헤더 */}
        <div className="text-center mb-6 sm:mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C6239] tracking-widest uppercase mb-2">
            <QrCode className="w-3.5 h-3.5" />
            SINPO TRAVEL GUIDEBOOK · PAST · NOW · FUTURE
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#2a1b0e] tracking-tight font-storybook">
            工자형 골목 따라 넘기는 <span className="text-[#8C6239]">신포 100년 여행 가이드북</span>
          </h2>
          <div className="w-12 h-[2px] bg-[#8C6239] mx-auto mt-3 mb-3" />
          <p className="text-xs sm:text-sm text-[#5c4328] max-w-2xl mx-auto leading-relaxed break-keep">
            신포국제시장의 <strong>工(공)자형 공간 구조</strong>에 맞춰 배치된{' '}
            <strong>과거(PAST 01~04) · 오늘(NOW 01~09) · 미래(FUTURE 01~07) 20개 스토리 &amp; 퀴즈</strong>를
            여행 가이드북으로 엮었습니다. 책 옆면의 인덱스 탭이나 목차를 눌러 원하는 페이지로 바로 이동해보세요.
          </p>
        </div>

        {/* 모바일 전용 상단 고정 인덱스 탭 바 (모바일 우선 대응: 화면 상단에서 즉시 챕터 전환) */}
        <div className="lg:hidden sticky top-16 z-30 -mx-3 px-3 py-2.5 mb-4 bg-[#faf6ee]/95 backdrop-blur-md border-y border-[#dccab0] shadow-sm">
          <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => flipToPage(PAGE_INDEX.COVER)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold shrink-0 border transition ${
                activeSection === 'COVER'
                  ? 'bg-[#3b2412] text-[#f9eed8] border-[#2a180b]'
                  : 'bg-white text-[#3b2412] border-[#d8c39e]'
              }`}
            >
              표지
            </button>
            <button
              type="button"
              onClick={() => flipToPage(PAGE_INDEX.TOC_LEFT)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold shrink-0 border transition ${
                activeSection === 'TOC'
                  ? 'bg-[#5c3d1e] text-white border-[#3b2412]'
                  : 'bg-white text-[#5c3d1e] border-[#d8c39e]'
              }`}
            >
              목차
            </button>
            <button
              type="button"
              onClick={() => flipToPage(PAGE_INDEX.CH1_DIVIDER)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold shrink-0 border transition ${
                activeSection === 'PAST' ? THEME_META.PAST.tabBgActive : THEME_META.PAST.tabBgIdle
              }`}
            >
              PAST ({pastPages.length})
            </button>
            <button
              type="button"
              onClick={() => flipToPage(PAGE_INDEX.CH2_DIVIDER)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold shrink-0 border transition ${
                activeSection === 'NOW' ? THEME_META.NOW.tabBgActive : THEME_META.NOW.tabBgIdle
              }`}
            >
              NOW ({nowPages.length})
            </button>
            <button
              type="button"
              onClick={() => flipToPage(PAGE_INDEX.CH3_DIVIDER)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold shrink-0 border transition ${
                activeSection === 'FUTURE'
                  ? THEME_META.FUTURE.tabBgActive
                  : THEME_META.FUTURE.tabBgIdle
              }`}
            >
              FUTURE ({futurePages.length})
            </button>
            <button
              type="button"
              onClick={() => flipToPage(PAGE_INDEX.BACK_COVER)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold shrink-0 border transition ${
                activeSection === 'BACK'
                  ? 'bg-[#3b2412] text-[#f9eed8] border-[#2a180b]'
                  : 'bg-white text-[#3b2412] border-[#d8c39e]'
              }`}
            >
              뒷표지
            </button>
          </div>
        </div>

        {/* 상단 현재 챕터·페이지 진행 표시 바 */}
        <div className="max-w-4xl mx-auto mb-5 bg-white/90 border border-[#dccab0] rounded-2xl p-3 sm:p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-extrabold shadow-sm ${currentBadge.color}`}
              >
                {currentBadge.label}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-xs text-[#6e5236] font-medium">
                <Hand className="w-3.5 h-3.5 text-[#8C6239]" />
                {orientation === 'portrait'
                  ? '좌우 스와이프 또는 버튼으로 넘기기'
                  : '모서리 클릭·드래그, 옆면 인덱스 탭 또는 ← → 키로 넘기기'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-mono font-bold text-[#3b2412]">
                {getPageStatusLabel()}
              </span>
              <button
                type="button"
                onClick={() => flipToPage(PAGE_INDEX.TOC_LEFT)}
                className="px-2.5 py-1 rounded-lg bg-[#f3e7d3] hover:bg-[#e6d3b3] text-[#3b2412] text-xs font-bold transition"
              >
                목차 보기
              </button>
            </div>
          </div>

          {/* 진행 게이지 바 */}
          <div className="w-full h-2 rounded-full bg-[#eadec9] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#8C6239] via-[#E5A93C] to-[#00ACC1] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 3D 가이드북 본체 + 데스크톱 우측 책 옆면 컬러 인덱스 탭 */}
        <div className="sinpo-guidebook-stage relative max-w-5xl mx-auto flex items-center justify-center">
          {/* 가이드북 마운트 영역 */}
          <div className="w-full max-w-[940px] relative">
            {!isReady && (
              <div className="min-h-[560px] flex flex-col items-center justify-center rounded-2xl bg-white/70 border border-[#dccab0] p-8 text-center">
                <BookOpen className="w-10 h-10 text-[#8C6239] animate-pulse mb-3" />
                <p className="text-sm font-bold text-[#2a1b0e]">
                  신포국제시장 100년 여행 가이드북을 펼치는 중입니다...
                </p>
              </div>
            )}

            <div
              ref={mountRef}
              className="sinpo-guidebook-mount w-full flex justify-center items-center"
            />
          </div>

          {/* 데스크톱 책 옆면(우측 가장자리) 색깔 인덱스 탭 (필터 버튼 역할을 대체) */}
          <div
            aria-label="가이드북 챕터 인덱스 탭"
            className="hidden lg:flex flex-col gap-2 -ml-1 z-20 select-none"
          >
            <button
              type="button"
              onClick={() => flipToPage(PAGE_INDEX.COVER)}
              className={`group pl-3 pr-4 py-2.5 rounded-r-xl border-y border-r text-left transition-all shadow-md ${
                activeSection === 'COVER'
                  ? 'bg-[#3b2412] text-[#f9eed8] border-[#7c5632] translate-x-1.5 w-36'
                  : 'bg-[#4a2e18]/90 text-[#e8d5b5] border-[#694827] hover:translate-x-1 w-32'
              }`}
            >
              <span className="block text-[9px] font-mono uppercase tracking-wider opacity-75">
                COVER
              </span>
              <span className="block text-xs font-extrabold">앞표지</span>
            </button>

            <button
              type="button"
              onClick={() => flipToPage(PAGE_INDEX.TOC_LEFT)}
              className={`group pl-3 pr-4 py-2.5 rounded-r-xl border-y border-r text-left transition-all shadow-md ${
                activeSection === 'TOC'
                  ? 'bg-[#5c3d1e] text-white border-[#8C6239] translate-x-1.5 w-36'
                  : 'bg-[#f3e7d3] text-[#3b2412] border-[#cbb382] hover:translate-x-1 w-32'
              }`}
            >
              <span className="block text-[9px] font-mono uppercase tracking-wider opacity-75">
                INDEX · p.2–3
              </span>
              <span className="block text-xs font-extrabold">목차 · 공간도</span>
            </button>

            <button
              type="button"
              onClick={() => flipToPage(PAGE_INDEX.CH1_DIVIDER)}
              className={`group pl-3 pr-4 py-3 rounded-r-xl border-y border-r text-left transition-all shadow-md ${
                activeSection === 'PAST'
                  ? 'bg-[#8C6239] text-white border-[#5c3d1e] translate-x-2 w-40 ring-2 ring-[#8C6239]/40'
                  : 'bg-[#f3e7d3] text-[#5c3d1e] border-[#cbb382] hover:bg-[#ead8ba] hover:translate-x-1 w-36'
              }`}
            >
              <span className="block text-[9px] font-mono font-bold uppercase tracking-wider">
                CH.1 · PAST (01–04)
              </span>
              <span className="block text-xs font-black">과거의 신포</span>
              <span className="block text-[10px] opacity-80">푸성귀전 · 세로길 우측</span>
            </button>

            <button
              type="button"
              onClick={() => flipToPage(PAGE_INDEX.CH2_DIVIDER)}
              className={`group pl-3 pr-4 py-3 rounded-r-xl border-y border-r text-left transition-all shadow-md ${
                activeSection === 'NOW'
                  ? 'bg-[#E5A93C] text-[#2a1b0e] border-[#b87d14] translate-x-2 w-40 ring-2 ring-[#E5A93C]/50'
                  : 'bg-[#fbf0d5] text-[#6e490a] border-[#e2c684] hover:bg-[#f6e4b8] hover:translate-x-1 w-36'
              }`}
            >
              <span className="block text-[9px] font-mono font-bold uppercase tracking-wider">
                CH.2 · NOW (01–09)
              </span>
              <span className="block text-xs font-black">오늘의 신포</span>
              <span className="block text-[10px] opacity-80">메인시장 윗길·아랫길</span>
            </button>

            <button
              type="button"
              onClick={() => flipToPage(PAGE_INDEX.CH3_DIVIDER)}
              className={`group pl-3 pr-4 py-3 rounded-r-xl border-y border-r text-left transition-all shadow-md ${
                activeSection === 'FUTURE'
                  ? 'bg-[#00ACC1] text-white border-[#007c8a] translate-x-2 w-40 ring-2 ring-[#00ACC1]/40'
                  : 'bg-[#e2f4f7] text-[#00606b] border-[#a5dce3] hover:bg-[#ccecf1] hover:translate-x-1 w-36'
              }`}
            >
              <span className="block text-[9px] font-mono font-bold uppercase tracking-wider">
                CH.3 · FUTURE (01–07)
              </span>
              <span className="block text-xs font-black">미래의 신포</span>
              <span className="block text-[10px] opacity-80">등대공원 · 세로길 좌측</span>
            </button>

            <button
              type="button"
              onClick={() => flipToPage(PAGE_INDEX.BACK_COVER)}
              className={`group pl-3 pr-4 py-2.5 rounded-r-xl border-y border-r text-left transition-all shadow-md ${
                activeSection === 'BACK'
                  ? 'bg-[#3b2412] text-[#f9eed8] border-[#7c5632] translate-x-1.5 w-36'
                  : 'bg-[#4a2e18]/90 text-[#e8d5b5] border-[#694827] hover:translate-x-1 w-32'
              }`}
            >
              <span className="block text-[9px] font-mono uppercase tracking-wider opacity-75">
                FINALE
              </span>
              <span className="block text-xs font-extrabold">뒷표지 · 보물찾기</span>
            </button>
          </div>
        </div>

        {/* 하단 페이지 조작 컨트롤러 (이전 / 목차 / 처음 / 다음) */}
        <div className="max-w-xl mx-auto mt-6 flex items-center justify-between gap-2 sm:gap-4 bg-white border border-[#dccab0] rounded-2xl p-2.5 sm:p-3 shadow-sm">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentPage === 0}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#3b2412] text-[#f9eed8] hover:bg-[#52331b] disabled:opacity-40 disabled:pointer-events-none transition shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>이전 장</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => flipToPage(PAGE_INDEX.COVER)}
              className="inline-flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-bold text-[#5c3d1e] hover:bg-[#f3e7d3] transition"
              title="앞표지로 돌아가기"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">표지</span>
            </button>
            <button
              type="button"
              onClick={() => flipToPage(PAGE_INDEX.TOC_LEFT)}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-extrabold bg-[#f3e7d3] text-[#3b2412] hover:bg-[#e6d3b3] transition"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>목차 페이지</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentPage >= TOTAL_PAGES - 1}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#8C6239] text-white hover:bg-[#734f2c] disabled:opacity-40 disabled:pointer-events-none transition shadow-sm"
          >
            <span>다음 장</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* ============================================================
            StPageFlip 복제용 숨김 템플릿 (총 22페이지: 0 ~ 21)
           ============================================================ */}
        <div ref={templateRef} className="sr-only" aria-hidden="true">
          {/* [Page 1 / index 0] 앞표지 (Hardcover) */}
          <div className="guidebook-page-item guidebook-cover" data-density="hard">
            <div className="relative h-full w-full p-6 sm:p-8 flex flex-col justify-between">
              {/* 코너 스탬프 장식 */}
              <div className="flex items-center justify-between border-b border-amber-200/25 pb-3">
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#E5A93C] uppercase">
                  <Compass className="w-4 h-4" />
                  SINPO ALLEY TRAVEL GUIDEBOOK
                </span>
                <span className="px-2 py-0.5 rounded border border-amber-300/40 text-[10px] font-mono text-amber-200">
                  PAST · NOW · FUTURE
                </span>
              </div>

              {/* 중앙 표지 타이틀 영역 */}
              <div className="my-auto py-4 text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5A93C]/20 border border-[#E5A93C]/50 text-[#E5A93C] text-[11px] font-extrabold mb-4">
                  <QrCode className="w-3.5 h-3.5" />
                  工자형 골목 따라 만나는 3대 테마 20선
                </div>

                <h3 className="text-2xl sm:text-4xl font-black tracking-tight font-storybook text-[#fcf5e5] leading-tight mb-3">
                  신포국제시장
                  <br />
                  <span className="text-[#E5A93C]">100년 여행 가이드</span>
                </h3>

                <div className="w-16 h-0.5 bg-[#E5A93C] mx-auto my-4" />

                <p className="text-xs sm:text-sm text-amber-100/85 max-w-xs mx-auto leading-relaxed break-keep">
                  개항기 푸성귀전 장터에서 오늘의 K-관광마켓·인천지역유산, 그리고 다음 100년의 미래까지 한 장씩 넘기며 탐험하는 골목 여행서
                </p>

                {/* 3대 챕터 요약 뱃지 */}
                <div className="mt-6 grid grid-cols-3 gap-2 text-left">
                  <div className="rounded-lg bg-white/10 border border-white/15 p-2.5">
                    <span className="block text-[9px] font-mono font-bold text-amber-300">
                      CHAPTER 1
                    </span>
                    <span className="block text-xs font-black text-white mt-0.5">과거의 신포</span>
                    <span className="block text-[10px] text-amber-100/75 mt-0.5">PAST 01~04</span>
                  </div>
                  <div className="rounded-lg bg-white/10 border border-white/15 p-2.5">
                    <span className="block text-[9px] font-mono font-bold text-[#E5A93C]">
                      CHAPTER 2
                    </span>
                    <span className="block text-xs font-black text-white mt-0.5">오늘의 신포</span>
                    <span className="block text-[10px] text-amber-100/75 mt-0.5">NOW 01~09</span>
                  </div>
                  <div className="rounded-lg bg-white/10 border border-white/15 p-2.5">
                    <span className="block text-[9px] font-mono font-bold text-[#4dd0e1]">
                      CHAPTER 3
                    </span>
                    <span className="block text-xs font-black text-white mt-0.5">미래의 신포</span>
                    <span className="block text-[10px] text-amber-100/75 mt-0.5">FUTURE 01~07</span>
                  </div>
                </div>
              </div>

              {/* 하단 표지 넘김 안내 */}
              <div className="pt-3 border-t border-amber-200/25 flex items-center justify-between text-[11px] text-amber-200/90">
                <span className="font-mono">SINPO INTERNATIONAL MARKET</span>
                <span className="inline-flex items-center gap-1 font-bold text-[#E5A93C]">
                  표지를 넘겨 목차 보기 →
                </span>
              </div>
            </div>
          </div>

          {/* [Page 2 / index 1] 목차 Left (工자형 공간 안내 & Chapter 1 목차) */}
          <div className="guidebook-page-item guidebook-paper-left">
            <div className="h-full w-full p-4 sm:p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b-2 border-[#8C6239]/35">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-black text-[#8C6239] uppercase">
                    <Compass className="w-3.5 h-3.5" />
                    CONTENTS · PART 1
                  </span>
                  <span className="text-[11px] font-bold text-[#5c3d1e]">여행 가이드북 목차</span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-[#2a1b0e] font-storybook mb-1">
                  工자형 골목 공간 안내 & 목차
                </h3>
                <p className="text-[11px] text-[#5c4328] mb-3 leading-snug">
                  원하는 챕터나 페이지를 누르면 해당 가이드북 페이지로 바로 펼쳐집니다.
                </p>

                {/* 工자형 3대 테마 존 요약 (THEME_ZONES 원문 데이터) */}
                <div className="mb-3.5 rounded-xl bg-white/90 border border-[#d8c39e] p-3 space-y-2 shadow-sm">
                  <div className="text-[10px] font-mono font-black text-[#8C6239] uppercase tracking-wider flex items-center gap-1">
                    <Navigation className="w-3 h-3" />
                    工(공)자형 시장 3대 QR 테마 구역
                  </div>
                  {THEME_ZONES.map((z) => {
                    const targetIdx =
                      z.id === 'PAST'
                        ? PAGE_INDEX.CH1_DIVIDER
                        : z.id === 'NOW'
                        ? PAGE_INDEX.CH2_DIVIDER
                        : PAGE_INDEX.CH3_DIVIDER;
                    const meta = THEME_META[z.id];
                    return (
                      <button
                        key={z.id}
                        type="button"
                        data-goto-page={targetIdx}
                        className="w-full text-left rounded-lg bg-[#fdfaf3] hover:bg-[#f3e7d3] border border-[#e4d5b7] p-2 transition flex items-start justify-between gap-2 [&>*]:pointer-events-none"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-black ${meta.badgeBg} ${meta.badgeText}`}
                            >
                              {z.qrLabel}
                            </span>
                            <span className="text-xs font-extrabold text-[#2a1b0e] truncate">
                              {z.title}
                            </span>
                          </div>
                          <p className="text-[10px] text-[#5c4328] mt-0.5 truncate">
                            위치: {z.location}
                          </p>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-[#8C6239] shrink-0">
                          p.{targetIdx + 1} →
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Chapter 1 목차 목록 */}
                <div className="rounded-xl bg-[#f8efe2]/80 border border-[#8C6239]/30 p-3">
                  <button
                    type="button"
                    data-goto-page={PAGE_INDEX.CH1_DIVIDER}
                    className="w-full text-left flex items-center justify-between pb-1.5 mb-2 border-b border-[#8C6239]/25 [&>*]:pointer-events-none"
                  >
                    <span className="text-xs sm:text-sm font-black text-[#8C6239]">
                      Chapter 1 · 과거의 신포 (PAST)
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#8C6239]">
                      간지 p.{PAGE_INDEX.CH1_DIVIDER + 1}
                    </span>
                  </button>
                  <div className="space-y-1.5">
                    {pastPages.map((p) => (
                      <button
                        key={p.card.id}
                        type="button"
                        data-goto-page={p.pageIndex}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#f3e7d3] border border-[#dccab0] transition flex items-center justify-between gap-2 text-xs [&>*]:pointer-events-none"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="px-1.5 py-0.5 rounded bg-[#8C6239] text-white text-[10px] font-mono font-bold shrink-0">
                            {p.guideHeaderCode}
                          </span>
                          <span className="font-bold text-[#2a1b0e] truncate">{p.card.title}</span>
                        </div>
                        <span className="font-mono text-[11px] font-bold text-[#8C6239] shrink-0">
                          p.{p.pageNumber}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-[#7c5b38]">
                <span>TABLE OF CONTENTS</span>
                <span className="font-bold">— 02 —</span>
              </div>
            </div>
          </div>

          {/* [Page 3 / index 2] 목차 Right (Chapter 2 & Chapter 3 목차) */}
          <div className="guidebook-page-item guidebook-paper-right">
            <div className="h-full w-full p-4 sm:p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b-2 border-[#8C6239]/35">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-black text-[#8C6239] uppercase">
                    <Compass className="w-3.5 h-3.5" />
                    CONTENTS · PART 2
                  </span>
                  <span className="text-[11px] font-bold text-[#5c3d1e]">항목을 누르면 이동</span>
                </div>

                {/* Chapter 2 목차 목록 */}
                <div className="mb-3 rounded-xl bg-[#fff8e6]/90 border border-[#E5A93C]/45 p-2.5 sm:p-3">
                  <button
                    type="button"
                    data-goto-page={PAGE_INDEX.CH2_DIVIDER}
                    className="w-full text-left flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#E5A93C]/35 [&>*]:pointer-events-none"
                  >
                    <span className="text-xs sm:text-sm font-black text-[#9e690c]">
                      Chapter 2 · 오늘의 신포 (NOW)
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#9e690c]">
                      간지 p.{PAGE_INDEX.CH2_DIVIDER + 1}
                    </span>
                  </button>
                  <div className="grid grid-cols-1 gap-1">
                    {nowPages.map((p) => (
                      <button
                        key={p.card.id}
                        type="button"
                        data-goto-page={p.pageIndex}
                        className="w-full text-left px-2 py-1 rounded-md bg-white hover:bg-[#fbf0d5] border border-[#e6d2a8] transition flex items-center justify-between gap-2 text-[11px] [&>*]:pointer-events-none"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="px-1.5 py-0.5 rounded bg-[#E5A93C] text-[#2a1b0e] text-[9.5px] font-mono font-black shrink-0">
                            {p.guideHeaderCode}
                          </span>
                          <span className="font-bold text-[#2a1b0e] truncate">{p.card.title}</span>
                        </div>
                        <span className="font-mono text-[10px] font-bold text-[#9e690c] shrink-0">
                          p.{p.pageNumber}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chapter 3 목차 목록 */}
                <div className="rounded-xl bg-[#ecf9fb]/90 border border-[#00ACC1]/35 p-2.5 sm:p-3">
                  <button
                    type="button"
                    data-goto-page={PAGE_INDEX.CH3_DIVIDER}
                    className="w-full text-left flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#00ACC1]/25 [&>*]:pointer-events-none"
                  >
                    <span className="text-xs sm:text-sm font-black text-[#007c8a]">
                      Chapter 3 · 미래의 신포 (FUTURE)
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#007c8a]">
                      간지 p.{PAGE_INDEX.CH3_DIVIDER + 1}
                    </span>
                  </button>
                  <div className="grid grid-cols-1 gap-1">
                    {futurePages.map((p) => (
                      <button
                        key={p.card.id}
                        type="button"
                        data-goto-page={p.pageIndex}
                        className="w-full text-left px-2 py-1 rounded-md bg-white hover:bg-[#e2f4f7] border border-[#bce3e8] transition flex items-center justify-between gap-2 text-[11px] [&>*]:pointer-events-none"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="px-1.5 py-0.5 rounded bg-[#00ACC1] text-white text-[9.5px] font-mono font-black shrink-0">
                            {p.guideHeaderCode}
                          </span>
                          <span className="font-bold text-[#2a1b0e] truncate">{p.card.title}</span>
                        </div>
                        <span className="font-mono text-[10px] font-bold text-[#007c8a] shrink-0">
                          p.{p.pageNumber}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-[#7c5b38]">
                <span>TABLE OF CONTENTS</span>
                <span className="font-bold">— 03 —</span>
              </div>
            </div>
          </div>

          {/* [Page 4 / index 3] Chapter 1 구분 간지 (과거의 신포) */}
          {renderChapterDividerPage(PAGE_INDEX.CH1_DIVIDER, 1, pastZone, pastPages)}

          {/* [Page 5~6 / index 4~5] PAST 01 ~ PAST 02 */}
          {pastPages.map((item) => renderCardGuidePage(item))}

          {/* [Page 7 / index 6] Chapter 2 구분 간지 (오늘의 신포) */}
          {renderChapterDividerPage(PAGE_INDEX.CH2_DIVIDER, 2, nowZone, nowPages)}

          {/* [Page 8~14 / index 7~13] NOW 01 ~ NOW 07 */}
          {nowPages.map((item) => renderCardGuidePage(item))}

          {/* [Page 15 / index 14] Chapter 3 구분 간지 (미래의 신포) */}
          {renderChapterDividerPage(PAGE_INDEX.CH3_DIVIDER, 3, futureZone, futurePages)}

          {/* [Page 16~21 / index 15~20] FUTURE 01 ~ FUTURE 06 */}
          {futurePages.map((item) => renderCardGuidePage(item))}

          {/* [Page 22 / index 21] 뒷표지 (마무리 문구 + 디지털 보물찾기로 이어지는 버튼) */}
          <div className="guidebook-page-item guidebook-cover" data-density="hard">
            <div className="relative h-full w-full p-6 sm:p-8 flex flex-col justify-between text-center">
              <div className="flex items-center justify-between border-b border-amber-200/25 pb-3 text-[10px] sm:text-xs font-mono text-amber-200/90">
                <span>SINPO 100 YEARS GUIDE</span>
                <span>FINALE · p.{TOTAL_PAGES}</span>
              </div>

              <div className="my-auto py-4">
                <div className="w-14 h-14 rounded-2xl bg-[#E5A93C]/20 border border-[#E5A93C]/50 flex items-center justify-center mx-auto mb-4 text-[#E5A93C]">
                  <Compass className="w-7 h-7" />
                </div>

                <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[11px] font-mono font-bold mb-3">
                  PAST · NOW · FUTURE COMPLETE
                </span>

                <h3 className="text-xl sm:text-2xl font-black font-storybook text-[#fcf5e5] leading-snug mb-3">
                  100년의 골목 여행을 마친 당신,
                  <br />
                  <span className="text-[#E5A93C]">이제 시장 현장에서 보물을 찾아보세요!</span>
                </h3>

                <p className="text-xs sm:text-sm text-amber-100/85 leading-relaxed mb-6 break-keep max-w-xs mx-auto">
                  가이드북에서 읽은 과거의 푸성귀전, 오늘의 대표 먹거리와 골목, 미래의 등대공원까지!
                  신포국제시장 곳곳에 숨겨진 QR을 찾는 디지털 보물찾기가 이어집니다.
                </p>

                {/* 디지털 보물찾기로 이어지는 버튼 (자식 요소 pointer-events-none 처리로 StPageFlip 내부 클릭 보장) */}
                <div className="space-y-2.5 max-w-xs mx-auto">
                  <a
                    href="/event"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#E5A93C] hover:bg-[#f0b84d] text-[#2a1b0e] font-black text-xs sm:text-sm shadow-lg transition [&>*]:pointer-events-none"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>디지털 보물찾기 참여하러 가기</span>
                  </a>

                  <button
                    type="button"
                    data-goto-page={PAGE_INDEX.COVER}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-amber-100 font-bold text-xs transition [&>*]:pointer-events-none"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>앞표지로 다시 돌아가기</span>
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-amber-200/25 flex items-center justify-between text-[10px] font-mono text-amber-200/70">
                <span>@sinpo.dream</span>
                <span>— {TOTAL_PAGES} / {TOTAL_PAGES} —</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
