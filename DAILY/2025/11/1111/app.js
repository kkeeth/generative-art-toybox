// ===========================
// Global Variables
// ===========================
let W;
let routes = [];
let gridSize;
let hubPoints = [];

// ===========================
// Constants
// ===========================
const GRID_EDGE_MIN = 2;
const GRID_EDGE_MAX = 12;
const GRID_HUB_MIN = 4;
const GRID_HUB_MAX = 10;
const GRID_CELLS = 14;

const MIN_ROUTE_COUNT = 7;
const MAX_ROUTE_COUNT = 10;
const MIN_WAYPOINTS = 6;
const MAX_WAYPOINTS = 9;
const MIN_STATIONS = 8;
const MAX_STATIONS = 12;
const MIN_HUB_COUNT = 3;
const MAX_HUB_COUNT = 6;

const SELF_INTERSECTION_THRESHOLD = 2.5;
const MIN_WAYPOINT_DISTANCE = 1.5;
const HUB_REACH_THRESHOLD = 1.5;
const CORNER_RADIUS_FACTOR = 0.8;
const TRANSFER_STATION_THRESHOLD = 0.6;

const HUB_PASS_PROBABILITY = 0.7;
const MAX_WAYPOINT_ATTEMPTS = 20;

const LINE_THICKNESS = 5;
const LINE_OUTLINE_THICKNESS = 8;
const STATION_SIZE_NORMAL = 9;
const STATION_SIZE_TRANSFER = 11;
const STATION_STROKE_NORMAL = 3.5;
const STATION_STROKE_TRANSFER = 4.5;

// MRT-inspired color palette
const colors = [
  '#E63946', // Red Line
  '#06FFA5', // Green Line
  '#4361EE', // Blue Line
  '#F77F00', // Orange Line
  '#9B5DE5', // Purple Line
  '#FFD60A', // Yellow Line
  '#FF006E', // Magenta Line
  '#00B4D8', // Cyan Line
  '#90E0EF', // Light Blue Line
];

// English station names (poetic/abstract)
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

const lineNames = [
  'Red Line',
  'Green Line',
  'Blue Line',
  'Orange Line',
  'Purple Line',
  'Yellow Line',
  'Magenta Line',
  'Cyan Line',
  'Light Blue Line',
];

// ===========================
// Helper Functions
// ===========================

/**
 * Calculate Euclidean distance between two points
 */
function calculateDistance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * Get random edge position for route start
 */
function getRandomEdgePosition() {
  const startSide = floor(random(4));
  const positions = [
    { x: GRID_EDGE_MIN, y: floor(random(3, 11)) }, // Left
    { x: GRID_EDGE_MAX, y: floor(random(3, 11)) }, // Right
    { x: floor(random(3, 11)), y: GRID_EDGE_MIN }, // Top
    { x: floor(random(3, 11)), y: GRID_EDGE_MAX }, // Bottom
  ];
  return positions[startSide];
}

/**
 * Check if a position is too close to visited positions
 */
function isTooCloseToVisited(newX, newY, visitedPositions, threshold) {
  for (let j = 0; j < visitedPositions.length - 1; j++) {
    const visited = visitedPositions[j];
    if (dist(newX, newY, visited.x, visited.y) < threshold) {
      return true;
    }
  }
  return false;
}

/**
 * Calculate total path distance
 */
function calculatePathDistance(path) {
  let totalDistance = 0;
  for (let i = 0; i < path.length - 1; i++) {
    totalDistance += calculateDistance(path[i], path[i + 1]);
  }
  return totalDistance;
}

// ===========================
// Setup and Generation
// ===========================

function setup() {
  createCanvas((W = min(windowWidth, windowHeight) - 50), W);
  gridSize = W / GRID_CELLS;
  generateRoutes();
}

function generateRoutes() {
  routes = [];

  // Create hub points for transfer stations
  hubPoints = [];
  const numHubs = floor(random(MIN_HUB_COUNT, MAX_HUB_COUNT));
  for (let i = 0; i < numHubs; i++) {
    hubPoints.push({
      x: floor(random(GRID_HUB_MIN, GRID_HUB_MAX)),
      y: floor(random(GRID_HUB_MIN, GRID_HUB_MAX)),
    });
  }

  // Generate routes
  let numRoutes = floor(random(MIN_ROUTE_COUNT, MAX_ROUTE_COUNT));

  // Always include a loop line
  routes.push(createRandomLoopLine());
  numRoutes--;

  // Create remaining routes
  for (let i = 0; i < numRoutes; i++) {
    routes.push(createRandomRoute(colors[i], lineNames[i]));
  }
}

