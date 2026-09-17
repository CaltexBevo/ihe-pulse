import { permanentRedirect } from 'next/navigation';

export default function ArchivePage() {
  permanentRedirect('/innovation-pulse/stories?tab=editions');
}
