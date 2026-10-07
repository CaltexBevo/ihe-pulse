import Image from 'next/image';
import styles from './Edition19Artwork.module.css';

/** Preserve the approved master bytes; omit its printed audio footer from the website player. */
export default function Edition19Artwork({ src }: { src: string }) {
  return (
    <>
      <h1 id="home-pulse-title" className="sr-only">The Innovation Pulse, Weekly Edition 19. Grade with evidence, not just an AI flag.</h1>
      <div className={styles.artwork} data-approved-master="edition-19-weekly-d">
        <Image src={src} alt="Explore new ideas. Shape higher ed together. Grade with evidence, not just an AI flag. Plus the Wonka-Lantern Feature, discussion and reasoning, pilots and course tools, cuts, feedback and grants." width={1920} height={1080} sizes="(max-width: 1100px) 100vw, 1100px" className={styles.image} priority unoptimized />
      </div>
    </>
  );
}
