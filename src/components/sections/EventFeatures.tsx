import React from 'react';
import { Footprints, QrCode, TrendingUp, BookOpen } from 'lucide-react';
import { EVENT_FEATURES } from '../../data/marketData';
import { OddsSimulator } from './OddsSimulator';

const iconMap = { Footprints, QrCode, TrendingUp, BookOpen };

export const EventFeatures: React.FC = () => {
  return (
    <section id="features" className="scroll-mt-36 bg-[#181818] py-16 text-white sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          {/* sticky heading */}
          <div className="lg:sticky lg:top-40 lg:self-start">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.3em] text-[#00ACC1]">
              Event highlights
            </span>
            <h2 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl">
              골목을 살리는
              <br />
              <span className="text-[#E5A93C]">4가지 특별함</span>
            </h2>
            <div className="mt-4 h-[3px] w-12 bg-[#E5A93C]" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-gray-400">
              소외된 골목과 점포를 살리고, 방문객에게는 걷는 즐거움과 게이미피케이션의 재미를 전합니다.
            </p>
          </div>

          {/* feature list */}
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {EVENT_FEATURES.map((feat, idx) => {
              const Icon = iconMap[feat.icon as keyof typeof iconMap] || Footprints;
              return (
                <li key={feat.id} className="group grid gap-4 py-7 sm:grid-cols-[auto_1fr] sm:gap-6">
                  <div className="flex items-center gap-4 sm:flex-col sm:items-start">
                    <span
                      className="font-mono text-5xl font-black leading-none text-transparent"
                      style={{ WebkitTextStroke: `1.5px ${feat.accentColor ?? '#E5A93C'}` }}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition-transform group-hover:scale-110"
                      style={{ backgroundColor: feat.accentColor ?? '#E5A93C' }}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <div>
                    <span className="inline-block rounded border border-white/20 px-2 py-0.5 text-[11px] font-bold text-gray-300">
                      {feat.badge}
                    </span>
                    <h3 className="mt-2 text-lg font-black leading-snug sm:text-xl">{feat.title}</h3>
                    <p
                      className="mt-1 text-xs font-semibold"
                      style={{ color: feat.accentColor === '#2E7D32' ? '#66bb6a' : feat.accentColor }}
                    >
                      {feat.subtitle}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-gray-400">{feat.description}</p>
                    <ul className="mt-3 space-y-1.5">
                      {feat.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#E5A93C]" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-14">
          <OddsSimulator />
        </div>
      </div>
    </section>
  );
};
