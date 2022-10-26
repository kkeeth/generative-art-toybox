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
      e: random(0.01, 0.08),
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

  if (frameCount % 100 === 0) setPosition();
}

function setPosition() {
  fill(random(120, 255), random(120, 255), random(120, 255));

  for (let { targetPos } of dotArr) {
    const tmpX = random(width);
    const tmpY = random(height);

    // F
    if (tmpX < width / 5) {
      targetPos.x = map(
        tmpX,
        0,
        (1 / 5) * width,
        (1 / 20) * width,
        (3 / 20) * width,
      );

      // vertical line
      if (random() < 0.4) {
        targetPos.x = (1 / 20) * width;
        targetPos.y = map(tmpY, 0, height, (1 / 3) * height, (2 / 3) * height);
      }
      // first horizontal line
      else if (tmpY < (1 / 3) * height) {
        targetPos.y = (1 / 3) * height;
      }
      // second horizontal line
      else {
        targetPos.y = cy;
      }
    }
    // I
    else if ((1 / 5) * width <= tmpX && tmpX < (2 / 5) * width) {
      targetPos.x = (3 / 10) * width;
      targetPos.y = map(tmpY, 0, height, height / 3, (2 / 3) * height);
    }
    // N
    else if ((2 / 5) * width <= tmpX && tmpX < (3 / 5) * width) {
      if (tmpX < (9 / 20) * width) {
        targetPos.x = (9 / 20) * width;
        targetPos.y = map(tmpY, 0, height, height / 3, (2 / 3) * height);
      } else if ((9 / 20) * width <= tmpX && tmpX < (11 / 20) * width) {
        let coefficient = height / ((3 / 10) * width);
        targetPos.x = tmpX;

        let realXPos = targetPos.x - (1 / 5) * width;
        targetPos.y = coefficient * realXPos - height / 2;
      } else {
        targetPos.x = (11 / 20) * width;
        targetPos.y = map(tmpY, 0, height, height / 3, (2 / 3) * height);
      }
    }
    // D
    else if ((3 / 5) * width <= tmpX && tmpX < (4 / 5) * width) {
      if (tmpX < (13 / 20) * width) {
        targetPos.x = (13 / 20) * width;
        targetPos.y = map(tmpY, 0, height, height / 3, (2 / 3) * height);
      } else {
        targetPos.x = map(
          tmpX,
          (3 / 5) * width,
          (4 / 5) * width,
          (13 / 20) * width,
          (15 / 20) * width,
        );
        if (tmpY < cy) {
          targetPos.y =
            cy -
            sqrt(
              pow((1 / 6) * height, 2) -
                pow(targetPos.x - (13 / 20) * width, 2),
            );
        } else {
          targetPos.y =
            sqrt(
              pow((1 / 6) * height, 2) -
                pow(targetPos.x - (13 / 20) * width, 2),
            ) + cy;
        }
      }
    }
    // Y
    else {
      if (tmpY < cy) {
        let coefficient = height / ((3 / 10) * width);
        targetPos.x = map(
          tmpX,
          (4 / 5) * width,
          width,
          (17 / 20) * width,
          (19 / 20) * width,
        );
        targetPos.y =
          targetPos.x < (9 / 10) * width
            ? coefficient * (targetPos.x - (17 / 20) * width) +
              (4 / 12) * height
            : (8 / 12) * height -
              coefficient * (targetPos.x - (17 / 20) * width);
      } else {
        targetPos.x = (9 / 10) * width;
        targetPos.y = map(tmpY, cy, height, cy, (2 / 3) * height);
      }
    }
  }
}

function mousePressed() {
  setPosition();
}
