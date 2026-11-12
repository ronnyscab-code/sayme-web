/* Canalización: tuberías EMT y PVC con coplas, abrazaderas en riel, caja de paso y conduit flexible. data-scene="canal" */
SAYME3D.scene('canal', { fov: 36, z: 14, rot: [.2, -.5, 0], wide: { x: -.2, y: -.3, s: 1.2 }, narrow: { x: -.2, y: -.8, s: .8 }, sway: .1 }, function (root, ctx) {
  var S = SAYME3D;
  var steel = new THREE.MeshStandardMaterial({ color: 0xb4bec4, metalness: .95, roughness: .34, bumpMap: S.noiseBump(2, 8), bumpScale: .12 });
  var steelBright = new THREE.MeshStandardMaterial({ color: 0xd3dade, metalness: 1, roughness: .22 });
  var galv = new THREE.MeshStandardMaterial({ color: 0xa9b3b9, metalness: .9, roughness: .4, bumpMap: S.noiseBump(4, 4), bumpScale: .25 });
  var dark = new THREE.MeshStandardMaterial({ color: 0x14181b, roughness: .6, metalness: .3 });
  var pvc = new THREE.MeshPhysicalMaterial({ color: 0x8e979d, roughness: .5, clearcoat: .3 });

  /* caja de paso galvanizada */
  var box = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.7, 1.4), galv); box.position.set(2.7, 0, 0); root.add(box);
  var lid = new THREE.Mesh(new THREE.BoxGeometry(2.62, 2.82, .1), steelBright); lid.position.set(2.7, 0, .75); root.add(lid);
  [[-1.1, -1.2], [1.1, -1.2], [-1.1, 1.2], [1.1, 1.2]].forEach(function (p) {
    var sc = new THREE.Mesh(new THREE.CylinderGeometry(.09, .09, .06, 6), dark); sc.rotation.x = Math.PI / 2; sc.position.set(2.7 + p[0], p[1], .83); root.add(sc);
  });
  var kn = new THREE.Mesh(new THREE.TorusGeometry(.38, .02, 8, 32), dark); kn.position.set(2.7, 0, .81); root.add(kn);

  /* tres tuberías que entran por el lado izquierdo de la caja */
  var rows = [{ y: .85, m: steel, r: .34, name: 'emt' }, { y: -.05, m: pvc, r: .4, name: 'pvc' }, { y: -.95, m: steel, r: .34, name: 'emt' }];
  var LEFT = -3.6, RIGHT = 1.45;
  rows.forEach(function (rw) {
    var t = new THREE.Mesh(new THREE.CylinderGeometry(rw.r, rw.r, RIGHT - LEFT, 48), rw.m); t.rotation.z = Math.PI / 2; t.position.set((LEFT + RIGHT) / 2, rw.y, 0); root.add(t);
    /* tuerca de sujeción en la caja */
    var ln = new THREE.Mesh(new THREE.CylinderGeometry(rw.r + .13, rw.r + .13, .12, 6), steelBright); ln.rotation.z = Math.PI / 2; ln.position.set(1.42, rw.y, 0); root.add(ln);
    /* copla con tornillos de fijación */
    var cp = new THREE.Mesh(new THREE.CylinderGeometry(rw.r + .09, rw.r + .09, .6, 48), rw.name === 'pvc' ? new THREE.MeshPhysicalMaterial({ color: 0x9aa3a9, roughness: .45, clearcoat: .3 }) : steelBright);
    cp.rotation.z = Math.PI / 2; cp.position.set(-1.0, rw.y, 0); root.add(cp);
    [-.2, .2].forEach(function (dx) {
      var rg = new THREE.Mesh(new THREE.TorusGeometry(rw.r + .09, .03, 8, 40), rw.name === 'pvc' ? pvc : steelBright); rg.rotation.y = Math.PI / 2; rg.position.set(-1.0 + dx * 1.3, rw.y, 0); root.add(rg);
      var sw = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, .1, 6), dark); sw.position.set(-1.0 + dx, rw.y + rw.r + .1, 0); root.add(sw);
    });
    /* boquilla de cierre y cables que salen */
    var bu = new THREE.Mesh(new THREE.TorusGeometry(rw.r - .03, .06, 10, 32), new THREE.MeshStandardMaterial({ color: 0xf1f1ee, roughness: .5 })); bu.rotation.y = Math.PI / 2; bu.position.set(LEFT - .02, rw.y, 0); root.add(bu);
  });
  var cabCols = [0x1b5fbf, 0xe6b422, 0x2a9a3f, 0xf0f0ee, 0xe8781a];
  rows.forEach(function (rw, i) {
    for (var k = 0; k < 2; k++) {
      var z = (k - .5) * .24, col = cabCols[(i * 2 + k) % cabCols.length];
      var cur = new THREE.CatmullRomCurve3([new THREE.Vector3(LEFT + .5, rw.y + (k - .5) * .1, z), new THREE.Vector3(LEFT - .3, rw.y + (k - .5) * .12, z * 1.6), new THREE.Vector3(LEFT - 1.1, rw.y - .15 - k * .1, z * 3), new THREE.Vector3(LEFT - 1.7, rw.y - .5 - k * .2, z * 4)]);
      root.add(new THREE.Mesh(new THREE.TubeGeometry(cur, 30, .055, 8, false), new THREE.MeshPhysicalMaterial({ color: col, roughness: .4, clearcoat: .4 })));
    }
  });

  /* riel (unistrut) y abrazaderas */
  [-2.7, -.1].forEach(function (x) {
    var rail = new THREE.Mesh(new THREE.BoxGeometry(.42, 3.1, .22), galv); rail.position.set(x, 0, -.5); root.add(rail);
    for (var s = 0; s < 8; s++) { var sl = new THREE.Mesh(new THREE.BoxGeometry(.2, .06, .02), dark); sl.position.set(x, -1.3 + s * .37, -.385); root.add(sl); }
    rows.forEach(function (rw) {
      var st = new THREE.Mesh(new THREE.TorusGeometry(rw.r + .05, .05, 10, 28, Math.PI), steelBright); st.rotation.z = Math.PI; st.rotation.y = Math.PI / 2; st.position.set(x, rw.y, 0); root.add(st);
      var tab = new THREE.Mesh(new THREE.BoxGeometry(.4, .07, .08), steelBright); tab.position.set(x, rw.y, -.38); root.add(tab);
    });
  });

  /* conduit flexible negro que sube desde la caja */
  var flexCur = new THREE.CatmullRomCurve3([new THREE.Vector3(2.7, 1.3, 0), new THREE.Vector3(2.7, 2.1, .0), new THREE.Vector3(2.2, 2.7, -.1), new THREE.Vector3(1.0, 3.0, -.2), new THREE.Vector3(-.6, 2.9, -.3)]);
  var ribs = document.createElement('canvas'); ribs.width = 8; ribs.height = 64; var rg = ribs.getContext('2d');
  for (var y = 0; y < 64; y++) { var v = 90 + Math.round(120 * Math.abs(Math.sin(y / 64 * Math.PI * 2))); rg.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')'; rg.fillRect(0, y, 8, 1); }
  var rt = new THREE.CanvasTexture(ribs); rt.wrapS = rt.wrapT = THREE.RepeatWrapping; rt.repeat.set(1, 30);
  var flex = new THREE.Mesh(new THREE.TubeGeometry(flexCur, 160, .3, 24, false), new THREE.MeshStandardMaterial({ color: 0x1c2024, roughness: .55, bumpMap: rt, bumpScale: 1.6 }));
  root.add(flex);
  var gland = new THREE.Mesh(new THREE.CylinderGeometry(.42, .42, .3, 6), steelBright); gland.position.set(2.7, 1.38, 0); root.add(gland);

  /* destellos que recorren las tuberías */
  var NP = 40, pp = new Float32Array(NP * 3), pd = [];
  for (var i = 0; i < NP; i++) pd.push({ r: i % 3, t: Math.random(), s: .12 + Math.random() * .2 });
  var pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
  root.add(new THREE.Points(pg, new THREE.PointsMaterial({ color: 0x2fd3c0, size: .07, map: S.dot(), alphaTest: .3, transparent: true, opacity: .9, depthWrite: false })));
  return function (dt) {
    for (var k = 0; k < NP; k++) {
      var q = pd[k]; if (!S.reduce) q.t += dt * q.s; if (q.t > 1) q.t = 0;
      pp[k * 3] = LEFT - .4 + q.t * (RIGHT - LEFT + .8); pp[k * 3 + 1] = rows[q.r].y; pp[k * 3 + 2] = rows[q.r].r + .02;
    }
    pg.attributes.position.needsUpdate = true;
  };
});
