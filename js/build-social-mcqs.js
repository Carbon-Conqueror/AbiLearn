#!/usr/bin/env node
/* Build script: merges all social MCQ sources into social-mcqs-final.js (100 per chapter) */
const vm = require('vm');
const fs = require('fs');
const path = require('path');

function loadVar(filename, varName) {
  try {
    let code = fs.readFileSync(path.join(__dirname, filename), 'utf8');
    code = code.replace(/^(const|let|var)\s+/mg, '');
    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox);
    return sandbox[varName] || null;
  } catch(e) { console.warn('  Could not load', varName, 'from', filename, ':', e.message); return null; }
}

function take(arr, n) { return arr ? arr.slice(0, n) : []; }
function merge(base, extra, n) { return take([...(base||[]), ...(extra||[])], n); }
function merge3(a, b, c, n) { return take([...(a||[]), ...(b||[]), ...(c||[])], n); }

function mcqLine(m) {
  const opts = m.opts.map(o => JSON.stringify(o)).join(', ');
  return `    { q: ${JSON.stringify(m.q)}, opts: [${opts}], ans: ${m.ans}, exp: ${JSON.stringify(m.exp)} }`;
}

function chapterBlock(id, name, subject, mcqs) {
  const lines = [
    '',
    `  /* ══════════════════════════════════════`,
    `     CH ${id} — ${name} [${subject}]`,
    `  ══════════════════════════════════════ */`,
    `  ${id}: [`
  ];
  mcqs.forEach((m, i) => lines.push(mcqLine(m) + (i < mcqs.length - 1 ? ',' : '')));
  lines.push('  ]');
  return lines.join('\n');
}

// Load base files
const base = {
  ch1:  loadVar('social-ch1-ch2-ch3.js', 'SOCIAL_CH1'),
  ch2:  loadVar('social-ch1-ch2-ch3.js', 'SOCIAL_CH2'),
  ch3:  loadVar('social-ch1-ch2-ch3.js', 'SOCIAL_CH3'),
  ch4:  loadVar('social-ch4-ch7-ch8.js', 'SOCIAL_CH4'),
  ch5:  loadVar('social-mcqs.js', 'SOCIAL_CH5') || loadVar('social-mcqs.js', 'CH5_SOCIAL') || loadVar('social-mcqs.js', 'SOCIAL_CH5_MCQS'),
  ch6:  loadVar('social-mcqs.js', 'SOCIAL_CH6') || loadVar('social-mcqs.js', 'CH6_SOCIAL') || loadVar('social-mcqs.js', 'SOCIAL_CH6_MCQS'),
  ch7:  loadVar('social-ch4-ch7-ch8.js', 'SOCIAL_CH7'),
  ch8:  loadVar('social-ch4-ch7-ch8.js', 'SOCIAL_CH8'),
  ch9:  loadVar('social-ch9-ch10-mcqs.js', 'SOCIAL_CH9') || loadVar('social-ch9-ch10-mcqs.js', 'SOCIAL_CH9_MCQS') || loadVar('social-ch9-ch10-mcqs.js', 'CH9_SOCIAL'),
  ch10: loadVar('social-ch9-ch10-mcqs.js', 'SOCIAL_CH10') || loadVar('social-ch9-ch10-mcqs.js', 'SOCIAL_CH10_MCQS') || loadVar('social-ch9-ch10-mcqs.js', 'CH10_SOCIAL'),
  ch11: loadVar('social-ch11-ch12-ch13.js', 'SOCIAL_CH11'),
  ch12: loadVar('social-ch11-ch12-ch13.js', 'SOCIAL_CH12'),
  ch13: loadVar('social-ch11-ch12-ch13.js', 'SOCIAL_CH13'),
  ch18: loadVar('social-ch18-ch19-ch20.js', 'SOCIAL_CH18'),
  ch19: loadVar('social-ch18-ch19-ch20.js', 'SOCIAL_CH19'),
  ch20: loadVar('social-ch18-ch19-ch20.js', 'SOCIAL_CH20'),
  ch21: loadVar('social-ch21-ch22.js', 'SOCIAL_CH21'),
  ch22: loadVar('social-ch21-ch22.js', 'SOCIAL_CH22'),
};

