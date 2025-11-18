/**
 * Submarine Line Art Generator
 * * Features:
 * - Generates 3 distinct types of submarines (Streamlined, Boxy, Futuristic).
 * - High contrast, thick outline style.
 * - Seamlessly connected conning tower (sail).
 * - Colorful, randomized palette.
 * - Interactive: Click canvas to regenerate.
 */

let palette = ['#FFFFFF', '#E0E0E0', '#00FFFF', '#FFA500', '#FF00FF', '#FFFF00'];
let bgColor = '#1a1a2e'; // Dark Navy / Charcoal

function setup() {
  createCanvas(800, 600);
  strokeCap(ROUND);
  strokeJoin(ROUND);
  noLoop();
}

function draw() {
  background(bgColor);
  
  // Center the submarine
  translate(width / 2, height / 2);
  
  // Generate a random submarine
  generateSubmarine();
}

function mousePressed() {
  redraw();
}

function generateSubmarine() {
  // 1. Determine Basic Parameters
  let subType = floor(random(3)); // 0: Streamlined, 1: Boxy, 2: Special
  let subWidth = random(400, 550);
  let subHeight = random(100, 180);
  let halfW = subWidth / 2;
  let halfH = subHeight / 2;
  
  // Pick Colors
  let colTop = random(palette);
  let colBottom = random(palette);
  while(colBottom === colTop) colBottom = random(palette); // Ensure distinct
  let colTower = random(palette);
  let colDetail = random(palette);
  
  strokeWeight(4); // Thick lines for visibility
  
  // --- DRAWING LOGIC ---
  
  // We use a specific drawing order to achieve the "Outline" look with seamless connections:
  // 1. Draw Top Hull
  // 2. Draw Bottom Hull
  // 3. Draw Divider
  // 4. Draw Tower (filled with BG color to mask the hull line, stroked with color)
  // 5. Details
  
  // -- 2. Draw Hull (Top and Bottom) --
  
  if (subType === 0) {
    // === TYPE A: Streamlined (Teardrop / Cigar) ===
    
    // Top Hull
    stroke(colTop);
    noFill();
    beginShape();
    vertex(-halfW, 0);
    // Control points for smooth teardrop shape
    bezierVertex(-halfW, -halfH * 1.2, halfW * 0.6, -halfH * 1.2, halfW, 0);
    endShape();

    // Bottom Hull
    stroke(colBottom);
    noFill();
    beginShape();
    vertex(-halfW, 0);
    // Bottom is usually slightly flatter or symmetric
    bezierVertex(-halfW, halfH * 1.2, halfW * 0.6, halfH * 1.2, halfW, 0);
    endShape();
    
  } else if (subType === 1) {
    // === TYPE B: Boxy (Research / Industrial) ===
    
    let cornerRadius = subHeight * 0.4;
    let noseStickout = random(20, 50);
    
    // Top Hull
    stroke(colTop);
    noFill();
    beginShape();
    vertex(-halfW - noseStickout, 0); // Nose
    // Go up and flat
    vertex(-halfW + cornerRadius, -halfH); 
    vertex(halfW - cornerRadius, -halfH);
    vertex(halfW, 0);
    endShape();
    
    // Connect nose manually for boxy shape
    line(-halfW - noseStickout, 0, -halfW + cornerRadius, -halfH);

    // Bottom Hull
    stroke(colBottom);
    noFill();
    beginShape();
    vertex(-halfW - noseStickout, 0);
    vertex(-halfW + cornerRadius, halfH);
    vertex(halfW - cornerRadius, halfH);
    vertex(halfW, 0);
    endShape();
    line(-halfW - noseStickout, 0, -halfW + cornerRadius, halfH);

  } else {
    // === TYPE C: Special (Futuristic / Asymmetric / Pods) ===
    
    // Top Hull (Bulbous front, tapered back)
    stroke(colTop);
    noFill();
    beginShape();
    vertex(-halfW, 0);
    // Double curve for "future" look
    bezierVertex(-halfW, -halfH * 1.5, -halfW * 0.2, -halfH * 0.5, 0, -halfH * 0.8);
    bezierVertex(halfW * 0.5, -halfH * 1.0, halfW, -halfH * 0.2, halfW, 0);
    endShape();

    // Bottom Hull (Deep belly)
    stroke(colBottom);
    noFill();
    beginShape();
    vertex(-halfW, 0);
    bezierVertex(-halfW * 0.8, halfH * 1.5, halfW * 0.5, halfH, halfW, 0);
    endShape();
  }

  // -- 3. Divider Line (Horizontal Split) --
  stroke(random(palette));
  strokeWeight(3);
  // Simple line through center, strictly restricted by width approx
  // For perfect masking, we just draw a line from nose-ish to tail-ish
  // But since shapes vary, we draw a visual divider where it makes sense.
  if (subType === 1) {
     line(-halfW * 1.1, 0, halfW, 0);
  } else {
     line(-halfW, 0, halfW, 0);
  }


  // -- 4. Draw Conning Tower (Sail) --
  // To make it seamless, we draw a shape filled with bgColor to mask the hull line below it.
  
  let towerW = random(60, 100);
  let towerH = random(50, 90);
  let towerX = random(-halfW * 0.3, halfW * 0.1); // Position
  let towerType = floor(random(3)); // 0: Tapered, 1: Rect, 2: Curved Back
  
  stroke(colTower);
  fill(bgColor); // SECRET SAUCE: Mask the line below
  strokeWeight(4);
  
  beginShape();
  // Start at bottom left of tower (on hull)
  vertex(towerX, 0); 
  
  if (towerType === 0) { // Tapered Trapezoind
    vertex(towerX + 10, -towerH);
    vertex(towerX + towerW - 10, -towerH);
    vertex(towerX + towerW, 0);
  } else if (towerType === 1) { // Rectangular with rounded top
    vertex(towerX, -towerH + 10);
    quadraticVertex(towerX, -towerH, towerX + 10, -towerH);
    vertex(towerX + towerW - 10, -towerH);
    quadraticVertex(towerX + towerW, -towerH, towerX + towerW, -towerH + 10);
    vertex(towerX + towerW, 0);
  } else { // Curved Back (Modern)
    vertex(towerX + 5, -towerH);
    vertex(towerX + towerW * 0.6, -towerH);
    bezierVertex(towerX + towerW, -towerH, towerX + towerW, -towerH * 0.5, towerX + towerW * 1.2, 0);
  }
  
  // Close shape implicitly for fill, but we don't want the bottom line drawn stroke
  // However, since y=0 is the split line, drawing the bottom line matches the divider.
  // To be perfectly seamless with the Top hull, we should NOT stroke the bottom.
  // p5.js shape closing is tricky with stroke. 
  // Strategy: Close it to mask, then redraw without bottom stroke?
  // Simpler: Just draw the bottom line with the Divider Color or rely on the masking.
  endShape(CLOSE);
  
  // Redraw the bottom line of the tower with the DIVIDER color to merge it,
  // OR draw a BG colored line over the bottom of the tower if we want it fully open.
  // The prompt implies "Seamless with Hull Top".
  // Let's erase the bottom stroke of the tower visually:
  stroke(colTop); // Match top hull color? Or Divider?
  strokeWeight(4);
  // No, actually, we want the tower to sit ON the hull. 
  // The masking above removed the "hull top line" passing through the tower.
  // Now we just have the outline. It looks connected.
  
  // Add Periscope / Antennas
  stroke(colDetail);
  strokeWeight(3);
  line(towerX + towerW * 0.3, -towerH, towerX + towerW * 0.3, -towerH - random(20, 40));
  line(towerX + towerW * 0.6, -towerH, towerX + towerW * 0.6, -towerH - random(10, 25));


  // -- 5. Details: Windows (Portholes) --
  let winCount = floor(random(3, 6));
  let winSpacing = (subWidth * 0.5) / winCount;
  let winStart = towerX - (winCount * winSpacing) / 2 + towerW / 2; // Center around tower area
  
  for (let i = 0; i < winCount; i++) {
    let wx = winStart + i * winSpacing;
    // Keep windows within hull bounds approx
    if (wx > -halfW + 30 && wx < halfW - 30) {
      stroke(colDetail);
      fill(bgColor); // Ensure no fill look
      strokeWeight(3);
      
      let winType = random() > 0.5 ? 'circle' : 'rect';
      if (winType === 'circle') {
        ellipse(wx, 10, 25, 25); // Slightly below centerline
      } else {
        rectMode(CENTER);
        rect(wx, 10, 30, 20, 5);
      }
    }
  }


  // -- 6. Details: Propeller & Fins --
  push();
  translate(halfW, 0); // Move to tail
  
  // Propeller
  stroke(random(palette));
  strokeWeight(3);
  noFill();
  // Draw a hub
  arc(0, 0, 20, 40, PI/2, 3*PI/2);
  
  // Draw Blades
  let bladeSize = random(30, 50);
  line(10, 0, 10 + bladeSize, -bladeSize/2); // Top blade
  line(10, 0, 10 + bladeSize, bladeSize/2);  // Bottom blade
  line(10, 0, 10 + bladeSize, 0);            // Middle
  
  // Rudder / Stabilizer (Tail Fin)
  stroke(colDetail);
  fill(bgColor);
  
  // Top Rudder
  beginShape();
  vertex(-30, -halfH * 0.5);
  vertex(0, -halfH * 0.5 - 30);
  vertex(20, -halfH * 0.5 - 30);
  vertex(10, -halfH * 0.5);
  endShape(CLOSE);
  
  // Bottom Rudder
  beginShape();
  vertex(-30, halfH * 0.5);
  vertex(0, halfH * 0.5 + 30);
  vertex(20, halfH * 0.5 + 30);
  vertex(10, halfH * 0.5);
  endShape(CLOSE);
  
  pop();
  
  // -- 7. Side Fins (Dive Planes) --
  // Usually near the front
  stroke(colDetail);
  fill(bgColor);
  let finX = -halfW * 0.6;
  let finY = 10; // Slightly below center
  
  beginShape();
  vertex(finX, finY);
  vertex(finX - 20, finY + 15);
  vertex(finX + 30, finY + 15);
  vertex(finX + 40, finY);
  endShape(CLOSE);
  
  // Horizontal line across fin for detail
  line(finX - 10, finY + 7, finX + 35, finY + 7);
}