// ===========================
// Route Creation
// ===========================

function createRandomRoute(color, lineName) {
  const numWaypoints = floor(random(MIN_WAYPOINTS, MAX_WAYPOINTS));
  const waypoints = [];
  const visitedPositions = [];

  // Set starting position
  const startPoint = getRandomEdgePosition();
  waypoints.push(startPoint);
  visitedPositions.push({ x: startPoint.x, y: startPoint.y });

  // Generate waypoints
  const generatedWaypoints = generateWaypoints(
    startPoint,
    numWaypoints,
    visitedPositions
  );
  waypoints.push(...generatedWaypoints);

  return createRouteFromWaypoints(color, waypoints, lineName);
}

function generateWaypoints(startPoint, numWaypoints, visitedPositions) {
  const waypoints = [];
  let currentX = startPoint.x;
  let currentY = startPoint.y;
  let lastDirection = null;
  let directionChangeCounter = 0;

  // Hub targeting
  const passThoughHub = random() > (1 - HUB_PASS_PROBABILITY) && hubPoints.length > 0;
  const targetHub = passThoughHub ? random(hubPoints) : null;
  let hubReached = false;

  for (let i = 1; i < numWaypoints; i++) {
    const result = findNextWaypoint(
      currentX,
      currentY,
      visitedPositions,
      targetHub,
      hubReached,
      lastDirection,
      directionChangeCounter,
      i
    );

    if (result.valid) {
      waypoints.push({ x: result.x, y: result.y });
      visitedPositions.push({ x: result.x, y: result.y });
      currentX = result.x;
      currentY = result.y;

      if (result.direction !== lastDirection) {
        lastDirection = result.direction;
        directionChangeCounter = 0;
      }

      if (result.hubReached) {
        hubReached = true;
      }
    }
  }

  return waypoints;
}

function findNextWaypoint(
  currentX,
  currentY,
  visitedPositions,
  targetHub,
  hubReached,
  lastDirection,
  directionChangeCounter,
  iteration
) {
  let validPosition = false;
  let attemptCount = 0;
  let newX, newY, directionType;

  while (!validPosition && attemptCount < MAX_WAYPOINT_ATTEMPTS) {
    attemptCount++;

    // Try to move towards hub
    if (targetHub && !hubReached && iteration > 2 && random() > 0.5) {
      const hubResult = moveTowardsHub(currentX, currentY, targetHub);
      newX = hubResult.x;
      newY = hubResult.y;

      if (dist(newX, newY, targetHub.x, targetHub.y) < HUB_REACH_THRESHOLD) {
        newX = targetHub.x;
        newY = targetHub.y;
        hubReached = true;
      }
    } else {
      // Normal direction-based movement
      directionChangeCounter++;
      const forceChange = directionChangeCounter >= floor(random(2, 4));
      directionType = selectDirection(lastDirection, forceChange);

      const movement = applyDirectionMovement(currentX, currentY, directionType);
      newX = movement.x;
      newY = movement.y;
    }

    // Validate position
    const notTooClose = dist(newX, newY, currentX, currentY) > MIN_WAYPOINT_DISTANCE;
    const notVisited = !isTooCloseToVisited(
      newX,
      newY,
      visitedPositions,
      SELF_INTERSECTION_THRESHOLD
    );

    if (notTooClose && notVisited) {
      validPosition = true;
    }
  }

  return {
    valid: validPosition,
    x: newX,
    y: newY,
    direction: directionType,
    hubReached: hubReached,
  };
}

function moveTowardsHub(currentX, currentY, targetHub) {
  const dx = targetHub.x - currentX;
  const dy = targetHub.y - currentY;
  let newX, newY;

  if (abs(dx) > abs(dy)) {
    newX = currentX + (dx > 0 ? floor(random(1, 3)) : -floor(random(1, 3)));
    newY = currentY;
  } else {
    newX = currentX;
    newY = currentY + (dy > 0 ? floor(random(1, 3)) : -floor(random(1, 3)));
  }

  return {
    x: constrain(newX, GRID_EDGE_MIN, GRID_EDGE_MAX),
    y: constrain(newY, GRID_EDGE_MIN, GRID_EDGE_MAX),
  };
}

