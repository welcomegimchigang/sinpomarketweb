import React from 'react';
import { Trophy, Award, Gift, Sparkles, Clock, MapPin, Bell } from 'lucide-react';
import { REWARD_TIERS, FESTIVAL_INFO } from '../../data/marketData';

const iconMap = { Trophy, Award, Gift, Sparkles };

const INSTANT_SYSTEM = [
  {
    step: '01',
    title: '스마트폰 QR 즉석 추첨',
    desc: '숨겨진 보물 QR을 카메라로 비추면 대기 시간 없이 즉석에서 당첨 결과가 화면에 나타납니다.',
  },
  {
    step: '02',
    title: '실시간 골목 동적 확률',
    desc: '인적이 드문 조용한 골목일수록 1등/2등 등 고액 당첨 확률이 실시간으로 더욱 높아집니다.',
  },
  {
    step: '03',
    title: '리워드 부스 즉시 수령',
    desc: '당첨된 모바일 화면을 소지하고 운영 시간(12:00~18:00) 내 고객지원센터 앞 부스에서 바로 수령하세요.',
  },
];

const CLAIM_STEPS = [
  "스마트폰으로 QR 스캔 후 '모바일 당첨권' 화면을 열어둡니다.",
  '고객지원센터 앞 리워드 부스 스태프에게 당첨 화면을 제시합니다.',
  '온누리상품권과 한정판 굿즈를 현장에서 즉시 수령합니다.',
];

export const EventRewards: React.FC = () => {
  return (
    <section id="rewards" className="scroll-mt-36 bg-[#fff8ec] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.3em] text-[#8C6239]">
            Rewards &amp; claim guide
          </span>
          <h2 className="text-3xl font-black tracking-tight text-[#2a1b0e] sm:text-4xl">
            풍성한 <span className="text-[#8C6239]">보물 경품</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-[#6b5640]">
            모바일 당첨 화면을 고객지원센터 앞 리워드 부스에 보여주시면 바로 받아가실 수 있어요.
          </p>
        </div>

        {/* ticket cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REWARD_TIERS.map((tier, idx) => {
            const Icon = iconMap[tier.icon as keyof typeof iconMap] || Gift;
            const featured = idx === 0;
            return (
              <div
                key={tier.rank}
                className={`relative flex flex-col rounded-2xl p-6 shadow-md transition-transform hover:-translate-y-1.5 ${
                  featured
                    ? 'bg-gradient-to-br from-[#F3C15F] via-[#E5A93C] to-[#C88B25] text-[#2a1b0e]'
                    : 'border border-[#8C6239]/20 bg-white text-[#2a1b0e]'
                }`}
              >
                {/* ticket notches */}
                <span className="absolute -left-3 top-[58%] h-6 w-6 rounded-full bg-[#fff8ec]" />
                <span className="absolute -right-3 top-[58%] h-6 w-6 rounded-full bg-[#fff8ec]" />

                <div className="flex items-start justify-between">
                  <div>
                    <span className={`text-[11px] font-bold tracking-widest ${featured ? 'text-[#2a1b0e]/70' : 'text-[#8C6239]'}`}>
                      {tier.badge}
                    </span>
                    <span className="block font-mono text-4xl font-black leading-tight">{tier.rank}</span>
                  </div>
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full ${
                      featured ? 'bg-white/30' : 'bg-[#8C6239]/10 text-[#8C6239]'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                </div>

                <h3 className="mt-4 text-sm font-black leading-snug">{tier.prize}</h3>
                <p className={`mt-2 flex-1 text-xs leading-relaxed ${featured ? 'text-[#2a1b0e]/80' : 'text-[#6b5640]'}`}>
                  {tier.description}
                </p>

                <div
                  className={`mt-5 flex items-center justify-between border-t border-dashed pt-4 text-[11px] font-bold ${
                    featured ? 'border-[#2a1b0e]/30' : 'border-[#8C6239]/30'
                  }`}
                >
                  <span>증정 수량</span>
                  <span className={featured ? '' : 'text-[#8C6239]'}>{tier.quantity}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* schedule + claim */}
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {/* schedule timeline */}
          <div className="rounded-2xl border border-[#8C6239]/20 bg-white p-6 sm:p-8">
            <h3 className="mb-6 flex items-center gap-2 text-base font-black text-[#2a1b0e]">
              <Sparkles className="h-4 w-4 text-[#8C6239]" />
              현장 즉석 당첨 &amp; 실시간 추첨
            </h3>
            <ol className="relative space-y-6 border-l-2 border-dashed border-[#8C6239]/30 pl-6">
              {INSTANT_SYSTEM.map((item, i) => (
                <li key={item.step} className="relative">
                  <span className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-[#E5A93C] ring-2 ring-[#E5A93C]/30" />
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-2xl font-black text-[#8C6239]">{item.step}</span>
                    <span className="text-sm font-bold text-[#2a1b0e]">{item.title}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-[#6b5640]">{item.desc}</p>
                  {i === INSTANT_SYSTEM.length - 1 && (
                    <p className="mt-2 text-[11px] font-semibold text-[#00ACC1]">
                      * 정해진 발표 시간을 기다릴 필요 없이, QR 스캔 즉시 당첨 여부를 확인하실 수 있습니다.
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </div>

          {/* claim guide */}
          <div className="rounded-2xl bg-gradient-to-br from-[#3a2713] to-[#1c130b] p-6 text-white sm:p-8">
            <h3 className="mb-5 flex items-center gap-2 text-base font-black">
              <MapPin className="h-4 w-4 text-[#E5A93C]" />
              경품 수령처 &amp; 방법
            </h3>
            <div className="mb-5 rounded-lg border border-[#E5A93C]/30 bg-[#E5A93C]/10 p-4">
              <span className="block text-sm font-black text-[#E5A93C]">
                {FESTIVAL_INFO.rewardLocation}
              </span>
              <span className="mt-1 block text-xs text-gray-300">
                신포국제시장 중앙 통로 안쪽 고객지원센터 1층 정문 앞 리워드 접수 데스크
              </span>
            </div>
            <ol className="space-y-3">
              {CLAIM_STEPS.map((text, i) => (
                <li key={i} className="flex items-start gap-3 text-xs leading-relaxed text-gray-300">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E5A93C] font-mono text-xs font-black text-[#2a1b0e]">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{text}</span>
                </li>
              ))}
            </ol>
            <div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4 text-[11px] text-gray-400">
              <Bell className="h-3.5 w-3.5 shrink-0 text-[#E5A93C]" />
              운영 시간: 행사 기간 매일 {FESTIVAL_INFO.hours} (마감 시간 엄수)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
