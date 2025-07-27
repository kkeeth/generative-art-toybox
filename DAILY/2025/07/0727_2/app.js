let W;
let popColors;
let grid;
let shapes = [];

function setup() {
  W = min(windowWidth, windowHeight) - 50;
  createCanvas(W, W);

  // Pop art inspired color palette
  popColors = [
    '#FF006E', // Hot Pink
    '#FFBE0B', // Electric Yellow
    '#FB5607', // Bright Orange
    '#8338EC', // Electric Purple
    '#3A86FF', // Bright Blue
    '#06FFA5', // Electric Green
    '#FF4081', // Pink
    '#00E676', // Green
    '#FF5722', // Deep Orange
    '#E91E63', // Pink
    '#9C27B0', // Purple
    '#2196F3', // Blue
    '#4CAF50', // Green
    '#FF9800', // Orange
    '#F44336', // Red
    '#FFEB3B', // Yellow
    '#00BCD4', // Cyan
    '#795548', // Brown
  ];

  noLoop(); // Static image

  createPopArtComposition();
}

function draw() {
  // Create clean background
  background(255);

  // Draw geometric pop art elements in grid
  drawPopArtShapes();
}

function createPopArtComposition() {
  // Create grid of pop art elements with random shapes and sizes
  let cols = 8;
  let rows = 8;
  let cellW = W / cols;
  let cellH = W / rows;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * cellW;
      let y = j * cellH;

      // Random size variations
      let sizeVariation = random(0.3, 0.9);
      let w = cellW * sizeVariation;
      let h = cellH * sizeVariation;

      // Sometimes make shapes very different aspect ratios
      if (random() < 0.3) {
        w = cellW * random(0.2, 0.9);
        h = cellH * random(0.2, 0.9);
      }

      shapes.push({
        x: x + cellW / 2,
        y: y + cellH / 2,
        w: w,
        h: h,
        type: random([
          'circle',
          'rect',
          'triangle',
          'star',
          'hexagon',
          'diamond',
          'pentagon',
        ]),
        color: random(popColors),
        rotation: random(TWO_PI),
      });
    }
  }
}

function drawPopArtShapes() {
  for (let shape of shapes) {
    push();
    translate(shape.x, shape.y);
    rotate(shape.rotation);

    // Drop shadow effect
    fill(0, 100);
    noStroke();
    drawShape(shape.type, 5, 5, shape.w, shape.h);

    // Main shape
    fill(shape.color);
    stroke(0);
    strokeWeight(4);
    drawShape(shape.type, 0, 0, shape.w, shape.h);

    // Highlight effect
    fill(255, 150);
    noStroke();
    drawShape(shape.type, -2, -2, shape.w * 0.3, shape.h * 0.3);

    pop();
  }
}

function drawShape(type, x, y, w, h) {
  push();
  translate(x, y);

  switch (type) {
    case 'circle':
      ellipse(0, 0, w, h);
      break;
    case 'rect':
      rectMode(CENTER);
      rect(0, 0, w, h, 10);
      break;
    case 'triangle':
      triangle(-w / 2, h / 2, w / 2, h / 2, 0, -h / 2);
      break;
    case 'star':
      drawStar(0, 0, w / 4, w / 2, 5);
      break;
    case 'hexagon':
      drawHexagon(0, 0, w / 2);
      break;
    case 'diamond':
      drawDiamond(0, 0, w / 2, h / 2);
      break;
    case 'pentagon':
      drawPentagon(0, 0, w / 2);
      break;
  }
  pop();
}

function drawStar(x, y, radius1, radius2, npoints) {
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

function drawHexagon(x, y, radius) {
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = (i * TWO_PI) / 6;
    let sx = x + cos(angle) * radius;
    let sy = y + sin(angle) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function drawDiamond(x, y, w, h) {
  beginShape();
  vertex(x, y - h);
  vertex(x + w, y);
  vertex(x, y + h);
  vertex(x - w, y);
  endShape(CLOSE);
}

function drawPentagon(x, y, radius) {
  beginShape();
  for (let i = 0; i < 5; i++) {
    let angle = (i * TWO_PI) / 5 - PI / 2;
    let sx = x + cos(angle) * radius;
    let sy = y + sin(angle) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function mousePressed() {
  // Regenerate the composition
  shapes = [];
  createPopArtComposition();
  redraw();
}

function keyPressed() {
  if (key === 's') {
    saveGif(`pop-art-${round(new Date().getTime() / 100000)}`, 5);
  }

  if (key === 'c') {
    saveCanvas(`pop-art-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }

  if (key === 'r') {
    // Regenerate composition
    shapes = [];
    createPopArtComposition();
    redraw();
  }

  if (key === 'p') {
    // Shuffle colors
    popColors = shuffle(popColors);
    redraw();
  }
}
