import { pageMetadata } from "@/lib/og";

const contactEmail = "info@innovatinghighered.com";
const emailLinkClasses =
  "inline-flex min-h-11 items-center font-semibold text-[var(--cyan)] underline underline-offset-4";

export const metadata = pageMetadata({
  title: "Media & Advertising | Innovating Higher Ed",
  description:
    "Ask about Innovation Pulse sponsorship or contact Innovating Higher Ed for interviews and other press inquiries.",
  path: "/advertise",
});

export default function AdvertisePage() {
  return (
    <div className="mx-auto max-w-4xl px-[var(--px)] py-12 md:py-16">
      <h1 className="mb-3 text-[clamp(2rem,5vw,3rem)] font-bold leading-tight text-[var(--text)]">
        Media &amp; Advertising
      </h1>
      <p className="mb-8 max-w-xl text-base leading-relaxed text-[var(--text-secondary)]">
        Explore sponsoring Innovation Pulse or get in touch with the Innovating Higher Ed team for a press request.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="flex flex-col items-start rounded-[20px] border border-[var(--border)] bg-[var(--bg-card)] p-5 sm:p-7">
          <h2 className="mb-2 text-xl font-semibold text-[var(--text)]">Advertising &amp; sponsorship</h2>
          <p className="mb-4 flex-1 leading-relaxed text-[var(--text-secondary)]">
            Have a tool, service, or event to share with educators and campus teams? Ask about sponsoring Innovation Pulse, our weekly coverage of AI, teaching, and learning in higher education.
          </p>
          <p className="mb-3 leading-relaxed text-[var(--text-secondary)]">
            Tell us what your organization would like to promote and your preferred dates.
          </p>
          <a
            className={emailLinkClasses}
            href={`mailto:${contactEmail}?subject=Advertising%20and%20sponsorship%20inquiry`}
          >
            Ask about sponsorship
          </a>
        </section>

        <section className="flex flex-col items-start rounded-[20px] border border-[var(--border)] bg-[var(--bg-card)] p-5 sm:p-7">
          <h2 className="mb-2 text-xl font-semibold text-[var(--text)]">Media inquiries</h2>
          <p className="mb-4 flex-1 leading-relaxed text-[var(--text-secondary)]">
            For interviews, quotes, or other press requests, tell us your outlet, your topic, and your deadline.
          </p>
          <a
            className={emailLinkClasses}
            href={`mailto:${contactEmail}?subject=Media%20inquiry`}
          >
            Email a media inquiry
          </a>
        </section>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-[var(--text-secondary)]">
        You can also write to <span className="select-all [overflow-wrap:anywhere]">{contactEmail}</span> from your inbox.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
        Any paid placement will be clearly labeled. Innovating Higher Ed makes its own editorial decisions.
      </p>
    </div>
  );
}
