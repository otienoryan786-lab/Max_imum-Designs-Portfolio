/* Max, the Max_imum design buddy: avatar, welcome experience, helper widget, hero effects.
   Edit the TEXT in the "say(...)" lines to change what Max says. */
(function () {
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches, WA = '254112816303';
  var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var el = function (t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; };
  var wl = function (msg) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg); };
  var fmt = function (n) { return 'KES ' + n.toLocaleString('en-KE'); };
  function price(name) { var P = window.PRICES || {}, out = null; Object.keys(P).forEach(function (k) { P[k].forEach(function (p) { if (p[0] === name) out = p[2]; }); }); return out ? fmt(out) : ''; }
  var SVG = '<svg class="max mood-happy" viewBox="0 0 240 300" role="img" aria-label="Max, the Max_imum design buddy"><ellipse class="shadow" cx="120" cy="286" rx="62" ry="9" fill="#000" opacity=".28"/><g class="float"><rect x="84" y="226" width="26" height="40" rx="12" fill="#0E0B24"/><rect x="130" y="226" width="26" height="40" rx="12" fill="#0E0B24"/><rect x="74" y="258" width="42" height="18" rx="9" fill="#C6F432"/><rect x="124" y="258" width="42" height="18" rx="9" fill="#C6F432"/>' +
    '<g class="armL"><rect x="44" y="110" width="46" height="20" rx="10" fill="#4A22DC"/><circle cx="94" cy="120" r="13" fill="#C6F432"/></g><g class="armR"><rect x="196" y="110" width="46" height="20" rx="10" fill="#4A22DC"/><circle cx="246" cy="120" r="13" fill="#C6F432"/></g>' +
    '<rect x="117" y="22" width="6" height="24" rx="3" fill="#0E0B24"/><rect class="cursor" x="106" y="12" width="28" height="9" rx="4.5" fill="#C6F432"/><rect x="40" y="40" width="160" height="196" rx="46" fill="#5B2EFF"/><rect x="58" y="62" width="124" height="96" rx="30" fill="#0E0B24"/>' +
    '<g class="eyes"><ellipse cx="94" cy="108" rx="16" ry="18" fill="#fff"/><circle class="pupil" cx="94" cy="110" r="8" fill="#0E0B24"/><ellipse cx="146" cy="108" rx="16" ry="18" fill="#fff"/><circle class="pupil" cx="146" cy="110" r="8" fill="#0E0B24"/></g>' +
    '<g class="brow"><rect x="78" y="80" width="30" height="5" rx="2.5" fill="#C6F432"/><rect class="brow-r" x="132" y="80" width="30" height="5" rx="2.5" fill="#C6F432"/></g><g class="cheeks"><ellipse cx="72" cy="134" rx="9" ry="6" fill="#FF5C4D"/><ellipse cx="168" cy="134" rx="9" ry="6" fill="#FF5C4D"/></g>' +
    '<g class="mouth"><path class="m-smile" d="M102 136 Q120 154 138 136" stroke="#C6F432" stroke-width="6" stroke-linecap="round" fill="none"/><path class="m-open" d="M104 134 Q120 162 136 134 Z" fill="#C6F432"/><rect class="m-flat" x="104" y="138" width="32" height="7" rx="3.5" fill="#C6F432"/><circle class="m-wow" cx="120" cy="142" r="9" fill="none" stroke="#C6F432" stroke-width="5"/></g>' +
    '<text x="120" y="204" text-anchor="middle" font-family="Poppins,Arial,sans-serif" font-weight="700" font-size="42" fill="#fff">M</text><rect x="96" y="212" width="48" height="8" rx="4" fill="#C6F432"/></g></svg>';
  var avatars = [];
  function create(container) {
    container.innerHTML = SVG; var svg = $('svg', container), pupils = $$('.pupil', svg), a = { svg: svg, ox: 0, oy: 0 };
    a.mood = function (m) { svg.setAttribute('class', svg.getAttribute('class').replace(/mood-\w+/, 'mood-' + m)); };
    a.wave = function (on) { svg.classList.toggle('wave', on !== false); }; a.talk = function (on) { svg.classList.toggle('talking', !!on); };
    a.look = function (mx, my) { var r = svg.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height * .36, dx = mx - cx, dy = my - cy, d = Math.sqrt(dx * dx + dy * dy) || 1, k = Math.min(1, d / 220) * 6; pupils.forEach(function (p) { p.style.transform = 'translate(' + (dx / d * k).toFixed(1) + 'px,' + (dy / d * k).toFixed(1) + 'px)'; }); };
    avatars.push(a); return a;
  }
  var ticking = false, last = [0, 0];
  document.addEventListener('mousemove', function (e) { last = [e.clientX, e.clientY]; if (!ticking) { ticking = true; requestAnimationFrame(function () { avatars.forEach(function (a) { if (a.svg.isConnected) a.look(last[0], last[1]); }); ticking = false; }); } });
  /* typewriter: html allowed (only <b> and <br>) */
  function say(bubble, html, av, speed) {
    return new Promise(function (res) {
      var tw = el('span', 'tw'); bubble.innerHTML = ''; bubble.appendChild(tw); if (RM) { tw.innerHTML = html; tw.className = 'tw done'; res(); return; }
      var tokens = html.match(/<[^>]+>|[^<]/g) || [], i = 0, out = '', done = false; if (av) av.talk(true);
      function fin() { if (done) return; done = true; clearInterval(t); tw.innerHTML = html; tw.className = 'tw done'; if (av) av.talk(false); bubble.removeEventListener('click', fin); res(); }
      var t = setInterval(function () { for (var k = 0; k < 2 && i < tokens.length; k++) out += tokens[i++]; tw.innerHTML = out; if (i >= tokens.length) fin(); }, speed || 22); bubble.addEventListener('click', fin);
    });
  }
  /* confetti */
  function confetti(ms) {
    if (RM) return; var c = el('canvas', 'confetti'); c.width = innerWidth; c.height = innerHeight; document.body.appendChild(c); var g = c.getContext('2d'), cols = ['#C6F432', '#5B2EFF', '#D8CFFF', '#FF5C4D', '#fff'], ps = [];
    for (var i = 0; i < 140; i++) ps.push({ x: Math.random() * c.width, y: -20 - Math.random() * c.height * .5, w: 6 + Math.random() * 14, h: 4 + Math.random() * 5, vy: 2 + Math.random() * 4, vx: -1.5 + Math.random() * 3, r: Math.random() * 6, vr: -.2 + Math.random() * .4, c: cols[i % 5] });
    var t0 = performance.now(); (function f(t) { g.clearRect(0, 0, c.width, c.height); ps.forEach(function (p) { p.x += p.vx; p.y += p.vy; p.r += p.vr; g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c; g.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); g.restore(); }); if (t - t0 < (ms || 2800)) requestAnimationFrame(f); else c.remove(); })(t0);
  }
  /* animated dot canvas (cursor glow) */
  function dotCanvas(host, opts) {
    var c = el('canvas', opts.cls || 'dots'); c.setAttribute('aria-hidden', 'true'); host.insertBefore(c, host.firstChild); var g = c.getContext('2d'), gap = opts.gap || 30, mx = -999, my = -999, W, H, raf, base = opts.base || '#2A2745';
    function size() { var r = host.getBoundingClientRect(); W = c.width = r.width; H = c.height = r.height; draw(); }
    function draw() { g.clearRect(0, 0, W, H); for (var x = gap / 2; x < W; x += gap) for (var y = gap / 2; y < H; y += gap) { var d = Math.hypot(x - mx, y - my), k = Math.max(0, 1 - d / 150); g.fillStyle = k > .02 ? 'rgba(198,244,50,' + (0.25 + .75 * k).toFixed(2) + ')' : base; g.beginPath(); g.arc(x, y, 1.7 + k * 3.2, 0, 6.3); g.fill(); } }
    host.addEventListener('mousemove', function (e) { var r = host.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; if (!RM && !raf) raf = requestAnimationFrame(function () { raf = 0; draw(); }); });
    host.addEventListener('mouseleave', function () { mx = my = -999; draw(); }); addEventListener('resize', size); size(); return c;
  }
  /* routing helpers */
  var TAB = { logo: 'Logo', social: 'Digital', print: 'Print', deck: 'Documents' };
  function applyNeed(n) { var b = $('#tabs button[data-c="' + TAB[n] + '"]'); if (b) { b.click(); var p = $('#prices'); if (p) p.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' }); return true; } return false; }
  /* welcome experience */
  function buildScene(host, opts) {
    host.innerHTML = '<div class="scene"><a href="index.html" class="wllogo-a" aria-label="Max_imum Designs"><img class="wllogo" src="assets/logo/logo-reversed.svg" alt="Max_imum Designs"></a><button type="button" class="skip2">Skip to the site \u2192</button>' +
      '<div class="sh t1" data-d="1" style="left:8%;top:18%"><i></i></div><div class="sh t2" data-d="-1" style="right:10%;top:14%"><i></i></div><div class="sh t3" data-d="2" style="left:14%;bottom:16%"><i></i></div><div class="sh t4" data-d="-2" style="right:16%;bottom:20%"><i></i></div><div class="sh t5" data-d="1.5" style="right:6%;top:40%"><i>M_</i></div><div class="sh t6" data-d="-1.5" style="left:36%;top:6%"><i></i></div>' +
      '<div class="stage"><div class="mxwrap"></div><div><div class="bubble" aria-live="polite"></div><div class="acts"></div></div></div><div class="wtag">DESIGN TO THE MAX_</div></div>';
    var scene = $('.scene', host), dots = dotCanvas(scene, { cls: 'dots', gap: 34 }); var av = create($('.mxwrap', host)), bubble = $('.bubble', host), acts = $('.acts', host);
    scene.addEventListener('mousemove', function (e) { var r = scene.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; $$('.sh', scene).forEach(function (s) { var d = parseFloat(s.dataset.d); s.style.transform = 'translate(' + (x * d * 40).toFixed(1) + 'px,' + (y * d * 40).toFixed(1) + 'px)'; }); });
    var clicks = 0; $('.mxwrap', host).addEventListener('click', function () { clicks++; av.mood('wow'); setTimeout(function () { av.mood('happy'); }, 900); if (clicks >= 5) { clicks = 0; av.mood('happy'); confetti(); say(bubble, 'Party mode! \ud83c\udf89 You found my secret. Now, how can I help?', av); } });
    return { av: av, bubble: bubble, acts: acts, scene: scene, skip: $('.skip2', host) };
  }
  function runWelcome(host, opts) {
    var S = buildScene(host, opts), av = S.av, bubble = S.bubble, acts = S.acts, name = '', closed = false;
    function btn(label, fn, cls, href) { var b = el(href ? 'a' : 'button', cls || '', label); if (href) b.href = href; else { b.type = 'button'; b.addEventListener('click', fn); } return b; }
    function set() { acts.innerHTML = ''; var w = el('div', 'chips2'); [].slice.call(arguments).forEach(function (b) { w.appendChild(b); }); acts.appendChild(w); var f = $('button,a,input', w); if (f && !RM) setTimeout(function () { try { f.focus({ preventScroll: true }); } catch (e) {} }, 50); }
    function go(url, need) { opts.finish && opts.finish(need, url); }
    function intro() {
      av.wave(true); av.mood('happy');
      return say(bubble, 'Karibu! \ud83d\udc4b I\'m <b>Max</b>, your design buddy at <b>Max_imum Designs</b>.', av).then(function () { av.wave(false); return say(bubble, 'Karibu! \ud83d\udc4b I\'m <b>Max</b>, your design buddy at <b>Max_imum Designs</b>.<br>What should I call you?', av, 12); }).then(function () {
        acts.innerHTML = '<form class="nameform"><input aria-label="Your name" placeholder="Type your first name" maxlength="24" autocomplete="given-name"><button class="mbtn pri" type="submit">Say hi</button><button class="mbtn" type="button" data-skip>Skip</button></form>'; var f = $('form', acts), inp = $('input', f); if (!RM) inp.focus({ preventScroll: true });
        f.addEventListener('submit', function (e) { e.preventDefault(); name = inp.value.trim().replace(/[<>]/g, ''); choose(); }); $('[data-skip]', f).addEventListener('click', function () { name = ''; choose(); });
      });
    }
    function choose() {
      av.mood('happy'); var hi = name ? 'Nice to meet you, <b>' + name + '</b>! ' : 'No problem! '; say(bubble, hi + 'What do you need today?', av).then(function () {
        set(btn('Logo or brand', function () { pick('logo'); }), btn('Social media posts', function () { pick('social'); }), btn('Flyers, cards, menus', function () { pick('print'); }), btn('Pitch deck or profile', function () { pick('deck'); }), btn('Not sure yet', function () { pick('unsure'); }));
      });
    }
    function offer() { var o = window.OFFER; return o && o.active && (!o.ends || new Date() <= new Date(o.ends + 'T23:59:59')) ? '<br>\ud83c\udf81 <b>Launch offer:</b> 10% off for our first 5 clients.' : ''; }
    function pick(k) {
      av.mood('wow'); var who = name || 'a website visitor', txt = { logo: 'a logo or brand', social: 'social media posts', print: 'print design (flyers, cards or menus)', deck: 'a pitch deck or company profile', unsure: 'help choosing' }[k], msg = 'Hi Max_imum Designs, I\'m ' + who + '. I need ' + txt + '. (via the website welcome)';
      var lines = { logo: 'A logo is the heart of a brand. <b>Logo Starter is ' + price('Logo Starter') + '</b> with 2 concepts and 2 free revisions. Want to see how your name could look?', social: 'Consistent posts build trust. <b>A post is ' + price('Social media post') + '</b>, a pack of 10 is ' + price('Post pack of 10') + ', and editable templates are ' + price('Editable post templates') + '.', print: 'Print still wins customers. <b>Business cards and flyers are ' + price('Business card') + '</b> each, and menus are ' + price('Menu') + '.', deck: 'A clear deck wins trust. <b>Pitch decks are ' + price('Pitch deck') + '</b> (up to 10 slides) and company profiles ' + price('Company profile') + '.', unsure: 'No problem, let\'s find out together! The <b>Brand Health Check</b> takes 5 minutes, it\'s free, and shows what to fix first.' };
      setTimeout(function () { av.mood(k === 'unsure' ? 'think' : 'happy'); }, 700);
      say(bubble, lines[k] + (k === 'unsure' ? '' : offer()), av).then(function () {
        var q = btn('Get a quote on WhatsApp', null, 'pri', wl(msg)); q.target = '_blank'; q.rel = 'noopener'; var more = btn('Explore the website', function () { go('index.html', ''); }), seeP = btn('See ' + (TAB[k] ? TAB[k].toLowerCase() : 'all') + ' prices', function () { go('index.html?need=' + k + '#prices', k); });
        if (k === 'unsure') set(btn('Start the Brand Health Check', function () { go('brand-health-check.html', ''); }, 'pri'), q, more);
        else if (k === 'logo') set(q, seeP, btn('Try the logo preview', function () { go('playground.html#logo', ''); }), more);
        else set(q, seeP, btn('Build my quote', function () { go('playground.html#quote', ''); }), more);
      });
    }
    S.skip.addEventListener('click', function () { go('index.html', ''); }); intro(); return S;
  }
  /* first-visit overlay on the home page */
  function overlay() {
    if (!$('#top') || document.body.hasAttribute('data-nomax')) return false; var q = location.search;
    try { if (sessionStorage.getItem('maxWelcomed') || /welcome=0/.test(q) || /need=/.test(q)) return false; } catch (e) {}
    var host = el('div', 'wl'); host.setAttribute('role', 'dialog'); host.setAttribute('aria-modal', 'true'); host.setAttribute('aria-label', 'Welcome to Max_imum Designs'); document.body.appendChild(host); document.body.style.overflow = 'hidden';
    function finish(need, url) { try { sessionStorage.setItem('maxWelcomed', '1'); } catch (e) {} host.remove(); document.body.style.overflow = ''; document.removeEventListener('keydown', esc); if (need && applyNeed(need)) return; if (url && url !== 'index.html') location.href = url; }
    function esc(e) { if (e.key === 'Escape') finish('', 'index.html'); } document.addEventListener('keydown', esc); runWelcome(host, { finish: finish }); return true;
  }
  /* helper widget (bottom-left) */
  function widget() {
    if (document.body.hasAttribute('data-nomax')) return; var w = el('div', 'mw'), b = el('button', 'btn0'); b.type = 'button'; b.setAttribute('aria-label', 'Chat with Max, the design buddy'); b.setAttribute('aria-expanded', 'false'); var holder = el('span'); b.appendChild(holder); b.appendChild(el('i', 'ping')); w.appendChild(b); document.body.appendChild(w); var av = create(holder), panel, tip, shown = 0, seen = {};
    function closePanel() { if (panel) { panel.remove(); panel = null; b.setAttribute('aria-expanded', 'false'); } }
    function openPanel() { closeTip(); panel = el('div', 'panel'); panel.innerHTML = '<h4>Hi! I\'m Max \ud83d\udc4b How can I help?</h4>'; var items = [['Get a quote on WhatsApp', wl('Hi Max_imum Designs, I would like a quote. (via Max on the website)'), 1], ['Free Brand Health Check', 'brand-health-check.html'], ['Try the logo preview', 'playground.html#logo'], ['Build my quote', 'playground.html#quote'], ['See the portfolio', 'portfolio.html'], ['Watch my welcome again', 'welcome.html']]; items.forEach(function (i) { var a = el('a', '', i[0]); a.href = i[1]; if (i[2]) { a.target = '_blank'; a.rel = 'noopener'; } panel.appendChild(a); }); w.appendChild(panel); b.setAttribute('aria-expanded', 'true'); av.mood('happy'); av.wave(true); setTimeout(function () { av.wave(false); }, 1800); }
    function closeTip() { if (tip) { tip.remove(); tip = null; } }
    function showTip(t) { if (panel || shown >= 3 || document.querySelector('.wl')) return; closeTip(); shown++; tip = el('div', 'tip', t + '<button type="button" aria-label="Dismiss tip">\u00d7</button>'); $('button', tip).addEventListener('click', closeTip); w.appendChild(tip); av.mood('happy'); setTimeout(closeTip, 9000); }
    b.addEventListener('click', function () { if (panel) closePanel(); else openPanel(); }); document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePanel(); }); document.addEventListener('click', function (e) { if (panel && !w.contains(e.target)) closePanel(); });
    var clicks = 0; b.addEventListener('dblclick', function () { confetti(); });
    var tips = { services: 'Not sure what you need? Tap me and I\'ll point you the right way.', prices: 'Every design includes 2 free revisions (3 for logos).', tools: 'Try the free Brand Health Check. It takes 5 minutes!', contact: 'Quotes come in 24 hours, and you can pay by M-Pesa.', pgrid: 'Tap any project to see its story and files.' };
    if ('IntersectionObserver' in window) { var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting && !seen[e.target.id] && tips[e.target.id]) { seen[e.target.id] = 1; setTimeout(function () { showTip(tips[e.target.id]); }, 600); } }); }, { threshold: .35 }); Object.keys(tips).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); }); }
    if (!RM) setInterval(function () { if (!panel && !tip && !document.hidden) { av.wave(true); setTimeout(function () { av.wave(false); }, 2200); } }, 28000);
  }
  /* hero effects */
  function hero() {
    var h = $('.hero'); if (!h || !$('#top')) return; h.classList.add('fxon'); dotCanvas(h, { cls: 'fx', gap: 26 });
    var h1 = $('h1', h); if (h1 && !$('.rot', h)) { var r = el('div', 'rot'); r.setAttribute('aria-hidden', 'true'); r.innerHTML = 'We design <b></b>'; h1.insertAdjacentElement('afterend', r); var words = ['logos', 'brand kits', 'social posts', 'flyers and menus', 'pitch decks', 'packaging'], wi = 0, ci = 0, del = false, bt = $('b', r);
      if (RM) { bt.textContent = words.join(', '); return; } (function tick() { var w = words[wi]; ci += del ? -1 : 1; bt.textContent = w.slice(0, ci); var d = del ? 40 : 85; if (!del && ci === w.length) { del = true; d = 1400; } else if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; d = 300; } setTimeout(tick, d); })(); }
  }
  window.Max = { create: create, say: say, confetti: confetti, runWelcome: runWelcome, applyNeed: applyNeed, price: price, fmt: fmt, wl: wl, dotCanvas: dotCanvas };
  document.addEventListener('DOMContentLoaded', function () {
    var m = /need=(\w+)/.exec(location.search); var shown = overlay(); hero(); if (!$('#welcomeHost')) widget();
    if (m && TAB[m[1]]) setTimeout(function () { applyNeed(m[1]); }, 200);
    var host = $('#welcomeHost'); if (host) runWelcome(host, { finish: function (need, url) { location.href = url && url !== 'index.html' ? url : 'index.html'; } });
  });
})();
