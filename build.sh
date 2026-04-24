#!/bin/sh
# Build app.js from src/app.jsx, then inject both encrypted blobs.
# Reads passwords from workbench/pass.txt (gitignored, two lines: wedding=..., gift=...).
# Run before committing.
#
# Usage: ./build.sh

set -e

cd "$(dirname "$0")"

PASS_FILE="workbench/pass.txt"
if [ ! -f "$PASS_FILE" ]; then
  echo "missing $PASS_FILE"
  echo "expected format:"
  echo "  wedding=<ddmmyyyy>"
  echo "  gift=<ddmmyyyy>"
  exit 1
fi

WEDDING_PW=$(grep '^wedding=' "$PASS_FILE" | cut -d= -f2-)
GIFT_PW=$(grep '^gift=' "$PASS_FILE" | cut -d= -f2-)

if [ -z "$WEDDING_PW" ] || [ -z "$GIFT_PW" ]; then
  echo "$PASS_FILE missing 'wedding=' or 'gift=' line"
  exit 1
fi

echo "▸ build"
bun build src/app.jsx --outfile=app.js --jsx-runtime=classic --external react --external react-dom

echo "▸ encrypt msg"
node tools/encrypt-msg.mjs "$WEDDING_PW"

echo "▸ encrypt qr"
node tools/encrypt-qr.mjs "$GIFT_PW"

echo
echo "✓ ready. review git diff, then commit + push."
