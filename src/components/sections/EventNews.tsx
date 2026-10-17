import React from 'react';
import { ANNOUNCEMENT_ITEMS } from '../../data/marketData';

export const EventNews: React.FC = () => {
  return (
    <section id="news" className="scroll-mt-36 border-t border-gray-200 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-1 block text-xs font-bold uppercase tracking-[0.3em] text-[#00ACC1]">
              Event news
            </span>
            <h2 className="text-2xl font-black tracking-tight text-[#2a1b0e] sm:text-3xl">
              보물찾기 <span className="text-[#8C6239]">공지사항</span>
            </h2>
          </div>
          <p className="text-xs text-gray-500">참여 전에 꼭 확인해 주세요.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {ANNOUNCEMENT_ITEMS.map((item) => (
            <article
              key={item.id}
              className="group flex overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-[#8C6239] hover:shadow-lg"
            >
              <div className="relative w-32 shrink-0 overflow-hidden bg-gray-100 sm:w-44">
                <img
                  src={item.imageUrl}
                  alt={`${item.title} - 신포국제시장 보물찾기 ${item.category} 안내`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between gap-3 p-4 sm:p-5">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded bg-[#8C6239] px-2 py-0.5 text-[10px] font-bold text-white">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-gray-400">{item.date}</span>
                  </div>
                  <h3 className="text-sm font-bold leading-snug text-[#2a1b0e] group-hover:text-[#00ACC1] sm:text-[15px]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-500">{item.summary}</p>
                </div>
                <span className="text-[11px] font-semibold text-[#8C6239]">#{item.tag}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
