/* Laboratorio de red: Internet > Firewall > Core Cisco > Switch + AP Ubiquiti > equipos. Paquetes de datos en vivo. data-scene="lab" */
SAYME3D.scene('lab', { fov: 34, z: 15, rot: [1.0, -.22, 0], wide: { x: -.25, y: 0, s: 1.3 }, narrow: { x: 0, y: -.6, s: .95 }, sway: .05 }, function (root, ctx) {
  var S = SAYME3D, V = THREE.Vector3;
  function label(txt, col) {
    var c = document.createElement('canvas'); c.width = 512; c.height = 128; var g = c.getContext('2d');
    g.font = '600 46px "JetBrains Mono",monospace'; g.textAlign = 'center'; g.fillStyle = col || '#14263f'; g.fillText(txt, 256, 80);
    var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding;
    var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthTest: false })); sp.scale.set(2.0, .5, 1); sp.renderOrder = 10; return sp;
  }
  /* mesa del laboratorio */
  var bench = new THREE.Mesh(new THREE.BoxGeometry(11.4, .25, 5.2), new THREE.MeshPhysicalMaterial({ color: 0x14263f, metalness: .3, roughness: .5, clearcoat: .4 }));
  bench.position.y = -.2; root.add(bench);
  var grid = new THREE.GridHelper(11, 22, 0x2fd3c0, 0x2a4263); grid.position.y = -.07; grid.material.transparent = true; grid.material.opacity = .35; grid.scale.z = .45; root.add(grid);

  var navy = new THREE.MeshPhysicalMaterial({ color: 0x1f3a5f, metalness: .6, roughness: .35, clearcoat: .4 });
  var white = new THREE.MeshPhysicalMaterial({ color: 0xf1f3f4, roughness: .35, clearcoat: .6 });
  var dark = new THREE.MeshStandardMaterial({ color: 0x05070a, roughness: .9 });
  var teal = new THREE.MeshBasicMaterial({ color: 0x2fd3c0 });
  var nodes = {};
  function at(m, x, y, z) { m.position.set(x, y, z); return m; }
  function put(name, obj, x, z, txt, ly, col) { obj.position.set(x, 0, z); root.add(obj); nodes[name] = new V(x, .35, z); var l = label(txt, col); l.position.set(x, ly == null ? 1.35 : ly, z + .05); root.add(l); }

  /* Internet */
  var net = new THREE.Group();
  for (var i = 0; i < 5; i++) { var b = new THREE.Mesh(new THREE.SphereGeometry(.34 + (i % 2) * .12, 24, 18), white); b.position.set((i - 2) * .32, .5 + (i % 2) * .15, (i % 3 - 1) * .1); net.add(b); }
  put('net', net, -4.6, 0, 'INTERNET', 1.5);

  /* Firewall: muro de ladrillo con escudo */
  var fw = new THREE.Group();
  var bc = document.createElement('canvas'); bc.width = 256; bc.height = 256; var bg = bc.getContext('2d'); bg.fillStyle = '#b3361e'; bg.fillRect(0, 0, 256, 256);
  for (var r = 0; r < 8; r++) for (var k = 0; k < 4; k++) { var x0 = k * 64 + (r % 2 ? 32 : 0); bg.fillStyle = r % 3 ? '#d1472b' : '#c23d24'; bg.fillRect(x0 + 2, r * 32 + 2, 60, 28); }
  var bt = new THREE.CanvasTexture(bc); bt.encoding = THREE.sRGBEncoding;
  var wall = new THREE.Mesh(new THREE.BoxGeometry(.5, 1.5, 1.7), [0, 1, 2, 3, 4, 5].map(function () { return new THREE.MeshStandardMaterial({ map: bt, roughness: .75 }); }));
  wall.position.y = .55; fw.add(wall);
  var shield = new THREE.Shape(); shield.moveTo(0, .38); shield.lineTo(.3, .28); shield.lineTo(.3, -.05); shield.quadraticCurveTo(.3, -.3, 0, -.42); shield.quadraticCurveTo(-.3, -.3, -.3, -.05); shield.lineTo(-.3, .28); shield.closePath();
  var sh = new THREE.Mesh(new THREE.ShapeGeometry(shield), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })); sh.rotation.y = Math.PI / 2; sh.position.set(.26, .6, 0); fw.add(sh);
  var sh2 = sh.clone(); sh2.position.x = -.26; fw.add(sh2);
  var fwGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: S.glow(), color: 0xff6a3d, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })); fwGlow.scale.set(3, 3, 1); fwGlow.position.y = .6; fw.add(fwGlow);
  put('fw', fw, -2.4, 0, 'FIREWALL', 1.7, '#b3361e');

  /* Core Cisco (switch 1U navy) */
  var core = new THREE.Group();
  core.add(at(new THREE.Mesh(new THREE.BoxGeometry(1.9, .36, 1.0), navy), 0, .18, 0));
  for (var p = 0; p < 12; p++) { var pt = new THREE.Mesh(new THREE.BoxGeometry(.12, .1, .03), dark); pt.position.set(-.74 + p * .135, .17, .51); core.add(pt); var ld = new THREE.Mesh(new THREE.BoxGeometry(.04, .02, .02), new THREE.MeshBasicMaterial({ color: 0x1bd76a })); ld.position.set(-.74 + p * .135, .26, .515); core.add(ld); }
  var cs = new THREE.Mesh(new THREE.BoxGeometry(1.8, .03, .01), teal); cs.position.set(0, .34, .51); core.add(cs);
  put('core', core, -.1, 0, 'CORE CISCO', 1.0, '#1f3a5f');

  /* Switch UniFi (blanco) */
  var acc = new THREE.Group();
  acc.add(at(new THREE.Mesh(new THREE.BoxGeometry(1.5, .3, .85), white), 0, .15, 0));
  for (p = 0; p < 8; p++) { var pt2 = new THREE.Mesh(new THREE.BoxGeometry(.1, .09, .03), dark); pt2.position.set(-.5 + p * .14, .15, .44); acc.add(pt2); }
  var ul = new THREE.Mesh(new THREE.BoxGeometry(.5, .04, .01), new THREE.MeshBasicMaterial({ color: 0x2f7bff })); ul.position.set(.45, .27, .44); acc.add(ul);
  put('acc', acc, 2.4, -1.4, 'SWITCH UBIQUITI', .85, '#6b7a8c');

  /* Access point UniFi */
  var ap = new THREE.Group();
  ap.add(at(new THREE.Mesh(new THREE.CylinderGeometry(.55, .6, .14, 48), white), 0, .1, 0));
  var apr = new THREE.Mesh(new THREE.TorusGeometry(.33, .025, 10, 48), new THREE.MeshBasicMaterial({ color: 0x2f7bff })); apr.rotation.x = Math.PI / 2; apr.position.y = .19; ap.add(apr);
  put('ap', ap, 2.4, 1.5, 'AP UBIQUITI', .85, '#6b7a8c');

  /* Servidor */
  var srv = new THREE.Group();
  srv.add(at(new THREE.Mesh(new THREE.BoxGeometry(.8, 1.2, .8), navy), 0, .6, 0));
  for (i = 0; i < 4; i++) { var ub = new THREE.Mesh(new THREE.BoxGeometry(.7, .2, .02), new THREE.MeshStandardMaterial({ color: 0x0b1018 })); ub.position.set(0, .2 + i * .26, .41); srv.add(ub); var sl = new THREE.Mesh(new THREE.BoxGeometry(.05, .03, .02), new THREE.MeshBasicMaterial({ color: 0x1bd76a })); sl.position.set(.28, .2 + i * .26, .43); srv.add(sl); }
  put('srv', srv, 4.7, -1.4, 'SERVIDOR', 1.6, '#14263f');

  /* PC */
  var pc = new THREE.Group();
  pc.add(at(new THREE.Mesh(new THREE.BoxGeometry(1.0, .65, .06), new THREE.MeshStandardMaterial({ color: 0x10161d })), 0, .7, 0));
  var scr = new THREE.Mesh(new THREE.PlaneGeometry(.9, .55), new THREE.MeshBasicMaterial({ color: 0x0f9688 })); scr.position.set(0, .7, .04); pc.add(scr);
  pc.add(at(new THREE.Mesh(new THREE.BoxGeometry(.12, .35, .12), navy), 0, .2, 0));
  pc.add(at(new THREE.Mesh(new THREE.BoxGeometry(.6, .04, .4), navy), 0, .02, 0));
  put('pc', pc, 4.7, 0, 'PC', 1.3, '#14263f');

  /* Laptop inalámbrica */
  var lp = new THREE.Group();
  lp.add(at(new THREE.Mesh(new THREE.BoxGeometry(.9, .05, .6), white), 0, .03, 0));
  var lid = new THREE.Mesh(new THREE.BoxGeometry(.9, .6, .04), new THREE.MeshStandardMaterial({ color: 0x1b2430 })); lid.position.set(0, .35, -.28); lid.rotation.x = -.25; lp.add(lid);
  var ls = new THREE.Mesh(new THREE.PlaneGeometry(.8, .5), new THREE.MeshBasicMaterial({ color: 0x2fd3c0 })); ls.position.set(0, .35, -.255); ls.rotation.x = -.25; lp.add(ls);
  put('lp', lp, 4.7, 1.5, 'LAPTOP WIFI', 1.2, '#14263f');

  /* enlaces */
  function link(a, b, col, mid) {
    var A = nodes[a].clone(), B = nodes[b].clone(); A.y = B.y = .12;
    var pts = [A, B]; if (mid) pts = [A, mid, B];
    var cur = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0);
    root.add(new THREE.Mesh(new THREE.TubeGeometry(cur, 40, .045, 8, false), new THREE.MeshPhysicalMaterial({ color: col, roughness: .4, clearcoat: .6 })));
    return cur;
  }
  var L = {};
  L.netfw = link('net', 'fw', 0xe6b422); L.fwcore = link('fw', 'core', 0x1b62c4); L.coreacc = link('core', 'acc', 0x2f9d45, new V(1.1, .12, -1.4));
  L.corap = link('core', 'ap', 0x2f9d45, new V(1.1, .12, 1.5)); L.accsrv = link('acc', 'srv', 0xf0f0ee); L.accpc = link('acc', 'pc', 0xf0f0ee, new V(3.4, .12, -.4));
  /* ondas wifi AP -> laptop */
  var waves = [];
  for (i = 0; i < 3; i++) { var w = new THREE.Mesh(new THREE.RingGeometry(.55, .58, 48), new THREE.MeshBasicMaterial({ color: 0x2f7bff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false })); w.rotation.x = -Math.PI / 2; w.position.set(2.4, .25, 1.5); root.add(w); waves.push(w); }

  /* paquetes de datos */
  var routes = [
    { c: 0x2fd3c0, path: [L.netfw, L.fwcore, L.coreacc, L.accsrv] },
    { c: 0x2fd3c0, path: [L.netfw, L.fwcore, L.coreacc, L.accpc] },
    { c: 0x2fd3c0, path: [L.netfw, L.fwcore, L.corap], wifi: true },
    { c: 0xffd25e, path: [L.accsrv, L.coreacc, L.fwcore, L.netfw], rev: true },
    { c: 0xff3b2f, path: [L.netfw], block: true },
    { c: 0xff3b2f, path: [L.netfw], block: true }
  ];
  var pk = routes.map(function (r, i) {
    var m = new THREE.Mesh(new THREE.BoxGeometry(.2, .14, .2), new THREE.MeshBasicMaterial({ color: r.c }));
    var halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: S.glow(), color: r.c, transparent: true, opacity: .8, depthWrite: false, blending: THREE.AdditiveBlending })); halo.scale.set(.9, .9, 1); m.add(halo);
    root.add(m); return { r: r, m: m, t: -i * .22 };
  });
  var tt = 0, flash = 0;
  function seg(p, u) { /* u 0..1 sobre toda la ruta */
    var n = p.r.path.length, f = Math.min(.9999, Math.max(0, u)) * n, i = Math.floor(f), c = p.r.path[i], v = f - i;
    return c.getPointAt(p.r.rev ? 1 - v : v);
  }
  return function (dt) {
    tt += S.reduce ? 0 : dt; flash = Math.max(0, flash - dt * 2.5);
    pk.forEach(function (p) {
      p.t += (S.reduce ? 0 : dt) * (p.r.block ? .32 : .2); var u = p.t;
      if (p.r.block) { if (u > 1) { flash = 1; p.t = -Math.random() * .6; u = 0; } p.m.visible = u > 0 && u < .97; var pos = seg(p, u * .97); p.m.position.copy(pos); }
      else { if (u > 1.1) p.t = -Math.random() * .4; p.m.visible = u > 0 && u <= 1; if (p.m.visible) p.m.position.copy(seg(p, u)); }
      p.m.rotation.y = tt * 3;
    });
    fwGlow.material.opacity = flash * .8;
    waves.forEach(function (w, i) { var q = ((tt * .5) + i / 3) % 1; var s = 1 + q * 3.5; w.scale.set(s, s, s); w.material.opacity = (1 - q) * .5; });
  };
});
