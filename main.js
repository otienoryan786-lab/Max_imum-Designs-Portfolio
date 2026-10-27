(function () {
  var WA = '254112816303';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var fmt = function (n) { return 'KES ' + n.toLocaleString('en-KE'); };
  var usd = function (n) { var v = n / window.RATE; return 'about US$' + (v < 100 ? Math.round(v) : Math.round(v / 5) * 5); };
  // price tabs
  var tabs = $('#tabs'), list = $('#plist'), cats = Object.keys(window.PRICES);
  function show(cat) {
    list.innerHTML = '';
    window.PRICES[cat].forEach(function (p) {
      var d = document.createElement('div'); d.className = 'row';
      d.innerHTML = '<b></b><span class="d"></span><div class="p"></div>';
      d.children[0].textContent = p[0]; d.children[1].textContent = p[1];
      d.children[2].innerHTML = fmt(p[2]) + '<small>' + usd(p[2]) + (cat === 'Monthly retainers' ? ' / month' : '') + '</small>';
      list.appendChild(d);
    });
    tabs.querySelectorAll('button').forEach(function (b) {
      var selected = b.dataset.c === cat;
      b.setAttribute('aria-selected', selected);
      b.tabIndex = selected ? 0 : -1;
      if (selected) list.setAttribute('aria-labelledby', b.id);
    });
  }
  cats.forEach(function (c, i) {
    var b = document.createElement('button'); b.className = 'tab'; b.type = 'button'; b.id = 'price-tab-' + i; b.dataset.c = c; b.textContent = c; b.setAttribute('role', 'tab'); b.setAttribute('aria-controls', 'plist');
    b.addEventListener('click', function () { show(c); }); tabs.appendChild(b);
    b.addEventListener('keydown', function (e) {
      var buttons = Array.prototype.slice.call(tabs.querySelectorAll('[role="tab"]'));
      var index = buttons.indexOf(b), next = index;
      if (e.key === 'ArrowRight') next = (index + 1) % buttons.length;
      else if (e.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = buttons.length - 1;
      else return;
      e.preventDefault();
      buttons[next].focus();
      show(buttons[next].dataset.c);
    });
  });
  show(cats[0]);
  // service dropdown from prices
  var sel = $('#service');
  cats.forEach(function (c) { var g = document.createElement('optgroup'); g.label = c; window.PRICES[c].forEach(function (p) { var o = document.createElement('option'); o.textContent = p[0] + ' (' + fmt(p[2]) + ')'; o.value = p[0]; g.appendChild(o); }); sel.appendChild(g); });
  var other = document.createElement('option'); other.value = 'Something else'; other.textContent = 'Something else / not sure'; sel.appendChild(other);
  // quote form -> WhatsApp or email
  var form = $('#quote');
  function msg() {
    var f = new FormData(form);
    return 'Hello Max_imum Designs! I would like a quote.\n\nName: ' + f.get('name') + '\nBusiness: ' + f.get('biz') + '\nService: ' + f.get('service') + '\nDeadline: ' + (f.get('deadline') || 'flexible') + '\nDetails: ' + (f.get('details') || '-');
  }
  form.addEventListener('submit', function (e) { e.preventDefault(); window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(msg()), '_blank', 'noopener'); });
  $('#emailbtn').addEventListener('click', function () { if (!form.reportValidity()) return; location.href = 'mailto:maxthompson786@gmail.com?subject=' + encodeURIComponent('Quote request') + '&body=' + encodeURIComponent(msg()); });
  // mobile menu
  var m = $('.menu'), ul = $('.nav ul'); m.addEventListener('click', function () { var o = ul.classList.toggle('open'); m.setAttribute('aria-expanded', o); });
  ul.addEventListener('click', function (e) {
    if (e.target.closest('a')) { ul.classList.remove('open'); m.setAttribute('aria-expanded', 'false'); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && ul.classList.contains('open')) {
      ul.classList.remove('open'); m.setAttribute('aria-expanded', 'false'); m.focus();
    }
  });
  // lightbox
  var lb = $('.lb'), lbwebp = $('#lbwebp'), lbi = $('.lb img'), lbClose = $('.lb button'), lastTrigger;
  function closeLightbox() {
    lb.classList.remove('on'); lb.setAttribute('aria-hidden', 'true');
    if (lastTrigger) lastTrigger.focus();
  }
  document.querySelectorAll('.work figure').forEach(function (f) {
    f.tabIndex = 0; f.setAttribute('role', 'button'); f.setAttribute('aria-haspopup', 'dialog');
    var open = function () {
      lastTrigger = f;
      var img = f.querySelector('img'); lbi.src = img.src; lbi.alt = img.alt;
      var sizes = window.IMAGE_SIZES[img.getAttribute('src')];
      lbwebp.srcset = sizes.small.path + ' ' + sizes.small.width + 'w, ' + sizes.full.path + ' ' + sizes.full.width + 'w';
      lbwebp.sizes = '100vw';
      lb.classList.add('on'); lb.setAttribute('aria-hidden', 'false'); lbClose.focus();
    };
    f.addEventListener('click', open);
    f.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  });
  lbClose.addEventListener('click', closeLightbox);
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('on')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'Tab') { e.preventDefault(); lbClose.focus(); }
  });
  $('#yr').textContent = new Date().getFullYear();
})();
