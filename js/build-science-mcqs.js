#!/usr/bin/env node
/* Build script: merges all science MCQ sources into science-mcqs.js (100 per chapter) */
const vm = require('vm');
const fs = require('fs');
const path = require('path');

function loadJS(filename, varName) {
  let code = fs.readFileSync(path.join(__dirname, filename), 'utf8');
  // Strip const/let/var so variables land on the sandbox context object
  code = code.replace(/^(const|let|var)\s+/mg, '');
  const sandbox = {};
  vm.createContext(sandbox);
  try { vm.runInContext(code, sandbox); } catch(e) { console.error('Error in', filename, e.message); }
  return sandbox[varName] || null;
}

function take(arr, n) {
  if (!arr) return [];
  return arr.slice(0, n);
}

function mcqLine(m) {
  const opts = m.opts.map(o => JSON.stringify(o)).join(', ');
  const q = JSON.stringify(m.q);
  const exp = JSON.stringify(m.exp);
  return `    { q: ${q}, opts: [${opts}], ans: ${m.ans}, exp: ${exp} }`;
}

function chapterLines(id, name, mcqs) {
  const lines = [
    '',
    `  /* ══════════════════════════════════════`,
    `     CH ${id} — ${name}`,
    `  ══════════════════════════════════════ */`,
    `  ${id}: [`
  ];
  mcqs.forEach((m, i) => {
    lines.push(mcqLine(m) + (i < mcqs.length - 1 ? ',' : ''));
  });
  lines.push('  ]');
  return lines.join('\n');
}

// Load all sources
const main       = loadJS('science-mcqs.js', 'SCIENCE_MCQS');
const extra      = loadJS('science-mcqs-extra.js', 'SCIENCE_MCQS_EXTRA');
const ch13file   = loadJS('science-mcqs-ch13-extra.js', 'CH13_MCQs');
const ch2x       = loadJS('science-mcqs-ch13-extra.js', 'CH2_EXTRA');
const ch3x       = loadJS('science-mcqs-ch13-extra.js', 'CH3_EXTRA');
const ch4x       = loadJS('science-mcqs-ch13-extra.js', 'CH4_EXTRA');
const ch7        = loadJS('science-mcqs-ch7-ch8-hard.js', 'CH7_HARD_MCQS');
const ch8        = loadJS('science-mcqs-ch7-ch8-hard.js', 'CH8_HARD_MCQS');
const ch9        = loadJS('science-ch9-ch10-mcqs.js', 'CH9_MCQs');
const ch10       = loadJS('science-ch9-ch10-mcqs.js', 'CH10_MCQs');
const ch11       = loadJS('science-ch11-ch12-hard.js', 'CH11_HARD');
const ch12       = loadJS('science-ch11-ch12-hard.js', 'CH12_HARD');

// Ch5/Ch6 extras are stored in SCIENCE_MCQS_EXTRA keys 5 and 6
const ch5Extra = extra ? extra[5] : null;
const ch6Extra = extra ? extra[6] : null;

if (!main) { console.error('Could not load main science-mcqs.js'); process.exit(1); }

// Combine per chapter to exactly 100
const chapterNames = {
  1: 'CHEMICAL REACTIONS AND EQUATIONS',
  2: 'ACIDS, BASES AND SALTS',
  3: 'METALS AND NON-METALS',
  4: 'CARBON AND ITS COMPOUNDS',
  5: 'LIFE PROCESSES',
  6: 'CONTROL AND COORDINATION',
  7: 'HOW DO ORGANISMS REPRODUCE?',
  8: 'HEREDITY AND EVOLUTION',
  9: 'LIGHT — REFLECTION AND REFRACTION',
  10: 'THE HUMAN EYE AND THE COLOURFUL WORLD',
  11: 'ELECTRICITY',
  12: 'MAGNETIC EFFECTS OF ELECTRIC CURRENT',
  13: 'OUR ENVIRONMENT'
};

function combine(id) {
  let base = main[id] || [];
  let additions = [];
  switch (id) {
    case 1: additions = take(extra ? extra[1] : [], 49); break;
    case 2: additions = [...(extra ? extra[2] : []), ...(ch2x || [])]; break;
    case 3: additions = [...(extra ? extra[3] : []), ...(ch3x || [])]; break;
    case 4: additions = [...(extra ? extra[4] : []), ...(ch4x || [])]; break;
    case 5: additions = take(ch5Extra, 50); break;
    case 6: additions = take(ch6Extra, 49); break;
    case 7: additions = take(ch7, 50); break;
    case 8: additions = take(ch8, 50); break;
    case 9: additions = take(ch9, 50); break;
    case 10: additions = take(ch10, 50); break;
    case 11: additions = take(ch11, 50); break;
    case 12: additions = take(ch12, 50); break;
    case 13: additions = take(ch13file, 50); break;
  }
  const combined = [...base, ...additions];
  const target = id === 13 ? 100 : 100;
  if (combined.length < 100) {
    console.warn(`Ch ${id}: only ${combined.length} MCQs (wanted 100)`);
  }
  return combined.slice(0, 100);
}

// Build output
let lines = ['/* AbiLearn — Science MCQ Bank — 1300 Questions (100 per chapter) */'];
lines.push('const SCIENCE_MCQS = {');

for (let id = 1; id <= 13; id++) {
  const mcqs = combine(id);
  lines.push(chapterLines(id, chapterNames[id], mcqs));
  if (id < 13) lines.push(',');
}

lines.push('};');

const output = lines.join('\n') + '\n';
fs.writeFileSync(path.join(__dirname, 'science-mcqs.js'), output);
console.log('Done. science-mcqs.js rebuilt.');

// Print summary
for (let id = 1; id <= 13; id++) {
  console.log(`Ch ${id}: ${combine(id).length} MCQs`);
}
