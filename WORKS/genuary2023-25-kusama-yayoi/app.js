let r = 10;
let inc = 0.01;
let start = 0;
let level = 3;
let isDark = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
}

function draw() {
  if (isDark) {
    background(0);
  } else {
    fill("gold");
    rect(0, 0, width, height / 2);
    fill("#c70067");
    rect(0, height / 2, width, height / 2);
  }

  let xoff = start;

  for (let x = 0; x < width; x += r) {
    const y = noise(xoff) * height;

    if (isDark) fill("gold");
    else fill(0);

    if (isDark && y > height / 2) fill("#c70067");
    ellipse(x * 1.2, y, r, r);

    if (isDark && y + 1.25 * r + 0.5 * r > height / 2) fill("#c70067");
    if (x % 20 === 0)
      ellipse(x * 1.2, y + 1.25 * r + 0.5 * r, 1.5 * r, 1.5 * r);

    if (isDark && y + 3 * r + r > height / 2) fill("#c70067");
    if (x % 30 === 0) ellipse(x * 1.2, y + 3 * r + r, 2 * r, 2 * r);

    if (isDark && y + 6 * r + 1.5 * r > height / 2) fill("#c70067");
    if (x % 40 === 0) ellipse(x * 1.2, y + 6 * r + 1.5 * r, 4 * r, 4 * r);

    if (isDark && y + 9 * r + 2 * r > height / 2) fill("#c70067");
    if (x % 30 === 0) ellipse(x * 1.2, y + 9 * r + 2 * r, 2 * r, 2 * r);

    if (isDark && y + 10.75 * r + 2.5 * r > height / 2) fill("#c70067");
    if (x % 20 === 0)
      ellipse(x * 1.2, y + 10.75 * r + 2.5 * r, 1.5 * r, 1.5 * r);

    if (isDark && y + 12 * r + 3 * r > height / 2) fill("#c70067");
    ellipse(x * 1.2, y + 12 * r + 3 * r, r, r);

    xoff += inc;
  }

  start += inc;
}

function keyPressed() {
  if (key === "c") isDark = !isDark;

  if (key === "s") {
    saveGif("mySketch", 5);
  }
}
