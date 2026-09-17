'use client';

import { usePathname } from 'next/navigation';

/**
 * A route-aware styling marker, with no layout or accessibility-tree footprint.
 * The Grant Portal retains its own independent canvas on every nested route.
 */
export default function SiteLightBackground() {
  const pathname = usePathname();
  const isGrantPortal = pathname === '/innovation-grants' || pathname.startsWith('/innovation-grants/');

  return isGrantPortal ? null : <span hidden aria-hidden="true" data-site-light-background />;
}
