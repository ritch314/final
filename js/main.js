/* ==================================================================
   MAIN SITE LOGIC
   Reads personalization data from config.js (loaded before this file
   in index.html). You shouldn't need to edit this file to personalize
   the site — see config.js instead.
   ================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const displayHerName = siteConfig.herNickname || siteConfig.herName || "you";

  document.getElementById('greetName').textContent = displayHerName;
  document.getElementById('meLoc').textContent = siteConfig.myLocation || "Me";
  document.getElementById('herLocLabel').textContent = siteConfig.herLocation || "You";
  document.getElementById('meLoc2').textContent = siteConfig.myLocation || "Me";
  document.getElementById('herLoc2').textContent = siteConfig.herLocation || "You";
  document.getElementById('herNameInline1').textContent = displayHerName;
  document.getElementById('signatureLine').textContent = `— from ${siteConfig.signature}`;
  document.title = `for ${displayHerName}, from far away`;

  /* ---------------- LOADER SEQUENCE ---------------- */
  const loaderLines = document.getElementById('loaderLines');
  const loaderBar = document.getElementById('loaderBar');
  const loaderPct = document.getElementById('loaderPct');
  const loaderGreet = document.getElementById('loaderGreet');
  const steps = ["Initializing something special...", "Loading memories...", "Loading courage...", "Loading feelings...", "Compiling confession..."];
  let i = 0;
  const printedLines = [];

  function runLoader(){
    if(i < steps.length){
      printedLines.push(steps[i]);
      loaderLines.innerHTML = printedLines.map((l,idx)=> idx < printedLines.length-1 ? `<div class="done">✓ ${l}</div>` : `<div>${l}</div>`).join('');
      const pct = Math.round(((i+1)/steps.length)*100);
      loaderBar.style.width = pct + '%';
      loaderPct.textContent = pct + '%';
      i++;
      setTimeout(runLoader, prefersReduced ? 60 : 480);
    } else {
      loaderLines.innerHTML = printedLines.map(l=>`<div class="done">✓ ${l}</div>`).join('') + `<div class="done">✓ Ready.</div>`;
      setTimeout(()=>{ loaderGreet.classList.add('show'); }, prefersReduced ? 60 : 500);
    }
  }
  runLoader();

  document.getElementById('openSiteBtn').addEventListener('click', () => {
    document.getElementById('loader').classList.add('hidden');
    document.getElementById('site').style.display = 'block';
    initSite();
    setTimeout(()=>{ document.getElementById('loader').remove(); }, 800);
  });

  /* ---------------- SITE INIT (runs once opened) ---------------- */
  function initSite(){
    buildTraits();
    buildTimeline();
    buildPromises();
    buildGallery();
    setupScrollReveal();
    setupTerminal();
    setupGame();
    setupConfession();
    setupQuestion();
    setupLightbox();
    setupMusic();
    setupProgressRail();
    restoreSavedAnswer();
    if(!prefersReduced) setupParticles();
  }

  function buildTraits(){
    const grid = document.getElementById('traitsGrid');
    grid.innerHTML = traits.map(t => `
      <div class="card trait-card reveal">
        <div class="trait-icon">${t.icon}</div>
        <h3>${t.title}</h3>
        <p>${t.text}</p>
      </div>`).join('');
  }

  function buildTimeline(){
    const list = document.getElementById('timelineList');
    list.innerHTML = timeline.map(item => `
      <div class="tl-item reveal">
        <div class="tl-dot"></div>
        <div class="tl-day">${item.day}</div>
        <div class="tl-text">${item.text}</div>
      </div>`).join('');
  }

  function buildPromises(){
    const grid = document.getElementById('promisesGrid');
    grid.innerHTML = promises.map(p => `
      <div class="card promise-card reveal">
        <span class="promise-check">✓</span>
        <div><h3 style="font-size:1.05rem; margin-bottom:.35rem;">${p.title}</h3><p style="color:var(--ink-dim); font-size:.92rem; font-weight:300; margin:0;">${p.text}</p></div>
      </div>`).join('');
  }

  const gradients = [
    'linear-gradient(135deg,#3a2a52,#5c3a5e)',
    'linear-gradient(135deg,#2a3552,#3a5c58)',
    'linear-gradient(135deg,#52362a,#5e3a4e)',
    'linear-gradient(135deg,#2a4552,#4a3a5c)'
  ];
  function buildGallery(){
    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = gallery.map((g, idx) => `
      <figure class="gallery-item reveal" data-idx="${idx}" tabindex="0" role="button" aria-label="Open memory: ${g.caption}">
        ${g.img ? `<img src="${g.img}" alt="${g.caption}">` : `<div class="ph" style="background:${gradients[idx % gradients.length]}">${g.caption}</div>`}
        <figcaption>${g.caption}</figcaption>
      </figure>`).join('');
    grid.querySelectorAll('.gallery-item').forEach(el=>{
      const open = () => openLightbox(gallery[el.dataset.idx]);
      el.addEventListener('click', open);
      el.addEventListener('keypress', e=>{ if(e.key==='Enter') open(); });
    });
  }

  function openLightbox(item){
    const idx = gallery.indexOf(item);
    const inner = document.getElementById('lightboxInner');
    inner.innerHTML = `${item.img ? `<img src="${item.img}" alt="${item.caption}" style="border-radius:16px; margin-bottom:1rem;">` : `<div class="ph" style="background:${gradients[idx % gradients.length]}; border-radius:16px; aspect-ratio:4/3; display:flex; align-items:center; justify-content:center; font-family:var(--font-mono); color:rgba(255,255,255,0.55); margin-bottom:1rem;">${item.caption}</div>`}<p style="color:var(--ink-dim);">${item.caption}</p>`;
    document.getElementById('lightbox').classList.add('open');
  }
  function setupLightbox(){
    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    document.getElementById('lightbox').addEventListener('click', e=>{ if(e.target.id==='lightbox') closeLightbox(); });
    document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeLightbox(); });
  }
  function closeLightbox(){ document.getElementById('lightbox').classList.remove('open'); }

  function setupScrollReveal(){
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('is-in'); obs.unobserve(e.target); } });
    }, { threshold:0.15 });
    els.forEach(el=>obs.observe(el));
  }

  function setupTerminal(){
    const out = document.getElementById('termOut1');
    const codeHTML = [
      '<span class="tok-kw">class</span> <span class="tok-fn">Feelings</span> {',
      '',
      '  <span class="tok-kw">constructor</span>() {',
      '    <span class="tok-punc">this</span>.person = <span class="tok-str">"You"</span>;',
      '    <span class="tok-punc">this</span>.distance = <span class="tok-str">"Far"</span>;',
      '    <span class="tok-punc">this</span>.intentions = <span class="tok-str">"Genuine"</span>;',
      '  }',
      '',
      '  getStatus() {',
      '    <span class="tok-kw">return</span> <span class="tok-str">"I really like you."</span>;',
      '  }',
      '',
      '  nextStep() {',
      '    <span class="tok-kw">return</span> <span class="tok-str">"Get to know you better."</span>;',
      '  }',
      '}',
      '',
      '<span class="tok-kw">const</span> feelings = <span class="tok-kw">new</span> <span class="tok-fn">Feelings</span>();',
      'console.<span class="tok-fn">log</span>(feelings.getStatus());',
      '',
      '<span class="tok-com">// → I really like you.</span>',
      '<span class="tok-com">// Compilation successful. ❤</span>'
    ];
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          obs.disconnect();
          typeTerminal(out, codeHTML, () => {
            document.getElementById('afterCompile').hidden = false;
            document.getElementById('afterCompile').classList.add('is-in');
          });
        }
      });
    }, { threshold:0.3 });
    obs.observe(document.getElementById('sec-code'));
  }

  function typeTerminal(el, lines, done){
    if(prefersReduced){ el.innerHTML = lines.join('\n'); if(done) done(); return; }
    let li = 0, buf = '';
    el.innerHTML = '<span class="cursor-blink">&nbsp;</span>';
    function step(){
      if(li >= lines.length){ el.innerHTML = lines.join('\n'); if(done) done(); return; }
      const line = lines[li];
      buf += (li>0?'\n':'') + line;
      el.innerHTML = buf + '<span class="cursor-blink">&nbsp;</span>';
      li++;
      setTimeout(step, 90);
    }
    step();
  }

  function setupGame(){
    const area = document.getElementById('gameArea');
    const result = document.getElementById('gameResult');
    const count = 14;
    const foundIdx = Math.floor(Math.random()*count);
    for(let n=0;n<count;n++){
      const btn = document.createElement('button');
      btn.className = 'hidden-heart';
      btn.setAttribute('aria-label', n===foundIdx ? 'A heart, maybe the one you are looking for' : 'A faint heart');
      btn.textContent = '♡';
      btn.style.left = (6 + Math.random()*86) + '%';
      btn.style.top = (10 + Math.random()*76) + '%';
      if(n === foundIdx) btn.dataset.target = 'true';
      btn.addEventListener('click', () => {
        if(btn.dataset.target === 'true'){
          btn.classList.add('found');
          btn.textContent = '❤';
          result.textContent = 'You found it! ❤';
          setTimeout(()=>{
            result.textContent = "Maybe finding this was easy. Figuring out how much I like you wasn't.";
          }, 1200);
        } else {
          btn.style.transform = 'scale(0.8)';
          setTimeout(()=>{ btn.style.transform=''; }, 200);
        }
      });
      area.appendChild(btn);
    }
  }

  function setupConfession(){
    const lines = document.querySelectorAll('.confession-line');
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          obs.unobserve(e.target);
          const idx = Array.from(lines).indexOf(e.target);
          setTimeout(()=> e.target.classList.add('is-in'), prefersReduced ? 0 : idx*260);
        }
      });
    }, { threshold:0.4 });
    lines.forEach(l=>obs.observe(l));
  }

  function setupQuestion(){
    document.getElementById('btnYes').addEventListener('click', () => showScreen('yes', true));
    document.getElementById('btnThink').addEventListener('click', () => showScreen('think', true));
    document.getElementById('btnGoBack').addEventListener('click', () => showScreen('question', false));
  }

  function showScreen(name, save){
    document.querySelectorAll('#sec-question .screen').forEach(s=>s.classList.remove('active'));
    document.getElementById('screen-'+name).classList.add('active');
    if(save && siteConfig.rememberAnswerLocally){
      try{ localStorage.setItem('courtship_answer', name); }catch(e){ /* storage unavailable — fine, just won't persist */ }
    }
    if(save) notifyAnswer(name);
    if(name === 'yes' && !prefersReduced) launchConfetti();
  }

  /* Emails you the moment she answers, via Formspree.
     Configure siteConfig.formspreeFormId in config.js to enable this. */
  function notifyAnswer(name){
    if(!siteConfig.notifyOnAnswer || !siteConfig.formspreeFormId) return;
    const label = name === 'yes' ? 'YES' : 'Let me think';
    fetch(`https://formspree.io/f/${siteConfig.formspreeFormId}`, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `${siteConfig.herName} answered: ${label}`,
        answer: name,
        timestamp: new Date().toISOString()
      })
    }).catch(err => console.error('Notification failed:', err));
  }

  function restoreSavedAnswer(){
    if(!siteConfig.rememberAnswerLocally) return;
    try{
      const saved = localStorage.getItem('courtship_answer');
      if(saved === 'yes' || saved === 'think') showScreen(saved, false);
    }catch(e){ /* ignore */ }
  }

  function launchConfetti(){
    const colors = ['#ff8fb3','#a48bfb','#62d6c4','#ffffff'];
    for(let n=0;n<48;n++){
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      const size = 5 + Math.random()*6;
      p.style.width = size+'px'; p.style.height = size+'px';
      p.style.left = Math.random()*100+'vw';
      p.style.background = colors[Math.floor(Math.random()*colors.length)];
      p.style.opacity = 0.85;
      document.body.appendChild(p);
      const duration = 2200 + Math.random()*1400;
      p.animate([
        { transform:`translateY(0) rotate(0deg)`, opacity:0.9 },
        { transform:`translateY(${window.innerHeight+40}px) rotate(${360+Math.random()*360}deg)`, opacity:0.2 }
      ], { duration, easing:'cubic-bezier(.2,.6,.4,1)' }).onfinish = () => p.remove();
    }
  }

  function setupMusic(){
    const btn = document.getElementById('musicBtn');
    const label = document.getElementById('musicLabel');
    const audio = document.getElementById('bgMusic');
    if(!siteConfig.musicFile){
      btn.disabled = true;
      label.textContent = 'Music: n/a';
      btn.style.opacity = '0.5';
      return;
    }
    audio.src = siteConfig.musicFile;
    let on = false;
    btn.addEventListener('click', () => {
      on = !on;
      btn.setAttribute('aria-pressed', String(on));
      label.textContent = 'Music: ' + (on ? 'ON' : 'OFF');
      if(on){ audio.play().catch(()=>{ /* playback needs a user gesture — this click provides it */ }); }
      else { audio.pause(); }
    });
  }

  function setupProgressRail(){
    const rail = document.getElementById('progressRail');
    const sections = ['sec-hero','sec-why','sec-traits','sec-timeline','sec-code','sec-distance','sec-promises','sec-gallery','sec-game','sec-confession','sec-question','sec-final'];
    sections.forEach(id => { const d = document.createElement('div'); d.dataset.id = id; rail.appendChild(d); });
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        const dot = rail.querySelector(`div[data-id="${e.target.id}"]`);
        if(dot) dot.classList.toggle('active', e.isIntersecting);
      });
    }, { threshold:0.5 });
    sections.forEach(id => { const el = document.getElementById(id); if(el) obs.observe(el); });
  }

  function setupParticles(){
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let w,h,particles;
    function resize(){
      w = canvas.width = window.innerWidth;
      h = canvas.height = document.documentElement.scrollHeight;
    }
    function initParticles(){
      const count = Math.min(46, Math.floor(window.innerWidth/28));
      particles = Array.from({length:count}, () => ({
        x: Math.random()*w, y: Math.random()*h,
        r: 1 + Math.random()*2,
        vy: 0.12 + Math.random()*0.22,
        vx: (Math.random()-0.5)*0.08,
        hue: Math.random() > 0.6 ? 'rose' : (Math.random()>0.5 ? 'violet' : 'signal'),
        o: 0.15 + Math.random()*0.35
      }));
    }
    const colorMap = { rose:'255,143,179', violet:'164,139,251', signal:'98,214,196' };
    function draw(){
      ctx.clearRect(0,0,w,h);
      particles.forEach(p=>{
        ctx.beginPath();
        ctx.fillStyle = `rgba(${colorMap[p.hue]},${p.o})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fill();
        p.y -= p.vy; p.x += p.vx;
        if(p.y < -10){ p.y = h+10; p.x = Math.random()*w; }
      });
      requestAnimationFrame(draw);
    }
    resize(); initParticles(); draw();
    window.addEventListener('resize', () => { resize(); });
  }
});