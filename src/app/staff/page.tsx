import React from 'react';
import type { Metadata } from 'next';
import { StaffClient } from '../../components/sections/StaffClient';

export const metadata: Metadata = {
  title: '리워드 부스 스태프 확인',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function StaffPage() {
  return <StaffClient />;
}
