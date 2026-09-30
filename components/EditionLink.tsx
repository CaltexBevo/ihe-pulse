import Link from 'next/link';
import styles from './WeeklyEditionView.module.css';

export default function EditionLink({ date }: { date: string }) {
  return <Link href={`/innovation-pulse/${date}`} className={styles.editionLink}>Read Full Edition <span aria-hidden="true">→</span></Link>;
}