function selectDirection(lastDirection, forceChange) {
  let directionType;
  let attempts = 0;

  do {
    const rand = random();
    if (rand < 0.35) {
      directionType = 'horizontal';
    } else if (rand < 0.7) {
      directionType = 'vertical';
    } else {
      directionType = 'diagonal';
    }

    attempts++;
    if (attempts > 5) break;
  } while (directionType === lastDirection && !forceChange);

  return directionType;
}

function applyDirectionMovement(currentX, currentY, directionType) {
  let newX, newY;

  if (directionType === 'horizontal') {
    const distance = floor(random(2, 5));
    newX = constrain(currentX + (random() > 0.5 ? distance : -distance), GRID_EDGE_MIN, GRID_EDGE_MAX);
    newY = currentY;
  } else if (directionType === 'vertical') {
    const distance = floor(random(2, 5));
    newX = currentX;
    newY = constrain(currentY + (random() > 0.5 ? distance : -distance), GRID_EDGE_MIN, GRID_EDGE_MAX);
  } else {
    const distance = floor(random(2, 4));
    newX = constrain(currentX + (random() > 0.5 ? distance : -distance), GRID_EDGE_MIN, GRID_EDGE_MAX);
    newY = constrain(currentY + (random() > 0.5 ? distance : -distance), GRID_EDGE_MIN, GRID_EDGE_MAX);
  }

  return { x: newX, y: newY };
}

function createRandomLoopLine() {
  const route = {
    color: colors[floor(random(colors.length))],
    name: 'Loop Line',
    stations: [],
    path: [],
  };

  const centerX = random(5, 9);
  const centerY = random(5, 9);
  const radius = random(2.3, 3.5);
  const numStations = floor(random(MIN_STATIONS, MAX_STATIONS));

  // Create stations
  for (let i = 0; i < numStations; i++) {
    const angle = (TWO_PI / numStations) * i - HALF_PI;
    const x = centerX + cos(angle) * radius;
    const y = centerY + sin(angle) * radius;

    route.stations.push({
      x: x * gridSize,
      y: y * gridSize,
      name: random(stationNames),
    });
  }

  // Generate circular path
  const steps = 100;
  for (let i = 0; i <= steps; i++) {
    const angle = (TWO_PI / steps) * i - HALF_PI;
    const x = (centerX + cos(angle) * radius) * gridSize;
    const y = (centerY + sin(angle) * radius) * gridSize;
    route.path.push({ x, y });
  }

  return route;
}

function createRouteFromWaypoints(color, waypoints, lineName) {
  const route = {
    color: color,
    name: lineName,
    stations: [],
    path: [],
  };

  // Generate path first
  route.path = generatePathWithRoundedCorners(waypoints);

  if (route.path.length === 0) {
    return route;
  }

  // Place stations along the path
  placeStationsAlongPath(route);

  return route;
}

function placeStationsAlongPath(route) {
  const totalPathDistance = calculatePathDistance(route.path);
  const numStations = floor(random(MIN_STATIONS, MAX_STATIONS));

  // First station at path start
  route.stations.push({
    x: route.path[0].x,
    y: route.path[0].y,
    name: random(stationNames),
  });

  // Intermediate stations
  if (numStations > 2) {
    const stationSpacing = totalPathDistance / (numStations - 1);

    for (let s = 1; s < numStations - 1; s++) {
      const targetDistance = s * stationSpacing;
      const stationPos = findPointAtDistance(route.path, targetDistance);

      if (stationPos) {
        route.stations.push({
          x: stationPos.x,
          y: stationPos.y,
          name: random(stationNames),
        });
      }
    }
  }

  // Last station at path end
  route.stations.push({
    x: route.path[route.path.length - 1].x,
    y: route.path[route.path.length - 1].y,
    name: random(stationNames),
  });
}

function findPointAtDistance(path, targetDistance) {
  let accumulatedDistance = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const p1 = path[i];
    const p2 = path[i + 1];
    const segmentDist = calculateDistance(p1, p2);

    if (accumulatedDistance + segmentDist >= targetDistance) {
      const t = (targetDistance - accumulatedDistance) / segmentDist;
      return {
        x: lerp(p1.x, p2.x, t),
        y: lerp(p1.y, p2.y, t),
      };
    }

    accumulatedDistance += segmentDist;
  }

  return null;
}

