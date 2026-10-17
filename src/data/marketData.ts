import {
  HowToPlayStep,
  EventFeature,
  RewardTier,
  AnnouncementItem,
  FoodItem,
  HistoryItem,
  TransitInfo,
  ParkingInfo,
  MapLink,
  MarketHighlight,
  FaqItem,
} from '../types';

export const FESTIVAL_INFO = {
  name: "신포국제시장 디지털 보물찾기",
  subTitle: "발자국 따라 떠나는 신포 골목 탐험",
  period: "2026. 11. 13.(금) ~ 11. 14.(토)",
  periodDetail: "2026. 11. 13.(금) ~ 11. 14.(토) / 12:00 ~ 18:00 (2일간)",
  hours: "12:00 ~ 18:00",
  mainLocation: "인천광역시 제물포구 우현로49번길 11-5 (신포국제시장 전역)",
  locationShort: "신포국제시장 전역 (우현로49번길 11-5)",
  targetAudience: "신포국제시장을 방문한 누구나 (별도 앱 설치 없이 스마트폰 카메라로 참여)",
  rewardLocation: "신포국제시장 고객지원센터 앞 리워드 부스",
  rewardMethod: "모바일 당첨 화면을 지참하여 고객지원센터 앞 리워드 부스 방문 후 즉시 수령",
  drawMethod: "QR 스캔 즉시 실시간 현장 당첨 확인 (대기 시간 없음)",
  contactInstagram: "@sinpo.dream",
  contactUrl: "https://instagram.com/sinpo.dream",
  qrCount: 40,
};

export const HOW_TO_PLAY_STEPS: HowToPlayStep[] = [
  {
    step: "STEP 1",
    number: "01",
    badge: "오프라인 탐험",
    title: "발자국 따라 걷기",
    description: "시장 바닥에 숨겨진 특별한 발자국 스티커를 따라 안쪽 골목과 테마 공간(등대골목, 푸성귀전, 한줄골목 등)으로 이동합니다.",
    details: [
      "메인 통로를 벗어나 바닥의 시각적 발자국 로드를 따라가세요.",
      "등대골목, 푸성귀전 조형물, 신포옛길로 자연스럽게 연결됩니다.",
      "발자국을 따라 걸으면 신포시장의 숨겨진 옛 골목과 정겨운 노포를 발견할 수 있습니다."
    ],
    icon: "Footprints",
  },
  {
    step: "STEP 2",
    number: "02",
    badge: "스마트폰 카메라 QR",
    title: "골목 곳곳 QR 스캔",
    description: "골목과 점포 인근에 숨겨진 총 40개의 QR코드를 스마트폰 기본 카메라로 스캔합니다.",
    details: [
      "별도의 전용 앱 설치 없이 스마트폰 기본 카메라로 즉시 스캔 가능합니다.",
      "시장 전역 침체 골목과 소외 점포 인근에 총 40개의 QR코드가 부착되어 있습니다.",
      "보물 스티커 옆 힌트 번호를 확인하며 미션을 수행해보세요."
    ],
    icon: "QrCode",
  },
  {
    step: "STEP 3",
    number: "03",
    badge: "100% 리워드",
    title: "보물 찾고 경품 받기",
    description: "'당첨 QR'을 찾아 푸짐한 경품을 받거나, '일반 QR'을 통해 신포시장의 숨은 이야기와 다음 보물 힌트를 확인합니다.",
    details: [
      "'당첨 QR': 모바일 즉석 당첨 화면 제시 시 고객지원센터에서 온누리상품권 및 경품 즉시 수령",
      "'일반 QR': 신포 100년 역사 이야기, 시장 퀴즈, 골목 맛집 추천 및 다음 QR 보물 위치 힌트 획득",
      "꽝 없는 100% 유익한 스토리텔링 콘텐츠로 모든 QR이 특별합니다."
    ],
    icon: "Gift",
  },
];

