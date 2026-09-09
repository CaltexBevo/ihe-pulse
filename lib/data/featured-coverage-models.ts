import type { FeaturedCoverage } from './featured-coverage';

/**
 * Founder-approved September 4 Feature Coverage, v18.
 * Source: operations/creative-review/2026-09-09-models-feature-v18/posting-v18.json
 */
export const MODELS_FEATURED_COVERAGE: FeaturedCoverage = {
  slug: 'four-new-ai-models-next-project',
  eyebrow: 'Feature Coverage',
  title: 'Four New AI Models Could Get Your Next Project Moving',
  teaser:
    'The latest releases promise help with bigger projects, from research code to interactive teaching tools. Their most useful differences concern what you could build, analyze or finish.',
  byline: 'Brent Jones, Co-Founder and Chief Technology Officer | Contributing Editor',
  authorName: 'Brent Jones',
  publishedAt: '2026-09-04',
  publishedLabel: 'September 4, 2026',
  sourceLabel: 'OpenAI, Anthropic, Artificial Analysis, Google and Meta',
  sourceUrl: 'https://developers.openai.com/api/docs/guides/latest-model',
  sources: [
    { id: 'openai', label: 'OpenAI model guidance', url: 'https://developers.openai.com/api/docs/guides/latest-model' },
    { id: 'codex', label: 'ChatGPT and Codex changelog', url: 'https://learn.chatgpt.com/docs/changelog' },
    { id: 'anthropic', label: 'Anthropic Fable 5.1 release and customer accounts', url: 'https://www.anthropic.com/claude-fable-and-mythos-5-1' },
    { id: 'aa', label: 'Artificial Analysis September 3 evaluation', url: 'https://artificialanalysis.ai/articles/benchmarking-gpt-6-astra' },
    { id: 'aa-chart', label: 'Artificial Analysis coding cost chart', url: 'https://cdn.sanity.io/images/6vfeftx9/articles/5030dcb45684d0ac4ce33e799be92d7481aac40b-4653x4089.png?auto=format&w=1200' },
    { id: 'google', label: 'Google Gemini 3.8 Flash release and demonstrations', url: 'https://blog.google/innovation-and-ai/models-and-research/gemini-models/3-8-flash-and-3-8-flash-cyber/' },
    { id: 'meta', label: 'Meta Muse Spark 1.3 release', url: 'https://research.meta.ai/blog/introducing-muse-spark-1-3' },
  ],
  reportTitle: 'Four new AI model releases',
  category: 'Beyond Ed',
  imagePath: '/images/feature-coverage/four-new-ai-models-next-project.png',
  imageWidth: 1672,
  imageHeight: 941,
  imageAlt:
    'Illustrated Feature Coverage card showing a magnifying lens over a document about four new AI models and the work left for people to check, correct and compare.',
  sections: [
    {
      paragraphs: [
        'An idea for a new teaching resource can stall at a practical question: who has time to build it? A promising research analysis can run into the same obstacle. This week’s AI releases deserve attention because their most compelling improvements could help with the work between having an idea and making something useful.',
        'OpenAI’s GPT-6 Astra, Anthropic’s Claude Fable 5.1, Google’s Gemini 3.8 Flash and Meta’s Muse Spark 1.3 are all designed to handle more demanding projects. The advances include writing and using code, drawing on source material and keeping track of instructions across a longer task.',
        'As Innovating Higher Ed’s chief technology officer, I give Astra the edge for my own work. I find Fable 5.1 too prone to raising objections during routine, authorized tasks, and I value Astra’s follow-through alongside its performance and cost. That experience shapes my interest in these releases: how much of a project can the tool help us complete?',
      ],
      sourceIds: [],
    },
    {
      heading: 'Astra and Fable take on harder projects',
      paragraphs: [
        'OpenAI describes Astra as stronger than GPT-5.6 Sol at coding, computer work and managing changing instructions. In supported Codex sessions, it can ask for a decision while continuing parts of a project that do not depend on the answer. Codex is OpenAI’s coding agent, the software through which the model can work with files and tools to carry out a task.',
        'For a researcher revising an analysis, the appeal is continuity. OpenAI’s documentation describes Astra changing course when asked while retaining the broader task. A correction to the research question could become part of the work in progress, with less need to restate everything that came before.',
        'Fable 5.1 makes a strong case on difficult work as well. Anthropic’s evaluations show gains over Fable 5 in coding and scientific problem solving, with lower effort settings sometimes matching or exceeding the older model’s results at lower cost.',
        'A research example makes the opportunity easier to picture. The company reports that Fable 5.1 trained a neural network to produce a more detailed elevation map of a third of Venus, using decades-old NASA Magellan radar images and an existing map. The reported result resolved features at two to three kilometers rather than 10 to 20. Stronger computational help could make it worthwhile to revisit data already collected, an opportunity that extends beyond planetary science.',
      ],
      sourceIds: ['openai', 'codex', 'anthropic'],
    },
    {
      heading: 'What the independent comparison changes',
      paragraphs: [
        'Independent evaluator Artificial Analysis supplies a direct Astra–Fable comparison. In its September 3 coding-agent test, Fable 5.1 earned the higher score, while Astra’s average processing cost per task was about 49% lower than Fable 5.1’s. The test used Codex for Astra and Claude Code for Fable, both at maximum effort, with a fallback setting for Fable.',
        'For a research computing team paying for that processing, a lower score may still be an acceptable tradeoff if the system can do the work the team needs at a substantially lower cost. A lab seeking the strongest result on a difficult coding problem may weigh the same evidence differently.',
        'Astra also made a useful advance in factual reliability. In Artificial Analysis’s AA-Omniscience knowledge test, it answered more questions correctly and produced fewer incorrect answers than GPT-5.6 Sol, with both tested at maximum reasoning effort. For academics exploring unfamiliar material, that is an encouraging combination: stronger factual recall with fewer errors to untangle.',
      ],
      sourceIds: ['aa', 'aa-chart'],
    },
    {
      heading: 'Gemini makes the teaching opportunity tangible',
      paragraphs: [
        'Google’s launch includes an interactive topographic map built with Gemini 3.8 Flash in its Antigravity development tool. It draws on U.S. Geological Survey data and offers cross-sections, two-dimensional views and scientific explanations.',
        'In a geography lesson, students could examine a cross-section, compare it with the overhead view and explain what each reveals about the terrain. An instructional designer could adapt that idea around a place or question central to a course. Google’s demonstration offers a concrete starting point for the design, not just another explanation of what AI might eventually do.',
        'The underlying improvement is stronger coding and multi-step reasoning than Gemini 3.7 Flash, according to Google’s evaluation. Introductory developer rates are unchanged, although harder tasks can use more paid processing.',
      ],
      sourceIds: ['google'],
    },
    {
      heading: 'Meta addresses the details that disappear',
      paragraphs: [
        'With Muse Spark 1.3, Meta is emphasizing better attention to the details of a long assignment. Its release describes more reliable instruction-following than earlier Muse Spark versions, including better recognition of which task a new message belongs to when several are underway.',
        'Consider revising a course resource while keeping its reading level, accessibility requirements and source material intact. Improving one part while quietly dropping another can leave the instructor with a repair job. Meta’s claimed gains address that problem of preserving the whole request through successive revisions.',
        'Muse Spark 1.3 is available through Muse Code and the Meta Model API, its developer service. Those routes make it relevant to technical teams building tools or automating recurring work.',
      ],
      sourceIds: ['meta'],
    },
    {
      heading: 'A reason to revisit the project you put aside',
      paragraphs: [
        'The distinction between a model and the software around it is especially important here. Google built its map in a development tool; the Astra–Fable coding comparison used coding agents. A model supplies the reasoning, but its working environment determines which files and tools it can use.',
        'For an educator, that means the first opportunity may already be inside an institution-approved service. An instructional designer or research computing colleague can help establish whether that service can build the resource, run the analysis or manage the files the project requires. A new model name on its own tells you too little.',
        'A useful starting point is a project with a clear missing piece: a simulation that has been too expensive to commission, research data that needs a new analysis, or a recurring report that takes too long to assemble. Identify that missing piece before shopping for another AI subscription. You may need the ability to work with files and run code more than you need a different chatbot.',
        'For a teaching or research team, an upgrade earns its place when it makes a worthwhile project feasible. This week’s releases offer reasons to reopen that conversation with a specific goal in mind: the resource, analysis or tool you would like to bring into use.',
      ],
      sourceIds: ['openai', 'google'],
    },
  ],
};
