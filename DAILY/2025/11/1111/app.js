// ===========================
// Config
// ===========================
let W,
  routes = [],
  gridSize,
  hubPoints = [];

const GRID = { edgeMin: 2, edgeMax: 12, hubMin: 4, hubMax: 10, cells: 14 };
const ROUTE = {
  min: 7,
  max: 10,
  waypoints: [6, 9],
  stations: [8, 12],
  hubs: [3, 6],
};
const THRESH = {
  selfIntersect: 2.5,
  minWaypoint: 1.5,
  hubReach: 1.5,
  cornerRadius: 0.8,
  transfer: 0.6,
};
const PROB = { hubPass: 0.7, maxAttempts: 20 };
const STYLE = {
  line: 5,
  lineOutline: 8,
  stationNormal: 9,
  stationTransfer: 11,
  strokeNormal: 3.5,
  strokeTransfer: 4.5,
};

const colors = [
  '#E63946',
  '#06FFA5',
  '#4361EE',
  '#F77F00',
  '#9B5DE5',
  '#FFD60A',
  '#FF006E',
  '#00B4D8',
  '#90E0EF',
];
const lineNames = [
  'Red',
  'Green',
  'Blue',
  'Orange',
  'Purple',
  'Yellow',
  'Magenta',
  'Cyan',
  'Light Blue',
].map((n) => n + ' Line');
const stationNames = [
  'Dawn Square',
  'Memory Cross',
  'Light Terminal',
  'Time Gap',
  'Silent Station',
  'Hope Bridge',
  'Shadow Town',
  'Star Plaza',
  'Wind Passage',
  'Mirror Port',
  'Forest Gate',
  'Rainbow',
  'Moon Stop',
  'Cloud Nine',
  'Sunrise Hill',
  'Daybreak',
  'Poet Corner',
  'Music Hall',
  'Gallery',
  'Dance Plaza',
  'Soul Junction',
  'Heart Station',
  'Future Gate',
  'Past Window',
  'Galaxy Central',
  'Sky Port',
  'Seaside',
  'Summit',
  'Dream Station',
  'Echo Park',
  'Crystal Bay',
  'Zenith',
  'Ember Square',
  'Twilight Ave',
  'Lotus Garden',
  'Harmony',
  'Cascade',
  'Velvet Station',
  'Iris Gate',
  'Nova Plaza',
  'Horizon',
  'Serenity',
  'Phoenix Park',
  'Meteor Stop',
];

// ===========================
// Helpers
// ===========================
const dist2d = (p1, p2) => Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
const pathDist = (path) =>
  path.reduce((sum, p, i) => (i > 0 ? sum + dist2d(path[i - 1], p) : sum), 0);
const getEdgePos = () => {
  const side = floor(random(4));
  return [
    { x: GRID.edgeMin, y: floor(random(3, 11)) },
    { x: GRID.edgeMax, y: floor(random(3, 11)) },
    { x: floor(random(3, 11)), y: GRID.edgeMin },
    { x: floor(random(3, 11)), y: GRID.edgeMax },
  ][side];
};

const isTooClose = (x, y, visited, thresh) =>
  visited.slice(0, -1).some((v) => dist(x, y, v.x, v.y) < thresh);

// ===========================
// Setup
// ===========================
function setup() {
  createCanvas((W = min(windowWidth, windowHeight) - 50), W);
  gridSize = W / GRID.cells;
  generate();
}

function generate() {
  routes = [];

  // Create hubs
  hubPoints = Array.from({ length: floor(random(...ROUTE.hubs)) }, () => ({
    x: floor(random(GRID.hubMin, GRID.hubMax)),
    y: floor(random(GRID.hubMin, GRID.hubMax)),
  }));

  // Generate routes
  const numRoutes = floor(random(ROUTE.min, ROUTE.max));
  routes.push(createLoopLine());

  for (let i = 0; i < numRoutes - 1; i++) {
    routes.push(createRoute(colors[i], lineNames[i]));
  }
}

