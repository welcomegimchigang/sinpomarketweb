import React from 'react';
import Link from 'next/link';
import { Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#191919] text-[#888888] text-xs pt-12 pb-8 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Main 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-[#2a2a2a]">
          {/* Col 1: RECENT POSTS */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold tracking-wider uppercase">
              RECENT POSTS
            </h4>
            <div className="space-y-3 pt-1">
              <div>
                <Link
                  href="/event#how-to-play"
                  className="text-gray-300 hover:text-white transition-colors block text-xs leading-snug"
                >
                  디지털 보물찾기 3단계 참여 가이드
                </Link>
                <span className="text-[11px] text-gray-500 block mt-0.5">
                  2026년 10월 25일
                </span>
              </div>
              <div>
                <Link
                  href="/event#features"
                  className="text-gray-300 hover:text-white transition-colors block text-xs leading-snug"
                >
                  숨은 골목 40개 QR 실시간 동적 확률 시스템
                </Link>
                <span className="text-[11px] text-gray-500 block mt-0.5">
                  2026년 10월 26일
                </span>
              </div>
              <div>
                <Link
                  href="/event#rewards"
                  className="text-gray-300 hover:text-white transition-colors block text-xs leading-snug"
                >
                  현장 즉석 당첨 및 온누리상품권 수령 안내
                </Link>
                <span className="text-[11px] text-gray-500 block mt-0.5">
                  2026년 10월 28일
                </span>
              </div>
            </div>
          </div>

          {/* Col 2: STORY MARKET */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold tracking-wider uppercase">
              STORY MARKET
            </h4>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                '보물찾기',
                '발자국로드',
                '40개QR',
                '닭강정',
                '화덕만두',
                '쫄면',
                '칼국수',
                '푸성귀전',
                '온누리',
              ].map((tag) => (
                <Link
                  key={tag}
                  href="/#food"
                  className="px-2 py-1 bg-[#252525] hover:bg-[#333333] text-gray-400 hover:text-gray-200 text-[11px] rounded transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 3: INSTAGRAM (CONTACT) */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold tracking-wider uppercase">
              INSTAGRAM
            </h4>
            <div className="pt-1 space-y-2">
              <a
                href="https://instagram.com/sinpo.dream"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-200 hover:text-white transition-colors text-sm font-semibold group"
              >
                <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                  <Instagram className="w-4 h-4" />
                </span>
                <span className="group-hover:underline">@sinpo.dream</span>
              </a>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                신포국제시장 및 디지털 보물찾기 행사 소식, 실시간 힌트를 인스타그램에서 만나보세요.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & SNS */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <div>
            © 2026 신포국제시장 디지털 보물찾기. All rights reserved.
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <a
              href="https://instagram.com/sinpo.dream"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1.5"
              title="Instagram"
            >
              <Instagram className="w-4 h-4 text-[#E5A93C]" />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
