import React from 'react';
import type { Metadata } from 'next';
import { AdminClient } from '../../components/sections/AdminClient';
import { PUBLIC_QR_SPOTS } from '../../data/qrSpots';

export const metadata: Metadata = {
  title: '보물찾기 관리자',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function AdminPage() {
  return <AdminClient spots={PUBLIC_QR_SPOTS} />;
}
