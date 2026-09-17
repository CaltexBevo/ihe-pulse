import Link from "next/link";
import AllStoriesClient, { type LibraryStory } from "./AllStoriesClient";
import ArchiveListClient, { type ArchiveEpisodeData } from "../archive/ArchiveListClient";
import styles from "./AllStories.module.css";

export default function LibraryView({ stories, editions, tab }: { stories: LibraryStory[]; editions: ArchiveEpisodeData[]; tab?: string }) {
  const active = tab === "features" || tab === "editions" ? tab : "stories";
  const tabs = [
    { id: "stories", label: "All Stories", href: "/innovation-pulse/stories" },
    { id: "features", label: "Original Features", href: "/innovation-pulse/stories?tab=features" },
    { id: "editions", label: "Weekly Editions", href: "/innovation-pulse/stories?tab=editions" },
  ];
  return <div className={styles.page}>
    <nav aria-label="Breadcrumb" className={styles.breadcrumb}><Link href="/">Home</Link><span aria-hidden="true">/</span><span>Library</span></nav>
    <header className={styles.intro}><h1>Explore the Library</h1><p>Find ideas, research, and practical examples for higher education.</p></header>
    <nav className={styles.tabs} aria-label="Library collections">
      {tabs.map(item => <Link key={item.id} href={item.href} aria-current={active === item.id ? "page" : undefined} scroll={false}>{item.label}</Link>)}
    </nav>
    {active === "editions"
      ? <ArchiveListClient episodes={editions} />
      : <AllStoriesClient key={active} stories={active === "features" ? stories.filter(story => story.href.startsWith("/feature-coverage/")) : stories} embedded />}
  </div>;
}
