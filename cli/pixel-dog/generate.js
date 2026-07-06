#!/usr/bin/env node
"use strict";
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

const fs = require("fs");

// ── Args ──────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
function arg(name, def) {
  const i = argv.indexOf(`--${name}`);
  return i !== -1 ? argv[i + 1] : def;
}

function flag(name) {
  return argv.includes(`--${name}`);
}

if (flag("list")) {
  console.log(
    "Available breeds:\n  shiba, corgi, dalmatian, golden, husky, dachshund, poodle\n  random",
  );
  process.exit(0);
}

const SEED_ARG = arg("seed", null);
const BREED_ARG = arg("breed", "random");
const SIZE_ARG = arg("size", "32");
const OUTPUT = arg("output", null);
const PIXEL_SIZE = parseInt(arg("pixel-size", "10"), 10);
const PREVIEW = flag("preview");

// Seeded RNG (mulberry32)
function makeRng(seed) {
  let s = seed >>> 0 || Math.floor(Math.random() * 0xffffffff);
  return () => {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const seedValue =
  SEED_ARG != null
    ? parseInt(SEED_ARG, 10)
    : process.env.PIXEL_DOG_SEED
      ? parseInt(process.env.PIXEL_DOG_SEED, 10)
      : null;

const rng = makeRng(seedValue);

const SIZE_POOL = [16, 24, 32, 48, 64];
const SIZE =
  SIZE_ARG === "random"
    ? SIZE_POOL[Math.floor(rng() * SIZE_POOL.length)]
    : parseInt(SIZE_ARG, 10);

// ── Color helpers ─────────────────────────────────────────────────────────────
function darken(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const d = (v) => Math.max(0, Math.round(v * (1 - f)));
  const r = d((n >> 16) & 255);
  const g = d((n >> 8) & 255);
  const b = d(n & 255);
  return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}

// ── Pixel Canvas ──────────────────────────────────────────────────────────────
class Canvas {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.data = Array.from({ length: h }, () => Array(w).fill(null));
  }

  set(x, y, c) {
    x = Math.round(x);
    y = Math.round(y);
    if (x >= 0 && x < this.w && y >= 0 && y < this.h) this.data[y][x] = c;
  }

  rect(x, y, w, h, c) {
    x = Math.round(x);
    y = Math.round(y);
    w = Math.max(1, Math.round(w));
    h = Math.max(1, Math.round(h));
    for (let dy = 0; dy < h; dy++)
      for (let dx = 0; dx < w; dx++) this.set(x + dx, y + dy, c);
  }

  circle(cx, cy, r, c) {
    cx = Math.round(cx);
    cy = Math.round(cy);
    r = Math.round(r);
    for (let dy = -r; dy <= r; dy++)
      for (let dx = -r; dx <= r; dx++)
        if (dx * dx + dy * dy <= r * r + r * 0.6) this.set(cx + dx, cy + dy, c);
  }

  ellipse(cx, cy, rx, ry, c) {
    cx = Math.round(cx);
    cy = Math.round(cy);
    rx = Math.max(1, Math.round(rx));
    ry = Math.max(1, Math.round(ry));
    for (let dy = -ry - 1; dy <= ry + 1; dy++)
      for (let dx = -rx - 1; dx <= rx + 1; dx++)
        if ((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1.1)
          this.set(cx + dx, cy + dy, c);
  }

  // Darken every filled pixel that borders an empty one → crisp sprite outline
  outline(f = 0.45) {
    const src = this.data.map((row) => row.slice());
    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    for (let y = 0; y < this.h; y++)
      for (let x = 0; x < this.w; x++) {
        const c = src[y][x];
        if (!c) continue;
        const onEdge = dirs.some(([dx, dy]) => {
          const nx = x + dx,
            ny = y + dy;
          return (
            nx >= 0 && nx < this.w && ny >= 0 && ny < this.h && !src[ny][nx]
          );
        });
        if (onEdge) this.data[y][x] = darken(c, f);
      }
  }

  toSVG(ps = PIXEL_SIZE) {
    const W = this.w * ps,
      H = this.h * ps;
    let r = "";
    for (let y = 0; y < this.h; y++)
      for (let x = 0; x < this.w; x++) {
        const c = this.data[y][x];
        if (c)
          r += `<rect x="${x * ps}" y="${y * ps}" width="${ps}" height="${ps}" fill="${c}"/>`;
      }
    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"`,
      `     viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges">`,
      `  <rect width="${W}" height="${H}" fill="#e8e8e8"/>`,
      `  ${r}`,
      "</svg>",
    ].join("\n");
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
        return Math.round(((r - 8) / 247) * 24) + 232;
      }
      return (
        16 +
        36 * Math.round(r / 51) +
        6 * Math.round(g / 51) +
        Math.round(b / 51)
      );
    };
    const RST = "\x1b[0m";
    let out = "";
    for (let y = 0; y < this.h; y += 2) {
      for (let x = 0; x < this.w; x++) {
        const top = this.data[y][x];
        const bot = y + 1 < this.h ? this.data[y + 1][x] : null;
        out += `\x1b[48;5;${hex2ansi(top)}m\x1b[38;5;${hex2ansi(bot)}m▄`;
      }
      out += RST + "\n";
    }
    return out;
  }
}

