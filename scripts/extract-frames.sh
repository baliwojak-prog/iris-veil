#!/usr/bin/env bash
# extract-frames.sh
# Convert a Kling 3.0 / Nano Banana .mp4 into a scroll-tied JPEG sequence.
#
# Usage:
#   scripts/extract-frames.sh path/to/source.mp4 [fps] [width]
#
# Defaults: 24 fps, 1600px wide.
# Output: public/sequence/frame_0001.jpg ... frame_NNNN.jpg
#
# Requires: ffmpeg (brew install ffmpeg).

set -euo pipefail

INPUT="${1:?usage: extract-frames.sh path/to/video.mp4 [fps] [width]}"
FPS="${2:-24}"
WIDTH="${3:-1600}"
OUT_DIR="public/sequence"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "error: ffmpeg not found. install with: brew install ffmpeg" >&2
  exit 1
fi

if [ ! -f "$INPUT" ]; then
  echo "error: input file not found: $INPUT" >&2
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$ROOT/$OUT_DIR"
rm -f "$ROOT/$OUT_DIR"/frame_*.jpg

echo "→ extracting frames at ${FPS}fps, ${WIDTH}px wide"
ffmpeg -y -i "$INPUT" \
  -vf "fps=${FPS},scale=${WIDTH}:-2:flags=lanczos" \
  -q:v 4 \
  "$ROOT/$OUT_DIR/frame_%04d.jpg" \
  -hide_banner -loglevel error

COUNT=$(find "$ROOT/$OUT_DIR" -name "frame_*.jpg" | wc -l | tr -d ' ')
echo "→ wrote ${COUNT} frames to ${OUT_DIR}/"

# write a manifest the React component will read (counts only)
cat > "$ROOT/$OUT_DIR/manifest.json" <<EOF
{
  "frameCount": ${COUNT},
  "fps": ${FPS},
  "width": ${WIDTH},
  "pattern": "/sequence/frame_{n:04d}.jpg",
  "source": "$(basename "$INPUT")"
}
EOF

echo "→ manifest.json written. drop ScrollSequence into App.tsx and reload."
