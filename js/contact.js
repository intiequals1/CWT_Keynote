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
  var submitBtn=form ? form.querySelector('button[type="submit"]') : null;

  var a=0,b=0;
  function setCaptcha(){
    a=Math.floor(Math.random()*8)+1;
    b=Math.floor(Math.random()*8)+1;
    if(capQ) capQ.textContent='Sicherheitsfrage: '+a+' + '+b+' = ?';
    if(capIn) capIn.value='';
  }

  function setStatus(text){
    if(msg) msg.textContent=text || '';
  }

  function setBusy(isBusy){
    if(submitBtn){
      submitBtn.disabled=!!isBusy;
      submitBtn.textContent=isBusy ? 'Senden …' : 'Senden';
    }
  }

  function openModal(){
    setCaptcha();
    setStatus('');
    modal.classList.add('open');
  }

  function closeModal(){
    modal.classList.remove('open');
  }

  if(openBtn) openBtn.addEventListener('click',openModal);
  if(closeBtn) closeBtn.addEventListener('click',closeModal);
  modal.addEventListener('click',function(e){ if(e.target===modal) closeModal(); });
  addEventListener('keydown',function(e){ if(e.key==='Escape') closeModal(); });
  setCaptcha();

  function field(name){
    return form && form.elements[name] ? String(form.elements[name].value || '').trim() : '';
  }

  function mailtoUrl(d){
    var body=encodeURIComponent(
      'Vorname: '+d.vorname+'\n'+
      'Name: '+d.name+'\n'+
      'E-Mail: '+d.email+'\n\n'+
      d.beschreibung
    );
    var subj=encodeURIComponent('CWT Keynote — Gesprächsanfrage');
    return 'mailto:claudiu@dangulea.at?subject='+subj+'&body='+body;
  }

  function fallback(d){
    window.location.href=mailtoUrl(d);
    setStatus('Das E-Mail-Programm wird geöffnet. Falls nichts passiert, bitte direkt an claudiu@dangulea.at schreiben.');
  }

  function validate(d){
    if(form.website && form.website.value) return 'Spam-Schutz ausgelöst.'; // honeypot
    if(!d.vorname || !d.name || !d.email || !d.beschreibung) return 'Bitte alle Felder ausfüllen.';
    if(!/^\S+@\S+\.\S+$/.test(d.email)) return 'Bitte eine gültige E-Mail-Adresse eintragen.';
    if(parseInt(capIn.value,10)!==a+b) return 'Bitte die Sicherheitsfrage korrekt beantworten.';
    if(consent && !consent.checked) return 'Bitte der Verarbeitung zustimmen.';
    return '';
  }

  if(!form) return;

  form.addEventListener('submit',function(e){
    e.preventDefault();

    var d={
      vorname:field('vorname'),
      name:field('name'),
      email:field('email'),
      beschreibung:field('beschreibung')
    };

    var error=validate(d);
    if(error){ setStatus(error); return; }

    if(!ACCESS_KEY || ACCESS_KEY==='YOUR_WEB3FORMS_ACCESS_KEY'){
      fallback(d);
      return;
    }

    setBusy(true);
    setStatus('Senden …');

    var controller=new AbortController();
    var timer=setTimeout(function(){ controller.abort(); }, 12000);

    var payload=new FormData();
    payload.append('access_key', ACCESS_KEY);
    payload.append('subject', 'CWT Keynote — Gesprächsanfrage');
    payload.append('name', d.vorname+' '+d.name);
    payload.append('email', d.email);
    payload.append('message', d.beschreibung);
    payload.append('from_name', d.vorname+' '+d.name);
    payload.append('botcheck', '');

    fetch('https://api.web3forms.com/submit',{
      method:'POST',
      body:payload,
      signal:controller.signal
    })
    .then(function(r){ return r.json().catch(function(){ return {success:false,message:'Keine JSON-Antwort'}; }); })
    .then(function(j){
      if(j && j.success){
        setStatus('Danke — die Anfrage ist eingegangen.');
        form.reset();
        setCaptcha();
      } else {
        console.warn('Web3Forms failed:', j);
        fallback(d);
      }
    })
    .catch(function(err){
      console.warn('Contact submit failed:', err);
      fallback(d);
    })
    .finally(function(){
      clearTimeout(timer);
      setBusy(false);
    });
  });
})();
