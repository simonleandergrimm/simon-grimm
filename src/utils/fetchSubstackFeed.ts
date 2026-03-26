export interface BlogPost {
  title: string;
  url: string;
  date: string;
  excerpt: string;
  image?: string;
}

interface SubstackPost {
  title: string;
  subtitle: string;
  canonical_url: string;
  post_date: string;
  cover_image: string | null;
  slug: string;
}

export async function fetchSubstackFeed(): Promise<BlogPost[]> {
  try {
    const response = await fetch(
      'https://simongrimm.substack.com/api/v1/posts?limit=50',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SimonGrimmSite/1.0; +https://simongrimm.com)',
          'Accept': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Status code ${response.status}`);
    }

    const posts: SubstackPost[] = await response.json();

    return posts.map((post) => ({
      title: post.title,
      url: post.canonical_url,
      date: post.post_date,
      excerpt: post.subtitle || '',
      image: post.cover_image || undefined,
    }));
  } catch (error) {
    console.error('Failed to fetch Substack feed:', error);
    return [];
  }
}