// Load extra files (50 harder MCQs per chapter)
const extra = {
  ch1:  loadVar('social-ch1-ch2-ch3-extra.js', 'SOCIAL_CH1_EXTRA') || loadVar('social-ch1-ch2-ch3-extra.js', 'CH1_EXTRA'),
  ch2:  loadVar('social-ch1-ch2-ch3-extra.js', 'SOCIAL_CH2_EXTRA') || loadVar('social-ch1-ch2-ch3-extra.js', 'CH2_EXTRA'),
  ch3:  loadVar('social-ch1-ch2-ch3-extra.js', 'SOCIAL_CH3_EXTRA') || loadVar('social-ch1-ch2-ch3-extra.js', 'CH3_EXTRA'),
  ch4:  loadVar('social-ch4-ch7-ch8-extra.js', 'SOCIAL_CH4_EXTRA') || loadVar('social-ch4-ch7-ch8-extra.js', 'CH4_EXTRA'),
  ch5:  loadVar('social-ch5-ch6-ch9-ch10-extra.js', 'SOCIAL_CH5_EXTRA') || loadVar('social-ch5-ch6-ch9-ch10-extra.js', 'CH5_EXTRA'),
  ch6:  loadVar('social-ch5-ch6-ch9-ch10-extra.js', 'SOCIAL_CH6_EXTRA') || loadVar('social-ch5-ch6-ch9-ch10-extra.js', 'CH6_EXTRA'),
  ch7:  loadVar('social-ch4-ch7-ch8-extra.js', 'SOCIAL_CH7_EXTRA') || loadVar('social-ch4-ch7-ch8-extra.js', 'CH7_EXTRA'),
  ch8:  loadVar('social-ch4-ch7-ch8-extra.js', 'SOCIAL_CH8_EXTRA') || loadVar('social-ch4-ch7-ch8-extra.js', 'CH8_EXTRA'),
  ch9:  loadVar('social-ch5-ch6-ch9-ch10-extra.js', 'SOCIAL_CH9_EXTRA') || loadVar('social-ch5-ch6-ch9-ch10-extra.js', 'CH9_EXTRA'),
  ch10: loadVar('social-ch5-ch6-ch9-ch10-extra.js', 'SOCIAL_CH10_EXTRA') || loadVar('social-ch5-ch6-ch9-ch10-extra.js', 'CH10_EXTRA'),
  ch11: loadVar('social-ch11-ch12-ch13-extra.js', 'SOCIAL_CH11_EXTRA') || loadVar('social-ch11-ch12-ch13-extra.js', 'CH11_EXTRA'),
  ch12: loadVar('social-ch11-ch12-ch13-extra.js', 'SOCIAL_CH12_EXTRA') || loadVar('social-ch11-ch12-ch13-extra.js', 'CH12_EXTRA'),
  ch13: loadVar('social-ch11-ch12-ch13-extra.js', 'SOCIAL_CH13_EXTRA') || loadVar('social-ch11-ch12-ch13-extra.js', 'CH13_EXTRA'),
  // Ch14-17 are brand new (no base) — loaded from dedicated files
  ch18: loadVar('social-ch18-ch22-extra.js', 'SOCIAL_CH18_EXTRA') || loadVar('social-ch18-ch22-extra.js', 'CH18_EXTRA'),
  ch19: loadVar('social-ch18-ch22-extra.js', 'SOCIAL_CH19_EXTRA') || loadVar('social-ch18-ch22-extra.js', 'CH19_EXTRA'),
  ch20: loadVar('social-ch18-ch22-extra.js', 'SOCIAL_CH20_EXTRA') || loadVar('social-ch18-ch22-extra.js', 'CH20_EXTRA'),
  ch21: loadVar('social-ch18-ch22-extra.js', 'SOCIAL_CH21_EXTRA') || loadVar('social-ch18-ch22-extra.js', 'CH21_EXTRA'),
  ch22: loadVar('social-ch18-ch22-extra.js', 'SOCIAL_CH22_EXTRA') || loadVar('social-ch18-ch22-extra.js', 'CH22_EXTRA'),
};

