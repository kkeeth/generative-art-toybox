// Ship Line Art
// デフォルメした船・潜水艦を「認識できる最小限のライン」だけで描く。
// 輪郭はわざと途切れさせ、セグメントごとに色を変える。
//
// click : 乗り物を切り替え (コンテナ船 → 潜水艦 → ヨット)
// space : 配色をシャッフル
// s     : GIF保存 / c : JPEG保存

let W;
let vessels;
let vesselIndex = 0;
let colorSeed = 4649;

// 例画像のようなビビッドな色
const PALETTE = [
  '#00a99d', // teal
  '#ec008c', // magenta
  '#ed1c24', // red
  '#2e5fe8', // blue
  '#2e3192', // navy
  '#8dc63f', // green
  '#f7941d', // orange
  '#f49ac1', // pink
  '#6dcff6', // light blue
];

// ---- 形状データ --------------------------------------------------
// 座標は x:0..100 / y:0..60 の正規化空間 (yは下向き)
// stroke の種類:
//   { pts: [[x,y],...] }              折れ線
//   { circle: [cx, cy, r] }           円
//   { arc: [cx, cy, rx, ry, a0, a1] } 弧 (角度は度、時計回り、0°=右)

function containerShip() {
  return {
    name: 'container ship',
    waveY: 51,
    strokes: [
      // 船体 (途切れさせる)
      { pts: [[6, 34], [11, 47], [46, 47]], w: 1.2 },
      { pts: [[53, 47], [87, 47], [96, 33]], w: 1.2 },
      // デッキライン
      { pts: [[4, 33], [40, 33]] },
      { pts: [[47, 33], [96, 33]] },
      // ブリッジ (船尾側)
      { pts: [[9, 33], [9, 13], [21, 13], [21, 33]] },
      { pts: [[11, 17], [19, 17]], w: 0.7 },
      { pts: [[11, 21], [19, 21]], w: 0.7 },
      // 煙突と煙
      { pts: [[13, 13], [13.5, 8], [17.5, 8], [18, 13]] },
      { circle: [20, 5, 1.6], w: 0.7 },
      { circle: [23.5, 3, 1.1], w: 0.7 },
      // コンテナ段 (横ライン)
      { pts: [[25, 27], [52, 27]] },
      { pts: [[58, 27], [84, 27]] },
      { pts: [[25, 21], [70, 21]] },
      // コンテナ仕切り (縦ライン、全部は描かない)
      { pts: [[25, 33], [25, 21]], w: 0.8 },
      { pts: [[35, 33], [35, 27]], w: 0.8 },
      { pts: [[45, 27], [45, 21]], w: 0.8 },
      { pts: [[55, 33], [55, 27]], w: 0.8 },
      { pts: [[65, 33], [65, 21]], w: 0.8 },
      { pts: [[70, 27], [70, 21]], w: 0.8 },
      { pts: [[75, 33], [75, 27]], w: 0.8 },
      { pts: [[84, 33], [84, 27]], w: 0.8 },
      // 船首マストと灯
      { pts: [[90, 33], [90, 26]], w: 0.8 },
      { circle: [90, 24.5, 1.2], w: 0.7 },
      // アンカー(丸で記号化) と喫水マーク
      { circle: [88, 37.5, 1.8], w: 0.8 },
      { pts: [[91, 41], [94, 40.5]], w: 0.7 },
      { pts: [[90, 44], [93, 43.5]], w: 0.7 },
    ],
  };
}

function submarine() {
  return {
    name: 'submarine',
    waveY: 4, // 潜水艦は水中なので波は上
    bubbles: true,
    strokes: [
      // 船体 (カプセル型、弧を途切れさせる)
      { arc: [50, 32, 42, 11, 190, 268], w: 1.2 },
      { arc: [50, 32, 42, 11, 282, 352], w: 1.2 },
      { arc: [50, 32, 42, 11, 8, 80], w: 1.2 },
      { arc: [50, 32, 42, 11, 94, 172], w: 1.2 },
      // セイル (艦橋)
      { pts: [[38, 21.5], [40, 11], [54, 11], [55.5, 21.3]] },
      // セイルの潜舵
      { pts: [[38.5, 15], [32.5, 15]], w: 0.8 },
      { pts: [[55, 15], [61, 15]], w: 0.8 },
      // ペリスコープ & アンテナ
      { pts: [[45, 11], [45, 6], [49, 6]], w: 0.8 },
      { pts: [[50.5, 11], [50.5, 3.5]], w: 0.8 },
      // 艦尾の舵
      { pts: [[14, 25.5], [9.5, 20.5]], w: 0.9 },
      { pts: [[14, 38.5], [9.5, 43.5]], w: 0.9 },
      // スクリュー
      { circle: [4.8, 32, 1.5], w: 0.8 },
      { pts: [[4, 30.3], [1.8, 25.5]], w: 0.8 },
      { pts: [[4, 33.7], [1.8, 38.5]], w: 0.8 },
      // 舷窓
      { circle: [28, 34, 1.9], w: 0.8 },
      { circle: [38, 34.5, 1.9], w: 0.8 },
      { circle: [48, 34.5, 1.9], w: 0.8 },
      { circle: [58, 34, 1.9], w: 0.8 },
      // 魚雷発射管 (船首の短い線)
      { pts: [[80, 29], [88, 29]], w: 0.7 },
    ],
  };
}

