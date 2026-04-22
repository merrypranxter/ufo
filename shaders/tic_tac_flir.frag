// tic_tac_flir.frag
// Tic Tac in ATFLIR black-hot IR simulation
// Includes: HUD overlay, fixed-pattern noise, radiometric halo, telemetry text
// Uniforms: iTime, iResolution

precision mediump float;
uniform float iTime;
uniform vec2 iResolution;

float hash(float n) { return fract(sin(n) * 43758.5453); }
float hash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

// SDF: capsule
float sdCapsule(vec2 p, float r, float h) {
  p.y = abs(p.y) - h;
  return length(vec2(p.x, max(p.y, 0.0))) - r;
}

// Simple 7-segment digit approximation via boxes
float digit(vec2 p, float scale) {
  p /= scale;
  float d = 1e5;
  // Just render a rectangle for "telemetry block" aesthetic
  d = min(d, length(max(abs(p) - vec2(0.4, 0.7), 0.0)));
  return d;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
  float t = iTime;

  // ── FLIR background noise ──────────────────────────────
  // Fixed-pattern column noise
  float fpn = (hash(floor(gl_FragCoord.x)) - 0.5) * 0.025;
  // 1/f temporal noise
  float temporal = (hash2(gl_FragCoord.xy + floor(t * 24.0)) - 0.5) * 0.018;
  float bg = 0.12 + fpn + temporal;

  // Quantize to 8-bit
  bg = floor(bg * 255.0) / 255.0;

  // ── Tic Tac object (BLK HOT: object is COLD → appears light) ──
  float hover = sin(t * 0.7) * 0.018;
  vec2 craftPos = vec2(0.0, hover);
  float craft = sdCapsule(uv - craftPos, 0.055, 0.08);

  // Object thermal: slightly cooler than ambient → appears lighter in BLK HOT
  float craftTemp = 0.75 + sin(t * 0.3) * 0.02;

  // Radiometric halo (where sensor saturates near cool object)
  float haloRadius = 0.13;
  float halo = exp(-max(0.0, length(uv - craftPos) - 0.065) * 12.0);
  float haloBrightness = 0.6;

  float luma = bg;
  luma = mix(luma, craftTemp, smoothstep(0.004, -0.004, craft));
  luma += halo * haloBrightness * 0.4;
  luma = clamp(luma, 0.0, 1.0);

  // ── Motion blur streak when craft moves fast ──
  float speed = abs(cos(t * 0.7)) * 0.08;
  for (int i = 1; i < 5; i++) {
    vec2 trailPos = craftPos - vec2(0.0, float(i) * speed * 0.01);
    float trailCraft = sdCapsule(uv - trailPos, 0.055, 0.08);
    luma += smoothstep(0.004, -0.004, trailCraft) * (0.3 - float(i) * 0.06) * speed * 8.0;
  }

  vec3 col = vec3(luma);

  // ── HUD overlay ──────────────────────────────────────
  vec2 px = gl_FragCoord.xy;
  vec2 res = iResolution.xy;
  float hud = 0.0;

  // Crosshair center
  float cx = abs(px.x - res.x * 0.5);
  float cy = abs(px.y - res.y * 0.5);
  if (cx < 1.0 && cy < 15.0) hud = 1.0;
  if (cy < 1.0 && cx < 15.0) hud = 1.0;
  if (cx < 8.0 && cx > 5.0 && cy < 1.0) hud = 0.0; // gap in crosshair

  // Autotrack box around craft
  vec2 boxCenter = (craftPos * iResolution.yy + iResolution.xy * 0.5);
  vec2 boxSize = vec2(30.0, 22.0);
  vec2 boxDist = abs(px - boxCenter) - boxSize;
  if (max(boxDist.x, boxDist.y) < 1.5 && max(boxDist.x, boxDist.y) > -1.5) hud = 0.8;

  // HUD green tint
  col = mix(col, vec3(0.0, 0.85, 0.1), hud * 0.9);

  // Mode text region (just a glow strip, actual text would need texture)
  float topBar = smoothstep(res.y - 18.0, res.y - 12.0, px.y);
  col = mix(col, col + vec3(0.0, 0.1, 0.0), topBar * 0.3);
  float bottomBar = smoothstep(18.0, 12.0, px.y);
  col = mix(col, col + vec3(0.0, 0.05, 0.0), bottomBar * 0.3);

  // Whitewater patch (churning water below craft)
  vec2 waterPos = vec2(0.0, -0.28);
  float waterDist = length(uv - waterPos);
  float water = exp(-waterDist * 12.0) * 0.25;
  water *= 0.5 + 0.5 * sin(t * 8.0 + uv.x * 20.0) * sin(t * 6.0 + uv.y * 20.0);
  col += vec3(water * 0.8);

  // Vignette
  col *= 0.9 + (1.0 - length(uv) * 1.2) * 0.1;
  col = clamp(col, 0.0, 1.0);

  gl_FragColor = vec4(col, 1.0);
}
