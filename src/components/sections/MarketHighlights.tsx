import React from 'react';
import { Landmark, Utensils, Footprints, Train } from 'lucide-react';
import { MARKET_HIGHLIGHTS } from '../../data/marketData';

const iconMap = {
  Landmark,
  Utensils,
  Footprints,
  Train,
};

export const MarketHighlights: React.FC = () => {
  return (
    <section id="highlights" className="py-16 sm:py-20 bg-white border-b border-gray-200 scroll-mt-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-[#8C6239] tracking-widest uppercase block mb-1">
            WHY SINPO MARKET
          </span>
          <h2 className="text-2xl sm:text-3xl font-light text-[#444444] tracking-tight">
            신포국제시장을 만나는 4가지 이유
          </h2>
          <div className="w-12 h-[2px] bg-[#8C6239] mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MARKET_HIGHLIGHTS.map((item) => {
            const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Landmark;
            return (
              <div
                key={item.id}
                className="group border border-gray-200 rounded-lg p-6 bg-white hover:border-[#8C6239] hover:shadow-md transition-all flex flex-col"
              >
                <div className="w-11 h-11 rounded-lg bg-[#8C6239]/10 text-[#8C6239] flex items-center justify-center mb-4 group-hover:bg-[#8C6239] group-hover:text-white transition-colors">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="mb-3 pb-3 border-b border-gray-100">
                  <span className="text-3xl font-black text-[#8C6239] font-mono block leading-none">
                    {item.stat}
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium">{item.statLabel}</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
