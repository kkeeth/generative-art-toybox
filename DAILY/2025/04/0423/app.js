// Grid parameters
const gridSize = 10; // Number of cells in each row/column
let cellSize;
let shapes = [];
let colors = [];
let currentPalette = 'Hokusai'; // You can change this to any palette name from colorPalette.js
let globalTime = 0;

function setup() {
  createCanvas((W = min(windowWidth, windowHeight) - 50), W);
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

      // Fish fin animation parameters
      const finType = floor(random(3)); // 0: dorsal fin, 1: pectoral fin, 2: caudal fin
      const finSize = random(0.5, 1.5); // Random size multiplier
      const finSpeed = random(0.5, 2); // Random speed multiplier
      const finAmplitude = random(0.2, 0.5); // Random amplitude for fin movement
      const finFrequency = random(1, 3); // Random frequency for fin movement

      // Create the shape object
      const shape = {
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
        finType: finType,
        finSize: finSize,
        finSpeed: finSpeed,
        finAmplitude: finAmplitude,
        finFrequency: finFrequency,
        points: [],
      };

      // Generate points for the shape
      if (shapeType === 0) {
        // Square points
        const size = cellSize * 0.8;
        shape.points = [
          { x: -size / 2, y: -size / 2 },
          { x: size / 2, y: -size / 2 },
          { x: size / 2, y: size / 2 },
          { x: -size / 2, y: size / 2 },
        ];
      } else if (shapeType === 1) {
        // Triangle points
        const size = cellSize * 0.8;
        shape.points = [
          { x: 0, y: -size / 2 },
          { x: size / 2, y: size / 2 },
          { x: -size / 2, y: size / 2 },
        ];
      } else {
        // Circle points (approximated with many points)
        const radius = cellSize * 0.4;
        const numPoints = 20;
        for (let p = 0; p < numPoints; p++) {
          const angle = (p / numPoints) * TWO_PI;
          shape.points.push({
            x: radius * cos(angle),
            y: radius * sin(angle),
          });
        }
      }

      // Add the shape to the shapes array
      shapes.push(shape);
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
      if (!shape.isAnimating) {
        shape.isAnimating = true;
        shape.lastAnimationTime = globalTime;
      }

      // Draw shape with fish fin-like animation
      if (shape.type === 0) {
        // Square
        drawFinShape(shape);
      } else if (shape.type === 1) {
        // Triangle
        drawFinShape(shape);
      } else {
        // Circle
        drawFinShape(shape);
      }
    } else {
      // Draw shape normally when not animating
      if (shape.type === 0) {
        // Square
        beginShape();
        for (let point of shape.points) {
          vertex(point.x, point.y);
        }
        endShape(CLOSE);
      } else if (shape.type === 1) {
        // Triangle
        beginShape();
        for (let point of shape.points) {
          vertex(point.x, point.y);
        }
        endShape(CLOSE);
      } else {
        // Circle
        beginShape();
        for (let point of shape.points) {
          vertex(point.x, point.y);
        }
        endShape(CLOSE);
      }
    }

    pop();
  }
}

function drawFinShape(shape) {
  // Calculate time-based animation
  const t = globalTime * shape.finSpeed;

  // Draw the shape with fin-like movement
  beginShape();

  if (shape.type === 0) {
    // Square with fin movement
    for (let i = 0; i < shape.points.length; i++) {
      const point = shape.points[i];
      let dx = 0;
      let dy = 0;

      // Apply different fin movements based on fin type
      if (shape.finType === 0) {
        // Dorsal fin (top edge)
        if (i === 0 || i === 1) {
          const wave =
            sin(t * shape.finFrequency + shape.phase) *
            cos(t * shape.finFrequency * 0.5) *
            shape.finAmplitude *
            cellSize;
          dy = wave;
        }
      } else if (shape.finType === 1) {
        // Pectoral fin (side edges)
        if (i === 0 || i === 3) {
          const wave =
            sin(t * shape.finFrequency + shape.phase) *
            cos(t * shape.finFrequency * 0.7) *
            shape.finAmplitude *
            cellSize;
          dx = wave;
        }
      } else {
        // Caudal fin (all points with varying intensity)
        const intensity = map(i, 0, shape.points.length - 1, 0.2, 1);
        const wave =
          sin(t * shape.finFrequency + shape.phase + i * 0.5) *
          cos(t * shape.finFrequency * 0.3) *
          shape.finAmplitude *
          cellSize *
          intensity;
        dx = wave * cos((i * PI) / 2);
        dy = wave * sin((i * PI) / 2);
      }

      vertex(point.x + dx, point.y + dy);
    }
  } else if (shape.type === 1) {
    // Triangle with fin movement
    for (let i = 0; i < shape.points.length; i++) {
      const point = shape.points[i];
      let dx = 0;
      let dy = 0;

      // Apply different fin movements based on fin type
      if (shape.finType === 0) {
        // Dorsal fin (top point)
        if (i === 0) {
          const wave =
            sin(t * shape.finFrequency + shape.phase) *
            cos(t * shape.finFrequency * 0.5) *
            shape.finAmplitude *
            cellSize;
          dy = wave;
        }
      } else if (shape.finType === 1) {
        // Pectoral fin (bottom points)
        if (i === 1 || i === 2) {
          const wave =
            sin(t * shape.finFrequency + shape.phase) *
            cos(t * shape.finFrequency * 0.7) *
            shape.finAmplitude *
            cellSize;
          dx = wave * (i === 1 ? 1 : -1);
        }
      } else {
        // Caudal fin (all points with varying intensity)
        const intensity = map(i, 0, shape.points.length - 1, 0.2, 1);
        const wave =
          sin(t * shape.finFrequency + shape.phase + i * 0.5) *
          cos(t * shape.finFrequency * 0.3) *
          shape.finAmplitude *
          cellSize *
          intensity;
        dx = wave * cos((i * PI) / 2);
        dy = wave * sin((i * PI) / 2);
      }

      vertex(point.x + dx, point.y + dy);
    }
  } else {
    // Circle with fin movement
    for (let i = 0; i < shape.points.length; i++) {
      const point = shape.points[i];
      let dx = 0;
      let dy = 0;

      // Apply different fin movements based on fin type
      if (shape.finType === 0) {
        // Dorsal fin (top half)
        if (point.y < 0) {
          const wave =
            sin(t * shape.finFrequency + shape.phase) *
            cos(t * shape.finFrequency * 0.5) *
            shape.finAmplitude *
            cellSize;
          dy = wave;
        }
      } else if (shape.finType === 1) {
        // Pectoral fin (left/right sides)
        if (abs(point.x) > abs(point.y)) {
          const wave =
            sin(t * shape.finFrequency + shape.phase) *
            cos(t * shape.finFrequency * 0.7) *
            shape.finAmplitude *
            cellSize;
          dx = wave * (point.x > 0 ? 1 : -1);
        }
      } else {
        // Caudal fin (all points with varying intensity)
        const angle = atan2(point.y, point.x);
        const intensity = map(sin(angle), -1, 1, 0.2, 1);
        const wave =
          sin(t * shape.finFrequency + shape.phase + i * 0.5) *
          cos(t * shape.finFrequency * 0.3) *
          shape.finAmplitude *
          cellSize *
          intensity;
        dx = wave * cos(angle);
        dy = wave * sin(angle);
      }

      vertex(point.x + dx, point.y + dy);
    }
  }

  endShape(CLOSE);
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
