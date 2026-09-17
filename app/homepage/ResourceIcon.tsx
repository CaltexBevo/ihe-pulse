export type ResourceIconName = 'portal' | 'directory' | 'prompts' | 'tools' | 'podcast';

/** Solid theme-aware marks from the approved homepage icon study. */
export default function ResourceIcon({ name, className }: { name: ResourceIconName; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 100" fill="none" aria-hidden="true" focusable="false">
      {name === 'portal' && <>
        <circle cx="60" cy="46" r="35" stroke="currentColor" strokeWidth="10" />
        <circle cx="60" cy="46" r="29" stroke="var(--cyan)" strokeWidth="6" />
        <rect x="31" y="82" width="58" height="7" rx="3.5" fill="currentColor" />
      </>}
      {name === 'directory' && <>
        {[0, 1, 2].flatMap(row => [0, 1, 2].map(col => (row > 0 && col === 2) ? null : <rect key={`${row}-${col}`} x={18 + col * 26} y={12 + row * 26} width="21" height="21" rx="4" fill="currentColor" />))}
        <circle cx="79" cy="62" r="19" fill="var(--home-card, var(--bg-card))" stroke="currentColor" strokeWidth="5" />
        <circle cx="79" cy="62" r="13" fill="var(--cyan)" />
        <path d="m93 77 13 13" stroke="currentColor" strokeWidth="8" />
      </>}
      {name === 'prompts' && <>
        <path d="m14 31 18 19-18 19" stroke="var(--cyan)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="49" y="30" width="62" height="12" rx="2" fill="currentColor" />
        <rect x="49" y="57" width="53" height="12" rx="2" fill="currentColor" />
      </>}
      {name === 'tools' && <>
        <rect x="9" y="16" width="67" height="57" rx="4" fill="currentColor" />
        <rect x="32" y="33" width="79" height="53" rx="3" fill="var(--home-card, var(--bg-card))" stroke="currentColor" strokeWidth="3" />
        {[0, 1].flatMap(row => [0, 1].map(col => <rect key={`${row}-${col}`} x={42 + col * 15} y={45 + row * 16} width="11" height="11" rx="1" fill="currentColor" />))}
        {[47, 60, 73].map(y => <path key={y} d={`M78 ${y}h24`} stroke="currentColor" strokeWidth="3" strokeLinecap="round" />)}
      </>}
      {name === 'podcast' && <>
        <path d="M15 22c-16 17-16 39 0 56M105 22c16 17 16 39 0 56" stroke="var(--cyan)" strokeWidth="5" strokeLinecap="round" />
        {[22, 40, 68, 40, 22].map((height, i) => <rect key={i} x={25 + i * 15} y={(100 - height) / 2} width="10" height={height} rx="4" fill="currentColor" />)}
      </>}
    </svg>
  );
}
