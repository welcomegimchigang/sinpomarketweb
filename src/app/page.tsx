import React from 'react';
import { MarketHero } from '../components/sections/MarketHero';
import { MarketHighlights } from '../components/sections/MarketHighlights';
import { EventBanner } from '../components/sections/EventBanner';
import { FoodSection } from '../components/sections/FoodSection';
import { HistorySection } from '../components/sections/HistorySection';
import { LocationSection } from '../components/sections/LocationSection';

export default function Home() {
  return (
    <>
      <MarketHero />
      <MarketHighlights />
      <EventBanner />
      <FoodSection />
      <HistorySection />
      <LocationSection />
    </>
  );
}
