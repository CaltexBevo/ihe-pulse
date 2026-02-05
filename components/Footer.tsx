import Link from 'next/link';
import { Twitter, Linkedin, Youtube, Mail } from 'lucide-react';

const footerLinks = {
  Platform: [
    { href: '/daily-pulse', label: 'Daily Pulse' },
    { href: '/prompts', label: 'Prompts' },
    { href: '/ai-directory', label: 'AI Directory' },
    { href: '/educator-tools', label: 'Educator Tools' },
  ],
  Community: [
    { href: '/podcast', label: 'Podcast' },
    { href: '/tinker-lab', label: 'Tinker Lab' },
    { href: '/be-our-guest', label: 'Be Our Guest' },
    { href: '/about', label: 'About' },
  ],
};

const socialLinks = [
  { href: 'https://twitter.com/innovaborsted', icon: Twitter, label: 'Twitter' },
  { href: 'https://linkedin.com/in/normajones', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://youtube.com/@innovatinghighered', icon: Youtube, label: 'YouTube' },
  { href: 'mailto:hello@innovatinghighered.com', icon: Mail, label: 'Email' },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-darker/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-1">
              <span className="text-xl font-bold text-white tracking-wider">
                IHE
              </span>
              <span className="text-xl font-bold gradient-text tracking-wider">
                PULSE
              </span>
            </Link>
            <p className="mt-3 text-sm text-gray-500 max-w-sm">
              AI-powered intelligence for higher education. Empowering educators
              to navigate the future of teaching and learning.
            </p>

            {/* Newsletter signup */}
            <div className="mt-5">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Get the Daily Pulse
              </h4>
              <form action="#" className="mt-2 flex items-center gap-2 max-w-sm">
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.edu"
                  required
                  className="flex-1 min-w-0 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pulse/50 focus:ring-1 focus:ring-pulse/50 transition-colors"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-lg bg-gradient-to-r from-pulse to-synapse px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  Subscribe
                </button>
              </form>
              <p className="mt-2 text-xs text-gray-600">
                No spam. Unsubscribe anytime.
              </p>
            </div>

            <div className="mt-4 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg text-gray-500 hover:text-pulse hover:bg-white/5 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {title}
              </h3>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-pulse transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Innovating Higher Ed. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Built with <span className="gradient-text">intelligence</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
