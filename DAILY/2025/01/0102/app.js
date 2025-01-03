function setup() {
  createCanvas(800, 800);
  background(240, 230, 220);
  noLoop();
}

function draw() {
  background(240, 230, 220);

  let colors = [
    color(200, 100, 100, 150),
    color(100, 200, 150, 150),
    color(150, 100, 200, 150),
    color(250, 200, 100, 150),
    color(100, 150, 250, 150),
  ];

  for (let layer = 0; layer < 50; layer++) {
    let col = random(colors);
    drawHandDrawnShape(col, random(width), random(height));
  }
}

function drawHandDrawnShape(col, x, y) {
  let radius = random(50, 150);
  let detail = int(random(5, 10));

  fill(col);
  noStroke();
  beginShape();

  let points = [];
  for (let i = 0; i < detail; i++) {
    let angle = map(i, 0, detail, 0, TWO_PI);
    let r = radius + random(-10, 10);
    let px = x + cos(angle) * r;
    let py = y + sin(angle) * r;
    points.push(createVector(px, py));
    vertex(px, py);
  }
  endShape(CLOSE);

  stroke(80, 80, 80);
  strokeWeight(random(1, 3));
  noFill();
  for (let i = 0; i < points.length; i++) {
    let p1 = points[i];
    let p2 = points[(i + 1) % points.length];
    drawWigglyLine(p1.x, p1.y, p2.x, p2.y);
  }

  addSplashes(x, y, radius);
}

function drawWigglyLine(x1, y1, x2, y2) {
  let numSegments = int(dist(x1, y1, x2, y2) / 20);
  let prevX = x1;
  let prevY = y1;

  for (let i = 1; i <= numSegments; i++) {
    let t = i / numSegments;
    let nx = lerp(x1, x2, t) + random(-5, 5);
    let ny = lerp(y1, y2, t) + random(-5, 5);
    line(prevX, prevY, nx, ny);
    prevX = nx;
    prevY = ny;
  }
}

function addSplashes(x, y, radius) {
  let numSplashes = int(random(5, 15)); // 飛沫の数をランダムに設定
  for (let i = 0; i < numSplashes; i++) {
    let angle = random(TWO_PI); // ランダムな方向
    let r = random(radius * 0.2, radius * 1.2); // シェイプの外周付近まで
    let px = x + cos(angle) * r;
    let py = y + sin(angle) * r;
    let splashSize = random(2, 6); // 飛沫の大きさをランダム
    noStroke();
    fill(255, 255, 255, 200); // 半透明の白
    ellipse(px, py, splashSize, splashSize);
  }
}

function keyPressed() {
  if (key === 'c') {
    saveCanvas(`mySketch-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }
}
