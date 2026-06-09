#!/usr/bin/env node
'use strict';
// pixel-dog: generates pixel-art dog portraits (SVG, zero dependencies)
//
// Usage:
//   node generate.js [--breed <name|random>] [--size <n|random>]
//                    [--output <file.svg>]   [--pixel-size <n>]
//                    [--seed <n>]             [--preview]  [--list]
//
// Breeds: shiba, corgi, dalmatian, golden, husky, dachshund, poodle
// Sizes:  any integer, or "random" picks from [16, 24, 32, 48, 64]
// --pixel-size  SVG render size per logical pixel (default 10)
// --seed        integer seed for reproducible random results
// --preview     print colored block preview to stderr
// --list        print available breeds and exit

const fs = require('fs');

// ── Args ──────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
function arg(name, def) {
  const i = argv.indexOf(`--${name}`);
  return i !== -1 ? argv[i + 1] : def;
}
function flag(name) { return argv.includes(`--${name}`); }

if (flag('list')) {
  console.log('Available breeds:\n  shiba, corgi, dalmatian, golden, husky, dachshund, poodle\n  random');
  process.exit(0);
}

const SEED_ARG    = arg('seed', null);
const BREED_ARG   = arg('breed', 'random');
const SIZE_ARG    = arg('size', '32');
const OUTPUT      = arg('output', null);
const PIXEL_SIZE  = parseInt(arg('pixel-size', '10'), 10);
const PREVIEW     = flag('preview');

