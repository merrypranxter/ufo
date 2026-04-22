# Sensor Aesthetics — FLIR/IR Visual Language

The dominant contemporary UFO visual register. Understanding this is essential for modern UAP shader work.

---

## FLIR/IR Fundamentals

**Two polarity modes:**
- **WHT HOT**: hot objects → white. Cold objects → black. Standard human-readable.
- **BLK HOT**: hot objects → black. Cold objects → white. Inverted. The GIMBAL and FLIR1 footage uses BLK HOT — which is why the Tic Tac appears as a bright white object (it is *cold* relative to ambient in the thermal frame).

**Radiometric saturation**: when a heat source exceeds the detector's dynamic range, pixels saturate and bloom outward. Creates the characteristic white halo around jet engines — or around a UAP in WHT HOT mode.

**Fixed-pattern noise**: IR detector arrays have column-by-column sensitivity variation that creates faint vertical striping even in clean footage.

**Autotrack lock box**: when the camera's tracking system locks onto a target, a small square or crosshair appears around it. When the tracked object "accelerates" in FLIR footage, it's often the lock box jumping to a parallax-induced apparent position shift.

---

## HUD Overlay Elements

For sensor-era shader work, these elements make a simple white blob read as "military FLIR footage":

```
Top-left:     sensor mode     e.g. "FLIR" or "NAR" or "TV"
Top-center:   timestamp       e.g. "14:22:31Z"
Top-right:    polarity        e.g. "WHT HOT" or "BLK HOT"
Center:       crosshair reticle  — thin cross, 10px each arm, 1px stroke
Center:       autotrack box   — 20×20px square, dashed or solid
Bottom-left:  range           e.g. "RNG 7.4 NM"
Bottom-center: altitude       e.g. "ALT 19400"
Bottom-right: heading/speed   e.g. "HDG 276  GS 347"
```

All HUD text in `Share Tech Mono` at 10–12px, color `#6CFF00` (sensor green) or `#FFB000` (amber).

---

## ATFLIR/WESCAM Specific Quirks

**ATFLIR (AN/ASQ-228):** Used by F/A-18F Super Hornets. 640×480 MWIR focal-plane array. Image stabilization with occasional judder on high-G maneuvers. The "FLIR1" (Tic Tac) footage was shot on this. Key artifacts: column FPN, infrequent frame dropout, discrete FOV zoom steps (NAR/MED/WIDE), scan pattern at edge of frame when target is at limit.

**WESCAM MX-15D:** Used by DHS/CBP aircraft and the Chilean Navy case. Higher resolution (1280×720 IR mode), more stable, gyro-stabilized. The Aguadilla footage shows smoother tracking but thermal polarity behavior around the water entry.

**Aerostat IR:** Used in Iraq Jellyfish case. Wide FOV, stationary platform, lower fidelity. Objects appear smaller relative to frame. Long dwell time.

---

## Shader Implementation Guide

```glsl
// FLIR monochrome remap
// temp = normalized scene temperature (0=cold, 1=hot)
// polarity: 1.0 = WHT HOT, -1.0 = BLK HOT
float flir_luma = mix(0.0, 1.0, temp * polarity * 0.5 + 0.5);

// Radiometric saturation halo
float saturation_halo = exp(-dist_from_hot * 8.0) * 0.6;
flir_luma += saturation_halo;

// Fixed-pattern noise (column variation)
float fpn = (hash(floor(gl_FragCoord.x)) - 0.5) * 0.02;
flir_luma += fpn;

// Quantize to 8-bit
flir_luma = floor(flir_luma * 255.0) / 255.0;

// 1/f temporal noise
float temporal = (hash(floor(iTime * 24.0) + dot(gl_FragCoord.xy, vec2(12.9, 78.2))) - 0.5) * 0.015;
flir_luma += temporal;
```

---

## The Physics-Subtraction List

Each of these, rendered explicitly, strengthens the UAP read in sensor footage:

| Subtraction | Visual implementation |
|------------|----------------------|
| No exhaust plume | No trailing hot-pixel streak behind object |
| No sonic boom | No shockwave cone, no compression ripple |
| No IR engine heat | Object thermal signature equal to or cooler than ambient |
| No water ripple | Whitewater patch exactly under craft, perimeter undisturbed |
| No inertial coupling | Rigid-body pivot with zero radius of turn |
| No condensation trail | Clean background behind object at any altitude |
| Instant acceleration | 1-frame position jump + brief motion streak, no velocity ramp |
| Transmedium entry | Object enters water with zero splash, no surface disturbance |
