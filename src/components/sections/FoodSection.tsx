"use client";

import React, { useState } from 'react';
import { Award, Sparkles, ArrowRight } from 'lucide-react';
import { FoodCategory } from '../../types';

interface StorePortfolioItem {
  id: string;
  name: string;
  category: FoodCategory;
  categoryLabel: string;
  quote: string;
  imageUrl: string;
  badge: string;
  tip: string;
  since: string;
}

const PORTFOLIO_ITEMS: StorePortfolioItem[] = [
  {
    id: 'dakgangjeong',
    name: '신포 원조 닭강정',
    category: 'specialty',
    categoryLabel: '대표명물',
    quote: '“매콤달콤한 특제 양념과 가마솥 바삭함의 원조”',
    imageUrl: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80',
    badge: '대표 명물',
    tip: '포장 전용 줄과 매장 식사 줄이 구분되어 있습니다.',
    since: 'since 1985',
  },
  {
    id: 'dumpling',
    name: '오색만두 & 화덕만두·공갈빵',
    category: 'snack',
    categoryLabel: '별미간식',
    quote: '“정성 가득한 오색만두와 숯불 옹기 화덕에서 구워낸 공갈빵”',
    imageUrl: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80',
    badge: '화덕 별미',
    tip: '오색만두와 갓 구워낸 바삭한 공갈빵은 신포의 필수 별미입니다.',
    since: 'since 1978',
  },
  {
    id: 'jjolmyeon',
    name: '원조 신포 쫄면 (광신제면 발상)',
    category: 'meal',
    categoryLabel: '식사/노포',
    quote: '“1970년대 초 인천 중구 경동 광신제면에서 탄생한 국민 분식 쫄면의 고향”',
    imageUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80',
    badge: '1970s 원조',
    tip: '우연히 뽑힌 굵은 면발에서 시작된 원조 쫄면과 만두의 조화!',
    since: 'since 1970s',
  },
  {
    id: 'noodle',
    name: '신포동 칼국수골목 & 찹쌀순대',
    category: 'meal',
    categoryLabel: '식사/노포',
    quote: '“시장 맞은편 칼국수골목의 진한 육수와 쫄깃한 손칼국수”',
    imageUrl: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=800&q=80',
    badge: '노포 별미',
    tip: '푸성귀전 조형물과 수선 골목 인근에서 따뜻한 한 그릇을 즐겨보세요.',
    since: 'since 1978',
  },
];

const FILTER_TABS: { id: FoodCategory; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'specialty', label: '대표명물' },
  { id: 'snack', label: '별미간식' },
  { id: 'meal', label: '식사/노포' },
];

export const FoodSection: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<FoodCategory>('all');

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
            닭강정 · 공갈빵 · 오색만두 · 원조 쫄면까지, 오랜 시간 시장을 지켜온 상인들의 정성과 신포의 맛 이야기를 만나보세요.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs font-bold text-[#3d290c]">
            <span className="bg-white/40 px-3 py-1 rounded-full">🍗 닭강정</span>
            <span className="bg-white/40 px-3 py-1 rounded-full">🥖 공갈빵</span>
            <span className="bg-white/40 px-3 py-1 rounded-full">🥟 오색만두</span>
            <span className="bg-white/40 px-3 py-1 rounded-full">🍜 원조 쫄면</span>
          </div>
        </div>
      </div>

      {/* 2. Dark Portfolio Filter Bar */}
      <div className="bg-[#222222] text-white py-3.5 px-4 sm:px-8 border-b border-black/40">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Left Title */}
          <span className="text-base sm:text-lg font-bold text-white tracking-wide">
            {selectedFilter === 'all'
              ? '전체 먹거리'
              : FILTER_TABS.find((t) => t.id === selectedFilter)?.label}
          </span>

          {/* Right Filter Options */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
            <span className="hidden sm:inline font-medium text-gray-500">
              먹거리 분류:
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

      {/* 3. 4-Column Portfolio Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
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

                {/* Card Bottom Meta (Title & Specialty Badge) */}
                <div className="p-3.5 flex items-center justify-between border-t border-gray-100">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#8C6239] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                      {item.tip}
                    </p>
                  </div>

                  {/* Specialty Badge */}
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-[#8C6239]/25 px-2.5 py-0.5 text-[10px] font-bold text-[#8C6239] ml-2 shrink-0">
                    <Award className="w-3 h-3 text-[#E5A93C]" />
                    {item.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. 원조 쫄면 탄생 비화 (광신제면 스토리 박스) */}
        <div className="mt-10 rounded-xl border border-[#8C6239]/25 bg-[#fff8ec] p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded bg-[#8C6239] px-2.5 py-0.5 text-[11px] font-bold text-white">
                  <Sparkles className="w-3 h-3" />
                  NOW FOOD STORY · 원조 탄생 비화
                </span>
                <span className="text-xs font-bold text-[#8C6239]">
                  쫄면의 고향, 인천 중구
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-[#2a1b0e]">
                전국에서 먹는 ‘쫄면’이 1970년대 초 인천 중구에서 태어났다는 사실, 알고 계셨나요?
              </h3>
              <p className="text-xs sm:text-sm text-[#5b4a38] leading-relaxed">
                쫄면은 <strong>1970년대 초 인천 중구 경동의 ‘광신제면’</strong>에서 시작된 것으로 알려져 있습니다. 냉면을 만들던 과정에서 실수로 평소보다 굵은 면발이 뽑혔고, 이 면을 버리지 않고 인근 분식점에 나누어 주어 채소와 매콤달콤한 고추장 양념에 비벼 판매하면서 오늘날 대한민국 국민 분식 ‘쫄면’이 탄생했습니다.
              </p>
              <p className="text-xs font-semibold text-[#8C6239] italic pt-1">
                “우연히 태어난 한 가닥의 면이, 대한민국의 국민 분식이 되었습니다.”
              </p>
            </div>

            {/* Flow Steps */}
            <div className="flex flex-col gap-2 shrink-0 bg-white/90 border border-[#8C6239]/20 rounded-lg p-4 text-xs">
              <span className="text-[11px] font-bold text-[#8C6239] uppercase tracking-wider mb-1">
                ORIGIN OF JJOLMYEON (1970s)
              </span>
              {[
                '1. 1970년대 초 인천 중구 경동 광신제면',
                '2. 냉면 제조 중 실수로 굵은 면발 탄생',
                '3. 인근 분식점에서 채소·매콤한 양념 결합',
                '4. 대한민국 국민 분식 ‘쫄면’으로 전국 확산',
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-700 font-medium">
                  <ArrowRight className="w-3.5 h-3.5 text-[#E5A93C] shrink-0" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
