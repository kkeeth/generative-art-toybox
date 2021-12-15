/**********************************
 * dailycoding -20211015 / graphic
 * by E.C.H (Eiichi Ishii)
 **********************************/

let g, z;
let cp = ["#160D26", "#C50607", "#F78D1B", "#504721", "#452F19"];

function setup() {
  createCanvas((w = windowHeight), w, WEBGL);
  angleMode(DEGREES);
  rectMode(CENTER);
  noLoop();

  g = w / 8;
  z = g / 20;
}

function draw() {
  background(255);
  translate(-w, -w);

  for (let x = g / 2; x <= w * 2 - g / 2; x += g) {
    for (let y = g / 2; y <= w * 2 - g / 2; y += g) {
      push();
      translate(x, y, random([-1, 1]));
      rotate(random([0, -90, 90, 180]));
      rotate(random([0, 45]));

      let r = random(g / 3, g * 2);
      let vg = random([2, 4, 6, 8, 10]);
      let sg = r / vg;
      let c = color(cp[int(random(cp.length))]);
      let dsw = int(random(2));
      fill(c);
      noStroke();

      let sw = int(random(6));
      if (sw == 0) {
        rect(0, 0, r, r);
      }

      if (sw == 1) {
        ellipse(0, 0, r, r, 50);
      }

      if (sw == 2) {
        triangle(-r / 2, -r / 2, -r / 2, r / 2, r / 2, r / 2);
      }

      if (sw == 3) {
        for (let sx = -r / 2 + sg / 2; sx <= r / 2 - sg / 2; sx += sg) {
          for (let sy = -r / 2 + sg / 2; sy <= r / 2 - sg / 2; sy += sg) {
            if (dsw == 0) {
              ellipse(sx, sy, sg / 1.5, sg / 1.5);
            }

            if (dsw == 1) {
              if (int(random(2)) == 0) {
                ellipse(sx, sy, sg / 1.5, sg / 1.5);
              }
            }
          }
        }
      }

      if (sw == 4) {
        for (let sx = -r / 2 + sg / 2; sx <= r / 2 - sg / 2; sx += sg) {
          for (let sy = -r / 2 + sg / 2; sy <= r / 2 - sg / 2; sy += sg) {
            if (dsw == 0) {
              rect(sx, sy, sg / 1.5, sg / 1.5);
            }

            if (dsw == 1) {
              if (int(random(2)) == 0) {
                rect(sx, sy, sg / 1.5, sg / 1.5);
              }
            }
          }
        }
      }

      if (sw == 5) {
        for (let sy = -r / 2 + sg / 2; sy <= r / 2 - sg / 2; sy += sg) {
          if (dsw == 0) {
            rect(0, sy, r, sg / 1.5);
          }

          if (dsw == 1) {
            if (int(random(2)) == 0) {
              rect(0, sy, r, sg / 1.5);
            }
          }
        }
      }
      pop();
    }
  }

  push();
  translate(w/2, w/2, 1);
  strokeWeight(2);
  noFill();
  for(let i=0; i<20; i++){
    let er = random(g/2, g*2);

    push();
    translate(random(w), random(w));
    shearX(random(-20, 20));
      stroke(random([0, 255]));
    ellipse(0, 0, er, er, 50);
    pop();
  }
  pop();
}

function keyPressed() {
  redraw();
}
