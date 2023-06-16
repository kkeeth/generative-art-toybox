const NUM = 20;
let tiles = [];
let g;
let seed;

function setup() {
  createCanvas((W = 720), W);
  seed = random(1000);

  g = W / 8;

  for (let i = 0; i < W; i += g) {
    for (let j = 0; j < W; j += g) {
      tiles.push({
        x: i,
        y: j,
        o: createGraphics(g, g),
      });
    }
  }
  // }

  // function draw() {
  // background(220);
  // randomSeed(seed);

  for (let { x, y, o } of tiles) {
    o.background(random(255));
    o.fill("pink");
    o.textSize(g / 2);
    o.textAlign(CENTER);
    o.translate(o.width / 2, o.height / 2);
    o.text("K", g / 8, 0);
    o.rotate((2 * PI) / 3);
    o.text("K", g / 8, 0);
    o.rotate((2 * PI) / 3);
    o.text("K", g / 8, 0);
    o.push();
    o.stroke("red");
    o.strokeWeight(8);
    o.point(0, 0);
    o.pop();
    image(o, x, y);
  }
}

function keyPressed() {
  if (key === "c") {
    saveCanvas("mySketch", "png");
  }
  if (key === "s") {
    saveGif("mySketch", 3);
  }
}
