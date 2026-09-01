'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// ─── Cleaning Rules ───────────────────────────────────────────────────────────

const ASSERTION_RE = /Assertion\s*\(?A\)?:|Reason\s*\(?R\)?:|Assertion:/i;
const AR_OPTION_RE = /\(A\)\s*Both\b.*(?:assertion|reason)|\(B\)\s*Both\b.*(?:assertion|reason)/i;

const CASE_STUDY_RE =
  /^Read the following|^Based on the following|^Based on the passage|^Case Study:|^The following table|^Study the following/i;
const CASE_STUDY_BODY_RE =
  /\bRead the following\b|\bBased on the following\b|\bBased on the passage\b|\bCase Study:\b|\bThe following table\b|\bStudy the following\b/i;

const MIN_LEN = 15;

function shouldRemove(q) {
  const s = q.trim();
  if (s.length < MIN_LEN) return { remove: true, reason: 'too-short' };
  if (ASSERTION_RE.test(s) || AR_OPTION_RE.test(s))
    return { remove: true, reason: 'assertion-reason' };
  if (CASE_STUDY_RE.test(s) || CASE_STUDY_BODY_RE.test(s))
    return { remove: true, reason: 'case-study' };
  return { remove: false };
}

function normalise(q) {
  return q.trim().replace(/[?.!,;:]+$/g, '').toLowerCase();
}

function cleanArray(arr, chapterLabel, markLabel, stats) {
  const seen = new Set();
  const kept = [];
  for (const q of arr) {
    const { remove, reason } = shouldRemove(q);
    if (remove) {
      stats.removed++;
      stats.byReason[reason] = (stats.byReason[reason] || 0) + 1;
      continue;
    }
    const key = normalise(q);
    if (seen.has(key)) {
      stats.removed++;
      stats.byReason['duplicate'] = (stats.byReason['duplicate'] || 0) + 1;
      continue;
    }
    seen.add(key);
    kept.push(q);
  }
  return kept;
}

// ─── Serialiser ───────────────────────────────────────────────────────────────

function escapeStr(s) {
  // Use double quotes; escape backslash, double-quote, and control chars.
  return '"' + s
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    + '"';
}

function serializeStringArray(arr, indent) {
  if (!arr || arr.length === 0) return '[]';
  const inner = arr.map(s => indent + '  ' + escapeStr(s)).join(',\n');
  return '[\n' + inner + '\n' + indent + ']';
}

function serializeChapter(ch, indent) {
  const i2 = indent + '  ';
  const lines = [
    indent + 'title: ' + escapeStr(ch.title || ''),
    indent + 'q2m: ' + serializeStringArray(ch.q2m || [], indent),
    indent + 'q3m: ' + serializeStringArray(ch.q3m || [], indent),
    indent + 'q5m: ' + serializeStringArray(ch.q5m || [], indent),
  ];
  return '{\n' + lines.join(',\n') + '\n' + indent.slice(2) + '}';
}

/** Serialise a flat map: key => chapter-object (science / maths structure) */
function serializeFlatMap(varName, obj) {
  const entries = Object.keys(obj).map(k => {
    const keyStr = /^\d+$/.test(k) ? k : escapeStr(k);
    const val = serializeChapter(obj[k], '    ');
    return '  ' + keyStr + ': ' + val;
  });
  return 'const ' + varName + ' = {\n' + entries.join(',\n') + '\n};\n';
}

/** Serialise a nested map: section => { chapterKey => chapter } (social structure) */
function serializeNestedMap(varName, obj) {
  const sectionEntries = Object.keys(obj).map(sectionKey => {
    const section = obj[sectionKey];
    const chapterEntries = Object.keys(section).map(chKey => {
      const keyStr = /^\d+$/.test(chKey) ? chKey : escapeStr(chKey);
      const val = serializeChapter(section[chKey], '      ');
      return '    ' + keyStr + ': ' + val;
    });
    return '  ' + escapeStr(sectionKey) + ': {\n' + chapterEntries.join(',\n') + '\n  }';
  });
  return 'const ' + varName + ' = {\n' + sectionEntries.join(',\n') + '\n};\n';
}

// ─── Load file via vm sandbox ─────────────────────────────────────────────────

