import React from 'react';
import { Facebook, Youtube, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#191919] text-[#888888] text-xs pt-12 pb-8 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-[#2a2a2a]">
          {/* Col 1: RECENT POSTS */}
          <div className="lg:col-span-1 space-y-3">
            <h4 className="text-white text-xs font-bold tracking-wider uppercase">
              RECENT POSTS
            </h4>
            <div className="space-y-3 pt-1">
              <div>
                <a
                  href="#how-to-play"
                  className="text-gray-300 hover:text-white transition-colors block text-xs leading-snug"
                >
                  디지털 보물찾기 3단계 참여 가이드
                </a>
                <span className="text-[11px] text-gray-500 block mt-0.5">
                  2026년 10월 25일
                </span>
              </div>
              <div>
                <a
                  href="#features"
                  className="text-gray-300 hover:text-white transition-colors block text-xs leading-snug"
                >
                  숨은 골목 40개 QR 실시간 동적 확률 시스템
                </a>
                <span className="text-[11px] text-gray-500 block mt-0.5">
                  2026년 10월 26일
                </span>
              </div>
              <div>
                <a
                  href="#rewards"
                  className="text-gray-300 hover:text-white transition-colors block text-xs leading-snug"
                >
                  매일 3회 당첨 발표 및 온누리상품권 수령 안내
                </a>
                <span className="text-[11px] text-gray-500 block mt-0.5">
                  2026년 10월 28일
                </span>
              </div>
            </div>
          </div>

          {/* Col 2: STORY MARKET */}
          <div className="lg:col-span-1 space-y-3">
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
                <a
                  key={tag}
                  href="#food"
                  className="px-2 py-1 bg-[#252525] hover:bg-[#333333] text-gray-400 hover:text-gray-200 text-[11px] rounded transition-colors"
                >
                  {tag}
                </a>
              ))}
            </div>
          </div>

          {/* Col 3: MULTILINGUAL SUPPORT */}
          <div className="lg:col-span-1 space-y-3">
            <h4 className="text-white text-xs font-bold tracking-wider uppercase">
              MULTILINGUAL SUPPORT(다국어 지원)
            </h4>
            <ul className="space-y-2 pt-1 text-xs">
              <li className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer">
                <span>🇰🇷</span>
                <span>한국어</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer">
                <span>🇺🇸</span>
                <span>English</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer">
                <span>🇯🇵</span>
                <span>日本語</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer">
                <span>🇨🇳</span>
                <span>简体中文</span>
              </li>
            </ul>
          </div>

          {/* Col 4: CONTACT */}
          <div className="lg:col-span-1 space-y-3">
            <h4 className="text-white text-xs font-bold tracking-wider uppercase">
              CONTACT
            </h4>
            <ul className="space-y-1.5 pt-1 text-[11px] text-gray-400 leading-relaxed">
              <li>
                <strong className="text-gray-300">T:</strong> 032 772 5812
              </li>
              <li>
                <strong className="text-gray-300">F:</strong> 032 772 5813
              </li>
              <li>
                <strong className="text-gray-300">E:</strong> sinpotreasure@incheon.kr
              </li>
              <li>
                <strong className="text-gray-300">A:</strong> 인천광역시 중구 신포동 6-6 일원
              </li>
              <li className="text-[10px] text-gray-500 pt-1">
                행사 운영본부: 고객지원센터 1층 데스크
              </li>
            </ul>
          </div>

          {/* Col 5: PRIVATE POLICY */}
          <div className="lg:col-span-1 space-y-3">
            <h4 className="text-white text-xs font-bold tracking-wider uppercase">
              PRIVATE POLICY(CCTV)
            </h4>
            <div className="pt-1">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors text-xs"
              >
                개인정보처리방침 (CCTV)
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & SNS */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <div>
            © 2026 신포국제시장 디지털 보물찾기. All rights reserved.
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <a href="#" className="hover:text-white transition-colors" title="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-white transition-colors" title="Youtube">
              <Youtube className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-white transition-colors" title="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
