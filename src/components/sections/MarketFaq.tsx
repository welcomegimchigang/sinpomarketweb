"use client";

import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { MARKET_FAQ_ITEMS } from '../../data/marketData';

export const MarketFaq: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(MARKET_FAQ_ITEMS[0]?.id ?? null);

  return (
    <section id="faq" className="scroll-mt-28 bg-[#fafafa] py-16 sm:py-20 border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#8C6239] tracking-widest uppercase block mb-1">
            FAQ &amp; VISITOR GUIDE
          </span>
          <h2 className="text-2xl sm:text-3xl font-light text-[#444444] tracking-tight">
            신포국제시장(신포시장) 자주 묻는 질문
          </h2>
          <div className="w-12 h-[2px] bg-[#8C6239] mx-auto mt-3 mb-3" />
          <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
            영업시간, 대표 먹거리 이용 팁, 주차장 혜택, 온누리상품권 사용 등 신포시장 방문 전 꼭 필요한 알찬 정보를 모았습니다.
          </p>
        </div>

        <div className="space-y-3">
          {MARKET_FAQ_ITEMS.map((item) => {
            const open = openId === item.id;
            return (
              <div
                key={item.id}
                className={`overflow-hidden rounded-xl border bg-white transition-all duration-200 ${
                  open ? 'border-[#8C6239] shadow-sm' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : item.id)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors"
                >
                  <span className="flex items-center gap-3 text-sm font-bold text-gray-900 sm:text-[15px]">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#8C6239]/10 font-mono text-xs font-black text-[#8C6239]">
                      Q
                    </span>
                    {item.question}
                  </span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
                      open ? 'bg-[#8C6239] text-white' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                {open && (
                  <div className="border-t border-dashed border-gray-200 bg-[#fffdfa] px-5 py-4 text-xs sm:text-sm leading-relaxed text-gray-600">
                    <span className="mr-2 font-mono font-bold text-[#8C6239]">A.</span>
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center text-xs text-gray-500 flex items-center justify-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-[#8C6239]" />
          <span>사이트 및 행사 관련 문의사항은 인천대 신포터즈 인스타그램(@sinpo.dream)으로 편하게 메시지를 보내주세요.</span>
        </div>
      </div>
    </section>
  );
};
