let W;
let submarinePoints = [];
let drawProgress = 0;
let bubbles = [];

function setup() {
  createCanvas((W = min(windowWidth, windowHeight) - 50), W);

  // Define submarine shape as one continuous line
  // Starting from bottom-front, going around the submarine
  let cx = W / 2;
  let cy = W / 2;
  let scale = W / 600;

  submarinePoints = [
    // Front bottom
    { x: cx - 180 * scale, y: cy + 30 * scale },
    // Front nose curve
    { x: cx - 200 * scale, y: cy + 10 * scale },
    { x: cx - 210 * scale, y: cy - 10 * scale },
    { x: cx - 200 * scale, y: cy - 30 * scale },
    // Top front
    { x: cx - 180 * scale, y: cy - 40 * scale },
    // Moving toward conning tower
    { x: cx - 60 * scale, y: cy - 40 * scale },
    // Conning tower up
    { x: cx - 50 * scale, y: cy - 45 * scale },
    { x: cx - 40 * scale, y: cy - 80 * scale },
    // Periscope
    { x: cx - 30 * scale, y: cy - 85 * scale },
    { x: cx - 25 * scale, y: cy - 120 * scale },
    { x: cx - 20 * scale, y: cy - 125 * scale },
    { x: cx - 10 * scale, y: cy - 125 * scale },
    { x: cx - 5 * scale, y: cy - 120 * scale },
    // Back down periscope
    { x: cx, y: cy - 85 * scale },
    // Conning tower continuing
    { x: cx + 10 * scale, y: cy - 80 * scale },
    { x: cx + 20 * scale, y: cy - 45 * scale },
    // Back to main hull top
    { x: cx + 30 * scale, y: cy - 40 * scale },
    { x: cx + 180 * scale, y: cy - 40 * scale },
    // Rear top
    { x: cx + 200 * scale, y: cy - 30 * scale },
    // Propeller area
    { x: cx + 210 * scale, y: cy - 20 * scale },
    { x: cx + 220 * scale, y: cy - 15 * scale },
    { x: cx + 230 * scale, y: cy },
    { x: cx + 220 * scale, y: cy + 15 * scale },
    { x: cx + 210 * scale, y: cy + 20 * scale },
    // Back bottom curve
    { x: cx + 200 * scale, y: cy + 30 * scale },
    { x: cx + 180 * scale, y: cy + 40 * scale },
    // Bottom of hull
    { x: cx - 180 * scale, y: cy + 40 * scale },
    // Close to starting point
    { x: cx - 180 * scale, y: cy + 30 * scale },
  ];

  // Initialize bubbles
  for (let i = 0; i < 20; i++) {
    bubbles.push({
      x: random(W),
      y: random(W),
      size: random(3, 10),
      speed: random(0.5, 2)
    });
  }
}

function draw() {
  // Deep ocean background gradient
  drawGradientBackground();

  // Update and draw bubbles
  for (let bubble of bubbles) {
    bubble.y -= bubble.speed;
    if (bubble.y < -10) {
      bubble.y = W + 10;
      bubble.x = random(W);
    }

    noStroke();
    fill(200, 230, 255, 100);
    circle(bubble.x, bubble.y, bubble.size);
  }

  // Draw submarine with one continuous line
  stroke(40, 80, 120);
  strokeWeight(3);
  noFill();

  beginShape();
  let pointsToDraw = min(floor(drawProgress), submarinePoints.length);

  for (let i = 0; i < pointsToDraw; i++) {
    curveVertex(submarinePoints[i].x, submarinePoints[i].y);
  }

  // Add extra vertices for smooth curve
  if (pointsToDraw > 0) {
    curveVertex(submarinePoints[0].x, submarinePoints[0].y);
  }
  if (pointsToDraw > 1) {
    curveVertex(submarinePoints[1].x, submarinePoints[1].y);
  }

  endShape();

  // Animate the drawing
  if (drawProgress < submarinePoints.length + 2) {
    drawProgress += 0.5;
  } else {
    // Draw complete submarine
    stroke(40, 80, 120);
    strokeWeight(3);
    noFill();

    beginShape();
    curveVertex(submarinePoints[submarinePoints.length - 1].x, submarinePoints[submarinePoints.length - 1].y);
    for (let pt of submarinePoints) {
      curveVertex(pt.x, pt.y);
    }
    curveVertex(submarinePoints[0].x, submarinePoints[0].y);
    curveVertex(submarinePoints[1].x, submarinePoints[1].y);
    endShape();

    // Add some details (windows)
    let cx = W / 2;
    let cy = W / 2;
    let scale = W / 600;

    fill(150, 200, 230, 150);
    noStroke();
    for (let i = 0; i < 5; i++) {
      circle(cx - 150 * scale + i * 40 * scale, cy - 10 * scale, 12 * scale);
    }
  }

  // Title
  fill(40, 80, 120);
  noStroke();
  textSize(16);
  textAlign(LEFT);
  text('One-Line Submarine', 20, 30);
}

function drawGradientBackground() {
  // Create ocean depth gradient
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(100, 150, 200), color(20, 40, 80), inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function mousePressed() {
  // Reset animation
  drawProgress = 0;
}

function keyPressed() {
  if (key === 's') {
    saveGif(`submarine-${round(new Date().getTime() / 100000)}`, 5);
  }

  if (key === 'c') {
    saveCanvas(`submarine-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }

  if (key === ' ') {
    // Reset animation on spacebar
    drawProgress = 0;
  }
}