// Ch14-17: load base from dedicated files, extras from social-ch14-ch17-extra.js
const ch14base = loadVar('social-ch14-ch15-ch16-ch17.js', 'SOCIAL_CH14') ||
                 loadVar('social-ch14-ch15.js', 'SOCIAL_CH14') ||
                 loadVar('social-ch14-ch15.js', 'CH14_SOCIAL');
const ch15base = loadVar('social-ch14-ch15-ch16-ch17.js', 'SOCIAL_CH15') ||
                 loadVar('social-ch14-ch15.js', 'SOCIAL_CH15') ||
                 loadVar('social-ch14-ch15.js', 'CH15_SOCIAL');
const ch16base = loadVar('social-ch14-ch15-ch16-ch17.js', 'SOCIAL_CH16') ||
                 loadVar('social-ch16-ch17.js', 'SOCIAL_CH16') ||
                 loadVar('social-ch16-ch17.js', 'CH16_SOCIAL');
const ch17base = loadVar('social-ch14-ch15-ch16-ch17.js', 'SOCIAL_CH17') ||
                 loadVar('social-ch16-ch17.js', 'SOCIAL_CH17') ||
                 loadVar('social-ch16-ch17.js', 'CH17_SOCIAL');
const ch14extra = loadVar('social-ch14-ch17-extra.js', 'SOCIAL_CH14_EXTRA') || loadVar('social-ch14-ch17-extra.js', 'CH14_EXTRA');
const ch15extra = loadVar('social-ch14-ch17-extra.js', 'SOCIAL_CH15_EXTRA') || loadVar('social-ch14-ch17-extra.js', 'CH15_EXTRA');
const ch16extra = loadVar('social-ch14-ch17-extra.js', 'SOCIAL_CH16_EXTRA') || loadVar('social-ch14-ch17-extra.js', 'CH16_EXTRA');
const ch17extra = loadVar('social-ch14-ch17-extra.js', 'SOCIAL_CH17_EXTRA') || loadVar('social-ch14-ch17-extra.js', 'CH17_EXTRA');

// Top-up MCQs to bring short chapters to 100
const topup = {
  ch2:  loadVar('social-topup.js', 'TOPUP_CH2'),
  ch3:  loadVar('social-topup.js', 'TOPUP_CH3'),
  ch6:  loadVar('social-topup.js', 'TOPUP_CH6'),
  ch9:  loadVar('social-topup.js', 'TOPUP_CH9'),
  ch10: loadVar('social-topup.js', 'TOPUP_CH10'),
  ch12: loadVar('social-topup.js', 'TOPUP_CH12'),
  ch13: loadVar('social-topup.js', 'TOPUP_CH13'),
  ch15: loadVar('social-topup.js', 'TOPUP_CH15'),
  ch19: loadVar('social-topup.js', 'TOPUP_CH19'),
  ch20: loadVar('social-topup.js', 'TOPUP_CH20'),
  ch21: loadVar('social-topup.js', 'TOPUP_CH21'),
  ch22: loadVar('social-topup.js', 'TOPUP_CH22'),
};

