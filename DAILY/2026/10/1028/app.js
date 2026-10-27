// 2026-10-28 Daily 03 — 途切れるカラーライン: 自転車
// Daily 02 と同じ文法 (サンプルから読み取った要素):
// - 白に近い背景と、たっぷりの余白。モチーフは中央に1つだけ。
// - 塗りはなし。輪郭線だけで形が分かる。
// - 輪郭は1本でつながらず、途切れている。その断片ごとに色が変わる。
// - 線の太さはほぼ均一で、端は丸い。
//
// モチーフは Daily 02 のレトロゲーム機とは別の、汎用的な自転車 (横向き)。
// 直線のフレームはきちんと直線に、車輪は滑らかな円に描く。
// ユーザーの好みにより jitter の既定は 0 (手描き風にしたい場合だけ正の値を入れる)。
//
// ジェネラティブな部分:
// - どこで途切れるか (gap の位置と長さ) と、断片ごとの色順が SEED で決まる。
// - SEED を固定すれば再現でき、変えれば同じ文法で別の1枚になる。
//
// 使い方:
// - [s] PNG保存  [n] 新しいSEEDで描き直し
// - [1] 途切れ少なめ  [2] 標準  [3] 途切れ多め

let SEED = 20261028;

const PARAMS = {
  lineWeight: 5,
  gapRatio: 0.22,   // 途切れが占める割合の目安 (0〜0.6)
  segmentMin: 34,   // 断片の最小の長さ (px)
  segmentMax: 84,   // 断片の最大の長さ (px)
  jitter: 0,        // 線のブレ (px)。既定は0: 直線はきちんと直線に描く。
};

// サンプルの鮮やかな色。断片ごとにここから選ばれる。
const PALETTE = [
  [0, 169, 157],   // teal
  [244, 114, 182], // pink
  [109, 88, 180],  // purple
  [245, 130, 32],  // orange
  [237, 50, 60],   // red
  [70, 140, 210],  // blue
  [120, 190, 60],  // green
];

function setup() {
  createCanvas(800, 800);
  pixelDensity(2);
  noLoop();
}

function draw() {
  drawArtwork();
}

function drawArtwork() {
  randomSeed(SEED);
  noiseSeed(SEED);
  background(250, 250, 248);

  const paths = buildMotif();

  for (const p of paths) {
    drawSegmentedPath(p.points, p.closed);
  }

  noStroke();
  fill(40, 40, 46, 110);
  textSize(12);
  textAlign(LEFT, BOTTOM);
  text(`SEED ${SEED}  ·  [s] save  [n] new seed  [1/2/3] gaps`, 16, height - 12);
}

// ---- モチーフを「点の列」の集合として定義する ----------------------------
// 座標の見取り図 (800x800):
//   後輪 (280,560) r105 / 前輪 (520,560) r105、地面は y=665
//   BB (400,555)、サドル上端 (355,395)、ヘッドチューブ (480,450)-(490,395)

function buildMotif() {
  const paths = [];

  // 車輪: 後輪と前輪
  paths.push({ points: circlePath(280, 560, 105), closed: true });
  paths.push({ points: circlePath(520, 560, 105), closed: true });
  // ハブ
  paths.push({ points: circlePath(280, 560, 9), closed: true });
  paths.push({ points: circlePath(520, 560, 9), closed: true });

  // フレーム: 後輪 - BB - サドルの三角形
  paths.push({ points: linePath(280, 560, 400, 555), closed: false }); // チェーンステー
  paths.push({ points: linePath(400, 555, 355, 395), closed: false }); // シートチューブ
  paths.push({ points: linePath(355, 395, 280, 560), closed: false }); // シートステー
  // フレーム: BB - ヘッドチューブ - サドルの三角形
  paths.push({ points: linePath(400, 555, 480, 450), closed: false }); // ダウンチューブ
  paths.push({ points: linePath(480, 450, 490, 395), closed: false }); // ヘッドチューブ
  paths.push({ points: linePath(355, 395, 490, 395), closed: false }); // トップチューブ
  // フロントフォーク
  paths.push({ points: linePath(480, 450, 520, 560), closed: false });

  // ハンドル: ステムとバー
  paths.push({ points: linePath(490, 395, 480, 360), closed: false });
  paths.push({ points: linePath(455, 360, 505, 360), closed: false });
  // サドル: シートポストと座面
  paths.push({ points: linePath(355, 395, 355, 388), closed: false });
  paths.push({ points: linePath(330, 388, 380, 388), closed: false });

  // クランク: チェーンリングとペダル
  paths.push({ points: circlePath(400, 555, 22), closed: true });
  paths.push({ points: linePath(400, 555, 435, 595), closed: false });
  paths.push({ points: circlePath(435, 595, 10), closed: true });

  // 地面の線
  paths.push({ points: linePath(170, 665, 630, 665), closed: false });

  return paths;
}

