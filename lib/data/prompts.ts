// ── Interfaces ──────────────────────────────────────────────

export interface CoreTechnique {
  id: string;
  name: string;
  useWhen: string;
  definition: string;
  useCase: string;
  whenWhy: string;
  examplePrompts: string[];
}

export interface PromptTemplate {
  id: string;
  title: string;
  prompt: string;
  usageNotes: string;
}

export interface CommonProblem {
  problem: string;
  description: string;
  fix: string;
}

export interface WorkflowStep {
  number: number;
  title: string;
  description: string;
}

export interface ChecklistItem {
  label: string;
  description: string;
}

export interface Reference {
  text: string;
}

// ── Section IDs (used by SectionNav + scrollspy) ────────────

export const sectionIds = [
  'techniques',
  'templates',
  'problems',
  'workflow',
  'references',
] as const;

export const sectionLabels: Record<(typeof sectionIds)[number], string> = {
  techniques: 'Techniques',
  templates: 'Templates',
  problems: 'Problems',
  workflow: 'Workflow',
  references: 'References',
};

// ── 9 Core Techniques ──────────────────────────────────────

export const coreTechniques: CoreTechnique[] = [
  {
    id: 'zero-shot',
    name: 'Zero-Shot Prompting',
    useWhen: 'You want a quick baseline answer or definition without providing examples.',
    definition:
      'Zero-shot prompting asks the AI to perform a task without any examples in the prompt. You give a direct instruction or question and the model responds using its general training. It\u2019s the fastest way to get an initial draft, explanation, or list because you don\u2019t have to prepare demonstrations or special formatting ahead of time.',
    useCase:
      'Use for fast definitions (\u201CExplain operant conditioning in ~120 words for non-majors\u201D), quick contrasts (\u201CSummarize how qualitative and quantitative methods differ\u201D), or rapid lists (\u201CGive five discussion starters related to academic integrity in first-year seminars\u201D). In class prep, it\u2019s a handy way to draft a first pass that you can refine with follow-ups.',
    whenWhy:
      'When you need a quick baseline, when preparing early drafts, or when exploring unfamiliar topics.',
    examplePrompts: [
      'Explain the concept of social stratification in simple terms for an intro sociology class (~120 words) and include one concrete, everyday example.',
      'List the three most important differences between photosynthesis and cellular respiration in a single paragraph for first-year students.',
    ],
  },
  {
    id: 'few-shot',
    name: 'Few-Shot Prompting',
    useWhen: 'The output must match a specific format, tone, or rubric.',
    definition:
      'Few-shot prompting includes one or more examples of the task and desired output inside the prompt. The model uses these demonstrations to infer structure, tone, and level, then produces a new response that mirrors the pattern. This leverages in-context learning to reduce ambiguity and improve consistency.',
    useCase:
      'Provide an example student answer with model feedback, then ask for feedback on a new answer \u201Cin the same style.\u201D Or show two well-formed quiz items (stem, distractors, rationale) and request five new items that match difficulty and structure. You can also include an example paragraph edit to teach the model your revision voice.',
    whenWhy:
      'Reach for few-shot when zero-shot was generic, when format is critical (rubrics, item shells, citation style), or when you need a stable voice (e.g., supportive writing tutor vs. strict copyeditor). Good examples = better outputs; 1\u20133 concise demos are usually enough.',
    examplePrompts: [
      `You are grading short answers.

Example student answer:
"[paste]"

Example instructor feedback (tone, length, structure to imitate):
"[paste]"

Now provide feedback on the next student answer in the same style:
"[paste new answer]"`,
    ],
  },
  {
    id: 'system-role',
    name: 'System & Role Prompts',
    useWhen: 'You need consistent behavior, constraints, or a specific persona.',
    definition:
      'System and role prompts set global instructions or a persona that persists across the conversation. A system prompt defines boundaries (what the AI should and shouldn\u2019t do), while a role prompt assigns a character or expertise level. Together they anchor tone, scope, and behavior so every response stays on-brand.',
    useCase:
      'Set a system prompt like \u201CYou are a supportive teaching assistant for first-year courses\u201D so every reply uses encouraging language and avoids giving full solutions. Pair it with a task-specific role (\u201CAct as a writing tutor\u201D) to get feedback aligned to your rubric. Works well for office-hour chatbots, tutoring tools, and grading assistants.',
    whenWhy:
      'Use when you want every response in a session to follow the same rules, when building student-facing tools, or when you need the AI to stay in character (e.g., Socratic questioner, peer reviewer, accessibility specialist).',
    examplePrompts: [
      `System (session-wide): You are a supportive teaching assistant for first-year courses. Use clear, neutral language, avoid full solutions, and flag uncertainty.

Role (this task): Act as an encouraging writing tutor. Give concise feedback on the draft below tied to our rubric.
Rubric: "[paste]"
Draft: "[paste]"`,
    ],
  },
  {
    id: 'context-injection',
    name: 'Context Injection',
    useWhen: 'Outputs must follow your local readings, rubrics, levels, or constraints.',
    definition:
      'Context injection means pasting relevant material\u2014rubrics, syllabi, policies, readings, or student work\u2014directly into the prompt. The AI then grounds its response in your specific content rather than relying on general training data. This dramatically improves accuracy and relevance for course-specific tasks.',
    useCase:
      'Paste a rubric and a student paragraph, then ask the AI to score it against the criteria. Or inject a chapter excerpt and request quiz questions drawn only from that text. Works for aligning feedback to your standards, creating assessments tied to assigned readings, and ensuring outputs respect institutional policies.',
    whenWhy:
      'Whenever accuracy matters and generic responses won\u2019t cut it. Essential for grading tasks, assessment creation from specific readings, and any time you need the AI to respect your local context rather than improvise.',
    examplePrompts: [
      `Using the rubric below, score the student paragraph and give two specific suggestions tied to criteria.

Course/Level: Intro Psych (non-majors)
Rubric: "[paste rubric]"
Student paragraph: "[paste]"`,
    ],
  },
  {
    id: 'step-back',
    name: 'Step-Back Prompting',
    useWhen: 'You want the model to identify the problem type and plan before solving.',
    definition:
      'Step-back prompting asks the AI to pause before answering, identify the underlying type of problem, and outline an approach or plan. Only then does it produce a solution. This \u201Cstep back\u201D reduces errors on complex or ambiguous tasks by forcing deliberate reasoning before action.',
    useCase:
      'Give students a multi-step assignment problem and have the AI first categorize it (\u201CThis is a compare-and-contrast essay prompt\u201D), then outline a plan (\u201CStep 1: identify similarities, Step 2: identify differences\u2026\u201D), then draft. Great for modeling metacognitive skills students should develop.',
    whenWhy:
      'When the task is complex or ambiguous and you want the AI to show its reasoning process. Also useful for teaching students how to break down problems before diving in\u2014the AI models the strategy you want learners to adopt.',
    examplePrompts: [
      `Identify the type of problem, outline a 3-step plan to solve it, then provide the solution.

Problem:
"[paste]"`,
    ],
  },
  {
    id: 'chain-of-thought',
    name: 'Chain-of-Thought Prompting',
    useWhen: 'The reasoning steps themselves are instructional or must be checked.',
    definition:
      'Chain-of-thought (CoT) prompting instructs the AI to show its work\u2014explaining each reasoning step before giving the final answer. This mirrors how experts solve problems and makes the logic transparent. It improves accuracy on math, logic, and multi-step reasoning tasks.',
    useCase:
      'Ask the AI to solve a statistics problem step-by-step so you can check each stage, or have it analyze an argument premise-by-premise. The visible reasoning chain serves double duty: you verify correctness and you get a worked example you can share with students.',
    whenWhy:
      'When accuracy matters and you want to audit the reasoning. Also valuable when you plan to use the output as a teaching example\u2014students see the process, not just the answer.',
    examplePrompts: [
      `Solve the problem and explain in numbered steps (max 6). Then give the final answer on a separate line labeled "Answer:".

Problem:
"[paste]"`,
    ],
  },
  {
    id: 'self-consistency',
    name: 'Self-Consistency',
    useWhen: 'Single-run outputs vary and you need a more reliable result.',
    definition:
      'Self-consistency asks the AI to generate multiple independent answers to the same question, then compare them. Points of agreement are likely correct; conflicts reveal uncertainty. The AI (or you) then selects the best-supported answer. This reduces the impact of randomness in any single generation.',
    useCase:
      'When you need a reliable answer to a nuanced question\u2014like the best pedagogical approach for a tricky topic\u2014ask for three independent takes and a synthesis. Also useful for fact-checking: if all three answers agree on a date or definition, you can be more confident.',
    whenWhy:
      'When a single response feels unreliable or when the stakes are high enough to warrant verification. Particularly useful for factual queries, assessment answers, or any task where you\u2019ve noticed the AI giving different answers on different runs.',
    examplePrompts: [
      `Produce three independent answers to the question below. Then summarize points of agreement, note any conflicts, and choose the best answer with a one-sentence justification.

Question:
"[paste]"`,
    ],
  },
  {
    id: 'tree-of-thought',
    name: 'Tree-of-Thought Prompting',
    useWhen: 'There are multiple viable approaches and you want options before deciding.',
    definition:
      'Tree-of-thought (ToT) prompting asks the AI to explore multiple solution paths in parallel\u2014like branches of a decision tree\u2014before evaluating and recommending the best one. Each branch gets a brief development (objectives, activities, pros/cons), giving you a structured comparison.',
    useCase:
      'Planning a unit on a complex topic? Ask for three distinct teaching approaches with trade-offs, then have the AI recommend one given your constraints (class size, time, resources). Also works for assignment design: \u201CPropose three assessment formats for this learning outcome and compare.\u201D',
    whenWhy:
      'When you\u2019re at a design decision point and want to see alternatives before committing. Saves time compared to brainstorming solo, and the structured comparison makes it easy to choose.',
    examplePrompts: [
      `Propose 3 distinct approaches to teach [topic] to non-majors.
For each: objectives, one keystone activity, pros/cons.
Then recommend one approach and explain why given a 50-minute class and 25 students.`,
    ],
  },
  {
    id: 'react',
    name: 'ReAct (Reason & Act)',
    useWhen: 'The task benefits from alternating reasoning with actions or questions.',
    definition:
      'ReAct (Reason + Act) prompting structures the AI\u2019s process as a loop: Reason about what it knows and what\u2019s missing, Act by asking a clarifying question or performing a sub-task, then Observe the result before continuing. This iterative cycle produces more thoughtful, tailored outputs because the AI gathers information before committing to a plan.',
    useCase:
      'Building a research plan? Have the AI reason about your topic, ask you clarifying questions (methodology preferences, timeline, resources), then draft a step-by-step plan based on your answers. Works for any multi-turn task where the AI needs your input to do good work.',
    whenWhy:
      'When a one-shot prompt can\u2019t capture all the nuance and the AI needs to ask you questions first. Great for collaborative planning, personalized advising scripts, and complex project scoping.',
    examplePrompts: [
      `Follow a Reason \u2192 Action \u2192 Observation loop to build a research plan.

Reason: Restate my topic and identify what information is missing.
Action: Ask me up to 3 clarifying questions.
Observation: Wait for answers.

Repeat the loop once. Then output a step-by-step plan with milestones and risks.`,
    ],
  },
];

