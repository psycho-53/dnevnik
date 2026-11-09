/* Mood Cosmos v2: five mood-dependent painted scenes. No personal data read. */
(function(){
"use strict";
var panel=document.querySelector(".solar-system-panel");
if(!panel || !window.HTMLCanvasElement) return;
var wrapper=document.createElement("div");
wrapper.className="mood-sky-stage";
wrapper.setAttribute("aria-hidden","true");
var canvases=[];
for(var k=0;k<2;k++){
 var c=document.createElement("canvas");
 c.className="mood-sky";
 wrapper.appendChild(c);
 canvases.push(c);
}
panel.insertBefore(wrapper,panel.firstChild);
var previousMood=-1,active=-1,lastW=0,lastH=0;
var PALETTES={
 0:["#071025","#0b1530","#09101e","#c3d5fc"],
 1:["#190b1b","#2b0d24","#0b0a1c","#ffd8d9"],
 2:["#11102b","#1a1040","#080c24","#dbc6ff"],
 3:["#071528","#0c2340","#061324","#c1e3ff"],
 4:["#06232b","#0c2b3e","#071222","#cbfff1"],
 5:["#1c1221","#36201f","#100e23","#ffedc1"]
};
function seeded(seed){return function(){seed|=0;seed=(seed+0x6D2B79F5)|0;var t=Math.imul(seed^seed>>>15,1|seed);t^=t+Math.imul(t^t>>>7,61|t);return((t^t>>>14)>>>0)/4294967296}}
function rgba(hex,alpha){
 var h=hex.replace("#","");
 return "rgba("+parseInt(h.slice(0,2),16)+","+parseInt(h.slice(2,4),16)+","+parseInt(h.slice(4,6),16)+","+alpha+")";
}
function softCloud(ctx,x,y,rx,ry,angle,color,opacity){
 if(rx<=0||ry<=0||opacity<=0)return;
 ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(rx,ry);
 var g=ctx.createRadialGradient(0,0,0,0,0,1);
 g.addColorStop(0,rgba(color,opacity));
 g.addColorStop(.32,rgba(color,opacity*.58));
 g.addColorStop(.68,rgba(color,opacity*.15));
 g.addColorStop(1,rgba(color,0));
 ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,1,0,Math.PI*2);ctx.fill();
 ctx.restore();
}
function cloudStream(ctx,w,h,rand,opts){
 var n=opts.n||60;
 for(var j=0;j<n;j++){
  var t=rand(),scatter=(rand()-.5);
  var x=(opts.x+(opts.dx||0)*t+scatter*(opts.scatterX||.06))*w;
  var y=(opts.y+(opts.dy||0)*t+Math.sin(t*Math.PI*(opts.waves||1))* (opts.wave||0)+(rand()-.5)*(opts.scatterY||.12))*h;
  var rad=(opts.size||.11)*(.6+rand()*.88);
  var color=opts.colors[Math.floor(rand()*opts.colors.length)];
  softCloud(ctx,x,y,w*rad,h*rad*(opts.squash||.68),rand()*.8-.4,color,(opts.alpha||.16)*(.45+rand()*.8));
 }
}
function strokes(ctx,w,h,color,points,width,alpha,blur){
 ctx.save();ctx.beginPath();ctx.moveTo(points[0]*w,points[1]*h);
 for(var i=2;i+5<points.length;i+=6){
  ctx.bezierCurveTo(points[i]*w,points[i+1]*h,points[i+2]*w,points[i+3]*h,points[i+4]*w,points[i+5]*h);
 }
 ctx.strokeStyle=rgba(color,alpha);ctx.lineWidth=Math.max(1,width*Math.min(w,h));
 ctx.lineCap="round";ctx.shadowColor=rgba(color,alpha);ctx.shadowBlur=blur*Math.min(w,h);
 ctx.stroke();ctx.restore();
}
function spark(ctx,x,y,r,color,alpha,sharp){
 ctx.save();ctx.globalAlpha=alpha;
 var g=ctx.createRadialGradient(x,y,0,x,y,r*5);
 g.addColorStop(0,rgba(color,1));g.addColorStop(.16,rgba(color,.55));g.addColorStop(1,rgba(color,0));
 ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r*5,0,Math.PI*2);ctx.fill();
 ctx.fillStyle=rgba(color,.95);ctx.beginPath();ctx.arc(x,y,Math.max(.45,r*.58),0,Math.PI*2);ctx.fill();
 if(sharp){
  ctx.strokeStyle=rgba(color,.7);ctx.lineWidth=Math.max(.55,r*.25);
  ctx.beginPath();ctx.moveTo(x-r*3,y);ctx.lineTo(x+r*3,y);ctx.moveTo(x,y-r*4);ctx.lineTo(x,y+r*4);ctx.stroke();
 }
 ctx.restore();
}
function skyStars(ctx,w,h,rand,mood,color){
 var density=mood===3?125:(mood===1?85:(mood===5?200:145));
 for(var i=0;i<density;i++){
  var x=rand()*w,y=rand()*h,r=.28+rand()*(mood===5?1.4:1);
  var alpha=.2+rand()*.52;
  ctx.fillStyle=rgba(color,alpha);
  ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
  if(rand()>.97)spark(ctx,x,y,r*1.5,color,alpha*.75,true);
 }
}
function drawBackground(ctx,w,h,colors){
 var g=ctx.createLinearGradient(0,0,w,h);
 g.addColorStop(0,colors[0]);g.addColorStop(.56,colors[1]);g.addColorStop(1,colors[2]);
 ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
}
function drawScene(canvas,mood,w,h){
 var dpr=Math.min(window.devicePixelRatio||1,1.6);
 canvas.width=Math.max(1,Math.round(w*dpr));
 canvas.height=Math.max(1,Math.round(h*dpr));
 var ctx=canvas.getContext("2d",{alpha:false});
 if(!ctx)return;
 ctx.setTransform(canvas.width/w,0,0,canvas.height/h,0,0);
 var rand=seeded(11083+mood*293);
 var colors=PALETTES[mood]||PALETTES[0];
 drawBackground(ctx,w,h,colors);
 ctx.globalCompositeOperation="screen";
 if(mood===1){
  cloudStream(ctx,w,h,rand,{x:-.13,y:.22,dx:.91,dy:.56,wave:-.14,n:95,size:.19,squash:.63,scatterX:.16,scatterY:.21,colors:["#ae1838","#f04459","#c43e69","#8e325c"],alpha:.23});
  cloudStream(ctx,w,h,rand,{x:.41,y:-.21,dx:.65,dy:.64,wave:.17,n:67,size:.2,squash:.66,colors:["#d94965","#982b50","#f27873"],alpha:.20});
  softCloud(ctx,w*.27,h*.49,w*.35,h*.30,-.35,"#ee5278",.30);
  softCloud(ctx,w*.43,h*.58,w*.15,h*.14,.2,"#ffd1be",.21);
  strokes(ctx,w,h,"#ffb1b8",[ -.08,.65,.20,.28,.27,.68,.54,.29,.76,-.02,.83,.14,1.15,.29 ],.018,.26,.027);
  strokes(ctx,w,h,"#ff648e",[ -.12,.81,.19,.53,.51,.67,.72,.42,.89,.32,1.12,.57 ],.038,.15,.06);
 }else if(mood===2){
  cloudStream(ctx,w,h,rand,{x:.16,y:.12,dx:.7,dy:.75,wave:-.32,n:125,size:.14,squash:.78,colors:["#8351c0","#b878d9","#534cae","#8d3c9d"],alpha:.20});
  cloudStream(ctx,w,h,rand,{x:-.19,y:.66,dx:.76,dy:-.7,wave:.16,n:65,size:.16,scatterY:.2,colors:["#7a4fdb","#a165cd","#5845a7"],alpha:.2});
  for(var j=0;j<85;j++){
   var t=j/85,theta=1.2+t*Math.PI*3.2,rr=.04+t*.37;
   var x=w*(.53+Math.cos(theta)*rr*1.32),y=h*(.50+Math.sin(theta)*rr*.82);
   softCloud(ctx,x,y,w*(.025+t*.045),h*(.03+t*.05),theta,
    j%3===0?"#e2a4f5":"#8154d5",.14+rand()*.1);
  }
  strokes(ctx,w,h,"#cca2ff",[.04,.68,.16,.30,.46,.14,.78,.39,.94,.53,.85,.81],.019,.35,.022);
  softCloud(ctx,w*.48,h*.40,w*.25,h*.25,0,"#bd7ddd",.25);
 }else if(mood===3||mood===0){
  cloudStream(ctx,w,h,rand,{x:-.11,y:.55,dx:.91,dy:-.37,wave:.08,n:65,size:.17,squash:.7,colors:["#3973bc","#4a88c7","#4564a8"],alpha:.12});
  cloudStream(ctx,w,h,rand,{x:.45,y:-.2,dx:.48,dy:.6,n:34,size:.14,colors:["#3855a6","#6189c0"],alpha:.14});
  softCloud(ctx,w*.72,h*.20,w*.24,h*.25,0,"#62a0e2",.18);
  softCloud(ctx,w*.18,h*.78,w*.30,h*.24,0,"#456fbc",.19);
 }else if(mood===4){
  cloudStream(ctx,w,h,rand,{x:-.07,y:.63,dx:1.14,dy:-.38,wave:-.11,n:95,size:.16,squash:.8,colors:["#1f9fa4","#36d1ba","#2b889f","#659bd7"],alpha:.18});
  softCloud(ctx,w*.73,h*.31,w*.44,h*.3,-.35,"#34d8cc",.27);
  softCloud(ctx,w*.24,h*.18,w*.3,h*.31,.25,"#51e7c4",.25);
  strokes(ctx,w,h,"#3cf3cd",[-.12,.50,.11,.06,.41,.08,.61,.26,.79,.43,1.11,.07],.20,.24,.07);
  strokes(ctx,w,h,"#8cf6de",[-.14,.35,.15,.04,.44,.29,.64,.19,.79,.06,1.11,.28],.085,.29,.039);
  strokes(ctx,w,h,"#49cde3",[-.10,.77,.18,.29,.46,.32,.67,.49,.88,.70,1.1,.39],.14,.21,.068);
  strokes(ctx,w,h,"#c3ffeb",[-.05,.48,.10,.22,.35,.12,.59,.31,.83,.52,1.06,.27],.008,.39,.009);
 }else if(mood===5){
  cloudStream(ctx,w,h,rand,{x:-.19,y:.78,dx:1.31,dy:-.63,wave:-.12,n:120,size:.17,squash:.75,colors:["#cd8658","#eeb36f","#8d6898","#e6a081"],alpha:.21});
  cloudStream(ctx,w,h,rand,{x:.4,y:-.19,dx:.58,dy:.71,wave:.17,n:65,size:.16,colors:["#ffc880","#dc916c","#b47d9d"],alpha:.18});
  softCloud(ctx,w*.77,h*.28,w*.38,h*.32,0,"#ffd193",.36);
  softCloud(ctx,w*.36,h*.7,w*.3,h*.25,.24,"#ffab75",.22);
  for(var s=0;s<90;s++){
   var angle=rand()*Math.PI*2,rad=Math.sqrt(rand());
   var sx=w*(.76+Math.cos(angle)*rad*.22),sy=h*(.29+Math.sin(angle)*rad*.23);
   spark(ctx,sx,sy,.7+rand()*1.8,rand()>.38?"#ffe5a9":"#d4dbff",.32+rand()*.63,rand()>.9);
  }
  strokes(ctx,w,h,"#ffdbac",[.18,.81,.35,.66,.59,.53,.82,.29,.9,.17,1.11,.05],.015,.26,.02);
  spark(ctx,w*.77,h*.28,4,"#fff6d9",.85,true);
  spark(ctx,w*.25,h*.73,2.5,"#ffebb9",.7,true);
 }
 ctx.globalCompositeOperation="source-over";
 skyStars(ctx,w,h,rand,mood,colors[3]);
 if(mood===1){for(var z=0;z<20;z++)spark(ctx,w*(.12+rand()*.8),h*(.2+rand()*.65),.5+rand(), "#ffd9c8",.25+rand()*.35,false)}
 if(mood===4){for(var q=0;q<24;q++)spark(ctx,w*rand(),h*(.1+rand()*.65),.7+rand(), "#b3fff0",.2+rand()*.3,false)}
 // Dark vignette restores depth around the real interactive planetary system.
 var shade=ctx.createRadialGradient(w*.5,h*.48,Math.min(w,h)*.12,w*.5,h*.48,Math.max(w,h)*.76);
 shade.addColorStop(0,"rgba(2,4,15,0)");shade.addColorStop(1,"rgba(1,3,12,.38)");
 ctx.fillStyle=shade;ctx.fillRect(0,0,w,h);
}
function sync(){
 var w=panel.clientWidth,h=panel.clientHeight;if(w<70||h<70)return;
 var raw=Number(panel.getAttribute("data-mood")),mood=(raw>=1&&raw<=5)?raw:3;
 var moved=(Math.abs(w-lastW)>1||Math.abs(h-lastH)>1);
 if(mood===previousMood&&!moved)return;
 lastW=w;lastH=h;
 if(moved&&active>=0){
  drawScene(canvases[active],mood,w,h);
  previousMood=mood;return;
 }
 var next=active===0?1:0;
 drawScene(canvases[next],mood,w,h);
 canvases[next].classList.add("is-active");
 if(active>=0)canvases[active].classList.remove("is-active");
 active=next;previousMood=mood;
}
var mutation=new MutationObserver(sync);
mutation.observe(panel,{attributes:true,attributeFilter:["data-mood"]});
if("ResizeObserver" in window)new ResizeObserver(sync).observe(panel);
else window.addEventListener("resize",sync,{passive:true});
document.addEventListener("visibilitychange",function(){if(!document.hidden)sync()});
sync();
})();