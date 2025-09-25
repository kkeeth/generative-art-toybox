// Configuration constants
const CONFIG = {
  SPIRAL_COUNT: 7,
  BASE_RADIUS: 60,
  RADIUS_INCREMENT: 60,
  POINT_SPACING: 3,
  STROKE_WEIGHT: 5,
  BACKGROUND_COLOR: 10,
  ROTATION_SPEED: 0.03,
  HEIGHT_SCALE: 0.8,
  COLOR_FREQUENCY: 33,
  COLOR_AMPLITUDE: 100,
  COLOR_OFFSET: 155,
  YDIFF_RANGE: { min: -60, max: 120 },
};

// Global variables
let time = 0;
let W = 0;

/**
 * Calculate the y-difference for the spiral effect
 */
function calculateYdiff(heightPosition) {
  return map(
    heightPosition,
    0,
    W,
    CONFIG.YDIFF_RANGE.max,
    CONFIG.YDIFF_RANGE.min,
  );
}

/**
 * Calculate spiral point coordinates
 */
function calculateSpiralPoint(radius, angle, ydiff) {
  const x = (radius + ydiff) * cos(angle);
  const z = (radius + ydiff) * sin(angle);
  return { x, z };
}

/**
 * Draw a single spiral point with rotation
 */
function drawSpiralPoint(radius, angle, heightPosition, rotationDirection) {
  const ydiff = calculateYdiff(heightPosition);
  const { x, z } = calculateSpiralPoint(radius, angle, ydiff);

  // Calculate dynamic color
  const colorValue =
    CONFIG.COLOR_AMPLITUDE * sin(angle / CONFIG.COLOR_FREQUENCY + time) +
    CONFIG.COLOR_OFFSET;
  stroke(colorValue, angle % 255, angle % 200);

  push();
  rotateY(rotationDirection * time);
  point(x, heightPosition / CONFIG.HEIGHT_SCALE, z);
  pop();
}

/**
 * Draw all spiral layers
 */
function drawSpiralLayers() {
  for (
    let heightPosition = 0;
    heightPosition < W;
    heightPosition += CONFIG.POINT_SPACING
  ) {
    for (let layer = 0; layer < CONFIG.SPIRAL_COUNT; layer++) {
      const radius = CONFIG.BASE_RADIUS + layer * CONFIG.RADIUS_INCREMENT;
      const rotationDirection = layer % 2 === 0 ? 1 : -1;

      drawSpiralPoint(
        radius,
        heightPosition,
        heightPosition,
        rotationDirection,
      );
    }
  }
}

function setup() {
  createCanvas(windowWidth, (W = windowHeight), WEBGL);
  strokeWeight(CONFIG.STROKE_WEIGHT);
}

function draw() {
  background(CONFIG.BACKGROUND_COLOR);

  // Position the spiral at the center
  translate(0, -W / 2);

  // Draw all spiral layers
  drawSpiralLayers();

  // Update time for animation
  time += CONFIG.ROTATION_SPEED;
}

function keyPressed() {
  if (key === 's') {
    saveGif(`mySketch-${round(new Date().getTime() / 100000)}`, 3);
  }

  if (key === 'c') {
    saveCanvas(`mySketch-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }
}