// ── Drawing ───────────────────────────────────────────────────────────────────
// All virtual coords are on a 32×32 grid; the dog faces RIGHT (side view).
// Layout: rump/tail at the left, chest + head at the upper right,
// ground line at y=30. Far-side legs are drawn in a darker shade for depth.

const GEO_DEFAULT = {
  headCx: 24,
  headCy: 9,
  headR: 4.2, // head circle
  neck: [19, 11, 6, 6], // rect bridging head and chest
  muzzle: [27, 8, 4, 3], // snout box pointing right
  eye: [25, 8], // 1×2 eye
  nose: [30, 8], // nose tip at front of muzzle
  legTop: 23,
  legH: 8, // legs end on ground line y=30
  frontX: 20,
  backX: 7, // near-leg x positions
};

// Two near legs (full color) + two far legs (shade) + paws with a toe pixel
function stdLegs(cv, p, c, G, shade) {
  const { legTop: t, legH: h, frontX: f, backX: b } = G;
  const paw = c.paw || c.body;
  // far pair (perspective: slightly inward, darker)
  cv.rect(p(f - 3), p(t + 1), p(2), p(h - 1), shade);
  cv.rect(p(b + 3), p(t + 1), p(2), p(h - 1), shade);
  // near pair
  cv.rect(p(f), p(t), p(3), p(h), c.body);
  cv.rect(p(b), p(t), p(3), p(h), c.body);
  // paws: bottom row + one toe pixel forward
  cv.rect(p(f), p(t + h - 1), p(3), p(1), paw);
  cv.rect(p(b), p(t + h - 1), p(3), p(1), paw);
  cv.set(p(f + 3), p(t + h - 1), paw);
  cv.set(p(b + 3), p(t + h - 1), paw);
}

function drawDog(canvas, breed) {
  const s = canvas.w / 32;
  const p = (v) => v * s;
  const c = breed.colors;
  const shade = c.shade || darken(c.body, 0.22);
  const G = { ...GEO_DEFAULT, ...breed.geo };

  // tail first so the body paints over its root
  breed.drawTail(canvas, p, c, shade);

  // body: barrel + rump bulge + chest bulge
  if (breed.drawBody) breed.drawBody(canvas, p, c);
  else {
    canvas.ellipse(p(14), p(19), p(9.5), p(5), c.body);
    canvas.ellipse(p(9), p(18.5), p(4.5), p(5.5), c.body); // haunch
    canvas.ellipse(p(19.5), p(18), p(4), p(5), c.body); // chest
  }

  // legs
  if (breed.drawLegs) breed.drawLegs(canvas, p, c, G, shade);
  else stdLegs(canvas, p, c, G, shade);

  // neck + head + muzzle (side profile)
  canvas.rect(p(G.neck[0]), p(G.neck[1]), p(G.neck[2]), p(G.neck[3]), c.body);
  canvas.circle(p(G.headCx), p(G.headCy), p(G.headR), c.body);
  canvas.rect(
    p(G.muzzle[0]),
    p(G.muzzle[1]),
    p(G.muzzle[2]),
    p(G.muzzle[3]),
    c.muzzle,
  );

  // ears (near ear + darker far-ear hint)
  breed.drawEars(canvas, p, c, shade);

  // markings before the face features so masks never cover the eye
  if (breed.drawMarkings) breed.drawMarkings(canvas, p, c, G);

  // single side-view eye + nose tip
  canvas.rect(p(G.eye[0]), p(G.eye[1]), p(1), p(2), c.eye);
  canvas.rect(p(G.nose[0]), p(G.nose[1]), p(2), p(1), c.nose);
  canvas.set(p(G.nose[0] + 1), p(G.nose[1] + 1), c.nose);

  canvas.outline(0.45);
}