// ---- パス生成ヘルパー (Daily 02 と同じ) -----------------------------------

function sample(pts) {
  if (PARAMS.jitter <= 0) return pts;
  return pts.map(([x, y]) => [
    x + random(-PARAMS.jitter, PARAMS.jitter),
    y + random(-PARAMS.jitter, PARAMS.jitter),
  ]);
}

function rectPath(x, y, w, h, r) {
  const pts = [];
  const edge = (x1, y1, x2, y2) => {
    for (let t = 0; t <= 1.0001; t += 0.04) pts.push([lerp(x1, x2, t), lerp(y1, y2, t)]);
  };
  const arc = (cx, cy, a0, a1) => {
    for (let a = a0; a <= a1 + 0.0001; a += 0.08) pts.push([cx + cos(a) * r, cy + sin(a) * r]);
  };
  edge(x + r, y, x + w - r, y);
  arc(x + w - r, y + r, -HALF_PI, 0);
  edge(x + w, y + r, x + w, y + h - r);
  arc(x + w - r, y + h - r, 0, HALF_PI);
  edge(x + w - r, y + h, x + r, y + h);
  arc(x + r, y + h - r, HALF_PI, PI);
  edge(x, y + h - r, x, y + r);
  arc(x + r, y + r, PI, PI * 1.5);
  return sample(pts);
}

function circlePath(cx, cy, r) {
  const pts = [];
  for (let a = -HALF_PI; a < TWO_PI - HALF_PI; a += 0.06) {
    pts.push([cx + cos(a) * r, cy + sin(a) * r]);
  }
  return sample(pts);
}

function linePath(x1, y1, x2, y2) {
  const pts = [];
  const n = 16;
  for (let i = 0; i <= n; i++) pts.push([lerp(x1, x2, i / n), lerp(y1, y2, i / n)]);
  return sample(pts);
}

function bezierPath(x1, y1, x2, y2, x3, y3, x4, y4) {
  const pts = [];
  for (let t = 0; t <= 1.0001; t += 0.03) {
    pts.push([bezierPoint(x1, x2, x3, x4, t), bezierPoint(y1, y2, y3, y4, t)]);
  }
  return sample(pts);
}

// ---- 途切れながら描く -------------------------------------------------------

function drawSegmentedPath(points, closed) {
  if (points.length < 2) return;
  const pts = closed ? [...points, points[0]] : points;

  const cum = [0];
  for (let i = 1; i < pts.length; i++) {
    cum.push(cum[i - 1] + dist(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1]));
  }
  const total = cum[cum.length - 1];

  let d = random(0, PARAMS.segmentMax * 0.5);
  let lastColor = -1;

  while (d < total) {
    const segLen = random(PARAMS.segmentMin, PARAMS.segmentMax);
    const gapLen = segLen * PARAMS.gapRatio * random(0.5, 1.4);
    const from = d;
    const to = min(d + segLen, total);

    let ci = floor(random(PALETTE.length));
    if (ci === lastColor) ci = (ci + 1) % PALETTE.length;
    lastColor = ci;

    stroke(PALETTE[ci]);
    strokeWeight(PARAMS.lineWeight);
    strokeCap(ROUND);
    noFill();

    beginShape();
    for (let dd = from; dd <= to; dd += 3) {
      const [x, y] = pointAtDistance(pts, cum, dd);
      vertex(x, y);
    }
    const [ex, ey] = pointAtDistance(pts, cum, to);
    vertex(ex, ey);
    endShape();

    d = to + gapLen;
  }
}

function pointAtDistance(pts, cum, d) {
  for (let i = 1; i < cum.length; i++) {
    if (d <= cum[i]) {
      const t = (d - cum[i - 1]) / max(cum[i] - cum[i - 1], 0.0001);
      return [lerp(pts[i - 1][0], pts[i][0], t), lerp(pts[i - 1][1], pts[i][1], t)];
    }
  }
  return pts[pts.length - 1];
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas(`daily-2026-10-28-03-seed-${SEED}`, 'png');
  } else if (key === 'n' || key === 'N') {
    SEED = floor(random(100000, 999999));
    redraw();
  } else if (key === '1') {
    PARAMS.gapRatio = 0.10;
    redraw();
  } else if (key === '2') {
    PARAMS.gapRatio = 0.22;
    redraw();
  } else if (key === '3') {
    PARAMS.gapRatio = 0.40;
    redraw();
  }
}
