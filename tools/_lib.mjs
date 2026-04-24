// Shared crypto + file-patching for encrypt-msg.mjs and encrypt-qr.mjs.
// Don't run this directly — call it through one of the siblings.

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { webcrypto as crypto } from "node:crypto";

export const ITERATIONS = 600_000;

const HERE     = dirname(fileURLToPath(import.meta.url));
export const ROOT   = join(HERE, "..");
export const OUT_JS = join(ROOT, "app.js");

export async function encryptString(plaintext, password) {
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
  const ctBuf = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plaintext)
  );
  const b64 = (u8) => Buffer.from(u8).toString("base64");
  return {
    salt: b64(salt),
    iv:   b64(iv),
    ct:   b64(new Uint8Array(ctBuf)),
    iter: ITERATIONS,
  };
}

// Rewrites `var <varName> = { ... };` inside app.js, preserving surrounding code.
export async function updateBlob(varName, blob) {
  const replacement = [
    `var ${varName} = {`,
    `  salt: ${JSON.stringify(blob.salt)},`,
    `  iv: ${JSON.stringify(blob.iv)},`,
    `  ct: ${JSON.stringify(blob.ct)},`,
    `  iter: ${blob.iter}`,
    `};`,
  ].join("\n");

  const pattern = new RegExp(`var\\s+${varName}\\s*=\\s*\\{[\\s\\S]*?\\};`);
  const src = await readFile(OUT_JS, "utf8");
  if (!pattern.test(src)) {
    throw new Error(`could not find "var ${varName} = { ... };" in ${OUT_JS}`);
  }
  await writeFile(OUT_JS, src.replace(pattern, replacement));
}
