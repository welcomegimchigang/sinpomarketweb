"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ShieldCheck,
  RefreshCw,
  LogOut,
  Save,
  Trash2,
  MapPin,
  Settings as SettingsIcon,
  ListOrdered,
  Loader2,
  Undo2,
} from 'lucide-react';
import type { PublicQrSpot } from '../../data/qrSpots';
import {
  AdminDashboard,
  AdminScan,
  adminDashboard,
  adminDeleteScan,
  adminSaveSpots,
  adminSetClaimed,
  adminUpdateSetting,
  isTreasureConfigured,
  TIER_LABEL,
} from '../../lib/treasure';

const REFRESH_MS = 10000;
const SESSION_KEY = 'sinpo_admin_session_v1';

const ZONE_COLOR = { PAST: '#8C6239', NOW: '#d99722', FUTURE: '#00ACC1' } as const;
const ZONE_LABEL = { PAST: '과거', NOW: '오늘', FUTURE: '미래' } as const;

const SETTING_FIELDS: { key: string; label: string; hint: string }[] = [
  { key: 'test_mode', label: '테스트 모드', hint: 'true / false · 켜면 시간 제한 없이 전체 재고로 추첨' },
  { key: 'base_first', label: '1등 기본 확률', hint: '0 ~ 1 (예: 0.20 = 20%)' },
  { key: 'base_second', label: '2등 기본 확률', hint: '0 ~ 1 (예: 0.40 = 40%)' },
  { key: 'max_multiplier', label: '최대 배율', hint: '1 ~ 5 (최소 배율은 1 ÷ 이 값)' },
  { key: 'warmup_devices', label: '동일 확률 유지 인원', hint: '이 인원 전까지 모든 QR 같은 확률' },
  { key: 'first_total', label: '1등 총 수량', hint: '' },
  { key: 'second_total', label: '2등 총 수량', hint: '' },
  { key: 'note_total', label: '노트 총 수량', hint: '' },
  { key: 'event_days', label: '행사 날짜', hint: '쉼표로 구분 (예: 2026-11-27,2026-11-28)' },
  { key: 'open_time', label: '추첨 시작 시각', hint: '예: 12:00' },
  { key: 'close_time', label: '추첨 종료 시각', hint: '예: 18:00' },
];

