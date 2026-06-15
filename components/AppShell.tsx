'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigationItems } from '@/lib/navigation';

import type { ReactNode } from 'react';

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">UC Platform</p>
          <h2 className="sidebarTitle">Investor updates</h2>
        </div>

        <nav className="nav">
          {navigationItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? 'navItem navItemActive' : 'navItem'}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <section className="shellMain">{children}</section>
    </div>
  );
}
