import { THEME_CARDS, THEME_ZONES } from './marketData';
import { ThemeCard, ThemeCategory, ThemeZoneInfo } from '../types';

export interface QrQuizData {
  question: string;
  choices: string[];
  answerIndex: number; // 0-based
  explanation: string;
}

export interface QrSpotItem {
  spotNumber: number; // 1 ~ 20
  spotCode: string; // "01" ~ "20"
  secretSlug: string; // URL 추측(어뷰징) 방지용 고유 난수 슬러그 (예: "s01-8f3k9m")
  guideHeaderCode: string; // "PAST 01" ~ "FUTURE 07"
  chapterNumber: number; // 1, 2, 3
  chapterTitle: string; // "과거의 신포", "오늘의 신포", "미래의 신포"
  theme: ThemeCategory;
  isQuiz: boolean;
  card: ThemeCard;
  zone: ThemeZoneInfo;
  spotLocationLabel: string; // 현장 스팟 위치 안내 (셀카 배경 안내용)
  nextSpotHint: string; // 다음 보물 찾기 동선 힌트
  alleyOddsBadge: string; // 구역 안내 배지 (실제 당첨 확률은 서버에서 실시간 계산)
  quiz?: QrQuizData;
}

/**
 * 1번~20번 QR 스팟별 고정 난수 슬러그 (36^6 = 약 21억 경우의 수로 주소창 숫자 대입 어뷰징 원천 차단)
 *
 * 주의: 왼쪽 숫자가 실물 QR에 인쇄된 번호(= 화면에 표시되는 번호)입니다.
 * 실물 QR 제작 시 번호가 밀려서 인쇄되어, 슬러그 앞자리(s01 ~ s20)는 실제 번호와 일치하지 않습니다.
 * (실물 1~9번 = s12~s20, 실물 10~20번 = s01~s11)
 * 여기를 바꾸면 supabase/schema.sql 의 treasure.spots 도 똑같이 맞춰야 합니다.
 */
const SECRET_SLUGS: Record<number, string> = {
  1: 's12-2n6v8w',
  2: 's13-8q4k3m',
  3: 's14-5b9r2x',
  4: 's15-3c7p6n',
  5: 's16-9m4w8t',
  6: 's17-6f2k7q',
  7: 's18-4x9n3v',
  8: 's19-8p5t2r',
  9: 's20-7k3m9w',
  10: 's01-8f3k9m',
  11: 's02-4p7v2n',
  12: 's03-9x2q5w',
  13: 's04-6m8t3r',
  14: 's05-2k9b7y',
  15: 's06-7h4n8c',
  16: 's07-5v3p9j',
  17: 's08-3w6z4q',
  18: 's09-9d2r7f',
  19: 's10-4g8m5k',
  20: 's11-7t3x9p',
};

const QUIZ_CONFIG_MAP: Record<string, QrQuizData> = {
  'quiz-01': {
    question: '1970년대 초, 인천 중구에서 최초로 탄생한 것으로 알려진 음식은?',
    choices: ['① 칼국수', '② 쫄면', '③ 우동'],
    answerIndex: 1,
    explanation:
      '정답은 ②번 쫄면입니다! 1970년대 초 인천 중구 경동 광신제면에서 냉면 제조 중 우연히 굵게 뽑힌 면발이 오늘날 전국민이 사랑하는 국민 분식 쫄면이 되었습니다.',
  },
  'quiz-02': {
    question: '신포국제시장의 4대 명물에 포함되지 않는 음식은?',
    choices: ['① 공갈빵', '② 오색만두', '③ 호떡'],
    answerIndex: 2,
    explanation:
      '정답은 ③번 호떡입니다! 신포국제시장의 4대 명물은 닭강정, 공갈빵, 오색만두, 쫄면입니다.',
  },
  'quiz-03': {
    question: '신포시장 초창기, 중국 상인들이 나물과 채소를 팔던 장터의 이름은?',
    choices: ['① 어물전', '② 푸성귀전', '③ 공설시장'],
    answerIndex: 1,
    explanation:
      '정답은 ②번 푸성귀전입니다! 1883년 개항 이후 형성된 중국 상인들의 채소 장터 푸성귀전 조형물이 시장 골목에 남아 있습니다.',
  },
  'quiz-04': {
    question: '신포국제시장 등대공원의 상징물은?',
    choices: ['① 노란 시계탑', '② 빨간 등대', '③ 파란 풍차'],
    answerIndex: 1,
    explanation:
      '정답은 ②번 빨간 등대입니다! 시장 골목의 명소이자 신포의 다음 100년을 밝히는 상징물입니다.',
  },
  'quiz-05': {
    question: '신포국제시장이 1·2기 연속 선정된 관광사업은?',
    choices: ['① K-관광마켓', '② 세계미식거리', '③ 전통시장100선'],
    answerIndex: 0,
    explanation:
      '정답은 ①번 K-관광마켓입니다! 2023년 제1기(10선) 및 2026년 제2기 K-관광마켓에 1·2기 연속 선정되었습니다.',
  },
};

