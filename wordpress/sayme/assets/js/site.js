/* Comportamiento común: menú móvil, botón de WhatsApp, formulario de contacto, inclinación 3D de tarjetas. */
(function () {
  var C = window.SAYME_CONFIG || {};

  /* menú móvil */
  var tog = document.getElementById('navToggle'), nav = document.getElementById('nav');
  if (tog && nav) {
    tog.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      tog.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* enlaces de WhatsApp: todos los que tengan data-wa */
  function waUrl(text) { return 'https://wa.me/' + (C.whatsapp || '') + '?text=' + encodeURIComponent(text || C.whatsappMensaje || ''); }
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    var t = a.getAttribute('data-wa'); a.href = waUrl(t === '1' || t === '' ? C.whatsappMensaje : t);
    a.target = '_blank'; a.rel = 'noopener';
  });
  document.querySelectorAll('[data-mail]').forEach(function (a) { a.href = 'mailto:' + (C.email || ''); a.textContent = a.textContent || C.email; });

  /* inclinación 3D en tarjetas */
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.tilt').forEach(function (c) {
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        c.style.setProperty('--ry', (x * 9) + 'deg'); c.style.setProperty('--rx', (-y * 9) + 'deg');
      });
      c.addEventListener('pointerleave', function () { c.style.setProperty('--ry', '0deg'); c.style.setProperty('--rx', '0deg'); });
    });
  }

  /* formulario de contacto */
  var form = document.getElementById('contactForm');
  if (!form) return;
  var status = document.getElementById('formStatus');
  var params = new URLSearchParams(location.search);
  if (params.get('servicio') && form.servicio) form.servicio.value = params.get('servicio');

  function say(msg, ok) { status.textContent = msg; status.className = 'form-status ' + (ok ? 'ok' : 'err'); }
  function data() {
    var d = {}; new FormData(form).forEach(function (v, k) { d[k] = String(v).trim(); }); return d;
  }
  function valid(d) {
    if (!d.nombre) { say('Escribe tu nombre.', false); form.nombre.focus(); return false; }
    if (!/^\S+@\S+\.\S+$/.test(d.email || '')) { say('Revisa tu correo electrónico.', false); form.email.focus(); return false; }
    if (!d.mensaje) { say('Cuéntanos brevemente qué necesitas.', false); form.mensaje.focus(); return false; }
    return true;
  }
  function texto(d) {
    return 'Hola SAYME, soy ' + d.nombre + (d.empresa ? ' de ' + d.empresa : '') + '.\n' +
      (d.servicio ? 'Servicio de interés: ' + d.servicio + '.\n' : '') + d.mensaje +
      '\nCorreo: ' + d.email + (d.telefono ? '\nTeléfono: ' + d.telefono : '');
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = data(); if (d.web) return; /* campo trampa para robots */
    if (!valid(d)) return;
    if (C.formEndpoint) {
      say('Enviando…', true);
      fetch(C.formEndpoint, { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(d) })
        .then(function (r) { if (!r.ok) throw 0; form.reset(); say('Recibimos tu solicitud. Te responderemos a la brevedad.', true); })
        .catch(function () { say('No pudimos enviar el formulario. Escríbenos por WhatsApp o a ' + C.email + '.', false); });
    } else {
      location.href = 'mailto:' + C.email + '?subject=' + encodeURIComponent('Solicitud de cotización' + (d.servicio ? ': ' + d.servicio : '')) + '&body=' + encodeURIComponent(texto(d));
      say('Se abrió tu programa de correo con el mensaje listo. Si no se abrió, escríbenos a ' + C.email + '.', true);
    }
  });
  var wa = document.getElementById('formWa');
  if (wa) wa.addEventListener('click', function () {
    var d = data(); if (!valid(d)) return;
    window.open(waUrl(texto(d)), '_blank', 'noopener');
  });
})();
