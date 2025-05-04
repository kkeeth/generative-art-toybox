// Circle packing inside airplane emoji
let circles = [];
const circleRadius = 5; // 円の半径
const spacing = circleRadius * 2; // 円の間隔
let emoji = '✈';
let globalTime = 0;
let emojiBounds = { left: 0, right: 0, top: 0, bottom: 0 };
let emojiWidth = 0;
let emojiHeight = 0;
let minRadius = 5;
let maxRadius = 20;
let maxAttempts = 1000;
let emojiMask;
let debugMode = false; // Set to true to see the emoji mask

function setup() {
  // createCanvas((W = min(windowWidth, windowHeight) - 600), W);
  createCanvas((W = 200), W);
  noLoop();
  noStroke();

  // Create a temporary canvas to get the emoji outline
  // let tempCanvas = createGraphics(W, W);
  let img = createImage(W, W);
  img.loadPixels();
  tempCanvas.background(255);
  tempCanvas.textAlign(CENTER, CENTER);
  tempCanvas.textSize(W * 1.5);
  tempCanvas.fill(0);
  tempCanvas.text(emoji, W / 2, W / 2.5);
  image(tempCanvas, 0, 0);

  // Get the pixel data to determine the emoji's bounding box
  let pixelData = tempCanvas.drawingContext.getImageData(0, 0, W, W);
  loadPixels();
  console.log(pixelData.data);
  for (let i = 0; i < W * W; i++) {
    console.log(pixelData.data[i]);
    if (pixelData.data[i] !== 255) {
      fill(pixelData.data[i]);
      circle(i % W, i / W, 4);
    }
  }
  // updatePixels();
  emojiBounds = getEmojiBounds(pixelData);

  // Calculate the emoji dimensions
  emojiWidth = emojiBounds.right - emojiBounds.left;
  emojiHeight = emojiBounds.bottom - emojiBounds.top;

  // Create a mask of the emoji
  emojiMask = createImage(200, 200);
  emojiMask.loadPixels();

  const emojiShape = [];
  for (let y = 0; y < 200; y++) {
    for (let x = 0; x < 200; x++) {
      let i = (y * 200 + x) * 4;
      // Check if this pixel is part of the emoji
      if (pixelData.data[i + 3] > 0) {
        emojiShape.push({ x, y });
      }
      emojiMask.pixels[i] = 255; // R
      emojiMask.pixels[i + 1] = 255; // G
      emojiMask.pixels[i + 2] = 255; // B
      emojiMask.pixels[i + 3] = 255; // A
    }
  }
  emojiMask.updatePixels();

  // Pack circles inside the emoji
  packCircles();

  console.log(`Placed ${circles.length} circles inside the emoji`);
}

function getEmojiBounds(pixelData) {
  let bounds = {
    left: pixelData.width,
    right: 0,
    top: pixelData.height,
    bottom: 0,
  };

  for (let y = 0; y < pixelData.height; y++) {
    for (let x = 0; x < pixelData.width; x++) {
      let i = (y * pixelData.width + x) * 4;
      if (pixelData.data[i + 3] > 0) {
        // Alpha channel > 0
        bounds.left = min(bounds.left, x);
        bounds.right = max(bounds.right, x);
        bounds.top = min(bounds.top, y);
        bounds.bottom = max(bounds.bottom, y);
      }
    }
  }

  return bounds;
}

function packCircles() {
  // Clear any existing circles
  circles = [];

  // Create a grid of potential circle positions
  let gridSize = 10;
  let gridPoints = [];

  // Generate grid points within the emoji bounds
  for (let y = emojiBounds.top; y <= emojiBounds.bottom; y += gridSize) {
    for (let x = emojiBounds.left; x <= emojiBounds.right; x += gridSize) {
      if (isPointInEmoji(x, y)) {
        gridPoints.push({ x: x, y: y });
      }
    }
  }

  console.log(`Found ${gridPoints.length} potential points inside the emoji`);

  // Shuffle the grid points
  for (let i = gridPoints.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [gridPoints[i], gridPoints[j]] = [gridPoints[j], gridPoints[i]];
  }

  // Try to place circles at each grid point
  for (let i = 0; i < gridPoints.length; i++) {
    let point = gridPoints[i];

    // Try different radius sizes, starting with the largest
    for (let r = maxRadius; r >= minRadius; r -= 2) {
      // Check if the circle fits at this point
      if (canPlaceCircle(point.x, point.y, r)) {
        circles.push({
          x: point.x,
          y: point.y,
          r: r,
          color: color(
            random(100, 200),
            random(100, 200),
            random(200, 255),
            200,
          ),
          speed: random(0.2, 0.8),
          phase: random(TWO_PI),
        });
        break; // Found a size that fits, move to next point
      }
    }
  }
}

function canPlaceCircle(x, y, r) {
  // Check if the circle is inside the emoji
  if (!isPointInEmoji(x, y)) {
    return false;
  }

  // Check if the circle overlaps with any existing circles
  for (let i = 0; i < circles.length; i++) {
    let d = dist(x, y, circles[i].x, circles[i].y);
    if (d < r + circles[i].r) {
      return false;
    }
  }

  return true;
}

function isPointInEmoji(x, y) {
  // Check if the point is inside the emoji mask
  let px = floor(x);
  let py = floor(y);

  if (px < 0 || px >= emojiMask.width || py < 0 || py >= emojiMask.height) {
    return false;
  }

  let i = (py * emojiMask.width + px) * 4;
  return emojiMask.pixels[i + 3] > 0; // Check alpha channel
}

// function draw() {
//   background(255);
//   globalTime += 0.01;

//   // emojiのバウンディングボックスをcanvas中央に拡大・移動
//   let scaleFactor = min(width / emojiWidth, height / emojiHeight) * 0.8;
//   let offsetX =
//     (width - emojiWidth * scaleFactor) / 2 - emojiBounds.left * scaleFactor;
//   let offsetY =
//     (height - emojiHeight * scaleFactor) / 2 - emojiBounds.top * scaleFactor;

//   // emojiの薄いアウトライン
//   push();
//   translate(offsetX, offsetY);
//   scale(scaleFactor);
//   textAlign(LEFT, TOP);
//   textSize(emojiHeight);
//   fill(255, 20);
//   text(emoji, emojiBounds.left, emojiBounds.top);

//   // 円の描画
//   for (let i = 0; i < circles.length; i++) {
//     let c = circles[i];
//     let wobble = sin(globalTime * c.speed + c.phase) * 2;
//     fill(c.color);
//     noStroke();
//     circle(c.x, c.y, c.r * 2 + wobble);
//   }
//   pop();

//   // タイトル・カウント
//   textAlign(CENTER, CENTER);
//   textSize(24);
//   fill(255);
//   text('Airplane Circle Packing', width / 2, 30);
//   textSize(16);
//   text(`Circles: ${circles.length}`, width / 2, height - 30);
// }

function keyPressed() {
  if (key === 'c') {
    saveCanvas(
      `airplane-circle-packing-${round(new Date().getTime() / 100000)}`,
      'jpeg',
    );
  }

  // Toggle debug mode with 'd' key
  if (key === 'd') {
    debugMode = !debugMode;
  }
}
