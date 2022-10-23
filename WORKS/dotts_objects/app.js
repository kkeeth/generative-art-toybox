let vmin, vmax;
let cx, cy;
let ctx;
let pg;
let dotArr = [];
let NUM = 1000;
let modeArr = [
  "line-V",
  "line-H",
  "cross-+",
  "cross-X",
  "circle",
  "sin",
  "sin-circle",
];

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

  mode = modeArr[0];
}

function draw() {
  let sec = millis() / 1000;
  blendMode(BLEND);
  background(0);
  blendMode(ADD);

  for (let i = 0; i < dotArr.length; i++) {
    let { pos, targetPos, r, e } = dotArr[i];
    pos.x += (targetPos.x - pos.x) * e;
    pos.y += (targetPos.y - pos.y) * e;

    noStroke();
    fill(255);
    let nx = noise(i, sec) * 10;
    let ny = noise(i, sec + 123.4567) * 10;
    circle(pos.x + nx, pos.y + ny, r);
  }

  if (frameCount % 100 === 0) switchMode();
}

function switchMode() {
  mode = random(modeArr);
  let sec = millis() / 1000;

  for (let { i, targetPos, e } of dotArr) {
    let rnd = random() < 0.5;
    switch (mode) {
      case "YUMEMI": {
        const tmpX = random(width);

        // Y
        if (tmpX < width / 6) {
          targetPos.x = width / 6;
          targetPos.y = random(height);
        }
        // U
        else if ((1 / 6) * width <= tmpX && tmpX < (2 / 6) * width) {
          targetPos.x = cx;
          targetPos.y = random(height);
        }
        // M - first
        else if ((2 / 6) * width <= tmpX && tmpX < (3 / 6) * width) {
          targetPos.x = cx;
          targetPos.y = random(height);
        }
        // E
        else if ((3 / 6) * width <= tmpX && tmpX < (4 / 6) * width) {
          targetPos.x = cx;
          targetPos.y = random(height);
        }
        // M - second
        else if ((4 / 6) * width <= tmpX && tmpX < (5 / 6) * width) {
          targetPos.x = cx;
          targetPos.y = random(height);
        }
        // I
        else {
          targetPos.x = (11 / 12) * width;
          targetPos.y = map(
            random(height),
            0,
            height,
            height / 3,
            (2 / 3) * height,
          );
        }
        break;
      }
      case "line-V": {
        targetPos.x = random(width);
        const realYPos = map(targetPos.x, 0, cx, 0, height);

        targetPos.y = targetPos.x < cx ? realYPos : 2 * height - realYPos;
        break;
      }
      case "line-H": {
        const tmpX = random(width);

        if (tmpX < width / 6) {
          targetPos.x = width / 6;
          targetPos.y = random(height);
        } else if (tmpX > (5 / 6) * width) {
          targetPos.x = (5 / 6) * width;
          targetPos.y = random(height);
        } else {
          targetPos.x = tmpX;
          targetPos.y = cy;
        }
        break;
      }
      case "cross-+": {
        targetPos.x = rnd ? cx : random(width);
        targetPos.y = rnd ? random(height) : cy;
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
      case "sin": {
        targetPos.x = map(i, 0, NUM - 1, 0, width);
        targetPos.y =
          cy + sin(map(i, 0, NUM - 1, 0, 1) * PI * 4 + sec) * vmin * 0.15;
        break;
      }
      case "sin-circle": {
        let a = map(i, 0, NUM - 1, 0, P2);
        let r =
          vmin * 0.3 +
          sin(map(i, 0, NUM - 1, 0, 1) * P * 10 + sec) * vmin * 0.05;
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
