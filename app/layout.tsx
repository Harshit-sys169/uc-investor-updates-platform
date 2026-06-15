import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'UC Investor Updates Platform',
    template: '%s | UC Investor Updates Platform',
  },
  description: 'Founder communication platform for drafting, sending, tracking, and operating investor updates.',
  applicationName: 'UC Investor Updates Platform',
  robots: {
    index: false,
    follow: false,
  },
};

import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
