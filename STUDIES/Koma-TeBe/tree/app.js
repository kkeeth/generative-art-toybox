let t = 0;

function setup() {
  createCanvas((W = 500), W, WEBGL);
  // noLoop()
}

function draw() {
  background(0);

  rotateY(t * 0.1);
  translate(0, -W / 4);

  for (let i = 0; i < W; i += 2) {
    // spiral function
    x = (i / 2) * sin((z = i / 15));
    z = (i / 2) * cos(z);
    q = 100 * sin(i / 33 + t) + 155;

    // green tree
    stroke(0, q, 0);
    line(0, i, 0, x, i / 0.7, z);

    stroke(q);
    // spiral snow
    point(x, i / 0.9, z);
    // top star
    line(0, -44, 0, x / 6, 33 * sin(i) - 44, z / 6);
  }
  t -= 0.05;
}