// ── 15 Prompt Templates ────────────────────────────────────

export const promptTemplates: PromptTemplate[] = [
  {
    id: 'lesson-plan',
    title: 'Lesson Plan Generator',
    prompt:
      'Generate a [Duration]-minute lesson plan on [Topic] for [Course Name], a [Level] general education course. Include: 2-3 specific learning objectives, at least one interactive activity, and a brief assessment (e.g., a quick quiz or discussion prompt) to check understanding. Ensure the lesson plan is appropriate for [Class Size] students and engages diverse learning styles.',
    usageNotes:
      'Fill in [Duration] with "50", [Topic] with "climate change impacts," [Course Name] with "ENV 101: Intro to Environmental Science," [Level] with "freshman-level," and [Class Size] with "30". This prompt will yield a structured lesson plan tailored to a freshman ENV 101 class.',
  },
  {
    id: 'syllabus-outline',
    title: 'Syllabus Outline Draft',
    prompt:
      'Draft a syllabus outline for [Course Name] (a [Term Length] course). Provide a week-by-week breakdown of topics and readings for [Number of Weeks] weeks, and list major assignments (e.g., [Assignment Type1], [Assignment Type2]). Include a brief course description and 3\u20134 course learning outcomes aligned with general education goals.',
    usageNotes:
      'Replace [Course Name] (e.g., "HIST 202: World History since 1500"), [Term Length] (e.g., "15-week semester"), [Number of Weeks] (e.g., "15"), and assignment types (e.g., "midterm exam", "research paper"). The AI will produce a skeleton syllabus with topics by week and key components.',
  },
  {
    id: 'lesson-adaptation',
    title: 'Lesson Plan Adaptation (Inclusive Design)',
    prompt:
      'Adapt the following lesson plan on [Topic] for a different context: currently designed for [Current Context], modify it for [New Context]. Ensure you adjust the activities and examples to fit the new context and maintain the learning objectives. Provide the adapted lesson sequence and notes on changes made for [New Context].',
    usageNotes:
      'Use this when you have a lesson for one context and want to tailor it to another. For example, Current Context = "in-person classroom", New Context = "online asynchronous format" or Current = "a history class" to New = "an interdisciplinary honors seminar".',
  },
  {
    id: 'feedback-generator',
    title: 'Constructive Feedback Generator',
    prompt:
      'Provide constructive feedback on a [Assignment Type] submission that [Student Challenge]. The feedback should start by highlighting strengths (at least one specific praise), then address the areas for improvement kindly and specifically. Assume this is for a [Level] student in [Course Name]. Aim for a feedback length of about one solid paragraph.',
    usageNotes:
      'Insert the context: e.g., [Assignment Type] = "lab report", [Student Challenge] = "has a good analysis but contains several factual errors", [Level] = "junior", [Course Name] = "Psychology Research Methods". The AI will produce balanced feedback that acknowledges the good and gently points out issues with suggestions.',
  },
  {
    id: 'rubric-draft',
    title: 'Rubric Draft',
    prompt:
      'Create a rubric for a [Assignment Type] in [Course Name]. Include [Number of Criteria] key criteria (e.g., Content Accuracy, Organization, Analysis, Writing Clarity, etc.) relevant to the assignment. For each criterion, provide descriptors for at least three performance levels (e.g., Excellent, Satisfactory, Needs Improvement) in a way that would help [Level] students understand expectations.',
    usageNotes:
      'For example, [Assignment Type] = "oral presentation", [Course Name] = "COMM 110 Public Speaking", [Number of Criteria] = "4". This prompt yields a rubric with 4 criteria and descriptions of what each performance level looks like\u2014which you can then tweak to match your scoring.',
  },
  {
    id: 'feedback-letter',
    title: 'Summative Feedback Letter',
    prompt:
      'Draft a brief feedback letter to a student about their [Assignment Type] performance. The student did well in [Strength Area] but struggled with [Student Challenge]. In the letter, (a) acknowledge their success in [Strength Area] with specific detail, (b) address [Student Challenge] by explaining what could be improved and offering 1-2 suggestions or resources, and (c) end on an encouraging note about improvement and next steps. Use a supportive, professorly tone.',
    usageNotes:
      'Suppose the assignment is a "research paper", [Strength Area] = "framing a compelling argument", [Student Challenge] = "integrating scholarly sources correctly". The AI will compose a letter you can personalize and send via email or LMS.',
  },
  {
    id: 'differentiated-instruction',
    title: 'Differentiated Instruction Strategies',
    prompt:
      'Suggest two ways to teach [Concept] in [Course Name] that accommodate different learning preferences or needs. For each strategy, identify the target learning style or student group (e.g., visual learners, English language learners, hands-on learners, etc.) and describe how to implement the strategy in class. Ensure the suggestions are feasible in a [Class Size] class.',
    usageNotes:
      'If [Concept] = "the water cycle", [Course Name] = "GEOG 101", [Class Size] = "large (100-student lecture)". The output might give: (1) a visual approach for visual learners, (2) an interactive demo for kinesthetic learners\u2014each with practical implementation tips.',
  },
  {
    id: 'diverse-learners',
    title: 'Adaptation for Diverse Learners',
    prompt:
      'Take the following assignment: [Brief Assignment Description]. Propose one modification or support to make it more accessible for students with [Specific Need] (e.g., non-native English speakers, hearing impairment, anxiety, etc.), and another modification for [Different Need]. Explain how each modification maintains the assignment\u2019s learning objectives while providing the needed support or flexibility.',
    usageNotes:
      'Example: Brief Assignment Description = "10-minute in-class oral presentation on a current event," Specific Need = "severe public speaking anxiety", Different Need = "a hearing impairment". The AI might suggest an alternative format for the anxious student and captions or sign interpretation for hearing-impaired students.',
  },
  {
    id: 'inclusive-discussion',
    title: 'Inclusive Discussion Prompt',
    prompt:
      'Generate a class discussion prompt on [Topic] that is inclusive and invites perspectives from students of diverse backgrounds (cultural, academic, etc.). The prompt should be open-ended and avoid assumptions that everyone has the same experience. Also suggest two follow-up questions I, as the instructor, could use to probe deeper or invite quieter students to contribute.',
    usageNotes:
      'If [Topic] = "the impact of social media on daily life". The output will be a broadly framed discussion prompt with follow-up questions to create a welcoming discussion environment.',
  },
  {
    id: 'advising-email',
    title: 'Advising Email Draft',
    prompt:
      'Draft an email from a faculty advisor to a student who [Student Situation]. The tone should be supportive and proactive. In the email, (a) acknowledge the student\u2019s situation or concern, (b) provide at least two suggestions or resources (on campus or strategies) to help with [Issue], and (c) invite the student to follow up or meet to discuss further. Sign off as an advisor.',
    usageNotes:
      'E.g., [Student Situation] = "is struggling academically after the midterm exams" (Issue: time management and study strategies). The AI will produce a thoughtful email you can personalize and send.',
  },
  {
    id: 'degree-planning',
    title: 'Degree Planning Guide',
    prompt:
      'Explain the course planning for [Major/Program] in an easy-to-understand way for a second-year student advisee. The student wants to graduate on time and is concerned about prerequisites and sequencing. Provide a brief overview of: (a) which courses or requirements they should prioritize each year (Years 2, 3, 4), (b) any critical prerequisites or GPA requirements to note, and (c) advice on internships or extracurriculars for this field. Write it as if an advisor is speaking to the student.',
    usageNotes:
      'Suppose [Major/Program] = "Psychology B.A." The output might break down: Year 2: finish core Psych intro courses & stats; Year 3: take research methods (prereq for senior thesis); Year 4: capstone and advanced seminars. A nice planning summary you can give to students.',
  },
  {
    id: 'role-play-script',
    title: 'Role-Play Script (Advisor-Student)',
    prompt:
      'Provide a sample dialogue between a faculty advisor and a student who [Student Issue]. The dialogue should show the advisor asking open-ended questions and guiding the student toward a solution. Aim for about 8-10 exchanges. At the end, include a brief advisor reflection or note on why certain questions were asked (to illustrate good advising practice).',
    usageNotes:
      'If [Student Issue] = "wants to drop a course late in the semester due to stress". The script will show a model interaction that can help advisors-in-training or prepare faculty for delicate conversations.',
  },
  {
    id: 'ai-policy',
    title: 'Syllabus AI Policy Draft',
    prompt:
      'Draft a syllabus policy for [Course Name] about the use of AI tools (like ChatGPT) in coursework. The policy should clearly state: (a) which uses of AI are allowed (if any) and for what purposes (e.g., brainstorming, grammar checking), (b) which uses are forbidden (e.g., fully writing assignments), (c) how students should credit or disclose AI assistance if allowed, and (d) the consequences of misuse in line with academic integrity standards. The tone should be educational, not just punitive, explaining the rationale behind the policy.',
    usageNotes:
      'Fill in [Course Name] or keep it general. The output will be a comprehensive policy paragraph you can tweak for your syllabus.',
  },
  {
    id: 'integrity-case',
    title: 'Academic Integrity Case Discussion',
    prompt:
      'Create a hypothetical classroom scenario that deals with a breach of academic integrity involving AI. For instance, a student [AI Misuse Scenario]. Outline the scenario in a few sentences, and then provide 3 open-ended discussion questions I can ask the class about how to handle it and what the ethical implications are. The goal is to prompt student reflection on honesty and AI.',
    usageNotes:
      'Example [AI Misuse Scenario] = "submitted a paper that was mostly AI-generated without disclosure". The result will give a short narrative and discussion questions. Good for facilitating class dialogue on these timely issues.',
  },
  {
    id: 'student-handout',
    title: 'Student Handout on AI Use',
    prompt:
      'Generate a one-page handout outline for students titled \'Using AI Tools Responsibly in [Institution Name] Courses\'. It should have: an introduction paragraph on why this is important, then 3 sections \u2013 (1) Allowed Uses of AI (with examples of acceptable assistance), (2) Prohibited Uses (with examples like plagiarism via AI), (3) Tips for Transparency (how to acknowledge or approach instructors about AI use). Write it in student-friendly language.',
    usageNotes:
      'Put your [Institution Name] or leave it general. The output will be an outline you can expand into a handout or webpage to educate students on navigating AI ethically.',
  },
];

