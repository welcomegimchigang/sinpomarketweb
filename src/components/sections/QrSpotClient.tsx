"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  QrCode,
  MapPin,
  Sparkles,
  Gift,
  Camera,
  CheckCircle2,
  XCircle,
  Compass,
  Clock,
  ShieldCheck,
  Stamp,
  Route,
  ChevronDown,
  ChevronUp,
  BookOpen,
  ArrowRight,
  Trophy,
  Award,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import type { QrSpotItem, PublicQrSpot } from '../../data/qrSpots';
import { FESTIVAL_INFO } from '../../data/marketData';
import {
  DrawResult,
  getDeviceId,
  isTreasureConfigured,
  scanAndDraw,
} from '../../lib/treasure';
import { TreasureLiveStatus } from './TreasureLiveStatus';

// idle: 퀴즈 답 선택 전 / loading: 서버 추첨 중 / done: 결과 수신
// closed: 행사 시간 외 / error: 통신 오류 / unconfigured: 추첨 서버 미연결
type Phase = 'idle' | 'loading' | 'done' | 'closed' | 'error' | 'unconfigured';

const STORAGE_KEY_QUIZ = 'sinpo_quiz_answers_v1';

function readQuizAnswer(spotNumber: number): number | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_QUIZ);
    const parsed: Record<string, number> = raw ? JSON.parse(raw) : {};
    const value = parsed[String(spotNumber)];
    return typeof value === 'number' ? value : null;
  } catch {
    return null;
  }
}

function saveQuizAnswer(spotNumber: number, choiceIdx: number) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_QUIZ);
    const parsed: Record<string, number> = raw ? JSON.parse(raw) : {};
    parsed[String(spotNumber)] = choiceIdx;
    localStorage.setItem(STORAGE_KEY_QUIZ, JSON.stringify(parsed));
  } catch {
    // ignore storage errors
  }
}

const THEME_STYLE = {
  PAST: {
    badgeBg: 'bg-[#8C6239]',
    badgeText: 'text-white',
    accentText: 'text-[#8C6239]',
    lightBg: 'bg-[#f8efe2]',
    borderClass: 'border-[#8C6239]/40',
    heroGradient: 'from-[#3a2410] via-[#2a1a0b] to-[#1c1208]',
    routeDotBg: 'bg-[#8C6239]',
    routeLineBg: 'bg-[#8C6239]/30',
    stampTag: 'bg-[#f8efe2] text-[#6e4925] border-[#8C6239]/40',
  },
  NOW: {
    badgeBg: 'bg-[#E5A93C]',
    badgeText: 'text-[#2a1b0e]',
    accentText: 'text-[#b87914]',
    lightBg: 'bg-[#fff8e6]',
    borderClass: 'border-[#E5A93C]/50',
    heroGradient: 'from-[#422c09] via-[#2e1e06] to-[#1a1104]',
    routeDotBg: 'bg-[#d99722]',
    routeLineBg: 'bg-[#E5A93C]/40',
    stampTag: 'bg-[#fff7e2] text-[#7c5108] border-[#d99722]/50',
  },
  FUTURE: {
    badgeBg: 'bg-[#00ACC1]',
    badgeText: 'text-white',
    accentText: 'text-[#00838F]',
    lightBg: 'bg-[#e8f8fa]',
    borderClass: 'border-[#00ACC1]/40',
    heroGradient: 'from-[#0a3c44] via-[#07292e] to-[#04181b]',
    routeDotBg: 'bg-[#00838F]',
    routeLineBg: 'bg-[#00ACC1]/35',
    stampTag: 'bg-[#e8f8fa] text-[#006978] border-[#00ACC1]/45',
  },
} as const;

function parseStoryFlowNodes(subContent: string): { nodes: string[]; connector: '→' | '↔' } {
  if (subContent.includes('↔')) {
    return {
      nodes: subContent.split('↔').map((s) => s.trim()).filter(Boolean),
      connector: '↔',
    };
  }
  return {
    nodes: subContent.split('→').map((s) => s.trim()).filter(Boolean),
    connector: '→',
  };
}

