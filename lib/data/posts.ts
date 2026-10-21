export interface Post {
  title: string;
  excerpt: string;
  fullDescription: string;
  takeaways: string[];
  authorBio: string;
  topics: string[];
  tag: string;
  date: string;
  readTime: string;
  featured: boolean;
  slug: string;
  podbeanId: string;
  thumbnail?: string;
}

export const postTags = [
  'All',
  'Experiment',
  'Walkthrough',
  'Comparison',
  'Challenge',
  'Opinion',
] as const;

export type PostTag = (typeof postTags)[number];

export const posts: Post[] = [];
