/**********************************
 * dailycoding -20211215 / graphic
 * by E.C.H (Eiichi Ishii)
 **********************************/

 let g;
 let cp = ["#7C675D", "#F5F4AF", "#DCC54A", "#C66322", "#923634"];

 function setup() {
   createCanvas((w = windowHeight), w);
   angleMode(DEGREES);
   rectMode(CENTER);
   noLoop();

   g = w / 7;
 }

 function draw() {
   background(255);

   let yoff = random(-g * 2, g * 2);
   for (let x = -g * 2; x <= w + g * 2; x += g) {
     let ady = map(noise(yoff), 0, 1, -g * 2, g * 2);
     let xoff = 0;
     for (let y = -g * 2; y <= w + g * 2; y += g) {
       push();
       let adx = map(noise(xoff), 0, 1, -g * 2, g * 2);
       translate(x + adx, y + ady);

       rotate(random([0, -90, 90, 180]));
       scale(random([-1, 1]), 1);
       noStroke();

       let tr = g;
       let z = g / 4;
       fill(cp[int(random(cp.length))]);
       triangle(z, -tr / 2, -tr / 2, tr / 2 - z * 2, tr / 2 - z * 1.5, tr / 2);
       if(int(random(2)) == 0){
         push();
         scale(random(0.4, 0.8));
         fill(cp[int(random(cp.length))]);
         triangle(z, -tr / 2, -tr / 2, tr / 2 - z * 2, tr / 2 - z * 1.5, tr / 2);
         pop();
       }
       fill(cp[int(random(cp.length))]);
       triangle(tr / 2 - z / 2, tr / 2, z / 1.4, 0, tr / 2, z / 2);
       fill(cp[int(random(cp.length))]);
       triangle(-tr / 2, tr / 2, -z, z / 1.3, -z / 2, tr / 2);
       fill(cp[int(random(cp.length))]);
       triangle(-tr / 2, -tr / 2 + z, -z / 2, -z, 0, -tr / 2);
       fill(cp[int(random(cp.length))]);
       let er = z / 1.2;
       ellipse(tr / 2 - z / 2, -z / 2, er, er);
       pop();
       xoff += 0.05;
     }
     yoff += 0.05;
   }
 }

 function keyPressed() {
   redraw();
 }
