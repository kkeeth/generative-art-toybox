let stepW, stepH;
const colors = ["#FF0000", "#E4E7EB", "#667992", "#272B34", "#000"];

function setup() {
  createCanvas((w = 600), (h = 600));
  noStroke();
  noLoop();
}

function draw() {
  background(255);
  const type = random(["tri", "squ", "hex", "arrow"])

  stepW = w / 24;
  sizeW = w / 12;
  stepH = h / 12;

  for (let i = 0; i <= w; i += stepW) {
    for (let j = 0; j <= h; j += stepH) {
      switch (type) {
        case "tri":
          fill(random(colors));
          triangle(i * 2, j + stepH, i * 2, j, i * 2 + sizeW, j);
          fill(random(colors));
          triangle(i * 2, j + stepH, i * 2 + sizeW, j, i * 2 + sizeW, j + stepH);
          break;
        case "squ":
          fill(random(colors));
          rect(i * 2, j, sizeW, stepH);
          break;
        case "hex":
          fill(random(colors));
          if (i % sizeW === 0) {
            drawPolygon(i * 2, j - stepH / 2, stepW, 6);
          } else if ((i + sizeW) % stepW === 0) {
            drawPolygon(i * 2, j, stepW, 6);
          }
          break;
        case "arrow":
          fill(random(colors));
          if (j % (2 * stepH) === 0) {
            drawPolygon(i, j, stepW, 6);
          } else {
            drawPolygon(width - i - sizeW, j, stepW, 6);
          }
          break;
      }
    }
  }
}

function drawPolygon(x, y, size, pointNum) {
  const radius = size;
  const angleStep = TWO_PI / pointNum;
  let angle = 0;

  beginShape();
  for (let i = 0; i <= pointNum; i++) {
    let px = x + size + radius * cos(angle);
    let py = y + size + radius * sin(angle);
    vertex(px, py);
    angle = angle + angleStep;
  }
  endShape(CLOSE);
}

function mousePressed() {
  redraw();
}
