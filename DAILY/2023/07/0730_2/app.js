const size = 1;
const NUM = 1e4;
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
  createCanvas((W = 600), W);
  background(250);
  translate(W / 2, W / 2);
  strokeWeight(size);
  // ellipse(0, 0, 20);

  let [color1, color2, color3, color4, color5] = [
    random(cp),
    random(cp),
    random(cp),
    random(cp),
    random(cp),
  ];

  for (let i = 0; i < NUM; i++) {
    let a = random(TAU);
    let r = random(W / 2);
    if (r < 5 && random() < 0.6) r = W / 2;
    if (r < 10 && random() < 0.5) r = W / 2;
    if (r < 20 && random() < 0.4) r = W / 2;
    if (r < 30 && random() < 0.3) r = W / 2;
    let x = r * cos(a);
    let y = r * sin(a);
    if (x < -(W / 2 - W / 5)) {
      stroke(color1);
    } else if (x < -(W / 2 - (2 * W) / 5)) {
      stroke(color2);
    } else if (x < W / 2 - (2 * W) / 5) {
      stroke(color3);
    } else if (x < W / 2 - W / 5) {
      stroke(color4);
    } else {
      stroke(color5);
    }
    random() < 0.01 ? line(x, y, x, y + random(50)) : point(x, y);
  }
}

function keyPressed() {
  if (key === "s") {
    saveCanvas("mySketch", "png");
  }
}
