let xoff = 0;
let dFlg = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 1);
}

function draw() {
  background(255);
  translate(windowWidth / 2, windowHeight / 2);

  noStroke();
  fill("#3182FE");
  circle(0, 0, 300);

  fill("#FFF");
  circle(0, 0, 260);

  fill("#3182FE");
  circle(0, 0, 140);

  strokeWeight(10);
  stroke("#FFF");
  fill("#3182FE");
  // fill(color(noise(xoff), 1, 1));
  circle(
    140 * cos(-2 * radians(frameCount)),
    140 * sin(-2 * radians(frameCount)),
    60,
  );
  // if (dFlg) {
  //   circle(
  //     140 * cos(-2 * radians(frameCount)),
  //     140 * sin(-2 * radians(frameCount)),
  //     60,
  //     // 60 * cos(2 * radians(frameCount)),
  //   );
  // } else {
  //   circle(
  //     140 * cos(2 * radians(frameCount)),
  //     140 * sin(2 * radians(frameCount)),
  //     60,
  //   );
  // }
  // if (radians(frameCount) % PI === 0) dFlg = !dFlg;
  // xoff += 0.01;
}
