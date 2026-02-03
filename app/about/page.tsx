import type { Metadata } from 'next';
import PageTransition from '@/components/PageTransition';
import {
  GraduationCap,
  Award,
  BookOpen,
  Mic,
  Users,
  Heart,
  Lightbulb,
  Target,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Dr. Norma Jones | IHE PULSE',
  description:
    'Meet Dr. Norma Jones, educator and researcher driving AI innovation in higher education. Learn about the mission and values behind IHE PULSE.',
};

const credentials = [
  { icon: GraduationCap, text: 'Ed.D. in Instructional Technology' },
  { icon: Award, text: '15+ years in higher education' },
  { icon: BookOpen, text: 'Published researcher in AI pedagogy' },
  { icon: Mic, text: 'Keynote speaker at 50+ conferences' },
  { icon: Users, text: 'Faculty development leader' },
  { icon: Heart, text: 'Passionate advocate for equitable AI' },
];

const values = [
  {
    icon: Lightbulb,
    title: 'Innovation With Purpose',
    description:
      'Technology should serve teaching and learning, not replace the human connections that make education transformative.',
  },
  {
    icon: Target,
    title: 'Practical Over Theoretical',
    description:
      'Every resource on this platform is designed to be used Monday morning. We bridge the gap between AI possibility and classroom reality.',
  },
  {
    icon: Users,
    title: 'Community-Driven',
    description:
      'The best ideas come from educators sharing what works. IHE Pulse is built by and for the higher ed community.',
  },
  {
    icon: Heart,
    title: 'Equity at the Center',
    description:
      'AI has the potential to widen or narrow gaps in education. We are committed to ensuring it serves all students.',
  },
];

export default function AboutPage() {
  return (
    <PageTransition>
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Hero */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <p className="text-sm font-mono text-pulse uppercase tracking-widest mb-4">
              About
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Meet{' '}
              <span className="gradient-text">Dr. Norma Jones</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed mb-6">
              Educator, researcher, and the driving force behind Innovating
              Higher Ed. Dr. Jones has spent over 15 years at the intersection
              of technology and teaching, helping institutions navigate digital
              transformation — and now, the AI revolution.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Through the IHE Pulse platform, she curates the tools, prompts,
              and insights that faculty actually need — cutting through the hype
              to deliver practical, human-centered approaches to AI in
              education.
            </p>
          </div>

          {/* Photo placeholder */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-2xl bg-gradient-to-br from-pulse/20 to-synapse/20 border border-white/10 flex flex-col items-center justify-center">
                <GraduationCap size={64} className="text-pulse/40 mb-4" />
                <span className="text-sm text-gray-500 font-mono">
                  Dr. Norma Jones
                </span>
              </div>
              {/* Decorative glow */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-pulse/5 to-synapse/5 blur-2xl -z-10" />
            </div>
          </div>
        </div>

        {/* Credentials */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Background & <span className="gradient-text">Expertise</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {credentials.map((cred, i) => (
              <div
                key={i}
                className="glass rounded-xl px-5 py-4 flex items-center gap-3"
              >
                <cred.icon size={20} className="text-pulse shrink-0" />
                <span className="text-sm text-gray-300">{cred.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mission */}
        <div className="mb-20">
          <div className="glass rounded-2xl p-8 sm:p-12 text-center max-w-4xl mx-auto">
            <p className="text-xs font-mono text-synapse uppercase tracking-widest mb-4">
              Our Mission
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 leading-snug">
              &ldquo;To empower every educator with the AI knowledge, tools, and
              community they need to transform teaching and learning — with
              equity, integrity, and humanity at the center.&rdquo;
            </h2>
            <p className="text-gray-500">— Dr. Norma Jones, Founder</p>
          </div>
        </div>

        {/* Values */}
        <div>
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            What We <span className="gradient-text">Stand For</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {values.map((value, i) => (
              <div key={i} className="glass rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pulse/10 to-synapse/10 flex items-center justify-center mb-4">
                  <value.icon size={20} className="text-pulse" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
}
