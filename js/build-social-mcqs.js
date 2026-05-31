#!/usr/bin/env node
/* Build script: merges all social MCQ sources into social-mcqs-final.js (50 per chapter) */
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

// Load all source files
const src = {
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
  ch14: loadVar('social-ch14-ch15-ch16-ch17.js', 'SOCIAL_CH14'),
  ch15: loadVar('social-ch14-ch15-ch16-ch17.js', 'SOCIAL_CH15'),
  ch16: loadVar('social-ch14-ch15-ch16-ch17.js', 'SOCIAL_CH16'),
  ch17: loadVar('social-ch14-ch15-ch16-ch17.js', 'SOCIAL_CH17'),
  ch18: loadVar('social-ch18-ch19-ch20.js', 'SOCIAL_CH18'),
  ch19: loadVar('social-ch18-ch19-ch20.js', 'SOCIAL_CH19'),
  ch20: loadVar('social-ch18-ch19-ch20.js', 'SOCIAL_CH20'),
  ch21: loadVar('social-ch21-ch22.js', 'SOCIAL_CH21'),
  ch22: loadVar('social-ch21-ch22.js', 'SOCIAL_CH22'),
};

const chapters = [
  { id: 1,  name: 'The Rise of Nationalism in Europe',    subj: 'History',   data: src.ch1  },
  { id: 2,  name: 'Nationalism in India',                 subj: 'History',   data: src.ch2  },
  { id: 11, name: 'The Making of a Global World',         subj: 'History',   data: src.ch11 },
  { id: 12, name: 'The Age of Industrialisation',         subj: 'History',   data: src.ch12 },
  { id: 13, name: 'Print Culture and the Modern World',   subj: 'History',   data: src.ch13 },
  { id: 3,  name: 'Resources and Development',            subj: 'Geography', data: src.ch3  },
  { id: 14, name: 'Forest and Wildlife Resources',        subj: 'Geography', data: src.ch14 },
  { id: 15, name: 'Water Resources',                      subj: 'Geography', data: src.ch15 },
  { id: 7,  name: 'Agriculture',                          subj: 'Geography', data: src.ch7  },
  { id: 16, name: 'Minerals and Energy Resources',        subj: 'Geography', data: src.ch16 },
  { id: 8,  name: 'Manufacturing Industries',             subj: 'Geography', data: src.ch8  },
  { id: 17, name: 'Lifelines of National Economy',        subj: 'Geography', data: src.ch17 },
  { id: 4,  name: 'Power Sharing',                        subj: 'Civics',    data: src.ch4  },
  { id: 18, name: 'Federalism',                           subj: 'Civics',    data: src.ch18 },
  { id: 19, name: 'Gender, Religion and Caste',           subj: 'Civics',    data: src.ch19 },
  { id: 9,  name: 'Political Parties',                    subj: 'Civics',    data: src.ch9  },
  { id: 20, name: 'Outcomes of Democracy',                subj: 'Civics',    data: src.ch20 },
  { id: 5,  name: 'Development',                          subj: 'Economics', data: src.ch5  },
  { id: 21, name: 'Sectors of the Indian Economy',        subj: 'Economics', data: src.ch21 },
  { id: 6,  name: 'Money and Credit',                     subj: 'Economics', data: src.ch6  },
  { id: 10, name: 'Globalisation and the Indian Economy', subj: 'Economics', data: src.ch10 },
  { id: 22, name: 'Consumer Rights',                      subj: 'Economics', data: src.ch22 },
];

// Build output
const lines = [`/* AbiLearn — Social Science MCQ Bank — ${chapters.length * 50} Questions (50 per chapter) */`, 'const SOCIAL_MCQS = {'];

let missingAny = false;
chapters.forEach((ch, idx) => {
  const mcqs = take(ch.data, 50);
  if (!mcqs.length) { console.warn(`⚠ Ch ${ch.id} (${ch.name}): NO DATA`); missingAny = true; }
  else console.log(`✓ Ch ${ch.id}: ${mcqs.length} MCQs`);
  lines.push(chapterBlock(ch.id, ch.name, ch.subj, mcqs) + (idx < chapters.length - 1 ? ',' : ''));
});

lines.push('};');
const output = lines.join('\n') + '\n';
fs.writeFileSync(path.join(__dirname, 'social-mcqs-final.js'), output);
console.log('\nDone! social-mcqs-final.js written.');
if (missingAny) console.warn('⚠ Some chapters have no data — run again after agents complete.');
