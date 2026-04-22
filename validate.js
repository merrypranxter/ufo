#!/usr/bin/env node
// validate.js — validate craft/ and cases/ JSON files against ufo schema
// Usage:
//   node validate.js                      → validate all craft/ and cases/ files
//   node validate.js tic_tac              → validate craft/tic_tac.json
//   node validate.js cases/nimitz_2004    → validate cases/nimitz_2004.json

const fs = require('fs');
const path = require('path');

const VALID_ERAS = ['classic', 'modern', 'sensor', 'speculative'];
const VALID_CRAFT_CLASSES = ['vehicle', 'biological', 'phenomenon', 'unknown'];
const VALID_PRIMITIVES = ['capsule','oblate_lens','sphere','equilateral_plate','rhombic_prism','radial_disc','ovoid_lozenge','spheroid_tendril','cube','chevron_plate','organic_fold_rig','torus_frustum'];
const VALID_LIGHT_BEHAVIORS = ['steady_constellation','strobe_sequence','spectral_conversation','corona_bloom','cloaking_fade','beam_drop','instant_translation','thermal_polarity_flip','radiometric_halo'];
const VALID_MOTION_TYPES = ['hover_bob','tilt_to_bank','instant_translation','falling_leaf','v_formation_drift','cloaking_fade','mirror_maneuver','vertical_exit','transmedium_entry','axial_rotation'];
const VALID_SENSOR_TYPES = ['naked_eye','film_35mm','vhs_ntsc','atflir_ir','wescam_ir','aerostat_ir','radar_only','multi_sensor'];
const VALID_SOURCE_QUALITY = ['anecdotal','photographic','multi_witness','military_radar','official_release','official_release_contested'];
const VALID_PHYSICS = ['no_wings','no_exhaust_plume','no_sonic_boom','no_rotor_downwash','no_condensation_trail','no_ir_engine_heat','no_water_ripple','no_radar_return','no_shadow','no_inertial_coupling','transmedium_capable','instant_acceleration'];

function getCraftIds() {
  const dir = path.join(__dirname, 'craft');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.json')).map(f => f.replace('.json',''));
}

function validateCraft(filePath) {
  const errors = [], warnings = [];
  let raw;
  try { raw = fs.readFileSync(filePath, 'utf8'); } catch(e) { return {ok:false,errors:[`Cannot read: ${e.message}`],warnings:[]}; }
  let f;
  try { f = JSON.parse(raw); } catch(e) { return {ok:false,errors:[`Invalid JSON: ${e.message}`],warnings:[]}; }

  const name = path.basename(filePath, '.json');
  if (!f.id) errors.push('Missing: id');
  else if (f.id !== name) errors.push(`id "${f.id}" != filename "${name}"`);
  if (!f.name) errors.push('Missing: name');
  if (!f.era) errors.push('Missing: era');
  else if (!VALID_ERAS.includes(f.era)) errors.push(`Invalid era: ${f.era}`);
  if (!f.craft_class) errors.push('Missing: craft_class');
  else if (!VALID_CRAFT_CLASSES.includes(f.craft_class)) errors.push(`Invalid craft_class: ${f.craft_class}`);
  if (!f.geometry) { errors.push('Missing: geometry'); }
  else {
    if (!VALID_PRIMITIVES.includes(f.geometry.primitive_type)) errors.push(`Invalid primitive_type: ${f.geometry.primitive_type}`);
    if (typeof f.geometry.aspect_ratio !== 'number') errors.push('geometry.aspect_ratio must be number');
    if (typeof f.geometry.length_m !== 'number') errors.push('geometry.length_m must be number');
  }
  if (!f.surface) { errors.push('Missing: surface'); }
  else {
    for (const k of ['metallic','roughness','clearcoat']) {
      if (typeof f.surface[k] !== 'number' || f.surface[k] < 0 || f.surface[k] > 1)
        errors.push(`surface.${k} must be 0–1 number`);
    }
  }
  if (!f.lights) { errors.push('Missing: lights'); }
  else {
    if (f.lights.behavior && !VALID_LIGHT_BEHAVIORS.includes(f.lights.behavior))
      errors.push(`Invalid lights.behavior: ${f.lights.behavior}`);
  }
  if (!f.motion) { errors.push('Missing: motion'); }
  else {
    if (f.motion.primary && !VALID_MOTION_TYPES.includes(f.motion.primary))
      errors.push(`Invalid motion.primary: ${f.motion.primary}`);
    if (typeof f.motion.silent !== 'boolean') errors.push('motion.silent must be boolean');
  }
  if (!f.physics_subtractions || !Array.isArray(f.physics_subtractions)) errors.push('physics_subtractions must be array');
  else f.physics_subtractions.forEach((ps,i) => { if (!VALID_PHYSICS.includes(ps)) errors.push(`physics_subtractions[${i}] invalid: ${ps}`); });
  if (!f.canonical_cases || !Array.isArray(f.canonical_cases)) errors.push('canonical_cases must be array');
  if (!f.shader_params) errors.push('Missing: shader_params');
  else if (!Array.isArray(f.shader_params.era_palette) || f.shader_params.era_palette.length !== 6)
    errors.push('shader_params.era_palette must be array of 6 hex strings');

  return {ok: errors.length === 0, errors, warnings};
}

