(function () {
  var D = window.PORTFOLIO, $ = function (s, r) { return (r || document).querySelector(s); }, el = function (t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; };
  var esc = function (s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; };
  var srcsetFor = function (path) {
    var sizes = window.IMAGE_SIZES[path];
    return sizes.small.path + ' ' + sizes.small.width + 'w, ' + sizes.full.path + ' ' + sizes.full.width + 'w';
  };
  var P = D.projects, R = D.roadmap, done = P.filter(function (p) { return p.status === 'Completed'; }).length + R.filter(function (r) { return r.status === 'Completed'; }).length;
  var prog = R.filter(function (r) { return r.status === 'In progress'; }).length, plan = R.filter(function (r) { return r.status === 'Planned'; }).length;
  $('#stats').innerHTML = '<span><b>' + done + '</b> completed</span><span><b>' + prog + '</b> in progress</span><span><b>' + plan + '</b> planned</span>';
  $('#note').textContent = D.note;
  var caseStudies = $('#case-studies');
  P.filter(function (p) { return p.featured; }).forEach(function (p) {
    var article = el('article', 'case-card');
    var picture = el('picture', 'case-image');
    var source = el('source');
    source.type = 'image/webp'; source.srcset = srcsetFor('assets/portfolio/' + p.images[0] + '.jpg');
    source.sizes = '(max-width: 860px) 100vw, (max-width: 1200px) 50vw, 360px';
    picture.appendChild(source);
    var image = el('img');
    image.src = 'assets/portfolio/' + p.images[0] + '.jpg';
    image.alt = '';
    image.width = 1400;
    image.height = 875;
    image.loading = 'lazy';
    image.decoding = 'async';
    picture.appendChild(image);
    article.appendChild(picture);

    var body = el('div', 'case-body');
    var label = el('span', 'ty');
    label.textContent = p.type + ' · ' + p.cat;
    body.appendChild(label);

    var title = el('h3');
    title.textContent = p.title;
    body.appendChild(title);

    var summary = el('p', 'case-summary');
    summary.textContent = p.summary;
    body.appendChild(summary);

    var deliverables = el('p', 'case-deliverables');
    deliverables.textContent = p.deliverables.length + ' deliverables';
    body.appendChild(deliverables);

    var open = el('button', 'case-open');
    open.type = 'button';
    open.innerHTML = 'Explore the full project <span aria-hidden="true">→</span>';
    open.setAttribute('aria-haspopup', 'dialog');
    open.addEventListener('click', function () { openModal(p, open); });
    body.appendChild(open);
    article.appendChild(body);
    caseStudies.appendChild(article);
  });
  var cats = ['All']; P.forEach(function (p) { if (cats.indexOf(p.cat) < 0) cats.push(p.cat); });
  var tabs = $('#ftabs'), grid = $('#pgrid');
  function card(p) {
    var b = el('button', 'pcard'); b.type = 'button'; b.setAttribute('aria-haspopup', 'dialog');
    var imagePath = 'assets/portfolio/' + p.images[0] + '.jpg';
    b.innerHTML = '<picture><source type="image/webp" srcset="' + srcsetFor(imagePath) + '" sizes="(max-width: 860px) 100vw, (max-width: 1200px) 50vw, 360px"><img src="' + imagePath + '" alt="' + esc(p.title) + '" width="1400" height="875" loading="lazy" decoding="async"></picture><span class="st ' + p.status.replace(/ /g, '').toLowerCase() + '">' + esc(p.status) + '</span><div class="pb"><span class="ty">' + esc(p.type) + ' · ' + esc(p.cat) + '</span><h3>' + esc(p.title) + '</h3><p>' + esc(p.summary) + '</p></div>';
    b.addEventListener('click', function () { openModal(p, b); }); return b;
  }
  function show(c) {
    var visible = P.filter(function (p) { return c === 'All' || p.cat === c; });
    grid.innerHTML = '';
    visible.forEach(function (p) { grid.appendChild(card(p)); });
    tabs.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.c === c); });
    $('#filter-status').textContent = 'Showing ' + visible.length + (visible.length === 1 ? ' project.' : ' projects.');
  }
  cats.forEach(function (c) {
    var b = el('button', 'tab', esc(c));
    b.type = 'button'; b.dataset.c = c; b.setAttribute('aria-controls', 'pgrid');
    b.addEventListener('click', function () { show(c); }); tabs.appendChild(b);
  });
  show('All');
  // roadmap
  var rm = $('#roadmap'); R.forEach(function (r) { var d = el('div', 'rm ' + r.status.replace(/ /g, '').toLowerCase()); d.innerHTML = '<span class="st ' + r.status.replace(/ /g, '').toLowerCase() + '">' + esc(r.status) + '</span><span class="pd">' + esc(r.period) + '</span><h3>' + esc(r.title) + '</h3><p>' + esc(r.detail) + '</p><span class="fc">' + esc(r.focus) + '</span>'; rm.appendChild(d); });
  var gl = $('#goals'); D.goals.forEach(function (g) { gl.appendChild(el('li', '', esc(g))); });
  // modal
  var modal = $('#modal'), last;
  function openModal(p, opener) {
    last = opener; var imgs = p.images.map(function (i) { return 'assets/portfolio/' + i + '.jpg'; });
    var media = p.video ? '<video id="mv" controls playsinline preload="none" poster="assets/portfolio/' + p.poster + '.jpg"><source src="assets/portfolio/' + p.video + '" type="video/mp4"></video>' : '<picture><source type="image/webp" srcset="' + srcsetFor(imgs[0]) + '" sizes="(max-width: 860px) 100vw, 55vw"><img id="mi" src="' + imgs[0] + '" alt="' + esc(p.title) + '"></picture>';
    var th = (imgs.length > 1 ? imgs.map(function (s, i) { return '<button type="button" class="th" data-i="' + i + '" aria-label="Show image ' + (i + 1) + '"><picture><source type="image/webp" srcset="' + srcsetFor(s) + '" sizes="92px"><img src="' + s + '" alt=""></picture></button>'; }).join('') : '');
    $('#mbody').innerHTML = '<div class="mm">' + media + '<div class="ths">' + th + '</div></div><div class="mt"><span class="st completed">' + esc(p.status) + '</span> <span class="ty">' + esc(p.type) + ' · ' + esc(p.date) + '</span><h2 id="mtitle">' + esc(p.title) + '</h2><p>' + esc(p.summary) + '</p><h4>The challenge</h4><p>' + esc(p.challenge) + '</p><h4>Our approach</h4><p>' + esc(p.approach) + '</p><h4>Deliverables</h4><ul>' + p.deliverables.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul><div class="tg">' + p.tags.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>' + (p.link ? '<p><a class="btn vio" href="' + p.link + '">' + esc(p.linkText) + '</a></p>' : '<p><a class="btn vio" href="index.html#contact">I want something like this</a></p>') + '</div>';
    $('#mbody').querySelectorAll('.th').forEach(function (b, i) {
      b.setAttribute('aria-pressed', i === 0);
      b.addEventListener('click', function () {
        var m = $('#mi');
        if (m) {
          m.src = imgs[+b.dataset.i];
          m.parentElement.querySelector('source').srcset = srcsetFor(imgs[+b.dataset.i]);
        }
        $('#mbody').querySelectorAll('.th').forEach(function (thumb) { thumb.setAttribute('aria-pressed', thumb === b); });
      });
    });
    modal.hidden = false; document.body.style.overflow = 'hidden'; $('#mclose').focus();
  }
  function close() { modal.hidden = true; document.body.style.overflow = ''; var v = $('#mv'); if (v) v.pause(); if (last) last.focus(); }
  $('#mclose').addEventListener('click', close); modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
  document.addEventListener('keydown', function (e) {
    if (modal.hidden) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key !== 'Tab') return;
    var focusable = Array.prototype.slice.call(modal.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),video[controls],[tabindex]:not([tabindex="-1"])'));
    if (!focusable.length) { e.preventDefault(); return; }
    var first = focusable[0], lastItem = focusable[focusable.length - 1];
    if (!modal.contains(document.activeElement)) { e.preventDefault(); (e.shiftKey ? lastItem : first).focus(); }
    else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastItem.focus(); }
    else if (!e.shiftKey && document.activeElement === lastItem) { e.preventDefault(); first.focus(); }
  });
  var m = $('.menu'), ul = $('.nav ul'); m.addEventListener('click', function () { var o = ul.classList.toggle('open'); m.setAttribute('aria-expanded', o); });
  ul.addEventListener('click', function (e) {
    if (e.target.closest('a')) { ul.classList.remove('open'); m.setAttribute('aria-expanded', 'false'); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && ul.classList.contains('open')) {
      ul.classList.remove('open'); m.setAttribute('aria-expanded', 'false'); m.focus();
    }
  });
  $('#yr').textContent = new Date().getFullYear();
})();
