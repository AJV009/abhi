#!/usr/bin/env node
// Reads workbench/qr.txt (a single URL/string to be encoded into the QR),
// encrypts it with the given password, and writes QR_BLOB into both
// src/app.jsx and app.js.
//
// Usage:
//   node tools/encrypt-qr.mjs 12022020

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { encryptString, updateBlob, ROOT } from "./_lib.mjs";

const QR_FILE = join(ROOT, "workbench", "qr.txt");

const [, , password] = process.argv;
if (!password) {
  console.error("usage: node tools/encrypt-qr.mjs <password>");
  process.exit(1);
}

let raw;
try {
  raw = await readFile(QR_FILE, "utf8");
} catch (e) {
  console.error(`could not read ${QR_FILE}: ${e.message}`);
  process.exit(1);
}

const url = raw.trim();
if (!url) {
  console.error("qr.txt is empty");
  process.exit(1);
}

const blob = await encryptString(url, password);
await updateBlob("QR_BLOB", blob);

console.log("✓ encrypted and wrote QR_BLOB");
console.log(`  source:   ${QR_FILE}`);
console.log(`  url:      ${url.length > 60 ? url.slice(0, 57) + "..." : url}`);
console.log(`  password: ${"*".repeat(password.length)}`);
