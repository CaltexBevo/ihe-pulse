'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, Grid2X2, Info, List, Search, SlidersHorizontal, Star, X } from 'lucide-react';
import { paletteFor } from '@/lib/palette';
import {
  AI_DIRECTORY_TASKS, AI_DIRECTORY_ROLES, AI_DIRECTORY_PRICING_MODELS,
  AI_DIRECTORY_REVIEW_STATUSES, assertValidAiDirectoryData,
  compareAiDirectoryContentDates, compareAiDirectoryReviewDates,
  formatAiDirectoryDate, getAiDirectoryReviewLabel,
  type AiDirectoryData, type AiDirectoryTool,
} from '@/lib/data/ai-directory-schema';
import styles from './catalog.module.css';

const pricingLabels: Record<string, string> = { free: 'Free', freemium: 'Freemium', paid: 'Paid', 'institutional-quote': 'Institutional quote', unknown: 'Pricing unknown' };
const reviewLabels: Record<string, string> = { current: 'Source reviewed', limited: 'Limited review', 'retire-candidate': 'Retire candidate', blocked: 'Review pending' };
const localLogos = new Set([
  'consensus',
  'gamma',
  'mentimeter',
  'otter',
  'chatgpt',
  'elicit',
  'teachfloor',
  'eduaide',
  'gradescope',
  'notion-ai',
  'runwayml',
  'canva',
  'quizlet',
  'descript',
  'curipod',
  'disco',
  'perplexity',
  'claude',
  'gemini',
  'synthesia',
  'brisk-teaching',
  'copilot',
  'turnitin',
  'grammarly',
  'pika',
  'midjourney',
  'slidesgo'
]);
const compactDescriptions: Record<string, string> = {
  chatgpt: 'Draft materials and compare explanations.',
  claude: 'Compare drafts and organize documents.',
  gemini: 'Explore a topic and draft explanations.',
  perplexity: 'Find starting sources and investigate a question.',
  eduaide: 'Draft instructional materials for teacher preparation.',
  consensus: 'Find research papers and compare findings.',
  elicit: 'Screen papers and organize evidence.',
  gradescope: 'Apply rubrics and coordinate grading.',
  gamma: 'Turn an outline into a presentation draft.',
};
function containDialogFocus(event: KeyboardEvent<HTMLDialogElement>) {
  if (event.key !== "Tab") return;
  const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
    "button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), summary, [tabindex]"
  )).filter(element => element.tabIndex >= 0 && !element.matches(":disabled") && element.getClientRects().length > 0);
  const first = controls[0];
  const last = controls[controls.length - 1];
  if (!first) { event.preventDefault(); return; }
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
}

type Sort = 'all' | 'reviewed' | 'updated';

function ToolCard({ tool }: { tool: AiDirectoryTool }) {
  const [failedLogo, setFailedLogo] = useState(false);
  const reviewDate = formatAiDirectoryDate(tool.review.reviewedAt);
  return <article className={styles.card} style={{ '--tool-accent': paletteFor(tool.slug) } as CSSProperties}>
    <div className={styles.identity}>
      <div className={styles.logo} aria-hidden="true">
        {localLogos.has(tool.slug) && !failedLogo
          // Existing local assets avoid third-party favicon requests.
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={`/logos/${tool.slug}.png`} alt="" width={44} height={44} onError={() => setFailedLogo(true)} />
          : <span>{tool.name.charAt(0)}</span>}
      </div>
      <div className={styles.nameBlock}><div className={styles.nameRow}><h3>{tool.name}</h3>{tool.staffPick && <span className={styles.pick}><Star size={12} fill="currentColor" aria-hidden="true" />Staff Pick</span>}</div><p>{tool.category}</p></div>
    </div>
    <p className={styles.description}>{compactDescriptions[tool.slug] ?? tool.tagline}</p>
    <div className={styles.cardFooter}><div className={styles.facts}><strong>{pricingLabels[tool.pricing.model]}</strong><span>{tool.review.status === 'current' && reviewDate ? `Source review: ${reviewDate}` : `${getAiDirectoryReviewLabel(tool.review)}${reviewDate ? ` · ${reviewDate}` : ''}`}</span></div><Link href={`/ai-directory/${tool.slug}`} aria-label={`View details for ${tool.name}`}>View details <ArrowRight size={16} aria-hidden="true" /></Link></div>
  </article>;
}

