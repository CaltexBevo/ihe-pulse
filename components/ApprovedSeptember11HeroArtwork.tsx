import Image from 'next/image';
import styles from './ApprovedSeptember11HeroArtwork.module.css';

export const APPROVED_SEPTEMBER_11_HERO =
  '/images/innovation-pulse/homepage/2026-09-11-approved-bans-or-better-assignments-orange.png';

/** Founder-selected master, displayed without cropping its editorial content or retypesetting it. */
export default function ApprovedSeptember11HeroArtwork() {
  return (
    <>
      <div className={styles.accessibleCopy}>
        <p>Innovating Higher Ed. This week’s AI news for higher ed.</p>
        <h1 id="home-pulse-title">Bans or better assignments?</h1>
        <p>7 stories. One quick listen. Know what matters.</p>
        <ul aria-label="Other stories in this week’s edition">
          <li>AI role-play and assignment rules</li>
          <li>Student alerts and real client work</li>
          <li>MIT teaching and a Moon AI model</li>
        </ul>
      </div>
      <div
        className={styles.artwork}
        data-approved-master="2026-09-11-bans-or-better-assignments-orange"
      >
        <Image
          src={APPROVED_SEPTEMBER_11_HERO}
          alt="Edition artwork contrasting an AI ban symbol with a sequence of better assignment designs."
          width={1672}
          height={941}
          className={styles.image}
          priority
          unoptimized
        />
      </div>
    </>
  );
}
