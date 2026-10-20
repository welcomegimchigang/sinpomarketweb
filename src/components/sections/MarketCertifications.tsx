import React from 'react';
import { Award, Landmark, Sparkles, ArrowRight } from 'lucide-react';

export const MarketCertifications: React.FC = () => {
  return (
    <section
      id="certifications"
      className="py-16 sm:py-20 bg-[#fcfaf7] border-b border-gray-200 scroll-mt-28"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-[#8C6239] tracking-widest uppercase block mb-1">
            OFFICIAL RECOGNITION &amp; HERITAGE
          </span>
          <h2 className="text-2xl sm:text-3xl font-light text-[#444444] tracking-tight">
            대한민국과 인천이 공인한 대표 시장
          </h2>
          <div className="w-12 h-[2px] bg-[#8C6239] mx-auto mt-3 mb-4" />
          <p className="text-xs sm:text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
            오늘의 신포국제시장은 <strong>2023·2026 K-관광마켓 10선 2회 연속 선정</strong>과{' '}
            <strong>2025 인천지역유산 공식 선정</strong>으로 전통과 글로벌 관광 가치를 동시에 인정받고 있습니다.
          </p>
        </div>

        {/* 2 Certification Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. K-관광마켓 2회 연속 선정 */}
          <div className="relative overflow-hidden rounded-xl border border-[#8C6239]/30 bg-gradient-to-br from-[#3d290c] to-[#241706] p-6 sm:p-8 text-white shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E5A93C] px-3 py-0.5 text-[11px] font-black text-[#2a1b0e]">
                    <Sparkles className="w-3 h-3" />
                    K-TOUR MARKET · 2회 연속 선정
                  </span>
                  <h3 className="mt-3 text-lg sm:text-xl font-black text-amber-200 leading-snug">
                    대한민국이 주목한 신포: K-관광마켓 10선 2회 연속 선정
                  </h3>
                </div>
                <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#E5A93C]">
                  <Award className="h-6 w-6" />
                </div>
              </div>
              <p className="mt-3 text-xs sm:text-sm text-gray-200 leading-relaxed">
                신포국제시장은 <strong>2023년 제1기 K-관광마켓 10선</strong>에 선정된 데 이어{' '}
                <strong>2026년 제2기 K-관광마켓 10선</strong>에도 다시 선정되었습니다. 전통시장 고유의 매력에 K-푸드·K-컬처를 결합해 국내외 관광객이 찾는 글로벌 관광명소로서의 브랜드 가치를 인정받았습니다.
              </p>
            </div>

            <div className="mt-6 space-y-2.5 pt-4 border-t border-white/10">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-amber-300">
                <span className="rounded bg-white/10 px-2.5 py-1 font-bold">2023 제1기 K-관광마켓 선정</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                <span className="rounded bg-[#E5A93C] text-[#2a1b0e] px-2.5 py-1 font-black">
                  2026 제2기 2회 연속 선정
                </span>
              </div>
              <p className="text-[11px] text-amber-200/80 italic">
                “두 번 연속 선택받은 시장. 100년의 전통을 넘어, 세계인이 찾는 관광시장으로.”
              </p>
            </div>
          </div>

          {/* 2. 2025 인천지역유산 선정 */}
          <div className="relative overflow-hidden rounded-xl border border-[#8C6239]/30 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#8C6239] px-3 py-0.5 text-[11px] font-black text-white">
                    <Landmark className="w-3 h-3" />
                    2025 INCHEON HERITAGE
                  </span>
                  <h3 className="mt-3 text-lg sm:text-xl font-black text-gray-900 leading-snug">
                    100년의 시장, 2025 ‘인천지역유산’ 공식 선정
                  </h3>
                </div>
                <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#8C6239]/10 text-[#8C6239]">
                  <Landmark className="h-6 w-6" />
                </div>
              </div>
              <p className="mt-3 text-xs sm:text-sm text-gray-600 leading-relaxed">
                신포국제시장은 <strong>2025년 ‘생활문화’ 분야 인천지역유산</strong>으로 공식 선정되었습니다. 인천 최초의 근대적 시장이라는 역사성과 개항장 문화유산과 연결되는 장소적 가치를 인정받아, 시민과 관광객이 함께 누리는 살아있는 유산으로 자리 잡았습니다.
              </p>
            </div>

            <div className="mt-6 space-y-2.5 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-[#8C6239]">
                <span className="rounded bg-amber-50 border border-amber-200 px-2.5 py-1">#2025인천지역유산</span>
                <span className="rounded bg-amber-50 border border-amber-200 px-2.5 py-1">#생활문화분야</span>
                <span className="rounded bg-amber-50 border border-amber-200 px-2.5 py-1">#개항장문화유산</span>
              </div>
              <p className="text-[11px] text-gray-500 italic">
                “100년의 시장을 넘어, 다음 세대에 전할 인천의 유산으로.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
