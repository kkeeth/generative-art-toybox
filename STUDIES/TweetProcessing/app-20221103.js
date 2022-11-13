/**
 * original tweet
 * https://twitter.com/yuruyurau/status/1588062547315679232?s=20&t=dCx7zYb6tJGHzkHm8_Qr0Q
 */

let $ = [];
const num = 3e2;
let de = [];

function setup() {
  createCanvas(800, 700);
  strokeWeight(3);
  // frameRate(3);
  textSize(20);
}

function draw() {
  background(255, 9);
  line(135, 0, (1.6 + 1.8) * 135, height);
  line((1.6 + 1.8) * 135, 0, (1.6 + 1.8) * 135, height);
  line(0, 81, width, 81);
  line(0, 2 * 1.6 * 135, width, 2 * 1.6 * 135);

  const arr = $.map((v, i) => {
    stroke(i, i / 3, i / 5);

    // if (v.x > 1 || v.y > 2) {
    point(v.copy().add(2, 1.6).mult(135));
    // }
    r = 1; //((v.x * 2 + 2.5) ^ (v.y + 2)) * 8;
    // console.log(v);

    return v.add(sin(v.y * r) / 90, cos(v.x * r) / 90);
  });

  if (arr[num]) {
    $ = $.slice(20 - num);
  } else {
    let newArr = [];

    // if ($.length === 0) {
    for (let i = 0; i < 5; i++) {
      newArr.push(p5.Vector.random3D());
    }
    $ = [...$, ...newArr];
  }
  // }
}
