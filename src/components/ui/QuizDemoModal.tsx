"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, XCircle, Camera, ArrowRight, X, RotateCcw } from 'lucide-react';
import Link from 'next/link';

interface DemoQuiz {
  id: number;
  question: string;
  choices: string[];
  answer: number; // 0-based
  explanation: string;
  spotName: string;
  badge: string;
}

const DEMO_QUIZZES: DemoQuiz[] = [
  {
    id: 1,
    badge: "QUIZ 01 · 원조 먹거리",
    spotName: "1970년대 원조 쫄면 노포 앞",
    question: "1970년대 초, 인천 중구 경동에서 최초로 탄생한 것으로 알려진 국민 분식은?",
    choices: ["① 칼국수", "② 쫄면", "③ 우동"],
    answer: 1,
    explanation: "정답은 ②번 쫄면입니다! 1970년대 초 인천 중구 경동 '광신제면'에서 냉면 제조 중 우연히 굵게 뽑힌 면발이 오늘날 전국민의 분식 쫄면이 되었습니다.",
  },
  {
    id: 2,
    badge: "QUIZ 02 · 4대 명물",
    spotName: "화덕만두 & 공갈빵 옹기 화덕 앞",
    question: "신포국제시장의 4대 대표 명물에 포함되지 않는 음식은?",
    choices: ["① 공갈빵", "② 오색만두", "③ 호떡"],
    answer: 2,
    explanation: "정답은 ③번 호떡입니다! 신포국제시장의 4대 대표 먹거리는 닭강정, 공갈빵, 오색만두, 원조 쫄면입니다.",
  },
  {
    id: 3,
    badge: "QUIZ 03 · 100년 역사",
    spotName: "푸성귀전 옛 장터 기념 조형물 앞",
    question: "1883년 개항 이후, 중국 상인들이 채소와 나물을 팔던 장터의 이름은?",
    choices: ["① 어물전", "② 푸성귀전", "③ 공설시장"],
    answer: 1,
    explanation: "정답은 ②번 푸성귀전입니다! '푸성귀'는 나물과 채소를 뜻하며, 시장 골목에 이를 기념하는 조형물이 남아 있습니다.",
  },
];

export const QuizDemoModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  // 첫 접속 시 팝업 띄우기 (페이지 로드 0.8초 후 자연스럽게 오픈)
  useEffect(() => {
    const hasSeen = sessionStorage.getItem('sinpo_quiz_demo_seen');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('sinpo_quiz_demo_seen', 'true');
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const quiz = DEMO_QUIZZES[currentQuizIdx];
  const isAnswered = selectedChoice !== null;
  const isCorrect = selectedChoice === quiz.answer;

  const handleNextQuiz = () => {
    setSelectedChoice(null);
    setCurrentQuizIdx((prev) => (prev + 1) % DEMO_QUIZZES.length);
  };

  return (
    <>
      {/* 1. 언제든 다시 열어볼 수 있는 우측 하단 플로팅 버튼 */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#8C6239] px-4 py-3 text-sm font-black text-white shadow-xl transition-all hover:scale-105 hover:bg-[#704d2b] focus:outline-none"
      >
        <Sparkles className="h-4 w-4 text-[#E5A93C]" />
        <span>QR 퀴즈 맛보기 체험</span>
      </button>

      {/* 2. 팝업 모달 오버레이 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
            {/* 모달 상단 헤더 */}
            <div className="bg-gradient-to-r from-[#2a1b0e] via-[#3d2714] to-[#1c130b] px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-[#E5A93C] px-2.5 py-0.5 text-[11px] font-black text-[#2a1b0e]">
                    QR DEMO
                  </span>
                  <span className="text-xs text-amber-200/90 font-medium">현장 스캔 퀴즈 미리보기</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="모달 닫기"
                  className="rounded-full p-1 text-gray-300 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <h3 className="mt-2 text-lg font-black tracking-tight sm:text-xl text-white">
                골목길 QR 미션 체험존
              </h3>
              <p className="text-xs text-gray-300 mt-0.5">
                현장 골목에서 QR을 찍으면 이런 퀴즈가 열립니다. 직접 풀어보세요!
              </p>
            </div>

            {/* 모달 본문 */}
            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* 퀴즈 질문 카드 */}
              <div className="rounded-xl border border-gray-200 bg-[#fdfbf7] p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#8C6239]">{quiz.badge}</span>
                  <button
                    onClick={handleNextQuiz}
                    className="flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-[#8C6239]"
                  >
                    <RotateCcw className="h-3 w-3" /> 다른 문제 풀기
                  </button>
                </div>
                <h4 className="text-base font-bold text-gray-900 leading-snug">
                  {quiz.question}
                </h4>

                {/* 3지선다 선택지 버튼 */}
                <div className="mt-4 space-y-2">
                  {quiz.choices.map((choice, idx) => {
                    const isSelected = selectedChoice === idx;
                    const isTargetAnswer = idx === quiz.answer;

                    let btnStyle = "border-gray-200 bg-white text-gray-800 hover:border-[#8C6239]/50";
                    if (isAnswered) {
                      if (isTargetAnswer) {
                        btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/20";
                      } else if (isSelected) {
                        btnStyle = "border-red-400 bg-red-50 text-red-700";
                      } else {
                        btnStyle = "border-gray-100 bg-gray-50 text-gray-400 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => setSelectedChoice(idx)}
                        className={`flex w-full items-center justify-between rounded-lg border p-3 text-left text-sm font-semibold transition-all ${btnStyle}`}
                      >
                        <span>{choice}</span>
                        {isAnswered && isTargetAnswer && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        )}
                        {isAnswered && isSelected && !isTargetAnswer && (
                          <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* 정답 해설 박스 */}
                {isAnswered && (
                  <div className={`mt-4 rounded-lg p-3.5 text-xs leading-relaxed ${
                    isCorrect ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-amber-50 border border-amber-200 text-amber-900"
                  }`}>
                    <p className="font-bold mb-1">
                      {isCorrect ? "🎉 정답입니다!" : "💡 아쉽네요! 정답을 확인해보세요."}
                    </p>
                    <p>{quiz.explanation}</p>
                  </div>
                )}
              </div>

              {/* [핵심 유인설계] 퀴즈 완료 후 셀카 인증 안내 박스 */}
              {isAnswered && (
                <div className="rounded-xl border border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 p-4 text-[#6e4612] shadow-sm animate-fadeIn">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E5A93C] text-[#2a1b0e]">
                      <Camera className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <span className="inline-block rounded bg-[#E5A93C] px-2 py-0.5 text-[10px] font-black text-[#2a1b0e]">
                        현장 필수 미션 안내
                      </span>
                      <h5 className="text-sm font-black text-[#3d2508]">
                        📸 현장에서는 이곳에서 본인 얼굴 셀카 인증이 필요합니다!
                      </h5>
                      <p className="text-xs text-[#704e22] leading-relaxed">
                        실제 행사에서는 지금 서 계신 <strong>[{quiz.spotName}]</strong> 배경과 함께 본인 얼굴이 나오도록 셀카를 찍어야 리워드 부스에서 1등 올리브영 3만원권 등 경품을 수령할 수 있습니다.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 하단 버튼 액션 */}
              <div className="flex items-center gap-3 pt-2">
                <Link
                  href="/event"
                  onClick={() => setIsOpen(false)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#8C6239] px-4 py-3 text-xs sm:text-sm font-bold text-white transition-colors hover:bg-[#724f2c]"
                >
                  보물찾기 행사 안내 전체 보기
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-3 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-100"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