const SPOT_LOCATION_HINTS: Record<number, { spotLocationLabel: string; nextSpotHint: string }> = {
  1: {
    spotLocationLabel: '푸성귀전 조형물 인근 (우측 세로길 초입)',
    nextSpotHint: '푸성귀전 골목 안쪽으로 조금만 더 걸어가면 100년 시장 변천사가 담긴 [QR #02]가 기다립니다!',
  },
  2: {
    spotLocationLabel: '푸성귀전 골목 역사 거리 (우측 세로길)',
    nextSpotHint: '근처 골목 벽면에서 1970년대 탄생한 국민 분식 퀴즈 [QR #03]을 찾아보세요!',
  },
  3: {
    spotLocationLabel: '우측 세로길 옛 장터 골목 (과거 테마존)',
    nextSpotHint: '푸성귀전 조형물 바로 인근에 숨겨진 마지막 과거 퀴즈 [QR #04]를 스캔해보세요!',
  },
  4: {
    spotLocationLabel: '푸성귀전 옛 장터 기념 조형물 앞',
    nextSpotHint: '과거의 신포 4곳을 클리어했습니다! 이제 발자국을 따라 중앙 메인시장 통로 [QR #05]로 이동해보세요.',
  },
  5: {
    spotLocationLabel: '중앙 메인시장 윗길 입구 통로',
    nextSpotHint: '고소한 냄새가 풍기는 대표 먹거리 거리에서 [QR #06]을 찾아보세요!',
  },
  6: {
    spotLocationLabel: '메인시장 4대 명물 먹거리 골목',
    nextSpotHint: '메인 통로 중심부로 걸어가며 K-관광마켓 선정 스토리가 담긴 [QR #07]을 스캔해보세요!',
  },
  7: {
    spotLocationLabel: '메인시장 중앙 아케이드 통로',
    nextSpotHint: '시장 안내 표지판 인근에서 방문객 필수 교통·주차 팁이 담긴 [QR #08]을 찾아보세요!',
  },
  8: {
    spotLocationLabel: '메인시장 아랫길 교차 통로',
    nextSpotHint: '2025 인천지역유산 선정 이야기가 숨겨진 [QR #09]로 발걸음을 옮겨보세요!',
  },
  9: {
    spotLocationLabel: '메인시장 중앙 광장 인근',
    nextSpotHint: '신포국제시장의 工자형 구조 비밀을 한눈에 보여주는 [QR #10]이 근처에 있습니다!',
  },
  10: {
    spotLocationLabel: '메인시장 工자형 갈림길 안내 지점',
    nextSpotHint: '원조 쫄면의 탄생 비화가 담긴 맛있는 이야기 [QR #11]을 찾아보세요!',
  },
  11: {
    spotLocationLabel: '원조 쫄면·분식 노포 골목 인근',
    nextSpotHint: '화덕만두와 공갈빵 향기가 나는 곳 인근에서 4대 명물 퀴즈 [QR #12]에 도전하세요!',
  },
  12: {
    spotLocationLabel: '화덕만두·공갈빵·먹거리 골목 앞',
    nextSpotHint: '메인시장 서쪽 통로 끝자락에서 K-관광마켓 퀴즈 [QR #13]을 풀고 등대공원 골목으로 넘어가 보세요!',
  },
  13: {
    spotLocationLabel: '메인시장 서측 연결 통로',
    nextSpotHint: '이제 좌측 세로길(등대공원 인근) 미래의 신포 [QR #14]로 이동하세요!',
  },
  14: {
    spotLocationLabel: '좌측 세로길 초입 (등대공원 방향)',
    nextSpotHint: '등대공원 골목으로 걸어 들어가며 온누리상품권 선순환 이야기 [QR #15]를 찾아보세요!',
  },
  15: {
    spotLocationLabel: '좌측 세로길 상점가 (미래 테마존)',
    nextSpotHint: '친환경 ESG 전통시장 이야기를 담은 [QR #16]이 등대공원 가는 길에 숨어 있습니다!',
  },
  16: {
    spotLocationLabel: '등대공원 인접 친환경 골목 구간',
    nextSpotHint: '청년상인들의 아이디어가 모인 눈꽃마을·청년몰 인근에서 [QR #17]을 스캔해보세요!',
  },
  17: {
    spotLocationLabel: '눈꽃마을 청년몰 & 등대공원 연결 골목',
    nextSpotHint: '드디어 빨간 등대가 보입니다! 등대공원 바로 앞에서 [QR #18]을 찾아보세요.',
  },
  18: {
    spotLocationLabel: '신포 등대공원 빨간 등대 앞',
    nextSpotHint: '등대공원 주변 벤치·포토존 인근에서 디지털 지역상생 스토리 [QR #19]를 확인해보세요!',
  },
  19: {
    spotLocationLabel: '등대공원 포토존 인근',
    nextSpotHint: '마지막 20번째 보물! 등대공원 상징물 퀴즈 [QR #20]을 찾으면 20개 보물 도감이 완성됩니다!',
  },
  20: {
    spotLocationLabel: '신포 등대공원 중앙 상징물 포토존',
    nextSpotHint: '축하합니다! 20번 보물까지 도달하셨습니다. 아직 못 찾은 우측 세로길(푸성귀전 QR #01~#04)이나 메인 골목도 확인해보세요!',
  },
};

