(function () {
  var b = document.getElementById('banner'); if (!b) return;
  var t = b.querySelector('.bn-track'), slides = b.querySelectorAll('.bn-slide'), dots = b.querySelectorAll('.bn-dots button');
  if (slides.length < 2) return;
  var i = 0, timer = null, paused = false;
  function go(n) { i = (n + slides.length) % slides.length; t.scrollTo({ left: i * t.clientWidth, behavior: 'smooth' }); mark(); }
  function mark() { for (var k = 0; k < dots.length; k++) dots[k].classList.toggle('on', k === i); }
  b.querySelector('.bn-prev').addEventListener('click', function () { go(i - 1); });
  b.querySelector('.bn-next').addEventListener('click', function () { go(i + 1); });
  for (var k = 0; k < dots.length; k++) (function (n) { dots[n].addEventListener('click', function () { go(n); }); })(k);
  t.addEventListener('scroll', function () { var n = Math.round(t.scrollLeft / t.clientWidth); if (n !== i) { i = n; mark(); } });
  window.addEventListener('resize', function () { t.scrollTo({ left: i * t.clientWidth }); });
  b.addEventListener('mouseenter', function () { paused = true; }); b.addEventListener('mouseleave', function () { paused = false; });
  b.addEventListener('focusin', function () { paused = true; }); b.addEventListener('focusout', function () { paused = false; });
  if (!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    timer = setInterval(function () { if (!paused && !document.hidden) go(i + 1); }, 6500);
  }
  mark();
})();
