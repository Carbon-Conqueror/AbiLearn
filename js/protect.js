(function(){
  /* Content protection — no selection, copy, print, or right-click */
  var st = document.createElement('style');
  st.textContent =
    '*,*::before,*::after{-webkit-user-select:none!important;user-select:none!important;' +
    'hyphens:none!important;-webkit-hyphens:none!important;-ms-hyphens:none!important}' +
    'input,textarea,[contenteditable="true"]{-webkit-user-select:text!important;user-select:text!important}' +
    '@media print{html{display:none!important}}';
  document.head.appendChild(st);

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
})();