function formatLiveTime(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd} ${hh}:${min}:${ss}`;
}

export const QrSpotClient: React.FC<{ spot: QrSpotItem; allSpots: PublicQrSpot[] }> = ({
  spot,
  allSpots,
}) => {
  const style = THEME_STYLE[spot.theme];
  const flowData = spot.card.subContent ? parseStoryFlowNodes(spot.card.subContent) : null;

  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<DrawResult | null>(null);
  const [stamps, setStamps] = useState<number[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [isStampBookOpen, setIsStampBookOpen] = useState<boolean>(false);
  const [nowTime, setNowTime] = useState<Date | null>(null);
  const startedRef = useRef(false);

  // 1. 서버 추첨 요청 (추첨·재고·확률 계산은 모두 서버에서 처리)
  const runDraw = useCallback(async () => {
    if (!isTreasureConfigured) {
      setPhase('unconfigured');
      return;
    }
    setPhase('loading');
    try {
      const res = await scanAndDraw(spot.secretSlug, getDeviceId());
      if (res.stamps) setStamps(res.stamps);
      if (res.status === 'ok') {
        setResult(res);
        setPhase('done');
      } else if (res.status === 'closed') {
        setPhase('closed');
      } else {
        setPhase('error');
      }
    } catch {
      setPhase('error');
    }
  }, [spot.secretSlug]);

  // 2. 스토리 카드는 접속 즉시, 퀴즈 카드는 답을 고른 뒤 추첨
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const savedAnswer = spot.isQuiz ? readQuizAnswer(spot.spotNumber) : null;
    if (savedAnswer !== null) setSelectedChoice(savedAnswer);
    if (!spot.isQuiz || savedAnswer !== null) {
      runDraw();
    }
  }, [spot, runDraw]);

  // 3. 캡처 방지용 실시간 시계 타이머
  useEffect(() => {
    setNowTime(new Date());
    const timer = setInterval(() => {
      setNowTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSelectQuizChoice = (choiceIdx: number) => {
    if (selectedChoice !== null) return;
    setSelectedChoice(choiceIdx);
    saveQuizAnswer(spot.spotNumber, choiceIdx);
    runDraw();
  };

  const collectedCount = stamps.length;
  const isQuizAnswered = selectedChoice !== null;
  const isQuizCorrect = spot.quiz ? selectedChoice === spot.quiz.answerIndex : false;
  const tier = phase === 'done' ? result?.tier : undefined;
  const hasPrize = tier === 'FIRST' || tier === 'SECOND' || tier === 'NOTE';

  const tierMeta =
    tier === 'FIRST'
      ? {
          badge: '🏆 1등 황금 보물 당첨!',
          title: 'BBQ 반반세트 당첨 인증권',
          subtitle: '신포 골목 깊은 곳의 숨은 행운을 찾으셨습니다! (총 6명 한정)',
          cardBg: 'from-[#3a2608] via-[#2b1b05] to-[#1c1204]',
          border: 'border-[#E5A93C]',
          accent: 'text-[#F3C15F]',
          icon: Trophy,
        }
      : tier === 'SECOND'
      ? {
          badge: '🎉 2등 알짜 보물 당첨!',
          title: '스타벅스 든든한 아침식사 세트 당첨 인증권',
          subtitle: '발자국을 따라 신포 골목을 누빈 보물 사냥꾼에게 드리는 행운! (총 10명 한정)',
          cardBg: 'from-[#10343b] via-[#0b252a] to-[#06171a]',
          border: 'border-[#00ACC1]',
          accent: 'text-[#4dd0e1]',
          icon: Award,
        }
      : tier === 'NOTE'
      ? {
          badge: '🎁 참가상 당첨 · 리워드 인증권',
          title: '참가상 인천대학교 기념 노트 수령권',
          subtitle: '축하합니다! 참가상 인천대학교 기념 노트에 당첨되셨습니다. (총 80권, 1인 1권)',
          cardBg: 'from-[#2e1f11] via-[#23170c] to-[#170f07]',
          border: 'border-[#8C6239]',
          accent: 'text-[#E5A93C]',
          icon: Gift,
        }
      : {
          badge: '😢 아쉽지만 이번엔 꽝!',
          title: '다음 QR에서 다시 도전하세요',
          subtitle: `이번 QR에서는 경품이 나오지 않았습니다. QR #${spot.spotCode} 스탬프는 도감에 찍혔어요. 다른 골목의 QR을 찍으면 다시 추첨됩니다!`,
          cardBg: 'from-[#2e1f11] via-[#23170c] to-[#170f07]',
          border: 'border-[#8C6239]',
          accent: 'text-[#E5A93C]',
          icon: Stamp,
        };

  const TierIcon = tierMeta.icon;

  return (
    <div className="min-h-screen bg-[#f7f2e7] text-[#2a1b0e] pb-16">
      {/* 1. 상단 고정 스팟 상태바 & 내 스탬프 도감 토글 */}
      <div className="sticky top-16 z-30 border-b border-[#d8c6a8] bg-[#2a1b0e]/95 text-white backdrop-blur-md shadow-md">
        <div className="mx-auto max-w-2xl px-4 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-black shrink-0 ${style.badgeBg} ${style.badgeText}`}
            >
              보물 QR #{spot.spotCode} / 20
            </span>
            <span className="text-xs font-bold text-amber-200 truncate">
              {spot.chapterTitle} · {spot.guideHeaderCode}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsStampBookOpen((prev) => !prev)}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1 text-xs font-extrabold text-amber-300 transition shrink-0"
          >
            <Stamp className="w-3.5 h-3.5" />
            <span>스탬프 도감 ({collectedCount}/20)</span>
            {isStampBookOpen ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* 스탬프 도감 접이식 드로어 (20개 전체 스팟 수집 현황) */}
        {isStampBookOpen && (
          <div className="border-t border-white/15 bg-[#1c1209] px-4 py-4">
            <div className="mx-auto max-w-2xl">
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-xs font-bold text-amber-200">
                  내 기기에 저장된 신포 보물 스탬프 ({collectedCount} / 20개 발견)
                </p>
                <span className="text-[11px] text-gray-300">
                  초록색 번호는 스캔 완료된 보물입니다
                </span>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                {allSpots.map((item) => {
                  const isCollected = stamps.includes(item.spotNumber);
                  const isCurrent = item.spotNumber === spot.spotNumber;
                  return (
                    <div
                      key={item.spotNumber}
                      className={`rounded-lg p-1.5 text-center border text-[11px] font-mono font-black transition ${
                        isCurrent
                          ? 'bg-[#E5A93C] text-[#2a1b0e] border-white ring-2 ring-[#E5A93C]/60'
                          : isCollected
                          ? 'bg-emerald-900/70 text-emerald-200 border-emerald-500/50'
                          : 'bg-white/5 text-gray-400 border-white/10'
                      }`}
                    >
                      <div>#{item.spotCode}</div>
                      <div className="text-[9px] font-sans font-bold truncate">
                        {isCollected ? '획득' : item.theme}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. 상단 히어로 배너 (현재 QR 스팟 위치 & 동적 확률 안내) */}
      <section className={`bg-gradient-to-br ${style.heroGradient} text-white py-8 px-4 border-b border-[#8C6239]/30`}>
        <div className="mx-auto max-w-2xl space-y-3">
          {/* 처음 찍은 사람도 무슨 행사인지 바로 알 수 있는 한눈 요약 */}
          <div className="rounded-xl border border-[#E5A93C]/50 bg-black/35 p-3.5 mb-4">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-sm font-black text-[#F3C15F]">
                <Gift className="w-4 h-4 shrink-0" />
                {FESTIVAL_INFO.name}
              </span>
              <Link
                href="/event"
                className="inline-flex items-center gap-0.5 shrink-0 text-[11px] font-bold text-amber-200 underline underline-offset-2"
              >
                행사 안내
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <p className="mt-1.5 text-[13px] sm:text-sm font-bold text-white leading-snug break-keep">
              시장 곳곳의 QR {FESTIVAL_INFO.qrCount}개를 찍으면 그 자리에서 경품 추첨!
            </p>
            <ul className="mt-2 flex flex-wrap gap-1.5 text-[11px] font-bold">
              <li className="rounded bg-[#E5A93C] px-2 py-0.5 text-[#2a1b0e]">1등 BBQ 반반세트</li>
              <li className="rounded bg-white/90 px-2 py-0.5 text-[#2a1b0e]">2등 스타벅스 아침식사 세트</li>
              <li className="rounded bg-white/15 px-2 py-0.5 text-amber-100">참가상 인천대 노트</li>
            </ul>
            <p className="mt-2 text-[11px] text-gray-300 leading-snug break-keep">
              {FESTIVAL_INFO.period} {FESTIVAL_INFO.hours} · 당첨되면 지원센터 앞 리워드 부스에서 수령
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded bg-white/15 px-2.5 py-1 text-[11px] font-bold text-amber-200">
              <MapPin className="w-3.5 h-3.5 text-[#E5A93C]" />
              {spot.zone.location} ({spot.spotLocationLabel})
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-[#E5A93C]/20 border border-[#E5A93C]/40 px-2.5 py-1 text-[11px] font-extrabold text-amber-300">
              {spot.alleyOddsBadge}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
            <span className="text-[#E5A93C] mr-2">[{spot.guideHeaderCode}]</span>
            {spot.card.title}
          </h1>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            {spot.isQuiz
              ? '아래 골목 퀴즈의 정답을 맞히고 화면을 스크롤하여 즉석 보물 당첨 결과를 확인하세요!'
              : '신포국제시장 100년 골목 스토리를 읽고 화면을 아래로 스크롤하여 즉석 당첨 결과를 확인하세요!'}
          </p>
        </div>
      </section>

      {/* 3. 메인 컨테이너: 스토리 카드 또는 인터랙티브 퀴즈 카드 */}
      <div className="mx-auto max-w-2xl px-4 pt-6 space-y-6">
        <div className="relative rounded-2xl bg-[#fffdf8] border-2 border-[#d8c39e] p-5 sm:p-7 shadow-lg">
          {/* 상단 카드 메타 헤더 */}
          <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b-2 border-[#8C6239]/25">
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-1 rounded text-xs font-mono font-black ${style.badgeBg} ${style.badgeText}`}
              >
                {spot.guideHeaderCode} · {spot.chapterTitle}
              </span>
              <span className="px-2 py-0.5 rounded bg-[#2a1b0e]/10 text-[#2a1b0e] text-xs font-extrabold">
                {spot.isQuiz ? '🎯 현장 미션 퀴즈' : '📖 골목 스토리 카드'}
              </span>
            </div>
            <span className="text-xs font-mono font-black text-[#6e4f2d]">
              {spot.card.cardNumber}
            </span>
          </div>

          {/* 핵심 헤드라인 인용구 (mainCopy) */}
          <div className={`rounded-xl ${style.lightBg} border-l-4 border-[#8C6239] p-4 mb-5`}>
            <p className="text-base sm:text-lg font-black text-[#2a1b0e] leading-snug break-keep">
              “{spot.card.mainCopy}”
            </p>
          </div>

          {/* 분기 A: 퀴즈 스팟인 경우 (3지선다 인터랙티브 퀴즈) */}
          {spot.isQuiz && spot.quiz ? (
            <div className="space-y-4">
              <p className="text-xs font-bold text-[#6e4f2d]">
                아래 3개의 보기 중 알맞은 정답을 선택해 주세요! (선택 즉시 하단 보물 당첨 상자가 열립니다)
              </p>

              <div className="space-y-2.5">
                {spot.quiz.choices.map((choiceText, idx) => {
                  const isSelected = selectedChoice === idx;
                  const isAnswer = idx === spot.quiz!.answerIndex;

                  let btnClass =
                    'border-[#d8c39e] bg-white text-[#2a1b0e] hover:border-[#8C6239] hover:bg-[#fdf8ee]';
                  if (isQuizAnswered) {
                    if (isAnswer) {
                      btnClass =
                        'border-emerald-600 bg-emerald-50 text-emerald-950 font-black ring-2 ring-emerald-500/30';
                    } else if (isSelected) {
                      btnClass = 'border-red-400 bg-red-50 text-red-800';
                    } else {
                      btnClass = 'border-gray-200 bg-gray-50 text-gray-400 opacity-65';
                    }
                  }

                  return (
                    <button
                      key={choiceText}
                      type="button"
                      disabled={isQuizAnswered}
                      onClick={() => handleSelectQuizChoice(idx)}
                      className={`w-full flex items-center justify-between rounded-xl border-2 p-4 text-left text-sm sm:text-base font-bold transition-all ${btnClass}`}
                    >
                      <span>{choiceText}</span>
                      {isQuizAnswered && isAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {isQuizAnswered && isSelected && !isAnswer && (
                        <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* 정답 선택 후 해설 표시 */}
              {isQuizAnswered && (
                <div
                  className={`rounded-xl p-4 border text-xs sm:text-sm leading-relaxed ${
                    isQuizCorrect
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-amber-50 border-amber-300 text-amber-950'
                  }`}
                >
                  <p className="font-black text-sm mb-1">
                    {isQuizCorrect
                      ? '🎉 정답입니다! 신포 골목 박사님이시네요!'
                      : '💡 아쉽지만 괜찮아요! 정답과 해설을 확인해 보세요.'}
                  </p>
                  <p>{spot.quiz.explanation}</p>
                </div>
              )}
            </div>
          ) : (
            /* 분기 B: 스토리 카드인 경우 (원문 body + STORY FLOW 타임라인) */
            <div className="space-y-4">
              <p className="text-sm sm:text-[15px] text-[#3a2818] leading-relaxed break-keep whitespace-pre-line">
                {spot.card.body}
              </p>

              {spot.card.subContent && flowData && (
                <div className="rounded-xl bg-[#faf4e8] border border-[#d8c39e] p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono font-black uppercase tracking-wider text-[#8C6239]">
                      <Route className="w-3.5 h-3.5" />
                      STORY FLOW · 신포 골목 흐름
                    </span>
                    <span className="text-[11px] font-mono text-[#7c5b38]">
                      {flowData.nodes.length} STEPS
                    </span>
                  </div>

                  <div className="space-y-2 pl-1">
                    {flowData.nodes.map((nodeText, idx) => {
                      const isLast = idx === flowData.nodes.length - 1;
                      return (
                        <div key={idx} className="relative flex items-start gap-2.5">
                          {!isLast && (
                            <span
                              aria-hidden="true"
                              className={`absolute left-[9px] top-4 bottom-[-10px] w-[2px] ${style.routeLineBg}`}
                            />
                          )}
                          <span
                            className={`relative z-10 mt-0.5 w-5 h-5 rounded-full ${style.routeDotBg} text-white text-[10px] font-mono font-black flex items-center justify-center shrink-0`}
                          >
                            {idx + 1}
                          </span>
                          <div className="text-xs sm:text-sm font-bold text-[#2c1d10] leading-snug break-keep">
                            {nodeText}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 키워드 해시태그 스탬프 */}
          <div className="mt-5 flex flex-wrap gap-1.5">
            {spot.card.keywords.map((kw) => (
              <span
                key={kw}
                className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-extrabold ${style.stampTag}`}
              >
                <Stamp className="w-3 h-3 opacity-70" />#{kw}
              </span>
            ))}
          </div>

          {/* 하단 한 줄 여운 문구 */}
          <div className="mt-5 rounded-xl bg-[#f6ede0] border border-[#8C6239]/25 p-3.5">
            <p className="text-xs sm:text-sm font-bold italic text-[#4a321a] leading-snug break-keep">
              “{spot.card.footerQuote}”
            </p>
          </div>
        </div>

        {/* 스크롤 유도 배너 */}
        <div className="flex flex-col items-center justify-center py-1 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#8C6239] px-4 py-1.5 text-xs font-black text-white shadow">
            <ChevronDown className="w-4 h-4 animate-bounce" />
            <span>아래에서 즉석 당첨 결과 &amp; 리워드 인증권을 확인하세요</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </div>
        </div>

        {/* 4. 하단 즉석 보물 당첨 결과 & 실시간 셀카 인증 섹션 */}
        <section
          id="reward-draw"
          className={`rounded-2xl bg-gradient-to-br ${tierMeta.cardBg} text-white border-2 ${tierMeta.border} p-5 sm:p-7 shadow-2xl space-y-5`}
        >
          {phase === 'idle' && (
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-[#E5A93C]/20 border border-[#E5A93C]/50 flex items-center justify-center text-[#E5A93C]">
                <Gift className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-300">
                  LOCKED TREASURE BOX
                </span>
                <h2 className="text-xl font-black">
                  위 퀴즈의 정답을 선택하면 보물 상자가 열립니다!
                </h2>
                <p className="text-xs text-gray-300">
                  3지선다 보기 중 하나를 터치해 보세요. 선택 즉시 당첨 결과가 열립니다.
                </p>
              </div>
              <button
                type="button"
                onClick={runDraw}
                className="inline-flex items-center gap-2 rounded-xl bg-[#E5A93C] px-5 py-3 text-xs sm:text-sm font-black text-[#2a1b0e] shadow-lg hover:bg-[#F3C15F] transition"
              >
                <Sparkles className="w-4 h-4" />
                당첨 결과 바로 열기
              </button>
            </div>
          )}

          {phase === 'loading' && (
            <div className="text-center py-10 space-y-3">
              <Loader2 className="mx-auto w-8 h-8 animate-spin text-[#E5A93C]" />
              <p className="text-sm font-bold text-amber-100">보물 상자를 여는 중입니다...</p>
            </div>
          )}

          {phase === 'closed' && (
            <div className="text-center py-6 space-y-3">
              <Clock className="mx-auto w-8 h-8 text-[#E5A93C]" />
              <h2 className="text-xl font-black">지금은 보물 추첨 시간이 아닙니다</h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed break-keep">
                즉석 추첨은 행사 시간에만 열립니다.
                <br />
                <strong className="text-amber-200">{FESTIVAL_INFO.periodDetail}</strong>
              </p>
            </div>
          )}

          {phase === 'unconfigured' && (
            <div className="text-center py-6 space-y-3">
              <Clock className="mx-auto w-8 h-8 text-[#E5A93C]" />
              <h2 className="text-xl font-black">보물 추첨을 준비하고 있습니다</h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed break-keep">
                즉석 추첨은 행사 기간에 열립니다. ({FESTIVAL_INFO.periodDetail})
              </p>
            </div>
          )}

          {phase === 'error' && (
            <div className="text-center py-6 space-y-4">
              <h2 className="text-xl font-black">당첨 결과를 불러오지 못했습니다</h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed break-keep">
                인터넷 연결을 확인한 뒤 아래 버튼을 눌러 다시 시도해 주세요.
              </p>
              <button
                type="button"
                onClick={runDraw}
                className="inline-flex items-center gap-2 rounded-xl bg-[#E5A93C] px-5 py-3 text-xs sm:text-sm font-black text-[#2a1b0e] shadow-lg hover:bg-[#F3C15F] transition"
              >
                <RefreshCw className="w-4 h-4" />
                다시 시도
              </button>
            </div>
          )}

          {phase === 'done' && result && (
            <>
              {/* 당첨 배지 & 타이틀 */}
              <div className="flex items-start justify-between gap-3 border-b border-white/15 pb-4">
                <div className="space-y-1.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E5A93C] px-3 py-1 text-xs font-black text-[#2a1b0e]">
                    <Sparkles className="w-3.5 h-3.5" />
                    {tierMeta.badge}
                  </span>
                  <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${tierMeta.accent}`}>
                    {tierMeta.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                    {tierMeta.subtitle}
                  </p>
                </div>
                <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-white/10 border border-white/20 items-center justify-center shrink-0">
                  <TierIcon className="w-7 h-7 text-[#E5A93C]" />
                </div>
              </div>

              {result.repeat && (
                <p className="rounded-lg bg-white/10 border border-white/15 px-3 py-2 text-[11px] sm:text-xs text-gray-200">
                  이미 확인한 QR입니다. 다음 골목의 QR을 찾아보세요!
                </p>
              )}

              {hasPrize && (
                <>
                  {/* 캡처 방지용 실시간 시계 & 고유 인증 코드 */}
                  <div className="rounded-xl bg-black/40 border border-white/15 p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                        </span>
                        <span className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          LIVE 실시간 인증 화면 (캡처본 사용 불가)
                        </span>
                      </div>
                      <span className="font-mono text-xs sm:text-sm font-black text-white bg-white/10 px-2.5 py-1 rounded">
                        {nowTime ? formatLiveTime(nowTime) : '실시간 동기화 중...'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-white/10 text-xs">
                      <div className="rounded-lg bg-white/5 px-3 py-2 flex items-center justify-between gap-2">
                        <span className="text-gray-400 shrink-0">고유 인증번호</span>
                        <span className="font-mono font-black text-amber-300">{result.code}</span>
                      </div>
                      <div className="rounded-lg bg-white/5 px-3 py-2 flex items-center justify-between">
                        <span className="text-gray-400">인증 스팟</span>
                        <span className="font-bold text-white">
                          QR #{spot.spotCode} ({spot.guideHeaderCode})
                        </span>
                      </div>
                    </div>
                  </div>

                  {result.claimed_at ? (
                    <div className="w-full rounded-xl bg-gray-800/90 border border-gray-600 p-3.5 text-center space-y-1">
                      <div className="inline-flex items-center gap-1.5 text-xs font-black text-gray-300">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>리워드 부스 경품 수령 완료</span>
                      </div>
                      <p className="text-[11px] text-gray-400">
                        이미 수령이 완료된 인증권입니다. 다음 골목의 QR을 찾아보세요!
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-amber-400/15 border border-amber-300/40 p-4 space-y-2">
                      <div className="flex items-center gap-2 text-amber-300 font-black text-sm">
                        <Camera className="w-4 h-4 shrink-0" />
                        <span>📸 경품 수령 방법 (리워드 부스 제시용)</span>
                      </div>
                      <p className="text-xs sm:text-[13px] text-amber-100/95 leading-relaxed break-keep">
                        화면 캡처 도용 방지를 위해 <strong>지금 계신 [{spot.spotLocationLabel}] 배경과 본인 얼굴이 함께 나오도록 셀카 사진</strong>을 촬영해 주세요.
                        <br />
                        <strong>{FESTIVAL_INFO.rewardLocation}</strong>에서 <strong>[① 이 실시간 화면의 인증번호 + ② 현장 셀카 사진]</strong>을 보여주시면 스태프 확인 후 경품을 드립니다. (운영: {FESTIVAL_INFO.periodDetail})
                      </p>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </section>

        {/* 4-1. 실시간 남은 경품 & 지금 확률 높은 골목 */}
        <TreasureLiveStatus spots={allSpots} />

        {/* 5. 다음 보물 힌트 & 전체 가이드북 이동 카드 */}
        <section className="rounded-2xl bg-white border border-[#d8c39e] p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8C6239] text-white flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-black uppercase tracking-wider text-[#8C6239]">
                NEXT TREASURE HINT · 다음 보물 힌트
              </span>
              <h3 className="text-base font-black text-[#2a1b0e]">
                다음 QR 보물은 어디에 있을까요?
              </h3>
              <p className="text-xs sm:text-sm text-[#5c4328] leading-relaxed break-keep">
                {spot.nextSpotHint}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            <Link
              href="/history#theme-cards"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#8C6239] hover:bg-[#724f2c] px-4 py-3 text-xs sm:text-sm font-black text-white transition"
            >
              <BookOpen className="w-4 h-4" />
              <span>보물찾기 힌트북 (20개 도감) 보기</span>
            </Link>
            <Link
              href="/event"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#f5ecdc] hover:bg-[#eadbc2] border border-[#d8c39e] px-4 py-3 text-xs sm:text-sm font-black text-[#2a1b0e] transition"
            >
              <QrCode className="w-4 h-4 text-[#8C6239]" />
              <span>디지털 보물찾기 전체 안내</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </div>

    </div>
  );
};
