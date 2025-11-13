// 円柱状に降る白い点のアニメーション（環状交差点の中心から出入り）
let fallingParticles = [];
let roadParticlesTop = [];
let roadParticlesBottom = [];
let numFallingParticles = 300;
let numRoadParticles = 200;
let cylinderRadius;
let innerCircleRadius; // 中央の円の半径

function setup() {
  createCanvas(windowWidth, windowHeight);
  cylinderRadius = min(width, height) * 0.35;
  innerCircleRadius = cylinderRadius * 0.5; // 中央島の半径

  // 落下するパーティクルの初期化
  for (let i = 0; i < numFallingParticles; i++) {
    fallingParticles.push(createFallingParticle());
  }

  // 上の環状交差点のパーティクル
  for (let i = 0; i < numRoadParticles; i++) {
    roadParticlesTop.push(
      createRoadParticle(height * 0.15, 1, i / numRoadParticles),
    );
  }

  // 下の環状交差点のパーティクル
  for (let i = 0; i < numRoadParticles; i++) {
    roadParticlesBottom.push(
      createRoadParticle(height * 0.85, 0.8, i / numRoadParticles),
    );
  }
}

function createFallingParticle() {
  // 上の中央円からランダムに出発
  const angle = random(TWO_PI);
  const radius = random(innerCircleRadius * 0.8); // 中央円の範囲内
  const topY = height * 0.15;
  const scaleY = 0.5; // 上の円の遠近スケール

  return {
    x: width / 2 + cos(angle) * radius,
    z: sin(angle) * radius,
    y: topY + height * 0.85 * random() + sin(angle) * radius * scaleY, // 楕円の高さに合わせる
    targetY: height * 0.85, // 下の円の位置
    speed: random(1.5, 4),
    baseSize: random(1.5, 3),
    trail: [],
    noiseOffsetX: random(1000),
    noiseOffsetZ: random(1000),
    flowSpeed: random(0.01, 0.03),
    flowStrength: random(8, 20),
    type: 'falling',
    startAngle: angle, // 開始角度を記憶
    startRadius: radius, // 開始半径を記憶
    currentAngle: angle, // 現在の角度
    currentRadius: radius, // 現在の半径
  };
}

function createRoadParticle(centerY, depthPosition, angleOffset) {
  const angle = angleOffset * TWO_PI;
  const laneRadius = cylinderRadius * random(0.4, 0.95);
  const scaleY = map(depthPosition, 0, 1, 0.3, 0.5);

  return {
    centerY: centerY,
    angle: angle,
    laneRadius: laneRadius,
    scaleY: scaleY,
    speed: random(0.005, 0.01),
    baseSize: random(1, 2.5),
    trail: [],
    type: 'road',
    direction: random() > 0.5 ? 1 : -1,
  };
}

function resetFallingParticle(particle) {
  const angle = random(TWO_PI);
  const radius = random(innerCircleRadius * 0.8);
  const topY = height * 0.15;
  const scaleY = 0.5;

  particle.currentAngle = angle;
  particle.currentRadius = radius;
  particle.y = topY + sin(angle) * radius * scaleY;
  particle.speed = random(1.5, 4);
  particle.baseSize = random(1.5, 3);
  particle.trail = [];
  particle.noiseOffsetX = random(1000);
  particle.noiseOffsetZ = random(1000);
  particle.flowSpeed = random(0.01, 0.03);
  particle.flowStrength = random(8, 20);
  particle.startAngle = angle;
  particle.startRadius = radius;
}

function draw() {
  // 半透明の背景で残像効果
  fill(20, 20, 30, 30);
  noStroke();
  rect(0, 0, width, height);

  // すべてのパーティクルを統合
  let allParticles = [];

  // 上の環状交差点のパーティクルを更新
  for (let particle of roadParticlesTop) {
    updateRoadParticle(particle);
    allParticles.push(particle);
  }

  // 落下するパーティクルを更新
  for (let particle of fallingParticles) {
    updateFallingParticle(particle);
    allParticles.push(particle);
  }

  // 下の環状交差点のパーティクルを更新
  for (let particle of roadParticlesBottom) {
    updateRoadParticle(particle);
    allParticles.push(particle);
  }

  // パーティクルを描画
  for (let particle of allParticles) {
    if (particle.type === 'falling') {
      drawFallingParticle(particle);
    } else {
      drawRoadParticle(particle);
    }
  }

  // 中央の円を描画（視覚的な参考）
  drawCentralCircles();

  // UI表示
  displayInfo();
}

