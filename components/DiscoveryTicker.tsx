'use client';

const tickerItems = [
  'GPT-5 benchmarks show 40% improvement in educational reasoning',
  'Stanford launches AI Teaching Assistant pilot program',
  'New UNESCO guidelines for AI in higher education released',
  'MIT study: 73% of faculty now using AI tools weekly',
  'Google DeepMind partners with 12 universities for research',
  'AI-powered adaptive learning increases retention by 28%',
  'Department of Education releases AI literacy framework',
  'Anthropic announces education-focused Claude features',
];

export default function DiscoveryTicker() {
  // Duplicate items for seamless loop
  const items = [...tickerItems, ...tickerItems];

  return (
    <div className="w-full overflow-hidden border-y border-white/5 bg-darker/50 backdrop-blur-sm py-3">
      <div className="flex animate-ticker-scroll whitespace-nowrap">
        {items.map((item, i) => (
          <div key={i} className="flex items-center shrink-0 px-8">
            <span className="mr-3 h-1.5 w-1.5 rounded-full bg-pulse shrink-0" />
            <span className="text-sm text-gray-400">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
