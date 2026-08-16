/* Menu di navigazione per schermi stretti, comune a tutti i mockup.
   Legge le voci del <nav> già presente nella pagina e costruisce un pannello
   a scomparsa. Nessuna dipendenza, chiude con Esc o toccando fuori. */
(function () {
  var nav = document.querySelector('header nav');
  if (!nav) return;

  var css = document.createElement('style');
  css.textContent = [
    '.mnav-btn{display:none;margin-left:auto;align-items:center;gap:9px;background:none;border:1px solid currentColor;',
      'color:inherit;font:600 12px/1 ui-monospace,monospace;letter-spacing:.16em;text-transform:uppercase;',
      'padding:13px 15px;border-radius:3px;cursor:pointer}',
    '.mnav-btn span{display:block;width:16px;height:10px;position:relative}',
    '.mnav-btn span::before,.mnav-btn span::after{content:"";position:absolute;left:0;right:0;height:2px;background:currentColor}',
    '.mnav-btn span::before{top:0}.mnav-btn span::after{bottom:0}',
    '.mnav-panel{display:none;position:fixed;inset:0;z-index:200;background:rgba(6,9,13,.62);backdrop-filter:blur(3px)}',
    '.mnav-panel[open]{display:block}',
    '.mnav-sheet{position:absolute;top:0;right:0;bottom:0;width:min(340px,86vw);background:#121820;color:#fff;',
      'padding:26px 24px;display:flex;flex-direction:column;gap:6px;box-shadow:-20px 0 60px rgba(0,0,0,.45)}',
    '.mnav-sheet a{color:#fff;text-decoration:none;font:600 20px/1.2 system-ui,sans-serif;padding:16px 0;',
      'border-bottom:1px solid rgba(255,255,255,.14)}',
    '.mnav-sheet a:hover{color:#F4B223}',
    '.mnav-close{align-self:flex-end;background:none;border:0;color:#A7B0BA;font:600 12px/1 ui-monospace,monospace;',
      'letter-spacing:.18em;text-transform:uppercase;cursor:pointer;padding:10px 0 22px}',
    '.mnav-tel{margin-top:auto;display:flex;align-items:center;justify-content:center;text-align:center;min-height:54px;',
      'padding:12px 14px;background:#F4B223;color:#121820;font:700 14px/1.3 system-ui,sans-serif;',
      'text-decoration:none;border-radius:3px;word-break:break-word}',
    /* sotto i 960px l'unico comando dell'intestazione è Menu: telefono e pulsanti
       vivono dentro il pannello, altrimenti spingono fuori la testata */
    '@media(max-width:960px){',
      '.mnav-btn{display:inline-flex}',
      'header .tel,header .head-tel,header .pill,header .btn,header .head-cta{display:none!important}',
    '}'
  ].join('');
  document.head.appendChild(css);

  var links = [].slice.call(nav.querySelectorAll('a')).map(function (a) {
    return { href: a.getAttribute('href'), text: a.textContent.trim() };
  });

  var btn = document.createElement('button');
  btn.className = 'mnav-btn';
  btn.type = 'button';
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<span aria-hidden="true"></span>Menu';
  nav.parentNode.insertBefore(btn, nav.nextSibling);

  var panel = document.createElement('div');
  panel.className = 'mnav-panel';
  panel.innerHTML =
    '<div class="mnav-sheet">' +
      '<button class="mnav-close" type="button">Chiudi ✕</button>' +
      links.map(function (l) { return '<a href="' + l.href + '">' + l.text + '</a>'; }).join('') +
      '<a class="mnav-tel" href="contatti.html">Richiedi un trasporto</a>' +
    '</div>';
  document.body.appendChild(panel);

  function open(state) {
    if (state) panel.setAttribute('open', ''); else panel.removeAttribute('open');
    btn.setAttribute('aria-expanded', state ? 'true' : 'false');
    document.body.style.overflow = state ? 'hidden' : '';
  }
  btn.addEventListener('click', function () { open(true); });
  panel.addEventListener('click', function (e) {
    if (e.target === panel || e.target.classList.contains('mnav-close') || e.target.tagName === 'A') open(false);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') open(false); });
})();
