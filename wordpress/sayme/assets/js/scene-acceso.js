/* Control de acceso: lector de tarjetas en placa, tarjeta que se acerca, chapa magnética. data-scene="acceso" */
SAYME3D.scene('acceso', { fov: 34, z: 13, rot: [.05, -.45, 0], wide: { x: .6, y: .1, s: 1.15 }, narrow: { x: 0, y: -.9, s: .8 }, sway: .06 }, function (root, ctx) {
  var S = SAYME3D;
  var wall = new THREE.Mesh(new THREE.BoxGeometry(5.6, 6.4, .2), new THREE.MeshStandardMaterial({ color: 0xdfe5e8, roughness: .85 }));
  wall.position.z = -.15; root.add(wall);
  /* lector */
  var rd = new THREE.Mesh(new THREE.ExtrudeGeometry(S.roundRect(1.5, 2.5, .22), { depth: .3, bevelEnabled: true, bevelThickness: .05, bevelSize: .05, bevelSegments: 4 }),
    new THREE.MeshPhysicalMaterial({ color: 0x1a2432, metalness: .5, roughness: .3, clearcoat: .8 }));
  rd.position.set(-1.0, .9, 0); root.add(rd);
  var face = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.0), new THREE.MeshPhysicalMaterial({ color: 0x0b1018, roughness: .08, clearcoat: 1 }));
  face.position.set(-1.0, 1.5, .41); root.add(face);
  /* icono de onda NFC */
  var nfc = new THREE.Group(); nfc.position.set(-1.0, 1.5, .42);
  for (var i = 1; i <= 3; i++) { var arc = new THREE.Mesh(new THREE.RingGeometry(.14 * i, .14 * i + .03, 32, 1, -Math.PI / 3, Math.PI * 2 / 3), new THREE.MeshBasicMaterial({ color: 0x2fd3c0, transparent: true, opacity: .9 })); nfc.add(arc); }
  root.add(nfc);
  /* teclado 3x4 */
  var keyMat = new THREE.MeshPhysicalMaterial({ color: 0x2c3948, roughness: .35, clearcoat: .6 });
  for (var r = 0; r < 4; r++) for (var c = 0; c < 3; c++) {
    var k = new THREE.Mesh(new THREE.BoxGeometry(.26, .2, .06), keyMat); k.position.set(-1.0 + (c - 1) * .34, .62 - r * .27 + .0, .38); root.add(k);
  }
  /* LED de estado */
  var led = new THREE.Mesh(new THREE.BoxGeometry(.8, .05, .03), new THREE.MeshBasicMaterial({ color: 0xd8432f })); led.position.set(-1.0, 2.0, .4); root.add(led);
  var lg = new THREE.Sprite(new THREE.SpriteMaterial({ map: S.glow(), color: 0xd8432f, transparent: true, opacity: .5, depthWrite: false, blending: THREE.AdditiveBlending })); lg.scale.set(2, .8, 1); lg.position.set(-1.0, 2.0, .45); root.add(lg);

  /* puerta y chapa magnética */
  var door = new THREE.Mesh(new THREE.BoxGeometry(.2, 6.2, 2.2), new THREE.MeshStandardMaterial({ color: 0x6b7a8c, metalness: .5, roughness: .5 })); door.position.set(1.2, 0, 1.2); door.visible = false;
  var mag = new THREE.Mesh(new THREE.BoxGeometry(2.0, .4, .35), new THREE.MeshStandardMaterial({ color: 0xaab4bb, metalness: .95, roughness: .28 })); mag.position.set(1.2, 2.5, .05); root.add(mag);
  var arm = new THREE.Mesh(new THREE.BoxGeometry(1.9, .36, .12), new THREE.MeshStandardMaterial({ color: 0x8f989e, metalness: .95, roughness: .32 })); arm.position.set(1.2, 2.5, .7); root.add(arm);
  var mled = new THREE.Mesh(new THREE.CircleGeometry(.05, 12), new THREE.MeshBasicMaterial({ color: 0xd8432f })); mled.position.set(.4, 2.5, .24); root.add(mled);
  /* cable hacia la controladora */
  var cab = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(-1.0, .3, -.05), new THREE.Vector3(-1.0, -1.4, .0), new THREE.Vector3(-.2, -2.6, .15), new THREE.Vector3(1.6, -2.9, .3)]), 50, .05, 8, false), new THREE.MeshPhysicalMaterial({ color: 0x1b62c4, roughness: .4, clearcoat: .4 }));
  root.add(cab);
  /* controladora */
  var ctl = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, .35), new THREE.MeshPhysicalMaterial({ color: 0x14263f, metalness: .4, roughness: .45 })); ctl.position.set(1.8, -2.5, .1); root.add(ctl);
  var cl = new THREE.Mesh(new THREE.BoxGeometry(.5, .06, .02), new THREE.MeshBasicMaterial({ color: 0x0f9688 })); cl.position.set(1.8, -2.3, .29); root.add(cl);

  /* tarjeta de proximidad */
  var cardTex = (function () { var c = document.createElement('canvas'); c.width = 512; c.height = 320; var g = c.getContext('2d');
    var gr = g.createLinearGradient(0, 0, 512, 320); gr.addColorStop(0, '#1f3a5f'); gr.addColorStop(1, '#0f9688'); g.fillStyle = gr; g.fillRect(0, 0, 512, 320);
    g.fillStyle = 'rgba(255,255,255,.9)'; g.font = '700 54px "Big Shoulders Display",sans-serif'; g.fillText('SAYME', 36, 90);
    g.fillStyle = '#e3c25a'; g.fillRect(40, 150, 76, 58); g.strokeStyle = 'rgba(0,0,0,.35)'; g.strokeRect(40, 150, 76, 58);
    g.fillStyle = 'rgba(255,255,255,.8)'; g.font = '500 24px "JetBrains Mono",monospace'; g.fillText('ACCESO  0042', 36, 275);
    var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; return t; })();
  var card = new THREE.Mesh(new THREE.BoxGeometry(1.2, .76, .03), [0, 1, 2, 3, 4, 5].map(function (n) { return n === 4 ? new THREE.MeshPhysicalMaterial({ map: cardTex, roughness: .3, clearcoat: .8 }) : new THREE.MeshStandardMaterial({ color: 0x1f3a5f }); }));
  root.add(card);
  var t0 = 0;
  return function (dt) {
    t0 += S.reduce ? 0 : dt; var T = t0 % 5, z, rot, ok = false;
    if (T < 1.8) { var p = T / 1.8, e = p * p * (3 - 2 * p); z = 3.2 - e * 2.7; rot = .45 * (1 - e); }
    else if (T < 3.3) { z = .5; rot = 0; ok = T > 2.0; }
    else { var p2 = (T - 3.3) / 1.7, e2 = p2 * p2 * (3 - 2 * p2); z = .5 + e2 * 2.7; rot = .45 * e2; }
    card.position.set(-1.0 + (1 - Math.min(1, z / 3.2)) * 0, 1.5 + (z > .6 ? (z - .5) * .35 : 0), z + .4); card.rotation.set(-.15 * (z - .5) / 2.7, rot, .1 * (z - .5) / 2.7);
    var col = ok ? 0x1bd76a : 0xd8432f; led.material.color.setHex(col); lg.material.color.setHex(col); mled.material.color.setHex(col);
    arm.position.z = ok ? 1.4 : .7;
    nfc.children.forEach(function (a, i) { a.material.opacity = .35 + .6 * Math.max(0, Math.sin(t0 * 4 - i * .8)); });
  };
});
