//
// inspired from @takawo 's great one.
//
const DEPTH_MAX = 10;

class MyAbstract {
  constructor(depth, direction) {
    this.pos = {};

    this.fillColor = color(0, random() * 200 + 25, 100, 255);

    // this.depth = depth;
    this.depth = random() < 0.75 || depth == 0 ? depth : DEPTH_MAX;

    this.direction = direction;

    this.divideRate = map(random(), 0, 1, 0.2, 0.8);
    this.divideRateNext = this.divideRate;

    this.initSelf();

    this.children = [];
    if (this.depth == DEPTH_MAX) return;
    this.children.push(this.createChild());
    this.children.push(this.createChild());
  }

  createChild() {
    const depth = this.depth + 1;
    const direction = (this.direction + 1) % 2;

    const val = Math.floor(random() * 100);
    let rate = 0;

    rate += 5;
    if (val < rate) {
      return new MyBoundBall(depth, direction);
    }
    rate += 5;
    if (val < rate) {
      return new MyLines(depth, direction);
    }
    rate += 25;
    if (val < rate) {
      return new MyCircle(depth, direction);
    }
    rate += 25;
    if (val < rate) {
      return new MyTriangle(depth, direction);
    }
    rate += 25;
    if (val < rate) {
      return new MyRoundRect(depth, direction);
    }
    // console.log("rate", rate);

    return new MyRect(depth, direction);
  }

  update(x, y, w, h) {
    this.pos.x = x;
    this.pos.y = y;
    this.pos.w = w;
    this.pos.h = h;

    this.divideRate = lerp(this.divideRate, this.divideRateNext, 0.1);
    if (abs(this.divideRateNext - this.divideRate) < 0.001) {
      this.divideRateNext = map(random(), 0, 1, 0.2, 0.8);
    }

    this.updateSelf();

    this.updateChildren();
  }

  updateChildren() {
    // todo: refactor

    const div_x = this.pos.w * this.divideRate;
    const div_y = this.pos.h * this.divideRate;

    if (this.children.length == 0) return;
    this.children[0].update(
      this.pos.x,
      this.pos.y,
      this.direction == 0 ? div_x : this.pos.w,
      this.direction == 0 ? this.pos.h : div_y,
    );
    if (this.children.length == 1) return;
    this.children[1].update(
      this.direction == 0 ? this.pos.x + div_x : this.pos.x,
      this.direction == 0 ? this.pos.y : this.pos.y + div_y,
      this.direction == 0 ? this.pos.w - div_x : this.pos.w,
      this.direction == 0 ? this.pos.h : this.pos.h - div_y,
    );
  }

  draw() {
    if (this.children.length < 2) {
      this.drawSelf();
    }
    for (const child of this.children) {
      child.draw();
    }
  }

  initSelf() {
    // implement in child
  }
  updateSelf() {
    // implement in child
  }
  drawSelf() {
    // implement in child
  }
}

class MyRect extends MyAbstract {
  drawSelf() {
    osgb.push();
    osgb.translate(this.pos.x, this.pos.y);
    {
      osgb.noStroke();
      // stroke(255);
      osgb.fill(this.fillColor);
      osgb.rect(0, 0, this.pos.w, this.pos.h);
    }
    osgb.pop();
  }
}

class MyCircle extends MyAbstract {
  drawSelf() {
    osgb.push();
    osgb.translate(this.pos.x, this.pos.y);
    {
      osgb.noStroke();
      osgb.fill(this.fillColor);
      osgb.ellipse(this.pos.w / 2, this.pos.h / 2, this.pos.w, this.pos.h);
    }
    osgb.pop();
  }
}

class MyTriangle extends MyAbstract {
  drawSelf() {
    osgb.push();
    osgb.translate(this.pos.x, this.pos.y);
    {
      osgb.noStroke();
      osgb.fill(this.fillColor);
      osgb.triangle(this.pos.w / 2, 0, 0, this.pos.h, this.pos.w, this.pos.h);
    }
    osgb.pop();
  }
}

class MyRoundRect extends MyAbstract {
  drawSelf() {
    osgb.push();
    osgb.translate(this.pos.x, this.pos.y);
    {
      osgb.noStroke();
      osgb.fill(this.fillColor);
      osgb.rect(0, 0, this.pos.w, this.pos.h, this.pos.w / 2);
    }
    osgb.pop();
  }
}

class MyBoundBall extends MyAbstract {
  initSelf() {
    this.x = 0.5;
    this.y = 0.5;
    this.add_x = (random() - 0.5) * 0.1;
    this.add_y = (random() - 0.5) * 0.1;
  }
  updateSelf() {
    this.x += this.add_x;
    this.y += this.add_y;
    if (this.x <= 0.1 || this.x >= 0.9) {
      this.add_x *= -1;
    }
    if (this.y <= 0.1 || this.y >= 0.9) {
      this.add_y *= -1;
    }
  }
  drawSelf() {
    osgb.push();
    osgb.translate(this.pos.x, this.pos.y);
    {
      osgb.noStroke();
      osgb.fill(this.fillColor);
      osgb.circle(this.pos.w * this.x, this.pos.h * this.y, this.pos.w / 5);
    }
    osgb.pop();
  }
}

class MyLines extends MyAbstract {
  drawSelf() {
    osgb.push();
    osgb.translate(this.pos.x, this.pos.y);
    {
      osgb.stroke(this.fillColor);
      osgb.noFill();
      for (let i = 0; i < 10; i++) {
        osgb.line(0, (this.pos.h / 10) * i, (this.pos.w / 10) * i, this.pos.h);
        osgb.line((this.pos.w / 10) * i, 0, this.pos.w, (this.pos.h / 10) * i);
      }
    }
    osgb.pop();
  }
}

let objs = [];
let osgb;
let displayPos;
function setup() {
  createCanvas(windowWidth, windowHeight);
  osgb = createGraphics(windowWidth * 2, windowHeight * 2);

  frameRate(60);

  displayPos = {
    current: createVector(0, 0),
    next: createVector(0, 0),
  };

  // create top level 4 objects for offscreen graphic buffer
  for (let y = 0; y < 2; y++) {
    objs.push([]);
    for (let x = 0; x < 2; x++) {
      objs[y].push(new MyRect(0, 0));
    }
  }
}

function draw() {
  background(0);
  osgb.background(0);

  // update adn draw objects to offscreen graphic buffer
  for (let y = 0; y < 2; y++) {
    for (let x = 0; x < 2; x++) {
      const obj = objs[y][x];
      obj.update(width * x, height * y, width, height);
      obj.draw();
    }
  }

  // scroll in offscreen graphic buffer
  displayPos.current = p5.Vector.lerp(
    displayPos.current,
    displayPos.next,
    0.05,
  );
  if (displayPos.current.dist(displayPos.next) < 0.1) {
    displayPos.next = createVector(
      random() < 0.5 ? 0 : width,
      random() < 0.5 ? 0 : height,
    );
  }

  // draw a part of offscreen graphic buffer
  image(
    osgb,
    0,
    0,
    width,
    height,
    displayPos.current.x,
    displayPos.current.y,
    width,
    height,
  );
}
