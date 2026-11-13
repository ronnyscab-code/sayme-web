/* Utilidades compartidas para las escenas 3D (cable de fibra y cámara CCTV). Requiere three.min.js (r128). */
window.SAYME3D = (function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function make(canvas, fov, camZ) {
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = .82;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(fov, 1, .1, 100);
    camera.position.set(0, 0, camZ);
    return { renderer: renderer, scene: scene, camera: camera };
  }

  /* Entorno de estudio: cajas de luz que se reflejan en los materiales */
  function env(renderer, scene) {
    var e = new THREE.Scene();
    e.add(new THREE.Mesh(new THREE.SphereGeometry(40, 32, 16), new THREE.MeshBasicMaterial({ color: 0x5d707c, side: THREE.BackSide })));
    function box(w, h, pos, k, tint) {
      var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(tint || 0xffffff).multiplyScalar(k), side: THREE.DoubleSide }));
      m.position.set(pos[0], pos[1], pos[2]); m.lookAt(0, 0, 0); e.add(m);
    }
    box(16, 9, [-9, 11, 9], 3.4);
    box(4, 18, [14, 2, -7], 3, 0xcfeee9);
    box(18, 5, [0, -9, 11], .8);
    box(10, 10, [10, 6, 10], 1.1);
    var pm = new THREE.PMREMGenerator(renderer);
    scene.environment = pm.fromScene(e, .02).texture;
    pm.dispose();
    scene.add(new THREE.AmbientLight(0xffffff, .18));
    var key = new THREE.DirectionalLight(0xffffff, .55); key.position.set(-4, 6, 7); scene.add(key);
  }

  function glowTexture() {
    var c = document.createElement('canvas'); c.width = c.height = 128; var g = c.getContext('2d');
    var r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, 'rgba(120,255,235,.95)'); r.addColorStop(.3, 'rgba(15,150,136,.4)'); r.addColorStop(1, 'rgba(15,150,136,0)');
    g.fillStyle = r; g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }
  function dotTexture() {
    var c = document.createElement('canvas'); c.width = c.height = 32; var g = c.getContext('2d');
    g.fillStyle = '#fff'; g.beginPath(); g.arc(16, 16, 14, 0, 7); g.fill();
    return new THREE.CanvasTexture(c);
  }

  /* Bucle de animación que se detiene cuando el canvas no está a la vista */
  function loop(canvas, step) {
    var visible = true, last = performance.now();
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: 0 }).observe(canvas);
    }
    function frame(now) {
      var dt = Math.min((now - last) / 1000, .05); last = now;
      if (visible) step(dt, now);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  

  /* Textura de funda con texto impreso a lo largo del cable (orientación corregida) */
  function printTex(text, base, ink) {
    var W = 512, H = 2048, c = document.createElement('canvas'); c.width = W; c.height = H; var x = c.getContext('2d');
    x.fillStyle = base; x.fillRect(0, 0, W, H);
    for (var i = 0; i < 6000; i++) { x.fillStyle = Math.random() < .5 ? 'rgba(255,255,255,' + Math.random() * .03 + ')' : 'rgba(0,0,0,' + Math.random() * .06 + ')'; x.fillRect(Math.random() * W, Math.random() * H, 1 + Math.random() * 2, 1 + Math.random() * 2); }
    [W * .22, W * .72].forEach(function (u) {
      x.save(); x.translate(u, H); x.rotate(-Math.PI / 2); x.fillStyle = ink; x.font = '600 25px "JetBrains Mono",monospace'; x.fillText(text + text + text + text, 16, 0); x.restore();
    });
    var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = 8;
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(-1, -1); t.offset.set(1, 1);
    return t;
  }
  function noiseBump(rx, ry) {
    var b = document.createElement('canvas'); b.width = b.height = 256; var g = b.getContext('2d');
    g.fillStyle = '#808080'; g.fillRect(0, 0, 256, 256);
    for (var i = 0; i < 9000; i++) { var v = 110 + Math.floor(Math.random() * 60); g.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')'; g.fillRect(Math.random() * 256, Math.random() * 256, 1 + Math.random() * 2, 1 + Math.random() * 2); }
    var t = new THREE.CanvasTexture(b); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx || 3, ry || 14); return t;
  }
  function roundRect(w, h, r) {
    var s = new THREE.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r);
    s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s;
  }

  /* Escena genérica: crea renderer, entorno, grupo raíz, ajuste responsivo, seguimiento del cursor y arrastre.
     name = valor de data-scene. o = {fov,z,rot:[x,y,z],wide:{x,y,s},narrow:{x,y,s},follow,sway,spin}.
     build(root, ctx) arma el objeto y devuelve opcionalmente una función update(dt, now, ctx). */
  function scene(name, o, build) {
    var canvas = document.querySelector('canvas[data-scene="' + name + '"]');
    if (!canvas || !window.THREE) return;
    var T = make(canvas, o.fov || 36, o.z || 13); env(T.renderer, T.scene);
    var root = new THREE.Group(); T.scene.add(root);
    var rot = o.rot || [0, 0, 0];
    var ctx = { canvas: canvas, renderer: T.renderer, scene: T.scene, camera: T.camera, root: root, mx: 0, my: 0, t: 0, hover: false, hv: 0, extra: 0 };
    var update = build(root, ctx) || function () {};
    function resize() {
      var w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
      T.renderer.setSize(w, h, false); T.camera.aspect = w / h; T.camera.updateProjectionMatrix();
      var L = w > (o.bp || 560) ? (o.wide || { x: 0, y: 0, s: 1 }) : (o.narrow || o.wide || { x: 0, y: 0, s: .7 });
      root.scale.setScalar(L.s); root.position.set(L.x, L.y, 0);
    }
    addEventListener('resize', resize); resize();
    if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas);
    canvas.addEventListener('pointerenter', function () { ctx.hover = true; });
    canvas.addEventListener('pointerleave', function () { ctx.hover = false; });
    var drag = false, lx = 0;
    canvas.addEventListener('pointerdown', function (e) { drag = true; lx = e.clientX; });
    addEventListener('pointerup', function () { drag = false; });
    addEventListener('pointermove', function (e) {
      ctx.mx = e.clientX / innerWidth - .5; ctx.my = e.clientY / innerHeight - .5;
      if (drag) { ctx.extra += (e.clientX - lx) * .01; lx = e.clientX; }
    });
    var spin = 0;
    loop(canvas, function (dt, now) {
      ctx.t += dt; ctx.hv += ((ctx.hover ? 1 : 0) - ctx.hv) * .06;
      if (o.spin && !reduce) spin += dt * o.spin;
      var follow = o.follow === undefined ? .3 : o.follow, sway = reduce ? 0 : (o.sway === undefined ? .12 : o.sway);
      root.rotation.x += ((rot[0] + ctx.my * follow * .5 + (o.spinX && !reduce ? spin : 0)) - root.rotation.x) * .05;
      root.rotation.y += ((rot[1] + ctx.mx * follow + Math.sin(ctx.t * .35) * sway + (o.spin && !o.spinX ? spin : 0) + ctx.extra) - root.rotation.y) * .05;
      root.rotation.z = rot[2];
      update(dt, now, ctx);
      T.renderer.render(T.scene, T.camera);
    });
    return ctx;
  }

  return { printTex: printTex, noiseBump: noiseBump, roundRect: roundRect, scene: scene, reduce: reduce, make: make, env: env, glow: glowTexture, dot: dotTexture, loop: loop };
})();
