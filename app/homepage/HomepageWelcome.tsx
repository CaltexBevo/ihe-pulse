import styles from './HomepageShell.module.css';

export default function HomepageWelcome() {
  return <section className={styles.welcome} aria-labelledby="homepage-title">
    <div className={styles.welcomeCopy}>
      <h1 id="homepage-title">Explore New Ideas.<span>Shape Higher Ed Together.</span></h1>
      <p>Learn from research and one another, and put practical ideas to work in our teaching and on our campuses.</p>
    </div>
  </section>;
}
