# 🛸 ufo

> *The craft. Not the character — the vehicle. The geometry of dread and wonder.*

This repo is a comprehensive reference data library and creative coding laboratory for **UFO/UAP craft typology** — treating every documented saucer, orb, triangle, and jellyfish as a **visual design object** with extractable geometry, shader parameters, palette, motion vocabulary, and cultural context.

## What Lives Here

| Directory | Contents |
|-----------|----------|
| `docs/` | Visual language reference, schema, era guide, sensor aesthetics |
| `craft/` | 15 craft archetype JSON files — the abstract visual types |
| `cases/` | 12 canonical sighting JSON files — real-world instances with full visual params |
| `shaders/` | GLSL fragment shaders: chrome saucer, FLIR tic-tac, black triangle, orb plasma |
| `sketches/p5js/` | p5.js sketches including the little_green_men crossover |

## The Core Design Insight

UFO visual grammar has **inverted twice**:

1. **1947–1977 (Additive)** — Chrome hardware. Rivets, fins, portholes, spinning rims, solid death-rays. More = more alien.
2. **1977–2017 (Luminescent)** — Trumbull's *Close Encounters* replaced hulls with light. The craft IS the glow.
3. **2017–now (Subtractive)** — FLIR footage. Featureless white primitive framed by sensor chrome. The strongest UAP reads come from **removing physics**, not adding detail.

## Craft Archetypes

| ID | Name | Era | Class | Canonical Case |
|----|------|-----|-------|----------------|
| `tic_tac` | Tic Tac | sensor | vehicle | nimitz_2004 |
| `classic_domed_saucer` | Classic Domed Saucer | classic | vehicle | trent_mcminnville_1950 |
| `adamski_scout` | Adamski Scout Craft | classic | vehicle | — |
| `black_triangle` | Black Triangle | modern | vehicle | belgian_wave_1989 |
| `orb_sphere` | Orb / Sphere | sensor | unknown | omaha_sphere_2019 |
| `diamond_rhombus` | Diamond / Rhombus | modern | vehicle | calvine_1990 |
| `jellyfish_uap` | Jellyfish UAP | sensor | biological? | iraq_jellyfish_2018 |
| `mothership_radial` | Mothership Radial Disc | classic | vehicle | — |
| `cigar_cylinder` | Cigar / Cylinder | classic | vehicle | — |
| `boomerang_chevron` | Boomerang / Chevron | modern | vehicle | phoenix_lights_1997 |
| `cube_box` | Cube / Box | sensor | unknown | — |
| `gimbal` | Gimbal | sensor | vehicle | gimbal_2015 |
| `monolith_shell` | Monolith Shell | modern | vehicle | — |
| `biological_organic` | Biological / Organic | sensor | biological | — |
| `plasma_portal` | Plasma Portal / Doorway | speculative | phenomenon | — |

## Cross-Repo Integration

The `saucer_dance.js` sketch is designed to cross-reference [`merrypranxter/little_green_men`](https://github.com/merrypranxter/little_green_men) — the little green man character from that repo riding inside a classic saucer from this one. Drop it into either gallery.

## Stack
- **JSON/JSONC** — data files
- **GLSL/WebGL** — shader demos
- **p5.js** — sketch animations
- **Node.js** — validator (stdlib only, no npm install)

## Part of the Ecosystem
- [`merrypranxter/little_green_men`](https://github.com/merrypranxter/little_green_men) — the alien character as art trope
- [`merrypranxter/crop_circles`](https://github.com/merrypranxter/crop_circles) — crop circle formation reference library
- [`merrypranxter/raymarching`](https://github.com/merrypranxter/raymarching) — GLSL raymarching workbench
- [`merrypranxter/merrys_visual_bible`](https://github.com/merrypranxter/merrys_visual_bible) — creative/technical reference
