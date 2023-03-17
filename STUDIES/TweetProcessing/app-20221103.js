/**
 * original tweet
 * https://twitter.com/yuruyurau/status/1588062547315679232?s=20&t=dCx7zYb6tJGHzkHm8_Qr0Q
 */

let $ = [];
const num = 3e2;
let de = [];

function setup() {
  createCanvas(800, 700);
  strokeWeight(1);
}

function draw() {
  background(255, 10);

  const arr = $.map((v, i) => {
    stroke(i, i / 3, i / 5);

    point(v.copy().add(2, 1.6).mult(135));
    r = ((v.x * 2 + 2.5) ^ (v.y + 2)) * 8;
    //r = 8;

    return v.add(sin(v.y * r) / 90, cos(v.x * r) / 90);
    //return v.add(cos(v.y * r) / 90, sin(v.x * r) / 90);
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
