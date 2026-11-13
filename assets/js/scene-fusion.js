/* Fusionadora + bandeja de empalmes conectadas por fibra. Pantalla con destello de fusión. data-scene="fusion" */
(function () {
  var S = SAYME3D;
  var M = {
    body: new THREE.MeshPhysicalMaterial({ color: 0xdfe5e8, metalness: .15, roughness: .35, clearcoat: .5 }),
    navy: new THREE.MeshPhysicalMaterial({ color: 0x1f3a5f, metalness: .25, roughness: .42, clearcoat: .45 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x0d1620, roughness: .6 }),
    steel: new THREE.MeshPhysicalMaterial({ color: 0xc3cbd1, metalness: .95, roughness: .26 }),
    teal: new THREE.MeshStandardMaterial({ color: 0x0f9688, roughness: .4 }),
    yellow: new THREE.MeshStandardMaterial({ color: 0xe0a800, roughness: .5 }),
    blue: new THREE.MeshStandardMaterial({ color: 0x1557b0, roughness: .5 }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0x9fd8d0, roughness: .08, transparent: true, opacity: .3, clearcoat: 1 }),
    bench: new THREE.MeshPhysicalMaterial({ color: 0xe9e2d2, roughness: .6, clearcoat: .15 })
  };
  function tube(pts, r, mat, seg) { var c = new THREE.CatmullRomCurve3(pts.map(function (p) { return new THREE.Vector3(p[0], p[1], p[2]); })); return new THREE.Mesh(new THREE.TubeGeometry(c, seg || 60, r, 10, false), mat); }
  function box(w, h, d, m, x, y, z, p) { var b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); p && p.add(b); return b; }
  function cyl(rt, rb, h, m, x, y, z, p, rz) { var c = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, 24), m); c.position.set(x, y, z); if (rz) c.rotation.z = rz; p && p.add(c); return c; }
  function sprite(scale, op) { var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: S.glow(), transparent: true, opacity: op || 1, depthWrite: false, blending: THREE.AdditiveBlending })); s.scale.set(scale, scale, 1); return s; }
  function clamp(x) { return Math.max(0, Math.min(1, x)); }

  S.scene('fusion', { fov: 34, z: 15, bp: 300, rot: [.5, -.42, 0], wide: { x: -.1, y: -.15, s: 1.0 }, narrow: { x: 0, y: -.1, s: .62 }, sway: .05 }, function (root, ctx) {
    /* mesa de trabajo */
    var bench = new THREE.Mesh(new THREE.ExtrudeGeometry(S.roundRect(10.4, 5.6, .5), { depth: .14, bevelEnabled: true, bevelThickness: .03, bevelSize: .03, bevelSegments: 3 }), M.bench);
    bench.rotation.x = -Math.PI / 2; bench.position.set(.4, -.9 - .14, .3); root.add(bench);

    /* ---- fusionadora ---- */
    var sp = new THREE.Group(); sp.position.set(-1.7, 0, -.4); root.add(sp);
    var base = new THREE.Mesh(new THREE.ExtrudeGeometry(S.roundRect(5.4, 3.5, .38), { depth: .9, bevelEnabled: true, bevelThickness: .08, bevelSize: .08, bevelSegments: 4 }), M.body);
    base.rotation.x = -Math.PI / 2; base.position.y = -.9; sp.add(base);
    box(5.46, .22, 3.56, M.navy, 0, -.78, 0, sp);
    box(3.9, .06, 1.5, M.dark, 0, .03, .62, sp);
    [-1.25, 1.25].forEach(function (x) {
      box(1.05, .26, .78, M.steel, x, .15, .62, sp); box(.8, .1, .5, M.navy, x, .33, .62, sp);
      var lid = box(1.0, .1, .72, M.navy, x + (x < 0 ? -.3 : .3), .52, .62, sp); lid.rotation.z = x < 0 ? .55 : -.55;
    });
    var fib = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x7ff0e0, emissiveIntensity: .6, roughness: .3 });
    var fL = cyl(.028, .028, 1.35, fib, -.72, .22, .62, sp, Math.PI / 2), fR = cyl(.028, .028, 1.35, fib, .72, .22, .62, sp, Math.PI / 2);
    [-.11, .11].forEach(function (x) { var e = cyl(.035, .02, .62, M.steel, x, .42, .62, sp); e.rotation.z = x < 0 ? -.35 : .35; });
    var arc = sprite(.2, 0); arc.position.set(0, .26, .62); sp.add(arc);
    var arcLight = new THREE.PointLight(0x9ffcf0, 0, 5); arcLight.position.set(0, .8, .62); sp.add(arcLight);
    var wind = box(3.5, .05, 1.0, M.glass, 0, .75, 1.1, sp); wind.rotation.x = -.35;
    [-1.5, -.75, 0, .75, 1.5].forEach(function (x, i) { cyl(.17, .17, .09, i === 2 ? M.teal : M.navy, x, .02, 1.5, sp); });
    /* monitor */
    var lidG = new THREE.Group(); lidG.position.set(0, 0, -1.55); sp.add(lidG);
    box(4.5, 2.7, .14, M.navy, 0, 1.45, 0, lidG);
    var cv = document.createElement('canvas'); cv.width = 1024; cv.height = 600; var g = cv.getContext('2d');
    var tex = new THREE.CanvasTexture(cv); tex.encoding = THREE.sRGBEncoding; tex.anisotropy = 8;
    var scr = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 2.4), new THREE.MeshBasicMaterial({ map: tex })); scr.position.set(0, 1.45, .08); lidG.add(scr);
    lidG.rotation.x = -.5;

    /* ---- bandeja de empalmes ---- */
    var tr = new THREE.Group(); tr.position.set(3.1, -.9, 1.3); tr.rotation.y = -.15; root.add(tr);
    var tbase = new THREE.Mesh(new THREE.ExtrudeGeometry(S.roundRect(3.5, 2.4, .35), { depth: .12, bevelEnabled: true, bevelThickness: .03, bevelSize: .03, bevelSegments: 3 }), M.body);
    tbase.rotation.x = -Math.PI / 2; tr.add(tbase);
    var holeShape = S.roundRect(3.5, 2.4, .35); holeShape.holes.push(S.roundRect(3.15, 2.05, .28));
    var rim = new THREE.Mesh(new THREE.ExtrudeGeometry(holeShape, { depth: .24, bevelEnabled: false }), M.navy); rim.rotation.x = -Math.PI / 2; tr.add(rim);
    var cols = [0xe0a800, 0x2e7fd0, 0x2fa56a, 0xe8892b];
    for (var i = 0; i < 4; i++) {
      var tor = new THREE.Mesh(new THREE.TorusGeometry(1, .03, 8, 70), new THREE.MeshStandardMaterial({ color: cols[i], roughness: .45 }));
      tor.rotation.x = Math.PI / 2; tor.scale.set(.85 + i * .12, .5 + i * .1, 1); tor.position.set(0, .15, 0); tr.add(tor);
    }
    box(1.3, .14, .46, M.steel, 0, .19, 0, tr);
    var sleeveMat = new THREE.MeshPhysicalMaterial({ color: 0x9fd8d0, transparent: true, opacity: .55, roughness: .1, emissive: 0x2fe0cf, emissiveIntensity: 0 });
    for (var k = 0; k < 4; k++) cyl(.07, .07, 1.05, sleeveMat, 0, .3, -.15 + k * .1, tr, Math.PI / 2);
    var sleeveGlow = sprite(1.3, 0); sleeveGlow.position.set(0, .35, 0); tr.add(sleeveGlow);

    /* ---- fibras: entra a la fusionadora, sale de ella hacia la bandeja y de la bandeja hacia afuera ---- */
    root.add(tube([[-5.3, -.1, 1.9], [-4.6, .2, .9], [-3.8, .22, .22]], .055, M.yellow, 30));
    root.add(tube([[-.2, .22, .22], [.5, .24, .4], [1.5, .15, 1.0], [2.0, -.55, 1.6], [2.0, -.7, 1.35]], .028, new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x7ff0e0, emissiveIntensity: .4, roughness: .3 }), 60));
    root.add(tube([[4.9, -.7, 1.0], [5.5, -.65, 1.6], [6.2, -.7, 2.4]], .06, M.blue, 24));

    var fr = 0;
    function draw(p, f) {
      g.fillStyle = '#08121f'; g.fillRect(0, 0, 1024, 600);
      g.fillStyle = '#13263f'; g.fillRect(0, 0, 1024, 64); g.fillStyle = '#2fd3c0'; g.font = '700 34px "Big Shoulders Display",sans-serif'; g.fillText('SAYME · FUSIÓN SM', 24, 44);
      g.fillStyle = '#6b7a8c'; g.font = '500 20px "JetBrains Mono",monospace'; g.fillText('MODO AUTO · 1550 nm', 640, 42);
      var gap = p < 1.4 ? 70 * (1 - clamp(p / 1.2)) + 6 : 0;
      var join = p > 1.4;
      g.fillStyle = '#e8eef3'; g.fillRect(40, 250, 450 - gap / 2, 40); g.fillRect(534 + gap / 2, 250, 450 - gap / 2, 40);
      g.fillStyle = '#2fd3c0'; g.fillRect(40, 266, 450 - gap / 2, 8); g.fillRect(534 + gap / 2, 266, 450 - gap / 2, 8);
      if (join) { g.fillStyle = 'rgba(47,211,192,.5)'; g.fillRect(484, 262, 56, 16); }
      if (f > 0) {
        var R = 120 + f * 260, gr = g.createRadialGradient(512, 270, 0, 512, 270, R);
        gr.addColorStop(0, 'rgba(255,255,255,' + Math.min(1, f * 1.5) + ')'); gr.addColorStop(.35, 'rgba(160,255,240,' + f * .7 + ')'); gr.addColorStop(1, 'rgba(120,255,235,0)');
        g.fillStyle = gr; g.fillRect(0, 64, 1024, 536);
        g.strokeStyle = 'rgba(255,255,255,' + f + ')'; g.lineWidth = 3; g.beginPath(); g.moveTo(512 - 260 * f, 270); g.lineTo(512 + 260 * f, 270); g.moveTo(512, 270 - 120 * f); g.lineTo(512, 270 + 120 * f); g.stroke();
      }
      g.fillStyle = '#9fb2c4'; g.font = '500 24px "JetBrains Mono",monospace';
      g.fillText(p < 1.4 ? 'ALINEANDO NÚCLEOS…' : (p < 2.2 ? 'FUSIONANDO…' : 'PÉRDIDA ESTIMADA'), 40, 460);
      g.fillStyle = '#e8eef3'; g.font = '700 76px "Big Shoulders Display",sans-serif'; g.fillText(p > 2.2 && p < 4.5 ? '0.02 dB' : '— — —', 40, 550);
      if (p > 2.2 && p < 4.5) { g.fillStyle = '#1bd76a'; g.beginPath(); g.arc(620, 535, 12, 0, 6.3); g.fill(); g.fillStyle = '#c9d6e2'; g.font = '500 28px "JetBrains Mono",monospace'; g.fillText('EMPALME OK', 645, 546); }
      tex.needsUpdate = true;
    }
    draw(0, 0);
    return function () {
      var p = ctx.t % 5.2, f = (p > 1.4 && p < 2.2) ? Math.sin(clamp((p - 1.4) / .8) * Math.PI) : 0;
      arc.material.opacity = f; arc.scale.setScalar(.2 + f * 1.4); arcLight.intensity = f * 4;
      var after = p > 2.0 && p < 4.6 ? clamp(1 - Math.abs(p - 2.6) / 1.4) : 0;
      sleeveMat.emissiveIntensity = after * 1.2; sleeveGlow.material.opacity = after * .8;
      fR.visible = true; fL.visible = true;
      if (++fr % 2 === 0) draw(p, f);
    };
  });
})();
