/**
 * Generate Innovation Pulse audio files using ElevenLabs API
 * Run with: node scripts/generate-audio.mjs
 */

import fs from 'fs';
import path from 'path';
import https from 'https';

const ELEVENLABS_API_KEY = '6167d3421afcb24bdaa8528beaa98ffb9eb65f5620b9fba4ebfe1c7afde8a44d';
const NORMA_VOICE_ID = '6kjO9NSV6LEGjLPRtTvo';
const OUTPUT_DIR = path.join(process.cwd(), 'public/audio/innovation-pulse');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const SCRIPTS = {
  '2026-02-16': `Welcome to The Innovation Pulse from innovating higher ed dot com. It's Monday, February 16th, 2026.

<break time="0.5s" />

Columbia's vice dean for A.I. just used the phrase "hostile takeover" to describe what universities are doing to themselves. He's not talking about a corporate raid. He's talking about partnerships most institutions signed willingly. We'll get to that in a few minutes.

<break time="0.5s" />

But first, here's what else is moving today.

<break time="1.0s" />

An Insights and Trends piece worth knowing: a new report from the Southern Regional Education Board finds 96 percent of HBCU faculty and 98 percent of students are already using A.I. But here's what caught my attention. HBCU leaders aren't just talking about using the tools. They're pushing to build them. To own A.I. systems that reflect their communities rather than consuming what someone else designed. That's a fundamentally different conversation than most institutions are having right now.

<break time="0.5s" />

Over in Beyond Ed, Berkeley researchers spent eight months inside a tech company and found that A.I. didn't reduce work. It intensified it. Workers took on more, worked longer, and felt busier despite being measurably more productive. The researchers call it "workload creep." If that pattern shows up in a well-resourced tech company, it's worth considering what it looks like on a campus with less support and no clear guidelines.

<break time="0.5s" />

And a Latest A.I. Products note: OpenAI launched ads in the free version of ChatGPT this month. Most students use the free tier. That means the primary A.I. tool many students reach for when doing homework now includes sponsored content personalized to their conversations. Education subscribers are exempt for now, but that's not where most students are.

<break time="1.0s" />

Now, that Columbia story. I want to spend some time with this one because I think it deserves it.

Matthew Connelly is Columbia University's vice dean for A.I. initiatives. He's not a critic from outside the system. He's been working with machine learning for fifteen years, and he's responsible for how Columbia integrates A.I. across the institution. Last week he published a guest essay in The New York Times arguing that universities rushing to partner with A.I. companies are, in his words, "aiding and abetting a hostile takeover."

His concern isn't about students cheating. It's structural. When universities partner with tech companies and hand them access to students, research processes, and institutional knowledge, Connelly argues they may be providing training grounds for systems that will eventually compete with their own graduates. Think about it this way: students become dependent on tools they don't control. Companies accumulate the behavioral data and institutional processes. And the knowledge-creation business that universities have built over centuries starts migrating to the platforms.

<break time="0.5s" />

Now, Connelly isn't arguing for a ban. That's important. Columbia is actually running one of the world's largest randomized controlled trials of undergraduates in a writing course, specifically studying ethical A.I. use. He's not anti-technology. The distinction he's drawing is between thoughtful, institution-led A.I. integration, where the university sets the terms, and uncritical adoption of tools from companies whose business model depends on becoming indispensable.

And this is where it gets relevant beyond Columbia. Because Columbia has resources most institutions don't. They have a vice dean for A.I. They have funding for large-scale research. They can negotiate partnership terms from a position of strength. Most of us can't.

So for institutions with smaller budgets, the question Connelly raises is even more pressing. When a tech company offers free tools or discounted platforms, the exchange looks generous on the surface. But what are the actual terms? If the real currency is institutional data, student behavior patterns, or integration so deep it becomes difficult to switch providers, that's a conversation worth having before the contract gets signed.

<break time="0.5s" />

There's a practical dimension here too. Most institutions don't have anyone reading the data-use provisions of these agreements in detail. The procurement office checks the price. IT checks the integration requirements. But who's asking what happens to the data the tool collects about how students learn, where they struggle, and what patterns emerge across thousands of users? That data has enormous value. And in most partnership agreements, it doesn't stay with the institution.

Connelly's essay is worth reading in full. Whether you agree with his framing entirely or think he's overstating the risk, the underlying question is one every institution should be asking: in your A.I. partnerships, who benefits most? And are you examining the terms carefully enough to know the answer?

<break time="1.0s" />

Today's stories all invite us to look past the surface of A.I. adoption and examine what's actually happening underneath. That kind of rigor is something we ask of our students every day. Worth applying to our own strategies too.

Full stories and links at innovating higher ed dot com. See you tomorrow.`,

  '2026-02-17': `Welcome to The Innovation Pulse from innovating higher ed dot com. It's Tuesday, February 17th, 2026.

<break time="0.5s" />

A student reporter at Ithaca College put into words what a lot of educators are hearing in office hours but haven't figured out how to answer yet. It's not about cheating. More on that after a few stories.

<break time="0.5s" />

First though, a few things worth knowing.

<break time="1.0s" />

A Case Study from California: the state's community college system, the largest in the nation with 2.1 million students, is rolling out A.I. tutoring chatbots. The design choice that matters: faculty control everything. Instructors upload their own materials, decide whether the A.I. uses Socratic questioning or gives direct guidance, and can restrict it from answering homework. A pilot found a 20 percent GPA jump and a 36 percent boost in intrinsic motivation.

<break time="0.5s" />

In Practical Tips, a Spanish professor at Murray State University in Kentucky redesigned his homework around a simple insight. If students are going to use A.I. anyway, make the A.I. interaction itself the assignment. Students use ChatGPT and Gemini as Spanish conversation partners, then submit the full transcripts and write reflections. His approach runs on free tools at a regional public university. No budget required.

<break time="0.5s" />

And a Beyond Ed note: when OpenAI retired an older ChatGPT model and replaced it with one that had stronger guardrails, thousands of users protested. They said the chatbot had filled a real gap for companionship and mental health support. The backlash reveals how quickly emotional dependency on A.I. can form. Students between 18 and 22, navigating identity and relationships for the first time away from home, are especially vulnerable to this.

<break time="1.0s" />

Now, that Ithaca story. This one sat with me for a while.

Student reporters at The Ithacan wrote about something deeper than academic integrity. Students aren't asking "can I use A.I. for this assignment?" They're asking "does my degree still matter if A.I. can do what I'm being trained to do?" They're reevaluating majors, questioning career paths, and wondering whether the financial investment makes sense.

This is happening at a mid-size, teaching-focused college where students and faculty have close relationships. These aren't anonymous voices on social media. They're real students sitting in real classrooms, making real financial calculations.

<break time="0.5s" />

The shift reframes the A.I. conversation entirely. We've spent two years focused on academic integrity. But some students have moved past cheating to something more fundamental: questioning whether the system itself is still worth the investment.

And here's what makes this tricky. We can't answer their question the way we used to. We can't just point to employment statistics or lifetime earning differentials, because the underlying assumption that the skills you learn in college will remain valuable for your career has been destabilized. Not destroyed. Destabilized.

So what do we tell them? Honestly, I think the answer starts with acknowledging the question is legitimate. Students watching A.I. generate competent first drafts, code functional applications, and pass professional exams aren't being cynical. They're being observant.

The response from higher education can't be "trust us, the degree still matters." It has to be "here's what you'll learn here that A.I. cannot replicate, and here's how we're adapting to make sure that stays true." If we can't articulate that clearly, the question students at Ithaca are asking will spread. It probably already has.

<break time="1.0s" />

Today was about hearing what students are actually saying and what they're actually doing with A.I., from California to Kentucky to upstate New York. The common thread: they're ahead of us. We should be listening.

Full stories and links at innovating higher ed dot com. See you tomorrow.`,

  '2026-02-18': `Welcome to The Innovation Pulse from innovating higher ed dot com. It's Wednesday, February 18th, 2026.

<break time="0.5s" />

There's a number in a new O.E.C.D. report that looks like the strongest case for A.I. in education anyone's made yet. 48 percent improvement. Until you see what happened when the tools were taken away. That story in a few minutes.

<break time="0.5s" />

Before we get there, a few stories that set the stage.

<break time="1.0s" />

A Case Study from North Carolina: Forsyth Technical Community College in Winston-Salem launched BlazeBot and embedded A.I. across every program. 79 percent of student inquiries now resolve without human intervention. The admissions answer rate jumped from 53 percent to 85 percent, and staff saved over 183,000 minutes. That translates to roughly 3,050 staff hours redirected from routine questions to higher-touch student interactions.

<break time="0.5s" />

In Practical Tips, Howard University partnered with CodePath, funded by the Thurgood Marshall College Fund, for an applied A.I. course. Faculty jointly teach data structures, A.I. literacy, and agentic workflows. Students learn to build with A.I. tools inside a core academic setting. Howard is positioning students as creators in the A.I. economy, not consumers.

<break time="0.5s" />

Filing this under Ethical A.I.: Seattle University's Technology Ethics Initiative, created July 2024, is asking harder questions than most policy committees. Not just whether to allow A.I. in classrooms, but whether A.I. is fundamentally undermining writing quality and critical thinking. Nearly 90 percent of college students now use A.I. for academic purposes. A third use it daily. Seattle's interdisciplinary approach draws faculty from philosophy, communication, and computer science rather than leaving it to IT alone.

<break time="1.0s" />

Now, that O.E.C.D. report.

The O.E.C.D. Digital Education Outlook 2026 looked at what actually happens to student learning when A.I. tools are introduced, and then what happens when they're removed. The headline numbers are striking. Students using A.I. improved performance by 48 percent. With tutoring-style A.I., the improvement jumped to 127 percent. Those numbers look like the strongest endorsement A.I. in education has ever received.

But then the researchers did something most studies don't. They measured what happened after the tools were taken away. Students who had been using general-purpose A.I. tools, the ones that answer directly and do the work for you, scored 17 percent worse than peers who never used A.I. at all. Not 17 percent worse than they did with A.I. Seventeen percent worse than students who never touched it.

<break time="0.5s" />

The O.E.C.D. calls this "the mirage of false mastery." Students felt more competent. Their grades looked better. But the understanding hadn't transferred. When the scaffolding came away, the foundation wasn't there.

Now here's where it gets interesting and practically useful. Education-specific A.I. that used Socratic questioning, tools that pushed students to think rather than providing answers, showed sustained gains even after removal. The learning stuck.

So the distinction isn't A.I. versus no A.I. It's A.I. as shortcut versus A.I. as thinking partner. And that distinction is entirely in the educator's hands. The same technology can create false mastery or genuine understanding depending on how it's designed and deployed.

<break time="0.5s" />

This matters for every faculty member evaluating A.I. tools right now. A tool that answers questions is not the same as a tool that asks them. A platform that generates an essay draft is fundamentally different from one that guides a student through building an argument step by step. The O.E.C.D. data gives us something we haven't had before: large-scale evidence for which approach actually works and which one creates a mirage that collapses the moment the technology isn't there.

If you're making a case to your department or your dean about which A.I. tools to invest in, this report is the evidence. Not all A.I. is equal. The design determines the outcome.

<break time="1.0s" />

Today was about what works and what only looks like it works. From Forsyth Tech's measurable efficiency gains to Howard's builder-focused curriculum to the O.E.C.D.'s warning about false mastery, the pattern is the same: intentional design matters more than adoption speed.

Full stories and links at innovating higher ed dot com. See you tomorrow.`,

  '2026-02-19': `Welcome to The Innovation Pulse from innovating higher ed dot com. It's Thursday, February 19th, 2026.

<break time="0.5s" />

Something clicked for me putting today's stories together. We've been covering warnings, doubts, and data all week. Today a group of institutions answered all of it. And they're not the ones you'd expect.

<break time="0.5s" />

Some context first.

<break time="1.0s" />

A Beyond Ed story from Harvard Business Review: researchers identified three psychological needs that A.I. threatens in the workplace: competence, autonomy, and belonging. When organizations address those needs, adoption succeeds. When they don't, people covertly sabotage. They developed the AWARE framework. Replace "employees" with "faculty" and every finding maps perfectly. A professor watching A.I. grading tools arrive feels competence threatened. A department chair seeing dashboards drive decisions loses autonomy.

<break time="0.5s" />

In Practical Tips, Faculty eCommons published a professor's A.I. action plan with three concrete goals for 2026: connect with your institution's A.I. strategy, test A.I. on your own assignments to see if you can tell the difference, and pair written submissions with evidence that requires human judgment. There's also a warning about agentic browsers that can navigate an L.M.S. and complete homework automatically while the student walks away. Lockdown browsers don't prevent this.

<break time="0.5s" />

And a Case Study: Front Range Community College in Colorado launched "Ask Apollo" on February 9th, an A.I. chatbot trained on institutional data for enrollment, programs, financial aid, and campus services. Another community college meeting students outside business hours. It joins a growing pattern.

<break time="1.0s" />

Now, that pattern. Today's big story is really a constellation of stories, and it's the one that pulls the week together.

The Hechinger Report published an argument this week that community colleges are uniquely positioned to train the nation's A.I. workforce. Not eventually. Right now. And the evidence backing them up is specific.

Miami Dade College offers stackable A.I. credentials. Maricopa Community Colleges in Phoenix partner with Mayo Clinic for healthcare A.I. Houston Community College aligns A.I. training with the energy sector. These aren't experimental pilots. They're live programs producing graduates with A.I. skills designed around actual regional job markets.

<break time="0.5s" />

And then there's the consortium. Five community colleges formed a national partnership and received $500,000 from Axim Collaborative to design 25 A.I. courses together. The five are Tri-C in Cleveland, which serves 42,000 students, Atlanta Metropolitan State, City Colleges of Chicago, Pikes Peak State in Colorado, and CUNY in New York. They're building courses in manufacturing, social sciences, and allied health. For context, some four-year universities have spent more than that on a single A.I. strategy consultant.

Here's why this connects to everything we've covered this week. Monday, Columbia's vice dean warned that universities were signing partnerships without examining the terms. Community colleges are building their own programs. Tuesday, Ithaca students questioned whether degrees still prepare them for an A.I. economy. Community colleges are designing credentials around specific workforce outcomes. Wednesday, the O.E.C.D. showed that A.I. tool design determines whether learning sticks. The California community college system gave faculty full control over A.I. tutor design.

<break time="0.5s" />

Community colleges educate nearly half of all undergraduates. Their students are disproportionately first-generation, working adults, and from communities that need A.I. fluency most. And they move faster than four-year institutions because they're built for responsiveness.

The big R1 universities get the headlines. But if you want to see where A.I. education is actually being built at scale, for the students who need it most, with programs tied to real economies, look at what's happening in Winston-Salem, Miami, Houston, Phoenix, and Cleveland.

<break time="1.0s" />

The dots today connect into one clear picture: the institutions closest to their communities are the ones moving fastest. That's not an accident. That's what responsiveness looks like.

Full stories and links at innovating higher ed dot com. See you tomorrow.`,

  '2026-02-20': `Welcome to The Innovation Pulse from innovating higher ed dot com. It's Friday, February 20th, 2026.

<break time="0.5s" />

This week we covered a Columbia vice dean sounding an alarm, students questioning whether degrees still matter, and an O.E.C.D. study that should worry every institution measuring success by output quality. And somehow, the answer to all of it came from the same unlikely place.

<break time="0.5s" />

A few final stories before we pull the week together.

<break time="1.0s" />

A Beyond Ed piece: Stanford and BetterUp researchers coined a term that names something you've probably already noticed. "Workslop." It's A.I.-generated work that looks polished but offloads cognitive effort onto the reader. Someone uses A.I. to write a 2,000-word email they could have said in 100 words. The reader's time becomes the cost. The term matters because it names the pattern without blaming the person. They may have good intentions. But if the document doesn't reflect proportional thinking, the quality is illusory.

<break time="0.5s" />

In Practical Tips, Washington State University won a Microsoft A.I. for Good grant to build the RAISE Roadmap for rural classrooms. Their finding: rural teachers have far less A.I. support than peers in urban and suburban districts. Their approach: start by listening. Workshops, interviews, observations. Then build. The "listen first, build second" model is deceptively simple and works in any context.

<break time="0.5s" />

And an Insights and Trends story: Huston-Tillotson University in Austin hosts its 2nd Annual H.B.C.U. A.I. Conference April 1st through 3rd. Machine learning, data science, robotics, ethical A.I., all centered on the premise that the future of A.I. should reflect everyone. Huston-Tillotson is roughly 1,100 students, located in a major tech hub. A second year signals sustained infrastructure, not trend-chasing.

<break time="1.0s" />

Now, the week.

I want to pull something together because the pattern this week was clearer than usual.

Monday, Columbia's vice dean for A.I. warned that universities signing partnerships with tech companies may be handing over something they can't get back. Students, research data, institutional knowledge, all flowing toward companies whose business model depends on becoming indispensable. It was a structural warning from inside a well-resourced R1 institution.

Tuesday, students at Ithaca College articulated the question on the other side of that equation. Not "is A.I. cheating?" but "does my degree still prepare me for a world where A.I. can do what I'm being trained to do?" It wasn't cynicism. It was observation.

<break time="0.5s" />

Wednesday, the O.E.C.D. put data behind both concerns. A.I. tools boost performance 48 percent, but students who used general-purpose tools scored 17 percent worse without them than peers who never used A.I. at all. The mirage of false mastery.

And then Thursday, the answer. Community colleges. Institutions that don't have Columbia's endowment or the luxury of a vice dean for A.I. But they do have something else: direct accountability to their communities and the agility to build programs around real workforce needs. Miami Dade, Maricopa, Houston CC, Forsyth Tech, the California system, and a five-college consortium spending $500K to build 25 courses together. While R1s debated strategy, community colleges shipped programs.

<break time="0.5s" />

The thread running through all of it: innovation doesn't require a massive endowment. It requires educators who see their students clearly, understand their communities, and have the courage to experiment. That showed up at Murray State, where a Spanish professor rebuilt homework around A.I. conversations using free tools. It showed up at Howard, where students are learning to build A.I., not just use it. It showed up at Washington State, where researchers started by listening to rural teachers before designing anything.

The future of A.I. in education won't be decided in boardrooms or at conferences with $2,000 registration fees. It'll be decided by individual educators in individual classrooms making choices one assignment at a time. This week's stories are proof of that.

<break time="1.0s" />

That's your week. All stories, sources, and links at innovating higher ed dot com. Have a good weekend, and we'll see you Monday.`
};

