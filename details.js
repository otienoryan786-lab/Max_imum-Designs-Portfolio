(function () {
  var B = window.BUSINESS || {};
  document.querySelectorAll('[data-detail]').forEach(function (el) { var v = B[el.getAttribute('data-detail')]; if (v) el.textContent = v; });
  document.querySelectorAll('[data-need]').forEach(function (el) { if (!B[el.getAttribute('data-need')]) el.hidden = true; });
  var parts = [];
  if (B.registered_name) parts.push('Registered business name: ' + B.registered_name);
  if (B.registration_no) parts.push('Registration no. ' + B.registration_no);
  if (B.address) parts.push(B.address);
  document.querySelectorAll('[data-reg]').forEach(function (el) { if (parts.length) el.textContent = parts.join('  ·  '); else el.hidden = true; });
})();
