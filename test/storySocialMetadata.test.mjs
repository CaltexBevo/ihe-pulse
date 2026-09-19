import assert from "node:assert/strict";
import test from "node:test";
import { pageMetadata } from "../lib/og.ts";

const base = { title: "Story title", description: "Story summary", path: "/innovation-pulse/story/example" };

test("local story artwork produces a large card with its exact canonical destination", () => {
  const metadata = pageMetadata({ ...base, type: "article", imagePath: "/images/stories/example.webp", imageAlt: base.title, twitterCard: "summary_large_image" });
  assert.equal(metadata.alternates?.canonical, "https://www.innovatinghighered.com/innovation-pulse/story/example");
  assert.equal(metadata.openGraph?.url, metadata.alternates?.canonical);
  assert.deepEqual(metadata.openGraph?.images, [{ url: "https://www.innovatinghighered.com/images/stories/example.webp", width: undefined, height: undefined, alt: base.title }]);
  assert.deepEqual(metadata.twitter, { card: "summary_large_image", title: base.title, description: base.description, images: ["https://www.innovatinghighered.com/images/stories/example.webp"] });
});

test("remote story artwork preserves its absolute URL and query parameters", () => {
  const imagePath = "https://images.unsplash.com/photo-example?w=1400&h=600&fit=crop";
  const metadata = pageMetadata({ ...base, imagePath });
  assert.deepEqual(metadata.twitter?.images, [imagePath]);
});

test("generic pages retain the brand image and existing card defaults", () => {
  const metadata = pageMetadata(base);
  assert.deepEqual(metadata.openGraph?.images, [{ url: "https://www.innovatinghighered.com/og-image.png", width: 1024, height: 1024, alt: "Innovating Higher Ed" }]);
  assert.equal(metadata.twitter.card, "summary");
});

test("explicit custom image dimensions remain intact", () => {
  const metadata = pageMetadata({ ...base, imagePath: "/custom.png", imageWidth: 1200, imageHeight: 630 });
  assert.deepEqual(metadata.openGraph?.images, [{ url: "https://www.innovatinghighered.com/custom.png", width: 1200, height: 630, alt: "Innovating Higher Ed" }]);
});
