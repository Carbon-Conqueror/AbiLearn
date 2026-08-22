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
    /* Screenshot shield: backdrop-filter forces GPU compositing layer;
       on Android Chrome this can cause the overlay area to appear black
       in OS-level screenshots */
    '#_al_ss{position:fixed;inset:0;z-index:2147483645;pointer-events:none;' +
      'backdrop-filter:blur(0px);-webkit-backdrop-filter:blur(0px);' +
      'will-change:transform;transform:translateZ(0)}' +
    /* Fullscreen prompt overlay */
    '#_al_fso{position:fixed;inset:0;z-index:2147483647;' +
      'background:linear-gradient(135deg,#5B47DE 0%,#7C3AED 100%);' +
      'display:flex;flex-direction:column;align-items:center;justify-content:center;' +
      'cursor:pointer;-webkit-tap-highlight-color:transparent;' +
      'font-family:"Plus Jakarta Sans",-apple-system,system-ui,sans-serif}' +
    '#_al_fso .fso-icon{font-size:3.5rem;margin-bottom:1.25rem;line-height:1}' +
    '#_al_fso .fso-title{font-size:1.4rem;font-weight:800;color:#fff;margin-bottom:.5rem;text-align:center}' +
    '#_al_fso .fso-sub{font-size:.9rem;color:rgba(255,255,255,.8);text-align:center;padding:0 2rem}' +
    '#_al_fso .fso-btn{margin-top:2rem;padding:.75rem 2.5rem;border-radius:999px;' +
      'background:#fff;color:#5B47DE;font-weight:700;font-size:1rem;border:none;cursor:pointer;' +
      'font-family:inherit;letter-spacing:.01em}';
  document.head.appendChild(st);

  /* ── Screenshot shield element ── */
  function createShield(){
    if(document.getElementById('_al_ss')) return;
    var s = document.createElement('div');
    s.id = '_al_ss';
    s.setAttribute('aria-hidden','true');
    document.body.appendChild(s);
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', createShield);
  } else { createShield(); }

  /* ── Viewport height var ── */
  function setVh(){ document.documentElement.style.setProperty('--dvh', window.innerHeight*0.01+'px'); }
  setVh(); window.addEventListener('resize', setVh);

  /* ── Block dev tools / copy / print shortcuts ── */
  document.addEventListener('contextmenu', function(e){ e.preventDefault(); });
  document.addEventListener('copy',  function(e){ e.preventDefault(); });
  document.addEventListener('cut',   function(e){ e.preventDefault(); });
  document.addEventListener('keydown', function(e){
    var k = e.key ? e.key.toLowerCase() : '';
    /* Block PrintScreen, F12, F11 (exits fullscreen) */
    if(e.key==='PrintScreen'||e.key==='F12'||e.key==='F11'){ e.preventDefault(); return false; }
    if(e.ctrlKey||e.metaKey){
      if(k==='c'||k==='x'||k==='a'||k==='p'||k==='s'||k==='u'||k==='i'){ e.preventDefault(); return false; }
      if(e.shiftKey&&(k==='i'||k==='j'||k==='c')){ e.preventDefault(); return false; }
    }
  });

  /* ── Fullscreen ── */
  var _fso = null;

  function isFS(){
    return !!(document.fullscreenElement||document.webkitFullscreenElement||
              document.mozFullScreenElement||document.msFullscreenElement);
  }

  function tryFS(){
    var el = document.documentElement; var p;
    try {
      if     (el.requestFullscreen)       p = el.requestFullscreen({navigationUI:'hide'});
      else if(el.webkitRequestFullscreen) p = el.webkitRequestFullscreen();
      else if(el.mozRequestFullScreen)    p = el.mozRequestFullScreen();
      else if(el.msRequestFullscreen)     p = el.msRequestFullscreen();
      if(p&&p.then) p.then(hideOverlay, function(){});
      if(p&&p.catch) p.catch(function(){});
    } catch(ex){}
  }

  function showOverlay(){
    if(_fso||isFS()) return;
    _fso = document.createElement('div');
    _fso.id = '_al_fso';
    _fso.setAttribute('aria-label','Enter fullscreen to continue');
    _fso.setAttribute('role','dialog');
    _fso.innerHTML =
      '<div class="fso-icon">&#x26F6;</div>' +
      '<div class="fso-title">Best viewed in Fullscreen</div>' +
      '<div class="fso-sub">Tap the button below to enter fullscreen and keep your content secure</div>' +
      '<button class="fso-btn" aria-label="Enter fullscreen">Enter Fullscreen</button>';
    function activate(e){
      if(e&&e.preventDefault) e.preventDefault();
      tryFS();
      hideOverlay();
    }
    _fso.addEventListener('click', activate);
    _fso.addEventListener('touchend', activate, {passive:false});
    document.body.appendChild(_fso);
  }

  function hideOverlay(){
    if(_fso){ try{_fso.remove();}catch(ex){} _fso=null; }
  }

  /* Try silently on script load (works in installed PWA / kiosk mode) */
  try { tryFS(); } catch(ex){}

  /* Show overlay after a short grace period if still not in fullscreen */
  setTimeout(function(){
    if(!isFS()) showOverlay();
  }, 800);

  /* Re-enter on any user gesture while not in fullscreen */
  function gestureFS(){
    if(!isFS()){ tryFS(); }
  }
  document.addEventListener('click',      gestureFS, {capture:true, passive:true});
  document.addEventListener('touchstart', gestureFS, {capture:true, passive:true});
  document.addEventListener('keydown', function(e){
    if((e.key==='Enter'||e.key===' ')&&!isFS()) tryFS();
  }, {capture:true, passive:true});

  /* Show overlay whenever fullscreen is exited */
  function onFSChange(){
    if(!isFS()) setTimeout(showOverlay, 400);
    else hideOverlay();
  }
  document.addEventListener('fullscreenchange',       onFSChange);
  document.addEventListener('webkitfullscreenchange', onFSChange);
  document.addEventListener('mozfullscreenchange',    onFSChange);
  document.addEventListener('MSFullscreenChange',     onFSChange);

  /* Hide sensitive content during screen capture flows (visibility change) */
  document.addEventListener('visibilitychange', function(){
    if(document.hidden){
      /* Page went to background — could be screenshot flow on some Android devices */
      var shield = document.getElementById('_al_ss');
      if(shield) shield.style.background='#fff';
    } else {
      var shield = document.getElementById('_al_ss');
      if(shield) shield.style.background='';
    }
  });

})();
