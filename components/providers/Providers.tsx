'use client';

import React from 'react';
import { SystemProvider } from '@/context/SystemContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SystemProvider>{children}</SystemProvider>;
}
