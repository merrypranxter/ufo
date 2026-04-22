// saucer_dance.js
// 🛸👽 CROSSOVER SKETCH: merrypranxter/ufo × merrypranxter/little_green_men
//
// The classic 50s flying saucer with the little green man visible through
// the dome — both art tropes united. He's in his saucer. He's fine.
// He's absolutely vibing.
//
// Visual refs:
//   craft type: classic_domed_saucer (ufo/craft/classic_domed_saucer.json)
//   character:  canonical alien head (little_green_men/sketches/canvas/alien_base.js)

let t = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0, 0, 10);
  t += 0.025;

  translate(width / 2, height / 2);

  // Starfield
  drawStars();

  // Saucer hover offset
  let hoverY = sin(t * 0.8) * 14;
  let hoverTilt = sin(t * 0.5) * 0.06; // slight tilt while hovering
  push();
  translate(0, hoverY);
  rotate(hoverTilt);

  // Beam (underneath saucer)
  let beamActive = sin(t * 0.25) > 0.3;
  if (beamActive) {
    drawBeam(t);
  }

  // Draw saucer
  let scale = min(width, height) / 550.0;
  drawSaucer(scale, t);

  pop();
}

function drawStars() {
  noStroke();
  randomSeed(99);
  for (let i = 0; i < 120; i++) {
    let sx = random(-width/2, width/2);
    let sy = random(-height/2, height/2);
    let brightness = 100 + sin(t * 2 + i) * 80;
    fill(brightness, brightness, brightness * 1.1);
    let sz = random(1, 2.5);
    ellipse(sx, sy, sz, sz);
  }
}

function drawBeam(t) {
  // Tractor beam — green-tinged cone
  noStroke();
  let beamAlpha = map(sin(t * 3), -1, 1, 30, 80);
  for (let i = 0; i < 6; i++) {
    let w = map(i, 0, 5, 20, 130);
    let a = map(i, 0, 5, beamAlpha, 0);
    fill(150, 240, 150, a);
    beginShape();
    vertex(-w * 0.3, 40);
    vertex(w * 0.3, 40);
    vertex(w, height * 0.45);
    vertex(-w, height * 0.45);
    endShape(CLOSE);
  }
}

function drawSaucer(sc, t) {
  push();
  scale(sc);

  let saucerW = 220;
  let saucerH = 60;

  // ── Black backing outline ──
  fill(0);
  noStroke();
  ellipse(0, 0, saucerW + 14, saucerH + 10);

  // ── Chrome hull gradient simulation ──
  // Lower half (in shadow)
  fill(60, 65, 72);
  arc(0, 0, saucerW, saucerH, 0, PI);

  // Upper half (in light)
  fill(180, 188, 200);
  arc(0, 0, saucerW, saucerH, PI, TWO_PI);

  // Specular highlight stripe across upper
  fill(220, 225, 232, 180);
  ellipse(-30, -saucerH * 0.28, 90, 12);

  // ── Rotating rim lights ──
  let numLights = 24;
  for (let i = 0; i < numLights; i++) {
    let angle = (i / numLights) * TWO_PI + t * 1.2;
    let lx = cos(angle) * (saucerW * 0.44);
    let ly = sin(angle) * (saucerH * 0.35) * 0.4;

    // Only show lights on the front hemisphere (above y=0 in saucer space)
    if (sin(angle) < 0.1) {
      let pulsed = (i % 3 === 0) ? (sin(t * 4 + i * 0.8) > 0 ? 1.0 : 0.4) : 0.7;
      noStroke();
      // Glow
      fill(255, 220, 80, 60 * pulsed);
      ellipse(lx, ly, 16, 16);
      // Core
      fill(255, 226, 100, 220 * pulsed);
      ellipse(lx, ly, 6, 6);
    }
  }

  // ── Dome ──
  fill(0);
  noStroke();
  ellipse(0, -saucerH * 0.4, 85, 68); // black backing

  // Dome chrome
  fill(160, 170, 182);
  ellipse(0, -saucerH * 0.4, 76, 60);

  // Dome window (transparent-ish blue)
  fill(80, 140, 200, 160);
  ellipse(0, -saucerH * 0.42, 62, 48);

  // Dome glass reflection
  fill(200, 220, 255, 100);
  ellipse(-10, -saucerH * 0.52, 28, 14);

  // ── Little green man in dome ──────────────────────────
  // He's visible through the dome glass
  // This is the crossover moment
  push();
  translate(0, -saucerH * 0.43);
  drawAlienInDome(t);
  pop();

  pop();
}

function drawAlienInDome(t) {
  // Canonical little green man head, scaled to fit dome
  // Colors from merrypranxter/little_green_men visual spec
  let GREEN = color(57, 255, 20);
  let BLACK = color(0, 0, 0);

  // Slight head bob and look-around
  let headTilt = sin(t * 0.7) * 0.15;
  let headBob = sin(t * 1.4) * 2;

  push();
  translate(0, headBob);
  rotate(headTilt);

  let hw = 26; // head width
  let hh = 32; // head height

  // Head black outline
  fill(BLACK);
  noStroke();
  ellipse(0, 0, hw + 5, hh + 5);

  // Head green fill
  fill(GREEN);
  ellipse(0, 0, hw, hh);

  // Left eye
  push();
  translate(-hw * 0.28, -hh * 0.06);
  rotate(-0.35);
  fill(BLACK);
  ellipse(0, 0, hw * 0.45, hh * 0.22);
  // Eye shine — he sees you
  fill(255, 255, 255, 120);
  ellipse(-2, -2, 4, 4);
  pop();

  // Right eye
  push();
  translate(hw * 0.28, -hh * 0.06);
  rotate(0.35);
  fill(BLACK);
  ellipse(0, 0, hw * 0.45, hh * 0.22);
  fill(255, 255, 255, 120);
  ellipse(-2, -2, 4, 4);
  pop();

  // Smirk — he knows something
  stroke(BLACK);
  strokeWeight(2);
  noFill();
  arc(2, hh * 0.22, 12, 7, 0.1, PI - 0.1);

  pop();
}
