#!/usr/bin/env node
// Compress every image in workbench/../pics/ in place.
// Uses ffmpeg only — no fallbacks. Strips EXIF.
//
// Idempotent: tracks fingerprint (size+mtime) of already-compressed files in
// pics/.compressed.json so re-running skips files that haven't changed since
// last compression.
//
// Usage:
//   node tools/compress-pics.mjs

import { readdir, stat, rename, readFile, writeFile, unlink } from "node:fs/promises";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { ROOT } from "./_lib.mjs";

const PICS_DIR  = join(ROOT, "pics");
const MARKER    = join(PICS_DIR, ".compressed.json");
const MAX_EDGE  = 800;           // photos render ≤180px on screen; 800 = 2x retina + headroom
const JPEG_Q    = 4;             // ffmpeg -q:v scale, lower = better quality. 4 ≈ q78
const EXTS      = new Set([".jpg", ".jpeg", ".png", ".webp"]);

let files;
try {
  files = await readdir(PICS_DIR);
} catch (e) {
  console.error(`could not read ${PICS_DIR}: ${e.message}`);
  process.exit(1);
}

const targets = files.filter((f) => {
  const lower = f.toLowerCase();
  return [...EXTS].some((e) => lower.endsWith(e));
});

if (targets.length === 0) {
  console.error(`no images found in ${PICS_DIR}`);
  process.exit(1);
}

let marker = {};
try { marker = JSON.parse(await readFile(MARKER, "utf8")); } catch {}

let compressed = 0;
let skipped = 0;

for (const name of targets) {
  const src = join(PICS_DIR, name);
  const st  = await stat(src);
  const fp  = `${st.size}-${st.mtimeMs}`;
  if (marker[name] === fp) {
    skipped += 1;
    continue;
  }

  const tmp = join(PICS_DIR, `.tmp-${name}.jpg`);
  const args = [
    "-y", "-loglevel", "error",
    "-i", src,
    "-vf", `scale='if(gt(iw,ih),min(${MAX_EDGE},iw),-2)':'if(gt(iw,ih),-2,min(${MAX_EDGE},ih))'`,
    "-q:v", String(JPEG_Q),
    "-map_metadata", "-1",
    tmp,
  ];
  const res = spawnSync("ffmpeg", args, { stdio: "inherit" });
  if (res.status !== 0) {
    console.error(`ffmpeg failed on ${name}`);
    try { await unlink(tmp); } catch {}
    process.exit(1);
  }

  // replace original with compressed jpg, normalizing extension to .jpg
  const dotIdx = name.lastIndexOf(".");
  const dest   = join(PICS_DIR, name.slice(0, dotIdx) + ".jpg");
  if (dest !== src) {
    await unlink(src);
  }
  await rename(tmp, dest);

  const st2 = await stat(dest);
  marker[dest === src ? name : name.slice(0, dotIdx) + ".jpg"] = `${st2.size}-${st2.mtimeMs}`;
  compressed += 1;
  console.log(`  ${name} → ${(st2.size / 1024).toFixed(0)}KB`);
}

// prune marker entries whose file no longer exists
const present = new Set(
  (await readdir(PICS_DIR)).filter((f) =>
    [...EXTS].some((e) => f.toLowerCase().endsWith(e))
  )
);
for (const k of Object.keys(marker)) if (!present.has(k)) delete marker[k];
await writeFile(MARKER, JSON.stringify(marker, null, 2));

console.log(`✓ pics: ${compressed} compressed, ${skipped} skipped`);
