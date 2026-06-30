// ---- injects shared header, footer, chat widget ----
function renderChrome(activePage){
  const nav = `
  <header>
    <nav class="wrap">
      <a href="index.html" class="logo">YOGESHWAR GROUP<span>Nashik, India</span></a>
      <div class="navlinks">
        <a href="about.html" class="${activePage==='about'?'active':''}">About</a>
        <a href="projects.html" class="${activePage==='projects'?'active':''}">Projects</a>
        <a href="insight.html" class="${activePage==='insight'?'active':''}">Insight</a>
        <a href="testimonials.html" class="${activePage==='testimonials'?'active':''}">Testimonials</a>
        <a href="contact.html" class="${activePage==='contact'?'active':''}">Contact</a>
      </div>
      <div class="nav-cta">
        <a href="contact.html" class="btn btn-primary magnetic">Book a Site Visit</a>
      </div>
    </nav>
  </header>`;

  const footer = `
  <footer>
    <div class="wrap">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="logo">YOGESHWAR GROUP<span>Nashik, India</span></div>
          <p>Top builders in Nashik — a trusted name in residential and commercial real estate, recognized across the industry.</p>
        </div>
        <div class="footer-col">
          <h4>Navigate</h4>
          <a href="about.html">About Us</a>
          <a href="projects.html">Projects</a>
          <a href="insight.html">Blog</a>
          <a href="contact.html">Contact</a>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <div>+91 9545454154</div>
          <div>+91 9859858010</div>
          <div>mktg.yogeshwargroup@gmail.com</div>
        </div>
        <div class="footer-col">
          <h4>Address</h4>
          <div>6th Floor, Shivalik Square,<br>Pathardi-Deolali Road,<br>Nashik 422010</div>
        </div>
      </div>
      <div class="footer-bottom">
        <div>&copy; 2026 Yogeshwar Group. All rights reserved.</div>
        <div>Design direction &mdash; &ldquo;The Living Blueprint&rdquo;</div>
      </div>
    </div>
  </footer>`;

  const chat = `
  <div id="chatDock">
    <div id="chatPanel">
      <div class="chat-head">
        <div class="ch-bot"><svg viewBox="0 0 24 24" fill="none"><rect x="5" y="7" width="14" height="11" rx="3" fill="#22272E"/><circle cx="9.5" cy="12.5" r="1.4" fill="#FAF6EE"/><circle cx="14.5" cy="12.5" r="1.4" fill="#FAF6EE"/><line x1="12" y1="3" x2="12" y2="7" stroke="#22272E" stroke-width="1.4"/><circle cx="12" cy="2.6" r="1.1" fill="#22272E"/></svg></div>
        <div class="chat-head-text"><div class="name">Shivalik Concierge</div><div class="status">Online &mdash; usually replies instantly</div></div>
      </div>
      <div id="chatBody">
        <div class="msg bot">Hi! I can help with BHK options, RERA numbers, locations, loan assistance, or booking a site visit. What would you like to know?</div>
      </div>
      <div class="chat-suggestions" id="chatChips">
        <div class="chip" data-q="bhk">BHK options</div>
        <div class="chip" data-q="rera">RERA numbers</div>
        <div class="chip" data-q="loan">Loan assistance</div>
        <div class="chip" data-q="visit">Book a site visit</div>
      </div>
    </div>
    <div id="chatBubble" class="bot-bob">
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="5" y="7" width="14" height="11" rx="3" fill="#FAF6EE"/>
        <circle cx="9.5" cy="12.5" r="1.5" fill="#B6873E"/>
        <circle cx="14.5" cy="12.5" r="1.5" fill="#B6873E"/>
        <line x1="12" y1="3" x2="12" y2="7" stroke="#FAF6EE" stroke-width="1.5"/>
        <circle cx="12" cy="2.6" r="1.2" fill="#FAF6EE"/>
      </svg>
    </div>
  </div>`;

  document.getElementById('chrome-header').innerHTML = nav;
  document.getElementById('chrome-footer').innerHTML = footer;
  document.getElementById('chrome-chat').innerHTML = chat;

  initChat();
  initMagnetic();
}

function initMagnetic(){
  document.querySelectorAll('.magnetic').forEach(el=>{
    el.addEventListener('mousemove', e=>{
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width/2;
      const y = e.clientY - r.top - r.height/2;
      if(window.gsap) gsap.to(el, {x:x*0.25, y:y*0.35, duration:0.4, ease:'power2.out'});
    });
    el.addEventListener('mouseleave', ()=>{
      if(window.gsap) gsap.to(el, {x:0, y:0, duration:0.5, ease:'elastic.out(1,0.4)'});
    });
  });
}

function initChat(){
  const chatBubble = document.getElementById('chatBubble');
  const chatPanel = document.getElementById('chatPanel');
  const chatBody = document.getElementById('chatBody');
  chatBubble.addEventListener('click', ()=> chatPanel.classList.toggle('open'));
  const answers = {
    bhk: "Configurations across our live projects range from Smart 1RK up to 4 BHK penthouses — Shivalik Synergy offers 1RK–3BHK, and Shivalik Skypark goes up to a 4BHK penthouse.",
    rera: "Current RERA numbers — Synergy: P51600046387, Skypark: P51600025573, Shivanta: P51600023743, Skygreen: P51600045502. Sparsh-3's RERA is being finalized.",
    loan: "We work with partner banks for easy loan sanctioning — our team can connect you directly. Want a callback?",
    visit: "I'd love to set that up! Share your preferred date and project on the Contact page, or message us on WhatsApp."
  };
  function addMsg(text, who){
    const d = document.createElement('div');
    d.className = 'msg ' + who;
    d.textContent = text;
    chatBody.appendChild(d);
    chatBody.scrollTop = chatBody.scrollHeight;
  }
  document.querySelectorAll('.chip').forEach(chip=>{
    chip.addEventListener('click', ()=>{
      addMsg(chip.textContent, 'user');
      setTimeout(()=>addMsg(answers[chip.dataset.q], 'bot'), 450);
    });
  });
}

function initReveal(){
  if(!window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);
  document.querySelectorAll('.reveal').forEach(el=>{
    gsap.to(el, {opacity:1, y:0, duration:0.9, ease:'power2.out', scrollTrigger:{trigger:el, start:'top 88%'}});
  });
}

function initMarquee(){
  const completed = ["Shivalik Sanskruti","Shivalik Sankalp","Shivalik Sparsh-2","Shivalik Status","Shivalik Sigma","Shivalik Smruti","Shivalik Sankul","Shivalik Sagar","Shivalik Siddhi","Shivalik Sadhana"];
  const track = document.getElementById('marqueeTrack');
  if(!track) return;
  const list = [...completed, ...completed];
  track.innerHTML = list.map(n => `<span class="marquee-item">${n}<span class="dot"></span></span>`).join('');
}

function initTestiNav(){
  const tTrack = document.getElementById('testiTrack');
  if(!tTrack) return;
  let tPos = 0;
  const cardWidth = 342;
  const nextBtn = document.getElementById('testiNext');
  const prevBtn = document.getElementById('testiPrev');
  if(nextBtn) nextBtn.onclick = ()=>{
    tPos = Math.min(tPos + cardWidth, Math.max(0, tTrack.scrollWidth - tTrack.parentElement.offsetWidth));
    gsap.to(tTrack, {x:-tPos, duration:0.6, ease:'power2.out'});
  };
  if(prevBtn) prevBtn.onclick = ()=>{
    tPos = Math.max(tPos - cardWidth, 0);
    gsap.to(tTrack, {x:-tPos, duration:0.6, ease:'power2.out'});
  };
}
