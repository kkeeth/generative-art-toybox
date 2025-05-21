const ANIMATION_SPAN = 200; // アニメーションの長さ
const GRID_SIZE = 10; // グリッドのサイズ
const SCALE_FACTOR = 0; // 最小サイズを0に設定
const DELAY_FACTOR = 5; // 隣接する正方形間の遅延

// キャンバス設定
let canvasSize;
let cellSize;
const rectangles = [];

function setup() {
  canvasSize = min(windowWidth, windowHeight) - 200;
  createCanvas(canvasSize, canvasSize);
  noStroke();
  rectMode(CENTER);

  // セルのサイズを計算
  cellSize = canvasSize / GRID_SIZE;

  // グリッド状に正方形を配置
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      // 格子状に配置
      const x = i * cellSize + cellSize / 2;
      const y = j * cellSize + cellSize / 2;
      // 位置による遅延を設定 (左上から右下へ)
      const delay = (i + j) * DELAY_FACTOR;

      rectangles.push(new AnimatedRectangle(x, y, cellSize, cellSize, delay));
    }
  }
}

function draw() {
  background(255);

  // すべての長方形を更新して描画
  for (const rect of rectangles) {
    rect.update();
    rect.display();
  }
}

class AnimatedRectangle {
  constructor(x, y, width, height, delay) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.delay = delay;
    this.timer = 0;
    this.direction = 1; // 1: 増加, -1: 減少
    this.animationProgress = 0;
  }

  update() {
    // 遅延後にアニメーションを開始
    if (frameCount < this.delay) {
      this.animationProgress = 1; // 最初は最大サイズ
      return;
    }

    // タイマーを更新
    this.timer += this.direction;

    // アニメーション方向を切り替え
    if (this.timer >= ANIMATION_SPAN) {
      this.direction = -1;
    } else if (this.timer <= 0) {
      this.direction = 1;
    }

    // イージング関数を適用してアニメーション進捗を計算
    const normalizedTime =
      this.direction === -1
        ? norm(this.timer, 0, ANIMATION_SPAN)
        : norm(this.timer, ANIMATION_SPAN, 0);

    this.animationProgress =
      this.direction === 1
        ? easeInOutQuint(normalizedTime)
        : easeInOutQuint(1 - normalizedTime);
  }

  display() {
    // サイズをアニメーション進捗に基づいて補間
    const currentWidth =
      lerp(SCALE_FACTOR, 1, this.animationProgress) * this.width;
    const currentHeight =
      lerp(SCALE_FACTOR, 1, this.animationProgress) * this.height;

    fill(0);
    rect(this.x, this.y, currentWidth, currentHeight);
  }
}

// イージング関数（5次元の入出力補間）
function easeInOutQuint(x) {
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - pow(-2 * x + 2, 5) / 2;
}

// キーボード操作
function keyPressed() {
  if (key === 's') {
    saveGif(`animation-${round(new Date().getTime() / 100000)}`, 7.2);
  } else if (key === 'c') {
    saveCanvas(`screenshot-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }
}
