// black_triangle_night.frag
// Belgian Wave black triangle: night sky, 3 amber corner lights + red center
// Star occlusion via alpha mask
// Uniforms: iTime, iResolution

precision mediump float;
uniform float iTime;
uniform vec2 iResolution;

#define AMBER vec3(1.0, 0.647, 0.169)
#define RED   vec3(0.757, 0.145, 0.176)
#define BLACK vec3(0.039, 0.039, 0.047)

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

// SDF: equilateral triangle
float sdTriangle(vec2 p, float r) {
  const float k = 1.7320508;
  p.x = abs(p.x) - r;
  p.y = p.y + r / k;
  if (p.x + k * p.y > 0.0) p = vec2(p.x - k*p.y, -k*p.x - p.y) / 2.0;
  p.x -= clamp(p.x, -2.0*r, 0.0);
  return -length(p) * sign(p.y);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
  float t = iTime;

  // Slow drift
  uv -= vec2(sin(t * 0.08) * 0.05, t * 0.015);
  float hover = sin(t * 0.6) * 0.008;
  uv.y -= hover;

  // ── Night sky ────────────────────────────────────────
  vec3 col = mix(BLACK * 0.5, BLACK * 0.2, uv.y + 0.5);

  // Stars — occluded by craft body
  vec2 starUV = uv * 12.0;
  vec2 starCell = floor(starUV);
  float starBrightness = hash(starCell);
  float starOn = step(0.94, starBrightness);
  float starTwinkle = 0.7 + 0.3 * sin(t * 3.0 + starBrightness * 20.0);

  // Triangle hull for occlusion
  float triangle = sdTriangle(uv * vec2(1.0, -1.0), 0.32);
  float hullMask = smoothstep(0.01, -0.01, triangle);

  // Stars blocked by hull
  col += vec3(starOn * starTwinkle * 0.7) * (1.0 - hullMask);

  // ── Hull silhouette (barely visible, star-occlusion does the work) ──
  col = mix(col, BLACK, hullMask * 0.95);

  // Faint underside glow (city lights reflecting off hull)
  float underbelly = hullMask * smoothstep(0.1, -0.1, uv.y) * 0.15;
  col += AMBER * underbelly * 0.2;

  // ── Corner lights ────────────────────────────────────
  // Equilateral triangle corners
  vec2 corners[3];
  corners[0] = vec2(0.0, 0.32);       // apex
  corners[1] = vec2(-0.277, -0.16);   // bottom-left
  corners[2] = vec2(0.277, -0.16);    // bottom-right

  for (int i = 0; i < 3; i++) {
    float d = length(uv - corners[i]);
    col += AMBER * exp(-d * 30.0) * 1.5;
    col += AMBER * exp(-d * 8.0) * 0.4;  // wider bloom
  }

  // ── Center pulsing red light ──────────────────────────
  float pulse = 0.5 + 0.5 * sin(t * 5.0 * 3.14159);
  float dCenter = length(uv - vec2(0.0, 0.055));
  col += RED * exp(-dCenter * 35.0) * (0.8 + pulse * 0.6);
  col += RED * exp(-dCenter * 10.0) * 0.3 * pulse;

  // ── Optional downward beams ───────────────────────────
  float beamActive = step(0.5, sin(t * 0.2));
  for (int i = 0; i < 3; i++) {
    vec2 beamOrigin = corners[i];
    float beamX = abs(uv.x - beamOrigin.x);
    float beamY = uv.y - beamOrigin.y;
    float beam = smoothstep(0.04, 0.0, beamX) * smoothstep(0.0, -0.4, beamY) * beamActive;
    col += AMBER * beam * 0.08;
  }

  // Vignette
  col *= 1.0 - length(uv) * 0.5;
  col = clamp(col, 0.0, 1.0);

  gl_FragColor = vec4(col, 1.0);
}
