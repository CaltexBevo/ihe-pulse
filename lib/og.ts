import type { Metadata } from "next";

const SITE_URL = "https://www.innovatinghighered.com";
const SITE_NAME = "Innovating Higher Ed";
const OG_IMAGE_URL = `${SITE_URL}/og-image.png`;

type PageMetadataOptions = {
  title: string;
  description: string;
  /** Route path starting with "/", e.g. "/podcast" or `/podcast/${slug}` */
  path: string;
  type?: "website" | "article";
  /** Optional page-specific social image path. */
  imagePath?: string;
  /** Optional accessible description for the social image. */
  imageAlt?: string;
  /** Optional Twitter card variant. */
  twitterCard?: "summary" | "summary_large_image";
  /** Optional dimensions for a page-specific social image. */
  imageWidth?: number;
  imageHeight?: number;
};

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
  imagePath,
  imageAlt,
  twitterCard = "summary",
  imageWidth = 1024,
  imageHeight = 1024,
}: PageMetadataOptions): Metadata {
  const url = `${SITE_URL}${path}`;
  const imageUrl = imagePath ? `${SITE_URL}${imagePath}` : OG_IMAGE_URL;
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
          url: imageUrl,
          width: imageWidth,
          height: imageHeight,
          alt: imageAlt ?? SITE_NAME,
        },
      ],
    },
    twitter: {
      card: twitterCard,
      title,
      description,
      images: [imageUrl],
    },
  };
}
