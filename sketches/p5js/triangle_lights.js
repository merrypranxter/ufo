// triangle_lights.js
// Phoenix Lights — V-formation of amber lights drifting across night sky
// Silent. No craft visible. Only the lights.
// Ref: phoenix_lights_1997 case, boomerang_chevron craft type

let t = 0;
let formationX = 0;
let formationY = 0;

// V-formation light positions (relative to formation center)
// Based on Phoenix Lights witness descriptions: carpenter's-square 60° V
const LIGHTS = [
  { x: 0,    y: -80 },  // apex
  { x: -60,  y: -30 },  // left inner
  { x: -120, y: 20 },   // left mid
  { x: -180, y: 70 },   // left outer
  { x: 60,   y: -30 },  // right inner
  { x: 120,  y: 20 },   // right mid
  { x: 180,  y: 70 },   // right outer
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  formationX = width * 0.7;
  formationY = height * 0.3;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0, 0, 8);
  t += 0.012;

  // Formation drifts slowly across sky (SE heading, like Phoenix Lights)
  formationX -= 0.4;
  formationY += 0.15;

  // Wrap around
  if (formationX < -width * 0.3) {
    formationX = width * 1.2;
    formationY = height * 0.1;
  }

  // Night sky
  drawNightSky();

  // Render formation
  push();
  translate(formationX, formationY);

  // Star occlusion: black hull mask (barely visible)
  // The craft reads as lights only — hull detectable by star absence
  fill(0, 0, 8, 200);
  noStroke();
  beginShape();
  // Hull silhouette (slightly larger than light positions)
  vertex(0, -110);
  vertex(-210, 90);
  vertex(210, 90);
  endShape(CLOSE);

  // The lights
  for (let i = 0; i < LIGHTS.length; i++) {
    let lx = LIGHTS[i].x;
    let ly = LIGHTS[i].y;

    // Gentle individual flicker — each light has its own phase
    let flicker = 0.85 + 0.15 * sin(t * 2.3 + i * 1.7);

    drawAmberLight(lx, ly, flicker);
  }

  pop();

  // VHS grain overlay (period-accurate 1997 camcorder aesthetic)
  drawVHSGrain();
}

function drawNightSky() {
  noStroke();
  randomSeed(42);
  for (let i = 0; i < 200; i++) {
    let sx = random(width);
    let sy = random(height);
    let brightness = 80 + random(120);
    let twinkle = 0.7 + 0.3 * sin(t * 1.5 + i * 0.9);
    fill(brightness * twinkle, brightness * twinkle, brightness * twinkle * 1.05);
    ellipse(sx, sy, random(1, 2.5));
  }
  // Light pollution glow at horizon
  for (let y = height * 0.7; y < height; y++) {
    let a = map(y, height * 0.7, height, 0, 15);
    fill(255, 140, 40, a);
    rect(0, y, width, 1);
  }
}

function drawAmberLight(x, y, intensity) {
  noStroke();
  // Outer glow (wide bloom — camcorder lens artifacts)
  fill(255, 160, 40, 20 * intensity);
  ellipse(x, y, 80, 80);
  fill(255, 170, 50, 40 * intensity);
  ellipse(x, y, 40, 40);
  fill(255, 190, 60, 80 * intensity);
  ellipse(x, y, 20, 20);
  // Core
  fill(255, 220, 100, 230 * intensity);
  ellipse(x, y, 8, 8);
  fill(255, 240, 180, 255 * intensity);
  ellipse(x, y, 4, 4);
}

function drawVHSGrain() {
  // VHS-style noise lines and chroma bleed
  for (let i = 0; i < 3; i++) {
    let gy = random(height);
    let ga = random(8, 20);
    fill(255, random(180, 255), random(100, 200), ga);
    rect(0, gy, width, random(1, 3));
  }
  // Random noise pixels
  for (let i = 0; i < 80; i++) {
    let nx = random(width);
    let ny = random(height);
    fill(random(200, 255), random(180, 255), random(100, 200), random(30, 80));
    rect(nx, ny, random(1, 4), 1);
  }
}
