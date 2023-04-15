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
const step = 80;
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
    for (let j = 0; j < height; j += step) {
      let n = int(random(5, 10));
      let wing = w / 1.5;
      let r = random(HALF_PI);

      push();
      translate(i + step / 2, j + step / 2);
      rotate(r);
      for (let i = 0; i < n; i++) {
        fill(lerpColor(color(random(cp)), color(random(cp)), i / n));
        ellipse(1.4 * wing, 0, 2 * wing, 0.8 * wing);
        rotate(TAU / n);
      }
      fill(random(cp));
      circle(0, 0, wing * 0.8);
      pop();
    }
  }
}

function keyPressed() {
  if (key == "s") {
    saveCanvas("mysketch", "png");
  }
}
