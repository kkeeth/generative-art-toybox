const span = 30;
let xoff = 0.0;
let lines = [];

function setup() {
  createCanvas((w = 600), (h = 600));
  for (let i = -height / 2 + span; i < height / 2; i += span) {
    lines.push(
      new lineCircle(
        sin(i / 100 + xoff) * 20 - 70,
        sin(i / 100 + xoff) * 20 + 70,
        i,
      ),
    );
  }
}

function draw() {
  background(255);
  translate(width / 2, height / 2);

  for (let line of lines) {
    line.update();
    line.show();
  }
  xoff += 0.05;
}

class lineCircle {
  constructor(start, end, y) {
    this.start = start;
    this.end = end;
    this.y = y;
  }

  update() {
    let diff = noise(random(xoff));
    this.start += 3 * (diff - 0.5);
    this.end += 3 * (diff - 0.5);
  }

  show() {
    push();
    strokeWeight(15);
    point(this.start, this.y);
    point(this.end, this.y);
    pop();
    line(this.start, this.y, this.end, this.y);
  }
}
