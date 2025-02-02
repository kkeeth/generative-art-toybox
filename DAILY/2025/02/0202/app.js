let colors;

function setup() {
  createCanvas((W = min(windowWidth, windowHeight) - 40), W);
  background(255);
  translate(W / 2, W / 2);

  colors = [
    color(239, 71, 111), // Vibrant Pink
    color(255, 209, 102), // Sunny Yellow
    color(6, 214, 160), // Mint Green
    color(17, 138, 178), // Teal Blue
    color(7, 59, 76), // Deep Blue
  ];

  for (let i = 0; i < 30; i++) {
    let vecF = p5.Vector.random3D().mult(W / 3);
    let x = vecF.x;
    let y = vecF.y;
    let r = random(20, 60);
    let c = colors[int(random(colors.length))];
    let blendedColor = lerpColor(c, color(255), random(0.3, 0.7));
    let isStriped = random() > 0.5;
    if (isStriped) {
      fill(c, random(100, 200));
      drawStripedCircle(x, y, r, c);
    } else {
      fill(
        blendedColor.levels[0],
        blendedColor.levels[1],
        blendedColor.levels[2],
        random(100, 200),
      );

      noStroke();
      ellipse(x, y, r * 2);
    }
  }

  for (let i = 0; i < 30; i++) {
    let vecF = p5.Vector.random2D().mult(W / 2.2);
    let x1 = vecF.x;
    let y1 = vecF.y;
    let x2 = x1 + random(-50, 50);
    let y2 = y1 + random(-50, 50);
    let x3 = x1 + random(-50, 50);
    let y3 = y1 + random(-50, 50);
    let c = colors[int(random(colors.length))];
    let blendedColor = lerpColor(c, color(0), random(0.3, 0.7)); // Blend with black
    let isStriped = random() > 0.5; // 50% chance for stripe pattern
    if (isStriped) {
      fill(c, random(100, 200));
      drawStripedTriangle(x1, y1, x2, y2, x3, y3, c);
    } else {
      fill(
        blendedColor.levels[0],
        blendedColor.levels[1],
        blendedColor.levels[2],
        random(80, 180),
      );

      triangle(x1, y1, x2, y2, x3, y3);
    }
  }

  strokeWeight(2);
  for (let i = 0; i < 12; i++) {
    let x1 = random(-W / 2, W / 2);
    let y1 = random(-W / 2, W / 2);
    let x2 = random(-W / 2, W / 2);
    let y2 = random(-W / 2, W / 2);
    let c1 = colors[int(random(colors.length))];
    let c2 = colors[int(random(colors.length))];
    for (let j = 0; j < 1; j += 0.1) {
      let col = lerpColor(c1, c2, j);
      stroke(col.levels[0], col.levels[1], col.levels[2], 150);
      line(
        lerp(x1, x2, j),
        lerp(y1, y2, j),
        lerp(x1, x2, j + 0.05),
        lerp(y1, y2, j + 0.05),
      );
    }
  }
}

const drawStripedCircle = (x, y, r, c) => {
  push();
  translate(x, y);
  noFill();
  stroke(c);
  strokeWeight(2);
  for (let i = -r; i < r; i += 5) {
    let xStart = sqrt(sq(r) - sq(i));
    line(-xStart, i, xStart, i);
  }
  pop();
};

const drawStripedTriangle = (x1, y1, x2, y2, x3, y3, c) => {
  push();
  stroke(c);
  strokeWeight(3);
  noFill();
  beginShape();
  vertex(x1, y1);
  vertex(x2, y2);
  vertex(x3, y3);
  endShape(CLOSE);

  let stepSize = 5;
  for (let x = min(x1, x2, x3); x < max(x1, x2, x3); x += stepSize) {
    for (let y = min(y1, y2, y3); y < max(y1, y2, y3); y += stepSize) {
      if (isInsideTriangle(x, y, x1, y1, x2, y2, x3, y3)) {
        point(x, y);
      }
    }
  }
  pop();
};

const isInsideTriangle = (px, py, x1, y1, x2, y2, x3, y3) => {
  let areaOrig = abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1));
  let area1 = abs((x1 - px) * (y2 - py) - (x2 - px) * (y1 - py));
  let area2 = abs((x2 - px) * (y3 - py) - (x3 - px) * (y2 - py));
  let area3 = abs((x3 - px) * (y1 - py) - (x1 - px) * (y3 - py));
  return area1 + area2 + area3 <= areaOrig;
};

function keyPressed() {
  if (key === 'c') {
    saveCanvas(`mySketch-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }
}
