(function () {
  var D = window.PORTFOLIO, $ = function (s, r) { return (r || document).querySelector(s); }, el = function (t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; };
  var esc = function (s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; };
  var P = D.projects, R = D.roadmap, done = P.filter(function (p) { return p.status === 'Completed'; }).length + R.filter(function (r) { return r.status === 'Completed'; }).length;
  var prog = R.filter(function (r) { return r.status === 'In progress'; }).length, plan = R.filter(function (r) { return r.status === 'Planned'; }).length;
  $('#stats').innerHTML = '<span><b>' + done + '</b> completed</span><span><b>' + prog + '</b> in progress</span><span><b>' + plan + '</b> planned</span>';
  $('#note').textContent = D.note;
  var cats = ['All']; P.forEach(function (p) { if (cats.indexOf(p.cat) < 0) cats.push(p.cat); });
  var tabs = $('#ftabs'), grid = $('#pgrid');
  function card(p) {
    var b = el('button', 'pcard'); b.type = 'button'; b.setAttribute('aria-haspopup', 'dialog');
    b.innerHTML = '<img src="assets/portfolio/' + p.images[0] + '.jpg" alt="' + esc(p.title) + '" loading="lazy"><span class="st ' + p.status.replace(/ /g, '').toLowerCase() + '">' + esc(p.status) + '</span><div class="pb"><span class="ty">' + esc(p.type) + ' · ' + esc(p.cat) + '</span><h3>' + esc(p.title) + '</h3><p>' + esc(p.summary) + '</p></div>';
    b.addEventListener('click', function () { openModal(p, b); }); return b;
  }
  function show(c) { grid.innerHTML = ''; P.filter(function (p) { return c === 'All' || p.cat === c; }).forEach(function (p) { grid.appendChild(card(p)); }); tabs.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-selected', b.dataset.c === c); }); }
  cats.forEach(function (c) { var b = el('button', 'tab', esc(c)); b.type = 'button'; b.dataset.c = c; b.addEventListener('click', function () { show(c); }); tabs.appendChild(b); });
  show('All');
  // roadmap
  var rm = $('#roadmap'); R.forEach(function (r) { var d = el('div', 'rm ' + r.status.replace(/ /g, '').toLowerCase()); d.innerHTML = '<span class="st ' + r.status.replace(/ /g, '').toLowerCase() + '">' + esc(r.status) + '</span><span class="pd">' + esc(r.period) + '</span><h3>' + esc(r.title) + '</h3><p>' + esc(r.detail) + '</p><span class="fc">' + esc(r.focus) + '</span>'; rm.appendChild(d); });
  var gl = $('#goals'); D.goals.forEach(function (g) { gl.appendChild(el('li', '', esc(g))); });
  // modal
  var modal = $('#modal'), last;
  function openModal(p, opener) {
    last = opener; var imgs = p.images.map(function (i) { return 'assets/portfolio/' + i + '.jpg'; });
    var media = p.video ? '<video id="mv" controls playsinline preload="none" poster="assets/portfolio/' + p.poster + '.jpg"><source src="assets/portfolio/' + p.video + '" type="video/mp4"></video>' : '<img id="mi" src="' + imgs[0] + '" alt="' + esc(p.title) + '">';
    var th = (imgs.length > 1 ? imgs.map(function (s, i) { return '<button type="button" class="th" data-i="' + i + '" aria-label="Show image ' + (i + 1) + '"><img src="' + s + '" alt=""></button>'; }).join('') : '');
    $('#mbody').innerHTML = '<div class="mm">' + media + '<div class="ths">' + th + '</div></div><div class="mt"><span class="st completed">' + esc(p.status) + '</span> <span class="ty">' + esc(p.type) + ' · ' + esc(p.date) + '</span><h2 id="mtitle">' + esc(p.title) + '</h2><p>' + esc(p.summary) + '</p><h4>The challenge</h4><p>' + esc(p.challenge) + '</p><h4>Our approach</h4><p>' + esc(p.approach) + '</p><h4>Deliverables</h4><ul>' + p.deliverables.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul><div class="tg">' + p.tags.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>' + (p.link ? '<p><a class="btn vio" href="' + p.link + '">' + esc(p.linkText) + '</a></p>' : '<p><a class="btn vio" href="index.html#contact">I want something like this</a></p>') + '</div>';
    $('#mbody').querySelectorAll('.th').forEach(function (b) { b.addEventListener('click', function () { var m = $('#mi'); if (m) m.src = imgs[+b.dataset.i]; }); });
    modal.hidden = false; document.body.style.overflow = 'hidden'; $('#mclose').focus();
  }
  function close() { modal.hidden = true; document.body.style.overflow = ''; var v = $('#mv'); if (v) v.pause(); if (last) last.focus(); }
  $('#mclose').addEventListener('click', close); modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) close(); });
  var m = $('.menu'), ul = $('.nav ul'); m.addEventListener('click', function () { var o = ul.classList.toggle('open'); m.setAttribute('aria-expanded', o); });
  $('#yr').textContent = new Date().getFullYear();
})();
