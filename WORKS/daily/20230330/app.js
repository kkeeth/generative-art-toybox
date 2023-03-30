/**
 * This artwork is based on this tweet!
 *
 * https://twitter.com/ky0ju_art/status/1169639081279508480?s=20
 */

let x,
  y,
  t = 0,
  d,
  r,
  v = 8,
  c = 255;
function setup() {
  createCanvas((W = min(windowHeight, 800)), W);
  noStroke();
  r = W / 2;
}
function draw() {
  background(0);
  translate(r, r);
  for (let x = -r; x < r; x += 10) {
    for (let y = -r; y < r; y += 10) {
      d = norm(dist(x, y, 0, 0), r, 0);
      rotate((d * PI) / 30);
      fill(c, c * d, c, c * d);

      circle(x + t, y + t, 10 * d);
    }
  }
  t -= v * d;
  if (t > 500 || t < -500) {
    v *= -1;
  }
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 6);
  }
}

