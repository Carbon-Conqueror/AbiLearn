(function(){
  /* ── Protection styles ── */
  var st = document.createElement('style');
  st.textContent =
    '*,*::before,*::after{' +
      '-webkit-user-select:none!important;user-select:none!important;' +
      '-webkit-touch-callout:none!important;' +
      'hyphens:none!important;-webkit-hyphens:none!important;-ms-hyphens:none!important' +
    '}' +
    'input,textarea,[contenteditable="true"]{' +
      '-webkit-user-select:text!important;user-select:text!important' +
    '}' +
    'html,body{width:100%;min-height:100dvh;min-height:-webkit-fill-available;overflow-x:hidden}' +
    '@media print{html{display:none!important}}' +
    '#_al_ss{position:fixed;inset:0;z-index:2147483645;pointer-events:none;' +
      'backdrop-filter:blur(0px);-webkit-backdrop-filter:blur(0px);' +
      'will-change:transform;transform:translateZ(0)}';
  document.head.appendChild(st);

  /* ── Screenshot shield ── */
  function createShield(){
    if(document.getElementById('_al_ss')) return;
    var s = document.createElement('div');
    s.id = '_al_ss'; s.setAttribute('aria-hidden','true');
    document.body.appendChild(s);
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', createShield);
  } else { createShield(); }

  /* ── Viewport height var ── */
  function setVh(){ document.documentElement.style.setProperty('--dvh', window.innerHeight*0.01+'px'); }
  setVh(); window.addEventListener('resize', setVh);

  /* ── Block dev tools / copy / print ── */
  document.addEventListener('contextmenu', function(e){ e.preventDefault(); });
  document.addEventListener('copy',  function(e){ e.preventDefault(); });
  document.addEventListener('cut',   function(e){ e.preventDefault(); });
  document.addEventListener('keydown', function(e){
    var k = e.key ? e.key.toLowerCase() : '';
    if(e.key==='PrintScreen'||e.key==='F12'||e.key==='F11'){ e.preventDefault(); return false; }
    if(e.ctrlKey||e.metaKey){
      if(k==='c'||k==='x'||k==='a'||k==='p'||k==='s'||k==='u'||k==='i'){ e.preventDefault(); return false; }
      if(e.shiftKey&&(k==='i'||k==='j'||k==='c')){ e.preventDefault(); return false; }
    }
  });

  /* ── Fullscreen — silent, no overlay ── */
  function isFS(){
    return !!(document.fullscreenElement||document.webkitFullscreenElement||
              document.mozFullScreenElement||document.msFullscreenElement);
  }

  function tryFS(){
    if(isFS()) return;
    var el = document.documentElement; var p;
    try {
      if     (el.requestFullscreen)       p = el.requestFullscreen({navigationUI:'hide'});
      else if(el.webkitRequestFullscreen) p = el.webkitRequestFullscreen();
      else if(el.mozRequestFullScreen)    p = el.mozRequestFullScreen();
      else if(el.msRequestFullscreen)     p = el.msRequestFullscreen();
      if(p&&p.catch) p.catch(function(){});
    } catch(ex){}
  }

  /* Attempt silently on load (works in installed PWA / kiosk) */
  try { tryFS(); } catch(ex){}

  /* On every user gesture: silently enter/re-enter fullscreen */
  document.addEventListener('click',      tryFS, {capture:true, passive:true});
  document.addEventListener('touchstart', tryFS, {capture:true, passive:true});
  document.addEventListener('keydown', function(e){
    if((e.key==='Enter'||e.key===' ')&&!isFS()) tryFS();
  }, {capture:true, passive:true});

  /* Hide content briefly during screenshot flows */
  document.addEventListener('visibilitychange', function(){
    var shield = document.getElementById('_al_ss');
    if(shield) shield.style.background = document.hidden ? '#fff' : '';
  });

})();
