/* Equipamiento TI: laptop con teclado, pantalla animada y bisagra. data-scene="equipo" */
SAYME3D.scene('equipo', { fov: 34, z: 13, rot: [.2, -.55, 0], wide: { x: 1.4, y: -.3, s: 1.69 }, narrow: { x: 0, y: -1.0, s: 1.17 }, sway: .07, spin: .05 }, function (root, ctx) {
  var S = SAYME3D;
  var alu = new THREE.MeshPhysicalMaterial({ color: 0xb9c2c8, metalness: .95, roughness: .3, clearcoat: .2, bumpMap: S.noiseBump(8, 8), bumpScale: .05 });
  var W = 5.2, D = 3.5, T = .16;
  var base = new THREE.Mesh(new THREE.ExtrudeGeometry(S.roundRect(W, D, .2), { depth: T, bevelEnabled: true, bevelThickness: .03, bevelSize: .03, bevelSegments: 4 }), alu);
  base.rotation.x = -Math.PI / 2; base.position.y = -T; root.add(base);
  /* teclado */
  var keyMat = new THREE.MeshPhysicalMaterial({ color: 0x1a232e, roughness: .45, clearcoat: .2 });
  var kb = new THREE.Mesh(new THREE.BoxGeometry(4.5, .02, 1.7), new THREE.MeshStandardMaterial({ color: 0x0b0f14, roughness: .8 })); kb.position.set(0, .02, -.45); root.add(kb);
  var keys = new THREE.InstancedMesh(new THREE.BoxGeometry(.27, .09, .27), keyMat, 14 * 5), m4 = new THREE.Matrix4(), n = 0;
  for (var r = 0; r < 5; r++) for (var c = 0; c < 14; c++) { m4.setPosition(-2.0 + c * .31, .07, -1.15 + r * .33); keys.setMatrixAt(n++, m4); }
  keys.instanceMatrix.needsUpdate = true; root.add(keys);
  var sp = new THREE.Mesh(new THREE.BoxGeometry(2.4, .09, .27), keyMat); sp.position.set(0, .07, .52 + .1); root.add(sp);
  var tp = new THREE.Mesh(new THREE.BoxGeometry(1.5, .02, .95), new THREE.MeshStandardMaterial({ color: 0x9ea8af, metalness: .8, roughness: .3 })); tp.position.set(0, .01, 1.12); root.add(tp);
  /* puertos laterales (RJ45 + USB) */
  var pm = new THREE.MeshStandardMaterial({ color: 0x05070a }); [-.9, -.2, .5].forEach(function (z) { var p = new THREE.Mesh(new THREE.BoxGeometry(.05, .14, .4), pm); p.position.set(W / 2 + .02, -.02, z); root.add(p); });
  /* tapa */
  var lid = new THREE.Group(); lid.position.set(0, .0, -D / 2 + .1); root.add(lid);
  var shell = new THREE.Mesh(new THREE.ExtrudeGeometry(S.roundRect(W, 3.4, .2), { depth: .12, bevelEnabled: true, bevelThickness: .02, bevelSize: .02, bevelSegments: 3 }), alu);
  shell.position.set(0, 1.7, -.0); lid.add(shell);
  var bez = new THREE.Mesh(new THREE.PlaneGeometry(W - .25, 3.15), new THREE.MeshBasicMaterial({ color: 0x05070a })); bez.position.set(0, 1.7, .15); lid.add(bez);
  /* pantalla */
  var cv = document.createElement('canvas'); cv.width = 1024; cv.height = 640; var g = cv.getContext('2d');
  var tex = new THREE.CanvasTexture(cv); tex.encoding = THREE.sRGBEncoding; tex.anisotropy = 8;
  var screen = new THREE.Mesh(new THREE.PlaneGeometry(W - .5, 2.88), new THREE.MeshBasicMaterial({ map: tex })); screen.position.set(0, 1.7, .155); lid.add(screen);
  var cam = new THREE.Mesh(new THREE.CircleGeometry(.04, 16), new THREE.MeshBasicMaterial({ color: 0x1b2a3a })); cam.position.set(0, 3.28, .16); lid.add(cam);
  var logo = new THREE.Mesh(new THREE.CircleGeometry(.2, 32), new THREE.MeshBasicMaterial({ color: 0x0f9688, transparent: true, opacity: .0 })); logo.position.set(0, 1.7, -.01); lid.add(logo);
  lid.rotation.x = -.42;
  var frame = 0, t0 = 0, bars = []; for (var i = 0; i < 40; i++) bars.push(Math.random());
  function draw(t) {
    g.fillStyle = '#0d1b2e'; g.fillRect(0, 0, 1024, 640);
    g.fillStyle = '#14263f'; g.fillRect(0, 0, 1024, 70); g.fillStyle = '#2fd3c0'; g.font = '700 38px "Big Shoulders Display",sans-serif'; g.fillText('SAYME  ·  MONITOR DE RED', 28, 48);
    g.fillStyle = '#6b7a8c'; g.font = '500 20px "JetBrains Mono",monospace'; g.fillText('SW-CORE-01 · 24 PUERTOS · 1G/10G', 28, 108);
    for (var i = 0; i < 40; i++) { var v = .3 + .55 * Math.abs(Math.sin(t * .7 + i * .5 + bars[i] * 6)); var h = v * 300; g.fillStyle = i % 5 === 0 ? '#0f9688' : '#2fd3c0'; g.globalAlpha = .85; g.fillRect(40 + i * 23, 520 - h, 15, h); }
    g.globalAlpha = 1; g.strokeStyle = 'rgba(255,255,255,.1)'; for (var y = 0; y < 5; y++) { g.beginPath(); g.moveTo(30, 520 - y * 75); g.lineTo(990, 520 - y * 75); g.stroke(); }
    g.fillStyle = '#e8eef3'; g.font = '700 54px "Big Shoulders Display",sans-serif'; g.fillText((9.4 + Math.sin(t) * .3).toFixed(1) + ' Gbps', 700, 150);
    g.fillStyle = '#1bd76a'; g.beginPath(); g.arc(710, 188, 8, 0, 6.3); g.fill(); g.fillStyle = '#9fb2c4'; g.font = '500 22px "JetBrains Mono",monospace'; g.fillText('ENLACES ACTIVOS 24/24', 728, 196);
    tex.needsUpdate = true;
  }
  draw(0);
  return function (dt, now) {
    t0 += S.reduce ? 0 : dt; frame++; if (frame % 3 === 0) draw(t0);
    var target = ctx.hover ? -.28 : -.42; lid.rotation.x += (target - lid.rotation.x) * .06;
  };
});