export const EVENT_FEATURES: EventFeature[] = [
  {
    id: "nudge-walk",
    title: "발자국 넛지(Nudge) 골목 투어",
    subtitle: "자연스럽게 골목 안쪽으로 이끄는 시각적 로드",
    description: "메인 로드를 벗어나 등대골목, 푸성귀전 조형물, 신포옛길 등 숨겨진 명소로 이어지는 시각적 발자국 로드를 따라 걸어보세요. 걷기만 해도 신포시장의 구석구석 새로운 골목과 노포를 자연스럽게 발견하는 재미를 선사합니다.",
    highlights: [
      "메인 거리 밖 소외 골목 상권으로 자연스럽게 이어지는 넛지 유도선",
      "등대골목, 푸성귀전, 한줄골목, 신포옛길을 잇는 테마 탐방로",
      "가족, 연인, 친구와 함께 걷는 재미있는 골목길 걷기 코스"
    ],
    badge: "넛지 로드",
    icon: "Footprints",
    accentColor: "#8C6239",
  },
  {
    id: "qr-hunt",
    title: "총 40개의 숨은 QR 디지털 보물찾기",
    subtitle: "골목과 점포 곳곳에 숨겨진 40개의 미션 스팟",
    description: "시장 전역 침체 골목과 소외 점포 인근에 집중 배치된 40개의 QR코드를 탐색하세요. 복잡한 전용 행사장 방문 없이 시장 구석구석을 둘러보며 자유롭게 즐기는 비대면 모바일 미션입니다.",
    highlights: [
      "시장 전역 골목과 노포 상점 인근 40곳에 배치된 QR코드",
      "앱 설치 NO! 스마트폰 카메라 기본 기능으로 즉시 스캔",
      "남녀노소 누구나 시장 쇼핑과 동시에 즐기는 자유로운 탐색"
    ],
    badge: "40개 QR 미션",
    icon: "QrCode",
    accentColor: "#00ACC1",
  },
  {
    id: "dynamic-odds",
    title: "숨은 골목일수록 당첨 확률 UP! (실시간 동적 확률)",
    subtitle: "인적이 드문 조용한 골목의 보물일수록 대박 혜택!",
    description: "다른 사람들이 아직 많이 찾지 않은 조용한 골목의 QR코드일수록 당첨 확률이 실시간으로 증가합니다. 행사 기간 방문 데이터를 실시간으로 집계하여 조용한 골목의 당첨 확률이 자동 업데이트됩니다.",
    highlights: [
      "방문객이 적은 안쪽 골목 QR일수록 실시간 당첨 확률 수직 상승!",
      "실시간 방문 데이터 집계 및 동적 확률 자동 반영",
      "골목 구석구석 발걸음을 옮길수록 유리해지는 스마트 게이미피케이션"
    ],
    badge: "실시간 동적 확률",
    icon: "TrendingUp",
    accentColor: "#E5A93C",
  },
  {
    id: "storytelling",
    title: "'꽝' 없는 100% 스토리텔링 콘텐츠",
    subtitle: "당첨되지 않아도 신포 100년 이야기와 다음 보물 힌트 제공",
    description: "단순한 뽑기가 아닙니다. 당첨되지 않아도 신포국제시장의 100년 역사, 해당 골목의 유래, 숨은 노포 맛집 추천, 시장 퀴즈 등 유익한 정보가 제공되며, 다음 보물(QR)의 위치 힌트가 주어져 연속적인 탐험의 즐거움을 제공합니다.",
    highlights: [
      "100% 꽝 없음: 모든 QR에서 시장 역사와 골목 문화 이야기 획득",
      "신포 상인들이 직접 추천하는 숨은 노포 맛집 & 시장 꿀팁",
      "다음 QR코드 보물의 위치 힌트 제공으로 끊김 없는 탐험"
    ],
    badge: "100% 스토리텔링",
    icon: "BookOpen",
    accentColor: "#2E7D32",
  },
];

