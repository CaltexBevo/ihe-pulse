"use client";

import { useEffect, useRef, useState } from 'react';
import { PICARD_SECTIONS } from '@/lib/data/featured-coverage-picard';
import styles from './PicardFeature.module.css';

const entries = [
  [0, 'A future worth imagining'], [1, 'Patrick Stewart’s voice'],
  [2, 'Leadership & learning'], [6, 'Data & human dignity'],
  [9, 'The Borg & autonomy'], [12, 'What we learn from fear'],
  [13, 'AI in higher education'], [14, 'A final salute'],
] as const;

export default function PicardReadingProgress() {
  const bar = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const update = () => {
      const root = document.documentElement;
      const available = root.scrollHeight - root.clientHeight;
      const progress = available > 0 ? Math.min(100, Math.max(0, 100 * root.scrollTop / available)) : 0;
      if (bar.current) bar.current.style.width = `${progress}%`;
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  return <div className={styles.readingProgress} aria-hidden="true"><span ref={bar} /></div>;
}

export function PicardContents() {
  const [active, setActive] = useState<string>('');
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('#read [data-picard-section], #read #references'));
    const observer = new IntersectionObserver(items => {
      items.forEach(item => {
        if (!item.isIntersecting) return;
        if (item.target.id === 'references') { setActive('references'); return; }
        const index = PICARD_SECTIONS.findIndex(section => section.id === item.target.id);
        const entry = [...entries].reverse().find(([sectionIndex]) => sectionIndex <= index);
        if (entry) setActive(PICARD_SECTIONS[entry[0]].id);
      });
    }, { rootMargin: '-10% 0px -65% 0px' });
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  return <aside className={styles.contents} aria-label="Feature reading navigation">
    <p>Explore the Feature</p>
    {entries.map(([index, label]) => { const id = PICARD_SECTIONS[index].id; return <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined}>{label}</a>; })}
    <a href="#references" aria-current={active === 'references' ? 'location' : undefined}>Episodes & references</a>
    <a className={styles.backListen} href="#listen">↑ Back to listening</a>
  </aside>;
}
