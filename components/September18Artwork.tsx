import Image from 'next/image';
import styles from './HomePulseHero.module.css';

/** Presentation-only crop keeps the approved source master unchanged. */
export default function September18Artwork({ src }: { src: string }) {
  return (
    <div className={styles.september18Artwork}>
      <Image src={src} alt="Turn papers into research assistants. Explore research assistants, clearer course rules and how students use AI. One quick listen. Practical ideas to use." width={1672} height={941} sizes="(max-width: 1100px) 100vw, 1100px" priority className={styles.september18Image} />
      <div className={styles.september18LogoPanel}>
        <Image src="/images/ihe-logo.png" alt="Innovating Higher Ed" width={1685} height={716} sizes="(max-width: 680px) 12vw, 160px" />
      </div>
    </div>
  );
}
