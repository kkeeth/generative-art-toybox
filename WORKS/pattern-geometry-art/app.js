const colors = ["#612503", "#abb2bf", "#ffcfa8", "#ffae6b", "#f56e45"];
let g, sg;

function setup() {
  createCanvas(720, 720);
  noStroke();
  noLoop();
  rectMode(CENTER);
  angleMode(DEGREES);

  g = width / 8;
  sg = g / 4;
}

function draw() {
  background(250);

  for (let x = g / 2; x < width; x += g) {
    for (let y = g / 2; y < width; y += g) {
      let d = int(random(7));
      fill(random(colors));

      if (d === 0) {
        ellipse(x, y, g, g);
      } else if (d === 1) {
        rect(x, y, g, g);
      } else if (d === 2) {
        let d2 = int(random(4));
        if (d2 === 0) {
          triangle(
            x - g / 2,
            y - g / 2,
            x + g / 2,
            y - g / 2,
            x - g / 2,
            y + g / 2,
          );
        }
        if (d2 === 1) {
          triangle(
            x - g / 2,
            y - g / 2,
            x + g / 2,
            y - g / 2,
            x + g / 2,
            y + g / 2,
          );
        }
        if (d2 === 2) {
          triangle(
            x + g / 2,
            y - g / 2,
            x + g / 2,
            y + g / 2,
            x - g / 2,
            y + g / 2,
          );
        }
        if (d2 === 3) {
          triangle(
            x - g / 2,
            y - g / 2,
            x + g / 2,
            y + g / 2,
            x - g / 2,
            y + g / 2,
          );
        }
      } else if (d === 3) {
        push();
        let d3 = int(random(4));
        switch (d3) {
          case 1:
            translate(g, 0);
            break;
          case 2:
            translate(g, g);
            break;
          case 3:
            translate(0, g);
            break;
        }
        arc(x - g / 2, y - g / 2, g * 2, g * 2, 0 + 90 * d3, 90 + 90 * d3);
        pop();
      } else if (d === 4) {
        for (let i = x - g / 2; i < x + g / 2; i += sg) {
          for (let j = y - g / 2; j < y + g / 2; j += sg) {
            rect(i + sg / 2, j + sg / 2, sg / 1.5, sg / 1.5);
          }
        }
      } else if (d === 5) {
        for (let i = x - g / 2; i < x + g / 2; i += sg) {
          for (let j = y - g / 2; j < y + g / 2; j += sg) {
            ellipse(i + sg / 2, j + sg / 2, sg / 1.5, sg / 1.5);
          }
        }
      } else if (d === 6) {
        push();
        let d6 = int(random(4));
        switch (d6) {
          case 1:
            translate(g, 0);
            break;
          case 2:
            translate(g, g);
            break;
          case 3:
            translate(0, g);
            break;
        }
        stroke(random(colors));
        noFill();
        strokeCap(SQUARE);
        strokeWeight(5);
        for (let i = g * 2; i > 0; i -= g / 5) {
          arc(
            x - g / 2,
            y - g / 2,
            g * 2 - i,
            g * 2 - i,
            0 + 90 * d6,
            90 + 90 * d6,
          );
        }
        pop();
      }
    }
  }
}

function keyPressed() {
  redraw();
}
