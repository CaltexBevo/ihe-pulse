import Image from 'next/image';
import styles from './ApprovedSeptemberHeroArtwork.module.css';

export const APPROVED_SEPTEMBER_HERO =
  '/images/innovation-pulse/homepage/2026-09-04-approved-hero-v4-a-blue.png';

/** Founder-selected master, displayed without retypesetting or regenerating it. */
export default function ApprovedSeptemberHeroArtwork() {
  return (
    <>
      <div className={styles.accessibleCopy}>
        <p>Innovating Higher Ed. This week’s Innovation Pulse.</p>
        <h1 id="home-pulse-title">5 stories. One quick listen. Know what matters.</h1>
        <p>Build useful projects. Rethink assignments. Find support.</p>
        <h2>4 new AI models</h2>
        <p>What could you build?</p>
        <ul aria-label="Other stories in this week’s episode">
          <li>Writing conferences</li>
          <li>Student-written exams</li>
          <li>AI + your judgment</li>
          <li>Grant Portal launch update</li>
        </ul>
      </div>
      <div className={styles.artwork} data-approved-master="2026-09-04-v4-a-blue">
        <Image
          src={APPROVED_SEPTEMBER_HERO}
          alt="A folded blue terrain map with an orange location marker."
          width={1671}
          height={941}
          className={styles.image}
          priority
          unoptimized
        />
      </div>
    </>
  );
}