// ── Breed definitions ─────────────────────────────────────────────────────────
const BREEDS = {
  // 柴犬 ─────────────────────────────────────────────────────────────────────
  shiba: {
    name: "柴犬 (Shiba Inu)",
    colors: {
      body: "#D9702E",
      muzzle: "#F7E3BC", // urajiro cream
      eye: "#2C0A00",
      nose: "#111111",
      paw: "#F7E3BC",
    },
    drawTail(cv, p, c) {
      // tightly curled tail resting over the rump
      cv.circle(p(6), p(12), p(2.8), c.body);
      cv.rect(p(5), p(13), p(3), p(1), c.muzzle); // cream underside of curl
      cv.rect(p(6), p(14), p(2), p(3), c.body); // root down to the back
    },
    drawEars(cv, p, c, shade) {
      // small pricked triangles; far ear peeks behind
      cv.rect(p(20), p(3), p(3), p(3), shade);
      cv.set(p(21), p(2), shade);
      cv.rect(p(24), p(3), p(3), p(3), c.body);
      cv.set(p(25), p(2), c.body);
      cv.set(p(25), p(4), c.muzzle); // cream inner
    },
    drawMarkings(cv, p, c) {
      cv.ellipse(p(19.5), p(20), p(2.5), p(3), c.muzzle); // cream chest
      cv.ellipse(p(13), p(23), p(4), p(1.4), c.muzzle); // cream belly
      cv.ellipse(p(24.5), p(12), p(2), p(1.3), c.muzzle); // cream cheek
    },
  },

  // コーギー ──────────────────────────────────────────────────────────────────
  corgi: {
    name: "コーギー (Corgi)",
    colors: {
      body: "#E08A3C",
      muzzle: "#FFFAF0",
      eye: "#2C0A00",
      nose: "#111111",
      white: "#FFFAF0",
      paw: "#FFFAF0",
      inner: "#FFB090",
    },
    geo: {
      headCy: 10,
      neck: [19, 12, 6, 6],
      muzzle: [27, 9, 4, 3],
      eye: [25, 9],
      nose: [30, 9],
      legTop: 26,
      legH: 5, // famously short legs
    },
    drawBody(cv, p, c) {
      // long, low loaf of a body
      cv.ellipse(p(14), p(21), p(10), p(4.5), c.body);
      cv.ellipse(p(9), p(20.5), p(4.5), p(5), c.body);
      cv.ellipse(p(20), p(20), p(4), p(4.5), c.body);
    },
    drawTail(cv, p, c) {
      cv.rect(p(3), p(17), p(3), p(2), c.body); // tiny nub
    },
    drawEars(cv, p, c, shade) {
      // oversized rounded upright ears
      cv.rect(p(20), p(3), p(3), p(4), shade);
      cv.set(p(21), p(2), shade);
      cv.rect(p(24), p(2), p(4), p(5), c.body);
      cv.rect(p(25), p(1), p(2), p(1), c.body);
      cv.rect(p(25), p(3), p(2), p(3), c.inner); // pink inner
    },
    drawMarkings(cv, p, c) {
      cv.ellipse(p(19.5), p(21), p(3), p(3.5), c.white); // white chest
      cv.ellipse(p(13), p(24), p(5.5), p(1.5), c.white); // white belly
      cv.rect(p(25), p(7), p(2), p(3), c.white); // white blaze up the face
    },
  },

  // ダルメシアン ────────────────────────────────────────────────────────────────
  dalmatian: {
    name: "ダルメシアン (Dalmatian)",
    colors: {
      body: "#FFFFFF",
      muzzle: "#FFFFFF",
      eye: "#111111",
      nose: "#111111",
      spot: "#1A1A1A",
      shade: "#C9C9C9",
    },
    drawTail(cv, p, c) {
      // thin tail carried up in a gentle curve
      cv.rect(p(4), p(14), p(2), p(3), c.body);
      cv.rect(p(3), p(11), p(2), p(3), c.body);
      cv.set(p(4), p(10), c.body);
    },
    drawEars(cv, p, c) {
      // black drop ear hanging on the side of the head
      cv.ellipse(p(22.5), p(10), p(1.6), p(2.8), c.spot);
    },
    drawMarkings(cv, p, c) {
      // random spots scattered over the body
      let n = 8 + Math.floor(rng() * 4);
      for (let i = 0; i < 60 && n > 0; i++) {
        const x = 6 + rng() * 16;
        const y = 14 + rng() * 9;
        const dx = (x - 14) / 9.5;
        const dy = (y - 19) / 5;
        if (dx * dx + dy * dy <= 0.72) {
          cv.circle(p(x), p(y), p(1.2), c.spot);
          n--;
        }
      }
      cv.circle(p(26), p(6), p(1.1), c.spot); // one spot on the crown
    },
  },

  // ゴールデンレトリバー ─────────────────────────────────────────────────────────
  golden: {
    name: "ゴールデンレトリバー (Golden Retriever)",
    colors: {
      body: "#D89A2B",
      muzzle: "#E8BC55",
      eye: "#2C0A00",
      nose: "#111111",
      light: "#EDCB6B",
      ear: "#B87E14",
    },
    geo: { muzzle: [27, 8, 5, 3], nose: [31, 8] }, // longer retriever snout
    drawTail(cv, p, c) {
      // feathered plume swept upward
      cv.rect(p(5), p(14), p(2), p(3), c.body);
      cv.ellipse(p(4), p(11), p(1.8), p(3.2), c.body);
      cv.set(p(3), p(9), c.light);
      cv.set(p(4), p(8), c.light);
    },
    drawEars(cv, p, c) {
      // floppy ear hanging over the side of the head
      cv.ellipse(p(22), p(11), p(1.8), p(3.2), c.ear);
    },
    drawMarkings(cv, p, c) {
      cv.ellipse(p(19.5), p(20), p(2.5), p(3), c.light); // lighter chest
      cv.ellipse(p(13), p(23), p(4.5), p(1.4), c.light); // lighter belly
    },
  },

  // シベリアンハスキー ────────────────────────────────────────────────────────────
  husky: {
    name: "シベリアンハスキー (Husky)",
    colors: {
      body: "#8A8F98",
      muzzle: "#FFFFFF",
      eye: "#4FC3F7", // blue eyes!
      nose: "#111111",
      white: "#FFFFFF",
      dark: "#4A4F58",
      paw: "#FFFFFF",
    },
    drawTail(cv, p, c) {
      // bushy tail curled up over the back
      cv.circle(p(7), p(11), p(2.8), c.body);
      cv.rect(p(6), p(12), p(4), p(1), c.white); // white underside
      cv.rect(p(7), p(13), p(2), p(4), c.body);
    },
    drawEars(cv, p, c, shade) {
      // pricked wolf ears, white inner
      cv.rect(p(20), p(3), p(3), p(3), shade);
      cv.set(p(21), p(2), shade);
      cv.rect(p(24), p(3), p(3), p(3), c.body);
      cv.set(p(25), p(2), c.body);
      cv.set(p(25), p(4), c.white);
    },
    drawMarkings(cv, p, c) {
      cv.ellipse(p(12.5), p(16), p(6), p(2), c.dark); // dark saddle on the back
      cv.ellipse(p(14), p(22.5), p(7), p(2), c.white); // white belly
      cv.ellipse(p(19.5), p(19.5), p(3), p(3.5), c.white); // white chest
      cv.ellipse(p(24.5), p(11.5), p(2.2), p(1.5), c.white); // white cheek
      cv.set(p(25), p(6), c.white); // eyebrow dot
    },
  },

  // ダックスフント ───────────────────────────────────────────────────────────────
  dachshund: {
    name: "ダックスフント (Dachshund)",
    colors: {
      body: "#5C2000",
      muzzle: "#A0522D",
      eye: "#1A0A00",
      nose: "#111111",
      tan: "#A0522D",
      paw: "#A0522D",
      ear: "#3E1400",
    },
    geo: {
      headCx: 25,
      headCy: 12,
      headR: 3.6,
      neck: [22, 14, 4, 5],
      muzzle: [28, 11, 4, 2], // long slim snout
      eye: [26, 11],
      nose: [30, 11],
      legTop: 26,
      legH: 5,
      frontX: 22,
      backX: 6,
    },
    drawBody(cv, p, c) {
      // extra-long, low-slung sausage body
      cv.ellipse(p(15), p(22), p(12), p(4), c.body);
      cv.ellipse(p(6), p(21.5), p(3.5), p(4), c.body);
      cv.ellipse(p(24), p(21), p(3.5), p(4), c.body);
    },
    drawTail(cv, p, c) {
      cv.rect(p(2), p(18), p(3), p(2), c.body);
      cv.rect(p(1), p(16), p(2), p(3), c.body);
    },
    drawEars(cv, p, c) {
      // long floppy ear draped down the side of the head
      cv.ellipse(p(23.5), p(13.5), p(1.7), p(3.2), c.ear);
    },
    drawMarkings(cv, p, c) {
      cv.ellipse(p(24.5), p(22), p(2), p(2.5), c.tan); // tan chest
      cv.set(p(26), p(9), c.tan); // tan eyebrow pip
    },
  },

  // プードル ─────────────────────────────────────────────────────────────────────
  poodle: {
    name: "プードル (Poodle)",
    colors: {
      body: "#EDEAE4",
      muzzle: "#D8D2C8",
      eye: "#111111",
      nose: "#111111",
      pom: "#FBF9F5",
      shade: "#C4BEB2",
    },
    geo: { muzzle: [27, 8, 4, 2] }, // shaved slim muzzle
    drawTail(cv, p, c) {
      // thin stem + pom-pom
      cv.rect(p(5), p(13), p(2), p(4), c.body);
      cv.circle(p(5.5), p(11), p(2), c.pom);
    },
    drawBody(cv, p, c) {
      // fluffy rounded coat
      cv.ellipse(p(14), p(19), p(9.5), p(5), c.body);
      cv.circle(p(9), p(17), p(4), c.pom);
      cv.circle(p(19), p(17), p(4), c.pom);
      cv.ellipse(p(14), p(21), p(8), p(3), c.body);
    },
    drawEars(cv, p, c) {
      // pom-pom drop ear
      cv.circle(p(21.5), p(12), p(2.2), c.pom);
    },
    drawLegs(cv, p, c, G, shade) {
      // slender shaved legs + pom-pom ankles
      cv.rect(p(17), p(24), p(1), p(6), shade);
      cv.rect(p(11), p(24), p(1), p(6), shade);
      cv.rect(p(20), p(23), p(2), p(7), c.body);
      cv.rect(p(8), p(23), p(2), p(7), c.body);
      cv.circle(p(21), p(28.5), p(1.6), c.pom);
      cv.circle(p(9), p(28.5), p(1.6), c.pom);
    },
    drawMarkings(cv, p, c) {
      cv.circle(p(24), p(4), p(2.6), c.pom); // head topknot
    },
  },
};

// ── Main ──────────────────────────────────────────────────────────────────────
const BREED_KEYS = Object.keys(BREEDS);

let breed;
if (BREED_ARG === "random") {
  breed = BREEDS[BREED_KEYS[Math.floor(rng() * BREED_KEYS.length)]];
} else {
  breed = BREEDS[BREED_ARG];
  if (!breed) {
    process.stderr.write(
      `Unknown breed "${BREED_ARG}". Run with --list for options.\n`,
    );
    process.exit(1);
  }
}

const canvas = new Canvas(SIZE, SIZE);
drawDog(canvas, breed);

const svg = canvas.toSVG();

if (OUTPUT) {
  fs.writeFileSync(OUTPUT, svg, "utf8");
  process.stderr.write(`✓ ${breed.name} · ${SIZE}×${SIZE}px → ${OUTPUT}\n`);
} else {
  process.stdout.write(svg);
}

if (PREVIEW || OUTPUT) {
  process.stderr.write("\n" + breed.name + "\n");
  process.stderr.write(canvas.toTerminal());
}
