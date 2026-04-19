#!/usr/bin/env bash
# Pulls the latest Substack posts + cover images, rebuilds the site,
# and (optionally) commits + pushes so the deploy kicks off.

set -euo pipefail
cd "$(dirname "$0")"

# Astro needs Node >= 18.20.8; the Homebrew node is newer than the default.
export PATH="/opt/homebrew/bin:$PATH"

echo "→ Syncing Substack feed and images"
node scripts/sync-substack-posts.mjs "$@"

echo
if git diff --quiet -- public/; then
  echo "No content changes. Skipping commit."
  exit 0
fi

echo "→ Changes:"
git -c color.status=always status --short public/
echo

read -r -p "Commit and push? [Y/n] " reply
reply="${reply:-Y}"
if [[ ! "$reply" =~ ^[Yy]$ ]]; then
  echo "Skipped. Run 'git status' to review changes."
  exit 0
fi

git add public/
git commit -m "Sync Substack posts and cover images"
git push
echo
echo "✓ Pushed. Deploy should be running."
