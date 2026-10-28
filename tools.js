/* Logo preview and Quote builder. Prices come from js/prices.js. Nothing typed here leaves the browser unless the visitor taps a WhatsApp button. */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); }, M = window.Max, RATE = window.RATE || 130;
  var fmt = function (n) { return 'KES ' + Math.round(n).toLocaleString('en-KE'); };
  /* ---- tabs ---- */
  var tabs = $$('[data-tab]'), panels = $$('[data-panel]');
  function show(n) { tabs.forEach(function (t) { t.setAttribute('aria-pressed', t.dataset.tab === n); }); panels.forEach(function (p) { p.hidden = p.dataset.panel !== n; }); if (n === 'logo') draw(); }
  tabs.forEach(function (t) { t.addEventListener('click', function () { show(t.dataset.tab); history.replaceState(null, '', '#' + t.dataset.tab); }); });
  /* ---- logo preview ---- */
  var PAL = { Max: ['#0E0B24', '#C6F432', '#0E0B24', '#5B2EFF'], Violet: ['#5B2EFF', '#FFFFFF', '#5B2EFF', '#C6F432'], Lime: ['#C6F432', '#0E0B24', '#0E0B24', '#5B2EFF'], Coral: ['#FF5C4D', '#FFFFFF', '#0E0B24', '#FF5C4D'], Forest: ['#0B6E4F', '#F5A524', '#0B6E4F', '#F5A524'] };
  var st = { pal: 'Max', layout: 'Icon + name', font: 'Bold' }, cv = $('#cv'), ctx = cv && cv.getContext('2d'), DPR = Math.min(2, window.devicePixelRatio || 1);
  function fam() { return st.font === 'Mono' ? '"Courier New",monospace' : st.font === 'Serif' ? 'Georgia,serif' : 'Poppins,Arial,sans-serif'; }
  function rr(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function tile(x, y, s, init, c) { ctx.fillStyle = c[0]; rr(x, y, s, s, s * .24); ctx.fill(); ctx.fillStyle = c[1]; ctx.font = '700 ' + (s * .6) + 'px ' + (st.font === 'Serif' ? 'Georgia,serif' : 'Poppins,Arial,sans-serif'); ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillText(init, x + s / 2, y + s * .66); ctx.fillStyle = c[1] === '#FFFFFF' ? '#C6F432' : c[1]; ctx.globalAlpha = c[1] === '#FFFFFF' ? 1 : 1; rr(x + s * .25, y + s * .78, s * .5, s * .075, s * .037); ctx.fill(); ctx.globalAlpha = 1; }
  function words(name, size, x, y, c, align, maxW) {
    var parts = name.trim().split(/\s+/).filter(Boolean); if (!parts.length) parts = ['Your_name']; var weight = st.font === 'Mono' ? '700 ' : '700 '; var s = size, total;
    function meas(sz) { ctx.font = weight + sz + 'px ' + fam(); var w = 0; parts.forEach(function (p, i) { w += ctx.measureText(p).width; if (i < parts.length - 1) w += sz * .62; }); return w; }
    total = meas(s); if (total > maxW) { s = s * maxW / total; total = meas(s); } ctx.font = weight + s + 'px ' + fam(); ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left'; var cx = align === 'center' ? x - total / 2 : x;
    parts.forEach(function (p, i) { ctx.fillStyle = c[2]; ctx.fillText(p, cx, y); cx += ctx.measureText(p).width; if (i < parts.length - 1) { ctx.fillStyle = c[3]; rr(cx + s * .08, y + s * .08, s * .46, s * .105, s * .052); ctx.fill(); cx += s * .62; } });
    if (parts.length === 1) { ctx.fillStyle = c[3]; rr((align === 'center' ? x + total / 2 : x + total) + s * .06, y + s * .08, s * .46, s * .105, s * .052); ctx.fill(); }
    return s;
  }
  function draw() {
    if (!cv) return; var W = 900, H = 520, c = PAL[st.pal], name = ($('#bn').value || 'Your Business').slice(0, 26), tag = ($('#bt').value || '').slice(0, 40), init = (name.trim()[0] || 'M').toUpperCase(); cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
    if (st.layout === 'Monogram') { var s = 280; tile(W / 2 - s / 2, H / 2 - s / 2 - 10, s, init, c); }
    else if (st.layout === 'Stacked') { var t = 190; tile(W / 2 - t / 2, 50, t, init, c); var fs = words(name, 74, W / 2, 330, c, 'center', 780); if (tag) { ctx.fillStyle = '#6B6785'; ctx.font = '700 22px "Courier New",monospace'; ctx.textAlign = 'center'; ctx.fillText(tag.toUpperCase().split('').join(String.fromCharCode(8202, 8202)), W / 2, 330 + fs * .55 + 20); } }
    else { var s2 = 200; tile(70, H / 2 - s2 / 2 - 14, s2, init, c); var f = words(name, 78, 70 + s2 + 40, H / 2 + 6, c, 'left', W - (70 + s2 + 40) - 50); if (tag) { ctx.fillStyle = '#6B6785'; ctx.font = '700 21px "Courier New",monospace'; ctx.textAlign = 'left'; ctx.fillText(tag.toUpperCase().split('').join(String.fromCharCode(8202, 8202)), 70 + s2 + 40, H / 2 + 6 + 40); } }
    ctx.fillStyle = '#B4AFCB'; ctx.font = '600 15px Poppins,Arial,sans-serif'; ctx.textAlign = 'right'; ctx.fillText('Concept preview by Max_imum Designs', W - 20, H - 18);
  }
  function seg(id, key) { var box = $('#' + id); if (!box) return; $$('button', box).forEach(function (b) { b.addEventListener('click', function () { st[key] = b.dataset.v; $$('button', box).forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); draw(); react(); }); }); }
  var rt, lines = ['Ooh, nice name!', 'That looks great in this style.', 'I like that one. Try another colour!', 'Now that is a brand.'];
  function react() { clearTimeout(rt); rt = setTimeout(function () { if (window.__mini) M.say($('#minibub'), lines[Math.floor(Math.random() * lines.length)], window.__mini, 16); }, 700); }
  if (cv) {
    var sw = $('#swatch'); Object.keys(PAL).forEach(function (k, n) { var b = document.createElement('button'); b.type = 'button'; b.title = k; b.setAttribute('aria-label', k + ' palette'); b.setAttribute('aria-pressed', n === 0); b.style.background = 'linear-gradient(135deg,' + PAL[k][0] + ' 50%,' + PAL[k][1 === 1 && PAL[k][1] !== '#FFFFFF' ? 1 : 3] + ' 50%)'; b.addEventListener('click', function () { st.pal = k; $$('button', sw).forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); draw(); react(); }); sw.appendChild(b); });
    seg('lay', 'layout'); seg('fnt', 'font'); ['bn', 'bt'].forEach(function (id) { $('#' + id).addEventListener('input', function () { draw(); react(); }); });
    $('#dl').addEventListener('click', function () { draw(); cv.toBlob(function (b) { var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'logo-preview-' + ($('#bn').value || 'concept').replace(/\W+/g, '-').toLowerCase() + '.png'; a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000); }); });
    function lmsg() { return 'Hi Max_imum Designs, I tried the logo preview for "' + ($('#bn').value || 'my business') + '" (palette: ' + st.pal + ', layout: ' + st.layout + ', style: ' + st.font + '). I\'d like a proper logo designed.'; }
    var lw = $('#lwa'); function updl() { lw.href = M.wl(lmsg()); } lw.addEventListener('click', updl); lw.addEventListener('focus', updl); updl(); document.addEventListener('input', updl);
    if (document.fonts && document.fonts.load) document.fonts.load('700 40px Poppins').then(draw); draw();
  }
  /* ---- quote builder ---- */
  var qb = $('#qlist'), qty = {}, flat = {};
  if (qb && window.PRICES) {
    Object.keys(window.PRICES).forEach(function (cat, ci) {
      var d = document.createElement('details'); if (ci === 0) d.open = true; var sm = document.createElement('summary'); sm.textContent = cat; sm.style.cssText = 'font-weight:700;cursor:pointer;padding:10px 0;color:#5B2EFF'; d.appendChild(sm);
      window.PRICES[cat].forEach(function (p) { var id = 'q' + Object.keys(flat).length; flat[id] = { n: p[0], p: p[2], cat: cat, d: p[1] }; qty[id] = 0; var row = document.createElement('div'); row.className = 'opt'; row.style.cssText = 'display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:10px;';
        row.innerHTML = '<div style="flex:1"><b>' + p[0] + '</b><div style="font-size:13px;color:#6B6785">' + p[1] + '</div></div><span class="p" style="font-weight:700;color:#5B2EFF;white-space:nowrap">' + fmt(p[2]) + (cat === 'Monthly retainers' ? '/mo' : '') + '</span><div style="display:flex;align-items:center;gap:6px"><button type="button" aria-label="Fewer ' + p[0] + '" data-d="-1" data-i="' + id + '" style="width:34px;height:34px;border-radius:50%;border:2px solid #D8CFFF;background:#fff;font-size:18px;cursor:pointer">\u2212</button><output id="o' + id + '" style="min-width:20px;text-align:center;font-weight:700">0</output><button type="button" aria-label="More ' + p[0] + '" data-d="1" data-i="' + id + '" style="width:34px;height:34px;border-radius:50%;border:2px solid #5B2EFF;background:#5B2EFF;color:#fff;font-size:18px;cursor:pointer">+</button></div>'; d.appendChild(row); });
      qb.appendChild(d);
    });
    qb.addEventListener('click', function (e) { var b = e.target.closest('button[data-i]'); if (!b) return; var id = b.dataset.i, v = Math.max(0, Math.min(20, qty[id] + +b.dataset.d)); if (flat[id].cat === 'Monthly retainers' && v > 1) v = 1; qty[id] = v; $('#o' + id).textContent = v; calc(); });
    ['launch', 'rush', 'qn'].forEach(function (id) { $('#' + id).addEventListener('input', calc); });
    function calc() {
      var items = Object.keys(qty).filter(function (k) { return qty[k] > 0 && flat[k].cat !== 'Monthly retainers'; }), ret = Object.keys(qty).filter(function (k) { return qty[k] > 0 && flat[k].cat === 'Monthly retainers'; }), sub = 0, lines = '';
      items.forEach(function (k) { var t = qty[k] * flat[k].p; sub += t; lines += '<li><span>' + (qty[k] > 1 ? qty[k] + ' \u00d7 ' : '') + flat[k].n + '</span><span>' + fmt(t) + '</span></li>'; });
      var disc = 0, why = ''; if (sub > 0 && items.length >= 3) { disc = sub * .1; why = '10% off for booking 3 or more services'; } if ($('#launch').checked && sub > 0) { disc = sub * .1; why = 'Launch offer: 10% off (not combined with the 3-service discount)'; }
      var after = sub - disc, rush = $('#rush').checked && sub > 0 ? Math.max(500, after * .3) : 0, tot = after + rush; var rl = ret.map(function (k) { return '<li><span>' + flat[k].n + ' retainer</span><span>' + fmt(flat[k].p) + '/mo</span></li>'; }).join('');
      $('#lines').innerHTML = (lines || '<li><span>Pick what you need on the left</span><span></span></li>') + (disc ? '<li style="color:#C6F432"><span>' + why + '</span><span>\u2212' + fmt(disc) + '</span></li>' : '') + (rush ? '<li><span>Rush delivery (24 hours)</span><span>+' + fmt(rush) + '</span></li>' : '') + rl;
      $('#tot').textContent = fmt(tot); $('#usd').textContent = tot ? 'about US$' + Math.round(tot / RATE) + (ret.length ? ' + retainer per month' : '') : (ret.length ? 'Retainer billed monthly' : '');
      var n = ($('#qn').value || '').trim().replace(/[<>]/g, ''), m = 'Hi Max_imum Designs, ' + (n ? 'I\'m ' + n + '. ' : '') + 'here is my estimate from the quote builder:\n' + items.map(function (k) { return '- ' + (qty[k] > 1 ? qty[k] + ' x ' : '') + flat[k].n + ' (' + fmt(qty[k] * flat[k].p) + ')'; }).concat(ret.map(function (k) { return '- ' + flat[k].n + ' retainer (' + fmt(flat[k].p) + '/month)'; })).join('\n') + (disc ? '\nDiscount: ' + why : '') + (rush ? '\nRush delivery: yes' : '') + '\nEstimated total: ' + fmt(tot) + '. Please send me a written quote.'; var a = $('#qwa'); a.href = (items.length || ret.length) ? M.wl(m) : M.wl('Hi Max_imum Designs, I would like a quote.'); window.__qm = m;
    }
    calc();
  }
  /* mini Max on the tools page */
  var mx = $('#minimax'); if (mx && M) { window.__mini = M.create(mx); M.say($('#minibub'), 'Hi, I\'m <b>Max</b>! Play with the tools below. Nothing you type is sent anywhere unless you tap a WhatsApp button.', window.__mini, 14); }
  var h = (location.hash || '').replace('#', ''); show(h === 'quote' ? 'quote' : 'logo');
})();
