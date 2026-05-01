#!/usr/bin/env node
// Read all compressed images in pics/, base64-encode each as a data URI,
// JSON.stringify the array, encrypt with the gift password, write to pics.blob
// at the repo root.
//
// pics.blob is committed (it's safe — useless without the key), but pics/
// itself stays gitignored.
//
// Usage:
//   node tools/encrypt-pics.mjs 12022020

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { encryptString, ROOT } from "./_lib.mjs";

const PICS_DIR = join(ROOT, "pics");
const OUT_FILE = join(ROOT, "pics.blob");
const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const MIME = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };

const [, , password] = process.argv;
if (!password) {
  console.error("usage: node tools/encrypt-pics.mjs <password>");
  process.exit(1);
}

let entries;
try {
  entries = await readdir(PICS_DIR);
} catch (e) {
  console.error(`could not read ${PICS_DIR}: ${e.message}`);
  process.exit(1);
}

const files = entries
  .filter((f) => EXTS.has(extname(f).toLowerCase()))
  .sort();

if (files.length === 0) {
  console.error(`no images in ${PICS_DIR}`);
  process.exit(1);
}

const dataUris = [];
let totalBytes = 0;
for (const name of files) {
  const buf = await readFile(join(PICS_DIR, name));
  totalBytes += buf.length;
  const mime = MIME[extname(name).toLowerCase()];
  dataUris.push(`data:${mime};base64,${buf.toString("base64")}`);
}

const plaintext = JSON.stringify(dataUris);
const blob = await encryptString(plaintext, password);
await writeFile(OUT_FILE, JSON.stringify(blob));

console.log("✓ encrypted and wrote PICS_BLOB to pics.blob");
console.log(`  source:  ${PICS_DIR} (${files.length} files, ${(totalBytes / 1024).toFixed(0)}KB raw)`);
console.log(`  output:  ${OUT_FILE} (${(JSON.stringify(blob).length / 1024).toFixed(0)}KB encrypted)`);
console.log(`  password: ${"*".repeat(password.length)}`);
