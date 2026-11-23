/* Certificación de un punto de red: certificador Fluke (emisor) + unidad remota (receptor), mapa de cableado y resultado PASS. data-scene="fluke" */
SAYME3D.scene('fluke', { fov: 34, z: 15, rot: [.3, -.12, 0], wide: { x: .5, y: .1, s: 1.4 }, narrow: { x: 0, y: -.5, s: 1.0 }, sway: .04 }, function (root, ctx) {
  var S = SAYME3D, V = THREE.Vector3;
  var yellow = new THREE.MeshPhysicalMaterial({ color: 0xf5c400, roughness: .45, clearcoat: .5, clearcoatRoughness: .4 });
  var rubber = new THREE.MeshStandardMaterial({ color: 0x15181c, roughness: .85 });
  var steel = new THREE.MeshStandardMaterial({ color: 0xc9d0d4, metalness: .95, roughness: .28 });
  var darkM = new THREE.MeshStandardMaterial({ color: 0x05070a, roughness: .9 });

  /* mesa */
  var bench = new THREE.Mesh(new THREE.BoxGeometry(11.4, .25, 4.4), new THREE.MeshPhysicalMaterial({ color: 0x14263f, metalness: .3, roughness: .5, clearcoat: .4 }));
  bench.position.y = -2.15; root.add(bench);

  function unit(big) {
    var g = new THREE.Group(), W = big ? 2.3 : 1.7, H = big ? 4.0 : 2.5, D = .55;
    var shell = new THREE.Mesh(new THREE.ExtrudeGeometry(S.roundRect(W, H, .3), { depth: D, bevelEnabled: true, bevelThickness: .08, bevelSize: .08, bevelSegments: 5 }), rubber);
    shell.position.z = -D / 2; g.add(shell);
    var inner = new THREE.Mesh(new THREE.ExtrudeGeometry(S.roundRect(W - .3, H - .3, .22), { depth: D + .06, bevelEnabled: true, bevelThickness: .05, bevelSize: .05, bevelSegments: 4 }), yellow);
    inner.position.z = -D / 2 + .02; g.add(inner);
    var bezel = new THREE.Mesh(new THREE.BoxGeometry(W - .6, big ? 1.9 : 0, .02), darkM); bezel.position.set(0, big ? .55 : 0, D / 2 + .13); if (big) g.add(bezel);
    /* conector RJ45 superior */
    var port = new THREE.Mesh(new THREE.BoxGeometry(.5, .22, .5), darkM); port.position.set(0, H / 2 - .05, 0); g.add(port);
    g.userData.W = W; g.userData.H = H; g.userData.D = D; return g;
  }
  /* emisor (principal) */
  var main = unit(true); main.position.set(-3.9, -.1, 0); root.add(main);
  var cv = document.createElement('canvas'); cv.width = 800; cv.height = 880; var g = cv.getContext('2d');
  var tex = new THREE.CanvasTexture(cv); tex.encoding = THREE.sRGBEncoding; tex.anisotropy = 8;
  var screen = new THREE.Mesh(new THREE.PlaneGeometry(1.88, 2.07), new THREE.MeshBasicMaterial({ map: tex })); screen.position.set(0, .55, main.userData.D / 2 + .145); main.add(screen);
  /* teclas */
  for (var r = 0; r < 2; r++) for (var c = 0; c < 3; c++) { var k = new THREE.Mesh(new THREE.CylinderGeometry(.19, .19, .08, 20), rubber); k.rotation.x = Math.PI / 2; k.position.set((c - 1) * .55, -1.15 - r * .5, main.userData.D / 2 + .1); main.add(k); }
  var tp = new THREE.Mesh(new THREE.BoxGeometry(1.2, .2, .04), new THREE.MeshBasicMaterial({ color: 0x1bd76a })); tp.position.set(0, -1.75, main.userData.D / 2 + .12); main.add(tp);
  var ml = (function () { var c2 = document.createElement('canvas'); c2.width = 512; c2.height = 128; var x = c2.getContext('2d'); x.fillStyle = '#15181c'; x.font = '900 70px "Big Shoulders Display",Arial'; x.textAlign = 'center'; x.fillText('FLUKE', 256, 92); var t = new THREE.CanvasTexture(c2); t.encoding = THREE.sRGBEncoding; return t; })();
  var tag = new THREE.Mesh(new THREE.PlaneGeometry(.9, .22), new THREE.MeshBasicMaterial({ map: ml, transparent: true })); tag.position.set(0, 1.78, main.userData.D / 2 + .125); main.add(tag);

  /* receptor (remoto) */
  var rem = unit(false); rem.position.set(3.9, -.9, 0); root.add(rem);
  var rl = new THREE.Mesh(new THREE.CircleGeometry(.13, 20), new THREE.MeshBasicMaterial({ color: 0x1bd76a })); rl.position.set(0, .55, rem.userData.D / 2 + .13); rem.add(rl);
  var rl2 = new THREE.Mesh(new THREE.BoxGeometry(.9, .45, .02), darkM); rl2.position.set(0, -.1, rem.userData.D / 2 + .13); rem.add(rl2);
  var rtag = new THREE.Mesh(new THREE.PlaneGeometry(.8, .2), new THREE.MeshBasicMaterial({ map: ml, transparent: true })); rtag.position.set(0, -.75, rem.userData.D / 2 + .125); rem.add(rtag);
  var rlab = (function () { var c2 = document.createElement('canvas'); c2.width = 512; c2.height = 128; var x = c2.getContext('2d'); x.fillStyle = '#14263f'; x.font = '700 44px "JetBrains Mono",monospace'; x.textAlign = 'center'; x.fillText('RECEPTOR', 256, 80); var t = new THREE.CanvasTexture(c2); var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthTest: false })); s.scale.set(2, .5, 1); return s; })();
  rlab.position.set(3.9, 1.0, .4); root.add(rlab);
  var mlab = rlab.clone(); mlab.material = rlab.material.clone(); mlab.material.map = (function () { var c2 = document.createElement('canvas'); c2.width = 512; c2.height = 128; var x = c2.getContext('2d'); x.fillStyle = '#14263f'; x.font = '700 44px "JetBrains Mono",monospace'; x.textAlign = 'center'; x.fillText('EMISOR', 256, 80); return new THREE.CanvasTexture(c2); })(); mlab.position.set(-3.9, 2.35, .4); root.add(mlab);

  /* patch panel (izq.) y roseta (der.) */
  var pp = new THREE.Mesh(new THREE.BoxGeometry(1.6, .45, .5), new THREE.MeshStandardMaterial({ color: 0x2b3340, metalness: .6, roughness: .4 })); pp.position.set(-1.35, -1.2, 0); root.add(pp);
  for (var i = 0; i < 6; i++) { var pj = new THREE.Mesh(new THREE.BoxGeometry(.18, .16, .04), darkM); pj.position.set(-1.9 + i * .22, -1.2, .27); root.add(pj); }
  var wp = new THREE.Mesh(new THREE.BoxGeometry(.9, 1.0, .12), new THREE.MeshPhysicalMaterial({ color: 0xf0f2f2, roughness: .4, clearcoat: .6 })); wp.position.set(1.35, -.95, -.2); root.add(wp);
  var wj = new THREE.Mesh(new THREE.BoxGeometry(.3, .26, .06), darkM); wj.position.set(1.35, -.95, -.12); root.add(wj);

  /* cables: patch cords amarillos + enlace permanente azul */
  function tube(pts, col, rad) { var cur = new THREE.CatmullRomCurve3(pts); root.add(new THREE.Mesh(new THREE.TubeGeometry(cur, 60, rad || .06, 10, false), new THREE.MeshPhysicalMaterial({ color: col, roughness: .4, clearcoat: .5 }))); return cur; }
  tube([new V(-3.9, 1.95, 0), new V(-3.9, 2.9, .2), new V(-2.6, 2.7, .6), new V(-2.1, -.4, .6), new V(-1.9, -1.15, .3)], 0x1b62c4, .07);
  var perm = tube([new V(-.9, -1.2, .27), new V(-.3, -1.6, .8), new V(.5, -1.7, .8), new V(1.2, -1.15, .1), new V(1.35, -.95, -.05)], 0x1b62c4, .07);
  tube([new V(1.35, -.95, .0), new V(2.0, -.2, .6), new V(3.0, 1.9, .8), new V(3.9, .55, .0)], 0x1b62c4, .07);

  /* pulso de test viajando por el enlace */
  var pulse = new THREE.Sprite(new THREE.SpriteMaterial({ map: S.glow(), color: 0x2fd3c0, transparent: true, opacity: .95, depthWrite: false, blending: THREE.AdditiveBlending })); pulse.scale.set(.9, .9, 1); root.add(pulse);

  var T = ['#e8781a', '#f6e6d4', '#2f9d45', '#1b62c4', '#e3ecf9', '#6b4326', '#e9dfd5', '#6b4326'];
  var PIN = [['#ffffff', '#e8781a'], ['#e8781a', '#e8781a'], ['#ffffff', '#2f9d45'], ['#1b62c4', '#1b62c4'], ['#ffffff', '#1b62c4'], ['#2f9d45', '#2f9d45'], ['#ffffff', '#6b4326'], ['#6b4326', '#6b4326']];
  var WC = ['#f4a35a', '#e8781a', '#5ad077', '#4b8df0', '#9cbcf5', '#2f9d45', '#b98458', '#6b4326'];
  function draw(t) {
    var W = 800, H = 880; g.fillStyle = '#0b1522'; g.fillRect(0, 0, W, H);
    g.fillStyle = '#14263f'; g.fillRect(0, 0, W, 90); g.fillStyle = '#e8eef3'; g.font = '700 44px "Barlow",Arial'; g.fillText('CERTIFICACIÓN · CAT 6A', 34, 62);
    g.fillStyle = '#6b7a8c'; g.font = '500 30px "JetBrains Mono",monospace'; g.fillText('PUNTO A-014 · ENLACE PERM.', 34, 138);
    var ph = Math.max(0, t % 9), prog = Math.min(1, ph / 3.2), done = ph >= 3.2;
    /* mapa de cableado */
    g.fillStyle = '#9fb2c4'; g.font = '700 34px "JetBrains Mono",monospace'; g.fillText('MAPA DE CABLEADO', 34, 198);
    var x0 = 150, x1 = 650, y0 = 250, dy = 52;
    for (var i = 0; i < 8; i++) {
      var y = y0 + i * dy, ok = done || prog > i / 8;
      g.fillStyle = '#9fb2c4'; g.font = '700 30px "JetBrains Mono",monospace'; g.fillText(String(i + 1), 96, y + 10); g.fillText(String(i + 1), 690, y + 8);
      g.strokeStyle = ok ? WC[i] : '#2a3a50'; g.lineWidth = 9; g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke();
      if (ok) { g.strokeStyle = '#1bd76a'; g.lineWidth = 3; g.beginPath(); g.moveTo(x0, y - 9); g.lineTo(x1, y - 9); g.stroke(); }
      g.fillStyle = ok ? '#1bd76a' : '#2a3a50'; g.beginPath(); g.arc(x0, y, 8, 0, 6.3); g.arc(x1, y, 8, 0, 6.3); g.fill();
    }
    /* estado */
    if (!done) {
      g.fillStyle = '#16314d'; g.fillRect(34, 705, 732, 38); g.fillStyle = '#2fd3c0'; g.fillRect(34, 705, 732 * prog, 38);
      g.fillStyle = '#e8eef3'; g.font = '700 40px "Barlow",Arial'; g.fillText('PROBANDO…  ' + Math.round(prog * 100) + '%', 34, 800);
    } else {
      g.fillStyle = '#1bd76a'; g.fillRect(34, 690, 732, 110); g.fillStyle = '#04210f'; g.font = '900 110px "Big Shoulders Display",Arial'; g.fillText('✓  PASS', 200, 775);
      g.fillStyle = '#9fb2c4'; g.font = '700 32px "JetBrains Mono",monospace'; g.fillText('62 m · CABLEADO OK', 34, 848);
    }
    tex.needsUpdate = true; if (mir) mir.drawImage(cv, 0, 0);
  }
  var mc = document.querySelector('canvas[data-fluke-screen]'), mir = mc ? mc.getContext('2d') : null;
  var t0 = 0, fr = 0; draw(0);
  return function (dt) {
    t0 += S.reduce ? 0 : dt; fr++; if (fr % 3 === 0) draw(t0);
    var ph = t0 % 9, active = ph < 3.2;
    pulse.visible = active; if (active) { var u = Math.min(.999, Math.max(.001, (ph * 1.3) % 1)); if (isFinite(u)) pulse.position.copy(perm.getPointAt(u)); }
    rl.material.color.setHex(active ? 0xffd25e : 0x1bd76a);
  };
});
