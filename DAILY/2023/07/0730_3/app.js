const baseSize = 3;
const cp = [
  "#e6302b",
  "#fd7800",
  "#fbd400",
  "#51b72d",
  "#2abde4",
  "#4e59a4",
  "#085a9b",
  "#f477c3",
];

function setup() {
  createCanvas((W = windowHeight - 100), W);
  // noStroke();
  background("navy");
  let selectedColor = "#ffffff";
  let opacity;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if ((x + y) % 2 === 0) {
        if (x * baseSize < W / 3) {
          opacity = calculateOpacity(x * baseSize, 0);
        } else if (x * baseSize < (2 * W) / 3) {
          opacity = calculateOpacity(x * baseSize, 1);
        } else {
          opacity = calculateOpacity(x * baseSize, 2);
        }
        fill(...hexToRgb(selectedColor), opacity);
        ellipse(x * baseSize, y * baseSize, baseSize);
      }
    }
  }
}

function calculateOpacity(x, nth) {
  if (x < (W * (1 + nth * 5)) / 15) {
    return 102;
  } else if (x < (W * (2 + nth * 5)) / 15) {
    return 153;
  } else if (x < (W * (3 + nth * 5)) / 15) {
    return 204;
  } else if (x < (W * (4 + nth * 5)) / 15) {
    return 234;
  } else {
    return 255;
  }
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16), // r
        parseInt(result[2], 16), // g
        parseInt(result[3], 16), // b
      ]
    : null;
}

function keyPressed() {
  if (key === "s") {
    saveCanvas("mySketch", "png");
  }
}
