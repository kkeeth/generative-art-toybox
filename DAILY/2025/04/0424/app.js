// Splatoon-inspired fluid paint simulation
let splatters = [];
let colors = [];
let maxSplatters = 50;

function setup() {
  createCanvas(800, 600);
  background(240);

  // Splatoon-inspired color palette
  colors = [
    color(240, 28, 132), // Pink
    color(0, 232, 254), // Cyan
    color(255, 137, 1), // Orange
    color(0, 249, 138), // Green
    color(190, 92, 255), // Purple
    color(255, 221, 0), // Yellow
  ];

  textAlign(CENTER);
  textSize(16);
}

function draw() {
  // Update and display all splatters
  for (let i = 0; i < splatters.length; i++) {
    splatters[i].update();
    splatters[i].display();
  }

  // Display instructions
  fill(50);
  noStroke();
  text('Click or drag to create fluid paint splatters!', width / 2, 30);
}

function mouseDragged() {
  createSplatter(mouseX, mouseY);
  return false; // Prevent default behavior
}

function mousePressed() {
  createSplatter(mouseX, mouseY);
}

function createSplatter(x, y) {
  // Limit the number of splatters for performance
  if (splatters.length >= maxSplatters) {
    // Remove the oldest splatter
    splatters.shift();
  }

  let selectedColor = random(colors);
  splatters.push(new FluidSplatter(x, y, selectedColor));
}

class FluidSplatter {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = random(40, 120);
    this.blobs = [];
    this.blobCount = floor(random(5, 15));

    // Create main blob
    this.mainBlob = {
      offsetX: 0,
      offsetY: 0,
      size: this.size,
      noiseScale: random(0.3, 0.8),
      noiseOffset: random(100),
    };

    // Create connected blobs
    let mainAngle = random(TWO_PI);
    for (let i = 0; i < this.blobCount; i++) {
      // Create blobs in a more connected pattern
      let angle = mainAngle + random(-PI / 2, PI / 2);
      let distance = random(this.size * 0.3, this.size * 0.8);

      this.blobs.push({
        offsetX: cos(angle) * distance,
        offsetY: sin(angle) * distance,
        size: random(this.size * 0.3, this.size * 0.7),
        noiseScale: random(0.3, 0.8),
        noiseOffset: random(100),
        connectionWidth: random(this.size * 0.1, this.size * 0.3),
      });

      // Slightly adjust the main angle for next blob to create a flow
      mainAngle += random(-PI / 4, PI / 4);
    }

    this.splashProgress = 0;
    this.splashSpeed = random(0.03, 0.08);
    this.splashComplete = false;