export default function AIDirectoryPage() {
  const [data, setData] = useState<AiDirectoryData | null>(null);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [role, setRole] = useState('');
  const [task, setTask] = useState('');
  const [pricing, setPricing] = useState('');
  const [review, setReview] = useState('');
  const [sort, setSort] = useState<Sort>('all');
  const [picks, setPicks] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const filterDialog = useRef<HTMLDialogElement>(null);
  const reviewDialog = useRef<HTMLDialogElement>(null);
  const filterTrigger = useRef<HTMLButtonElement>(null);
  const reviewTrigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/data/ai-apps.json', { signal: controller.signal }).then(response => {
      if (!response.ok) throw new Error('Directory unavailable');
      return response.json();
    }).then((value: unknown) => { assertValidAiDirectoryData(value); setData(value); }).catch((reason: unknown) => {
      if (!(reason instanceof Error && reason.name === 'AbortError')) setError(true);
    });
    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = (data?.tools ?? []).filter(tool =>
      (!picks || tool.staffPick) && (category === 'All' || tool.category === category) &&
      (!role || tool.roles.some(value => value === role)) && (!task || tool.tasks.some(value => value === task)) &&
      (!pricing || tool.pricing.model === pricing) && (!review || tool.review.status === review) &&
      (!query || [tool.name, tool.category, tool.tagline, tool.description, ...tool.values, ...tool.tasks].some(value => value.toLowerCase().includes(query))));
    if (sort === 'reviewed') result.sort(compareAiDirectoryReviewDates);
    if (sort === 'updated') result.sort(compareAiDirectoryContentDates);
    return result;
  }, [data, search, category, role, task, pricing, review, picks, sort]);
  const hasFilters = Boolean(search || category !== 'All' || role || task || pricing || review || picks || sort !== 'all');
  const clear = () => { setSearch(''); setCategory('All'); setRole(''); setTask(''); setPricing(''); setReview(''); setPicks(false); setSort('all'); };
  const sourceStatus = data?.directoryReview.status === 'current' ? 'Source review complete' : data?.directoryReview.status === 'partial' ? 'Partial source review' : 'Source review pending';
  const categoryButton = (value: string) => <button key={value} className={styles.category} aria-pressed={category === value} onClick={() => setCategory(value)}><span>{value === 'All' ? 'All tools' : value}</span><span>{value === 'All' ? data?.tools.length : data?.tools.filter(tool => tool.category === value).length}</span></button>;
  const filters = (prefix: string) => <>
    <h2 className={styles.filterTitle}>Browse by category</h2>
    {data?.categories.slice(0, 10).map(categoryButton)}
    <details className={styles.more}><summary>More categories</summary>{data?.categories.slice(10).map(categoryButton)}</details>
    {[
      { label: 'Role', value: role, set: setRole, options: AI_DIRECTORY_ROLES.map(value => [value, value === 'faculty' ? 'Faculty' : value === 'administrator' ? 'Administrator' : 'Student']) },
      { label: 'Task', value: task, set: setTask, options: AI_DIRECTORY_TASKS.map(value => [value, value]) },
      { label: 'Pricing', value: pricing, set: setPricing, options: AI_DIRECTORY_PRICING_MODELS.map(value => [value, pricingLabels[value]]) },
      { label: 'Review status', value: review, set: setReview, options: AI_DIRECTORY_REVIEW_STATUSES.map(value => [value, reviewLabels[value]]) },
    ].map(group => <details key={group.label} className={styles.disclosure}><summary>{group.label}{group.value && <span className={styles.activeDot} aria-label="Filter active" />}</summary><label className={styles.srOnly} htmlFor={`${prefix}-${group.label}`}>{group.label}</label><select id={`${prefix}-${group.label}`} value={group.value} onChange={event => group.set(event.target.value)}><option value="">All {group.label.toLowerCase()}</option>{group.options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></details>)}
    {hasFilters && <button className={styles.clear} onClick={clear}>Clear all filters</button>}
  </>;

  if (error) return <div className={styles.page} role="alert"><h1>AI App Directory</h1><p>The directory is temporarily unavailable. Please try again later.</p><button className={styles.control} onClick={() => window.location.reload()}>Try again</button></div>;
  if (!data) return <div className={styles.page}><h1 className={styles.srOnly}>AI App Directory</h1><p role="status">Loading the AI directory…</p></div>;

  return <div className={styles.page}>
    <header className={styles.intro}><div><h1>Choose AI tools that fit your work.</h1><p>Browse tools for teaching, research and campus work.</p></div><div className={styles.search}><Search size={20} aria-hidden="true" /><label htmlFor="directory-search" className={styles.srOnly}>Search by tool or task</label><input id="directory-search" type="search" placeholder="Search by tool or task" value={search} onChange={event => setSearch(event.target.value)} /></div></header>
    <div className={styles.catalog}><aside className={styles.sidebar} aria-label="Filter tools">{filters('desktop')}</aside><section className={styles.results} aria-label="AI tools">
      <div className={styles.toolbar}>
        <button ref={filterTrigger} className={`${styles.control} ${styles.mobileFilter}`} onClick={() => filterDialog.current?.showModal()}><SlidersHorizontal size={17} aria-hidden="true" />Filters</button>
        <h2 className={styles.count} aria-live="polite">{filtered.length} tool{filtered.length === 1 ? '' : 's'}</h2>
        <label className={styles.picksControl}><input type="checkbox" checked={picks} onChange={event => setPicks(event.target.checked)} />Staff Picks ({data.tools.filter(tool => tool.staffPick).length})</label>
        <div className={styles.review}><Info size={16} aria-hidden="true" /><span>{sourceStatus} · <button ref={reviewTrigger} onClick={() => reviewDialog.current?.showModal()}>How we review</button></span></div>
        <label className={styles.sort}><span className={styles.srOnly}>Sort by</span><select aria-label="Sort tools" value={sort} onChange={event => setSort(event.target.value as Sort)}><option value="all">Directory order</option><option value="reviewed">Recently reviewed</option><option value="updated">Recently updated</option></select></label>
        <div className={styles.view} aria-label="View tools"><button aria-label="Grid view" aria-pressed={view === 'grid'} onClick={() => setView('grid')}><Grid2X2 size={19} aria-hidden="true" /></button><button aria-label="List view" aria-pressed={view === 'list'} onClick={() => setView('list')}><List size={20} aria-hidden="true" /></button></div>
      </div>
      {hasFilters && <button className={styles.clear} onClick={clear}>Clear all filters</button>}
      <div className={`${styles.cards} ${view === 'list' ? styles.list : ''}`}>{filtered.map(tool => <ToolCard key={tool.slug} tool={tool} />)}</div>
      {filtered.length === 0 && <div className={styles.empty}><p>No tools match {search ? `“${search}” and your current filters` : 'your current filters'}.</p><button className={styles.control} onClick={clear}>Clear all filters</button></div>}
    </section></div>
    <dialog onKeyDown={containDialogFocus} ref={filterDialog} className={`${styles.dialog} ${styles.sheet}`} aria-labelledby="filter-dialog-title" onClose={() => filterTrigger.current?.focus()}><div className={styles.dialogHeader}><h2 id="filter-dialog-title">Filter tools</h2><button aria-label="Close filters" onClick={() => filterDialog.current?.close()}><X size={22} /></button></div><div className={styles.sheetBody}>{filters('mobile')}</div><div className={styles.sheetFooter}><button className={styles.control} onClick={() => filterDialog.current?.close()}>Show {filtered.length} tools</button></div></dialog>
    <dialog onKeyDown={containDialogFocus} ref={reviewDialog} className={styles.dialog} aria-labelledby="review-dialog-title" onClose={() => reviewTrigger.current?.focus()}><div className={styles.dialogHeader}><h2 id="review-dialog-title">How we review</h2><button aria-label="Close review explanation" onClick={() => reviewDialog.current?.close()}><X size={22} /></button></div><div className={styles.reviewBody}><p><strong>{sourceStatus}.</strong> Directory content updated {formatAiDirectoryDate(data.directoryReview.contentUpdatedAt)}{data.directoryReview.fullReviewCompletedAt ? `; full source review completed ${formatAiDirectoryDate(data.directoryReview.fullReviewCompletedAt)}` : '; a complete current review of every record is still pending'}.</p><p>We use official product, pricing and education sources. Each tool shows its recorded source-review date or limited or pending status. Tool details include source links, pricing context and unresolved claims.</p><p>Practical uses are editorial suggestions based on documented capabilities, not hands-on ratings. Confirm current terms with the vendor before choosing a tool.</p><p><strong>Staff Picks</strong> are editorial selections. The label is not a product-testing or verification badge.</p></div></dialog>
  </div>;
}
