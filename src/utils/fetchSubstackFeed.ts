import Parser from 'rss-parser';

export interface BlogPost {
  title: string;
  url: string;
  date: string;
  excerpt: string;
  image?: string;
}

function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&#8212;': '\u2014',  // em dash
    '&#8211;': '\u2013',  // en dash
    '&#8217;': '\u2019',  // right single quote
    '&#8216;': '\u2018',  // left single quote
    '&#8220;': '\u201C',  // left double quote
    '&#8221;': '\u201D',  // right double quote
    '&#8230;': '\u2026',  // ellipsis
    '&nbsp;': ' ',
  };
  // Named/numeric entities
  let result = text.replace(/&#?\w+;/g, (match) => entities[match] ?? match);
  // Numeric decimal entities not in the map
  result = result.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
  return result;
}

export async function fetchSubstackFeed(): Promise<BlogPost[]> {
  const parser = new Parser();

  try {
    // Use fetch instead of rss-parser's built-in HTTP client to avoid
    // Substack's bot detection blocking Node.js http requests from CI
    const response = await fetch('https://simongrimm.substack.com/feed', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SimonGrimmSite/1.0; +https://simongrimm.com)',
        'Accept': 'application/rss+xml, application/xml, text/xml',
      },
    });

    if (!response.ok) {
      throw new Error(`Status code ${response.status}`);
    }

    const xml = await response.text();
    const feed = await parser.parseString(xml);

    return (feed.items || []).map((item) => {
      const content = item['content:encoded'] || '';

      // Prefer the enclosure URL (Substack's cover/header image),
      // fall back to the first <img> in the post content
      const enclosureUrl = (item.enclosure as { url?: string })?.url;
      const imgMatch = content.match(/<img[^>]+src="([^"]+)"/);
      const image = enclosureUrl || imgMatch?.[1];

      // Use Substack's subtitle (description/contentSnippet) as the excerpt
      const excerpt = decodeHtmlEntities(item.contentSnippet || item.content || '');

      return {
        title: decodeHtmlEntities(item.title || 'Untitled'),
        url: item.link || '#',
        date: item.pubDate || item.isoDate || new Date().toISOString(),
        excerpt,
        image,
      };
    });
  } catch (error) {
    console.error('Failed to fetch Substack feed:', error);
    return [];
  }
}