function sailboat() {
  return {
    name: 'sailboat',
    waveY: 49,
    strokes: [
      // 船体
      { pts: [[16, 38], [24, 45], [74, 45], [86, 36]], w: 1.2 },
      // デッキライン
      { pts: [[14, 37], [48, 37]] },
      { pts: [[54, 37], [87, 36]] },
      // マスト
      { pts: [[52, 36], [52, 6]] },
      // メインセイル (マストの左、リーチは緩いカーブ)
      { pts: [[51, 10], [51, 34], [28, 34]] },
      { pts: [[28, 34], [36, 26], [44, 17], [51, 10]] },
      // ジブ (船首側)
      { pts: [[84, 35], [53.5, 12], [56, 35]] },
      // ペナント (旗)
      { pts: [[52.5, 5.5], [58.5, 7], [52.5, 8.5]], w: 0.8 },
      // 舷窓
      { circle: [34, 41, 1.5], w: 0.8 },
      { circle: [42, 41.2, 1.5], w: 0.8 },
      { circle: [50, 41.2, 1.5], w: 0.8 },
    ],
  };
}

// ---- 描画 --------------------------------------------------------

function setup() {
  createCanvas((W = min(windowWidth, windowHeight) - 50), W);
  strokeCap(ROUND);
  strokeJoin(ROUND);
  noFill();
  vessels = [containerShip(), submarine(), sailboat()];
}

function draw() {
  background(252);
  randomSeed(colorSeed);

  const v = vessels[vesselIndex];
  const t = millis() * 0.0004;
  const s = W / 110; // 正規化空間 → キャンバス

  push();
  // ゆったり浮遊
  translate(width / 2, height / 2 + sin(t * 2) * W * 0.008);
  rotate(sin(t * 1.3) * 0.012);
  translate(-50 * s, -30 * s);
  scale(s);

  let id = 0;
  for (const st of v.strokes) {
    stroke(random(PALETTE));
    strokeWeight((st.w || 1) * 0.85 * (0.9 + random(0.3)));
    drawWobbly(strokePoints(st), id++, t);
  }

  drawWaves(v, t);
  if (v.bubbles) drawBubbles(t);
  pop();
}

// stroke データを点列に変換
function strokePoints(st) {
  if (st.pts) return resample(st.pts, 2.5);
  if (st.circle) {
    const [cx, cy, r] = st.circle;
    return arcPoints(cx, cy, r, r, 0, 360);
  }
  if (st.arc) {
    const [cx, cy, rx, ry, a0, a1] = st.arc;
    return arcPoints(cx, cy, rx, ry, a0, a1);
  }
  return [];
}

function arcPoints(cx, cy, rx, ry, a0, a1) {
  const pts = [];
  const n = max(12, floor(abs(a1 - a0) / 6));
  for (let i = 0; i <= n; i++) {
    const a = radians(lerp(a0, a1, i / n));
    pts.push([cx + cos(a) * rx, cy + sin(a) * ry]);
  }
  return pts;
}

// 折れ線を一定間隔に再分割 (揺らぎを均一にかけるため)
function resample(pts, step) {
  const out = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const d = dist(x0, y0, x1, y1);
    const n = max(1, ceil(d / step));
    for (let k = 1; k <= n; k++) {
      out.push([lerp(x0, x1, k / n), lerp(y0, y1, k / n)]);
    }
  }
  return out;
}

// ノイズで揺らした線を描く (手描き感)
function drawWobbly(pts, id, t) {
  const amp = 1.1;
  const wobbled = pts.map(([x, y], i) => [
    x + (noise(i * 0.18, id * 7.3, t) - 0.5) * amp,
    y + (noise(i * 0.18, id * 7.3 + 100, t) - 0.5) * amp,
  ]);
  curveLine(wobbled);
}

// curveVertex は最初と最後が制御点扱いなので端を複製して端まで描く
function curveLine(pts) {
  beginShape();
  curveVertex(pts[0][0], pts[0][1]);
  for (const [x, y] of pts) curveVertex(x, y);
  const last = pts[pts.length - 1];
  curveVertex(last[0], last[1]);
  endShape();
}

// 波 (横に流れる)
function drawWaves(v, t) {
  const y0 = v.waveY;
  randomSeed(colorSeed + 99);
  for (let j = 0; j < 3; j++) {
    stroke(random(PALETTE));
    strokeWeight(0.7);
    const y = y0 + j * 3.2;
    const x0 = 8 + j * 6;
    const x1 = 92 - j * 6;
    const pts = [];
    for (let x = x0; x <= x1; x += 2) {
      pts.push([x, y + sin(x * 0.35 + t * 6 + j * 2) * 1.1]);
    }
    curveLine(pts);
  }
}

// 潜水艦用の泡
function drawBubbles(t) {
  randomSeed(colorSeed + 7);
  for (let i = 0; i < 4; i++) {
    stroke(random(PALETTE));
    strokeWeight(0.6);
    const phase = (t * 1.5 + i * 0.25) % 1;
    const x = 82 + i * 4 + sin(t * 8 + i) * 1.5;
    const y = lerp(20, 6, phase);
    const r = lerp(1.8, 0.7, phase);
    drawWobbly(arcPoints(x, y, r, r, 0, 360), 50 + i, t);
  }
}

// ---- 操作 --------------------------------------------------------

function mousePressed() {
  vesselIndex = (vesselIndex + 1) % vessels.length;
  colorSeed = floor(millis()) % 100000;
}

function keyPressed() {
  if (key === ' ') colorSeed = floor(millis()) % 100000;

  if (key === 's') {
    saveGif(`mySketch-${round(new Date().getTime() / 100000)}`, 5);
  }

  if (key === 'c') {
    saveCanvas(`mySketch-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }
}
