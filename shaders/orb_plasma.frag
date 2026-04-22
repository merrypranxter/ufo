// orb_plasma.frag
// Luminous sphere with plasma corona / fresnel glow
// Transmedium-capable: includes water surface below
// Uniforms: iTime, iResolution

precision mediump float;
uniform float iTime;
uniform vec2 iResolution;

#define ORB_WHITE vec3(0.93, 0.93, 0.91)
#define PLASMA    vec3(0.2, 0.85, 1.0)
#define WATER     vec3(0.05, 0.12, 0.18)

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x),
             mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
  float t = iTime;

  float hover = sin(t * 0.9) * 0.02;
  vec2 orbPos = vec2(0.0, 0.05 + hover);
  float orbRadius = 0.09;

  // ── Background ────────────────────────────────────────
  vec3 col = mix(vec3(0.02, 0.03, 0.04), vec3(0.06, 0.08, 0.12), uv.y + 0.5);

  // Stars
  float star = step(0.965, hash(floor(uv * 10.0)));
  col += star * 0.4 * vec3(0.8, 0.9, 1.0);

  // Water surface
  float waterLine = -0.22;
  if (uv.y < waterLine) {
    float waterDepth = (waterLine - uv.y) * 4.0;
    col = mix(WATER, vec3(0.01, 0.02, 0.03), waterDepth);
    // Caustic-like pattern
    float caustic = noise(uv * 8.0 + t * 0.3) * noise(uv * 12.0 - t * 0.2);
    col += PLASMA * caustic * 0.1 * exp(-waterDepth * 2.0);
  }

  // Water line shimmer
  float waterEdge = abs(uv.y - waterLine);
  col += PLASMA * exp(-waterEdge * 30.0) * 0.2 * (0.5 + 0.5 * sin(uv.x * 15.0 + t * 2.0));

  // ── Orb ─────────────────────────────────────────────
  float d = length(uv - orbPos);
  float orbSDF = d - orbRadius;

  // Core: solid white
  col = mix(col, ORB_WHITE, smoothstep(0.005, -0.005, orbSDF));

  // Specular hotspot
  vec2 specPos = orbPos + vec2(-0.03, 0.04);
  float specD = length(uv - specPos);
  col += vec3(1.0) * exp(-specD * 40.0) * smoothstep(0.005, -0.005, orbSDF) * 0.5;

  // Fresnel plasma corona
  float fresnel = exp(-max(0.0, d - orbRadius) * 18.0);
  float plasmaNoiseUV = noise(uv * 6.0 + t * 0.5) * 0.3;
  col += PLASMA * fresnel * (0.6 + plasmaNoiseUV);

  // Outer diffuse glow
  col += PLASMA * exp(-d * 5.0) * 0.15;
  col += ORB_WHITE * exp(-d * 3.0) * 0.08;

  // Plasma tendrils
  for (int i = 0; i < 5; i++) {
    float angle = float(i) * 1.2566 + t * 0.4;
    vec2 tendril = orbPos + vec2(cos(angle), sin(angle)) * (orbRadius * 1.5);
    float td = length(uv - tendril);
    col += PLASMA * exp(-td * 25.0) * 0.3 * (0.5 + 0.5 * sin(t * 3.0 + float(i)));
  }

  // Water entry: no splash — orb just disappears below waterline
  if (orbPos.y < waterLine + orbRadius) {
    float submerge = (waterLine - orbPos.y + orbRadius) / (orbRadius * 2.0);
    float clipY = waterLine;
    if (uv.y < clipY) {
      // Orb glow continues underwater but dimmer
      col += PLASMA * exp(-d * 12.0) * 0.08 * (1.0 - submerge);
    }
  }

  // Vignette
  col *= 1.0 - length(uv) * 0.55;
  col = clamp(col, 0.0, 1.0);

  gl_FragColor = vec4(col, 1.0);
}
