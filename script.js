/* ================= LOADER ================= */
window.addEventListener('load', ()=>{
  const bar = document.querySelector('.loader-bar::after');
  gsap.to('.loader-bar', {onStart(){ document.querySelector('.loader-bar').style.setProperty('--w','100%'); }});
  gsap.to('#loader', {
    delay: .6, duration: .8, opacity:0, ease:'power2.inOut',
    onStart(){ document.querySelector('.loader-bar').style.overflow='hidden'; },
    onComplete(){ document.getElementById('loader').style.display='none'; playHero(); }
  });
});
document.styleSheets[0]; // noop
const lb = document.createElement('style');
lb.innerHTML = '.loader-bar::after{animation:loadfill 1.1s ease forwards;} @keyframes loadfill{to{width:100%;}}';
document.head.appendChild(lb);

/* ================= CURSOR ================= */
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;
window.addEventListener('mousemove', e=>{
  mx=e.clientX; my=e.clientY;
  dot.style.left=mx+'px'; dot.style.top=my+'px';
});
function ringLoop(){
  rx += (mx-rx)*0.15; ry += (my-ry)*0.15;
  ring.style.left=rx+'px'; ring.style.top=ry+'px';
  requestAnimationFrame(ringLoop);
}
ringLoop();
document.querySelectorAll('a,button,.tilt,.skill-tab').forEach(el=>{
  el.addEventListener('mouseenter', ()=>ring.classList.add('hover'));
  el.addEventListener('mouseleave', ()=>ring.classList.remove('hover'));
});

/* ================= SCROLL PROGRESS ================= */
window.addEventListener('scroll', ()=>{
  const h = document.documentElement;
  const pct = (h.scrollTop)/(h.scrollHeight-h.clientHeight)*100;
  document.getElementById('progress').style.width = pct+'%';
  document.getElementById('toTop').classList.toggle('show', h.scrollTop>600);
});
document.getElementById('toTop').addEventListener('click', e=>{e.preventDefault(); window.scrollTo({top:0,behavior:'smooth'});});

/* ================= PARTICLES ================= */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let W,H,particles=[];
function resize(){ W=canvas.width=innerWidth; H=canvas.height=innerHeight; }
resize(); window.addEventListener('resize', resize);
const COUNT = innerWidth<700?35:70;
for(let i=0;i<COUNT;i++){
  particles.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.6+0.4,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,a:Math.random()*.5+.1});
}
function drawParticles(){
  ctx.clearRect(0,0,W,H);
  particles.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0)p.x=W; if(p.x>W)p.x=0; if(p.y<0)p.y=H; if(p.y>H)p.y=0;
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle = `rgba(180,190,255,${p.a})`;
    ctx.fill();
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ================= HERO TEXT REVEAL ================= */
function playHero(){
  gsap.to('.hero h1 .line span', {y:'0%', duration:1, stagger:.12, ease:'power4.out'});
  gsap.from('.hero-kicker, .hero p.tag, .hero-actions, .hero-visual', {y:24, opacity:0, duration:.9, stagger:.12, delay:.3, ease:'power3.out'});
}

