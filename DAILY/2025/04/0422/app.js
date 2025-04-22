// Grid parameters
const gridSize = 10; // Number of cells in each row/column
let cellSize;
let shapes = [];
let colors = [];
let currentPalette = 'Hokusai'; // You can change this to any palette name from colorPalette.js
let globalTime = 0;

function setup() {
  createCanvas((W = min(windowWidth, windowHeight) - 50), W);
  rectMode(CENTER);

  cellSize = W / gridSize;

  // Select 3 colors from the chosen palette
  const palette = colorPalette.find((p) => p.name === currentPalette);
  if (palette) {
    // Take the first 3 colors from the palette
    colors = palette.colors.slice(0, 3);
  } else {
    // Fallback colors if palette not found
    colors = ['#074A59', '#F2C166', '#F28241'];
  }

  // Initialize shapes
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      // Randomly choose shape type (0: square, 1: triangle, 2: circle)
      const shapeType = floor(random(3));
      // Randomly choose color index
      const colorIndex = floor(random(3));

      // For squares and triangles, ensure one side is parallel to x-axis
      // by setting rotation to multiples of 90 degrees
      const baseRotation =
        shapeType === 2 ? random(TWO_PI) : (floor(random(4)) * PI) / 2;

      // Animation parameters
      const animationDelay = random(0, 10); // Random delay before animation starts
      const animationDuration = random(3, 8); // Random duration for each animation cycle
      const isActive = random() < 0.3; // Only 30% of shapes are active at a time
      const phase = random(TWO_PI); // Random phase for sine wave

      // Door-like animation parameters
      const doorDirection = floor(random(2)); // 0: horizontal, 1: vertical
      const doorSide = floor(random(2)); // 0: left/top, 1: right/bottom

      shapes.push({
        x: i * cellSize + cellSize / 2,
        y: j * cellSize + cellSize / 2,
        type: shapeType,
        color: colors[colorIndex],
        rotation: baseRotation,
        baseRotation: baseRotation,
        animationDelay: animationDelay,
        animationDuration: animationDuration,
        isActive: isActive,
        phase: phase,
        lastAnimationTime: 0,
        isAnimating: false,
        doorDirection: doorDirection,
        doorSide: doorSide,
        isClosing: false,
        isOpening: false,
      });
    }
  }
}

