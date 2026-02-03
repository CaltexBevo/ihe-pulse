'use client';

import { useState, type FormEvent } from 'react';
import { Send, Mic, Mail, User, FileText, MessageSquare, CheckCircle } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

export default function BeOurGuestPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PageTransition>
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Mic size={18} className="text-pulse" />
              <p className="text-sm font-mono text-pulse uppercase tracking-widest">
                Be Our Guest
              </p>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Share Your <span className="gradient-text">Voice</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed mb-8">
              Have a story to tell about AI in higher education? We&apos;re
              looking for educators, administrators, researchers, and students
              to share their experiences on the IHE Pulse podcast.
            </p>

            <div className="space-y-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  What We&apos;re Looking For
                </h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-pulse shrink-0" />
                    Faculty using AI in innovative ways
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-pulse shrink-0" />
                    Administrators navigating AI policy
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-pulse shrink-0" />
                    Researchers studying AI in education
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-pulse shrink-0" />
                    Students with perspectives on AI in learning
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-pulse shrink-0" />
                    Ed-tech builders creating tools for higher ed
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Contact
                </h3>
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <Mail size={14} className="text-pulse" />
                  podcast@innovatinghighered.com
                </p>
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div>
            {submitted ? (
              <div className="glass rounded-2xl p-8 sm:p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={32} className="text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">
                  Application Received!
                </h2>
                <p className="text-gray-400">
                  Thank you for your interest in being a guest on IHE Pulse.
                  We&apos;ll review your application and get back to you within
                  5 business days.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="glass rounded-2xl p-6 sm:p-8 space-y-5"
              >
                <h2 className="text-xl font-bold text-white mb-2">
                  Guest Application
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Fill out the form below and we&apos;ll be in touch.
                </p>

                {/* Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <User size={14} className="text-pulse" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Dr. Jane Smith"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-pulse/50 focus:ring-1 focus:ring-pulse/30 transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <Mail size={14} className="text-pulse" />
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jane.smith@university.edu"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-pulse/50 focus:ring-1 focus:ring-pulse/30 transition-colors"
                  />
                </div>

                {/* Topic */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <MessageSquare size={14} className="text-pulse" />
                    Proposed Topic
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="What would you like to discuss?"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-pulse/50 focus:ring-1 focus:ring-pulse/30 transition-colors"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <FileText size={14} className="text-pulse" />
                    Short Bio
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about yourself, your role, and your experience with AI in education..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-pulse/50 focus:ring-1 focus:ring-pulse/30 transition-colors resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pulse to-synapse text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  <Send size={16} />
                  Submit Application
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
}
