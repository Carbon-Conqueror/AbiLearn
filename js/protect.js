(function(){
  /* ── Content protection ── */
  var st = document.createElement('style');
  st.textContent =
    '*,*::before,*::after{-webkit-user-select:none!important;user-select:none!important;' +
    'hyphens:none!important;-webkit-hyphens:none!important;-ms-hyphens:none!important}' +
    'input,textarea,[contenteditable="true"]{-webkit-user-select:text!important;user-select:text!important}' +
    'html,body{width:100%;min-height:100dvh;min-height:-webkit-fill-available;overflow-x:hidden}' +
    '@media print{html{display:none!important}}';
  document.head.appendChild(st);

  /* Viewport height fix for mobile browsers */
  function setVh(){ document.documentElement.style.setProperty('--dvh', window.innerHeight*0.01+'px'); }
  setVh();
  window.addEventListener('resize', setVh);

  document.addEventListener('contextmenu', function(e){ e.preventDefault(); });
  document.addEventListener('copy',  function(e){ e.preventDefault(); });
  document.addEventListener('cut',   function(e){ e.preventDefault(); });
  document.addEventListener('keydown', function(e){
    var k = e.key ? e.key.toLowerCase() : '';
    if(e.ctrlKey || e.metaKey){
      if(k==='c'||k==='x'||k==='a'||k==='p'||k==='s'||k==='u'||k==='i'){ e.preventDefault(); return false; }
      if(e.shiftKey && (k==='i'||k==='j'||k==='c')){ e.preventDefault(); return false; }
    }
    if(e.key==='F12'){ e.preventDefault(); return false; }
  });

  /* ── Fullscreen: enter on every user interaction ──
   *
   * requestFullscreen() MUST be called inside a user-gesture handler.
   * We attach to the capture phase of click and touchstart so it fires
   * before any other handler — including link navigations.
   * Chrome/Firefox maintain fullscreen across same-origin page loads,
   * so once entered it stays as the user moves between pages.
   */
  function tryFS(){
    var el = document.documentElement;
    var p;
    try {
      if     (el.requestFullscreen)       p = el.requestFullscreen({navigationUI:'hide'});
      else if(el.webkitRequestFullscreen) p = el.webkitRequestFullscreen();
      else if(el.mozRequestFullScreen)    p = el.mozRequestFullScreen();
      else if(el.msRequestFullscreen)     p = el.msRequestFullscreen();
      if(p && p.catch) p.catch(function(){});
    } catch(e){}
  }

  /* Try immediately on script run (will silently fail — no gesture yet,
     but harmless; some embedded/kiosk browsers allow it) */
  try { tryFS(); } catch(e){}

  /* On every click/tap: request fullscreen in the gesture context,
     THEN the browser handles the event normally (link follows, button fires) */
  function fsOnEvent(){
    if(!document.fullscreenElement && !document.webkitFullscreenElement){ tryFS(); }
  }
  document.addEventListener('click',      fsOnEvent, {capture:true, passive:true});
  document.addEventListener('touchstart', fsOnEvent, {capture:true, passive:true});
  document.addEventListener('keydown', function(e){
    /* Enter/Space on interactive elements also counts as a gesture */
    if(e.key==='Enter'||e.key===' '){
      if(!document.fullscreenElement && !document.webkitFullscreenElement) tryFS();
    }
  }, {capture:true, passive:true});

  /* Re-enter if the user accidentally exits fullscreen (e.g. presses Escape) */
  document.addEventListener('fullscreenchange', function(){
    if(!document.fullscreenElement && !document.webkitFullscreenElement){
      /* Wait for next gesture — can't call without one */
    }
  });
})();
