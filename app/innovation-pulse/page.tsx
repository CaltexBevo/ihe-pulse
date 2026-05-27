import { redirect } from 'next/navigation';

// ISR: Revalidate every 60 seconds so new episodes appear quickly
export const revalidate = 60;

export const metadata = {
  title: "Innovation Pulse | Innovating Higher Ed",
  description:
    "Daily AI intelligence for higher education. Stay informed on the latest developments in AI, policy, and innovation affecting colleges and universities.",
};

export default function InnovationPulsePage() {
  redirect('/');
}
