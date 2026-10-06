import React from 'react';
import { HISTORY_ITEMS } from '../../data/marketData';

export const HistorySection: React.FC = () => {
  return (
    <section id="history" className="scroll-mt-28 py-16 bg-[#fafafa] border-t border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-[#8C6239] tracking-widest uppercase block mb-1">
            SINPO HISTORY & HERITAGE
          </span>
          <h2 className="text-2xl sm:text-3xl font-light text-[#444444] tracking-tight">
            신포국제시장 100년의 역사
          </h2>
          <div className="w-12 h-[2px] bg-[#8C6239] mx-auto mt-3 mb-4" />
          <p className="text-xs sm:text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
            1883년 인천 개항 후 형성된 한국 최초의 근대 채소시장 '푸성귀전'에서 오늘날 글로벌 명품시장으로 거듭나기까지의 발자취입니다.
          </p>
        </div>

        {/* 3 Period Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {HISTORY_ITEMS.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                  <span className="text-xs font-bold font-mono text-[#8C6239] bg-amber-50 px-2 py-0.5 rounded">
                    {item.period}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {item.era}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  {item.description}
                </p>
                <div className="space-y-1.5 pt-2 border-t border-gray-100">
                  {item.keyFacts.map((fact, fIdx) => (
                    <div key={fIdx} className="text-[11px] text-gray-500 flex items-start gap-1.5">
                      <span className="text-[#8C6239] mt-0.5">•</span>
                      <span>{fact}</span>
                    </div>
                  ))}
                </div>
              </div>

              {item.highlightQuote && (
                <div className="mt-4 pt-3 border-t border-dashed border-gray-200 text-[11px] text-gray-600 italic bg-gray-50 p-2.5 rounded">
                  {item.highlightQuote}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
