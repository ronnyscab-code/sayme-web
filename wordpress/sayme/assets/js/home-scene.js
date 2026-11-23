(function(){
  if(!window.THREE) return;
  var canvas=document.getElementById('scene');
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  var scene=new THREE.Scene();
  var camera=new THREE.PerspectiveCamera(50,1,.1,100);
  camera.position.set(0,0,9);
  var root=new THREE.Group(); scene.add(root);

  var L=34, ZSTART=-22;           /* largo del haz y su inicio en z */
  var cfg=[
    {color:0x6b7a8c,n:8, twist:16, r:1.05, pulses:4, speed:.10},   /* cobre (pizarra): pares muy trenzados */
    {color:0x1f3a5f,n:6, twist:3,  r:1.55, pulses:5, speed:.22},   /* OS2 (marino): hebras largas y rápidas */
    {color:0x0f9688,n:8, twist:5,  r:2.05, pulses:4, speed:.16}    /* OM3/OM4 (verde azulado) */
  ];
  var groups=[];
  var dc=document.createElement('canvas');dc.width=dc.height=32;var dx=dc.getContext('2d');dx.fillStyle='#fff';dx.beginPath();dx.arc(16,16,14,0,7);dx.fill();
  var dot=new THREE.CanvasTexture(dc);

  cfg.forEach(function(c,gi){
    var strands=[], lineMats=[], N=c.n;
    var g={c:c,strands:[],lines:[],pts:null,pp:null,pk:[],target:1,op:1};
    var SEG=220;
    for(var s=0;s<N;s++){
      var phase=(s/N)*Math.PI*2, rr=c.r*(0.9+0.2*((s%3)/2));
      var pos=new Float32Array((SEG+1)*3);
      for(var k=0;k<=SEG;k++){
        var u=k/SEG, a=phase+u*c.twist*Math.PI*2*(L/34);
        pos[k*3]=Math.cos(a)*rr; pos[k*3+1]=Math.sin(a)*rr; pos[k*3+2]=ZSTART+u*L;
      }
      var geo=new THREE.BufferGeometry();
      geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
      var mat=new THREE.LineBasicMaterial({color:c.color,transparent:true,opacity:.5});
      var line=new THREE.Line(geo,mat); root.add(line);
      g.lines.push(line);
      g.strands.push({phase:phase,rr:rr});
      for(var p=0;p<c.pulses;p++) g.pk.push({s:s,u:Math.random()});
    }
    g.pp=new Float32Array(g.pk.length*3);
    var pg=new THREE.BufferGeometry();
    pg.setAttribute('position',new THREE.BufferAttribute(g.pp,3));
    g.pm=new THREE.PointsMaterial({color:c.color,size:.24,map:dot,alphaTest:.3,transparent:true,opacity:1,depthWrite:false});
    g.pts=new THREE.Points(pg,g.pm); root.add(g.pts);
    groups.push(g);
  });

  /* núcleo: cilindro tenue que da la sensación de manguera */
  var core=new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,L,16,1,true),new THREE.MeshBasicMaterial({color:0xc9d6df,wireframe:true,transparent:true,opacity:.6}));
  core.rotation.x=Math.PI/2; core.position.z=ZSTART+L/2; root.add(core);

  var active=-1;
  var chips=document.querySelectorAll('.chip');
  chips.forEach(function(b){b.addEventListener('click',function(){
    active=parseInt(b.dataset.g,10);
    chips.forEach(function(o){o.setAttribute('aria-pressed',o===b?'true':'false');});
  });});

  function resize(){
    var w=canvas.clientWidth,h=canvas.clientHeight;
    renderer.setSize(w,h,false);
    camera.aspect=w/h; camera.updateProjectionMatrix();
    root.position.x = w>820 ? 2.8 : 0;
    root.position.y = w>820 ? 0 : 1.4;
  }
  addEventListener('resize',resize); resize();

  var mx=0,my=0;
  addEventListener('pointermove',function(e){mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;});

  /* el haz está inclinado para que se vea en perspectiva */
  root.rotation.x=-.5; root.rotation.y=-.55;
  var base={x:-.5,y:-.55}, spin=0, last=performance.now();

  function frame(now){
    var dt=Math.min((now-last)/1000,.05); last=now;
    if(!reduce) spin+=dt*.18;
    root.rotation.z=spin;
    root.rotation.x+=((base.x+my*.35)-root.rotation.x)*.05;
    root.rotation.y+=((base.y+mx*.5)-root.rotation.y)*.05;

    groups.forEach(function(g,gi){
      var on=(active===-1||active===gi);
      var tl=on?.55:.07, tp=on?1:.12;
      g.op+=((on?1:0)-g.op)*.08;
      g.lines.forEach(function(l){l.material.opacity+=(tl-l.material.opacity)*.08;});
      g.pm.opacity+=(tp-g.pm.opacity)*.08;
      g.pm.size=.24+(on&&active!==-1?.08:0);
      for(var i=0;i<g.pk.length;i++){
        var p=g.pk[i];
        if(!reduce) p.u+=dt*g.c.speed;
        if(p.u>1) p.u-=1;
        var st=g.strands[p.s], a=st.phase+p.u*g.c.twist*Math.PI*2;
        g.pp[i*3]=Math.cos(a)*st.rr; g.pp[i*3+1]=Math.sin(a)*st.rr; g.pp[i*3+2]=ZSTART+p.u*L;
      }
      g.pts.geometry.attributes.position.needsUpdate=true;
    });
    renderer.render(scene,camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();