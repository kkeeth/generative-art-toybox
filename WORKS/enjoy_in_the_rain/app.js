let f = 0;
let n;
let t;
let w;
let x, y;
let isNight = true;

function setup() {
  createCanvas((W = 800), W);
  noFill();
}

function draw() {
  background(isNight ? 0 : 255);

  // draw umbrella
  push();
  fill(isNight ? 255 : 0);
  beginShape();
  for (let i = PI; i < TAU; i += 0.03) {
    x = mouseX + 100 * cos(i);
    y = mouseY + 90 * sin(i);
    vertex(x, y);
  }
  for (let j = mouseX + 100; j > mouseX - 100; j -= 40) {
    for (let i = TAU; i > PI; i -= 0.03) {
      x = j - 20 + 20 * cos(i);
      y = mouseY + 20 * sin(i);
      vertex(x, y);
    }
  }
  endShape(CLOSE);
  pop();

  push();
  strokeWeight(3);
  // draw stick
  line(mouseX, mouseY - 110, mouseX, mouseY + 50);

  // draw handle
  arc(mouseX - 7.5, mouseY + 50, 15, 20, 0, PI);
  pop();

  // draw rain
  for (let i = 90; i > 0; i--) {
    n = noise((f - i) % 300) * 2 * W;
    t = i / 60;
    w = t > 1 ? (t * 3) ** 3 : 0;
    x = n % W;
    y = min(1, t) ** 3 * W - (n % 99) - 20;

    if (x < mouseX - 100 || mouseX + 100 < x || y < mouseY - 90) {
      stroke(isNight ? W : 255 - W);
      ellipse(x, y, w, t > 1 ? w / 3 : 60);
    }
  }
  f++;
}

function mousePressed() {
  isNight = !isNight;
}
