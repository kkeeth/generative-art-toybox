let objs = [];
let shapes = [];
let colors = ['#1A53C0', '#fdd900', '#d63230', '#0D274B'];

function setup() {
  createCanvas(900, 900);
  rectMode(CENTER);

  for (let i = 0; i < 10; i++) {
    let x = random(0.15, 0.85) * width;
    let y = random(0.15, 0.85) * height;
    let w = width * random(0.02, 0.1);
    let h = w * random([0.25, 0.5]);
    if (random() < 0.5) {
      [w, h] = [h, w];
    }
    let newShape = { x: x, y: y, w: w, h: h };
    let overlap = false;
    for (let s of shapes) {
      if (checkCollision(newShape, s)) {
        overlap = true;
        break;
      }
    }
    if (!overlap) shapes.push(newShape);
  }

  for (let s of shapes) {
    let opt = int(random(5) + 1);
    if (opt == 1) objs.push(new Motion01(s.x, s.y, s.w, s.h));
    if (opt == 2) objs.push(new Motion02(s.x, s.y, s.w, s.h));
    if (opt == 3) objs.push(new Motion03(s.x, s.y, s.w, s.h));
    if (opt == 4) objs.push(new Motion04(s.x, s.y, s.w, s.h));
    if (opt == 5) objs.push(new Motion05(s.x, s.y, s.w, s.h));
    // if (opt == 6) objs.push(new Motion06(s.x, s.y, s.w, s.h));
  }
}

function draw() {
  background(255);
  for (let o of objs) {
    o.run();
  }
}

function easeInOutQuint(x) {
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}

function checkCollision(rectA, rectB) {
  return (
    rectA.x - rectA.w / 2 < rectB.x + rectB.w / 2 &&
    rectA.x + rectA.w / 2 > rectB.x - rectB.w / 2 &&
    rectA.y - rectA.h / 2 < rectB.y + rectB.h / 2 &&
    rectA.y + rectA.h / 2 > rectB.y - rectB.h / 2
  );
}
class Motion01 {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.t = 0;
    this.t = int(random(-120, 50));
    this.t1 = 30;
    this.t2 = this.t1 + 60;
    this.t3 = this.t2 + 30;
    this.t4 = this.t3 + 60;
    this.pingPong = 0;
    this.clr = random(colors);
    this.coin = random([-1, 1]);
    this.isWide = w > h;
  }

  show() {
    let ww = lerp(1, 0.25, this.pingPong) * this.w;
    let hh = lerp(1, 0.25, this.pingPong) * this.h;
    if (this.isWide) hh = this.h;
    else ww = this.w;
    noStroke();
    fill(this.clr);
    rect(this.x, this.y, ww, hh);
  }

  move() {
    this.t++;
    if (this.t1 < this.t && this.t < this.t2) {
      let n = norm(this.t, this.t1, this.t2);
      this.pingPong = easeInOutQuint(n);
    } else if (this.t3 < this.t && this.t < this.t4) {
      let n = norm(this.t, this.t3, this.t4);
      this.pingPong = easeInOutQuint(1 - n);
    }
    if (this.t > this.t4) {
      this.t = 0;
    }
    this.show();
  }

  run() {
    this.move();
  }
}

class Motion02 extends Motion01 {
  constructor(x, y, w, h) {
    super(x, y, w, h);
    this.d = min(w, h) * 0.4;
  }

  show() {
    let shiftX = (this.w / 2 - this.d * 0.55) * this.pingPong;
    let shiftY = (this.h / 2 - this.d * 0.55) * this.pingPong;
    let dd = lerp(1.5, 1, this.pingPong) * this.d;
    noStroke();
    fill(this.clr);
    circle(this.x + shiftX, this.y + shiftY, dd);
    circle(this.x - shiftX, this.y + shiftY, dd);
    circle(this.x + shiftX, this.y - shiftY, dd);
    circle(this.x - shiftX, this.y - shiftY, dd);
  }
}

class Motion03 extends Motion01 {
  constructor(x, y, w, h) {
    super(x, y, w, h);
  }

  show() {
    let shiftX = this.w * 0.8 * this.pingPong;
    let shiftY = this.h * 0.8 * this.pingPong;
    push();
    translate(this.x, this.y);
    scale(this.coin, 1);
    noStroke();
    fill(this.clr);
    triangle(
      -(this.w / 2),
      -(this.h / 2),
      this.w / 2 - shiftX,
      -(this.h / 2),
      -(this.w / 2),
      this.h / 2 - shiftY,
    );
    triangle(
      this.w / 2,
      this.h / 2,
      -(this.w / 2) + shiftX,
      this.h / 2,
      this.w / 2,
      -(this.h / 2) + shiftY,
    );
    pop();
  }
}

class Motion04 extends Motion01 {
  constructor(x, y, w, h) {
    super(x, y, w, h);
    this.d = min(w, h) * 0.3;
  }

  show() {
    let shiftX = (this.w - this.d) * this.pingPong;
    let shiftY = (this.h - this.d) * this.pingPong;
    push();
    translate(this.x, this.y);
    scale(this.coin, 1);
    noStroke();
    fill(this.clr);

    circle((this.w - this.d) / 2 - shiftX, (this.h - this.d) / 2, this.d);
    circle(-((this.w - this.d) / 2), (this.h - this.d) / 2 - shiftY, this.d);
    circle(-((this.w - this.d) / 2) + shiftX, -((this.h - this.d) / 2), this.d);
    circle((this.w - this.d) / 2, -((this.h - this.d) / 2) + shiftY, this.d);
    pop();
  }
}

class Motion05 extends Motion01 {
  constructor(x, y, w, h) {
    super(x, y, w, h);
  }

  show() {
    push();
    translate(this.x, this.y);
    scale(this.coin, this.coin);
    stroke(this.clr);
    noFill();
    beginShape();
    if (this.isWide) {
      strokeWeight(this.h / 10);
      for (let x = -this.w / 2; x < this.w / 2; x++) {
        let a = map(x, -this.w / 2, this.w / 2, 0, TAU * 3);
        let y = this.h * 0.5 * sin(a + this.pingPong * TAU);
        vertex(x, y);
      }
    } else {
      strokeWeight(this.w / 10);
      for (let y = -this.h / 2; y < this.h / 2; y++) {
        let a = map(y, -this.h / 2, this.h / 2, 0, TAU * 3);
        let x = this.w * 0.5 * sin(a + this.pingPong * TAU);
        vertex(x, y);
      }
    }

    endShape();
    pop();
  }
}

class Motion06 extends Motion01 {
  constructor(x, y, w, h) {
    super(x, y, w, h);
  }
}

/*
モーショングラフィックス的な動き
xywhのなかで自由に動く
バウンド円
min(w, h)=dで繰り返し行ったり来たり
イージングで可愛く
w * 0.5 = h or h * 0.5 = w
*/