export const REWARD_TIERS: RewardTier[] = [
  {
    rank: "1등",
    prize: "신포 사랑 온누리상품권 100,000원권",
    description: "골목의 깊은 곳을 가장 먼저 찾아낸 최고의 보물 사냥꾼을 위한 대박 상품권",
    quantity: "매일 한정 수량",
    icon: "Trophy",
    badge: "최고의 보물",
  },
  {
    rank: "2등",
    prize: "온누리상품권 50,000원권 + 닭강정 교환권",
    description: "신포국제시장 전 매장 사용 상품권과 바삭한 원조 닭강정 대(大) 교환권",
    quantity: "매일 15명",
    icon: "Award",
    badge: "미식 보물",
  },
  {
    rank: "3등",
    prize: "온누리상품권 10,000원권 또는 노포 먹거리권",
    description: "화덕만두, 쫄면, 전통 칼국수 등 신포시장 먹거리를 즐길 수 있는 교환권",
    quantity: "매일 50명",
    icon: "Gift",
    badge: "행운 보물",
  },
  {
    rank: "참가상",
    prize: "신포 레트로 한정판 굿즈 & 온누리 5,000원",
    description: "2026 신포 에코백 또는 장바구니 + 스탬프 획득 시 100% 증정",
    quantity: "전원 증정 (선착순 소진 시까지)",
    icon: "Sparkles",
    badge: "100% 증정",
  },
];

export const ANNOUNCEMENT_ITEMS: AnnouncementItem[] = [
  {
    id: "announce-1",
    title: "신포국제시장 디지털 보물찾기 11월 13일~14일 개최 안내",
    author: "sinpomarket",
    category: "행사공지",
    date: "2026. 10. 20",
    imageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80",
    summary: "스마트폰 카메라로 시장 바닥 발자국 스티커를 따라 40개의 QR코드를 찾고 온누리상품권과 경품을 수령하세요.",
    tag: "디지털보물찾기",
  },
  {
    id: "announce-2",
    title: "숨은 골목 QR코드일수록 당첨 확률 UP! 실시간 갱신 안내",
    author: "sinpomarket",
    category: "이벤트팁",
    date: "2026. 10. 22",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
    summary: "스캔 및 방문객 데이터를 실시간 분석하여 인적이 드문 안쪽 골목의 QR코드 당첨 확률이 지속적으로 상승합니다.",
    tag: "동적확률",
  },
  {
    id: "announce-3",
    title: "별도 앱 설치 NO! 스마트폰 카메라로 즉시 참여하는 방법",
    author: "sinpomarket",
    category: "참여안내",
    date: "2026. 10. 24",
    imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80",
    summary: "아이폰 및 안드로이드 기본 카메라 앱으로 QR코드를 비추기만 하면 당첨 화면과 스토리텔링 퀴즈가 바로 열립니다.",
    tag: "간편참여",
  },
  {
    id: "announce-4",
    title: "당첨 경품 수령처: 고객지원센터 앞 리워드 부스 운영 안내",
    author: "sinpomarket",
    category: "경품안내",
    date: "2026. 10. 25",
    imageUrl: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=600&q=80",
    summary: "행사 당일 12:00 ~ 18:00 모바일 당첨 화면을 보여주시면 고객지원센터 데스크에서 온누리상품권을 즉시 지급합니다.",
    tag: "리워드부스",
  },
];

