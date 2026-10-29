"use client";
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import styles from './Footer.module.css';
export default function FooterLayout({ children, homepage }: { children: ReactNode; homepage: ReactNode }) {
  const isHomepage = usePathname() === '/';
  return <footer className={`${styles.footer} ${isHomepage ? styles.homepageFooter : ''} border-t border-[var(--border)] bg-[var(--bg-elevated)]`} role="contentinfo">{isHomepage ? homepage : children}</footer>;
}
