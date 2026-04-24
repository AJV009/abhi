#!/usr/bin/env node
// Reads workbench/msg.txt as-is, encrypts it with the given password,
// and writes MSG_BLOB into both src/app.jsx and app.js.
//
// Usage:
//   node tools/encrypt-msg.mjs 28042026

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { encryptString, updateBlob, ROOT } from "./_lib.mjs";

const MSG_FILE = join(ROOT, "workbench", "msg.txt");

const [, , password] = process.argv;
if (!password) {
  console.error("usage: node tools/encrypt-msg.mjs <password>");
  process.exit(1);
}

let raw;
try {
  raw = await readFile(MSG_FILE, "utf8");
} catch (e) {
  console.error(`could not read ${MSG_FILE}: ${e.message}`);
  process.exit(1);
}

const content = raw.trim();
if (!content) {
  console.error("msg.txt is empty");
  process.exit(1);
}

const blob = await encryptString(content, password);
await updateBlob("MSG_BLOB", blob);

console.log("✓ encrypted and wrote MSG_BLOB");
console.log(`  source:     ${MSG_FILE}`);
console.log(`  characters: ${content.length}`);
console.log(`  password:   ${"*".repeat(password.length)}`);