export const FOOD_ITEMS: FoodItem[] = [
  {
    id: "dakgangjeong",
    name: "신포 원조 닭강정",
    category: "specialty",
    categoryName: "대표명물",
    badge: "보물찾기 명소 #1",
    description: "무쇠 가마솥에 바삭하게 튀겨 청양고추와 특제 조청 소스로 버무린 원조 닭강정. 골목 탐험 전후 필수 충전 코스입니다.",
    tip: "포장 전용 줄과 매장 줄이 구분되어 있습니다. 등대골목 QR코드를 찾기 전후로 방문해보세요.",
    imageUrl: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80",
    tags: ["가마솥수제", "청양고추양념", "포장필수", "원조닭강정"],
    estimatedWait: "15~20분",
    pairing: "시원한 탄산음료",
  },
  {
    id: "dumpling-gonggal",
    name: "산동 화덕만두 & 공갈빵",
    category: "snack",
    categoryName: "별미간식",
    badge: "보물찾기 명소 #2",
    description: "40년 전통 숯불 옹기 화덕에서 노릇하게 구워낸 고기 화덕만두와 흑설탕 꿀이 코팅된 바삭한 공갈빵입니다.",
    tip: "화덕에서 갓 구워져 나왔을 때가 최상의 바삭함! 한줄골목 QR코드 인근에 위치해 있습니다.",
    imageUrl: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80",
    tags: ["숯불옹기화덕", "육즙만두", "달콤바삭공갈빵"],
    estimatedWait: "10분 내외",
    pairing: "따뜻한 차 또는 커피",
  },
  {
    id: "jjolmyeon",
    name: "원조 신포 쫄면 & 만두",
    category: "meal",
    categoryName: "식사/노포",
    badge: "보물찾기 명소 #3",
    description: "쫄면의 발상지 인천의 정석. 매콤달콤한 특제 숙성 양념과 노포 손만두의 환상적인 페어링을 맛보세요.",
    tip: "매콤한 쫄면에 갓 튀긴 바삭한 튀김만두를 싸서 드시는 것이 신포 골목 단골들의 비법입니다.",
    imageUrl: "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80",
    tags: ["쫄면발상지", "비빔쫄면", "수제만두"],
    estimatedWait: "10~15분",
    pairing: "진한 멸치 육수",
  },
  {
    id: "noodle-sundae",
    name: "노포 맷돌칼국수 & 찹쌀순대",
    category: "meal",
    categoryName: "식사/노포",
    badge: "보물찾기 명소 #4",
    description: "진한 사골 육수에 손으로 직접 썬 쫄깃한 생면 칼국수와 매일 삶아내는 속이 꽉 찬 전통 찹쌀순대 골목의 온기.",
    tip: "푸성귀전 유래비 인근 안쪽 골목에 위치하며, 튀김가루와 다진 양념을 추가하면 더욱 칼칼합니다.",
    imageUrl: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=800&q=80",
    tags: ["맷돌칼국수", "사골육수", "전통순대"],
    estimatedWait: "5~10분",
    pairing: "매콤한 겉절이 김치",
  },
];

export const HISTORY_ITEMS: HistoryItem[] = [
  {
    period: "1883년",
    era: "개항과 푸성귀전(菜市)",
    title: "인천 개항과 함께 태동한 140여 년 역사의 시작",
    description: "1883년 인천항 개항 후 조계지 인근에서 청나라 화교 상인들이 채소를 재배하여 판매하던 '푸성귀전'이 바로 신포시장의 뿌리입니다.",
    keyFacts: [
      "1883년 인천 개항과 서해안 무역의 중심",
      "한국 최초의 근대식 채소 시장 '푸성귀전' 개설",
      "디지털 보물찾기 '푸성귀전 조형물' 스팟의 모태"
    ],
    highlightQuote: "“푸성귀전의 흙냄새가 가득했던 골목이 오늘날 디지털 보물찾기로 다시 살아납니다.”",
    badge: "역사의 태동 1883",
  },
  {
    period: "1950 ~ 1970년대",
    era: "서민 경제의 중심과 골목의 탄생",
    title: "전란을 딛고 인천 최대의 상설 시장으로 성장",
    description: "한국전쟁 후 어시장, 미곡 시장, 구호물자 양품점이 결합하며 동인천의 상권 허브로 우뚝 섰고, 닭강정과 쫄면 등 신포만의 골목 음식 문화가 탄생했습니다.",
    keyFacts: [
      "피란민들의 땀과 정으로 일군 인천 대표 상설 시장",
      "1970년대 닭강정·쫄면·칼국수 노포 골목 형성",
      "오늘날 40개 보물찾기 QR코드가 숨겨진 정겨운 미로 골목의 형성기"
    ],
    highlightQuote: "“복잡한 골목마다 서민들의 웃음과 애환이 서려 있는 따뜻한 삶터입니다.”",
    badge: "골목의 번영 1950-1970",
  },
  {
    period: "2026년 현재",
    era: "스마트 문화관광형 글로벌 시장",
    title: "100년 전통과 디지털 경험이 만나는 살아있는 시장",
    description: "아케이드 현대화와 고객지원센터를 완비하고, 스마트 온누리상품권과 디지털 보물찾기 등 방문객이 직접 체험하는 스마트 전통시장으로 진화했습니다.",
    keyFacts: [
      "중기부 문화관광형 시장 육성 및 글로벌 관광 명소",
      "스마트폰 카메라로 즐기는 '디지털 보물찾기' 개최",
      "소외 골목과 상인을 돕는 착한 동적 확률 게이미피케이션"
    ],
    highlightQuote: "“발자국을 따라 걸으면 100년 역사가 보물이 되어 당신에게 다가옵니다.”",
    badge: "스마트 신포 2026",
  },
];