// ===========================
// Route Creation
// ===========================
function createRoute(color, name) {
  const waypoints = [];
  const visited = [];
  const start = getEdgePos();

  waypoints.push(start);
  visited.push({ ...start });

  // Generate waypoints
  let { x, y } = start;
  let lastDir = null;
  let dirCounter = 0;
  const numWaypoints = floor(random(...ROUTE.waypoints));
  const targetHub =
    random() > 1 - PROB.hubPass && hubPoints.length > 0
      ? random(hubPoints)
      : null;
  let hubReached = false;

  for (let i = 1; i < numWaypoints; i++) {
    let valid = false;
    let attempts = 0;
    let newX, newY, dir;

    while (!valid && attempts++ < PROB.maxAttempts) {
      // Move towards hub or random direction
      if (targetHub && !hubReached && i > 2 && random() > 0.5) {
        const dx = targetHub.x - x;
        const dy = targetHub.y - y;
        if (abs(dx) > abs(dy)) {
          newX = constrain(
            x + (dx > 0 ? floor(random(1, 3)) : -floor(random(1, 3))),
            GRID.edgeMin,
            GRID.edgeMax,
          );
          newY = y;
        } else {
          newX = x;
          newY = constrain(
            y + (dy > 0 ? floor(random(1, 3)) : -floor(random(1, 3))),
            GRID.edgeMin,
            GRID.edgeMax,
          );
        }
        if (dist(newX, newY, targetHub.x, targetHub.y) < THRESH.hubReach) {
          [newX, newY] = [targetHub.x, targetHub.y];
          hubReached = true;
        }
      } else {
        dirCounter++;
        const forceChange = dirCounter >= floor(random(2, 4));

        // Select direction
        let validDir = false;
        while (!validDir && attempts < PROB.maxAttempts) {
          const r = random();
          dir = r < 0.35 ? 'h' : r < 0.7 ? 'v' : 'd';
          if (dir !== lastDir || forceChange) validDir = true;
        }

        // Apply movement
        const d = floor(random(2, dir === 'd' ? 4 : 5));
        if (dir === 'h') {
          newX = constrain(
            x + (random() > 0.5 ? d : -d),
            GRID.edgeMin,
            GRID.edgeMax,
          );
          newY = y;
        } else if (dir === 'v') {
          newX = x;
          newY = constrain(
            y + (random() > 0.5 ? d : -d),
            GRID.edgeMin,
            GRID.edgeMax,
          );
        } else {
          newX = constrain(
            x + (random() > 0.5 ? d : -d),
            GRID.edgeMin,
            GRID.edgeMax,
          );
          newY = constrain(
            y + (random() > 0.5 ? d : -d),
            GRID.edgeMin,
            GRID.edgeMax,
          );
        }
      }

      // Validate
      const notClose = dist(newX, newY, x, y) > THRESH.minWaypoint;
      const notVisited = !isTooClose(newX, newY, visited, THRESH.selfIntersect);
      valid = notClose && notVisited;
    }

    if (valid) {
      waypoints.push({ x: newX, y: newY });
      visited.push({ x: newX, y: newY });
      [x, y] = [newX, newY];
      if (dir !== lastDir) {
        lastDir = dir;
        dirCounter = 0;
      }
    }
  }

  return createRouteFromWaypoints(color, waypoints, name);
}

function createLoopLine() {
  const cx = random(5, 9),
    cy = random(5, 9),
    r = random(2.3, 3.5);
  const numStations = floor(random(...ROUTE.stations));
  const stations = [];
  const path = [];

  for (let i = 0; i < numStations; i++) {
    const angle = (TWO_PI / numStations) * i - HALF_PI;
    stations.push({
      x: (cx + cos(angle) * r) * gridSize,
      y: (cy + sin(angle) * r) * gridSize,
      name: random(stationNames),
    });
  }

  for (let i = 0; i <= 100; i++) {
    const angle = (TWO_PI / 100) * i - HALF_PI;
    path.push({
      x: (cx + cos(angle) * r) * gridSize,
      y: (cy + sin(angle) * r) * gridSize,
    });
  }

  return { color: random(colors), name: 'Loop Line', stations, path };
}

