export type FeaturedCoverageSection = {
  heading?: string;
  paragraphs: string[];
  bullets?: string[];
};

export type FeaturedCoverage = {
  slug: string;
  eyebrow: string;
  title: string;
  teaser: string;
  byline: string;
  publishedAt: string;
  publishedLabel: string;
  sourceLabel: string;
  sourceUrl: string;
  reportTitle: string;
  category: string;
  imagePath: string | null;
  homepageImagePath?: string | null;
  imageAlt: string;
  sections: FeaturedCoverageSection[];
};

/**
 * The homepage feature and its long-form page intentionally live outside the
 * weekly episode payload. This keeps the homepage teaser short while giving
 * the original analysis its own canonical destination.
 *
 * Dr. Jones's twice-revised v3 prose is the controlling copy. The working v5
 * article carries forward the founder-approved title and the source-precision
 * and disability-inclusive corrections documented after v3, and restores the
 * v3 wording of the opening question. Brent Jones authorized the final
 * revisions and publication of this exact edition on September 1, 2026; the
 * release still requires the normal build, receipt, and live-verification gates.
 */
export const MIT_FEATURED_COVERAGE: FeaturedCoverage = {
  slug: "mit-ai-education-purpose",
  eyebrow: "Feature Coverage",
  title: "Before Setting AI Guidelines, MIT Asked What Education Is For",
  teaser:
    "MIT’s final AI and education report asks what an MIT education should help students learn, practice, demonstrate, and value before turning to AI guidelines. Dr. Norma Jones examines what that sequence could mean for assessment, mentored learning, and campus policy, and offers eight questions leaders can carry into local conversations.",
  byline: "Dr. Norma Jones, Editor-in-Chief",
  publishedAt: "2026-08-28",
  publishedLabel: "August 28, 2026",
  sourceLabel: "MIT’s Ad Hoc Committee on AI Use in Teaching, Learning, and Research Training",
  sourceUrl: "https://aiandeducation.mit.edu/report/",
  reportTitle: "MIT Report – AI and Education",
  category: "Insights & Trends",
  imagePath: "/images/feature-coverage/mit-ai-education-purpose-lens-approved.png",
  imageAlt:
    "Editorial illustration of a magnifying lens over layered report pages with cyan and amber evidence paths, representing close examination of MIT's AI and education report.",
  sections: [
    {
      paragraphs: [
        "MIT’s new report begins with principles about learning, humanity, and institutional purpose before turning to policy. That sequence may be a useful contribution.",
        "A common starting question in higher education is whether students should be permitted to use artificial intelligence. MIT’s report takes a different sequence.",
        "The Institute charged its Ad Hoc Committee on AI Use in Teaching, Learning, and Research Training to assess current AI use, identify innovations in teaching and assessment, and propose an AI-use policy. The committee reports that its work led to deeper questions about the structure, meaning, and value of an MIT education.",
        "Before presenting recommendations, the committee asks what students should learn, which forms of knowledge, practice, and judgment their education should help them develop and demonstrate, and what they should learn to value. It then offers eight principles intended to guide MIT’s response.",
        "That sequence may widen the conversation beyond permission and prohibition. It invites educators to identify the purpose of a learning experience before deciding where AI could support access or learning and where AI might perform work students need to practice.",
        "The report is a roadmap for MIT, a highly resourced residential research institution. Other colleges would need to interpret its recommendations in light of their missions, students, staffing, course formats, accessibility responsibilities, and resources. Even so, the reasoning process may be useful well beyond MIT.",
      ],
    },
    {
      heading: "Policy may be clearer when purpose comes first",
      paragraphs: [
        "The report begins with eight principles: be humble, be bold, put humanity at the center, lean into learning, teach intentionally, reject one-size-fits-all approaches, favor augmentation over automation, and consider consequences beyond the classroom and campus.",
        "Putting those principles first may reduce the risk of writing rules that are easy to communicate but poorly connected to the learning they are meant to support.",
        "Consider a writing assignment. If its purpose is to help students develop an argument, an instructor may ask them to draft the text without generative AI composing it, while preserving approved accommodations and assistive technologies. AI could then be used to critique the organization or identify unanswered questions.",
        "In another course, working effectively with an AI system may itself be part of the learning goal. Prohibiting AI there could leave students less prepared for the work they are studying to perform.",
        "The same tool could support learning in one setting and bypass needed practice in another. The difference may depend less on the technology itself than on the educational purpose, the student’s prior experience, and the way the activity is designed.",
      ],
    },
    {
      heading: "AI-aware does not necessarily mean AI everywhere",
      paragraphs: [
        "MIT uses the term “AI-aware” to describe educational processes that account for the presence and capabilities of AI. The report does not recommend incorporating AI into every activity or even most activities.",
        "An instructor might require AI for one task, permit it for another, and ask students to complete a third without generative AI creating the response, while continuing to use appropriate accommodations and assistive technologies. Each choice could be tied to the knowledge, skill, or judgment the activity is intended to develop.",
        "A first-year student building foundational knowledge may be working toward different outcomes from an experienced researcher using AI to accelerate a familiar process. A poetry seminar, an engineering laboratory, and a graduate research project may therefore warrant different expectations.",
        "A shared institutional framework could still provide consistency through common policy language, disclosure expectations, and accountability standards. The course-level rule, however, may need to remain specific to the learning context.",
      ],
    },
    {
      heading: "A finished product may provide incomplete evidence",
      paragraphs: [
        "The committee states that unrestricted AI use can make some traditional assessments less reliable as indicators of individual learning. AI can draft an essay, write code, summarize a reading, organize an argument, and propose an analysis.",
        "That does not necessarily make the finished product less valuable. It may mean that the product alone offers limited evidence of the student’s reasoning, understanding, or decision-making.",
        "If educators want evidence of a student’s reasoning, judgment, or engagement with the learning process, they may need to look beyond the final submission. A conversation about the work, a written or recorded reflection, a portfolio showing revision, a practical demonstration, or another accessible explanation of the student’s choices could provide additional evidence.",
        "No single option will suit every learner or course. Its usefulness may depend on the learning goal, class size, accessibility requirements, available time, discipline, and outcome being assessed. Educators may need to provide accessible alternatives aligned with the same learning outcome. The practical question is not simply whether the student completed the assignment, but what the assignment allows the student to demonstrate.",
      ],
    },
    {
      heading: "Learning may require meaningful practice, not unnecessary barriers",
      paragraphs: [
        "The report asks educators to distinguish between unnecessary friction and difficulty that contributes to learning. That distinction is especially important for accessibility: a barrier created by inaccessible design is not the same as deliberate practice tied to a learning goal. AI can make demanding work easier and faster, which may be valuable in many professional and research settings.",
        "In education, repeated attempts, revision, and feedback may help students develop understanding and confidence. Removing an access barrier can support participation. By contrast, using AI to perform every step of a learning task could remove practice through which understanding or judgment might develop.",
        "The report offers a concrete example. It asks what might happen if AI agents automate tasks that undergraduates currently perform in mentored research.",
        "An AI agent might complete some tasks faster. If students no longer participate in those tasks, the institution could also narrow an apprenticeship through which future researchers may develop judgment. That outcome is not inevitable. It would depend on which tasks are automated, how students remain involved, and what other opportunities for mentored practice are provided.",
        "The example suggests a useful question for other institutions: Is a task merely work to be completed, or is it also an experience through which someone is expected to grow?",
      ],
    },
    {
      heading: "Human presence may become more valuable in some settings",
      paragraphs: [
        "MIT recommends centering people, community, and the residential experience. That recommendation reflects the Institute’s mission and campus model, but the underlying question may apply more broadly.",
        "When AI can readily produce explanations, drafts, and tutoring, interactions and records that reveal a learner’s process may take on greater importance. An instructor might observe a student working through a complex problem, review an annotated record of the process, or discuss the student’s choices in an accessible format. Each approach could offer evidence of persistence, reasoning, and judgment. Students working together may practice explaining an idea, identifying a flaw, disagreeing productively, and revising their thinking.",
        "Laboratory work, studio critique, office hours, written or recorded reflection, supervised practice, and collaborative problem-solving could provide forms of evidence and learning that a finished automated output may not show when the activities are designed accessibly.",
        "Other institutions may create those opportunities differently. A community college, regional university, or online program might use structured peer work, clinical practice, synchronous problem-solving, or faculty conferences. The relevant form would depend on the institution and the learning goal.",
      ],
    },
    {
      heading: "Clarity may support trust",
      paragraphs: [
        "The report describes students and instructors navigating inconsistent expectations about AI. Students may be permitted to use it in one course and prohibited from using it in another without understanding the reason for either decision.",
        "MIT recommends that courses explain when students must, may, or must not use AI and provide a justification. Clear rationales could reduce uncertainty and help students understand what kind of learning an assignment is designed to produce, although clarity alone may not resolve every disagreement or concern.",
        "If generative AI is restricted because a learning goal requires students to produce part of the work without AI-generated content, instructors can explain that purpose and distinguish the restriction from accommodations or assistive technology. If AI is required because fluency is part of the discipline, that rationale can also be made explicit. In that form, a policy may function as part of teaching rather than only as a warning attached to it.",
      ],
    },
    {
      heading: "Implementation may depend on institutional capacity",
      paragraphs: [
        "MIT recommends ongoing governance, school or department AI leads, faculty support, pilot funding, metrics, equitable access, and privacy safeguards. These are specific recommendations for MIT, not a required checklist for every college.",
        "The broader operational point is that course redesign may require time, experimentation, professional learning, access to tools, and opportunities to learn from colleagues. Asking every instructor to develop an individual response could produce uneven expectations and duplicate effort.",
        "Institutions with fewer resources might begin more modestly, perhaps with common policy language, a faculty learning group, instructional-design support, privacy guidance, and a small set of documented course experiments. Which supports are feasible would depend on staffing, funding, governance, and local priorities.",
        "Rather than freezing one policy in place, institutions may benefit from building a process through which faculty, students, and leaders can continue to learn and revise their approach.",
      ],
    },
    {
      heading: "Questions worth carrying back to campus",
      paragraphs: [
        "Institutions considering their own response could adapt the report’s reasoning into a sequence of questions:",
      ],
      bullets: [
        "What should students understand, practice, or demonstrate?",
        "Which knowledge, reasoning, or skills should students demonstrate without generative AI producing the work, while retaining appropriate accommodations and assistive technology?",
        "Where can AI extend learning rather than replace it?",
        "Which steps provide meaningful practice, and which barriers should be removed?",
        "What evidence would allow students to demonstrate reasoning and judgment?",
        "Which human relationships or forms of apprenticeship need to be protected?",
        "What support will faculty and students need?",
        "Once those questions are answered, when should students be required, permitted, or prohibited from using AI?",
      ],
    },
    {
      paragraphs: [
        "MIT’s report does not offer a universal policy for higher education. It offers a roadmap for MIT and places the purpose of education at the center of that institution’s response.",
        "For other colleges, the value may lie less in copying MIT’s recommendations than in considering the sequence behind them. Before deciding what AI may do in a course or program, institutions may need to clarify what education should continue to help people understand, practice, and demonstrate.",
        "That principles-before-policy sequence may be a useful contribution beyond MIT.",
        "Read the complete MIT report: AI Use in Teaching, Learning, and Research Training",
      ],
    },
  ],
};

export const FEATURED_COVERAGE = [MIT_FEATURED_COVERAGE] as const;

export function getFeaturedCoverageBySlug(slug: string): FeaturedCoverage | undefined {
  return FEATURED_COVERAGE.find((feature) => feature.slug === slug);
}