// ── 6 Common Problems ──────────────────────────────────────

export const commonProblems: CommonProblem[] = [
  {
    problem: 'Too Vague',
    description: 'Prompts without context produce generic results.',
    fix: 'Include course level, focus, and objectives.',
  },
  {
    problem: 'No Audience Level',
    description:
      'Without stating learner level or background, AI may pitch content too high or low.',
    fix: 'Specify the intended audience (e.g., "first-year non-majors").',
  },
  {
    problem: 'Missing Format or Length',
    description: 'AI will guess, often incorrectly.',
    fix: 'State the format (bullets, table, paragraph) and desired length.',
  },
  {
    problem: 'Overloaded Prompts',
    description: 'Multiple tasks in one prompt can confuse the AI.',
    fix: 'Break requests into smaller, sequential prompts.',
  },
  {
    problem: 'No Role or Tone',
    description: 'Without guidance, tone and style may be off.',
    fix: 'Assign a role (e.g., "You are a supportive writing tutor\u2026") to anchor the voice.',
  },
  {
    problem: 'No Iteration or Verification',
    description: 'First outputs can contain errors or bias.',
    fix: 'Review, refine, and verify before use.',
  },
];

// ── 8-Step Refinement Workflow ─────────────────────────────

export const workflowSteps: WorkflowStep[] = [
  {
    number: 1,
    title: 'Define Your Goal',
    description: 'Be specific about the task and purpose.',
  },
  {
    number: 2,
    title: 'Add Context',
    description:
      'Include audience, course level, content source, and constraints.',
  },
  {
    number: 3,
    title: 'Draft Clearly',
    description: 'Keep it one cohesive request; split complex tasks.',
  },
  {
    number: 4,
    title: 'Test',
    description: 'Run it and check for accuracy, tone, and format.',
  },
  {
    number: 5,
    title: 'Spot Gaps',
    description:
      'Identify missing details, wrong tone, or off-target content.',
  },
  {
    number: 6,
    title: 'Refine',
    description: 'Adjust scope, tone, format, and add examples if needed.',
  },
  {
    number: 7,
    title: 'Iterate',
    description:
      'Test and tweak until results consistently meet expectations.',
  },
  {
    number: 8,
    title: 'Document',
    description: 'Save the final prompt for reuse or sharing.',
  },
];

