// 2026-10-26 Daily 02 — 途切れるカラーライン
// サンプル（ユニクロ UT のラインアートTシャツ）から読み取った要素:
// - 白に近い背景と、たっぷりの余白。モチーフは中央に1つだけ。
// - 塗りはなし。輪郭線だけで形が分かる。
// - 輪郭は1本でつながらず、途切れている。その断片ごとに色が変わる。
// - 線の太さはほぼ均一で、角は丸い。
//
// 真似したのはロゴや絵柄そのものではなく、この「文法」だけ。
// モチーフは汎用的なレトロゲーム機 + コントローラに置き換えた。
//
// ジェネラティブな部分:
// - どこで途切れるか（gap の位置と長さ）と、断片ごとの色順が SEED で決まる。
// - SEED を固定すれば再現でき、変えれば同じ文法で別の1枚になる。
// - PARAMS の gapRatio / segmentMin / segmentMax を触ると表情が変わる。
//
// 使い方:
// - [s] PNG保存  [n] 新しいSEEDで描き直し
// - [1] 途切れ少なめ  [2] 標準  [3] 途切れ多め

let SEED = 20261027;

const PARAMS = {
  lineWeight: 5,
  gapRatio: 0.22,   // 途切れが占める割合の目安 (0〜0.6)
  segmentMin: 34,   // 断片の最小の長さ (px)
  segmentMax: 84,   // 断片の最大の長さ (px)
  jitter: 0,        // 線のブレ (px)。ユーザーの好みにより既定は0:
                    // 線はカタカタさせず、直線はきちんと直線に描く。
                    // 手描き風にしたい場合だけ正の値を入れる
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

function buildMotif() {
  const paths = [];

  // 本体: 角の丸い四角
  paths.push({ points: rectPath(225, 185, 350, 225, 10), closed: true });
  // 本体: 中央の円いフタ
  paths.push({ points: circlePath(400, 297, 108), closed: true });
  paths.push({ points: circlePath(400, 297, 92), closed: true });
  // 本体: 小さなボタン類
  paths.push({ points: circlePath(268, 342, 17), closed: true });
  paths.push({ points: circlePath(268, 382, 26), closed: true });
  paths.push({ points: circlePath(532, 372, 23), closed: true });

  // ケーブル: 本体下からコントローラへ、S字に垂らす
  paths.push({
    points: bezierPath(385, 410, 375, 470, 430, 480, 415, 535),
    closed: false,
  });

  // コントローラ: 中央の横長の体
  paths.push({ points: rectPath(300, 545, 200, 78, 34), closed: true });
  // コントローラ: 左右のグリップ
  paths.push({
    points: bezierPath(308, 590, 275, 640, 268, 700, 305, 705).concat(
      bezierPath(305, 705, 335, 700, 338, 650, 340, 622).reverse()
    ),
    closed: false,
  });
  paths.push({
    points: bezierPath(492, 590, 525, 640, 532, 700, 495, 705).concat(
      bezierPath(495, 705, 465, 700, 462, 650, 460, 622).reverse()
    ),
    closed: false,
  });
  // コントローラ: 左の十字キー周りと右のボタン周り
  paths.push({ points: circlePath(348, 584, 31), closed: true });
  paths.push({ points: circlePath(452, 584, 31), closed: true });
  paths.push({ points: linePath(348, 566, 348, 602), closed: false });
  paths.push({ points: linePath(330, 584, 366, 584), closed: false });
  for (const [bx, by] of [[452, 568], [468, 584], [452, 600], [436, 584]]) {
    paths.push({ points: circlePath(bx, by, 7), closed: true });
  }

  return paths;
}

// ---- パス生成ヘルパー -----------------------------------------------------

function sample(pts) {
  // PARAMS.jitter 分だけ各点を僅かにずらし、手描きの揺れを付ける。
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

  // 累積距離
  const cum = [0];
  for (let i = 1; i < pts.length; i++) {
    cum.push(cum[i - 1] + dist(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1]));
  }
  const total = cum[cum.length - 1];

  let d = random(0, PARAMS.segmentMax * 0.5); // 開始位置をパスごとにずらす
  let lastColor = -1;

  while (d < total) {
    const segLen = random(PARAMS.segmentMin, PARAMS.segmentMax);
    const gapLen = segLen * PARAMS.gapRatio * random(0.5, 1.4);
    const from = d;
    const to = min(d + segLen, total);

    // 前と隣り合わない色を選ぶ
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
    saveCanvas(`daily-2026-10-26-02-seed-${SEED}`, 'png');
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
