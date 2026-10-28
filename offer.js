/* LAUNCH OFFER BANNER: edit this file to change, pause or end the banner shown at the top of the site.
   Set active:false to hide it. The banner also hides itself after the "ends" date. */
window.OFFER = { active: true, text: "Launch offer: 10% off for our first 5 clients, plus a free Brand Health Check.", cta: "Claim it", link: "index.html#contact", ends: "2026-12-31" };
(function () {
  var o = window.OFFER; if (!o || !o.active) return; if (document.body && document.body.hasAttribute('data-nobanner')) return; if (o.ends && new Date() > new Date(o.ends + "T23:59:59")) return;
  var d = document.createElement("div"); d.className = "offerbar"; d.setAttribute("role", "region"); d.setAttribute("aria-label", "Offer");
  var s = document.createElement("span"); s.textContent = o.text + " "; var a = document.createElement("a"); a.href = o.link; a.textContent = o.cta + " \u2192"; d.appendChild(s); d.appendChild(a);
  document.addEventListener("DOMContentLoaded", function () { if (document.body.hasAttribute("data-nobanner")) return; document.body.insertBefore(d, document.body.firstChild); });
})();