const chapters = [
  { id: 1,  name: 'The Rise of Nationalism in Europe',    subj: 'History',   data: merge(base.ch1,  extra.ch1,  100) },
  { id: 2,  name: 'Nationalism in India',                 subj: 'History',   data: merge3(base.ch2,  extra.ch2,  topup.ch2,  100) },
  { id: 11, name: 'The Making of a Global World',         subj: 'History',   data: merge(base.ch11, extra.ch11, 100) },
  { id: 12, name: 'The Age of Industrialisation',         subj: 'History',   data: merge3(base.ch12, extra.ch12, topup.ch12, 100) },
  { id: 13, name: 'Print Culture and the Modern World',   subj: 'History',   data: merge3(base.ch13, extra.ch13, topup.ch13, 100) },
  { id: 3,  name: 'Resources and Development',            subj: 'Geography', data: merge3(base.ch3,  extra.ch3,  topup.ch3,  100) },
  { id: 14, name: 'Forest and Wildlife Resources',        subj: 'Geography', data: merge(ch14base, ch14extra, 100) },
  { id: 15, name: 'Water Resources',                      subj: 'Geography', data: merge3(ch15base, ch15extra, topup.ch15, 100) },
  { id: 7,  name: 'Agriculture',                          subj: 'Geography', data: merge(base.ch7,  extra.ch7,  100) },
  { id: 16, name: 'Minerals and Energy Resources',        subj: 'Geography', data: merge(ch16base, ch16extra, 100) },
  { id: 8,  name: 'Manufacturing Industries',             subj: 'Geography', data: merge(base.ch8,  extra.ch8,  100) },
  { id: 17, name: 'Lifelines of National Economy',        subj: 'Geography', data: merge(ch17base, ch17extra, 100) },
  { id: 4,  name: 'Power Sharing',                        subj: 'Civics',    data: merge(base.ch4,  extra.ch4,  100) },
  { id: 18, name: 'Federalism',                           subj: 'Civics',    data: merge(base.ch18, extra.ch18, 100) },
  { id: 19, name: 'Gender, Religion and Caste',           subj: 'Civics',    data: merge3(base.ch19, extra.ch19, topup.ch19, 100) },
  { id: 9,  name: 'Political Parties',                    subj: 'Civics',    data: merge3(base.ch9,  extra.ch9,  topup.ch9,  100) },
  { id: 20, name: 'Outcomes of Democracy',                subj: 'Civics',    data: merge3(base.ch20, extra.ch20, topup.ch20, 100) },
  { id: 5,  name: 'Development',                          subj: 'Economics', data: merge(base.ch5,  extra.ch5,  100) },
  { id: 21, name: 'Sectors of the Indian Economy',        subj: 'Economics', data: merge3(base.ch21, extra.ch21, topup.ch21, 100) },
  { id: 6,  name: 'Money and Credit',                     subj: 'Economics', data: merge3(base.ch6,  extra.ch6,  topup.ch6,  100) },
  { id: 10, name: 'Globalisation and the Indian Economy', subj: 'Economics', data: merge3(base.ch10, extra.ch10, topup.ch10, 100) },
  { id: 22, name: 'Consumer Rights',                      subj: 'Economics', data: merge3(base.ch22, extra.ch22, topup.ch22, 100) },
];

// Build output
const lines = [`/* AbiLearn — Social Science MCQ Bank — ${chapters.length * 100} Questions (100 per chapter) */`, 'const SOCIAL_MCQS = {'];

let missingAny = false;
chapters.forEach((ch, idx) => {
  if (!ch.data.length) { console.warn(`⚠ Ch ${ch.id} (${ch.name}): NO DATA`); missingAny = true; }
  else console.log(`✓ Ch ${ch.id}: ${ch.data.length} MCQs`);
  lines.push(chapterBlock(ch.id, ch.name, ch.subj, ch.data) + (idx < chapters.length - 1 ? ',' : ''));
});

lines.push('};');
const output = lines.join('\n') + '\n';
fs.writeFileSync(path.join(__dirname, 'social-mcqs-final.js'), output);
console.log('\nDone! social-mcqs-final.js written.');
if (missingAny) console.warn('⚠ Some chapters have no data — run again after agents complete.');
