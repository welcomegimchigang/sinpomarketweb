import React from 'react';
import {
  HOW_TO_PLAY_STEPS,
  EVENT_FEATURES,
  REWARD_TIERS,
  ANNOUNCEMENT_ITEMS,
  FESTIVAL_INFO,
} from '../../data/marketData';
import {
  Footprints,
  QrCode,
  Gift,
  TrendingUp,
  BookOpen,
  Trophy,
  Award,
  Sparkles,
  CheckCircle2,
  Clock,
  MapPin,
  Bell,
} from 'lucide-react';

const iconMap = {
  Footprints,
  QrCode,
  Gift,
  TrendingUp,
  BookOpen,
  Trophy,
  Award,
  Sparkles,
};

export const EventSection: React.FC = () => {
  return (
    <div className="w-full bg-white divide-y divide-gray-200">
      {/* 1. 광장시장 스타일 최근소식 그리드 (Recent News) */}
      <section className="py-14 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-light text-[#555555] tracking-tight">
              신포국제시장 최근소식
            </h2>
            <div className="w-12 h-[2px] bg-[#8C6239] mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ANNOUNCEMENT_ITEMS.map((item) => (
              <div key={item.id} className="flex flex-col group">
                <a href="#about" className="block">
                  <h3 className="text-[16px] font-bold text-[#00acc1] leading-snug group-hover:underline mb-1">
                    {item.title}
                  </h3>
                </a>
                <div className="text-[11px] text-gray-400 mb-2.5">
                  By {item.author} | {item.category} | No Comments
                </div>
                <div className="h-40 w-full overflow-hidden rounded bg-gray-100 mb-2.5 relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-2 left-2 bg-[#8C6239] text-white text-[10px] px-2 py-0.5 rounded font-medium">
                    #{item.tag}
                  </span>
                </div>
                <p className="text-[12px] text-gray-600 leading-relaxed line-clamp-3">
                  {item.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. [3단계 참여 방법] (How to Play - #how-to-play) */}
      <section id="how-to-play" className="py-16 sm:py-20 bg-[#fbfbfb] scroll-mt-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#8C6239] tracking-widest uppercase block mb-1">
              HOW TO PARTICIPATE
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              디지털 보물찾기 <span className="text-[#8C6239]">3단계 참여 방법</span>
            </h2>
            <div className="w-12 h-[2px] bg-[#8C6239] mx-auto mt-3 mb-3" />
            <p className="text-sm text-gray-600 max-w-xl mx-auto">
              별도의 앱 설치 없이, 누구나 스마트폰 기본 카메라로 간편하게 골목 보물찾기에 도전할 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {HOW_TO_PLAY_STEPS.map((step) => {
              const IconComponent = iconMap[step.icon as keyof typeof iconMap] || Sparkles;
              return (
                <div
                  key={step.step}
                  className="bg-white rounded-lg border border-gray-200 p-6 sm:p-7 shadow-sm hover:border-[#8C6239] transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Step Label */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                      <span className="text-xl font-black text-[#8C6239] font-mono">
                        {step.step}
                      </span>
                      <span className="text-xs bg-amber-50 text-[#8C6239] font-bold px-2.5 py-0.5 rounded border border-amber-200/60">
                        {step.badge}
                      </span>
                    </div>

                    {/* Title & Icon */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-11 h-11 rounded-lg bg-[#8C6239]/10 text-[#8C6239] flex items-center justify-center shrink-0 group-hover:bg-[#8C6239] group-hover:text-white transition-colors">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {step.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                      {step.description}
                    </p>

                    {/* Details Bullet */}
                    <ul className="space-y-1.5 text-xs text-gray-500 pt-2 border-t border-gray-100">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00acc1] shrink-0 mt-0.5" />
                          <span className="leading-snug">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. [핵심 프로그램 & 매력 포인트] (Event Features - #features) */}
      <section id="features" className="py-16 sm:py-20 bg-white scroll-mt-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#00acc1] tracking-widest uppercase block mb-1">
              EVENT HIGHLIGHTS & ATTRACTIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              신포 골목 보물찾기만의 <span className="text-[#00acc1]">4대 매력 포인트</span>
            </h2>
            <div className="w-12 h-[2px] bg-[#00acc1] mx-auto mt-3 mb-3" />
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              소외 골목과 점포를 살리고 방문객에게는 특별한 게이미피케이션의 즐거움을 전합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EVENT_FEATURES.map((feat) => {
              const IconComponent = iconMap[feat.icon as keyof typeof iconMap] || Sparkles;
              return (
                <div
                  key={feat.id}
                  className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-white bg-[#8C6239] px-2.5 py-0.5 rounded">
                        {feat.badge}
                      </span>
                      <IconComponent className="w-5 h-5 text-gray-400" />
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {feat.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#00acc1] mb-3">
                      {feat.subtitle}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                      {feat.description}
                    </p>

                    <div className="space-y-1.5 pt-3 border-t border-gray-100">
                      {feat.highlights.map((item, hIdx) => (
                        <div key={hIdx} className="text-xs text-gray-600 flex items-start gap-1.5">
                          <span className="text-[#8C6239] font-bold mt-0.5">•</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dynamic Odds Callout Banner */}
          <div className="mt-8 bg-gradient-to-r from-amber-500 to-[#8C6239] rounded-lg p-6 text-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 bg-black/20 text-white px-2.5 py-0.5 rounded text-xs font-bold">
                <TrendingUp className="w-3.5 h-3.5 text-amber-200" />
                <span>실시간 동적 확률 시스템 안내</span>
              </div>
              <h4 className="text-base sm:text-lg font-bold">
                “사람들이 덜 찾은 깊은 골목일수록 당첨 확률이 실시간으로 솟아납니다!”
              </h4>
              <p className="text-xs sm:text-sm text-white/90">
                매일 3회 (13:00, 15:00, 17:00) 실시간 방문 스캔 데이터를 분석하여 조용한 골목의 QR코드 당첨 확률을 업데이트합니다.
              </p>
            </div>
            <a
              href="#rewards"
              className="shrink-0 px-5 py-2.5 bg-white text-gray-900 font-bold text-xs rounded hover:bg-gray-100 transition-colors"
            >
              당첨 경품 확인하기
            </a>
          </div>
        </div>
      </section>

      {/* 4. [경품 혜택 및 수령 안내] (Rewards - #rewards) */}
      <section id="rewards" className="py-16 sm:py-20 bg-[#fafafa] scroll-mt-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#8C6239] tracking-widest uppercase block mb-1">
              REWARDS & CLAIM GUIDE
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              풍성한 보물 경품 & <span className="text-[#8C6239]">실시간 수령 안내</span>
            </h2>
            <div className="w-12 h-[2px] bg-[#8C6239] mx-auto mt-3 mb-3" />
            <p className="text-sm text-gray-600 max-w-xl mx-auto">
              모바일 당첨 화면을 고객지원센터 앞 리워드 부스에 제시하시면 즉시 온누리상품권과 경품을 수령하실 수 있습니다.
            </p>
          </div>

          {/* Reward Tier Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {REWARD_TIERS.map((tier) => {
              const IconComponent = iconMap[tier.icon as keyof typeof iconMap] || Gift;
              return (
                <div
                  key={tier.rank}
                  className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:border-[#8C6239] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2.5">
                      <span className="text-lg font-black text-[#8C6239] font-mono">
                        {tier.rank}
                      </span>
                      <span className="text-[11px] font-bold bg-amber-100 text-[#8C6239] px-2 py-0.5 rounded">
                        {tier.badge}
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded bg-[#8C6239]/10 text-[#8C6239] flex items-center justify-center mb-3">
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1.5">
                      {tier.prize}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed mb-3">
                      {tier.description}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-gray-100 text-[11px] font-semibold text-gray-600 flex items-center justify-between">
                    <span>증정 수량:</span>
                    <span className="text-[#8C6239]">{tier.quantity}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Announcement Schedule & Claim Booth Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-7 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left: Announcement Rounds */}
              <div>
                <h3 className="text-base font-bold text-gray-900 pb-3 mb-4 border-b border-gray-200 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#8C6239]" />
                  실시간 당첨 발표 회차 (매일 3회)
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded border border-gray-200/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-gray-900 block text-sm">1차 발표: 13:00</span>
                      <span className="text-gray-500">오전 12시~1시 스캔 데이터 반영 및 1차 당첨자 추첨</span>
                    </div>
                    <span className="font-bold text-[#8C6239] bg-white px-2 py-1 rounded border border-gray-200">
                      매일 13:00
                    </span>
                  </div>

                  <div className="p-3 bg-gray-50 rounded border border-gray-200/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-gray-900 block text-sm">2차 발표: 15:00</span>
                      <span className="text-gray-500">골목 동적 확률 갱신 및 2차 대박 경품 추첨</span>
                    </div>
                    <span className="font-bold text-[#8C6239] bg-white px-2 py-1 rounded border border-gray-200">
                      매일 15:00
                    </span>
                  </div>

                  <div className="p-3 bg-gray-50 rounded border border-gray-200/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-gray-900 block text-sm">3차 발표: 17:00</span>
                      <span className="text-gray-500">당일 최종 보물 사냥꾼 발표 및 마감 룰렛</span>
                    </div>
                    <span className="font-bold text-[#8C6239] bg-white px-2 py-1 rounded border border-gray-200">
                      매일 17:00
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: How to Claim Reward */}
              <div>
                <h3 className="text-base font-bold text-gray-900 pb-3 mb-4 border-b border-gray-200 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#8C6239]" />
                  경품 수령처 & 수령 방법
                </h3>
                <div className="space-y-3.5 text-xs text-gray-600">
                  <div className="bg-amber-50/70 border border-amber-200/80 p-3.5 rounded text-amber-900">
                    <strong className="block text-sm font-bold mb-1">
                      수령 장소: 고객지원센터 앞 리워드 부스
                    </strong>
                    <span>
                      신포국제시장 중앙 통로 안쪽 고객지원센터 1층 정문 앞 리워드 접수 데스크
                    </span>
                  </div>

                  <div className="space-y-1.5 leading-relaxed">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-[#8C6239] shrink-0">1.</span>
                      <span>스마트폰으로 QR 스캔 후 화면에 나타난 '모바일 당첨권'을 캡처하거나 열어둡니다.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-[#8C6239] shrink-0">2.</span>
                      <span>고객지원센터 앞 리워드 부스 스태프에게 모바일 당첨 화면을 제시합니다.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-[#8C6239] shrink-0">3.</span>
                      <span>온누리상품권 지류권 또는 모바일 상품권과 한정판 굿즈를 현장에서 즉시 수령합니다.</span>
                    </div>
                  </div>

                  <div className="pt-2 text-[11px] text-gray-500 border-t border-gray-100 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>운영 시간: 행사 기간 매일 12:00 ~ 18:00 (행사 마감 시간 엄수)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
