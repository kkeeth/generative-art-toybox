const weight = 5;
let base;
let span;

function setup() {
  createCanvas((W = windowHeight - 50), W);
  noFill();
  rectMode(CENTER);
  background(255);
  strokeWeight(weight);
  strokeCap(ROUND);

  span = W / 5;
  base = PI / 45;

  for (let j = 0; j < W / span; j++) {
    for (let i = 0; i < W / span; i++) {
      drawBall(i * span + span / 2, j * span + span / 2, i + j * (W / span));
    }
  }
}

function drawBall(i, j, pattern) {
  let centerColor = color(0);
  let innerColor = color(180);
  switch (pattern) {
    // normal monster ball
    case 0:
      stroke(255, 0, 0);
      drawBallOutline(i, j, "top");
      stroke(0);
      drawBallOutline(i, j, "bottom");
      break;
    // super ball
    case 1:
      stroke(1, 100, 144);
      drawBallOutline(i, j, "top");
      stroke(0);
      drawBallOutline(i, j, "bottom");

      stroke(230, 27, 32);
      drawDrop(
        i - span / 4,
        j - sqrt(pow(span / 3, 2) - pow(span / 6, 2)) + 3,
        30,
        4,
        QUARTER_PI
      );
      drawDrop(
        i + span / 4,
        j - sqrt(pow(span / 3, 2) - pow(span / 6, 2)) + 3,
        30,
        4,
        3 * QUARTER_PI
      );
      break;
    // hyper ball
    case 2:
      stroke(0);
      drawBallOutline(i, j, "top");
      drawBallOutline(i, j, "bottom");

      // draw H
      push();
      stroke(255, 215, 0);
      strokeWeight(10);
      line(
        i - span / 6,
        j - 3 * cos(base) - 8,
        i - span / 6,
        j - sqrt(pow(span / 3, 2) - pow(span / 6, 2)) + 10
      );
      line(
        i + span / 6,
        j - 3 * cos(base) - 8,
        i + span / 6,
        j - sqrt(pow(span / 3, 2) - pow(span / 6, 2)) + 10
      );
      pop();
      break;
    // master ball
    case 3:
      stroke(146, 33, 139);
      drawBallOutline(i, j, "top");

      push();
      textSize(24);
      textAlign(CENTER);
      strokeWeight(2);
      // noStroke();
      fill(146, 33, 139);
      text("M", i, j - span / 7);
      pop();

      stroke(0);
      drawBallOutline(i, j, "bottom");

      // draw two block
      stroke(208, 11, 136);
      drawBlock(
        i - span / 4.5,
        j - sqrt(pow(span / 3.5, 2) - pow(span / 5.5, 2)),
        30,
        4,
        QUARTER_PI
      );
      drawBlock(
        i + span / 4.5,
        j - sqrt(pow(span / 3.5, 2) - pow(span / 5.5, 2)),
        30,
        4,
        3 * QUARTER_PI
      );
      break;
    // premier ball
    case 4:
      stroke(0);
      drawBallOutline(i, j, "top", color(255, 0, 0));
      drawBallOutline(i, j, "bottom", color(255, 0, 0));
      centerColor = color(255, 0, 0);

      break;
    // sport ball
    case 5:
      stroke(255, 0, 0);
      drawBallOutline(i, j, "top");
      stroke(0);
      drawBallOutline(i, j, "bottom");

      push();
      strokeWeight(4);
      stroke(255, 215, 0);
      arc(
        i,
        j - span / 4.5,
        span / 7.5,
        span / 7.5,
        PI + PI / 7.5,
        TAU - PI / 7.5
      );
      arc(i, j - span / 4.5, span / 7.5, span / 7.5, PI / 7.5, PI - PI / 7.5);

      fill(255, 215, 0);
      ellipse(i, j - span / 4.5, span / 24);

      pop();
      break;
    // park ball
    case 6:
      stroke(245, 202, 96);
      drawBallOutline(i, j, "top", color(0, 149, 194));
      stroke(0);
      drawBallOutline(i, j, "bottom", color(0, 149, 194));
      centerColor = color(0, 149, 194);
      innerColor = color(245, 202, 96);
      break;
    // quick ball
    case 7:
      stroke(3, 99, 142);
      drawBallOutline(i, j, "top");
      drawBallOutline(i, j, "bottom");

      // draw bolt
      stroke(255, 215, 0);
      // square
      line(
        i - (2 * span) / 9 + weight,
        j - weight * 2,
        i,
        j - (2 * span) / 9 - weight
      );
      line(
        i + (2 * span) / 9 - weight,
        j - weight * 2,
        i,
        j - (2 * span) / 9 - weight
      );
      line(
        i - (2 * span) / 9 + weight,
        j + weight * 2,
        i,
        j + (2 * span) / 9 + weight
      );
      line(
        i + (2 * span) / 9 - weight,
        j + weight * 2,
        i,
        j + (2 * span) / 9 + weight
      );

      // outer lines
      line(
        i + ((sqrt(2) * span) / 9 + weight * 2) * cos(-QUARTER_PI),
        j + ((sqrt(2) * span) / 9 + weight * 2) * sin(-QUARTER_PI),
        i + (span / 3 - weight) * cos(-QUARTER_PI),
        j + (span / 3 - weight) * sin(-QUARTER_PI)
      );
      line(
        i - ((sqrt(2) * span) / 9 + weight * 2) * cos(-QUARTER_PI),
        j + ((sqrt(2) * span) / 9 + weight * 2) * sin(-QUARTER_PI),
        i - (span / 3 - weight) * cos(-QUARTER_PI),
        j + (span / 3 - weight) * sin(-QUARTER_PI)
      );
      line(
        i + ((sqrt(2) * span) / 9 + weight * 2) * cos(-QUARTER_PI),
        j - ((sqrt(2) * span) / 9 + weight * 2) * sin(-QUARTER_PI),
        i + (span / 3 - weight) * cos(-QUARTER_PI),
        j - (span / 3 - weight) * sin(-QUARTER_PI)
      );
      line(
        i - ((sqrt(2) * span) / 9 + weight * 2) * cos(-QUARTER_PI),
        j - ((sqrt(2) * span) / 9 + weight * 2) * sin(-QUARTER_PI),
        i - (span / 3 - weight) * cos(-QUARTER_PI),
        j - (span / 3 - weight) * sin(-QUARTER_PI)
      );
      break;
  }

  push();
  fill(255);
  strokeWeight(4);
  stroke(centerColor);
  ellipse(i, j, span / 4.5);

  stroke(innerColor);
  ellipse(i, j, span / 7.5);
  pop();
}

