/**
 * 디지털 보물찾기 서버 추첨 연동 (Supabase RPC)
 * - 추첨·재고·확률 계산은 모두 Supabase 함수(supabase/schema.sql)에서 처리합니다.
 * - 브라우저는 결과를 받아 보여주기만 합니다.
 */

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '');
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isTreasureConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export type DrawTier = 'FIRST' | 'SECOND' | 'NOTE' | 'STAMP';

export interface DrawResult {
  status: 'ok' | 'closed' | 'invalid';
  repeat?: boolean; // 같은 QR을 연속으로 찍어 직전 결과를 돌려받은 경우
  spot?: number;
  tier?: DrawTier;
  code?: string | null;
  scanned_at?: string;
  claimed_at?: string | null;
  stamps?: number[]; // 이 기기가 지금까지 찍은 QR 번호
}

export interface HotSpot {
  spot: number;
  zone: 'PAST' | 'NOW' | 'FUTURE';
  m: number; // 확률 배율
}

export interface TreasureStatus {
  open: boolean;
  warmed: boolean; // false 면 아직 모든 QR이 같은 확률
  available: { first: number; second: number }; // 지금 당첨 가능한 수량
  remaining: { first: number; second: number; note: number }; // 전체 남은 수량
  next_release_at: string | null;
  hot: HotSpot[];
}

export interface StaffResult {
  status: 'found' | 'notfound' | 'denied';
  code?: string;
  tier?: DrawTier;
  spot?: number;
  scanned_at?: string;
  claimed_at?: string | null;
}

async function rpc<T>(fn: string, body: Record<string, unknown>): Promise<T> {
  if (!isTreasureConfigured) {
    throw new Error('treasure-not-configured');
  }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`treasure-rpc-${fn}-${res.status}`);
  }
  return (await res.json()) as T;
}

export const scanAndDraw = (slug: string, deviceId: string) =>
  rpc<DrawResult>('scan_and_draw', { p_slug: slug, p_device_id: deviceId });

export const getTreasureStatus = () => rpc<TreasureStatus>('get_status', {});

export const staffLookup = (code: string, pin: string) =>
  rpc<StaffResult>('staff_lookup', { p_code: code, p_pin: pin });

export const staffClaim = (code: string, pin: string) =>
  rpc<StaffResult>('staff_claim', { p_code: code, p_pin: pin });

const DEVICE_KEY = 'sinpo_device_id_v1';
let memoryDeviceId: string | null = null;

function createUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** 휴대폰(브라우저)마다 한 번 만들어 계속 쓰는 고유 번호. 개인정보가 아닌 무작위 값입니다. */
export function getDeviceId(): string {
  try {
    const saved = localStorage.getItem(DEVICE_KEY);
    if (saved) return saved;
    const created = createUuid();
    localStorage.setItem(DEVICE_KEY, created);
    return created;
  } catch {
    if (!memoryDeviceId) memoryDeviceId = createUuid();
    return memoryDeviceId;
  }
}

export const TIER_LABEL: Record<DrawTier, string> = {
  FIRST: '1등 · BBQ 반반세트',
  SECOND: '2등 · 스타벅스 든든한 아침식사 세트',
  NOTE: '참가상 · 인천대학교 기념 노트',
  STAMP: '스탬프',
};

// ---------------------------------------------------------------------
// 관리자 페이지 (/admin) : 비밀번호는 서버(Supabase)에서 검증합니다.
// ---------------------------------------------------------------------
export interface AdminSpot {
  id: number;
  zone: 'PAST' | 'NOW' | 'FUTURE';
  x: number;
  y: number;
  n: number; // 오늘 찍은 기기 수
  s: number; // 점수 (-1 ~ +1)
  m: number; // 확률 배율
  scans: number; // 전체 스캔 횟수
}

export interface AdminScan {
  id: number;
  device_id: string;
  spot_id: number;
  created_at: string;
  tier: DrawTier;
  code: string | null;
  multiplier: number | null;
  ip: string | null;
  claimed_at: string | null;
}

export interface AdminDashboard {
  status: 'ok' | 'denied';
  now: string;
  open: boolean;
  settings: Record<string, string>;
  spots: AdminSpot[];
  totals: {
    scans: number;
    scans_today: number;
    devices: number;
    devices_today: number;
    first: number;
    second: number;
    note: number;
    claimed: number;
  };
  available: { first: number; second: number; note: number };
  scans: AdminScan[];
}

export interface AdminActionResult {
  status: 'ok' | 'denied' | 'invalid' | 'notfound';
}

export const adminDashboard = (password: string) =>
  rpc<AdminDashboard>('admin_dashboard', { p_password: password });

export const adminSaveSpots = (password: string, spots: { id: number; x: number; y: number }[]) =>
  rpc<AdminActionResult>('admin_save_spots', { p_password: password, p_spots: spots });

export const adminUpdateSetting = (password: string, key: string, value: string) =>
  rpc<AdminActionResult>('admin_update_setting', { p_password: password, p_key: key, p_value: value });

export const adminSetClaimed = (password: string, id: number, claimed: boolean) =>
  rpc<AdminActionResult>('admin_set_claimed', { p_password: password, p_id: id, p_claimed: claimed });

export const adminDeleteScan = (password: string, id: number) =>
  rpc<AdminActionResult>('admin_delete_scan', { p_password: password, p_id: id });
