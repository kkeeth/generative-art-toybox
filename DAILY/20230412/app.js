const NUM = 30;
let span;
let items = [];

function setup() {
  createCanvas((W = windowHeight), W);
  frameRate(20);
  noStroke();
  colorMode(HSB, 360, 100, 100, 100);
  span = W / NUM;

  for (let x = 0; x < NUM + 1; x++) {
    for (let y = 0; y < NUM + 1; y++) {
      items.push(createVector(x, y));
    }
  }
}

function draw() {
  background("#fff");

  for (let i = 0; i < items.length; i++) {
    let { x, y } = items[i];
    fill(frameCount % 360, x + y, x + y, x + y);

    size =
      1.2 *
      span *
      sin(
        frameCount * 0.1 +
          2 * TAU * noise(x * 0.1, y * 0.1, frameCount * 0.001),
      );
    rect((W / NUM) * x, (W / NUM) * y, size);
    // items[i].add(cos(noise(frameCount/10)), cos(noise(frameCount/10)))
  }
}

function keyPressed() {
  if (key === "s") {
    saveGif("mysketch", 5);
  }
}