// Seeded RNG (mulberry32)
function makeRng(seed) {
  let s = (seed >>> 0) || Math.floor(Math.random() * 0xffffffff);
  return () => {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const seedValue = SEED_ARG != null
  ? parseInt(SEED_ARG, 10)
  : (process.env.PIXEL_DOG_SEED ? parseInt(process.env.PIXEL_DOG_SEED, 10) : null);

const rng = makeRng(seedValue);

const SIZE_POOL = [16, 24, 32, 48, 64];
const SIZE = SIZE_ARG === 'random'
  ? SIZE_POOL[Math.floor(rng() * SIZE_POOL.length)]
  : parseInt(SIZE_ARG, 10);

// ── Pixel Canvas ──────────────────────────────────────────────────────────────
class Canvas {
  constructor(w, h) {
    this.w = w; this.h = h;
    this.data = Array.from({ length: h }, () => Array(w).fill(null));
  }

  set(x, y, c) {
    x = Math.round(x); y = Math.round(y);
    if (x >= 0 && x < this.w && y >= 0 && y < this.h) this.data[y][x] = c;
  }

  rect(x, y, w, h, c) {
    x = Math.round(x); y = Math.round(y);
    w = Math.max(1, Math.round(w)); h = Math.max(1, Math.round(h));
    for (let dy = 0; dy < h; dy++)
      for (let dx = 0; dx < w; dx++)
        this.set(x + dx, y + dy, c);
  }

  circle(cx, cy, r, c) {
    cx = Math.round(cx); cy = Math.round(cy); r = Math.round(r);
    for (let dy = -r; dy <= r; dy++)
      for (let dx = -r; dx <= r; dx++)
        if (dx * dx + dy * dy <= r * r + r * 0.6)
          this.set(cx + dx, cy + dy, c);
  }

  ellipse(cx, cy, rx, ry, c) {
    cx = Math.round(cx); cy = Math.round(cy);
    rx = Math.max(1, Math.round(rx)); ry = Math.max(1, Math.round(ry));
    for (let dy = -ry - 1; dy <= ry + 1; dy++)
      for (let dx = -rx - 1; dx <= rx + 1; dx++)
        if ((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1.1)
          this.set(cx + dx, cy + dy, c);
  }

  toSVG(ps = PIXEL_SIZE) {
    const W = this.w * ps, H = this.h * ps;
    let r = '';
    for (let y = 0; y < this.h; y++)
      for (let x = 0; x < this.w; x++) {
        const c = this.data[y][x];
        if (c) r += `<rect x="${x * ps}" y="${y * ps}" width="${ps}" height="${ps}" fill="${c}"/>`;
      }
    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"`,
      `     viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges">`,
      `  <rect width="${W}" height="${H}" fill="#e8e8e8"/>`,
      `  ${r}`,
      '</svg>',
    ].join('\n');
  }

  // Terminal preview: two canvas rows → one terminal row using ▄
  toTerminal() {
    const hex2ansi = (hex) => {
      if (!hex) return 250;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      if (r === g && g === b) {
        if (r < 8) return 16;
        if (r > 248) return 231;
        return Math.round((r - 8) / 247 * 24) + 232;
      }
      return 16 + 36 * Math.round(r / 51) + 6 * Math.round(g / 51) + Math.round(b / 51);
    };
    const RST = '\x1b[0m';
    let out = '';
    for (let y = 0; y < this.h; y += 2) {
      for (let x = 0; x < this.w; x++) {
        const top = this.data[y][x];
        const bot = y + 1 < this.h ? this.data[y + 1][x] : null;
        out += `\x1b[48;5;${hex2ansi(top)}m\x1b[38;5;${hex2ansi(bot)}m▄`;
      }
      out += RST + '\n';
    }
    return out;
  }
}

// ── Drawing helpers ───────────────────────────────────────────────────────────
// All virtual coords are for a 32×32 grid; scale factor s = SIZE/32

// Standard 4-legged stance (two visible front, two visible back)
function stdLegs(cv, p, body, paw, legH = 6) {
  cv.rect(p(22), p(25), p(3), p(legH), body);   // front outer
  cv.rect(p(18), p(25), p(2), p(legH), body);   // front inner
  cv.rect(p(12), p(25), p(3), p(legH), body);   // back outer
  cv.rect(p(8),  p(25), p(2), p(legH), body);   // back inner
  if (paw) {
    cv.rect(p(22), p(25 + legH - 1), p(3), p(1), paw);
    cv.rect(p(18), p(25 + legH - 1), p(2), p(1), paw);
    cv.rect(p(12), p(25 + legH - 1), p(3), p(1), paw);
    cv.rect(p(8),  p(25 + legH - 1), p(2), p(1), paw);
  }
}

// Core dog silhouette (body / neck / head / muzzle)
// Each breed overrides parts via its own methods
function drawDog(canvas, breed) {
  const s = canvas.w / 32;
  const p = v => v * s;
  const c = breed.colors;

  // tail first so body paints over the root
  breed.drawTail(canvas, p, c);

  // body
  if (breed.drawBody) breed.drawBody(canvas, p, c);
  else                canvas.ellipse(p(16), p(21), p(10), p(5), c.body);

  // neck bridge
  canvas.rect(p(19), p(15), p(5), p(7), c.body);

  // head
  canvas.circle(p(23), p(14), p(5), c.body);

  // muzzle
  canvas.ellipse(p(28), p(16), p(3), p(2), c.muzzle);

  // ears painted on top of head
  breed.drawEars(canvas, p, c);

  // legs
  breed.drawLegs(canvas, p, c);

  // eye (2×2 block)
  canvas.rect(p(24), p(12), p(2), p(2), c.eye);

  // nose tip
  canvas.rect(p(30), p(15), p(1), p(2), c.nose);

  // breed-specific markings painted last
  if (breed.drawMarkings) breed.drawMarkings(canvas, p, c);
}

// ── Breed definitions ─────────────────────────────────────────────────────────
const BREEDS = {

  // 柴犬 ─────────────────────────────────────────────────────────────────────
  shiba: {
    name: '柴犬 (Shiba Inu)',
    colors: { body: '#D4602A', muzzle: '#F5DEB3', eye: '#2C0A00', nose: '#111111' },
    drawTail(cv, p, c) {
      // curled tail arching upward
      cv.circle(p(7), p(13), p(3), c.body);
      cv.rect(p(6), p(14), p(4), p(7), c.body);
      cv.set(p(7), p(10), c.body); // tip pixel
    },
    drawEars(cv, p, c) {
      // pointed upright ears
      cv.rect(p(20), p(7), p(4), p(6), c.body);
      cv.rect(p(21), p(8), p(2), p(3), c.muzzle); // inner
      cv.rect(p(26), p(7), p(4), p(6), c.body);
      cv.rect(p(27), p(8), p(2), p(3), c.muzzle);
    },
    drawLegs(cv, p, c) { stdLegs(cv, p, c.body, c.muzzle, 6); },
    drawMarkings(cv, p, c) {
      cv.ellipse(p(28), p(16), p(2), p(1.5), c.muzzle); // cream muzzle patch
      cv.ellipse(p(16), p(22), p(4), p(2), '#E8A060');  // slightly lighter belly
    },
  },

  // コーギー ──────────────────────────────────────────────────────────────────
  corgi: {
    name: 'コーギー (Corgi)',
    colors: { body: '#D4782A', muzzle: '#FFF0D0', eye: '#2C0A00', nose: '#111111', white: '#FFFAF0' },
    drawTail(cv, p, c) {
      // tiny nub tail
      cv.rect(p(5), p(19), p(3), p(3), c.body);
    },
    drawEars(cv, p, c) {
      // large triangular upright ears
      cv.rect(p(19), p(4), p(5), p(9), c.body);
      cv.rect(p(20), p(5), p(3), p(6), '#FFB090'); // inner
      cv.rect(p(26), p(4), p(5), p(9), c.body);
      cv.rect(p(27), p(5), p(3), p(6), '#FFB090');
    },
    drawLegs(cv, p, c) { stdLegs(cv, p, c.body, c.white, 3); }, // SHORT legs
    drawMarkings(cv, p, c) {
      cv.ellipse(p(16), p(20), p(5), p(3), c.white);           // white chest
      cv.ellipse(p(28), p(16), p(2), p(1.5), c.muzzle);
    },
  },

  // ダルメシアン ────────────────────────────────────────────────────────────────
  dalmatian: {
    name: 'ダルメシアン (Dalmatian)',
    colors: { body: '#FFFFFF', muzzle: '#F0F0F0', eye: '#111111', nose: '#111111', spot: '#1A1A1A' },
    drawTail(cv, p, c) {
      // long straight tail held up
      cv.rect(p(3), p(13), p(2), p(9), c.body);
      cv.rect(p(4), p(11), p(2), p(4), c.body);
    },
    drawEars(cv, p, c) {
      // floppy drop ears with dark outline
      cv.ellipse(p(21), p(18), p(3), p(6), c.spot);
      cv.ellipse(p(21), p(18), p(2), p(5), c.body);
      cv.ellipse(p(27), p(18), p(3), p(6), c.spot);
      cv.ellipse(p(27), p(18), p(2), p(5), c.body);
    },
    drawLegs(cv, p, c) {
      stdLegs(cv, p, c.body, null, 7);
      // black nail / paw line
      ['22','18','12','8'].forEach(x => cv.rect(p(+x), p(31), p(3), p(1), c.spot));
    },
    drawMarkings(cv, p, c) {
      // scatter random spots
      [[14,17],[10,20],[19,18],[7,22],[20,23],[13,23],[17,15],[9,16],[6,19],[16,19]]
        .forEach(([x, y]) => cv.circle(p(x), p(y), p(1.5), c.spot));
    },
  },

  // ゴールデンレトリバー ─────────────────────────────────────────────────────────
  golden: {
    name: 'ゴールデンレトリバー (Golden Retriever)',
    colors: { body: '#C8820A', muzzle: '#E8B030', eye: '#2C0A00', nose: '#111111', light: '#ECC050' },
    drawTail(cv, p, c) {
      // fluffy feathered tail raised
      cv.ellipse(p(6), p(13), p(4), p(6), c.muzzle);
      cv.ellipse(p(5), p(11), p(3), p(4), c.light);
    },
    drawEars(cv, p, c) {
      // long floppy ears
      cv.ellipse(p(21), p(19), p(4), p(7), c.body);
      cv.ellipse(p(27), p(19), p(4), p(7), c.body);
    },
    drawLegs(cv, p, c) { stdLegs(cv, p, c.body, c.muzzle, 7); },
    drawMarkings(cv, p, c) {
      cv.ellipse(p(17), p(21), p(4), p(3), c.light);             // lighter belly
      cv.ellipse(p(28), p(16), p(2), p(1.5), c.muzzle);
    },
  },

  // シベリアンハスキー ────────────────────────────────────────────────────────────
  husky: {
    name: 'シベリアンハスキー (Husky)',
    colors: {
      body: '#888888', muzzle: '#FFFFFF', eye: '#4FC3F7', // blue eyes!
      nose: '#111111', white: '#FFFFFF', dark: '#2A2A2A',
    },
    drawTail(cv, p, c) {
      // bushy tail curled over back
      cv.circle(p(8), p(13), p(4), c.body);
      cv.rect(p(7), p(15), p(5), p(6), c.body);
      cv.circle(p(8), p(13), p(2), c.white); // white inner
    },
    drawEars(cv, p, c) {
      // pointed wolf ears with dark tips and white inner
      cv.rect(p(20), p(5), p(4), p(8), c.body);
      cv.rect(p(20), p(5), p(4), p(3), c.dark); // dark tip
      cv.rect(p(21), p(7), p(2), p(5), c.white);
      cv.rect(p(26), p(5), p(4), p(8), c.body);
      cv.rect(p(26), p(5), p(4), p(3), c.dark);
      cv.rect(p(27), p(7), p(2), p(5), c.white);
    },
    drawLegs(cv, p, c) { stdLegs(cv, p, c.white, null, 7); },
    drawMarkings(cv, p, c) {
      cv.ellipse(p(13), p(18), p(7), p(4), c.dark);  // dark saddle
      cv.ellipse(p(23), p(14), p(5), p(6), c.white); // white face mask
      cv.ellipse(p(28), p(16), p(3), p(2), c.muzzle);
      cv.rect(p(24), p(12), p(2), p(2), c.eye);       // re-paint blue eye
    },
  },

  // ダックスフント ───────────────────────────────────────────────────────────────
  dachshund: {
    name: 'ダックスフント (Dachshund)',
    colors: { body: '#5C1A00', muzzle: '#8B4513', eye: '#1A0A00', nose: '#111111', tan: '#A0522D' },
    drawBody(cv, p, c) {
      // extra-long, low-slung body
      cv.ellipse(p(16), p(22), p(13), p(4), c.body);
    },
    drawTail(cv, p, c) {
      cv.rect(p(2), p(18), p(3), p(2), c.body);
      cv.rect(p(1), p(16), p(2), p(3), c.body);
    },
    drawEars(cv, p, c) {
      // long drooping floppy ears
      cv.ellipse(p(21), p(20), p(4), p(8), c.body);
      cv.ellipse(p(27), p(20), p(4), p(8), c.body);
    },
    drawLegs(cv, p, c) { stdLegs(cv, p, c.body, c.tan, 3); }, // VERY short legs
    drawMarkings(cv, p, c) {
      cv.ellipse(p(28), p(16), p(2), p(1.5), c.muzzle);
      cv.ellipse(p(16), p(22), p(5), p(2), c.tan); // tan belly stripe
    },
  },

  // プードル ─────────────────────────────────────────────────────────────────────
  poodle: {
    name: 'プードル (Poodle)',
    colors: { body: '#A0A0A0', muzzle: '#C8C8C8', eye: '#111111', nose: '#111111', pom: '#D8D8D8' },
    drawTail(cv, p, c) {
      // thin stem + pom-pom
      cv.rect(p(6), p(17), p(2), p(6), c.body);
      cv.circle(p(7), p(14), p(3), c.pom);
    },
    drawEars(cv, p, c) {
      // pom-pom hanging ears
      cv.circle(p(21), p(21), p(4), c.pom);
      cv.circle(p(28), p(21), p(4), c.pom);
    },
    drawLegs(cv, p, c) {
      // slender legs + pom-pom ankles
      [[22, 23], [18, 19], [12, 13], [8, 9]].forEach(([lx, cx]) => {
        cv.rect(p(lx), p(25), p(2), p(7), c.body);
        cv.circle(p(cx), p(31), p(2), c.pom);
      });
    },
    drawMarkings(cv, p, c) {
      cv.circle(p(23), p(10), p(4), c.pom);             // head topknot pom
      cv.ellipse(p(28), p(16), p(2), p(1.5), c.muzzle);
    },
  },
};

// ── Main ──────────────────────────────────────────────────────────────────────
const BREED_KEYS = Object.keys(BREEDS);

let breed;
if (BREED_ARG === 'random') {
  breed = BREEDS[BREED_KEYS[Math.floor(rng() * BREED_KEYS.length)]];
} else {
  breed = BREEDS[BREED_ARG];
  if (!breed) {
    process.stderr.write(`Unknown breed "${BREED_ARG}". Run with --list for options.\n`);
    process.exit(1);
  }
}

const canvas = new Canvas(SIZE, SIZE);
drawDog(canvas, breed);

const svg = canvas.toSVG();

if (OUTPUT) {
  fs.writeFileSync(OUTPUT, svg, 'utf8');
  process.stderr.write(`✓ ${breed.name} · ${SIZE}×${SIZE}px → ${OUTPUT}\n`);
} else {
  process.stdout.write(svg);
}

if (PREVIEW || OUTPUT) {
  process.stderr.write('\n' + breed.name + '\n');
  process.stderr.write(canvas.toTerminal());
}
