/* Switch de red de 24 puertos con LEDs, SFP y patch cords. data-scene="switch" */
SAYME3D.scene('switch', { fov: 34, z: 15, rot: [.28, -.42, 0], wide: { x: .3, y: -.1, s: 1.1 }, narrow: { x: 0, y: -1.2, s: .85 }, sway: .08 }, function (root, ctx) {
  var S = SAYME3D;
  var W = 7.2, H = .9, D = 3.2;
  var body = new THREE.Mesh(new THREE.BoxGeometry(W, H, D), new THREE.MeshPhysicalMaterial({ color: 0x1e2b3c, metalness: .6, roughness: .38, clearcoat: .3 }));
  root.add(body);
  var plate = new THREE.Mesh(new THREE.BoxGeometry(W + .6, H + .1, .08), new THREE.MeshStandardMaterial({ color: 0xaab4bb, metalness: .9, roughness: .3 }));
  plate.position.z = D / 2 + .04; root.add(plate);
  [-1, 1].forEach(function (s) { /* orejas de rack */
    var ear = new THREE.Mesh(new THREE.BoxGeometry(.3, H + .1, .08), new THREE.MeshStandardMaterial({ color: 0xaab4bb, metalness: .9, roughness: .3 }));
    ear.position.set(s * (W / 2 + .45), 0, D / 2 + .04); root.add(ear);
    var hole = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, .1, 12), new THREE.MeshStandardMaterial({ color: 0x0b0d10 })); hole.rotation.x = Math.PI / 2; hole.position.set(s * (W / 2 + .45), 0, D / 2 + .05); root.add(hole);
  });
  /* franja teal */
  var strip = new THREE.Mesh(new THREE.BoxGeometry(W - .2, .05, .02), new THREE.MeshBasicMaterial({ color: 0x0f9688 })); strip.position.set(0, H / 2 - .1, D / 2 + .09); root.add(strip);

  var portMat = new THREE.MeshStandardMaterial({ color: 0x06080a, roughness: .9 });
  var shell = new THREE.MeshStandardMaterial({ color: 0x9aa4ab, metalness: .9, roughness: .3 });
  var leds = [], N = 12, px0 = -2.85, dx = .46;
  for (var row = 0; row < 2; row++) {
    for (var i = 0; i < N; i++) {
      var x = px0 + i * dx, y = row ? -.22 : .12;
      var port = new THREE.Mesh(new THREE.BoxGeometry(.3, .2, .08), portMat); port.position.set(x, y, D / 2 + .09); root.add(port);
      var fr = new THREE.Mesh(new THREE.BoxGeometry(.34, .24, .02), shell); fr.position.set(x, y, D / 2 + .08); root.add(fr);
      var led = new THREE.Mesh(new THREE.BoxGeometry(.05, .03, .02), new THREE.MeshBasicMaterial({ color: 0x1bd76a }));
      led.position.set(x - .09, y + .17 * (row ? -1 : 1) * 0 + (row ? -.16 : .26), D / 2 + .1); root.add(led); leds.push({ m: led, ph: Math.random() * 6, sp: 2 + Math.random() * 6 });
    }
  }
  /* puertos SFP+ */
  for (var s = 0; s < 4; s++) {
    var sx = 3.0 + (s % 2) * .55 * 0 + 0, sy = .22 - s * .2 * 0;
  }
  [[2.95, .12], [2.95, -.22]].forEach(function (p, k) {
    var sfp = new THREE.Mesh(new THREE.BoxGeometry(.46, .22, .22), new THREE.MeshStandardMaterial({ color: 0xc9d0d4, metalness: .9, roughness: .25 })); sfp.position.set(p[0] + .05, p[1], D / 2 + .15); root.add(sfp);
    var fib = new THREE.Mesh(new THREE.CylinderGeometry(.045, .045, .06, 14), new THREE.MeshBasicMaterial({ color: k ? 0x2fd3c0 : 0xffd25e })); fib.rotation.x = Math.PI / 2; fib.position.set(p[0] - .06, p[1], D / 2 + .27); root.add(fib);
  });
  /* panel de estado */
  var pls = new THREE.Mesh(new THREE.BoxGeometry(.5, .1, .02), new THREE.MeshBasicMaterial({ color: 0x0f9688 })); pls.position.set(-3.35, .3, D / 2 + .1);
  var stat = new THREE.Mesh(new THREE.CircleGeometry(.045, 16), new THREE.MeshBasicMaterial({ color: 0x1bd76a })); stat.position.set(-3.5, -.2, D / 2 + .1); root.add(stat);

  /* patch cords: colores */
  var cols = [0x1b62c4, 0xe8781a, 0x2f9d45, 0xe6b422, 0xf0f0ee];
  [1, 3, 4, 6, 8].forEach(function (pi, k) {
    var x = px0 + pi * dx, y = .12;
    var a = new THREE.Vector3(x, y, D / 2 + .22);
    var cur = new THREE.CatmullRomCurve3([a, new THREE.Vector3(x, y, D / 2 + .75), new THREE.Vector3(x - .2 + k * .12, y - .5, D / 2 + 1.5), new THREE.Vector3(x - .6 + k * .3, y - 1.4, D / 2 + 2.1), new THREE.Vector3(x - .8 + k * .5, y - 2.5, D / 2 + 2.0)]);
    root.add(new THREE.Mesh(new THREE.TubeGeometry(cur, 60, .06, 10, false), new THREE.MeshPhysicalMaterial({ color: cols[k], roughness: .4, clearcoat: .5 })));
    var plug = new THREE.Mesh(new THREE.BoxGeometry(.24, .17, .34), new THREE.MeshPhysicalMaterial({ color: 0xd7dde0, roughness: .12, transmission: .0, clearcoat: 1 })); plug.position.set(x, y, D / 2 + .2); root.add(plug);
  });
  var sh = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), new THREE.ShadowMaterial({ opacity: .0 }));

  return function (dt, now) {
    leds.forEach(function (l) {
      var v = Math.sin(now * l.sp * .002 + l.ph);
      l.m.material.color.setHex(v > .75 ? 0xffb84a : (v > -.6 ? 0x1bd76a : 0x0e3a24));
    });
  };
});