function buildQrSpots(): QrSpotItem[] {
  const pastCards = THEME_CARDS.filter((c) => c.theme === 'PAST');
  const nowCards = THEME_CARDS.filter((c) => c.theme === 'NOW');
  const futureCards = THEME_CARDS.filter((c) => c.theme === 'FUTURE');

  const ordered: {
    card: ThemeCard;
    guideHeaderCode: string;
    chapterNumber: number;
    chapterTitle: string;
  }[] = [
    ...pastCards.map((card, i) => ({
      card,
      guideHeaderCode: `PAST ${String(i + 1).padStart(2, '0')}`,
      chapterNumber: 1,
      chapterTitle: '과거의 신포',
    })),
    ...nowCards.map((card, i) => ({
      card,
      guideHeaderCode: `NOW ${String(i + 1).padStart(2, '0')}`,
      chapterNumber: 2,
      chapterTitle: '오늘의 신포',
    })),
    ...futureCards.map((card, i) => ({
      card,
      guideHeaderCode: `FUTURE ${String(i + 1).padStart(2, '0')}`,
      chapterNumber: 3,
      chapterTitle: '미래의 신포',
    })),
  ];

  return ordered.map((entry, idx) => {
    const spotNumber = idx + 1;
    const spotCode = String(spotNumber).padStart(2, '0');
    const secretSlug = SECRET_SLUGS[spotNumber];
    const zone = THEME_ZONES.find((z) => z.id === entry.card.theme)!;
    const isQuiz = entry.card.code.startsWith('QUIZ');
    const hintInfo = SPOT_LOCATION_HINTS[spotNumber];

    const alleyOddsBadge =
      entry.card.theme === 'PAST'
        ? '🧭 숨은 골목(푸성귀전) 보물 스팟'
        : entry.card.theme === 'FUTURE'
        ? '🧭 숨은 골목(등대공원) 보물 스팟'
        : '✨ 메인시장 통로 보물 스팟';

    return {
      spotNumber,
      spotCode,
      secretSlug,
      guideHeaderCode: entry.guideHeaderCode,
      chapterNumber: entry.chapterNumber,
      chapterTitle: entry.chapterTitle,
      theme: entry.card.theme,
      isQuiz,
      card: entry.card,
      zone,
      spotLocationLabel: hintInfo.spotLocationLabel,
      nextSpotHint: hintInfo.nextSpotHint,
      alleyOddsBadge,
      quiz: isQuiz ? QUIZ_CONFIG_MAP[entry.card.id] : undefined,
    };
  });
}

export const QR_SPOTS: QrSpotItem[] = buildQrSpots();

/**
 * 브라우저로 내려보내도 되는 QR 목록 (난수 슬러그 제외)
 * 스탬프 도감과 실시간 '확률 높은 골목' 표시에 사용합니다.
 */
export interface PublicQrSpot {
  spotNumber: number;
  spotCode: string;
  theme: ThemeCategory;
  locationLabel: string;
}

export const PUBLIC_QR_SPOTS: PublicQrSpot[] = QR_SPOTS.map((spot) => ({
  spotNumber: spot.spotNumber,
  spotCode: spot.spotCode,
  theme: spot.theme,
  locationLabel: spot.spotLocationLabel,
}));

/**
 * URL 파라미터가 정확히 해당 QR의 고유 난수 슬러그(secretSlug)와 일치할 때만 반환
 * (/qr/1, /qr/2 등 주소창 숫자 변경을 통한 꼼수 접속은 404 차단)
 */
export function findQrSpotByParam(idParam: string): QrSpotItem | undefined {
  const normalized = decodeURIComponent(idParam).trim().toLowerCase();
  return QR_SPOTS.find((spot) => spot.secretSlug === normalized);
}
