let cp = [
  "#e6302b",
  "#fd7800",
  "#fbd400",
  "#51b72d",
  "#2abde4",
  "#4e59a4",
  "#085a9b",
  "#f477c3",
];
const step = 40;
let t = 0;
let w;

function setup() {
  createCanvas((W = windowHeight), W);
  background(255);
  rectMode(CENTER);
  noStroke();
  fill(0, 200);

  w = width / 60;

  for (let i = 0; i < width; i += step) {
    let isEvenCol = i % (step * 2) === 0;

    for (let j = 0; j < height; j += step * 2) {
      let n = int(random(6, 10));
      let wing = w;
      if (isEvenCol) {
        wing /= 2.5;
      }
      let color1 = random(cp);
      let color2 = random(cp);

      push();
      if (isEvenCol) {
        translate(i + step / 2, j);
      } else {
        translate(i + step / 2, j + step);
      }
      scale(map(j, 0, height, 0.2, 1));
      for (let i = 0; i < n; i++) {
        fill(lerpColor(color(color1), color(color2), i / n));
        ellipse(1.4 * wing, 0, wing, wing);
        // ellipse(1.4 * wing, 0, 2 * wing, 0.8 * wing);
        rotate(TAU / n);
      }
      fill(random(cp));
      circle(0, 0, 1.8 * wing);
      // circle(0, 0, 0.8 * wing);
      pop();
    }
  }
}

function keyPressed() {
  if (key == "s") {
    saveCanvas("2023041503", "png");
  }
}
