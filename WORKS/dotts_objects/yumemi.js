let vmin, vmax;
let cx, cy;
let ctx;
let pg;
let dotArr = [];
let NUM = 1000;

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
      r: random(3, 5),
      e: random(0.008, 0.03),
    });
  }
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
    let nx = noise(i, sec) * 10;
    let ny = noise(i, sec + 123.4567) * 10;
    circle(pos.x + nx, pos.y + ny, r);
  }
}

function setPosition() {
  fill(random(120, 255), random(120, 255), random(120, 255));

  for (let { targetPos } of dotArr) {
    const tmpX = random(width);
    const tmpY = random(height);

    // Y
    if (tmpX < width / 6) {
      if (tmpY < cy) {
        let coefficient = height / (width / 4);
        targetPos.x = map(tmpX, 0, width / 6, width / 24, (3 / 24) * width);
        targetPos.y =
          targetPos.x < width / 12
            ? coefficient * targetPos.x + height / 6
            : (5 / 6) * height - coefficient * targetPos.x;
      } else {
        targetPos.x = (1 / 12) * width;
        targetPos.y = map(tmpY, cy, height, cy, (2 / 3) * height);
      }
    }
    // U
    else if ((1 / 6) * width <= tmpX && tmpX < (2 / 6) * width) {
      if (tmpY < (2 / 3) * height - (1 / 24) * width) {
        if (tmpX < (3 / 12) * width) {
          targetPos.x = (5 / 24) * width;
          targetPos.y = map(
            tmpY,
            0,
            (2 / 3) * height,
            height / 3,
            (2 / 3) * height - (1 / 24) * width,
          );
        } else {
          targetPos.x = (7 / 24) * width;
          targetPos.y = map(
            tmpY,
            0,
            (2 / 3) * height,
            height / 3,
            (2 / 3) * height - (1 / 24) * width,
          );
        }
      } else {
        targetPos.x = map(
          tmpX,
          (1 / 6) * width,
          (2 / 6) * width,
          (5 / 24) * width,
          (7 / 24) * width,
        );
        targetPos.y =
          (1 / 12) * width * cos(radians(targetPos.x)) +
          ((2 / 3) * height - (1 / 11) * width);
      }
    }
    // M - first
    else if ((2 / 6) * width <= tmpX && tmpX < (3 / 6) * width) {
      if (tmpX < (9 / 24) * width) {
        targetPos.x = (9 / 24) * width;
        targetPos.y = map(tmpY, 0, height, height / 3, (2 / 3) * height);
      } else if ((9 / 24) * width <= tmpX && tmpX < (11 / 24) * width) {
        targetPos.x = tmpX;

        let coefficient = height / (width / 4);
        let realXPos = targetPos.x - (2 / 6) * width;

        targetPos.y =
          targetPos.x < (5 / 12) * width
            ? coefficient * realXPos + height / 6
            : (5 / 6) * height - coefficient * realXPos;
      } else {
        targetPos.x = (11 / 24) * width;
        targetPos.y = map(tmpY, 0, height, height / 3, (2 / 3) * height);
      }
    }
    // E
    else if ((3 / 6) * width <= tmpX && tmpX < (4 / 6) * width) {
      targetPos.x = map(
        tmpX,
        (3 / 6) * width,
        (4 / 6) * width,
        (13 / 24) * width,
        (15 / 24) * width,
      );

      // vertical line
      if (random() < 0.4) {
        targetPos.x = (13 / 24) * width;
        targetPos.y = map(tmpY, 0, height, (1 / 3) * height, (2 / 3) * height);
      }
      // first horizontal line
      else if (tmpY < (1 / 3) * height) {
        targetPos.y = (1 / 3) * height;
      }
      // second horizontal line
      else if ((1 / 3) * height <= tmpY && tmpY < (2 / 3) * height) {
        targetPos.y = cy;
      }
      // third horizontal line
      else {
        targetPos.y = (2 / 3) * height;
      }
    }
    // M - second
    else if ((4 / 6) * width <= tmpX && tmpX < (5 / 6) * width) {
      if (tmpX < (17 / 24) * width) {
        targetPos.x = (17 / 24) * width;
        targetPos.y = map(tmpY, 0, height, height / 3, (2 / 3) * height);
      } else if ((17 / 24) * width <= tmpX && tmpX < (19 / 24) * width) {
        targetPos.x = tmpX;

        let coefficient = height / (width / 4);
        let realXPos = targetPos.x - (4 / 6) * width;

        targetPos.y =
          targetPos.x < (9 / 12) * width
            ? coefficient * realXPos + height / 6
            : (5 / 6) * height - coefficient * realXPos;
      } else {
        targetPos.x = (19 / 24) * width;
        targetPos.y = map(tmpY, 0, height, height / 3, (2 / 3) * height);
      }
    }
    // I
    else {
      targetPos.x = (11 / 12) * width;
      targetPos.y = map(tmpY, 0, height, height / 3, (2 / 3) * height);
    }
  }
}

function mousePressed() {
  setPosition();
}
