/* Access point de cielo con anillo LED y ondas de señal. data-scene="wifi" */
SAYME3D.scene('wifi', { fov: 34, z: 12, rot: [.55, 0, 0], wide: { x: 1.6, y: .1, s: 1.3 }, narrow: { x: 0, y: -.6, s: .9 }, spin: .25, sway: .05 }, function (root, ctx) {
  var S = SAYME3D;
  var white = new THREE.MeshPhysicalMaterial({ color: 0xf2f4f5, roughness: .38, clearcoat: .6, clearcoatRoughness: .25 });
  /* cuerpo: disco bombeado */
  var pts = [], i;
  for (i = 0; i <= 24; i++) { var a = i / 24 * Math.PI / 2; pts.push(new THREE.Vector2(Math.cos(a) * 2.2, Math.sin(a) * .62 + .02)); }
  var dome = new THREE.Mesh(new THREE.LatheGeometry(pts, 96), white); dome.rotation.x = Math.PI / 2 * 0; root.add(dome);
  var base = new THREE.Mesh(new THREE.CylinderGeometry(2.25, 2.3, .2, 96), new THREE.MeshPhysicalMaterial({ color: 0xdfe3e5, roughness: .45, clearcoat: .3 })); base.position.y = -.08; root.add(base);
  var back = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, .06, 96), new THREE.MeshStandardMaterial({ color: 0x8f989e, metalness: .8, roughness: .35 })); back.position.y = -.2; root.add(back);
  /* anillo LED teal */
  var ledMat = new THREE.MeshBasicMaterial({ color: 0x2fd3c0 });
  var ring = new THREE.Mesh(new THREE.TorusGeometry(1.1, .045, 12, 96), ledMat); ring.rotation.x = Math.PI / 2; ring.position.y = .59; root.add(ring);
  var halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: S.glow(), color: 0x2fd3c0, transparent: true, opacity: .55, depthWrite: false, blending: THREE.AdditiveBlending }));
  halo.scale.set(3.6, 3.6, 1); halo.position.y = .62; root.add(halo);
  /* ranuras de ventilación */
  var slotMat = new THREE.MeshStandardMaterial({ color: 0x1c2630, roughness: .8 });
  for (i = 0; i < 28; i++) {
    var a2 = i / 28 * Math.PI * 2, sl = new THREE.Mesh(new THREE.BoxGeometry(.08, .03, .34), slotMat);
    sl.position.set(Math.cos(a2) * 1.78, .27, Math.sin(a2) * 1.78); sl.rotation.y = -a2; sl.rotation.z = 0; sl.lookAt(0, .27, 0); root.add(sl);
  }
  /* soporte de techo */
  var rail = new THREE.Mesh(new THREE.BoxGeometry(5.4, .1, .24), new THREE.MeshStandardMaterial({ color: 0xcfd5d9, metalness: .7, roughness: .4 })); rail.position.y = -.35; root.add(rail);
  var cab = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0, -.2, 0), new THREE.Vector3(0, -.9, .2), new THREE.Vector3(.6, -1.6, .6), new THREE.Vector3(1.6, -2.1, .4)]), 40, .07, 10, false), new THREE.MeshPhysicalMaterial({ color: 0x1b62c4, roughness: .4, clearcoat: .5 })); root.add(cab);

  /* ondas de señal: anillos expansivos */
  var waves = [];
  for (i = 0; i < 4; i++) {
    var w = new THREE.Mesh(new THREE.RingGeometry(.98, 1.0, 128), new THREE.MeshBasicMaterial({ color: 0x2fd3c0, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }));
    w.rotation.x = -Math.PI / 2; w.position.y = .15; root.add(w); waves.push({ m: w, o: i / 4 });
  }
  /* hemisferio tenue */
  var hemi = new THREE.Mesh(new THREE.SphereGeometry(4.4, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x2fd3c0, wireframe: true, transparent: true, opacity: .06 }));
  hemi.position.y = .1; root.add(hemi);
  /* dispositivos clientes */
  var devs = [];
  [[3.1, 1.2, 1.2], [-2.9, .8, 2.4], [-3.3, 1.5, -1.6], [2.6, .6, -2.8]].forEach(function (p) {
    var d = new THREE.Mesh(new THREE.SphereGeometry(.13, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffffff })); d.position.set(p[0], p[1], p[2]); root.add(d);
    var dh = new THREE.Sprite(new THREE.SpriteMaterial({ map: S.glow(), color: 0x2fd3c0, transparent: true, opacity: .6, depthWrite: false, blending: THREE.AdditiveBlending })); dh.scale.set(.9, .9, 1); dh.position.copy(d.position); root.add(dh);
    devs.push(dh);
  });
  var t0 = 0;
  return function (dt, now) {
    t0 += S.reduce ? 0 : dt;
    waves.forEach(function (w) {
      var p = ((t0 * .28) + w.o) % 1, s = 1 + p * 3.6;
      w.m.scale.set(s, s, s); w.m.material.opacity = (1 - p) * .55;
    });
    ledMat.color.setHex(0x2fd3c0);
    halo.material.opacity = .45 + Math.sin(t0 * 2.2) * .15;
    devs.forEach(function (d, k) { d.material.opacity = .4 + .3 * Math.sin(t0 * 3 + k); });
  };
});
