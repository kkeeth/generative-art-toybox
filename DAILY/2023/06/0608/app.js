let N;
let s,
  margin = 1.5;
let detail = 25;
let palette1, palette2;
let cnv;

function setup() {
  cnv = createCanvas(500, 500, WEBGL);
  cnv.position((windowWidth - 500) / 2, (windowHeight - 500) / 2);
  N = random([4, 6, 8]);
  s = width / (N + 2 * margin);
  margin *= s;
  noStroke();
  noLoop();
}

function draw() {
  translate(-width / 2, -height / 2);

  palette1 = [
    "#abcd5e",
    "#14976b",
    "#2b67af",
    "#62b6de",
    "#f589a3",
    "#ef562f",
    "#fc8405",
    "#f9d531",
  ];
  palette2 = shuffle(["#050505", "#fffbe6"]);

  let backCol = random([0, 1]);
  background(palette2[backCol]);

  for (let i = 0; i <= N; i++) {
    let x = i * s + margin;
    for (let j = 0; j <= N; j++) {
      let y = j * s + margin;
      fill(palette2[(i + j) % 2]);
      ellipse(x, y, s, s, detail * 4);
    }
  }

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      makeTile(i, j);
    }
  }

  let dotMode = ~~random(4);
  for (let i = 0; i <= N; i++) {
    let x = i * s + margin;
    for (let j = 0; j <= N; j++) {
      let y = j * s + margin;
      if (dotMode == 0) {
        fill(random(random([palette1, palette2])));
      } else if (dotMode == 1) {
        fill(random(palette1));
      } else if (dotMode == 2) {
        fill(random(palette2));
      } else {
        fill(palette2[1 - ((i + j) % 2)]);
      }
      if ((i + j) % 2 == backCol) fill(random(palette1));
      else fill(palette2[1 - ((i + j) % 2)]);
      ellipse(x, y, s / 2, s / 2, detail * 4);
    }
  }
}

function makeTile(i, j) {
  let x = i * s + margin;
  let y = j * s + margin;
  if (random() < 1 / 2) {
    fill(random(palette1));
    square(x, y, s);
    fill(palette2[(i + j) % 2]);
    arc(x, y, s, s, 0, PI / 2, PIE, detail);
    arc(x + s, y + s, s, s, PI, (3 * PI) / 2, PIE, detail);
    fill(palette2[1 - ((i + j) % 2)]);
    arc(x + s, y, s, s, PI / 2, PI, PIE, detail);
    arc(x, y + s, s, s, (3 * PI) / 2, TAU, PIE, detail);
  } else {
    if (random() < 1 / 2) {
      fill(palette2[1 - ((i + j) % 2)]);
      square(x, y, s);
      fill(palette2[(i + j) % 2]);
      arc(x, y, s, s, 0, PI / 2, PIE, detail);
      arc(x + s, y + s, s, s, PI, (3 * PI) / 2, PIE, detail);
    } else {
      fill(palette2[(i + j) % 2]);
      square(x, y, s);
      fill(palette2[1 - ((i + j) % 2)]);
      arc(x + s, y, s, s, PI / 2, PI, PIE, detail);
      arc(x, y + s, s, s, (3 * PI) / 2, TAU, PIE, detail);
    }
  }
}
