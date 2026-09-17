/* AbiLearn Content Protection */
(function () {
  'use strict';

  // Disable right-click context menu
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  });

  // Disable copy, cut, select-all via keyboard
  document.addEventListener('copy',  function (e) { e.preventDefault(); });
  document.addEventListener('cut',   function (e) { e.preventDefault(); });

  // Disable image/link drag-save
  document.addEventListener('dragstart', function (e) { e.preventDefault(); });

  // Block keyboard shortcuts
  document.addEventListener('keydown', function (e) {
    var ctrl = e.ctrlKey || e.metaKey;
    var key  = (e.key || '').toLowerCase();
    var shift = e.shiftKey;

    // Ctrl+C, Ctrl+A, Ctrl+S, Ctrl+U, Ctrl+P (print), Ctrl+Shift+I/J/C/K (DevTools)
    if (ctrl && ['c','a','s','u','p'].includes(key))          { e.preventDefault(); return; }
    if (ctrl && shift && ['i','j','c','k'].includes(key))     { e.preventDefault(); return; }
    // F12 (DevTools)
    if (e.key === 'F12')                                      { e.preventDefault(); return; }
    // PrintScreen (Windows)
    if (e.key === 'PrintScreen')                              { e.preventDefault(); return; }
  });

  // Disable text selection via JS (CSS handles the rest)
  document.addEventListener('selectstart', function (e) {
    // Allow selection inside inputs and textareas
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    e.preventDefault();
  });

  // Disable print (Ctrl+P and window.print)
  window.addEventListener('beforeprint', function (e) {
    e.stopImmediatePropagation();
  });
  var _print = window.print;
  window.print = function () {};

}());