/* ================= SCROLL REVEALS ================= */
gsap.registerPlugin(ScrollTrigger);
gsap.utils.toArray('.reveal').forEach(el=>{
  gsap.to(el, {
    opacity:1, y:0, duration:.9, ease:'power3.out',
    scrollTrigger:{trigger:el, start:'top 85%'}
  });
});
gsap.utils.toArray('.service-card').forEach((el,i)=>{
  gsap.to(el, {opacity:1,y:0,duration:.7,delay:i*0.05,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%'}});
});

/* stats counter */
gsap.utils.toArray('.num').forEach(el=>{
  const target = +el.dataset.count;
  ScrollTrigger.create({
    trigger: el, start:'top 90%', once:true,
    onEnter(){ gsap.to(el,{innerText:target, duration:1.6, ease:'power2.out', snap:{innerText:1}}); }
  });
});

/* skill bars */
ScrollTrigger.batch('.bar i', {
  start:'top 90%',
  onEnter: batch => batch.forEach(el=>{ el.style.width = el.dataset.w+'%'; })
});

/* ================= SKILL FILTER ================= */
document.querySelectorAll('.skill-tab').forEach(tab=>{
  tab.addEventListener('click', ()=>{
    document.querySelectorAll('.skill-tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    const f = tab.dataset.filter;
    document.querySelectorAll('.skill-card').forEach(card=>{
      const show = f==='all' || card.dataset.cat===f;
      gsap.to(card, {opacity: show?1:0.15, scale: show?1:0.96, duration:.35});
    });
  });
});

/* ================= TILT ================= */
function addTilt(el){
  el.addEventListener('mousemove', e=>{
    const r = el.getBoundingClientRect();
    const px = (e.clientX-r.left)/r.width-0.5;
    const py = (e.clientY-r.top)/r.height-0.5;
    el.style.transform = `perspective(700px) rotateX(${py*-8}deg) rotateY(${px*8}deg) translateY(-4px)`;
  });
  el.addEventListener('mouseleave', ()=>{ el.style.transform='perspective(700px) rotateX(0) rotateY(0) translateY(0)'; });
}

/* ================= MAGNETIC BUTTONS ================= */
document.querySelectorAll('.magnetic').forEach(btn=>{
  btn.addEventListener('mousemove', e=>{
    const r = btn.getBoundingClientRect();
    const x = e.clientX-r.left-r.width/2, y = e.clientY-r.top-r.height/2;
    btn.style.transform = `translate(${x*0.25}px, ${y*0.35}px)`;
  });
  btn.addEventListener('mouseleave', ()=>{ btn.style.transform='translate(0,0)'; });
});

/* ================= MOBILE NAV ================= */
document.getElementById('navToggle').addEventListener('click', ()=>document.getElementById('mobilePanel').classList.add('open'));
document.getElementById('mobileClose').addEventListener('click', ()=>document.getElementById('mobilePanel').classList.remove('open'));
document.querySelectorAll('.mobile-panel a').forEach(a=>a.addEventListener('click', ()=>document.getElementById('mobilePanel').classList.remove('open')));

/* ================= PROJECTS INJECT ================= */
const projects = [
  {name:'Interfaith NGO', desc:'An NGO website presenting the organization\'s mission, initiatives and community work in a clear, welcoming format.', tech:['NGO Website','Responsive UI'], url:'https://interfaithngo.in'},
  {name:'NBITS', desc:'An IT company website designed to present technology services, solutions and business capabilities to prospective clients.', tech:['IT Company','Web Development'], url:'https://nbits.in'},
  {name:'Sri Tech Solution', desc:'A corporate website for a technology solutions company, with a professional presentation of services and company information.', tech:['Corporate Website','Business Solutions'], url:'https://sritechsolution.com'},
];
const grid = document.getElementById('projectsGrid');
projects.forEach((p,i)=>{
  const el = document.createElement('div');
  el.className = 'pcard glass tilt reveal';
  el.innerHTML = `
    <div class="pcard-media">
      <iframe class="pcard-frame" src="${p.url}" title="${p.name} hero section preview" loading="lazy" scrolling="no" tabindex="-1"></iframe>
    </div>
    <div class="pcard-body">
      <h4>${p.name}</h4>
      <p>${p.desc}</p>
      <div class="tech-badges">${p.tech.map(t=>`<span class="badge">${t}</span>`).join('')}</div>
      <div class="pcard-links">
        <a href="${p.url}" target="_blank" rel="noopener noreferrer">Visit Website ↗</a>
      </div>
    </div>`;
  grid.appendChild(el);
});

gsap.utils.toArray('#projectsGrid .reveal').forEach(el=>{
  gsap.to(el, {
    opacity:1, y:0, duration:.9, ease:'power3.out',
    scrollTrigger:{trigger:el, start:'top 85%'}
  });
});

/* attach tilt after DOM injection */
document.querySelectorAll('.tilt').forEach(addTilt);