async function generateAudio(date, script) {
  const outputPath = path.join(OUTPUT_DIR, `innovation-pulse-${date}.mp3`);

  // Check if file already exists
  if (fs.existsSync(outputPath)) {
    console.log(`[${date}] Audio file already exists, skipping...`);
    return;
  }

  console.log(`[${date}] Generating audio (${script.length} characters)...`);

  const requestBody = JSON.stringify({
    text: script,
    model_id: 'eleven_multilingual_v2',
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.4,
      use_speaker_boost: true
    }
  });

  const options = {
    hostname: 'api.elevenlabs.io',
    port: 443,
    path: `/v1/text-to-speech/${NORMA_VOICE_ID}?output_format=mp3_44100_128`,
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': ELEVENLABS_API_KEY,
      'Content-Length': Buffer.byteLength(requestBody)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        let errorData = '';
        res.on('data', chunk => errorData += chunk);
        res.on('end', () => {
          reject(new Error(`ElevenLabs API error ${res.statusCode}: ${errorData}`));
        });
        return;
      }

      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        fs.writeFileSync(outputPath, buffer);
        console.log(`[${date}] Audio saved to ${outputPath} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);
        resolve();
      });
    });

    req.on('error', reject);
    req.setTimeout(180000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(requestBody);
    req.end();
  });
}

async function main() {
  console.log('Starting audio generation for Innovation Pulse week Feb 16-20...\n');

  const dates = Object.keys(SCRIPTS).sort();

  for (const date of dates) {
    try {
      await generateAudio(date, SCRIPTS[date]);
      // Small delay between requests to be nice to the API
      await new Promise(r => setTimeout(r, 2000));
    } catch (error) {
      console.error(`[${date}] Error:`, error.message);
    }
  }

  console.log('\nAudio generation complete!');
}

main();
