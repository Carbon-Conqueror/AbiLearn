(function(){
  /* Content protection — no selection, copy, print, or right-click */
  var st = document.createElement('style');
  st.textContent =
    '*,*::before,*::after{-webkit-user-select:none!important;user-select:none!important;' +
    'hyphens:none!important;-webkit-hyphens:none!important;-ms-hyphens:none!important}' +
    'input,textarea,[contenteditable="true"]{-webkit-user-select:text!important;user-select:text!important}' +
    'html,body{width:100%;min-height:100dvh;min-height:-webkit-fill-available;overflow-x:hidden}' +
    '@media print{html{display:none!important}}';
  document.head.appendChild(st);

  /* Viewport height fix for mobile browsers (address bar shrink) */
  function setVh(){
    document.documentElement.style.setProperty('--dvh', window.innerHeight * 0.01 + 'px');
  }
  setVh();
  window.addEventListener('resize', setVh);

  document.addEventListener('contextmenu', function(e){ e.preventDefault(); });
  document.addEventListener('copy',  function(e){ e.preventDefault(); });
  document.addEventListener('cut',   function(e){ e.preventDefault(); });

  document.addEventListener('keydown', function(e){
    var k = e.key ? e.key.toLowerCase() : '';
    if(e.ctrlKey || e.metaKey){
      if(k==='c'||k==='x'||k==='a'||k==='p'||k==='s'||k==='u'||k==='i'){
        e.preventDefault(); return false;
      }
      if(e.shiftKey && (k==='i'||k==='j'||k==='c')){ e.preventDefault(); return false; }
    }
    if(e.key==='F12'){ e.preventDefault(); return false; }
  });

  /* Request fullscreen on first interaction (Android/Desktop browsers) */
  function tryFullscreen(){
    var el = document.documentElement;
    if(el.requestFullscreen){ el.requestFullscreen().catch(function(){}); }
    else if(el.webkitRequestFullscreen){ el.webkitRequestFullscreen(); }
  }
  var _fs = false;
  function onFirstGesture(){
    if(_fs) return; _fs = true;
    document.removeEventListener('touchstart', onFirstGesture, true);
    document.removeEventListener('click', onFirstGesture, true);
    tryFullscreen();
  }
  document.addEventListener('touchstart', onFirstGesture, {once:true, capture:true, passive:true});
  document.addEventListener('click', onFirstGesture, {once:true, capture:true});
})();