// ── Tuning Checklist ───────────────────────────────────────

export const tuningChecklist: ChecklistItem[] = [
  {
    label: 'Clarity',
    description: 'No vague verbs or unclear asks.',
  },
  {
    label: 'Context',
    description: 'Subject, learner level, and key details included.',
  },
  {
    label: 'Format',
    description: 'Output type and length specified.',
  },
  {
    label: 'Tone & Style',
    description: 'Academic, friendly, or role-based as needed.',
  },
  {
    label: 'Cognitive Level',
    description: 'Matches desired depth (e.g., analysis vs. recall).',
  },
  {
    label: 'Academic Fit',
    description: 'Supports learning goals and integrity.',
  },
  {
    label: 'Inclusivity',
    description: 'Avoids bias, stereotypes, and exclusionary language.',
  },
];

// ── References ─────────────────────────────────────────────

export const references: Reference[] = [
  {
    text: 'Brown, T. et al. (2020). Language Models are Few-Shot Learners. NeurIPS.',
  },
  {
    text: 'Wei, J. et al. (2022). Chain-of-Thought Prompting Elicits Reasoning in Large Language Models. NeurIPS.',
  },
  {
    text: 'Yao, S. et al. (2023). Tree of Thoughts: Deliberate Problem Solving with Large Language Models. NeurIPS.',
  },
  {
    text: 'Zheng, H. et al. (2023). Take a Step Back: Evoking Reasoning via Abstraction in Large Language Models. arXiv.',
  },
  {
    text: 'Wang, X. et al. (2023). Self-Consistency Improves Chain of Thought Reasoning in Language Models. ICLR.',
  },
  {
    text: 'Yao, S. et al. (2023). ReAct: Synergizing Reasoning and Acting in Language Models. ICLR.',
  },
  {
    text: 'Mollick, E. & Mollick, L. (2023). Using AI to Implement Effective Teaching Strategies in Classrooms. SSRN.',
  },
  {
    text: 'Bowen, J. & Watson, C. E. (2024). Teaching with AI: A Practical Guide to a New Era of Human Learning. Johns Hopkins University Press.',
  },
  {
    text: 'OpenAI (2023). GPT-4 Technical Report. arXiv.',
  },
  {
    text: 'Gibbons, S. (2023). Prompt Engineering for Educators. EDUCAUSE Review.',
  },
];
