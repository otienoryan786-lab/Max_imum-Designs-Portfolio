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
    tabs.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-selected', b.dataset.c === cat); });
  }
  cats.forEach(function (c, i) {
    var b = document.createElement('button'); b.className = 'tab'; b.type = 'button'; b.dataset.c = c; b.textContent = c; b.setAttribute('role', 'tab');
    b.addEventListener('click', function () { show(c); }); tabs.appendChild(b);
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
    return 'Hello Max_imum Designs! I would like a quote.\n\nName: ' + f.get('name') + '\nBusiness: ' + f.get('biz') + '\nService: ' + f.get('service') + '\nDeadline: ' + (f.get('deadline') || 'flexible') + '\nHeard about us from: ' + (f.get('source') || '-') + '\nDetails: ' + (f.get('details') || '-');
  }
  form.addEventListener('submit', function (e) { e.preventDefault(); window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(msg()), '_blank', 'noopener'); });
  $('#emailbtn').addEventListener('click', function () { if (!form.reportValidity()) return; location.href = 'mailto:maxthompson786@gmail.com?subject=' + encodeURIComponent('Quote request') + '&body=' + encodeURIComponent(msg()); });
  // mobile menu
  var m = $('.menu'), ul = $('.nav ul'); m.addEventListener('click', function () { var o = ul.classList.toggle('open'); m.setAttribute('aria-expanded', o); });
  ul.addEventListener('click', function () { ul.classList.remove('open'); });
  // lightbox
  var lb = $('.lb'), lbi = $('.lb img');
  document.querySelectorAll('.work figure').forEach(function (f) { f.tabIndex = 0; var open = function () { lbi.src = f.querySelector('img').src; lbi.alt = f.querySelector('img').alt; lb.classList.add('on'); }; f.addEventListener('click', open); f.addEventListener('keydown', function (e) { if (e.key === 'Enter') open(); }); });
  lb.addEventListener('click', function () { lb.classList.remove('on'); }); document.addEventListener('keydown', function (e) { if (e.key === 'Escape') lb.classList.remove('on'); });
  $('#yr').textContent = new Date().getFullYear();
})();
