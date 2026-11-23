/* Cable de fibra óptica 3D. Uso: <canvas data-scene="cable"></canvas> */
(function () {
  var canvas = document.querySelector('canvas[data-scene="cable"]');
  if (!canvas || !window.THREE) return;
  var S = SAYME3D, reduce = S.reduce;
  var T = S.make(canvas, 36, 13), renderer = T.renderer, scene = T.scene, camera = T.camera;
  S.env(renderer, scene);

  function rnd(a) { return Math.random() * a; }
  function jacketMaps() {
    var W = 512, H = 2048, c = document.createElement('canvas'); c.width = W; c.height = H; var x = c.getContext('2d');
    x.fillStyle = '#1b3356'; x.fillRect(0, 0, W, H);
    for (var i = 0; i < 6000; i++) { x.fillStyle = Math.random() < .5 ? 'rgba(255,255,255,' + rnd(.03) + ')' : 'rgba(0,0,0,' + rnd(.06) + ')'; x.fillRect(rnd(W), rnd(H), 1 + rnd(2), 1 + rnd(2)); }
    var txt = 'SAYME  |  FIBRA OPTICA MONOMODO OS2 9/125  |  12 FO  |  ';
    [W * .22, W * .72].forEach(function (u) {
      x.save(); x.translate(u, H); x.rotate(-Math.PI / 2); x.fillStyle = '#e9eff3'; x.font = '600 25px "JetBrains Mono",monospace';
      x.fillText(txt + txt + txt + txt, 16, 0); x.restore();
    });
    var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = 8;
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(-1, -1); t.offset.set(1, 1);
    var b = document.createElement('canvas'); b.width = b.height = 256; var bx = b.getContext('2d');
    bx.fillStyle = '#808080'; bx.fillRect(0, 0, 256, 256);
    for (i = 0; i < 9000; i++) { var v = 110 + Math.floor(rnd(60)); bx.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')'; bx.fillRect(rnd(256), rnd(256), 1 + rnd(2), 1 + rnd(2)); }
    var bt = new THREE.CanvasTexture(b); bt.wrapS = bt.wrapT = THREE.RepeatWrapping; bt.repeat.set(3, 14);
    return { map: t, bump: bt };
  }

  var obj = new THREE.Group(); scene.add(obj);
  var M = jacketMaps();

  var jacket = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 5.2, 96, 1, true),
    new THREE.MeshPhysicalMaterial({ map: M.map, bumpMap: M.bump, bumpScale: .07, roughness: .46, metalness: 0, clearcoat: .4, clearcoatRoughness: .55, side: THREE.DoubleSide }));
  jacket.rotation.z = Math.PI / 2; jacket.position.x = -2.6; obj.add(jacket);
  var rim = new THREE.Mesh(new THREE.RingGeometry(1.0, 1.15, 96), new THREE.MeshStandardMaterial({ color: 0x14284a, roughness: .7, side: THREE.DoubleSide }));
  rim.rotation.y = Math.PI / 2; obj.add(rim);
  var tape = new THREE.Mesh(new THREE.CylinderGeometry(.98, .98, 1.5, 64, 1, true), new THREE.MeshStandardMaterial({ color: 0xb9b295, roughness: .9, side: THREE.DoubleSide }));
  tape.rotation.z = Math.PI / 2; tape.position.x = .35; obj.add(tape);
  var frp = new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, 3.4, 24), new THREE.MeshStandardMaterial({ color: 0xdfe3e5, roughness: .55 }));
  frp.rotation.z = Math.PI / 2; frp.position.x = .7; obj.add(frp);
  var frpTip = new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, .02, 24), new THREE.MeshStandardMaterial({ color: 0xcfd6da, roughness: .8 }));
  frpTip.rotation.z = Math.PI / 2; frpTip.position.x = 2.41; obj.add(frpTip);

  var yarnMat = new THREE.MeshStandardMaterial({ color: 0xd4a92f, roughness: .9 });
  for (var y = 0; y < 90; y++) {
    var a = rnd(Math.PI * 2), r0 = .62 + rnd(.34), L = .9 + rnd(1.1), pts = [];
    for (var k = 0; k <= 4; k++) {
      var u = k / 4, rr = r0 + u * u * (.25 + rnd(.35)), aa = a + u * (rnd(.8) - .4);
      pts.push(new THREE.Vector3(.1 + u * L, Math.cos(aa) * rr, Math.sin(aa) * rr));
    }
    obj.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 14, .011 + rnd(.006), 4, false), yarnMat));
  }

  var glowTex = S.glow();
  var cols = [0x0b49b8, 0xe0720c, 0x1f8a38, 0x6a3b1e, 0x76808a, 0xe8e8e4, 0xc02a26, 0x1a1d20]; /* colores estándar TIA-598 */
  var NT = cols.length, pivots = [];
  for (var i = 0; i < NT; i++) {
    var th = i / NT * Math.PI * 2, pv = new THREE.Group();
    pv.position.set(-.35, Math.cos(th) * .6, Math.sin(th) * .6);
    var tube = new THREE.Mesh(new THREE.CylinderGeometry(.19, .19, 2.7, 28), new THREE.MeshPhysicalMaterial({ color: cols[i], roughness: .38, clearcoat: .35, clearcoatRoughness: .3 }));
    tube.rotation.z = Math.PI / 2; tube.position.x = 1.35; pv.add(tube);
    var coat = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, 4.1, 14), new THREE.MeshStandardMaterial({ color: cols[i], roughness: .35 }));
    coat.rotation.z = Math.PI / 2; coat.position.x = 2.05; pv.add(coat);
    var glass = new THREE.Mesh(new THREE.CylinderGeometry(.016, .016, 1.2, 10), new THREE.MeshStandardMaterial({ color: 0xcff7f1, emissive: 0x2fd3c0, emissiveIntensity: 1.1, roughness: .1 }));
    glass.rotation.z = Math.PI / 2; glass.position.x = 4.2; pv.add(glass);
    var tip = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false }));
    tip.scale.set(.5, .5, 1); tip.position.x = 4.72; pv.add(tip);
    obj.add(pv); pivots.push({ g: pv, th: th, tip: tip, ph: rnd(6) });
  }

  var NP = 110, pp = new Float32Array(NP * 3), pd = [];
  for (i = 0; i < NP; i++) pd.push({ k: Math.floor(Math.random() * NT), t: Math.random(), s: .2 + Math.random() * .4 });
  var pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
  obj.add(new THREE.Points(pg, new THREE.PointsMaterial({ color: 0x2fd3c0, size: .07, map: S.dot(), alphaTest: .3, transparent: true, opacity: .9, depthWrite: false })));

  obj.rotation.set(0, -.5, .1);
  var spread = .25, spreadT = .25, mx = 0, my = 0, roll = 0, drag = false, lx = 0, extra = 0;
  var layout = {
    wide: { x: +canvas.dataset.x || 2.7, y: +canvas.dataset.y || -.3, s: +canvas.dataset.s || .74 },
    narrow: { x: -.1, y: +canvas.dataset.ny || -2.5, s: +canvas.dataset.ns || .5 }
  };
  function resize() {
    var w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    var L = w > 820 ? layout.wide : layout.narrow;
    obj.scale.setScalar(L.s); obj.position.set(L.x, L.y, 0);
  }
  addEventListener('resize', resize); resize();
  if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas);
  canvas.addEventListener('pointerenter', function () { spreadT = 1; });
  canvas.addEventListener('pointerleave', function () { spreadT = .25; });
  canvas.addEventListener('pointerdown', function (e) { drag = true; lx = e.clientX; });
  addEventListener('pointerup', function () { drag = false; });
  addEventListener('pointermove', function (e) {
    mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5;
    if (drag) { extra += (e.clientX - lx) * .01; lx = e.clientX; }
  });

  var ax = new THREE.Vector3();
  S.loop(canvas, function (dt, now) {
    if (!reduce) roll += dt * .18;
    spread += (spreadT - spread) * .06;
    obj.rotation.x = roll + extra;
    obj.rotation.y += ((-.5 + mx * .3) - obj.rotation.y) * .05;
    obj.rotation.z += ((.1 - my * .18) - obj.rotation.z) * .05;
    pivots.forEach(function (p) {
      ax.set(0, -Math.sin(p.th), Math.cos(p.th));
      p.g.quaternion.setFromAxisAngle(ax, spread * .26);
      var sc = .5 * (.85 + .15 * Math.sin(now * .003 + p.ph)) * (.85 + spread * .35);
      p.tip.scale.set(sc, sc, 1);
    });
    for (var k = 0; k < NP; k++) {
      var q = pd[k]; if (!reduce) q.t += dt * q.s; if (q.t > 1) q.t = 0;
      var p = pivots[q.k], ang = spread * .26, Ld = 4.35 + q.t * 2.2, lift = Math.sin(ang) * Ld;
      pp[k * 3] = -.35 + Math.cos(ang) * Ld; pp[k * 3 + 1] = Math.cos(p.th) * (.6 + lift); pp[k * 3 + 2] = Math.sin(p.th) * (.6 + lift);
    }
    pg.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
  });
})();