    // Add some flow properties
    this.flowDirection = random(TWO_PI);
    this.flowSpeed = random(0.2, 1);
    this.flowAmount = 0;
    this.maxFlow = random(10, 30);
  }

  update() {
    if (!this.splashComplete) {
      // Animate the splash effect
      this.splashProgress += this.splashSpeed;

      if (this.splashProgress >= 1) {
        this.splashComplete = true;
      }
    } else {
      // After splash is complete, add some subtle flow
      this.flowAmount += this.flowSpeed;
      if (this.flowAmount > this.maxFlow) {
        this.flowSpeed = 0;
      }
    }
  }

  display() {
    push();

    // Apply the color with some transparency
    let c = this.color;
    fill(red(c), green(c), blue(c), 220);
    noStroke();

    // Draw connections first (underneath)
    if (this.splashProgress > 0.3) {
      let connectionProgress = map(this.splashProgress, 0.3, 1, 0, 1);

      for (let blob of this.blobs) {
        // Draw connection between main blob and this blob
        this.drawConnection(
          this.x,
          this.y,
          this.x + blob.offsetX * this.splashProgress,
          this.y + blob.offsetY * this.splashProgress,
          blob.connectionWidth * connectionProgress,
        );
      }
    }

    // Draw main blob
    let flowOffsetX = cos(this.flowDirection) * this.flowAmount;
    let flowOffsetY = sin(this.flowDirection) * this.flowAmount;

    this.drawFluidBlob(
      this.x + flowOffsetX,
      this.y + flowOffsetY,
      this.mainBlob.size * this.splashProgress,
      this.mainBlob.noiseScale,
      this.mainBlob.noiseOffset,
    );

    // Draw connected blobs
    if (this.splashProgress > 0.2) {
      let blobProgress = map(this.splashProgress, 0.2, 1, 0, 1);

      for (let blob of this.blobs) {
        this.drawFluidBlob(
          this.x + blob.offsetX * this.splashProgress + flowOffsetX * 0.7,
          this.y + blob.offsetY * this.splashProgress + flowOffsetY * 0.7,
          blob.size * blobProgress,
          blob.noiseScale,
          blob.noiseOffset,
        );
      }
    }

    pop();
  }

  drawFluidBlob(x, y, size, noiseScale, noiseOffset) {
    push();
    translate(x, y);

    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.1) {
      // Use noise to create organic, fluid-like edges
      let xoff = map(cos(a), -1, 1, 0, noiseScale);
      let yoff = map(sin(a), -1, 1, 0, noiseScale);
      let r = map(
        noise(xoff + noiseOffset, yoff + noiseOffset, frameCount * 0.01),
        0,
        1,
        size * 0.7,
        size,
      );

      let px = cos(a) * r;
      let py = sin(a) * r;
      vertex(px, py);
    }
    endShape(CLOSE);

    // Add some smaller circles inside for a more fluid look
    for (let i = 0; i < 3; i++) {
      let angle = random(TWO_PI);
      let distance = random(size * 0.1, size * 0.4);
      let smallSize = random(size * 0.1, size * 0.3);
      ellipse(
        cos(angle) * distance,
        sin(angle) * distance,
        smallSize,
        smallSize,
      );
    }

    pop();
  }

  drawConnection(x1, y1, x2, y2, width) {
    // Draw a smooth connection between two points
    push();

    // Find the midpoint with some random offset for natural flow
    let midX = (x1 + x2) / 2 + random(-width / 2, width / 2);
    let midY = (y1 + y2) / 2 + random(-width / 2, width / 2);

    // Draw a curved shape to connect the blobs
    beginShape();

    // Start at first point
    vertex(x1, y1);

    // Add control points for a natural curve
    let controlX1 = x1 + (midX - x1) * 0.5;
    let controlY1 = y1 + (midY - y1) * 0.5;
    let controlX2 = midX + (x2 - midX) * 0.5;
    let controlY2 = midY + (y2 - midY) * 0.5;

    // Add points along the curve with some width
    for (let t = 0; t <= 1; t += 0.1) {
      // Bezier curve calculation
      let bx = bezierPoint(x1, controlX1, controlX2, x2, t);
      let by = bezierPoint(y1, controlY1, controlY2, y2, t);

      // Add perpendicular width
      let angle =
        atan2(
          bezierTangent(y1, controlY1, controlY2, y2, t),
          bezierTangent(x1, controlX1, controlX2, x2, t),
        ) + HALF_PI;

      // Width varies along the connection for a more natural look
      let currentWidth = width * (1 - abs(t - 0.5) * 1.5);
      if (currentWidth > 0) {
        vertex(bx + cos(angle) * currentWidth, by + sin(angle) * currentWidth);
      }
    }

    // Go back along the other side
    for (let t = 1; t >= 0; t -= 0.1) {
      let bx = bezierPoint(x1, controlX1, controlX2, x2, t);
      let by = bezierPoint(y1, controlY1, controlY2, y2, t);

      let angle =
        atan2(
          bezierTangent(y1, controlY1, controlY2, y2, t),
          bezierTangent(x1, controlX1, controlX2, x2, t),
        ) + HALF_PI;

      let currentWidth = width * (1 - abs(t - 0.5) * 1.5);
      if (currentWidth > 0) {
        vertex(bx - cos(angle) * currentWidth, by - sin(angle) * currentWidth);
      }
    }

    endShape(CLOSE);

    pop();
  }
}

function keyPressed() {
  if (key === 's') {
    saveGif(`mySketch-${round(new Date().getTime() / 100000)}`, 5);
  }

  if (key === 'c') {
    saveCanvas(`mySketch-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }
}
