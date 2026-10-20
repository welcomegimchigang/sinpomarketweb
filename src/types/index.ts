export type FoodCategory = 'all' | 'specialty' | 'snack' | 'meal';

export interface HowToPlayStep {
  step: string;
  number: string;
  title: string;
  description: string;
  details: string[];
  icon: string;
  badge: string;
}

export interface EventFeature {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  badge: string;
  icon: string;
  accentColor?: string;
}

export interface RewardTier {
  rank: string;
  prize: string;
  description: string;
  quantity: string;
  icon: string;
  badge: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  author: string;
  category: string;
  date: string;
  imageUrl: string;
  summary: string;
  tag: string;
}

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  categoryName: string;
  badge: string;
  description: string;
  tip: string;
  imageUrl: string;
  tags: string[];
  estimatedWait?: string;
  pairing?: string;
}

export interface HistoryItem {
  period: string;
  era: string;
  title: string;
  description: string;
  keyFacts: string[];
  highlightQuote?: string;
  badge: string;
}

export interface TransitInfo {
  type: 'subway' | 'bus';
  name: string;
  details: string[];
  icon: string;
  tip?: string;
}

export interface ParkingInfo {
  name: string;
  capacity?: string;
  feeInfo: string;
  benefit: string;
  distance: string;
  walkingTime: string;
  address: string;
}

export interface MapLink {
  name: string;
  service: 'naver' | 'kakao' | 'tmap';
  url: string;
  bgColor: string;
  textColor: string;
  hoverColor: string;
}

export interface MarketHighlight {
  id: string;
  title: string;
  description: string;
  stat: string;
  statLabel: string;
  icon: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export type ThemeCategory = 'PAST' | 'NOW' | 'FUTURE';

export interface ThemeZoneInfo {
  id: ThemeCategory;
  qrLabel: string;
  title: string;
  subtitle: string;
  location: string;
  summary: string;
  accentColor: string;
  badgeBg: string;
}

export interface ThemeCard {
  id: string;
  theme: ThemeCategory;
  code: string;
  cardNumber: string;
  title: string;
  mainCopy: string;
  body: string;
  subContent?: string;
  keywords: string[];
  footerQuote: string;
  designPoint: string;
  recommendedImage?: string;
  recommendedPosition?: string;
  isExtra?: boolean;
}


