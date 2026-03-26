import { writeFileSync } from 'fs';

const OUT = 'public/substack-posts.json';

const URLS = [
  'https://simongrimm.substack.com/api/v1/posts?limit=50',
];

const USER_AGENTS = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
];

async function tryFetch(url, ua) {
  const res = await fetch(url, {
    headers: { 'User-Agent': ua, 'Accept': 'application/json' },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`${res.status} from ${url} with UA: ${ua.slice(0, 30)}`);
  return res.json();
}

async function main() {
  // Try the JSON API with different user agents
  for (const ua of USER_AGENTS) {
    try {
      const posts = await tryFetch(URLS[0], ua);
      console.log(`Fetched ${posts.length} posts from API (UA: ${ua.slice(0, 30)}...)`);
      writeFileSync(OUT, JSON.stringify(posts));
      return;
    } catch (e) {
      console.log(`API attempt failed: ${e.message}`);
    }
  }

  // Try RSS feed as fallback and convert to JSON
  try {
    console.log('Trying RSS feed...');
    const res = await fetch('https://simongrimm.substack.com/feed', {
      headers: {
        'User-Agent': USER_AGENTS[0],
        'Accept': 'application/rss+xml, text/xml',
      },
    });
    if (!res.ok) throw new Error(`RSS returned ${res.status}`);
    const xml = await res.text();

    // Simple XML parsing for RSS items
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => {
      const get = (tag) => {
        const match = m[1].match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>|<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
        return match ? (match[1] || match[2] || '').trim() : '';
      };
      const enclosure = m[1].match(/<enclosure[^>]+url="([^"]+)"/);
      return {
        title: get('title'),
        canonical_url: get('link'),
        post_date: get('pubDate'),
        subtitle: get('description'),
        cover_image: enclosure ? enclosure[1] : null,
      };
    });

    console.log(`Parsed ${items.length} posts from RSS`);
    writeFileSync(OUT, JSON.stringify(items));
    return;
  } catch (e) {
    console.log(`RSS attempt failed: ${e.message}`);
  }

  console.log('All attempts failed, writing empty array');
  writeFileSync(OUT, '[]');
}

main();
