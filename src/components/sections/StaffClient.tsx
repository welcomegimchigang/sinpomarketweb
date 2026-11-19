"use client";

import React, { useState } from 'react';
import { ShieldCheck, Search, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import {
  isTreasureConfigured,
  staffClaim,
  staffLookup,
  StaffResult,
  TIER_LABEL,
} from '../../lib/treasure';

function formatKst(iso?: string | null): string {
  if (!iso) return '-';
  return new Date(iso).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', hour12: false });
}

/**
 * 리워드 부스 스태프 전용 : 인증번호 조회 → 수령 처리
 * PIN 은 서버(Supabase)에서 검증하며, 이 화면에는 저장하지 않습니다.
 */
export const StaffClient: React.FC = () => {
  const [pin, setPin] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<StaffResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const run = async (action: 'lookup' | 'claim') => {
    if (!pin.trim() || !code.trim()) {
      setMessage('PIN과 인증번호를 모두 입력해 주세요.');
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const res =
        action === 'lookup'
          ? await staffLookup(code.trim(), pin.trim())
          : await staffClaim(code.trim(), pin.trim());
      if (res.status === 'denied') {
        setResult(null);
        setMessage('PIN이 올바르지 않습니다.');
      } else if (res.status === 'notfound') {
        setResult(null);
        setMessage('존재하지 않는 인증번호입니다. 번호를 다시 확인해 주세요.');
      } else {
        setResult(res);
        if (action === 'claim') setMessage('수령 처리되었습니다.');
      }
    } catch {
      setMessage('서버에 연결하지 못했습니다. 인터넷 연결을 확인해 주세요.');
    } finally {
      setBusy(false);
    }
  };

  const claimed = Boolean(result?.claimed_at);

  return (
    <section className="min-h-[70vh] bg-[#f7f2e7] py-10 px-4">
      <div className="mx-auto max-w-md space-y-5">
        <div className="flex items-center gap-2 text-[#2a1b0e]">
          <ShieldCheck className="h-6 w-6 text-[#8C6239]" />
          <h1 className="text-xl font-black">리워드 부스 스태프 확인</h1>
        </div>

        {!isTreasureConfigured && (
          <p className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
            추첨 서버가 아직 연결되지 않았습니다. (환경변수 미설정)
          </p>
        )}

        <form
          className="space-y-3 rounded-2xl border border-[#d8c39e] bg-white p-5 shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
            run('lookup');
          }}
        >
          <label className="block text-xs font-bold text-[#5c4328]">
            스태프 PIN
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              autoComplete="off"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-mono focus:border-[#8C6239] focus:outline-none"
            />
          </label>
          <label className="block text-xs font-bold text-[#5c4328]">
            인증번호 (예: SINPO-07-1A2B3C4D)
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              autoComplete="off"
              autoCapitalize="characters"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-mono focus:border-[#8C6239] focus:outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8C6239] py-3 text-sm font-black text-white hover:bg-[#724f2c] disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            인증번호 조회
          </button>
        </form>

        {message && (
          <p className="rounded-lg border border-[#d8c39e] bg-white p-3 text-sm font-bold text-[#2a1b0e]">
            {message}
          </p>
        )}

        {result && result.status === 'found' && (
          <div
            className={`space-y-3 rounded-2xl border-2 p-5 shadow-sm ${
              claimed ? 'border-red-300 bg-red-50' : 'border-emerald-400 bg-emerald-50'
            }`}
          >
            <div className="flex items-center gap-2 text-base font-black">
              {claimed ? (
                <>
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="text-red-800">이미 수령한 인증번호입니다</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span className="text-emerald-900">유효한 당첨입니다 · 지급 가능</span>
                </>
              )}
            </div>
            <dl className="space-y-1.5 text-sm text-[#2a1b0e]">
              <div className="flex justify-between gap-3">
                <dt className="text-gray-500">경품</dt>
                <dd className="font-black">{result.tier ? TIER_LABEL[result.tier] : '-'}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-gray-500">인증번호</dt>
                <dd className="font-mono font-bold">{result.code}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-gray-500">QR 스팟</dt>
                <dd className="font-bold">#{String(result.spot ?? '').padStart(2, '0')}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-gray-500">당첨 시각</dt>
                <dd>{formatKst(result.scanned_at)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-gray-500">수령 시각</dt>
                <dd>{formatKst(result.claimed_at)}</dd>
              </div>
            </dl>
            {!claimed && (
              <button
                type="button"
                disabled={busy}
                onClick={() => run('claim')}
                className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-black text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                경품 지급 완료 처리
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
