import assert from "node:assert/strict";
import test from "node:test";
import { pageMetadata } from "../lib/og.ts";
import fs from "node:fs";
import { STORY_SOCIAL_IMAGES } from "../lib/story-social-images.ts";

const base = { title: "Story title", description: "Story summary", path: "/innovation-pulse/story/example" };

test("NASA/IBM social card uses measured wide artwork and preserves the article image", () => {
  const slug = "nasa-and-ibm-turn-moon-data-into-open-ai-research-infrastruc";
  const card = STORY_SOCIAL_IMAGES[slug];
  const bytes = fs.readFileSync(`public${card.imagePath}`);
  assert.equal(bytes.subarray(1, 4).toString(), "PNG");
  assert.equal(bytes.readUInt32BE(16), card.imageWidth);
  assert.equal(bytes.readUInt32BE(20), card.imageHeight);
  const metadata = pageMetadata({ ...base, path: `/innovation-pulse/story/${slug}`, ...card, twitterCard: "summary_large_image" });
  assert.deepEqual(metadata.twitter.images, ["https://www.innovatinghighered.com/images/stories/social/nasa-ibm-moon-data-card.png"]);
  const episode = JSON.parse(fs.readFileSync("data/daily-pulse/2026-09-11.json", "utf8"));
  const story = episode.quickHits.find(story => story.headline.startsWith("NASA and IBM"));
  assert.equal(story.image, "/images/stories/nasa-and-ibm-turn-moon-data-into-open-ai-research-infrastruc.webp");
  assert.notEqual(story.image, card.imagePath);
});

test("MIT social card uses measured wide artwork and preserves the article image", () => {
  const slug = "mit-builds-ai-teaching-around-a-shared-core-and-discipline-s";
  const card = STORY_SOCIAL_IMAGES[slug];
  const bytes = fs.readFileSync(`public${card.imagePath}`);
  assert.equal(bytes.subarray(1, 4).toString(), "PNG");
  assert.equal(bytes.readUInt32BE(16), card.imageWidth);
  assert.equal(bytes.readUInt32BE(20), card.imageHeight);
  const metadata = pageMetadata({ ...base, path: `/innovation-pulse/story/${slug}`, ...card, twitterCard: "summary_large_image" });
  assert.deepEqual(metadata.twitter.images, ["https://www.innovatinghighered.com/images/stories/social/mit-shared-core-card.png"]);
  const episode = JSON.parse(fs.readFileSync("data/daily-pulse/2026-09-11.json", "utf8"));
  const story = episode.quickHits.find(story => story.headline.startsWith("MIT Builds"));
  assert.equal(story.image, "/images/stories/mit-builds-ai-teaching-around-a-shared-core-and-discipline-s.webp");
  assert.notEqual(story.image, card.imagePath);
});

test("Dartmouth social card uses measured wide artwork and preserves the article image", () => {
  const slug = "dartmouth-pairs-permission-to-use-ai-with-work-others-can-ch";
  const card = STORY_SOCIAL_IMAGES[slug];
  const bytes = fs.readFileSync(`public${card.imagePath}`);
  assert.equal(bytes.subarray(1, 4).toString(), "PNG");
  assert.equal(bytes.readUInt32BE(16), card.imageWidth);
  assert.equal(bytes.readUInt32BE(20), card.imageHeight);
  const metadata = pageMetadata({ ...base, path: `/innovation-pulse/story/${slug}`, ...card, twitterCard: "summary_large_image" });
  assert.deepEqual(metadata.twitter.images, ["https://www.innovatinghighered.com/images/stories/social/dartmouth-real-clients-card.png"]);
  const episode = JSON.parse(fs.readFileSync("data/daily-pulse/2026-09-11.json", "utf8"));
  const story = episode.quickHits.find(story => story.headline.startsWith("Dartmouth"));
  assert.equal(story.image, "/images/stories/dartmouth-pairs-permission-to-use-ai-with-work-others-can-ch.webp");
  assert.notEqual(story.image, card.imagePath);
});

test("ACC social card uses measured wide artwork and preserves the article image", () => {
  const slug = "austin-community-college-wants-student-alerts-to-lead-somewh";
  const card = STORY_SOCIAL_IMAGES[slug];
  const bytes = fs.readFileSync(`public${card.imagePath}`);
  assert.equal(bytes.subarray(1, 4).toString(), "PNG");
  assert.equal(bytes.readUInt32BE(16), card.imageWidth);
  assert.equal(bytes.readUInt32BE(20), card.imageHeight);
  const metadata = pageMetadata({ ...base, path: `/innovation-pulse/story/${slug}`, ...card, twitterCard: "summary_large_image" });
  assert.deepEqual(metadata.twitter.images, ["https://www.innovatinghighered.com/images/stories/social/acc-alert-support-card.png"]);
  const episode = JSON.parse(fs.readFileSync("data/daily-pulse/2026-09-11.json", "utf8"));
  const story = episode.quickHits.find(story => story.headline.startsWith("Austin Community College"));
  assert.equal(story.image, "/images/stories/austin-community-college-wants-student-alerts-to-lead-somewh.webp");
  assert.notEqual(story.image, card.imagePath);
});

test("USD social card uses measured wide artwork and preserves the article image", () => {
  const slug = "a-five-level-ai-scale-starts-with-the-assignments-purpose";
  const card = STORY_SOCIAL_IMAGES[slug];
  const bytes = fs.readFileSync(`public${card.imagePath}`);
  assert.equal(bytes.subarray(1, 4).toString(), "PNG");
  assert.equal(bytes.readUInt32BE(16), card.imageWidth);
  assert.equal(bytes.readUInt32BE(20), card.imageHeight);
  const metadata = pageMetadata({ ...base, path: `/innovation-pulse/story/${slug}`, ...card, twitterCard: "summary_large_image" });
  assert.deepEqual(metadata.twitter.images, ["https://www.innovatinghighered.com/images/stories/social/usd-purpose-first-card-v2.png"]);
  const episode = JSON.parse(fs.readFileSync("data/daily-pulse/2026-09-11.json", "utf8"));
  const story = episode.quickHits.find(story => story.headline.startsWith("A Five-Level AI Scale"));
  assert.equal(story.image, "/images/stories/a-five-level-ai-scale-starts-with-the-assignment-s-purpose.webp");
  assert.notEqual(story.image, card.imagePath);
});

test("Texas A&M card override uses measured artwork without changing its story hero", () => {
  const card = STORY_SOCIAL_IMAGES["texas-am-finds-the-instructional-design-behind-better-ai-rol"];
  const bytes = fs.readFileSync(`public${card.imagePath}`);
  assert.equal(bytes.subarray(1, 4).toString(), "PNG");
  assert.equal(bytes.readUInt32BE(16), card.imageWidth);
  assert.equal(bytes.readUInt32BE(20), card.imageHeight);
  const episode = JSON.parse(fs.readFileSync("data/daily-pulse/2026-09-11.json", "utf8"));
  const story = episode.quickHits.find(story => story.headline.startsWith("Texas A&M"));
  assert.equal(story.image, "/images/stories/texas-a-m-finds-the-instructional-design-behind-better-ai-ro.webp");
  assert.notEqual(story.image, card.imagePath);
  const source = fs.readFileSync("app/innovation-pulse/story/[slug]/page.tsx", "utf8");
  assert.match(source, /const storyImage = story.heroImage \|\| story.image \|\| DEFAULT_STORY_IMAGE/);
  assert.equal(source.match(/\.\.\.STORY_SOCIAL_IMAGES\[slug\]/g)?.length, 1);
});

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
