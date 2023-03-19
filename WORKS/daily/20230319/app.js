const NUM = 4;
const POINTS = 16;
let positions = [];
let from, to;
let g;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  blendMode(HARD_LIGHT);
  g = width / NUM;

  for (let j = 0; j < NUM; j++) {
    let tmp = [];
    for (let i = 0; i < POINTS; i++) {
      tmp.push({
        x:
          i < POINTS / 2
            ? random(g * j, (g * (j + 1)) / 2)
            : random((g * (j + 1)) / 2, g * (j + 1)),
        y: i < POINTS / 2 ? random(0, height / 2) : random(height / 2, height),
        off: int(random() * 10),
      });
      if (i === POINTS - 1) {
        positions.push(tmp);
      }
    }
  }
}

function draw() {
  background(255);

  from = color(255, 0, 0, 0.2 * 255);
  to = color(0, 0, 255, 0.2 * 255);

  positions.forEach((p, index) => {
    fill(lerpColor(from, to, index / NUM));

    for (let i = 0; i < POINTS / NUM; i++) {
      quad(
        p[0 * (i + 1)].x + noise(p[0 * (i + 1)].off) * (g / 2),
        p[0 * (i + 1)].y + noise(p[0 * (i + 1)].off) * (g / 2),
        p[1 * (i + 1)].x + noise(p[1 * (i + 1)].off) * (g / 2),
        p[1 * (i + 1)].y + noise(p[1 * (i + 1)].off) * (g / 2),
        p[2 * (i + 1)].x + noise(p[2 * (i + 1)].off) * (g / 2),
        p[2 * (i + 1)].y + noise(p[2 * (i + 1)].off) * (g / 2),
        p[3 * (i + 1)].x + noise(p[3 * (i + 1)].off) * (g / 2),
        p[3 * (i + 1)].y + noise(p[3 * (i + 1)].off) * (g / 2),
      );
    }

    for (let i = 0; i < POINTS; i++) {
      p[i].off += random(0.05);
    }
  });
}

function keyPressed() {
  // this will download the first 5 seconds of the animation!
  if (key === "s") {
    saveGif("mySketch", 5);
  }
}
