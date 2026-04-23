/* Tiny QR-code renderer.
 * Self-contained: no external deps. Implements QR Model 2, byte mode,
 * version auto-pick up to ~v10, with mask selection. Good enough for
 * encoding a gift-card URL.
 *
 * Based on the well-known algorithm spec. Returns an SVG string.
 *
 * Usage: window.qrSvg("https://example.com/redeem?code=...", { size: 320, margin: 4 })
 */
(function () {
  "use strict";

  // ---- Galois field tables for Reed-Solomon over GF(256) (primitive 0x11d) ----
  const GF_EXP = new Uint8Array(512);
  const GF_LOG = new Uint8Array(256);
  (function initGF() {
    let x = 1;
    for (let i = 0; i < 255; i++) {
      GF_EXP[i] = x;
      GF_LOG[x] = i;
      x <<= 1;
      if (x & 0x100) x ^= 0x11d;
    }
    for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255];
  })();
  const gfMul = (a, b) => (a === 0 || b === 0) ? 0 : GF_EXP[GF_LOG[a] + GF_LOG[b]];

  function rsGeneratorPoly(degree) {
    let poly = [1];
    for (let i = 0; i < degree; i++) {
      const next = new Array(poly.length + 1).fill(0);
      for (let j = 0; j < poly.length; j++) {
        next[j]     ^= gfMul(poly[j], 1);
        next[j + 1] ^= gfMul(poly[j], GF_EXP[i]);
      }
      poly = next;
    }
    return poly;
  }

  function rsEncode(data, ecLen) {
    const gen = rsGeneratorPoly(ecLen);
    const res = new Array(ecLen).fill(0);
    for (let i = 0; i < data.length; i++) {
      const factor = data[i] ^ res[0];
      res.shift();
      res.push(0);
      if (factor !== 0) {
        for (let j = 0; j < ecLen; j++) res[j] ^= gfMul(gen[j + 1], factor);
      }
    }
    return res;
  }

  // ---- QR capacity & EC tables (bytes for EC level L/M/Q/H, versions 1..10 — enough for our payload) ----
  // Each entry: [ totalCodewords, ecCodewordsPerBlock, [group1blocks, dataPerBlock], [group2blocks, dataPerBlock]? ]
  // Source: QR spec table 9.
  const EC_TABLE = {
    // L level
    L: [
      null,
      [26,   7,  [1, 19]],
      [44,  10,  [1, 34]],
      [70,  15,  [1, 55]],
      [100, 20,  [1, 80]],
      [134, 26,  [1, 108]],
      [172, 18,  [2, 68]],
      [196, 20,  [2, 78]],
      [242, 24,  [2, 97]],
      [292, 30,  [2, 116]],
      [346, 18,  [2, 68],  [2, 69]],
    ],
    M: [
      null,
      [26,   10, [1, 16]],
      [44,   16, [1, 28]],
      [70,   26, [1, 44]],
      [100,  18, [2, 32]],
      [134,  24, [2, 43]],
      [172,  16, [4, 27]],
      [196,  18, [4, 31]],
      [242,  22, [2, 38], [2, 39]],
      [292,  22, [3, 36], [2, 37]],
      [346,  26, [4, 43], [1, 44]],
    ],
    Q: [
      null,
      [26,   13, [1, 13]],
      [44,   22, [1, 22]],
      [70,   18, [2, 17]],
      [100,  26, [2, 24]],
      [134,  18, [2, 15], [2, 16]],
      [172,  24, [4, 19]],
      [196,  18, [2, 14], [4, 15]],
      [242,  22, [4, 18], [2, 19]],
      [292,  20, [4, 16], [4, 17]],
      [346,  24, [6, 19], [2, 20]],
    ],
    H: [
      null,
      [26,   17, [1, 9]],
      [44,   28, [1, 16]],
      [70,   22, [2, 13]],
      [100,  16, [4, 9]],
      [134,  22, [2, 11], [2, 12]],
      [172,  28, [4, 15]],
      [196,  26, [4, 13], [1, 14]],
      [242,  26, [4, 14], [2, 15]],
      [292,  24, [4, 12], [4, 13]],
      [346,  28, [6, 15], [2, 16]],
    ],
  };

  // ---- bit buffer ----
  function BitBuffer() { this.bits = []; }
  BitBuffer.prototype.put = function (val, len) {
    for (let i = len - 1; i >= 0; i--) this.bits.push((val >>> i) & 1);
  };

  // ---- pick smallest version that fits ----
  function pickVersion(byteLen, ec) {
    for (let v = 1; v <= 10; v++) {
      const t = EC_TABLE[ec][v];
      const totalData = t[0] - (t[2][0] * t[1] + (t[3] ? t[3][0] * t[1] : 0));
      // mode(4) + charCount(8 or 16) + data*8 + terminator(up to 4) <= totalData*8
      const charBits = v < 10 ? 8 : 16;
      const need = 4 + charBits + byteLen * 8;
      if (need <= totalData * 8) return v;
    }
    throw new Error("QR payload too long for this tiny encoder (>v10).");
  }

  // ---- alignment pattern positions (for versions 2..10) ----
  const ALIGN_POS = [
    [], [],
    [6, 18],
    [6, 22],
    [6, 26],
    [6, 30],
    [6, 34],
    [6, 22, 38],
    [6, 24, 42],
    [6, 26, 46],
    [6, 28, 50],
  ];

  // ---- format info bits (pre-computed, 32 entries: ecLevel*8 + mask, but using lookup for L/M/Q/H) ----
  function formatInfoBits(ecLevel, mask) {
    const ecBits = { L: 1, M: 0, Q: 3, H: 2 }[ecLevel];
    let data = (ecBits << 3) | mask;
    let bch = data << 10;
    // BCH (15,5) generator 0b10100110111
    const G = 0x537;
    for (let i = 14; i >= 10; i--) {
      if (bch & (1 << i)) bch ^= G << (i - 10);
    }
    let result = ((data << 10) | bch) ^ 0x5412; // mask pattern for format info
    return result;
  }

  // ---- version info (for v7+) — not needed for our ≤ v10 light encoder when v≤6; include for safety
  function versionInfoBits(v) {
    if (v < 7) return null;
    let data = v;
    let bch = data << 12;
    const G = 0x1f25; // (18,6) generator
    for (let i = 17; i >= 12; i--) {
      if (bch & (1 << i)) bch ^= G << (i - 12);
    }
    return (v << 12) | bch;
  }

  // ---- main: encode string -> 2D matrix ----
  function encode(text, ecLevel) {
    const enc = new TextEncoder();
    const bytes = enc.encode(text);
    const version = pickVersion(bytes.length, ecLevel);
    const size = 17 + 4 * version;
    const t = EC_TABLE[ecLevel][version];
    const totalCodewords = t[0];
    const ecPerBlock = t[1];
    const blocks = [];
    if (t[2]) for (let i = 0; i < t[2][0]; i++) blocks.push({ data: t[2][1] });
    if (t[3]) for (let i = 0; i < t[3][0]; i++) blocks.push({ data: t[3][1] });
    const totalData = blocks.reduce((s, b) => s + b.data, 0);

    // Build bit stream: byte mode (0100), char-count, data, terminator, pad
    const bb = new BitBuffer();
    bb.put(0b0100, 4);
    bb.put(bytes.length, version < 10 ? 8 : 16);
    for (const b of bytes) bb.put(b, 8);
    // terminator
    const terminator = Math.min(4, totalData * 8 - bb.bits.length);
    for (let i = 0; i < terminator; i++) bb.bits.push(0);
    // byte align
    while (bb.bits.length % 8) bb.bits.push(0);
    // pad bytes
    const PAD = [0xEC, 0x11];
    let padIdx = 0;
    while (bb.bits.length < totalData * 8) {
      const byte = PAD[padIdx++ % 2];
      for (let i = 7; i >= 0; i--) bb.bits.push((byte >> i) & 1);
    }

    // pack bits -> data codewords
    const dataCw = [];
    for (let i = 0; i < bb.bits.length; i += 8) {
      let v = 0;
      for (let j = 0; j < 8; j++) v = (v << 1) | bb.bits[i + j];
      dataCw.push(v);
    }

    // split into blocks, compute EC per block
    let off = 0;
    for (const blk of blocks) {
      blk.dataCw = dataCw.slice(off, off + blk.data);
      off += blk.data;
      blk.ecCw = rsEncode(blk.dataCw, ecPerBlock);
    }

    // interleave
    const finalBytes = [];
    const maxData = Math.max(...blocks.map(b => b.data));
    for (let i = 0; i < maxData; i++) {
      for (const blk of blocks) if (i < blk.dataCw.length) finalBytes.push(blk.dataCw[i]);
    }
    for (let i = 0; i < ecPerBlock; i++) {
      for (const blk of blocks) finalBytes.push(blk.ecCw[i]);
    }

    // ---- build matrix ----
    // -1 = unset, 0/1 = module value; we track a "reserved" mask separately
    const m = Array.from({ length: size }, () => new Array(size).fill(-1));
    const r = Array.from({ length: size }, () => new Array(size).fill(false));

    function setF(x, y, v) { m[y][x] = v; r[y][x] = true; }

    // finders + separators at 3 corners
    function placeFinder(cx, cy) {
      for (let dy = -1; dy <= 7; dy++) for (let dx = -1; dx <= 7; dx++) {
        const x = cx + dx, y = cy + dy;
        if (x < 0 || y < 0 || x >= size || y >= size) continue;
        let v = 0;
        if (dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6) {
          const d = Math.max(Math.abs(dx - 3), Math.abs(dy - 3));
          v = (d !== 2 && d <= 3) ? 1 : 0;
        }
        setF(x, y, v);
      }
    }
    placeFinder(0, 0);
    placeFinder(size - 7, 0);
    placeFinder(0, size - 7);

    // timing patterns
    for (let i = 8; i < size - 8; i++) {
      if (m[6][i] === -1) setF(i, 6, i % 2 === 0 ? 1 : 0);
      if (m[i][6] === -1) setF(6, i, i % 2 === 0 ? 1 : 0);
    }

    // alignment patterns
    const alignPos = ALIGN_POS[version];
    for (const ay of alignPos) for (const ax of alignPos) {
      // skip if overlaps a finder
      if ((ax <= 7 && ay <= 7) ||
          (ax >= size - 8 && ay <= 7) ||
          (ax <= 7 && ay >= size - 8)) continue;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
        const x = ax + dx, y = ay + dy;
        const d = Math.max(Math.abs(dx), Math.abs(dy));
        setF(x, y, (d === 0 || d === 2) ? 1 : 0);
      }
    }

    // dark module
    setF(8, size - 8, 1);

    // reserve format info strip
    for (let i = 0; i <= 8; i++) {
      if (m[8][i] === -1) { m[8][i] = 0; r[8][i] = true; }
      if (m[i][8] === -1) { m[i][8] = 0; r[i][8] = true; }
    }
    for (let i = 0; i < 8; i++) {
      if (m[8][size - 1 - i] === -1) { m[8][size - 1 - i] = 0; r[8][size - 1 - i] = true; }
      if (m[size - 1 - i][8] === -1) { m[size - 1 - i][8] = 0; r[size - 1 - i][8] = true; }
    }

    // reserve version info (v>=7)
    if (version >= 7) {
      for (let y = 0; y < 6; y++) for (let x = size - 11; x < size - 8; x++) { m[y][x] = 0; r[y][x] = true; }
      for (let x = 0; x < 6; x++) for (let y = size - 11; y < size - 8; y++) { m[y][x] = 0; r[y][x] = true; }
    }

    // ---- place data bits, zig-zag from bottom-right ----
    const bits = [];
    for (const byte of finalBytes) for (let i = 7; i >= 0; i--) bits.push((byte >> i) & 1);
    let bit = 0;
    let up = true;
    for (let col = size - 1; col > 0; col -= 2) {
      if (col === 6) col--; // skip timing col
      for (let i = 0; i < size; i++) {
        const y = up ? size - 1 - i : i;
        for (let j = 0; j < 2; j++) {
          const x = col - j;
          if (!r[y][x]) {
            m[y][x] = bit < bits.length ? bits[bit++] : 0;
          }
        }
      }
      up = !up;
    }

    // ---- pick best mask ----
    const MASKS = [
      (x, y) => (x + y) % 2 === 0,
      (x, y) => y % 2 === 0,
      (x, y) => x % 3 === 0,
      (x, y) => (x + y) % 3 === 0,
      (x, y) => (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0,
      (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
      (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
      (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
    ];

    function applyMask(mat, res, maskFn) {
      const out = mat.map(row => row.slice());
      for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
        if (!res[y][x] && maskFn(x, y)) out[y][x] ^= 1;
      }
      return out;
    }

    function placeFormat(mat, ecLevel, mask) {
      const bits = formatInfoBits(ecLevel, mask);
      for (let i = 0; i < 15; i++) {
        const b = (bits >> i) & 1;
        // horizontal strip on row 8
        if (i < 6)       mat[8][i] = b;
        else if (i < 8)  mat[8][i + 1] = b;
        else             mat[8][size - 15 + i] = b;
        // vertical strip on col 8
        if (i < 7)       mat[size - 1 - i][8] = b;
        else if (i < 9)  mat[15 - i - 1 + 1][8] = b;
        else             mat[15 - i - 1][8] = b;
      }
      mat[size - 8][8] = 1; // dark module
    }

    function score(mat) {
      let penalty = 0;
      // rule 1: runs of 5+ same color (per row/col), 3 + (runLen - 5)
      for (let y = 0; y < size; y++) {
        let run = 1;
        for (let x = 1; x < size; x++) {
          if (mat[y][x] === mat[y][x - 1]) { run++; if (run === 5) penalty += 3; else if (run > 5) penalty += 1; }
          else run = 1;
        }
      }
      for (let x = 0; x < size; x++) {
        let run = 1;
        for (let y = 1; y < size; y++) {
          if (mat[y][x] === mat[y - 1][x]) { run++; if (run === 5) penalty += 3; else if (run > 5) penalty += 1; }
          else run = 1;
        }
      }
      // rule 2: 2x2 blocks same color => +3 each
      for (let y = 0; y < size - 1; y++) for (let x = 0; x < size - 1; x++) {
        const v = mat[y][x];
        if (v === mat[y][x+1] && v === mat[y+1][x] && v === mat[y+1][x+1]) penalty += 3;
      }
      // rule 3: 1011101 pattern with 4-wide quiet zone -> +40 each
      const pat1 = [1,0,1,1,1,0,1,0,0,0,0];
      const pat2 = [0,0,0,0,1,0,1,1,1,0,1];
      function matchAt(arr) { return (x, y, dx, dy) => {
        for (let k = 0; k < arr.length; k++) {
          const cx = x + dx * k, cy = y + dy * k;
          if (cx < 0 || cy < 0 || cx >= size || cy >= size) return false;
          if (mat[cy][cx] !== arr[k]) return false;
        }
        return true;
      }; }
      const mp1 = matchAt(pat1), mp2 = matchAt(pat2);
      for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
        if (mp1(x, y, 1, 0) || mp2(x, y, 1, 0)) penalty += 40;
        if (mp1(x, y, 0, 1) || mp2(x, y, 0, 1)) penalty += 40;
      }
      // rule 4: dark module balance
      let dark = 0;
      for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (mat[y][x]) dark++;
      const pct = (dark * 100) / (size * size);
      penalty += Math.floor(Math.abs(pct - 50) / 5) * 10;
      return penalty;
    }

    let best = null, bestMask = 0;
    for (let mk = 0; mk < 8; mk++) {
      const masked = applyMask(m, r, MASKS[mk]);
      placeFormat(masked, ecLevel, mk);
      const s = score(masked);
      if (best === null || s < best.score) { best = { mat: masked, score: s }; bestMask = mk; }
    }
    return { size, matrix: best.mat };
  }

  function qrSvg(text, opts) {
    opts = opts || {};
    const ec = opts.ec || "M";
    const margin = opts.margin ?? 4;
    const size = opts.size || 320;
    const fg = opts.fg || "#111111";
    const bg = opts.bg || "#ffffff";

    const { size: n, matrix } = encode(text, ec);
    const total = n + margin * 2;
    const scale = size / total;

    // Build a single <path> of all dark modules for crispness
    let d = "";
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        if (matrix[y][x] === 1) {
          d += `M${(x + margin) * scale},${(y + margin) * scale}h${scale}v${scale}h-${scale}z`;
        }
      }
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" shape-rendering="crispEdges" role="img" aria-label="QR code">
  <rect width="${size}" height="${size}" fill="${bg}"/>
  <path d="${d}" fill="${fg}"/>
</svg>`;
  }

  window.qrSvg = qrSvg;
})();
