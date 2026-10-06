"use client";

import React, { useState } from 'react';
import { FESTIVAL_INFO, PARKING_INFO, MAP_LINKS } from '../../data/marketData';
import { MapPin, Copy, Check, ExternalLink } from 'lucide-react';

export const LocationSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(FESTIVAL_INFO.mainLocation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="location" className="scroll-mt-28 py-16 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#8C6239] tracking-widest uppercase block mb-1">
            LOCATION & TRANSPORTATION
          </span>
          <h2 className="text-2xl sm:text-3xl font-light text-[#444444] tracking-tight">
            오시는 길 & 주차 안내
          </h2>
          <div className="w-12 h-[2px] bg-[#8C6239] mx-auto mt-3" />
        </div>

        {/* Address Row */}
        <div className="bg-[#f9f9f9] border border-gray-200 rounded p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <MapPin className="w-5 h-5 text-[#8C6239] shrink-0" />
            <div>
              <span className="text-xs text-gray-500 font-medium block">신포국제시장 도로명 주소</span>
              <span className="text-base sm:text-lg font-bold text-gray-800">
                {FESTIVAL_INFO.mainLocation}
              </span>
            </div>
          </div>
          <button
            onClick={handleCopy}
            type="button"
            className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-300 text-xs font-semibold text-gray-700 rounded transition-colors flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-600" />
                <span className="text-green-600">주소 복사됨</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-gray-500" />
                <span>주소 복사하기</span>
              </>
            )}
          </button>
        </div>

        {/* Transportation & Parking 2-Column */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Public Transit */}
          <div className="border border-gray-200 rounded p-5 sm:p-6 bg-white">
            <h3 className="text-base font-bold text-gray-900 pb-3 mb-4 border-b border-gray-200 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#8C6239] rounded-full inline-block" />
              대중교통 안내
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <span className="font-bold text-[#8C6239] block text-sm mb-1">
                  지하철 (전철)
                </span>
                <ul className="space-y-1.5 text-gray-600 leading-relaxed">
                  <li>
                    • <strong className="text-gray-800">수인분당선 [신포역] 3번 출구</strong>: 도보 5분 (약 350m, 추천 경로)
                  </li>
                  <li>
                    • <strong className="text-gray-800">1호선 [동인천역] 2번 출구</strong>: 지하상가 연결 도보 10분 (약 600m)
                  </li>
                </ul>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <span className="font-bold text-[#8C6239] block text-sm mb-1">
                  시내버스
                </span>
                <p className="text-gray-600 leading-relaxed">
                  • <strong className="text-gray-800">'신포시장' 정류장</strong> 하차: 간선 12, 24, 28, 45, 72, 307번
                </p>
                <p className="text-gray-600 leading-relaxed mt-1">
                  • 신포순환버스 및 지선 517, 521번
                </p>
              </div>
            </div>
          </div>

          {/* Parking */}
          <div className="border border-gray-200 rounded p-5 sm:p-6 bg-white">
            <h3 className="text-base font-bold text-gray-900 pb-3 mb-4 border-b border-gray-200 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#8C6239] rounded-full inline-block" />
              인근 공영주차장 안내
            </h3>

            <div className="space-y-3.5 text-xs">
              {PARKING_INFO.map((parking, pIdx) => (
                <div key={pIdx} className="bg-gray-50 p-3.5 rounded border border-gray-200/80">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-gray-900 text-sm">{parking.name}</span>
                    <span className="text-[11px] text-[#8C6239] font-medium">{parking.distance}</span>
                  </div>
                  <p className="text-gray-600 mb-1">
                    <strong className="text-gray-700">요금:</strong> {parking.feeInfo}
                  </p>
                  <p className="text-gray-500 text-[11px]">
                    <strong className="text-gray-600">혜택:</strong> {parking.benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Links */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {MAP_LINKS.map((link) => (
            <a
              key={link.service}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 border border-gray-300 rounded text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>{link.name}</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
