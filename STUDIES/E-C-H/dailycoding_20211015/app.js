/**********************************
 * dailycoding -20211015 / graphic
 * by E.C.H (Eiichi Ishii)
 **********************************/

let g, z;
let cp = ["#160D26", "#C50607", "#F78D1B", "#504721", "#452F19"];

function setup() {
  // WEBGL: キャンバスの中央を中心とする（厳密には3Dモードだが，簡単に中央にできる）
  createCanvas((w = windowHeight), w, WEBGL);
  // angleMode: 角度のモードを RADIANS か DEGREES モードを指定
  angleMode(DEGREES);
  // rectMode: 四角の位置の指定
  // CORNER: デフォルトモード．rect(x座標，y座標, 幅, 高さ)
  // CORNERS: rect(x座標，y座標, 対角線上のx座標, 対角線上のy座標)
  // CENTER: rect(四角のx座標中央，四角のy座標中央, 幅, 高さ)
  // RADIUS: rect(四角のx座標中央，四角のy座標中央, 幅の半分, 高さの半分)
  rectMode(CENTER);
  noLoop();

  g = w / 8;
  z = g / 20;
}

function draw() {
  background(255);
  // translate: オブジェクトの移動量を指定．移動は積み上がりなので，前の移動に重ねての移動となる．
  //            draw() 内だとループ時にリセットされるので，push() と pop() で制御する
  // translate(左右の移動量, 上下の移動量, 重ねの順番(WEBGL 利用時のみ))
  // translate(p5.Vector インスタンス)
  translate(-w, -w);

  for (let x = g / 2; x <= w * 2 - g / 2; x += g) {
    for (let y = g / 2; y <= w * 2 - g / 2; y += g) {
      push();
      translate(x, y, random([-1, 1]));
      // rotate: 図形を回転させる
      //         angleMode を考慮するので，角度は RADIANS or DEGREES で入力
      // rotate(angle)
      rotate(random([0, -90, 90, 180]));
      // 四角形は 90 度単位で回転させても変化がないので 45 度回転させる
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

  // 楕円オブジェクト
  push();
  translate(w/2, w/2, 1);
  strokeWeight(2);
  noFill();
  for (let i = 0; i < 20; i++) {
    let er = random(g / 2, g * 2);

    push();
    translate(random(w), random(w));
    // 斜めにさせるが今回はあまり意味がなさそう
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
