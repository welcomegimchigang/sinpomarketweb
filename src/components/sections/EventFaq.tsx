"use client";

import React, { useState } from 'react';
import { Plus, Minus, Instagram } from 'lucide-react';
import { FAQ_ITEMS } from '../../data/marketData';

export const EventFaq: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);

  return (
    <section id="faq" className="scroll-mt-36 bg-[#fff8ec] py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.3em] text-[#8C6239]">
            FAQ
          </span>
          <h2 className="text-2xl font-black tracking-tight text-[#2a1b0e] sm:text-3xl">
            자주 묻는 <span className="text-[#8C6239]">질문</span>
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item) => {
            const open = openId === item.id;
            return (
              <div
                key={item.id}
                className={`overflow-hidden rounded-xl border bg-white transition-colors ${
                  open ? 'border-[#8C6239]' : 'border-[#8C6239]/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : item.id)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="flex items-center gap-3 text-sm font-bold text-[#2a1b0e] sm:text-[15px]">
                    <span className="font-mono text-[#E5A93C]">Q.</span>
                    {item.question}
                  </span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
                      open ? 'bg-[#8C6239] text-white' : 'bg-[#8C6239]/10 text-[#8C6239]'
                    }`}
                  >
                    {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                {open && (
                  <div className="border-t border-dashed border-[#8C6239]/25 bg-[#fffdf8] px-5 py-4 text-sm leading-relaxed text-[#5b4a38]">
                    <span className="mr-2 font-mono font-bold text-[#00ACC1]">A.</span>
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-8 flex items-center justify-center gap-2 text-xs text-[#6b5640]">
          <Instagram className="h-4 w-4 text-[#8C6239]" />
          더 궁금한 점은 인천대 신포터즈 인스타그램{' '}
          <a
            href="https://instagram.com/sinpo.dream"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#2a1b0e] underline hover:text-[#8C6239]"
          >
            @sinpo.dream
          </a>
          으로 문의해 주세요.
        </p>
      </div>
    </section>
  );
};
