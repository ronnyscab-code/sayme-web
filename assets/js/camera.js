/* Cámara IP tipo bullet en 3D que sigue al cursor. Uso: <canvas data-scene="camera"></canvas> */
(function () {
  var canvas = document.querySelector('canvas[data-scene="camera"]');
  if (!canvas || !window.THREE) return;
  var S = SAYME3D, reduce = S.reduce;
  var T = S.make(canvas, 34, 14), renderer = T.renderer, scene = T.scene, camera = T.camera;
  S.env(renderer, scene);

  var rig = new THREE.Group(); scene.add(rig);

  /* materiales */
  var white = new THREE.MeshPhysicalMaterial({ color: 0xe8edf0, roughness: .34, clearcoat: .7, clearcoatRoughness: .25 });
  var graphite = new THREE.MeshStandardMaterial({ color: 0x1b2128, roughness: .5, metalness: .3 });
  var steel = new THREE.MeshStandardMaterial({ color: 0xaab4bb, roughness: .3, metalness: .9 });
  var black = new THREE.MeshStandardMaterial({ color: 0x0a0d10, roughness: .6 });

  /* soporte fijo: placa de pared, brazo y rótula */
  var plate = new THREE.Mesh(new THREE.BoxGeometry(.18, 2.2, 2.2), steel); plate.position.set(3.1, .9, -.3); rig.add(plate);
  [[-.85, -.85], [-.85, .85], [.85, -.85], [.85, .85]].forEach(function (p) {
    var s = new THREE.Mesh(new THREE.CylinderGeometry(.09, .09, .06, 16), graphite);
    s.rotation.z = Math.PI / 2; s.position.set(3.0, .9 + p[0], -.3 + p[1]); rig.add(s);
  });
  var arm = new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, 2.5, 24), white); arm.rotation.z = Math.PI / 2; arm.position.set(1.9, .9, -.3); rig.add(arm);
  var joint = new THREE.Mesh(new THREE.SphereGeometry(.36, 32, 24), steel); joint.position.set(.75, .9, -.3); rig.add(joint);

  /* cabeza: gira alrededor de la rótula */
  var pivot = new THREE.Group(); pivot.position.set(.75, .9, -.3); rig.add(pivot);
  var head = new THREE.Group(); head.position.set(0, -.9, .3); pivot.add(head);

  var body = new THREE.Mesh(new THREE.CylinderGeometry(.62, .62, 2.3, 64), white); body.rotation.x = Math.PI / 2; head.add(body);
  var cap = new THREE.Mesh(new THREE.SphereGeometry(.62, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), white);
  cap.rotation.x = -Math.PI / 2; cap.position.z = -1.15; head.add(cap);
  /* visera */
  var hood = new THREE.Mesh(new THREE.CylinderGeometry(.74, .74, 2.1, 64, 1, true, -Math.PI * .5 - .5, Math.PI + 1), white.clone());
  hood.material.side = THREE.DoubleSide; hood.rotation.x = Math.PI / 2; hood.rotation.z = 0; hood.position.z = .35;
  hood.rotation.set(Math.PI / 2, 0, Math.PI); head.add(hood);
  var hoodEdge = new THREE.Mesh(new THREE.TorusGeometry(.74, .035, 8, 48, Math.PI + 1), white);
  hoodEdge.rotation.z = -.5; hoodEdge.position.z = 1.4; head.add(hoodEdge);

  /* frente: aro, cristal y lente */
  var bezel = new THREE.Mesh(new THREE.CylinderGeometry(.58, .58, .12, 64), graphite); bezel.rotation.x = Math.PI / 2; bezel.position.z = 1.17; head.add(bezel);
  var glass = new THREE.Mesh(new THREE.CircleGeometry(.5, 64), new THREE.MeshPhysicalMaterial({ color: 0x04070b, roughness: .04, metalness: .4, clearcoat: 1, clearcoatRoughness: .03 }));
  glass.position.z = 1.24; head.add(glass);
  var lens = new THREE.Mesh(new THREE.SphereGeometry(.26, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshPhysicalMaterial({ color: 0x1c2a78, roughness: .08, metalness: .85, clearcoat: 1 }));
  lens.rotation.x = Math.PI / 2; lens.position.z = 1.245; head.add(lens);
  [.32, .4].forEach(function (r) {
    var ring = new THREE.Mesh(new THREE.TorusGeometry(r, .012, 8, 48), steel); ring.position.z = 1.25; head.add(ring);
  });
  var irMat = new THREE.MeshStandardMaterial({ color: 0x501010, emissive: 0xff3322, emissiveIntensity: .8 });
  for (var i = 0; i < 12; i++) {
    var a = i / 12 * Math.PI * 2, led = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .03, 12), irMat);
    led.rotation.x = Math.PI / 2; led.position.set(Math.cos(a) * .46, Math.sin(a) * .46, 1.25); head.add(led);
  }
  /* luz de estado y prensaestopa trasero con cable */
  var status = new THREE.Mesh(new THREE.SphereGeometry(.05, 16, 12), new THREE.MeshStandardMaterial({ color: 0x0f9688, emissive: 0x2fd3c0, emissiveIntensity: 1 }));
  status.position.set(0, .63, .6); head.add(status);
  var gland = new THREE.Mesh(new THREE.CylinderGeometry(.16, .2, .35, 24), graphite); gland.rotation.x = Math.PI / 2; gland.position.z = -1.55; head.add(gland);
  var cable = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, -1.7), new THREE.Vector3(0, -.15, -2.1), new THREE.Vector3(.1, -.7, -2.4), new THREE.Vector3(.5, -1.3, -2.3)
  ]), 24, .06, 10, false), black); head.add(cable);

  /* campo de visión */
  var fov = new THREE.Mesh(new THREE.ConeGeometry(1.5, 4, 40, 1, true), new THREE.MeshBasicMaterial({ color: 0x0f9688, transparent: true, opacity: .09, side: THREE.DoubleSide, depthWrite: false }));
  fov.rotation.x = -Math.PI / 2; fov.position.z = 1.25 + 2; head.add(fov);
  var fovWire = new THREE.Mesh(new THREE.ConeGeometry(1.5, 4, 16, 1, true), new THREE.MeshBasicMaterial({ color: 0x0f9688, wireframe: true, transparent: true, opacity: .22, depthWrite: false }));
  fovWire.rotation.x = -Math.PI / 2; fovWire.position.z = 1.25 + 2; head.add(fovWire);

  rig.rotation.set(.05, -.3, 0);
  var mx = 0, my = 0, ty = 0, tx = 0;
  function resize() {
    var w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    var wide = w > 560;
    rig.scale.setScalar(wide ? 1.2 : .8); rig.position.set(wide ? -.5 : -.5, wide ? -.3 : -.2, 0);
  }
  addEventListener('resize', resize); resize();
  if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas);
  addEventListener('pointermove', function (e) { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });

  var t0 = 0;
  S.loop(canvas, function (dt, now) {
    t0 += dt;
    var autoY = reduce ? 0 : Math.sin(t0 * .5) * .35, autoX = reduce ? 0 : Math.sin(t0 * .37) * .12;
    var gy = -mx * 1.5 + autoY * (1 - Math.min(1, Math.abs(mx) * 3));
    var gx = my * .9 + autoX;
    ty += (gy - ty) * .06; tx += (gx - tx) * .06;
    pivot.rotation.y = ty; pivot.rotation.x = tx;
    status.material.emissiveIntensity = reduce ? 1 : (Math.sin(now * .005) > 0 ? 1.4 : .15);
    fov.material.opacity = .08 + (reduce ? 0 : .02 * Math.sin(now * .002));
    renderer.render(scene, camera);
  });
})();