function draw() {
  background(255);
  globalTime += 0.03;

  // Draw each shape
  for (let shape of shapes) {
    push();
    translate(shape.x, shape.y);
    rotate(shape.baseRotation);

    // Set fill color
    fill(shape.color);
    noStroke();

    // Check if it's time to start a new animation cycle
    if (
      shape.isActive &&
      globalTime - shape.lastAnimationTime > shape.animationDelay
    ) {
      if (!shape.isAnimating && !shape.isClosing && !shape.isOpening) {
        shape.isAnimating = true;
        shape.lastAnimationTime = globalTime;

        // Start with closing phase
        shape.isClosing = true;
        shape.isOpening = false;
      }

      // Handle closing phase
      if (shape.isClosing) {
        let closeProgress =
          (globalTime - shape.lastAnimationTime) / shape.animationDuration;
        if (closeProgress > 1) {
          closeProgress = 1;
          shape.isClosing = false;
          shape.isOpening = true;
          shape.lastAnimationTime = globalTime;
        }

        // Draw shape with door-like closing effect
        if (shape.type === 0) {
          // Square
          if (shape.doorDirection === 0) {
            // Horizontal door
            const width = cellSize * 0.8 * (1 - closeProgress);
            if (shape.doorSide === 0) {
              // Left side
              rect(-cellSize * 0.4 + width / 2, 0, width, cellSize * 0.8);
            } else {
              // Right side
              rect(cellSize * 0.4 - width / 2, 0, width, cellSize * 0.8);
            }
          } else {
            // Vertical door
            const height = cellSize * 0.8 * (1 - closeProgress);
            if (shape.doorSide === 0) {
              // Top side
              rect(0, -cellSize * 0.4 + height / 2, cellSize * 0.8, height);
            } else {
              // Bottom side
              rect(0, cellSize * 0.4 - height / 2, cellSize * 0.8, height);
            }
          }
        } else if (shape.type === 1) {
          // Triangle
          const size = cellSize * 0.8;
          if (shape.doorDirection === 0) {
            // Horizontal door
            const width = size * (1 - closeProgress);
            if (shape.doorSide === 0) {
              // Left side
              const x = -size / 2 + width / 2;
              triangle(x, -size / 2, x + width, size / 2, x, size / 2);
            } else {
              // Right side
              const x = size / 2 - width / 2;
              triangle(x, -size / 2, x + width, size / 2, x, size / 2);
            }
          } else {
            // Vertical door
            const height = size * (1 - closeProgress);
            if (shape.doorSide === 0) {
              // Top side
              const y = -size / 2 + height / 2;
              triangle(0, y, size / 2, y + height, -size / 2, y + height);
            } else {
              // Bottom side
              const y = size / 2 - height / 2;
              triangle(0, y, size / 2, y + height, -size / 2, y + height);
            }
          }
        } else {
          // Circle - use a different approach for circles
          const diameter = cellSize * 0.8 * (1 - closeProgress);
          ellipse(0, 0, diameter, diameter);
        }
      }

      // Handle opening phase
      if (shape.isOpening) {
        let openProgress =
          (globalTime - shape.lastAnimationTime) / shape.animationDuration;
        if (openProgress > 1) {
          openProgress = 1;
          shape.isOpening = false;
          shape.isAnimating = false;
          shape.lastAnimationTime = globalTime;
          // shape.animationDelay = random(2, 8); // New random delay before next animation
        }

        // Draw shape with door-like opening effect
        if (shape.type === 0) {
          // Square
          if (shape.doorDirection === 0) {
            // Horizontal door
            const width = cellSize * 0.8 * openProgress;
            if (shape.doorSide === 0) {
              // Left side
              rect(-cellSize * 0.4 + width / 2, 0, width, cellSize * 0.8);
            } else {
              // Right side
              rect(cellSize * 0.4 - width / 2, 0, width, cellSize * 0.8);
            }
          } else {
            // Vertical door
            const height = cellSize * 0.8 * openProgress;
            if (shape.doorSide === 0) {
              // Top side
              rect(0, -cellSize * 0.4 + height / 2, cellSize * 0.8, height);
            } else {
              // Bottom side
              rect(0, cellSize * 0.4 - height / 2, cellSize * 0.8, height);
            }
          }
        } else if (shape.type === 1) {
          // Triangle
          const size = cellSize * 0.8;
          if (shape.doorDirection === 0) {
            // Horizontal door
            const width = size * openProgress;
            if (shape.doorSide === 0) {
              // Left side
              const x = -size / 2 + width / 2;
              triangle(x, -size / 2, x + width, size / 2, x, size / 2);
            } else {
              // Right side
              const x = size / 2 - width / 2;
              triangle(x, -size / 2, x + width, size / 2, x, size / 2);
            }
          } else {
            // Vertical door
            const height = size * openProgress;
            if (shape.doorSide === 0) {
              // Top side
              const y = -size / 2 + height / 2;
              triangle(0, y, size / 2, y + height, -size / 2, y + height);
            } else {
              // Bottom side
              const y = size / 2 - height / 2;
              triangle(0, y, size / 2, y + height, -size / 2, y + height);
            }
          }
        } else {
          // Circle - use a different approach for circles
          const diameter = cellSize * 0.8 * openProgress;
          ellipse(0, 0, diameter, diameter);
        }
      }
    } else {
      // Draw shape normally when not animating
      if (shape.type === 0) {
        // Square
        rectMode(CENTER);
        rect(0, 0, cellSize * 0.8, cellSize * 0.8);
      } else if (shape.type === 1) {
        // Triangle
        const size = cellSize * 0.8;
        triangle(0, -size / 2, size / 2, size / 2, -size / 2, size / 2);
      } else {
        // Circle
        ellipse(0, 0, cellSize * 0.8, cellSize * 0.8);
      }
    }

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

  // Change palette with number keys 1-9
  if (key >= '1' && key <= '9') {
    const index = parseInt(key) - 1;
    if (index < colorPalette.length) {
      currentPalette = colorPalette[index].name;
      // Reinitialize shapes with new colors
      setup();
    }
  }

  // Reset animation with 'r' key
  if (key === 'r') {
    setup();
  }
}