export const TRANSIT_INFO: TransitInfo[] = [
  {
    type: "subway",
    name: "지하철 이용 시",
    icon: "Train",
    tip: "보물찾기 출발지인 고객지원센터는 수인분당선 신포역 3번 출구에서 가장 가깝습니다.",
    details: [
      "수인분당선 [신포역] 3번 출구: 도보 5분 (약 350m, 평지 코스)",
      "1호선 [동인천역] 2번 출구: 지하상가 연결 도보 10분 (약 600m)"
    ],
  },
  {
    type: "bus",
    name: "시내버스 이용 시",
    icon: "Bus",
    tip: "'신포시장' 정류장에서 하차하시면 시장 메인 입구와 바로 연결됩니다.",
    details: [
      "신포시장 정류장 (도보 1분): 간선 12, 24, 28, 45, 72, 307번",
      "신포순환버스 및 지선: 517, 521번"
    ],
  },
];

export const PARKING_INFO: ParkingInfo[] = [
  {
    name: "신포제2공영주차장",
    capacity: "120대",
    feeInfo: "최초 30분 무료 / 15분당 300원 (1일 10,000원)",
    benefit: "경차·저공해 50% 감면 / 시장 구매 영수증 시 1시간 무료",
    distance: "시장 입구 도보 1분",
    walkingTime: "약 80m",
    address: "인천 제물포구 신포로23번길 19",
  },
  {
    name: "답동성당 공영주차장",
    capacity: "250대 (대형)",
    feeInfo: "최초 60분 무료 / 15분당 400원 (1일 12,000원)",
    benefit: "넓은 주차면적, 전기차 충전기 8기 구비",
    distance: "시장 입구 도보 3분",
    walkingTime: "약 200m (추천)",
    address: "인천 제물포구 우현로 50",
  },
];

export const MAP_LINKS: MapLink[] = [
  {
    name: "네이버 지도에서 보기",
    service: "naver",
    url: "https://map.naver.com/p/search/%EC%8B%A0%ED%8F%AC%EA%B5%AD%EC%A0%9C%EC%8B%9C%EC%9E%A5",
    bgColor: "bg-[#03C75A]",
    textColor: "text-white",
    hoverColor: "hover:bg-[#02b350]",
  },
  {
    name: "카카오맵에서 보기",
    service: "kakao",
    url: "https://map.kakao.com/?q=%EC%8B%A0%ED%8F%AC%EA%B5%AD%EC%A0%9C%EC%8B%9C%EC%9E%A5",
    bgColor: "bg-[#FEE500]",
    textColor: "text-[#191919]",
    hoverColor: "hover:bg-[#f0d800]",
  },
  {
    name: "티맵 안내받기",
    service: "tmap",
    url: "https://tmap.life/search?name=%EC%8B%A0%ED%8F%AC%EA%B5%AD%EC%A0%9C%EC%8B%9C%EC%9E%A5",
    bgColor: "bg-[#1E293B]",
    textColor: "text-white",
    hoverColor: "hover:bg-[#0F172A]",
  },
];

