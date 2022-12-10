const colors = ["#612503", "#abb2bf", "#ffcfa8", "#ffae6b", "#f56e45"];

function setup() {
  createCanvas(720, 720);
  background(250);
  noStroke();
  rectMode(CENTER);
  angleMode(DEGREES);

  let g = width / 8;
  let sg = g / 4;

  for (let x = g / 2; x < width; x += g) {
    for (let y = g / 2; y < width; y += g) {
      let d = int(random(6));
      fill(random(colors));

      if (d === 0) {
        ellipse(x, y, g, g);
      } else if (d === 1) {
        rect(x, y, g, g);
      } else if (d === 2) {
        let n = int(random(4));
        if (n === 0) {
          triangle(
            x - g / 2,
            y - g / 2,
            x + g / 2,
            y - g / 2,
            x + g / 2,
            y + g / 2,
          );
        }
        if (n === 1) {
          triangle(
            x - g / 2,
            y - g / 2,
            x - g / 2,
            y + g / 2,
            x + g / 2,
            y + g / 2,
          );
        }
        if (n === 2) {
          triangle(
            x + g / 2,
            y - g / 2,
            x + g / 2,
            y + g / 2,
            x - g / 2,
            y + g / 2,
          );
        }
        if (n === 3) {
          triangle(
            x - g / 2,
            y - g / 2,
            x - g / 2,
            y + g / 2,
            x + g / 2,
            y + g / 2,
          );
        }
      } else if (d === 3) {
        push();
        let n = int(random(4));
        switch (n) {
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
        arc(x - g / 2, y - g / 2, g * 2, g * 2, 0 + 90 * n, 90 + 90 * n);
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
      }

      line(x - g / 2, 0, x - g / 2, height);
      line(0, y - g / 2, width, y - g / 2);
    }
  }
}