function generatePathWithRoundedCorners(waypoints) {
  const path = [];
  const cornerRadius = gridSize * CORNER_RADIUS_FACTOR;

  for (let i = 0; i < waypoints.length; i++) {
    const current = waypoints[i];
    const next = waypoints[i + 1];
    const prev = waypoints[i - 1];

    if (i === 0) {
      path.push({ x: current.x * gridSize, y: current.y * gridSize });
    }

    if (next) {
      const isCorner = prev && hasDirectionChange(prev, current, next);

      if (isCorner) {
        addRoundedCorner(path, prev, current, next, cornerRadius);
      } else {
        addStraightSegment(path, current, next);
      }
    }
  }

  return path;
}

function hasDirectionChange(prev, current, next) {
  const prevDx = current.x - prev.x;
  const prevDy = current.y - prev.y;
  const nextDx = next.x - current.x;
  const nextDy = next.y - current.y;
  return prevDx !== nextDx || prevDy !== nextDy;
}

function addRoundedCorner(path, prev, current, next, cornerRadius) {
  let prevDx = current.x - prev.x;
  let prevDy = current.y - prev.y;
  let nextDx = next.x - current.x;
  let nextDy = next.y - current.y;

  // Normalize
  const prevLen = Math.sqrt(prevDx * prevDx + prevDy * prevDy);
  const nextLen = Math.sqrt(nextDx * nextDx + nextDy * nextDy);
  prevDx /= prevLen;
  prevDy /= prevLen;
  nextDx /= nextLen;
  nextDy /= nextLen;

  // Calculate corner points
  const approachDist = Math.min(cornerRadius / gridSize, 0.8);
  const approachX = (current.x - prevDx * approachDist) * gridSize;
  const approachY = (current.y - prevDy * approachDist) * gridSize;
  const exitX = (current.x + nextDx * approachDist) * gridSize;
  const exitY = (current.y + nextDy * approachDist) * gridSize;

  // Add straight line to approach
  const lastPoint = path[path.length - 1];
  const dist = calculateDistance(lastPoint, { x: approachX, y: approachY });
  const steps = Math.floor(dist / 10);

  for (let t = 1; t <= steps; t++) {
    const progress = t / steps;
    path.push({
      x: lerp(lastPoint.x, approachX, progress),
      y: lerp(lastPoint.y, approachY, progress),
    });
  }

  // Add curved corner (quadratic bezier)
  const controlX = current.x * gridSize;
  const controlY = current.y * gridSize;
  const curveSteps = 15;

  for (let t = 0; t <= curveSteps; t++) {
    const progress = t / curveSteps;
    const x =
      Math.pow(1 - progress, 2) * approachX +
      2 * (1 - progress) * progress * controlX +
      Math.pow(progress, 2) * exitX;
    const y =
      Math.pow(1 - progress, 2) * approachY +
      2 * (1 - progress) * progress * controlY +
      Math.pow(progress, 2) * exitY;
    path.push({ x, y });
  }
}

function addStraightSegment(path, current, next) {
  const dx = next.x - current.x;
  const dy = next.y - current.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const steps = Math.floor(dist * 8);

  for (let t = 1; t <= steps; t++) {
    const progress = t / steps;
    const lastPoint = path[path.length - 1];
    const targetX = current.x * gridSize + (next.x - current.x) * gridSize * progress;
    const targetY = current.y * gridSize + (next.y - current.y) * gridSize * progress;
    path.push({ x: targetX, y: targetY });
  }
}

// ===========================
// Drawing Functions
// ===========================

function draw() {
  background(245, 243, 238);

  drawGrid();
  drawRoutes();
  drawStations();
  drawStationNames();
  drawLegend();
  drawTitle();
}

function drawGrid() {
  push();
  stroke(230, 230, 230);
  strokeWeight(0.5);

  for (let i = 0; i <= GRID_CELLS; i++) {
    const pos = i * gridSize;
    line(pos, 0, pos, W);
    line(0, pos, W, pos);
  }
  pop();
}

function drawRoutes() {
  for (const route of routes) {
    drawRoute(route);
  }
}

