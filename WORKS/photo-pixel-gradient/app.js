let img;
let pixelData = [];
let canvasSize;
let isVertical = false;

function setup() {
  canvasSize = min(windowWidth, windowHeight) - 200;
  let canvas = createCanvas(canvasSize, canvasSize);
  canvas.parent('canvas-container');
  noLoop();

  background(255);
  textAlign(CENTER, CENTER);
  textSize(16);
  fill(100);
  text('Upload an image to begin', width / 2, height / 2);

  let imageInput = select('#imageInput');
  imageInput.changed(handleImageUpload);
}

function draw() {
  if (!img || !img.width) {
    return;
  }

  background(255);
  drawPixelatedImage();
}

function handleImageUpload() {
  let input = select('#imageInput').elt;
  if (input.files && input.files[0]) {
    let file = input.files[0];
    let reader = new FileReader();

    reader.onload = function (e) {
      img = loadImage(e.target.result, imageLoaded);
    };

    reader.readAsDataURL(file);
  }
}

function imageLoaded() {
  if (!img) return;

  isVertical = img.height > img.width;
  processImagePixels();
  redraw();
}

function processImagePixels() {
  pixelData = [];
  img.loadPixels();

  let scaleFactor = min(canvasSize / img.width, canvasSize / img.height);
  let displayWidth = img.width * scaleFactor;
  let displayHeight = img.height * scaleFactor;
  let offsetX = (canvasSize - displayWidth) / 2;
  let offsetY = (canvasSize - displayHeight) / 2;

  let minRes = 1;
  let maxRes = 30;

  if (isVertical) {
    for (let y = 0; y < displayHeight; ) {
      let progress = 1 - y / displayHeight;
      let pixelSize =
        progress > 0.7 ? minRes : lerp(maxRes, minRes, progress / 0.7);

      for (let x = 0; x < displayWidth; x += pixelSize) {
        let sourceX = int(x / scaleFactor);
        let sourceY = int(y / scaleFactor);

        if (
          sourceX >= 0 &&
          sourceX < img.width &&
          sourceY >= 0 &&
          sourceY < img.height
        ) {
          let index = (sourceY * img.width + sourceX) * 4;
          let r = img.pixels[index];
          let g = img.pixels[index + 1];
          let b = img.pixels[index + 2];

          pixelData.push({
            x: x + offsetX,
            y: y + offsetY,
            color: color(r, g, b),
            size: pixelSize,
            progress: progress,
          });
        }
      }
      y += pixelSize;
    }
  } else {
    for (let x = 0; x < displayWidth; ) {
      let progress = 1 - x / displayWidth;
      let pixelSize =
        progress > 0.7 ? minRes : lerp(maxRes, minRes, progress / 0.7);

      for (let y = 0; y < displayHeight; y += pixelSize) {
        let sourceX = int(x / scaleFactor);
        let sourceY = int(y / scaleFactor);

        if (
          sourceX >= 0 &&
          sourceX < img.width &&
          sourceY >= 0 &&
          sourceY < img.height
        ) {
          let index = (sourceY * img.width + sourceX) * 4;
          let r = img.pixels[index];
          let g = img.pixels[index + 1];
          let b = img.pixels[index + 2];

          pixelData.push({
            x: x + offsetX,
            y: y + offsetY,
            color: color(r, g, b),
            size: pixelSize,
            progress: progress,
          });
        }
      }
      x += pixelSize;
    }
  }
}

function drawPixelatedImage() {
  if (pixelData.length === 0) return;

  for (let pixel of pixelData) {
    let progress = pixel.progress;
    let pixelColor = pixel.color;

    if (
      brightness(pixelColor) > 90 &&
      red(pixelColor) > 240 &&
      green(pixelColor) > 240 &&
      blue(pixelColor) > 240
    ) {
      pixelColor = color(255, 255, 255);
    }

    if (progress > 0.7) {
      fill(pixelColor);
      noStroke();
      rect(pixel.x, pixel.y, pixel.size, pixel.size);
    } else {
      let normalizedProgress = progress / 0.7;

      let fillAlpha = map(normalizedProgress, 0, 1, 0, 255);
      fillAlpha = constrain(fillAlpha, 0, 255);

      let strokeOpacity = map(normalizedProgress, 0, 1, 255, 100);
      let strokeColor = lerpColor(color(0), pixelColor, normalizedProgress);
      strokeColor = color(
        red(strokeColor),
        green(strokeColor),
        blue(strokeColor),
        strokeOpacity,
      );

      stroke(strokeColor);
      strokeWeight(map(normalizedProgress, 0, 1, 1, 0.3));

      if (brightness(pixelColor) > 70) {
        let backgroundAlpha = map(normalizedProgress, 0, 1, 50, 255);
        fill(255, 255, 255, backgroundAlpha);
      } else {
        fill(red(pixelColor), green(pixelColor), blue(pixelColor), fillAlpha);
      }

      drawGradualRect(
        pixel.x,
        pixel.y,
        pixel.size,
        pixel.size,
        normalizedProgress,
      );
    }
  }
}

function drawGradualRect(x, y, w, h, progress) {
  let maxJitter = 1;
  let jitterAmount = map(progress, 0, 1, maxJitter, 0);

  if (progress < 0.9) {
    let corners = [
      {
        x: x + random(-jitterAmount, jitterAmount),
        y: y + random(-jitterAmount, jitterAmount),
      },
      {
        x: x + w + random(-jitterAmount, jitterAmount),
        y: y + random(-jitterAmount, jitterAmount),
      },
      {
        x: x + w + random(-jitterAmount, jitterAmount),
        y: y + h + random(-jitterAmount, jitterAmount),
      },
      {
        x: x + random(-jitterAmount, jitterAmount),
        y: y + h + random(-jitterAmount, jitterAmount),
      },
    ];

    beginShape();
    for (let corner of corners) {
      vertex(corner.x, corner.y);
    }
    endShape(CLOSE);
  } else {
    rect(x, y, w, h);
  }
}

function keyPressed() {
  if (key === 's') {
    saveGif(`photo-pixel-gradient-${round(new Date().getTime() / 100000)}`, 1);
  }

  if (key === 'c') {
    saveCanvas(
      `photo-pixel-gradient-${round(new Date().getTime() / 100000)}`,
      'jpeg',
    );
  }
}