function loadFile(filePath, varName) {
  let src = fs.readFileSync(filePath, 'utf8');
  // `const X = {...}` doesn't attach to the sandbox; strip the `const` so
  // the assignment lands on the sandbox global object instead.
  src = src.replace(/^\s*const\s+/, '');
  const sandbox = {};
  vm.runInNewContext(src, sandbox);
  if (!(varName in sandbox)) {
    throw new Error(`Variable ${varName} not found in ${filePath}`);
  }
  return sandbox[varName];
}

// ─── Process each file ────────────────────────────────────────────────────────

/**
 * Walk the data structure, apply cleaning to every q2m/q3m/q5m array,
 * accumulate stats per chapter.
 *
 * For science/maths: { chapterNum: { title, q2m, q3m, q5m } }
 * For social: { section: { chapterKey: { title, q2m, q3m, q5m } } }
 */
function processFlat(data) {
  const globalStats = { removed: 0, byChapter: {} };
  for (const chKey of Object.keys(data)) {
    const ch = data[chKey];
    const stats = { removed: 0, byReason: {} };
    ch.q2m = cleanArray(ch.q2m || [], chKey, 'q2m', stats);
    ch.q3m = cleanArray(ch.q3m || [], chKey, 'q3m', stats);
    ch.q5m = cleanArray(ch.q5m || [], chKey, 'q5m', stats);
    if (stats.removed > 0) {
      globalStats.byChapter[chKey] = stats;
      globalStats.removed += stats.removed;
    }
  }
  return globalStats;
}

function processNested(data) {
  const globalStats = { removed: 0, byChapter: {} };
  for (const sectionKey of Object.keys(data)) {
    const section = data[sectionKey];
    for (const chKey of Object.keys(section)) {
      const ch = section[chKey];
      const label = `${sectionKey}/${chKey}`;
      const stats = { removed: 0, byReason: {} };
      ch.q2m = cleanArray(ch.q2m || [], label, 'q2m', stats);
      ch.q3m = cleanArray(ch.q3m || [], label, 'q3m', stats);
      ch.q5m = cleanArray(ch.q5m || [], label, 'q5m', stats);
      if (stats.removed > 0) {
        globalStats.byChapter[label] = stats;
        globalStats.removed += stats.removed;
      }
    }
  }
  return globalStats;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const BASE = path.resolve(__dirname, '..', 'js');

const FILES = [
  {
    file: path.join(BASE, 'science-qbank.js'),
    varName: 'SCIENCE_QBANK',
    nested: false,
    serializer: serializeFlatMap,
    processor: processFlat,
  },
  {
    file: path.join(BASE, 'maths-qbank-ch.js'),
    varName: 'MATHS_QBANK_CH',
    nested: false,
    serializer: serializeFlatMap,
    processor: processFlat,
  },
  {
    file: path.join(BASE, 'social-qbank-ch.js'),
    varName: 'SOCIAL_QBANK_CH',
    nested: true,
    serializer: serializeNestedMap,
    processor: processNested,
  },
];

let grandTotal = 0;

for (const { file, varName, nested, serializer, processor } of FILES) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Processing: ${path.basename(file)} (${varName})`);
  console.log('='.repeat(60));

  const data = loadFile(file, varName);
  const stats = processor(data);

  // Print per-chapter summary
  for (const [label, cs] of Object.entries(stats.byChapter)) {
    const reasonStr = Object.entries(cs.byReason)
      .map(([r, n]) => `${r}: ${n}`)
      .join(', ');
    console.log(`  Chapter ${label}: removed ${cs.removed}  (${reasonStr})`);
  }

  if (stats.removed === 0) {
    console.log('  (no questions removed)');
  } else {
    console.log(`  TOTAL removed from ${path.basename(file)}: ${stats.removed}`);
  }

  // Write back
  const output = serializer(varName, data);
  fs.writeFileSync(file, output, 'utf8');
  grandTotal += stats.removed;
}

console.log(`\n${'='.repeat(60)}`);
console.log(`Grand total questions removed: ${grandTotal}`);
console.log('='.repeat(60));

// ─── Verification pass ────────────────────────────────────────────────────────

console.log('\nVerification (re-loading written files):');
for (const { file, varName } of FILES) {
  try {
    const d = loadFile(file, varName);
    const keys = Object.keys(d);
    if (keys.length === 0) throw new Error('Object is empty');
    console.log(`  OK  ${path.basename(file)} — ${keys.length} top-level key(s)`);
  } catch (e) {
    console.error(`  FAIL  ${path.basename(file)}: ${e.message}`);
    process.exitCode = 1;
  }
}