export const MARKET_INFO = {
  name: "신포국제시장",
  tagline: "1883년부터 이어온 인천의 맛과 정",
  intro:
    "인천 개항과 함께 태동한 신포국제시장은 140여 년 동안 인천 시민의 삶과 함께해 온 대표 전통시장입니다. 닭강정, 쫄면, 화덕만두 등 이곳에서 시작된 먹거리와 정겨운 골목이 오늘도 방문객을 맞이합니다.",
  address: "인천광역시 제물포구 우현로49번길 11-5",
  openHours: "매일 10:00 ~ 20:00 (점포별 상이)",
};

export const MARKET_HIGHLIGHTS: MarketHighlight[] = [
  {
    id: "history",
    title: "140년 역사의 시장",
    description: "1883년 인천 개항 후 '푸성귀전'에서 시작해 인천 서민 경제의 중심으로 성장했습니다.",
    stat: "1883",
    statLabel: "개항과 함께 시작",
    icon: "Landmark",
  },
  {
    id: "food",
    title: "원조 먹거리의 고향",
    description: "닭강정, 쫄면, 화덕만두, 맷돌칼국수 등 수십 년 한우물을 판 노포들이 모여 있습니다.",
    stat: "40년+",
    statLabel: "전통 노포의 맛",
    icon: "Utensils",
  },
  {
    id: "alley",
    title: "숨은 골목 탐방",
    description: "등대골목, 한줄골목, 신포옛길 등 걸을수록 새로운 이야기가 나오는 골목 여행지입니다.",
    stat: "5곳",
    statLabel: "테마 골목",
    icon: "Footprints",
  },
  {
    id: "access",
    title: "편리한 접근성",
    description: "수인분당선 신포역에서 도보 5분, 공영주차장도 가까워 가족 나들이에 좋습니다.",
    stat: "5분",
    statLabel: "신포역 도보",
    icon: "Train",
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-app",
    question: "별도의 앱을 설치해야 하나요?",
    answer:
      "아니요. 스마트폰 기본 카메라 앱으로 QR코드를 비추기만 하면 바로 참여할 수 있습니다. 아이폰과 안드로이드 모두 가능합니다.",
  },
  {
    id: "faq-who",
    question: "누가 참여할 수 있나요?",
    answer:
      "신포국제시장을 방문한 누구나 참여할 수 있습니다. 행사 기간 중 시장 전역에서 자유롭게 즐기실 수 있습니다.",
  },
  {
    id: "faq-qr",
    question: "QR코드는 어디에 있나요?",
    answer:
      "시장 바닥의 발자국 스티커를 따라가면 골목과 점포 인근에 숨겨진 총 40개의 QR코드를 만날 수 있습니다. 메인 통로에서 벗어난 안쪽 골목을 살펴보세요.",
  },
  {
    id: "faq-odds",
    question: "당첨 확률은 어떻게 바뀌나요?",
    answer:
      "방문객이 적은 골목의 QR코드일수록 당첨 확률이 올라가며, 실시간 스캔 데이터를 바탕으로 자동 갱신됩니다. QR코드를 스캔하는 즉시 스마트폰 화면에서 당첨 여부를 바로 확인하실 수 있습니다.",
  },
  {
    id: "faq-reward",
    question: "경품은 어디서 어떻게 받나요?",
    answer:
      "모바일 당첨 화면을 지참해 신포국제시장 고객지원센터 앞 리워드 부스를 방문하시면 즉시 수령할 수 있습니다. 운영 시간은 행사 기간 매일 12:00 ~ 18:00입니다.",
  },
  {
    id: "faq-contact",
    question: "문의는 어디로 하면 되나요?",
    answer: "신포국제시장 공식 인스타그램(@sinpo.dream)으로 문의해 주세요.",
  },
];