function drawBallOutline(i, j, flg, centerColor) {
  if (flg === "top") {
    arc(i, j, span / 1.5, span / 1.5, PI + base, TAU - base);
    push();
    if (centerColor) stroke(centerColor);
    line(
      i - span / 3 + (weight + 1),
      j - 3 * cos(base),
      i + span / 3 - (weight + 1),
      j - 3 * cos(base)
    );
    pop();
  } else {
    arc(i, j, span / 1.5, span / 1.5, base, PI - base);
    push();
    if (centerColor) stroke(centerColor);
    line(
      i - span / 3 + (weight + 1),
      j + 3 * cos(base),
      i + span / 3 - (weight + 1),
      j + 3 * cos(base)
    );
    pop();
  }
}

function drawDrop(x, y, r, A, angle) {
  // drawingContext.shadowColor = color(200);
  // drawingContext.shadowBlur = 16;

  push();
  translate(x, y);
  rotate(angle);
  beginShape();
  for (let theta = 0; theta < TAU; theta += 0.3) {
    let R = r / (A * sin(theta / 2) + 1);

    vertex(R * cos(theta), R * sin(theta));
  }
  endShape(CLOSE);
  pop();
}

function drawBlock(x, y, r, A, angle) {
  // drawingContext.shadowColor = color(200);
  // drawingContext.shadowBlur = 16;

  push();
  translate(x, y);
  rotate(angle);
  rect(0, 0, 20, 20, 4, 10, 10, 4);
  pop();
}

function keyPressed() {
  if (key === "c") {
    saveCanvas("mySketch", "png");
  }
}
