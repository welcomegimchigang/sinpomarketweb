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
            <h2 className="text-white text-xs font-bold tracking-wider uppercase">
              RECENT POSTS
            </h2>
            <div className="space-y-3 pt-1">
              <div>
                <Link
                  href="/#certifications"
                  className="text-gray-300 hover:text-white transition-colors block text-xs leading-snug"
                >
                  2025 인천지역유산 선정 &amp; 2023·2026 K-관광마켓 2회 연속 선정
                </Link>
                <span className="text-[11px] text-gray-500 block mt-0.5">
                  현재 시장 홍보관
                </span>
              </div>
              <div>
                <Link
                  href="/history"
                  className="text-gray-300 hover:text-white transition-colors block text-xs leading-snug"
                >
                  신포 100년 역사관 &amp; 工자형 골목 15개 테마 카드 아카이브
                </Link>
                <span className="text-[11px] text-gray-500 block mt-0.5">
                  100년 역사 홍보관
                </span>
              </div>
              <div>
                <Link
                  href="/event#rewards"
                  className="text-gray-300 hover:text-white transition-colors block text-xs leading-snug"
                >
                  디지털 보물찾기 1등 올리브영 3만원권(총 6명) &amp; 수령 안내
                </Link>
                <span className="text-[11px] text-gray-500 block mt-0.5">
                  2026. 11. 13 ~ 11. 14
                </span>
              </div>
            </div>
          </div>

          {/* Col 2: STORY MARKET */}
          <div className="space-y-3">
            <h2 className="text-white text-xs font-bold tracking-wider uppercase">
              STORY MARKET
            </h2>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { label: '닭강정', href: '/#food' },
                { label: '공갈빵', href: '/#food' },
                { label: '오색만두', href: '/#food' },
                { label: '쫄면(광신제면)', href: '/#food' },
                { label: '칼국수골목', href: '/#food' },
                { label: 'K-관광마켓2회연속', href: '/#certifications' },
                { label: '2025인천지역유산', href: '/#certifications' },
                { label: '푸성귀전·100년역사', href: '/history' },
                { label: '디지털보물찾기', href: '/event' },
              ].map((tag) => (
                <Link
                  key={tag.label}
                  href={tag.href}
                  className="px-2 py-1 bg-[#252525] hover:bg-[#333333] text-gray-400 hover:text-gray-200 text-[11px] rounded transition-colors"
                >
                  {tag.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 3: INSTAGRAM (CONTACT) */}
          <div className="space-y-3">
            <h2 className="text-white text-xs font-bold tracking-wider uppercase">
              INSTAGRAM
            </h2>
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
