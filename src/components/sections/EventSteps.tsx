import React from 'react';
import { Footprints, QrCode, Gift, CheckCircle2 } from 'lucide-react';
import { HOW_TO_PLAY_STEPS } from '../../data/marketData';

const iconMap = { Footprints, QrCode, Gift };

export const EventSteps: React.FC = () => {
  return (
    <section id="how-to-play" className="scroll-mt-36 bg-[#fff8ec] py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-14 text-center">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.3em] text-[#8C6239]">
            How to participate
          </span>
          <h2 className="text-3xl font-black tracking-tight text-[#2a1b0e] sm:text-4xl">
            보물을 찾는 <span className="text-[#8C6239]">3단계</span> 여정
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-[#6b5640]">
            별도의 앱 없이, 스마트폰 카메라 하나로 발자국을 따라 걷기만 하면 됩니다.
          </p>
        </div>

        <ol className="relative">
          {/* center line */}
          <div className="absolute bottom-0 left-6 top-0 w-px border-l-2 border-dashed border-[#8C6239]/40 md:left-1/2 md:-translate-x-px" />

          {HOW_TO_PLAY_STEPS.map((step, idx) => {
            const Icon = iconMap[step.icon as keyof typeof iconMap] || Footprints;
            const isLeft = idx % 2 === 0;
            return (
              <li key={step.step} className="relative mb-12 last:mb-0 md:grid md:grid-cols-2 md:gap-16">
                {/* node */}
                <span className="absolute left-6 top-6 z-10 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border-4 border-[#fff8ec] bg-[#8C6239] text-white shadow-lg md:left-1/2">
                  <Icon className="h-5 w-5" />
                </span>

                <div
                  className={`ml-16 md:ml-0 ${
                    isLeft ? 'md:col-start-1 md:text-right' : 'md:col-start-2'
                  }`}
                >
                  <div className="group relative overflow-hidden rounded-2xl border border-[#8C6239]/20 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-[#8C6239] hover:shadow-xl sm:p-7">
                    {/* big outlined number */}
                    <span
                      className={`pointer-events-none absolute -top-3 select-none font-mono text-8xl font-black leading-none text-[#8C6239]/10 ${
                        isLeft ? 'right-4 md:right-auto md:left-4' : 'right-4'
                      }`}
                    >
                      {step.number}
                    </span>
                    <div
                      className={`relative flex flex-wrap items-center gap-2 ${
                        isLeft ? 'md:justify-end' : ''
                      }`}
                    >
                      <span className="rounded bg-[#8C6239] px-2.5 py-0.5 font-mono text-xs font-black text-white">
                        {step.step}
                      </span>
                      <span className="rounded border border-[#E5A93C]/60 bg-[#E5A93C]/15 px-2.5 py-0.5 text-xs font-bold text-[#8a5a10]">
                        {step.badge}
                      </span>
                    </div>
                    <h3 className="relative mt-3 text-xl font-black text-[#2a1b0e]">{step.title}</h3>
                    <p className="relative mt-2 text-sm leading-relaxed text-[#5b4a38]">
                      {step.description}
                    </p>
                    <ul className={`relative mt-4 space-y-2 border-t border-dashed border-[#8C6239]/25 pt-4 text-left`}>
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-[#5b4a38]">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#00ACC1]" />
                          <span className="leading-snug">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};
