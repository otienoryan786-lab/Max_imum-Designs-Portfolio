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
  // The chat runs locally; use WhatsApp when a visitor needs a person.
  var guide = $('#site-guide-panel'), guideToggle = $('#guide-toggle'), guideClose = $('#guide-close');
  var guideMessages = $('#guide-messages'), guideForm = $('#guide-form'), guideInput = $('#guide-input');
  var guideQuick = guide.querySelectorAll('[data-message]');
  var waLink = 'https://wa.me/' + WA + '?text=';
  function addGuideMessage(text, sender, action) {
    var message = document.createElement('div');
    message.className = 'guide-message ' + (sender === 'visitor' ? 'from-visitor' : 'from-max');
    var name = document.createElement('span');
    name.className = 'guide-message-name';
    name.textContent = sender === 'visitor' ? 'You' : 'Max';
    var bubble = document.createElement('p');
    bubble.className = 'guide-bubble';
    bubble.textContent = text;
    message.appendChild(name);
    message.appendChild(bubble);
    if (action) {
      var link = document.createElement('a');
      link.className = 'guide-message-link';
      link.href = action.href;
      link.textContent = action.label;
      if (/^https:\/\//.test(action.href)) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
      link.addEventListener('click', function () {
        if (action.href.charAt(0) === '#') closeGuide(false);
      });
      message.appendChild(link);
    }
    guideMessages.appendChild(message);
    guideMessages.scrollTop = guideMessages.scrollHeight;
  }
  function getGuideReply(message) {
    var text = message.toLowerCase();
    if (/\b(hi|hello|hey|jambo|habari)\b/.test(text)) {
      return { text: 'Hi! I can help you explore design services, prices, timelines, and the portfolio. What are you working on?' };
    }
    if (/\b(service|services|what do you do|offer|offers|design help)\b/.test(text)) {
      return { text: 'We create logos and brand identities, social media designs, print materials, pitch decks, company profiles, and monthly design retainers.', action: { label: 'Explore all services', href: '#services' } };
    }
    if (/\b(price|prices|cost|costs|how much|budget|kes|logo starter)\b/.test(text)) {
      return { text: 'Prices are in KES. Logo packages start at KES 4,500 (Starter), KES 8,500 (Standard), and KES 15,000 (Premium). Every project gets a written quote before work begins.', action: { label: 'See the full price list', href: '#prices' } };
    }
    if (/\b(time|timeline|long|take|fast|delivery|deliver|deadline|rush)\b/.test(text)) {
      return { text: 'Typical timelines: social posts 24–48 hours, logos 3–7 days, and brand kits 10–21 days. Rush delivery may be available for an extra 30% (minimum KES 500).', action: { label: 'Ask about your deadline', href: '#contact' } };
    }
    if (/\b(portfolio|work|project|projects|example|examples|see)\b/.test(text)) {
      return { text: 'Take a look at selected concept and brand projects in the portfolio.', action: { label: 'Explore the portfolio', href: 'portfolio.html' } };
    }
    if (/\b(process|steps|start|begin|how it works)\b/.test(text)) {
      return { text: 'It’s simple: share a brief, get a written quote, review the concepts, request revisions, then receive your final files. A 50% deposit starts most projects.', action: { label: 'See the five steps', href: '#process' } };
    }
    if (/\b(pay|payment|mpesa|m-pesa|deposit|bank|revision|revisions|edit|changes)\b/.test(text)) {
      return { text: 'Payment is by M-Pesa or bank transfer. Most projects start with a 50% deposit; work under KES 3,000 is paid in full. Most designs include 2 revision rounds (logos get 3).' };
    }
    if (/\b(contact|human|person|ryan|whatsapp|talk|speak|someone)\b/.test(text)) {
      return { text: 'For a real conversation with Ryan, WhatsApp is the quickest way to reach the designer.', action: { label: 'Chat with Ryan on WhatsApp', href: waLink + encodeURIComponent('Hello Max_imum Designs! I have a question about a design project.') } };
    }
    if (/\b(quote|quotation|hire|book|order|need|my business)\b/.test(text)) {
      return { text: 'Tell us a little about your project and we’ll prepare a free quote. You can send it on WhatsApp or by email.', action: { label: 'Request a free quote', href: '#contact' } };
    }
    return { text: 'I can help with services, prices, timelines, payments, or finding work in the portfolio. For a personal answer, message Ryan directly on WhatsApp.', action: { label: 'Chat with Ryan on WhatsApp', href: waLink + encodeURIComponent('Hello Max_imum Designs! I have a question about a design project.') } };
  }
  function sendGuideMessage(text) {
    var cleaned = text.trim();
    if (!cleaned || guideForm.elements.message.disabled) return;
    addGuideMessage(cleaned, 'visitor');
    guideInput.value = '';
    guideForm.elements.message.disabled = true;
    guideForm.querySelector('button[type="submit"]').disabled = true;
    guideQuick.forEach(function (button) { button.disabled = true; });
    var typing = document.createElement('div');
    typing.className = 'guide-message from-max guide-typing';
    typing.setAttribute('role', 'status');
    typing.textContent = 'Max is thinking';
    guideMessages.appendChild(typing);
    guideMessages.scrollTop = guideMessages.scrollHeight;
    window.setTimeout(function () {
      typing.remove();
      var reply = getGuideReply(cleaned);
      addGuideMessage(reply.text, 'max', reply.action);
      guideForm.elements.message.disabled = false;
      guideForm.querySelector('button[type="submit"]').disabled = false;
      guideQuick.forEach(function (button) { button.disabled = false; });
      guideInput.focus();
    }, 550);
  }
  function showGuideWelcome() {
    if (!guideMessages.childElementCount) {
      addGuideMessage('Hi! I’m Max, an automated guide to the services, prices, and work on this site. Ask me anything to get started.', 'max');
    }
  }
  function closeGuide(returnFocus) {
    guide.hidden = true;
    guideToggle.setAttribute('aria-expanded', 'false');
    guideToggle.setAttribute('aria-label', 'Open chat with Max');
    if (returnFocus) guideToggle.focus();
  }
  guideToggle.addEventListener('click', function () {
    var opening = guide.hidden;
    guide.hidden = !opening;
    guideToggle.setAttribute('aria-expanded', opening);
    guideToggle.setAttribute('aria-label', opening ? 'Close chat with Max' : 'Open chat with Max');
    if (opening) {
      showGuideWelcome();
      guideClose.focus();
    }
  });
  guideClose.addEventListener('click', function () { closeGuide(true); });
  guideForm.addEventListener('submit', function (e) {
    e.preventDefault();
    sendGuideMessage(guideInput.value);
  });
  guideQuick.forEach(function (button) {
    button.addEventListener('click', function () { sendGuideMessage(button.dataset.message); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !guide.hidden) closeGuide(true);
  });
  $('#yr').textContent = new Date().getFullYear();
  // Reveal key content as it enters view, without hiding anything when motion is reduced.
  var motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!motionPreference.matches && 'IntersectionObserver' in window) {
    var revealTargets = document.querySelectorAll('.welcome-copy, .welcome-art, .offer-card, section > .wrap > .eyebrow, section > .wrap > h2, section > .wrap > .sub, .card, .work figure, .steps > div, .about > *, .contact > *, .cbox');
    revealTargets.forEach(function (el, i) {
      el.setAttribute('data-reveal', '');
      el.style.setProperty('--reveal-delay', (i % 3) * 90 + 'ms');
    });
    document.body.classList.add('motion-ready');
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  }
  var heroArt = $('.welcome-art');
  if (heroArt && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !motionPreference.matches) {
    heroArt.addEventListener('pointermove', function (e) {
      var bounds = heroArt.getBoundingClientRect();
      var x = (e.clientX - bounds.left) / bounds.width - 0.5;
      var y = (e.clientY - bounds.top) / bounds.height - 0.5;
      heroArt.style.setProperty('--tilt-x', (x * 4).toFixed(2) + 'deg');
      heroArt.style.setProperty('--tilt-y', (y * -4).toFixed(2) + 'deg');
    });
    heroArt.addEventListener('pointerleave', function () {
      heroArt.style.setProperty('--tilt-x', '0deg');
      heroArt.style.setProperty('--tilt-y', '0deg');
    });
  }
  if (!motionPreference.matches) {
    var progressFrame = 0;
    function updateProgress() {
      var scrollable = document.documentElement.scrollHeight - window.innerHeight;
      var progress = scrollable > 0 ? window.scrollY / scrollable * 100 : 0;
      document.documentElement.style.setProperty('--scroll-progress', progress + '%');
      progressFrame = 0;
    }
    window.addEventListener('scroll', function () {
      if (!progressFrame) progressFrame = window.requestAnimationFrame(updateProgress);
    }, { passive: true });
    updateProgress();
  }
})();
