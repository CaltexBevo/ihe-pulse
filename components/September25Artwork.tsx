import Image from 'next/image';
import styles from './September25Artwork.module.css';

/** Founder-selected September 25 edition master, shown as the full homepage artwork. */
export default function September25Artwork({ src }: { src: string }) {
  return (
    <>
      <div className={styles.accessibleCopy}>
        <p>The Innovation Pulse. September 19–25, 2026.</p>
        <h1 id="home-pulse-title">Could AI be your teaching superpower?</h1>
        <p>Better questions. Stronger discussions. The return of touch.</p>
        <p>Original Feature by Dr. Norma Jones, Editor-in-Chief.</p>
      </div>
      <div className={styles.artwork} data-approved-master="2026-09-25-edition-d">
        <Image
          src={src}
          alt="September 19–25 Innovation Pulse edition artwork: an AI learning lab turns one teaching challenge into a shared learning breakthrough, with additional episode stories about visible student thinking, stronger class discussions, and the return of touch."
          width={1672}
          height={941}
          sizes="(max-width: 1100px) 100vw, 1100px"
          className={styles.image}
          priority
          unoptimized
        />
      </div>
    </>
  );
}
