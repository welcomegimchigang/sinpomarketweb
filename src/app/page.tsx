import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { HeroSection } from '../components/sections/HeroSection';
import { EventSection } from '../components/sections/EventSection';
import { FoodSection } from '../components/sections/FoodSection';
import { HistorySection } from '../components/sections/HistorySection';
import { LocationSection } from '../components/sections/LocationSection';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1">
        <HeroSection />
        <EventSection />
        <FoodSection />
        <HistorySection />
        <LocationSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