function createRouteFromWaypoints(color, waypoints, name) {
  const path = generatePath(waypoints);
  const route = { color, name, stations: [], path };

  if (path.length === 0) return route;

  // Place stations
  const totalDist = pathDist(path);
  const numStations = floor(random(...ROUTE.stations));
  const spacing = totalDist / (numStations - 1);

  route.stations.push({
    x: path[0].x,
    y: path[0].y,
    name: random(stationNames),
  });

  for (let s = 1; s < numStations - 1; s++) {
    const pos = findPointAtDist(path, s * spacing);
    if (pos) route.stations.push({ ...pos, name: random(stationNames) });
  }

  const last = path[path.length - 1];
  route.stations.push({ x: last.x, y: last.y, name: random(stationNames) });

  return route;
}

function findPointAtDist(path, targetDist) {
  let acc = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const segDist = dist2d(path[i], path[i + 1]);
    if (acc + segDist >= targetDist) {
      const t = (targetDist - acc) / segDist;
      return {
        x: lerp(path[i].x, path[i + 1].x, t),
        y: lerp(path[i].y, path[i + 1].y, t),
      };
    }
    acc += segDist;
  }
  return null;
}

function generatePath(waypoints) {
  const path = [];
  const cornerR = gridSize * THRESH.cornerRadius;

  for (let i = 0; i < waypoints.length; i++) {
    const cur = waypoints[i],
      next = waypoints[i + 1],
      prev = waypoints[i - 1];

    if (i === 0) path.push({ x: cur.x * gridSize, y: cur.y * gridSize });

    if (next) {
      const isCorner =
        prev &&
        (cur.x - prev.x !== next.x - cur.x ||
          cur.y - prev.y !== next.y - cur.y);

      if (isCorner) {
        // Rounded corner
        let [pdx, pdy] = [cur.x - prev.x, cur.y - prev.y];
        let [ndx, ndy] = [next.x - cur.x, next.y - cur.y];
        const pLen = Math.sqrt(pdx ** 2 + pdy ** 2);
        const nLen = Math.sqrt(ndx ** 2 + ndy ** 2);
        [pdx, pdy] = [pdx / pLen, pdy / pLen];
        [ndx, ndy] = [ndx / nLen, ndy / nLen];

        const approach = Math.min(cornerR / gridSize, 0.8);
        const [ax, ay] = [
          (cur.x - pdx * approach) * gridSize,
          (cur.y - pdy * approach) * gridSize,
        ];
        const [ex, ey] = [
          (cur.x + ndx * approach) * gridSize,
          (cur.y + ndy * approach) * gridSize,
        ];

        // Line to approach
        const last = path[path.length - 1];
        const steps = Math.floor(dist2d(last, { x: ax, y: ay }) / 10);
        for (let t = 1; t <= steps; t++) {
          path.push({
            x: lerp(last.x, ax, t / steps),
            y: lerp(last.y, ay, t / steps),
          });
        }

        // Bezier curve
        const [cx, cy] = [cur.x * gridSize, cur.y * gridSize];
        for (let t = 0; t <= 15; t++) {
          const p = t / 15;
          path.push({
            x: (1 - p) ** 2 * ax + 2 * (1 - p) * p * cx + p ** 2 * ex,
            y: (1 - p) ** 2 * ay + 2 * (1 - p) * p * cy + p ** 2 * ey,
          });
        }
      } else {
        // Straight line
        const [dx, dy] = [next.x - cur.x, next.y - cur.y];
        const steps = Math.floor(Math.sqrt(dx ** 2 + dy ** 2) * 8);
        for (let t = 1; t <= steps; t++) {
          path.push({
            x: cur.x * gridSize + dx * gridSize * (t / steps),
            y: cur.y * gridSize + dy * gridSize * (t / steps),
          });
        }
      }
    }
  }

  return path;
}

