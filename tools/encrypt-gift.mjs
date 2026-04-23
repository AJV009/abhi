#!/usr/bin/env node
// Re-encrypts the gift payload and rewrites GIFT_BLOB inside ../app.js in place.
//
// Usage:
//   node tools/encrypt-gift.mjs <password> <qr-payload>
//
// Example:
//   node tools/encrypt-gift.mjs 12022020 "https://www.amazon.in/gc/redeem?claimCode=ABC123"
//
// The qr-payload is whatever you want the QR code to encode — the giftcard
// claim URL, the giftcard code as a string, a UPI link, anything. After
// running, commit & push app.js — the live site will decrypt it client-side
// when the friend types the password.

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { webcrypto as crypto } from "node:crypto";

const ITERATIONS = 600_000;
const HERE = dirname(fileURLToPath(import.meta.url));
const APP_JS = join(HERE, "..", "app.js");

const [, , password, qrPayload] = process.argv;
if (!password || !qrPayload) {
  console.error("usage: node tools/encrypt-gift.mjs <password> <qr-payload>");
  process.exit(1);
}

const salt = crypto.getRandomValues(new Uint8Array(16));
const iv   = crypto.getRandomValues(new Uint8Array(12));

const baseKey = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(password),
  "PBKDF2",
  false,
  ["deriveKey"]
);
const key = await crypto.subtle.deriveKey(
  { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
  baseKey,
  { name: "AES-GCM", length: 256 },
  false,
  ["encrypt"]
);

const plaintext = new TextEncoder().encode(JSON.stringify({ qrPayload }));
const ctBuf = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext);

const b64 = (u8) => Buffer.from(u8).toString("base64");
const blob = {
  salt: b64(salt),
  iv:   b64(iv),
  ct:   b64(new Uint8Array(ctBuf)),
  iter: ITERATIONS,
};

const replacement =
  `var GIFT_BLOB = {\n` +
  `  salt: ${JSON.stringify(blob.salt)},\n` +
  `  iv: ${JSON.stringify(blob.iv)},\n` +
  `  ct: ${JSON.stringify(blob.ct)},\n` +
  `  iter: ${blob.iter}\n` +
  `};`;

const src = await readFile(APP_JS, "utf8");
const pattern = /var GIFT_BLOB = \{[\s\S]*?\};/;
if (!pattern.test(src)) {
  console.error("could not find GIFT_BLOB in app.js — did you rebuild?");
  process.exit(1);
}
await writeFile(APP_JS, src.replace(pattern, replacement));

console.log("✓ re-encrypted gift payload");
console.log(`  password:    ${password}`);
console.log(`  qr payload:  ${qrPayload}`);
console.log(`  iterations:  ${ITERATIONS.toLocaleString()}`);
console.log(`  written to:  ${APP_JS}`);
console.log();
console.log("commit & push app.js to deploy.");
