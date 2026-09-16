"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./AllStories.module.css";
export type LibraryStory = { id: string; href: string; title: string; summary: string; source: string; category: string; date: string; dateLabel: string; image: string };
const CURRENT = ["Insights & Trends", "Case Study", "Practical Tips", "Ethical AI", "Beyond Ed", "Research", "AI Workforce & Careers", "Investing in Innovation"];
export default function AllStoriesClient({ stories }: { stories: LibraryStory[] }) {
 const [query, setQuery] = useState("");
 const [category, setCategory] = useState("");
 const [sort, setSort] = useState("newest");
 const [limit, setLimit] = useState(12);
 const categories = useMemo(() => {
  const names = new Set(stories.map(s => s.category));
  return [...CURRENT.filter(c => names.has(c)), ...Array.from(names).filter(c => !CURRENT.includes(c)).sort()];
 }, [stories]);
 const results = useMemo(() => {
  const q = query.trim().toLocaleLowerCase();
  return stories.filter(s => (!category || s.category === category) && (!q || [s.title, s.summary, s.source, s.category].some(v => v.toLocaleLowerCase().includes(q)))).sort((a,b) => sort === "title" ? a.title.localeCompare(b.title) : sort === "oldest" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
 }, [stories, query, category, sort]);
 function clear() { setQuery(""); setCategory(""); setSort("newest"); setLimit(12); }
 return <div className={styles.page}>
  <nav aria-label="Breadcrumb" className={styles.breadcrumb}><Link href="/">Home</Link><span aria-hidden="true">/</span><span>Stories</span></nav>
  <div className={styles.headingRow}>
   <div className={styles.intro}><h1>Browse All Stories</h1><p>Find ideas, research, and practical examples for higher education.</p></div>
   <div className={styles.controls}>
    <div className={styles.search}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><input type="search" aria-label="Search stories" placeholder="Search stories..." value={query} onChange={e => { setQuery(e.target.value); setLimit(12); }}/></div>
    <label className={styles.sort}><span className={styles.srOnly}>Sort stories</span><select value={sort} onChange={e => { setSort(e.target.value); setLimit(12); }}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="title">Title A to Z</option></select></label>
   </div>
  </div>
  <div className={styles.filters} role="group" aria-label="Filter stories by category">{["", ...categories].map(c => <button key={c} type="button" aria-label={c ? "Filter by " + c : "Show all stories"} aria-pressed={category === c} onClick={() => { setCategory(c); setLimit(12); }}>{c || "All stories"}</button>)}</div>
  <p className={styles.count} role="status" aria-live="polite">Showing {Math.min(limit, results.length)} of {results.length} {results.length === 1 ? "story" : "stories"}{query.trim() || category ? " (" + stories.length + " total)" : ""}</p>
  {results.length ? <div className={styles.grid}>{results.slice(0,limit).map(s => <article key={s.id} className={styles.card}><Link href={s.href} className={styles.cardLink}>
   {s.image && <div className={styles.image}>{
    // eslint-disable-next-line @next/next/no-img-element
    <img src={s.image} alt="" loading="lazy" width="640" height="360"/>
   }</div>}
   <div className={styles.cardBody}><p className={styles.category}>{s.category}</p><h2>{s.title}</h2><div className={styles.cardFooter}><time dateTime={s.date}>{s.dateLabel}</time><span className={styles.read}>Read story <span aria-hidden="true">→</span></span></div></div>
  </Link></article>)}</div> : <div className={styles.empty}><h2>No stories found</h2><p>{query.trim() ? "No stories match “" + query.trim() + "”" + (category ? " in " + category : "") + "." : "No stories match these filters."}</p><button type="button" aria-label="Clear story filters" onClick={clear}>Clear filters</button></div>}
  {limit < results.length && <div className={styles.more}><button type="button" aria-label="Load more stories" onClick={() => setLimit(n => n + 12)}>Load more stories <span aria-hidden="true">↓</span></button></div>}
 </div>;
}