// ===========================
// Drawing
// ===========================
function draw() {
  background(245, 243, 238);

  // Grid
  push();
  stroke(230, 230, 230);
  strokeWeight(0.5);
  for (let i = 0; i <= GRID.cells; i++) {
    const p = i * gridSize;
    line(p, 0, p, W);
    line(0, p, W, p);
  }
  pop();

  // Routes
  for (const r of routes) {
    push();
    stroke(255);
    strokeWeight(STYLE.lineOutline);
    strokeCap(ROUND);
    strokeJoin(ROUND);
    noFill();
    beginShape();
    r.path.forEach((p) => vertex(p.x, p.y));
    endShape();

    stroke(r.color);
    strokeWeight(STYLE.line);
    beginShape();
    r.path.forEach((p) => vertex(p.x, p.y));
    endShape();
    pop();
  }

  // Stations
  for (const r of routes) {
    push();
    for (const s of r.stations) {
      const isTransfer = routes.some(
        (route) =>
          route.stations.filter(
            (st) => dist(s.x, s.y, st.x, st.y) < gridSize * THRESH.transfer,
          ).length > 1,
      );
      const size = isTransfer ? STYLE.stationTransfer : STYLE.stationNormal;
      const sw = isTransfer ? STYLE.strokeTransfer : STYLE.strokeNormal;

      fill(255);
      stroke(r.color);
      strokeWeight(sw);
      ellipse(s.x, s.y, size * 2);

      if (isTransfer) {
        noStroke();
        fill(255);
        ellipse(s.x, s.y, size * 0.6);
      }
    }
    pop();
  }

  // Station names
  push();
  textFont('sans-serif');
  textSize(10);
  for (const r of routes) {
    for (let i = 0; i < r.stations.length; i++) {
      const s = r.stations[i];
      let angle;
      if (r.name === 'Loop Line') {
        angle = atan2(s.y - W / 2, s.x - W / 2);
      } else if (i > 0 && i < r.stations.length - 1) {
        angle =
          atan2(
            r.stations[i + 1].y - r.stations[i - 1].y,
            r.stations[i + 1].x - r.stations[i - 1].x,
          ) + HALF_PI;
      } else if (i === 0) {
        angle = atan2(r.stations[1].y - s.y, r.stations[1].x - s.x) + HALF_PI;
      } else {
        angle =
          atan2(s.y - r.stations[i - 1].y, s.x - r.stations[i - 1].x) + HALF_PI;
      }

      const [tx, ty] = [s.x + cos(angle) * 22, s.y + sin(angle) * 22];
      const tw = textWidth(s.name);

      fill(245, 243, 238, 240);
      noStroke();
      rect(tx - tw / 2 - 3, ty - 7, tw + 6, 14, 2);

      fill(r.color);
      textAlign(CENTER, CENTER);
      text(s.name, tx, ty);
    }
  }
  pop();

  // Legend
  push();
  const [lx, ly] = [W * 0.03, W * 0.88];
  textFont('sans-serif');
  textSize(10);
  routes.forEach((r, i) => {
    const y = ly - (routes.length - 1 - i) * 16;
    stroke(r.color);
    strokeWeight(3.5);
    line(lx, y, lx + 22, y);
    noStroke();
    fill(80);
    textAlign(LEFT, CENTER);
    text(r.name, lx + 28, y);
  });
  pop();

  // Title
  push();
  fill(0, 0, 0, 100);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(W * 0.022);
  textFont('sans-serif');
  textStyle(BOLD);
  text('MRT NETWORK MAP', W * 0.03, W * 0.02);
  textStyle(NORMAL);
  textSize(W * 0.016);
  fill(0, 0, 0, 80);
  text(
    `${routes.length} Lines • ${routes.reduce(
      (t, r) => t + r.stations.length,
      0,
    )} Stations`,
    W * 0.03,
    W * 0.05,
  );
  pop();
}

function keyPressed() {
  if (key === 'c') saveCanvas(`mrt-${round(Date.now() / 100000)}`, 'jpeg');
  if (key === 'r') generate();
}
