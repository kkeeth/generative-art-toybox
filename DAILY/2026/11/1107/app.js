// 2026-11-07 Daily 04 — 途切れるカラーライン: マイク
// Daily 02 / 03 と同じ文法 (サンプルから読み取った要素):
// - 白に近い背景と、たっぷりの余白。モチーフは中央に1つだけ。
// - 塗りはなし。輪郭線だけで形が分かる。
// - 輪郭は1本でつながらず、途切れている。その断片ごとに色が変わる。
// - 線の太さはほぼ均一で、端は丸い。
//
// モチーフは昨日の NACK5 出演にちなんだ、汎用的なスタジオマイク (正面)。
// 直線はきちんと直線に、ヘッドのカプセルとグリルは滑らかな曲線に描く。
// ユーザーの好みにより jitter の既定は 0 (手描き風にしたい場合だけ正の値を入れる)。
//
// ジェネラティブな部分:
// - どこで途切れるか (gap の位置と長さ) と、断片ごとの色順が SEED で決まる。
// - SEED を固定すれば再現でき、変えれば同じ文法で別の1枚になる。
//
// 使い方:
// - [s] PNG保存  [n] 新しいSEEDで描き直し
// - [1] 途切れ少なめ  [2] 標準  [3] 途切れ多め

let SEED = 20261107;

const PARAMS = {
  lineWeight: 5,
  gapRatio: 0.08,   // 途切れが占める割合の目安 (0〜0.6)
  segmentMin: 170,  // 断片の最小の長さ (px)
  segmentMax: 340,  // 断片の最大の長さ (px)
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
//   ヘッド: カプセル x=330..470, y=150..360 (角丸 r=70)
//   ボディ: y=360..480、やや細くなる台形 (上幅80 / 下幅60)
//   スタンド: ポール x=400, y=480..665 / ベース y=665

function buildMotif() {
  const paths = [];

  // ヘッド: カプセル (角丸長方形)
  paths.push({ points: rectPath(330, 150, 140, 210, 70), closed: true });

  // グリル: 横線 (カプセルの曲線の内側に収まるよう x=340..460)
  paths.push({ points: linePath(340, 195, 460, 195), closed: false });
  paths.push({ points: linePath(340, 235, 460, 235), closed: false });
  paths.push({ points: linePath(340, 275, 460, 275), closed: false });
  paths.push({ points: linePath(340, 315, 460, 315), closed: false });
  // グリル: 縦の中心線
  paths.push({ points: linePath(400, 165, 400, 345), closed: false });

  // ヘッドとボディの境目: リング
  paths.push({ points: linePath(330, 360, 470, 360), closed: false });

  // ボディ: 左右の辺 (やや内側にすぼまる) と底辺
  paths.push({ points: linePath(360, 360, 370, 480), closed: false });
  paths.push({ points: linePath(440, 360, 430, 480), closed: false });
  paths.push({ points: linePath(370, 480, 430, 480), closed: false });
  // ボディのリング線とスイッチ
  paths.push({ points: linePath(363, 405, 437, 405), closed: false });
  paths.push({ points: circlePath(400, 442, 8), closed: true });

  // スタンド: ポールとベース
  paths.push({ points: linePath(400, 480, 400, 665), closed: false });
  paths.push({ points: linePath(310, 665, 490, 665), closed: false });

  return paths;
}

// ---- パス生成ヘルパー (Daily 02 / 03 と同じ) ------------------------------

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

  let d = random(0, min(PARAMS.segmentMax * 0.5, total * 0.35));
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
    saveCanvas(`daily-2026-11-07-04-seed-${SEED}`, 'png');
  } else if (key === 'n' || key === 'N') {
    SEED = floor(random(100000, 999999));
    redraw();
  } else if (key === '1') {
    PARAMS.gapRatio = 0.04;
    redraw();
  } else if (key === '2') {
    PARAMS.gapRatio = 0.08;
    redraw();
  } else if (key === '3') {
    PARAMS.gapRatio = 0.16;
    redraw();
  }
}
