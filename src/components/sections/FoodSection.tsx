"use client";

import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { FoodCategory } from '../../types';

interface StorePortfolioItem {
  id: string;
  name: string;
  category: FoodCategory;
  categoryLabel: string;
  quote: string;
  imageUrl: string;
  likes: number;
  tip: string;
  since: string;
}

const PORTFOLIO_ITEMS: StorePortfolioItem[] = [
  {
    id: 'dakgangjeong',
    name: '신포원조닭강정',
    category: 'specialty',
    categoryLabel: '대표명물',
    quote: '“매콤달콤한 특제 양념과 가마솥 바삭함의 원조”',
    imageUrl: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80',
    likes: 68,
    tip: '포장 전용 줄과 매장 식사 줄이 구분되어 있습니다.',
    since: 'since 1985',
  },
  {
    id: 'dumpling',
    name: '산동화덕만두·공갈빵',
    category: 'snack',
    categoryLabel: '별미간식',
    quote: '“40년 전통 숯불 옹기 화덕에서 구워낸 담백한 풍미”',
    imageUrl: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80',
    likes: 69,
    tip: '화덕에서 갓 구워져 나왔을 때가 가장 바삭합니다.',
    since: 'since 1978',
  },
  {
    id: 'jjolmyeon',
    name: '신포우리쫄면·만두',
    category: 'meal',
    categoryLabel: '식사/노포',
    quote: '“쫄면의 발상지 인천의 자부심, 수제 튀김만두와의 조화”',
    imageUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80',
    likes: 62,
    tip: '매운 쫄면에 바삭한 튀김만두를 싸서 드셔보세요.',
    since: 'since 1971',
  },
  {
    id: 'noodle',
    name: '신포순대·맷돌칼국수',
    category: 'meal',
    categoryLabel: '식사/노포',
    quote: '“깊고 진한 사골 육수와 손으로 썬 쫄깃한 칼국수 면발”',
    imageUrl: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=800&q=80',
    likes: 63,
    tip: '튀김 부스러기와 다진 양념을 국물에 풀어드세요.',
    since: 'since 1978',
  },
];

const FILTER_TABS: { id: FoodCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'specialty', label: '대표명물' },
  { id: 'snack', label: '별미간식' },
  { id: 'meal', label: '식사/노포' },
];

export const FoodSection: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<FoodCategory>('all');
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const handleLike = (id: string) => {
    setLikedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredItems = PORTFOLIO_ITEMS.filter((item) => {
    if (selectedFilter === 'all') return true;
    return item.category === selectedFilter;
  });

  return (
    <section id="food" className="w-full bg-white scroll-mt-28">
      {/* 1. Yellow Story Market Banner (Kwangjang Market Benchmark) */}
      <div className="relative w-full py-16 sm:py-20 bg-[#E5A93C] overflow-hidden flex flex-col items-center justify-center text-center px-4">
        {/* Giant Watermark Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="text-[70px] sm:text-[110px] md:text-[140px] font-black text-white/30 tracking-tight whitespace-nowrap">
            sinpomarket
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#3d290c] tracking-tight">
            스토리마켓
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#3d290c]/90 font-normal leading-relaxed">
            수십년 동안 한우물을 파온 뚝심있는 가게들이 신포국제시장을 이루고 있습니다.
          </p>
          <div className="pt-2">
            <a
              href="#food"
              className="inline-block px-7 py-2 rounded-full border border-[#3d290c] text-[#3d290c] text-sm font-semibold hover:bg-[#3d290c] hover:text-white transition-all duration-200"
            >
              스토리마켓 가기
            </a>
          </div>
        </div>
      </div>

      {/* 2. Dark Portfolio Filter Bar (Kwangjang Market Benchmark) */}
      <div className="bg-[#222222] text-white py-3.5 px-4 sm:px-8 border-b border-black/40">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Left Title */}
          <span className="text-base sm:text-lg font-bold text-white tracking-wide">
            {selectedFilter === 'all'
              ? 'All'
              : FILTER_TABS.find((t) => t.id === selectedFilter)?.label}
          </span>

          {/* Right Filter Options */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
            <span className="hidden sm:inline font-medium text-gray-500">
              Sort Portfolio:
            </span>
            {FILTER_TABS.map((tab) => {
              const active = selectedFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilter(tab.id)}
                  type="button"
                  className={`transition-colors py-0.5 ${
                    active
                      ? 'text-[#00acc1] font-bold underline underline-offset-4'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. 4-Column Portfolio Grid (Kwangjang Market Benchmark) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
            const isLiked = !!likedMap[item.id];
            const currentLikes = item.likes + (isLiked ? 1 : 0);

            return (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
              >
                {/* Photo with Overlay Text */}
                <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                  <img
                    src={item.imageUrl}
                    alt={`${item.name} - 신포국제시장 ${item.categoryLabel} (${item.since})`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle Text Overlay on Image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex flex-col justify-between">
                    <span className="text-[10px] bg-black/60 text-amber-300 px-2 py-0.5 rounded self-start font-mono">
                      {item.since}
                    </span>
                    <div>
                      <p className="text-white text-xs font-serif italic drop-shadow-md leading-snug">
                        {item.quote}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Bottom Meta (Title & Like Count) */}
                <div className="p-3.5 flex items-center justify-between border-t border-gray-100">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#8C6239] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                      {item.tip}
                    </p>
                  </div>

                  {/* Likes counter */}
                  <button
                    onClick={() => handleLike(item.id)}
                    type="button"
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors ml-2 shrink-0"
                    title="좋아요"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'
                      }`}
                    />
                    <span className={`text-[12px] ${isLiked ? 'text-red-500 font-bold' : ''}`}>
                      {currentLikes}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
