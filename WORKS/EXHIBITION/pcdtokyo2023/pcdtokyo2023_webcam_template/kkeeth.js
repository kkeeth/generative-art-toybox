// グローバル変数を定義するときは、変数名の頭に"作者名_"を追加
const kkeeth_mode = ["blossoms", "snowflakes", "flowers", "dotts"];
const kkeeth_cp = [
  "#e6302b",
  "#fd7800",
  "#fbd400",
  "#51b72d",
  "#2abde4",
  "#4e59a4",
  "#085a9b",
  "#f477c3",
];
const kkeeth_targetIndex = 21; //[4, 8, 12, 16, 20];
const kkeeth_ulim = 0.8;
const kkeeth_petals = [];
const kkeeth_num = 100;

let kkeeth_seed;
let kkeeth_handsfree;
let kkeeth_capture = 0;
let kkeeth_bc = 255;
let kkeeth_selectedMode = kkeeth_mode[0];
let kkeeth_hands;
let kkeeth_items = [];
let kkeeth_closedFlags = [];
let kkeeth_flowers = [];
let kkeeth_xoff = 0.0;
let kkeeth_boff = 0.0;

function kkeeth_setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  changeMode();
  kkeeth_seed = ~~random(99);
  let w = width / 60;

  for (let i = 0; i < kkeeth_num; i++) {
    kkeeth_petals[i] = new CherryBlossom();
    let h = random(height / 4, height / 2);
    if (i < 60) {
      kkeeth_flowers[i] = new Flower(
        random() < 0.5
          ? random(0, (3 * width) / 4)
          : random((2 * width) / 3, width - w / 4),
        random(h / 2, height - h / 2),
        w,
      );
    }

    kkeeth_items[i] = {
      x: random(width),
      y: random(height),
      size: random(5, 20),
      op: random(255),
      vx: random(20, 50),
      vy: random(1, 5),
    };
  }

  for (let i = 0; i < kkeeth_targetIndex.length; i++) {
    kkeeth_closedFlags[i] = false;
  }
  kkeeth_handsfree = new Handsfree({
    showDebug: false,
    face: false,
    pose: false,
    hands: {
      enabled: true,
      // The maximum number of hands to detect [0 - 4]
      maxNumHands: 2,

      // Minimum confidence [0 - 1] for a hand to be considered detected
      minDetectionConfidence: 0.5,

      // Minimum confidence [0 - 1] for the landmark tracker to be considered detected
      // Higher values are more robust at the expense of higher latency
      minTrackingConfidence: 0.5,
    },
  });
  kkeeth_handsfree.enablePlugins("browser");
  kkeeth_handsfree.start();

  // init
  const handsDoms = document.querySelectorAll(
    ".handsfree-canvas, .handsfree-video, .handsfree-pointer",
  );
  handsDoms.forEach((dom) => {
    dom.remove();
  });
}

function kkeeth_draw() {
  push();
  background(kkeeth_bc);

  if (kkeeth_selectedMode !== "dotts") {
    push();
    translate(camImg.width, 0);
    scale(-1, 1);
    image(capture, 0, 0, camImg.width, camImg.height);
    pop();
  }

  noStroke();
  kkeeth_hands = kkeeth_handsfree.data?.hands;

  if (kkeeth_selectedMode === "blossoms") {
    for (let petal of kkeeth_petals) {
      petal.update();
      petal.render();
    }
  } else if (kkeeth_selectedMode === "snowflakes") {
    for (let i = 0; i < kkeeth_num; i++) {
      fill(255, kkeeth_items[i].op);
      ellipse(
        kkeeth_items[i].x + sin((i + kkeeth_xoff) / 20) * kkeeth_items[i].vx,
        (kkeeth_items[i].y += kkeeth_items[i].vy),
        kkeeth_items[i].size,
        kkeeth_items[i].size,
      );

      if (kkeeth_items[i].y > height) {
        kkeeth_items[i].y = 0;
        kkeeth_items[i].x = random(width);
      }
    }
    kkeeth_xoff++;

    if (
      kkeeth_hands?.multiHandLandmarks[0] ||
      kkeeth_hands?.multiHandLandmarks[1]
    ) {
      const hand_0 = kkeeth_hands.multiHandLandmarks[0];

      for (let i = 0; i < kkeeth_num; i++) {
        kkeeth_items[i].x +=
          (hand_0[kkeeth_targetIndex].x * 2 - 1) * kkeeth_items[i].vx;
      }
    }
  } else if (kkeeth_selectedMode === "flowers") {
    for (let item of kkeeth_flowers) {
      item.update();
      item.show();
    }
    kkeeth_boff += 0.1;
  } else if (kkeeth_selectedMode === "dotts") {
    let step = int(map(mouseX, 0, width, 20, 50));

    if (camImg) {
      camImg.loadPixels();
      for (let y = 0; y < camImg.height; y += step) {
        for (let x = 0; x < camImg.width; x += step) {
          let r = camImg.pixels[(y * camImg.width + x) * 4];
          let dir = map(r, 0, 255, step, 3);

          let pixel = camImg.get(x, y);
          fill(pixel);
          circle(x, y, dir);
        }
      }
    }
  }

  // 時間切れのためにコメントアウト
  // if (!kkeeth_hands?.multiHandLandmarks) return;
  // if (
  //   kkeeth_hands?.multiHandLandmarks[0] &&
  //   kkeeth_hands?.multiHandLandmarks[1]
  // ) {
  //   const hand_0 = kkeeth_hands.multiHandLandmarks[0];
  //   const hand_1 = kkeeth_hands.multiHandLandmarks[1];
  //   console.log(hand_0[kkeeth_targetIndex].x, hand_1[kkeeth_targetIndex].x);
  //   if (hand_0[kkeeth_targetIndex] && hand_1[kkeeth_targetIndex]) {
  //     if (
  //       hand_0[kkeeth_targetIndex].x - hand_1[kkeeth_targetIndex].x < 0.01 &&
  //       kkeeth_canChangeMode === true
  //     ) {
  //       kkeeth_canChangeMode = false;
  //       changeMode();
  //     } else {
  //       kkeeth_canChangeMode = true;
  //     }
  //   }
  // }
  pop();
}