function updateFallingParticle(particle) {
  // 軌跡を保存
  particle.trail.push({ x: particle.x, y: particle.y, z: particle.z });
  if (particle.trail.length > 25) {
    particle.trail.shift();
  }

  // 流線形の動き（角度方向に）
  const noiseAngle = noise(
    particle.noiseOffsetX + frameCount * particle.flowSpeed,
  );
  const noiseRadius = noise(
    particle.noiseOffsetZ + frameCount * particle.flowSpeed,
  );

  particle.currentAngle += (noiseAngle - 0.5) * 0.02;
  particle.currentRadius += (noiseRadius - 0.5) * particle.flowStrength * 0.02;

  // 落下
  particle.y += particle.speed;

  // 進行度を計算
  const progress = map(particle.y, height * 0.15, height * 0.85, 0, 1);

  // 中央円の範囲内に緩やかに収束
  const targetRadius = innerCircleRadius * 0.8;
  if (particle.currentRadius > targetRadius && progress > 0.3) {
    const pullStrength = map(progress, 0.3, 1, 0, 0.1);
    particle.currentRadius = lerp(
      particle.currentRadius,
      targetRadius,
      pullStrength,
    );
  }

  // 円柱の円形を保ちながらXとZを更新
  particle.x = width / 2 + cos(particle.currentAngle) * particle.currentRadius;
  particle.z = sin(particle.currentAngle) * particle.currentRadius;

  // 下の円に到達したらリセット
  if (particle.y > height * 0.85 - particle.z) {
    resetFallingParticle(particle);
  }
}

function updateRoadParticle(particle) {
  // 軌跡を保存
  const x = width / 2 + cos(particle.angle) * particle.laneRadius;
  const y =
    particle.centerY +
    sin(particle.angle) * particle.laneRadius * particle.scaleY;

  particle.trail.push({ x: x, y: y });
  if (particle.trail.length > 20) {
    particle.trail.shift();
  }

  // 角度を更新（回転）
  particle.angle += particle.speed * particle.direction;
}

function drawFallingParticle(particle) {
  // 奥行きに応じたスケールと透明度
  const depthScale = map(particle.z, -cylinderRadius, cylinderRadius, 0.3, 1.2);
  const alpha = map(particle.z, -cylinderRadius, cylinderRadius, 100, 255);

  // 2D描画位置を計算（Xはそのまま、Yに奥行き（Z）の影響を加える）
  const drawX = particle.x;
  const drawY = particle.y; // Zの影響は透明度とサイズのみに反映

  // 軌跡を描画
  if (particle.trail.length >= 2) {
    noFill();
    for (let i = 0; i < particle.trail.length - 1; i++) {
      const t1 = particle.trail[i];
      const t2 = particle.trail[i + 1];

      // 各軌跡点の2D位置
      const t1x = t1.x;
      const t1y = t1.y;
      const t2x = t2.x;
      const t2y = t2.y;

      const t1DepthScale = map(t1.z, -cylinderRadius, cylinderRadius, 0.3, 1.2);
      const trailAlpha = map(i, 0, particle.trail.length, 0, alpha * 0.7);
      const weight = map(i, 0, particle.trail.length, 0.3, 1) * t1DepthScale;

      stroke(255, 255, 255, trailAlpha);
      strokeWeight(weight);
      line(t1x, t1y, t2x, t2y);
    }
  }

  // パーティクル本体
  const size = particle.baseSize * depthScale;
  noStroke();
  fill(255, 255, 255, alpha);
  ellipse(drawX, drawY, size * 2, size * 2);
}

