#!/usr/bin/env node
// Reads workbench/proof.txt (the plaintext revealed on successful gift-password
// unlock; sent as the body of the ntfy notification as proof), encrypts it
// with the given password, and writes PROOF_BLOB into app.js.
//
// Usage:
//   node tools/encrypt-proof.mjs 12022020

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { encryptString, updateBlob, ROOT } from "./_lib.mjs";

const PROOF_FILE = join(ROOT, "workbench", "proof.txt");

const [, , password] = process.argv;
if (!password) {
  console.error("usage: node tools/encrypt-proof.mjs <password>");
  process.exit(1);
}

let raw;
try {
  raw = await readFile(PROOF_FILE, "utf8");
} catch (e) {
  console.error(`could not read ${PROOF_FILE}: ${e.message}`);
  process.exit(1);
}

const plaintext = raw.trim();
if (!plaintext) {
  console.error("proof.txt is empty");
  process.exit(1);
}

const blob = await encryptString(plaintext, password);
await updateBlob("PROOF_BLOB", blob);

console.log("✓ encrypted and wrote PROOF_BLOB");
console.log(`  source:   ${PROOF_FILE}`);
console.log(`  preview:  ${plaintext.length > 60 ? plaintext.slice(0, 57) + "..." : plaintext}`);
console.log(`  password: ${"*".repeat(password.length)}`);