class CherryBlossom {
  constructor() {
    this.petalNumber = 4;
    this.petalSize = random(30, 70);

    // color settings
    this.r = floor(random(245, 255));
    this.g = 219;
    this.b = 237;
    this.alpha = 1; //random(0.7, 1);

    // moving petals
    this.xBase = random(width);
    this.xRadius = random(50, 100);
    this.xTheta = random(360);
    this.xaVelocity = random(1, 2);
    this.xwVelocity = random(20, 40);

    this.vecLocation = createVector(this.xBase, random(height));
    this.yVelocity = this.petalSize / 30;
  }

  /**
   * calculate each processings
   */
  update() {
    this.vecLocation.x = this.xBase + this.xRadius * sin(radians(this.xTheta));
    if (this.vecLocation.x > width) this.xBase = -this.petalSize;
    else if (this.vecLocation.x < 0) this.xBase = width + this.petalSize;

    if (
      kkeeth_hands?.multiHandLandmarks[0] ||
      kkeeth_hands?.multiHandLandmarks[1]
    ) {
      const hand_0 = kkeeth_hands.multiHandLandmarks[0];

      this.xBase += (hand_0[kkeeth_targetIndex].x * 2 - 1) * this.xwVelocity;
    }

    this.xTheta += this.xaVelocity;

    this.vecLocation.y += this.yVelocity;
    if (this.vecLocation.y > height) this.vecLocation.y = -this.petalSize;
  }

  /**
   * h(x):=if(x<ulim,0,ulim-x);
   *
   * @param {number} x angle(radians)
   */
  calculateH(x) {
    if (x < kkeeth_ulim) return 0;
    else return kkeeth_ulim - x;
  }

  render() {
    fill(`rgba(${this.r}, ${this.g} , ${this.b}, ${this.alpha})`);

    push();
    translate(this.vecLocation.x, this.vecLocation.y);
    // translate(this.vecLocation.x - width / 2, this.vecLocation.y - height / 2);
    rotate(radians(this.xTheta));
    // rotateX(radians(this.xTheta));
    // rotateY(radians(this.xTheta));
    // lights();
    beginShape();

    for (let theta = 0; theta < TWO_PI / this.petalNumber; theta += 0.01) {
      // n/pi*x
      const A = (this.petalNumber / PI) * theta;
      // mod(floor(n/pi*x),2)
      const mod = floor(A) % 2;
      // r0(x):=(-1)^mod(floor(n/pi*x),2)*(n/pi*x-floor(n/pi*x))+mod(floor(n/pi*x),2);
      const r0 = pow(-1, mod) * (A - floor(A)) + mod;
      // r(x):=r0(x)+2*h(r0(x));
      const r = r0 + 2 * this.calculateH(r0);

      let x = this.petalSize * r * cos(theta);
      let y = this.petalSize * r * sin(theta);

      vertex(x, y);
    }

    endShape(CLOSE);
    pop();
  }
}

class Flower {
  constructor(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = random(w / 2, w * 2);
    this.r = random(QUARTER_PI);
    this.v = random(10);
    this.n = int(random(5, 10));
    this.size = random(0.5, 2);
    this.color1 = random(kkeeth_cp);
    this.color2 = random(kkeeth_cp);
    if (this.color1 === this.color2) this.color2 = random(kkeeth_cp);
    this.rotationSpeed = random(0.005, 0.02);
    this.rotationDirection = random([1, -1]);
  }

  update() {
    this.r = map(
      sin(frameCount * this.rotationSpeed) * this.rotationDirection,
      -1,
      1,
      0,
      TAU,
    );
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(this.r);
    console.log(this.w);
    for (let i = 0; i < this.n; i++) {
      fill(lerpColor(color(this.color1), color(this.color2), i / this.n));
      ellipse(1.4 * this.w, 0, 2 * this.w, 0.8 * this.w);
      rotate(TAU / this.n);
    }
    fill(this.color2);
    circle(0, 0, this.w * 0.8);
    pop();
  }
}

function windowResized() {
  resizeCanvas(width, height);
}

function changeMode() {
  kkeeth_selectedMode = random(kkeeth_mode);
}
