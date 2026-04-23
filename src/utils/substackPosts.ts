import rawPosts from '../../public/substack-posts.json';

interface RawSubstackPost {
  title: string;
  subtitle: string;
  canonical_url: string;
  post_date: string;
  slug?: string;
  cover_image: string | null;
  local_image?: string | null;
}

export interface SubstackPost {
  title: string;
  url: string;
  date: string;
  excerpt: string;
  image?: string;
}

function optimizeCoverImage(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  return `https://substackcdn.com/image/fetch/w_720,c_limit,f_auto,q_auto:good,fl_progressive:steep/${encodeURIComponent(url)}`;
}

function pickImage(post: RawSubstackPost): string | undefined {
  if (post.local_image) return post.local_image;
  return optimizeCoverImage(post.cover_image);
}

const HIDDEN_SLUGS = new Set<string>(['germanys-slow-move-toward-supply']);

export const substackPosts: SubstackPost[] = (rawPosts as RawSubstackPost[])
  .filter((post) => !(post.slug && HIDDEN_SLUGS.has(post.slug)))
  .map((post) => ({
    title: post.title,
    url: post.canonical_url,
    date: post.post_date,
    excerpt: post.subtitle ?? '',
    image: pickImage(post),
  }));
