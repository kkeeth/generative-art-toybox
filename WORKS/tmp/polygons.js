let stepW, stepH;
const colors = ["#FF0000", "#E4E7EB", "#667992", "#272B34", "#000"];

function setup() {
  createCanvas((w = 600), (h = 600));
  noStroke();
  noLoop();
}

function draw() {
  background(255);
  const type = random(["arrow"]);
  // const type = random(["tri", "squ", "hex", "arrow"])

  stepW = w / 12;
  stepH = h / 12;

  for (let i = 0; i <= w; i += stepW / 2) {
    for (let j = 0; j <= h; j += stepH) {
      switch (type) {
        case "tri":
          fill(random(colors));
          triangle(i, j + stepH, i, j, i + stepW, j);
          fill(random(colors));
          triangle(i, j + stepH, i + stepW, j, i + stepW, j + stepH);
          break;
        case "squ":
          fill(random(colors));
          rect(i, j, stepW, stepH);
          break;
        case "hex":
          fill(random(colors));
          if (i % (2 * stepW) === 0) {
            drawPolygon(i, j - stepH / 2, stepW / 2, 6);
          } else if ((i + stepW) % (2 * stepW) === 0) {
            drawPolygon(i, j, stepW / 2, 6);
          }
          break;
        case "arrow":
          fill(random(colors));
          if (j % (2 * stepH) === 0) {
            drawPolygon(i, j, stepW / 2, 6);
          } else {
            drawPolygon(width - i - stepW, j, stepW / 2, 6);
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
