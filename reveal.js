/* Rivelazione allo scorrimento + ombra della testata, comune ai tre siti.
   Senza JavaScript la pagina resta interamente visibile: lo stato nascosto
   esiste solo sotto html.js. Con animazioni ridotte non si attiva nulla. */
(function () {
  var doc = document.documentElement;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  doc.classList.add('js');

  var targets = [];
  [].forEach.call(document.querySelectorAll('section'), function (s) {
    if (!s.querySelector('h1')) targets.push(s);       // l'apertura entra da sola
  });
  [].forEach.call(document.querySelectorAll('.pg > .wrap > *'), function (e) {
    targets.push(e);                                    // pagine interne: a blocchi
  });

  targets.forEach(function (e) { e.classList.add('rv'); });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (e) { io.observe(e); });
  }

  /* rete di sicurezza: qualunque cosa succeda, dopo un attimo si vede tutto */
  setTimeout(function () {
    targets.forEach(function (e) { e.classList.add('in'); });
  }, 1600);

  var head = document.querySelector('header');
  if (head) {
    var onScroll = function () {
      head.classList.toggle('scrolled', (window.scrollY || 0) > 10);
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
