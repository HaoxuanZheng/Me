document.addEventListener('DOMContentLoaded', ()=>{
  // Set year
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme handling
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const current = localStorage.getItem('theme');
  if(current) root.setAttribute('data-theme', current);

  function toggleTheme(){
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  }
  if(themeToggle) themeToggle.addEventListener('click', toggleTheme);

  // Typing effect for hero name
  const typedNameEl = document.getElementById('typed-name');
  if(typedNameEl){
    const text = typedNameEl.textContent || '';
    typedNameEl.textContent = '';
    let i = 0;
    const speed = 80;
    const timer = setInterval(()=>{
      typedNameEl.textContent += text.charAt(i);
      i++;
      if(i >= text.length){
        clearInterval(timer);
        // remove caret after a short pause
        setTimeout(()=>{
          const typingContainer = document.querySelector('.typing');
          if(typingContainer) typingContainer.classList.remove('typing');
        },600);
      }
    }, speed);
  }

  // Simple fun facts to show on Surprise
  const funFacts = [
    'I once built a tiny robot that waters plants.',
    'Favorite snack while coding: dried mango.',
    'I enjoy writing tiny tools and sharing them.',
    'I love solving small puzzles to learn new tricks.'
  ];

  // Toast helper
  const toast = document.getElementById('toast');
  function showToast(text, timeout=3500){
    if(!toast) return;
    toast.textContent = text;
    toast.hidden = false;
    toast.style.opacity = '1';
    clearTimeout(toast._t);
    toast._t = setTimeout(()=>{
      toast.style.opacity = '0';
      setTimeout(()=>{ toast.hidden = true; }, 300);
    }, timeout);
  }

  // Confetti implementation (lightweight)
  const canvas = document.getElementById('confetti-canvas');
  let confettiCtx, confettiW, confettiH, confettiParticles = [];
  if(canvas){
    confettiCtx = canvas.getContext('2d');
    function resizeCanvas(){
      confettiW = canvas.width = window.innerWidth;
      confettiH = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function makeConfetti(x, y, count=40){
      const colors = ['#ff6b6b','#f59e0b','#10b981','#60a5fa','#a78bfa'];
      for(let i=0;i<count;i++){
        confettiParticles.push({
          x: x || (confettiW/2) + (Math.random()*200-100),
          y: y || (confettiH/4),
          vx: (Math.random()-0.5)*6,
          vy: (Math.random()* -6) - 2,
          size: 6 + Math.random()*8,
          color: colors[Math.floor(Math.random()*colors.length)],
          life: 60 + Math.random()*40,
          rot: Math.random()*360,
          vr: (Math.random()-0.5)*12
        });
      }
      if(!confettiAnimating) startConfettiLoop();
    }

    let confettiAnimating = false;
    function startConfettiLoop(){
      confettiAnimating = true;
      requestAnimationFrame(confettiLoop);
    }
    function confettiLoop(){
      confettiCtx.clearRect(0,0,confettiW,confettiH);
      for(let i = confettiParticles.length-1;i>=0;i--){
        const p = confettiParticles[i];
        p.vy += 0.25; // gravity
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life -= 1;
        confettiCtx.save();
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate(p.rot * Math.PI/180);
        confettiCtx.fillStyle = p.color;
        confettiCtx.fillRect(-p.size/2, -p.size/2, p.size, p.size*0.6);
        confettiCtx.restore();
        if(p.y > confettiH + 50 || p.life <= 0) confettiParticles.splice(i,1);
      }
      if(confettiParticles.length>0){
        requestAnimationFrame(confettiLoop);
      } else {
        confettiAnimating = false;
      }
    }
  }

  // Surprise button behavior
  const surpriseBtn = document.getElementById('surprise-btn');
  if(surpriseBtn){
    surpriseBtn.addEventListener('click', ()=>{
      const fact = funFacts[Math.floor(Math.random()*funFacts.length)];
      showToast('🎉 '+fact);
      if(typeof makeConfetti === 'function'){
        // center of header
        const rect = surpriseBtn.getBoundingClientRect();
        const x = rect.left + rect.width/2;
        const y = rect.top + rect.height/2;
        makeConfetti(x, y, 50);
      }
    });
  }

  // Load blog posts from data/blog.json (unchanged)
  const postsEl = document.getElementById('posts');
  if(postsEl){
    fetch('/data/blog.json').then(r=>{
      if(!r.ok) throw new Error('Network error');
      return r.json();
    }).then(data=>{
      if(!Array.isArray(data)){
        postsEl.textContent = 'No posts found.'; return;
      }
      postsEl.innerHTML = '';
      data.slice(0,10).forEach(post=>{
        const div = document.createElement('div');
        div.className = 'post';
        const title = document.createElement('h4');
        title.textContent = post.title || 'Untitled';
        const meta = document.createElement('div');
        meta.className = 'meta';
        meta.textContent = (post.date || '') + (post.author? ' • '+post.author:'');
        const p = document.createElement('p');
        p.textContent = post.excerpt || post.summary || '';
        div.appendChild(title);
        if(meta.textContent) div.appendChild(meta);
        if(p.textContent) div.appendChild(p);
        if(post.url){
          const a = document.createElement('a');
          a.href = post.url; a.textContent = 'Read →'; a.style.marginLeft='8px';
          div.appendChild(a);
        }
        postsEl.appendChild(div);
      })
    }).catch(err=>{
      postsEl.textContent = 'Unable to load posts.';
      console.error(err);
    })
  }
});