function validateCase(filePath) {
  const errors = [], warnings = [];
  const craftIds = getCraftIds();
  let raw;
  try { raw = fs.readFileSync(filePath, 'utf8'); } catch(e) { return {ok:false,errors:[`Cannot read: ${e.message}`],warnings:[]}; }
  let f;
  try { f = JSON.parse(raw); } catch(e) { return {ok:false,errors:[`Invalid JSON: ${e.message}`],warnings:[]}; }

  const name = path.basename(filePath, '.json');
  if (!f.id) errors.push('Missing: id');
  else if (f.id !== name) errors.push(`id "${f.id}" != filename "${name}"`);
  if (!f.name) errors.push('Missing: name');
  if (!f.date) errors.push('Missing: date');
  if (!f.craft_type_ref) errors.push('Missing: craft_type_ref');
  else if (craftIds.length > 0 && !craftIds.includes(f.craft_type_ref))
    errors.push(`craft_type_ref "${f.craft_type_ref}" not found in craft/`);
  if (!f.era || !VALID_ERAS.includes(f.era)) errors.push(`Invalid era: ${f.era}`);
  if (!f.source_quality || !VALID_SOURCE_QUALITY.includes(f.source_quality))
    errors.push(`Invalid source_quality: ${f.source_quality}`);
  if (!f.sensor) errors.push('Missing: sensor');
  else if (!VALID_SENSOR_TYPES.includes(f.sensor.type)) errors.push(`Invalid sensor.type: ${f.sensor.type}`);
  if (typeof f.dimensions_reported_m !== 'number') errors.push('dimensions_reported_m must be number');
  if (typeof f.duration_s !== 'number') errors.push('duration_s must be number');
  if (!Array.isArray(f.physics_anomalies)) errors.push('physics_anomalies must be array');
  if (!f.shader_params) errors.push('Missing: shader_params');
  if (!f.visual_description) warnings.push('No visual_description');
  if (!f.cultural_significance) warnings.push('No cultural_significance');

  return {ok: errors.length === 0, errors, warnings};
}

function getFiles(arg) {
  if (!arg) {
    const craftDir = path.join(__dirname, 'craft');
    const casesDir = path.join(__dirname, 'cases');
    const craftFiles = fs.existsSync(craftDir) ? fs.readdirSync(craftDir).filter(f=>f.endsWith('.json')).map(f=>({path:path.join(craftDir,f),type:'craft'})) : [];
    const caseFiles = fs.existsSync(casesDir) ? fs.readdirSync(casesDir).filter(f=>f.endsWith('.json')).map(f=>({path:path.join(casesDir,f),type:'case'})) : [];
    return [...craftFiles, ...caseFiles];
  }
  let resolved = arg.endsWith('.json') ? arg : arg + '.json';
  if (resolved.startsWith('cases/')) {
    const p = path.join(__dirname, resolved);
    return [{path: p, type: 'case'}];
  }
  const inCraft = path.join(__dirname, 'craft', path.basename(resolved));
  if (fs.existsSync(inCraft)) return [{path: inCraft, type: 'craft'}];
  const inCases = path.join(__dirname, 'cases', path.basename(resolved));
  if (fs.existsSync(inCases)) return [{path: inCases, type: 'case'}];
  console.error(`Not found: ${arg}`);
  process.exit(1);
}

const files = getFiles(process.argv[2]);
let pass = 0, fail = 0;

for (const {path: fp, type} of files) {
  const result = type === 'craft' ? validateCraft(fp) : validateCase(fp);
  const short = (type === 'case' ? 'cases/' : 'craft/') + path.basename(fp);
  if (result.ok) {
    console.log(`✅ ${short}`);
    result.warnings.forEach(w => console.log(`   ⚠️  ${w}`));
    pass++;
  } else {
    console.log(`❌ ${short}`);
    result.errors.forEach(e => console.log(`   ERROR: ${e}`));
    result.warnings.forEach(w => console.log(`   WARN:  ${w}`));
    fail++;
  }
}

console.log(`\n${pass} passed, ${fail} failed (${files.length} total)`);
if (fail > 0) process.exit(1);
