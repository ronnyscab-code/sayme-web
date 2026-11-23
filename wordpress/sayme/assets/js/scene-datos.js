/* Cable de red Cat-6A en 3D: funda, malla metálica, separador en cruz y cuatro pares trenzados. data-scene="datos" */
SAYME3D.scene('datos', { fov: 36, z: 13, rot: [0, -.5, .1], wide: { x: 2.2, y: -.1, s: 1.49 }, narrow: { x: 0, y: -1.7, s: 0.98 }, spin: .16, spinX: true, sway: .05 }, function (root, ctx) {
  var S = SAYME3D;
  class Helix extends THREE.Curve {
    constructor(cy, cz, r, phase, turns, len) { super(); this.cy = cy; this.cz = cz; this.r = r; this.ph = phase; this.tn = turns; this.len = len; }
    getPoint(t, tg) { var a = this.ph + this.tn * 2 * Math.PI * t; return (tg || new THREE.Vector3()).set(t * this.len, this.cy + this.r * Math.cos(a), this.cz + this.r * Math.sin(a)); }
  }

  /* funda azul con texto impreso */
  var tex = S.printTex('SAYME  |  CAT 6A U/FTP 4P 23AWG  |  500 MHz  |  ', '#1d5f93', '#eaf2f8');
  var jacket = new THREE.Mesh(new THREE.CylinderGeometry(.66, .66, 5.2, 80, 1, true),
    new THREE.MeshPhysicalMaterial({ map: tex, bumpMap: S.noiseBump(3, 14), bumpScale: .06, roughness: .42, clearcoat: .45, clearcoatRoughness: .5, side: THREE.DoubleSide }));
  jacket.rotation.z = Math.PI / 2; jacket.position.x = -2.6; root.add(jacket);
  var rim = new THREE.Mesh(new THREE.RingGeometry(.57, .66, 80), new THREE.MeshStandardMaterial({ color: 0x174a73, roughness: .7, side: THREE.DoubleSide }));
  rim.rotation.y = Math.PI / 2; root.add(rim);

  /* malla metálica (foil) que sobresale de la funda */
  var foil = new THREE.Mesh(new THREE.CylinderGeometry(.55, .55, 2.4, 48, 1, true),
    new THREE.MeshStandardMaterial({ color: 0xcfd6db, metalness: .95, roughness: .28, bumpMap: S.noiseBump(6, 6), bumpScale: .5, side: THREE.DoubleSide }));
  foil.rotation.z = Math.PI / 2; foil.position.x = -.2; root.add(foil);

  /* separador en cruz */
  var spMat = new THREE.MeshStandardMaterial({ color: 0xe9ece8, roughness: .6 });
  [[1.9, .05, .8], [1.9, .8, .05]].forEach(function (d) {
    var b = new THREE.Mesh(new THREE.BoxGeometry(d[0], d[1], d[2]), spMat); b.position.x = .4; root.add(b);
  });
  var spCore = new THREE.Mesh(new THREE.BoxGeometry(1.9, .08, .08), spMat); spCore.position.x = .4; root.add(spCore);

  /* cuatro pares trenzados (T568B): naranja, verde, azul, marrón */
  var PAIRS = [[0xe8781a, 0xf6e6d4, 6], [0x2f9d45, 0xe4f3e7, 7], [0x1b62c4, 0xe3ecf9, 8], [0x6b4326, 0xe9dfd5, 9]];
  var pivots = [], LEN = 3.4;
  var copper = new THREE.MeshStandardMaterial({ color: 0xc9824a, metalness: 1, roughness: .28 });
  PAIRS.forEach(function (p, i) {
    var ang = Math.PI / 4 + i * Math.PI / 2, dy = Math.cos(ang), dz = Math.sin(ang);
    var pv = new THREE.Group(); pv.position.set(-.35, dy * .19, dz * .19); root.add(pv);
    [0, Math.PI].forEach(function (ph, k) {
      var hx = new Helix(0, 0, .075, ph, p[2], LEN);
      var wire = new THREE.Mesh(new THREE.TubeGeometry(hx, 220, .066, 12, false),
        new THREE.MeshPhysicalMaterial({ color: k ? p[1] : p[0], roughness: .38, clearcoat: .5, clearcoatRoughness: .3 }));
      pv.add(wire);
      var e = hx.getPoint(1);
      var tip = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .45, 10), copper);
      tip.rotation.z = Math.PI / 2; tip.position.set(e.x + .22, e.y, e.z); pv.add(tip);
    });
    pivots.push({ g: pv, dy: dy, dz: dz });
  });

  /* trazos de luz que recorren los pares */
  var NP = 60, pp = new Float32Array(NP * 3), pd = [];
  for (var i = 0; i < NP; i++) pd.push({ k: i % 4, t: Math.random(), s: .15 + Math.random() * .3, side: i % 2 });
  var pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
  root.add(new THREE.Points(pg, new THREE.PointsMaterial({ color: 0x2fd3c0, size: .07, map: S.dot(), alphaTest: .3, transparent: true, opacity: .95, depthWrite: false })));

  var spread = .2;
  return function (dt, now, c) {
    spread += ((c.hover ? 1 : .2) - spread) * .06;
    var ax = new THREE.Vector3();
    pivots.forEach(function (p) { ax.set(0, -p.dz, p.dy); p.g.quaternion.setFromAxisAngle(ax, spread * .3); });
    for (var k = 0; k < NP; k++) {
      var q = pd[k]; if (!SAYME3D.reduce) q.t += dt * q.s; if (q.t > 1) q.t = 0;
      var p = pivots[q.k], a = spread * .3, L = q.t * LEN;
      var turns = PAIRS[q.k][2], ph = q.side ? Math.PI : 0, ar = ph + turns * 2 * Math.PI * q.t;
      var ly = .075 * Math.cos(ar), lz = .075 * Math.sin(ar);
      /* punto local del par, rotado por la inclinación del par */
      var v = new THREE.Vector3(L, ly, lz).applyQuaternion(p.g.quaternion).add(p.g.position);
      pp[k * 3] = v.x; pp[k * 3 + 1] = v.y; pp[k * 3 + 2] = v.z;
    }
    pg.attributes.position.needsUpdate = true;
  };
});
