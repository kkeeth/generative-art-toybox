let W;
let colors;
let patterns = [];

function setup() {
  W = min(windowWidth, windowHeight) - 50;
  createCanvas(W, W);
  
  // Limited color palette - only 4 colors
  colors = [
    '#2E3440', // Dark Blue-Gray
    '#5E81AC', // Light Blue  
    '#88C0D0', // Pale Blue
    '#ECEFF4'  // Light Gray/White
  ];
  
  noLoop();
  generatePattern();
}

function draw() {
  background(colors[3]); // Light background
  
  drawGeometricPattern();
}

function generatePattern() {
  patterns = [];
  
  // Create a grid-based geometric pattern
  let gridSize = 12;
  let cellSize = W / gridSize;
  
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let x = i * cellSize;
      let y = j * cellSize;
      
      // Create different pattern types based on position
      let patternType = (i + j) % 4;
      
      patterns.push({
        x: x,
        y: y,
        size: cellSize,
        type: patternType,
        colorIndex: (i + j * 2) % 3, // Use first 3 colors for shapes
        rotation: (i + j) * PI / 4
      });
    }
  }
}

function drawGeometricPattern() {
  for (let pattern of patterns) {
    push();
    translate(pattern.x + pattern.size/2, pattern.y + pattern.size/2);
    rotate(pattern.rotation);
    
    fill(colors[pattern.colorIndex]);
    noStroke();
    
    let size = pattern.size * 0.8;
    
    switch(pattern.type) {
      case 0:
        // Triangular pattern
        drawTrianglePattern(0, 0, size);
        break;
      case 1:
        // Diamond pattern
        drawDiamondPattern(0, 0, size);
        break;
      case 2:
        // Circular pattern
        drawCirclePattern(0, 0, size);
        break;
      case 3:
        // Square pattern
        drawSquarePattern(0, 0, size);
        break;
    }
    
    pop();
  }
  
  // Add some overlay patterns for complexity
  drawOverlayPattern();
}

function drawTrianglePattern(x, y, size) {
  let s = size / 2;
  triangle(x, y - s, x - s, y + s, x + s, y + s);
  
  // Add smaller triangle inside
  fill(colors[3]);
  let smallS = s * 0.4;
  triangle(x, y - smallS, x - smallS, y + smallS, x + smallS, y + smallS);
}

function drawDiamondPattern(x, y, size) {
  let s = size / 2;
  quad(x, y - s, x + s, y, x, y + s, x - s, y);
  
  // Add smaller diamond inside
  fill(colors[3]);
  let smallS = s * 0.5;
  quad(x, y - smallS, x + smallS, y, x, y + smallS, x - smallS, y);
}

function drawCirclePattern(x, y, size) {
  ellipse(x, y, size, size);
  
  // Add smaller circle inside
  fill(colors[3]);
  ellipse(x, y, size * 0.6, size * 0.6);
  
  // Add even smaller circle
  fill(colors[(patterns.length + 1) % 3]);
  ellipse(x, y, size * 0.3, size * 0.3);
}

function drawSquarePattern(x, y, size) {
  rectMode(CENTER);
  rect(x, y, size, size);
  
  // Add smaller rotated square inside
  push();
  rotate(PI/4);
  fill(colors[3]);
  rect(x, y, size * 0.7, size * 0.7);
  
  // Add smallest square
  fill(colors[(patterns.length + 2) % 3]);
  rect(x, y, size * 0.4, size * 0.4);
  pop();
}

function drawOverlayPattern() {
  // Draw some connecting lines between patterns
  stroke(colors[0]);
  strokeWeight(2);
  
  let gridSize = 12;
  let cellSize = W / gridSize;
  
  // Horizontal lines every 3 rows
  for (let j = 0; j < gridSize; j += 3) {
    let y = j * cellSize + cellSize/2;
    line(0, y, W, y);
  }
  
  // Vertical lines every 3 columns
  for (let i = 0; i < gridSize; i += 3) {
    let x = i * cellSize + cellSize/2;
    line(x, 0, x, W);
  }
  
  // Add diagonal accent lines
  strokeWeight(1);
  stroke(colors[1]);
  
  // Diagonal lines creating larger diamond pattern
  for (let i = 0; i < 4; i++) {
    let offset = i * W/4;
    line(offset, 0, W, W - offset);
    line(0, offset, W - offset, W);
  }
}

function mousePressed() {
  generatePattern();
  redraw();
}

function keyPressed() {
  if (key === 's') {
    saveGif(`geometric-pattern-${round(new Date().getTime() / 100000)}`, 5);
  }
  
  if (key === 'c') {
    saveCanvas(`geometric-pattern-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }
  
  if (key === 'r') {
    generatePattern();
    redraw();
  }
  
  if (key === 'p') {
    // Cycle through different color palettes
    let palettes = [
      ['#2E3440', '#5E81AC', '#88C0D0', '#ECEFF4'], // Nordic
      ['#264653', '#2A9D8F', '#E9C46A', '#F4A261'], // Earth
      ['#E63946', '#F77F00', '#FCBF49', '#F8F9FA'], // Warm
      ['#560BAD', '#7209B7', '#B7094C', '#F72585']  // Purple
    ];
    
    colors = random(palettes);
    redraw();
  }
}