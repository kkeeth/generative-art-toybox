let dotts = [];
let yPos = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  blendMode(DARKEST);
  for (let x = 0; x < width; x += 30) {
    dotts.push(new Dot(x, yPos))
  }
}

function draw() {
  for (let dot of dotts) {
    dot.update();
    dot.render();
  }
}

class Dot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(7, 10);
    this.yacc = random(1, 5);
    this.xacc = 0.5;
    this.color = color(random(255), random(255), random(255));
  }

  update() {
    this.y += this.yacc;
    yPos++;

    if (this.y > height) {
      this.y = 0;
    }

    const cond = ~~random(3);

    switch(cond) {
      case 0:
        this.x += this.xacc;
        if (this.x > width) this.x = 0;
        break;
      case 1:
        this.x -= this.xacc;
        if (this.x < 0) this.x = width;
        break;
      case 2:
        this.x = this.x;
        break;
    }
  }

  render() {
    fill(this.color);
    this.size = 8 - (frameCount % 45);
    ellipse(this.x, this.y, this.size);
  }
}

function keyPressed() {
  if (key === "s") {
    saveCanvas("mySketch", "png");
  }
}
