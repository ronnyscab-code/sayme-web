/* Ventana de vista previa de LinkedIn.
   - Botón flotante (sobre el de WhatsApp) y cualquier enlace con el atributo data-linkedin abren la ventana.
   - La ventana muestra una tarjeta con los datos de la página de empresa y un botón que lleva a LinkedIn.
   - LinkedIn no permite incrustar su página dentro de otra (bloquea los iframes), por eso es una tarjeta propia.
   - El enlace se cambia en assets/js/config.js (linkedinUrl). Sin JavaScript, los enlaces igual llevan a LinkedIn. */
(function () {
  var C = window.SAYME_CONFIG || {};
  var URL_LI = C.linkedinUrl || 'https://www.linkedin.com/company/145458774/';
  var COVER = C.linkedinPortada || '';   /* opcional: ruta a la portada real de LinkedIn, ej. assets/img/linkedin-portada.jpg */

  /* ---------- estilos (autocontenidos para que funcione igual en todas las páginas) ---------- */
  var css = '' +
    '.li-fab{position:fixed;right:20px;bottom:84px;z-index:60;display:flex;align-items:center;gap:10px;background:#0a66c2;color:#fff;border:0;cursor:pointer;font:500 1rem/1 Barlow,system-ui,sans-serif;padding:13px 18px 13px 14px;border-radius:999px;box-shadow:0 14px 30px -10px rgba(10,102,194,.6);transition:transform .2s,background .2s}' +
    '.li-fab:hover{transform:translateY(-3px);background:#004182}' +
    '.li-fab svg{width:28px;height:28px;fill:#fff}' +
    '.li-ov{position:fixed;inset:0;z-index:100;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(20,38,63,.62);backdrop-filter:blur(3px)}' +
    '.li-ov.open{display:flex;animation:li-in .22s ease-out}' +
    '@keyframes li-in{from{opacity:0}to{opacity:1}}' +
    '.li-card{position:relative;width:100%;max-width:560px;max-height:calc(100vh - 40px);overflow:auto;background:#fff;border-radius:14px;box-shadow:0 30px 70px -20px rgba(0,0,0,.55);color:#14263f;font-family:Barlow,system-ui,sans-serif;animation:li-up .26s ease-out}' +
    '@keyframes li-up{from{transform:translateY(14px)}to{transform:none}}' +
    '.li-cover{height:130px;background:linear-gradient(120deg,#14263f 0%,#1f3a5f 45%,#0f9688 100%);background-size:cover;background-position:center;position:relative;overflow:hidden;border-radius:14px 14px 0 0}' +
    '.li-cover svg{position:absolute;inset:0;width:100%;height:100%;opacity:.35}' +
    '.li-x{position:absolute;top:10px;right:10px;width:36px;height:36px;border-radius:50%;border:0;background:rgba(255,255,255,.92);color:#14263f;font-size:1.35rem;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:2}' +
    '.li-x:hover{background:#fff}' +
    '.li-body{padding:0 26px 26px}' +
    '.li-logo{width:88px;height:88px;margin-top:-44px;background:#fff;border:1px solid #c9d6df;border-radius:10px;display:flex;align-items:center;justify-content:center;padding:8px;position:relative}' +
    '.li-logo img{max-width:100%;height:auto}' +
    '.li-name{margin-top:14px;font:900 1.9rem/1 "Big Shoulders Display",Impact,sans-serif;text-transform:uppercase;letter-spacing:.01em;color:#1f3a5f}' +
    '.li-tag{margin-top:6px;color:#445468;font-size:1.02rem}' +
    '.li-meta{margin-top:8px;display:flex;flex-wrap:wrap;gap:4px 14px;font:.74rem "JetBrains Mono",ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#6b7a8c}' +
    '.li-about{margin-top:18px;padding-top:16px;border-top:1px solid #e3ebf0;color:#445468;font-size:.98rem}' +
    '.li-chips{margin-top:14px;display:flex;flex-wrap:wrap;gap:8px}' +
    '.li-chips span{font:.7rem "JetBrains Mono",ui-monospace,monospace;letter-spacing:.07em;text-transform:uppercase;color:#0b6b61;background:#eef6f5;border:1px solid #cfe5e1;border-radius:999px;padding:6px 12px}' +
    '.li-act{margin-top:22px;display:flex;flex-wrap:wrap;gap:10px;align-items:center}' +
    '.li-go{display:inline-flex;align-items:center;gap:10px;background:#0a66c2;color:#fff;text-decoration:none;font:500 .78rem "JetBrains Mono",ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;padding:13px 22px;border-radius:999px;transition:background .2s,transform .2s}' +
    '.li-go:hover{background:#004182;transform:translateY(-2px)}' +
    '.li-go svg{width:18px;height:18px;fill:#fff}' +
    '.li-copy{background:none;border:1px solid #c9d6df;color:#1f3a5f;cursor:pointer;font:500 .78rem "JetBrains Mono",ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;padding:12px 18px;border-radius:999px}' +
    '.li-copy:hover{border-color:#0b6b61;color:#0b6b61}' +
    '.li-note{margin-top:12px;font-size:.8rem;color:#6b7a8c}' +
    'body.li-lock{overflow:hidden}' +
    '@media(max-width:700px){.li-fab span{display:none}.li-fab{padding:13px}.li-body{padding:0 18px 20px}.li-name{font-size:1.6rem}}' +
    '@media(prefers-reduced-motion:reduce){.li-ov.open,.li-card{animation:none}.li-fab,.li-go{transition:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------- ícono de LinkedIn ---------- */
  var ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>';

  /* ---------- ventana ---------- */
  var ov = document.createElement('div');
  ov.className = 'li-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-labelledby', 'liTitle');
  ov.innerHTML = '' +
    '<div class="li-card">' +
      '<button type="button" class="li-x" aria-label="Cerrar">&times;</button>' +
      '<div class="li-cover"' + (COVER ? ' style="background-image:url(' + COVER + ')"' : '') + '>' +
        (COVER ? '' : '<svg viewBox="0 0 560 130" preserveAspectRatio="none" fill="none" stroke="#fff" stroke-width="1.2" aria-hidden="true"><path d="M-10 100C90 40 170 130 280 70S470 20 570 60"/><path d="M-10 118C100 64 180 140 290 88S480 40 570 82" opacity=".6"/><path d="M-10 82C80 22 160 112 270 52S460 2 570 42" opacity=".6"/></svg>') +
      '</div>' +
      '<div class="li-body">' +
        '<div class="li-logo"><img src="assets/img/logo-sayme.png" alt="SAYME" width="150" height="25"></div>' +
        '<h2 class="li-name" id="liTitle">Sayme Ltda</h2>' +
        '<p class="li-tag">Infraestructura industrial y tecnológica. Ingeniería, tecnología y experiencia.</p>' +
        '<div class="li-meta"><span>Santiago, Chile</span><span>Desde 2001</span></div>' +
        '<p class="li-about">Diseñamos, instalamos y coordinamos redes de datos, fibra óptica, WiFi, CCTV y control de acceso para empresas de los sectores industrial y comercial, con atención personalizada y foco en la calidad y la seguridad.</p>' +
        '<div class="li-chips"><span>Agroindustria y alimentos</span><span>Servicios financieros</span><span>Energía</span></div>' +
        '<div class="li-act">' +
          '<a class="li-go" href="' + URL_LI + '" target="_blank" rel="noopener noreferrer">' + ICON + 'Ver página en LinkedIn</a>' +
          '<button type="button" class="li-copy">Copiar enlace</button>' +
        '</div>' +
        '<p class="li-note" aria-live="polite">Se abre en una pestaña nueva.</p>' +
      '</div>' +
    '</div>';
  document.body.appendChild(ov);

  var lastFocus = null, closeBtn = ov.querySelector('.li-x'), note = ov.querySelector('.li-note');
  function open(e) {
    if (e) e.preventDefault();
    lastFocus = document.activeElement; ov.classList.add('open'); document.body.classList.add('li-lock');
    ov.querySelector('.li-go').focus();
  }
  function close() {
    ov.classList.remove('open'); document.body.classList.remove('li-lock');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  closeBtn.addEventListener('click', close);
  ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
  document.addEventListener('keydown', function (e) {
    if (!ov.classList.contains('open')) return;
    if (e.key === 'Escape') return close();
    if (e.key === 'Tab') {   /* mantiene el foco dentro de la ventana */
      var f = ov.querySelectorAll('button,a[href]'), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  ov.querySelector('.li-copy').addEventListener('click', function () {
    var ok = function () { note.textContent = 'Enlace copiado.'; };
    if (navigator.clipboard) navigator.clipboard.writeText(URL_LI).then(ok, function () { note.textContent = URL_LI; });
    else note.textContent = URL_LI;
  });

  /* botón flotante */
  var fab = document.createElement('button');
  fab.type = 'button'; fab.className = 'li-fab'; fab.setAttribute('aria-label', 'Ver SAYME en LinkedIn');
  fab.innerHTML = ICON + '<span>LinkedIn</span>';
  fab.addEventListener('click', open);
  document.body.appendChild(fab);

  /* enlaces del sitio (pie de página, etc.): llevan a LinkedIn sin JavaScript, con JavaScript abren la ventana */
  document.querySelectorAll('[data-linkedin]').forEach(function (a) {
    a.href = URL_LI;
    a.addEventListener('click', function (e) { if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) return; open(e); });
  });
})();
