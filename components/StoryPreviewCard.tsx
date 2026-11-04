import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './StoryPreviewCard.module.css';
import { getCardArtwork } from '@/lib/cardArtwork';

type Props = {
  title: string; intro: string; category: string; href: string;
  image?: string | null; artwork?: ReactNode; source?: string; sourceUrl?: string;
  byline?: string; dateLabel?: string; badge?: string; expandedText?: string;
  headingLevel?: 2 | 3; children?: ReactNode; sizes?: string; onImageReady?: () => void;
};
export const GRID_IMAGE_SIZES = '(max-width: 767px) calc(100vw - clamp(2rem, 8vw, 4rem) - 2px), (max-width: 1023px) calc((100vw - clamp(2rem, 8vw, 4rem) - 24px) / 2 - 2px), (max-width: 1200px) calc((100vw - 4rem - 48px) / 3 - 2px), calc((1200px - 4rem - 48px) / 3 - 2px)';

export default function StoryPreviewCard({ title,intro,category,href,image,artwork,source,sourceUrl,byline,dateLabel,badge,expandedText,children,headingLevel=3,sizes=GRID_IMAGE_SIZES,onImageReady }: Props) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const cardImage = image ? getCardArtwork(image) : null;
  return <article className={styles.card} data-story-preview>
    {(image || artwork) && <Link className={styles.frame} href={href} aria-label={'Read '+title} tabIndex={-1}>
      {artwork || <Image src={cardImage!.src} style={{ objectFit: cardImage!.fit }} alt="" fill sizes={sizes} loading={onImageReady ? 'eager' : 'lazy'} onLoad={onImageReady} onError={onImageReady}/>}
    </Link>}
    <div className={styles.body}>
      {badge && <span className={styles.badge}>{badge}</span>}
      <p className={styles.category}>{category}</p>
      <Heading className={styles.title}><Link href={href}>{title}</Link></Heading>
      <p className={styles.intro}>{intro}</p>
      {byline && <p className={styles.meta}>{byline}</p>}
      {expandedText && <details className={styles.details}><summary>Read more</summary>{expandedText.split(/\n\n+/).map((p,i)=><p key={i}>{p}</p>)}</details>}
      {(source || dateLabel) && <div className={styles.footer}>
        {source && <p className={styles.source}>{sourceUrl ? <a href={sourceUrl} target="_blank" rel="noopener noreferrer">{source} <span aria-hidden="true">↗</span></a> : source}</p>}
        {dateLabel && <p className={styles.meta}>{dateLabel}</p>}
      </div>}
      {children}
    </div>
  </article>;
}
