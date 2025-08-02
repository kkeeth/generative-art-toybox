let W;
let colors;
let patterns = [];

function setup() {
  W = min(windowWidth, windowHeight) - 50;
  createCanvas(W, W);

  // Soft pastel color palette - 4 colors
  colors = [
    '#FFB3C6', // Soft Pink
    '#C7CEEA', // Lavender Blue
    '#B5EAD7', // Mint Green
    '#FFDAB9', // Peach
  ];

  noLoop();
  generatePattern();
}

function draw() {
  // Fill entire canvas with color - no white background
  background(colors[3]); // Peach background

  drawDenseGeometricPattern();
}

function generatePattern() {
  patterns = [];

  // Denser grid for more pattern filling
  let gridSize = 20;
  let cellSize = W / gridSize;

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let x = i * cellSize;
      let y = j * cellSize;

      // Multiple pattern layers per cell
      for (let layer = 0; layer < 3; layer++) {
        let patternType = ~~random(6);
        let colorIndex = (i + j + layer) % 4;

        patterns.push({
          x: x,
          y: y,
          size: cellSize,
          type: patternType,
          colorIndex: colorIndex,
          rotation: ((i + j + layer) * PI) / 6,
          layer: layer,
          opacity: 255 - layer * 60, // Layered transparency
        });
      }
    }
  }
}

function drawDenseGeometricPattern() {
  // Draw background pattern first
  drawBackgroundTexture();

  // Draw all patterns in layers
  for (let layer = 2; layer >= 0; layer--) {
    for (let pattern of patterns) {
      if (pattern.layer === layer) {
        drawSinglePattern(pattern);
      }
    }
  }

  // Add connecting elements to fill gaps
  drawConnectingElements();
}

function drawSinglePattern(pattern) {
  push();
  translate(pattern.x + pattern.size / 2, pattern.y + pattern.size / 2);
  rotate(pattern.rotation);

  // Set color with transparency for layering
  let c = color(colors[pattern.colorIndex]);
  c.setAlpha(pattern.opacity);
  fill(c);
  noStroke();

  let size = pattern.size;

  switch (pattern.type) {
    case 0:
      drawFilledTriangle(0, 0, size);
      break;
    case 1:
      drawFilledDiamond(0, 0, size);
      break;
    case 2:
      drawFilledCircle(0, 0, size);
      break;
    case 3:
      drawFilledSquare(0, 0, size);
      break;
    case 4:
      drawFilledHexagon(0, 0, size);
      break;
    case 5:
      drawFilledStar(0, 0, size);
      break;
  }

  pop();
}

function drawFilledTriangle(x, y, size) {
  let s = size / 2;
  triangle(x, y - s, x - s, y + s, x + s, y + s);
}

function drawFilledDiamond(x, y, size) {
  let s = size / 2;
  quad(x, y - s, x + s, y, x, y + s, x - s, y);
}

function drawFilledCircle(x, y, size) {
  ellipse(x, y, size, size);
}

function drawFilledSquare(x, y, size) {
  rectMode(CENTER);
  rect(x, y, size, size);
}

function drawFilledHexagon(x, y, size) {
  let radius = size / 2;
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = (i * TWO_PI) / 6;
    let sx = x + cos(angle) * radius;
    let sy = y + sin(angle) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function drawFilledStar(x, y, size) {
  let radius1 = size / 4;
  let radius2 = size / 2;
  let npoints = 5;
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;

  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function drawBackgroundTexture() {
  // Fill canvas with tiny dots pattern
  let dotSize = 3;
  let spacing = 8;

  for (let x = 0; x < W; x += spacing) {
    for (let y = 0; y < W; y += spacing) {
      let colorIndex = floor(random(4));
      let c = color(colors[colorIndex]);
      c.setAlpha(80);
      fill(c);
      noStroke();
      ellipse(x + random(-2, 2), y + random(-2, 2), dotSize);
    }
  }
}

function drawConnectingElements() {
  // Draw thin lines to connect patterns and fill gaps
  let gridSize = 20;
  let cellSize = W / gridSize;

  // Horizontal connecting lines
  for (let j = 0; j < gridSize; j++) {
    for (let i = 0; i < gridSize - 1; i++) {
      let x1 = i * cellSize + cellSize;
      let x2 = (i + 1) * cellSize;
      let y = j * cellSize + cellSize / 2;

      let c = color(colors[(i + j) % 4]);
      c.setAlpha(150);
      stroke(c);
      strokeWeight(2);
      line(x1, y, x2, y);
    }
  }

  // Vertical connecting lines
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize - 1; j++) {
      let x = i * cellSize + cellSize / 2;
      let y1 = j * cellSize + cellSize;
      let y2 = (j + 1) * cellSize;

      let c = color(colors[(i + j) % 4]);
      c.setAlpha(150);
      stroke(c);
      strokeWeight(2);
      line(x, y1, x, y2);
    }
  }

  // Add diagonal pattern overlay
  stroke(colors[0]);
  strokeWeight(1);
  for (let i = 0; i < W; i += 20) {
    let c = color(colors[i % 4]);
    c.setAlpha(100);
    stroke(c);
    line(i, 0, 0, i);
    line(W - i, W, W, W - i);
  }

  // Fill corner gaps with small shapes
  for (let i = 0; i < gridSize - 1; i++) {
    for (let j = 0; j < gridSize - 1; j++) {
      let x = i * cellSize + cellSize;
      let y = j * cellSize + cellSize;

      let c = color(colors[(i + j + 2) % 4]);
      c.setAlpha(200);
      fill(c);
      noStroke();
      ellipse(x, y, cellSize / 3);
    }
  }
}

function mousePressed() {
  generatePattern();
  redraw();
}

function keyPressed() {
  if (key === 's') {
    saveGif(
      `dense-geometric-pattern-${round(new Date().getTime() / 100000)}`,
      5,
    );
  }

  if (key === 'c') {
    saveCanvas(
      `dense-geometric-pattern-${round(new Date().getTime() / 100000)}`,
      'jpeg',
    );
  }

  if (key === 'r') {
    generatePattern();
    redraw();
  }

  if (key === 'p') {
    // Cycle through different pastel palettes
    let pastelPalettes = [
      ['#FFB3C6', '#C7CEEA', '#B5EAD7', '#FFDAB9'], // Pink/Lavender/Mint/Peach
      ['#E6E6FA', '#F0E68C', '#FFB6C1', '#E0FFFF'], // Lavender/Khaki/Pink/Cyan
      ['#FFCCCB', '#DDA0DD', '#98FB98', '#F0E68C'], // Rose/Plum/Mint/Khaki
      ['#B19CD9', '#FFB347', '#87CEEB', '#F5DEB3'], // Purple/Orange/Sky/Wheat
    ];

    colors = random(pastelPalettes);
    generatePattern();
    redraw();
  }
}
