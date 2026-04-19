#!/usr/bin/env node
// Syncs the Substack feed into public/substack-posts.json and downloads any
// missing cover images as WebP into public/img/substack/<slug>.webp so the
// site can self-host them.

import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const IMG_DIR = join(ROOT, 'public', 'img', 'substack');
const JSON_PATH = join(ROOT, 'public', 'substack-posts.json');
const FEED_URL = 'https://simongrimm.substack.com/api/v1/posts?limit=50';

const FORCE_REFRESH = process.argv.includes('--refresh') || process.argv.includes('--force');

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function slugFromUrl(url) {
  return url.split('/p/').pop().replace(/\/$/, '');
}

// Substack serves images either as raw S3 URLs or as substackcdn.com/image/fetch/<transforms>/<encoded-original>.
// Strip any existing transform wrapper so we can apply our own w_720 resize.
function unwrapCdn(url) {
  const prefix = 'https://substackcdn.com/image/fetch/';
  if (!url.startsWith(prefix)) return url;
  const afterPrefix = url.slice(prefix.length);
  const slash = afterPrefix.indexOf('/');
  if (slash === -1) return url;
  try {
    return decodeURIComponent(afterPrefix.slice(slash + 1));
  } catch {
    return url;
  }
}

function cdnResizeUrl(url, width = 720) {
  const original = unwrapCdn(url);
  // f_webp forces WebP output (f_auto sometimes keeps PNG for illustrations, which balloons size).
  // q_auto:eco compresses harder than q_auto:good with minimal visible loss at ~720px.
  return `https://substackcdn.com/image/fetch/w_${width},c_limit,f_webp,q_auto:eco,fl_progressive:steep/${encodeURIComponent(original)}`;
}

async function downloadImage(remoteUrl, localPath) {
  const res = await fetch(remoteUrl, {
    headers: {
      'Accept': 'image/webp,image/*',
      'User-Agent': 'Mozilla/5.0 (compatible; SimonGrimmSite/1.0; +https://simongrimm.com)',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${remoteUrl}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(localPath, buf);
  return buf.length;
}

async function loadExisting() {
  if (!(await fileExists(JSON_PATH))) return [];
  try {
    return JSON.parse(await readFile(JSON_PATH, 'utf8'));
  } catch {
    return [];
  }
}

async function main() {
  await mkdir(IMG_DIR, { recursive: true });
  const existing = await loadExisting();
  const existingBySlug = new Map(
    existing.map((p) => [p.slug ?? slugFromUrl(p.canonical_url), p]),
  );

  console.log(`Fetching feed: ${FEED_URL}`);
  const res = await fetch(FEED_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; SimonGrimmSite/1.0; +https://simongrimm.com)',
      'Accept': 'application/json',
    },
  });
  if (!res.ok) {
    console.error(`Feed fetch failed: HTTP ${res.status}`);
    process.exit(1);
  }
  const posts = await res.json();
  console.log(`Feed returned ${posts.length} post(s).\n`);

  let newCount = 0;
  let downloadedCount = 0;
  const out = [];

  for (const post of posts) {
    const slug = post.slug ?? slugFromUrl(post.canonical_url);
    const prior = existingBySlug.get(slug);
    const isNew = !prior;
    if (isNew) newCount++;

    let localImage = prior?.local_image ?? null;

    if (post.cover_image) {
      const fname = `${slug}.webp`;
      const localPath = join(IMG_DIR, fname);
      const publicPath = `/img/substack/${fname}`;
      const needsDownload = FORCE_REFRESH || !(await fileExists(localPath));
      if (needsDownload) {
        try {
          const bytes = await downloadImage(cdnResizeUrl(post.cover_image, 720), localPath);
          console.log(`  ↓ ${fname} (${(bytes / 1024).toFixed(1)} KB)`);
          downloadedCount++;
        } catch (e) {
          console.warn(`  ! failed ${fname}: ${e.message}`);
        }
      }
      localImage = (await fileExists(localPath)) ? publicPath : null;
    } else {
      localImage = null;
    }

    out.push({
      title: post.title,
      subtitle: post.subtitle ?? '',
      canonical_url: post.canonical_url,
      post_date: post.post_date,
      slug,
      cover_image: post.cover_image ?? null,
      local_image: localImage,
    });
  }

  out.sort((a, b) => new Date(b.post_date).getTime() - new Date(a.post_date).getTime());

  await writeFile(JSON_PATH, JSON.stringify(out, null, 2) + '\n');

  console.log(`\nSummary:`);
  console.log(`  Posts in feed:    ${out.length}`);
  console.log(`  New posts:        ${newCount}`);
  console.log(`  Images downloaded: ${downloadedCount}`);
  console.log(`  JSON written:     ${JSON_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