function drawRoadParticle(particle) {
  const x = width / 2 + cos(particle.angle) * particle.laneRadius;
  const y =
    particle.centerY +
    sin(particle.angle) * particle.laneRadius * particle.scaleY;

  // 軌跡を描画
  if (particle.trail.length >= 2) {
    noFill();
    for (let i = 0; i < particle.trail.length - 1; i++) {
      const t1 = particle.trail[i];
      const t2 = particle.trail[i + 1];
      const trailAlpha = map(i, 0, particle.trail.length, 0, 180);
      const weight = map(i, 0, particle.trail.length, 0.3, 0.8);

      stroke(150, 200, 255, trailAlpha);
      strokeWeight(weight);
      line(t1.x, t1.y, t2.x, t2.y);
    }
  }

  // パーティクル本体
  noStroke();
  ellipse(x, y, particle.baseSize * 2, particle.baseSize * 2);
}

function drawCentralCircles() {
  // 上の中央円
  push();
  noFill();
  stroke(80, 100, 120, 100);
  strokeWeight(1.5);
  const topScaleY = 0.5;
  ellipse(
    width / 2,
    height * 0.15,
    innerCircleRadius * 2,
    innerCircleRadius * 2 * topScaleY,
  );
  pop();

  // 下の中央円
  push();
  noFill();
  stroke(80, 100, 120, 100);
  strokeWeight(1.5);
  const bottomScaleY = 0.4;
  ellipse(
    width / 2,
    height * 0.85,
    innerCircleRadius * 2,
    innerCircleRadius * 2 * bottomScaleY,
  );
  pop();
}

function displayInfo() {
  fill(255);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  text(`Falling: ${numFallingParticles}`, 10, 10);
  text(`Road: ${numRoadParticles * 2}`, 10, 30);
  text('Keys:', 10, 50);
  text('1/2: Falling particles ±50', 10, 70);
  text('3/4: Road particles ±25', 10, 90);
  text('5/6: Flow strength ±', 10, 110);
  text('R: Reset', 10, 130);
  text('S: Save screenshot', 10, 150);
}

function adjustFallingParticles() {
  const diff = numFallingParticles - fallingParticles.length;
  if (diff > 0) {
    for (let i = 0; i < diff; i++) {
      fallingParticles.push(createFallingParticle());
    }
  } else if (diff < 0) {
    fallingParticles = fallingParticles.slice(0, numFallingParticles);
  }
}

function adjustRoadParticles() {
  roadParticlesTop = [];
  roadParticlesBottom = [];

  for (let i = 0; i < numRoadParticles; i++) {
    roadParticlesTop.push(
      createRoadParticle(height * 0.15, 1, i / numRoadParticles),
    );
    roadParticlesBottom.push(
      createRoadParticle(height * 0.85, 0.8, i / numRoadParticles),
    );
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cylinderRadius = min(width, height) * 0.35;
  innerCircleRadius = cylinderRadius * 0.5;
}

function keyPressed() {
  if (key === '1') {
    numFallingParticles = max(50, numFallingParticles - 50);
    adjustFallingParticles();
  }
  if (key === '2') {
    numFallingParticles = min(1000, numFallingParticles + 50);
    adjustFallingParticles();
  }
  if (key === '3') {
    numRoadParticles = max(50, numRoadParticles - 25);
    adjustRoadParticles();
  }
  if (key === '4') {
    numRoadParticles = min(400, numRoadParticles + 25);
    adjustRoadParticles();
  }
  if (key === '5') {
    fallingParticles.forEach(
      (p) => (p.flowStrength = max(3, p.flowStrength - 3)),
    );
  }
  if (key === '6') {
    fallingParticles.forEach(
      (p) => (p.flowStrength = min(50, p.flowStrength + 3)),
    );
  }
  if (key === 'r' || key === 'R') {
    particles = [];
    for (let i = 0; i < numFallingParticles; i++) {
      particles.push(createFallingParticle());
    }
  }
  if (key === 's' || key === 'S') {
    saveGif(`mySketch-${round(new Date().getTime() / 100000)}`, 5);
  }

  if (key === 'c' || key === 'C') {
    saveCanvas(`mySketch-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }
}