function drawRoute(route) {
  push();

  // White outline
  stroke(255);
  strokeWeight(LINE_OUTLINE_THICKNESS);
  strokeCap(ROUND);
  strokeJoin(ROUND);
  noFill();

  beginShape();
  for (const p of route.path) {
    vertex(p.x, p.y);
  }
  endShape();

  // Colored line
  stroke(route.color);
  strokeWeight(LINE_THICKNESS);

  beginShape();
  for (const p of route.path) {
    vertex(p.x, p.y);
  }
  endShape();

  pop();
}

function drawStations() {
  for (const route of routes) {
    drawRouteStations(route);
  }
}

function drawRouteStations(route) {
  push();

  for (const station of route.stations) {
    const isTransfer = isTransferStation(station);
    const size = isTransfer ? STATION_SIZE_TRANSFER : STATION_SIZE_NORMAL;
    const strokeWeight_ = isTransfer ? STATION_STROKE_TRANSFER : STATION_STROKE_NORMAL;

    // White filled circle with colored ring
    fill(255);
    stroke(route.color);
    strokeWeight(strokeWeight_);
    ellipse(station.x, station.y, size * 2);

    // White dot for transfer stations
    if (isTransfer) {
      noStroke();
      fill(255);
      ellipse(station.x, station.y, size * 0.6);
    }
  }

  pop();
}

function isTransferStation(station) {
  let count = 0;
  for (const route of routes) {
    for (const s of route.stations) {
      if (dist(station.x, station.y, s.x, s.y) < gridSize * TRANSFER_STATION_THRESHOLD) {
        count++;
        if (count > 1) return true;
      }
    }
  }
  return false;
}

function drawStationNames() {
  for (const route of routes) {
    drawRouteStationNames(route);
  }
}

function drawRouteStationNames(route) {
  push();
  textFont('sans-serif');
  textSize(10);

  for (let i = 0; i < route.stations.length; i++) {
    const station = route.stations[i];
    const angle = getStationNameAngle(station, route, i);
    const distance = 22;
    const tx = station.x + cos(angle) * distance;
    const ty = station.y + sin(angle) * distance;

    // Background
    const textW = textWidth(station.name);
    const padding = 3;
    fill(245, 243, 238, 240);
    noStroke();
    rect(tx - textW / 2 - padding, ty - 7, textW + padding * 2, 14, 2);

    // Text
    fill(route.color);
    noStroke();
    textAlign(CENTER, CENTER);
    text(station.name, tx, ty);
  }

  pop();
}

function getStationNameAngle(station, route, index) {
  if (route.name === 'Loop Line') {
    return atan2(station.y - W / 2, station.x - W / 2);
  }

  const stations = route.stations;

  if (index > 0 && index < stations.length - 1) {
    const lineAngle = atan2(
      stations[index + 1].y - stations[index - 1].y,
      stations[index + 1].x - stations[index - 1].x
    );
    return lineAngle + HALF_PI;
  } else if (index === 0) {
    const lineAngle = atan2(
      stations[1].y - station.y,
      stations[1].x - station.x
    );
    return lineAngle + HALF_PI;
  } else {
    const lineAngle = atan2(
      station.y - stations[index - 1].y,
      station.x - stations[index - 1].x
    );
    return lineAngle + HALF_PI;
  }
}

function drawLegend() {
  push();
  const legendX = W * 0.03;
  const legendY = W * 0.88;
  const lineHeight = 16;

  textFont('sans-serif');
  textSize(10);

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const y = legendY - (routes.length - 1 - i) * lineHeight;

    // Line sample
    stroke(route.color);
    strokeWeight(3.5);
    line(legendX, y, legendX + 22, y);

    // Name
    noStroke();
    fill(80);
    textAlign(LEFT, CENTER);
    text(route.name, legendX + 28, y);
  }

  pop();
}

function drawTitle() {
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
    `${routes.length} Lines • ${getTotalStations()} Stations`,
    W * 0.03,
    W * 0.05
  );
  pop();
}

function getTotalStations() {
  return routes.reduce((total, route) => total + route.stations.length, 0);
}

// ===========================
// Event Handlers
// ===========================

function mousePressed() {
  generateRoutes();
}

function keyPressed() {
  if (key === 'c') {
    saveCanvas(`mrt-network-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }

  if (key === 'r') {
    generateRoutes();
  }
}
