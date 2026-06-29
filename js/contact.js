/* ============================================================
   Cool Web Today — Keynote
   contact.js · DSGVO-konformes Kontaktformular
   - Web3Forms-Versand, mailto als Fallback
   - Mathe-Captcha, Honeypot, Einwilligung (Art. 6 Abs. 1 lit. a)
   ============================================================ */
(function(){
  var ACCESS_KEY="c5eaff61-2e46-4bd9-b6ab-46fc1404684c";

  var modal=document.getElementById('contactModal');
  if(!modal) return;
  var openBtn=document.getElementById('openContact');
  var closeBtn=document.getElementById('cmClose');
  var form=document.getElementById('contactForm');
  var msg=document.getElementById('cmMsg');
  var capQ=document.getElementById('captchaQ');
  var capIn=document.getElementById('captcha');
  var consent=document.getElementById('consent');

  var a=0,b=0;
  function setCaptcha(){
    a=Math.floor(Math.random()*8)+1; b=Math.floor(Math.random()*8)+1;
    if(capQ) capQ.textContent='Sicherheitsfrage: '+a+' + '+b+' = ?';
    if(capIn) capIn.value='';
  }
  function openModal(){ setCaptcha(); if(msg) msg.textContent=''; modal.classList.add('open'); }
  function closeModal(){ modal.classList.remove('open'); }

  if(openBtn) openBtn.addEventListener('click',openModal);
  if(closeBtn) closeBtn.addEventListener('click',closeModal);
  modal.addEventListener('click',function(e){ if(e.target===modal) closeModal(); });
  addEventListener('keydown',function(e){ if(e.key==='Escape') closeModal(); });
  setCaptcha();

  function fallback(d){
    var body=encodeURIComponent('Vorname: '+d.vorname+'\nName: '+d.name+'\nE-Mail: '+d.email+'\n\n'+d.beschreibung);
    var subj=encodeURIComponent('CWT Keynote — Gespraechsanfrage');
    window.location.href='mailto:claudiu@dangulea.at?subject='+subj+'&body='+body;
    if(msg) msg.textContent='Dein E-Mail-Programm oeffnet sich …';
  }

  form.addEventListener('submit',function(e){
    e.preventDefault();
    if(form.website && form.website.value){ return; }                 // honeypot
    if(parseInt(capIn.value,10)!==a+b){ msg.textContent='Bitte die Sicherheitsfrage korrekt beantworten.'; return; }
    if(consent && !consent.checked){ msg.textContent='Bitte der Verarbeitung zustimmen.'; return; }

    var d={ vorname:form.vorname.value, name:form.name.value, email:form.email.value, beschreibung:form.beschreibung.value };

    if(ACCESS_KEY && ACCESS_KEY!=='YOUR_WEB3FORMS_ACCESS_KEY'){
      msg.textContent='Senden …';
      fetch('https://api.web3forms.com/submit',{
        method:'POST',
        headers:{'Content-Type':'application/json',Accept:'application/json'},
        body:JSON.stringify({
          access_key:ACCESS_KEY,
          subject:'CWT Keynote — Gespraechsanfrage',
          from_name:d.vorname+' '+d.name,
          email:d.email,
          message:d.beschreibung
        })
      })
      .then(function(r){ return r.json(); })
      .then(function(j){
        if(j.success){ msg.textContent='Danke — die Anfrage ist eingegangen.'; form.reset(); setCaptcha(); }
        else{ fallback(d); }
      })
      .catch(function(){ fallback(d); });
    } else {
      fallback(d);
    }
  });
})();
