/* ============================================================
   Cool Web Today — Keynote
   app.js · Navigation + cineastische Scroll-Engine
   - weiches, fliessendes Scrollen (kein Snapping)
   - gepinnter Hero: Glas-Panel skaliert / wandert / rotiert,
     Tagline + Triade blenden fortlaufend ein
   - dezente Parallaxe + Reveal auf allen Inhaltsfolien
   - iOS-Safari-tauglich (Sticky + requestAnimationFrame,
     keine CSS-Scroll-Timeline)
   ============================================================ */
(function(){
  var deck=document.getElementById('deck');
  var slides=[].slice.call(document.querySelectorAll('.slide'));
  var progress=document.getElementById('progress');
  var dotsWrap=document.getElementById('dots');
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  // punkt-navigation aufbauen
  slides.forEach(function(s,i){
    var b=document.createElement('button');
    b.setAttribute('aria-label',s.dataset.label||('Folie '+(i+1)));
    b.addEventListener('click',function(){go(i);});
    dotsWrap.appendChild(b);
  });
  var dots=[].slice.call(dotsWrap.children);

  function clamp(v,a,b){return v<a?a:(v>b?b:v);}
  function norm(v,a,b){return clamp((v-a)/(b-a),0,1);}

  function go(i){ i=Math.max(0,Math.min(slides.length-1,i));
    slides[i].scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'}); }
  function current(){
    var best=0,bd=Infinity,vh=innerHeight;
    slides.forEach(function(s,i){
      var r=s.getBoundingClientRect();
      var d=Math.abs(r.top+r.height/2-vh/2);
      if(d<bd){bd=d;best=i;}
    });
    return best;
  }

  // einmaliges einblenden der .reveal-elemente pro folie
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('is-active'); } });
  },{threshold:0.15});
  slides.forEach(function(s){ io.observe(s); });

  // hero-referenzen
  var hero=document.getElementById('hero');
  var hGlass=document.getElementById('hGlass');
  var hLead=document.getElementById('hLead');
  var hTriad=document.getElementById('hTriad');
  var hMeta=document.getElementById('hMeta');
  var hCue=document.getElementById('hCue');
  var hBg=document.getElementById('heroBg');

  function frame(){
    var vh=innerHeight, best=0, bd=Infinity;

    // inhaltsfolien: aktive folie bestimmen + dezente parallaxe
    for(var i=0;i<slides.length;i++){
      var s=slides[i], r=s.getBoundingClientRect();
      var d=r.top+r.height/2-vh/2;
      if(s!==hero && Math.abs(d)<bd){ bd=Math.abs(d); best=i; }
      if(s!==hero && !reduce){
        var inner=s.querySelector('.inner');
        if(inner){ inner.style.transform='translate3d(0,'+(clamp(d/vh,-1,1)*-24)+'px,0)'; }
      }
    }

    // gepinnter hero: scroll-fortschritt 0..1 steuert die choreografie
    if(hero){
      var hr=hero.getBoundingClientRect();
      var span=hero.offsetHeight-vh;
      var hp=clamp(-hr.top/(span||1),0,1);
      if(hr.bottom>vh*0.5 && hr.top<vh*0.5){ best=0; }
      if(!reduce){
        var sc=1+hp*0.34, ty=-hp*64, tx=-1+hp*5, rot=-1.5+hp*3.5;
        hGlass.style.transform='translate3d('+tx+'%,'+ty+'px,0) scale('+sc+') rotate('+rot+'deg)';
        hGlass.style.opacity=(1-norm(hp,0.72,1)).toFixed(3);
        hLead.style.opacity=norm(hp,0.20,0.44).toFixed(3);
        hLead.style.transform='translateY('+((1-norm(hp,0.20,0.44))*18)+'px)';
        var t=norm(hp,0.48,0.70);
        hTriad.style.opacity=t.toFixed(3);
        hTriad.style.transform='translateY('+((1-t)*18)+'px)';
        hMeta.style.opacity=(t*0.9).toFixed(3);
        hCue.style.opacity=(1-norm(hp,0.05,0.2)).toFixed(3);
        hBg.style.transform='translate3d(0,'+(hp*-28)+'px,0) scale('+(1.06+hp*0.08)+')';
      }
    }

    dots.forEach(function(d,k){ d.classList.toggle('on',k===best); });
    progress.style.width=((best/(slides.length-1))*100)+'%';
  }

  // nur waehrend des scrollens rechnen (schont den akku)
  var ticking=false;
  function onScroll(){ if(!ticking){ ticking=true; requestAnimationFrame(function(){ frame(); ticking=false; }); } }
  deck.addEventListener('scroll',onScroll,{passive:true});
  addEventListener('resize',frame);
  frame();

  // tastatur + vollbild
  addEventListener('keydown',function(e){
    if(['ArrowDown','PageDown','ArrowRight'].indexOf(e.key)>-1||e.key===' '){e.preventDefault();go(current()+1);}
    else if(['ArrowUp','PageUp','ArrowLeft'].indexOf(e.key)>-1){e.preventDefault();go(current()-1);}
    else if(e.key==='Home'){e.preventDefault();go(0);}
    else if(e.key==='End'){e.preventDefault();go(slides.length-1);}
    else if(e.key==='f'||e.key==='F'){var el=document.documentElement;
      if(!document.fullscreenElement){el.requestFullscreen&&el.requestFullscreen();}
      else{document.exitFullscreen&&document.exitFullscreen();}}
  });
})();
