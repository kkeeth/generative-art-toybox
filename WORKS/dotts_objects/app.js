let vmin, vmax;
let cx, cy;
let ctx;
let pg;
let dotArr = [];
let NUM = 1000;
let modeArr = ["line-V", "cross-+", "cross-X", "circle", "sin", "sin-circle"];
let tmpMode = "sin";

let P = Math.PI;
let P2 = P * 2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  vmin = min(width, height);
  vmax = max(width, height);
  cx = width / 2;
  cy = height / 2;

  for (let i = 0; i < NUM; i++) {
    let pos = createVector(random(width), random(height));
    dotArr.push({
      i,
      pos,
      targetPos: pos.copy(),
      r: random(1, 4),
      e: random(0.01, 0.2),
    });
  }

  mode = random(modeArr);
}

function draw() {
  let sec = millis() / 1000;
  blendMode(BLEND);
  background(0);
  blendMode(ADD);

  for (let i = 0; i < dotArr.length; i++) {
    let { pos, targetPos, r, e } = dotArr[i];

    if (mode === "sin") {
      targetPos.x = map(i, 0, NUM - 1, 0, width);
      targetPos.y =
        cy + sin(map(i, 0, NUM - 1, 0, 1) * PI * 4 + sec) * vmin * 0.15;
    } else if (mode === "sin-circle") {
      let a = map(i, 0, NUM - 1, 0, P2);
      let r =
        vmin * 0.3 + sin(map(i, 0, NUM - 1, 0, 1) * P * 10 + sec) * vmin * 0.05;
      targetPos.x = cx + cos(a) * r;
      targetPos.y = cy + sin(a) * r;
    }

    pos.x += (targetPos.x - pos.x) * e;
    pos.y += (targetPos.y - pos.y) * e;

    noStroke();
    fill(255);
    let nx = noise(i, sec) * 10;
    let ny = noise(i, sec + 123.4567) * 10;
    circle(pos.x + nx, pos.y + ny, r);
  }

  if (frameCount % 100 === 0) {
    do {
      tmpMode = random(modeArr);
    } while (mode === tmpMode);
    mode = tmpMode;
    switchMode(mode);
  }
}

function switchMode(mode) {
  for (let { i, targetPos } of dotArr) {
    let rnd = random() < 0.5;
    const tmpX = random(width);
    const tmpY = random(height);

    switch (mode) {
      case "line-V": {
        targetPos.x = tmpX;
        const realYPos = map(targetPos.x, 0, cx, 0, height);

        targetPos.y = targetPos.x < cx ? realYPos : 2 * height - realYPos;
        break;
      }
      case "cross-+": {
        targetPos.x = rnd ? cx : tmpX;
        targetPos.y = rnd ? tmpY : cy;
        break;
      }
      case "cross-X": {
        let len = random((sqrt(2) * vmin) / 2);
        let a = floor(random(4)) * (P / 2) + P / 4;
        targetPos.x = cx + cos(a) * len;
        targetPos.y = cy + sin(a) * len;
        break;
      }
      case "circle": {
        let a = random(P2);
        let r = vmin * 0.3;
        targetPos.x = cx + cos(a) * r;
        targetPos.y = cy + sin(a) * r;
        break;
      }
    }
  }
}

// function mousePressed() {
//   switchMode();
// }
