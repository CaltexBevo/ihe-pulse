import type { Metadata } from "next";

const SITE_URL = "https://www.innovatinghighered.com";
const SITE_NAME = "Innovating Higher Ed";
const OG_IMAGE_URL = `${SITE_URL}/og-image.png`;

/**
 * Builds complete per-page metadata so every route shares as itself
 * (own og:url + og:title) instead of the homepage.
 *
 * Next.js does NOT deep-merge `openGraph` across segments: any page that
 * defines `openGraph` drops the root layout's `images` unless re-specified.
 * That's why this helper always emits the full openGraph block, including
 * the brand og-image.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  /** Route path starting with "/", e.g. "/podcast" or `/podcast/${slug}` */
  path: string;
  type?: "website" | "article";
}): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type,
      images: [
        {
          url: OG_IMAGE_URL,
          width: 1024,
          height: 1024,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [OG_IMAGE_URL],
    },
  };
}
