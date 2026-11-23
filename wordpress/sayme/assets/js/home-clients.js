(function(){
  /* Logos y nombres tomados de la presentación corporativa SAYME 2026 */
  var CLIENTS=window.SAYME_CLIENTS||[];
  var stage=document.getElementById('stage'),ring=document.getElementById('ring');
  var N=CLIENTS.length,step=360/N,cards=[];
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  CLIENTS.forEach(function(c){
    var el=document.createElement('div');el.className='cc';
    if(c.i){var im=new Image();im.src=c.i;im.alt=c.n;im.draggable=false;el.appendChild(im);}
    else{var sp=document.createElement('span');sp.className='nm';sp.textContent=c.n;el.appendChild(sp);}
    ring.appendChild(el);cards.push(el);
  });
  var CW=220,R=330,rot=0,vel=0,drag=false,lastX=0,auto=!reduce,tx=0,ty=0,tgt=null;
  function layout(){
    var w=stage.clientWidth;CW=w<560?150:220;
    R=Math.round((CW*1.12)/2/Math.tan(Math.PI/N));
    stage.style.setProperty('--cw',CW+'px');
    stage.style.perspective=(w<560?1000:1500)+'px';
  }
  addEventListener('resize',layout);layout();
  var capName=document.getElementById('capName'),capSub=document.getElementById('capSub'),lastFront=-1;
  function update(){
    var best=0,bd=999;
    cards.forEach(function(el,i){
      var a=((i*step+rot)%360+540)%360-180;
      var f=Math.cos(a*Math.PI/180);
      el.style.transform='rotateY('+(i*step)+'deg) translateZ('+R+'px)';
      el.style.opacity=(.3+.7*Math.pow((f+1)/2,2)).toFixed(3);
      el.style.zIndex=Math.round(f*100)+100;
      if(Math.abs(a)<bd){bd=Math.abs(a);best=i;}
    });
    cards.forEach(function(el,i){el.classList.toggle('front',i===best);});
    ring.style.transform='translateZ('+(-R)+'px) rotateX('+(-ty*6)+'deg) rotateY('+(rot+tx*10)+'deg)';
    if(best!==lastFront){lastFront=best;capName.textContent=CLIENTS[best].n;capSub.textContent='Cliente';}
  }
  function snap(){tgt=Math.round(rot/step)*step;}
  stage.addEventListener('pointerdown',function(e){drag=true;lastX=e.clientX;vel=0;tgt=null;auto=false;stage.classList.add('drag');});
  addEventListener('pointermove',function(e){
    var r=stage.getBoundingClientRect();tx=((e.clientX-r.left)/r.width-.5);ty=((e.clientY-r.top)/r.height-.5);
    if(!drag)return;var dx=e.clientX-lastX;lastX=e.clientX;rot+=dx*.35;vel=dx*.35;
  });
  addEventListener('pointerup',function(){if(!drag)return;drag=false;stage.classList.remove('drag');});
  function go(d){tgt=(tgt===null?Math.round(rot/step)*step:tgt)-d*step;auto=false;}
  document.getElementById('prev').onclick=function(){go(-1);};
  document.getElementById('next').onclick=function(){go(1);};
  stage.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){go(-1);e.preventDefault();}if(e.key==='ArrowRight'){go(1);e.preventDefault();}});
  var idle=0,last=performance.now();
  function frame(now){
    var dt=Math.min((now-last)/1000,.05);last=now;
    if(drag){idle=0;}
    else if(Math.abs(vel)>.02){rot+=vel;vel*=.94;idle=0;if(Math.abs(vel)<=.3)snap();}
    else if(tgt!==null){rot+=(tgt-rot)*.12;if(Math.abs(tgt-rot)<.05){rot=tgt;tgt=null;}idle=0;}
    else{idle+=dt;if(!reduce&&idle>3)auto=true;if(auto)rot-=dt*9;}
    update();requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* inclinación 3D de las tarjetas de proyectos */
  if(!reduce){document.querySelectorAll('.pc').forEach(function(c){
    c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect();var x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.setProperty('--ry',(x*10)+'deg');c.style.setProperty('--rx',(-y*10)+'deg');});
    c.addEventListener('pointerleave',function(){c.style.setProperty('--ry','0deg');c.style.setProperty('--rx','0deg');});
  });}
})();