function formatKst(iso?: string | null): string {
  if (!iso) return '-';
  return new Date(iso).toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

type Coord = { x: number; y: number };

const MAP_IMAGE = '/admin-map.webp';
const MAP_FRAME = { minX: 0, minY: 0, w: 100, h: (100 * 280) / 981 };
const MAP_PAD = 2.5; // 가장자리 점이 잘리지 않도록 지도 둘레에 두는 여백
const TRAY_H = 8; // 지도 아래 '아직 놓지 않은 QR' 대기 줄 높이

export const AdminClient: React.FC<{ spots: PublicQrSpot[] }> = ({ spots }) => {
  const [password, setPassword] = useState('');
  const [input, setInput] = useState('');
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loadedAt, setLoadedAt] = useState<Date | null>(null);
  const [coordDraft, setCoordDraft] = useState<Record<number, Coord>>({});
  const [settingDraft, setSettingDraft] = useState<Record<string, string>>({});
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragRef = useRef<number | null>(null);

  const labelOf = (id: number) => spots.find((s) => s.spotNumber === id)?.locationLabel ?? '';

  const load = useCallback(async (pw: string, silent = false) => {
    if (!silent) setBusy(true);
    try {
      const res = await adminDashboard(pw);
      if (res.status !== 'ok') {
        setData(null);
        setPassword('');
        try {
          sessionStorage.removeItem(SESSION_KEY);
        } catch {
          // ignore
        }
        setMessage('비밀번호가 올바르지 않습니다.');
        return false;
      }
      setData(res);
      setLoadedAt(new Date());
      return true;
    } catch {
      if (!silent) setMessage('서버에 연결하지 못했습니다.');
      return false;
    } finally {
      if (!silent) setBusy(false);
    }
  }, []);

  // 같은 탭에서 새로고침해도 로그인 유지 (탭을 닫으면 사라짐)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        setPassword(saved);
        load(saved);
      }
    } catch {
      // ignore
    }
  }, [load]);

  // 10초마다 자동 갱신
  useEffect(() => {
    if (!password || !data) return;
    const timer = setInterval(() => load(password, true), REFRESH_MS);
    return () => clearInterval(timer);
  }, [password, data, load]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;
    setMessage(null);
    const ok = await load(input);
    if (ok) {
      setPassword(input);
      setInput('');
      try {
        sessionStorage.setItem(SESSION_KEY, input);
      } catch {
        // ignore
      }
    }
  };

  const handleLogout = () => {
    setPassword('');
    setData(null);
    setCoordDraft({});
    setSettingDraft({});
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
  };

  const act = async (fn: () => Promise<{ status: string }>, okMessage: string) => {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fn();
      if (res.status === 'ok') {
        setMessage(okMessage);
        await load(password, true);
        return true;
      }
      setMessage(
        res.status === 'invalid'
          ? '값의 형식이 올바르지 않습니다.'
          : res.status === 'denied'
          ? '비밀번호가 올바르지 않습니다.'
          : '대상을 찾지 못했습니다.'
      );
      return false;
    } catch {
      setMessage('서버에 연결하지 못했습니다.');
      return false;
    } finally {
      setBusy(false);
    }
  };

  // ---------- 좌표 ----------
  const coords = useMemo(() => {
    const map: Record<number, Coord> = {};
    (data?.spots ?? []).forEach((sp) => {
      map[sp.id] = coordDraft[sp.id] ?? { x: Number(sp.x), y: Number(sp.y) };
    });
    return map;
  }, [data, coordDraft]);

  // 좌표평면 = 시장 지도 이미지(public/admin-map.webp, 981x280)와 같은 틀. 가로를 100으로 둡니다.
  const bounds = MAP_FRAME;
  const clampToMap = (c: Coord): Coord => ({
    x: Math.min(Math.max(c.x, 0), MAP_FRAME.w),
    y: Math.min(Math.max(c.y, 0), MAP_FRAME.h),
  });

  const isOutside = (c: Coord) => c.x < 0 || c.x > MAP_FRAME.w || c.y < 0 || c.y > MAP_FRAME.h;
  const outsideIds = (data?.spots ?? []).filter((sp) => isOutside(coords[sp.id])).map((sp) => sp.id);

  const dirtyCoords = Object.keys(coordDraft).length > 0;

  const setCoord = (id: number, next: Coord) =>
    setCoordDraft((prev) => ({
      ...prev,
      [id]: { x: Math.round(next.x * 10) / 10, y: Math.round(next.y * 10) / 10 },
    }));

  const pointerToCoord = (e: React.PointerEvent): Coord | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(ctm.inverse());
    return { x: p.x, y: p.y };
  };

  const saveCoords = () =>
    act(
      () =>
        adminSaveSpots(
          password,
          Object.entries(coordDraft).map(([id, c]) => ({ id: Number(id), x: c.x, y: c.y }))
        ),
      'QR 좌표를 저장했습니다.'
    ).then((ok) => {
      if (ok) setCoordDraft({});
    });

  // ---------- 스캔 ----------
  const handleDelete = (scan: AdminScan) => {
    const label = `#${scan.id} · QR ${scan.spot_id} · ${TIER_LABEL[scan.tier]}`;
    if (!window.confirm(`이 스캔 기록을 삭제할까요?\n${label}\n\n삭제하면 되돌릴 수 없고, 해당 경품은 다시 재고로 돌아갑니다.`)) {
      return;
    }
    act(() => adminDeleteScan(password, scan.id), '스캔 기록을 삭제했습니다.');
  };

  // ---------- 로그인 화면 ----------
  if (!data) {
    return (
      <section className="min-h-[70vh] bg-[#f7f2e7] px-4 py-14">
        <form
          onSubmit={handleLogin}
          className="mx-auto max-w-sm space-y-4 rounded-2xl border border-[#d8c39e] bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 text-[#2a1b0e]">
            <ShieldCheck className="h-6 w-6 text-[#8C6239]" />
            <h1 className="text-lg font-black">보물찾기 관리자</h1>
          </div>
          {!isTreasureConfigured && (
            <p className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
              추첨 서버가 아직 연결되지 않았습니다. (환경변수 미설정)
            </p>
          )}
          <label className="block text-xs font-bold text-[#5c4328]">
            관리자 비밀번호
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoComplete="current-password"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#8C6239] focus:outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8C6239] py-3 text-sm font-black text-white hover:bg-[#724f2c] disabled:opacity-50"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            들어가기
          </button>
          {message && <p className="text-xs font-bold text-red-700">{message}</p>}
        </form>
      </section>
    );
  }

  const s = data.settings;
  const testMode = s.test_mode === 'true';
  const tiles = [
    { label: '오늘 참여 기기', value: data.totals.devices_today, sub: `전체 ${data.totals.devices}` },
    { label: '오늘 스캔', value: data.totals.scans_today, sub: `전체 ${data.totals.scans}` },
    { label: '1등 당첨', value: `${data.totals.first} / ${s.first_total}`, sub: `지금 가능 ${data.available.first}` },
    { label: '2등 당첨', value: `${data.totals.second} / ${s.second_total}`, sub: `지금 가능 ${data.available.second}` },
    { label: '노트 발급', value: `${data.totals.note} / ${s.note_total}`, sub: `지금 가능 ${data.available.note}` },
    { label: '부스 수령 완료', value: data.totals.claimed, sub: '인증번호 기준' },
  ];

  return (
    <section className="min-h-screen bg-[#f7f2e7] px-3 py-6 text-[#2a1b0e] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* 헤더 */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-[#8C6239]" />
            <h1 className="text-xl font-black">보물찾기 관리자</h1>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-black ${
                data.open ? 'bg-emerald-600 text-white' : 'bg-gray-300 text-gray-700'
              }`}
            >
              {data.open ? '추첨 진행 중' : '추첨 닫힘'}
            </span>
            {testMode && (
              <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-[11px] font-black text-white">
                테스트 모드 켜짐
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#6b5640]">
            <span>{loadedAt ? `${loadedAt.toLocaleTimeString('ko-KR', { hour12: false })} 갱신 · 10초마다 자동` : ''}</span>
            <button
              type="button"
              onClick={() => load(password)}
              className="inline-flex items-center gap-1 rounded-lg border border-[#d8c39e] bg-white px-2.5 py-1.5 font-bold hover:bg-[#f3e7d3]"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${busy ? 'animate-spin' : ''}`} />
              새로고침
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1 rounded-lg border border-[#d8c39e] bg-white px-2.5 py-1.5 font-bold hover:bg-[#f3e7d3]"
            >
              <LogOut className="h-3.5 w-3.5" />
              나가기
            </button>
          </div>
        </div>

        {message && (
          <p className="rounded-lg border border-[#d8c39e] bg-white px-4 py-2.5 text-sm font-bold">{message}</p>
        )}

        {/* 요약 */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {tiles.map((t) => (
            <div key={t.label} className="rounded-xl border border-[#d8c39e] bg-white p-3.5 shadow-sm">
              <span className="block text-[11px] font-bold text-[#8C6239]">{t.label}</span>
              <span className="mt-1 block font-mono text-2xl font-black tabular-nums">{t.value}</span>
              <span className="block text-[11px] text-[#6b5640]">{t.sub}</span>
            </div>
          ))}
        </div>

        {/* QR 좌표 & 실시간 배율 */}
        <div className="rounded-2xl border border-[#d8c39e] bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-base font-black">
              <MapPin className="h-4 w-4 text-[#8C6239]" />
              QR 위치 · 오늘 인원 · 확률 배율
            </h2>
            <div className="flex items-center gap-2">
              {dirtyCoords && (
                <button
                  type="button"
                  onClick={() => setCoordDraft({})}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#d8c39e] px-3 py-1.5 text-xs font-bold hover:bg-[#f3e7d3]"
                >
                  <Undo2 className="h-3.5 w-3.5" />
                  되돌리기
                </button>
              )}
              <button
                type="button"
                disabled={!dirtyCoords || busy}
                onClick={saveCoords}
                className="inline-flex items-center gap-1 rounded-lg bg-[#8C6239] px-3 py-1.5 text-xs font-black text-white hover:bg-[#724f2c] disabled:opacity-40"
              >
                <Save className="h-3.5 w-3.5" />
                좌표 저장{dirtyCoords ? ` (${Object.keys(coordDraft).length}개 변경)` : ''}
              </button>
            </div>
          </div>
          <p className="mb-3 text-xs text-[#6b5640]">
            지도 위에서 점을 실제 QR 부착 위치로 끌어 옮긴 뒤 <strong>좌표 저장</strong>을 누르세요. 아직 놓지 않은 점은 지도 아래 줄에 번호순으로 있습니다. 원이 클수록 오늘 많이 찍힌 QR입니다.
          </p>

          <div className="grid gap-4">
            <div className="overflow-x-auto rounded-xl border border-[#e4d5b7] bg-[#fdfaf3]">
              <svg
                ref={svgRef}
                viewBox={`${-MAP_PAD} ${-MAP_PAD} ${bounds.w + MAP_PAD * 2} ${bounds.h + MAP_PAD + TRAY_H}`}
                className="h-auto w-full min-w-[820px] touch-none select-none"
                style={{ aspectRatio: `${bounds.w + MAP_PAD * 2} / ${bounds.h + MAP_PAD + TRAY_H}` }}
                onPointerMove={(e) => {
                  if (dragRef.current === null) return;
                  const c = pointerToCoord(e);
                  if (c) setCoord(dragRef.current, clampToMap(c));
                }}
                onPointerUp={() => {
                  dragRef.current = null;
                }}
                onPointerLeave={() => {
                  dragRef.current = null;
                }}
              >
                <image
                  href={MAP_IMAGE}
                  x={0}
                  y={0}
                  width={bounds.w}
                  height={bounds.h}
                  preserveAspectRatio="none"
                  pointerEvents="none"
                />
                <rect
                  x={0}
                  y={0}
                  width={bounds.w}
                  height={bounds.h}
                  fill="none"
                  stroke="#8C6239"
                  strokeWidth={0.2}
                  pointerEvents="none"
                />
                {outsideIds.length > 0 && (
                  <text x={0} y={bounds.h + 2.2} fontSize={1.5} fontWeight={700} fill="#6b5640" pointerEvents="none">
                    아직 지도에 놓지 않은 QR ({outsideIds.length}개) — 지도 위로 끌어 올리세요
                  </text>
                )}
                {data.spots.map((sp) => {
                  // 지도 밖 좌표는 지도 아래 대기 줄에 번호순으로 보여줍니다 (끌어 올리면 지도 안 좌표로 저장)
                  const trayIdx = outsideIds.indexOf(sp.id);
                  const c =
                    trayIdx >= 0
                      ? { x: ((trayIdx + 0.5) * bounds.w) / outsideIds.length, y: bounds.h + 5.2 }
                      : coords[sp.id];
                  const unit = 0.7;
                  const r = unit * (1.7 + Math.min(sp.n, 40) * 0.05);
                  return (
                    <g
                      key={sp.id}
                      onPointerDown={(e) => {
                        dragRef.current = sp.id;
                        (e.target as Element).setPointerCapture?.(e.pointerId);
                      }}
                      style={{ cursor: 'grab' }}
                    >
                      <circle
                        cx={c.x}
                        cy={c.y}
                        r={r}
                        fill={ZONE_COLOR[sp.zone]}
                        fillOpacity={coordDraft[sp.id] ? 0.55 : 0.9}
                        stroke={coordDraft[sp.id] ? '#dc2626' : '#ffffff'}
                        strokeWidth={unit * 0.3}
                      />
                      <text
                        x={c.x}
                        y={c.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={unit * 1.9}
                        fontWeight={900}
                        fill="#ffffff"
                        pointerEvents="none"
                      >
                        {sp.id}
                      </text>
                    </g>
                  );
                })}
              </svg>
              <div className="flex flex-wrap items-center gap-3 border-t border-[#e4d5b7] px-3 py-2 text-[11px] text-[#6b5640]">
                {(['PAST', 'NOW', 'FUTURE'] as const).map((z) => (
                  <span key={z} className="inline-flex items-center gap-1">
                    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ZONE_COLOR[z] }} />
                    {ZONE_LABEL[z]}
                  </span>
                ))}
                <span>빨간 테두리 = 저장 전 변경</span>
              </div>
            </div>

            <div className="max-h-[560px] overflow-auto rounded-xl border border-[#e4d5b7]">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-[#f3e7d3] text-left text-[11px] text-[#5c4328]">
                  <tr>
                    <th className="px-2 py-2">QR</th>
                    <th className="px-2 py-2">위치</th>
                    <th className="px-2 py-2">x</th>
                    <th className="px-2 py-2">y</th>
                    <th className="px-2 py-2 text-right">오늘 인원</th>
                    <th className="px-2 py-2 text-right">배율</th>
                  </tr>
                </thead>
                <tbody>
                  {data.spots.map((sp) => {
                    const c = coords[sp.id];
                    const m = Number(sp.m);
                    return (
                      <tr key={sp.id} className="border-t border-[#efe4cf]">
                        <td className="px-2 py-1.5 font-mono font-black" style={{ color: ZONE_COLOR[sp.zone] }}>
                          #{String(sp.id).padStart(2, '0')}
                        </td>
                        <td className="max-w-[140px] truncate px-2 py-1.5 text-[#5c4328]" title={labelOf(sp.id)}>
                          {labelOf(sp.id)}
                        </td>
                        {(['x', 'y'] as const).map((axis) => (
                          <td key={axis} className="px-1 py-1">
                            <input
                              type="number"
                              step="0.1"
                              value={c[axis]}
                              onChange={(e) => {
                                const v = Number(e.target.value);
                                if (!Number.isNaN(v)) setCoord(sp.id, { ...c, [axis]: v });
                              }}
                              className="w-16 rounded border border-gray-300 px-1.5 py-1 font-mono text-xs focus:border-[#8C6239] focus:outline-none"
                            />
                          </td>
                        ))}
                        <td className="px-2 py-1.5 text-right font-mono tabular-nums">{sp.n}</td>
                        <td
                          className={`px-2 py-1.5 text-right font-mono font-black tabular-nums ${
                            m > 1.02 ? 'text-emerald-700' : m < 0.98 ? 'text-red-700' : 'text-[#5c4328]'
                          }`}
                        >
                          ×{m.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 설정 */}
        <div className="rounded-2xl border border-[#d8c39e] bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-3 flex items-center gap-2 text-base font-black">
            <SettingsIcon className="h-4 w-4 text-[#8C6239]" />
            추첨 설정
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SETTING_FIELDS.map((f) => {
              const current = s[f.key] ?? '';
              const draft = settingDraft[f.key];
              const changed = draft !== undefined && draft !== current;
              return (
                <div key={f.key} className="rounded-xl border border-[#e4d5b7] bg-[#fdfaf3] p-3">
                  <label className="block text-xs font-bold text-[#5c4328]">{f.label}</label>
                  <div className="mt-1 flex items-center gap-1.5">
                    <input
                      type="text"
                      value={draft ?? current}
                      onChange={(e) => setSettingDraft((prev) => ({ ...prev, [f.key]: e.target.value }))}
                      className="w-full rounded border border-gray-300 px-2 py-1.5 font-mono text-xs focus:border-[#8C6239] focus:outline-none"
                    />
                    <button
                      type="button"
                      disabled={!changed || busy}
                      onClick={() =>
                        act(() => adminUpdateSetting(password, f.key, draft ?? current), `${f.label}을(를) 저장했습니다.`).then(
                          (ok) => {
                            if (ok)
                              setSettingDraft((prev) => {
                                const next = { ...prev };
                                delete next[f.key];
                                return next;
                              });
                          }
                        )
                      }
                      className="shrink-0 rounded bg-[#8C6239] px-2.5 py-1.5 text-[11px] font-black text-white hover:bg-[#724f2c] disabled:opacity-30"
                    >
                      저장
                    </button>
                  </div>
                  {f.hint && <span className="mt-1 block text-[10px] text-[#8a6d4b]">{f.hint}</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* 스캔 기록 */}
        <div className="rounded-2xl border border-[#d8c39e] bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-3 flex items-center gap-2 text-base font-black">
            <ListOrdered className="h-4 w-4 text-[#8C6239]" />
            스캔 기록 (최근 {data.scans.length}건)
          </h2>
          <div className="max-h-[560px] overflow-auto rounded-xl border border-[#e4d5b7]">
            <table className="w-full min-w-[760px] text-xs">
              <thead className="sticky top-0 bg-[#f3e7d3] text-left text-[11px] text-[#5c4328]">
                <tr>
                  <th className="px-2 py-2">번호</th>
                  <th className="px-2 py-2">시각</th>
                  <th className="px-2 py-2">기기</th>
                  <th className="px-2 py-2">QR</th>
                  <th className="px-2 py-2">결과</th>
                  <th className="px-2 py-2">인증번호</th>
                  <th className="px-2 py-2 text-right">배율</th>
                  <th className="px-2 py-2">IP</th>
                  <th className="px-2 py-2">수령</th>
                  <th className="px-2 py-2" />
                </tr>
              </thead>
              <tbody>
                {data.scans.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-3 py-8 text-center text-[#8a6d4b]">
                      아직 스캔 기록이 없습니다.
                    </td>
                  </tr>
                )}
                {data.scans.map((scan) => {
                  const big = scan.tier === 'FIRST' || scan.tier === 'SECOND';
                  return (
                    <tr key={scan.id} className={`border-t border-[#efe4cf] ${big ? 'bg-amber-50' : ''}`}>
                      <td className="px-2 py-1.5 font-mono text-[#8a6d4b]">{scan.id}</td>
                      <td className="whitespace-nowrap px-2 py-1.5">{formatKst(scan.created_at)}</td>
                      <td className="px-2 py-1.5 font-mono" title={scan.device_id}>
                        {scan.device_id.slice(0, 8)}
                      </td>
                      <td className="px-2 py-1.5 font-mono font-bold">#{String(scan.spot_id).padStart(2, '0')}</td>
                      <td className={`whitespace-nowrap px-2 py-1.5 ${big ? 'font-black text-[#8C6239]' : ''}`}>
                        {TIER_LABEL[scan.tier]}
                      </td>
                      <td className="px-2 py-1.5 font-mono">{scan.code ?? '-'}</td>
                      <td className="px-2 py-1.5 text-right font-mono tabular-nums">
                        {scan.multiplier !== null ? `×${Number(scan.multiplier).toFixed(2)}` : '-'}
                      </td>
                      <td className="px-2 py-1.5 font-mono text-[#8a6d4b]">{scan.ip ?? '-'}</td>
                      <td className="whitespace-nowrap px-2 py-1.5">
                        {scan.code ? (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              act(
                                () => adminSetClaimed(password, scan.id, !scan.claimed_at),
                                scan.claimed_at ? '수령 처리를 취소했습니다.' : '수령 처리했습니다.'
                              )
                            }
                            className={`rounded px-2 py-1 text-[11px] font-bold ${
                              scan.claimed_at
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'border border-gray-300 text-gray-600 hover:bg-gray-100'
                            }`}
                            title={scan.claimed_at ? `수령 ${formatKst(scan.claimed_at)} · 누르면 취소` : '누르면 수령 처리'}
                          >
                            {scan.claimed_at ? '수령 완료' : '미수령'}
                          </button>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-2 py-1.5">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleDelete(scan)}
                          className="rounded p-1 text-red-600 hover:bg-red-50"
                          aria-label="스캔 기록 삭제"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
