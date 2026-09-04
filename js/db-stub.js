/* AbiLearn — No database. All DB operations are no-ops. */
window.DB = {
  getProfile:           function() { return Promise.resolve(null); },
  setProfile:           function() { return Promise.resolve(); },
  getKnowledgeMap:      function() { return Promise.resolve({}); },
  saveKnowledgeEntry:   function() { return Promise.resolve(); },
  savePDFDone:          function() { return Promise.resolve(); },
  saveChapterDone:      function() { return Promise.resolve(); },
  migrateLegacyProgress:function() { return Promise.resolve(); },
  computeSubjectPct:    function() { return 0; },
  getMistakes:          function() { return Promise.resolve([]); },
  saveMistake:          function() { return Promise.resolve(); },
  resolveMistake:       function() { return Promise.resolve(); },
  getTestHistory:       function() { return Promise.resolve([]); },
  saveTestResult:       function() { return Promise.resolve(); },
};

/* Fallback helpers used by app.js */
function getChapterDone() { return false; }
function getPDFDone() { return false; }
