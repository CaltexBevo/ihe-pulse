import Link from 'next/link';

export const metadata = { title: 'Email preferences | Innovating Higher Ed', robots: { index: false, follow: false } };

export default function EmailPreferencesPage() {
  return <section className="section" style={{ maxWidth: '48rem', margin: '0 auto', padding: '4rem 1.5rem' }}>
    <h1>Email preferences</h1>
    <p>Already subscribed? Open an email from Innovating Higher Ed and choose “Update your preferences” in its footer. Mailchimp will email you a secure link to your profile.</p>
    <p>Choose Innovation Pulse, weekly grant alerts, or both. You can also change your name and grant criteria, or unsubscribe using the link in any email.</p>
    <p>New subscribers receive a confirmation email first. Confirm your email address to start receiving your selections. Check your spam folder if it has not arrived.</p>
    <p>Submitting the signup form again does not change an existing subscription. Your secure profile link protects your choices.</p>

    <details
      id="grant-filter-guide"
      className="mt-6 rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] p-4 sm:p-5"
    >
      <summary className="cursor-pointer font-semibold text-[var(--cyan)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cyan)]">
        Help updating grant filters
      </summary>
      <div className="mt-4 space-y-4 text-sm leading-6">
        <p>
          Your saved grant filters stay in place unless you edit them. Leave a filter blank to match any value.
          For fields that accept multiple choices, separate the values with commas.
        </p>

        <div className="space-y-2">
          <table className="w-full table-fixed border-collapse text-left">
            <caption className="mb-2 text-left font-semibold">Institution or applicant types</caption>
            <thead>
              <tr className="border-b border-[var(--border-strong)]">
                <th scope="col" className="w-[48%] px-2 py-2 font-semibold sm:px-3">Choice</th>
                <th scope="col" className="w-[52%] px-2 py-2 font-semibold sm:px-3">Saved value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[var(--border)]">
                <td className="px-2 py-2 sm:px-3">Community Colleges</td>
                <td className="break-all px-2 py-2 sm:px-3"><code className="break-all">community-colleges</code></td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="px-2 py-2 sm:px-3">Four-Year Colleges &amp; Universities</td>
                <td className="break-all px-2 py-2 sm:px-3"><code className="break-all">four-year-colleges-universities</code></td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="px-2 py-2 sm:px-3">Faculty &amp; Teaching Centers</td>
                <td className="break-all px-2 py-2 sm:px-3"><code className="break-all">faculty-teaching-centers</code></td>
              </tr>
              <tr>
                <td className="px-2 py-2 sm:px-3">Students / Graduate Researchers</td>
                <td className="break-all px-2 py-2 sm:px-3"><code className="break-all">students-graduate-researchers</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="space-y-2">
          <table className="w-full table-fixed border-collapse text-left">
            <caption className="mb-2 text-left font-semibold">Funding focus areas</caption>
            <thead>
              <tr className="border-b border-[var(--border-strong)]">
                <th scope="col" className="w-[48%] px-2 py-2 font-semibold sm:px-3">Choice</th>
                <th scope="col" className="w-[52%] px-2 py-2 font-semibold sm:px-3">Saved value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[var(--border)]">
                <td className="px-2 py-2 sm:px-3">AI &amp; Emerging Technology</td>
                <td className="break-all px-2 py-2 sm:px-3"><code className="break-all">ai-emerging-technology</code></td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="px-2 py-2 sm:px-3">Teaching &amp; Learning</td>
                <td className="break-all px-2 py-2 sm:px-3"><code className="break-all">teaching-learning</code></td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="px-2 py-2 sm:px-3">Student Success</td>
                <td className="break-all px-2 py-2 sm:px-3"><code className="break-all">student-success</code></td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="px-2 py-2 sm:px-3">Workforce/Pathways</td>
                <td className="break-all px-2 py-2 sm:px-3"><code className="break-all">workforce-pathways</code></td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="px-2 py-2 sm:px-3">Community College Innovation</td>
                <td className="break-all px-2 py-2 sm:px-3"><code className="break-all">community-college-innovation</code></td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="px-2 py-2 sm:px-3">Digital Transformation/Infrastructure</td>
                <td className="break-all px-2 py-2 sm:px-3"><code className="break-all">digital-transformation-infrastructure</code></td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="px-2 py-2 sm:px-3">Research/Evidence-Building</td>
                <td className="break-all px-2 py-2 sm:px-3"><code className="break-all">research-evidence-building</code></td>
              </tr>
              <tr>
                <td className="px-2 py-2 sm:px-3">Faculty Development</td>
                <td className="break-all px-2 py-2 sm:px-3"><code className="break-all">faculty-development</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          <strong>Location:</strong> Enter uppercase two-letter codes for a U.S. state, the District of Columbia,
          or a U.S. territory. Separate multiple locations with commas, for example <code>CA,GU</code>.
        </p>
        <p>
          <strong>Minimum award:</strong> Enter a positive whole-dollar USD amount using digits only, without a
          dollar sign or commas. Leave it blank to match any amount.
        </p>
      </div>
    </details>

    <p><Link href="/">Return to Innovating Higher Ed</Link></p>
  </section>;
}
