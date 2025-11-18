/**
 * Submarine Line Art Generator (v3: Rounded & Fitted)
 * * Features:
 * - Generates 3 distinct types of submarines.
 * - Rounded Bow and Stern (No sharp points).
 * - Conning tower sits PERFECTLY on the hull curve using math.
 * - High contrast, colorful, thick outline style.
 * - "Futaba" style propeller.
 */

let palette = ['#FFFFFF', '#E0E0E0', '#00FFFF', '#FFA500', '#FF00FF', '#FFFF00', '#00FF00'];
let bgColor = '#1a1a2e'; // Dark Navy

function setup() {
  createCanvas(800, 600);
  strokeCap(ROUND);
  strokeJoin(ROUND);
  noLoop();
}

function draw() {
  background(bgColor);
  translate(width / 2, height / 2);
  generateSubmarine();
}

function mousePressed() {
  redraw();
}

function generateSubmarine() {
  // 1. Basic Parameters
  let subType = floor(random(3)); // 0: Streamlined, 1: Boxy, 2: Special
  let subWidth = random(400, 550);
  let subHeight = random(120, 180);
  let halfW = subWidth / 2;
  let halfH = subHeight / 2;
  
  // Colors
  let colTop = random(palette);
  let colBottom = random(palette);
  while(colBottom === colTop) colBottom = random(palette);
  let colTower = random(palette);
  let colDetail = random(palette);
  
  strokeWeight(4);

  // --- HELPER: Hull Top Curve Function ---
  // Returns the Y coordinate of the top hull at a given X
  function getHullTopY(x) {
    // Normalize x to -1 to 1
    let nx = x / halfW;
    
    if (subType === 0) { 
      // === TYPE A: Rounded Teardrop (Elliptical) ===
      // y = -halfH * sqrt(1 - x^2)
      // Added easing to make ends rounder, not pointy
      if (abs(nx) > 0.95) return 0; // Safe guard for ends
      return -halfH * Math.pow(1 - nx*nx, 0.4); // 0.4 power makes it "fatter" and rounder at ends
      
    } else if (subType === 1) { 
      // === TYPE B: Boxy with Rounded Corners ===
      // Flat top with rounded corners
      let cornerX = halfW * 0.8;
      if (abs(x) < cornerX) {
        return -halfH;
      } else {
        // Elliptical corner
        let cx = (x > 0) ? cornerX : -cornerX;
        let dx = x - cx;
        let maxDx = halfW - cornerX;
        return -halfH + halfH * (dx*dx)/(maxDx*maxDx); // Parabolic drop
      }

    } else {
      // === TYPE C: Futuristic (S-Curve / Bulbous) ===
      // A mix of sine and ellipse
      return -halfH * 0.8 * Math.cos(nx * PI * 0.5) - (halfH * 0.2);
    }
  }

  // --- 2. Draw Hull ---
  
  // We draw the hull using small steps to match the curve function exactly
  // This ensures the visual line matches our math for the tower.
  
  // Top Hull
  stroke(colTop);
  noFill();
  beginShape();
  // Iterate from left to right
  for (let x = -halfW; x <= halfW; x += 5) {
    let y = getHullTopY(x);
    
    // Rounding the ends:
    // Near -halfW and halfW, we want a vertical curve, not a point.
    // The loop inherently closes at y=0 if function returns 0 at ends.
    // To ensure roundness, we can adjust the start/end vertices manually.
    if (x === -halfW) vertex(x, 0); 
    else vertex(x, y);
  }
  endShape();

  // Bottom Hull (Mirror or varied)
  stroke(colBottom);
  noFill();
  beginShape();
  for (let x = -halfW; x <= halfW; x += 5) {
    let y = 0;
    if (subType === 1) {
      // Boxy bottom
      y = -getHullTopY(x); // Mirror top roughly
    } else {
      // Streamlined bottom (classic curve)
      // y = halfH * sqrt(1 - x^2)
      let nx = x / halfW;
      y = halfH * Math.pow(1 - nx*nx, 0.5); // Standard ellipse
    }
    vertex(x, y);
  }
  endShape();

  // --- 3. Divider Line ---
  stroke(random(palette));
  strokeWeight(3);
  // Draw line slightly shorter than full width to fit inside the rounded ends
  line(-halfW * 0.95, 0, halfW * 0.95, 0);


  // --- 4. Draw Conning Tower (Sail) ---
  
  let towerW = random(60, 100);
  let towerH = random(60, 90);
  let towerX = random(-halfW * 0.3, halfW * 0.2); // Center-ish
  
  // Calculate exact Y for tower base using our function
  // We calculate Y at the left edge, center, and right edge of the tower
  // to make a "skirt" or just pick the highest point (min Y) to avoid floating.
  // Ideally, we mask the hull line.
  
  // Strategy: Calculate Y at towerX (center of tower base)
  // Then draw the tower starting from that Y.
  // To mask the hull line perfectly, we use the Hull Function to draw the bottom of the tower!
  
  stroke(colTower);
  fill(bgColor); // Masking
  strokeWeight(4);
  
  beginShape();
  // 1. Draw top part of tower (Counter-clockwise)
  // Top Right
  vertex(towerX + towerW/2, getHullTopY(towerX + towerW/2) - towerH);
  // Top Left
  vertex(towerX - towerW/2, getHullTopY(towerX - towerW/2) - towerH);
  
  // 2. Draw bottom part matching the hull curve EXACTLY
  // Iterate from Left to Right along the hull curve
  for (let x = towerX - towerW/2; x <= towerX + towerW/2; x += 2) {
    vertex(x, getHullTopY(x));
  }
  // Close shape
  endShape(CLOSE);
  
  // Draw details on tower
  stroke(colDetail);
  line(towerX, getHullTopY(towerX) - towerH, towerX, getHullTopY(towerX) - towerH - 30); // Periscope


  // --- 5. Windows (Portholes) ---
  let winCount = floor(random(3, 6));
  let winSpacing = 60;
  let winStartX = towerX - ((winCount - 1) * winSpacing) / 2;
  
  for (let i = 0; i < winCount; i++) {
    let wx = winStartX + i * winSpacing;
    // Only draw if within hull width safely
    if (abs(wx) < halfW * 0.8) {
      stroke(colDetail);
      fill(bgColor);
      
      if (random() > 0.5) ellipse(wx, 0, 20, 20); // Center on line
      else {
        rectMode(CENTER);
        rect(wx, 0, 30, 15, 4);
      }
    }
  }

  // --- 6. Propeller (Futaba Style) & Fins ---
  push();
  translate(halfW, 0); // Go to stern
  
  // Propeller: Vertical Two-Leaf (Figure 8)
  stroke(random(palette));
  noFill();
  strokeWeight(3);
  
  // Hub
  fill(bgColor);
  ellipse(10, 0, 10, 10); 
  noFill();
  
  // Leaves
  let leafLen = 35;
  let leafW = 15;
  
  // Upper Leaf (Teardrop shape pointing up)
  beginShape();
  vertex(10, 0);
  bezierVertex(10 + leafW, -leafLen * 0.5, 10 - leafW, -leafLen, 10, -leafLen);
  bezierVertex(10 + leafW/2, -leafLen, 10 + leafW/2, -leafLen * 0.2, 10, 0);
  endShape();
  
  // Lower Leaf (Teardrop shape pointing down)
  beginShape();
  vertex(10, 0);
  bezierVertex(10 + leafW, leafLen * 0.5, 10 - leafW, leafLen, 10, leafLen);
  bezierVertex(10 + leafW/2, leafLen, 10 + leafW/2, leafLen * 0.2, 10, 0);
  endShape();
  
  // Tail Fins
  stroke(colDetail);
  fill(bgColor);
  
  // Upper Fin
  beginShape();
  vertex(-40, -5);
  vertex(-10, -40);
  vertex(20, -40);
  vertex(0, -5);
  endShape(CLOSE);

  // Lower Fin
  beginShape();
  vertex(-40, 5);
  vertex(-10, 40);
  vertex(20, 40);
  vertex(0, 5);
  endShape(CLOSE);
  
  pop();
}
