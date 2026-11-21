/* Mo’s Hike Quest. © 2026 mitrilmo. Alle Rechte vorbehalten. Lädt nichts nach und speichert nichts. */
(function(){
var cv=document.getElementById('c'),x=cv.getContext('2d'),NOW=0;x.scale(2,2);
var W=680,H=340,GY=252,FY=286,LOOP=1350,GY0=252,FY0=286,gOff=0;
/* Schrift am Handy: Die Spielfläche wird auf Telefonen verkleinert angezeigt, deshalb wachsen Texte von 10 bis 15 Pixel mit (FB, höchstens 1,3). Schilder in der Spielwelt (Gewicht 500) bleiben. */
var FB=1,FQ=1,fontDesc=Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype,'font');
Object.defineProperty(x,'font',{get:function(){return fontDesc.get.call(x)},set:function(v){if(FQ>1&&!/(^|\s)500\s/.test(v))v=v.replace(/(\d+(?:\.\d+)?)px/,function(m,n){n=+n;return(n>=10&&n<=15?+(n*FQ).toFixed(1):n)+'px'});fontDesc.set.call(x,v)}});
function fbUpdate(){var s=cv.clientWidth/W;FB=FQ=(TOUCH&&s>0)?Math.min(1.3,Math.max(1,1.1/s)):1}
function fbDicht(){FQ=1+(FB-1)*.5}
var S={
 'Frühling':{sky:['#bfe0c2','#cfe8c8','#dfeed4','#eef6e0'],sun:'#fff3b0',mt:'#c3dcc8',hill:['#b3d6a8','#8dbd7c'],tree:['#4a8c3f','#2d5a27'],pine:false,gr:'#5a8f45',path:'#cdb98a',fg:'#2f6a2a',trunk:'#3b2a1c',leaf:'#2f6a2a',snow:false,night:false,k:'spring'},
 'Sommer':{sky:['#8fc7e8','#a9d6ec','#c6e5f0','#dff0f4'],sun:'#ffe27a',mt:'#a9c6d6',hill:['#a8d0c0','#74b095'],tree:['#3f8a5a','#27603f'],pine:false,gr:'#4f8a4a',path:'#d9c79a',fg:'#2a6a35',trunk:'#2f2418',leaf:'#1f5a30',snow:false,night:false,k:'summer'},
 'Herbst':{sky:['#e9c78f','#eed1a0','#f0dab2','#f3e3c4'],sun:'#fff0c8',mt:'#d3b48c',hill:['#dfba86','#c9935a'],tree:['#b5651d','#d08a2a'],pine:false,gr:'#8a6a3a',path:'#c9a46a',fg:'#6e4a1e',trunk:'#3a2615',leaf:'#a0481a',snow:false,night:false,k:'autumn'},
 'Winter':{sky:['#b9ccd8','#c9d9e2','#dbe6ec','#e8eff3'],sun:'#f6f9fb',mt:'#aebfcc',hill:['#e4ecf1','#cfdce5'],tree:['#3d5a4a','#2c4538'],pine:true,gr:'#f2f6f8',path:'#d5e0e8',fg:'#ffffff',trunk:'#4a3b30',leaf:'#f4f8fa',snow:true,night:false,k:'winter'},
 'Nacht':{sky:['#16223a','#1f2f4d','#2b3f63','#3b4f72'],sun:'#f4ecc8',mt:'#2a3a58',hill:['#2c3d5c','#233350'],tree:['#16243a','#101a2c'],pine:true,gr:'#1c2b3a',path:'#2c3f55',fg:'#0f1a2a',trunk:'#0b121e',leaf:'#0a1626',snow:false,night:true,k:'night'}
};
S['Höhle']={sky:['#141824','#1a2030','#20273a','#262E42'],sun:'#fff3b0',mt:'#1a2030',hill:['#1a2030','#20273a'],tree:['#1a2030','#141824'],pine:false,gr:'#5C4033',path:'#8B5A2B',fg:'#0d101a',trunk:'#0d101a',leaf:'#0d101a',snow:false,night:true,k:'cave'};
S['Grat']={sky:['#38BDF8','#7dd3fc','#bae6fd','#E0F2FE'],sun:'#fff7d6',mt:'#94A3B8',hill:['#7b8aa3','#5f6f89'],tree:['#64748B','#334155'],pine:false,gr:'#64748B',path:'#B8B2A6',fg:'#334155',trunk:'#334155',leaf:'#334155',snow:false,night:false,k:'ridge'};
S['Moor']={sky:['#2b3637','#46544f','#6b7c73','#8FA395'],sun:'#cfd8cf',mt:'#46544f',hill:['#46544f','#3a4a44'],tree:['#2c3e35','#1e2923'],pine:false,gr:'#2C3E35',path:'#6a4a32',fg:'#26331f',trunk:'#121815',leaf:'#26331f',snow:false,night:false,k:'moor'};
S['Küste']={sky:['#2c3747','#44505f','#64748B','#8793a5'],sun:'#e8ecf4',mt:'#475569',hill:['#3a4552','#2a3340'],tree:['#3F4E3C','#2f3d2e'],pine:false,gr:'#3F4E3C',path:'#55657a',fg:'#3a5a38',trunk:'#2b2f38',leaf:'#3a5a38',snow:false,night:false,k:'coast'};
var cur='Frühling';
function R(i){var v=Math.sin(i*127.1+311.7)*43758.5453;return v-Math.floor(v)}
function md(v,m){return((v%m)+m)%m}
function mix(a,b,t){function p(h){if(h.charAt(0)!=='#')return h.match(/[\d.]+/g).slice(0,3).map(Number);return[parseInt(h.substr(1,2),16),parseInt(h.substr(3,2),16),parseInt(h.substr(5,2),16)]}var A=p(a),B=p(b);return'rgb('+A.map(function(v,i){return Math.round(v+(B[i]-v)*t)}).join(',')+')'}
function hy(o,base,a1,k1,p1,a2,k2,p2,px){var t=(px+o)/LOOP*6.2832;return base+a1*Math.sin(t*k1+p1)+a2*Math.sin(t*k2+p2)}
function hills(o,base,a1,k1,p1,a2,k2,p2,col,hl){
 [1,0].forEach(function(sh){x.beginPath();x.moveTo(0,H);
  for(var px=0;px<=W+8;px+=8)x.lineTo(px,hy(o,base,a1,k1,p1,a2,k2,p2,px)+(sh?5:0));
  x.lineTo(W,H);x.closePath();x.fillStyle=sh?'rgba(0,0,0,.10)':col;x.fill()});
 x.beginPath();for(var q=0;q<=W+8;q+=8){var yy=hy(o,base,a1,k1,p1,a2,k2,p2,q);q?x.lineTo(q,yy):x.moveTo(q,yy)}
 x.strokeStyle=hl;x.lineWidth=1.5;x.stroke();
}
function mountains(o,P){
 function yy(px){var t=(px+o)/LOOP*6.2832;return 150-66*Math.pow(1-Math.abs(Math.sin(t*3+.5)),1.15)-9*Math.sin(t*9)}
 x.beginPath();x.moveTo(0,H);for(var px=0;px<=W+6;px+=6)x.lineTo(px,yy(px));x.lineTo(W,H);x.closePath();
 x.fillStyle=P.mt;x.fill();
 x.save();x.clip();x.fillStyle=P.night?'rgba(220,230,250,.35)':'rgba(255,255,255,.85)';x.fillRect(0,0,W,100);x.restore();
 x.beginPath();for(var q2=0;q2<=W+6;q2+=6){var y2=yy(q2);q2?x.lineTo(q2,y2):x.moveTo(q2,y2)}x.strokeStyle='rgba(255,255,255,.35)';x.lineWidth=1.2;x.stroke();
}
function cloud(cx,cy,s,a){x.globalAlpha=a;
 [[4,5,0],[0,0,1]].forEach(function(l){x.fillStyle=l[2]?'#ffffff':'rgba(0,0,0,.08)';
  x.beginPath();x.arc(cx+l[0]-14*s,cy+l[1],11*s,0,6.3);x.arc(cx+l[0],cy+l[1]-7*s,15*s,0,6.3);x.arc(cx+l[0]+16*s,cy+l[1],12*s,0,6.3);x.rect(cx+l[0]-14*s,cy+l[1],30*s,11*s);x.fill()});
 x.globalAlpha=1}
function bird(bx,by,ph){var f=Math.sin(ph)*4;x.strokeStyle='#3a4658';x.lineWidth=1.6;x.lineCap='round';x.beginPath();x.moveTo(bx-8,by-f);x.quadraticCurveTo(bx-3,by-4+f,bx,by);x.quadraticCurveTo(bx+3,by-4+f,bx+8,by-f);x.stroke()}
function f(sh,c){return sh?'rgba(0,0,0,.13)':c}
function round(px,gy,h,c1,c2,sh,det,i){
 x.fillStyle=f(sh,'#5b3d27');x.beginPath();x.moveTo(px-h*.05,gy);x.lineTo(px-h*.035,gy-h*.46);x.lineTo(px+h*.035,gy-h*.46);x.lineTo(px+h*.06,gy);x.closePath();x.fill();
 if(det&&!sh){x.strokeStyle='rgba(255,255,255,.18)';x.lineWidth=1;x.beginPath();x.moveTo(px-1,gy-2);x.lineTo(px-1,gy-h*.4);x.stroke();
  x.strokeStyle='#5b3d27';x.lineWidth=2.2;x.beginPath();x.moveTo(px,gy-h*.3);x.lineTo(px+h*.14,gy-h*.46);x.stroke()}
 x.fillStyle=f(sh,c2);x.beginPath();x.arc(px-h*.22,gy-h*.52,h*.22,0,6.3);x.arc(px+h*.22,gy-h*.52,h*.22,0,6.3);x.arc(px,gy-h*.5,h*.24,0,6.3);x.fill();
 x.fillStyle=f(sh,c1);x.beginPath();x.arc(px,gy-h*.68,h*.32,0,6.3);x.arc(px-h*.2,gy-h*.64,h*.2,0,6.3);x.arc(px+h*.2,gy-h*.64,h*.2,0,6.3);x.fill();
 if(det&&!sh){x.fillStyle=mix(c1,'#ffffff',.2);x.beginPath();x.arc(px-h*.1,gy-h*.78,h*.12,0,6.3);x.arc(px+h*.12,gy-h*.72,h*.08,0,6.3);x.fill();
  x.fillStyle=mix(c2,'#000000',.18);for(var k=0;k<5;k++){x.beginPath();x.arc(px-h*.26+R(i*5+k)*h*.52,gy-h*.42-R(i*7+k)*h*.1,h*.045,0,6.3);x.fill()}
  x.fillStyle=mix(c1,'#ffffff',.3);for(var k2=0;k2<4;k2++){x.beginPath();x.arc(px-h*.22+R(i*3+k2)*h*.44,gy-h*.62-R(i*11+k2)*h*.2,h*.03,0,6.3);x.fill()}}
}
function birch(px,gy,h,c1,sh,det,i){
 x.fillStyle=f(sh,'#efe9dc');x.beginPath();x.roundRect(px-h*.035,gy-h*.62,h*.07,h*.62,2);x.fill();
 if(det&&!sh){x.fillStyle='#4a4038';for(var k=0;k<5;k++)x.fillRect(px-h*.03,gy-h*.1-k*h*.11,h*.04+R(i+k)*2,2)}
 x.fillStyle=f(sh,c1);x.beginPath();x.ellipse(px,gy-h*.76,h*.22,h*.3,0,0,6.3);x.ellipse(px-h*.14,gy-h*.64,h*.14,h*.2,0,0,6.3);x.ellipse(px+h*.14,gy-h*.66,h*.14,h*.2,0,0,6.3);x.fill();
 if(det&&!sh){x.fillStyle=mix(c1,'#ffffff',.22);x.beginPath();x.ellipse(px-h*.06,gy-h*.84,h*.08,h*.12,0,0,6.3);x.fill()}
}
function pine(px,gy,h,c1,c2,snow,sh,det){
 x.fillStyle=f(sh,'#4a3322');x.fillRect(px-h*.03,gy-h*.14,h*.06,h*.14);
 for(var i=3;i>=0;i--){var w=h*(.15+i*.065),top=gy-h+i*h*.2,bot=top+h*.42;
  x.fillStyle=f(sh,i%2?c2:c1);x.beginPath();x.moveTo(px,top);x.lineTo(px+w*.55,top+(bot-top)*.55);x.lineTo(px+w*.38,top+(bot-top)*.55);x.lineTo(px+w,bot);x.lineTo(px-w,bot);x.lineTo(px-w*.38,top+(bot-top)*.55);x.lineTo(px-w*.55,top+(bot-top)*.55);x.closePath();x.fill();
  if(snow&&!sh){x.fillStyle='#f4f8fa';x.beginPath();x.moveTo(px,top);x.lineTo(px+w*.55,top+(bot-top)*.55);x.quadraticCurveTo(px,top+(bot-top)*.42,px-w*.55,top+(bot-top)*.55);x.closePath();x.fill()}}
}
function bare(px,gy,h,sh,det){x.strokeStyle=f(sh,'#4a3b30');x.lineCap='round';x.lineWidth=h*.06;x.beginPath();x.moveTo(px,gy);x.lineTo(px,gy-h*.55);x.stroke();
 x.lineWidth=h*.03;[[-1,.4],[1,.5],[-1,.62],[1,.7]].forEach(function(b){x.beginPath();x.moveTo(px,gy-h*b[1]);x.lineTo(px+b[0]*h*.22,gy-h*(b[1]+.2));x.stroke()});
 if(!sh&&det){x.fillStyle='#f4f8fa';x.beginPath();x.ellipse(px,gy-h*.58,h*.07,h*.025,0,0,6.3);x.fill()}}
var ACLR=null;
function layer(P,o,gy,sp,hh,far,dx){
 var n=Math.ceil(LOOP/sp),det=!far;
 [1,0].forEach(function(sh){for(var i=0;i<n;i++){
  var bx=i*sp+(R(i)*sp*.4),h=hh+R(i+3)*hh*.35,p=md(bx-o,LOOP);
  [p,p-LOOP].forEach(function(q){if(q>-70&&q<W+70){var xx=q+(sh?dx:0),yy=gy+(sh?3:0);if(ACLR){var ca=Math.min(1,Math.max(0,(Math.abs(q-ACLR[0])-ACLR[1])/50));if(ca<.02)return;x.globalAlpha=ca}
   var c1=far?mix(P.tree[0],P.hill[1],.55):P.tree[0],c2=far?mix(P.tree[1],P.hill[1],.55):P.tree[1];
   if(P.k==='autumn'&&!far){var a=['#b5651d','#d08a2a','#c2461e','#8f7a2a'];c1=a[i%4];c2=a[(i+1)%4]}
   if(P.pine){if(P.snow&&i%5===0&&!far)bare(xx,yy,h,sh,det);else pine(xx,yy,h,c1,c2,P.snow,sh,det)}
   else if(i%4===0)birch(xx,yy,h,P.k==='autumn'?'#e0b030':c1,sh,det,i);
   else round(xx,yy,h,c1,c2,sh,det,i);x.globalAlpha=1}})}});
}
function hut(P,o,ts){
 var px=md(900-o,LOOP);if(px>W+90)return;
 var gyy=hy(o,182,18,3,2,8,7,.4,px);
 x.save();x.translate(px,gyy+4);x.scale(1.45,1.45);x.translate(-px,-(gyy+4));
 x.fillStyle='rgba(0,0,0,.12)';x.fillRect(px-17,gyy-17,36,20);
 x.fillStyle=P.night?'#2c2418':'#a67a4a';x.fillRect(px-18,gyy-18,36,20);
 x.fillStyle=P.night?'#171210':'#6b3f22';x.beginPath();x.moveTo(px-23,gyy-17);x.lineTo(px,gyy-34);x.lineTo(px+23,gyy-17);x.closePath();x.fill();
 if(P.snow){x.fillStyle='#f4f8fa';x.beginPath();x.moveTo(px-21,gyy-19);x.lineTo(px,gyy-34);x.lineTo(px+21,gyy-19);x.quadraticCurveTo(px,gyy-26,px-21,gyy-19);x.fill()}
 x.fillStyle=P.night?'#ffd77a':'#f2e3b8';x.fillRect(px-12,gyy-12,8,8);
 x.fillStyle=P.night?'#4a3418':'#5a3a20';x.fillRect(px+4,gyy-12,8,14);
 x.fillRect(px+9,gyy-36,5,10);
 if(P.night){x.fillStyle='rgba(255,215,122,.18)';x.beginPath();x.arc(px-8,gyy-8,14,0,6.3);x.fill()}
 var sc=P.night?'220,230,250':'255,255,255';
 for(var i=0;i<7;i++){var t=(ts/1000*.22+i/7)%1;
  var sx=px+11.5+t*14+Math.sin(t*7+i)*2.5,sy=gyy-38-t*46,r=2.4+t*6.5,al=Math.max(0,(1-t)*.75);
  x.fillStyle='rgba('+sc+','+al+')';x.beginPath();x.arc(sx,sy,r,0,6.3);x.fill()}
 x.restore();
}
/* ---------- Zielhütte (Vordergrund, steht am Ende des Weges) ---------- */
function hutDraw(P,ts,hx,open,sign){
 if(hx<-200||hx>W+230)return;
 var by=FY-6,ni=P.night;
 x.save();x.translate(hx,by);x.scale(1.7,1.7);x.translate(-hx,-by);
 x.fillStyle='rgba(0,0,0,.16)';x.beginPath();x.ellipse(hx+4,by+4,70,6,0,0,6.3);x.fill();
 /* Wand aus Rundhölzern */
 x.fillStyle=ni?'#4a3320':'#a8744a';x.fillRect(hx-48,by-54,96,54);
 for(var i=0;i<6;i++){x.fillStyle=ni?'#3a2818':'#8a5b36';x.fillRect(hx-48,by-54+i*9+7,96,2);x.fillStyle=ni?'#58402a':'#bb8656';x.fillRect(hx-48,by-54+i*9,96,2)}
 [-1,1].forEach(function(s){for(var k=0;k<6;k++){x.fillStyle=ni?'#4a3320':'#9a6a40';x.beginPath();x.ellipse(hx+s*48,by-50+k*9,4,4.5,0,0,6.3);x.fill();x.fillStyle=ni?'#2a1c10':'#7a4f2c';x.beginPath();x.ellipse(hx+s*48+(s>0?1:-1),by-50+k*9,1.8,2.2,0,0,6.3);x.fill()}});
 /* Dach */
 x.fillStyle=ni?'#2a1810':'#6b3a20';x.beginPath();x.moveTo(hx-64,by-50);x.lineTo(hx,by-98);x.lineTo(hx+64,by-50);x.lineTo(hx+56,by-46);x.lineTo(hx,by-88);x.lineTo(hx-56,by-46);x.closePath();x.fill();
 x.fillStyle=ni?'#3a2216':'#8a4a28';x.beginPath();x.moveTo(hx-60,by-52);x.lineTo(hx,by-96);x.lineTo(hx+60,by-52);x.lineTo(hx,by-60);x.closePath();x.fill();
 x.strokeStyle=ni?'rgba(255,255,255,.06)':'rgba(255,220,180,.22)';x.lineWidth=1.4;for(var r=0;r<4;r++){x.beginPath();x.moveTo(hx-56+r*6,by-52-r*9.5);x.lineTo(hx+56-r*6,by-52-r*9.5);x.stroke()}
 if(P.snow){x.fillStyle='#f4f8fa';x.beginPath();x.moveTo(hx-66,by-49);x.lineTo(hx,by-100);x.lineTo(hx+66,by-49);x.quadraticCurveTo(hx,by-70,hx-66,by-49);x.fill()}
 /* Giebel mit Schild */
 x.fillStyle=ni?'#4a3320':'#a8744a';x.beginPath();x.moveTo(hx-44,by-54);x.lineTo(hx,by-90);x.lineTo(hx+44,by-54);x.closePath();x.fill();
 x.fillStyle=ni?'#2a1810':'#6b3a20';x.beginPath();x.roundRect(hx-17,by-74,34,13,3);x.fill();
 x.fillStyle=ni?'#e8d9a8':'#f6ebc8';x.font='bold 9px Georgia,serif';x.textAlign='center';x.fillText('HÜTTE',hx,by-64);x.textAlign='left';
 /* Schornstein */
 x.fillStyle=ni?'#2a2018':'#7a6050';x.fillRect(hx+30,by-96,10,26);x.fillStyle=ni?'#1a140e':'#5a4636';x.fillRect(hx+28,by-99,14,4);
 var sc=ni?'220,230,250':'255,255,255';
 for(var si=0;si<7;si++){var t=(ts/1000*.3+si/7)%1,sx=hx+35+t*16+Math.sin(t*7+si)*3,sy=by-102-t*50,rr=2.6+t*7,al=Math.max(0,(1-t)*.8);x.fillStyle='rgba('+sc+','+al+')';x.beginPath();x.arc(sx,sy,rr,0,6.3);x.fill()}
 /* Tür */
 var dx=hx-26,dw=22,dh=36;
 x.fillStyle=ni?'#1a1008':'#3a2414';x.beginPath();x.moveTo(dx,by);x.lineTo(dx,by-dh+10);x.quadraticCurveTo(dx+dw/2,by-dh-4,dx+dw,by-dh+10);x.lineTo(dx+dw,by);x.closePath();x.fill();
 if(open>0){
  var g2=x.createLinearGradient(dx,by-dh,dx,by);g2.addColorStop(0,'#ffe9a8');g2.addColorStop(1,'#ffc65a');x.fillStyle=g2;x.beginPath();x.moveTo(dx+2,by);x.lineTo(dx+2,by-dh+11);x.quadraticCurveTo(dx+dw/2,by-dh-1,dx+dw-2,by-dh+11);x.lineTo(dx+dw-2,by);x.closePath();x.fill();
  x.fillStyle='rgba(255,215,122,'+(.34*open)+')';x.beginPath();x.moveTo(dx+2,by);x.lineTo(dx+dw-2,by);x.lineTo(dx+dw+30,by+16);x.lineTo(dx-34,by+16);x.closePath();x.fill();
  x.fillStyle='#5a3a20';var lw=dw*(1-open*.78);x.beginPath();x.moveTo(dx+dw-lw,by);x.lineTo(dx+dw-lw,by-dh+11);x.lineTo(dx+dw,by-dh+11);x.lineTo(dx+dw,by);x.closePath();x.fill();
 }else{x.fillStyle=ni?'#2a1c10':'#5a3a20';x.beginPath();x.moveTo(dx+2,by);x.lineTo(dx+2,by-dh+11);x.quadraticCurveTo(dx+dw/2,by-dh,dx+dw-2,by-dh+11);x.lineTo(dx+dw-2,by);x.closePath();x.fill();x.fillStyle='#d9b85a';x.beginPath();x.arc(dx+dw-6,by-14,1.6,0,6.3);x.fill()}
 /* Fenster mit Blumenkasten */
 var wx=hx+12,wy=by-44;
 x.fillStyle='#4a2e18';x.fillRect(wx-1,wy-1,28,24);x.fillStyle=(open>0||ni)?'#ffe9a8':'#cfe3ea';x.fillRect(wx+1,wy+1,24,20);
 x.fillStyle='#4a2e18';x.fillRect(wx+12,wy+1,2,20);x.fillRect(wx+1,wy+10,24,2);
 x.fillStyle='#7a4a2a';x.fillRect(wx-3,wy+22,34,6);
 [['#d9573f',2],['#ffffff',8],['#f4a6c0',14],['#d9573f',20],['#ffd84a',26]].forEach(function(f){x.fillStyle='#3f7a38';x.fillRect(wx-1+f[1],wy+17,3,6);x.fillStyle=f[0];x.beginPath();x.arc(wx+f[1]+.5,wy+17,3,0,6.3);x.fill()});
 /* Laterne an der Tür */
 x.fillStyle='#2a2a2e';x.fillRect(dx+dw+3,by-44,2,8);x.fillStyle=(open>0||ni)?'#ffd77a':'#d9c79a';x.beginPath();x.roundRect(dx+dw+1,by-37,6,8,2);x.fill();
 if(open>0||ni){x.fillStyle='rgba(255,215,122,.22)';x.beginPath();x.arc(dx+dw+4,by-33,11,0,6.3);x.fill()}
 /* Bank und Holzstapel */
 x.fillStyle=ni?'#2a1c10':'#6b4a2a';x.fillRect(hx+54,by-12,26,3);x.fillRect(hx+56,by-9,3,9);x.fillRect(hx+75,by-9,3,9);
 /* Schild am Weg */
 x.fillStyle=ni?'#2a1c10':'#6b4a2a';x.fillRect(hx-86,by-34,3,34);
 x.fillStyle=ni?'#58402a':'#c9a46a';x.beginPath();x.roundRect(hx-102,by-36,36,14,3);x.fill();
 x.fillStyle=ni?'#2a1810':'#4b3320';x.font='bold 8px system-ui,sans-serif';x.textAlign='center';x.fillText(sign,hx-84,by-26);x.textAlign='left';
 x.restore();
}
function goalHut(P,ts){hutDraw(P,ts,150+(TOTAL+100-g.run),(g.mode==='over'&&g.won)?Math.min(1,g.tOver/1.1):0,'Ziel')}
function startHut(P,ts){hutDraw(P,ts,70-g.run,g.mode==='intro'?Math.min(1,g.tIn/.8):g.hutOpen,'Start')}
function eyes(ex,ey,s,look){x.fillStyle='#fff';x.beginPath();x.arc(ex-3*s,ey,2.8*s,0,6.3);x.arc(ex+3*s,ey,2.8*s,0,6.3);x.fill();
 x.fillStyle='#222';x.beginPath();x.arc(ex-3*s+look,ey,1.3*s,0,6.3);x.arc(ex+3*s+look,ey,1.3*s,0,6.3);x.fill()}
function shadow(px,w){x.fillStyle='rgba(0,0,0,.2)';x.beginPath();x.ellipse(px,FY+2,w,4,0,0,6.3);x.fill()}

/* ---------- Fuchs (Vektor) ---------- */
/* ---------- Marke: Logo, Wasserzeichen, Steckbrief ---------- */
var LOGO=new Image(),LOGOOK=false;LOGO.onload=function(){LOGOOK=true};LOGO.src='data:image/jpeg;base64,/9j/2wBDAAYGBgYHBgcICAcKCwoLCg8ODAwODxYQERAREBYiFRkVFRkVIh4kHhweJB42KiYmKjY+NDI0PkxERExfWl98fKf/2wBDAQYGBgYHBgcICAcKCwoLCg8ODAwODxYQERAREBYiFRkVFRkVIh4kHhweJB42KiYmKjY+NDI0PkxERExfWl98fKf/wgARCADAAMADASIAAhEBAxEB/8QAHAAAAQQDAQAAAAAAAAAAAAAABwAFBggBAwQC/8QAGwEAAQUBAQAAAAAAAAAAAAAABQACAwQGAQf/2gAMAwEAAhADEAAAALUpJJJJJJcjW9fAExiCzJ0g4+egwD01Tx040YOU9bEtU2ErJ11vnCmhIMHrBpvcD2mSSc9JJJJJJJDCCs7V54pHjsBHieV2Qqce3EDO5QzLmOVvkko4e5YwJSltGDPHG4DCxzyLC1fsAGY0IBXOQlLWx3ySVm2kuZrYbW7td8T5042GVe9Fq++Xzl+uX/Ppclm576KxHWvVlGM4s21jOUhRFDNDxwqeV492DigqFYkNsebyNxU1Ou49HQEOFQQWbxacUTqOIcmmDlQyfWfMJsWpwDpQHeDrRhRqa7Udm8gZ9o3C2tEVdM4RuQcNei7hkhMkfJvVmx0AGh+KxNMraddAgOQYwKCWPDR3D+o2hyzjivEYwIh+1Wc553YWnE5WFc5rOoO5wlwwnKj1jM8UfIM5xspZsMwdnEFeKzGMTJXZUI1C17ymHaZLBiX3sy7YwQtdu36rxrr++vElMFowcRUvT1EMTBJQ/ExSQ+3zfwNsWV5hGYRRpulPru7NAtEjgDGRKGkUWY7AdJLg0le+VkOMdeu3c7SxbvZUA806BBUOjq4U0OupdnagMhkkfVAMMjIGYTwLpESVu9H4BIdVSjCBZP4ZjsDM4yXQTJLbsOk8N6naWJ8bFfJVm9n32AzED2zzbeJC/mKniOIPzCXcyQFR68U6EB5i9y3L7olgqbBRmAxhoDK4vEQMuTw5bqFcuvpvRb57XO0zGREpV7M5k+++PWu1d842bFzT56MLvL73pIMPXQwgMuY1wOB3S4E84DleqSB6WKtBs/4tmCLJLqbnFaHU08ejRXLD+cW+r5rsTpNdzO9fZbcvFPXuxavavHSlzXs07V3OjdjnB/IYLFqAtvsGq7QQN7BqPWax85e0tz6Qkk+RCUtKtUpjJTJX/HYC0jPW0oFjvA6lB0Kmoq8xxkklnrLGX1KHNZ5ao4mp2FAxFhZBHNpzDAGk2JbL0BJK1cSSSSSSTW6JjK7Du5rOAy9SXkpQcOAcHIb8XGlVrH3ZxdrNL5t3oanhxkJg+wP6Wg1CST5Ekkv/xAAvEAABBQACAQMEAQMDBQAAAAAFAQIDBAYABxEQEhUTFBcgFiIwMiExNSQmMzZC/9oACAEBAAEIAP3ImxIyP33SXbA2JVbQudmaex5SKzptBZVVmdbtOXy5tu2xUVtfSH66+YqfZeprKn1BnbVN/hl8VoAhViLS/uGDo0PWWa2e7PJWlfCLmnmnldLNyhnDxDwtWv1hp5URZW9Slf8A6f1KVT/Cz1jpoUVY7+bPD/K2uRySRPa+MB2YWoqyIgD0QkxV+tS/s6/e0wiOq1iRS+UtPs3IYZZpGRRA+sCFpGTExeSzwpGrWIGRIxnuvWu18PWcqI/u7KovhGd3ZVV/qp9r4iyqI4cXEk2e6iVyWfLI5bJ3q8hVR8wyWGWGR8UtG/coWY7NTG9h1yix0r/77rdINR44c973vc9+cyxI/P7YAGWEgokSrqOx87nvfC5DXaG18/GjelKz1SYzS6xxNRE8MzGciREZNmM1Mnh9zrTE20XyT6UqMeswVTfaGKVPk8t2Nm9F7YU0GWEnYVSzo8qTAWEbYRVRfKYLfPndELJ/rvNcgSmlaq97nvc92Ox1g9Y+rM1o0MO8cN7rQ66+4NlMr1SGEpHYJIiIiInJylCG9WoP4qeqtRyKi6vqkOW99kaA3+gyd9obWSMGlx/hdjjpwNj6sKKqL5TrvZqTgQde9ThesHGWbkxQlaKX7Fyzlc3YPkmwNag4OM5fIHezji0B+fzgrPUGU6HoUJVBlC1dtPFavUQkNtDjtPW0oSC9H+mjJzigty9BK4XuJZxF0YUOdZnPjCcjBxgb4XVZywAJvrup3LFK1Dar5s7WNia9xnp2efW0SYLhhhlmljiiy4CEEJhqpuzd/XaGHKBs7nx+fFQ0KfET009qfcaqHM0KtaCpWhrwF4pOv9cwzWgmiliZJH66GyAWjNUK5bQZS5dtEk0eeGaIRNRt4I7fyh+fJGtTn4TomasssUkMr4pOtz6jTSU5eHScYsTduLPNLPNLNL1cDSyRmKS9j6hc9nZXQ9U5P4gL8jZVPHoQ7CBitNWC2Oy9h/Hw6QVut9IzOE1bbs9rk1PsswdgbNTllKtDqTXr/wCt39f2hCCO1aFWjarXqsFqsXKEbxNQgcflAI5Fk4BQPpQMdizPVvZH/rKHaGcgPAIjVDrzUfyLOwyTdoA0qkoicTXOa5HNy5lC4KjbXtgksQ6jQbzJC0FZ0fWU2n807RgGcb4aiIir55udbBlwz5+S5/Ni8xYfqPr3LsrJrnq5Z4pIrFfrellJsiZmudc7GkGNTAHDBNQQy65Nfo7FFlyMbmNg0PQrDeUCAi/WRlXHIteAuIeARcX2hZE814pCmdv1051IT/5Ec7sy6tjUSxczlD5E6MqcMX2DRJC87pQa91Uyam4RIUxlGzeuaI9b1BmcjZlV0r/a79ZVljbJ7HN9ycwRoTsByDDelw8LbqxhgY2W3NbmkoZDM1mxSwZFW2belIM7qoPiiCm4Bd+MkMo3WaGh8ecJVOYC79pqx3NRZ+50RebnWUCS6iN69r21rYi8idaVG1cQGTnnnZmyU+S+Jo+EY1ERrfH7KiKior2KxypyhfujL9a/Sy2iHaUEy3BjRDhQu1G80cdbe4ICFDa4sdVowdm00tYgvzqy2tnDjfPZddIdTK9Bk61iVKfl2RZLlmRepmp8wRdzu16plKLeZWNI8wCYm7ZqbAdaQCLq/fxJ4b+NOwufjTsLn407C5+NewufjTsLn407C5+NOwufjTsLj+sewH/7/i3fcw+W7DzBhs/CWWhJ3JZrY8YPGwJBS5rI0lzB1i9Kye/J2m87XYiGR7uIqpy6xY7lli9TvRDBFvO7WKuUou5lZGy5gE9P7q+uslSLLnnr0rGrMnadzth6KZHs9NLXWtoC0POs7KQ6iJi9rU1s4i+5OsraW8QHX0evtY53Mht00NqzVl0O6QScrjIptRZZqLYWOXdaWAhAOlLbQuNaGieE2c1oywQUobSW1T0s654w4uEgIOyW4Q/ds1JdJukDmqw2LSa9BV2EbSG7i0hOAcc9Oz7iVcQW51ZUWthxnnsuwkupmYg6D7ghTg52XSWtqrEnM7f+OODbfCw+MmKv0X9KEnsrmgs3Jv8AxScz6zCqtPRRXK887hhuwz/Ttixw2njtLPJzsGKxJo8syvjYZyOtuzGgn/FdicwZMcmZoU1CJMLgg0MN+KxaWkdsS2oAPZN20S2hWjob4McJ9O6r75WBAkAujGOGUaTT9/5A2St8wdP7rVDE524M91QffZzIlEK52hYU5/2V2jWJ8arXNRUVqKiosWbCR0ZqLLGfCzR04noIGoRUjywIGSkYL7rYgdcs1bFlQotSSEuQgQsEV6KOpks5Unjs15A+ZGj7NaaEdlStWrFBfFjyUKRXB4IOLV7qPHKiIqrnlXZ9n2i67AqgvO35051IO8ykiLtGIjKhbtFZI3xSPjf1ecSqRlFy9i5f+RZ2ZkPUmuQoH+MtLzzx80casR7Pu3NhV7qzHMkY51eBzpXK2rAx0LmpTrIxrEdXics3I6t3UFpLUh/OwgxrDQunOlipXnb6dr6pBQf4qt15mf47nIYZezzaWicQ2JEVV8JjQ6CM/Sru52aAWgX+/iilkhljljy2ghPCYrKb0Ffyh+HWhc5o6GiEwXqfJo5XxqsSW4kWVruef0awrlb91YNZoiBMWrUEEKN8dWsUl5ptHQzoqa9bwAC/pzs2tNarQQghMtlZZZJZHySdegflTkc0vpoglYyKsUZr1KzQuT1LOV0c4Am2w1jxxgaioUFHOsjnyYzN6gRoxzLVLj42SNVr1rx++V6NimasPhj7SNj+rFNDIsqJzxyxXgswSwT5zKE8+etrW0emE52g63fFijnZRtCpSaUeHGq92o0Vg+TfZfXgmszxQQ5PPQghENb9OxMapWv8hSVFRVRcbs7OesfTkjkFmRvuQ/gNBkiDjOTyXbggmkdUq17HNRzeefS39u9iRK17ljj93HOa1FVdV2wIFo+sKAYA7p76GtZLKNED/c/YbCwfs+yPnXWPWjG0te/XfYJ075Sgvmb1RPP2PfXzurDHWIsGp64zehR0z/gOz8S5VFDu64Yn/QNUezsRaTjNFk51lkb/ACLJV2R8udm4ip/uQ7qZJJ9AKuf7O2iopbMde53O+yWI/qhIKJVs6LTkj1j32eYTCOe6IoU/fZ9dwE1kvDrlO1SsSV7UUssMjJIgXaBKo1sBIVr86VRqV74oWSj9l231ViLKqqS9J5J3+DOk8q1f9afVeIrKirQFCxrPbRK67PCkd9c52eSto+EbLLJLI+SSCvPZmZDBkOu46Sx3S39k9mRJqssdw/1uaGq+Wm5rmuVruUNEdHePtK/Z2oi8fUZ2yWT/ADf2wWVP6LHZuolRUZf0R0j5+74iKqoiAevThX2SzAMqIBxeKv8AcL5YEXa5bZTqTwrlHXev9XU88nGka6qk6oqekA6/YXxBTweqt+PA7qWX+lxERkQAjw6r+/8A/8QARxAAAgEDAAUGCQoFAwMFAAAAAQIDAAQRBRIhIjEQQVFSYYETIzJCQ3KRodEUIDBicYKTscHCJDNTY5JEg7MGFeIlNEBUov/aAAgBAQAJPwD597FAOYMd4/Yo2mrGWc9eQ+DSpILcf24xn2tmtLXbZ/uEflVxKT2uTVxKD0hyK0tdr/usfzqeG4HRLGPzXFWDxdLxHXX2Gr2KXZkoDh+9Tg/S3KxJzdZj0KOc0nyWL+qdsp/RaleSRjlnclie88mjLiQHg2oQvtOBS28HryZPsWtJ2ncHNaTtD9ocULab1JcH2NWjLiMDi2plfauRyOyOpyGU4I+wigbyDrHZKO/nqcPjy04OnYw+iCzXvU82PterhpZDzngB0AcwqNndjhVUZJPYBUwtYz6Jd6U/oKsEMg9LJ4x/aa0hbW4x6SQKe4VfzT4/owsfeasdIn7sY/dVhpId0dX8sBP9aFgPaM1pC2uB/bkDe6rBBIfSxeLf3VMLqMeibdlH6Go2R1OGVhgg9oNTvFKhyHU4rVhu+Cngkv2dB+gcG6K4lkHof/OmLMxJJJySTzml1IVPjJ28lfiai1pSMPO+12+AqU3V2P8ATw8V9duC1bmwsW89PFL3yneatMTzyk5ZYRj2u+TWh0lPWndpK0JYDH9hK0JYH/YQfkK0OkR6YXaOtMzwSjagmH5OmDVub+xXz38avdKu0VKba7P+nmIBb1DwaotWUDCTpskX4il14HJ8FOvkN8DySjwvkwTsfL+q/b85x8tnXc/tr1zTFmYkkk5JJrWjso23353PUSjFa2lumSSdVEA5zUMqQnIe4G47L0k+Ylat/ecd8eJQ9imgABwA5LlFuJ0dooid5xHxx80AgjBFBbC847gxC57VHCoZWh4JcHfdV/eleCurS4jBBG8jA8CDWtJZSNiOTnQ9R+STN3Eu454yoP3D5h3Yk4DizHgo7TT60krZPQBzAdgrKwJhp5OqvxNalvaWsRJJ2KiLxJrXt9EQNl2PDHXk6W6q1CFXjJIfLlbrOeWTUggjLu36DtNSPDNbzB7CAcTFDx1Kwso3LiLqSD9DxHzY0eSIJqq3AlmC1aBUjsVm1uE9vca5R1BrXn0RO5ZHX/kj/ctGO4tLmLiNqsrcCDRLwvloJeunxFSFJYnDIw5iKIBIxJH1JBxHK/irXbL2yn4UhZ3YKqjiSdgFYMx35360h/QU+YI5cXEg8l3TiT9SOk3V2u58qR+d2+ZKRo2yfwmkJ04My1GscUSBI0XgqrsApD/2XSb6l3EvCJzTh0dQysDkEEZBHzL6KKKQAsvhArkKQ2wVJHZ31yTFLFJKBrqvBh2mhkMNaOQcY35nWjiJ5cW0h4I7cMfUkoATLv279Vx+hpSroxVlPEEbCKfFveEIc8Fl8w8mNWCIsB1m4KO80xaSRyzt0ljk0uUtdkXbK3wFPi7usw2/Z1n7hUeL2/UOc8Uh4qvK+HkXEk2dyF28hXp8X94pWDHGNOBkqQi0uhi4OM6rcz1F/wCnJu/JTxkTrE9eriQaP+TIJEK7JHfeOQedKk30ybJzzjiYqhFwsEgOkD1F6i/WqZZIJUDo44FTUgilRQ15d8RAh4Kv1zVqs83GS5uPGyN0klq0dbS68kgOY12ANu4I7Kkln0UD/EWbku0C9eImsPcWkQlR04yQHaafN3bYhue0gbr/AHhS4ju8iXslX4ijgg5B6DRy7Jqyj+4mxqO2eUyP6sfIuJDH4WX15NtHWsdHnUk9WLek9p2UABzDkw13NlLWM87dc/VWrh20zpP+Iyg8JPBzr/5VcSTNFGsUZc5IRBhQOwfMkaOeFg0bqcMCNoINSrJNMHGlHm2FFq+M+i5pz8huXBTUZuZg3ANUzMbi5eeWWUgEluYnoFXMV1FdW0iNGrZa3kIxroeg9FXMUHygxlp3BIgXGCcVf29ympqkCRXJBGDrUdZbC+eKPP8ASk3gKOLK/wByPo1ZN6I9x2UMyKnhovXj28h6s8YP+LVwt4I4u/yjXCS4QN6oOTWMW9vJJ3qNgrJluJxCrH/N+SURwQIXkb9B2mgVi8iCHmSMcBTM2waxJJOBsAyfnOypIAJFBIDYORmuNQiXSFpHhXLFWliHBvWFNfFIIzLelpSY4wBkIp65qxM1hbXapPJGAZURhnIBBzirCFyQGWRt/jwIoeLn0kUiPMVhXVyK2SwTmEsPxErGrcW8cn+a5IoYEVw4X1ScivJmLQt98V513J7jih/Jt5X78Yo4M8sMPcWya4yo8zfbIxPJL/AWr77jhNKOf7BQ2DgPoZDHPA4dWoBSwKTxc8ch8oGkw8l/O7fYG1F9woiW7kGrLMn8u1Q8ST1qG5CmM87HiWPaTXGERzj/AG2rjC80Pcj0P50EUnfjFHHg7iN/YwNcWmdj3sTXNZ/m4rztIr7o2rmsIPeoNWZklucpNMHVPBx9AyeLVohfxY60Uv4sdaKX8WOtEr+LHWiV/FjrRK/ix1olfxY60Sv4sdaJX8WOtEr+LHWiR+NHWiS1pNhLqITR7U6w7VrSmkGicj+GWXUiGBirVIY+hRx7Sec8nPYT+5c15mkH96Ka86z/ACc8nFZnHsauez/JxXm6RX3xtXPYQe5QP/g82j5/euK8/SD+5FFebZfm55PNu5fec0f51vKnfjNDJglhm7lbBrjCrwH/AG25OZSfZVqkEiRh0w5bXAODVokxPgxKxcjUMhqwWQx2ryo+uQWZU1wtf9MKt1KuskRm2sK0Gvyu8V8wGQ5Vg+qAK0S9jcuuUyxIarFFOjA2qA58ZgmoRG0gfKA5A1DirVIJEj148OW1wDg1apMWEZlYsRqa5qye9v5PQrwUHhnFaJaxkmIET5Oqc8vGYRwD77VxmeWbud6P8mCKPvxk16SeNP8AJgKGBcRRy+7BrhFcoW9UnBrGLi3kj72XYa2SwTCYKf8AB+TqN+VKxFtpIwXCjzo3QVnwukdKOy9kaMoFf/UP/HXNaj99TCKZmxHKRkIxkGDV1I+lLLcjjYBQQN0nurok/N6vIRcnw2Idca/EnhQJ+S6S8DOvTHItA6+kNKvqj6iEVuQXcJ8DMRkAMAKkFxOJyxkTgobl2yzzGYqPw0rGpb28cWfUGCaORLcOV9XOBQysbmVvsjGaH8lzE57H2jkbMix+Cl9ePZQ1bG/35PVl3ZR3GiCCMgiuBFaOhFrK4eSLbqsRVhE6Wv8AIXbiP7KtE+VldUzbdbGMYq1RrqFNVJjnWUbfjVokk1ucwuc5Q5zsq0T5YPTDIbYMVo+ILef+4G3f+2tFwRyoco4zkVb2sFpOwMqO2EY95pLO4htDmJUfIi/xNWkU0YOQHGasIYS3FlG0955DgAZJNDNlYHXi+yPdiFNiR08FF68mzkXgggj795qx42I6p6HG1TSlXVirA8xGwimxHd7YuyVfiKTN3bEzW3aR5SfeFSfxdgoXB4vFwVuVgC7aqjpboFSCNlcllj3gw5gSaknIZ9b+YQR2DGMCkPjI9Rt5topMGJSqbTsBqPCrJrgazeV08a1x4XGsQ7Dh0bdndUQdHuZoYGlQyQWsMHE6vAyMTREF9YhGlaMaiTpnDBkFDAliVx9jDPK/8bfjVIXikPAn71Ji7uD4a57GPBPuimzHabZO2VvgKFLiTVMk3rvtPImILwkt0CUcacq6MGVhxBG0GiBMu5OnVcfoaGrE82biMcEduOfqSU26dkkZ8qOQcVbk1A6kFS4yKJQxuFJcao28ME8fnaPmvdFXMxmCw7ZYJG4jFaHvbXRnhoxdzSqFkZdbyUWpA0BQKnSurs1SOYjkbhsiiHlSvzKKGtGJs2yHg7r+yOiDO4KW6dLn9BTFndizMeJJ2k0mba0xI/QW8xeXz1yj9Rx5LUhSWJyrrQLwvuTxdZPiK8HcWlzEQQdqsrbCDWvNomZwro3/AByftapcjhJGfLjbquORAyniCMimdHdNQlWPcQDsqfXUIQ+su8x6cjFW+SXw/gmyFHW3sUW1kfVIKldvfyxrJHIpV0YZBBq7VtFSoT4Njl9bm7xU2OaKIeXK3QooNBoqFsIg4Y/px/uatS3tLaIAADCqo4KBQKQpuwRdRPiajLySOFRRxJNYMnlzP1pD8yPN5Cu8o4yoP1FCtaSykbMkfOp66V4K6tbiMggjWVgeYg1LKYhkvbjedV6MeelatjdcDrbIXPYTwoggjII4H5iLJJtkjQnBZkGRq0oDaoLDjg8hAAGSScAVq397wBXbCh/dU0oQ4KWx3XcdH1EoxW1pboAABqqgHAACsx2UZ8VF1j135I8XEi+IjPGND5x7T86IeF2tPAvn/XTt5H14WOZIG8hvgal1JguXgfY6/GojbXZ4XEOwn1xwark39kPRp4xcdsTbRWhZ4JBscwn80krSyRHqzo0dabsWEiBGU3QAx9hIrTGjUCLqr49CQK0usx6IEaStCzTynYrTfoiVdfIbI+ifxY7olqE3F2P9TNgsPUHBal15yNy3Q5dvgKfViU+KgXyE+J5ItzyoIG5+h3+g1IrviycEl+DVC8UqHDIwwRTsjqcqynBB7CKhF1F/UG7KP0NX8ayH0Uvi399WFvcLj0kat7DWjngP9mZlFXmkU++hq90i/wB6MfktaOec/wB6ZmFWFvbrj0UYWr+NpB6KLxj+6oRaxn0h3pT+gp2d2OWZjkk9pNRNJI5wqKMkmlWScYKQcUj7W6T9FACQNyQbJE+w0DeW/HcGJFHalAgjiDxHJpK4jA4KHJX2HIp7eb14hn3Vo2zPe4rRtoO9zUlvD6kQz760lcSA8VLkL7BgcqfJLY+fKN4j6qVDmQjfnfbI30tlGzkbJV3JAfWFaS+yOcfuWtHGZetCwerK4jx142Xls55PUjZvyFaNeNetKRGK0io6Y4Bn/wDTVZL4Qelk35PafoP/xAAjEQACAgIBBQADAQAAAAAAAAACAwEEAAUREBITFCEWIzEg/9oACAECAQEIAOhEIDJFa3qgmRQex2VguB9HZt+z6OzX9gNhsa5cFV3yz4F4GBjBB1s2VVlSxlm3a2DoAa2mQkYZbWzge2t23J/vbcj+MZyPbZs6ZDhllSvata90jNW0q0qGLwiEBIit2XbC1AhWrKoKgRXX5nvdMxEcymx5CmJ6O8QPgVWaytgqRKrYdr7UwQGLAEx3tqQUCB01YUoO0yuuZ5cZGARElCHWyNa36u3PiEZeAh3Ma0VjBZKbZlDsMiIpONzWFqAtr0NruA65bEysbExg1jHr1h54jmaWrK7EPdRpKpIhS8u6eu5xWIdUipYBZgCfDxL+yLNeQBYz7NYqBlW2C4ml+zZrmR+3DwzXLwBsb+nEREfkFPPyCnn5BTy5saNlRrldh8pmIUo4OWMn5cDNh+vYPmKX69mqJH5cPp79XwQ7Dv1g55i9W8kLxVpDSGA96r4IdhXqwt8c5P24GbCfJsH8bECr7FhQbBn1rI5GobCoDPTZ2lGFQObcvxFOwk0lEao4CFYdF8w1MYtgxFmyVECsbBXO+qyaweOmsi1B1WV2THKT/wAFCFofLQKCAZiwyZmEhubIqSFRehqzAnYIwEwICtV3a+1EjWsqvqghXY4nsd1mImJiQkExKa1myrXqmZrIfftTytYLAQDLVVVpUrZYq2te6CituUNGF21r5Hurd1yM7rs4xfA91mzuUKGV1EVrV98zlSoqqqFh1MAYMidrQgXJVzobCuXMRsNgv5M7HYM+YFHYWS5yroRiYKwta1hAB0//xAAxEQABAwEGAwUJAQEAAAAAAAABAAIRAxIhMUFRcQQQIjJSYoGREyBCYZKxwdHhoXL/2gAIAQIBCT8A5OAAxJTLZ7xuCe/Zgj7KnVP/AEf2qVQbH9Ko/Z4n7plg94XhOBBwI9wwB6k6BAwT00wngnu5Lhobr2Qn0xsJT6Z3ELhpbqOoJ4B7syECIPUwo7jMHkYAEkoGJim1C3Wf6n+I2n/4NuTYm9nzHN1iqQCBk5CxWZ6g/pA3GHt1CMtcJBRvfe7YIXkGzsu27/BoiBfCbLaYtVP0qfWb2HIHQrpIdZc04h2ikyYaBiSU2iLN1kgna9Ms1qYlze81DAAO2R7PU3Zd8MHlcuyMdm8rqRBFNuZ8S1JJOJJ15SHkAHTdSaZn2T9NWo2gIcY6ToJmVMm2DOkLsnDZyyfYd53LOqT+V8NMBMqGiL32GyT8lw/EAAXCwqPEfQqPEfQqPEfQqPEQb2mxeDkVSJcSAZ6fNEF5ECMGjQL4qZHoVlUn8rKrH4WdMHlU6C6yDBxRdc8suaT1DJOIcSBe0i8iQE6SWlwuyBhVOgusgwcU+8GCYMA6E8vhpk+pWdSPwu+HjzvXZOOzuVRsAAgZW8z6Jzb+KFXymU4Ee1DrBJiAI9QnUzZY5rscHOtXKszAEN8evoqjPY1Kls3G0JMkDl2ctmrOpbd5XoXsudsVkDZ2Xbbh8xr7od7e8zBkHvA/lEGQLwu27H5BZgF2wQx6WoSCIIRNxljkbFZnqP4hZfrkfdFoyTjLWyjbrP8AU/xEmTL3aBCGtEAchscwUSL+l4wKYB4okLiZbp2gmU3bEhMpt3JK4mG6dkJgJ70XIkyep5wCG5zJ9xoc04gp9nwuwVN48TL/ALKvUG/9Vd/ld9lTqHxPu+6fPhamhrRkOf8A/8QAJBEAAgIBAwQDAQEAAAAAAAAAAgMBBAUABhEQEhQhExUxIyD/2gAIAQMBAQgA6GYAMkdzcqFzI1mZbLWi7R+uzDvc/XZhXuAyuWqlwVPcyTmBsrYDAgw627aaiSa23eu5R8LGpt+sgIbeU3ge2p25Cf3tyA/jW8j227e36zwltGrdu4uxITSuouJhqtGYgBGV62/K3RFdSonFpEQVV5KGPmYiJmUWvlORno/4V2RFNuojKIISpWrGLuzBLYDVgwNy3ZWgKw7fqAisy82qop5ew2AuIk7lpXzLrlYvVTVJAF1EoF0ueCggtEq4bgZLDIilkbgqA+uu8rbN2SWyqWWYVrLMEWqGPEqDMxETM2L8MaWpmZmZnVN8KZzNJ8SYrMid83dpnd5NSZUoZi3ULGMKplUxOP8A65hMyPvIMnWSOwUfErxLWvEta8S1rxLWoTZ4jlbrBqAtJScMlzi9ZAJ1lI+LKWZjH/yzCYkfWQZHT7Kl4w2NMyVRfPMZKnLYVpN2s4hEPsqXjRY0WSpg6VToveQCNZSflylmIyqyq5ZpQ1oz4lsZ/NRgnQmF6+vb2GOjxjJvTY1Wx9quxBjGFOAhOmY2yUORGltGIt2yxqyt5RPO5qcmldkdv2wfXZRbVaUTKGf4Maya9mXLKCACi00pmEL3BbBFddFW2aciDLRMWDAIDu1bGLuxIVLaMokSFdqRKFv6zETExK5WgZr07ltGLSRFUrWMpdnlSgSsFhq7TTcRKm2qV3F2IKKm4K7whV5SuR7qndkI/e7IF+NVwPdbt7groCVUa1S7k7EzqjRRSRC19WLW0JBl3bKymSqsxmVqFzEZTKq9TOVyjfULxuUtlzNPbIDMFaUpaQgF9P/EADMRAQABAwAGCAYCAgMAAAAAAAECAAMREiExQVGRBBAiMkJScXITIGGBsdEjwRRikqLw/9oACAEDAQk/AOqRGJtVwFQ+I+Z1Rq5P22zH4qzefc/urN49r+qu3PbcM/mreg+eOuNSJRdiOT5JYDmvAqLhexajVwXyDiNdECHFNCNXLUfQWrlqXqJXRBhxDTjUwfIuYtCA9u1LY06t5vHg9TiMRV4BQpnRtQqPxOkT5r+qdOfDwx9K1BUWOTMM+KPXP4d+QJHwyzx5VHQ6RDmP6oTDo3IcSnMZAjTrua5e0o1okPaV35/9Y8KkAuKliKmm/wBVJJ25Gh/7hUsDqTg1mTJCMTbJdxRYjIMkEZbNna+mahoX7RmUNpKH0d5RrAJ/UadcO1D0dtectx+2qu4AvthTgKgSiGI52HF64ktSA1EZRz8Jd2dpRormJntHFxjFY0nTHHlxn84ruuce2dbrmhL76q33mX914bQc2rc0e8g8qsz5NWJ8mrE/+LVmfJqzcE3kWrC3IuEeyetSG4mANkTgV4rScmt13S/ut15j/VeK0PJ6rv8AGy0Rw7aZ6rjDVCT2jdqKnIksTXGQZkZBanllFkanZF0Wrv8AGy0Rw7auOSRFcOiLuXZ1eG0vNrfd0eWqvOXI/fXXcQH2z6rsMERDXj4mTLyKnHX00vfbOcVMYt6M9BXCEccypWnRhOEsrslPS1V0i33SRDPjzrlyq7b+Bdu6clHTMuUOrug49sK33dOX210a4dmftadYLD6xa78Nj5o8fljP/J7TnRckjZIeG/NSJCDk2Nd+e18seNOtBn9Ao73Zh6b2jMZCJ9GlAdK1PiVLQ6RDmP6o0J8fDL0fkMlDJ0l25jDNS0+kXOa/qlWTpXJ8CjEYgB1Grc7x4lKYexcjsatg+cMjXS8w4ZJxqFqXopVu1H1VrpeIcM6Eati+dMBSyV7dyWwo90t8n5IEou0auaD5JayrNw/2hr/FdJunu1/muk3X26vxVm658U9X5q5pf6R2c6gRibA6/wD/2Q==';
function logoAt(cx,cy,rad,al){
 x.save();x.globalAlpha=al==null?1:al;
 x.fillStyle='rgba(0,0,0,.28)';x.beginPath();x.arc(cx+1.5,cy+2.5,rad,0,6.3);x.fill();
 x.beginPath();x.arc(cx,cy,rad,0,6.3);x.clip();
 if(LOGOOK)x.drawImage(LOGO,cx-rad,cy-rad,rad*2,rad*2);else{x.fillStyle='#ffffff';x.fillRect(cx-rad,cy-rad,rad*2,rad*2)}
 x.restore()}
var LOGOBW=null;
function logoBW(cx,cy,rad,al){
 if(!LOGOOK){return}
 if(!LOGOBW){
  var c=document.createElement('canvas');c.width=c.height=96;var q=c.getContext('2d');q.drawImage(LOGO,0,0,96,96);
  try{var im=q.getImageData(0,0,96,96),d=im.data;for(var i=0;i<d.length;i+=4){var l=.3*d[i]+.59*d[i+1]+.11*d[i+2],v=Math.max(0,Math.min(255,(l-135)*3.2+128));d[i]=d[i+1]=d[i+2]=v}q.putImageData(im,0,0)}catch(e){}
  LOGOBW=c}
 x.save();x.globalAlpha=al==null?1:al;x.beginPath();x.arc(cx,cy,rad,0,6.3);x.clip();
 x.globalCompositeOperation='multiply';x.drawImage(LOGOBW,cx-rad,cy-rad,rad*2,rad*2);x.restore()}
function textSchatten(t,tx,ty,col){x.fillStyle='rgba(0,0,0,.55)';x.fillText(t,tx+1,ty+1);x.fillStyle=col;x.fillText(t,tx,ty)}
function wasserzeichen(){
 if(g.mode==='title')return;
 logoAt(21,H-28,11,.85);
 x.font='bold 10px system-ui,sans-serif';x.textAlign='left';textSchatten('mitrilmo',37,H-24,'rgba(255,255,255,.88)')}
var PP=function(s){return new Path2D(s)};
var FTAIL=PP('M30,165 C110,120 250,110 400,205 C470,255 520,320 575,355 C540,400 520,470 485,525 C400,550 250,560 170,430 C150,395 125,300 30,165 Z');
var FTAILSHADE=PP('M160,390 C220,470 350,450 450,405 C500,382 540,355 580,350 L580,600 L100,600 Z');
var FTAILWHITE=PP('M-10,100 L305,100 L305,192 L352,262 L258,238 L282,312 L205,278 L208,368 L158,325 L158,520 L-10,520 Z');
var FBODY=PP('M575,352 C660,310 760,296 860,300 C950,304 1000,322 1050,310 C1075,302 1095,290 1110,282 C1160,330 1175,420 1125,500 C1090,560 1040,590 1010,602 C930,625 800,600 690,562 C620,548 540,545 485,522 C470,470 520,400 575,352 Z');
var FBACKLIGHT=PP('M575,352 C660,310 760,296 860,300 C950,304 1000,322 1050,310 L1050,345 C1000,352 880,348 780,356 C700,364 640,380 575,352 Z');
var FHAUNCH=PP('M575,352 C530,392 500,452 485,525 C520,470 560,425 610,392 Z');
var FBELLY=PP('M700,540 C780,520 860,520 915,533 L905,602 C830,585 750,572 690,556 Z');
var FNECK=PP('M1030,318 C1060,300 1090,290 1112,284 C1092,312 1062,332 1040,342 Z');
var FEAR1D=PP('M1050,300 C1040,190 1070,100 1105,40 C1150,80 1185,135 1208,190 L1190,300 Z');
var FEAR1O=PP('M1072,290 C1066,200 1088,120 1112,80 C1150,110 1178,150 1196,195 L1180,290 Z');
var FEAR1I=PP('M1102,98 C1145,125 1178,160 1192,192 L1108,238 Z');
var FEAR2D=PP('M1205,175 C1215,105 1240,65 1265,38 C1310,70 1338,130 1345,200 L1240,215 Z');
var FEAR2O=PP('M1228,185 C1236,135 1254,100 1274,78 C1306,110 1326,155 1332,200 L1250,208 Z');
var FHEAD=PP('M1040,320 C1070,260 1120,205 1210,185 C1290,175 1350,215 1385,285 C1420,325 1465,342 1500,352 L1490,380 C1400,360 1250,325 1120,340 C1090,345 1060,360 1035,372 Z');
var FFACELIGHT=PP('M1110,245 C1160,205 1250,185 1320,215 C1350,235 1370,260 1385,285 C1300,260 1190,250 1110,290 Z');
var FCREAM=PP('M1035,372 L1100,380 L1062,420 L1143,414 L1122,455 L1180,527 L1228,447 C1260,445 1300,445 1340,442 C1430,432 1470,400 1482,378 C1440,365 1400,350 1340,340 C1250,320 1120,330 1035,372 Z');
var FBIB=PP('M1062,430 L1142,425 L1182,527 C1150,560 1060,590 1000,604 L955,585 C1000,540 1040,480 1062,430 Z');
function F(c){x.fillStyle=c}
function K(c,w){x.strokeStyle=c;x.lineWidth=w;x.lineCap='round';x.lineJoin='round'}
function ell(cx,cy,rx,ry,r){x.beginPath();x.ellipse(cx,cy,rx,ry,r||0,0,6.3);x.fill()}
function cap(ax,ay,bx,by,ra,rb){var dx=bx-ax,dy=by-ay,L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L;
 x.beginPath();x.moveTo(ax+nx*ra,ay+ny*ra);x.lineTo(bx+nx*rb,by+ny*rb);x.lineTo(bx-nx*rb,by-ny*rb);x.lineTo(ax-nx*ra,ay-ny*ra);x.closePath();x.fill();
 x.beginPath();x.arc(ax,ay,ra,0,6.3);x.fill();x.beginPath();x.arc(bx,by,rb,0,6.3);x.fill()}
function lerp(a,b,t){return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]}
function ik(h,fp,L1,L2,sg){var dx=fp[0]-h[0],dy=fp[1]-h[1],d=Math.min(Math.hypot(dx,dy),L1+L2-.05),a=Math.atan2(dy,dx),c=(L1*L1+d*d-L2*L2)/(2*L1*d),A=Math.acos(Math.max(-1,Math.min(1,c))),g=a+sg*A;return[h[0]+Math.cos(g)*L1,h[1]+Math.sin(g)*L1]}
function fl(k,ph,fn){var sh=Math.sin(ph+k)*120,lf=Math.max(0,Math.cos(ph+k))*60;x.save();x.translate(sh,-lf);fn();x.restore()}
function foxLeg(hx,hy,kx,ky,ax,ay,pdx,pdy,prx,pry,k,ph,cu,r1,r2,r3){
 var sh=Math.sin(ph+k)*90,lf=Math.max(0,Math.cos(ph+k))*60,L1=Math.hypot(kx-hx,ky-hy),L2=Math.hypot(ax-kx,ay-ky),
  tx=ax+sh,ty=ay-lf,dx=tx-hx,dy=ty-hy,d=Math.hypot(dx,dy),mx=L1+L2-.5;
 if(d>mx){tx=hx+dx*mx/d;ty=hy+dy*mx/d}
 var sg=((ax-hx)*(ky-hy)-(ay-hy)*(kx-hx))>=0?1:-1,kn=ik([hx,hy],[tx,ty],L1,L2,sg);
 F(cu);cap(hx,hy,kn[0],kn[1],r1,r2);F('#2f180c');cap(kn[0],kn[1],tx,ty,r3,r3);ell(tx+pdx,ty+pdy,prx,pry)}
function foxVec(ts,ph){ph=ph||0;
 var tw=Math.sin(ts/380)*.035,hb=Math.sin(ts/300)*3;
 x.save();x.translate(570,420);x.rotate(tw);x.translate(-570,-420);
 F('#f07a14');x.fill(FTAIL);
 x.save();x.clip(FTAIL);F('#d65a05');x.fill(FTAILSHADE);F('#fdf3e2');x.fill(FTAILWHITE);x.restore();
 x.restore();
 foxLeg(680,590,650,690,690,770,32,6,64,27,0,ph,'#c24f04',42,26,28);
 foxLeg(1040,560,1105,690,1160,766,44,6,62,26,3.14,ph,'#c24f04',52,26,28);
 F('#f07a14');x.fill(FBODY);
 x.save();x.clip(FBODY);F('#f78b20');x.fill(FBACKLIGHT);F('rgba(200,80,0,.55)');x.fill(FHAUNCH);F('#fdf0dc');x.fill(FBELLY);x.restore();
 foxLeg(535,548,440,690,432,770,26,6,66,27,3.14,ph,'#f07a14',78,30,31);
 K('rgba(170,60,0,.4)',7);x.beginPath();x.arc(535,548,70,2.35,3.55);x.stroke();
 foxLeg(985,568,935,690,938,770,30,8,64,27,0,ph,'#f07a14',60,31,29);
 F('rgba(190,70,0,.3)');x.beginPath();x.moveTo(930,610);x.quadraticCurveTo(905,660,905,690);x.lineTo(925,692);x.quadraticCurveTo(930,650,950,610);x.closePath();x.fill();
 F('#d65a05');x.fill(FNECK);
 x.save();x.translate(0,hb);
 F('#3b1f10');x.fill(FEAR1D);F('#e0700f');x.fill(FEAR1O);F('#fdf3e2');x.fill(FEAR1I);F('rgba(245,200,160,.7)');x.beginPath();x.moveTo(1130,150);x.lineTo(1160,175);x.lineTo(1128,205);x.closePath();x.fill();
 x.save();x.translate(1248,215);x.rotate(.2);x.translate(-1248,-215);x.translate(-18,26);
 F('#3b1f10');x.fill(FEAR2D);F('#dd650a');x.fill(FEAR2O);x.restore();
 F('#f07a14');x.fill(FHEAD);F('#f78b20');x.fill(FFACELIGHT);
 F('#fdf3e2');x.fill(FCREAM);x.fill(FBIB);
 K('#3b1f10',4);x.beginPath();x.moveTo(1445,410);x.lineTo(1550,406);x.moveTo(1432,422);x.lineTo(1540,446);x.moveTo(1422,426);x.lineTo(1498,470);x.stroke();
 F('#2a1a18');ell(1498,350,34,30);F('#6b5656');ell(1489,336,10,6);
 K('#3b1f10',9);x.beginPath();x.moveTo(1312,372);x.quadraticCurveTo(1365,408,1440,398);x.stroke();
 K('#3b1f10',12);x.beginPath();x.moveTo(1232,298);x.quadraticCurveTo(1285,312,1335,298);x.stroke();
 K('#b5500c',10);x.beginPath();x.moveTo(1192,242);x.quadraticCurveTo(1245,222,1310,250);x.stroke();
 x.restore();
}

/* ---------- Wolf (Vektor, aus dem Fuchs abgeleitet) ---------- */
function wolfVec(ts,ph){ph=ph||0;
 var tw=Math.sin(ts/380)*.035,hb=Math.sin(ts/300)*3;
 x.save();x.translate(560,360);x.rotate(tw+.22);x.scale(1.1,.7);x.translate(-560,-360);
 F('#8c8579');x.fill(FTAIL);
 x.save();x.clip(FTAIL);F('#6f695f');x.fill(FTAILSHADE);F('#fdf3e2');x.fill(FTAILWHITE);x.restore();
 x.restore();
 F('#6a645a');cap(680,590,650,690,42,26);fl(0,ph,function(){F('#efe3cc');cap(650,695,690,770,28,28);ell(722,776,64,27)});
 F('#6a645a');cap(1040,560,1105,690,52,26);fl(3.14,ph,function(){F('#efe3cc');cap(1110,695,1160,766,29,28);ell(1204,772,62,26)});
 F('#8c8579');x.fill(FBODY);
 x.save();x.clip(FBODY);F('rgba(70,62,54,.55)');x.beginPath();x.moveTo(560,330);x.bezierCurveTo(700,285,900,285,1060,300);x.lineTo(1060,360);x.bezierCurveTo(1000,380,960,430,900,395);x.lineTo(840,445);x.lineTo(790,385);x.lineTo(720,430);x.lineTo(680,380);x.lineTo(610,420);x.closePath();x.fill();F('#a39c90');x.fill(FBACKLIGHT);F('rgba(55,47,40,.45)');x.fill(FHAUNCH);F('#fdf0dc');x.fill(FBELLY);x.restore();
 F('#8c8579');cap(535,548,440,690,78,30);
 K('rgba(45,38,30,.35)',7);x.beginPath();x.arc(535,548,70,2.35,3.55);x.stroke();
 fl(3.14,ph,function(){F('#efe3cc');cap(432,695,432,770,31,31);ell(458,776,66,27)});
 F('#8c8579');cap(985,568,935,690,60,31);
 F('rgba(45,38,30,.3)');x.beginPath();x.moveTo(930,610);x.quadraticCurveTo(905,660,905,690);x.lineTo(925,692);x.quadraticCurveTo(930,650,950,610);x.closePath();x.fill();
 fl(0,ph,function(){F('#efe3cc');cap(933,695,938,770,29,29);ell(968,778,64,27)});
 F('#6f695f');x.fill(FNECK);
 x.save();x.translate(0,hb);
 F('#463f38');x.fill(FEAR1D);F('#7d776c');x.fill(FEAR1O);F('#fdf3e2');x.fill(FEAR1I);F('rgba(245,200,160,.7)');x.beginPath();x.moveTo(1130,150);x.lineTo(1160,175);x.lineTo(1128,205);x.closePath();x.fill();
 x.save();x.translate(1248,215);x.rotate(.2);x.translate(-1248,-215);x.translate(-18,26);
 F('#463f38');x.fill(FEAR2D);F('#797367');x.fill(FEAR2O);x.restore();
 F('#8c8579');x.fill(FHEAD);F('#a39c90');x.fill(FFACELIGHT);
 F('#fdf3e2');x.fill(FCREAM);x.fill(FBIB);
 F('#fdf3e2');x.beginPath();x.moveTo(1030,380);x.lineTo(1000,430);x.lineTo(1070,425);x.lineTo(1040,490);x.lineTo(1110,470);x.lineTo(1100,540);x.lineTo(1170,500);x.lineTo(1190,415);x.closePath();x.fill();x.beginPath();x.moveTo(1110,300);x.lineTo(1050,320);x.lineTo(1095,335);x.lineTo(1040,360);x.lineTo(1115,360);x.closePath();x.fill();
 K('#463f38',4);x.beginPath();x.moveTo(1445,410);x.lineTo(1550,406);x.moveTo(1432,422);x.lineTo(1540,446);x.moveTo(1422,426);x.lineTo(1498,470);x.stroke();
 F('#2a1a18');ell(1498,350,34,30);F('#6b5656');ell(1489,336,10,6);
 K('#463f38',9);x.beginPath();x.moveTo(1312,372);x.quadraticCurveTo(1365,408,1440,398);x.stroke();
 K('#463f38',12);x.beginPath();x.moveTo(1232,298);x.quadraticCurveTo(1285,312,1335,298);x.stroke();
 K('#5a544a',10);x.beginPath();x.moveTo(1192,242);x.quadraticCurveTo(1245,222,1310,250);x.stroke();
 x.restore();
}

/* ---------- Bär, schlafend (Vektor, Koordinaten der Vorlage 672 x 371, Boden bei y=346) ---------- */
var B_TAIL=PP('M34,262 C6,252 -2,220 14,208 C32,200 46,222 56,244 Z');
var B_BODY=PP('M54,332 C28,272 38,176 118,114 C198,52 330,40 402,92 C438,118 444,160 432,200 L424,282 C414,322 384,340 344,346 L112,348 C82,346 64,342 54,332 Z');
var B_BACK=PP('M72,176 C100,104 200,62 300,60 C362,60 404,80 424,116 C362,94 300,96 232,114 C152,136 102,176 82,236 Z');
var B_HAUNCH=PP('M92,232 C96,172 146,142 200,150 C252,158 266,214 254,262 C242,304 200,314 168,304 C128,296 88,274 92,232 Z');
var B_HAUNCHSH=PP('M200,150 C252,158 266,214 254,262 C262,214 250,176 214,160 Z');
var B_RPAW=PP('M148,334 C148,304 190,288 242,290 C282,292 304,312 300,336 L296,348 L154,348 Z');
var B_ARM=PP('M296,236 C338,200 404,214 444,252 C474,274 504,288 510,314 L504,348 L368,348 C326,322 292,282 296,236 Z');
var B_ARMHI=PP('M284,206 C322,172 374,184 408,218 C356,206 322,216 296,256 Z');
var B_NPAW=PP('M398,334 C398,304 440,288 490,290 C508,292 514,312 510,336 L504,348 L404,348 Z');
var B_FPAW=PP('M540,336 C542,302 596,288 640,296 C660,308 662,332 650,346 L556,348 Z');
var B_HEAD=PP('M402,204 C406,152 452,112 512,110 C572,110 614,142 620,192 C624,238 602,280 562,302 C522,320 472,314 442,292 C414,270 398,240 402,204 Z');
var B_HSHADE=PP('M408,178 L372,190 L398,204 L366,224 L404,224 L394,250 L436,234 Z');
var B_HFUR=PP('M414,168 L376,180 L400,196 L370,214 L408,216 L398,240 L438,226 L450,180 Z');
var B_HTUFT=PP('M404,176 L386,196 L410,190 Z M406,208 L390,230 L416,222 Z');
var B_MUZZLE=PP('M500,228 C520,212 562,216 584,230 C604,244 600,272 576,292 C552,310 510,304 494,282 C482,262 484,240 500,228 Z');
var B_NOSE=PP('M558,240 C570,232 592,238 596,254 C598,268 580,276 568,268 C556,260 550,248 558,240 Z');
var B_EAR1=PP('M424,108 C416,82 438,62 464,66 C488,72 494,102 478,120 C460,128 436,124 424,108 Z');
var B_EAR1I=PP('M436,104 C434,88 448,78 460,82 C472,88 474,102 464,110 C452,114 440,112 436,104 Z');
var B_EAR2=PP('M562,128 C556,102 584,84 608,92 C626,100 624,130 608,146 C590,152 566,146 562,128 Z');
var B_EAR2I=PP('M576,124 C574,110 590,102 602,108 C612,114 610,128 600,134 C590,138 580,134 576,124 Z');
function bearVec(ts,lift){lift=lift||0;
 var br=Math.sin(ts/650)*.012;
 x.save();
 x.save();x.translate(0,346);x.scale(1,1+br);x.translate(0,-346);
 F('#6a3418');x.fill(B_TAIL);
 F('#9a5328');x.fill(B_BODY);
 x.save();x.clip(B_BODY);F('#b0652f');x.fill(B_BACK);x.restore();
 F('#a85a2b');x.fill(B_HAUNCH);F('rgba(70,30,10,.3)');x.fill(B_HAUNCHSH);
 F('#4a2410');x.fill(B_RPAW);K('#2a1409',3);x.beginPath();x.moveTo(236,306);x.lineTo(240,334);x.moveTo(258,308);x.lineTo(264,336);x.moveTo(278,314);x.lineTo(284,338);x.stroke();
 x.restore();
 F('#4a2410');x.fill(B_FPAW);K('#2a1409',3);x.beginPath();x.moveTo(600,306);x.lineTo(604,332);x.moveTo(620,310);x.lineTo(626,334);x.stroke();
 F('#a85a2b');x.fill(B_ARM);F('#bd6f36');x.fill(B_ARMHI);
 F('#4a2410');x.fill(B_NPAW);K('#2a1409',3);x.beginPath();x.moveTo(446,308);x.lineTo(450,336);x.moveTo(468,310);x.lineTo(474,338);x.moveTo(488,316);x.lineTo(494,338);x.stroke();
 x.save();x.translate(0,-12*lift);x.translate(470,300);x.rotate(-.2*lift);x.translate(-470,-300);
 F('#6a3418');x.fill(B_EAR2);F('#c99066');x.fill(B_EAR2I);
 F('#7a3d1c');x.fill(B_HSHADE);
 F('#a85a2b');x.fill(B_HEAD);x.fill(B_HFUR);
 F('#bd6f36');x.fill(B_HTUFT);
 F('#8e4a22');x.fill(B_EAR1);F('#e9b98a');x.fill(B_EAR1I);
 F('#e9b98a');x.fill(B_MUZZLE);
 F('#3a1d0e');x.fill(B_NOSE);F('rgba(255,255,255,.4)');x.beginPath();x.ellipse(576,246,7,3.4,-.3,0,6.3);x.fill();
 K('#3a1d0e',4);x.beginPath();x.moveTo(500,262);x.quadraticCurveTo(522,288,562,282);x.stroke();
 K('#7a3d1c',5);x.beginPath();x.moveTo(486,192);x.quadraticCurveTo(508,176,534,190);x.stroke();
 K('#7a3d1c',5);x.beginPath();x.moveTo(574,196);x.quadraticCurveTo(590,186,606,198);x.stroke();
 if(lift>.5){F('#fff');x.beginPath();x.ellipse(508,214,13,11,0,0,6.3);x.fill();F('#1a0e08');x.beginPath();x.ellipse(512,215,6,8,0,0,6.3);x.fill();
  K('#3a1d0e',4);x.beginPath();x.moveTo(580,222);x.quadraticCurveTo(592,230,604,220);x.stroke()}
 else{K('#3a1d0e',4.4);x.beginPath();x.moveTo(490,212);x.quadraticCurveTo(508,230,528,212);x.stroke();x.beginPath();x.moveTo(580,222);x.quadraticCurveTo(592,232,604,220);x.stroke()}
 x.restore();
 var za=1-lift;
 if(za>.05){K('#8e4a22',9);x.lineJoin='round';
  [[0,0,34],[1,-34,48],[2,-66,64]].forEach(function(z){var ph=(ts/1400+z[0]*.33)%1,fy=-ph*26,al=Math.sin(ph*3.14)*za;x.globalAlpha=Math.max(0,al);
   var zx=540+z[0]*38,zy=96+z[1]*.9+fy,s=z[2]*.5;x.beginPath();x.moveTo(zx,zy);x.lineTo(zx+s,zy);x.lineTo(zx,zy+s*.9);x.lineTo(zx+s,zy+s*.9);x.stroke()});x.globalAlpha=1}
 x.restore();
}

/* ---------- Adler (Vektor, nach der Vorlagenzeichnung; Koordinaten 707 x 344, blickt nach rechts, Fänge bei y=322) ---------- */
var E_BODY=PP('M338,170 C392,156 452,172 480,214 C452,246 398,276 332,294 C290,302 254,298 238,284 C260,246 298,198 338,170 Z');
var E_BODYSH=PP('M240,284 C262,300 300,304 340,296 C398,282 450,250 478,216 C440,258 388,282 322,290 C286,292 254,290 240,284 Z');
var E_SHOULDER=PP('M340,186 C322,146 276,104 214,86 C178,112 186,156 206,188 C250,204 306,202 340,196 Z');
var E_FOOT=PP('M232,298 C236,284 264,280 274,292 C282,302 278,316 264,322 L240,324 C230,320 228,306 232,298 Z');
var E_HEAD=PP('M358,192 C366,160 400,142 442,142 C472,142 494,156 496,180 C496,196 488,206 476,212 C468,224 462,236 450,248 L442,228 L428,246 L420,224 L406,242 L400,216 L378,230 L386,208 Z');
var E_BEAK=PP('M478,168 C500,162 522,170 524,188 C525,200 520,208 514,208 C508,194 494,196 480,198 Z');
function feathers(rx,ry,degs,lens,wid,col,bd){bd=bd||0;F(col);degs.forEach(function(d,i){var a=d*Math.PI/180,L=lens[i],dx=Math.cos(a),dy=Math.sin(a),nx=-dy,ny=dx,w=wid,bq=Array.isArray(bd)?bd[i]:bd;
  var b1=-bq*L*.12,b2=-bq*L*.6,b3=-bq*L,tx=rx+dx*L+nx*b3,ty=ry+dy*L+ny*b3;x.beginPath();x.moveTo(rx+nx*w*.3,ry+ny*w*.3);
  x.bezierCurveTo(rx+dx*L*.45+nx*(w+b1),ry+dy*L*.45+ny*(w+b1),rx+dx*L*.86+nx*(w*.8+b2),ry+dy*L*.86+ny*(w*.8+b2),tx,ty);
  x.bezierCurveTo(rx+dx*L*.86+nx*(-w*.8+b2),ry+dy*L*.86+ny*(-w*.8+b2),rx+dx*L*.45+nx*(-w+b1),ry+dy*L*.45+ny*(-w+b1),rx-nx*w*.3,ry-ny*w*.3);x.closePath();x.fill()})}
function eagleVec(ts){
 var a=Math.sin(ts/190)*.2,bob=Math.sin(ts/190+1)*3;
 function wing(px,py,ang,fn){x.save();x.translate(px,py);x.rotate(ang);x.translate(-px,-py);fn();x.restore()}
 x.save();x.translate(0,bob);
 wing(448,190,-a*.9,function(){
  feathers(448,190,[-47,-36.5,-28.6,-20.2,-14.1,-10.4,-7.6,-3.7],[208,239,250,260,245,210,165,124],34,'#4e2512');
  feathers(448,190,[-40,-28,-18,-9,-3],[150,165,170,150,115],42,'#6a3a1e');
  feathers(448,190,[-34,-20,-8],[96,104,90],46,'#7a4426')});
 feathers(262,282,[-168,-178,172,160,146,130],[135,130,122,128,142,130],30,'#fdf3e2');
 K('#e7dcc4',3);[[-168,135],[172,122],[146,142]].forEach(function(p){var an=p[0]*Math.PI/180;x.beginPath();x.moveTo(262+Math.cos(an)*30,282+Math.sin(an)*30);x.lineTo(262+Math.cos(an)*p[1]*.8,282+Math.sin(an)*p[1]*.8);x.stroke()});
 F('#f2b52a');x.fill(E_FOOT);x.save();x.translate(34,-4);x.fill(E_FOOT);x.restore();
 K('#c98a14',3);x.beginPath();x.moveTo(250,302);x.lineTo(252,320);x.moveTo(264,300);x.lineTo(266,318);x.moveTo(284,298);x.lineTo(286,316);x.moveTo(298,296);x.lineTo(300,314);x.stroke();
 F('#6a3a1e');x.fill(E_BODY);F('rgba(40,18,8,.4)');x.fill(E_BODYSH);
 wing(338,176,a,function(){
  var A=[-138,-145,-152,-159,-166,-173,-180,-187,-194,-201,-208],L=[250,290,322,342,346,330,300,260,214,166,124],B=[-.2,-.2,-.18,-.15,-.1,-.04,.02,.07,.1,.12,.12];
  feathers(338,176,A,L,42,'#4e2512',B);
  feathers(338,176,A,L.map(function(v){return v*.58}),34,'#7a4426',B.map(function(v){return v*.8}));
  feathers(338,176,A.slice(5),L.slice(5).map(function(v){return v*.36}),34,'#8e5a33',B.slice(5).map(function(v){return v*.6}));
  feathers(338,176,A.slice(0,6),L.slice(0,6).map(function(v){return v*.5}),34,'#5a2d14',B.slice(0,6).map(function(v){return v*.6}))});
 F('#fdf3e2');x.fill(E_HEAD);
 F('#f2b52a');x.fill(E_BEAK);K('#b87a10',3);x.beginPath();x.moveTo(514,204);x.quadraticCurveTo(498,194,480,198);x.stroke();
 K('#3a1d0e',4.4);x.beginPath();x.moveTo(430,168);x.quadraticCurveTo(445,182,462,168);x.stroke();
 x.restore();
}

/* ---------- Mo (Vektor) ---------- */
var JACKET=PP('M262,305 C238,345 226,420 232,500 C234,545 231,578 233,598 C290,606 380,606 433,600 C441,545 432,485 442,425 C446,385 440,345 446,320 C410,296 320,285 262,305 Z');
var HOOD=PP('M252,312 C262,290 300,280 340,290 C390,296 430,305 448,325 C440,350 420,362 400,352 C380,335 340,330 300,340 C280,345 262,340 252,312 Z');
var NECKIN=PP('M402,322 C420,312 440,318 446,328 C440,345 420,352 405,345 Z');
var JHI=PP('M268,322 C300,300 350,298 392,312 C340,310 300,325 268,350 Z');
var JSH=PP('M232,420 C236,480 236,560 236,596 L262,598 C258,520 262,450 270,400 Z');
var STRAP=PP('M330,330 C360,335 380,350 378,380 C372,430 340,480 320,510 L292,505 C312,470 335,420 340,380 C342,360 335,345 330,330 Z');
var BELT=PP('M236,528 L432,522 L434,562 L238,570 Z');
var BUCKLE=PP('M395,520 L432,518 L434,556 L396,558 Z');
var BUCKIN=PP('M404,530 L424,529 L425,546 L405,547 Z');
var CHEST=PP('M352,368 L428,372 L426,384 L352,382 Z');
var ZIP=PP('M410,385 L426,385 L428,445 L412,447 Z');
var BEDROLL=PP('M105,330 C100,290 130,272 170,270 L262,282 C275,300 272,340 262,372 L130,372 C110,365 106,350 105,330 Z');
var BAG=PP('M130,372 C100,400 92,470 98,520 C102,560 130,592 175,598 C205,602 240,598 250,590 L258,420 C250,390 250,380 262,372 Z');
var BAGD=PP('M98,520 C102,560 130,592 175,598 C205,602 240,598 250,590 L252,545 C200,570 130,570 98,520 Z');
var MESH=PP('M104,478 C100,520 108,560 130,566 L172,566 C182,540 182,500 176,478 Z');
var BOTTLE=PP('M120,430 C112,436 110,470 112,488 L172,488 C174,470 172,436 164,430 Z');
var HAIRB=PP('M268,205 C250,235 255,280 285,295 C310,290 330,270 332,240 Z');
var FACE=PP('M300,168 C290,215 300,260 340,282 C380,300 430,292 470,272 C490,262 500,240 492,215 C486,190 470,175 440,168 C400,160 330,160 300,168 Z');
var BEARD=PP('M385,238 C410,245 450,250 490,262 C492,275 480,290 455,305 C430,318 400,310 385,285 C375,265 378,250 385,238 Z');
var MOUSTACHE=PP('M420,248 C445,258 470,262 492,255 C488,270 470,276 450,274 C432,268 422,258 420,248 Z');
var SIDEBURN=PP('M338,200 C335,225 345,250 362,262 L378,250 C366,232 364,212 372,196 Z');
var HAIRF=PP('M288,192 C300,160 348,150 394,166 C396,184 376,196 356,206 C344,226 342,258 350,284 C320,292 290,284 272,258 C262,238 266,208 288,192 Z');
function boot(ax,ay,rot,far){
 x.save();x.translate(ax,ay);x.rotate(rot);x.scale(.8,.8);
 var L=far?'#5e3d21':'#6b4526',D=far?'#46290f':'#4f3019';
 F('#1f1712');x.beginPath();x.moveTo(-56,84);x.quadraticCurveTo(-62,112,-40,120);x.lineTo(128,120);x.quadraticCurveTo(166,116,164,86);x.closePath();x.fill();
 F('#3a2d24');for(var i=0;i<9;i++){x.fillRect(-40+i*20,110,11,10)}
 F('#cdbf9f');x.beginPath();x.moveTo(-54,80);x.lineTo(160,80);x.lineTo(163,88);x.lineTo(-56,90);x.closePath();x.fill();
 F(L);x.beginPath();x.moveTo(-44,-20);x.bezierCurveTo(-48,10,-52,45,-54,80);x.lineTo(160,80);x.bezierCurveTo(158,56,130,46,98,40);x.bezierCurveTo(70,32,56,10,46,-20);x.closePath();x.fill();
 F(D);x.beginPath();x.moveTo(104,45);x.bezierCurveTo(138,50,160,60,160,80);x.lineTo(98,80);x.closePath();x.fill();
 F(D);x.beginPath();x.moveTo(-44,-20);x.bezierCurveTo(-48,10,-52,45,-54,80);x.lineTo(-20,80);x.bezierCurveTo(-20,40,-18,10,-14,-20);x.closePath();x.fill();
 F('rgba(255,220,170,.18)');x.beginPath();x.moveTo(2,-14);x.lineTo(26,-14);x.bezierCurveTo(30,20,50,40,70,50);x.lineTo(40,52);x.bezierCurveTo(10,40,0,20,2,-14);x.closePath();x.fill();
 F('#3a2515');x.beginPath();x.ellipse(0,-20,46,10,0,0,6.3);x.fill();F('#241610');x.beginPath();x.ellipse(2,-20,36,6,0,0,6.3);x.fill();
 F('#8a5c33');x.beginPath();x.moveTo(20,-16);x.lineTo(46,-16);x.bezierCurveTo(52,10,70,28,92,38);x.lineTo(74,44);x.bezierCurveTo(46,34,28,16,20,-16);x.closePath();x.fill();
 K('#e8dcc0',8);x.beginPath();x.moveTo(26,-2);x.lineTo(50,6);x.moveTo(38,16);x.lineTo(64,24);x.moveTo(54,28);x.lineTo(80,36);x.stroke();
 x.restore();
}
function gripHand(cx,cy,rot,sc,thumb){
 x.save();x.translate(cx,cy);x.rotate(rot);
 F('#3a3b42');x.beginPath();x.roundRect(-16,-62,32,98,12);x.fill();F('rgba(255,255,255,.12)');x.fillRect(8,-50,4,80);F('#c8cdd0');x.fillRect(-16,30,32,5);
 F('#1c1c20');x.beginPath();x.roundRect(-21,-66,42,22,9);x.fill();
 x.scale(sc,sc);
 F('#2b2b30');x.beginPath();x.moveTo(-58,-8);x.bezierCurveTo(-46,-30,-12,-34,12,-24);x.lineTo(16,18);x.bezierCurveTo(-8,34,-48,28,-62,10);x.closePath();x.fill();
 F('rgba(255,255,255,.08)');x.beginPath();x.moveTo(-50,-8);x.bezierCurveTo(-38,-24,-14,-28,6,-22);x.lineTo(6,-16);x.bezierCurveTo(-14,-20,-36,-16,-48,-2);x.closePath();x.fill();
 for(var i=0;i<3;i++){F('#f0b48c');x.beginPath();x.roundRect(-22,-24+i*17,50,18,9);x.fill();F('rgba(160,90,60,.45)');x.fillRect(-20,-8+i*17,46,2)}
 if(thumb){F('#f0b48c');x.beginPath();x.ellipse(-4,-30,14,9,.25,0,6.3);x.fill();K('#c98a64',2);x.beginPath();x.moveTo(-14,-28);x.quadraticCurveTo(-4,-22,8,-30);x.stroke()}
 x.restore();
}
function hat(ts){
 x.save();x.translate(376,164);x.rotate(-.2);x.scale(.84,.84);
 F('#6f4a29');x.beginPath();x.ellipse(0,11,194,36,0,0,6.3);x.fill();
 F('#a8743f');x.beginPath();x.ellipse(0,0,194,35,0,0,6.3);x.fill();
 F('#b78248');x.beginPath();x.ellipse(14,-5,160,24,0,0,6.3);x.fill();
 F('rgba(255,230,180,.2)');x.beginPath();x.ellipse(110,-4,70,14,0,0,6.3);x.fill();
 F('#93642f');x.beginPath();x.moveTo(-118,-4);x.bezierCurveTo(-126,-40,-104,-80,-66,-98);x.bezierCurveTo(-34,-112,18,-116,62,-110);x.bezierCurveTo(104,-102,130,-72,136,-36);x.bezierCurveTo(140,-22,144,-12,146,-4);x.bezierCurveTo(70,20,-48,20,-118,-4);x.closePath();x.fill();
 F('#a97640');x.beginPath();x.moveTo(62,-110);x.bezierCurveTo(104,-102,130,-72,136,-36);x.bezierCurveTo(140,-22,144,-12,146,-4);x.lineTo(104,6);x.bezierCurveTo(112,-30,100,-84,62,-110);x.closePath();x.fill();
 K('rgba(70,40,18,.5)',6);x.beginPath();x.moveTo(-44,-96);x.bezierCurveTo(-14,-86,30,-88,70,-102);x.stroke();K('rgba(255,225,170,.28)',3);x.beginPath();x.moveTo(-42,-104);x.bezierCurveTo(-12,-94,30,-96,66,-110);x.stroke();
 F('#2a6634');x.beginPath();x.moveTo(-122,-30);x.bezierCurveTo(-50,-16,76,-16,146,-34);x.lineTo(148,6);x.bezierCurveTo(76,24,-52,24,-120,8);x.closePath();x.fill();
 F('rgba(255,255,255,.1)');x.beginPath();x.moveTo(-122,-30);x.bezierCurveTo(-50,-16,76,-16,146,-34);x.lineTo(146,-28);x.bezierCurveTo(76,-10,-50,-10,-122,-24);x.closePath();x.fill();
 F('rgba(0,0,0,.16)');x.beginPath();x.moveTo(-120,0);x.bezierCurveTo(-52,14,76,14,148,-4);x.lineTo(148,6);x.bezierCurveTo(76,24,-52,24,-120,8);x.closePath();x.fill();
 F('#f2c230');x.beginPath();x.roundRect(4,-40,54,44,5);x.fill();F('#2a6634');x.beginPath();x.roundRect(15,-29,32,22,3);x.fill();F('#d9a81f');x.fillRect(4,-40,54,7);F('#fbe38a');x.fillRect(6,-38,50,2);
 x.save();x.translate(-100,-34);x.rotate(Math.sin(ts/600)*.04);
 F('#f8f5ee');x.beginPath();x.moveTo(0,2);x.bezierCurveTo(-24,-28,-62,-66,-104,-96);x.bezierCurveTo(-56,-92,-14,-58,14,-6);x.closePath();x.fill();
 F('#dedad0');x.beginPath();x.moveTo(-40,-34);x.bezierCurveTo(-62,-52,-84,-76,-104,-96);x.bezierCurveTo(-76,-86,-56,-70,-34,-44);x.closePath();x.fill();
 K('#bdb8ac',3);x.beginPath();x.moveTo(2,0);x.lineTo(-100,-94);x.stroke();
 x.restore();
 lamp(ts);
 x.restore();
}
function lamp(ts){
 if(cur!=='Nacht'&&cur!=='Höhle')return;
 var fl=.92+.08*Math.sin(ts/230),ax=166,ay=-14,a0=.2,a1=.54,Lg=1150;
 x.save();
 var gr=x.createLinearGradient(ax,ay,ax+Lg*.9,ay+Lg*.5);gr.addColorStop(0,'rgba(255,244,180,'+(.75*fl)+')');gr.addColorStop(.55,'rgba(255,244,180,'+(.24*fl)+')');gr.addColorStop(1,'rgba(255,244,180,0)');
 x.fillStyle=gr;x.beginPath();x.moveTo(ax,ay);x.lineTo(ax+Lg*Math.cos(a0),ay+Lg*Math.sin(a0));x.lineTo(ax+Lg*Math.cos(a1),ay+Lg*Math.sin(a1));x.closePath();x.fill();
 F('rgba(255,244,180,.28)');x.beginPath();x.arc(ax+4,ay,26,0,6.3);x.fill();
 x.restore();
 F('#2a2a2e');x.beginPath();x.roundRect(116,-44,52,44,10);x.fill();
 F('#4a4a52');x.beginPath();x.roundRect(122,-39,40,13,5);x.fill();
 F('#fff3b0');x.beginPath();x.arc(152,-14,15,0,6.3);x.fill();F('#ffffff');x.beginPath();x.arc(149,-17,6,0,6.3);x.fill();
}
function pole(hx,hy,tx,ty,far){
 var dx=tx-hx,dy=ty-hy,L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L;
 K(far?'#9ea4a8':'#aab0b5',far?14:16);x.beginPath();x.moveTo(hx,hy);x.lineTo(tx,ty);x.stroke();
 var r=lerp([hx,hy],[tx,ty],.62);K('#f26a10',far?17:18);x.beginPath();x.moveTo(r[0],r[1]);x.lineTo(r[0]+ux*22,r[1]+uy*22);x.stroke();
 var b=lerp([hx,hy],[tx,ty],.94);K('#2a2a2e',7);x.beginPath();x.ellipse(b[0],b[1],20,8,0,0,6.3);x.stroke();
 F('#2a2a2e');ell(tx,ty,12,6);
}
function capA(a,b,ra,rb){cap(a[0],a[1],b[0],b[1],ra,rb)}
function drawLeg(hip,ank,far,lift,sn){
 var dd=Math.hypot(ank[0]-hip[0],ank[1]-hip[1]);if(dd>214){ank=[hip[0]+(ank[0]-hip[0])*214/dd,hip[1]+(ank[1]-hip[1])*214/dd]}
 var knee=ik(hip,ank,110,110,-1);
 F(far?'#6c6c4b':'#7b7b57');capA(hip,knee,58,46);
 capA(knee,lerp(knee,ank,.55),46,40);
 if(!far){F('#66664a');var tp=lerp(hip,knee,.55);x.save();x.translate(tp[0]+8,tp[1]);x.rotate(Math.atan2(knee[1]-hip[1],knee[0]-hip[0])-1.57);x.beginPath();x.roundRect(-40,-42,80,76,12);x.fill();K('#585840',4);x.beginPath();x.moveTo(-40,-26);x.lineTo(40,-24);x.stroke();x.restore()}
 F(far?'#2e2e32':'#34343a');capA(lerp(knee,ank,.45),[ank[0],ank[1]-6],40,38);
 boot(ank[0],ank[1],-.12*sn-.15*lift,far);
}
function mo(ts,air,ph,idle,duck,sitP,eat){
 if(idle)ph=Math.PI/2;var amp=idle?.28:1;
 var bob=air?0:Math.abs(Math.cos(ph))*12;
 var dk=duck||0,sit=sitP||0,TH=dk*.95+sit*.2,DY=dk*54+sit*205,PX=330,PY=560;
 function toW(qx,qy){var cx=qx-PX,cy=qy-PY,c=Math.cos(TH),sn=Math.sin(TH);return[PX+cx*c-cy*sn,PY+cx*sn+cy*c+DY-bob]}
 function toL(wx,wy){var ux=wx-PX,uy=wy+bob-DY-PY,c=Math.cos(-TH),sn=Math.sin(-TH);return[PX+ux*c-uy*sn,PY+ux*sn+uy*c]}
 var HN=[305,600-bob+DY],HF=[365,600-bob+DY],nA,fA,nl=0,fl=0,ns=0,fs=0;
 if(air){nA=[418,716];fA=[205,742];ns=.8;fs=-.5}
 else{
  var s1=Math.sin(ph)*amp,s2=Math.sin(ph+Math.PI)*amp;
  nl=idle?0:Math.max(0,Math.cos(ph));fl=idle?0:Math.max(0,Math.cos(ph+Math.PI));
  nA=[335+100*s1,768-nl*50];fA=[335+100*s2,768-fl*50];ns=s1;fs=s2;
 }
 if(sit>.001){nA=[nA[0]+(425-nA[0])*sit,nA[1]+(768-nA[1])*sit];fA=[fA[0]+(490-fA[0])*sit,fA[1]+(768-fA[1])*sit];ns=ns*(1-sit);fs=fs*(1-sit)}
 var ntx,nty,ftx,fty;
 if(air){ntx=560;nty=700;ftx=730;fty=720}
 else{ntx=330+70*amp*Math.sin(ph);nty=880-(idle?0:Math.max(0,Math.cos(ph))*70);ftx=430+70*amp*Math.sin(ph+Math.PI);fty=880-(idle?0:Math.max(0,Math.cos(ph+Math.PI))*70)}
 var nh=[370,524],fh=[533,512],fw=toW(533,512),ntl=toL(ntx,nty),ftl=toL(ftx,fty);
 if(!eat)pole(fw[0],fw[1],ftx,fty,true);
 drawLeg(HF,fA,true,fl,fs);
 drawLeg(HN,nA,false,nl,ns);
 x.save();x.translate(0,-bob);
 if(dk>.001||sit>.001){x.translate(0,DY);x.translate(PX,PY);x.rotate(TH);x.translate(-PX,-PY)}
 if(air){x.translate(300,600);x.rotate(.07);x.translate(-300,-600)}
 if(eat){F('#d95a0a');cap(430,395,462,455,36,31);cap(462,455,505,320,31,27);F('#f0e2c8');cap(500,336,508,314,29,27);F('#f0b48c');ell(510,296,25,23)}else{
 F('#d95a0a');cap(430,395,480,462,36,31);
 F('#f0e2c8');cap(486,455,496,478,29,27);
 gripHand(537,478,-Math.atan2(ftl[0]-fh[0],ftl[1]-fh[1]),1,true);
 }
 F('#f2c230');x.fill(BEDROLL);
 x.save();x.clip(BEDROLL);F('rgba(255,240,150,.55)');x.fillRect(100,268,180,22);F('rgba(190,125,0,.3)');x.fillRect(100,344,180,40);x.restore();
 F('#f6d050');ell(142,322,40,50);K('#e0a920',8);x.beginPath();x.ellipse(142,322,40,50,0,0,6.3);x.stroke();x.beginPath();x.ellipse(142,322,22,28,0,0,6.3);x.stroke();
 F('#e0a920');ell(142,322,9,12);
 [172,236].forEach(function(sx){
  F('rgba(0,0,0,.18)');x.beginPath();x.moveTo(sx+6,272);x.bezierCurveTo(sx+24,305,sx+24,342,sx+8,378);x.lineTo(sx+30,378);x.bezierCurveTo(sx+46,342,sx+46,305,sx+28,274);x.closePath();x.fill();
  F('#464b52');x.beginPath();x.moveTo(sx,270);x.bezierCurveTo(sx+16,305,sx+16,340,sx,374);x.lineTo(sx+22,376);x.bezierCurveTo(sx+38,340,sx+38,305,sx+22,272);x.closePath();x.fill();
  F('rgba(255,255,255,.18)');x.beginPath();x.moveTo(sx+3,276);x.bezierCurveTo(sx+15,308,sx+15,338,sx+5,366);x.lineTo(sx+10,366);x.bezierCurveTo(sx+20,338,sx+20,308,sx+9,276);x.closePath();x.fill();
  F('#c8cdd0');x.beginPath();x.roundRect(sx+4,320,16,16,2);x.fill();F('#464b52');x.fillRect(sx+8,324,8,8)});
 F('#2f5878');x.fill(BAG);F('#244560');x.fill(BAGD);
 F('#27475f');x.beginPath();x.moveTo(200,392);x.lineTo(252,388);x.lineTo(254,452);x.lineTo(204,456);x.closePath();x.fill();
 F('#4a4f54');x.fill(MESH);
 x.save();x.clip(MESH);K('#9aa0a5',2.2);for(var i=-60;i<200;i+=15){x.beginPath();x.moveTo(100+i,470);x.lineTo(190+i,580);x.moveTo(190+i,470);x.lineTo(100+i,580);x.stroke()}x.restore();
 F('#b9bec2');x.fill(BOTTLE);F('rgba(255,255,255,.35)');x.beginPath();x.moveTo(122,440);x.lineTo(132,440);x.lineTo(130,485);x.lineTo(120,485);x.closePath();x.fill();
 F('#ee6a1a');x.beginPath();x.moveTo(128,412);x.lineTo(158,412);x.lineTo(160,432);x.lineTo(126,432);x.closePath();x.fill();
 F('#c8cdd0');x.beginPath();x.moveTo(150,380);x.lineTo(196,378);x.lineTo(198,392);x.lineTo(152,394);x.closePath();x.fill();
 x.beginPath();x.moveTo(178,510);x.lineTo(210,510);x.lineTo(210,545);x.lineTo(178,545);x.closePath();x.fill();F('#2f5878');x.fillRect(186,518,16,19);
 F('#f56a10');x.fill(JACKET);
 x.save();x.clip(JACKET);F('#ff7f2a');x.fill(JHI);F('#e05a0a');x.fill(JSH);x.restore();
 F('#e85d0c');x.fill(HOOD);F('#ff8a3a');x.beginPath();x.moveTo(262,308);x.quadraticCurveTo(300,290,345,296);x.quadraticCurveTo(300,304,262,326);x.closePath();x.fill();
 F('#4a2e18');x.fill(NECKIN);
 F('#2a2a2e');x.fill(STRAP);
 F('#efe9dc');x.fill(CHEST);F('#efe3c8');x.fill(ZIP);F('#f0a830');x.beginPath();x.moveTo(420,396);x.lineTo(426,396);x.lineTo(426,430);x.lineTo(420,430);x.closePath();x.fill();
 F('#2a2a2e');x.fill(BELT);F('#c8cdd0');x.fill(BUCKLE);F('#2a2a2e');x.fill(BUCKIN);
 if(eat){F('#f56a10');cap(278,372,300,468,42,37);cap(300,468,466,334,37,30);F('#f0e2c8');cap(452,346,474,326,33,29);F('#f0b48c');ell(486,312,27,25)}else{
 F('#f56a10');cap(278,372,252,452,42,37);cap(252,452,316,488,37,31);
 F('rgba(150,50,0,.25)');cap(262,400,246,448,16,14);
 F('#f0e2c8');x.beginPath();x.moveTo(284,448);x.lineTo(334,470);x.lineTo(322,520);x.lineTo(284,506);x.closePath();x.fill();
 F('rgba(0,0,0,.08)');x.beginPath();x.moveTo(310,458);x.lineTo(334,470);x.lineTo(322,520);x.lineTo(304,513);x.closePath();x.fill();
 pole(nh[0],nh[1],ntl[0],ntl[1],false);
 gripHand(382,498,-Math.atan2(ntl[0]-nh[0],ntl[1]-nh[1]),1.22,false);
 }
 F('#8a5a34');x.fill(HAIRB);F('#6f4526');x.beginPath();x.moveTo(262,235);x.bezierCurveTo(258,262,272,288,292,296);x.bezierCurveTo(276,278,270,256,276,232);x.closePath();x.fill();
 F('#f0b48c');x.fill(FACE);
 F('#8a5a34');x.fill(HAIRF);
 F('#a06c40');x.beginPath();x.moveTo(300,172);x.bezierCurveTo(330,160,364,160,390,170);x.bezierCurveTo(364,172,336,180,310,194);x.closePath();x.fill();
 K('#6f4526',3);x.beginPath();x.moveTo(300,200);x.bezierCurveTo(320,190,346,186,372,184);x.stroke();
 F('#b89d7a');x.fill(BEARD);
 F('#f0b48c');ell(332,232,27,27);K('#d98a66',6);x.beginPath();x.arc(334,234,13,.6,4.4);x.stroke();
 F('#5e3a1c');x.fill(SIDEBURN);
 F('#6e4426');x.fill(MOUSTACHE);
 if(air||eat>1){F('#6e2a1c');x.beginPath();x.ellipse(462,266,22,16,.12,0,6.3);x.fill();F('#c9625a');x.beginPath();x.ellipse(462,274,12,7,.12,0,6.3);x.fill()}
 else{K('#5a3418',6);x.beginPath();x.moveTo(424,252);x.quadraticCurveTo(455,278,490,262);x.stroke()}
 F('#f29b88');ell(487,220,26,25);F('#f7b8a8');ell(478,210,9,7);
 var bl=(ts%3400)<140;
 if(bl){K('#15110e',7);x.beginPath();x.moveTo(418,206);x.quadraticCurveTo(436,216,456,204);x.stroke()}
 else{F('#ffffff');ell(436,205,22,air?29:26);F('#15110e');ell(447,203,10,14);F('#ffffff');ell(451,197,3.4,3.4)}
 K('#7a4a26',13);x.beginPath();var ra=air?-16:0;x.moveTo(408,180+ra);x.quadraticCurveTo(436,160+ra,478,184+ra);x.stroke();
 hat(ts);
 x.restore();
}

/* ---------- Hindernisse ---------- */
/* Beinphase aus dem Weg, den das Tier ueber den Boden laeuft (Standfuss gleitet mit Bodentempo zurueck, kein Rutschen) */
function gait(o,t,sc){var k=APP[t]||0;return k*Math.max(0,g.run-(o.bx-W-60))*1.12/(120*sc)}
function obst(t,px,fph,oo){
 if(BON[t]){bonusObst(t,px,oo);return}
 if(t==='eagle'){var eb=78+(px>300?Math.min(110,(px-300)*.55):px<20?Math.min(110,(20-px)*.8):0);x.fillStyle='rgba(0,0,0,'+(.2*(1-(eb-78)/130))+')';x.beginPath();x.ellipse(px,FY+2,34*(1-(eb-78)/200),4.5,0,0,6.3);x.fill();x.save();x.translate(px,FY+1-eb);x.scale(-.14,.14);x.translate(-372,-322);eagleVec(NOW);x.restore();return}
 shadow(px,t==='bear'?60:t==='wolf'?38:t==='fox'?30:19);
 if(t==='bear'){x.save();x.translate(px,FY+1);x.scale(.17,.17);x.translate(-336,-346);bearVec(NOW,px<340&&px>-20?Math.min(1,(340-px)/50):0);x.restore();return}
 if(t==='wolf'){x.save();x.translate(px,FY+1);x.scale(-.055,.055);x.translate(-800,-800);wolfVec(NOW,gait(oo,t,.055));x.restore();return}
 if(t==='fox'){x.save();x.translate(px,FY+1);x.scale(-.042,.042);x.translate(-800,-800);foxVec(NOW,gait(oo,t,.042));x.restore();return}
 if(t==='log'){x.fillStyle='#6f4527';x.beginPath();x.roundRect(px-26,FY-26,44,28,5);x.fill();
  x.strokeStyle='#8a5a34';x.lineWidth=1.6;[-20,-12,-4,4].forEach(function(d){x.beginPath();x.moveTo(px+d,FY-22);x.quadraticCurveTo(px+d+3,FY-12,px+d,FY-3);x.stroke()});
  x.fillStyle='#5f8a3a';x.beginPath();x.ellipse(px-14,FY-26,10,4,0,0,6.3);x.ellipse(px-2,FY-25,6,3,0,0,6.3);x.fill();
  x.fillStyle='#6f4527';x.fillRect(px-8,FY-33,6,8);
  x.fillStyle='#d3a56d';x.beginPath();x.ellipse(px+18,FY-12,10,14,0,0,6.3);x.fill();
  x.strokeStyle='#a97a46';x.lineWidth=1.2;[[6.5,10],[3.5,6.5],[1.5,3.5]].forEach(function(r){x.beginPath();x.ellipse(px+18,FY-12,r[0],r[1],0,0,6.3);x.stroke()});
  eyes(px+18,FY-19,.85,-1);x.strokeStyle='#5a3a1a';x.lineWidth=1.4;x.beginPath();x.moveTo(px+13,FY-24);x.lineTo(px+17,FY-23);x.moveTo(px+23,FY-24);x.lineTo(px+19,FY-23);x.stroke()}
 else if(t==='rock'){x.fillStyle='#868c91';x.beginPath();x.moveTo(px-24,FY);x.quadraticCurveTo(px-26,FY-28,px-6,FY-34);x.quadraticCurveTo(px+16,FY-40,px+24,FY-10);x.lineTo(px+24,FY);x.closePath();x.fill();
  x.fillStyle='#a3a9ae';x.beginPath();x.moveTo(px-16,FY-26);x.quadraticCurveTo(px-4,FY-36,px+8,FY-32);x.quadraticCurveTo(px-2,FY-28,px-16,FY-26);x.fill();
  x.fillStyle='#6b7176';x.beginPath();x.moveTo(px+24,FY);x.lineTo(px+24,FY-10);x.lineTo(px+10,FY-6);x.lineTo(px+14,FY);x.closePath();x.fill();
  x.strokeStyle='#5d6368';x.lineWidth=1.2;x.beginPath();x.moveTo(px+10,FY-30);x.lineTo(px+6,FY-22);x.lineTo(px+10,FY-17);x.moveTo(px-18,FY-8);x.lineTo(px-12,FY-12);x.stroke();
  x.fillStyle='#6f9a45';x.beginPath();x.ellipse(px-14,FY-3,8,3,0,0,6.3);x.ellipse(px+16,FY-2,5,2.5,0,0,6.3);x.fill();
  eyes(px,FY-19,1,0);x.strokeStyle='#3d4247';x.lineWidth=1.6;x.beginPath();x.moveTo(px-5,FY-8);x.quadraticCurveTo(px,FY-12,px+5,FY-8);x.stroke();
  x.beginPath();x.moveTo(px-7,FY-25);x.lineTo(px-2,FY-23);x.moveTo(px+7,FY-25);x.lineTo(px+2,FY-23);x.stroke()}
 else{
  [[-15,.55],[14,.7]].forEach(function(m){var mx=px+m[0],s=m[1];x.fillStyle='#efe4cf';x.beginPath();x.roundRect(mx-4*s,FY-14*s,8*s,15*s,3);x.fill();
   x.fillStyle='#d9573f';x.beginPath();x.moveTo(mx-13*s,FY-12*s);x.quadraticCurveTo(mx,FY-32*s,mx+13*s,FY-12*s);x.closePath();x.fill();
   x.fillStyle='#fff';x.beginPath();x.arc(mx-4*s,FY-18*s,2*s,0,6.3);x.arc(mx+5*s,FY-16*s,1.6*s,0,6.3);x.fill()});
  x.fillStyle='#efe4cf';x.beginPath();x.roundRect(px-7,FY-22,14,23,4);x.fill();
  x.fillStyle='#d6d0bb';x.fillRect(px-7,FY-12,14,2);
  x.fillStyle='#c6372b';x.beginPath();x.moveTo(px-23,FY-20);x.quadraticCurveTo(px,FY-52,px+23,FY-20);x.closePath();x.fill();
  x.fillStyle='#e05a45';x.beginPath();x.moveTo(px-18,FY-26);x.quadraticCurveTo(px-8,FY-42,px+4,FY-44);x.quadraticCurveTo(px-6,FY-36,px-18,FY-26);x.fill();
  x.fillStyle='#fff';[[-12,-28,3.4],[2,-38,3.8],[12,-27,3],[-2,-27,2]].forEach(function(d){x.beginPath();x.arc(px+d[0],FY+d[1]+2,d[2],0,6.3);x.fill()});
  eyes(px,FY-13,.75,0);x.strokeStyle='#6b5a3a';x.lineWidth=1.3;x.beginPath();x.moveTo(px-3,FY-6);x.quadraticCurveTo(px,FY-8.5,px+3,FY-6);x.stroke()}
}
/* ---------- Bonus: Höhle und Gebirgsgrat (nach dem Sieg an der Hütte) ---------- */
var BON={stalag:1,stalag2:1,pfuetze:1,stalak:1,bat:1,gap:1,boulder:1,steinmann:1,dohle:1,felsnase:1,hedge:1,crow:1,seal:1,gull:1};
var LUFT={eagle:1,bat:1,dohle:1,crow:1,gull:1},HANG={stalak:1,felsnase:1};
var CK=['#5b6480','#8a93b0','#3b4259'],GK=['#64748B','#94A3B8','#334155'];
function spike(px,w,h,c){
 x.fillStyle=c[0];x.beginPath();x.moveTo(px-w/2,FY);x.quadraticCurveTo(px-w*.28,FY-h*.55,px-w*.05,FY-h);x.quadraticCurveTo(px+w*.2,FY-h*.5,px+w/2,FY);x.closePath();x.fill();
 x.fillStyle=c[1];x.beginPath();x.moveTo(px-w*.18,FY);x.quadraticCurveTo(px-w*.18,FY-h*.5,px-w*.05,FY-h);x.quadraticCurveTo(px-w*.02,FY-h*.5,px+w*.04,FY);x.closePath();x.fill()}
function bonusObst(t,px,o){
 if(AOB[t]){areaObst(t,px,o);return}if(GOB[t]){gbObst(t,px,o);return}if(BON3[t]){bonus3Obst(t,px,o);return}
 if(t==='hedge'||t==='crow'||t==='seal'||t==='gull'){moorObst(t,px,o);return}
 if(t==='gap'){
  if(o&&o.hit&&cur!=='Moor'){x.fillStyle=GK[0];[-22,-8,8,22].forEach(function(d,i){x.beginPath();x.ellipse(px+d,FY-2-(i%2)*3,9,5,0,3.14,6.28);x.fill()});x.fillStyle=GK[1];x.beginPath();x.ellipse(px-8,FY-6,4,2,0,3.14,6.28);x.fill()}
  return}
 if(t==='bat'){
  var ph0=o?o.bx:px,by=FY-(104+6*Math.sin(NOW/330+ph0/55));
  x.fillStyle='rgba(0,0,0,.16)';x.beginPath();x.ellipse(px,FY+2,34,4,0,0,6.3);x.fill();
  [[0,0,1.35],[-30,-12,1],[26,-16,1.1],[-14,12,.95],[34,10,1],[-46,2,.85],[10,-28,.9],[50,-8,.8]].forEach(function(b,i){
   var fl=Math.sin(NOW/70+i*1.9+ph0/9),s=b[2]*1.25;
   x.save();x.translate(px+b[0]+Math.sin(NOW/400+i*2)*3,by+b[1]+Math.cos(NOW/350+i)*3);x.scale(s,s);
   x.fillStyle='#12121c';x.strokeStyle='rgba(130,140,180,.65)';x.lineWidth=.9;
   [-1,1].forEach(function(sd){x.beginPath();x.moveTo(sd*3,-2);x.quadraticCurveTo(sd*14,-12-fl*7,sd*26,-4-fl*9);x.quadraticCurveTo(sd*21,0,sd*18,3);x.quadraticCurveTo(sd*13,-1,sd*9,5);x.quadraticCurveTo(sd*5,1,sd*3,6);x.closePath();x.fill();x.stroke()});
   x.beginPath();x.ellipse(0,1,6,8,0,0,6.3);x.fill();x.stroke();
   x.beginPath();x.moveTo(-5,-5);x.lineTo(-6,-13);x.lineTo(-1,-8);x.moveTo(5,-5);x.lineTo(6,-13);x.lineTo(1,-8);x.fill();
   x.fillStyle='#ffffff';x.beginPath();x.arc(-2.4,-2.4,1.7,0,6.3);x.arc(2.4,-2.4,1.7,0,6.3);x.fill();
   x.fillStyle='#12121c';x.beginPath();x.arc(-2.9,-2.4,.7,0,6.3);x.arc(1.9,-2.4,.7,0,6.3);x.fill();
   x.restore()});
  return}
 if(t==='dohle'){
  var dy=FY-(92+5*Math.sin(NOW/400+px/70)),fw=Math.sin(NOW/90+px/8);
  x.fillStyle='rgba(0,0,0,.12)';x.beginPath();x.ellipse(px,FY+2,12,3,0,0,6.3);x.fill();
  x.save();x.translate(px,dy);
  x.fillStyle='#1d2330';x.beginPath();x.ellipse(0,0,13,6,0,0,6.3);x.fill();x.beginPath();x.arc(-12,-2,4.6,0,6.3);x.fill();
  x.beginPath();x.moveTo(12,-1);x.lineTo(21,2);x.lineTo(12,3);x.closePath();x.fill();
  x.fillStyle='#f2c230';x.beginPath();x.moveTo(-15.5,-3);x.lineTo(-23,-1);x.lineTo(-15.5,0);x.closePath();x.fill();
  x.fillStyle='#2b3345';x.beginPath();x.moveTo(-3,-3);x.quadraticCurveTo(4,-14-fw*9,16,-10-fw*12);x.quadraticCurveTo(10,-4,6,0);x.closePath();x.fill();
  x.fillStyle='#fff';x.beginPath();x.arc(-13,-3.5,1.3,0,6.3);x.fill();x.restore();return}
 if(t==='stalag'||t==='stalag2'){
  shadow(px,t==='stalag'?16:30);
  if(t==='stalag'){spike(px,26,36,CK);eyes(px,FY-14,.8,0)}else{spike(px-13,24,34,CK);spike(px+13,22,44,CK);eyes(px+13,FY-18,.8,0)}
  return}
 if(t==='pfuetze'){
  x.fillStyle='rgba(0,0,0,.2)';x.beginPath();x.ellipse(px,FY+1,34,7,0,0,6.3);x.fill();
  x.fillStyle='#2a5b86';x.beginPath();x.ellipse(px,FY-1,31,6,0,0,6.3);x.fill();
  x.fillStyle='rgba(56,189,248,.55)';x.beginPath();x.ellipse(px-6,FY-2,18,3,0,0,6.3);x.fill();
  var rp=(NOW/1200)%1;x.strokeStyle='rgba(224,242,254,'+(.7*(1-rp))+')';x.lineWidth=1.2;x.beginPath();x.ellipse(px+8,FY-1,4+rp*14,1.5+rp*3,0,0,6.3);x.stroke();
  x.fillStyle='#4a4358';[-30,28].forEach(function(d){x.beginPath();x.ellipse(px+d,FY-2,6,4,0,3.14,6.28);x.fill()});return}
 if(t==='stalak'){
  var tip=FY-80;
  x.fillStyle=CK[0];x.beginPath();x.moveTo(px-21,-4);x.lineTo(px+21,-4);x.quadraticCurveTo(px+13,tip*.55,px+3,tip);x.quadraticCurveTo(px-9,tip*.5,px-21,-4);x.closePath();x.fill();
  x.fillStyle=CK[1];x.beginPath();x.moveTo(px-6,-4);x.lineTo(px+8,-4);x.quadraticCurveTo(px+5,tip*.5,px+3,tip);x.quadraticCurveTo(px-4,tip*.5,px-6,-4);x.closePath();x.fill();
  var dp=(NOW/1600+(o?o.bx:px)/97)%1;if(dp>.3){x.fillStyle='rgba(125,211,252,.9)';x.beginPath();x.ellipse(px+3,tip+4+(dp-.3)/.7*(FY-tip-8),1.6,2.6,0,0,6.3);x.fill()}
  eyes(px+2,tip-26,.8,0);return}
 if(t==='boulder'){
  shadow(px,28);x.fillStyle=GK[0];x.beginPath();x.moveTo(px-26,FY);x.lineTo(px-24,FY-22);x.lineTo(px-10,FY-40);x.lineTo(px+8,FY-44);x.lineTo(px+24,FY-26);x.lineTo(px+27,FY);x.closePath();x.fill();
  x.fillStyle=GK[1];x.beginPath();x.moveTo(px-24,FY-22);x.lineTo(px-10,FY-40);x.lineTo(px+8,FY-44);x.lineTo(px-2,FY-26);x.closePath();x.fill();
  x.fillStyle=GK[2];x.beginPath();x.moveTo(px+27,FY);x.lineTo(px+24,FY-26);x.lineTo(px+8,FY-18);x.lineTo(px+12,FY);x.closePath();x.fill();
  x.strokeStyle='rgba(30,41,59,.6)';x.lineWidth=1.2;x.beginPath();x.moveTo(px-6,FY-30);x.lineTo(px-10,FY-14);x.lineTo(px-4,FY-6);x.stroke();
  eyes(px-2,FY-16,1,0);return}
 if(t==='steinmann'){
  shadow(px,22);
  [[6,17,7,'#7c8aa0'],[15,13,6,'#94A3B8'],[24,9.5,5,'#64748B'],[32,6,4.5,'#94A3B8']].forEach(function(s){x.fillStyle=s[3];x.beginPath();x.ellipse(px,FY-s[0],s[1],s[2],0,0,6.3);x.fill();x.fillStyle='rgba(255,255,255,.25)';x.beginPath();x.ellipse(px-s[1]*.2,FY-s[0]-s[2]*.4,s[1]*.6,s[2]*.4,0,0,6.3);x.fill()});
  eyes(px,FY-6,.8,0);return}
 if(t==='felsnase'){
  var tp=FY-80;
  x.fillStyle=GK[0];x.beginPath();x.moveTo(px-34,-4);x.lineTo(px+30,-4);x.lineTo(px+26,tp*.5);x.quadraticCurveTo(px+12,tp-2,px-8,tp+6);x.lineTo(px-30,tp*.42);x.closePath();x.fill();
  x.fillStyle=GK[2];x.beginPath();x.moveTo(px+30,-4);x.lineTo(px+26,tp*.5);x.quadraticCurveTo(px+12,tp-2,px+4,tp+2);x.lineTo(px+14,tp*.5);x.closePath();x.fill();
  x.fillStyle=GK[1];x.beginPath();x.moveTo(px-34,-4);x.lineTo(px-30,tp*.42);x.lineTo(px-18,tp*.5);x.lineTo(px-20,-4);x.closePath();x.fill();
  eyes(px-4,tp-22,.9,0)}}
function bonusSign(wx,text){
 var q=wx-g.run;if(q<-160||q>W+160)return;if(AFG[cur])ASG.push(q);var gy=FY-8;
 x.font='500 16px system-ui,sans-serif';x.textAlign='left';x.textBaseline='alphabetic';var w=zWid[text]||(zWid[text]=x.measureText(text).width);
 x.fillStyle='rgba(0,0,0,.2)';x.beginPath();x.ellipse(q+2,gy+2,14,3.5,0,0,6.3);x.fill();
 x.fillStyle='#7a5430';x.fillRect(q-4,gy-84,8,86);x.fillStyle='#8a6238';x.fillRect(q-4,gy-84,3,86);
 var l=q-w/2-12,r=q+w/2+12;x.fillStyle='#c9a26a';x.beginPath();x.moveTo(l,gy-80);x.lineTo(r,gy-80);x.lineTo(r+14,gy-65);x.lineTo(r,gy-50);x.lineTo(l,gy-50);x.closePath();x.fill();
 x.strokeStyle='#8a6238';x.lineWidth=1.5;x.stroke();
 x.fillStyle='rgba(0,0,0,.12)';x.fillRect(l,gy-52,r-l,2);x.fillStyle='#2e1f12';x.fillText(text,q-w/2,gy-59)}
function warnSign(wx,kind){
 var q=wx-g.run;if(q<-90||q>W+90)return;var gy=FY-8,txt={stein:'Steinschlag',absturz:'Absturzgefahr',kopf:'Vorsicht, Kopf!',wind:'Windböen'}[kind],sd=Math.floor(wx/97)%2?1:-1;
 /* Pfosten aus Holz, Fuß mit Steinen */
 x.fillStyle='rgba(0,0,0,.22)';x.beginPath();x.ellipse(q+3,gy+2,20,4,0,0,6.3);x.fill();
 x.fillStyle='#6b4a2c';x.fillRect(q-5,gy-92,10,94);x.fillStyle='#855c38';x.fillRect(q-5,gy-92,3.5,94);x.fillStyle='rgba(0,0,0,.18)';x.fillRect(q+2,gy-92,3,94);
 x.fillStyle='#7c8794';[[-11,3,5],[9,2.5,4.5],[14,1.5,3]].forEach(function(d){x.beginPath();x.ellipse(q+d[0],gy+d[1]-1,d[2],d[2]*.55,0,3.14,6.28);x.fill()});
 /* Schild, leicht schief montiert */
 x.save();x.translate(q,gy-114);x.rotate(.025*sd);x.translate(-q,-(gy-114));
 function tri(ox,oy,k){var t=gy-150+oy,bt=gy-80+oy,hw=40-k;x.beginPath();x.moveTo(q+ox,t+k*1.9);x.lineTo(q-hw+ox,bt-k*.7);x.lineTo(q+hw+ox,bt-k*.7);x.closePath()}
 x.lineJoin='round';x.fillStyle='rgba(0,0,0,.24)';tri(3,3,0);x.fill();
 var pg=x.createLinearGradient(0,gy-150,0,gy-80);pg.addColorStop(0,'#ffffff');pg.addColorStop(1,'#e7e3d6');x.fillStyle=pg;tri(0,0,0);x.fill();
 x.save();tri(0,0,0);x.clip();
 x.fillStyle='#1d2127';x.strokeStyle='#1d2127';x.lineCap='round';x.lineWidth=2.8;
 if(kind==='stein'){
  x.beginPath();x.moveTo(q-27,gy-90);x.lineTo(q+27,gy-90);x.lineTo(q+27,gy-120);x.closePath();x.fill();
  x.fillStyle='rgba(255,255,255,.28)';x.beginPath();x.moveTo(q-12,gy-92);x.lineTo(q+22,gy-110);x.lineTo(q+22,gy-107);x.lineTo(q-8,gy-92);x.closePath();x.fill();
  x.lineWidth=1.3;x.strokeStyle='#5b626b';x.beginPath();x.moveTo(q+17,gy-125);x.lineTo(q+13,gy-120);x.moveTo(q+5,gy-117);x.lineTo(q+1,gy-112);x.stroke();
  x.fillStyle='#1d2127';[[11,-114,3.6],[-1,-106,4.8],[-14,-98,3.8]].forEach(function(r){x.beginPath();x.arc(q+r[0],gy+r[1],r[2],0,6.3);x.fill();x.fillStyle='rgba(255,255,255,.5)';x.beginPath();x.arc(q+r[0]-1.2,gy+r[1]-1.2,r[2]*.28,0,6.3);x.fill();x.fillStyle='#1d2127'})}
 else if(kind==='absturz'){
  x.beginPath();x.moveTo(q-34,gy-100);x.lineTo(q-10,gy-100);x.lineTo(q-13,gy-95);x.lineTo(q-9,gy-91);x.lineTo(q-12,gy-85);x.lineTo(q-34,gy-85);x.closePath();x.fill();
  x.fillStyle='rgba(255,255,255,.3)';x.fillRect(q-33,gy-99,22,1.4);x.fillStyle='#1d2127';
  x.beginPath();x.arc(q+5,gy-111,4,0,6.3);x.fill();
  x.beginPath();x.moveTo(q+6,gy-106);x.lineTo(q+10,gy-98);x.lineTo(q+5,gy-92);x.moveTo(q+10,gy-98);x.lineTo(q+18,gy-94);x.moveTo(q+7,gy-105);x.lineTo(q+16,gy-111);x.moveTo(q+7,gy-105);x.lineTo(q-3,gy-102);x.stroke();
  x.lineWidth=1.2;x.strokeStyle='#8a9099';x.setLineDash([2.5,3]);x.beginPath();x.moveTo(q-6,gy-112);x.quadraticCurveTo(q-1,gy-118,q+3,gy-117);x.stroke();x.setLineDash([])}
 else if(kind==='kopf'){
  x.beginPath();x.moveTo(q-11,gy-125);x.lineTo(q+11,gy-125);x.lineTo(q+1.5,gy-103);x.closePath();x.fill();
  x.fillStyle='#e8f1ff';x.beginPath();x.moveTo(q-6,gy-124);x.lineTo(q-1,gy-124);x.lineTo(q+1,gy-110);x.closePath();x.fill();x.fillStyle='#1d2127';
  x.beginPath();x.arc(q,gy-91,4.6,0,6.3);x.fill();x.beginPath();x.ellipse(q,gy-93.5,9,7,0,Math.PI,0);x.fill();x.fillRect(q-10.5,gy-94,21,2.6);
  x.lineWidth=1.5;x.strokeStyle='#5b626b';x.beginPath();x.moveTo(q-15,gy-104);x.lineTo(q-11,gy-100);x.moveTo(q+15,gy-104);x.lineTo(q+11,gy-100);x.moveTo(q,gy-107);x.lineTo(q,gy-103);x.stroke()}
 else{
  x.lineWidth=2.6;[[-117,-2],[-106,3],[-95,-1]].forEach(function(d,i){var yy=gy+d[0];x.beginPath();x.moveTo(q-24+i*3,yy);x.bezierCurveTo(q-12,yy-7,q-2,yy+6,q+14,yy);x.bezierCurveTo(q+19,yy-2,q+21,yy-8,q+17,yy-9);x.stroke()});
  x.fillStyle='#1d2127';x.beginPath();x.ellipse(q+20,gy-100,6,2.4,-.4,Math.PI,0);x.fill();x.fillRect(q+13.5,gy-101,13,1.5)}
 x.lineCap='butt';x.setLineDash([]);x.restore();
 x.strokeStyle='#cf2e24';x.lineWidth=9;x.lineJoin='round';tri(0,0,0);x.stroke();
 x.strokeStyle='rgba(255,255,255,.35)';x.lineWidth=1.2;x.beginPath();x.moveTo(q-35,gy-84);x.lineTo(q-2,gy-141);x.stroke();
 x.fillStyle='#9aa1aa';[[q,gy-140],[q-34,gy-85],[q+34,gy-85]].forEach(function(n){x.beginPath();x.arc(n[0],n[1],1.7,0,6.3);x.fill()});
 x.lineJoin='miter';
 x.restore();
 /* Holztafel mit Schrift */
 x.font='bold 15px system-ui,sans-serif';var w=x.measureText(txt).width,bx=q-w/2-13,by=gy-74;
 x.fillStyle='rgba(0,0,0,.24)';x.beginPath();x.roundRect(bx+2,by+4,w+26,28,6);x.fill();
 var bg=x.createLinearGradient(0,by,0,by+28);bg.addColorStop(0,'#dcb97f');bg.addColorStop(1,'#b8905c');x.fillStyle=bg;x.strokeStyle='#6b4a2c';x.lineWidth=1.8;
 x.beginPath();x.roundRect(bx,by,w+26,28,6);x.fill();x.stroke();
 x.strokeStyle='rgba(107,74,44,.35)';x.lineWidth=1;[by+9,by+19].forEach(function(yy){x.beginPath();x.moveTo(bx+8,yy);x.bezierCurveTo(bx+w*.3,yy-1.5,bx+w*.7,yy+1.5,bx+w+18,yy);x.stroke()});
 x.fillStyle='#4a2f18';[bx+6,bx+w+20].forEach(function(nx){x.beginPath();x.arc(nx,by+14,1.8,0,6.3);x.fill()});
 x.fillStyle='rgba(255,236,200,.5)';x.fillText(txt,q-w/2,by+20.5);x.fillStyle='#2e1b0c';x.fillText(txt,q-w/2,by+19.5)}
function hangBat(q,hy,s,ts,i){
 x.save();x.translate(q,hy);x.scale(s,s);
 x.fillStyle='#0d101a';x.beginPath();x.moveTo(-6,-10);x.lineTo(6,-10);x.lineTo(2,2);x.lineTo(-2,2);x.closePath();x.fill();
 var sh=((ts/1000+i*1.7)%7)<.5?Math.sin(ts/38)*1.4:0;x.translate(sh,0);
 x.fillStyle='#14141f';x.strokeStyle='rgba(130,140,180,.6)';x.lineWidth=.9;
 x.beginPath();x.moveTo(0,0);x.bezierCurveTo(10,4,11,18,0,26);x.bezierCurveTo(-11,18,-10,4,0,0);x.closePath();x.fill();x.stroke();
 x.beginPath();x.moveTo(-4,22);x.lineTo(-6,29);x.lineTo(-1,25);x.moveTo(4,22);x.lineTo(6,29);x.lineTo(1,25);x.fill();
 if(((ts/900+i)%3)<.14){x.strokeStyle='#ffffff';x.lineWidth=1;x.beginPath();x.moveTo(-4.5,22);x.lineTo(-1,22);x.moveTo(1,22);x.lineTo(4.5,22);x.stroke()}
 else{x.fillStyle='#ffffff';x.beginPath();x.arc(-2.6,22,1.8,0,6.3);x.arc(2.6,22,1.8,0,6.3);x.fill();x.fillStyle='#14141f';x.beginPath();x.arc(-2.6,22.3,.8,0,6.3);x.arc(2.6,22.3,.8,0,6.3);x.fill()}
 x.restore()}
function crystals(cx,cy,s,amber,dir,ts,ph){
 var c=amber?'#F59E0B':'#38BDF8',c2=amber?'#FCD34D':'#BAE6FD',gl=.3+.12*Math.sin(ts/500+ph),gy=cy-dir*10*s,gg=x.createRadialGradient(cx,gy,2,cx,gy,40*s);
 gg.addColorStop(0,(amber?'rgba(245,158,11,':'rgba(56,189,248,')+gl+')');gg.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=gg;x.beginPath();x.arc(cx,gy,40*s,0,6.3);x.fill();
 [[-8,22,7,-.12],[0,32,9,0],[9,18,6,.14]].forEach(function(p){
  var qx=cx+p[0]*s,h=p[1]*s*dir,w=p[2]*s,sh=p[3]*h*.4;
  x.fillStyle=c;x.beginPath();x.moveTo(qx-w/2,cy);x.lineTo(qx-w*.35+sh,cy-h);x.lineTo(qx+w*.1+sh,cy-h-w*.5*dir);x.lineTo(qx+w*.45+sh,cy-h);x.lineTo(qx+w/2,cy);x.closePath();x.fill();
  x.globalAlpha=.6;x.fillStyle=c2;x.beginPath();x.moveTo(qx-w*.3,cy);x.lineTo(qx-w*.28+sh,cy-h);x.lineTo(qx+w*.02+sh,cy-h-w*.4*dir);x.lineTo(qx-w*.05,cy);x.closePath();x.fill();x.globalAlpha=1})}
function drawCave(ts){
 var o=D,gr=x.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#141824');gr.addColorStop(1,'#262E42');x.fillStyle=gr;x.fillRect(0,0,W,H);
 for(var i=0;i<9;i++){var q0=md(i*150+R(i)*40-o*.1,LOOP),cw=30+R(i+3)*26;
  [q0,q0-LOOP].forEach(function(q){if(q<-60||q>W+60)return;x.fillStyle='#1b2133';x.beginPath();x.moveTo(q-cw*.55,0);x.quadraticCurveTo(q-cw*.2,H*.5,q-cw*.5,H);x.lineTo(q+cw*.5,H);x.quadraticCurveTo(q+cw*.2,H*.5,q+cw*.55,0);x.closePath();x.fill()})}
 for(var i2=0;i2<10;i2++){var v0=md(i2*140+R(i2+20)*60-o*.18,LOOP),vy=60+R(i2+30)*180,ga=.22+.2*Math.sin(ts/600+i2*1.7),am=i2%3===0;
  [v0,v0-LOOP].forEach(function(q){if(q<-80||q>W+80)return;x.strokeStyle=(am?'rgba(245,158,11,':'rgba(56,189,248,')+ga+')';x.lineWidth=1.3;x.beginPath();x.moveTo(q,vy);x.lineTo(q+22,vy-14);x.lineTo(q+40,vy+4);x.lineTo(q+66,vy-10);x.stroke()})}
 x.fillStyle='#1c2236';
 for(var i3=0;i3<20;i3++){var m0=md(i3*68+R(i3+40)*30-o*.35,LOOP),mh=34+R(i3+50)*54,mw=16+R(i3+60)*16,up=i3%2;
  [m0,m0-LOOP].forEach(function(q){if(q<-40||q>W+40)return;x.beginPath();if(up){x.moveTo(q-mw,GY+6);x.lineTo(q,GY+6-mh);x.lineTo(q+mw,GY+6)}else{x.moveTo(q-mw,0);x.lineTo(q,mh+30);x.lineTo(q+mw,0)}x.closePath();x.fill()})}
 x.fillStyle='#5C4033';x.fillRect(0,GY,W,H-GY);x.fillStyle='rgba(255,255,255,.08)';x.fillRect(0,GY,W,2);
 for(var i4=0;i4<5;i4++){var p0=md(i4*290+R(i4+70)*60-o*.65,LOOP),py=GY+14+R(i4+71)*8;
  [p0,p0-LOOP].forEach(function(q){if(q<-50||q>W+50)return;x.fillStyle='rgba(56,189,248,.28)';x.beginPath();x.ellipse(q,py,28,4.5,0,0,6.3);x.fill();x.fillStyle='rgba(224,242,254,.32)';x.beginPath();x.ellipse(q-6,py-1,10,1.5,0,0,6.3);x.fill()})}
 for(var i5=0;i5<6;i5++){var c0=md(i5*230+R(i5+80)*70-o*.65,LOOP);[c0,c0-LOOP].forEach(function(q){if(q>-60&&q<W+60)crystals(q,GY+10,.8+R(i5+81)*.4,i5%3===0,1,ts,i5)})}
 x.fillStyle='#8B5A2B';x.beginPath();x.moveTo(0,FY-8);for(var q1=0;q1<=W;q1+=10)x.lineTo(q1,FY-8+Math.sin((q1+D)/70)*2);
 x.lineTo(W,FY+16);for(var q2=W;q2>=0;q2-=10)x.lineTo(q2,FY+16+Math.sin((q2+D)/90)*2);x.closePath();x.fill();
 x.fillStyle='rgba(0,0,0,.1)';x.fillRect(0,FY+9,W,3);
 for(var pb=0;pb<26;pb++){var pq=md(pb*53-D,LOOP);if(pq<W){x.fillStyle=pb%3?'rgba(0,0,0,.14)':'rgba(255,255,255,.18)';x.beginPath();x.ellipse(pq,FY-4+R(pb)*18,2.2+R(pb+1)*2,1.2,0,0,6.3);x.fill()}}
 for(var i6=0;i6<4;i6++){var d0=md(i6*340+R(i6+90)*80-o*.9,LOOP);[d0,d0-LOOP].forEach(function(q){if(q>-60&&q<W+60)crystals(q,24,.9,i6===1,-1,ts,i6+3)})}
 x.fillStyle='#0d101a';x.beginPath();x.moveTo(-20,0);
 var k0=Math.floor(o*.9/14)-1,kn=Math.ceil(W/14)+3;
 for(var kk=0;kk<=kn;kk++){var k=k0+kk,qx=k*14-o*.9,th=12+R(k)*24;x.lineTo(qx,24+(k%2?0:th*.3));x.lineTo(qx+7,24+th)}
 x.lineTo(W+30,0);x.closePath();x.fill();
 x.strokeStyle='#2a3350';x.lineWidth=1.2;x.beginPath();for(var k2=0;k2<=kn;k2++){var kb=k0+k2,xx=kb*14-o*.9+7,yy=24+12+R(kb)*24;k2?x.lineTo(xx,yy):x.moveTo(xx,yy)}x.stroke();
 for(var d=0;d<4;d++){var per=2.4+d*.7,tt=(ts/1000/per+d*.31)%1,dxp=md(d*200+R(d+120)*50-o*.9,W+40)-20;
  if(tt<.8){var u=tt/.8;x.fillStyle='rgba(125,211,252,.85)';x.beginPath();x.ellipse(dxp,40+u*u*(FY-44),1.6,2.8,0,0,6.3);x.fill()}
  else{var sp=(tt-.8)/.2;x.strokeStyle='rgba(186,230,253,'+(.6*(1-sp))+')';x.lineWidth=1;x.beginPath();x.ellipse(dxp,FY-2,3+sp*9,1+sp*2.5,0,0,6.3);x.stroke()}}
 for(var hb=0;hb<8;hb++){var hq=md(hb*170+R(hb+130)*70-o*.9,LOOP),hh2=42+R(hb+131)*8,hs=.95+R(hb+132)*.35;[hq,hq-LOOP].forEach(function(q){if(q>-30&&q<W+30)hangBat(q,hh2,hs,ts,hb)})}
 bonusSign(zSignX('klu',1400),'Kluterthöhle');bonusSign(STAGE-480,'Ausgang: Gipfelgrat');
 (g.sch||[]).forEach(function(s){if(s.wx<STAGE)warnSign(s.wx,s.k)})}
function ridgeGaps(){var a=[];g.obs.forEach(function(o){if(o.t==='gap'&&!o.hit){var X=ox(o);if(X>-90&&X<W+90)a.push([X-HW.gap,X+HW.gap])}});return a.sort(function(p,q){return p[0]-q[0]})}
function fogBand(ts,o,y,a,sp){for(var i=0;i<6;i++){var q=md(i*260-o*sp+ts*.012*(i%2?1:-1),W+300)-150;x.fillStyle='rgba(236,244,251,'+a+')';x.beginPath();x.ellipse(q,y+Math.sin(i*2+ts/2200)*4,130,13,0,0,6.3);x.fill()}}
function ridgeBlock(a,b,o){
 var top=FY-8,ka=Math.floor((a+o)/12),kb=Math.ceil((b+o)/12);
 function lowY(k){return FY+22+R(k)*18+(R(k+5)>.78?16:0)}
 x.beginPath();x.moveTo(a,top);x.lineTo(b,top);
 for(var k=kb;k>=ka;k--){x.lineTo(Math.min(b,Math.max(a,k*12-o)),lowY(k))}
 x.lineTo(a,FY+30);x.closePath();
 var rg=x.createLinearGradient(0,top,0,FY+46);rg.addColorStop(0,'#b4bfcd');rg.addColorStop(.3,'#8795a9');rg.addColorStop(1,'#56637a');x.fillStyle=rg;x.fill();
 x.save();x.clip();
 for(var k3=ka;k3<=kb;k3++){var qx=k3*12-o,rr=R(k3+9),sk=(rr-.5)*10;
  if(rr>.55||rr<.25){x.fillStyle=rr>.55?'rgba(20,30,50,'+(.1+rr*.12)+')':'rgba(255,255,255,.1)';x.beginPath();x.moveTo(qx,top);x.lineTo(qx+12,top);x.lineTo(qx+12+sk,FY+50);x.lineTo(qx+sk,FY+50);x.closePath();x.fill()}}
 x.strokeStyle='rgba(255,255,255,.16)';x.lineWidth=1;
 [top+14,top+27].forEach(function(yy){x.beginPath();x.moveTo(a,yy);for(var q=a;q<=b+12;q+=12)x.lineTo(q,yy+Math.sin((q+o)/14+yy)*1.6);x.stroke()});
 x.restore();
 x.fillStyle='#B8B2A6';x.fillRect(a,top,b-a,10);x.fillStyle='#E7E2D6';x.fillRect(a,top,b-a,2);
 if(a>-12){x.fillStyle='rgba(51,65,85,.55)';x.beginPath();x.moveTo(a,top);x.lineTo(a+5,top);x.lineTo(a+3,FY+30);x.lineTo(a,FY+46);x.closePath();x.fill()}
 if(b<W+12){x.fillStyle='rgba(51,65,85,.55)';x.beginPath();x.moveTo(b,top);x.lineTo(b-5,top);x.lineTo(b-3,FY+30);x.lineTo(b,FY+46);x.closePath();x.fill()}}
function peaks(o,sp,yb,hMin,hMax,n,seed,lit,shade,snow,snowSh){
 x.fillStyle=shade;x.fillRect(0,yb-1,W,H-yb+1);
 for(var i=0;i<n;i++){
  var c0=md(i*LOOP/n+R(i+seed)*LOOP/n*.4-o*sp,LOOP),h=hMin+R(i+seed+7)*(hMax-hMin),w=h*1.2+10;
  [c0,c0-LOOP].forEach(function(cx){
   if(cx<-w-20||cx>W+w+20)return;
   var sx=cx+(R(i+seed+11)-.5)*w*.3,ty=yb-h,px1=cx-w*.52,py1=yb-h*(.4+R(i+seed+12)*.15),px2=cx+w*.55,py2=yb-h*(.35+R(i+seed+13)*.15),mx=cx+w*.1;
   function rdx(y){return sx+(mx-sx)*((y-ty)/(yb-ty))}
   x.fillStyle=lit;x.beginPath();x.moveTo(cx-w,yb);x.lineTo(px1,py1);x.lineTo(sx,ty);x.lineTo(mx,yb);x.closePath();x.fill();
   x.fillStyle=shade;x.beginPath();x.moveTo(mx,yb);x.lineTo(sx,ty);x.lineTo(px2,py2);x.lineTo(cx+w,yb);x.closePath();x.fill();
   x.lineWidth=1;x.strokeStyle='rgba(255,255,255,.22)';x.beginPath();x.moveTo(sx,ty);x.lineTo(sx-(sx-px1)*.42,ty+(py1-ty)*.85);x.lineTo(sx-(sx-px1)*.5,yb);x.stroke();
   x.strokeStyle='rgba(20,30,50,.2)';x.beginPath();x.moveTo(sx,ty);x.lineTo(sx+(px2-sx)*.4,ty+(py2-ty)*.8);x.lineTo(sx+(px2-sx)*.34,yb);x.stroke();
   if(snow&&h>hMin+(hMax-hMin)*.25){
    var sd=h*.38,ys=ty+sd,t1=Math.min(1,sd/(py1-ty)),lx=sx+(px1-sx)*t1,ly=ty+(py1-ty)*t1,t2=Math.min(1,sd/(py2-ty)),rx=sx+(px2-sx)*t2,ry=ty+(py2-ty)*t2,rm=rdx(ys);
    x.fillStyle=snow;x.beginPath();x.moveTo(sx,ty);x.lineTo(lx,ly);x.lineTo(lx+(rm-lx)*.35,ly+8);x.lineTo(lx+(rm-lx)*.65,ly+2);x.lineTo(rdx(ys+3),ys+3);x.closePath();x.fill();
    x.fillStyle=snowSh;x.beginPath();x.moveTo(sx,ty);x.lineTo(rdx(ys+3),ys+3);x.lineTo(rm+(rx-rm)*.4,ry+6);x.lineTo(rm+(rx-rm)*.75,ry+1);x.lineTo(rx,ry);x.closePath();x.fill()}})}}
function fgKnorr(px,a,seed){
 var s=seed%2?1:-1,tr='#4a3b30',tr2='#2c221a',lf='#2f5a3a',lf2='#21452d';
 x.globalAlpha=a;
 x.fillStyle='rgba(0,0,0,.14)';x.beginPath();x.moveTo(px-12,H);x.lineTo(px-6,-10);x.lineTo(px+18,-10);x.lineTo(px+24,H);x.closePath();x.fill();
 x.fillStyle=tr;x.beginPath();x.moveTo(px-30,H);x.bezierCurveTo(px-16,H-40,px-34,H-90,px-14,H-130);x.bezierCurveTo(px-2,H-165,px-26,H-200,px-8,H-240);x.bezierCurveTo(px-2,H-280,px-10,H-320,px-4,-10);
 x.lineTo(px+14,-10);x.bezierCurveTo(px+10,H-320,px+18,H-280,px+12,H-240);x.bezierCurveTo(px+28,H-200,px+6,H-165,px+20,H-130);x.bezierCurveTo(px+38,H-90,px+16,H-40,px+34,H);x.closePath();x.fill();
 x.strokeStyle=tr2;x.lineWidth=1.6;[[-4,0],[6,5]].forEach(function(d){x.beginPath();x.moveTo(px+d[0]-6,H-6);x.bezierCurveTo(px+d[0]-8,H-90,px+d[0]+d[1]-6,H-170,px+d[0],H-300);x.stroke()});
 x.strokeStyle='rgba(255,255,255,.1)';x.lineWidth=1.6;x.beginPath();x.moveTo(px-2,H-8);x.bezierCurveTo(px-4,H-100,px+4,H-180,px-1,H-300);x.stroke();
 [[H-165,s*60,H-205],[H-240,-s*46,H-272]].forEach(function(b,i){
  var ex=px+b[1],ey=b[2];x.strokeStyle=tr;x.lineWidth=9-i*2;x.lineCap='round';x.beginPath();x.moveTo(px+4,b[0]);x.bezierCurveTo(px+b[1]*.3,b[0]-4,px+b[1]*.7,b[0]-28,ex,ey);x.stroke();
  x.fillStyle=i?lf2:lf;[[0,0,22,11],[-s*14*(i?-1:1),7,16,8],[s*16*(i?-1:1),-5,15,8]].forEach(function(c){x.beginPath();x.ellipse(ex+c[0],ey+c[1],c[2],c[3],-.15*s,0,6.3);x.fill()})});
 [lf2,lf].forEach(function(c,i){x.fillStyle=c;[[0,0,32,16],[s*28,6,26,13],[-s*22,10,22,11],[s*8,-12,24,12]].forEach(function(d){x.beginPath();x.ellipse(px+d[0]+s*10,52+d[1]-i*5,d[2],d[3],-.12*s,0,6.3);x.fill()})});
 x.lineCap='butt';x.globalAlpha=1}
function windLines(ts){
 for(var i=0;i<6;i++){var per=3.2+i*.9,p=(ts/1000/per+i*.37)%1;if(p>.2)continue;var u=p/.2,y=50+R(i+300)*190,x0=W+100-u*(W+320);
  x.strokeStyle='rgba(255,255,255,'+(.6*Math.sin(Math.PI*u))+')';x.lineWidth=1.3;x.lineCap='round';x.beginPath();x.moveTo(x0,y);x.quadraticCurveTo(x0+50,y-6,x0+110,y+2);x.stroke()}}
function drawRidge(ts){
 var o=D,top=FY-8,gr=x.createLinearGradient(0,0,0,H*.8);gr.addColorStop(0,'#38BDF8');gr.addColorStop(1,'#E0F2FE');x.fillStyle=gr;x.fillRect(0,0,W,H);
 x.fillStyle='rgba(255,255,255,.2)';x.beginPath();x.arc(560,70,44,0,6.3);x.fill();x.fillStyle='rgba(255,247,214,.9)';x.beginPath();x.arc(560,70,24,0,6.3);x.fill();
 cloud(md(150-o*.03,W+200)-100,56,1.0,.8);cloud(md(430-o*.02,W+200)-100,92,.8,.7);
 peaks(o,.025,196,96,128,5,0,'#a8bcd6','#8ca2c2','#ffffff','#d3e0ef');
 fogBand(ts,o,176,.22,.06);
 peaks(o,.06,230,58,86,7,40,'#8095b4','#657b9d','#f4f8fc','#c5d3e6');
 fogBand(ts,o,222,.3,.1);ruine(ts);
 peaks(o,.11,262,34,54,9,90,'#6c819f','#566b8c',null,null);
 var dg=x.createLinearGradient(0,250,0,H);dg.addColorStop(0,'rgba(150,170,198,0)');dg.addColorStop(.55,'rgba(176,194,216,.75)');dg.addColorStop(1,'rgba(214,228,242,.95)');x.fillStyle=dg;x.fillRect(0,250,W,H-250);
 hills(o*.2,306,6,3,1,4,7,.3,'rgba(110,132,162,.5)','rgba(255,255,255,.2)');
 fogBand(ts,o,290,.45,.18);fogBand(ts,o,322,.55,.25);
 var gaps=ridgeGaps(),prev=-12,segs=[];
 gaps.forEach(function(p){if(p[0]>prev)segs.push([prev,p[0]]);prev=Math.max(prev,p[1])});segs.push([prev,W+12]);
 segs.forEach(function(s){ridgeBlock(s[0],s[1],o)});
 function inGap(q){for(var j=0;j<gaps.length;j++)if(q>gaps[j][0]-10&&q<gaps[j][1]+10)return true;return false}
 for(var i=0;i<10;i++){var wx=i*135+R(i+200)*50,kd=i%4,s=1+R(i+210)*.3;
  [md(wx-o,LOOP),md(wx-o,LOOP)-LOOP].forEach(function(q){if(q<-20||q>W+20||inGap(q))return;
   if(kd===0){[[4,6,'#7c8aa0'],[10,4.5,'#94A3B8'],[15,3,'#64748B']].forEach(function(c){x.fillStyle=c[2];x.beginPath();x.ellipse(q,top-c[0]*s+2,c[1]*s,2.6*s,0,0,6.3);x.fill()})}
   else if(kd===1){x.strokeStyle='#3f7a38';x.lineWidth=1.3;x.beginPath();x.moveTo(q,top+1);x.lineTo(q,top-9*s);x.stroke();x.fillStyle='#1d4ed8';x.beginPath();x.ellipse(q,top-11*s,2.6*s,4*s,0,0,6.3);x.fill();x.fillStyle='#60a5fa';x.beginPath();x.ellipse(q-.8,top-12*s,.9,1.8*s,0,0,6.3);x.fill()}
   else if(kd===2){x.strokeStyle='#6b8f5e';x.lineWidth=1.2;x.beginPath();x.moveTo(q,top+1);x.lineTo(q,top-7*s);x.stroke();x.fillStyle='#F8FAFC';for(var a=0;a<6;a++){x.beginPath();x.ellipse(q+Math.cos(a*1.047)*3*s,top-8*s+Math.sin(a*1.047)*3*s,2.2*s,1.1*s,a*1.047,0,6.3);x.fill()}x.fillStyle='#f2c230';x.beginPath();x.arc(q,top-8*s,1.3,0,6.3);x.fill()}
   else{x.fillStyle='#7a5430';x.fillRect(q-1.5,top-22,3,23);x.fillStyle='#c9a26a';x.beginPath();x.moveTo(q-11,top-21);x.lineTo(q+8,top-21);x.lineTo(q+13,top-16);x.lineTo(q+8,top-11);x.lineTo(q-11,top-11);x.closePath();x.fill()}})}
 bonusSign(STAGE+420,'Gipfelgrat 2.150 m');bonusSign(zSignX('volm',STAGE+1500),'Volmarstein');(g.sch||[]).forEach(function(s){if(s.wx>=STAGE)warnSign(s.wx,s.k)});
 var cx=270+(TOTAL-g.run);
 if(cx<W+120){x.fillStyle=GK[0];x.beginPath();x.moveTo(cx-56,top+8);x.lineTo(cx-30,top-14);x.lineTo(cx-8,top-22);x.lineTo(cx+18,top-16);x.lineTo(cx+48,top+8);x.closePath();x.fill();
  x.fillStyle=GK[1];x.beginPath();x.moveTo(cx-30,top-14);x.lineTo(cx-8,top-22);x.lineTo(cx+2,top-14);x.lineTo(cx-18,top-8);x.closePath();x.fill();
  x.save();x.translate(cx,top-18);x.rotate(.07);x.fillStyle='#6b4423';x.fillRect(-3.5,-84,7,86);x.fillRect(-19,-68,38,6);x.fillStyle='#8a5a34';x.fillRect(-3.5,-84,2,86);x.fillRect(-19,-68,38,2);
  x.fillStyle='#c6372b';x.beginPath();x.moveTo(3.5,-84);x.lineTo(24,-79+Math.sin(ts/200)*1.5);x.lineTo(3.5,-73);x.closePath();x.fill();x.restore()}}
function bonusScene(ts){ASG.length=0;if(cur==='Kotten')drawKotten(ts);else if(cur==='Viadukt')drawViadukt(ts);else if(cur==='Tunnel')drawTunnel(ts);else if(cur==='Schmiede')drawSchmiede(ts);else if(cur==='Ufer')drawUfer(ts);else if(cur==='Staumauer')drawStaumauer(ts);else if(cur==='Sandstein')drawSandstein(ts);else if(cur==='Hardenstein')drawHardenstein(ts);else if(cur==='Höhle')drawCave(ts);else if(cur==='Moor')drawMoor(ts);else if(cur==='Küste')drawCoast(ts);else if(cur==='Altstadt')drawTown(ts);else if(cur==='Friedhof')drawGrave(ts);else drawRidge(ts)}
function bonusFront(ts){if(AFG[cur]){aFront(ts);return}if(cur==='Moor'){moorFront(ts);return}if(cur==='Küste'){coastFront(ts);return}if(cur==='Altstadt'){bonusFrontTown(ts);return}if(cur==='Friedhof'){bonusFrontGrave(ts);return}if(cur!=='Grat')return;
 var FL=1680,fo=D*1.7,mfg=(g.mode==='title'||g.mode==='intro')?0:Math.min(1,g.run/150);
 [0,560,1120].forEach(function(base,bi){var p=md(base+330-fo,FL),k0=Math.floor((base+330-fo)/FL);[[p,k0],[p-FL,k0-1]].forEach(function(pp){var q=pp[0];if(q>-90&&q<W+90){var a=(.3+.7*Math.min(1,Math.max(0,(Math.abs(q-150)-30)/110)))*mfg;if(a>.02)fgKnorr(q,a,bi+k0*3)}})});
 windLines(ts)}
/* ---------- Bonus 3 und 4: Moor und Küste (Zeichnungen, Hindernisse, Böen) ---------- */
function isBonusScene(){return cur==='Kotten'||cur==='Viadukt'||cur==='Tunnel'||cur==='Schmiede'||cur==='Ufer'||cur==='Staumauer'||cur==='Sandstein'||cur==='Hardenstein'||cur==='Höhle'||cur==='Grat'||cur==='Moor'||cur==='Küste'||cur==='Altstadt'||cur==='Friedhof'}
function lp(a,b,u){return a+(b-a)*u}
function cl(v,a,b){return v<a?a:v>b?b:v}
function ez(u){u=cl(u,0,1);return u*u*(3-2*u)}
function grad(y0,y1,c0,c1){var q=x.createLinearGradient(0,y0,0,y1);q.addColorStop(0,c0);q.addColorStop(1,c1);return q}
function poly(pts,c){x.fillStyle=c;x.beginPath();x.moveTo(pts[0],pts[1]);for(var i=2;i<pts.length;i+=2)x.lineTo(pts[i],pts[i+1]);x.closePath();x.fill()}
function ellc(cx,cy,rx,ry,c){x.fillStyle=c;x.beginPath();x.ellipse(cx,cy,rx,ry,0,0,6.3);x.fill()}
/* Böen an der Küste hängen an Streckenabschnitten (nicht an der Zeit), damit die Abstände der Hindernisse fair bleiben */
var KN={};
function moorObst(t,px,o){
 var tt=NOW/1000;
 if(t==='hedge'){hedgehog(px,FY+1,tt);return}
 if(t==='seal'){robbe(px,FY+1,tt,px<330?1:0);return}
 var by=FY-(92+5*Math.sin(NOW/400+px/70));
 x.fillStyle='rgba(0,0,0,.12)';x.beginPath();x.ellipse(px,FY+2,12,3,0,0,6.3);x.fill();
 birdK(px,by,t,tt)}
function drawMoor(ts){
 var m=D,tt=ts/1000,dy=FY-270,ty=270,i,j,k,r,w,q,b;
 x.fillStyle=grad(0,FY,'#2b3637','#8FA395');x.fillRect(0,0,W,H);moorClouds(m);
 x.save();x.translate(0,dy);
 var fo=m*.15;
 for(i=0;i<14;i++){var bx=md(i*90+R(i)*30-fo,1260)-60;if(bx>-20&&bx<W+20){if(i%3===0){x.strokeStyle='rgba(38,48,44,.55)';x.lineWidth=2.4;x.beginPath();x.moveTo(bx,226);x.lineTo(bx+2,150);x.stroke();x.lineWidth=1.2;for(k=0;k<4;k++){x.beginPath();x.moveTo(bx+1,214-k*13);x.lineTo(bx+(k%2?15:-15),198-k*13);x.stroke()}}else birchM(bx,232,68+R(i+2)*30,.35,1)}}
 x.fillStyle='rgba(168,186,176,.55)';x.fillRect(0,170,W,70);moorMush(m,242);x.fillStyle='rgba(150,172,162,.34)';x.fillRect(0,170,W,100);giantTrees(m);
 var mo2=m*.38;for(j=0;j<10;j++){var mxx=md(j*130+R(j+30)*40-mo2,1300)-70;if(mxx>-20&&mxx<W+20)birchM(mxx,246,110+R(j+5)*40,.6,0)}
 x.fillStyle='rgba(150,170,160,.35)';x.fillRect(0,200,W,60);
 x.fillStyle=grad(252,H+20,'#2C3E35','#1E2923');x.fillRect(0,252,W,H-252+30);
 for(w=0;w<22;w++){var wx=md(w*47-m*.6+R(w)*20,W+60)-30,wy=262+R(w+3)*60;x.fillStyle='rgba(143,163,149,.10)';x.fillRect(wx,wy,26+R(w+9)*30,1.6)}
 var ro=m*.6;for(r=0;r<30;r++){var rx=md(r*38+R(r+60)*20-ro,1200)-30;if(rx<-20||rx>W+20)continue;x.strokeStyle='#4a5a40';x.lineWidth=1.3;for(b=-2;b<=2;b++){x.beginPath();x.moveTo(rx,262);x.quadraticCurveTo(rx+b*3,246,rx+b*5,232-R(r+b+9)*10);x.stroke()}if(r%4===0){x.fillStyle='#f3f1ea';x.beginPath();x.arc(rx+3,238,2.2,0,6.3);x.arc(rx-3,241,1.8,0,6.3);x.fill()}}
 for(var iw=0;iw<5;iw++){var wxs=md(iw*210+60-m*.8,1050)-40,wys=215+Math.sin(tt*1.6+iw*2)*14-R(iw)*30;var gg=x.createRadialGradient(wxs,wys,0,wxs,wys,16);gg.addColorStop(0,'rgba(103,232,249,.85)');gg.addColorStop(1,'rgba(103,232,249,0)');x.fillStyle=gg;x.beginPath();x.arc(wxs,wys,16,0,6.3);x.fill();ellc(wxs,wys,2,2,'#e6fbff')}
 /* Bohlensteg mit Lücken (Lücken sind die Steglücken-Hindernisse) */
 var gaps=ridgeGaps(),run=g.run,i0=Math.floor(run/50)-1;x.save();if(gaps.length){x.beginPath();x.rect(-50,0,W+100,H+60);gaps.forEach(function(gp){x.rect(gp[0],0,gp[1]-gp[0],H+60)});x.clip('evenodd')}
 for(var pi=i0;pi<i0+16;pi++){if(pi<0)continue;var X=pi*50-run;
  var morsch=R(pi*7+3)<.14,sh=0,dd=0,al=1;
  if(morsch){var pass=150-(X+44);if(X<150&&pass<0){sh=Math.sin(tt*60+pi)*1.3;if(!KN[pi]&&g.mode==='play'){KN[pi]=1;sfx('knarz')}}else if(pass>0){dd=Math.min(16,pass*.12);al=Math.max(0,1-pass*.012)}}
  if(al<=0)continue;
  x.globalAlpha=al;x.fillStyle=morsch?'#4a3322':(pi%2?'#78553A':'#6a4a32');x.beginPath();x.roundRect(X+sh,ty+R(pi)*1.5+dd,44,8,1.5);x.fill();
  x.fillStyle='rgba(255,255,255,.07)';x.fillRect(X+1+sh,ty+R(pi)*1.5+dd,42,1.4);
  if(morsch){x.strokeStyle='#1b120a';x.lineWidth=1;x.beginPath();x.moveTo(X+9+sh,ty+1+dd);x.lineTo(X+14+sh,ty+6+dd);x.lineTo(X+11+sh,ty+8+dd);x.moveTo(X+30+sh,ty+1+dd);x.lineTo(X+27+sh,ty+5+dd);x.stroke();x.fillStyle='#35402a';x.fillRect(X+3+sh,ty+1+dd,10,2)}
  else{x.fillStyle='#4D7C0F';[[6,1.5,5],[24,2,7],[36,1,4]].forEach(function(mm2){x.beginPath();x.ellipse(X+mm2[0]+4,ty+1,mm2[2],1.6,0,3.14,6.28);x.fill()})}
  x.globalAlpha=1}
 x.fillStyle='rgba(0,0,0,.25)';x.fillRect(0,ty+8,W,3);
 for(q=i0;q<i0+16;q++){if(q<0||q%4)continue;var qx=q*50-run+20,okp=true;for(j=0;j<gaps.length;j++)if(qx+5>gaps[j][0]&&qx<gaps[j][1])okp=false;if(okp){x.fillStyle='#3d2b1c';x.fillRect(qx,ty+2,5,26)}}
 x.restore();var sgx=zSignX('wz',1500)-run;if(sgx>-60&&sgx<W+60)signB(sgx,ty,'Wupperzonas','Bohlensteg','#8a6a40','#f6ecd2');
 sgx=zSignX('wup',2500)-run;if(sgx>-60&&sgx<W+60)signB(sgx,ty,'Über die','Wupper','#8a6a40','#f6ecd2');
 x.restore()}
function moorFront(ts){
 var m=D,tt=ts/1000,mfg=(g.mode==='title'||g.mode==='intro')?0:Math.min(1,g.run/150);
 if(mfg>0){x.save();x.globalAlpha=mfg;deadTrees(m);x.restore()}
 for(var fg=0;fg<4;fg++){var fx0=md(fg*230-m*1.25-tt*14,W+420)-210;var fgr=x.createRadialGradient(fx0,FY+2,5,fx0,FY+2,170);fgr.addColorStop(0,'rgba(226,232,240,.30)');fgr.addColorStop(1,'rgba(226,232,240,0)');x.fillStyle=fgr;x.save();x.translate(0,FY+2);x.scale(1,.2);x.translate(0,-(FY+2));x.beginPath();x.arc(fx0,FY+2,170,0,6.3);x.fill();x.restore()}
 var fo2=m*1.3;for(var fr=0;fr<12;fr++){var frx=md(fr*70+R(fr+80)*30-fo2,900)-30;if(frx<-20||frx>W+20)continue;x.strokeStyle='#26331f';x.lineWidth=1.6;for(var bb=-2;bb<=2;bb++){x.beginPath();x.moveTo(frx,H);x.quadraticCurveTo(frx+bb*3,H-26,frx+bb*6,H-38-R(fr+bb+4)*10);x.stroke()}}}
function drawCoast(ts){
 var tt=ts/1000,gf=0,cs=D,run=g.run,ty=240,dy=FY-241,c,wv,k,q,b;
 x.fillStyle=grad(0,160+dy,'#2c3747','#64748B');x.fillRect(0,0,W,H);
 for(c=0;c<9;c++){var cx=md(c*110+R(c)*40-tt*(16+gf*28)-cs*.06,W+260)-100,cy=24+R(c+7)*70;ellc(cx,cy,80+R(c+2)*40,18+R(c+3)*10,'rgba(37,48,64,.62)');ellc(cx+30,cy+10,60,14,'rgba(51,65,85,.7)')}
 x.save();x.translate(0,dy);
 poly([0,134,60,140,140,137,214,150,214,160,0,160],'#2a3340');
 var lx=100,ly=138;poly([lx-6,ly,lx-3.5,ly-44,lx+3.5,ly-44,lx+6,ly],'#e9e4da');x.fillStyle='#b53a30';x.fillRect(lx-5,ly-30,10,7);x.fillRect(lx-4,ly-15,8,6);x.fillStyle='#2b2f38';x.fillRect(lx-5,ly-50,10,6);poly([lx-6,ly-50,lx,ly-58,lx+6,ly-50],'#7a2a24');
 var th=tt*1.5,cb=Math.cos(th),bl=Math.abs(cb)*240,dir=cb>0?1:-1,bg=x.createLinearGradient(lx,0,lx+dir*bl,0);bg.addColorStop(0,'rgba(255,240,170,.55)');bg.addColorStop(1,'rgba(255,240,170,0)');x.fillStyle=bg;x.beginPath();x.moveTo(lx,ly-47);x.lineTo(lx+dir*bl,ly-47-bl*.06-3);x.lineTo(lx+dir*bl,ly-47+bl*.06+3);x.closePath();x.fill();ellc(lx,ly-47,2.6,2.6,'#fff6c0');
 seaBig(tt,gf,cs);
 for(wv=0;wv<7;wv++){var wxp=wv*110-md(tt*30,110),ph=tt*1.3+wv*.9,sp=(Math.sin(ph)+1)/2;x.fillStyle='rgba(30,58,95,.9)';x.beginPath();x.ellipse(wxp+55,312,70,16+sp*6,0,0,6.3);x.fill();x.fillStyle='rgba(241,245,249,'+(.55+sp*.3)+')';x.beginPath();x.ellipse(wxp+55,305-sp*5,52,5+sp*3,0,0,6.3);x.fill();
  if(sp>.8){for(var gp=0;gp<6;gp++){var gu=(sp-.8)*5,gx=wxp+30+gp*10+gu*(-14),gy2=300-gu*(26+gp*3);ellc(gx,gy2,2.4,2.4,'rgba(241,245,249,'+(.8-gu*.5)+')')}}}
 x.fillStyle=grad(300,H+dy+10,'rgba(30,58,95,0)','#1E3A5F');x.fillRect(0,300,W,H-300+60);
 x.beginPath();x.moveTo(0,ty+10);for(q=0;q<=W;q+=20)x.lineTo(q,ty+22+R(q/20+7)*18+(q%80===0?10:0));x.lineTo(W,H+dy+20);x.lineTo(0,H+dy+20);x.closePath();x.fillStyle='#3a4552';x.fill();
 x.fillStyle='rgba(15,23,32,.35)';for(k=0;k<9;k++){x.fillRect(md(k*83-run*.9,W+60)-30,ty+14,2,48+R(k)*20)}
 x.fillStyle='#475569';x.fillRect(0,ty,W,12);x.fillStyle='#3F4E3C';x.fillRect(0,ty+2,W,14);x.fillStyle='#55657a';x.fillRect(0,ty,W,3);
 for(var pb=0;pb<30;pb++){var pp=md(pb*29-run,W+40)-20;ellc(pp,ty+7+R(pb)*5,3+R(pb+1)*3,1.4,'rgba(20,30,40,.22)')}
 var lean=-(7+gf*9+Math.sin(tt*3)*1.5);
 for(var gr2=0;gr2<40;gr2++){var gx0=md(gr2*26-run+R(gr2)*10,W+60)-30;x.strokeStyle=gr2%2?'#3a5a38':'#4a6a42';x.lineWidth=1.3;x.lineCap='round';for(b=-1;b<=1;b++){x.beginPath();x.moveTo(gx0+b*2,ty+1);x.quadraticCurveTo(gx0+b*2+lean*.4,ty-7,gx0+b*2+lean,ty-11-R(gr2+b)*5);x.stroke()}}
 var sgx=STAGE+420-run;if(sgx>-60&&sgx<W+60)signB(sgx,ty,'Steilküste','Sturmwarnung','#EAB308','#2a2208');
 strikeSign(zSignX('enne',STAGE+1500),'Ennepetalsperre');
 for(k=0;;k++){var lw=STAGE+800+k*1700;if(lw>TOTAL-500)break;var rx=lw-run;if(rx>-30&&rx<W+30)lifering(rx,ty+2)}
 (g.sch||[]).forEach(function(s){if(s.wx>=STAGE)warnSign(s.wx,s.k)});
 var bX=TOTAL+300-run;if(bX<W+300)bude(bX,ty+2);
 x.restore()}
function coastFront(ts){
 var tt=ts/1000,gf=0,cs=D,i;
 /* schräger Regen */
 var rf=1-cl((g.run-(TOTAL-420))/160,0,.8);
 x.strokeStyle='rgba(226,232,240,'+((.35+gf*.15)*rf)+')';x.lineWidth=1;x.beginPath();
 for(i=0;i<70;i++){var l=.6+R(i+3)*.8,px=md(R(i)*(W+80)-ts*.16*l-cs*.9,W+60)-30,py=md(R(i+50)*H+ts*.42*l,H+40)-20,dx=-lp(7,14,gf)*l,dy2=lp(10,13,gf)*l;x.moveTo(px,py);x.lineTo(px+dx,py+dy2)}
 x.stroke();
 var mfg=(g.mode==='title'||g.mode==='intro')?0:Math.min(1,g.run/150),FLG=2300,fq=md(820-cs*1.7,FLG)-220;
 if(mfg>0&&fq>-130&&fq<W+60)fahneFg(fq,(.12+.88*cl((Math.abs(fq-150)-50)/170,0,1))*mfg,tt)}
/* Fahne im Vordergrund, weht nach links (Wind kommt von rechts) */
function fahneFg(px,a,tt){
 x.save();x.globalAlpha=a;
 x.fillStyle='#2b2f38';x.fillRect(px-2.5,68,5,H);ellc(px,66,4.2,4.2,'#c9a24a');
 var top=78,len=88,hh=46,N=14;
 function kante(u,f){return[px-2.5-u*len,top+hh*f*(1-u*.9)+Math.sin(tt*5.5-u*6+px*.02+f)*(2+u*9)+u*3]}
 function band(f0,f1,c){x.beginPath();var i,p;for(i=0;i<=N;i++){p=kante(i/N,f0);if(i===0)x.moveTo(p[0],p[1]);else x.lineTo(p[0],p[1])}for(i=N;i>=0;i--){p=kante(i/N,f1);x.lineTo(p[0],p[1])}x.closePath();x.fillStyle=c;x.fill()}
 band(0,1,'#c0392b');band(.36,.64,'#f4f4f0');band(0,.08,'rgba(0,0,0,.12)');band(.92,1,'rgba(0,0,0,.18)');
 x.restore()}

function signB(px,gy,l1,l2,col,txt){
 x.fillStyle='#4a3524';x.fillRect(px-2,gy-44,4,44);
 x.save();x.translate(px,gy-48);x.rotate(-.03);
 x.fillStyle=col;x.beginPath();x.roundRect(-46,-14,92,30,3);x.fill();x.strokeStyle='rgba(0,0,0,.35)';x.lineWidth=1;x.stroke();
 x.fillStyle=txt;x.font='bold 10px system-ui,sans-serif';x.textAlign='center';x.fillText(l1,0,-1);x.font='9px system-ui,sans-serif';x.fillText(l2,0,11);x.textAlign='left';x.restore()}
var HFP=new Path2D('M165 285 C150 325 138 362 150 380 C176 394 236 394 252 380 C258 358 236 332 232 290 Z');
var HBP=new Path2D('M352 300 C346 340 360 374 370 382 C394 394 432 390 437 374 C440 350 422 328 412 300 Z');
function hedgehog(px,gy,t){ /* Igel nach Bjoerns Vorlage: dicke schwarze Kontur, gelbes Gesicht, braunes Stachelkleid mit Punkten, rote Nase */
 var ph=t*22+px*.04,bob=Math.abs(Math.sin(ph))*6,K='#0b0b0b',Y='#FFC933',YD='#D9A21C',BR='#5a1d00';
 x.save();x.translate(px,gy);x.scale(.105,.105);x.translate(-250,-385);
 x.lineJoin='round';x.lineCap='round';x.lineWidth=10;x.strokeStyle=K;
 x.fillStyle='rgba(0,0,0,.22)';x.beginPath();x.ellipse(250,389,215,17,0,0,6.3);x.fill();
 function paw(P,dx,col,toes,ph2){var s=Math.sin(ph+ph2),lift=Math.max(0,-Math.cos(ph+ph2))*30;x.save();x.translate(dx+s*36,-lift);x.fillStyle=col;x.fill(P);x.stroke(P);
  x.lineWidth=6;x.beginPath();toes.forEach(function(o){x.moveTo(o[0],o[1]);x.lineTo(o[0]+2,o[1]-16)});x.stroke();x.lineWidth=10;x.restore()}
 /* ferne Beine (dunkler) */
 paw(HFP,48,YD,[[200,384],[226,386]],Math.PI);paw(HBP,-36,YD,[[385,384],[411,384]],0);
 x.save();x.translate(0,-bob);
 /* Stachelkleid */
 function bodyPath(){x.beginPath();var N=21,da=Math.PI*1.12/N,a0=Math.PI*1.1;
  function pt(a,r){return[265+Math.cos(a)*(225+r),185+Math.sin(a)*(150+r*.9)]}
  var b=pt(a0,-8);x.moveTo(b[0],b[1]);
  for(var i=0;i<N;i++){var am=a0+(i+.5)*da,an=a0+(i+1)*da,wob=Math.sin(t*9+i*.9)*3,tp=pt(am,34+R(i+3)*26+wob),bs=pt(an,-8);x.lineTo(tp[0],tp[1]);x.lineTo(bs[0],bs[1])}
  x.lineTo(405,318);x.quadraticCurveTo(300,352,225,318);x.lineTo(170,235);x.lineTo(100,175);x.closePath()}
 bodyPath();x.fillStyle=BR;x.fill();
 x.save();bodyPath();x.clip();x.fillStyle=K;x.beginPath();
 for(var gy2=90,row=0;gy2<350;gy2+=15,row++)for(var gx=30+(row%2)*7.5;gx<500;gx+=15){x.moveTo(gx+3.4,gy2);x.arc(gx,gy2,3.4,0,6.3)}x.fill();x.restore();
 bodyPath();x.stroke();
 x.lineWidth=6;[[[205,118],[222,100],[214,130],[240,140]],[[310,92],[328,84],[322,108],[350,100]],[[225,176],[248,162],[240,184],[266,176]]].forEach(function(z){x.beginPath();x.moveTo(z[0][0],z[0][1]);for(var i=1;i<z.length;i++)x.lineTo(z[i][0],z[i][1]);x.stroke()});x.lineWidth=10;
 x.restore();
 /* vordere und hintere Beine */
 paw(HBP,0,Y,[[385,384],[411,384]],Math.PI);paw(HFP,0,Y,[[190,384],[216,386]],0);
 x.save();x.translate(0,-bob*.6);
 /* Ohr, Kopf, Nase, Auge, Laecheln */
 x.fillStyle=Y;x.beginPath();x.ellipse(160,160,12,17,.25,0,6.3);x.fill();x.stroke();
 x.beginPath();x.moveTo(198,170);x.bezierCurveTo(168,148,128,152,112,178);x.bezierCurveTo(95,198,60,208,42,222);x.bezierCurveTo(44,246,72,266,110,274);x.bezierCurveTo(150,286,178,302,200,312);x.lineTo(222,300);x.lineTo(212,215);x.closePath();x.fillStyle=Y;x.fill();x.stroke();
 var nw=Math.sin(t*9+px)*2;
 x.fillStyle='#B01C2E';x.beginPath();x.arc(32,207+nw,19,0,6.3);x.fill();x.stroke();x.fillStyle='rgba(255,255,255,.75)';x.beginPath();x.ellipse(26,199+nw,6,4,-.6,0,6.3);x.fill();
 x.fillStyle='#fff';x.beginPath();x.ellipse(133,200,19,25,.05,0,6.3);x.fill();x.lineWidth=8;x.stroke();x.lineWidth=10;
 x.fillStyle=K;x.beginPath();x.ellipse(128,206,9,13,0,0,6.3);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(125,201,3,0,6.3);x.fill();
 x.lineWidth=6;x.beginPath();x.moveTo(82,251);x.quadraticCurveTo(118,282,156,262);x.stroke();x.lineWidth=10;
 x.restore();x.restore()}
function robbe(px,gy,t,near){ /* liegende Robbe, schaut nach links, atmet, oeffnet ein Auge wenn Mo naht */
 var br=Math.sin(t*1.8)*.025;
 x.save();x.translate(px,gy);x.scale(1.2,1.2);
 ellc(0,2,56,5,'rgba(0,0,0,.28)');
 x.scale(1,1+br);
 /* Schwanzflossen */
 x.fillStyle='#6a7686';x.beginPath();x.moveTo(40,-8);x.quadraticCurveTo(58,-12,64,-20);x.quadraticCurveTo(66,-12,62,-6);x.quadraticCurveTo(68,-4,70,2);x.quadraticCurveTo(56,2,42,0);x.closePath();x.fill();
 /* Koerper */
 var bg=x.createLinearGradient(0,-30,0,2);bg.addColorStop(0,'#8e99a8');bg.addColorStop(1,'#5f6b7a');x.fillStyle=bg;
 x.beginPath();x.moveTo(-40,0);x.bezierCurveTo(-46,-16,-34,-30,-18,-31);x.bezierCurveTo(4,-34,32,-24,46,-8);x.quadraticCurveTo(48,0,40,2);x.lineTo(-36,2);x.closePath();x.fill();
 /* Bauch */
 x.fillStyle='#cfd5dc';x.beginPath();x.moveTo(-36,2);x.bezierCurveTo(-30,-6,0,-8,30,-2);x.quadraticCurveTo(38,0,40,2);x.closePath();x.fill();
 /* Flecken */
 x.fillStyle='rgba(40,50,64,.45)';[[-6,-22,5,3],[10,-20,4,2.4],[22,-14,4.5,2.6],[-18,-14,3.4,2.2],[2,-12,3,2]].forEach(function(s){x.beginPath();x.ellipse(s[0],s[1],s[2],s[3],-.3,0,6.3);x.fill()});
 /* Glanz */
 x.strokeStyle='rgba(255,255,255,.45)';x.lineWidth=1.6;x.lineCap='round';x.beginPath();x.moveTo(-24,-26);x.quadraticCurveTo(-4,-31,18,-27);x.stroke();
 /* Vorderflosse */
 x.fillStyle='#55616f';x.beginPath();x.moveTo(-24,-8);x.quadraticCurveTo(-18,-2,-8,2);x.lineTo(-26,2);x.quadraticCurveTo(-30,-3,-24,-8);x.closePath();x.fill();
 /* Kopf */
 x.fillStyle='#7f8b9b';x.beginPath();x.ellipse(-36,-24,12,10.5,-.15,0,6.3);x.fill();
 x.fillStyle='#a3adba';x.beginPath();x.ellipse(-43,-20,8,5.4,.1,0,6.3);x.fill();
 ellc(-49.5,-21.5,2.4,1.8,'#14181e');
 /* Schnurrhaare */
 x.strokeStyle='rgba(235,240,245,.85)';x.lineWidth=.8;[[-1.5],[1],[3.5]].forEach(function(w){x.beginPath();x.moveTo(-45,-19+w[0]);x.lineTo(-57,-22+w[0]*2.2);x.stroke()});
 /* Auge: geschlossen, oeffnet sich kurz */
 var op=cl(near,0,1);x.strokeStyle='#1a1f27';x.lineWidth=1.3;
 if(op>.3){ellc(-38,-27,2.3,2.3,'#14181e');ellc(-38.6,-27.6,.7,.7,'#fff')}
 else{x.beginPath();x.moveTo(-41,-27);x.quadraticCurveTo(-38,-24.5,-35,-27);x.stroke()}
 /* Zzz */
 var zt=(t*.7)%1;x.font='bold 9px system-ui,sans-serif';x.fillStyle='rgba(225,232,240,'+(.9*(1-zt))+')';x.fillText('z',-36+zt*8,-40-zt*16);
 x.restore()}
function birdK(px,py,kind,t,k){ /* Krähe oder Möwe, fliegt nach links */
 var cr=kind==='crow',fl=Math.sin(t*(cr?9:7)+px*.05);
 x.save();x.translate(px,py);
 var body=cr?'#1d2420':'#f1f5f9',wing=cr?'#10161a':'#dfe6ee',tip=cr?'#0a0e10':'#6a7686';
 ellc(0,16,9,2,'rgba(0,0,0,0)');
 /* hinterer Fluegel */
 x.fillStyle=cr?'#161c1f':'#c9d2dc';x.beginPath();x.moveTo(2,-1);x.quadraticCurveTo(10,-9-fl*8,20,-10-fl*12);x.quadraticCurveTo(12,-3-fl*3,8,1);x.closePath();x.fill();
 /* Koerper */
 x.fillStyle=body;x.beginPath();x.ellipse(1,1,11,4.4,-.08,0,6.3);x.fill();
 x.beginPath();x.moveTo(9,0);x.lineTo(19,2+fl*1.5);x.lineTo(10,4);x.closePath();x.fill();
 /* Kopf */
 x.beginPath();x.ellipse(-10,-1.5,4.6,3.8,0,0,6.3);x.fill();
 x.fillStyle=cr?'#2b2f33':'#EAB308';x.beginPath();x.moveTo(-14,-2);x.lineTo(-22,-.5);x.lineTo(-14,.5);x.closePath();x.fill();
 if(!cr){ellc(-19.5,-.4,.9,.9,'#d33')}
 ellc(-11.2,-2.4,1,1,cr?'#d7d3b6':'#111');
 /* vorderer Fluegel */
 x.fillStyle=wing;x.beginPath();x.moveTo(-2,0);x.quadraticCurveTo(-6,-10-fl*9,-18,-13-fl*15);x.quadraticCurveTo(-12,-4-fl*4,-5,2);x.closePath();x.fill();
 x.fillStyle=tip;x.beginPath();x.moveTo(-14,-11-fl*12);x.quadraticCurveTo(-18,-13-fl*15,-22,-14-fl*16);x.quadraticCurveTo(-17,-9-fl*10,-14,-11-fl*12);x.fill();
 x.restore()}
function drawItem2(k,X){x.save();x.translate(X,FY);
 if(k==='stiefel'){
  x.fillStyle='#2f7a45';x.beginPath();x.moveTo(-6,-26);x.lineTo(4,-26);x.lineTo(5,-9);x.quadraticCurveTo(14,-8,15,-3);x.lineTo(15,0);x.lineTo(-7,0);x.closePath();x.fill();
  x.fillStyle='#56a868';x.fillRect(-6.4,-27,11,3.4);x.fillStyle='#1f2a20';x.fillRect(-7,-2.6,22.6,2.8);
  x.fillStyle='rgba(255,255,255,.3)';x.fillRect(-3,-22,1.8,13);x.strokeStyle='#245c35';x.lineWidth=.8;x.beginPath();x.moveTo(-6,-14);x.lineTo(4.4,-14);x.stroke();
  x.fillStyle='rgba(110,170,200,.8)';ellc(10,-10,1.2,1.7,'rgba(140,200,230,.85)')}
 else if(k==='korb'){
  x.strokeStyle='#7a5430';x.lineWidth=2;x.beginPath();x.arc(0,-12,9,Math.PI*1.05,Math.PI*1.95);x.stroke();
  x.fillStyle='#b47a3e';x.beginPath();x.moveTo(-12,-12);x.lineTo(12,-12);x.lineTo(9,0);x.lineTo(-9,0);x.closePath();x.fill();
  x.strokeStyle='#8a5a2c';x.lineWidth=1;for(var i=-3;i<=3;i++){x.beginPath();x.moveTo(i*3.4,-12);x.lineTo(i*2.6,0);x.stroke()}x.beginPath();x.moveTo(-10.6,-6);x.lineTo(10.6,-6);x.stroke();
  x.fillStyle='#c98f4e';x.beginPath();x.ellipse(0,-12,12,2.6,0,0,6.3);x.fill();
  [[-7,-14.5],[-2,-16],[3,-14.8],[7.4,-15.4],[-4.6,-13.2],[1.2,-13.2]].forEach(function(b){ellc(b[0],b[1],2.9,2.9,'#E11D48');ellc(b[0]-.8,b[1]-.9,.8,.8,'rgba(255,255,255,.7)')});
  x.fillStyle='#4D7C0F';x.beginPath();x.ellipse(-9,-14,3.4,1.5,-.5,0,6.3);x.ellipse(9.4,-14,3.4,1.5,.5,0,6.3);x.fill()}
 else if(k==='muschel'){
  var mg=x.createLinearGradient(-9,-18,9,0);mg.addColorStop(0,'#f6e3d2');mg.addColorStop(1,'#e8a9a0');x.fillStyle=mg;
  x.beginPath();x.moveTo(0,0);x.bezierCurveTo(-12,-5,-12,-16,-8,-17);x.quadraticCurveTo(0,-21,8,-17);x.bezierCurveTo(12,-16,12,-5,0,0);x.fill();
  x.strokeStyle='rgba(150,80,70,.55)';x.lineWidth=.9;for(var r=-4;r<=4;r++){x.beginPath();x.moveTo(0,-1);x.quadraticCurveTo(r*2.6,-9,r*2.4,-17.6);x.stroke()}
  x.fillStyle='#d9a98f';x.fillRect(-3.4,-1,6.8,2.6)}
 else if(k==='karte'){x.save();x.rotate(-.06);x.fillStyle='#efe3c2';x.beginPath();x.moveTo(-14,-2);x.lineTo(-12,-18);x.lineTo(2,-16);x.lineTo(14,-19);x.lineTo(13,-3);x.lineTo(1,-1);x.closePath();x.fill();x.strokeStyle='rgba(120,90,50,.5)';x.lineWidth=.8;x.beginPath();x.moveTo(-1,-17);x.lineTo(1,-1);x.moveTo(-12,-10);x.lineTo(14,-11);x.stroke();x.strokeStyle='#c0392b';x.setLineDash([2,2]);x.beginPath();x.moveTo(-10,-5);x.quadraticCurveTo(-3,-15,6,-8);x.lineTo(11,-14);x.stroke();x.setLineDash([]);x.strokeStyle='#4a90c8';x.lineWidth=1.4;x.beginPath();x.moveTo(-12,-14);x.quadraticCurveTo(-2,-10,12,-6);x.stroke();x.restore()}
x.restore()}
function drawItem3(k,X){x.save();x.translate(X,FY);
 if(k==='flasche'){
  x.fillStyle='#7a4a1c';x.beginPath();x.moveTo(-5.5,0);x.lineTo(-5.5,-17);x.quadraticCurveTo(-5.5,-21,-2,-23);x.lineTo(-2,-30);x.lineTo(2,-30);x.lineTo(2,-23);x.quadraticCurveTo(5.5,-21,5.5,-17);x.lineTo(5.5,0);x.closePath();x.fill();
  x.fillStyle='#d9b34a';x.fillRect(-2.6,-32,5.2,3);x.fillStyle='#f1e3b8';x.fillRect(-5.5,-14,11,8);x.fillStyle='#a0481a';x.fillRect(-5.5,-11.5,11,2);
  x.fillStyle='rgba(255,255,255,.35)';x.fillRect(-4,-20,1.6,5)}
 else if(k==='pet'){
  x.fillStyle='rgba(170,215,235,.8)';x.beginPath();x.moveTo(-6,0);x.lineTo(-6,-18);x.quadraticCurveTo(-6,-22,-2.5,-25);x.lineTo(-2.5,-30);x.lineTo(2.5,-30);x.lineTo(2.5,-25);x.quadraticCurveTo(6,-22,6,-18);x.lineTo(6,0);x.closePath();x.fill();
  x.strokeStyle='rgba(60,120,160,.55)';x.lineWidth=1;x.beginPath();x.moveTo(-6,-4);x.lineTo(6,-4);x.moveTo(-6,-16);x.lineTo(6,-16);x.stroke();
  x.fillStyle='#2f9e44';x.fillRect(-3,-33,6,4);x.fillStyle='#e8f3f8';x.fillRect(-6,-13,12,7);x.fillStyle='#2b5aa5';x.fillRect(-6,-10.5,12,2);
  x.fillStyle='rgba(255,255,255,.5)';x.fillRect(-4.6,-20,1.6,6)}
 else if(k==='droeppel'){droeppelDraw(0,0,.95,NOW)}
 else if(k==='waffel'){waffelDraw(0,0,1.1)}
 else if(k==='kerze'){redCandle(0,0,NOW/1000,X*.05,.9)}
 else if(k==='laterne'){
  x.strokeStyle='#2a2a30';x.lineWidth=1.6;x.beginPath();x.arc(0,-20,6,Math.PI,0);x.stroke();
  x.fillStyle='#2a2a30';x.fillRect(-7,-20,14,3);x.fillRect(-7,-4,14,4);
  x.fillStyle='rgba(255,176,60,.9)';x.fillRect(-5.5,-17,11,13);ellc(0,-11,3,4.4,'#fff0b0');
  var lg=x.createRadialGradient(0,-11,1,0,-11,22);lg.addColorStop(0,'rgba(255,190,80,.35)');lg.addColorStop(1,'rgba(255,190,80,0)');x.fillStyle=lg;x.beginPath();x.arc(0,-11,22,0,6.3);x.fill()}
 else if(k==='kuerbis'){
  ellc(-5,-7,7,7,'#d9681a');ellc(5,-7,7,7,'#d9681a');ellc(0,-8,7.4,8,'#e87a22');
  x.fillStyle='#4a6a2a';x.fillRect(-1.2,-18,2.6,4);
  x.fillStyle='#ffd070';poly([-5,-10,-2,-10,-3.5,-7],'#ffd070');poly([2,-10,5,-10,3.5,-7],'#ffd070');x.beginPath();x.moveTo(-4,-4);x.lineTo(-2,-2.6);x.lineTo(0,-4);x.lineTo(2,-2.6);x.lineTo(4,-4);x.lineTo(2,-5.4);x.lineTo(0,-4.2);x.lineTo(-2,-5.4);x.closePath();x.fill()}
x.restore()}
function limb(x0,y0,ang,len,w0,w1,seed,moss,depth){
 var n=12,px=x0,py=y0,a=ang,seg=len/n,pts=[[px,py]],i;
 for(i=0;i<n;i++){a+=(R(seed+i*3.1)-.5)*.8;px+=Math.cos(a)*seg;py+=Math.sin(a)*seg;pts.push([px,py])}
 x.lineCap='round';
 for(i=0;i<n;i++){x.lineWidth=lp(w0,w1,i/n);x.beginPath();x.moveTo(pts[i][0],pts[i][1]);x.lineTo(pts[i+1][0],pts[i+1][1]);x.stroke()}
 if(moss){x.save();x.strokeStyle='#4D7C0F';x.globalAlpha=.85;
  for(var j=1;j<n;j+=2){var ww=lp(w0,w1,j/n);x.lineWidth=ww*.45;x.beginPath();x.moveTo(pts[j][0],pts[j][1]-ww*.28);x.lineTo(pts[j+1][0],pts[j+1][1]-ww*.28);x.stroke()}
  x.strokeStyle='rgba(120,150,84,.7)';x.lineWidth=1.5;x.globalAlpha=1;
  for(var k=2;k<n;k+=2){var hx=pts[k][0],hy=pts[k][1]+lp(w0,w1,k/n)*.4,hl=12+R(seed+k)*28+Math.sin((NOW/1000)*1.2+k)*2;x.beginPath();x.moveTo(hx,hy);x.quadraticCurveTo(hx+3,hy+hl*.5,hx+Math.sin((NOW/1000)*.9+k)*3,hy+hl);x.stroke()}
  x.restore()}
 if(depth>0){for(var s=3;s<n-1;s+=3){limb(pts[s][0],pts[s][1],a+(s%2?-.95:.95),len*.45,lp(w0,w1,s/n)*.6,1.4,seed+s*7,moss,depth-1)}}}
function moorClouds(m){
 var t=(NOW/1000);
 for(var i=0;i<9;i++){var cx=md(i*120+R(i+300)*50-t*6-m*.04,W+300)-120,cy=8+R(i+310)*50,rx=90+R(i+320)*60,ry=20+R(i+330)*14;
  ellc(cx,cy,rx,ry,'rgba(18,26,26,.8)');ellc(cx+rx*.4,cy+9,rx*.7,ry*.8,'rgba(32,42,42,.72)');ellc(cx-rx*.3,cy+16,rx*.6,ry*.6,'rgba(54,66,64,.5)')}}
function giantTree(px,seed,flip){ /* knorriger, dicker Baum mit Moos, Fuss bei y=284 */
 x.save();x.translate(px,0);if(flip)x.scale(-1,1);
 var g=x.createLinearGradient(-90,0,100,0);g.addColorStop(0,'#121815');g.addColorStop(.45,'#2b362f');g.addColorStop(1,'#0f1411');x.fillStyle=g;
 x.beginPath();x.moveTo(-136,290);x.bezierCurveTo(-98,280,-82,262,-76,236);x.bezierCurveTo(-54,170,-72,100,-58,40);x.bezierCurveTo(-54,10,-62,-10,-52,-34);
 x.lineTo(56,-34);x.bezierCurveTo(72,10,60,60,68,120);x.bezierCurveTo(76,190,94,230,94,248);x.bezierCurveTo(102,268,128,280,154,290);x.closePath();x.fill();
 /* Rindenfurchen */
 x.strokeStyle='rgba(0,0,0,.5)';x.lineWidth=2;for(var i=0;i<9;i++){var bx=-50+i*13+R(seed+i)*6;x.beginPath();x.moveTo(bx,-20);x.bezierCurveTo(bx+8,60,bx-8,140,bx+4,280);x.stroke()}
 x.strokeStyle='rgba(130,150,125,.13)';x.lineWidth=1.4;for(var j=0;j<6;j++){var c2=-40+j*16+R(seed+j+20)*8;x.beginPath();x.moveTo(c2,-10);x.bezierCurveTo(c2+6,70,c2-6,150,c2+3,270);x.stroke()}
 /* Astloch mit Rand */
 ellc(-6,132,13,22,'#040605');ellc(-6,128,9,15,'#0b100e');x.strokeStyle='rgba(120,140,110,.3)';x.lineWidth=2;x.beginPath();x.ellipse(-6,132,14,23,0,0,6.3);x.stroke();
 /* grosse Aeste ueber das Bild */
 x.strokeStyle='#131916';
 limb(-54,44,Math.PI*1.04,250,24,3,seed+1,true,2);
 limb(58,16,-.12,260,22,3,seed+2,true,2);
 limb(-58,168,Math.PI*.98,170,14,3,seed+3,true,1);
 /* Moos am Stamm und an den Wurzeln */
 [[-72,258,32,15],[-30,274,26,10],[74,250,30,14],[104,278,28,10],[-64,204,9,28],[62,150,8,24],[-60,92,8,22],[0,284,30,8]].forEach(function(mo){ellc(mo[0],mo[1],mo[2],mo[3],'#3f6b10');ellc(mo[0]-mo[2]*.12,mo[1]-mo[3]*.25,mo[2]*.75,mo[3]*.55,'#5f9a1c')});
 for(var h=0;h<6;h++){var hx=-70+h*26+R(seed+h+50)*8;x.strokeStyle='rgba(120,160,80,.55)';x.lineWidth=1.4;x.beginPath();x.moveTo(hx,262);x.quadraticCurveTo(hx+3,272,hx+Math.sin((NOW/1000)+h)*2,282);x.stroke()}
 /* Baumpilze am Stamm */
 [[60,182,17],[-62,222,13],[-58,70,12]].forEach(function(f){x.fillStyle='#4a3724';x.beginPath();x.ellipse(f[0],f[1]+2,f[2],f[2]*.34,0,0,Math.PI);x.fill();x.fillStyle='#8a6a40';x.beginPath();x.ellipse(f[0],f[1],f[2],f[2]*.34,0,Math.PI,0);x.fill();x.fillStyle='rgba(255,230,180,.25)';x.beginPath();x.ellipse(f[0]-2,f[1]-1.4,f[2]*.7,f[2]*.14,0,Math.PI,0);x.fill()});
 x.restore()}
function giantTrees(m){
 var L=1700;[[170,1,false],[760,2,true],[1290,3,false]].forEach(function(b){var q=md(b[0]-m*.42,L)-260;if(q>-240&&q<W+240)giantTree(q,b[1]*11,b[2])});
 x.fillStyle='rgba(110,132,122,.14)';x.fillRect(0,0,W,290)}
function bigMush(px,py,s,v){ /* grosser dunkler Pilz */
 x.save();x.translate(px,py);x.scale(s,s);
 var cap=v?['#4a1f1a','#1f0d0b','#f0c88a']:['#43304f','#190f22','#c9b3e6'];
 x.fillStyle='#bdb6c4';x.beginPath();x.moveTo(-6,0);x.quadraticCurveTo(-9,-14,-5,-27);x.lineTo(5,-27);x.quadraticCurveTo(9,-14,6.4,0);x.closePath();x.fill();
 x.fillStyle='rgba(0,0,0,.18)';x.fillRect(1.5,-27,4,27);
 x.fillStyle='#a69fae';x.beginPath();x.ellipse(0,-17,7,2.2,0,0,6.3);x.fill();
 var cg=x.createLinearGradient(0,-58,0,-22);cg.addColorStop(0,cap[0]);cg.addColorStop(1,cap[1]);x.fillStyle=cg;
 x.beginPath();x.moveTo(-28,-25);x.bezierCurveTo(-30,-48,-12,-58,0,-58);x.bezierCurveTo(12,-58,30,-48,28,-25);x.quadraticCurveTo(0,-17,-28,-25);x.fill();
 x.strokeStyle='rgba(200,190,220,.35)';x.lineWidth=.7;for(var i=-5;i<=5;i++){x.beginPath();x.moveTo(i*2.2,-20.5);x.lineTo(i*5.2,-25)}x.stroke();
 x.fillStyle=cap[2];[[-14,-41,3.4],[2,-48,3.8],[15,-38,3.2],[-5,-34,2.4],[10,-29,2.2],[-20,-31,2]].forEach(function(d){x.globalAlpha=.88;ellc(d[0],d[1],d[2],d[2]*.8,cap[2])});x.globalAlpha=1;
 x.fillStyle='rgba(255,255,255,.14)';x.beginPath();x.ellipse(-9,-50,12,3.6,-.35,0,6.3);x.fill();
 x.restore()}
function moorMush(m,ty){
 var L=900,om=m*.5;
 [[60,.8,0],[230,.62,1],[250,.4,0],[430,.9,0],[470,.5,1],[640,.72,1],[770,.85,0],[800,.45,1]].forEach(function(b){var q=md(b[0]-om,L)-80;if(q>-70&&q<W+70)bigMush(q,ty,b[1],b[2])})}
function deadTrees(m){ /* Baumgerippe im Vordergrund */
 var L=1500;
 [[300,1],[880,2],[1240,3]].forEach(function(b){var q=md(b[0]-m*1.9,L)-170;if(q<-120||q>W+120)return;
  var a=(.12+.88*cl((Math.abs(q-150)-60)/200,0,1));
  x.save();x.globalAlpha=a;x.fillStyle='#070a08';x.strokeStyle='#070a08';
  x.beginPath();x.moveTo(q-17,H+12);x.bezierCurveTo(q-13,250,q-9,120,q-7,-20);x.lineTo(q+6,-20);x.bezierCurveTo(q+8,120,q+14,250,q+21,H+12);x.closePath();x.fill();
  limb(q-6,60+R(b[1])*40,Math.PI*1.2,120+R(b[1]+4)*50,8,1.4,b[1]*13,false,2);
  limb(q+5,110,-.35,130,8,1.4,b[1]*13+5,false,2);
  limb(q-4,190,Math.PI*1.06,90,6,1.2,b[1]*13+9,false,1);
  limb(q+6,10,-1.2,60,5,1.2,b[1]*13+3,false,1);
  x.restore()})}
function boat(px,py,s,ph){
 var t=(NOW/1000),bob=Math.sin(t*1.3+ph)*3*s,rot=Math.sin(t*1.1+ph)*.06;
 x.save();x.translate(px,py+bob);x.rotate(rot);x.scale(s,s);
 /* Mast, Ausleger, Netz */
 x.strokeStyle='#232831';x.lineCap='round';x.lineWidth=2.4;x.beginPath();x.moveTo(-6,-14);x.lineTo(-6,-54);x.stroke();
 x.lineWidth=1.8;x.beginPath();x.moveTo(-6,-46);x.lineTo(-42,-22);x.moveTo(-6,-46);x.lineTo(28,-32);x.stroke();
 x.strokeStyle='rgba(30,40,52,.75)';x.lineWidth=.9;x.beginPath();x.moveTo(-42,-22);x.lineTo(-30,-10);x.lineTo(-38,-10);x.moveTo(-42,-22);x.lineTo(-46,-10);x.moveTo(-36,-17);x.lineTo(-44,-12);x.stroke();
 x.fillStyle='#EAB308';x.beginPath();x.moveTo(-6,-54);x.lineTo(-19,-51+Math.sin(t*6+ph)*1.2);x.lineTo(-6,-47);x.closePath();x.fill();
 /* Rumpf */
 x.fillStyle='#a8352b';x.beginPath();x.moveTo(-54,-17);x.quadraticCurveTo(-50,0,-34,9);x.lineTo(38,9);x.quadraticCurveTo(50,2,56,-15);x.closePath();x.fill();
 x.fillStyle='#f1f5f9';x.beginPath();x.moveTo(-54,-17);x.lineTo(56,-15);x.lineTo(55,-11);x.lineTo(-52,-13);x.closePath();x.fill();
 x.fillStyle='#1d2a3a';x.beginPath();x.moveTo(-36,9);x.lineTo(38,9);x.quadraticCurveTo(46,5,50,-1);x.lineTo(-46,-1);x.quadraticCurveTo(-42,6,-36,9);x.closePath();x.fill();
 /* Kajuete, Schornstein, Fenster */
 x.fillStyle='#f1f5f9';x.fillRect(14,-36,28,21);x.fillStyle='#2f5d8a';x.fillRect(11,-39,34,4);
 x.fillStyle='#fde68a';x.fillRect(18,-31,8,7);x.fillRect(31,-31,8,7);
 x.fillStyle='#2a2f38';x.fillRect(34,-48,5,10);x.fillStyle='#c0392b';x.fillRect(34,-48,5,3);
 for(var i=0;i<3;i++){var u=((t*.5+i*.33+ph)%1);ellc(36-u*22,-52-u*10,2+u*3,2+u*3,'rgba(200,206,214,'+(.45*(1-u))+')')}
 /* Bugwelle */
 ellc(-54,5,10,3.4,'rgba(241,245,249,.85)');ellc(-60,2,5,2,'rgba(241,245,249,.7)');
 x.restore()}
function seaBig(t,gf,cs){
 x.fillStyle=grad(150,H,'#223f64','#1E3A5F');x.fillRect(0,150,W,H-150);
 var cols=['#244368','#27496f','#2b4f76','#30577f','#355e88','#3a6592'];
 for(var r=0;r<6;r++){
  var y0=162+r*16,amp=3+r*2.6,wl=150+r*34,spd=t*(.9+r*.14+gf*.5),caps=[];
  x.fillStyle=cols[r];x.beginPath();x.moveTo(0,H);
  var prevCrest=false;
  for(var xx=0;xx<=W;xx+=5){var ph=xx/wl*6.283+spd+r*1.7,sn=.5+.5*Math.sin(ph),yy=y0-Math.pow(sn,1.8)*amp*1.8;x.lineTo(xx,yy);var crest=sn>.985;if(crest&&!prevCrest)caps.push([xx,yy]);prevCrest=crest}
  x.lineTo(W,H);x.closePath();x.fill();
  if(r===0){boat(md(330-cs*.02-t*.7,W+120)-30,y0+3,.34,.6);boat(md(470-cs*.02-t*.9,W+120)-30,y0+1,.28,2.1);boat(md(600-cs*.02-t*.6,W+120)-30,y0+5,.38,4.3)}
  /* Kamm */
  x.strokeStyle='rgba(235,242,248,'+(.14+r*.03)+')';x.lineWidth=1.2;x.beginPath();
  for(var x2=0;x2<=W;x2+=5){var p2=x2/wl*6.283+spd+r*1.7,s2=.5+.5*Math.sin(p2),y2=y0-Math.pow(s2,1.8)*amp*1.8;if(x2===0)x.moveTo(x2,y2);else x.lineTo(x2,y2)}x.stroke();
  /* Schaumkronen */
  caps.forEach(function(c,i){if(R(i*3+r)<.3)return;var w=10+r*3.4,a=.78;x.fillStyle='rgba(241,245,249,'+a+')';x.beginPath();x.ellipse(c[0],c[1]+1,w,2.4+r*.4,0,0,6.3);x.fill();x.beginPath();x.ellipse(c[0]-w*.5,c[1]+2,w*.55,1.8+r*.3,0,0,6.3);x.ellipse(c[0]+w*.55,c[1]+2,w*.6,1.8+r*.3,0,0,6.3);x.fill();
   for(var k=0;k<5;k++){var u=((t*1.3+k*.21+i*.37)%1);ellc(c[0]-w*.5+k*w*.28,c[1]-u*(5+r*2.4)*(1+gf),1.1+r*.1,1.1+r*.1,'rgba(241,245,249,'+(.8*(1-u))+')')}})}}
function lifering(px,gy){
 x.fillStyle='#3d2b1c';x.fillRect(px-2,gy-36,4,36);x.fillRect(px-2,gy-36,12,3);
 x.save();x.translate(px+9,gy-24);
 x.strokeStyle='#0b0b0b';x.lineWidth=7.4;x.beginPath();x.arc(0,0,6.7,0,6.3);x.stroke();
 x.strokeStyle='#d33a2c';x.lineWidth=5.6;x.beginPath();x.arc(0,0,6.7,0,6.3);x.stroke();
 x.strokeStyle='#f4f4f0';x.lineWidth=5.6;for(var i=0;i<4;i++){x.beginPath();x.arc(0,0,6.7,i*Math.PI/2+.45,i*Math.PI/2+1.12);x.stroke()}
 x.strokeStyle='rgba(60,60,60,.9)';x.lineWidth=.9;x.beginPath();x.arc(0,0,9.8,.3,2.9);x.stroke();
 x.restore()}
function crabSign(cx,cy){
 x.save();x.translate(cx,cy);
 x.fillStyle='#f6ecd2';x.beginPath();x.roundRect(-46,-22,92,44,5);x.fill();x.strokeStyle='#5a3a28';x.lineWidth=2;x.stroke();
 x.fillStyle='#b8312a';x.beginPath();x.ellipse(0,-3,17,10.5,0,0,6.3);x.fill();
 x.fillStyle='#d9473a';x.beginPath();x.ellipse(0,-6,13,5,0,Math.PI,0);x.fill();
 [[-1],[1]].forEach(function(sd){var s=sd[0];
  x.strokeStyle='#b8312a';x.lineWidth=2.6;x.beginPath();x.moveTo(s*13,-9);x.quadraticCurveTo(s*22,-12,s*25,-20);x.stroke();
  x.fillStyle='#d9473a';x.beginPath();x.arc(s*25,-22,6,0,6.3);x.fill();x.fillStyle='#f6ecd2';x.beginPath();x.moveTo(s*25,-22);x.lineTo(s*28.5,-29);x.lineTo(s*20.5,-27.5);x.closePath();x.fill();
  x.strokeStyle='#b8312a';x.lineWidth=1.8;for(var l=0;l<3;l++){x.beginPath();x.moveTo(s*(10+l*3),2+l*1.5);x.lineTo(s*(20+l*3),6+l*3);x.stroke()}
  x.fillStyle='#fff';x.beginPath();x.arc(s*5,-14,2.7,0,6.3);x.fill();x.fillStyle='#111';x.beginPath();x.arc(s*5,-14,1.2,0,6.3);x.fill();x.strokeStyle='#b8312a';x.lineWidth=1.4;x.beginPath();x.moveTo(s*5,-11);x.lineTo(s*5,-14);x.stroke()});
 x.fillStyle='#5a2a1a';x.font='bold 9px system-ui,sans-serif';x.textAlign='center';x.fillText('KRABBEN',0,18);x.textAlign='left';
 x.restore()}
function bude(X,gy){
 x.save();x.translate(X,gy);x.scale(1.65,1.65);x.translate(-X,-gy);
 /* Lichtschein */
 var lg=x.createRadialGradient(X,gy-30,6,X,gy-30,130);lg.addColorStop(0,'rgba(255,204,110,.28)');lg.addColorStop(1,'rgba(255,204,110,0)');x.fillStyle=lg;x.fillRect(X-140,gy-170,280,180);
 ellc(X,gy+1,78,5,'rgba(0,0,0,.28)');
 /* Wand */
 x.fillStyle='#6b4a30';x.fillRect(X-66,gy-64,132,64);x.fillStyle='rgba(0,0,0,.22)';for(var i=0;i<14;i++)x.fillRect(X-66,gy-64+i*4.6,132,.9);
 x.fillStyle='#4f3522';x.fillRect(X-66,gy-64,4,64);x.fillRect(X+62,gy-64,4,64);
 /* Dach */
 poly([X-82,gy-60,X-70,gy-84,X+70,gy-84,X+82,gy-60],'#3a4a58');poly([X-82,gy-60,X-70,gy-84,X-62,gy-84,X-72,gy-60],'#4c5f70');x.fillStyle='rgba(255,255,255,.1)';x.fillRect(X-70,gy-84,140,2);
 /* Verkaufsfenster */
 x.fillStyle='#2c1a0c';x.fillRect(X-50,gy-52,78,28);var wg=x.createLinearGradient(0,gy-52,0,gy-24);wg.addColorStop(0,'#f7c46a');wg.addColorStop(1,'#c88b3a');x.fillStyle=wg;x.fillRect(X-48,gy-50,74,24);
 x.fillStyle='rgba(60,30,10,.5)';[[-34,-36],[-8,-40],[14,-34]].forEach(function(f){x.beginPath();x.ellipse(X+f[0],gy+f[1]+8,5,6,0,0,6.3);x.fill()});
 x.fillStyle='#8a5a30';x.fillRect(X-56,gy-26,90,5);x.fillStyle='#a8723c';x.fillRect(X-56,gy-26,90,1.6);
 /* Markise */
 for(var s=0;s<9;s++){x.fillStyle=s%2?'#f4f4f0':'#c9372b';x.beginPath();x.moveTo(X-58+s*14,gy-58);x.lineTo(X-44+s*14,gy-58);x.lineTo(X-46+s*14,gy-44);x.quadraticCurveTo(X-52+s*14,gy-39,X-60+s*14,gy-44);x.closePath();x.fill()}
 /* Tuer */
 x.fillStyle='#43301f';x.fillRect(X+38,gy-48,20,48);x.fillStyle='#e9d9a8';x.fillRect(X+42,gy-42,12,12);x.fillStyle='#2c1a0c';x.fillRect(X+54,gy-22,2,5);
 /* Lichterkette */
 x.strokeStyle='#2a2a2a';x.lineWidth=.8;x.beginPath();x.moveTo(X-64,gy-60);x.quadraticCurveTo(X,gy-50,X+64,gy-60);x.stroke();
 for(var l=0;l<9;l++){var lx=X-60+l*15,ly=gy-60+Math.sin((l/8)*3.14)*7+4;ellc(lx,ly,2.2,2.2,'rgba(255,230,140,'+(.7+.3*Math.sin((NOW/1000)*4+l))+')')}
 /* Krabbenschild auf dem Dach */
 x.strokeStyle='#4a3524';x.lineWidth=3;x.beginPath();x.moveTo(X-22,gy-84);x.lineTo(X-22,gy-92);x.moveTo(X+22,gy-84);x.lineTo(X+22,gy-92);x.stroke();
 crabSign(X,gy-104);
 /* Tafel */
 x.save();x.translate(X+84,gy);x.fillStyle='#2f3a30';x.beginPath();x.roundRect(-18,-34,36,34,3);x.fill();x.strokeStyle='#8a6a40';x.lineWidth=2.4;x.stroke();
 x.fillStyle='#f4f4f0';x.font='bold 6.4px system-ui,sans-serif';x.textAlign='center';x.fillText('HEUTE:',0,-24);x.fillText('Fischbröt-',0,-16);x.fillText('chen',0,-9);x.strokeStyle='rgba(255,255,255,.6)';x.lineWidth=.8;x.beginPath();x.moveTo(-12,-5);x.lineTo(12,-5);x.stroke();x.textAlign='left';x.restore();
 /* Rettungsring an der Wand */
 x.save();x.translate(X+50,gy-62);x.strokeStyle='#0b0b0b';x.lineWidth=0;x.restore();
 /* Moewe auf dem Dach */
 var gx=X+56,gy2=gy-90;ellc(gx,gy2,6,3.4,'#f1f5f9');ellc(gx-6,gy2-3,3,2.8,'#f1f5f9');x.fillStyle='#EAB308';x.beginPath();x.moveTo(gx-9,gy2-3);x.lineTo(gx-13,gy2-2);x.lineTo(gx-9,gy2-1.4);x.closePath();x.fill();ellc(gx-6.6,gy2-3.6,.7,.7,'#111');x.fillStyle='#8a96a4';x.beginPath();x.moveTo(gx+3,gy2-1);x.lineTo(gx+11,gy2+1);x.lineTo(gx+3,gy2+2);x.closePath();x.fill();x.restore()}
function birchM(px,base,h,a,far){
 x.strokeStyle='rgba(205,214,205,'+a+')';x.lineWidth=far?2.4:3.4;x.lineCap='round';x.beginPath();x.moveTo(px,base);x.quadraticCurveTo(px+3,base-h*.5,px-2,base-h);x.stroke();
 x.strokeStyle='rgba(40,48,44,'+a*.8+')';x.lineWidth=1;for(var i=0;i<4;i++){var yy=base-h*(.15+i*.2);x.beginPath();x.moveTo(px-1.5,yy);x.lineTo(px+1.5,yy+1);x.stroke()}
 x.strokeStyle='rgba(90,108,96,'+a*.9+')';x.lineWidth=1;for(var j=0;j<4;j++){var by=base-h*(.55+j*.1);x.beginPath();x.moveTo(px,by);x.lineTo(px+(j%2?14:-14),by-10);x.stroke()}}
/* Fischbrötchen am Ziel: vier Bisse, beide Hände, keine Stöcke */
function rollDraw(len){
 ellc(0,-4.2,13.6*len,4.8,'#d9a860');x.fillStyle='#d9a860';x.beginPath();x.ellipse(0,-1.9,13.6*len,2.6,0,0,Math.PI);x.fill();
 x.fillStyle='#e9c98a';x.beginPath();x.ellipse(0,-5,10*len,2,0,Math.PI,0);x.fill();
 x.fillStyle='#cfd8de';x.beginPath();x.roundRect(-12.6*len,-3.4,25*len,3.3,1.6);x.fill();
 x.strokeStyle='#8a4a8a';x.lineWidth=.9;[-7,-1,5].forEach(function(o){if(Math.abs(o)<12*len){x.beginPath();x.ellipse(o,-3.7,2.6,1.2,0,0,6.3);x.stroke()}})}
function eatInfo(){
 if(g.bonus!==2||g.mode!=='over'||!g.won)return null;var e=g.tOver-.9;if(e<0)return null;
 var cyc=1.3,n=Math.floor(e/cyc),ph=(e%cyc)/cyc,bites=Math.min(n,4),len=1-.2*bites,up=ph<.2?ez(ph/.2):ph<.62?1:1-ez((ph-.62)/.25);
 if(bites>=4&&ph>.3)len=.2;return{n:n,ph:ph,len:len,up:up,open:ph>.12&&ph<.3&&n<4}}
function eatCrumbs(px,gy,f){
 if(f.ph>.3&&f.ph<.62&&f.n<4){var mx=px+17,my=gy-70,u=(f.ph-.3)/.32;for(var k=0;k<5;k++)ellc(mx+4+k*2.4,my+8+u*u*16+k,1.1,1.1,'rgba(230,200,140,'+(.9*(1-u))+')')}}
function wonT(){return g.bonus===2?7.6:3.2}
function fir(px,py,h,c1,c2,snow){var w=h*.4;poly([px-w,py,px,py-h,px+w,py],c1);poly([px-w*.78,py-h*.38,px,py-h*1.08,px+w*.78,py-h*.38],c2||c1);poly([px-w*.55,py-h*.68,px,py-h*1.2,px+w*.55,py-h*.68],c1);x.fillStyle='#4a3322';x.fillRect(px-1.2,py,2.4,Math.max(3,h*.12))}
function bush(px,py,r,c){ellc(px,py-r*.5,r,r*.7,c);ellc(px-r*.6,py-r*.3,r*.6,r*.5,c);ellc(px+r*.6,py-r*.3,r*.6,r*.5,c)}
var SX=112,SY=84,TX=520,TY=189.5; /* Seilanfang (Bergstation) und -ende (Talstation) */
function terr(px){return px<130?104:px<440?lp(104,262,Math.pow((px-130)/310,.45)):262}
function cable(px){return SY+(px-SX)*((TY-SY)/(TX-SX))}
function mast(sx0){var sy=terr(sx0),cy=cable(sx0);x.strokeStyle='#5a5148';x.lineWidth=3;x.lineCap='round';x.beginPath();x.moveTo(sx0-9,sy+5);x.lineTo(sx0-2,cy-3);x.moveTo(sx0+9,sy+5);x.lineTo(sx0+2,cy-3);x.stroke();
 x.lineWidth=1.6;for(var i=1;i<5;i++){var yy=lp(sy,cy,i/5),hw=lp(9,2,i/5);x.beginPath();x.moveTo(sx0-hw-(i%2?0:0),yy);x.lineTo(sx0+hw,lp(sy,cy,(i+1)/5));x.stroke()}
 x.fillStyle='#46403a';x.fillRect(sx0-11,cy-7,22,5);ellc(sx0-5,cy-1,2.6,2.6,'#222');ellc(sx0+5,cy-1,2.6,2.6,'#222');x.fillStyle='#d9573f';x.fillRect(sx0-1,cy-14,2,7)}
function bergstation(t){
 /* Gipfelplateau mit Kreuz */
 poly([0,108,0,74,8,64,18,70,26,84,36,100,60,108],'#8f8c84');poly([8,64,18,70,14,80,6,74],'#aeaba0');
 x.fillStyle='#5b3d24';x.fillRect(8.6,38,3,28);x.fillRect(2,44,16,3);
 /* Station: Steinsockel, Holzgeschoss, Dach */
 x.fillStyle='#7d7a72';x.fillRect(34,92,82,14);x.fillStyle='rgba(0,0,0,.15)';for(var i=0;i<6;i++)x.fillRect(38+i*13,94+(i%2)*5,9,4);
 x.fillStyle='#8a6a48';x.fillRect(36,72,78,22);x.fillStyle='rgba(0,0,0,.14)';for(var j=0;j<8;j++)x.fillRect(36,74+j*3,78,.8);
 x.fillStyle='#f4d884';[[44,78],[60,78],[78,78]].forEach(function(w){x.fillRect(w[0],w[1],9,9)});x.strokeStyle='#4a3524';x.lineWidth=1.2;[[44,78],[60,78],[78,78]].forEach(function(w){x.strokeRect(w[0],w[1],9,9);x.beginPath();x.moveTo(w[0]+4.5,w[1]);x.lineTo(w[0]+4.5,w[1]+9);x.stroke()});
 x.fillStyle='#14100c';x.fillRect(98,76,18,28); /* Ausfahrt der Gondeln */
 x.fillStyle='#5a3a28';x.fillRect(38,64,76,8);poly([30,74,76,48,122,74],'#5a3a28');poly([30,74,76,48,122,74],'#5a3a28');
 poly([36,71,76,52,116,71,114,68,76,50,38,68],'#f4f8fa');
 x.fillStyle='#4a3524';x.fillRect(96,52,6,12);x.fillStyle='#f4f8fa';x.fillRect(95,50,8,3);
 /* Rauch */
 for(var r=0;r<4;r++){var u=((t*.35+r*.25)%1);ellc(99+u*10+Math.sin(u*5+r)*2,48-u*24,3+u*3,3+u*3,'rgba(240,244,246,'+(.5*(1-u))+')')}
 /* Fahne */
 x.strokeStyle='#4a3524';x.lineWidth=1.4;x.beginPath();x.moveTo(52,52);x.lineTo(52,36);x.stroke();x.fillStyle='#c6372b';x.beginPath();x.moveTo(52,36);x.quadraticCurveTo(60,34+Math.sin(t*4)*1.5,66,38);x.quadraticCurveTo(60,40+Math.sin(t*4+1)*1.5,52,42);x.closePath();x.fill();
 /* Schild */
 x.fillStyle='#f2e6cc';x.beginPath();x.roundRect(46,93,48,15,2);x.fill();x.strokeStyle='#8a6a40';x.lineWidth=.8;x.stroke();x.fillStyle='#4a3524';x.textAlign='center';x.font='bold 6.6px system-ui,sans-serif';x.fillText('492 m',70,100);x.font='bold 5.6px system-ui,sans-serif';x.fillText('Wengeberg',70,106.2);x.textAlign='left';
 /* Seilrad im Ausgang */
 ellc(SX,SY,4,4,'#555');x.fillStyle='#888';x.beginPath();x.arc(SX,SY,1.4,0,6.3);x.fill()}
function talstation(){
 x.save();x.translate(TX,262);x.scale(1.35,1.35);x.translate(-578,-262);
 x.fillStyle='#7d7a72';x.fillRect(588,246,84,16);x.fillStyle='#8a6a48';x.fillRect(590,214,80,34);x.fillStyle='rgba(0,0,0,.14)';for(var j=0;j<8;j++)x.fillRect(590,216+j*4,80,.8);
 poly([582,216,630,190,678,216],'#5a3a28');poly([590,214,630,194,670,214,668,212,630,192,592,212],'#f4f8fa');
 x.fillStyle='#14100c';x.fillRect(594,226,16,22);x.fillStyle='#f4d884';x.fillRect(626,226,10,10);x.fillRect(646,226,10,10);x.strokeStyle='#4a3524';x.lineWidth=1.2;x.strokeRect(626,226,10,10);x.strokeRect(646,226,10,10);
 x.fillStyle='#e4d8bd';x.font='bold 8px system-ui,sans-serif';x.fillText('Talstation',601,222);
 x.fillStyle='#8a6e48';x.fillRect(536,262,60,5);x.fillStyle='#46403a';x.fillRect(575,204,5,58);ellc(578,208,4.4,4.4,'#555');x.restore()}
function gondel(px,py,sw,t,sc){
 x.save();x.translate(px,py);x.scale(sc,sc);
 /* Laufwerk: zwei Raeder */
 x.fillStyle='#46403a';x.fillRect(-9,-8,18,5);ellc(-5,-3,3,3,'#222');ellc(5,-3,3,3,'#222');ellc(-5,-3,1,1,'#888');ellc(5,-3,1,1,'#888');
 x.rotate(sw);
 /* Haenger */
 x.strokeStyle='#333';x.lineWidth=2.2;x.beginPath();x.moveTo(0,-3);x.lineTo(0,20);x.stroke();x.fillStyle='#333';x.fillRect(-4,14,8,5);
 x.translate(0,20);
 /* Dach */
 x.fillStyle='#6b1d17';x.beginPath();x.roundRect(-28,-3,56,8,4);x.fill();x.fillStyle='#8a2a22';x.fillRect(-26,-3,52,2.4);ellc(0,-5,2,1.4,'#e8c040');
 /* Kabine */
 x.fillStyle='#a42f26';x.beginPath();x.roundRect(-25,4,50,43,5);x.fill();
 x.fillStyle='#d9ccb0';x.fillRect(-21,8,42,28);
 x.save();x.beginPath();x.rect(-21,8,42,28);x.clip();
 x.save();x.translate(0,36);x.scale(.034,.034);x.translate(-335,-872);mo((NOW/1000)*1000,false,Math.PI/2,true,0,0);x.restore();
 x.restore();
 x.fillStyle='rgba(190,230,245,.2)';x.fillRect(-21,8,42,28);
 x.strokeStyle='#efe6d4';x.lineWidth=1.5;x.strokeRect(-21,8,42,28);x.beginPath();x.moveTo(-7,8);x.lineTo(-7,36);x.moveTo(7,8);x.lineTo(7,36);x.stroke();
 x.fillStyle='rgba(255,255,255,.28)';x.beginPath();x.moveTo(-19,10);x.lineTo(-10,10);x.lineTo(-19,22);x.closePath();x.fill();
 /* Bruestung und Beschriftung */
 x.fillStyle='#c6372b';x.beginPath();x.roundRect(-25,35,50,12,3);x.fill();x.fillStyle='#f2e6cc';x.fillRect(-25,37,50,1.8);
 x.fillStyle='#f2e6cc';x.font='bold 5.5px system-ui,sans-serif';x.textAlign='center';x.fillText('mitrilmo',0,45);x.textAlign='left';
 x.fillStyle='#3a2018';x.fillRect(-1,36,.8,10);
 x.restore()}
function drawFilm(t){
 var s=ez((t-.8)/8.6);
 x.fillStyle=grad(0,262,'#8fc3e4','#e4f1ee');x.fillRect(0,0,W,H);
 var sg=x.createRadialGradient(610,48,4,610,48,110);sg.addColorStop(0,'rgba(255,243,176,.95)');sg.addColorStop(1,'rgba(255,243,176,0)');x.fillStyle=sg;x.fillRect(490,0,190,170);
 var ox=-t*1.2;
 poly([250+ox,205,330+ox,128,372+ox,150,430+ox,100,500+ox,160,560+ox,126,640+ox,170,720,205],'#9db5c9');
 poly([330+ox,128,318+ox,146,334+ox,141,346+ox,150,356+ox,142,372+ox,150],'#f4f8fa');
 poly([430+ox,100,412+ox,128,430+ox,120,446+ox,132,462+ox,122,500+ox,160],'#f4f8fa');
 poly([560+ox,126,546+ox,150,562+ox,142,578+ox,152,592+ox,140,640+ox,170],'#f4f8fa');
 [[90,40,60,13],[300,64,70,14],[520,30,50,11],[620,86,44,10]].forEach(function(c,i){var cx=md(c[0]+t*(3+i*1.4)+40,W+160)-80;ellc(cx,c[1],c[2],c[3],'rgba(255,255,255,.8)');ellc(cx+c[2]*.4,c[1]-8,c[2]*.55,c[3]*.9,'rgba(255,255,255,.85)')});
 /* ferne Huegel mit kleinen Tannen */
 poly([200,262,260,214,330,236,440,190,540,236,680,206,680,262],'#6f9d78');
 for(var fi=0;fi<22;fi++){var fx=250+fi*21+R(fi+40)*10;var fy=fx<440?lp(236,196,(fx-250)/190):fx<540?lp(192,236,(fx-440)/100):lp(236,208,(fx-540)/140);fir(fx,fy+3,9+R(fi+3)*6,'#4f8160','#5a9068')}
 /* Hang */
 x.fillStyle=grad(60,262,'#7d8f6c','#4f7a45');x.beginPath();x.moveTo(0,0);x.lineTo(0,340);x.lineTo(680,340);x.lineTo(680,262);for(var q=440;q>=130;q-=10)x.lineTo(q,terr(q));x.lineTo(130,104);x.lineTo(0,104);x.closePath();x.fill();
 /* Wiesenstreifen und Felsen am Hang */
 for(var lt2=0;lt2<26;lt2++){var lx0=4+R(lt2+120)*128,ly0=122+R(lt2+130)*150;fir(lx0,ly0,10+(ly0-110)*.12+R(lt2)*8,'#33603f','#40714a')}
 [[170,118],[240,160],[300,190]].forEach(function(r){var ry=terr(r[0])+8;ellc(r[0],ry,7,4,'#8d8a82');ellc(r[0]-2,ry-1.5,3,1.6,'#aaa79e')});
 /* Wald hinten und vorn */
 for(var i=0;i<34;i++){var tx=138+i*9+R(i)*6;if(tx>436)break;fir(tx,terr(tx)+2+R(i+50)*6,13+R(i+4)*12,'#3b6b45','#47804f')}
 for(var i2=0;i2<30;i2++){var tx2=134+i2*10.5+R(i2+90)*7;if(tx2>438)break;fir(tx2,terr(tx2)+14+R(i2+60)*12,18+R(i2+14)*14,'#2f5a3a','#3b6b45')}
 [[150,0],[205,1],[262,0],[318,1],[372,0]].forEach(function(b){bush(b[0],terr(b[0])+22,7,b[1]?'#5c8a48':'#4a7a3c')});
 /* Bergstation und Seil */
 bergstation(t);
 mast(330);mast(420);
 x.strokeStyle='#2d2d2d';x.lineWidth=1.6;x.beginPath();x.moveTo(SX,SY);x.lineTo(TX,TY);x.stroke();
 /* Talboden und Talstation */
 x.fillStyle=grad(262,340,'#4f7a45','#2f4a38');x.fillRect(440,262,240,80);
 x.fillStyle='rgba(30,41,35,.55)';x.fillRect(440,276,240,64);
 for(var r=0;r<40;r++){var rx=450+r*6+R(r)*3;x.strokeStyle='#5a6a48';x.lineWidth=1.1;x.beginPath();x.moveTo(rx,264);x.lineTo(rx+R(r+2)*4-2,264-9-R(r+3)*8);x.stroke()}
 talstation();
 /* Gondel (verlaesst die Bergstation durch die rechte Oeffnung) */
 var px=lp(100,TX-28,s),py=cable(px),dd=px-330;
 var sw=Math.sin(t*1.7)*.035*(1-s*.5)+(dd>-8&&dd<120?Math.exp(-(dd+8)/45)*Math.sin((dd+8)/9)*.09:0);if(s>.97)sw*=(1-s)*30;
 x.save();x.beginPath();x.rect(SX+2,0,W,H);x.clip();gondel(px,py,sw,t,lp(.34,1.2,s));x.restore();
 /* Vordergrundhang mit Baeumen */
 x.fillStyle=grad(290,340,'#2f5a3a','#1d3a28');x.beginPath();x.moveTo(0,300);x.quadraticCurveTo(120,282,260,312);x.quadraticCurveTo(360,330,430,340);x.lineTo(0,340);x.closePath();x.fill();
 [[14,62],[48,50],[84,70],[124,46],[168,58],[212,44],[258,52]].forEach(function(f,i){var fy=f[0]<120?318+R(i)*4:f[0]<200?326:334;fir(f[0],fy+10,f[1],'#25503a','#2f6244')});
 /* Nebel im Tal */
 var fa=.1+.32*s;x.fillStyle='rgba(216,228,224,'+fa*.8+')';x.fillRect(0,250,W,H-250);
 [[120,262,160,18],[380,270,200,16],[560,258,150,14]].forEach(function(f,i){ellc(md(f[0]-t*6*(1+i*.3),W+300)-100,f[1],f[2],f[3],'rgba(226,232,240,'+(.18+.2*s)+')')});
 for(var b=0;b<3;b++){var bx=md(700-t*22*(1+b*.2)+b*130,760)-40,by=92+b*20+Math.sin(t*1.5+b)*5,fl=Math.sin(t*9+b)*3;x.strokeStyle='#3d4a55';x.lineWidth=1.2;x.beginPath();x.moveTo(bx-6,by-fl);x.quadraticCurveTo(bx-2,by-3,bx,by);x.quadraticCurveTo(bx+2,by-3,bx+6,by-fl);x.stroke()}
}
var FILMLEN=10;
function startFilm(){sfx('seil');g.k1=0;g.k2=0;mm.sit=0;mm.hold=false;mm.duckKey=false;mm.duckPtr=false;g.mode='film';g.tFilm=0;g.fSaid=0;g.paused=false;msgT=0;g.q=null;g.tr=-1;g.pend=null}
function endFilm(){cur='Moor';start(2);g.tr=-1;g.pend=null}
function filmStep(dt){g.tFilm+=dt;if(!g.fSaid&&g.tFilm>1.2){g.fSaid=1;say('Eine Seilbahn. Auf dem Wegweiser stand davon nichts.',6.4)}if(g.tFilm>5.7&&!g.k1){g.k1=1;sfx('klack')}if(g.tFilm>7.1&&!g.k2){g.k2=1;sfx('klack')}if(g.tFilm>=FILMLEN)endFilm()}
function filmUI(){
 var t=g.tFilm,a=Math.max(0,1-t/.6,(t-(FILMLEN-.6))/.6);if(a>0){x.fillStyle='rgba(12,10,8,'+Math.min(1,a)+')';x.fillRect(0,0,W,H)}
 x.globalAlpha=.8;x.fillStyle='rgba(30,22,14,.55)';var sw=Math.round(90*FB),sh=Math.round(22*(1+(FB-1)*.8));x.beginPath();x.roundRect(W-sw-8,8,sw,sh,sh/2);x.fill();
 x.globalAlpha=1;x.fillStyle='#fbf3e0';x.font='11px system-ui,sans-serif';x.textAlign='center';x.fillText(TOUCH?'Überspringen':'Esc: überspringen',W-8-sw/2,8+sh/2+4*FB);x.textAlign='left'}
/* ---------- Ton (WebAudio, alles synthetisch, keine Dateien) ---------- */
var AC=null,muted=false,master=null,nbuf=null;
function ac(){if(AC===null){try{AC=new (window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=.45;master.connect(AC.destination);
  nbuf=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);var d=nbuf.getChannelData(0);for(var i=0;i<d.length;i++)d[i]=Math.random()*2-1}catch(e){AC=false}}
 if(AC&&AC.state==='suspended')AC.resume();return AC}
function tone(t,f1,f2,d,type,vol){var o=AC.createOscillator(),gn=AC.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,f2),t+d);
 gn.gain.setValueAtTime(0.0001,t);gn.gain.exponentialRampToValueAtTime(vol,t+.008);gn.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(gn);gn.connect(master);o.start(t);o.stop(t+d+.05)}
function hush(t,d,vol,fc,type){var s=AC.createBufferSource(),f=AC.createBiquadFilter(),gn=AC.createGain();s.buffer=nbuf;f.type=type||'lowpass';f.frequency.value=fc;
 gn.gain.setValueAtTime(vol,t);gn.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(f);f.connect(gn);gn.connect(master);s.start(t);s.stop(t+d+.05)}
var SFX={
 jump:function(t){tone(t,260,620,.16,'triangle',.28);hush(t,.06,.05,2500,'highpass')},
 land:function(t){tone(t,120,55,.12,'sine',.35);hush(t,.07,.12,500)},
 step:function(t){hush(t,.05,.07,900)},
 fund:function(t){[880,1175,1480].forEach(function(f,i){tone(t+i*.07,f,f,.16,'triangle',.2)})},
 gold:function(t){[523,659,784,1047,1319].forEach(function(f,i){tone(t+i*.09,f,f,.3,'triangle',.22)})},
 ok:function(t){tone(t,660,660,.09,'sine',.14);tone(t+.07,880,880,.14,'sine',.14)},
 hit:function(t){tone(t,180,50,.28,'sawtooth',.3);hush(t,.22,.3,1200);tone(t+.05,110,40,.3,'sine',.35)},
 stage:function(t){[392,494,587,784].forEach(function(f,i){tone(t+i*.11,f,f,.28,'triangle',.22)})},
 start:function(t){tone(t,330,330,.1,'triangle',.2);tone(t+.1,440,440,.16,'triangle',.2)},
 win:function(t){[523,659,784,1047,784,1047].forEach(function(f,i){tone(t+i*.14,f,f,.34,'triangle',.26)})},
 fail:function(t){[392,349,311,262].forEach(function(f,i){tone(t+i*.22,f,f*.97,.4,'sawtooth',.14)})},
 seil:function(t){tone(t,92,104,9.5,'sine',.07);hush(t,9.5,.05,260)},
 klack:function(t){tone(t,210,95,.07,'square',.1);hush(t,.05,.1,1800,'highpass')},
 welle:function(t){hush(t,1.5,.06,520)},
 krah:function(t){tone(t,520,360,.14,'sawtooth',.12);tone(t+.2,500,340,.14,'sawtooth',.1)},
 moewe:function(t){tone(t,1500,1000,.22,'sine',.12);tone(t+.3,1400,950,.2,'sine',.1)},
 igel:function(t){tone(t,1500,1900,.07,'sine',.1);tone(t+.1,1700,2100,.07,'sine',.08)},
 knarz:function(t){tone(t,95,70,.16,'sawtooth',.06);hush(t,.1,.05,400)},
 kau:function(t){hush(t,.07,.16,1400);hush(t+.12,.07,.14,1400);hush(t+.24,.06,.1,1200);tone(t+.05,130,90,.1,'sine',.1)},
 pfand:function(t){[1318,1568,2093,1568,2093].forEach(function(f,i){tone(t+i*.07,f,f,.14,'square',.07)});hush(t,.25,.06,3000,'highpass')},
 gurr:function(t){tone(t,300,260,.12,'triangle',.08);tone(t+.16,320,270,.12,'triangle',.07)},
 miau:function(t){tone(t,700,900,.12,'sine',.09);tone(t+.12,900,520,.22,'sine',.08)},
 buh:function(t){tone(t,240,150,.5,'sine',.09);tone(t+.02,243,152,.5,'sine',.05)}
};
function sfx(n){if(muted)return;if(n==='step'&&!AC)return;if(!ac())return;try{SFX[n](AC.currentTime+.01)}catch(e){}}
function setPause(on){if(on===g.paused)return;if(on&&g.mode!=='play')return;g.paused=on;mm.hold=false;mm.duckKey=false;mm.duckPtr=false;if(!on)g.slow=Math.max(g.slow,.6)}
function pauseUI(){
 if(!g.paused)return;
 x.fillStyle='rgba(20,18,28,.58)';x.fillRect(0,0,W,H);
 plate(W/2-160,108,320,96,.98);x.textAlign='center';
 x.fillStyle='#3a2918';x.font='bold 26px Georgia,serif';x.fillText('Pause',W/2,148);
 x.font='12px system-ui,sans-serif';x.fillStyle='#6b4a2a';x.fillText(TOUCH?'Tippen: weiter':'Weiter mit P, Esc, Leertaste oder Tippen',W/2,170);
 x.font='italic 11px system-ui,sans-serif';x.fillStyle='#7a5a38';x.fillText('Der Wegweiser wartet. Darin hat er Übung.',W/2,190);
 x.textAlign='left';x.globalAlpha=1}
function pauseIcon(){
 if(g.mode!=='play'&&!g.paused)return;
 var mx=W-54,my=H-34;x.fillStyle='rgba(30,22,14,.6)';x.beginPath();x.roundRect(mx,my,20,20,6);x.fill();
 x.fillStyle='#fbf3e0';
 if(g.paused){x.beginPath();x.moveTo(mx+7,my+5);x.lineTo(mx+15,my+10);x.lineTo(mx+7,my+15);x.closePath();x.fill()}
 else{x.fillRect(mx+6,my+5,3,10);x.fillRect(mx+11,my+5,3,10)}}
function muteIcon(){var mx=W-28,my=H-34;x.fillStyle='rgba(30,22,14,.6)';x.beginPath();x.roundRect(mx,my,20,20,6);x.fill();
 x.fillStyle='#fbf3e0';x.beginPath();x.moveTo(mx+4,my+8);x.lineTo(mx+8,my+8);x.lineTo(mx+12,my+4);x.lineTo(mx+12,my+16);x.lineTo(mx+8,my+12);x.lineTo(mx+4,my+12);x.closePath();x.fill();
 x.strokeStyle='#fbf3e0';x.lineWidth=1.6;x.lineCap='round';
 if(muted){x.beginPath();x.moveTo(mx+14,my+7);x.lineTo(mx+18,my+13);x.moveTo(mx+18,my+7);x.lineTo(mx+14,my+13);x.stroke()}
 else{x.beginPath();x.arc(mx+11,my+10,4,-.9,.9);x.stroke();x.beginPath();x.arc(mx+11,my+10,7,-.9,.9);x.stroke()}}

/* ---------- Spiel ---------- */
var STAGE=3200,NST=6,TOTAL=STAGE*NST,PXM=9.6;
var SEA=['Frühling','Sommer','Herbst','Winter','Nacht','Sommer'];
var SNAME=['Talstart','Sonnenhang','Pilzwald','Eisgrat','Nachtmarsch','Zielgerade'];
var SLINE=[
 'Etappe 1: Alles blüht. Auch die Wurzeln, über die du fällst.',
 'Etappe 2: Sonne, Fliegen, Sonnenbrand. Das volle Programm.',
 'Etappe 3: Pilze überall. Nicht alles davon ist essbar, nicht alles ist ein Pilz.',
 'Etappe 4: Winter. Der Wegweiser friert nicht, er steht nur hier.',
 'Etappe 5: Nacht. Mo hat eine Stirnlampe. Der Wegweiser hat Geduld.',
 'Etappe 6: Fast da. Das hat der Wegweiser auch bei Etappe 1 gesagt.'];
var HIT={
 log:['Der Baumstamm hat nichts getan. Er lag nur da. Das ist sein Beruf.','Aua. Der Stamm entschuldigt sich nicht.','Baumstamm eins, Würde null. Fast.'],
 mush:['Der Pilz ist rot mit weißen Punkten. Das ist keine Deko, das ist eine Warnung.','Mo hat den Pilz geküsst. Der Pilz ist nicht begeistert.','Auf Pilze tritt man nicht. Auf Wegweiser hört man auch nicht, ich weiß.'],
 rock:['Der Fels gibt nicht nach. Das ist sein einziges Hobby.','Fels getroffen. Der Fels spürt nichts. Mo schon.','Der Stein liegt hier seit der Eiszeit. Mo seit gerade eben.'],
 fox:['Der Fuchs war schneller. Der Fuchs ist immer schneller.','Der Fuchs hat Mo nicht gebissen, nur beleidigt.','Füchse haben Vorfahrt. Steht nirgends, ist aber so.'],
 wolf:['Der Wolf wollte nur Hallo sagen. Mit Zähnen. Das ist bei Wölfen üblich.','Wolf eins, Würde null. Der Wolf zuckt nicht mal.','Mo ist nicht Rotkäppchen. Der Wolf hat trotzdem Hunger auf Respekt.'],
 eagle:['Der Adler kam von oben. Mo hat nach unten geschaut. Das ist die falsche Richtung.','Adler: Rekord im Sturzflug. Mo: Rekord im Stolpern.','Der Adler hat Mo mit seinem Hut verwechselt. Kann passieren.'],
 bear:['Mo ist auf den schlafenden Bären getreten. Der Bär schläft weiter. Mo nicht mehr.','Man weckt keinen Bären. Man stolpert nur über ihn, das ist ein Unterschied.','Der Bär hat nicht mal geblinzelt. Das tat mehr weh als der Sturz.']};
var DODGE={
 log:['Knapp daneben ist auch vorbei. Der Baumstamm nimmt’s persönlich.','Elegant. Fast, als hätte Mo das geplant.'],
 mush:['Gut gesprungen. Der Pilz hatte sich schon gefreut.','Pilz übersprungen. Kein Applaus, aber ich denke ihn mir.'],
 rock:['Über den Fels. Der Fels ist beleidigt, er wollte Aufmerksamkeit.','Sprung geglückt. Der Fels bleibt trotzdem hier.'],
 fox:['Haarscharf. Mo nennt das Fahrtechnik. Der Wegweiser nennt es Glück.','Der Fuchs guckt blöd. Mo auch, aber höher.'],
 wolf:['Über den Wolf. Der Wolf nimmt es sportlich, wahrscheinlich.','Der Wolf schaut hoch. Mo schaut nicht runter. Gute Strategie.'],
 eagle:['Geduckt. Der Adler hat nur Luft erwischt und tut so, als wäre das Absicht.','Mo hat sich geduckt, der Adler hat sich gewundert. Beides ist angemessen.'],
 bear:['Leise drüber. Der Bär hat ein Auge geöffnet und wieder zugemacht.','Über den Bären gehüpft. Er schnarcht weiter, der Wegweiser nennt das Gelassenheit.']};
var CHAT=['Noch 2 km bis zur Hütte. Das steht hier seit 2011.','Dieser Weg ist ausgeschildert. Das ist alles, was ich dazu sage.','Ich stehe hier und zeige. Mehr kann ich nicht, mehr will ich nicht.','Links ist die Aussicht. Rechts ist auch die Aussicht. Geradeaus ist Mo.','Ein Wegweiser hat keine Meinung. Er hat Pfeile.'];
var FAILS=['Würde aufgebraucht. Mo setzt sich hin. Der Wegweiser bleibt stehen, wie immer.','Das war kein Sturz, das war ein Rastplatz mit Verspätung.','Mo gibt auf. Der Wegweiser nennt es: Pause für immer.'];
var WINS=['Hütte erreicht. Der Wegweiser hat es immer gewusst.','Angekommen. Der Wegweiser tut so, als wäre er nicht stolz.'];
var RANG={'1':'Bergischer Ehrenwanderer','2':'Gipfelfreund','3':'Wegesrand-Profi','4':'Bachbett-Balancierer','5':'Pfützenpionier','6':'Stolpersteinsammler'};
var REMARK={'1':'Fehlerfrei. Der Wegweiser vermutet Betrug.','2':'Ein Ausrutscher. Menschlich. Vermerkt.','3':'Angekommen. Wie, ist nicht Gegenstand des Zeugnisses.','4':'Knapp nicht angekommen. Das nennt man Charakter.','5':'Der Weg war da. Mo auch. Das reicht nicht ganz.','6':'Nächstes Mal bitte in die andere Richtung.'};
var HW={log:26,mush:17,rock:22,fox:20,wolf:26,bear:32,eagle:24,stalag:14,stalag2:26,pfuetze:32,stalak:18,bat:40,gap:30,boulder:25,steinmann:18,dohle:16,felsnase:32,hedge:20,crow:16,seal:36,gull:18},HH={log:33,mush:30,rock:36,fox:28,wolf:38,bear:38,eagle:30,stalag:36,stalag2:44,pfuetze:12,stalak:30,bat:30,gap:30,boulder:44,steinmann:40,dohle:30,felsnase:30,hedge:26,crow:30,seal:30,gull:30};
var APP={fox:.45,wolf:.3,eagle:.55,bat:.35,dohle:.55,hedge:.3,crow:.55,gull:.55},OFF={fox:183,wolf:136,eagle:209,bat:153,dohle:209,hedge:136,crow:209,gull:209};
var BSTAGE=5760,BSEA=['Höhle','Grat'],BNAME=['Die Höhle','Der Gebirgsgrat'],BLINE=[
 'Bonus 1: Die Kluterthöhle. Hier unten gibt es keine Aussicht, dafür Tropfen.',
 'Bonus 2: Der Gipfelgrat. Links und rechts geht es tief runter. Der Wegweiser rät: nicht hinsehen.'];
HIT.stalag=['Der Stalagmit wächst seit Jahrtausenden. Mo hat ihn in einer Sekunde gefunden.','Spitz ist hier keine Redewendung.','Stalagmit eins, Würde null. Er hatte viel Zeit zum Üben.'];
HIT.stalag2=HIT.stalag;
HIT.pfuetze=['Die Pfütze war tiefer, als sie aussah. Das sind alle Pfützen.','Nasse Socken. Der Wegweiser hat sie nicht gezählt, aber bemerkt.','Pfütze eins, Stiefel null. Wasserdicht stand nur auf dem Karton.'];
HIT.stalak=['Der Stalaktit hängt hier seit Jahrtausenden. Mo hat ihn trotzdem übersehen.','Ducken heißt: nicht nur den Kopf einziehen. Eher alles.','Merke: Stalaktiten hängen oben, Stalagmiten stehen unten. Mo merkt es sich jetzt.'];
HIT.bat=['Der Schwarm hat ein Radar. Mo hatte Pech.','Fledermausschwarm getroffen. Sie sind nachtaktiv, Mo gerade auch.','Mo ist in einen Fledermausschwarm geraten. Alle haben gequiekt, Mo auch.'];
HIT.gap=['Da war eine Lücke im Grat. Mo hat sie mit dem Fuß gefunden. Das Geröll rutscht zum Glück nach.','Der Abgrund ist tief. Der Rand war zum Glück näher.','Vorsicht, Schlucht. Steht auf keinem Schild, ist aber so.'];
HIT.boulder=['Der Felsbrocken liegt seit der Eiszeit hier und bleibt gelassen.','Brocken getroffen. Der Brocken war vorher da.','Der Fels hat keinen Plan, aber er steht im Weg.'];
HIT.steinmann=['Das Steinmännchen zeigt den Weg und steht im Weg. Das ist ein Widerspruch.','Steinmännchen umgeworfen. Das ist unfein, Wanderer bauen das stundenlang auf.','Das Steinmännchen hat nichts gesagt. Es hat nur gewackelt.'];
HIT.dohle=['Die Dohle fliegt tief. Mo geht aufrecht. Das passt nicht.','Alpendohlen klauen Brote. Diesmal nur einen Moment Aufmerksamkeit.','Die Dohle hat nur gekrächzt. Der Rest war Mo.'];
HIT.felsnase=['Die Felsnase ragt in den Weg. Sie weiß nichts davon.','Felsnase eins, Mütze null. Mo behält Haltung. Fast.','Ducken ist keine Schande. Die Felsnase gewinnt immer.'];
DODGE.stalag=['Über den Stalagmiten. Er sieht aus wie ein Zahn, aber nicht wie einer von Mo.','Spitz, aber verpasst. Der Stalagmit nimmt’s gelassen.'];
DODGE.stalag2=['Zwei Spitzen, ein Sprung. Das nennt man Effizienz.','Über das Zahnpaar. Der Wegweiser nickt, falls er Nicken könnte.'];
DODGE.pfuetze=['Trockenen Fußes drüber. Der Wegweiser ist beeindruckt, wie bei Pfützen immer.','Pfütze übersprungen. Sie schaut ihm nach, spiegelnd.'];
DODGE.stalak=['Geduckt. Der Stalaktit hängt weiter, das ist sein Beruf.','Unten durch. Das war knapp und trotzdem lässig.'];
DODGE.bat=['Geduckt. Der Schwarm hat gar nichts bemerkt, glaubt er.','Schwarm unterquert. Sie nehmen es nicht persönlich.'];
DODGE.gap=['Über die Lücke. Der Abgrund guckt enttäuscht.','Gesprungen. Unten geht es noch eine Weile weiter nach unten.'];
DODGE.boulder=['Über den Brocken. Er bleibt, wo er seit der Eiszeit ist.','Felsbrocken überhüpft. Applaus bleibt aus, Gestein klatscht selten.'];
DODGE.steinmann=['Über das Steinmännchen. Wer es gebaut hat, ist dankbar.','Steinmännchen heil gelassen. Der Wegweiser vermerkt das.'];
DODGE.dohle=['Geduckt. Das Brot ist sicher, wenn auch nur imaginär.','Die Dohle schimpft. Mo duckt sich, die Dohle schimpft weiter.'];
DODGE.felsnase=['Unter der Felsnase durch. Sie ragt weiter, ohne es zu merken.','Geduckt, Mütze behalten. Gut gelaufen.'];
var BSEA2=['Moor','Küste'],BNAME2=['Das Moor','Die Küste'],BLINE2=[
 'Bonus 3: Das Moor. Das Schild sagt Wupperzonas, der Wegweiser sagt: Nebel, Bohlen, Igel.',
 'Bonus 4: Die Steilküste. Sturmwarnung, Möwen und eine Robbe, die zuerst da war.'];
var BWINS2=['Fischbude erreicht. Das Ziel war also ein Brötchen. Der Wegweiser hat es nicht kommen sehen.','Angekommen. Mo isst, der Wegweiser schaut zu und hat keinen Mund.'];
HIT.hedge=['Der Igel hatte Vorfahrt. Er hat es nicht einmal erwähnt.','Igel eins, Würde null. Die Stacheln waren nur der Anfang.','Mo ist auf den Igel getreten. Der Igel hat es ihm nicht übel genommen, nur Mo.'];
HIT.crow=['Die Krähe fliegt auf Kopfhöhe. Das ist genau Mos Höhe, leider.','Krähen kennen keine Vorfahrtsregeln. Und Mo kennt keine Krähen.','Die Krähe hat gekrächzt, Mo hat gestolpert. Das passt zusammen.'];
HIT.seal=['Die Robbe lag zuerst da. Sie ist da sehr klar.','Mo ist über die Robbe gestolpert. Sie hat nur ein Auge geöffnet.','Robbe eins, Würde null. Sie hat es nicht einmal gemerkt.'];
HIT.gull=['Die Möwe hat Mo für ein Fischbrötchen gehalten. Das ist eine Frage der Perspektive.','Möwe getroffen. Sie hat geschrien, Mo auch, dann haben beide geschrien.','Die Möwe kam von vorn, mit Wind. Dagegen hilft nur Ducken.'];
HIT.gap2=['Da war eine Lücke im Steg. Das Moor darunter ist weicher, als es aussieht.','Mo hat die Bohle verpasst und das Wasser gefunden. Die Socken sind jetzt Moor.','Fehltritt im Bohlensteg. Die Lücke war schon vorher da, Mo auch.'];
DODGE.gap2=['Über die Lücke im Steg. Das Moor schaut enttäuscht nach oben.','Gesprungen. Die fehlende Bohle bleibt fehlend, Mo bleibt trocken.'];
DODGE.hedge=['Über den Igel. Er schaut hoch und rollt sich lieber nicht ein.','Gesprungen. Der Igel hat noch nicht bemerkt, dass er übersprungen wurde.'];
DODGE.crow=['Geduckt. Die Krähe krächzt, als hätte sie es kommen sehen.','Unter der Krähe durch. Sie dreht sich um und schimpft.'];
DODGE.seal=['Über die Robbe gehüpft. Sie schnarcht weiter, das ist ein Kompliment.','Leise drüber. Die Robbe atmet ein, atmet aus und dreht sich nicht um.'];
DODGE.gull=['Geduckt. Die Möwe segelt vorbei und beschwert sich im Vorbeiflug.','Unter der Möwe durch. Sie schaut enttäuscht, es gab nichts zu holen.'];
/* ---------- Bonus 5 und 6: Bergische Altstadt (Abend) und alter Friedhof (Nacht) ---------- */
var BSEA3=['Altstadt','Friedhof'],BNAME3=['Die Altstadt','Der Friedhof'],BLINE3=[
 'Bonus 5: Die Altstadt. Schiefer, grüne Schlagläden und Hundehaufen, die niemand eingesteckt hat.',
 'Bonus 6: Der alte Friedhof bei Nacht. Der Wegweiser bleibt am Tor stehen und wünscht viel Erfolg.'];
var BWINS3=['Kapelle erreicht. Es brennt Licht, im Fenster hängt „Zimmer frei“. Mo bleibt lieber stehen.','Geschafft. Der Wegweiser wartet am Tor und behauptet, er hätte keine Angst gehabt.'];
S['Altstadt']={sky:['#a9c9e0','#c4d6d8','#e8d6b0','#f6e2b8'],sun:'#ffd9a0',mt:'#7fa58c',hill:['#86ad8e','#6f9a7e'],tree:['#4a7a55','#2d5a35'],pine:false,gr:'#7a6f63',path:'#8a7f72',fg:'#2f4a35',trunk:'#2b2f38',leaf:'#3a5a38',snow:false,night:false,k:'town'};
S['Friedhof']={sky:['#090c1c','#12162e','#1a1c3a','#242848'],sun:'#e8d8a8',mt:'#14182c',hill:['#14182c','#10142a'],tree:['#0c1020','#080c18'],pine:false,gr:'#1a1a28',path:'#3a3340',fg:'#0a0c18',trunk:'#0a0c18',leaf:'#0a0c18',snow:false,night:true,k:'grave'};
var CHX=2880,MEMX=3210,PFX=5200,GATEX=5700,ALTK=['flasche','flasche','flasche','pet','droeppel','waffel'],FRIEDK=['kerze','laterne','kuerbis'];
var BON3={kack:1,tonne:1,rad:1,tauben:1,wagen:1,grab:1,kreuz:1,kerzeo:1,katze:1,geist:1};
Object.keys(BON3).forEach(function(k){BON[k]=1});
LUFT.tauben=1;LUFT.geist=1;
HW.kack=16;HW.tonne=19;HW.rad=27;HW.tauben=34;HW.wagen=26;HW.grab=19;HW.kreuz=14;HW.kerzeo=18;HW.katze=18;HW.geist=22;
HH.kack=22;HH.tonne=36;HH.rad=32;HH.tauben=30;HH.wagen=28;HH.grab=44;HH.kreuz=46;HH.kerzeo=30;HH.katze=26;HH.geist=30;
APP.wagen=.3;OFF.wagen=136;APP.katze=.45;OFF.katze=183;APP.geist=.35;OFF.geist=153;
HIT.kack=['Mo ist in ein Hundehäufchen getreten. Der Wegweiser tut so, als hätte er nichts gesehen.','Glück im Unglück, sagt man. Der Schuh sieht das anders.','Eine Tüte hätte gereicht. Eine Tüte lag leider nicht hier.'];
HIT.tonne=['Die Mülltonne stand schon da. Sie war sogar leer, das macht es nicht besser.','Mo ist gegen die Tonne gelaufen. Sie hat gescheppert, Mo auch.','Tonne eins, Würde null. Abholung ist erst Donnerstag.'];
HIT.rad=['Das Fahrrad lehnte so unschuldig da. Es hatte einen Lenker, Mo hatte keine Chance.','Mo hat das Fahrrad umgerannt. Ein Schloss hatte es nicht, Mitleid auch nicht.','Fahrrad eins, Würde null. Der Sattel guckt weg.'];
HIT.tauben=['Der Taubenschwarm kam tief. Tauben haben kein Verständnis für Fußgänger.','Mo ist in die Tauben gelaufen. Sie haben gegurrt, als wäre das ihr Platz.','Federn überall. Der Wegweiser zählt sie nicht mit.'];
HIT.wagen=['Der Bollerwagen hatte Schwung und keinen Fahrer. Das ist selten gut.','Wagen eins, Würde null. Das Pfand ist nicht im Preis enthalten.','Der Wagen rollte von allein heran. Mo hat zu spät gemerkt, dass er nicht bremst.'];
HIT.grab=['Der Grabstein hat sich nicht gerührt. Er hat Erfahrung darin.','Mo ist gegen einen Grabstein gelaufen. Hier ruhen Würde und Geduld.','Grabstein eins, Würde null. Der Stein bleibt gelassen.'];
HIT.kreuz=['Das Kreuz stand schief im Weg. Mo ist nicht schief, stolpert aber gern.','Mo ist gegen das Kreuz gelaufen. Nichts ist passiert, außer dass es weh tut.','Kreuz eins, Würde null. Der Wegweiser sagt nichts, er hat Respekt.'];
HIT.kerzeo=['Mo ist in die roten Kerzen gelaufen. Zum Glück nur Wachs, kein Gespenst.','Die Kerzen flackerten, Mo auch. Dann war es kurz sehr hell.','Rote Kerzen sind kein Hindernis, solange man sie sieht. Mo hat nicht geschaut.'];
HIT.katze=['Die schwarze Katze lief quer. Das gilt als Unglück, vor allem für Mo.','Mo und die Katze haben sich getroffen. Die Katze hat es überlebt, Mo auch, knapp.','Katze eins, Würde null. Sie hat nicht einmal gemiaut, nur geschaut.'];
HIT.geist=['Der Geist ist durch Mo hindurch geschwebt. Das fühlt sich an, wie es klingt.','Buh. Mo hat sich erschreckt, der Geist auch, ein bisschen.','Geist eins, Würde null. Geister haben immer Vorfahrt, auch ohne Schild.'];
DODGE.kack=['Über das Häufchen. Der Hund bleibt anonym, die Tüte auch.','Elegant gesprungen. Mo schuldet dem Hund nichts.'];
DODGE.tonne=['Über die Tonne. Sie bleibt stehen, bis Donnerstag.','Gesprungen. Der Deckel hat sich nicht einmal bewegt.'];
DODGE.rad=['Über das Fahrrad. Der Besitzer ist unbekannt, aber vermutlich dankbar.','Gesprungen. Das Rad lehnt weiter, das ist sein Beruf.'];
DODGE.tauben=['Geduckt. Die Tauben fliegen weiter und tun so, als wäre nichts gewesen.','Unter dem Schwarm durch. Eine Taube hat noch kurz hinterhergeschaut.'];
DODGE.wagen=['Über den Bollerwagen. Er rollt weiter, kein Fahrer weit und breit.','Gesprungen. Der Wagen hat sich nicht entschuldigt, er hat ja auch keinen Mund.'];
DODGE.grab=['Über den Grabstein. Respektvoll, aber mit Schwung.','Gesprungen. Der Stein nickt nicht, er ist ja aus Stein.'];
DODGE.kreuz=['Über das Kreuz. Der Wegweiser sagt nichts, er hat Respekt.','Gesprungen. Das Kreuz blieb stehen, schief wie vorher.'];
DODGE.kerzeo=['Über die Kerzen. Sie flackern anerkennend.','Gesprungen. Die Flammen haben nicht einmal gezuckt.'];
DODGE.katze=['Über die Katze. Sie hat nur kurz die Augen verengt.','Haarscharf. Die Katze nennt das Reaktionsvermögen, Mo nennt es Glück.'];
DODGE.geist=['Geduckt. Der Geist schaut verdutzt und schwebt weiter.','Unter dem Geist durch. Er sagt noch kurz Buh, aber ohne Überzeugung.'];
var TT=0,RN=0,CAFEX=2050,CAFEI=1,ZRX=900,ZN1=1110,ZN2=1235,ZFX=1470;
function mix3(a,b,c,t){return t<.5?mix(a,b,t*2):mix(b,c,t*2-1)}
function tTown(){return ez(cl((g.run-1900)/(BSTAGE-1900),0,1))}
function rainTown(){return 1-ez(cl((g.run-350)/1500,0,1))}
function eur(c){return Math.floor(c/100)+','+('0'+(c%100)).slice(-2)+' €'}
function litWin(seed,t){var a=Math.max(t>.28?Math.min(1,(t-.28)*2.4):0,RN*.9);return R(seed)>.32?a:0}
/* Dröppelminna: bergische Kaffeekanne mit Hahn am Boden */
function droeppelDraw(cx,by,s,ts){
 x.save();x.translate(cx,by);x.scale(s,s);
 x.fillStyle='#2b5aa5';x.beginPath();x.moveTo(-10,0);x.lineTo(-8,-20);x.lineTo(8,-20);x.lineTo(10,0);x.closePath();x.fill();
 x.fillStyle='#eef2f2';x.beginPath();x.moveTo(-9.2,-2);x.lineTo(-7.4,-18);x.lineTo(7.4,-18);x.lineTo(9.2,-2);x.closePath();x.fill();
 x.fillStyle='#2b5aa5';x.fillRect(-9.6,-9,19.2,2.6);
 x.fillStyle='#d9dede';x.beginPath();x.ellipse(0,-20,8.4,2.4,0,Math.PI,0);x.fill();x.fillStyle='#2b5aa5';x.beginPath();x.ellipse(0,-21.6,5.4,3,0,Math.PI,0);x.fill();ellc(0,-26,2.2,2.2,'#2b5aa5');
 x.strokeStyle='#2b5aa5';x.lineWidth=2.4;x.beginPath();x.moveTo(8,-17);x.quadraticCurveTo(18,-18,15,-5);x.lineTo(9.4,-4);x.stroke();
 x.fillStyle='#c9a24a';x.fillRect(-15,-7,7,3.6);x.fillRect(-14,-3.6,2.6,4);
 var u=((ts||NOW)/700)%1;ellc(-12.7,1+u*6,1.3,1.8,'rgba(90,50,24,'+(1-u)+')');
 x.restore()}
function wheel(cx,cy,r,a){x.fillStyle='rgba(255,255,255,.12)';x.beginPath();x.arc(cx,cy,r,0,6.3);x.fill();x.strokeStyle='#1c1c22';x.lineWidth=2.4;x.beginPath();x.arc(cx,cy,r,0,6.3);x.stroke();x.lineWidth=.8;x.strokeStyle='#b0b4bc';x.beginPath();for(var k=0;k<6;k++){var an=a+k*1.047;x.moveTo(cx,cy);x.lineTo(cx+Math.cos(an)*r,cy+Math.sin(an)*r)}x.stroke()}
function slateLines(l,y0,w,h){x.strokeStyle='rgba(255,255,255,.08)';x.lineWidth=1;x.beginPath();for(var yy=y0+5,r=0;yy<y0+h;yy+=5,r++){x.moveTo(l,yy);x.lineTo(l+w,yy);for(var xx=l+(r%2?4:0);xx<l+w;xx+=8){x.moveTo(xx,yy);x.lineTo(xx,yy+5)}}x.stroke()}
function archPath(cx,top,w,bot){x.beginPath();x.moveTo(cx-w/2,bot);x.lineTo(cx-w/2,top+w/2);x.arc(cx,top+w/2,w/2,Math.PI,0);x.lineTo(cx+w/2,bot);x.closePath()}
function townWin(cx,cy,ww,wh,seed,t,box){
 var lit=litWin(seed,t),sw=ww*.45,shut=mix('#2f7a42','#15301f',t),trim=mix('#f4f1ea','#8a88a0',t);
 x.fillStyle=shut;x.fillRect(cx-ww/2-sw-2,cy-wh/2-1,sw,wh+2);x.fillRect(cx+ww/2+2,cy-wh/2-1,sw,wh+2);
 x.fillStyle='rgba(0,0,0,.22)';for(var s=1;s<5;s++){var yy=cy-wh/2-1+s*(wh+2)/5;x.fillRect(cx-ww/2-sw-2,yy,sw,.9);x.fillRect(cx+ww/2+2,yy,sw,.9)}
 x.fillStyle=trim;x.fillRect(cx-ww/2-2,cy-wh/2-2,ww+4,wh+4);
 x.fillStyle=lit>0?mix('#40526a','#ffd57a',lit):mix('#3d5368','#141a30',t);x.fillRect(cx-ww/2,cy-wh/2,ww,wh);
 x.fillStyle=trim;x.fillRect(cx-.6,cy-wh/2,1.2,wh);x.fillRect(cx-ww/2,cy-.6,ww,1.2);
 if(box){x.fillStyle='#5a3a22';x.fillRect(cx-ww/2-3,cy+wh/2+1,ww+6,5);[-5,0,5].forEach(function(d,j){ellc(cx+d,cy+wh/2,2.6,2.3,j===1?'#e8607a':'#d83a3a')})}}
function townHouse(px,i,t,hb){
 var w=128+R(i+3)*40,l=px-w/2,r=px+w/2,k=Math.floor(R(i+7)*3),h1=46,h2=40,rh=44+R(i+11)*12,yt=hb-h1-h2,
  slate=mix('#4a525e','#1c2030',t),slate2=mix('#59626f','#272c40',t),trim=mix('#f4f1ea','#8a88a0',t),dc=mix('#265038','#12261c',t),
  wall=k===0?slate:k===1?mix('#ece6d8','#5c5a74',t):mix('#e8dfc8','#5a566e',t);
 x.fillStyle=wall;x.fillRect(l,hb-h1,w,h1);x.fillStyle=slate;x.fillRect(l,yt,w,h2);
 if(k===0)slateLines(l,hb-h1,w,h1);slateLines(l,yt,w,h2);
 if(k===2){x.fillStyle=mix('#3a2a22','#14101a',t);[l,r-3,l+w*.34,l+w*.66].forEach(function(bx){x.fillRect(bx,hb-h1,3,h1)});x.fillRect(l,hb-h1,w,3);x.fillRect(l,hb-4,w,4);
  x.strokeStyle=mix('#3a2a22','#14101a',t);x.lineWidth=2.4;x.beginPath();x.moveTo(l+3,hb-4);x.lineTo(l+w*.34,hb-h1+3);x.moveTo(r-3,hb-4);x.lineTo(l+w*.66,hb-h1+3);x.stroke()}
 x.fillStyle=trim;x.fillRect(l-2,hb-h1-1.5,w+4,3);
 /* Dach */
 x.fillStyle=slate;x.beginPath();x.moveTo(l-9,yt);x.lineTo(px,yt-rh);x.lineTo(r+9,yt);x.closePath();x.fill();
 x.save();x.clip();slateLines(l-9,yt-rh,w+18,rh);x.restore();
 x.strokeStyle=slate2;x.lineWidth=2;x.beginPath();x.moveTo(l-9,yt);x.lineTo(px,yt-rh);x.lineTo(r+9,yt);x.stroke();
 x.fillStyle=mix('#6b4a40','#2a2028',t);x.fillRect(px+w*.2,yt-rh*.55,9,rh*.5);x.fillStyle=slate2;x.fillRect(px+w*.2-1.5,yt-rh*.55-3,12,3);
 if(t>.4){for(var s=0;s<3;s++){var u=((NOW/3000+s/3+i*.17)%1);ellc(px+w*.2+4.5+u*10,yt-rh*.55-8-u*26,3+u*4,3+u*4,'rgba(220,214,228,'+(.4*(1-u))+')')}}
 if(k!==2){var ol=litWin(i+70,t);ellc(px,yt-rh*.4,7.5,7.5,trim);ellc(px,yt-rh*.4,5.6,5.6,ol>0?mix('#40526a','#ffd57a',ol):mix('#3d5368','#141a30',t))}
 /* Fenster, Tür */
 townWin(px-w*.3,hb-h1-h2/2,15,20,i*5+1,t,false);townWin(px,hb-h1-h2/2,15,20,i*5+2,t,false);townWin(px+w*.3,hb-h1-h2/2,15,20,i*5+3,t,false);
 townWin(px-w*.3,hb-h1/2-3,15,20,i*5+4,t,R(i+20)>.4);townWin(px+w*.3,hb-h1/2-3,15,20,i*5+5,t,R(i+21)>.4);
 x.fillStyle=trim;archPath(px,hb-37,22,hb);x.fill();x.fillStyle=dc;archPath(px,hb-35,18,hb);x.fill();
 x.fillStyle='#d9b34a';x.fillRect(px+4,hb-17,2,3);
 if(t>.3||RN>.05){var dl=Math.max(t>.3?Math.min(1,(t-.3)*2):0,RN*.8);x.fillStyle='rgba(255,208,120,'+(.8*dl)+')';x.fillRect(px+13,hb-30,4,6);var gg=x.createRadialGradient(px+15,hb-27,1,px+15,hb-27,26);gg.addColorStop(0,'rgba(255,208,120,'+(.4*dl)+')');gg.addColorStop(1,'rgba(255,208,120,0)');x.fillStyle=gg;x.beginPath();x.arc(px+15,hb-27,26,0,6.3);x.fill()}
 if(i%8===3){x.fillStyle=mix('#c9a26a','#5a4a3a',t);x.fillRect(px-17,hb-h1+4,34,10);x.fillStyle=mix('#3a2918','#e8d8b0',t);x.font='bold 8px system-ui,sans-serif';x.textAlign='center';x.fillText('Café',px,hb-h1+12);x.textAlign='left'}}
function townChurch(q,t,hb){
 var pl=mix('#ebe4d2','#5e5c78',t),pl2=mix('#d9d1bc','#4e4c68',t),sl=mix('#434b57','#181c2c',t),sl2=mix('#555e6c','#242a3e',t),trim=mix('#f4f1ea','#8a88a0',t),lit=Math.min(1,Math.max(0,(t-.2)*2.2)),gl=mix('#47607a','#ffc86a',lit);
 x.fillStyle=pl;x.fillRect(q-250,hb-84,218,84);poly([q-262,hb-84,q-238,hb-126,q-30,hb-126,q-30,hb-84],sl);slateLines(q-262,hb-126,232,42);x.fillStyle=sl2;x.fillRect(q-262,hb-86,232,3);
 [-224,-184,-144,-104,-64].forEach(function(d){x.fillStyle=trim;archPath(q+d,hb-78,18,hb-24);x.fill();x.fillStyle=gl;archPath(q+d,hb-76,14,hb-26);x.fill();x.fillStyle=trim;x.fillRect(q+d-.6,hb-72,1.2,46)});
 x.fillStyle=pl;x.fillRect(q-34,hb-156,68,156);x.fillStyle=pl2;x.fillRect(q+16,hb-156,18,156);
 x.fillStyle=trim;archPath(q,hb-40,26,hb);x.fill();x.fillStyle=mix('#4a3020','#1e1418',t);archPath(q,hb-38,22,hb);x.fill();
 if(lit>0){x.fillStyle='rgba(255,200,110,'+(.35*lit)+')';archPath(q,hb-38,22,hb);x.fill()}
 x.fillStyle=trim;archPath(q,hb-84,12,hb-62);x.fill();x.fillStyle=gl;archPath(q,hb-82,8,hb-64);x.fill();
 ellc(q,hb-110,13,13,mix('#cdb06a','#6a5a40',t));ellc(q,hb-110,11,11,mix('#f4f0e0','#9a98a8',t));
 x.strokeStyle='#1d1d24';x.lineWidth=1.8;x.lineCap='round';var ha=7/12*6.2832-1.5708;x.beginPath();x.moveTo(q,hb-110);x.lineTo(q+Math.cos(ha)*6,hb-110+Math.sin(ha)*6);x.moveTo(q,hb-110);x.lineTo(q,hb-118.5);x.stroke();x.lineCap='butt';
 [-14,14].forEach(function(d){x.fillStyle=mix('#2a2430','#0e0c18',t);archPath(q+d,hb-150,11,hb-130);x.fill();x.strokeStyle='rgba(255,255,255,.12)';x.lineWidth=1;x.beginPath();for(var s=0;s<4;s++){x.moveTo(q+d-5,hb-142+s*4.5);x.lineTo(q+d+5,hb-142+s*4.5)}x.stroke()});
 x.fillStyle=sl2;x.fillRect(q-38,hb-158,76,4);
 poly([q-40,hb-156,q,hb-238,q,hb-156],sl);poly([q,hb-238,q+40,hb-156,q,hb-156],sl2);
 x.strokeStyle='rgba(255,255,255,.1)';x.lineWidth=1;x.beginPath();for(var s=1;s<7;s++){var yy=hb-156-s*12,hw=40*(1-s*12/82);x.moveTo(q-hw,yy);x.lineTo(q+hw,yy)}x.stroke();
 ellc(q,hb-240,3.4,3.4,'#d9b34a');x.fillStyle='#d9b34a';x.fillRect(q-1,hb-257,2,15);x.fillRect(q-5,hb-252,10,2)}
function townLinde(px,t,hb){
 var c1=mix('#b9b04a','#383a34',t),c2=mix('#a4a040','#2a3030',t),c3=mix('#cfc45a','#4a4a3c',t);
 x.fillStyle='rgba(0,0,0,.18)';x.beginPath();x.ellipse(px,hb+4,42,5,0,0,6.3);x.fill();
 x.fillStyle=mix('#4a3322','#1a1418',t);x.beginPath();x.moveTo(px-7,hb+2);x.lineTo(px-4,hb-62);x.lineTo(px+4,hb-62);x.lineTo(px+7,hb+2);x.closePath();x.fill();
 ellc(px,hb-96,46,34,c1);ellc(px-34,hb-76,28,23,c2);ellc(px+34,hb-78,28,23,c2);ellc(px-6,hb-110,24,16,c3);
 x.fillStyle=mix('#6b4a2c','#2a2020',t);x.fillRect(px+50,hb-9,34,3);x.fillRect(px+52,hb-6,3,10);x.fillRect(px+79,hb-6,3,10);x.fillRect(px+50,hb-17,34,2.5)}
function townFountain(px,t,hb,ts){
 var st=mix('#9a9a94','#44445a',t),st2=mix('#7f7f7a','#363648',t),wa=mix('#6fb2d8','#2a3d6a',t);
 x.fillStyle='rgba(0,0,0,.18)';x.beginPath();x.ellipse(px,hb+11,42,5,0,0,6.3);x.fill();
 x.fillStyle=st2;x.fillRect(px-36,hb-4,72,14);x.fillStyle=st;x.beginPath();x.ellipse(px,hb-4,38,7,0,0,6.3);x.fill();ellc(px,hb-4,33,5,wa);
 x.fillStyle=st;x.fillRect(px-4,hb-52,8,48);ellc(px,hb-52,16,4,st);ellc(px,hb-52,12,2.6,wa);ellc(px,hb-58,5,5,st);
 x.lineWidth=1.4;[-2,-1,1,2].forEach(function(a){var u0=(ts/900+a*.27)%1;x.strokeStyle='rgba(200,230,248,'+(t>.6?.4:.7)+')';x.beginPath();x.moveTo(px,hb-58);x.quadraticCurveTo(px+a*13,hb-84,px+a*24,hb-8);x.stroke();
  var dx=(1-u0)*(1-u0)*px+2*(1-u0)*u0*(px+a*13)+u0*u0*(px+a*24),dy=(1-u0)*(1-u0)*(hb-58)+2*(1-u0)*u0*(hb-84)+u0*u0*(hb-8);ellc(dx,dy,1.7,1.7,'rgba(230,246,255,.9)')})}
function townMemorial(px,t,hb,ts){
 var gr=mix('#7d8288','#3c4056',t),gr2=mix('#62676d','#2c3044',t),gr3=mix('#9aa0a6','#4c5068',t);
 x.fillStyle=gr;x.fillRect(px-38,hb+3,76,7);x.fillStyle=gr3;x.fillRect(px-31,hb-3,62,6);x.fillStyle=gr;x.fillRect(px-25,hb-9,50,6);
 poly([px-14,hb-9,px-11,hb-80,px+11,hb-80,px+14,hb-9],gr);poly([px+4,hb-9,px+6,hb-80,px+11,hb-80,px+14,hb-9],gr2);poly([px-13,hb-80,px,hb-94,px+13,hb-80],gr3);
 x.fillStyle=gr2;x.fillRect(px-1.8,hb-72,3.6,20);x.fillRect(px-6,hb-66,12,3.4);
 bush(px-48,hb+4,11,mix('#3f7a3c','#1b3524',t));bush(px+48,hb+4,11,mix('#3f7a3c','#1b3524',t));
 x.strokeStyle=mix('#4a7a40','#203a2a',t);x.lineWidth=2.4;x.beginPath();x.arc(px,hb-25,7,0,6.3);x.stroke();ellc(px+5,hb-28,1.6,1.6,'#c0392b');ellc(px-5,hb-22,1.6,1.6,'#c0392b');
 redCandle(px+22,hb+3,ts/1000,3,.8)}
function townLamp(q,t,hb){
 var lit=Math.max(Math.min(1,Math.max(0,(t-.18)*3)),RN*.8),iron=mix('#1f2a24','#0a0e12',t);
 x.fillStyle='rgba(0,0,0,.18)';x.beginPath();x.ellipse(q,hb+9,7,2,0,0,6.3);x.fill();
 x.fillStyle=iron;x.fillRect(q-1.6,hb-72,3.2,80);x.fillRect(q-4,hb+3,8,5);
 poly([q-7,hb-88,q+7,hb-88,q+5,hb-73,q-5,hb-73],mix('#c8d8d0','#ffe08a',lit));poly([q-9,hb-88,q,hb-97,q+9,hb-88],iron);x.fillRect(q-6,hb-74,12,2);
 if(lit>0){var gg=x.createRadialGradient(q,hb-80,2,q,hb-80,78);gg.addColorStop(0,'rgba(255,214,120,'+(.42*lit)+')');gg.addColorStop(1,'rgba(255,214,120,0)');x.fillStyle=gg;x.beginPath();x.arc(q,hb-80,78,0,6.3);x.fill()}}
function crateDraw(cx,by,col){x.fillStyle=col;x.fillRect(cx-12,by-12,24,12);x.fillStyle='rgba(0,0,0,.22)';x.fillRect(cx-12,by-6,24,1.2);[-8,-2.7,2.7,8].forEach(function(d,j){x.fillStyle=j%2?'#3b8a5a':'#7a4a1c';x.fillRect(cx+d-1.8,by-19,3.6,8);x.fillStyle='#d9b34a';x.fillRect(cx+d-1.8,by-20,3.6,1.6)})}
function pfandStation(q,t,hb){
 var by=hb+9;x.fillStyle='rgba(0,0,0,.2)';x.beginPath();x.ellipse(q,by+2,46,4,0,0,6.3);x.fill();
 crateDraw(q-58,by,'#2b5aa5');crateDraw(q-58,by-12,'#a02a2a');crateDraw(q-34,by,'#2b5aa5');
 x.fillStyle=mix('#4a525e','#1c2030',t);x.fillRect(q-30,by-96,2.6,96);x.fillRect(q+28,by-96,2.6,96);poly([q-38,by-94,q-30,by-106,q+36,by-106,q+44,by-94],mix('#4a525e','#1c2030',t));
 x.fillStyle=mix('#5a6b7c','#2a3444',t);x.fillRect(q-17,by-62,34,62);x.fillStyle='rgba(255,255,255,.08)';x.fillRect(q-17,by-62,5,62);
 x.fillStyle='#0c1a14';x.fillRect(q-12,by-56,24,13);x.fillStyle='#58e08a';x.font='bold 8px system-ui,sans-serif';x.textAlign='center';x.fillText(g.pfandDone?eur(g.pfandCash):'PFAND',q,by-46.5);x.textAlign='left';
 x.fillStyle='#14181e';x.beginPath();x.roundRect(q-12,by-38,24,16,3);x.fill();ellc(q,by-30,5,5,'#05070a');x.strokeStyle='#9aa4b0';x.lineWidth=1.2;x.beginPath();x.arc(q,by-30,5,0,6.3);x.stroke();
 ellc(q+12,by-41,1.8,1.8,g.pfandDone?'#4ade80':'#ef4444');
 x.fillStyle='#0a0c10';x.fillRect(q-9,by-16,18,3);if(g.pfandDone){x.fillStyle='#fbf7ea';x.fillRect(q-6,by-12,12,8)}
 x.fillStyle=mix('#2f7a42','#15301f',t);x.fillRect(q-26,by-102,52,12);x.fillStyle='#fff';x.font='bold 8px system-ui,sans-serif';x.textAlign='center';x.fillText('Pfand zurück',q,by-93);x.textAlign='left'}
function redCandle(cx,by,tt,ph,sc){
 var fl=1+.2*Math.sin(tt*9+ph*2.3)+.1*Math.sin(tt*17+ph);
 var gg=x.createRadialGradient(cx,by-16*sc,1,cx,by-16*sc,34*sc);gg.addColorStop(0,'rgba(255,90,60,'+(.42*fl)+')');gg.addColorStop(1,'rgba(255,60,40,0)');x.fillStyle=gg;x.beginPath();x.arc(cx,by-16*sc,34*sc,0,6.3);x.fill();
 x.fillStyle='#8f1822';x.fillRect(cx-4*sc,by-14*sc,8*sc,14*sc);x.fillStyle='#e04050';x.fillRect(cx-2.4*sc,by-12*sc,2.4*sc,10*sc);x.fillStyle='#3a2a22';x.fillRect(cx-4.6*sc,by-15*sc,9.2*sc,2.4*sc);
 ellc(cx,by-19*sc,2.6*sc,4.6*sc*fl,'#ff8a30');ellc(cx,by-18.6*sc,1.4*sc,3*sc*fl,'#ffe090')}
function graveGate(q,tt,hb){
 var st='#5a5f78',st2='#3c4058',iron='#14141c';
 [-1,1].forEach(function(sd){var px=q+sd*46;x.fillStyle=st;x.fillRect(px-9,hb-84,18,84);x.fillStyle=st2;x.fillRect(px+(sd>0?2:-9),hb-84,7,84);poly([px-12,hb-84,px,hb-98,px+12,hb-84],st);
  ellc(px-2,hb-76,7,5,'#2f5a38');ellc(px+3,hb-58,5,6,'#2f5a38');
  x.strokeStyle=iron;x.lineWidth=1.8;x.beginPath();for(var b=0;b<5;b++){x.moveTo(q+sd*(36-b*3.6),hb-2);x.lineTo(q+sd*(36-b*3.6),hb-76+b*2)}x.moveTo(q+sd*36,hb-74);x.lineTo(q+sd*18,hb-64);x.stroke()});
 x.strokeStyle=iron;x.lineWidth=3;x.beginPath();x.moveTo(q-46,hb-98);x.quadraticCurveTo(q,hb-134,q+46,hb-98);x.stroke();
 x.fillStyle='#4a3a2c';x.fillRect(q-30,hb-125,60,13);x.fillStyle='#e6d7aa';x.font='bold 9px system-ui,sans-serif';x.textAlign='center';x.fillText('Alter Friedhof',q,hb-115.6);x.textAlign='left';
 redCandle(q-46,hb-96,tt,0,.9);redCandle(q+46,hb-96,tt,2,.9)}
function drawTown(ts){
 var t=tTown(),o=D,hb=FY-12,i,q,P=S['Altstadt'],rn=rainTown();TT=t;RN=rn;
 x.fillStyle=grad(0,hb,mix(mix3('#7fb8e4','#d9805a','#262552',t),'#6b7480',rn*.85),mix(mix3('#f7e6bd','#f8bf78','#7c4a6c',t),'#a4acb4',rn*.85));x.fillRect(0,0,W,H);
 var sy=88+t*150,sg=x.createRadialGradient(470,sy,4,470,sy,96);sg.addColorStop(0,'rgba(255,236,170,'+(.85*(1-t*.6)*(1-rn))+')');sg.addColorStop(1,'rgba(255,200,120,0)');x.fillStyle=sg;x.beginPath();x.arc(470,sy,96,0,6.3);x.fill();
 x.globalAlpha=1-rn;ellc(470,sy,22,22,mix('#fff4c0','#ff9a50',t));x.globalAlpha=1;
 /* Regenbogen kurz nach dem Aufklaren */
 var rb=(1-rn)*(1-cl(t*3,0,1))*rn*4;if(rb>.02){x.globalAlpha=Math.min(.5,rb*.5);['#e0584a','#e8a24a','#e8d85a','#6cba5a','#5a9ad8','#7a64c0'].forEach(function(c,j){x.strokeStyle=c;x.lineWidth=5;x.beginPath();x.arc(300,hb+80,330-j*5,Math.PI*1.12,Math.PI*1.88);x.stroke()});x.globalAlpha=1}
 if(t>.5){x.globalAlpha=(t-.5)*2;for(i=0;i<24;i++){x.fillStyle='#eef0ff';x.fillRect((i*89)%W,(i*41)%110,1.6,1.6)}ellc(110,62,13,13,'#f2ecd0');x.globalAlpha=1}
 cloud(md(150-o*.03,W+200)-100,56,1.0,.8*(1-t*.75));cloud(md(430-o*.02,W+200)-100,92,.8,.7*(1-t*.75));
 if(rn>.02){x.fillStyle='rgba(70,78,92,'+(rn*.5)+')';for(i=0;i<7;i++){var cq=md(i*130-ts*.01-o*.02,W+260)-130;ellc(cq,30+R(i+90)*50,110,26,x.fillStyle)}}
 hills(o*.05,196,18,2,0,8,5,1.3,mix('#86ad8e','#2e3652',t),'rgba(255,255,255,.15)');
 layer(P,o*.2,224,34,44,true,3);
 hills(o*.1,230,12,3,2,6,7,.4,mix('#6f9a7e','#262d48',t),'rgba(255,255,255,.12)');
 x.fillStyle='rgba(40,28,84,'+(t*.34)+')';x.fillRect(0,0,W,hb);
 if(rn>.02){x.fillStyle='rgba(120,132,148,'+(rn*.32)+')';x.fillRect(0,100,W,hb-100)}
 for(i=0;i<16;i++){var fw=44+R(i+60)*26,fx=md(i*92+R(i+61)*30-o*.3,1480)-70,fh=26+R(i+62)*14;if(fx<-60||fx>W+60)continue;
  x.fillStyle=mix('#9d9c9a','#34344e',t);x.fillRect(fx-fw/2,252-fh,fw,fh);poly([fx-fw/2-4,252-fh,fx,252-fh-18,fx+fw/2+4,252-fh],mix('#59616c','#202638',t));
  x.fillStyle=litWin(i+80,t)>0?'#ffd57a':mix('#51647a','#141a30',t);x.fillRect(fx-5,252-fh+7,4,6);x.fillRect(fx+3,252-fh+7,4,6)}
 x.fillStyle=mix('#8a8878','#30304a',t);x.fillRect(0,252,W,hb-252);
 /* Häuser, Kirche, Dorfplatz (1:1 mit dem Weg) */
 var run=g.run,i0=Math.floor((run-130)/208),i1=Math.floor((run+W+130)/208)+1;
 for(i=Math.max(0,i0);i<=i1;i++){var wx=i*208+110+R(i+1)*26;if((wx>CHX-310&&wx<CHX+470)||(wx>PFX-120&&wx<PFX+110)||(wx>GATEX-130&&wx<GATEX+120)||Math.abs(wx-CAFEX)<115||(wx>ZRX-120&&wx<ZFX+130))continue;q=wx-run;if(q<-130||q>W+130)continue;townHouse(q,i,t,hb)}
 var kq=CAFEX-run;if(kq>-130&&kq<W+130)townCafe(kq,t,hb,ts);
 var zq=ZRX-run;if(zq>-120&&zq<W+120)townRoentgen(zq,t,hb,ts);zq=ZN1-run;if(zq>-70&&zq<W+70)townNachbar(zq,t,hb,0);zq=ZN2-run;if(zq>-70&&zq<W+70)townNachbar(zq,t,hb,1);zq=ZFX-run;if(zq>-120&&zq<W+120)townFachwerk(zq,t,hb,ts);
 if(rn>.02){x.fillStyle='rgba(90,100,118,'+(rn*.26)+')';x.fillRect(0,110,W,hb-110)}
 var cq=CHX-run;if(cq>-60&&cq<W+270)townChurch(cq,t,hb);
 /* Boden: Gehweg, Platz, Pflaster */
 x.fillStyle=mix('#a89c8c','#3e3c54',t);x.fillRect(0,hb,W,9);
 var p0=CHX-300-run,p1=CHX+470-run;if(p1>0&&p0<W){x.fillStyle=mix('#c4b8a4','#4e4c68',t);x.fillRect(Math.max(0,p0),hb,Math.min(W,p1)-Math.max(0,p0),9)}
 x.fillStyle=grad(hb+9,H,mix('#80766a','#33304a',t),mix('#665d52','#242238',t));x.fillRect(0,hb+9,W,H-hb-9);
 x.fillStyle='rgba(0,0,0,.25)';x.fillRect(0,hb+9,W,2);
 x.strokeStyle='rgba(0,0,0,.22)';x.lineWidth=1;x.beginPath();for(var r=0;r<6;r++){var yy=hb+16+r*8.5;x.moveTo(0,yy);x.lineTo(W,yy);for(var cx=-((run+(r%2)*8)%16);cx<W;cx+=16){x.moveTo(cx,yy);x.lineTo(cx,yy+8.5)}}x.stroke();
 if(rn>.02){x.fillStyle='rgba(150,170,200,'+(rn*.2)+')';x.fillRect(0,hb+9,W,H-hb-9);for(i=0;i<7;i++){var pp=md(i*150+R(i+95)*60-run,W+200)-100;ellc(pp,hb+22+R(i+96)*40,34+R(i+97)*20,4.4,'rgba(190,210,235,'+(rn*.5)+')')}}
 var kt=CAFEX-run;if(kt>-160&&kt<W+160)cafeTable(kt,t,hb,ts);
 /* Straßenmöbel */
 var lq=CHX+60-run;if(lq>-110&&lq<W+110)townLinde(lq,t,hb);
 var fq=CHX+230-run;if(fq>-60&&fq<W+60)townFountain(fq,t,hb,ts);
 var mq=MEMX-run;if(mq>-70&&mq<W+70)townMemorial(mq,t,hb,ts);
 for(i=0;i<16;i++){var lwx=260+i*420;if(Math.abs(lwx-(CHX+230))<80||Math.abs(lwx-MEMX)<70||Math.abs(lwx-PFX)<60||lwx>GATEX-70)continue;q=lwx-run;if(q>-90&&q<W+90)townLamp(q,t,hb)}
 var pq=PFX-run;if(pq>-90&&pq<W+90)pfandStation(pq,t,hb);
 var gq=GATEX-run;if(gq>-110&&gq<W+110)graveGate(gq,ts/1000,hb);
 bonusSign(420,'Altstadt')}
function townCafe(px,t,hb,ts){
 var i=CAFEI,w=128+R(i+3)*40,l=px-w/2,r=px+w/2,h1=46,h2=40;
 townHouse(px,i,t,hb);
 /* Namensschild */
 x.fillStyle=mix('#f4ecd6','#6a6070',t);x.fillRect(px-44,hb-h1-30,88,15);x.strokeStyle=mix('#6b4a2c','#2a2028',t);x.lineWidth=1.4;x.strokeRect(px-44,hb-h1-30,88,15);
 x.fillStyle=mix('#2b5aa5','#9ab0e0',t);x.font='bold 9px system-ui,sans-serif';x.textAlign='center';x.fillText('Café Dröppelminna',px,hb-h1-19.5);x.textAlign='left';
 /* gestreifte Markise */
 for(var s=0;s<9;s++){var ax=l+4+s*((w-8)/9),aw=(w-8)/9;x.fillStyle=s%2?mix('#f6f2ea','#8a88a0',t):mix('#c9372b','#5a2028',t);x.beginPath();x.moveTo(ax,hb-h1+3);x.lineTo(ax+aw,hb-h1+3);x.lineTo(ax+aw+1.5,hb-h1+16);x.quadraticCurveTo(ax+aw/2,hb-h1+21,ax-1.5,hb-h1+16);x.closePath();x.fill()}
 /* Dröppelminna als Ausleger */
 x.strokeStyle=mix('#2a2a30','#0e0e14',t);x.lineWidth=2;x.beginPath();x.moveTo(r+2,hb-h1-6);x.lineTo(r+22,hb-h1-6);x.stroke();droeppelDraw(r+22,hb-h1+8,.9,ts)}
function cafeTable(px,t,hb,ts){
 var by=hb+8,w=128+R(CAFEI+3)*40,tx=px-w*.5-30;
 /* Kreidetafel */
 x.fillStyle='rgba(0,0,0,.2)';x.beginPath();x.ellipse(px+w*.5+30,by+2,16,2.4,0,0,6.3);x.fill();
 x.strokeStyle='#5a3a22';x.lineWidth=2;x.beginPath();x.moveTo(px+w*.5+18,by);x.lineTo(px+w*.5+23,by-34);x.moveTo(px+w*.5+42,by);x.lineTo(px+w*.5+37,by-34);x.stroke();
 x.fillStyle='#26332b';x.beginPath();x.roundRect(px+w*.5+17,by-46,28,24,2);x.fill();x.strokeStyle='#8a6a40';x.lineWidth=1.6;x.stroke();
 x.fillStyle='#f4f0e0';x.font='bold 6px system-ui,sans-serif';x.textAlign='center';x.fillText('Waffeln',px+w*.5+31,by-38);x.fillText('mit Sahne',px+w*.5+31,by-31);x.fillText('& Kirschen',px+w*.5+31,by-24.5);x.textAlign='left';
 /* Tisch mit Waffel und Dröppelminna */
 x.fillStyle='rgba(0,0,0,.18)';x.beginPath();x.ellipse(tx,by+2,26,3,0,0,6.3);x.fill();
 x.fillStyle='#5a3a22';x.fillRect(tx-1.5,by-22,3,22);ellc(tx,by-23,22,4,mix('#f4ecd6','#7a7088',t));x.fillStyle='#b83a30';x.fillRect(tx-22,by-24,44,1.6);
 [-30,30].forEach(function(d){x.fillStyle='#6b4a2c';x.fillRect(tx+d-6,by-14,12,2.4);x.fillRect(tx+d-5,by-14,1.6,14);x.fillRect(tx+d+3.4,by-14,1.6,14);x.fillRect(tx+d+(d<0?-6:4),by-26,2,12)});
 waffelDraw(tx-9,by-26,.9);droeppelDraw(tx+11,by-26,.62,ts);
 for(var s=0;s<3;s++){var u=((ts/1400+s/3)%1);ellc(tx+11+Math.sin(u*6+s)*3,by-48-u*22,2+u*2,2+u*2,'rgba(240,240,245,'+(.4*(1-u))+')')}}
function waffelDraw(cx,by,s){
 x.save();x.translate(cx,by);x.scale(s,s);
 ellc(0,0,12,3.4,'#f6f2ea');ellc(0,-1,10.5,2.6,'#e2ddd0');
 x.fillStyle='#d9a23a';x.beginPath();x.roundRect(-8,-8,16,8,2);x.fill();x.fillStyle='#b07a22';x.beginPath();x.roundRect(-8,-8,16,2.4,1);x.fill();
 x.strokeStyle='#8a5a18';x.lineWidth=.8;x.beginPath();for(var k=-4;k<=4;k+=4){x.moveTo(k,-8);x.lineTo(k,0)}x.moveTo(-8,-4);x.lineTo(8,-4);x.stroke();
 ellc(-2,-10,5.2,3.4,'#fffdf6');ellc(2,-12.4,3.4,2.4,'#fffdf6');
 [[-4,-8.6],[1,-9.8],[4.4,-8.2]].forEach(function(c){ellc(c[0],c[1],1.9,1.9,'#b0182c');ellc(c[0]-.5,c[1]-.5,.5,.5,'rgba(255,255,255,.7)')});
 x.restore()}
function bonusFrontTown(ts){
 var cs=D,t=TT,rn=RN;
 /* Laternen im Vordergrund ziehen vorbei */
 var FLP=1500,fo=cs*1.7;
 [200,950].forEach(function(base,bi){var q=md(base-fo,FLP)-90;if(q>-60&&q<W+60){var a=.28+.72*cl((Math.abs(q-150)-34)/120,0,1),lit=Math.max(cl((t-.18)*3,0,1),rn*.8);
  x.globalAlpha=a;x.fillStyle='rgba(0,0,0,.16)';x.beginPath();x.moveTo(q-8,H);x.lineTo(q-6,30);x.lineTo(q+16,30);x.lineTo(q+22,H);x.closePath();x.fill();
  x.fillStyle='#16201c';x.fillRect(q-5,40,10,H);x.fillRect(q-12,H-26,24,26);x.fillRect(q-8,H-34,16,10);
  x.fillRect(q-5,40,0,0);x.fillStyle='#16201c';x.beginPath();x.moveTo(q-18,30);x.lineTo(q+18,30);x.lineTo(q+10,40);x.lineTo(q-10,40);x.closePath();x.fill();
  var gl=mix('#c8d8d0','#ffe08a',lit);poly([q-15,-4,q+15,-4,q+11,30,q-11,30],gl);x.fillStyle='#16201c';x.fillRect(q-1,-4,2,34);x.fillRect(q-15,-6,30,4);
  if(lit>0){var gg=x.createRadialGradient(q,14,2,q,14,90);gg.addColorStop(0,'rgba(255,214,120,'+(.34*lit)+')');gg.addColorStop(1,'rgba(255,214,120,0)');x.fillStyle=gg;x.beginPath();x.arc(q,14,90,0,6.3);x.fill()}
  x.globalAlpha=1}});
 /* Regen */
 if(rn>.02){x.strokeStyle='rgba(215,226,240,'+(.55*rn)+')';x.lineWidth=1;x.beginPath();for(var j=0;j<90;j++){var l=.6+R(j+3)*.8,px2=md(R(j)*(W+80)-ts*.1*l-cs*.9,W+60)-30,py2=md(R(j+50)*H+ts*.55*l,H+40)-20;x.moveTo(px2,py2);x.lineTo(px2-3*l,py2+11*l)}x.stroke();x.fillStyle='rgba(20,30,50,'+(.1*rn)+')';x.fillRect(0,0,W,H)}
 for(var i=0;i<14;i++){var px=md(R(i)*(W+80)-cs*1.1-ts*.02*(1+R(i+4)),W+60)-30,py=md(R(i+9)*H+ts*.03*(1+R(i)),H+40)-20,a=ts/500+i;x.save();x.translate(px+Math.sin(a)*8,py);x.rotate(a);x.fillStyle=['#c2461e','#d08a2a','#8f4a1e','#d9b34a'][i%4];x.globalAlpha=.85-t*.3;x.beginPath();x.ellipse(0,0,4,2.2,0,0,6.3);x.fill();x.restore()}
 x.globalAlpha=1}
/* Friedhof */
function bareTree(px,by,h,c){
 x.strokeStyle=c;x.lineCap='round';x.lineWidth=h*.07;x.beginPath();x.moveTo(px,by);x.quadraticCurveTo(px+h*.05,by-h*.5,px-h*.03,by-h);x.stroke();
 [[.45,-1,.3],[.55,1,.34],[.7,-1,.26],[.8,1,.22],[.62,-1,.18]].forEach(function(b){var y=by-h*b[0];x.lineWidth=h*.035;x.beginPath();x.moveTo(px,y);x.quadraticCurveTo(px+b[1]*h*b[2]*.5,y-h*.12,px+b[1]*h*b[2],y-h*.2);x.stroke();x.lineWidth=h*.018;x.beginPath();x.moveTo(px+b[1]*h*b[2]*.6,y-h*.14);x.lineTo(px+b[1]*h*b[2]*.9,y-h*.3);x.stroke()});x.lineCap='butt'}
function graveStone(px,i,hb,tt){
 var st='#4a4f6a',hi='#6a708c',sh='#2e3248',k=Math.floor(R(i+12)*6);
 x.fillStyle='rgba(0,0,0,.25)';x.beginPath();x.ellipse(px,hb+3,22,3.5,0,0,6.3);x.fill();
 if(k===0||k===4){x.save();if(k===4){x.translate(px,hb);x.rotate(-.18);x.translate(-px,-hb)}
  x.fillStyle=st;x.beginPath();x.moveTo(px-13,hb);x.lineTo(px-13,hb-36);x.arc(px,hb-36,13,Math.PI,0);x.lineTo(px+13,hb);x.closePath();x.fill();
  x.fillStyle=sh;x.fillRect(px+5,hb-40,8,40);x.fillStyle=hi;x.fillRect(px-13,hb-38,3,38);
  x.strokeStyle=sh;x.lineWidth=1.6;x.beginPath();x.moveTo(px,hb-44);x.lineTo(px,hb-28);x.moveTo(px-5,hb-38);x.lineTo(px+5,hb-38);x.stroke();x.restore()}
 else if(k===1){x.fillStyle=st;x.fillRect(px-4,hb-66,8,66);x.fillRect(px-16,hb-52,32,8);x.fillStyle=sh;x.fillRect(px+1,hb-66,3,66);x.fillRect(px+1,hb-52,15,8);x.fillStyle=hi;x.fillRect(px-4,hb-66,1.8,66);x.fillStyle=sh;x.fillRect(px-11,hb-6,22,6)}
 else if(k===2){poly([px-12,hb,px-9,hb-70,px,hb-86,px+9,hb-70,px+12,hb],st);poly([px+2,hb,px+3,hb-80,px+9,hb-70,px+12,hb],sh);x.fillStyle=sh;x.fillRect(px-15,hb-8,30,8);x.fillStyle=hi;x.fillRect(px-15,hb-8,30,1.5)}
 else if(k===3){x.fillStyle=st;x.fillRect(px-13,hb-26,26,26);x.fillStyle=hi;x.fillRect(px-13,hb-26,26,2);
  poly([px-7,hb-26,px-5,hb-58,px+5,hb-58,px+7,hb-26],st);ellc(px,hb-63,5.4,5.4,st);
  x.fillStyle=sh;x.beginPath();x.moveTo(px-5,hb-54);x.quadraticCurveTo(px-30,hb-66,px-26,hb-34);x.quadraticCurveTo(px-18,hb-50,px-5,hb-40);x.closePath();x.fill();x.beginPath();x.moveTo(px+5,hb-54);x.quadraticCurveTo(px+30,hb-66,px+26,hb-34);x.quadraticCurveTo(px+18,hb-50,px+5,hb-40);x.closePath();x.fill()}
 else{poly([px-34,hb,px-34,hb-46,px,hb-72,px+34,hb-46,px+34,hb],st);poly([px+10,hb,px+34,hb-46,px+34,hb],sh);x.fillStyle='#10121e';archPath(px,hb-34,18,hb);x.fill();
  var gg=x.createRadialGradient(px,hb-14,1,px,hb-14,22);gg.addColorStop(0,'rgba(255,70,50,'+(.45+.12*Math.sin(tt*6+i))+')');gg.addColorStop(1,'rgba(255,70,50,0)');x.fillStyle=gg;x.fillRect(px-24,hb-40,48,42);x.fillStyle=hi;x.fillRect(px-34,hb-48,68,3)}
 if(R(i+30)>.5)redCandle(px+(R(i+31)>.5?20:-20),hb+4,tt,i,.9);
 if(R(i+40)>.82){x.fillStyle='#e07a1c';ellc(px+(k===5?-40:26),hb+1,7,6,'#e07a1c');x.fillStyle='#ffd070';x.fillRect(px+(k===5?-43:23),hb-3,2,2.6);x.fillRect(px+(k===5?-38:28),hb-3,2,2.6)}}
function drawGrave(ts){
 var o=D,hb=FY-12,tt=ts/1000,i,q,run=g.run;
 x.fillStyle=grad(0,hb,'#060811','#2b2348');x.fillRect(0,0,W,H);
 for(i=0;i<36;i++){x.globalAlpha=.35+.65*Math.abs(Math.sin(ts/800+i*1.7));x.fillStyle='#eef0ff';x.fillRect((i*83)%W,(i*37)%150,i%5?1.4:2.2,i%5?1.4:2.2)}x.globalAlpha=1;
 var mg=x.createRadialGradient(540,76,10,540,76,90);mg.addColorStop(0,'rgba(255,200,130,.3)');mg.addColorStop(1,'rgba(255,200,130,0)');x.fillStyle=mg;x.beginPath();x.arc(540,76,90,0,6.3);x.fill();
 ellc(540,76,27,27,'#f2c88e');ellc(531,69,5,5,'rgba(190,140,90,.45)');ellc(549,84,7,7,'rgba(190,140,90,.4)');ellc(548,63,3,3,'rgba(190,140,90,.4)');
 for(i=0;i<5;i++){q=md(i*180-ts*.008-o*.02,W+300)-120;ellc(q,34+R(i)*60,90,12,'rgba(30,28,60,.75)');ellc(q+40,44+R(i)*60,60,9,'rgba(44,40,78,.7)')}
 schwebebahn(ts,o);
 hills(o*.05,204,16,2,1,6,5,.4,'#141830','rgba(120,120,180,.12)');
 for(i=0;i<9;i++){q=md(i*150+R(i)*40-o*.08,W+200)-100;if(q>-40&&q<W+40)bareTree(q,236,64+R(i+3)*34,'#0c0f20')}
 fogBand(ts,o,222,.07,.05);
 for(i=0;i<16;i++){var gx=md(i*86+R(i+50)*30-o*.3,1376)-60,kk=i%3;if(gx<-30||gx>W+30)continue;x.fillStyle='#1b1f38';if(kk===0){x.beginPath();x.moveTo(gx-8,252);x.lineTo(gx-8,238);x.arc(gx,238,8,Math.PI,0);x.lineTo(gx+8,252);x.fill()}else if(kk===1){x.fillRect(gx-2,226,4,26);x.fillRect(gx-8,233,16,4)}else poly([gx-7,252,gx-5,228,gx,220,gx+5,228,gx+7,252],'#1b1f38')}
 /* Eisenzaun mit Spitzen */
 var zo=o*.45;x.strokeStyle='#0d0f1c';x.lineWidth=1.8;x.beginPath();for(i=0;i<60;i++){var zx=md(i*9-zo,540+W)-30;if(zx>-20&&zx<W+20){x.moveTo(zx,254);x.lineTo(zx,226);x.moveTo(zx-2,229);x.lineTo(zx,222);x.lineTo(zx+2,229)}}x.moveTo(0,236);x.lineTo(W,236);x.moveTo(0,246);x.lineTo(W,246);x.stroke();
 x.fillStyle='rgba(20,22,48,.7)';x.fillRect(0,254,W,hb-254);
 /* nahe Gräber */
 var i0=Math.floor((run-80)/170),i1=Math.floor((run+W+80)/170)+1;
 for(i=Math.max(0,i0);i<=i1;i++){var wx=i*170+60+R(i+9)*60;q=wx-run;if(q<-70||q>W+70||Math.abs(wx-GATEX)<90)continue;graveStone(q,i,hb,tt)}
 /* Weg */
 x.fillStyle=grad(hb,H,'#3a3446','#1c1a2a');x.fillRect(0,hb,W,H-hb);x.fillStyle='#4a4660';x.fillRect(0,hb,W,3);
 for(i=0;i<44;i++){q=md(i*34-run+R(i)*20,W+40)-20;ellc(q,hb+10+R(i+5)*50,2+R(i+2)*2,1.2,'rgba(140,140,170,.18)')}
 /* liegende Grabplatten im unteren Bereich */
 for(i=Math.floor((run-120)/230);i<=Math.floor((run+W+120)/230)+1;i++){if(i<0)continue;var sx=i*230+80+R(i+70)*90-run,sw2=74+R(i+71)*26,yb=322+R(i+72)*12;if(sx<-130||sx>W+130||Math.abs(i*230+80-GATEX)<130)continue;
  var cr=R(i+73)>.7;x.fillStyle='#232740';poly([sx-6,yb,sx+sw2+6,yb,sx+sw2+6,yb+5,sx-6,yb+5],'#232740');
  poly([sx+8,yb-20,sx+sw2-8,yb-20,sx+sw2+6,yb,sx-6,yb],'#474c68');poly([sx+8,yb-20,sx+sw2-8,yb-20,sx+sw2-10,yb-17,sx+10,yb-17],'#5d6384');
  x.strokeStyle='#2b2f48';x.lineWidth=1.8;var cx0=sx+sw2/2;x.beginPath();x.moveTo(cx0,yb-16);x.lineTo(cx0,yb-4);x.moveTo(cx0-5,yb-12);x.lineTo(cx0+5,yb-12);if(cr){x.moveTo(sx+sw2*.62,yb-19);x.lineTo(sx+sw2*.55,yb-8);x.lineTo(sx+sw2*.6,yb)}x.stroke();
  ellc(sx+6,yb-3,8,2.6,'#2f4a34');if(R(i+74)>.55)redCandle(sx+sw2+10,yb+2,tt,i,.8)}
 var gq=GATEX-run;if(gq>-110&&gq<W+110)graveGate(gq,tt,hb);
 var sgx=STAGE+420-run;if(sgx>-60&&sgx<W+60)signB(sgx,hb+6,'Alter Friedhof','Ruhe bitte','#3a3a4a','#e6e2d0');
 var cX=TOTAL+300-run;if(cX<W+300)chapel(cX,hb+8,ts)}
function ghostDraw(px,py,s,al,tt,ph){
 x.save();x.translate(px,py);x.scale(s,s);var sw=Math.sin(tt*3+ph)*3;
 var gg=x.createRadialGradient(0,4,2,0,4,38);gg.addColorStop(0,'rgba(190,220,255,'+(.32*al)+')');gg.addColorStop(1,'rgba(190,220,255,0)');x.fillStyle=gg;x.beginPath();x.arc(0,4,38,0,6.3);x.fill();
 x.globalAlpha=al;x.fillStyle='#eef4ff';x.beginPath();x.moveTo(-14,-2);x.bezierCurveTo(-14,-24,14,-24,14,-2);x.lineTo(14,20);x.quadraticCurveTo(10+sw,34,5,24);x.quadraticCurveTo(1+sw,36,-4,24);x.quadraticCurveTo(-8+sw,34,-14,22);x.closePath();x.fill();
 x.beginPath();x.ellipse(-16,8,5,3,.6,0,6.3);x.ellipse(16,9,5,3,-.6,0,6.3);x.fill();
 x.fillStyle='rgba(255,170,190,.35)';x.beginPath();x.ellipse(-8,2,3,2,0,0,6.3);x.ellipse(8,2,3,2,0,0,6.3);x.fill();
 x.fillStyle='#14182a';x.beginPath();x.ellipse(-5,-7,2.5,4,0,0,6.3);x.ellipse(5,-7,2.5,4,0,0,6.3);x.fill();x.beginPath();x.ellipse(0,5,3,4.4,0,0,6.3);x.fill();
 x.fillStyle='#fff';x.beginPath();x.arc(-5.8,-8.6,.9,0,6.3);x.arc(4.2,-8.6,.9,0,6.3);x.fill();
 x.restore()}
/* Katze (niedlich, im Stil von Fuchs und Wolf: dicke runde Gliedmaßen, großer runder Kopf, große Ohren mit lila Innenseite, große Augen mit Glanzlicht, Schwanz wie ein Fragezeichen, Rückenlicht). Sie schleicht nach links im Kreuzgang, die Pfote hebt sich beim Vorsetzen, der Schritt hängt an der Strecke, die sie über den Boden läuft */
function catLeg(hx,hy,gy,ph,col,paw){
 var fx=hx-Math.cos(ph)*7,lift=Math.max(0,-Math.sin(ph))*6,fy=gy-lift,kx=(hx+fx)/2-1.8,ky=(hy+fy)/2+.6;
 K(col,5.4);x.beginPath();x.moveTo(hx,hy);x.lineTo(kx,ky);x.lineTo(fx,fy-2);x.stroke();
 x.fillStyle=paw;x.beginPath();x.ellipse(fx-1.6,fy-1.4,4.6,2.8,0,0,6.3);x.fill()}
function catDraw(px,gy,tt,o){
 var c='#10101a',far='#1e1e2e',paw='#2c2c42',rim='rgba(130,138,200,.9)',k=APP.katze,d=o?k*Math.max(0,g.run-(o.bx-W-60)):0,ph=d/26*6.283,bob=Math.abs(Math.sin(ph))*-1.5,sw=Math.sin(tt*2.2+px*.02)*3.5,hb=Math.sin(ph)*.8;
 shadow(px,19);
 catLeg(px-6,gy-9+bob,gy,ph+Math.PI,far,'#383852');catLeg(px+10,gy-9+bob,gy,ph,far,'#383852');
 /* Schwanz wie ein Fragezeichen, wippt */
 var tail=function(dx){x.beginPath();x.moveTo(px+14+dx,gy-14+bob);x.bezierCurveTo(px+28+dx,gy-13,px+33+sw+dx,gy-30,px+23+sw+dx,gy-38);x.bezierCurveTo(px+18+sw+dx,gy-43,px+12+sw+dx,gy-38,px+15+sw+dx,gy-34);x.stroke()};
 K(c,5);tail(0);K(rim,1.2);tail(2.2);
 catLeg(px-1,gy-9+bob,gy,ph,c,paw);catLeg(px+13,gy-9+bob,gy,ph+Math.PI,c,paw);
 x.save();x.translate(0,bob);
 /* Körper: klein und rund */
 x.fillStyle=c;x.beginPath();x.ellipse(px+3,gy-14,14,9,0,0,6.3);x.fill();
 x.fillStyle='#1a1a28';x.beginPath();x.ellipse(px+1,gy-10.5,10,4.6,0,0,6.3);x.fill();
 K(rim,1.4);x.beginPath();x.ellipse(px+3,gy-14,14.6,9.6,0,3.7,5.6);x.stroke();
 /* Kopf: groß und rund, nickt leicht */
 x.save();x.translate(0,hb);
 x.fillStyle=c;x.beginPath();x.moveTo(px-28,gy-31);x.lineTo(px-25,gy-46);x.lineTo(px-15,gy-35);x.closePath();x.fill();
 x.beginPath();x.moveTo(px-15,gy-35);x.lineTo(px-5,gy-46);x.lineTo(px-2,gy-31);x.closePath();x.fill();
 x.fillStyle='#8a52b4';x.beginPath();x.moveTo(px-25.6,gy-33);x.lineTo(px-24.6,gy-42.2);x.lineTo(px-18.6,gy-35.4);x.closePath();x.fill();
 x.beginPath();x.moveTo(px-11.4,gy-35.4);x.lineTo(px-5.4,gy-42.2);x.lineTo(px-4.4,gy-33);x.closePath();x.fill();
 x.fillStyle=c;x.beginPath();x.arc(px-15,gy-25,12.6,0,6.3);x.fill();x.beginPath();x.ellipse(px-15,gy-22,14,10,0,0,6.3);x.fill();
 K(rim,1.4);x.beginPath();x.arc(px-15,gy-25,12.2,3.7,5.2);x.stroke();
 /* große Augen mit Glanzlicht, blinzeln selten */
 var bl=((tt+px*.01)%4.6)<.1;
 [px-21.5,px-8.5].forEach(function(ex){
  if(bl){K('#f2b630',1.8);x.beginPath();x.arc(ex,gy-25.4,3.4,.15,3);x.stroke()}
  else{x.fillStyle='#f2b630';x.beginPath();x.ellipse(ex,gy-25,4.8,5.4,0,0,6.3);x.fill();x.fillStyle='#ffd966';x.beginPath();x.ellipse(ex,gy-22.6,3.6,2.6,0,0,6.3);x.fill();
   x.fillStyle='#0a0a12';x.beginPath();x.ellipse(ex-.4,gy-25,2.8,3.6,0,0,6.3);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(ex-1.6,gy-26.6,1.5,0,6.3);x.fill();x.beginPath();x.arc(ex+1.2,gy-23.4,.8,0,6.3);x.fill()}});
 /* rosa Näschen, Mund, Schnurrhaare */
 x.fillStyle='#e58fa2';x.beginPath();x.moveTo(px-16.6,gy-19.4);x.lineTo(px-13.4,gy-19.4);x.lineTo(px-15,gy-17.4);x.closePath();x.fill();
 K('#e58fa2',.9);x.beginPath();x.moveTo(px-15,gy-17.4);x.lineTo(px-15,gy-16.2);x.moveTo(px-18,gy-15.6);x.quadraticCurveTo(px-15,gy-13.8,px-15,gy-16.2);x.quadraticCurveTo(px-15,gy-13.8,px-12,gy-15.6);x.stroke();
 K('rgba(235,235,250,.7)',.8);x.beginPath();x.moveTo(px-25,gy-20);x.lineTo(px-35,gy-22);x.moveTo(px-25,gy-18);x.lineTo(px-35,gy-17);x.moveTo(px-5,gy-20);x.lineTo(px+5,gy-22);x.moveTo(px-5,gy-18);x.lineTo(px+5,gy-17);x.stroke();
 x.restore();x.restore()}
function taube(px,py,s,fl){
 x.save();x.translate(px,py);x.scale(s,s);
 x.fillStyle='#8c93a2';x.beginPath();x.ellipse(0,0,10,5.5,0,0,6.3);x.fill();
 poly([9,-1,19,2,9,3],'#6b7280');ellc(-10,-2,4.4,4.4,'#5f7f9f');
 poly([-14,-2.5,-19,-1.5,-14,-.5],'#e0a44a');ellc(-11.2,-3,1.3,1.3,'#fff');ellc(-11.5,-3,.6,.6,'#111');
 x.fillStyle='#7d8493';x.beginPath();x.moveTo(-4,-1);x.quadraticCurveTo(-6,-9+fl*7,4,-9+fl*9);x.quadraticCurveTo(4,-3,2,1);x.closePath();x.fill();
 x.fillStyle='#a4abb8';x.beginPath();x.moveTo(-2,-2);x.quadraticCurveTo(2,-12-fl*8,12,-11-fl*10);x.quadraticCurveTo(8,-3,4,1);x.closePath();x.fill();
 x.restore()}
function kackDraw(px,gy,tt){
 shadow(px,16);
 ellc(px,gy-3,17,5.6,'#4f301a');ellc(px,gy-8.5,13,5.6,'#6b4226');ellc(px,gy-13.5,8.6,5,'#7d4f2c');
 x.fillStyle='#8a5a34';x.beginPath();x.moveTo(px-5,gy-16);x.quadraticCurveTo(px+1,gy-27,px+4,gy-18);x.quadraticCurveTo(px,gy-17,px-5,gy-16);x.fill();
 x.fillStyle='rgba(255,255,255,.18)';x.beginPath();x.ellipse(px-8,gy-10,3,1.4,-.3,0,6.3);x.ellipse(px-3,gy-15,2.6,1.2,-.2,0,6.3);x.fill();
 eyes(px,gy-9.5,.78,0);x.strokeStyle='#2c170c';x.lineWidth=1.3;x.beginPath();x.arc(px,gy-7,3.4,.25,2.9);x.stroke();
 x.strokeStyle='rgba(120,190,80,.7)';x.lineWidth=1.2;[-9,0,9].forEach(function(d,j){x.beginPath();x.moveTo(px+d,gy-20);x.quadraticCurveTo(px+d+4*Math.sin(tt*3+j),gy-28,px+d,gy-35-(j%2)*3);x.stroke()});
 ellc(px+Math.cos(tt*5)*17,gy-30+Math.sin(tt*7)*5,1.4,1.4,'#111')}
function tonneDraw(px,gy,o){
 var ci=o?Math.floor(o.bx/97)%4:0,c=[['#5a626c','#464d56'],['#2f6f3a','#235a2c'],['#2b5aa5','#1f4585'],['#7a5a2a','#5e441e']][ci];shadow(px,20);
 poly([px-14,gy-30,px+14,gy-30,px+12,gy-3,px-12,gy-3],c[0]);poly([px+5,gy-30,px+14,gy-30,px+12,gy-3,px+4,gy-3],c[1]);
 x.fillStyle=c[1];x.beginPath();x.roundRect(px-16,gy-37,32,8,2);x.fill();x.fillStyle='rgba(255,255,255,.18)';x.fillRect(px-14,gy-36,20,1.6);
 ellc(px-8,gy-3,3.4,3.4,'#15171b');ellc(px+8,gy-3,3.4,3.4,'#15171b');eyes(px,gy-19,.9,0);
 x.strokeStyle='rgba(0,0,0,.4)';x.lineWidth=1.3;x.beginPath();x.arc(px,gy-12,3,.3,2.8);x.stroke()}
function radDraw(px,gy){
 shadow(px,28);wheel(px-17,gy-12,11,.4);wheel(px+17,gy-12,11,1.1);
 x.strokeStyle='#c0392b';x.lineWidth=2.4;x.lineCap='round';x.beginPath();x.moveTo(px-17,gy-12);x.lineTo(px-3,gy-28);x.lineTo(px+10,gy-28);x.lineTo(px+17,gy-12);x.moveTo(px-3,gy-28);x.lineTo(px+2,gy-12);x.lineTo(px-17,gy-12);x.moveTo(px+10,gy-28);x.lineTo(px+14,gy-37);x.stroke();
 x.strokeStyle='#22262e';x.lineWidth=2.2;x.beginPath();x.moveTo(px+10,gy-37);x.lineTo(px+20,gy-35);x.stroke();x.lineCap='butt';
 x.fillStyle='#1c1c22';x.beginPath();x.roundRect(px-10,gy-33,13,3.4,1.6);x.fill();eyes(px+1,gy-20,.7,0)}
function wagenDraw(px,gy,t){
 shadow(px,24);x.strokeStyle='#5a3a22';x.lineWidth=3;x.lineCap='round';x.beginPath();x.moveTo(px+18,gy-18);x.lineTo(px+36,gy-31);x.lineTo(px+41,gy-31);x.stroke();x.lineCap='butt';
 x.fillStyle='#c0693a';x.beginPath();x.roundRect(px-22,gy-28,44,16,2);x.fill();x.fillStyle='rgba(0,0,0,.2)';x.fillRect(px-22,gy-20,44,1.2);x.fillStyle='#e8c04a';x.fillRect(px-22,gy-28,44,3);
 [-14,-5,5,14].forEach(function(d,j){x.fillStyle=['#7a4a1c','#3b8a5a','#a02a2a','#7a4a1c'][j];x.fillRect(px+d-2,gy-35,4,8);x.fillStyle='#d9b34a';x.fillRect(px+d-2,gy-36,4,1.6)});
 var a=-g.run*.12;wheel(px-12,gy-8,8,a);wheel(px+13,gy-8,8,a);eyes(px-6,gy-21,.8,-1)}
function grabObs(px,gy){
 shadow(px,18);var st='#6b708a',hi='#8a90ac',sh='#4a4f66';
 x.fillStyle=st;x.beginPath();x.moveTo(px-15,gy);x.lineTo(px-15,gy-30);x.arc(px,gy-30,15,Math.PI,0);x.lineTo(px+15,gy);x.closePath();x.fill();
 x.fillStyle=sh;x.fillRect(px+6,gy-36,9,36);x.fillStyle=hi;x.fillRect(px-15,gy-33,3,33);
 x.fillStyle='#4a7a4a';[[-11,-2,5],[-4,-1,4],[9,-1.5,4.6]].forEach(function(m){ellc(px+m[0],gy+m[1],m[2],2.4,'#4a7a4a')});
 x.strokeStyle=sh;x.lineWidth=1.4;x.beginPath();x.moveTo(px,gy-42);x.lineTo(px,gy-34);x.moveTo(px-3,gy-39);x.lineTo(px+3,gy-39);x.stroke();
 eyes(px,gy-24,.9,0);x.strokeStyle='#2c3046';x.lineWidth=1.4;x.beginPath();x.arc(px,gy-12,3,3.4,6);x.stroke()}
function kreuzObs(px,gy){
 shadow(px,18);x.save();x.translate(px,gy);x.rotate(.07);x.translate(-px,-gy);
 x.fillStyle='#6b708a';x.fillRect(px-5,gy-46,10,46);x.fillRect(px-17,gy-36,34,9);x.fillStyle='#4a4f66';x.fillRect(px+1.5,gy-46,3.5,46);x.fillRect(px+1.5,gy-36,15.5,9);x.fillStyle='#8a90ac';x.fillRect(px-5,gy-46,2,46);
 x.fillStyle='#4a7a4a';ellc(px-6,gy-1,5,2.4,'#4a7a4a');x.restore()}
function kerzeObs(px,gy,tt){shadow(px,18);redCandle(px-12,gy,tt,0,.95);redCandle(px+13,gy,tt,1.6,.8);redCandle(px+1,gy+1,tt,3.1,1.3);eyes(px+1,gy-12,.85,0)}
function chapel(X,gy,ts){
 var tt=ts/1000;x.save();x.translate(X,gy);x.scale(1.45,1.45);x.translate(-X,-gy);
 var lg=x.createRadialGradient(X,gy-30,6,X,gy-30,130);lg.addColorStop(0,'rgba(255,190,100,.3)');lg.addColorStop(1,'rgba(255,190,100,0)');x.fillStyle=lg;x.fillRect(X-140,gy-170,280,180);
 ellc(X,gy+1,62,4,'rgba(0,0,0,.4)');
 x.fillStyle='#625a70';x.fillRect(X-44,gy-46,88,46);x.fillStyle='#4e4760';x.fillRect(X+22,gy-46,22,46);
 poly([X-54,gy-46,X,gy-86,X+54,gy-46],'#262c3c');poly([X,gy-86,X+54,gy-46,X,gy-46],'#323a4e');
 x.fillStyle='#d9b34a';x.fillRect(X-1,gy-102,2,18);x.fillRect(X-5,gy-97,10,2);
 [-30,30].forEach(function(d){x.fillStyle='#e8dcb8';archPath(X+d,gy-40,11,gy-18);x.fill();x.fillStyle='#ffc86a';archPath(X+d,gy-38,8,gy-20);x.fill();x.fillStyle='rgba(120,30,30,.45)';x.fillRect(X+d-4,gy-30,8,3)});
 poly([X-8,gy,X+8,gy,X+22,gy+8,X-22,gy+8],'rgba(255,200,110,.22)');
 x.fillStyle='#e8dcb8';archPath(X,gy-36,20,gy);x.fill();x.fillStyle='#ffd27a';archPath(X,gy-34,16,gy);x.fill();x.fillStyle='#2a1e12';x.fillRect(X-1,gy-30,2,30);
 redCandle(X-20,gy+1,tt,0,.85);redCandle(X+20,gy+1,tt,2,.85);
 var gy2=gy-98+Math.sin(tt*2)*2;ghostDraw(X+30,gy2,.55,.9,tt,1);
 x.fillStyle='#f6f0dc';x.fillRect(X+2,gy2+12,80,22);x.strokeStyle='#8a6a40';x.lineWidth=1.4;x.strokeRect(X+2,gy2+12,80,22);x.fillStyle='#3a2918';x.font='bold 11px system-ui,sans-serif';x.textAlign='center';x.fillText('Zimmer frei',X+42,gy2+27.4);x.textAlign='left';
 x.restore()}
function bonus3Obst(t,px,o){
 var tt=NOW/1000;
 if(t==='kack'){kackDraw(px,FY+1,tt);return}
 if(t==='tonne'){tonneDraw(px,FY+1,o);return}
 if(t==='rad'){radDraw(px,FY+1);return}
 if(t==='wagen'){wagenDraw(px,FY+1,tt);return}
 if(t==='grab'){grabObs(px,FY+1);return}
 if(t==='kreuz'){kreuzObs(px,FY+1);return}
 if(t==='kerzeo'){kerzeObs(px,FY+1,tt);return}
 if(t==='katze'){catDraw(px,FY+1,tt,o);return}
 var ph0=o?o.bx:px;
 if(t==='geist'){ghostDraw(px+Math.sin(tt*1.6+ph0/50)*5,FY-(116+5*Math.sin(NOW/450+ph0/60)),1.15,.85,tt,ph0/40);return}
 if(t==='tauben'){
  /* Schwarm fliegt nach links (Schnabel zeigt links) schneller als der Boden: vor Mo (X=150) kein Versatz, davor und danach gleitet er mit */
  var fo=(px-150)*.45,fx=px+fo,by=FY-(106+4*Math.sin(NOW/380+ph0/55));x.fillStyle='rgba(0,0,0,.16)';x.beginPath();x.ellipse(fx,FY+2,30,4,0,0,6.3);x.fill();
  [[0,0,1.35],[-30,-10,1.1],[26,-14,1.2],[-12,12,1],[36,10,1.05]].forEach(function(b,i){var ph=NOW/90+i*1.9+ph0/9,fl=Math.sin(ph);taube(fx+b[0]+Math.sin(NOW/400+i*2)*3,by+b[1]+Math.cos(NOW/350+i)*3-fl*2.2,b[2]*1.1,fl)})}}
function bonusFrontGrave(ts){
 var tt=ts/1000,m=D,mfg=(g.mode==='title'||g.mode==='intro')?0:Math.min(1,g.run/150);
 /* große Steinkreuze im Vordergrund ziehen vorbei */
 var FLP=1700,fo=m*1.7;
 [260,1060].forEach(function(base,bi){var q=md(base-fo,FLP)-100;if(q>-110&&q<W+110){var a=(.3+.7*cl((Math.abs(q-150)-40)/130,0,1))*mfg;if(a>.02){
  x.globalAlpha=a;x.fillStyle='#0b0d1a';x.fillRect(q-13,70,26,H);x.fillRect(q-62,108,124,26);
  x.fillStyle='#1d2140';x.fillRect(q-13,70,4,H);x.fillRect(q-62,108,124,4);x.fillStyle='#070914';x.fillRect(q-26,H-22,52,22);
  x.fillStyle='#16251f';ellc(q-22,H-3,18,5,'#16251f');ellc(q+26,114,14,4,'#16251f');
  x.globalAlpha=1}}});
 for(var fg=0;fg<4;fg++){var fx0=md(fg*230-m*1.25-tt*14,W+420)-210;var fgr=x.createRadialGradient(fx0,FY+2,5,fx0,FY+2,170);fgr.addColorStop(0,'rgba(190,200,230,.26)');fgr.addColorStop(1,'rgba(190,200,230,0)');x.fillStyle=fgr;x.save();x.translate(0,FY+2);x.scale(1,.2);x.translate(0,-(FY+2));x.beginPath();x.arc(fx0,FY+2,170,0,6.3);x.fill();x.restore()}
 var vg=x.createRadialGradient(W/2,H*.55,H*.35,W/2,H*.55,W*.62);vg.addColorStop(0,'rgba(0,0,12,0)');vg.addColorStop(1,'rgba(0,0,12,'+(.5*mfg)+')');x.fillStyle=vg;x.fillRect(0,0,W,H)}
function pfandPass(){
 g.pfandDone=true;g.pfandCash=g.pfand;g.pfandT=0;sfx(g.pfand>0?'pfand':'ok');
 say(g.fl>0?'Pfand eingelöst: '+eur(g.pfand)+' für '+(g.fl===1?'eine Flasche':g.fl+' Flaschen')+'. Der Wegweiser hat keine Taschen und fragt nicht nach.':'Keine Flaschen, kein Pfand. Der Automat sagt trotzdem Danke.',6.5)}
function pfandUI(ts){
 if(g.bonus!==3||g.pfandT<0||g.pfandT>4.6)return;
 var u=g.pfandT,a=Math.min(1,u/.3,(4.6-u)/.5),dy=-40*(1-ez(u/.5)),bx=210,by=58+dy,bw=132,bh=g.fl>0?86:66;
 x.globalAlpha=a;x.fillStyle='rgba(0,0,0,.2)';x.fillRect(bx+3,by+4,bw,bh);
 x.fillStyle='#fbf7ea';x.beginPath();x.moveTo(bx,by);x.lineTo(bx+bw,by);x.lineTo(bx+bw,by+bh);for(var k=0;k<11;k++){x.lineTo(bx+bw-(k+.5)*bw/11,by+bh+4);x.lineTo(bx+bw-(k+1)*bw/11,by+bh)}x.closePath();x.fill();
 x.textAlign='center';x.fillStyle='#3a2918';x.font='bold 12px Georgia,serif';x.fillText('PFANDBON',bx+bw/2,by+20);
 x.fillStyle='rgba(0,0,0,.18)';x.fillRect(bx+10,by+26,bw-20,1);
 x.font='11px system-ui,sans-serif';x.fillStyle='#6b4a2a';x.fillText(g.fl===0?'Keine Flaschen':g.fl===1?'1 Flasche':g.fl+' Flaschen',bx+bw/2,by+43);
 x.font='bold 18px Georgia,serif';x.fillStyle='#a0481a';x.fillText(eur(g.pfandCash),bx+bw/2,by+bh-14);
 x.textAlign='left';x.globalAlpha=1}
function pick(a){return a[Math.floor(Math.random()*a.length)]}
var mm={y:0,vy:0,air:false,sq:0,ph:0,hurt:0,buf:0,dk:0,sit:0,duckT:0,duckKey:false,duckPtr:false,hold:false};
var g={mode:'title',bonus:0,run:0,gs:0,wuerde:3,hits:0,dodged:0,stage:0,inv:0,slow:0,shake:0,obs:[],won:false,tOver:0,tr:-1,pend:null,ban:0,chat:5,log:[],q:null,hint:0,paused:false,items:[],funde:0,fundMax:0,fx:[],bump:0,lastGold:-9999,hutOpen:0,tIn:0,il:-1,lt:0,mx:150,moA:0,walk:false};
var pauseT0=0,pauseSh=0;
var msg='Der Weg ist gut ausgeschildert. Das ist der erste und letzte Vorteil.',msgT=6,D=0,last=0;
function say(t,s){msg=t;msgT=s||6}
function note(t,k){g.log.push({t:t,k:k})}
function genObs(){var a=[],bx=800,low=['log','mush','rock'];
 while(bx<TOTAL-600){var rs=bx%STAGE;if(bx>=STAGE&&rs<900)bx+=900-rs;var st=Math.floor(bx/STAGE),pool=st<1?low:low.concat(['fox','fox']);
  if(st>=3)pool=pool.concat(['wolf','wolf']);if(st>=4)pool=pool.concat(['bear','bear']);if(st>=5)pool=pool.concat(['eagle','eagle','eagle']);
  var t=pool[Math.floor(Math.random()*pool.length)],extra=0;
  if(APP[t]){a.push({t:t,bx:bx+OFF[t],done:false,hit:false})}
  else{a.push({t:t,bx:bx,done:false,hit:false});
   if(st>=3&&t!=='bear'&&Math.random()<.2){var gp=t==='log'?44:40;a.push({t:pick(['mush','rock']),bx:bx+gp,done:false,hit:false});extra=gp}}
  bx+=extra+(340+Math.random()*240)*(1+st*.06)}
 return a}
function genObsBonus(bn){var a=[],bx=800,cave=['stalag','stalag','stalag2','pfuetze','stalak','stalak','bat','stalag'],ridge=['gap','gap','boulder','steinmann','dohle','eagle','felsnase'],moor=['hedge','hedge','crow','crow','gap','gap'],kueste=['seal','seal','gull','gull','gull'];
 var stadt=['kack','kack','kack','tonne','rad','tauben','wagen'],friedhof=['grab','grab','kreuz','kerzeo','katze','katze','geist','geist','bat','bat'];
 while(bx<TOTAL-(bn>=2?800:600)){var rs=bx%STAGE;if(bx>=STAGE&&rs<900)bx+=900-rs;
  /* ruhige Zone vor dem Ehrenmal: kein Hindernis davor */
  if(bn===3&&bx>MEMX-230&&bx<MEMX+300)bx=MEMX+300;
  var pool=bn===5?GBPOOL[Math.min(3,Math.floor(bx/STAGE))]:bn===4?APOOL[Math.min(3,Math.floor(bx/STAGE))]:bn===3?(bx<STAGE?stadt:friedhof):bn===2?(bx<STAGE?moor:kueste):bx<STAGE?cave:ridge,t=pool[Math.floor(Math.random()*pool.length)];
  a.push({t:t,bx:APP[t]?bx+OFF[t]:bx,done:false,hit:false});
  bx+=(360+Math.random()*240)*1.25}
 /* Kluterthöhle: in diesem Level kommt immer mindestens ein Fuchs vor */
 if(bn===1&&!a.some(function(o){return o.t==='fox'&&o.bx<STAGE*.6})){for(var fi=0;fi<a.length;fi++){var oo=a[fi];if(oo.bx>1500&&oo.bx<STAGE*.6){var rawb=APP[oo.t]?oo.bx-OFF[oo.t]:oo.bx;oo.t='fox';oo.bx=APP.fox?rawb+OFF.fox:rawb;break}}}
 return a}
function ox(o){var k=APP[o.t];return k?o.bx-g.run-k*Math.max(0,g.run-(o.bx-W-60)):o.bx-g.run}
function bList(a,b,c,d,e,f){return g.bonus===5?f:g.bonus===4?e:g.bonus===3?d:g.bonus===2?c:g.bonus?b:a}
function bnum(){return g.stage+1+(g.bonus-1)*2}
function banner(s){if(s>0)sfx('stage');g.ban=3.2;say(bList(SLINE,BLINE,BLINE2,BLINE3,ALINE,GBLINE)[s],6.5)}
function start(bn){g.bonus=bn||0;STAGE=bn?BSTAGE:3200;NST=bn?2:6;TOTAL=STAGE*NST;if(bn>=4){STAGE=ASTAGE;NST=4;TOTAL=STAGE*NST}gOff=0;FY=FY0;GY=GY0;mm.sit=0;g.hint=9;g.log=[];g.q=null;mm.hold=false;mm.dk=0;mm.duckT=0;mm.duckKey=false;mm.duckPtr=false;mm.y=0;mm.vy=0;mm.air=false;mm.sq=0;mm.hurt=0;mm.buf=0;
 g.mode='play';g.run=0;g.wuerde=3;g.hits=0;g.dodged=0;g.stage=0;g.inv=0;g.slow=0;g.shake=0;g.won=false;g.obs=bn?genObsBonus(bn):genObs();g.items=genItems(g.obs,bn);g.sch=[];
 if(bn===1)([[1500,'stein'],[3000,'kopf'],[4400,'stein'],[STAGE+1500,'absturz'],[STAGE+3000,'wind'],[STAGE+4500,'stein']]).forEach(function(s){var w=s[0],ok=false;for(var n=0;n<14&&!ok;n++){ok=true;g.obs.forEach(function(o){if(Math.abs((o.bx-(OFF[o.t]||0))-w)<110)ok=false});g.items.forEach(function(it){if(Math.abs(it.bx-w)<80)ok=false});if(!ok)w+=(bn===2?-40:40)}g.sch.push({wx:w,k:s[1]})});
 if(!bn){if(g.obs.length)g.obs[0].lab='Springen!';for(var li=0;li<g.obs.length;li++)if(g.obs[li].t==='eagle'){g.obs[li].lab='Ducken!';break}}g.funde=0;g.fundMax=0;g.fx=[];g.bump=0;g.lastGold=-9999;g.chat=9;
 g.bite=-1;g.amb=0;KN={};g.pfand=0;g.pfandCash=0;g.fl=0;g.pfandT=-1;g.pfandDone=false;g.tr=0;g.pend=bn===5?'Ufer':bn===4?'Kotten':bn===3?'Altstadt':bn===2?'Moor':bn?'Höhle':SEA[0];sfx('start');banner(0)}
var INTRO=[
 'Guten Morgen. Ich bin Mo.',
 'Mein Ziel ist die Hütte da hinten, zwei Kilometer weiter. Zu Fuß, versteht sich.',
 'Auf dem Weg liegen Baumstämme, Pilze und Felsen. Später kommen Tiere dazu.',
 'Drei Leben habe ich, oben als Hüte zu sehen. Sind sie weg, setze ich mich hin.',
 'Der Wegweiser kommentiert alles. Ich höre nicht hin. Los geht’s.'];
function introDur(i){return Math.max(2.6,INTRO[i].length/11)}
function introStart(){mm.sit=0;g.mode='intro';g.tIn=0;g.il=-1;g.lt=0;g.mx=40;g.moA=0;g.walk=false;g.hutOpen=0;g.run=0;
 mm.y=0;mm.vy=0;mm.air=false;mm.sq=0;mm.hurt=0;mm.buf=0;mm.dk=0;mm.hold=false;g.tr=-1}
function introStep(dt){g.tIn+=dt;
 if(g.il<0){
  if(g.tIn<.8){g.mx=40;g.moA=0;g.walk=false}
  else{var k=Math.min(1,(g.tIn-.8)/1.3);g.mx=40+110*k;g.moA=Math.min(1,(g.tIn-.8)/.4);g.walk=k<1;mm.ph+=dt*9*.6;if(k>=1){g.il=0;g.lt=0;g.walk=false}}
 }else{g.lt+=dt;if(g.lt>introDur(g.il))introNext()}}
function introNext(){g.il++;g.lt=0;if(g.il>=INTRO.length)endIntro()}
function introTap(){if(g.il<0){g.il=0;g.lt=0;g.mx=150;g.moA=1;g.walk=false;g.tIn=Math.max(g.tIn,2.2)}else if(g.lt>.25)introNext()}
function endIntro(){g.hutOpen=1;g.walk=false;start()}
function introUI(ts){
 if(g.mode!=='intro')return;
 x.globalAlpha=.8;x.fillStyle='rgba(30,22,14,.55)';var sw=Math.round(90*FB),sh=Math.round(22*(1+(FB-1)*.8));x.beginPath();x.roundRect(W-sw-8,8,sw,sh,sh/2);x.fill();
 x.globalAlpha=1;x.fillStyle='#fbf3e0';x.font='11px system-ui,sans-serif';x.textAlign='center';x.fillText(TOUCH?'Überspringen':'Esc: überspringen',W-8-sw/2,8+sh/2+4*FB);x.textAlign='left';
 if(g.il<0)return;
 var tx=INTRO[g.il];x.font='13px system-ui,sans-serif';var ls=wrap(tx,Math.round(236*FB)),lh=Math.round(17*FB),h=ls.length*lh+18,bw=0;ls.forEach(function(l){bw=Math.max(bw,x.measureText(l).width)});bw+=26;
 var bx=g.mx+16,bot=FY-104,top=bot-h,al=Math.min(1,g.lt*5);x.globalAlpha=al;
 x.fillStyle='rgba(0,0,0,.18)';x.beginPath();x.roundRect(bx+2,top+3,bw,h,10);x.fill();
 x.fillStyle='#fffdf6';x.beginPath();x.roundRect(bx,top,bw,h,10);x.fill();
 x.beginPath();x.moveTo(bx+10,bot-1);x.lineTo(bx-6,bot+14);x.lineTo(bx+26,bot-1);x.closePath();x.fill();
 x.strokeStyle='#b8925a';x.lineWidth=1.6;x.beginPath();x.roundRect(bx,top,bw,h,10);x.stroke();
 x.fillStyle='#fffdf6';x.beginPath();x.moveTo(bx+11,bot-1.5);x.lineTo(bx-5,bot+13);x.lineTo(bx+25,bot-1.5);x.closePath();x.fill();
 x.fillStyle='#a0481a';x.font='bold 11px system-ui,sans-serif';x.fillText('Mo',bx+12,top+10+4*FB);
 x.fillStyle='#3a2918';x.font='13px system-ui,sans-serif';ls.forEach(function(l,i){x.fillText(l,bx+13,top+14+(i+1)*lh)});
 x.globalAlpha=1;
 x.fillStyle='rgba(30,22,14,.55)';x.beginPath();x.roundRect(W/2-96,H-34,192,20,10);x.fill();
 x.fillStyle='#fbf3e0';x.font='11px system-ui,sans-serif';x.textAlign='center';x.fillText(TOUCH?'Tippen: weiter':'Tippen oder Leertaste: weiter',W/2,H-20);x.textAlign='left'}
/* ---------- Fundstücke: verlorene Sachen am Weg, nur durch Ducken zu gewinnen ---------- */
var NAMEN={brot:'Brotdose',thermo:'Thermoskanne',riegel:'Müsliriegel',apfel:'Apfel',gold:'Goldener Hut',kristall:'Leuchtkristall',helm:'Schutzhelm',batterie:'Ersatzbatterie',schoki:'Schokolade',brille:'Sonnenbrille',stiefel:'Gummistiefel',korb:'Moorbeeren',muschel:'Muschel',karte:'Wanderkarte',flasche:'Pfandflasche',pet:'PET-Flasche',droeppel:'Dröppelminna',waffel:'Waffel mit Kirschen',kerze:'Rote Kerze',laterne:'Taschenlaterne',kuerbis:'Kürbis'};
var FUNDTXT={
 flasche:['Eine Pfandflasche. Acht Cent, die der Wegweiser nicht einfordert.','Flasche gefunden. Das Pfand zahlt sich irgendwann aus, wie vieles beim Wandern.'],
 pet:['Eine PET-Flasche, 25 Cent. Das ist hier fast schon Vermögen.','PET-Flasche eingesammelt. Der Automat freut sich schon.'],
 droeppel:['Eine Dröppelminna, die Kaffeekanne mit Hahn aus der bergischen Kaffeetafel. Sie tröpfelt, damit niemand hetzen muss.','Dröppelminna gefunden. Der Kaffee tropft langsam, der Wegweiser nennt das Geduld.'],
 waffel:['Eine Waffel mit Sahne und Kirschen. Pfand gibt es darauf nicht, Begeisterung schon.','Waffel gefunden. Mo isst sie im Gehen, das zählt in Bergisch als Kaffeetafel.'],
 kerze:['Eine herrenlose rote Kerze am Wegrand. Mo nimmt sie nur zum Leuchten.','Kerze gefunden. Im Dunkeln das beste Argument.'],
 laterne:['Eine Taschenlaterne mit Kurbel. Kein Akku, kein Problem.','Laterne gefunden. Der Wegweiser nennt das: Licht am Ende des Wegs.'],
 kuerbis:['Ein kleiner Kürbis mit Gesicht. Er lächelt, Mo auch, ein bisschen.','Kürbis gefunden. Hohl, aber gut gelaunt.'],
 kristall:['Ein Leuchtkristall. Er liegt hier ohne Pfand, aber mit Glanz.','Kristall gefunden. Der bringt Licht in die Sache.'],
 helm:['Ein Schutzhelm. Bei Steinschlag ein guter Fund, sonst auch.','Helm gefunden. Der Wegweiser empfiehlt ihn für alles ab Kopfhöhe.'],
 batterie:['Eine Ersatzbatterie. Die Stirnlampe sagt Danke, auf ihre Art.','Batterie gefunden. Ohne Licht wäre das hier nur Fels in dunkel.'],
 schoki:['Schokolade. Auf dem Grat zählt jede Kalorie, hat man gehört.','Ein Stück Schokolade. Es kommt in Mos Hosentasche, nicht in den Bericht.'],
 brille:['Eine Sonnenbrille. Auf dem Grat blendet der Schnee, das passt.','Sonnenbrille gefunden. Mo sieht cool aus, der Wegweiser sieht dasselbe wie vorher.'],
 brot:['Eine Brotdose. Inhalt: Butterbrot, Alter unbekannt. Mo nimmt es trotzdem.','Verlorene Brotdose. Der Wegweiser hat nichts gesehen.'],
 thermo:['Thermoskanne, noch warm. Der Besitzer war wohl in Eile.','Kaffee gefunden. Die Etappe ist gerettet.'],
 riegel:['Ein Müsliriegel. Mo isst ihn im Gehen, das zählt als Pause.','Müsliriegel eingesteckt. Nuss, Honig, kein Gewissen.'],
 apfel:['Ein Apfel. Auf dem Weg gefunden, also Bio.','Apfel gefunden. Der Wurm kommt ungefragt mit.'],
 stiefel:['Ein Gummistiefel, ohne Partner. Im Moor ist das fast die Regel.','Gummistiefel gefunden. Der andere steckt wahrscheinlich noch im Schlamm.'],
 korb:['Ein Körbchen Moorbeeren. Mo isst eine und tut so, als wäre es Mittagessen.','Moorbeeren gefunden. Sie schmecken nach Moor, aber im guten Sinn.'],
 muschel:['Eine Muschel. Wer sie ans Ohr hält, hört das Meer, das hier sowieso gleich nebenan liegt.','Muschel gefunden. Sie ist leer und trotzdem wertvoll.'],
 karte:['Eine Wanderkarte, schon etwas feucht. Der Weg darauf stimmt wenigstens ungefähr.','Wanderkarte gefunden. Der Wegweiser fühlt sich ein wenig überflüssig.'],
 gold:['Ein goldener Hut. Ein Leben zurück. Der Wegweiser ist beinahe gerührt.','Goldener Hut gefunden. Wer so etwas verliert, hat wohl viele.']};
var CAVEK=['kristall','helm','batterie','riegel'],RIDGEK=['schoki','brille','thermo','apfel'],MOORK=['stiefel','korb','thermo'],KUESTEK=['muschel','karte'];
function genItems(obs,bn){
 var it=[],base=function(o){return o.bx-(OFF[o.t]||0)},bs=obs.map(base).sort(function(a,b){return a-b}),mids=[];
 for(var i=0;i+1<bs.length;i++){if(bs[i+1]-bs[i]>=330)mids.push((bs[i]+bs[i+1])/2)}
 var kinds=['brot','thermo','riegel','apfel'],used={};
 /* erste Fundstelle vor dem ersten Hindernis, mit Hinweis */
 it.push({k:bn===5?'eichel':bn===4?'zahnrad':bn===3?'flasche':bn===2?'stiefel':bn?'kristall':'brot',bx:520,state:0,seen:false,tut:!bn});
 /* Goldene-Hut-Plätze: einer je Etappe, werden erst im Spiel aktiv, wenn Mo ein Leben verloren hat */
 for(var st=0;st<NST;st++){[1700].forEach(function(off){var t=st*STAGE+off,bi=-1,bd=1e9;mids.forEach(function(m,j){var d=Math.abs(m-t);if(!used[j]&&d<bd){bd=d;bi=j}});if(bi>=0&&bd<450){used[bi]=1;it.push({k:'goldslot',bx:mids[bi],state:0,seen:false})}})}
 /* normale Funde in etwa jeder zweiten Lücke */
 mids.forEach(function(m,j){if(!used[j]&&m>900&&Math.random()<(bn===3?(m<STAGE?.92:.7):bn?.75:.5)){var ks=bn===5?GBITEMS[Math.min(3,Math.floor(m/STAGE))]:bn===4?AITEMS[Math.min(3,Math.floor(m/STAGE))]:bn===3?(m<STAGE?ALTK:FRIEDK):bn===2?(m<STAGE?MOORK:KUESTEK):bn?(m<STAGE?CAVEK:RIDGEK):kinds;it.push({k:ks[Math.floor(Math.random()*ks.length)],bx:m,state:0,seen:false})}});
 if(bn===4)for(var bst=0;bst<4;bst++){var bt=bst*STAGE+2500,bbest=-1,bdd=1e9;mids.forEach(function(m,j){var d=Math.abs(m-bt);if(!used[j]&&d<bdd){bdd=d;bbest=j}});if(bbest>=0){var bm=mids[bbest];it=it.filter(function(f){return Math.abs(f.bx-bm)>2});it.push({k:ABONK[bst],bx:bm,state:0,seen:false})}}
 if(bn===5)for(var gst=0;gst<4;gst++){var gl=GBBONK[gst];for(var gk=0;gk<gl.length;gk++){var gt0=gst*STAGE+(gl.length>1?(gk?3300:1900):2500),gbest=-1,gdd=1e9;mids.forEach(function(m,j){var d=Math.abs(m-gt0);if(!used[j]&&d<gdd){gdd=d;gbest=j}});if(gbest>=0){var gm=mids[gbest];used[gbest]=1;it=it.filter(function(f){return Math.abs(f.bx-gm)>2});it.push({k:gl[gk],bx:gm,state:0,seen:false})}}}
 /* in der Altstadt zählt nur Pfand, der vor dem Automaten liegt (dort wird abgerechnet) */
 if(bn===3)it=it.filter(function(f){return!(f.bx>PFX-110&&f.bx<BSTAGE)});
 return it}
function twinkle(tx,ty,ts,ph){var q=(Math.sin(ts/260+ph)+1)/2;x.fillStyle='rgba(255,255,255,'+(.3+.6*q)+')';x.beginPath();x.moveTo(tx,ty-4*q-1);x.lineTo(tx+1.3,ty-1.3);x.lineTo(tx+4*q+1,ty);x.lineTo(tx+1.3,ty+1.3);x.lineTo(tx,ty+4*q+1);x.lineTo(tx-1.3,ty+1.3);x.lineTo(tx-4*q-1,ty);x.lineTo(tx-1.3,ty-1.3);x.closePath();x.fill()}
function itemDraw(it,X,ts){
 var k=it.k;
 x.fillStyle='rgba(0,0,0,.18)';x.beginPath();x.ellipse(X+1,FY+2,k==='gold'?17:13,3,0,0,6.3);x.fill();
 if(k==='gold'){var gl=.4+.14*Math.sin(ts/300),gg=x.createRadialGradient(X,FY-8,2,X,FY-8,30);gg.addColorStop(0,'rgba(255,226,110,'+gl+')');gg.addColorStop(1,'rgba(255,226,110,0)');x.fillStyle=gg;x.beginPath();x.arc(X,FY-8,30,0,6.3);x.fill()}
 if(isAB(k))aGlow(X,ts);if(k==='brot'){
  x.fillStyle='#3a86b4';x.beginPath();x.roundRect(X-13,FY-11,26,11,3);x.fill();
  x.fillStyle='#63b1de';x.beginPath();x.roundRect(X-14,FY-16,28,6,3);x.fill();
  x.fillStyle='#e8eef0';x.fillRect(X-3,FY-13,6,5);x.fillStyle='#9ad0ef';x.fillRect(X-11,FY-15,10,1.5)}
 else if(k==='thermo'){
  x.fillStyle='#c0392b';x.beginPath();x.roundRect(X-5,FY-24,10,24,3);x.fill();
  x.fillStyle='#e6e9ec';x.fillRect(X-5,FY-14,10,2.2);
  x.fillStyle='#cfd5d8';x.beginPath();x.roundRect(X-6,FY-30,12,7,3);x.fill();
  x.strokeStyle='#8a2a20';x.lineWidth=2;x.beginPath();x.arc(X+6,FY-16,4,-1.2,1.2);x.stroke();
  x.fillStyle='rgba(255,255,255,.3)';x.fillRect(X-3.5,FY-22,1.8,16)}
 else if(k==='riegel'){
  x.save();x.translate(X,FY-5);x.rotate(-.1);
  x.fillStyle='#e08a2a';x.beginPath();x.roundRect(-13,-4.5,26,9,2);x.fill();
  x.fillStyle='#f6c36a';x.fillRect(-13,-1,26,2);
  x.fillStyle='#b86a1a';x.fillRect(-15,-4.5,2.4,9);x.fillRect(12.6,-4.5,2.4,9);
  x.fillStyle='#4a8c3f';x.beginPath();x.ellipse(-4,0,3.2,1.5,.3,0,6.3);x.fill();x.restore()}
 else if(k==='apfel'){
  x.fillStyle='#c6372b';x.beginPath();x.arc(X,FY-7,7,0,6.3);x.fill();
  x.fillStyle='rgba(255,255,255,.35)';x.beginPath();x.ellipse(X-2.5,FY-9,1.8,2.8,-.5,0,6.3);x.fill();
  x.strokeStyle='#5a3a20';x.lineWidth=1.4;x.beginPath();x.moveTo(X,FY-14);x.lineTo(X+1,FY-17.5);x.stroke();
  x.fillStyle='#4a8c3f';x.beginPath();x.ellipse(X+3.5,FY-15.5,3.2,1.6,-.4,0,6.3);x.fill()}
 else if(k==='kristall'){crystals(X,FY,.55,false,1,ts,X*.01)}
 else if(k==='helm'){
  x.fillStyle='#f2c230';x.beginPath();x.ellipse(X,FY-4,12,10,0,Math.PI,0);x.fill();
  x.fillStyle='#d9a81f';x.fillRect(X-15,FY-5,30,4);x.fillStyle='#fbe38a';x.fillRect(X-1.5,FY-14,3,9);
  x.fillStyle='#fff3b0';x.beginPath();x.arc(X+6,FY-9,2.2,0,6.3);x.fill()}
 else if(k==='batterie'){
  x.fillStyle='#2f9e44';x.beginPath();x.roundRect(X-5,FY-17,10,17,2);x.fill();
  x.fillStyle='#cfd5d8';x.fillRect(X-2.5,FY-20,5,3);x.fillStyle='#fff';x.fillRect(X-3,FY-11,6,1.4);x.fillRect(X-.7,FY-13.3,1.4,6)}
 else if(k==='schoki'){
  x.save();x.translate(X,FY-5);x.rotate(-.08);x.fillStyle='#5a2e1a';x.beginPath();x.roundRect(-12,-5,24,10,2);x.fill();
  x.strokeStyle='#3a1c0f';x.lineWidth=1;[-4,4].forEach(function(d){x.beginPath();x.moveTo(d,-5);x.lineTo(d,5);x.stroke()});
  x.fillStyle='#cfd5d8';x.fillRect(-12,3,24,2);x.fillStyle='#c6372b';x.fillRect(-12,-1,24,2.4);x.restore()}
 else if(k==='brille'){
  x.strokeStyle='#22262e';x.lineWidth=1.6;x.fillStyle='#3a4a6a';[-6.5,6.5].forEach(function(d){x.beginPath();x.arc(X+d,FY-7,5,0,6.3);x.fill();x.stroke()});
  x.beginPath();x.moveTo(X-1.5,FY-8);x.lineTo(X+1.5,FY-8);x.moveTo(X-11.5,FY-8);x.lineTo(X-15,FY-10);x.moveTo(X+11.5,FY-8);x.lineTo(X+15,FY-10);x.stroke()}
 else if(k==='gold'){
  x.fillStyle='#a8791a';x.beginPath();x.ellipse(X,FY-3,17,4.4,0,0,6.3);x.fill();
  x.fillStyle='#e8b830';x.beginPath();x.ellipse(X,FY-4.6,17,4.4,0,0,6.3);x.fill();
  x.fillStyle='#f6d457';x.beginPath();x.ellipse(X,FY-5.4,9.5,9,0,Math.PI,0);x.fill();
  x.fillStyle='#9a6f12';x.fillRect(X-9.4,FY-7.4,18.8,3.2);
  x.fillStyle='#fff7d0';x.beginPath();x.moveTo(X-8,FY-9);x.quadraticCurveTo(X-17,FY-18,X-22,FY-22);x.quadraticCurveTo(X-12,FY-20,X-6,FY-10);x.closePath();x.fill()}
 else if(AITEM[k]){drawItem4(k,X)}
 else if(GITEM[k]){drawItem5(k,X)}
 else if(k==='stiefel'||k==='korb'||k==='muschel'||k==='karte'){drawItem2(k,X)}
 else if(k==='flasche'||k==='pet'||k==='droeppel'||k==='waffel'||k==='kerze'||k==='laterne'||k==='kuerbis'){drawItem3(k,X)}
 if(it.state===0){twinkle(X+(k==='thermo'?10:12),FY-(k==='thermo'?28:20),ts,X*.07);if(k==='gold')twinkle(X-14,FY-12,ts,X*.05+2)}}
function itemsDraw(ts){
 g.items.forEach(function(it){if(it.state===1||it.k==='goldslot')return;var X=it.bx-g.run;if(X<-40||X>W+60)return;itemDraw(it,X,ts);
  if(it.tut&&it.state===0&&X>140){var by=-Math.abs(Math.sin(ts/260))*4,lw=62;x.fillStyle='rgba(30,22,14,.72)';x.beginPath();x.roundRect(X-lw/2,FY-62+by,lw,17,7);x.fill();
   x.beginPath();x.moveTo(X-5,FY-45.5+by);x.lineTo(X+5,FY-45.5+by);x.lineTo(X,FY-39+by);x.closePath();x.fill();
   x.fillStyle='#fbf3e0';x.font='bold 11px system-ui,sans-serif';x.textAlign='center';x.fillText('Bücken!',X,FY-50+by);x.textAlign='left'}})}
function itemsStep(dt){
 g.items.forEach(function(it){
  if(it.state!==0)return;
  var X=it.bx-g.run;
  if(!it.seen&&X<W+60){it.seen=true;
   if(it.k==='goldslot'){if(g.wuerde<3&&g.run-g.lastGold>3200){it.k='gold';g.fundMax++}else{it.state=2;return}}
   else g.fundMax++}
  if(it.k==='goldslot'){return}
  if(Math.abs(X-150)<22&&mm.dk>.55&&!mm.air){
   it.state=1;g.funde++;var gold=it.k==='gold',abon=isAB(it.k),heal=false;
   if(it.k==='flasche'){g.pfand+=8;g.fl++}else if(it.k==='pet'){g.pfand+=25;g.fl++}
   if(gold||abon){if(it.k==='wappen')g.inv=Math.max(g.inv,4.5);heal=g.wuerde<3;g.wuerde=Math.min(3,g.wuerde+1);if(gold)g.lastGold=g.run}
   sfx(gold||(abon&&heal)?'gold':'fund');
   var tx=pick(FUNDTXT[it.k]);if(abon&&heal&&tx.indexOf('Hut')<0)tx+=' Ein Hut kehrt zurück.';note(tx,'fund');g.q={t:tx,s:5.5,age:0};
   g.fx.push({k:it.k,x:X,age:0,b:false})}
  else if(X<150-40)it.state=2});
 g.fx.forEach(function(f){f.age+=dt;if(!f.b&&f.age>.65){f.b=true;g.bump=.3}});g.fx=g.fx.filter(function(f){return f.age<1.4});
 g.bump=Math.max(0,g.bump-dt)}
function drawFx(ts){
 var bw=198,bx=W-bw-10,hx=bx+bw-42,hy=52+39;
 g.fx.forEach(function(f){
  var p=Math.min(1,f.age/.65),e=1-Math.pow(1-p,3);
  if(f.age<.65){var sx=f.x+(hx-f.x)*e,sy=(FY-12)+(hy-(FY-12))*e-34*Math.sin(Math.PI*p),sc=1-.5*e;
   x.save();x.globalAlpha=1-p*.3;x.translate(sx,sy);x.scale(sc,sc);x.translate(-sx,-sy);x.translate(0,sy-(FY-12));itemDraw({k:f.k,state:1},sx,ts);x.restore()}
  var lp=Math.min(1,f.age/1.3),al=Math.max(0,1-lp*lp);
  x.globalAlpha=al;x.textAlign='center';x.font='bold 12px system-ui,sans-serif';
  var lab=f.k==='gold'?'Goldener Hut: +1 Leben':NAMEN[f.k]+' gefunden';
  x.fillStyle='rgba(0,0,0,.5)';x.fillText(lab,151,FY-108-16*lp+1);x.fillStyle=f.k==='gold'?'#ffe27a':'#fbf3e0';x.fillText(lab,150,FY-109-16*lp);
  x.textAlign='left';x.globalAlpha=1})}
var BWINS=['Gipfelgrat erreicht. Der Wegweiser hat es von unten schon gesehen.','Oben. Die Aussicht ist gut, der Abgrund auch. Der Wegweiser zeigt in beide Richtungen.'];
function endRun(w){sfx(w?'win':'fail');g.mode='over';g.won=w;g.tOver=0;say(pick(w?bList(WINS,BWINS,BWINS2,BWINS3,AWINS,GBWINS):FAILS),9)}
function hitMo(o){sfx('hit');g.wuerde--;g.hits++;g.inv=1.6;g.slow=.7;g.shake=.35;mm.air=true;mm.vy=-360;mm.hurt=.9;mm.sq=0;
 var htx=pick(HIT[o.t==='gap'&&g.bonus===2?'gap2':o.t]);note(htx,'hit');say(htx,6.5);g.q=null;if(g.wuerde<=0)endRun(false)}
function jumpNow(){sfx('jump');mm.air=true;mm.vy=-560;mm.sq=-.1}
function jump(){
 if(g.mode==='film'||g.mode==='map')return;
 if(g.mode==='title'){introStart();return}
 if(g.mode==='intro'){introTap();return}
 if(g.mode==='over'){if(g.tOver>(g.won?wonT():.9))start(g.bonus);return}
 if(!mm.air)jumpNow();else mm.buf=.14}
cv.addEventListener('pointerdown',function(e){e.preventDefault();var rc=cv.getBoundingClientRect(),lx=(e.clientX-rc.left)/rc.width*W,ly=(e.clientY-rc.top)/rc.height*H;if(g.paused){if(lx>W-34&&ly>H-40){muted=!muted;if(!muted)sfx('ok')}else setPause(false);return}
if(g.mode==='map'){mapTap(lx,ly);return}if(g.mode==='play'&&lx>W-58&&lx<=W-34&&ly>H-40){setPause(true);return}
if(g.mode==='intro'&&lx>W-104&&ly<38){endIntro();return}if(g.mode==='film'){if(lx>W-34&&ly>H-40){muted=!muted;if(!muted)sfx('ok')}else if(lx>W-104&&ly<38)endFilm();return}if(lx>W-34&&ly>H-40){muted=!muted;if(!muted)sfx('ok');return}if(g.mode==='over'&&zSplit()){if(lx<=215||lx>=445||ly<244||(ly>276&&ly<288)||ly>318)return;if(ly>=288){jump();return}}if(g.mode==='over'&&g.tOver>(g.won?wonT():1.6)&&lx>215&&lx<445&&ly>(zSplit()?244:280)&&ly<(zSplit()?276:306)&&((g.won&&!g.bonus)||g.bonus)){if(g.bonus>=3&&g.won){openMap();return}if(g.bonus===1&&g.won)startFilm();else if(g.bonus===2&&g.won)start(3);else start(g.bonus?0:1);return}if(g.mode==='play'&&ly>H*.66){mm.duckPtr=true;mm.duckT=.45;return}mm.hold=true;jump()});
function duckOff(){mm.duckPtr=false;mm.hold=false}
cv.addEventListener('pointerup',duckOff);cv.addEventListener('pointercancel',duckOff);cv.addEventListener('pointerleave',duckOff);
window.addEventListener('keydown',function(e){
 if(g.paused){if(e.code==='KeyP'||e.code==='Escape'||e.code==='Space'||e.code==='Enter'||e.code==='ArrowUp'||e.code==='KeyW'){e.preventDefault();setPause(false)}else if(e.code==='KeyM'){muted=!muted;if(!muted)sfx('ok')}return}
 if((e.code==='KeyP'||e.code==='Escape')&&g.mode==='play'){e.preventDefault();setPause(true);return}
 if(e.code==='Escape'&&g.mode==='intro'){endIntro();return}
 if(e.code==='Escape'&&g.mode==='film'){e.preventDefault();endFilm();return}
 if(g.mode==='over'&&e.code==='KeyB'&&g.won&&g.bonus>=3&&g.tOver>wonT()){e.preventDefault();openMap();return}
 if(g.mode==='map'){mapKey(e);return}
 if(g.mode==='over'&&e.code==='KeyB'&&g.won&&g.bonus<3&&g.tOver>wonT()){if(g.bonus===2)start(3);else if(g.bonus)startFilm();else start(1);return}
 if(g.mode==='over'&&e.code==='KeyN'&&g.bonus&&g.tOver>(g.won?wonT():1.6)){start(0);return}
 if(e.code==='KeyM'){muted=!muted;if(!muted)sfx('ok');return}
 if(e.code==='Space'||e.code==='ArrowUp'||e.code==='KeyW'||e.code==='Enter'){e.preventDefault();mm.hold=true;if(!e.repeat)jump()}
 if(e.code==='ArrowDown'||e.code==='KeyS'){e.preventDefault();mm.duckKey=true;if(!e.repeat)mm.duckT=.45}});
window.addEventListener('keyup',function(e){if(e.code==='ArrowDown'||e.code==='KeyS')mm.duckKey=false;if(e.code==='Space'||e.code==='ArrowUp'||e.code==='KeyW'||e.code==='Enter')mm.hold=false});
window.addEventListener('blur',function(){if(g.mode==='play')setPause(true)});
document.addEventListener('visibilitychange',function(){if(document.hidden&&g.mode==='play')setPause(true)});
function update(dt){
 var gt=(g.bonus&&cur==='Grat')?-40:0;
 if(g.mode==='play'){if(g.bonus===2&&cur==='Küste'){g.amb-=dt;if(g.amb<=0){g.amb=3.4+Math.random()*1.6;sfx('welle')}}}gOff+=(gt-gOff)*Math.min(1,dt*2.5);if(Math.abs(gOff-gt)<.05)gOff=gt;FY=FY0+gOff;GY=GY0+gOff;
 var target=g.mode==='play'?(g.bonus?192:150+g.stage*14)*(g.slow>0?.5:1)*(g.run>TOTAL-360?Math.max(.28,(TOTAL-g.run)/360):1):0;
 g.gs+=(target-g.gs)*Math.min(1,dt*(g.mode==='over'?2.5:5));
 if(g.gs<1)g.gs=0;
 D+=g.gs*dt;
 if(g.mode!=='title')g.run+=g.gs*dt;
 g.inv=Math.max(0,g.inv-dt);g.slow=Math.max(0,g.slow-dt);g.shake=Math.max(0,g.shake-dt);g.ban=Math.max(0,g.ban-dt);if(g.mode==='play')g.hint=Math.max(0,g.hint-dt);mm.hurt=Math.max(0,mm.hurt-dt);mm.buf=Math.max(0,mm.buf-dt);
 if(g.tr>=0){g.tr+=dt/1.1;if(g.tr>=.5&&g.pend){cur=g.pend;g.pend=null}if(g.tr>=1)g.tr=-1}
 if(g.mode==='over')g.tOver+=dt;
 if(g.mode==='intro')introStep(dt);
 if(g.mode==='film')filmStep(dt);
 if(g.mode==='over'&&g.bonus===2&&g.won){var ee=g.tOver-.9;if(ee>=0){var nn=Math.floor(ee/1.3),pp=(ee%1.3)/1.3;if(nn<4&&pp>.15&&g.bite!==nn){g.bite=nn;sfx('kau')}}}
 mm.duckT=Math.max(0,mm.duckT-dt);mm.sit+=(((g.mode==='over'&&!g.won&&!mm.air)?1:0)-mm.sit)*Math.min(1,dt*3.5);mm.dk+=(((!mm.air&&g.mode==='play'&&(mm.duckKey||mm.duckPtr||mm.duckT>0))?1:0)-mm.dk)*Math.min(1,dt*20);
 if(mm.air){mm.vy+=((mm.hold&&mm.vy<0)?1100:1500)*dt;mm.y-=mm.vy*dt;if(mm.y<=0){mm.y=0;mm.air=false;mm.vy=0;mm.sq=.2;sfx('land');if(mm.buf>0){mm.buf=0;jumpNow()}}}
 else{if(g.gs>6)mm.ph+=dt*9*Math.max(.6,g.gs/150);var stp=Math.floor(mm.ph/Math.PI);if(stp!==mm.stp){mm.stp=stp;if(g.gs>20)sfx('step')}if(mm.sq>0)mm.sq=Math.max(0,mm.sq-dt*.9)}
 if(g.mode!=='play')return;
 var st=Math.min(NST-1,Math.floor(g.run/STAGE));
 if(st!==g.stage){g.stage=st;g.tr=0;g.pend=bList(SEA,BSEA,BSEA2,BSEA3,ASEA,GBSEA)[st];banner(st)}
 for(var i=0;i<g.obs.length&&g.mode==='play';i++){var o=g.obs[i],X=ox(o),hw=HW[o.t];
  if(!o.snd&&g.bonus>=2&&X<W-80&&X>0){o.snd=1;var sn={hedge:'igel',crow:'krah',gull:'moewe',katze:'miau',geist:'buh',tauben:'gurr'}[o.t];if(sn)sfx(sn)}
  if(!o.hit&&g.inv<=0&&Math.abs(X-150)<hw+2&&(LUFT[o.t]?(!(mm.dk>.5&&!mm.air)&&mm.y<128):GBBOTH[o.t]?(!(mm.dk>.5&&!mm.air)&&mm.y<HH[o.t]*.7):HANG[o.t]?!(mm.dk>.5&&!mm.air):mm.y<HH[o.t]*.7)){o.hit=true;hitMo(o)}
  if(!o.done&&X<150-hw-12){o.done=true;if(!o.hit){g.dodged++;sfx('ok');if(Math.random()<.4){var dtx=pick(DODGE[o.t==='gap'&&g.bonus===2?'gap2':o.t]);note(dtx,'dodge');g.q={t:dtx,s:5.5,age:0}}}}}
 itemsStep(dt);
 if(g.bonus===3){if(!g.pfandDone&&PFX-g.run<190)pfandPass();if(g.pfandT>=0)g.pfandT+=dt}
 g.chat-=dt;if(g.chat<=0){g.chat=14+Math.random()*6;if(msgT<=0&&!g.q)g.q={t:pick(CHAT),s:6,age:0}}
 if(g.q){g.q.age+=dt;var dmin=1e9;g.obs.forEach(function(o){if(!o.done){var X=ox(o);if(X>-40&&X-150<dmin)dmin=X-150}});if(g.q.age>3.5)g.q=null;else if(msgT<=0&&dmin>300){say(g.q.t,g.q.s);g.q=null}}
 if(g.mode==='play'&&g.run>=TOTAL)endRun(true);
}
function deco(P,o,y0,y1,n,scale){
 for(var i=0;i<n;i++){var wx=i*LOOP/n+R(i+40)*18,p=md(wx-o,LOOP),y=y0+R(i+77)*(y1-y0),k=Math.floor(R(i+9)*3);
  [p,p-LOOP].forEach(function(q){if(q<-20||q>W+20)return;var s=scale*(.8+R(i)*.5);
   if(P.k==='spring'||P.k==='summer'){
    if(k===0){x.strokeStyle='#3f7a38';x.lineWidth=1.3;x.beginPath();x.moveTo(q,y);x.lineTo(q,y-9*s);x.stroke();
     var cols=P.k==='spring'?['#ffffff','#f4a6c0','#ffe27a']:['#ffd84a','#6fa0e8','#ffffff'];x.fillStyle=cols[i%3];
     for(var a=0;a<5;a++){x.beginPath();x.arc(q+Math.cos(a*1.257)*2.8*s,y-9*s+Math.sin(a*1.257)*2.8*s,1.9*s,0,6.3);x.fill()}
     x.fillStyle='#e8a82a';x.beginPath();x.arc(q,y-9*s,1.4*s,0,6.3);x.fill()}
    else if(k===1){x.strokeStyle=P.k==='spring'?'#3f7a38':'#2f6a30';x.lineWidth=1.5;x.lineCap='round';for(var b=-2;b<=2;b++){x.beginPath();x.moveTo(q,y);x.quadraticCurveTo(q+b*3*s,y-8*s,q+b*5*s,y-11*s+Math.abs(b)*2);x.stroke()}}
    else{x.fillStyle='rgba(0,0,0,.15)';x.beginPath();x.ellipse(q+2,y+1,8*s,3*s,0,0,6.3);x.fill();x.fillStyle='#8f969a';x.beginPath();x.ellipse(q,y,7*s,4.5*s,0,0,6.3);x.fill();x.fillStyle='#aab0b4';x.beginPath();x.ellipse(q-2*s,y-1.5*s,3*s,1.6*s,0,0,6.3);x.fill()}}
   else if(P.k==='autumn'){
    if(k===0){x.fillStyle='#efe4cf';x.fillRect(q-1.2*s,y-5*s,2.4*s,5*s);x.fillStyle=i%2?'#c6372b':'#8a5a34';x.beginPath();x.ellipse(q,y-5*s,5*s,3.4*s,0,3.14,6.28);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(q-1.5*s,y-6.5*s,.8*s,0,6.3);x.fill()}
    else if(k===1){var lc=['#c2461e','#d08a2a','#8f4a1e'];lc.forEach(function(c,j){x.fillStyle=c;x.beginPath();x.ellipse(q+(j-1)*5*s,y-1.5*s*(j===1?1.5:1),6*s,2.8*s*(j===1?1.6:1),0,3.14,6.28);x.fill()})}
    else{x.strokeStyle='#7a4a1c';x.lineWidth=1.5;x.lineCap='round';for(var b2=-2;b2<=2;b2++){x.beginPath();x.moveTo(q,y);x.quadraticCurveTo(q+b2*3*s,y-8*s,q+b2*5*s,y-10*s+Math.abs(b2)*2);x.stroke()}}}
   else if(P.k==='winter'){
    if(k===0){x.fillStyle='rgba(120,150,175,.35)';x.beginPath();x.ellipse(q+2,y+1.5,9*s,3*s,0,0,6.3);x.fill();x.fillStyle='#ffffff';x.beginPath();x.ellipse(q,y,9*s,4.4*s,0,3.14,6.28);x.fill()}
    else if(k===1){x.fillStyle='#c9e2ee';x.beginPath();x.ellipse(q,y,10*s,2.8*s,0,0,6.3);x.fill()}
    else{x.strokeStyle='#6b5a4a';x.lineWidth=1.3;x.lineCap='round';for(var b3=-1;b3<=1;b3++){x.beginPath();x.moveTo(q,y);x.lineTo(q+b3*3*s,y-8*s);x.stroke()}x.fillStyle='#fff';x.beginPath();x.ellipse(q,y,4*s,1.6*s,0,0,6.3);x.fill()}}
   else{x.fillStyle='#3a4e63';x.beginPath();x.ellipse(q,y,6*s,3.6*s,0,3.14,6.28);x.fill();x.strokeStyle='#2c3f55';x.lineWidth=1.3;for(var b4=-1;b4<=1;b4++){x.beginPath();x.moveTo(q+b4*3,y);x.lineTo(q+b4*4,y-7*s);x.stroke()}}
  })}
}
function fence(P,o){
 var wood=P.night?'#2a2018':'#8a6238',wood2=P.night?'#1c150f':'#6b4a28';
 for(var k=0;k<25;k++){var seg=Math.floor(k/5);if(R(seg+5)<.45)continue;
  var p=md(k*54-o,LOOP);[p,p-LOOP].forEach(function(q){if(q<-30||q>W+60)return;
   x.fillStyle='rgba(0,0,0,.12)';x.fillRect(q-1,GY+14,6,8);
   x.fillStyle=wood;x.fillRect(q-2,GY-1,5,22);x.fillStyle=wood2;x.fillRect(q+1,GY-1,2,22);
   if(k%5!==4){x.fillStyle=wood;x.fillRect(q+3,GY+4,51,3.5);x.fillRect(q+3,GY+12,51,3.5);
    if(P.snow){x.fillStyle='#fff';x.fillRect(q+3,GY+2.5,51,2);x.fillRect(q-2,GY-3,5,3)}}})}
}
function hutText(wx){
 var m=Math.max(0,Math.round((TOTAL-wx)/PXM));
 if(m>=1000){var km=Math.round(m/100)/10;return 'Hütte '+(km%1===0?String(km):String(km).replace('.',','))+' km'}
 return 'Hütte '+(Math.round(m/50)*50)+' m'}
function signpost(P,o){
 x.font='500 11px system-ui,sans-serif';
 var t2='Aussicht',w2=x.measureText(t2).width;
 for(var k=0;;k++){var wx=900+k*1350;if(wx>TOTAL-600)break;var q=wx-o;if(q<-80||q>W+80)continue;
  var t1=hutText(wx),w1=x.measureText(t1).width,gy=GY+26;
  x.fillStyle='rgba(0,0,0,.18)';x.beginPath();x.ellipse(q+2,gy+2,12,3,0,0,6.3);x.fill();
  x.fillStyle=P.night?'#2a2018':'#7a5430';x.fillRect(q-3,gy-58,6,60);
  var b1=P.night?'#4a3a24':'#c9a26a',b2=P.night?'#43331f':'#b8925a',tx=P.night?'#e0d2b0':'#3a2918';
  var l1=q-w1/2-8,r1=q+w1/2+8;
  x.fillStyle=b1;x.beginPath();x.moveTo(l1,gy-52);x.lineTo(r1,gy-52);x.lineTo(r1+9,gy-43);x.lineTo(r1,gy-34);x.lineTo(l1,gy-34);x.closePath();x.fill();
  x.fillStyle='rgba(0,0,0,.12)';x.fillRect(l1,gy-35.5,r1-l1,1.5);
  x.fillStyle=tx;x.fillText(t1,q-w1/2,gy-39.5);
  var l2=q-w2/2-8,r2=q+w2/2+8;
  x.fillStyle=b2;x.beginPath();x.moveTo(r2,gy-30);x.lineTo(l2,gy-30);x.lineTo(l2-9,gy-21);x.lineTo(l2,gy-12);x.lineTo(r2,gy-12);x.closePath();x.fill();
  x.fillStyle='rgba(0,0,0,.12)';x.fillRect(l2,gy-13.5,r2-l2,1.5);
  x.fillStyle=tx;x.fillText(t2,q-w2/2,gy-17.5);
  if(P.snow){x.fillStyle='#fff';x.fillRect(l1,gy-54,r1-l1,3);x.fillRect(l2,gy-32,r2-l2,3);x.fillRect(q-4,gy-61,8,3)}}
}
function steckbrief(P,px,seed,al){
 var w=36,h=48,bx=px-w/2+(R(seed)*4-2),by=130,ni=P.night,rot=(R(seed+5)-.5)*.1;
 x.save();x.translate(px,by);x.rotate(rot);x.translate(-px,-by);
 x.fillStyle='rgba(0,0,0,.28)';x.fillRect(bx+2.5,by+3,w,h);
 x.fillStyle=ni?'#b9ad8a':'#f1e5c1';x.fillRect(bx,by,w,h);
 x.fillStyle=ni?'#a39772':'#dccb9e';x.beginPath();x.moveTo(bx+w,by+h-9);x.lineTo(bx+w,by+h);x.lineTo(bx+w-9,by+h);x.closePath();x.fill();
 x.strokeStyle=ni?'#8f825f':'#b79f6a';x.lineWidth=1;x.strokeRect(bx+.5,by+.5,w-1,h-1);
 x.textAlign='center';x.fillStyle=ni?'#6a2a1c':'#7a2a1a';x.font='bold 7px Georgia,serif';var gw=x.measureText('GESUCHT').width,gf=Math.min(6,7*(w-12)/gw);x.font='bold '+gf.toFixed(2)+'px Georgia,serif';x.fillText('GESUCHT',px,by+11);
 x.fillStyle=ni?'#8f825f':'#b79f6a';x.fillRect(bx+6,by+14,w-12,1);
 logoBW(px,by+27,10,al);
 x.fillStyle=ni?'#2a2a2a':'#222222';x.font='bold 7px system-ui,sans-serif';x.fillText('mitrilmo',px,by+44);
 x.fillStyle='#c6372b';x.beginPath();x.arc(px,by+3,2.3,0,6.3);x.fill();x.fillStyle='rgba(255,255,255,.55)';x.beginPath();x.arc(px-.8,by+2.2,.8,0,6.3);x.fill();
 x.textAlign='left';x.restore()}
function fgTree(P,px,a,seed,brief){
 x.globalAlpha=a;
 var tr=P.trunk;
 x.fillStyle='rgba(0,0,0,.16)';x.beginPath();x.moveTo(px-10,H);x.lineTo(px-8,-10);x.lineTo(px+14,-10);x.lineTo(px+20,H);x.closePath();x.fill();
 x.fillStyle=tr;x.beginPath();x.moveTo(px-26,H);x.quadraticCurveTo(px-14,H-24,px-14,H-60);x.quadraticCurveTo(px-12,150,px-11,-10);x.lineTo(px+11,-10);x.quadraticCurveTo(px+13,150,px+14,H-60);x.quadraticCurveTo(px+14,H-24,px+28,H);x.closePath();x.fill();
 x.strokeStyle='rgba(255,255,255,.13)';x.lineWidth=1.6;
 for(var k=-1;k<=1;k++){x.beginPath();x.moveTo(px+k*6,H-6);x.quadraticCurveTo(px+k*7+3,150,px+k*5,-6);x.stroke()}
 x.strokeStyle='rgba(0,0,0,.25)';x.lineWidth=1.4;x.beginPath();x.moveTo(px+7,H);x.quadraticCurveTo(px+9,160,px+6,-6);x.stroke();
 x.fillStyle='rgba(255,255,255,.1)';x.beginPath();x.ellipse(px-4,120,3,9,0,0,6.3);x.ellipse(px+5,210,2.4,7,0,0,6.3);x.fill();
 if(brief)steckbrief(P,px,seed,a);
 var lf=P.leaf,lf2=P.snow?'#d7e4ec':mix(P.leaf,'#000000',.28);
 [1,0].forEach(function(l){
  x.fillStyle=l?lf:lf2;
  var oy=l?0:-7;
  for(var c=-4;c<=4;c++){var cx=px+c*14+(l?0:6),r=15+R(Math.abs(c)+seed)*9;x.beginPath();x.arc(cx,oy+8,r,0,6.3);x.fill();
   x.beginPath();x.moveTo(cx-r*.6,oy+12);x.lineTo(cx,oy+r*1.5+16+R(c+9+seed)*10);x.lineTo(cx+r*.6,oy+12);x.closePath();x.fill()}
 });
 x.strokeStyle=tr;x.lineWidth=7;x.lineCap='round';x.beginPath();x.moveTo(px+8,60);x.lineTo(px+52,34);x.moveTo(px-8,80);x.lineTo(px-48,56);x.stroke();
 x.fillStyle=lf;x.beginPath();x.ellipse(px+56,38,13,8,-.4,0,6.3);x.ellipse(px-52,60,13,8,.4,0,6.3);x.fill();
 x.globalAlpha=1;
}
var parts=[];for(var pi=0;pi<42;pi++)parts.push({x:R(pi)*W,y:R(pi+50)*H,v:20+R(pi+7)*30,r:1.4+R(pi+3)*2.4,ph:R(pi+11)*6.3});
function drawParts(P,ts,o){
 parts.forEach(function(p,i){
  var px=md(p.x-o*.5+Math.sin(ts/900+p.ph)*14,W+30)-15,py;
  if(P.k==='winter'){py=md(p.y+ts/1000*p.v*1.2,H+20)-10;x.fillStyle='rgba(255,255,255,.9)';x.beginPath();x.arc(px,py,p.r*.9,0,6.3);x.fill()}
  else if(P.k==='autumn'){py=md(p.y+ts/1000*p.v,H+20)-10;x.save();x.translate(px,py);x.rotate(ts/500+p.ph);x.fillStyle=['#c2461e','#d08a2a','#8f4a1e'][i%3];x.beginPath();x.ellipse(0,0,p.r*1.8,p.r*1.0,0,0,6.3);x.fill();x.strokeStyle='rgba(0,0,0,.25)';x.lineWidth=.8;x.beginPath();x.moveTo(-p.r*1.8,0);x.lineTo(p.r*1.8,0);x.stroke();x.restore()}
  else if(P.k==='spring'){py=md(p.y+ts/1000*p.v*.6,H+20)-10;x.save();x.translate(px,py);x.rotate(ts/700+p.ph);x.fillStyle=i%2?'#ffffff':'#f4a6c0';x.beginPath();x.ellipse(0,0,p.r*1.3,p.r*.8,0,0,6.3);x.fill();x.restore()}
  else if(P.k==='summer'){if(i>3)return;py=120+R(i)*130+Math.sin(ts/500+p.ph)*10;var fl=Math.sin(ts/60+p.ph)*3.5;x.fillStyle=['#f2a03a','#ffffff','#6fa0e8'][i%3];x.beginPath();x.ellipse(px-2,py,3.2,2+Math.abs(fl)*.3,-.5,0,6.3);x.ellipse(px+2,py,3.2,2+Math.abs(fl)*.3,.5,0,6.3);x.fill();x.fillStyle='#333';x.fillRect(px-.6,py-2,1.2,4)}
  else{if(i>7)return;py=130+R(i+2)*150+Math.sin(ts/700+p.ph)*12;var gl=.5+.5*Math.sin(ts/400+p.ph);x.fillStyle='rgba(255,230,120,'+(.12+.12*gl)+')';x.beginPath();x.arc(px,py,6,0,6.3);x.fill();x.fillStyle='rgba(255,240,150,'+(.6+.4*gl)+')';x.beginPath();x.arc(px,py,1.7,0,6.3);x.fill()}
 })
}
var bubK='',bubL=[],bubW=0;
function bubble(){
 if(msgT<=0||g.clean||zSplit())return;var a=Math.min(1,msgT);x.globalAlpha=a;
 x.font='13px system-ui,sans-serif';x.textAlign='left';var t='Wegweiser: '+msg,mxw=W-32-(g.mode==='intro'?Math.round(90*FB)+8:0),ls,bk=t+'|'+mxw+'|'+g.mode+'|'+FB;if(bubK!==bk){bubK=bk;ls=wrap(t,mxw-34);if(ls.length>1&&g.mode==='play'){mxw=Math.min(mxw,446);ls=wrap(t,mxw-34)}bubL=ls;bubW=Math.min(mxw,Math.max.apply(null,ls.map(function(s){return x.measureText(s).width}))+34)}ls=bubL;var w=bubW;
 var bh=Math.round(30*(1+(FB-1)*.8))+(ls.length-1)*Math.round(17*FB);x.fillStyle='rgba(0,0,0,.18)';x.beginPath();x.roundRect(18,17,w,bh,8);x.fill();
 x.fillStyle='#fbf3e0';x.beginPath();x.roundRect(16,14,w,bh,8);x.fill();
 x.fillStyle='#4b3320';x.fillRect(16,14,6,bh);
 x.fillStyle='#3a2918';var l0=14+bh/2+4.5*FB-(ls.length-1)*Math.round(17*FB)/2;ls.forEach(function(s,i){x.fillText(s,32,l0+i*Math.round(17*FB))});x.globalAlpha=1}
/* ---------- Oberfläche ---------- */
function wrap(t,mw){var ws=t.split(' '),ls=[],l='';ws.forEach(function(w){var tt=l?l+' '+w:w;if(x.measureText(tt).width>mw&&l){ls.push(l);l=w}else l=tt});if(l)ls.push(l);return ls}
function plate(px,py,w,h,a){x.globalAlpha=a;x.fillStyle='rgba(0,0,0,.22)';x.beginPath();x.roundRect(px+2,py+3,w,h,10);x.fill();x.fillStyle='#fbf3e0';x.beginPath();x.roundRect(px,py,w,h,10);x.fill();x.fillStyle='#4b3320';x.fillRect(px,py+8,5,h-16)}
function hudHat(cx,cy,full){x.globalAlpha=full?1:.25;
 x.fillStyle='#a8743f';x.beginPath();x.ellipse(cx,cy+3,9,3.2,0,0,6.3);x.fill();
 x.fillStyle='#93642f';x.beginPath();x.ellipse(cx,cy+1,5.4,5.6,0,Math.PI,0);x.fill();
 x.fillStyle='#2a6634';x.fillRect(cx-5.6,cy,11.2,2.2);
 x.globalAlpha=1}
function hud(){
 var bw=Math.round(198*FB),bx=W-bw-10,by=52,hh=Math.round(24*(1+(FB-1)*.8));
 x.fillStyle='rgba(30,22,14,.72)';x.beginPath();x.roundRect(bx,by,bw,hh,8);x.fill();
 for(var i=0;i<3;i++)hudHat(bx+16+i*22,by+hh/2-1,i<g.wuerde);
 x.fillStyle='#fbf3e0';x.font='12px system-ui,sans-serif';x.textAlign='right';
 x.fillText((g.bonus>=4?'Szene '+(g.stage+1)+'/4':g.bonus?'Bonus '+bnum()+'/6':'Etappe '+(g.stage+1)+'/6')+' · '+Math.min(Math.round(TOTAL/PXM),Math.round(g.run/PXM))+' m',bx+bw-10,by+hh/2+4.5*FB);x.textAlign='left';
 if(g.fundMax>0){var fw=Math.round(96*FB),fh=Math.round(20*(1+(FB-1)*.8)),fx0=bx+bw-fw,fy0=by+hh+4,sc=1+.3*Math.min(1,g.bump/.3);x.save();x.translate(fx0+fw/2,fy0+fh/2);x.scale(sc,sc);x.translate(-(fx0+fw/2),-(fy0+fh/2));
  x.fillStyle='rgba(30,22,14,.72)';x.beginPath();x.roundRect(fx0,fy0,fw,fh,8);x.fill();
  x.fillStyle='#fbf3e0';x.font='12px system-ui,sans-serif';x.textAlign='right';x.fillText('Funde: '+g.funde,fx0+fw-10,fy0+fh/2+4.5*FB);x.textAlign='left';x.restore()}
 var pw=W-20,pr=Math.min(1,g.run/TOTAL);
 x.fillStyle='rgba(0,0,0,.28)';x.beginPath();x.roundRect(10,H-9,pw,5,2.5);x.fill();
 x.fillStyle='#f2c230';x.beginPath();x.roundRect(10,H-9,Math.max(5,pw*pr),5,2.5);x.fill();
 x.fillStyle='rgba(255,255,255,.55)';for(var k=1;k<NST;k++)x.fillRect(10+pw*k/NST-.5,H-9,1,5);
}
var TOUCH=(window.matchMedia&&matchMedia('(pointer:coarse)').matches)||('ontouchstart' in window);
window.addEventListener('resize',fbUpdate);window.addEventListener('orientationchange',fbUpdate);fbUpdate();
function keycap(kx,ky,label){x.font='bold 11px system-ui,sans-serif';var kw=Math.max(22,x.measureText(label).width+14);
 x.fillStyle='#b8a47a';x.beginPath();x.roundRect(kx,ky+3,kw,20,5);x.fill();
 x.fillStyle='#f2e8cc';x.beginPath();x.roundRect(kx,ky,kw,20,5);x.fill();
 x.fillStyle='#3a2918';x.textAlign='center';x.fillText(label,kx+kw/2,ky+14);x.textAlign='left';return kw}
function labelPill(X,yb,text){
 x.font='bold 11px system-ui,sans-serif';var lw=Math.max(62,x.measureText(text).width+18),ph=Math.round(17*(1+(FB-1)*.8)),by=-Math.abs(Math.sin(NOW/260))*4;
 x.fillStyle='rgba(30,22,14,.78)';x.beginPath();x.roundRect(X-lw/2,yb-6-ph+by,lw,ph,7);x.fill();
 x.beginPath();x.moveTo(X-5,yb-6.5+by);x.lineTo(X+5,yb-6.5+by);x.lineTo(X,yb+by);x.closePath();x.fill();
 x.fillStyle='#fbf3e0';x.textAlign='center';x.fillText(text,X,yb-6-ph/2+3.5*FB+by);x.textAlign='left'}
function banner2(){
 if(g.ban<=0||g.mode!=='play')return;
 var a=Math.min(1,g.ban/.6,(3.2-g.ban)/.3);if(a<=0)return;
 plate(W/2-120,96,240,62,a*.96);
 x.globalAlpha=a;x.textAlign='center';
 x.fillStyle='#7a5a38';x.font='11px system-ui,sans-serif';x.fillText(g.bonus>=4?'GEBIET '+(g.bonus===4?'A':'B')+', SZENE '+(g.stage+1)+' VON 4':g.bonus?'BONUS '+bnum()+' VON 6':'ETAPPE '+(g.stage+1)+' VON 6',W/2+2,116);
 var nm=bList(SNAME,BNAME,BNAME2,BNAME3,ANAME,GBNAME)[g.stage],fs=24;x.fillStyle='#3a2918';x.font='bold 24px Georgia,serif';while(fs>13&&x.measureText(nm).width>214){fs--;x.font='bold '+fs+'px Georgia,serif'}x.fillText(nm,W/2+2,145);
 x.textAlign='left';x.globalAlpha=1}
function titel(ts){
 if(g.mode!=='title')return;
 var port=TOUCH&&window.innerHeight>window.innerWidth;plate(W/2-210,78,420,176+(port?18:0),.97);logoAt(W/2-204,88,29,1);x.textAlign='center';
 x.fillStyle='#3a2918';x.font='bold 34px Georgia,serif';x.fillText('Mo’s Hike Quest',W/2+3,122);
 x.font='13px system-ui,sans-serif';x.fillStyle='#6b4a2a';x.fillText('Zwei Kilometer bis zur Hütte. Der Wegweiser kommentiert alles.',W/2+3,146,396);
 x.textAlign='left';var lx=Math.round(W/2-150);
 [['Springen',154],['Ducken',177],['Pause',200]].forEach(function(z){x.fillStyle='#3a2918';x.font='bold 12px system-ui,sans-serif';x.fillText(z[0],lx,z[1]+14)});
 if(TOUCH){x.fillStyle='#6b4a2a';x.font='12px system-ui,sans-serif';x.fillText('Antippen, gedrückt halten = höher',lx+72,168);x.fillText('Unteres Drittel gedrückt halten',lx+72,191);x.fillText('Symbol unten rechts',lx+72,214)}
 else{var k1=keycap(lx+72,154,'Leertaste'),k2=keycap(lx+72+k1+6,154,'↑');x.font='11px system-ui,sans-serif';x.fillStyle='#6b4a2a';x.fillText('gedrückt halten = höher',lx+72+k1+k2+16,168);
  var k3=keycap(lx+72,177,'↓'),k4=keycap(lx+72+k3+6,177,'S');x.font='11px system-ui,sans-serif';x.fillStyle='#6b4a2a';x.fillText('auch zum Aufheben',lx+72+k3+k4+16,191);
  var k5=keycap(lx+72,200,'P'),k6=keycap(lx+72+k5+6,200,'Esc');x.font='11px system-ui,sans-serif';x.fillStyle='#6b4a2a';x.fillText('oder Symbol unten rechts',lx+72+k5+k6+16,214)}
 x.textAlign='center';
 if(Math.floor(ts/600)%2){x.fillStyle='#a0481a';x.font='bold 14px system-ui,sans-serif';x.fillText('Tippen zum Losgehen',W/2+3,244)}
 if(port){x.fillStyle='#a0481a';x.font='bold 11px system-ui,sans-serif';x.fillText('Tipp: Handy quer halten, dann ist alles größer.',W/2+3,262)}
 x.globalAlpha=1;x.font='10px system-ui,sans-serif';x.textAlign='center';textSchatten('© 2026 mitrilmo. Alle Rechte vorbehalten.',W/2,H-10,'rgba(255,255,255,.92)');
 x.textAlign='left'}
function grade(){var pr=g.run/TOTAL;
 if(g.won)return g.hits===0?['1','sehr gut']:g.hits===1?['2','gut']:['3','befriedigend'];
 return pr>.75?['4','ausreichend']:pr>.4?['5','mangelhaft']:['6','ungenügend']}
function protokoll(a,cx,cw,cy,ch){
 fbDicht();
 var px=cx+cw/2+10,pw=W-12-px;
 x.globalAlpha=a;
 x.fillStyle='rgba(0,0,0,.25)';x.beginPath();x.roundRect(px+4,cy+5,pw,ch,6);x.fill();
 x.fillStyle='#fbf3e0';x.beginPath();x.roundRect(px,cy,pw,ch,6);x.fill();
 x.strokeStyle='#b8925a';x.lineWidth=2;x.beginPath();x.roundRect(px+7,cy+7,pw-14,ch-14,4);x.stroke();
 x.textAlign='center';x.fillStyle='#3a2918';x.font='bold 15px Georgia,serif';x.fillText('Wegweiser-Protokoll',px+pw/2,cy+34,pw-28);
 x.font='10px system-ui,sans-serif';x.fillStyle='#7a5a38';x.fillText('Das hat er sich notiert:',px+pw/2,cy+49);
 var hits=g.log.filter(function(e){return e.k==='hit'}).reverse(),dod=g.log.filter(function(e){return e.k==='dodge'}).reverse(),fnd=g.log.filter(function(e){return e.k==='fund'}).reverse(),sel=[];
 hits.concat(fnd,dod).forEach(function(e){if(sel.length<4&&sel.indexOf(e.t)<0)sel.push(e.t)});
 x.textAlign='left';x.font='italic 11px system-ui,sans-serif';x.fillStyle='#4b3320';
 var yy=cy+68,mw=pw-36;
 if(!sel.length){wrap('Nichts notiert. Auch das ist eine Aussage.',mw).forEach(function(l,i){x.fillText(l,px+16,yy+i*13)})}
 sel.forEach(function(t){var ls=wrap(t,mw);if(yy+ls.length*13>cy+ch-14)return;x.fillStyle='#a0481a';x.fillText('·',px+13,yy);x.fillStyle='#4b3320';ls.forEach(function(l,i){x.fillText(l,px+22,yy+i*13)});yy+=ls.length*13+7});
 x.textAlign='left';x.globalAlpha=1;FQ=FB}
function zSplit(){return TOUCH&&g.mode==='over'&&((g.won&&!g.bonus)||g.bonus)}
function zeugnis(ts){
 if(g.mode!=='over')return;
 var a=Math.min(1,Math.max(0,(g.tOver-(g.won?wonT()-.6:.7))*2));if(a<=0)return;
 x.globalAlpha=a;
 var cx=330,cw=250,sp=zSplit(),ch=sp?316:276,cy=(sp?10:48)+(1-a)*14,gr=grade();
 fbDicht();x.fillStyle='rgba(0,0,0,.25)';x.beginPath();x.roundRect(cx-cw/2+4,cy+5,cw,ch,6);x.fill();
 x.fillStyle='#fbf3e0';x.beginPath();x.roundRect(cx-cw/2,cy,cw,ch,6);x.fill();
 x.strokeStyle='#b8925a';x.lineWidth=2;x.beginPath();x.roundRect(cx-cw/2+7,cy+7,cw-14,ch-14,4);x.stroke();
 x.textAlign='center';
 x.fillStyle='#3a2918';x.font='bold 26px Georgia,serif';x.fillText(g.bonus===5?['Uferbrief','Mauerbrief','Steinbruchbrief','Burgbrief'][g.stage]:g.bonus===4?['Kottenbrief','Viaduktbrief','Tunnelbrief','Schmiedebrief'][g.stage]:g.bonus?['Höhlenschein','Gratschein','Moorbrief','Küstenbrief','Altstadtbrief','Friedhofsschein'][bnum()-1]||'Bonus-Zeugnis':'Wanderbrief',cx,cy+40);
 x.font='12px system-ui,sans-serif';x.fillStyle='#7a5a38';x.fillText(g.bonus===5?(g.won?'Mo hat die Burgruine erreicht.':'Mo hat die Burgruine nicht erreicht.'):g.bonus===4?(g.won?'Mo hat den Festplatz erreicht.':'Mo hat den Festplatz nicht erreicht.'):g.bonus===3?(g.won?'Mo hat die Friedhofskapelle erreicht.':'Mo hat die Friedhofskapelle nicht erreicht.'):g.bonus===2?(g.won?'Mo hat die Fischbude erreicht.':'Mo hat die Fischbude nicht erreicht.'):g.bonus?(g.won?'Mo hat den Gipfelgrat erreicht.':'Mo hat den Gipfelgrat nicht erreicht.'):(g.won?'Mo hat die Hütte erreicht.':'Mo hat die Hütte nicht erreicht.'),cx,cy+58,cw-30);
 var bm=Math.round(TOTAL/PXM),rows=g.bonus?[['Strecke',Math.min(bm,Math.round(g.run/PXM))+' von '+bm+' m'],g.bonus===3?['Pfand',eur(g.pfandCash)]:g.bonus>=4?['Szene',(g.stage+1)+' von 4']:['Bonus-Level',bnum()+' von 6'],['Hindernisse umgangen',String(g.dodged)],['Stürze',String(g.hits)],['Funde',g.funde+' von '+g.fundMax]]:[['Strecke',Math.min(2000,Math.round(g.run/PXM))+' von 2000 m'],['Etappe',(g.stage+1)+' von 6'],['Hindernisse umgangen',String(g.dodged)],['Stürze',String(g.hits)],['Funde',g.funde+' von '+g.fundMax]];
 x.font='12px system-ui,sans-serif';
 rows.forEach(function(r,i){var yy=cy+82+i*17;x.fillStyle='#6b4a2a';x.textAlign='left';x.fillText(r[0],cx-109,yy);x.textAlign='right';x.fillStyle='#3a2918';x.fillText(r[1],cx+109,yy);
  x.fillStyle='rgba(0,0,0,.08)';x.fillRect(cx-109,yy+5,218,1)});
 x.textAlign='center';x.fillStyle='#6b4a2a';x.font='italic bold 13px Georgia,serif';x.fillText(RANG[gr[0]],cx,cy+172);
 x.fillStyle='#a0481a';x.font='bold 19px Georgia,serif';x.fillText('Note: '+gr[0]+' ('+gr[1]+')',cx,cy+190);
 x.font='italic 12px system-ui,sans-serif';x.fillStyle='#4b3320';
 var rl=wrap('Wegweiser: '+REMARK[gr[0]],cw-50),rh=rl.length>2?12:14,ry0=rl.length>2?205:208;
 rl.forEach(function(l,i){x.fillText(l,cx,cy+ry0+i*rh)});
 if(g.tOver>(g.won?wonT():.9)){
  if(((g.won&&!g.bonus)||g.bonus)&&g.tOver>(g.won?wonT():1.6)){x.fillStyle='rgba(160,72,26,.12)';x.beginPath();x.roundRect(cx-104,cy+(sp?236:234),208,sp?28:22,sp?14:11);x.fill();x.font='bold 12px system-ui,sans-serif';x.fillStyle='#a0481a';
   x.fillText((g.bonus>=3&&g.won)?(TOUCH?'Hier tippen: Karte':'B: Karte'):g.bonus===1&&g.won?(TOUCH?'Hier tippen: Seilbahn ins Moor':'B: Seilbahn ins Moor'):g.bonus===2&&g.won?(TOUCH?'Hier tippen: Altstadt & Friedhof':'B: Altstadt & Friedhof'):g.bonus?(TOUCH?'Hier tippen: Quest von vorn':'N: Quest von vorn'):(TOUCH?'Hier tippen: Bonus Höhle & Grat':'B: Bonus Höhle & Gebirgsgrat'),cx,cy+(sp?254:249),cw-30)}
  if(sp){x.fillStyle='rgba(74,140,63,.16)';x.beginPath();x.roundRect(cx-104,cy+278,208,28,14);x.fill();x.font='bold 12px system-ui,sans-serif';x.fillStyle='#3d7433';x.fillText(g.bonus?'Hier tippen: Bonus nochmal':'Hier tippen: nochmal',cx,cy+296,cw-30)}
  else if(Math.floor(ts/600)%2){x.font='bold 12px system-ui,sans-serif';x.fillStyle='#4a8c3f';x.fillText(g.bonus===1&&g.won&&!TOUCH?'Leertaste: nochmal · N: Quest von vorn':g.bonus?'Leertaste oder Tippen: Bonus nochmal':'Leertaste oder Tippen: nochmal',cx,cy+ch-12,cw-30)}}
 protokoll(a,cx,cw,cy,ch);
 x.textAlign='left';x.globalAlpha=1;FQ=FB}
function fade(){
 if(g.tr<0)return;var al=.92*(1-Math.abs(2*g.tr-1));
 x.fillStyle='rgba(20,18,28,'+al+')';x.fillRect(0,0,W,H)}

if(/[?&]dev(=|&|$)/.test(location.search))window.__game={g:g,mm:mm,start:start,jump:jump,update:update,ox:ox,set:function(k,v){g[k]=v}};
/* ---------- Wahrzeichen der Region (nur Kulisse): Müngstener Brücke, Zeppelin, Schloss Burg, Altenberger Dom, Henrichshütte, Schwebebahn, Röntgenmuseum, Hattingen, Volmarstein, Ennepetalsperre ----------
   Die ruhigen Teile werden einmal in eine eigene Leinwand gezeichnet (zSprite) und pro Bild nur noch aufgeklebt. Pro Bild bleiben so nur die bewegten Teile (Zug, Propeller, Federn, Fenster) übrig. */
var zCache={},zCn=0,zNoProp=false;
function zSprite(key,w,h,ox,oy,draw){
 var c=zCache[key];if(c)return c;
 if(zCn>48){zCache={};zCn=0}
 c=document.createElement('canvas');c.width=Math.ceil(w*2);c.height=Math.ceil(h*2);
 var sv=x,cx=c.getContext('2d');x=cx;x.scale(2,2);x.translate(ox,oy);
 try{draw()}finally{x=sv}
 c.zw=w;c.zh=h;c.zox=ox;c.zoy=oy;zCache[key]=c;zCn++;return c}
function glowS(cx,cy,r,rgb,al){var c=zSprite('gl'+rgb+r,2*r,2*r,r,r,function(){var g2=x.createRadialGradient(0,0,0,0,0,r);g2.addColorStop(0,'rgba('+rgb+',1)');g2.addColorStop(1,'rgba('+rgb+',0)');x.fillStyle=g2;x.beginPath();x.arc(0,0,r,0,6.3);x.fill()});x.globalAlpha=al;zBlit(c,cx,cy);x.globalAlpha=1}
function zBlit(c,px,py){x.drawImage(c,px-c.zox,py-c.zoy,c.zw,c.zh)}
function zRc(c,a,b,w,h){x.fillStyle=c;x.fillRect(a,b,w,h)}
function zEl(c,a,b,rx,ry){x.fillStyle=c;x.beginPath();x.ellipse(a,b,rx,ry,0,0,6.3);x.fill()}
function zPl(c,p){x.fillStyle=c;x.beginPath();x.moveTo(p[0],p[1]);for(var i=2;i<p.length;i+=2)x.lineTo(p[i],p[i+1]);x.closePath();x.fill()}
function zWheel(cx,cy,r,a){zEl('#1c1c22',cx,cy,r,r);zEl('#7a808a',cx,cy,r*.55,r*.55);x.strokeStyle='#1c1c22';x.lineWidth=1;x.beginPath();x.moveTo(cx+Math.cos(a)*r*.5,cy+Math.sin(a)*r*.5);x.lineTo(cx-Math.cos(a)*r*.5,cy-Math.sin(a)*r*.5);x.stroke()}
function zTree(px,by,h,c1,c2){zRc('#5a3a22',px-1.6,by-h*.4,3.2,h*.4);zEl(c2,px-h*.18,by-h*.55,h*.2,h*.18);zEl(c2,px+h*.18,by-h*.55,h*.2,h*.18);zEl(c1,px,by-h*.7,h*.28,h*.26)}
function zLm(st){return 340+(st*STAGE+1600-g.run)*.1}
/* ----- Müngstener Brücke (Etappe 2) ----- */
function zBrStatic(P){
 var u,yy,j,cl=mix('#5f8f4c',P.mt,.35),cl2=mix('#3f8a3a',P.mt,.3),cl3=mix('#357a32',P.mt,.3),rk=mix('#8a8274',P.mt,.2),rk2=mix('#6f685c',P.mt,.2),st=mix('#3f4a5a',P.sky[2],.08),st2=mix('#66727f',P.sky[2],.12);
 zPl(cl,[-560,50,0,50,60,34,130,22,176,18,196,28,196,96,214,140,232,340,-560,340]);
 zPl(cl,[1200,46,640,46,580,32,520,22,468,18,444,28,444,96,426,140,408,340,1200,340]);
 zPl(rk,[120,96,134,60,160,34,196,26,196,96]);zPl(rk2,[170,96,180,60,196,34,196,96]);
 zPl(rk,[520,96,506,60,480,34,444,26,444,96]);zPl(rk2,[470,96,460,60,444,34,444,96]);
 x.strokeStyle='rgba(0,0,0,.18)';x.lineWidth=1;x.beginPath();x.moveTo(140,70);x.lineTo(196,64);x.moveTo(130,84);x.lineTo(196,78);x.moveTo(150,50);x.lineTo(196,46);x.moveTo(500,70);x.lineTo(444,64);x.moveTo(510,84);x.lineTo(444,78);x.moveTo(490,50);x.lineTo(444,46);x.stroke();
 for(j=0;j<44;j++){var lxx=-560+j*17,ly=lxx<0?50:lxx<60?50-(lxx/60)*16:lxx<130?34-((lxx-60)/70)*12:22-((lxx-130)/46)*4;if(lxx<176)zTree(lxx,ly+8,34+(j%3)*6,cl2,cl3)}
 for(j=0;j<44;j++){var rxx=1200-j*17,ry=rxx>640?46:rxx>580?46-((640-rxx)/60)*14:rxx>520?32-((580-rxx)/60)*10:22-((520-rxx)/52)*4;if(rxx>468)zTree(rxx,ry+8,34+(j%3)*6,cl2,cl3)}
 var ay=function(v){return 112+88*Math.pow((v-320)/125,2)};
 x.strokeStyle=st2;x.lineWidth=1.2;x.beginPath();
 for(u=200;u<=440;u+=20){x.moveTo(u,94);x.lineTo(u,ay(u));if(u<440){x.moveTo(u,ay(u));x.lineTo(u+20,94)}}x.stroke();
 x.strokeStyle=st;x.lineWidth=4;x.beginPath();for(u=195;u<=445;u+=5){yy=ay(u)-3;u===195?x.moveTo(u,yy):x.lineTo(u,yy)}x.stroke();
 x.lineWidth=2.4;x.beginPath();for(u=195;u<=445;u+=5){yy=ay(u)-16;u===195?x.moveTo(u,yy):x.lineTo(u,yy)}x.stroke();
 zRc(mix('#3a4352',P.sky[2],.2),196,88,248,6);zRc(st,196,86,248,2);
 [[172,196],[444,468]].forEach(function(p){var m=(p[0]+p[1])/2;x.fillStyle='#14121a';x.beginPath();x.moveTo(p[0],92);x.lineTo(p[0],72);x.arc(m,72,12,Math.PI,0);x.lineTo(p[1],92);x.fill();x.strokeStyle='#a39c90';x.lineWidth=3;x.beginPath();x.moveTo(p[0]-1,92);x.lineTo(p[0]-1,72);x.arc(m,72,13,Math.PI,0);x.lineTo(p[1]+1,92);x.stroke();zRc('#a39c90',m-3,56,6,6)});
 zRc('#8a8478',172,89,24,2);zRc('#8a8478',444,89,24,2);
 x.fillStyle='#4a3a2a';for(u=172;u<468;u+=9)x.fillRect(u,89.5,5,2);
 zRc('#c8ccd2',172,87.6,296,1.4)}
function bruecke(ts,P){
 var t=ts/1000,cx=340+(STAGE+1600-g.run)*.1,k,wx,sp=zSprite('br'+cur,1092,212,347.2,0,function(){x.scale(.62,.62);zBrStatic(P)});
 zBlit(sp,cx-198.4,50);
 x.save();x.translate(cx,50);x.scale(.62,.62);x.translate(-320,0);x.lineCap='butt';x.lineJoin='miter';
 /* Zug nur zwischen den Portalen sichtbar, im Berg unsichtbar und ohne Rauch */
 x.beginPath();x.rect(178,40,282,70);x.clip();
 var trn=function(lx){var k,wx;
 for(k=2;k>=0;k--){wx=lx-34*(k+1);zRc(k%2?'#2f6a52':'#9a4a2a',wx,69,30,14);zRc('#e6e2d0',wx+4,72,6,5);zRc('#e6e2d0',wx+14,72,6,5);zRc('#222',wx,82,30,2);zWheel(wx+6,86,3.2,t*9);zWheel(wx+24,86,3.2,t*9)}
 zRc('#b8352a',lx,62,13,22);zRc('#7a2018',lx-2,60,17,3);zRc('#e6e2d0',lx+3,66,6,6);
 x.fillStyle='#2c2f36';x.beginPath();x.roundRect(lx+13,68,22,16,3);x.fill();zRc('#222',lx+29,58,5,11);zRc('#222',lx+27,57,9,2);
 zWheel(lx+7,81.5,4.6,t*9);zWheel(lx+22,81.5,4.6,t*9);zWheel(lx+31,83,3.3,t*9);
 var chx=lx+31;
 if(chx>186&&chx<452){for(k=0;k<6;k++){var a=((t*.8+k/6)%1),pxx=chx-a*46,pyy=58-a*26;if(pxx>182)zEl('rgba(245,245,250,'+(.55*(1-a))+')',pxx,pyy,4+a*8,3+a*6)}}
 };
 /* zwei Züge im Abstand, damit immer einer auf der Brücke ist */
 trn((t*46)%700-135);trn((t*46+350)%700-135);
 x.restore()}
/* ----- Zeppelin (Etappe 6) ----- */
function zEnv(u){return 50*Math.sqrt(Math.max(0,1-Math.pow((u+6)/156,2)))*(u>0?1-.72*u/154:1)}
function zProp(px,py,t,o){var pr=Math.abs(Math.sin(t*26))*10;zEl('rgba(60,50,30,.18)',px,py,3,pr+2);x.strokeStyle=o;x.lineWidth=2;x.beginPath();x.moveTo(px,py-pr);x.lineTo(px,py+pr);x.stroke();zEl('#8a7a50',px,py,2.2,2.2)}
function zMusk(cx,dir,al){
 x.save();x.globalAlpha=al;var b='#1f5f82';
 x.strokeStyle=b;x.lineWidth=1.1;x.beginPath();x.moveTo(cx+dir*6,-26);x.lineTo(0,-46);x.stroke();
 x.fillStyle=b;x.beginPath();x.arc(cx+dir*6,-27,2.6,0,6.3);x.fill();x.lineWidth=.8;x.beginPath();x.arc(cx+dir*6,-25,4,.3,2.8);x.stroke();
 x.lineWidth=2.6;x.lineCap='round';x.beginPath();x.moveTo(cx+dir*3,-14);x.lineTo(cx+dir*5,-26);x.stroke();x.beginPath();x.moveTo(cx-dir*5,-14);x.lineTo(cx-dir*9,-4);x.stroke();x.lineCap='butt';
 zPl('#f4ecd8',[cx-8,-16,cx+8,-16,cx+7,12,cx-7,12]);zRc(b,cx-8,-16,3,28);zRc(b,cx+5,-16,3,28);
 zRc('#c0392b',cx-1,-14,2.4,22);zRc('#c0392b',cx-4.5,-9,9,2.4);
 zRc(b,cx-8,12,16,6);zRc(b,cx-6,18,5,12);zRc(b,cx+1,18,5,12);zRc(b,cx-8,30,8,3);zRc(b,cx+1,30,8,3);zRc(b,cx-7,20,7,2);zRc(b,cx,20,7,2);
 zEl(b,cx,-22,4.6,5);zEl(b,cx-dir*3,-29,13,3.6);zPl(b,[cx-7,-29,cx+7,-29,cx+5,-35,cx-5,-35]);
 x.strokeStyle=b;x.lineWidth=1.4;x.beginPath();x.moveTo(cx-dir*10,-30);x.quadraticCurveTo(cx-dir*20,-33,cx-dir*19,-20);x.stroke();
 x.restore()}
function zepBody(){
 var al=.42,o='#2a2418',cr='#f5dfaa',cd='#e2c485',sm='#cfb374',j,u,k;
 x.lineJoin='round';x.lineCap='butt';x.lineWidth=1.5;
 [[-52,48],[70,44]].forEach(function(p){x.strokeStyle=o;x.beginPath();x.moveTo(p[0]-4,p[1]-8);x.lineTo(p[0]-2,p[1]);x.moveTo(p[0]+6,p[1]-8);x.lineTo(p[0]+4,p[1]);x.stroke();
  x.fillStyle=cd;x.beginPath();x.ellipse(p[0],p[1]+5,13,6,0,0,6.3);x.fill();x.stroke();zRc('#6a5a3a',p[0]+11,p[1]+3,5,4);for(var q=0;q<3;q++)zRc(sm,p[0]-8+q*5,p[1]+2,1.5,6)});
 zPl(cd,[96,-27,124,-58,150,-58,150,-8]);zPl(cd,[96,27,124,58,150,58,150,8]);
 x.strokeStyle=o;x.lineWidth=1.6;x.beginPath();x.moveTo(96,-27);x.lineTo(124,-58);x.lineTo(150,-58);x.lineTo(150,-8);x.moveTo(96,27);x.lineTo(124,58);x.lineTo(150,58);x.lineTo(150,8);x.stroke();
 x.strokeStyle=sm;x.lineWidth=1;x.beginPath();x.moveTo(138,-56);x.lineTo(138,-10);x.moveTo(138,56);x.lineTo(138,10);x.moveTo(128,-48);x.lineTo(150,-48);x.moveTo(128,48);x.lineTo(150,48);x.stroke();
 x.strokeStyle=o;x.lineWidth=1.5;x.beginPath();x.moveTo(-6,44);x.lineTo(-10,52);x.moveTo(30,40);x.lineTo(32,52);x.stroke();
 x.fillStyle=cr;x.beginPath();x.roundRect(-24,50,64,19,[7,3,3,3]);x.fill();x.stroke();
 zPl('#bfe3e6',[-21,54,-12,54,-12,62,-22,64]);x.beginPath();x.moveTo(-21,54);x.lineTo(-12,54);x.lineTo(-12,62);x.lineTo(-22,64);x.closePath();x.stroke();
 for(j=0;j<4;j++){zRc('#bfe3e6',-7+j*11,54,8,8);x.strokeRect(-7+j*11,54,8,8)}
 zRc(cd,-24,65,64,4);zRc('#e86a4a',36,56,3,3);zRc('#6ac86a',-26,58,2,3);
 zEl('#3a3224',0,73,4.5,4.5);zEl('#8a7a50',0,73,1.8,1.8);x.strokeStyle=o;x.beginPath();x.moveTo(0,69);x.lineTo(0,72);x.stroke();
 var gg=x.createLinearGradient(0,-52,0,52);gg.addColorStop(0,'#fbecc4');gg.addColorStop(.55,cr);gg.addColorStop(1,'#e0c283');
 var hull=function(){x.beginPath();x.moveTo(-152,0);x.bezierCurveTo(-152,-46,-40,-54,60,-39);x.bezierCurveTo(110,-31,142,-13,154,-5);x.lineTo(154,5);x.bezierCurveTo(142,13,110,31,60,39);x.bezierCurveTo(-40,54,-152,46,-152,0);x.closePath()};
 x.fillStyle=gg;hull();x.fill();
 x.save();hull();x.clip();
 x.strokeStyle=sm;x.lineWidth=1;x.beginPath();
 for(u=-124;u<=134;u+=21){var h=zEnv(u)-1;x.moveTo(u,-h);x.quadraticCurveTo(u+11*h/50,0,u,h)}x.stroke();
 x.lineWidth=.9;x.beginPath();for(k=-4;k<=4;k++){for(var v=-148;v<=154;v+=6){var yy=k*11*Math.sqrt(Math.max(0,1-Math.pow((v+6)/156,2)))*(v>0?1-.72*v/154:1);v===-148?x.moveTo(v,yy):x.lineTo(v,yy)}}x.stroke();
 x.fillStyle=sm;x.beginPath();for(var rr=-124;rr<=134;rr+=21){for(var kk=-3;kk<=3;kk++){var hh=zEnv(rr)*kk/4.2;if(Math.abs(hh)<zEnv(rr)-3){var ex=rr+5*(1-Math.pow(kk/4,2));x.moveTo(ex+.9,hh);x.ellipse(ex,hh,.9,.9,0,0,6.3)}}}x.fill();
 x.fillStyle='rgba(255,255,255,.28)';x.beginPath();x.ellipse(-30,-28,100,8,-.04,0,6.3);x.fill();
 x.fillStyle='rgba(120,80,20,.14)';x.beginPath();x.ellipse(0,40,150,10,0,0,6.3);x.fill();
 x.restore();
 x.strokeStyle=o;x.lineWidth=1.8;hull();x.stroke();
 x.save();x.beginPath();x.moveTo(-152,0);x.bezierCurveTo(-152,-46,-40,-54,60,-39);x.lineTo(60,39);x.bezierCurveTo(-40,54,-152,46,-152,0);x.clip();
 zMusk(-52,1,al);zMusk(0,-1,al);zMusk(52,-1,al);x.restore();
 zEl(cd,-146,0,6,10);x.strokeStyle=o;x.lineWidth=1.2;x.beginPath();x.ellipse(-146,0,6,10,0,0,6.3);x.stroke();zRc('#8a7a50',-154,-1.5,5,3);
 zEl(cd,126,0,22,3.4);x.beginPath();x.ellipse(126,0,22,3.4,0,0,6.3);x.stroke();
 x.strokeStyle='#c9b27a';x.lineWidth=3.6;x.beginPath();x.moveTo(112,0);x.lineTo(160,0);x.stroke();x.strokeStyle=o;x.lineWidth=.8;x.beginPath();x.moveTo(112,-1.8);x.lineTo(160,-1.8);x.moveTo(112,1.8);x.lineTo(160,1.8);x.stroke()}
function zeppelin(ts){
 var t=ts/1000,L=200,s=L/330,cx=W+130-(((t*32)+g.run*.05)%(W+520)),cy=62+Math.sin(t*.9)*4,o='#2a2418';
 var sp=zSprite('zep',200,88,96,38,function(){x.scale(s,s);zepBody()});
 x.save();x.translate(cx,cy);x.rotate(Math.sin(t*.9)*.015);
 zBlit(sp,0,0);
 x.scale(s,s);x.lineCap='butt';
 zProp(-33,53,t,o);zProp(89,49,t,o);zProp(162,0,t,o);
 x.restore()}
/* ----- Schilder ----- */
var zWid={};
function landSign(wx,text){
 var q=wx-g.run;if(q<-160||q>W+160)return;var gy=GY+18;
 x.font='500 14px system-ui,sans-serif';x.textAlign='left';x.textBaseline='alphabetic';var w=zWid[text]||(zWid[text]=x.measureText(text).width);
 x.fillStyle='rgba(0,0,0,.18)';x.beginPath();x.ellipse(q+2,gy+2,12,3,0,0,6.3);x.fill();
 x.fillStyle='#7a5430';x.fillRect(q-3.5,gy-70,7,72);x.fillStyle='#8a6238';x.fillRect(q-3.5,gy-70,2.5,72);
 var l=q-w/2-10,r=q+w/2+10;x.fillStyle='#c9a26a';x.beginPath();x.moveTo(l,gy-68);x.lineTo(r,gy-68);x.lineTo(r+12,gy-55);x.lineTo(r,gy-42);x.lineTo(l,gy-42);x.closePath();x.fill();
 x.strokeStyle='#8a6238';x.lineWidth=1.4;x.stroke();x.fillStyle='#2e1f12';x.fillText(text,q-w/2,gy-50)}
var zSg={o:null,m:{}};
/* Position für ein Schild: ab "min" die nächste Stelle, an der kein Hindernis und kein Fund in der Nähe liegt */
function zSignX(key,min){
 if(zSg.o!==g.obs){zSg.o=g.obs;zSg.m={}}
 if(zSg.m[key]!=null)return zSg.m[key];
 var xx=min,k,ok,b;
 for(var n=0;n<300;n++){ok=true;
  for(k=0;k<g.obs.length;k++){b=g.obs[k].bx-(OFF[g.obs[k].t]||0);if(Math.abs(b-xx)<170){ok=false;break}}
  for(k=0;ok&&g.items&&k<g.items.length;k++){if(Math.abs(g.items[k].bx-xx)<90)ok=false}
  for(k=0;ok&&g.sch&&k<g.sch.length;k++){if(Math.abs(g.sch[k].wx-xx)<130)ok=false}
  if(ok)break;xx+=30}
 zSg.m[key]=xx;return xx}
function strikeSign(wx,text){
 var q=wx-g.run;if(q<-160||q>W+160)return;var gy=FY-8;
 bonusSign(wx,text);
 x.font='500 16px system-ui,sans-serif';var w=zWid['s'+text]||(zWid['s'+text]=x.measureText(text).width),l=q-w/2-12,r=q+w/2+12;
 x.strokeStyle='#c4302a';x.lineWidth=2.6;x.beginPath();x.moveTo(l-2,gy-55);x.lineTo(r+6,gy-76);x.stroke()}
/* ----- Schloss Burg (Etappe 1), Altenberger Dom (Etappe 3), Henrichshütte (Etappe 4) ----- */
function burg(ts,P){
 var cx=zLm(0),sp=zSprite('burg',585,250,-153,-18,function(){
  x.scale(.9,.9);
  var h=function(c){return mix(c,P.sky[2],.16)},i;
  zPl(mix('#6a9a58',P.mt,.3),[170,260,330,214,400,172,432,154,444,150,566,150,578,154,610,176,700,240,820,260]);
  zRc(h('#8a8070'),438,150,134,8);for(i=0;i<10;i++)zRc(h(i%2?'#9a9080':'#7a7060'),438+i*13.4,150+(i%3),13,6);
  zRc(h('#5a8a48'),436,147,138,4);
  var cs=h('#b9ae9c'),cd=h('#8e8474'),rf=h('#8a3a2a');
  zRc(cd,444,114,108,36);zRc(cs,444,114,92,36);for(i=0;i<8;i++)zRc(cs,444+i*13.5,108,8,7);
  zRc(cs,488,58,32,92);zRc(cd,510,58,10,92);for(i=0;i<4;i++)zRc(cs,488+i*8,52,5,7);zPl(rf,[484,56,504,30,524,56]);zRc('#e9e2d0',503,26,2,6);
  zRc(cs,448,84,22,66);zRc(cd,462,84,8,66);zPl(rf,[444,86,459,58,474,86]);
  zRc(cs,530,92,22,58);zRc(cd,544,92,8,58);zPl(rf,[526,94,541,68,556,94]);
  zRc(h('#4a4036'),500,128,16,22);x.fillStyle=h('#4a4036');x.beginPath();x.arc(508,128,8,Math.PI,0);x.fill();zRc('#2a2420',502,132,12,18);
  [[500,70],[458,100],[540,106]].forEach(function(w){zPl('#2a2420',[w[0]-2.5,w[1]+8,w[0]-2.5,w[1]+2,w[0],w[1]-2,w[0]+2.5,w[1]+2,w[0]+2.5,w[1]+8])})});
 zBlit(sp,cx-450,33)}
function dom(ts,P){
 var cx=zLm(2),i,sp=zSprite('dom',330,200,-75,-7.5,function(){
  x.scale(.75,.75);
  var h=function(c){return mix(c,P.sky[3],.28)},lit='rgba(255,214,120,.95)',wl=h('#9a9082'),ro=h('#4d5260');
  zRc(h('#a8987a'),100,226,440,34);
  zRc(wl,192,150,230,76);zPl(ro,[190,150,198,104,414,104,422,150]);zRc(h('#5d6372'),198,104,216,4);
  zRc(ro,300,86,10,18);zPl(ro,[298,86,305,28,312,86]);zRc('#e9e2d0',304.5,16,1.5,14);zRc('#e9e2d0',301,21,8,1.5);
  zPl(wl,[138,226,138,112,166,60,194,112,194,226]);zPl(ro,[134,112,166,52,198,112,194,116,166,60,138,116]);
  zRc(wl,134,96,10,130);zPl(ro,[132,96,139,64,146,96]);zRc(wl,190,96,10,130);zPl(ro,[188,96,195,64,202,96]);
  x.fillStyle=lit;x.beginPath();x.moveTo(152,208);x.lineTo(152,152);x.quadraticCurveTo(152,124,166,112);x.quadraticCurveTo(180,124,180,152);x.lineTo(180,208);x.fill();
  x.strokeStyle=h('#7a7266');x.lineWidth=1.4;x.beginPath();x.moveTo(166,112);x.lineTo(166,208);x.moveTo(152,160);x.lineTo(180,160);x.stroke();
  for(var q=0;q<6;q++){var wx=210+q*36;zRc(h('#7e766a'),wx+22,150,6,76);x.fillStyle=lit;x.beginPath();x.moveTo(wx+2,214);x.lineTo(wx+2,176);x.quadraticCurveTo(wx+2,158,wx+9,152);x.quadraticCurveTo(wx+16,158,wx+16,176);x.lineTo(wx+16,214);x.fill()}
  zPl(h('#8a8274'),[422,226,422,160,500,160,500,226]);zPl(ro,[418,162,432,126,492,126,506,162]);
  for(q=0;q<3;q++){x.fillStyle=lit;x.beginPath();x.moveTo(432+q*24,216);x.lineTo(432+q*24,184);x.quadraticCurveTo(432+q*24,172,438+q*24,168);x.quadraticCurveTo(444+q*24,172,444+q*24,184);x.lineTo(444+q*24,216);x.fill()}});
 zBlit(sp,cx-225,12);
 x.fillStyle='rgba(240,232,218,.55)';x.beginPath();
 for(i=0;i<5;i++){var fx=((i*190+ts*.009)%820)-90,fy=12+(222+(i%3)*10)*.75;x.moveTo(cx-225+fx*.75+82,fy);x.ellipse(cx-225+fx*.75,fy,82,12,0,0,6.3)}x.fill()}
function zTurm(t,col,wheels){
 x.fillStyle=col;x.strokeStyle=col;
 if(!wheels){
  x.fillRect(40,10,148,14);x.fillRect(66,24,10,58);x.fillRect(152,24,10,58);x.fillRect(58,80,112,7);
  zPl(col,[62,82,82,82,52,225,6,225]);zPl(col,[146,82,166,82,222,225,176,225]);
  x.fillRect(108,86,12,100);x.fillRect(88,176,52,52);x.fillRect(74,224,80,12);
  x.lineWidth=3;x.beginPath();x.moveTo(34,150);x.lineTo(194,150);x.stroke();return}
 x.lineWidth=3;x.beginPath();
 [[90,56,21],[138,56,21],[90,114,17],[138,114,17]].forEach(function(w){x.moveTo(w[0]+w[2],w[1]);x.arc(w[0],w[1],w[2],0,6.3)});x.stroke();
 x.lineWidth=2;x.beginPath();
 [[90,56,21,1],[138,56,21,-1],[90,114,17,1],[138,114,17,-1]].forEach(function(w){for(var k=0;k<8;k++){var a=k*.785+t*.5*w[3];x.moveTo(w[0],w[1]);x.lineTo(w[0]+Math.cos(a)*w[2],w[1]+Math.sin(a)*w[2])}});x.stroke();
 x.beginPath();[[90,56],[138,56],[90,114],[138,114]].forEach(function(w){x.moveTo(w[0]+4,w[1]);x.arc(w[0],w[1],4,0,6.3)});x.fill()}
function huette(ts,P){
 var cx=zLm(3),s=.72,col=mix('#15171c',P.sky[2],.2),sp=zSprite('huette'+cur,164,176,0,0,function(){x.scale(s,s);zTurm(0,col,false)});
 x.save();x.translate(cx-114*s,196-236*s);zBlit(sp,0,0);x.scale(s,s);x.lineCap='butt';zTurm(ts/1000,col,true);x.restore()}
/* ----- Friedhof: Schwebebahn ----- */
function schwebebahn(ts,o){
 var t=ts/1000,i;
 x.save();x.lineCap='butt';x.strokeStyle='#1c2040';x.lineWidth=3;x.beginPath();
 for(i=0;i<6;i++){var ax=md(i*190-o*.12,1140)-60;x.moveTo(ax-34,236);x.lineTo(ax,72);x.lineTo(ax+34,236)}x.stroke();
 x.lineWidth=1;x.beginPath();for(i=0;i<6;i++){var bx=md(i*190-o*.12,1140)-60;x.moveTo(bx-24,190);x.lineTo(bx+24,190);x.moveTo(bx-14,140);x.lineTo(bx+14,140)}x.stroke();
 zRc('#232850',0,66,W,9);zRc('#1c2040',0,62,W,3);
 x.strokeStyle='#161a36';x.lineWidth=1;x.beginPath();for(i=0;i<W+12;i+=12){x.moveTo(i,75);x.lineTo(i+6,66);x.lineTo(i+12,75)}x.stroke();
 var c0=((t*30)%(W+330))-110;
 [c0,c0-108].forEach(function(cx){
  zRc('#1c2040',cx+22,75,3,7);zRc('#1c2040',cx+76,75,3,7);
  x.fillStyle='#10132a';x.beginPath();x.roundRect(cx,82,102,32,8);x.fill();zRc('#0b0d1e',cx,104,102,10);
  x.fillStyle='#ffe9a0';for(var j=0;j<5;j++)x.fillRect(cx+8+j*18,88,13,12)});
 zRc('#141830',c0-8,95,10,3);
 x.restore()}
/* ----- Altstadt: Röntgenmuseum, Nachbarhäuser, Fachwerkhaus ----- */
var ZT=0;
function zc(c){return ZT>.01?mix(c,'#26263e',Math.min(1,ZT*.75)):c}
function zKey(t){return Math.round(t*12)+'_'+Math.round(RN*6)}
var zGlow=null;
function townRoentgen(q,t,hb,ts){
 var k=zKey(t),sp=zSprite('roe'+k,220,215,110,205,function(){
  ZT=Math.round(t*12)/12;x.scale(.9,.9);
  var top=-148;
  zPl(zc('#2f3640'),[-107,top,0,top-44,107,top]);zRc(zc('#5a6470'),-95,top,190,148);
  x.strokeStyle='rgba(0,0,0,.28)';x.lineWidth=1;x.beginPath();for(var r2=0;r2<15;r2++){var y2=top+r2*10;x.moveTo(-95,y2);x.lineTo(95,y2);for(var c2=-95+(r2%2)*8;c2<95;c2+=16){x.moveTo(c2,y2);x.lineTo(c2,y2+10)}}x.stroke();
  [[-62,-126],[8,-126],[-62,-66],[8,-66]].forEach(function(p){
   zRc(zc('#f6f3ea'),p[0]-4,p[1]-4,46,56);zRc('#17251a',p[0],p[1],38,48);
   zRc(zc('#3f7a45'),p[0]-16,p[1]-4,12,56);zRc(zc('#3f7a45'),p[0]+42,p[1]-4,12,56)});
  zRc(zc('#3a2a1c'),60,-40,26,40);
  zRc(zc('#f4ecd6'),-72,-162,144,18);x.strokeStyle=zc('#3a2414');x.lineWidth=1.5;x.strokeRect(-72,-162,144,18);
  x.fillStyle=zc('#2b2b2b');x.font='bold 11px system-ui,sans-serif';x.textAlign='center';x.fillText('Röntgenmuseum',0,-149);x.textAlign='left'});
 if(!zGlow)zGlow=zSprite('glow',120,130,60,65,function(){var g1=x.createRadialGradient(0,0,2,0,0,60);g1.addColorStop(0,'rgba(70,255,120,1)');g1.addColorStop(1,'rgba(70,255,120,0)');x.fillStyle=g1;x.fillRect(-60,-65,120,130)});
 zBlit(sp,q,hb);
 var pu=.5+.5*Math.sin(ts/330);ZT=Math.round(t*12)/12;
 x.save();x.translate(q,hb);x.scale(.9,.9);
 [[-62,-126],[8,-126],[-62,-66],[8,-66]].forEach(function(p,j){
  x.globalAlpha=Math.min(.7,(.22+.3*pu*(j%2?1:.7))*(1+t*.5));x.drawImage(zGlow,p[0]+19-60,p[1]+24-65,120,130);x.globalAlpha=1;
  zRc('rgba(120,255,160,'+(.5+.4*pu)+')',p[0]+2,p[1]+2,34,44);zRc(zc('#f6f3ea'),p[0]+18,p[1],3,48);zRc(zc('#f6f3ea'),p[0],p[1]+22,38,3)});
 x.restore()}
function townNachbar(q,t,hb,v){
 var sp=zSprite('nb'+v+'_'+zKey(t),110,170,55,160,function(){
  ZT=Math.round(t*12)/12;
  var lit=function(sd){return litWin(sd,t)>0};
  var win=function(cx,y,w,h,l,shut){zRc(zc('#f6f3ea'),cx-w/2-2,y-2,w+4,h+4);zRc(l?'#e8b860':zc('#2a3a4a'),cx-w/2,y,w,h);zRc(zc('#f6f3ea'),cx-1,y,2,h);zRc(zc('#f6f3ea'),cx-w/2,y+h/2-1,w,2);if(shut){zRc(zc(shut),cx-w/2-9,y-2,7,h+4);zRc(zc(shut),cx+w/2+2,y-2,7,h+4)}};
  if(v===0){var aw=34,at=-98;
   zPl(zc('#7a3a2a'),[-aw-6,at,-aw+12,at-26,aw-12,at-26,aw+6,at]);zRc(zc('#8a4a38'),-aw+12,at-26,aw*2-24,3);
   zRc(zc('#c9a98a'),-aw,at,aw*2,98);x.strokeStyle='rgba(0,0,0,.12)';x.lineWidth=1;x.beginPath();for(var k=0;k<10;k++){x.moveTo(-aw,at+k*10);x.lineTo(aw,at+k*10)}x.stroke();
   zRc(zc('#6a3a2a'),-9,-32,18,32);zRc(lit(3)?'#ffd070':zc('#2a3a4a'),-5,-26,4,6);
   win(-17,at+14,14,20,lit(11),'#3f6a8a');win(17,at+14,14,20,lit(12),'#3f6a8a');win(-17,at+44,14,20,lit(13),'#3f6a8a');win(17,at+44,14,20,lit(14),'#3f6a8a')}
  else{var bw=36,bt=-120;
   zPl(zc('#8a8a94'),[-bw-5,bt,-bw,bt-4,0,bt-30,bw,bt-4,bw+5,bt]);
   zPl(zc('#d4b06a'),[-bw,0,-bw,bt,bw,bt,bw,0]);zPl(zc('#d4b06a'),[-bw,bt,0,bt-30,bw,bt]);
   zPl(zc('#4a4a54'),[-bw-4,bt+1,0,bt-34,bw+4,bt+1,bw-4,bt+1,0,bt-26,-bw+4,bt+1]);
   zRc(zc('#f6f3ea'),-bw,bt+38,bw*2,3);
   win(-17,bt+12,14,22,lit(21));win(17,bt+12,14,22,lit(22));win(0,bt-12,10,14,lit(23));win(-17,bt+52,14,22,lit(24));win(17,bt+52,14,22,lit(25));
   zRc(zc('#5a3a2a'),-8,-40,16,40)}});
 zBlit(sp,q,hb)}
function townFachwerk(q,t,hb,ts){
 var FH=52,wcx=-39,sy=-3*FH+36,sh=Math.sin(ts/125),i;
 var sp=zSprite('fw'+zKey(t),220,245,110,230,function(){
  ZT=Math.round(t*12)/12;x.scale(.9,.9);
  var cream=zc('#efe2c4'),beam=zc('#4a2e1c'),f,lit=function(sd){return litWin(sd,t)>0};
  zPl(zc('#3a3a44'),[-92,-3*FH+2,0,-3*FH-52,92,-3*FH+2]);zPl(zc('#2c2c36'),[-92,-3*FH+2,-80,-3*FH-1,80,-3*FH-1,92,-3*FH+2]);
  for(f=2;f>=0;f--){
   var hw=64+f*6,fy=-(f+1)*FH;
   zRc('rgba(0,0,0,.25)',-hw-1,fy+FH-1,hw*2+2,3);zRc(cream,-hw,fy,hw*2,FH);
   zRc(beam,-hw,fy,hw*2,4);zRc(beam,-hw,fy+FH-4,hw*2,4);zRc(beam,-hw,fy,4,FH);zRc(beam,hw-4,fy,4,FH);zRc(beam,-2,fy,4,FH);
   x.strokeStyle=beam;x.lineWidth=3;x.beginPath();x.moveTo(-hw+4,fy+FH-4);x.lineTo(-hw+22,fy+FH-22);x.moveTo(hw-4,fy+FH-4);x.lineTo(hw-22,fy+FH-22);x.moveTo(-4,fy+FH-4);x.lineTo(-hw/2-2,fy+FH-20);x.moveTo(4,fy+FH-4);x.lineTo(hw/2+2,fy+FH-20);x.stroke();
   if(f===0){zRc(zc('#6a3a2a'),-14,fy+12,28,FH-12);zRc(beam,-14,fy+12,28,3);zRc(lit(31)?'#ffd070':zc('#2a3a4a'),-9,fy+18,6,8);
    [-hw+10,hw-30].forEach(function(o,k){zRc(zc('#f6f3ea'),o,fy+12,20,22);zRc(lit(32+k)?'#e8b860':zc('#2a3a4a'),o+2,fy+14,16,18)})}
   else [-1,1].forEach(function(sd,k){
    var cx=sd*(hw/2+1),isw=(f===2&&sd===-1);
    zRc(zc('#f6f3ea'),cx-17,fy+8,34,28);zRc(isw?'#d9a860':(lit(40+f*2+k)?'#e8b860':zc('#2a3a4a')),cx-14,fy+11,28,22);
    if(!isw){zRc(zc('#f6f3ea'),cx-1,fy+11,2,22);zRc(zc('#f6f3ea'),cx-14,fy+21,28,2)}
    zRc(zc('#3f7a45'),cx-27,fy+8,9,28);zRc(zc('#3f7a45'),cx+18,fy+8,9,28)})}});
 zBlit(sp,q,hb);ZT=Math.round(t*12)/12;
 x.save();x.translate(q,hb);x.scale(.9,.9);x.lineCap='butt';
 /* Frau im obersten Fenster schüttelt ein Kissen aus, die Daunen fallen bis auf das Pflaster */
 x.save();x.translate(wcx,sy);x.scale(.7,.7);
 x.fillStyle=zc('#b8506a');x.beginPath();x.ellipse(0,-8,17,15,0,0,6.3);x.fill();zRc(zc('#e9c8a8'),-3,-34,6,8);
 x.save();x.translate(0,-36);x.rotate(sh*.03);
 zEl(zc('#e9c8a8'),0,0,7.4,8.4);zEl('#9a9a9e',0,-4.4,8,5.4);zEl('#9a9a9e',0,-10,3.8,3.8);zRc('#9a9a9e',-8,-5,3,8);zRc('#9a9a9e',5,-5,3,8);
 zEl('#2a1a18',-2.8,0,.9,1.1);zEl('#2a1a18',2.8,0,.9,1.1);x.strokeStyle='#a0583a';x.lineWidth=1;x.beginPath();x.arc(0,3.2,2,.2,2.9);x.stroke();x.restore();
 zRc(zc('#f6f3ea'),-20,0,40,4);
 var py=18+sh*7,rt=sh*.1;
 x.save();x.translate(0,py);x.rotate(rt);x.fillStyle=zc('#fbfaf4');x.beginPath();x.roundRect(-21,-10,42,20,7);x.fill();x.strokeStyle=zc('#d6d2c4');x.lineWidth=1;x.stroke();x.beginPath();x.moveTo(-21,-10);x.quadraticCurveTo(0,-4,21,-10);x.stroke();x.restore();
 x.strokeStyle=zc('#b8506a');x.lineWidth=5;x.lineCap='round';x.beginPath();x.moveTo(-14,-14);x.quadraticCurveTo(-22,4,-19-rt*10,py-7);x.moveTo(14,-14);x.quadraticCurveTo(22,4,19+rt*10,py-7);x.stroke();
 zEl(zc('#e9c8a8'),-19-rt*10,py-7,3,3);zEl(zc('#e9c8a8'),19+rt*10,py-7,3,3);x.lineCap='butt';x.restore();
 var pyW=sy+(18+sh*7)*.7,tt=ts/1000;
 x.fillStyle='rgba(255,255,255,.92)';x.beginPath();
 for(i=0;i<36;i++){var ph=(tt*.2+i*.0278)%1,fx=wcx+(i%9-4)*3+Math.sin(ph*8+i)*16-ph*(20+i%4*6),fy2=pyW+ph*(4-pyW);x.moveTo(fx+2.6,fy2);x.ellipse(fx,fy2,2.6,1.5,0,0,6.3)}
 for(i=0;i<22;i++){var gx=-100+((i*37)%110),gy2=4+((i*13)%6);x.moveTo(gx+2.6,gy2);x.ellipse(gx,gy2,2.6,1.2,0,0,6.3)}
 x.fill();
 x.restore()}
/* ----- Gebirgsgrat: Burgruine Volmarstein ----- */
function ruine(ts){
 var q=400+(STAGE+1700-g.run)*.08;if(q<-120||q>W+120)return;
 var sp=zSprite('ruine',270,190,95,150,function(){
  x.scale(.7,.7);var i;
  zPl('#8095b4',[-130,12,-80,-6,80,-6,130,12]);
  zRc('#7a7684',-100,-62,60,62);for(i=0;i<6;i++)zRc(i%2?'#8a8694':'#6a6674',-100+i*10,-62-(i*7%11),10,62+(i*7%11));
  x.fillStyle='#14121e';x.beginPath();x.moveTo(-82,0);x.lineTo(-82,-30);x.arc(-70,-30,12,Math.PI,0);x.lineTo(-58,0);x.fill();
  zRc('#7a7684',-30,-142,60,142);zRc('#5e5a68',8,-142,22,142);
  for(i=0;i<5;i++)zRc(i%2?'#7a7684':'#5e5a68',-30+i*12,-152+(i%2)*8,8,12);
  zPl('#7a7684',[-30,-142,-30,-130,-20,-142]);
  for(i=0;i<5;i++){zRc('#2a2622',-8,-118+i*22,5,11);zRc('#2a2622',14,-118+i*22,5,11)}
  for(i=0;i<5;i++)zRc('#4a4540',-30,-132+i*28,60,1.5)});
 zBlit(sp,q,252)}
/* ---------- Gebiet A: Hammerwerke und Bahntrassen (g.bonus===4, vier Szenen: Kotten, Viadukt, Tunnel, Schmiede) ---------- */
var ASTAGE=4800,ASEA=['Kotten','Viadukt','Tunnel','Schmiede'],ANAME=['Der Hammerkotten','Das Tal-Viadukt','Der Tanztunnel','Die Schmiedeschlucht'],
ALINE=[
 'Gebiet A, Szene 1: Der Hammerkotten. Hier wurde früher geschmiedet, heute wird fotografiert.',
 'Gebiet A, Szene 2: Das Tal-Viadukt. Der Wegweiser empfiehlt, nicht auf die Gleise zu starren, sondern auf die Loren.',
 'Gebiet A, Szene 3: Der Tanztunnel. Dunkel, rot und erstaunlich beschwingt.',
 'Gebiet A, Szene 4: Die Schmiedeschlucht. Funken, Fest und Riesenrad. Das Ziel steht auf dem Festplatz.'],
AWINS=['Gebiet A geschafft. Der Wegweiser hat die Schmiede schon vom Tunnel aus gehört.','Ziel am Festplatz erreicht. Das Riesenrad dreht sich weiter, Mo macht Pause.'];
S['Kotten']={sky:['#8fcbea','#acdcee','#cdeaf0','#e6f4ea'],sun:'#fff3b0',mt:'#b3cdbe',hill:['#a6cf9c','#7fb572'],tree:['#4a8c3f','#2f6a2a'],pine:false,gr:'#5c9246',path:'#d1be90',fg:'#2f6a2a',trunk:'#3b2a1c',leaf:'#2f6a2a',snow:false,night:false,k:'summer'};
S['Viadukt']={sky:['#9cc4e0','#c5d8d8','#ead9b0','#f5e3be'],sun:'#fff0c0',mt:'#aab9ac',hill:['#9dbd94','#78a074'],tree:['#487a4a','#2d5a35'],pine:false,gr:'#5a8a48',path:'#cdb88a',fg:'#2d5a35',trunk:'#3b2a1c',leaf:'#2d5a35',snow:false,night:false,k:'summer'};
S['Tunnel']={sky:['#1c1214','#2a1a1c','#3a2426','#4a2c2c'],sun:'#ff8a6a',mt:'#2a1a1c',hill:['#2a1a1c','#241618'],tree:['#2a1a1c','#1c1214'],pine:false,gr:'#3a2a22',path:'#4a342a',fg:'#1c1214',trunk:'#1c1214',leaf:'#1c1214',snow:false,night:true,k:'tunnel'};
S['Schmiede']={sky:['#5a4a6e','#a06078','#e08a5a','#f6b872'],sun:'#ffd9a0',mt:'#6a5a6a',hill:['#6a5260','#4e3c4c'],tree:['#3a3040','#2a2230'],pine:true,gr:'#4a3c40',path:'#7a6252',fg:'#2a2230',trunk:'#2a2230',leaf:'#2a2230',snow:false,night:false,k:'forge'};
var AOB={biber:1,fass:1,kranhaken:1,dampf:1,lore:1,kiste:1,uhu:1,signal:1,schwellen:1,ratte:1,efeu:1,draht:1,schlacke:1,kohle:1,hammer:1,funken:1};
var APOOL=[['biber','biber','fass','fass','kranhaken','dampf'],['lore','kiste','lore','uhu','signal','kiste'],['schwellen','ratte','schwellen','ratte','efeu','draht'],['schlacke','kohle','schlacke','hammer','funken','kohle']];
var AITEMS=[['zahnrad','schluessel'],['ticket','nagel'],['quarz','pfeife'],['hufeisen','muenze']],ABONK=['waffel','droeppel','lampe','goldhammer'],ABON={waffel:1,droeppel:1,lampe:1,goldhammer:1},AITEM={zahnrad:1,schluessel:1,ticket:1,nagel:1,quarz:1,pfeife:1,hufeisen:1,muenze:1,lampe:1,goldhammer:1};
(function(){for(var k in AOB)BON[k]=1})();
HW.biber=22;HH.biber=30;HW.fass=18;HH.fass=34;HW.kranhaken=26;HH.kranhaken=30;HW.dampf=24;HH.dampf=30;
HW.lore=26;HH.lore=30;HW.kiste=20;HH.kiste=24;HW.uhu=28;HH.uhu=30;HW.signal=20;HH.signal=30;
HW.schwellen=28;HH.schwellen=32;HW.ratte=22;HH.ratte=18;HW.efeu=24;HH.efeu=30;HW.draht=26;HH.draht=30;
HW.schlacke=28;HH.schlacke=30;HW.kohle=24;HH.kohle=26;HW.hammer=28;HH.hammer=30;HW.funken=34;HH.funken=30;
LUFT.uhu=1;LUFT.funken=1;HANG.kranhaken=1;HANG.dampf=1;HANG.signal=1;HANG.efeu=1;HANG.draht=1;HANG.hammer=1;
APP.uhu=.55;OFF.uhu=209;APP.ratte=.4;OFF.ratte=169;APP.fass=.3;OFF.fass=136;
HIT.biber=['Der Biber hat Mo nicht gebissen, nur den Schuh geprüft. Holz ist ihm lieber.','Biber im Weg. Er baut hier seit Jahren an etwas, das niemand versteht.'];
DODGE.biber=['Über den Biber. Er nagt weiter, als wäre nichts gewesen.','Biber umsprungen. Kein Damm, kein Problem.'];
HIT.fass=['Ein Eichenfass rollte heran. Es war leer, das tröstet Mo nicht.','Fass eins, Würde null. Es hat sich nicht entschuldigt, es rollt ja noch.'];
DODGE.fass=['Das Fass rollt weiter. Irgendwo wartet ein Bach auf es.','Übers Fass. Elegant, fast wie beim Fassrollen.'];
HIT.kranhaken=['Der Haken hing da seit Jahrzehnten. Mo hat ihn trotzdem gefunden.','Ducken, nicht beten. Das steht sogar auf dem Schild.'];
DODGE.kranhaken=['Unter dem Haken durch. Er pendelt weiter, wie jeden Tag.','Geduckt. Der Kran hat nichts gemerkt.'];
HIT.dampf=['Das Ventil hat gezischt. Mo auch.','Dampf auf Kopfhöhe. Der Wegweiser empfiehlt: Hut festhalten und dahinter nicht stehen bleiben.'];
DODGE.dampf=['Unter dem Dampf durch. Der Hut ist trocken geblieben.','Geduckt. Das Ventil zischt weiter, aus Prinzip.'];
HIT.lore=['Die Lore ist rostig und trotzdem hart. Mo prüft das nicht noch einmal.','Eisenlore getroffen. Sie rollt seit 1912 nicht mehr, Mo rollt dafür.'];
DODGE.lore=['Über die Lore. Sie steht da wie ein Denkmal.','Lore umsprungen. Der Rost sagt Danke, indem er schweigt.'];
HIT.kiste=['Eine Werkzeugkiste mitten im Weg. Wer vergisst so etwas?','Kiste getroffen. Drinnen klapperte es, draußen Mo.'];
DODGE.kiste=['Über die Kiste. Der Inhalt klappert weiter.','Werkzeugkiste übersprungen. Der Besitzer bleibt unbekannt.'];
HIT.uhu=['Der Uhu kam lautlos. Mo hat ihn erst gespürt, als es zu spät war. Das ist bei Uhus normal.','Uhu eins, Würde null. Er schaute dabei sehr klug.'];
DODGE.uhu=['Unter dem Uhu durch. Er sieht Mo nach und weiß alles.','Geduckt. Der Uhu dreht nur den Kopf.'];
HIT.signal=['Die Signallampe schwang tief. Rot heißt Halt, das hat Mo spät gemerkt.','Signal auf Rot, Mo auf Kollisionskurs.'];
DODGE.signal=['Unter der Signallampe durch. Sie bleibt rot, wie immer.','Geduckt. Freie Fahrt gibt es nur für Mo.'];
HIT.schwellen=['Ein Schwellenstapel. Holz, Teer und sehr viel Geduld im Weg.','Schwellen getroffen. Der Teergeruch bleibt.'];
DODGE.schwellen=['Über die Schwellen. Die liegen seit hundert Jahren so.','Stapel umsprungen. Das war Gleisbau auf Zehenspitzen.'];
HIT.ratte=['Die Tunnelratte war schneller. Ratten haben im Tunnel Vorfahrt.','Ratte eins, Würde null. Sie hat sich nicht mal umgedreht.'];
DODGE.ratte=['Über die Ratte. Sie huscht weiter und hat es eilig.','Rattenhüpfer. Sie nimmt es nicht persönlich.'];
HIT.efeu=['Efeu hängt dort, wo man nicht hinsieht. Mo hat nicht hingesehen.','Efeu im Gesicht. Der Wegweiser nennt das Naturkontakt.'];
DODGE.efeu=['Unter dem Efeu durch. Es wächst weiter, still und gründlich.','Geduckt. Der Efeu bleibt hängen, Mo nicht.'];
HIT.draht=['Signaldrähte hängen tief. Das steht in keinem Fahrplan.','Mo hat sich in den Drähten verfangen. Der Wegweiser nennt das Leitungsnetz.'];
DODGE.draht=['Unter den Drähten durch. Der Strom ist längst abgestellt, hoffentlich.','Geduckt. Die Drähte schwingen nach.'];
HIT.schlacke=['Die Schlacke glüht noch. Mo fühlt es durch die Sohle.','Schlackehaufen getroffen. Er ist heiß und nachtragend.'];
DODGE.schlacke=['Über die Schlacke. Sie glüht weiter vor sich hin.','Glühhaufen umsprungen. Die Sohle sagt Danke.'];
HIT.kohle=['Eine kleine Kohlenlore. Klein, schwarz und sehr dickköpfig.','Kohlenlore getroffen. Mo sieht jetzt aus wie ein Bergmann, nur schlechter bezahlt.'];
DODGE.kohle=['Über die Kohlenlore. Sie bleibt schwarz, wie versprochen.','Lore übersprungen. Glück auf!'];
HIT.hammer=['Der Schmiedehammer schwang herab. Mo war der Amboss.','Der Hammer schlägt im Takt. Mo war nicht im Takt.'];
DODGE.hammer=['Unter dem Hammer durch. Der Takt stimmt, die Würde auch.','Geduckt. Der Hammer schlägt weiter auf Luft.'];
HIT.funken=['Ein Funkenschwarm. Hübsch anzusehen, unangenehm anzufassen.','Funken im Gesicht. Der Wegweiser nennt das Feuerwerk ohne Genehmigung.'];
DODGE.funken=['Unter den Funken durch. Die Schmiede lacht nicht.','Geduckt. Das Feuer hat sich verflogen.'];
NAMEN.zahnrad='Eisen-Zahnrad';NAMEN.schluessel='Schraubenschlüssel';NAMEN.ticket='Bahnticket';NAMEN.nagel='Eisennagel';NAMEN.quarz='Quarzkristall';NAMEN.pfeife='Schaffnerpfeife';NAMEN.hufeisen='Hufeisen';NAMEN.muenze='Silbermünze';NAMEN.lampe='Mützenlampe';NAMEN.goldhammer='Goldener Schmiedehammer';
FUNDTXT.zahnrad=['Ein Eisen-Zahnrad. Es greift in nichts mehr, Mo greift zu.','Zahnrad gefunden. Der Wegweiser nennt das ein Rädchen im Getriebe.'];
FUNDTXT.schluessel=['Ein Schraubenschlüssel aus Messing. Der Besitzer hat ihn wohl zum letzten Mal gebraucht.','Schlüssel gefunden. Passt auf nichts, passt aber in die Tasche.'];
FUNDTXT.ticket=['Ein altes Bahnticket. Das Ziel ist verblasst, die Verspätung vermutlich auch.','Ticket gefunden. Gültig war es nur bis 1961.'];
FUNDTXT.nagel=['Ein glänzender Eisennagel. Wer so einen findet, braucht heute ein Pflaster weniger.','Nagel gefunden. Er hielt einmal die Welt zusammen, zumindest die Schienen.'];
FUNDTXT.quarz=['Ein Quarzkristall. Er leuchtet leicht, wenn man ihn anschaut.','Quarz gefunden. Im roten Licht sieht er aus wie ein Bonbon.'];
FUNDTXT.pfeife=['Eine Schaffnerpfeife. Mo pfeift nicht, nur zur Sicherheit.','Pfeife gefunden. Abfahrt gibt es keine mehr, die Pfeife gibt es noch.'];
FUNDTXT.hufeisen=['Ein geschmiedetes Hufeisen. Offene Seite nach oben, das bringt Glück.','Hufeisen gefunden. Das Pferd braucht es nicht mehr, Mo schon.'];
FUNDTXT.muenze=['Eine Silbermünze. Sie klingt echt, sie ist es wohl auch.','Münze gefunden. Der Wegweiser nimmt keine Trinkgelder an.'];
FUNDTXT.lampe=['Eine Mützenlampe. Sie leuchtet warm. Ein Hut kehrt zurück, wenn Mo einen verloren hatte.','Mützenlampe gefunden. Licht im Tunnel und Mut im Hut.'];
FUNDTXT.goldhammer=['Ein goldener Schmiedehammer. Er ist leicht, aber Mo fühlt sich stark. Ein Hut kehrt zurück, falls nötig.','Goldener Hammer gefunden. Er schmiedet Glück, ohne Funken.'];
function aLm(st,off,k){return 340+(st*STAGE+off-g.run)*k}
function aSky(P){for(var i=0;i<4;i++){x.fillStyle=P.sky[i];x.fillRect(0,i*H/4,W,H/4+1)}}
function aGround(P){x.fillStyle='rgba(0,0,0,.14)';x.fillRect(0,GY,W,H-GY);x.fillStyle=P.gr;x.fillRect(0,GY,W,H-GY);x.fillStyle='rgba(255,255,255,.2)';x.fillRect(0,GY,W,2)}
function aPath(P){
 x.fillStyle=P.path;x.beginPath();x.moveTo(0,FY-8);for(var q=0;q<=W;q+=10)x.lineTo(q,FY-8+Math.sin((q+D)/70)*2);
 x.lineTo(W,FY+16);for(var q2=W;q2>=0;q2-=10)x.lineTo(q2,FY+16+Math.sin((q2+D)/90)*2);x.closePath();x.fill();
 x.fillStyle='rgba(0,0,0,.07)';x.fillRect(0,FY+9,W,3);x.fillRect(0,FY-2,W,3);
 for(var pb=0;pb<26;pb++){var pq=md(pb*53-D,LOOP);if(pq<W){x.fillStyle=pb%3?'rgba(0,0,0,.12)':'rgba(255,255,255,.2)';x.beginPath();x.ellipse(pq,FY-4+R(pb)*18,2.2+R(pb+1)*2,1.2,0,0,6.3);x.fill()}}}
function aGlow(X,ts){var gl=.36+.12*Math.sin(ts/300),gg=x.createRadialGradient(X,FY-9,2,X,FY-9,28);gg.addColorStop(0,'rgba(255,226,110,'+gl+')');gg.addColorStop(1,'rgba(255,226,110,0)');x.fillStyle=gg;x.beginPath();x.arc(X,FY-9,28,0,6.3);x.fill()}
/* ----- Szene 1: Hammerkotten (fachwerkhaus mit Wasserrad und Schwanzhammer) ----- */
function kottenStatic(){
 var i;zRc('#8f8a80',-78,-12,150,12);zRc('#efe3c8',-70,-90,140,80);
 x.strokeStyle='#6b4a2a';x.lineWidth=3;x.beginPath();
 x.moveTo(-70,-90);x.lineTo(70,-90);x.moveTo(-70,-50);x.lineTo(70,-50);x.moveTo(-70,-12);x.lineTo(70,-12);
 [-70,-24,24,70].forEach(function(d){x.moveTo(d,-90);x.lineTo(d,-12)});
 x.moveTo(-70,-12);x.lineTo(-24,-50);x.moveTo(70,-12);x.lineTo(24,-50);x.moveTo(-70,-50);x.lineTo(-24,-90);x.moveTo(70,-50);x.lineTo(24,-90);x.stroke();
 zPl('#8a3a2a',[-84,-90,0,-148,84,-90]);zPl('#a14a36',[-84,-90,0,-148,-6,-148,-90,-90]);
 x.strokeStyle='rgba(60,20,12,.45)';x.lineWidth=1;x.beginPath();for(i=1;i<5;i++){var yy=-90-i*11,hw=84-i*14;x.moveTo(-hw,yy);x.lineTo(hw,yy)}x.stroke();
 zRc('#6a5a52',34,-158,13,40);zRc('#5a4a44',32,-160,17,5);
 [[-56,-80],[34,-80],[-56,-44]].forEach(function(w){zRc('#7fb4d6',w[0],w[1],22,24);x.strokeStyle='#6b4a2a';x.lineWidth=2;x.strokeRect(w[0],w[1],22,24);x.beginPath();x.moveTo(w[0]+11,w[1]);x.lineTo(w[0]+11,w[1]+24);x.moveTo(w[0],w[1]+12);x.lineTo(w[0]+22,w[1]+12);x.stroke();zRc('#3f6a4a',w[0]-6,w[1],5,24);zRc('#3f6a4a',w[0]+23,w[1],5,24)});
 zRc('#6b4a2a',-6,-44,22,32);zEl('#6b4a2a',5,-44,11,8);zEl('#d6a53a',11,-28,1.6,1.6);
 zRc('#5a4a3a',-124,-4,248,4);
 zRc('#7a5a38',-120,-98,56,5);zRc('#6a4a2a',-120,-93,56,2)}
function kotten(cx,ts){
 var by=GY+6,t=ts/1000,i,a=t*.75,wx=cx-96,wy=by-36;
 zBlit(zSprite('kotten',280,190,130,160,kottenStatic),cx,by);
 /* Mühlteich */
 x.fillStyle='#7fb4d6';x.beginPath();x.ellipse(wx+4,by+2,46,6,0,0,6.3);x.fill();x.strokeStyle='rgba(255,255,255,.5)';x.lineWidth=1;x.beginPath();x.ellipse(wx+4,by+2,30+((t*14)%14),3+((t*3)%3),0,0,6.3);x.stroke();
 /* Wasserrad */
 x.save();x.translate(wx,wy);
 x.strokeStyle='#7a5430';x.lineWidth=5;x.beginPath();x.arc(0,0,32,0,6.3);x.stroke();x.lineWidth=2;x.beginPath();x.arc(0,0,22,0,6.3);x.stroke();
 for(i=0;i<8;i++){var an=a+i*.7854,cs=Math.cos(an),sn=Math.sin(an);x.strokeStyle='#7a5430';x.lineWidth=3;x.beginPath();x.moveTo(cs*5,sn*5);x.lineTo(cs*32,sn*32);x.stroke();
  x.save();x.translate(cs*32,sn*32);x.rotate(an);x.fillStyle='#8a6238';x.fillRect(-1,-6,6,12);x.restore()}
 x.fillStyle='#5a3a18';x.beginPath();x.arc(0,0,6,0,6.3);x.fill();x.restore();
 x.fillStyle='#8a6238';x.fillRect(wx-48,by-84,52,4);x.fillStyle='#7fb4d6';
 for(i=0;i<3;i++){var u=((t*1.4+i/3)%1);x.beginPath();x.ellipse(wx-8+i*6,by-80+u*40,1.6,2.6,0,0,6.3);x.fill()}
 /* Schwanzhammer rechts neben dem Haus */
 var hx=cx+120,pu=(t*1.5)%1,ha=pu<.7?.62*Math.sin(pu/.7*1.5708):pu<.78?.62*Math.pow(1-(pu-.7)/.08,2):0,px0=hx+78,py0=by-38;
 /* Amboss auf Holzblock */
 zRc('#5a3a18',hx-8,by-14,22,14);zRc('#3a3f48',hx-18,by-26,42,12);zPl('#3a3f48',[hx-18,by-26,hx-34,by-24,hx-18,by-18]);zRc('#6b7280',hx-18,by-26,42,3);
 /* Gestell und Hammerstiel mit Kopf, schlägt in der Senke auf den Amboss */
 zRc('#5a3a18',px0-5,py0,10,by-py0);zRc('#4a2e14',px0-14,by-6,28,6);
 x.save();x.translate(px0,py0);x.rotate(ha);x.fillStyle='#7a5430';x.fillRect(-84,-5,110,10);x.fillStyle='#6a4626';x.fillRect(-84,-5,110,3);
 x.fillStyle='#4a4f58';x.fillRect(-100,-16,30,28);x.fillStyle='#6b7280';x.fillRect(-100,-16,30,5);x.fillStyle='#2a2d33';x.fillRect(-100,6,30,6);
 x.fillStyle='#8a6238';x.fillRect(14,-9,16,18);x.restore();
 /* Funken beim Aufschlag, danach glühen sie aus */
 if(pu>.78&&pu<1){var su=(pu-.78)/.22,sx0=hx+3,sy0=by-28;x.fillStyle='rgba(255,246,190,'+(.9*(1-su))+')';x.beginPath();x.arc(sx0,sy0,14*(1-su)+3,0,6.3);x.fill();
  for(i=0;i<18;i++){var an=-.15*Math.PI-R(i+7)*.7*Math.PI,sp=.5+R(i+2)*.9,fx=sx0+Math.cos(an)*sp*60*su*(i%2?1:-1)*.9,fy=sy0+Math.sin(an)*sp*60*su+26*su*su;
   x.fillStyle=i%3?'rgba(255,'+(150+R(i)*90|0)+',40,'+(1-su)+')':'rgba(255,240,170,'+(1-su)+')';x.beginPath();x.arc(fx,fy,2.2-su*1.2,0,6.3);x.fill()}}
 else if(pu<.1){var s2=pu/.1;x.fillStyle='rgba(255,170,50,'+(.5*(1-s2))+')';x.beginPath();x.arc(hx+3,by-30,6+s2*6,0,6.3);x.fill()}
 /* Rauch aus dem Schornstein */
 for(i=0;i<3;i++){var s=((t*.22+i/3)%1);x.fillStyle='rgba(235,235,240,'+(.55*(1-s))+')';x.beginPath();x.arc(cx+40+s*22,by-160-s*50,5+s*10,0,6.3);x.fill()}}
/* Doppeldecker mit Werbebanner "mitrilmo", fliegt nach rechts, Banner weht hinten nach links. x = Zeichenkontext */
var bpW=null,bpT=0;
function biplane(px,py,t){
 var i,k,N=26,BL=136,bx0=-70;
 x.save();x.translate(px,py);x.rotate(Math.sin(t*1.3)*.035);
 /* Zugseil und Banner */
 var wy=function(s){return 3+Math.sin(t*5.2-s*.42)*2.6*(.25+s/N*.9)+s*.08};
 x.strokeStyle='#5a4a3a';x.lineWidth=1;x.beginPath();x.moveTo(-46,3);x.lineTo(bx0,wy(0)-12);x.moveTo(-46,3);x.lineTo(bx0,wy(0)+12);x.stroke();
 x.beginPath();x.moveTo(bx0,wy(0)-14);
 for(i=0;i<=N;i++){x.lineTo(bx0-i*BL/N,wy(i)-14)}
 x.lineTo(bx0-BL-9,wy(N));
 for(i=N;i>=0;i--){x.lineTo(bx0-i*BL/N,wy(i)+14)}
 x.closePath();x.fillStyle='#fbf3e0';x.fill();x.strokeStyle='#b2321f';x.lineWidth=1.6;x.stroke();
 x.strokeStyle='rgba(178,50,31,.5)';x.lineWidth=.8;x.beginPath();x.moveTo(bx0,wy(0)-10);for(i=0;i<=N;i++)x.lineTo(bx0-i*BL/N,wy(i)-10);x.moveTo(bx0,wy(0)+10);for(i=0;i<=N;i++)x.lineTo(bx0-i*BL/N,wy(i)+10);x.stroke();
 var tx='mitrilmo';x.font='bold 17px Georgia,serif';x.textAlign='center';x.textBaseline='middle';
 if(!bpW){bpW=[];bpT=0;for(k=0;k<tx.length;k++){bpW[k]=x.measureText(tx[k]).width+1.2;bpT+=bpW[k]}}var ws=bpW,tw=bpT;
 var cx0=bx0-BL/2-tw/2,cum=0;
 for(k=0;k<tx.length;k++){var xs=cx0+cum+ws[k]/2,s=(bx0-xs)*N/BL,sl=(wy(s+.5)-wy(s-.5))/(BL/N);cum+=ws[k];
  x.save();x.translate(xs,wy(s)+1);x.rotate(-Math.atan(sl));x.fillStyle='#2f6a2a';x.fillText(tx[k],0,0);x.restore()}
 x.textAlign='left';x.textBaseline='alphabetic';
 /* Abgaswölkchen */
 for(i=0;i<4;i++){var u=((t*.9+i/4)%1);x.fillStyle='rgba(235,235,240,'+(.5*(1-u))+')';x.beginPath();x.arc(30-u*8,8+u*3,2+u*3,0,6.3);x.fill()}
 /* Fahrwerk */
 x.strokeStyle='#3a2f28';x.lineWidth=1.8;x.beginPath();x.moveTo(8,8);x.lineTo(13,18);x.moveTo(-2,8);x.lineTo(2,18);x.moveTo(1,18.5);x.lineTo(15,18.5);x.stroke();
 [[13,18],[3,18]].forEach(function(w){x.fillStyle='#1c1c22';x.beginPath();x.arc(w[0],w[1],4.4,0,6.3);x.fill();x.fillStyle='#9aa0aa';x.beginPath();x.arc(w[0],w[1],1.8,0,6.3);x.fill()});
 /* Leitwerk */
 x.fillStyle='#b2321f';x.beginPath();x.moveTo(-34,-6);x.lineTo(-47,-23);x.lineTo(-40,-24);x.lineTo(-27,-8);x.closePath();x.fill();
 x.fillStyle='#e8dcc0';x.beginPath();x.ellipse(-40,-1,11,2.6,-.08,0,6.3);x.fill();x.strokeStyle='#b2321f';x.lineWidth=1;x.stroke();
 /* Rumpf */
 x.beginPath();x.moveTo(-42,-1);x.lineTo(-35,-9);x.quadraticCurveTo(-8,-14,12,-13);x.quadraticCurveTo(25,-12,27,-3);x.quadraticCurveTo(26,6,17,9);x.quadraticCurveTo(-8,11,-42,2);x.closePath();
 x.fillStyle='#c0392b';x.fill();x.strokeStyle='#7a1f14';x.lineWidth=1.2;x.stroke();
 x.fillStyle='#f4ead0';x.beginPath();x.moveTo(-36,-3);x.lineTo(20,-4);x.lineTo(22,1);x.lineTo(-37,0);x.closePath();x.fill();
 x.fillStyle='rgba(255,255,255,.28)';x.beginPath();x.ellipse(-6,-10,22,1.6,0,0,6.3);x.fill();
 /* untere Tragfläche (vor dem Rumpf) */
 x.fillStyle='#e8dcc0';x.beginPath();x.moveTo(-24,5);x.lineTo(22,5);x.lineTo(31,9.5);x.lineTo(-15,9.5);x.closePath();x.fill();x.strokeStyle='#b2321f';x.lineWidth=1.2;x.stroke();
 x.fillStyle='#b2321f';x.beginPath();x.moveTo(22,5);x.lineTo(31,9.5);x.lineTo(28,9.5);x.lineTo(19.5,5);x.closePath();x.fill();x.fillRect(-24,5,3,4.5);
 /* Motorhaube, Propeller */
 x.fillStyle='#8a8f98';x.beginPath();x.ellipse(26,-2,6.5,9,0,0,6.3);x.fill();x.strokeStyle='#5a5f68';x.lineWidth=1;x.stroke();
 x.strokeStyle='rgba(255,255,255,.4)';x.lineWidth=1;x.beginPath();x.arc(26,-2,6,3.8,5);x.stroke();
 var pa=t*38;x.fillStyle='rgba(70,60,50,.28)';x.beginPath();x.ellipse(33,-2,2.6,14,0,0,6.3);x.fill();
 x.strokeStyle='#3a2f28';x.lineWidth=2.2;x.beginPath();x.moveTo(33,-2-Math.cos(pa)*13);x.lineTo(33,-2+Math.cos(pa)*13);x.stroke();
 x.fillStyle='#d9b34a';x.beginPath();x.arc(33,-2,2.2,0,6.3);x.fill();
 /* Pilot: Fliegerkappe, Brille, Schal */
 x.fillStyle='#2a1a14';x.beginPath();x.ellipse(-6,-12,8,3.4,0,0,6.3);x.fill();
 var sc2=Math.sin(t*9)*2;x.fillStyle='#e0a92a';x.beginPath();x.moveTo(-10,-14);x.quadraticCurveTo(-24,-15+sc2,-34,-12+sc2*1.5);x.quadraticCurveTo(-24,-11+sc2,-10,-11);x.closePath();x.fill();
 x.save();x.translate(0,3);x.fillStyle='#f0c8a0';x.beginPath();x.arc(-5,-18,5.2,0,6.3);x.fill();
 x.fillStyle='#6b4a2a';x.beginPath();x.arc(-5,-19.5,5.4,3.14,6.28);x.fill();x.fillRect(-10.4,-19.5,3,5);
 x.fillStyle='#2a2a30';x.fillRect(-9,-19,10,2.4);x.fillStyle='#9fd0e8';x.beginPath();x.arc(-2.6,-17.8,2.1,0,6.3);x.fill();x.strokeStyle='#2a2a30';x.lineWidth=.9;x.stroke();
 x.fillStyle='#7a4a28';x.beginPath();x.ellipse(0,-15,2.6,1.2,.2,0,6.3);x.fill();x.restore();
 /* Streben und Spanndrähte */
 x.strokeStyle='#5a3a22';x.lineWidth=1.8;x.beginPath();x.moveTo(-14,-24);x.lineTo(-14,6);x.moveTo(16,-24);x.lineTo(16,6);x.moveTo(-4,-23);x.lineTo(2,-12);x.moveTo(8,-23);x.lineTo(5,-12);x.stroke();
 x.strokeStyle='rgba(40,30,24,.7)';x.lineWidth=.7;x.beginPath();x.moveTo(-14,-24);x.lineTo(16,6);x.moveTo(16,-24);x.lineTo(-14,6);x.stroke();
 /* obere Tragfläche */
 x.fillStyle='#f4ead0';x.beginPath();x.moveTo(-32,-28);x.lineTo(26,-28);x.lineTo(36,-22.5);x.lineTo(-22,-22.5);x.closePath();x.fill();x.strokeStyle='#b2321f';x.lineWidth=1.3;x.stroke();
 x.fillStyle='#b2321f';x.beginPath();x.moveTo(26,-28);x.lineTo(36,-22.5);x.lineTo(32.5,-22.5);x.lineTo(22.5,-28);x.closePath();x.fill();x.fillRect(-32,-28,3,5.5);
 x.strokeStyle='rgba(120,90,60,.35)';x.lineWidth=.7;x.beginPath();for(i=0;i<6;i++){x.moveTo(-26+i*9,-27.5);x.lineTo(-17+i*9,-23)}x.stroke();
 x.restore()}
function drawKotten(ts){
 var P=S['Kotten'],o=D;
 aSky(P);
 x.fillStyle='rgba(255,255,255,.16)';x.beginPath();x.arc(520,76,44,0,6.3);x.fill();x.fillStyle=P.sun;x.beginPath();x.arc(520,76,28,0,6.3);x.fill();
 cloud(md(130-o*.05,W+200)-100,56,1.1,.85);cloud(md(380-o*.035,W+200)-100,92,.8,.8);cloud(md(580-o*.06,W+200)-100,44,.9,.85);
 var pt=ts/1000,ppx=-270+((pt*42)%1300);if(ppx<W+80){x.save();x.translate(ppx,122+Math.sin(pt*.9)*5);x.scale(1.1,1.1);biplane(0,0,pt);x.restore()}
 hills(o*.05,170,20,2,0,8,5,1.3,P.hill[0],'rgba(255,255,255,.3)');
 layer(P,o*.15,234,38,52,true,3);
 hills(o*.1,214,14,3,2,6,7,.4,P.hill[1],'rgba(255,255,255,.25)');
 var cx=aLm(0,2300,.3);if(cx>-190&&cx<W+250)kotten(cx,ts);
 ACLR=(cx>-300&&cx<W+360)?[cx+50,215]:null;
 layer(P,o*.5,GY,150,80,false,6);ACLR=null;
 aGround(P);fence(P,D);deco(P,D,GY+8,GY+24,30,1);
 bonusSign(zSignX('ahh',700),'Ahlhauser Hammer');
 aPath(P);deco(P,D*1.12,FY+22,FY+34,22,1.25)}
/* ----- Szene 2: Tal-Viadukt mit Davidis-Museum ----- */
function viaduktStatic(){
 var i,n=4,w=64,L=n*w;
 zRc('#b8a98c',0,-140,L,24);zRc('#9c8d72',0,-118,L,4);
 zRc('#b8a98c',0,-116,L,116);
 x.globalCompositeOperation='destination-out';x.fillStyle='#000';
 for(i=0;i<n;i++){var ax=i*w+8;x.beginPath();x.moveTo(ax,0);x.lineTo(ax,-70);x.arc(ax+(w-16)/2,-70,(w-16)/2,Math.PI,0);x.lineTo(ax+w-16,0);x.closePath();x.fill()}
 x.globalCompositeOperation='source-over';
 x.strokeStyle='#7a6a52';x.lineWidth=1.6;
 for(i=0;i<n;i++){var bx=i*w+8;x.beginPath();x.moveTo(bx,0);x.lineTo(bx,-70);x.arc(bx+(w-16)/2,-70,(w-16)/2,Math.PI,0);x.lineTo(bx+w-16,0);x.stroke()}
 x.lineWidth=1;x.strokeStyle='rgba(90,75,55,.4)';x.beginPath();for(var r=0;r<6;r++){var yy=-12-r*18;x.moveTo(0,yy);x.lineTo(L,yy)}x.stroke();
 x.fillStyle='rgba(90,130,70,.35)';for(i=0;i<6;i++){x.beginPath();x.ellipse(20+R(i)*(L-40),-6-R(i+5)*40,9+R(i+3)*10,4,0,0,6.3);x.fill()}
 x.strokeStyle='#5f6672';x.lineWidth=2;x.beginPath();x.moveTo(0,-156);x.lineTo(L,-156);for(i=0;i<=n*2;i++){x.moveTo(i*L/(n*2),-156);x.lineTo(i*L/(n*2),-140)}x.stroke()}
function viaduktTrain(ts){
 var t=ts/1000,tx=-60+((t*38)%1136),by=GY-146,i;
 var gy2=by;
 for(i=0;i<3;i++){var wx0=tx-52-i*50;zRc('#3f7a4a',wx0,gy2-22,44,16);zRc('#2f5a38',wx0,gy2-8,44,4);zRc('#e8e2c8',wx0+6,gy2-18,8,6);zRc('#e8e2c8',wx0+18,gy2-18,8,6);zRc('#e8e2c8',wx0+30,gy2-18,8,6);zEl('#222',wx0+8,gy2-3,4,4);zEl('#222',wx0+36,gy2-3,4,4)}
 zRc('#2a2a30',tx-4,gy2-22,38,16);zRc('#b2321f',tx-4,gy2-10,38,4);zRc('#2a2a30',tx+24,gy2-32,12,26);zRc('#1a1a1e',tx+22,gy2-36,16,5);zEl('#222',tx+4,gy2-3,4,4);zEl('#222',tx+26,gy2-3,4,4);
 for(i=0;i<3;i++){var s=((t*.5+i/3)%1);x.fillStyle='rgba(235,235,240,'+(.6*(1-s))+')';x.beginPath();x.arc(tx+30-s*50,gy2-40-s*14,4+s*9,0,6.3);x.fill()}}
/* Lagerfeuer mit kochendem Kessel am Davidis-Museum */
function kesselFeuer(fx,fy,ts){
 var t=ts/1000,i,gl=glowS(fx,fy-14,46,'255,160,60',.34+.08*Math.sin(t*11));
 x.fillStyle='rgba(0,0,0,.2)';x.beginPath();x.ellipse(fx,fy+2,26,5,0,0,6.3);x.fill();
 x.strokeStyle='#4a3524';x.lineWidth=2.6;x.lineCap='round';x.beginPath();x.moveTo(fx-26,fy);x.lineTo(fx,fy-60);x.moveTo(fx+26,fy);x.lineTo(fx,fy-60);x.moveTo(fx+3,fy+3);x.lineTo(fx+1,fy-60);x.stroke();
 x.strokeStyle='#2a2a30';x.lineWidth=1.4;x.beginPath();x.moveTo(fx,fy-58);x.lineTo(fx,fy-42);x.stroke();
 x.fillStyle='#2b2b30';x.beginPath();x.arc(fx,fy-40,17,0,Math.PI);x.fill();x.fillStyle='#3a3a42';x.beginPath();x.ellipse(fx,fy-40,17,4.4,0,0,6.3);x.fill();
 x.fillStyle='#7a9a3a';x.beginPath();x.ellipse(fx,fy-40,14,3,0,0,6.3);x.fill();
 for(i=0;i<4;i++){var bu=((t*1.3+i*.27)%1);x.fillStyle='rgba(210,235,150,'+(.8*(1-bu))+')';x.beginPath();x.arc(fx-8+i*5.5,fy-40-bu*2.4,1.2+bu*1.4,0,6.3);x.fill()}
 x.fillStyle='rgba(255,255,255,.18)';x.beginPath();x.ellipse(fx-8,fy-34,3,7,.5,0,6.3);x.fill();
 x.fillStyle='#7a7a82';[[-22,0],[-12,2],[12,2],[22,0]].forEach(function(s){x.beginPath();x.ellipse(fx+s[0],fy+s[1],6,3.4,0,0,6.3);x.fill()});
 x.fillStyle='#5a3a22';x.beginPath();x.ellipse(fx-6,fy-2,13,3,.25,0,6.3);x.fill();x.beginPath();x.ellipse(fx+6,fy-2,13,3,-.25,0,6.3);x.fill();
 for(i=0;i<3;i++){var h=16+Math.sin(t*13+i*2.1)*5,ox2=fx-9+i*9;x.fillStyle='#f2682a';x.beginPath();x.moveTo(ox2-6,fy-3);x.quadraticCurveTo(ox2-8,fy-3-h*.6,ox2+Math.sin(t*9+i)*2,fy-3-h);x.quadraticCurveTo(ox2+8,fy-3-h*.6,ox2+6,fy-3);x.closePath();x.fill();
  x.fillStyle='#ffc43a';x.beginPath();x.moveTo(ox2-3,fy-3);x.quadraticCurveTo(ox2-4,fy-3-h*.45,ox2,fy-3-h*.7);x.quadraticCurveTo(ox2+4,fy-3-h*.45,ox2+3,fy-3);x.closePath();x.fill()}
 for(i=0;i<7;i++){var u=((t*.45+i/7)%1);x.fillStyle='rgba(240,240,246,'+(.55*(1-u))+')';x.beginPath();x.arc(fx+Math.sin(t*1.6+i*1.7)*(3+u*9),fy-46-u*64,4+u*11,0,6.3);x.fill()}
 for(i=0;i<4;i++){var su=((t*.8+i*.25)%1);x.fillStyle='rgba(255,'+(170+i*20)+',60,'+(1-su)+')';x.beginPath();x.arc(fx-8+i*6+Math.sin(t*5+i)*4*su,fy-14-su*42,1.3,0,6.3);x.fill()}}
function davidisStatic(){
 zRc('#8f8a80',-52,-8,104,8);zRc('#efe3c8',-48,-72,96,64);
 x.strokeStyle='#6b4a2a';x.lineWidth=3;x.beginPath();x.moveTo(-48,-72);x.lineTo(48,-72);x.moveTo(-48,-40);x.lineTo(48,-40);[-48,-16,16,48].forEach(function(d){x.moveTo(d,-72);x.lineTo(d,-8)});x.moveTo(-48,-8);x.lineTo(-16,-40);x.moveTo(48,-8);x.lineTo(16,-40);x.stroke();
 zPl('#6a6a72',[-58,-72,0,-116,58,-72]);zPl('#7a7a84',[-58,-72,0,-116,-5,-116,-62,-72]);
 [[-40,-66],[20,-66],[-40,-34]].forEach(function(w){zRc('#e9c870',w[0],w[1],18,20);x.strokeStyle='#6b4a2a';x.lineWidth=1.6;x.strokeRect(w[0],w[1],18,20);zRc('#4a6a8a',w[0]-5,w[1],4,20);zRc('#4a6a8a',w[0]+19,w[1],4,20)});
 zRc('#6b4a2a',-8,-34,16,26);
 x.strokeStyle='#6b4a2a';x.lineWidth=2;x.beginPath();x.moveTo(34,-66);x.lineTo(66,-66);x.moveTo(62,-66);x.lineTo(62,-62);x.moveTo(110,-66);x.lineTo(110,-62);x.stroke();
 x.fillStyle='#fbf3e0';x.beginPath();x.roundRect(34,-62,96,24,3);x.fill();x.strokeStyle='#6b4a2a';x.lineWidth=1.2;x.stroke();
 x.fillStyle='#2e1f12';x.font='bold 11px system-ui,sans-serif';x.textAlign='center';x.fillText('Davidis-Museum',82,-46);x.textAlign='left'}
function drawViadukt(ts){
 var P=S['Viadukt'],o=D;
 aSky(P);
 x.fillStyle='rgba(255,240,200,.2)';x.beginPath();x.arc(150,92,46,0,6.3);x.fill();x.fillStyle=P.sun;x.beginPath();x.arc(150,92,28,0,6.3);x.fill();
 cloud(md(120-o*.05,W+200)-100,60,1.0,.8);cloud(md(420-o*.035,W+200)-100,48,.9,.8);
 hills(o*.05,176,20,2,0,8,5,1.3,P.hill[0],'rgba(255,255,255,.3)');
 /* Viadukt füllt die ganze Breite, die Bögen laufen als Kachel durch */
 var vt=zSprite('viaduktT',256,170,0,160,viaduktStatic),vo=((o*.22)%256+256)%256;
 for(var vk=-1;vk<4;vk++)zBlit(vt,vk*256-vo,GY-6);
 viaduktTrain(ts);
 layer(P,o*.15,238,38,52,true,3);
 hills(o*.1,218,14,3,2,6,7,.4,P.hill[1],'rgba(255,255,255,.25)');
 var dq=aLm(1,1500,1),dbase=FY-12;
 ACLR=(dq>-330&&dq<W+330)?[dq+60,180]:null;
 layer(P,o*.5,GY,96,80,false,6);ACLR=null;
 aGround(P);fence(P,D);deco(P,D,GY+8,GY+24,30,1);
 if(dq>-330&&dq<W+330){
  x.save();x.translate(dq,dbase);x.scale(1.3,1.3);zBlit(zSprite('davidis',220,140,70,130,davidisStatic),0,0);x.restore();
  ASG.push(dq+107);kesselFeuer(dq-70,dbase,ts)}
 bonusSign(zSignX('elb',STAGE+700),'Elbschetal');
 aPath(P);deco(P,D*1.12,FY+22,FY+34,22,1.25)}
/* ----- Szene 3: Tanztunnel (rötliches Licht, Plakat) ----- */
function posterStatic(){
 zRc('#6b4a2a',-40,-102,80,104);zRc('#f3e6c8',-36,-98,72,96);
 x.fillStyle='#2a1a1c';x.beginPath();x.arc(0,-80,6,0,6.3);x.fill();
 x.beginPath();x.moveTo(-2,-74);x.quadraticCurveTo(-12,-64,-26,-54);x.quadraticCurveTo(-10,-58,-4,-58);x.quadraticCurveTo(-8,-46,-16,-34);x.quadraticCurveTo(-6,-40,0,-44);x.quadraticCurveTo(2,-34,-2,-24);x.quadraticCurveTo(8,-30,8,-42);x.quadraticCurveTo(14,-48,22,-44);x.quadraticCurveTo(18,-56,8,-62);x.quadraticCurveTo(12,-68,6,-74);x.closePath();x.fill();
 x.fillStyle='#2a1a1c';x.font='bold 11px Georgia,serif';x.textAlign='center';x.fillText('Pina B.',0,-14);x.font='italic 10px Georgia,serif';x.fillStyle='#7a5a38';x.fillText('Tanz',0,-4);x.textAlign='left'}
function plaqueStatic(){
 zRc('#1a1214',-80,-18,160,34);x.strokeStyle='#c9a26a';x.lineWidth=2;x.strokeRect(-80,-18,160,34);
 x.fillStyle='#f2d9a0';x.font='bold 19px Georgia,serif';x.textAlign='center';x.fillText('Tanztunnel',0,6);x.textAlign='left'}
function drawTunnel(ts){
 var o=D,t=ts/1000,i,q,run=g.run;
 x.fillStyle=grad(0,H,'#1c1214','#33201f');x.fillRect(0,0,W,H);
 for(i=0;i<9;i++){q=md(i*190-o*.55,1710)-120;if(q<-40||q>W+40)continue;x.fillStyle='rgba(0,0,0,.3)';x.fillRect(q-9,0,18,GY+8);x.fillStyle='rgba(255,120,90,.08)';x.fillRect(q+9,0,3,GY+8)}
 x.strokeStyle='rgba(0,0,0,.26)';x.lineWidth=1;x.beginPath();
 for(var r=0;r<9;r++){var yy=18+r*26;x.moveTo(0,yy);x.lineTo(W,yy);for(var c=-((o*.6+(r%2)*22)%44);c<W;c+=44){x.moveTo(c,yy);x.lineTo(c,yy+26)}}
 x.stroke();
 /* Lampen mit rotem Licht */
 for(i=0;i<3;i++){q=md(i*520+260-o*.6,1560)-80;if(q<-90||q>W+90)continue;
  glowS(q,52,120,'255,110,80',.5);
  x.fillStyle='#2a2a30';x.fillRect(q-3,0,6,36);x.fillRect(q-12,34,24,8);x.fillStyle='#ff8a6a';x.beginPath();x.ellipse(q,46,8,5,0,0,6.3);x.fill();x.fillStyle='#ffd0c0';x.beginPath();x.ellipse(q,45,3.5,2,0,0,6.3);x.fill();
  x.fillStyle='rgba(255,110,80,.07)';x.beginPath();x.moveTo(q-8,46);x.lineTo(q+8,46);x.lineTo(q+70,GY+6);x.lineTo(q-70,GY+6);x.closePath();x.fill()}
 /* Schild und Plakat an der Wand */
 var pq=aLm(2,900,.6);if(pq>-110&&pq<W+110)if(pq>-110&&pq<W+110){ASG.push(pq);zBlit(zSprite('plaque',170,40,85,26,plaqueStatic),pq,138)};
 var qq=aLm(2,2600,.6);if(qq>-60&&qq<W+60){ASG.push(qq);zBlit(zSprite('poster',90,116,45,106,posterStatic),qq,GY-8);x.fillStyle='rgba(255,110,80,.12)';x.beginPath();x.ellipse(qq,GY-60,60,70,0,0,6.3);x.fill()}
 /* Efeu und Drähte an der Decke (nur Dekoration) */
 for(i=0;i<5;i++){q=md(i*300+80-o*.8,1500)-80;if(q<-30||q>W+30)continue;var ln=36+R(i+3)*40;x.strokeStyle='#2f6a3a';x.lineWidth=2.4;x.beginPath();x.moveTo(q,0);x.quadraticCurveTo(q+6*Math.sin(t+i),ln*.5,q+3,ln);x.stroke();x.fillStyle='#4f9a48';for(var lf=0;lf<4;lf++){x.beginPath();x.ellipse(q+(lf%2?4:-4),8+lf*ln/4.5,4,2.2,.5,0,6.3);x.fill()}}
 x.strokeStyle='rgba(10,8,10,.8)';x.lineWidth=1.6;x.beginPath();for(i=0;i<2;i++){var wy=14+i*10,so=(o*.8+i*60)%260;for(var sx=-so-260;sx<W+260;sx+=260){x.moveTo(sx,wy);x.quadraticCurveTo(sx+130,wy+16,sx+260,wy)}}x.stroke();
 /* Boden und Gleise */
 x.fillStyle='#2a1c1a';x.fillRect(0,GY,W,H-GY);x.fillStyle='rgba(255,110,80,.12)';x.fillRect(0,GY,W,2);
 for(i=0;i<30;i++){q=md(i*47+R(i)*20-o*.65,LOOP);if(q<W){x.fillStyle='rgba(0,0,0,.25)';x.beginPath();x.ellipse(q,GY+10+R(i+9)*70,3+R(i+2)*3,1.4,0,0,6.3);x.fill()}}
 x.fillStyle='#3a2a22';x.fillRect(0,FY-10,W,30);
 for(i=0;i<22;i++){q=md(i*38-o,836)-30;if(q>-30&&q<W+30){x.fillStyle='#5a4030';x.beginPath();x.moveTo(q-4,FY-8);x.lineTo(q+10,FY-8);x.lineTo(q+16,FY+16);x.lineTo(q+2,FY+16);x.closePath();x.fill()}}
 x.strokeStyle='#8a8e96';x.lineWidth=2.4;x.beginPath();x.moveTo(0,FY-3);x.lineTo(W,FY-3);x.moveTo(0,FY+11);x.lineTo(W,FY+11);x.stroke();
 x.strokeStyle='rgba(255,140,110,.35)';x.lineWidth=1;x.beginPath();x.moveTo(0,FY-4.5);x.lineTo(W,FY-4.5);x.moveTo(0,FY+9.5);x.lineTo(W,FY+9.5);x.stroke();
 /* Rotes Licht am Rand */
 zBlit(zSprite('vigT',W,H,0,0,function(){var vg=x.createRadialGradient(W/2,H*.5,120,W/2,H*.5,W*.62);vg.addColorStop(0,'rgba(80,10,10,0)');vg.addColorStop(1,'rgba(30,0,0,.5)');x.fillStyle=vg;x.fillRect(0,0,W,H)}),0,0)}
/* ----- Szene 4: Schmiedeschlucht mit Stadtfest, Riesenrad und Zielbogen ----- */
function riesenrad(cx,ts){
 var t=ts/1000,cy=GY-122,R0=70,i,a0=t*.22;
 x.strokeStyle='#5a4658';x.lineWidth=4;x.beginPath();x.moveTo(cx-34,GY+4);x.lineTo(cx,cy);x.lineTo(cx+34,GY+4);x.stroke();x.lineWidth=2;x.beginPath();x.moveTo(cx-22,GY-26);x.lineTo(cx+22,GY-26);x.stroke();
 x.strokeStyle='#e8d8b8';x.lineWidth=3;x.beginPath();x.arc(cx,cy,R0,0,6.3);x.stroke();x.lineWidth=1.6;x.beginPath();x.arc(cx,cy,R0-14,0,6.3);x.stroke();
 for(i=0;i<12;i++){var an=a0+i*Math.PI/6,cs=Math.cos(an),sn=Math.sin(an);
  x.strokeStyle='rgba(232,216,184,.75)';x.lineWidth=1.2;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+cs*R0,cy+sn*R0);x.stroke();
  var gx=cx+cs*R0,gy=cy+sn*R0,gc=['#e24b3a','#f2c94c','#3a8c3f','#2f6fd6','#c06ad8','#f08a2a'][i%6];
  x.strokeStyle='#8a7a6a';x.lineWidth=1;x.beginPath();x.moveTo(gx,gy);x.lineTo(gx,gy+6);x.stroke();
  x.fillStyle=gc;x.beginPath();x.roundRect(gx-5,gy+6,10,9,2);x.fill();x.fillStyle='rgba(255,255,255,.55)';x.fillRect(gx-3,gy+8,6,3);
  var bl=.5+.5*Math.sin(t*4+i);x.fillStyle='rgba(255,230,140,'+(.5+.5*bl)+')';x.beginPath();x.arc(cx+cs*(R0+4),cy+sn*(R0+4),1.8,0,6.3);x.fill()}
 x.fillStyle='#8a7a6a';x.beginPath();x.arc(cx,cy,5,0,6.3);x.fill()}
function schmiedeHaus(q,ts){
 var t=ts/1000,by=GY+6,i;
 x.fillStyle='#3a2c32';x.fillRect(q-58,by-72,116,72);zPl('#2a2028',[q-68,by-72,q,by-112,q+68,by-72]);
 x.fillStyle='#2a2028';x.fillRect(q+30,by-132,14,60);
 var gl=.7+.25*Math.sin(t*9),fg=glowS(q-10,by-34,60,'255,150,55',.6*gl);
 x.fillStyle='#ffb04a';x.fillRect(q-30,by-48,40,28);x.fillStyle='#ffe08a';x.fillRect(q-24,by-42,28,16);x.strokeStyle='#2a2028';x.lineWidth=3;x.strokeRect(q-30,by-48,40,28);
 x.fillStyle='#2a2028';x.fillRect(q+16,by-30,34,12);x.fillRect(q+22,by-36,22,8);
 for(i=0;i<6;i++){var s=((t*.9+i/6)%1);x.fillStyle='rgba(255,'+(150+i*12)+',60,'+(1-s)+')';x.beginPath();x.arc(q+37+Math.sin(t*3+i*2)*8*s,by-132-s*50,1.8,0,6.3);x.fill()}}
function festZelt(q){
 var by=GY+4;x.fillStyle='#e8d6b0';x.fillRect(q-42,by-34,84,34);x.fillStyle='#6b4a2a';x.fillRect(q-6,by-24,12,24);
 zPl('#c0392b',[q-50,by-34,q,by-64,q+50,by-34]);[-1,0,1].forEach(function(i){zPl('#f4ead0',[q+i*18-6,by-34,q+i*18+6,by-34,q+i*4,by-62])})}
function wimpel(q0,q1,y0){x.strokeStyle='#4a3a3a';x.lineWidth=1.2;x.beginPath();x.moveTo(q0,y0);x.quadraticCurveTo((q0+q1)/2,y0+16,q1,y0);x.stroke();
 var cs=['#e24b3a','#f2c94c','#3a8c3f','#2f6fd6'];for(var i=0;i<=8;i++){var u=i/8,px=q0+(q1-q0)*u,py=y0+16*2*u*(1-u)*.5*2;x.fillStyle=cs[i%4];x.beginPath();x.moveTo(px-3,py);x.lineTo(px+3,py);x.lineTo(px,py+8);x.closePath();x.fill()}}
function zielStatic(){
 var i;
 /* Steinsockel und Pfosten */
 [-78,66].forEach(function(px){zRc('#7d7a72',px-4,-10,20,10);zRc('#6a675f',px-4,-10,20,3);zRc('#6b4a2a',px,-132,12,124);zRc('#8a6238',px,-132,4,124);zEl('#d9b34a',px+6,-136,8,8)});
 /* Wimpelkette unter dem Brett */
 var wc=['#e24b3a','#f2c94c','#3a8c3f','#2f6fd6','#c06ad8'];x.strokeStyle='#4a3a3a';x.lineWidth=1.2;x.beginPath();x.moveTo(-66,-92);x.quadraticCurveTo(0,-76,72,-92);x.stroke();
 for(i=0;i<=8;i++){var u=i/8,px2=-66+138*u,py2=-92+16*2*u*(1-u);x.fillStyle=wc[i%5];x.beginPath();x.moveTo(px2-5,py2);x.lineTo(px2+5,py2);x.lineTo(px2,py2+11);x.closePath();x.fill()}
 /* Brett mit goldenem Rand */
 x.fillStyle='rgba(0,0,0,.2)';x.beginPath();x.roundRect(-84,-125,170,48,8);x.fill();
 x.fillStyle='#d9b34a';x.beginPath();x.roundRect(-86,-128,172,48,8);x.fill();
 x.fillStyle='#4a2e18';x.beginPath();x.roundRect(-81,-123,162,38,6);x.fill();
 x.fillStyle='#5f3d20';x.beginPath();x.roundRect(-81,-123,162,16,6);x.fill();
 /* Zielflaggen links und rechts im Brett */
 [[-74,1],[56,1]].forEach(function(fl){for(var r=0;r<3;r++)for(var c=0;c<3;c++){x.fillStyle=(r+c)%2?'#2a2028':'#f4ead0';x.fillRect(fl[0]+c*6,-117+r*6,6,6)}x.strokeStyle='#d9b34a';x.lineWidth=.8;x.strokeRect(fl[0],-117,18,18)});
 /* ZIEL in goldenen Buchstaben */
 x.font='bold 30px Georgia,serif';x.textAlign='center';x.textBaseline='alphabetic';
 x.fillStyle='#1c1008';x.fillText('ZIEL',2,-95);x.fillStyle='#f6d878';x.fillText('ZIEL',0,-97);x.fillStyle='rgba(255,255,255,.5)';x.fillRect(-26,-119,52,1.4);
 x.textAlign='left'}
function drawSchmiede(ts){
 var P=S['Schmiede'],o=D,t=ts/1000,i;
 aSky(P);
 glowS(470,104,110,'255,205,125',.8);
 x.fillStyle='#ffe3a0';x.beginPath();x.arc(470,104,24,0,6.3);x.fill();
 cloud(md(150-o*.05,W+200)-100,60,1.1,.55);cloud(md(450-o*.035,W+200)-100,92,.8,.5);
 hills(o*.05,170,22,2,0,8,5,1.3,'#7a5a6a','rgba(255,200,170,.25)');
 /* Kirmes läuft als Schleife mit, sehr langsam, damit sie bis zum Ziel zu sehen bleibt */
 var rq=md(330-o*.07,900)-110;if(rq>-110&&rq<W+110)riesenrad(rq,ts);
 for(i=0;i<3;i++){var zq=md(i*330+60-o*.1,990)-120;if(zq>-70&&zq<W+70)festZelt(zq);if(zq>-420&&zq<W+70)wimpel(zq+48,zq+282,GY-52)}
 hills(o*.1,216,14,3,2,6,7,.4,'#4a3846','rgba(255,200,170,.18)');
 var sq=aLm(3,1100,.6);if(sq>-130&&sq<W+130)schmiedeHaus(sq,ts);
 layer(P,o*.5,GY,96,80,false,6);
 /* Felswände der Schlucht */
 x.fillStyle='#2a2030';x.beginPath();x.moveTo(-10,0);x.lineTo(92,0);x.lineTo(68,38);x.lineTo(98,84);x.lineTo(62,132);x.lineTo(86,190);x.lineTo(50,260);x.lineTo(-10,260);x.closePath();x.fill();
 x.beginPath();x.moveTo(W+10,0);x.lineTo(W-88,0);x.lineTo(W-62,40);x.lineTo(W-96,90);x.lineTo(W-58,140);x.lineTo(W-84,196);x.lineTo(W-50,260);x.lineTo(W+10,260);x.closePath();x.fill();
 x.strokeStyle='rgba(255,200,160,.18)';x.lineWidth=1.4;x.beginPath();x.moveTo(92,0);x.lineTo(68,38);x.lineTo(98,84);x.lineTo(62,132);x.lineTo(86,190);x.moveTo(W-88,0);x.lineTo(W-62,40);x.lineTo(W-96,90);x.lineTo(W-58,140);x.lineTo(W-84,196);x.stroke();
 aGround(P);
 for(i=0;i<7;i++){var s2=((t*.35+i/7)%1);x.fillStyle='rgba(255,'+(140+i*14)+',70,'+(.8*(1-s2))+')';x.beginPath();x.arc(md(i*110+40-o*.5,W+80)-40,GY-6-s2*120,1.6,0,6.3);x.fill()}
 bonusSign(zSignX('beh',3*STAGE+700),'Behlingshammer');
 aPath(P);deco(P,D*1.12,FY+22,FY+34,22,1.25);
 var gq=TOTAL+260-g.run;if(gq>-90&&gq<W+90){ASG.push(gq);zBlit(zSprite('zielB',190,170,95,150,zielStatic),gq,FY+8)}}
/* ----- Hindernisse (Springen: Biber, Fass, Lore, Kiste, Schwellen, Ratte, Schlacke, Kohlenlore; Ducken: Kranhaken, Dampf, Uhu, Signal, Efeu, Drähte, Hammer, Funken) ----- */
function aHang(px,len,fn,amp,sp,ph){x.save();x.translate(px,-8);x.rotate(Math.sin(NOW/1000*sp+ph)*amp);fn(len);x.restore()}
function areaObst(t,px,o){
 var tt=NOW/1000,ph=o?o.bx:px,i,Lb=FY-68;
 if(t==='biber'){var bob=Math.sin(tt*10+ph)*.9,sl=Math.sin(tt*3.2+ph)*.16;shadow(px,30);x.save();x.translate(px,FY+1);x.scale(-1,1);
  /* Schwanzkelle mit Schuppenmuster */
  x.save();x.translate(-17,-8);x.rotate(sl-.1);x.fillStyle='#4a2f1c';x.strokeStyle='#2a170c';x.lineWidth=1.1;x.beginPath();x.moveTo(0,-2);x.bezierCurveTo(-8,-9,-24,-10,-28,-3);x.bezierCurveTo(-24,5,-8,6,0,2);x.closePath();x.fill();x.stroke();
  x.save();x.clip();x.strokeStyle='rgba(0,0,0,.45)';x.lineWidth=.8;x.beginPath();for(var i=-30;i<2;i+=4){x.moveTo(i,-10);x.lineTo(i+8,6);x.moveTo(i+8,-10);x.lineTo(i,6)}x.stroke();x.fillStyle='rgba(255,255,255,.1)';x.fillRect(-28,-8,30,3);x.restore();x.restore();
  /* Körper mit Fell */
  var bg=x.createLinearGradient(0,-26,0,-2);bg.addColorStop(0,'#6b4226');bg.addColorStop(.6,'#8a5a34');bg.addColorStop(1,'#a8764a');
  x.fillStyle=bg;x.strokeStyle='#3a2210';x.lineWidth=1.2;x.beginPath();x.ellipse(0,-14,19,12,0,0,6.3);x.fill();x.stroke();
  x.fillStyle='#c9a26a';x.beginPath();x.ellipse(5,-8,12,5.6,0,0,6.3);x.fill();
  x.strokeStyle='rgba(45,25,10,.55)';x.lineWidth=.9;x.beginPath();[[-12,-20],[-6,-24],[0,-25],[-14,-14],[-9,-17],[-3,-19],[4,-23]].forEach(function(f){x.moveTo(f[0],f[1]);x.lineTo(f[0]+3,f[1]+3.4)});x.stroke();
  x.strokeStyle='rgba(255,230,190,.35)';x.beginPath();x.moveTo(-10,-23);x.quadraticCurveTo(0,-28,10,-23);x.stroke();
  /* Keule und Hinterfuß mit Schwimmhaut */
  x.fillStyle='#7a4a28';x.strokeStyle='#3a2210';x.beginPath();x.ellipse(-8,-10,10,8,.2,0,6.3);x.fill();x.stroke();
  x.fillStyle='#4f301a';x.beginPath();x.ellipse(-3,-2,11,3.4,0,0,6.3);x.fill();x.fillStyle='#6b4226';x.beginPath();x.moveTo(3,-2);x.lineTo(9,-1);x.lineTo(3,0);x.fill();
  x.strokeStyle='#2a170c';x.lineWidth=.8;x.beginPath();x.moveTo(-5,-4);x.lineTo(-4,0);x.moveTo(-1,-4);x.lineTo(0,0);x.moveTo(3,-3);x.lineTo(4,0);x.stroke();
  /* Stock in den Pfoten, angenagt */
  x.fillStyle='#3a2210';[[13,-6],[19,-7.5]].forEach(function(pw){x.beginPath();x.ellipse(pw[0],pw[1],3.6,2.6,-.2,0,6.3);x.fill();x.strokeStyle='#1a0e06';x.lineWidth=.6;x.beginPath();x.moveTo(pw[0]+2,pw[1]-1);x.lineTo(pw[0]+4,pw[1]-1.4);x.moveTo(pw[0]+2,pw[1]+1);x.lineTo(pw[0]+4,pw[1]+1.2);x.stroke()});
  /* Kopf */
  x.save();x.translate(0,bob);
  x.fillStyle='#7a4a28';x.strokeStyle='#3a2210';x.lineWidth=1.2;x.beginPath();x.arc(17,-23,10,0,6.3);x.fill();x.stroke();
  x.fillStyle='#a8764a';x.beginPath();x.ellipse(22,-20,7,5.4,.2,0,6.3);x.fill();
  x.fillStyle='rgba(255,230,190,.25)';x.beginPath();x.ellipse(15,-29,5,2.4,-.3,0,6.3);x.fill();
  x.fillStyle='#6b4226';x.beginPath();x.arc(11,-30,3.6,0,6.3);x.fill();x.stroke();x.fillStyle='#c98a7a';x.beginPath();x.arc(11,-30,1.9,0,6.3);x.fill();
  x.fillStyle='#fff';x.beginPath();x.arc(22,-26,2.6,0,6.3);x.fill();x.fillStyle='#1a1a1a';x.beginPath();x.arc(22.6,-26,1.6,0,6.3);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(23.1,-26.7,.6,0,6.3);x.fill();
  x.strokeStyle='#3a2210';x.lineWidth=1;x.beginPath();x.moveTo(19.4,-29.4);x.lineTo(25,-28.2);x.stroke();
  x.fillStyle='#b88a5a';x.beginPath();x.ellipse(26,-19.2,5.8,4.6,.15,0,6.3);x.fill();x.fillStyle='#2a170c';x.beginPath();x.ellipse(28.4,-21.6,3.4,2.6,.2,0,6.3);x.fill();x.fillStyle='rgba(255,255,255,.4)';x.beginPath();x.ellipse(27.8,-22.6,1,.65,0,0,6.3);x.fill();
  x.strokeStyle='#2a170c';x.lineWidth=.9;x.beginPath();x.moveTo(27,-19);x.quadraticCurveTo(23,-16.5,19,-18);x.stroke();
  x.fillStyle='#f4c25a';x.strokeStyle='#8a5a14';x.lineWidth=.7;x.fillRect(25.4,-17.4,2.3,4.6);x.strokeRect(25.4,-17.4,2.3,4.6);x.fillRect(27.7,-17.4,2.3,4.6);x.strokeRect(27.7,-17.4,2.3,4.6);
  x.strokeStyle='rgba(240,230,205,.9)';x.lineWidth=.6;x.beginPath();x.moveTo(28.5,-21);x.quadraticCurveTo(34,-24,38,-25);x.moveTo(28.5,-20.4);x.quadraticCurveTo(35,-20.5,39,-20.5);x.moveTo(28.5,-19.8);x.quadraticCurveTo(34,-17.5,38,-16);x.stroke();
  x.restore();
  x.restore();return}
 if(t==='fass'){var rot=o?-APP.fass*Math.max(0,g.run-(o.bx-W-60))/17:-g.run*.05;shadow(px,18);x.fillStyle='rgba(180,160,130,.22)';for(i=0;i<3;i++){x.beginPath();x.ellipse(px+22+i*8,FY-3-i*3,4+i*2,2.6+i,0,0,6.3);x.fill()}
  x.save();x.translate(px,FY-17);x.fillStyle='#9a6a34';x.beginPath();x.arc(0,0,17,0,6.3);x.fill();
  x.save();x.rotate(rot);x.strokeStyle='#5a3a18';x.lineWidth=1.2;x.beginPath();for(i=0;i<4;i++){var a=i*Math.PI/4;x.moveTo(Math.cos(a)*-13,Math.sin(a)*-13);x.lineTo(Math.cos(a)*13,Math.sin(a)*13)}x.stroke();x.fillStyle='#6a4a22';x.beginPath();x.arc(0,0,3,0,6.3);x.fill();x.restore();
  x.strokeStyle='#3a2a18';x.lineWidth=3;x.beginPath();x.arc(0,0,16,0,6.3);x.stroke();x.lineWidth=1.4;x.beginPath();x.arc(0,0,10.5,0,6.3);x.stroke();
  x.strokeStyle='rgba(255,255,255,.22)';x.lineWidth=1.4;x.beginPath();x.arc(0,0,13,3.6,4.6);x.stroke();x.restore();return}
 if(t==='kranhaken'){x.fillStyle='#5f6672';x.fillRect(px-30,-4,60,7);
  aHang(px,Lb,function(L){x.strokeStyle='#6b5a3a';x.lineWidth=3;x.beginPath();x.moveTo(0,0);x.lineTo(0,L-24);x.stroke();x.fillStyle='#4a4f58';x.fillRect(-7,L-28,14,12);x.fillStyle='#f2c94c';x.fillRect(-7,L-24,14,3);
   x.strokeStyle='#3a3f48';x.lineWidth=5;x.lineCap='round';x.beginPath();x.moveTo(0,L-16);x.lineTo(0,L-8);x.arc(-8,L-8,8,0,Math.PI*1.1);x.stroke();x.fillStyle='#3a3f48';x.beginPath();x.moveTo(-17,L-4);x.lineTo(-13,L-12);x.lineTo(-20,L-10);x.closePath();x.fill()},.1,1.6,ph);return}
 if(t==='dampf'){x.fillStyle='#4a4f58';x.fillRect(px-4,-4,30,6);zRc('#6b7280',px+6,0,7,FY-70);zRc('#5f6672',px-10,FY-76,26,9);zRc('#4a4f58',px-14,FY-78,8,13);
  x.strokeStyle='#b2321f';x.lineWidth=2;x.beginPath();x.arc(px+10,FY-130,6,0,6.3);x.moveTo(px+4,FY-130);x.lineTo(px+16,FY-130);x.moveTo(px+10,FY-136);x.lineTo(px+10,FY-124);x.stroke();
  for(i=0;i<7;i++){var u=((tt*1.5+i/7+ph*.01)%1),r=4+u*12;x.fillStyle='rgba(245,248,250,'+(.85*(1-u))+')';x.beginPath();x.arc(px-16-u*34,FY-72-u*8+Math.sin(tt*5+i)*2,r,0,6.3);x.fill()}return}
 if(t==='lore'||t==='kohle'){var kl=t==='kohle',sc=kl?.85:1;shadow(px,26*sc);x.strokeStyle='#4a3a2a';x.lineWidth=3;x.beginPath();x.moveTo(px-30,FY+2);x.lineTo(px+30,FY+2);x.stroke();
  x.save();x.translate(px,FY);x.scale(sc,sc);poly([-22,-30,22,-30,17,-8,-17,-8],kl?'#2a2a30':'#8f5a3a');zRc(kl?'#3a3a42':'#6b3a20',-25,-33,50,5);
  if(kl){x.fillStyle='#1a1a1e';for(i=0;i<6;i++){x.beginPath();x.arc(-16+i*7,-34-(i%2)*3,5.5,0,6.3);x.fill()}x.fillStyle='rgba(255,255,255,.5)';for(i=0;i<3;i++){x.fillRect(-12+i*14,-37-(i%2)*3,2,2)}}
  else{x.fillStyle='#b26a3a';[[-12,-22,5],[8,-18,4],[0,-26,3]].forEach(function(d){x.beginPath();x.ellipse(d[0],d[1],d[2],d[2]*.6,0,0,6.3);x.fill()});x.fillStyle='#4a2a14';[-16,-4,8,18].forEach(function(d){x.beginPath();x.arc(d,-30,1.2,0,6.3);x.fill()})}
  [-12,12].forEach(function(d){zEl('#22222a',d,-5,5.5,5.5);zEl('#8a8f98',d,-5,2.2,2.2)});zRc('#3a3a42',-26,-13,8,3);zRc('#3a3a42',18,-13,8,3);x.restore();return}
 if(t==='kiste'){shadow(px,20);x.fillStyle='#c0392b';x.beginPath();x.roundRect(px-18,FY-22,36,22,3);x.fill();x.strokeStyle='#6b1a10';x.lineWidth=1.4;x.stroke();
  x.fillStyle='#a02a1e';x.fillRect(px-18,FY-22,36,6);x.fillStyle='#d6a53a';x.fillRect(px-3,FY-18,6,6);x.strokeStyle='#4a4f58';x.lineWidth=2.4;x.beginPath();x.arc(px,FY-24,7,Math.PI,0);x.stroke();
  x.strokeStyle='#7a5a38';x.lineWidth=3;x.beginPath();x.moveTo(px+8,FY-20);x.lineTo(px+20,FY-32);x.stroke();x.fillStyle='#5f6672';x.fillRect(px+16,FY-39,10,6);return}
 if(t==='uhu'){var uy=FY-(92+6*Math.sin(NOW/380+ph/55)),fw=Math.sin(NOW/130+ph/7);
  x.fillStyle='rgba(0,0,0,.12)';x.beginPath();x.ellipse(px,FY+2,18,3.4,0,0,6.3);x.fill();x.save();x.translate(px,uy);x.scale(1.05,1.05);
  [-1,1].forEach(function(sd){x.save();x.scale(sd,1);x.fillStyle='#a98458';x.strokeStyle='#5a3a18';x.lineWidth=1.2;x.beginPath();x.moveTo(8,-4);x.quadraticCurveTo(26,-18-fw*12,44,-8-fw*16);x.quadraticCurveTo(38,-2-fw*8,34,2-fw*5);x.quadraticCurveTo(28,2,24,6);x.quadraticCurveTo(18,4,10,8);x.closePath();x.fill();x.stroke();
   x.strokeStyle='#7a5430';x.beginPath();x.moveTo(14,0);x.lineTo(34,-6-fw*10);x.moveTo(14,4);x.lineTo(30,0-fw*6);x.stroke();x.restore()});
  x.fillStyle='#9a6e3e';x.strokeStyle='#5a3a18';x.beginPath();x.ellipse(0,3,11,15,0,0,6.3);x.fill();x.stroke();
  x.strokeStyle='#6b4a22';x.lineWidth=1;x.beginPath();x.moveTo(-6,2);x.quadraticCurveTo(-3,5,0,2);x.moveTo(0,2);x.quadraticCurveTo(3,5,6,2);x.moveTo(-5,9);x.quadraticCurveTo(-2,12,1,9);x.moveTo(1,9);x.quadraticCurveTo(4,12,7,9);x.stroke();
  x.fillStyle='#7a5430';x.beginPath();x.moveTo(-10,-11);x.lineTo(-14,-22);x.lineTo(-5,-14);x.moveTo(10,-11);x.lineTo(14,-22);x.lineTo(5,-14);x.fill();
  x.fillStyle='#b88a52';x.beginPath();x.ellipse(0,-8,11,9,0,0,6.3);x.fill();
  [-5.5,5.5].forEach(function(d){x.fillStyle='#f2b84a';x.strokeStyle='#5a3a18';x.beginPath();x.arc(d,-9,5.2,0,6.3);x.fill();x.stroke();x.fillStyle='#1a1a1a';x.beginPath();x.arc(d,-9,2.4,0,6.3);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(d-.8,-10,.8,0,6.3);x.fill()});
  x.fillStyle='#e0a030';x.beginPath();x.moveTo(-2.6,-4);x.lineTo(0,1);x.lineTo(2.6,-4);x.closePath();x.fill();x.restore();return}
 if(t==='signal'){aHang(px,Lb,function(L){x.fillStyle='#4a4f58';x.fillRect(-2,0,4,L-34);x.fillStyle='#22222a';x.beginPath();x.roundRect(-10,L-34,20,34,3);x.fill();x.fillStyle='#3a3a42';x.fillRect(-12,L-36,24,4);
   var pu=.6+.4*Math.sin(NOW/260+ph);x.fillStyle='rgba(226,75,58,'+(.25*pu)+')';x.beginPath();x.arc(0,L-16,17,0,6.3);x.fill();x.fillStyle='#e24b3a';x.beginPath();x.arc(0,L-16,6.5,0,6.3);x.fill();x.fillStyle='#ffd0c0';x.beginPath();x.arc(-2,L-18,2,0,6.3);x.fill();x.fillStyle='#2a2a32';x.beginPath();x.arc(0,L-26,3,0,6.3);x.arc(0,L-6,3,0,6.3);x.fill()},.08,1.3,ph);return}
 if(t==='schwellen'){shadow(px,30);[[0,-8,52],[2,-17,46],[-1,-26,40]].forEach(function(d,j){x.fillStyle=j%2?'#6b4a2a':'#7a5a38';x.fillRect(px+d[0]-d[2]/2,FY+d[1]-1,d[2],9);x.strokeStyle='#3a2a18';x.lineWidth=1;x.strokeRect(px+d[0]-d[2]/2,FY+d[1]-1,d[2],9);x.strokeStyle='rgba(30,20,10,.5)';x.beginPath();x.moveTo(px+d[0]-d[2]/2+6,FY+d[1]+3);x.lineTo(px+d[0]+d[2]/2-6,FY+d[1]+3);x.stroke()});
  x.fillStyle='#4a4f58';x.fillRect(px-18,FY-27,3,3);x.fillRect(px+14,FY-27,3,3);return}
 if(t==='ratte'){var lg=Math.sin(NOW/70+ph),lg2=Math.sin(NOW/70+ph+Math.PI),rb=Math.abs(Math.sin(NOW/70+ph))*1.1;shadow(px,28);
  x.fillStyle='rgba(190,175,150,.28)';for(i=0;i<3;i++){var du=((NOW/260+i/3)%1);x.beginPath();x.ellipse(px+34+du*18,FY-3-du*4,2.6+du*3,1.6+du*2,0,0,6.3);x.fill()}
  x.save();x.translate(px,FY+1-rb);x.scale(-1.4,1.4);
  /* Schwanz: lang, nackt, geringelt */
  var tp=[[-17,-8],[-26,-6+lg*3],[-36,-12+lg*5],[-46,-9-lg*5],[-54,-15+lg*4]];
  x.strokeStyle='#c49a9a';x.lineWidth=2.4;x.lineCap='round';x.beginPath();x.moveTo(tp[0][0],tp[0][1]);x.bezierCurveTo(tp[1][0],tp[1][1],tp[2][0],tp[2][1],tp[3][0],tp[3][1]);x.quadraticCurveTo(tp[3][0]-4,tp[3][1]-3+lg*2,tp[4][0],tp[4][1]);x.stroke();
  x.strokeStyle='rgba(120,80,84,.7)';x.lineWidth=.8;for(i=1;i<14;i++){var u2=i/14,qx=-17+(tp[3][0]+17)*u2,qy=-8+(-1-lg*3)*u2+Math.sin(u2*6.3)*(5*lg+3)*.5;x.beginPath();x.moveTo(qx-.6,qy-1.4);x.lineTo(qx+.6,qy+1.4);x.stroke()}
  /* hintere Läufe (rosa Pfoten mit Krallen) */
  var hf=[[-9,lg],[-2,lg2]];
  hf.forEach(function(h,j){var fx=h[0]+h[1]*5,fy=-1-Math.max(0,h[1])*2.6;x.strokeStyle='#3a4048';x.lineWidth=3;x.beginPath();x.moveTo(h[0]+1,-8);x.lineTo(fx,fy-1);x.stroke();x.fillStyle='#d89aa4';x.beginPath();x.ellipse(fx+1.6,fy,4,1.9,0,0,6.3);x.fill();x.strokeStyle='#8a5a60';x.lineWidth=.6;x.beginPath();x.moveTo(fx+4,fy-.6);x.lineTo(fx+6,fy-.2);x.moveTo(fx+4,fy+.4);x.lineTo(fx+6,fy+1);x.stroke()});
  /* Körper */
  var rg=x.createLinearGradient(0,-19,0,-1);rg.addColorStop(0,'#3a4048');rg.addColorStop(.55,'#505862');rg.addColorStop(1,'#6f7780');
  x.fillStyle=rg;x.strokeStyle='#1c2026';x.lineWidth=1.1;x.beginPath();x.moveTo(-18,-8);x.bezierCurveTo(-16,-18,0,-20,10,-16);x.bezierCurveTo(16,-13,16,-5,10,-3);x.bezierCurveTo(0,-1,-16,-2,-18,-8);x.closePath();x.fill();x.stroke();
  x.fillStyle='#6f7780';x.beginPath();x.ellipse(4,-4,10,2.6,0,0,6.3);x.fill();
  x.strokeStyle='rgba(20,24,30,.55)';x.lineWidth=.8;x.beginPath();[[-12,-14],[-6,-16],[0,-17],[6,-16],[-14,-9],[-8,-11],[-2,-12],[4,-12]].forEach(function(f){x.moveTo(f[0],f[1]);x.lineTo(f[0]+3.4,f[1]+2.6)});x.stroke();
  x.strokeStyle='rgba(210,220,235,.3)';x.beginPath();x.moveTo(-14,-15);x.quadraticCurveTo(-2,-20,10,-16);x.stroke();
  /* vordere Läufe */
  [[10,lg2],[14,lg]].forEach(function(h,j){var fx=h[0]+h[1]*4,fy=-1-Math.max(0,h[1])*2.4;x.strokeStyle=j?'#3a4048':'#2c3138';x.lineWidth=2.4;x.beginPath();x.moveTo(h[0]-1,-6);x.lineTo(fx,fy-1);x.stroke();x.fillStyle='#d89aa4';x.beginPath();x.ellipse(fx+1.2,fy,2.8,1.6,0,0,6.3);x.fill();x.strokeStyle='#8a5a60';x.lineWidth=.6;x.beginPath();x.moveTo(fx+3,fy-.5);x.lineTo(fx+4.6,fy-.2);x.moveTo(fx+3,fy+.5);x.lineTo(fx+4.6,fy+.9);x.stroke()});
  /* Kopf mit spitzer Schnauze */
  x.fillStyle='#4a525c';x.strokeStyle='#1c2026';x.lineWidth=1.1;x.beginPath();x.moveTo(8,-17);x.bezierCurveTo(14,-21,22,-17,31,-9);x.bezierCurveTo(24,-5,14,-4,9,-7);x.closePath();x.fill();x.stroke();
  x.fillStyle='#5f6872';x.beginPath();x.moveTo(12,-16);x.bezierCurveTo(18,-18,24,-14,29,-10);x.bezierCurveTo(22,-10,16,-10,12,-12);x.fill();
  x.fillStyle='#5a525c';x.strokeStyle='#1c2026';x.beginPath();x.arc(12,-20,5.4,0,6.3);x.fill();x.stroke();x.fillStyle='#d89aa4';x.beginPath();x.arc(12.4,-19.6,3.2,0,6.3);x.fill();x.strokeStyle='#a46a74';x.lineWidth=.6;x.beginPath();x.moveTo(11,-22);x.quadraticCurveTo(13,-19.6,11,-17.6);x.stroke();
  x.fillStyle='#e8909a';x.beginPath();x.arc(31,-9,2.6,0,6.3);x.fill();x.fillStyle='rgba(255,255,255,.55)';x.beginPath();x.arc(30.4,-10,.8,0,6.3);x.fill();
  x.fillStyle='#fff';x.beginPath();x.arc(20.5,-13.5,2,0,6.3);x.fill();x.fillStyle='#0a0a0a';x.beginPath();x.arc(21,-13.5,1.3,0,6.3);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(21.4,-14.1,.5,0,6.3);x.fill();
  x.strokeStyle='#1c2026';x.lineWidth=.9;x.beginPath();x.moveTo(18,-16.4);x.lineTo(23,-15.4);x.stroke();
  x.fillStyle='#f4f0e0';x.strokeStyle='#8a8574';x.lineWidth=.5;x.fillRect(28.4,-7.2,1.7,3.2);x.strokeRect(28.4,-7.2,1.7,3.2);x.fillRect(30.1,-7.2,1.7,3.2);x.strokeRect(30.1,-7.2,1.7,3.2);
  x.strokeStyle='#d8d8d8';x.lineWidth=.6;x.beginPath();x.moveTo(30,-10);x.lineTo(38,-14+lg*.6);x.moveTo(30,-9.4);x.lineTo(39,-10);x.moveTo(30,-8.8);x.lineTo(38,-6-lg*.6);x.moveTo(29,-10.6);x.lineTo(36,-17);x.stroke();
  x.restore();return}
 if(t==='efeu'){x.fillStyle='#3a2a22';x.fillRect(px-26,-4,52,6);
  [-14,0,13].forEach(function(d,j){var sw=Math.sin(NOW/900+j*1.7+ph)*4,ln=FY-66+(j===1?4:-4);x.strokeStyle='#2f6a3a';x.lineWidth=2.6;x.beginPath();x.moveTo(px+d,0);x.quadraticCurveTo(px+d+sw,ln*.5,px+d+sw*1.3,ln);x.stroke();
   x.fillStyle=j%2?'#4f9a48':'#3f8a3a';for(i=0;i<6;i++){var u=i/5,lx=px+d+sw*1.3*u*u+(i%2?4:-4),ly=8+u*(ln-14);x.beginPath();x.ellipse(lx,ly,4.6,2.6,i%2?.6:-.6,0,6.3);x.fill()}});return}
 if(t==='draht'){x.fillStyle='#4a4f58';x.fillRect(px-28,-4,56,6);
  [-16,-5,6,17].forEach(function(d,j){var sw=Math.sin(NOW/800+j*1.3+ph)*3,ln=FY-68-(j%2)*6;x.strokeStyle='#111';x.lineWidth=2.2;x.beginPath();x.moveTo(px+d,2);x.bezierCurveTo(px+d+sw,ln*.4,px+d-sw,ln*.7,px+d+sw*.6,ln);x.stroke();x.fillStyle=j%2?'#d6a53a':'#c0392b';x.fillRect(px+d+sw*.6-2,ln,4,7)});
  x.fillStyle='#d8d4c4';[-20,-8,4,16].forEach(function(d){x.beginPath();x.arc(px+d+4,2,2.4,0,6.3);x.fill()});return}
 if(t==='schlacke'){var pu=.6+.4*Math.sin(NOW/320+ph);shadow(px,30);var hg=x.createRadialGradient(px,FY-8,2,px,FY-8,40);hg.addColorStop(0,'rgba(255,110,40,'+(.3*pu)+')');hg.addColorStop(1,'rgba(255,110,40,0)');x.fillStyle=hg;x.beginPath();x.arc(px,FY-8,40,0,6.3);x.fill();
  x.fillStyle='#2a2428';x.beginPath();x.moveTo(px-28,FY);x.quadraticCurveTo(px-26,FY-18,px-10,FY-26);x.quadraticCurveTo(px+4,FY-34,px+14,FY-24);x.quadraticCurveTo(px+28,FY-14,px+28,FY);x.closePath();x.fill();
  x.fillStyle='#3a3238';x.beginPath();x.moveTo(px-18,FY-12);x.quadraticCurveTo(px-6,FY-28,px+6,FY-24);x.quadraticCurveTo(px-2,FY-16,px-18,FY-12);x.fill();
  x.strokeStyle='rgba(255,'+Math.round(110+60*pu)+',40,.95)';x.lineWidth=1.8;x.beginPath();x.moveTo(px-16,FY-4);x.lineTo(px-8,FY-14);x.lineTo(px-12,FY-22);x.moveTo(px+6,FY-6);x.lineTo(px+12,FY-16);x.lineTo(px+8,FY-24);x.moveTo(px+18,FY-3);x.lineTo(px+22,FY-10);x.stroke();
  x.fillStyle='rgba(255,170,60,.9)';for(i=0;i<3;i++){var s=((tt*.8+i/3)%1);x.beginPath();x.arc(px-8+i*9+Math.sin(tt*4+i)*3,FY-26-s*30,1.4,0,6.3);x.fill()}return}
 if(t==='hammer'){aHang(px,Lb,function(L){x.fillStyle='#7a5430';x.fillRect(-3,0,6,L-26);x.fillStyle='#8a6238';x.fillRect(-3,0,2,L-26);
   x.fillStyle='#4a4f58';x.beginPath();x.roundRect(-17,L-28,34,22,3);x.fill();x.fillStyle='#6a707a';x.fillRect(-17,L-28,34,5);x.fillStyle='#2a2e36';x.fillRect(-17,L-10,34,4);x.fillStyle='rgba(255,255,255,.25)';x.fillRect(-14,L-24,3,14)},.12,1.9,ph);return}
 if(t==='funken'){var by=FY-100;var fg=x.createRadialGradient(px,by,2,px,by,38);fg.addColorStop(0,'rgba(255,150,50,.35)');fg.addColorStop(1,'rgba(255,150,50,0)');x.fillStyle=fg;x.beginPath();x.arc(px,by,38,0,6.3);x.fill();
  x.fillStyle='rgba(0,0,0,.12)';x.beginPath();x.ellipse(px,FY+2,30,4,0,0,6.3);x.fill();
  for(i=0;i<14;i++){var fx=px+Math.sin(tt*5+i*1.7+ph)*26,fy=by+Math.cos(tt*6+i*2.3)*15,fl=.5+.5*Math.sin(tt*14+i*3);x.fillStyle='rgba(255,'+(170+(i%3)*30)+',70,'+(.55+.45*fl)+')';x.beginPath();x.arc(fx,fy,1.6+(i%3)*.8,0,6.3);x.fill();x.fillStyle='rgba(255,220,140,'+(.3*fl)+')';x.beginPath();x.arc(fx+3,fy-2,1,0,6.3);x.fill()}return}}
/* ----- Funde ----- */
function drawItem4(k,X){
 var cy=FY-10,i;
 if(k==='zahnrad'){x.strokeStyle='#6b7280';x.lineWidth=5;x.setLineDash([4,3]);x.beginPath();x.arc(X,cy,11,0,6.3);x.stroke();x.setLineDash([]);x.fillStyle='#9aa1ad';x.beginPath();x.arc(X,cy,9,0,6.3);x.fill();x.strokeStyle='#5f6672';x.lineWidth=1;x.stroke();x.fillStyle='#cfd5d8';x.beginPath();x.arc(X,cy,3,0,6.3);x.fill()}
 else if(k==='schluessel'){x.save();x.translate(X,cy);x.rotate(-.6);x.fillStyle='#d6a53a';x.strokeStyle='#8a6a14';x.lineWidth=1;x.fillRect(-13,-2,26,4);x.strokeRect(-13,-2,26,4);x.strokeStyle='#d6a53a';x.lineWidth=3.2;x.beginPath();x.arc(-14,0,5,.5,5.8);x.stroke();x.beginPath();x.arc(14,0,5,3.6,8.9);x.stroke();x.restore()}
 else if(k==='ticket'){x.save();x.translate(X,cy);x.rotate(-.14);x.fillStyle='#f1e2b4';x.strokeStyle='#8a6a14';x.lineWidth=1;x.fillRect(-14,-9,28,18);x.strokeRect(-14,-9,28,18);x.strokeStyle='#8a6a14';x.beginPath();x.moveTo(-10,-3);x.lineTo(10,-3);x.moveTo(-10,3);x.lineTo(2,3);x.stroke();x.fillStyle='#7a5a38';x.beginPath();x.arc(10,4,1.6,0,6.3);x.fill();x.restore()}
 else if(k==='nagel'){x.save();x.translate(X,cy);x.rotate(.7);x.fillStyle='#6b7280';x.fillRect(-1.6,-10,3.2,20);x.fillStyle='#8a8f98';x.fillRect(-5,-11,10,3);x.fillStyle='#b26a3a';x.fillRect(-1.6,2,3.2,2);x.restore()}
 else if(k==='quarz'){x.fillStyle='#c9a8f2';x.strokeStyle='#7a52c2';x.lineWidth=1.2;[[-6,0,16,7],[0,0,22,9],[6,0,13,6]].forEach(function(c){x.beginPath();x.moveTo(X+c[0]-c[3]/2,FY);x.lineTo(X+c[0]-c[3]/2,FY-c[2]*.65);x.lineTo(X+c[0],FY-c[2]);x.lineTo(X+c[0]+c[3]/2,FY-c[2]*.65);x.lineTo(X+c[0]+c[3]/2,FY);x.closePath();x.fill();x.stroke()});x.fillStyle='rgba(255,255,255,.6)';x.fillRect(X-1,FY-17,2,9)}
 else if(k==='pfeife'){x.fillStyle='#d6a53a';x.strokeStyle='#8a6a14';x.lineWidth=1;x.beginPath();x.roundRect(X-9,cy-4,16,8,3);x.fill();x.stroke();x.fillRect(X+5,cy-2,8,4);x.strokeStyle='#8a6a14';x.beginPath();x.arc(X-11,cy,3.2,0,6.3);x.stroke();x.fillStyle='#2a1a1c';x.beginPath();x.ellipse(X-2,cy-4,2.6,1.2,0,0,6.3);x.fill()}
 else if(k==='hufeisen'){x.strokeStyle='#6b7280';x.lineWidth=4;x.lineCap='round';x.beginPath();x.moveTo(X-8,FY-17);x.lineTo(X-8,cy);x.arc(X,cy,8,Math.PI,0,true);x.lineTo(X+8,FY-17);x.stroke();x.fillStyle='#cfd5d8';[[-8,-14],[8,-14],[-8,-5],[8,-5]].forEach(function(d){x.fillRect(X+d[0]-1,FY+d[1]-1,2,2)})}
 else if(k==='muenze'){x.fillStyle='#c8ccd4';x.strokeStyle='#7a808a';x.lineWidth=1.2;x.beginPath();x.arc(X,cy,8,0,6.3);x.fill();x.stroke();x.beginPath();x.arc(X,cy,5.4,0,6.3);x.stroke();x.fillStyle='#7a808a';x.font='bold 8px system-ui,sans-serif';x.textAlign='center';x.fillText('€',X,cy+3);x.textAlign='left'}
 else if(k==='lampe'){x.fillStyle='#f2c230';x.beginPath();x.ellipse(X,FY-5,12,9,0,Math.PI,0);x.fill();x.fillStyle='#d9a81f';x.fillRect(X-14,FY-6,28,4);x.fillStyle='#2a2a30';x.fillRect(X-4,FY-17,8,7);x.fillStyle='#ffe08a';x.beginPath();x.arc(X,FY-13.5,3,0,6.3);x.fill();x.fillStyle='rgba(255,224,138,.3)';x.beginPath();x.arc(X,FY-13.5,8,0,6.3);x.fill()}
 else if(k==='goldhammer'){x.save();x.translate(X,cy);x.rotate(-.5);x.fillStyle='#8a5a34';x.fillRect(-2,-3,4,20);x.fillStyle='#f0c038';x.strokeStyle='#a87a1a';x.lineWidth=1;x.beginPath();x.roundRect(-10,-10,20,10,2);x.fill();x.stroke();x.fillStyle='#fff3b0';x.fillRect(-8,-9,4,3);x.restore()}}
/* ---------- Gebiet B: Talsperre und Steinbruch (g.bonus===5, vier Szenen: Ufer, Staumauer, Sandstein, Hardenstein) ---------- */
var GBSEA=['Ufer','Staumauer','Sandstein','Hardenstein'],GBNAME=['Das Ufer der Talsperre','Die große Staumauer','Der Ruhrsandstein','Die verwunschene Burgruine'],
GBLINE=[
 'Gebiet B, Szene 1: Das Ufer der Talsperre. Windräder drehen, ein Segelflieger kreist. Der Wegweiser hält die Füße lieber trocken.',
 'Gebiet B, Szene 2: Die große Staumauer. Dahinter wohnt im Zoo ein Elefant namens Tuffi, der schon einmal berühmter war als der Wegweiser.',
 'Gebiet B, Szene 3: Der Ruhrsandstein. Die Wand ist alt, die Universität ist jung, beide sind gut besucht.',
 'Gebiet B, Szene 4: Die verwunschene Burgruine. Unten legt die Fähre ab, oben wartet das Gespenst.'],
GBWINS=['Gebiet B geschafft. Der Wegweiser hat die Fähre schon von der Staumauer aus gesehen.','Am Ziel unter der Ruine. Die Fähre legt ab, Mo bleibt lieber am Ufer.'];
S['Ufer']={sky:['#78b6e0','#a4d0ec','#cce8f2','#eaf4ee'],sun:'#fff6c8',mt:'#9ec0b0',hill:['#83b48b','#5f9a6c'],tree:['#3f7a45','#2a5a35'],pine:true,gr:'#6a9a4a',path:'#cdb88a',fg:'#2a5a35',trunk:'#3b2a1c',leaf:'#2a5a35',snow:false,night:false,k:'summer'};
S['Staumauer']={sky:['#86c0e6','#b0d8ee','#d4eaf0','#eef6ee'],sun:'#fff4c0',mt:'#a4bcb0',hill:['#86b48a','#68a070'],tree:['#437c47','#2e5e38'],pine:false,gr:'#62904a',path:'#c4b896',fg:'#2e5e38',trunk:'#3b2a1c',leaf:'#2e5e38',snow:false,night:false,k:'summer'};
S['Sandstein']={sky:['#a2c8e0','#c8dde2','#e8dcc2','#f4e4c4'],sun:'#fff0c0',mt:'#b2b49a',hill:['#a89c78','#867a5c'],tree:['#4a7a42','#32602e'],pine:false,gr:'#6a8a48',path:'#c9b38a',fg:'#32602e',trunk:'#3b2a1c',leaf:'#32602e',snow:false,night:false,k:'summer'};
S['Hardenstein']={sky:['#5e5288','#b06a86','#ea966a','#f8c68a'],sun:'#ffd9a0',mt:'#6a5a78',hill:['#5a5670','#434a5c'],tree:['#2f4a40','#223a34'],pine:false,gr:'#475c46',path:'#8a7a62',fg:'#223a34',trunk:'#2a2a30',leaf:'#223a34',snow:false,night:false,k:'summer'};
var GBBOTH={fontaene:1};
var GOB={frosch:1,frischling:1,waschbaer:1,salamander:1,natter:1,reiher:1,libelle:1,kormoran:1,haeher:1,falke:1,kalk:1,mauerstein:1,fontaene:1};
var GBPOOL=[['frosch','frischling','frosch','reiher','libelle','frischling'],['kiste','waschbaer','kiste','kormoran','fontaene','waschbaer'],['salamander','kalk','salamander','kalk','haeher','kalk'],['natter','mauerstein','natter','mauerstein','falke','geist']];
var GBITEMS=[['eichel','zapfen'],['stempel','kompass'],['ammonit','bergkristall','pfifferling'],['burgkey','pfifferling']],GBBONK=[['thermo'],['stulle'],[],['kelch','wappen']],GBON={thermo:1,stulle:1,kelch:1,wappen:1},GITEM={eichel:1,zapfen:1,stempel:1,kompass:1,stulle:1,ammonit:1,bergkristall:1,pfifferling:1,burgkey:1,kelch:1,wappen:1};
(function(){for(var k in GOB)BON[k]=1})();
function isAB(k){return g.bonus===4?!!ABON[k]:g.bonus===5?!!GBON[k]:false}
HW.frosch=20;HH.frosch=30;HW.frischling=24;HH.frischling=26;HW.waschbaer=24;HH.waschbaer=30;HW.salamander=24;HH.salamander=20;HW.natter=28;HH.natter=18;HW.kalk=22;HH.kalk=38;HW.mauerstein=24;HH.mauerstein=30;
HW.reiher=30;HH.reiher=30;HW.libelle=26;HH.libelle=30;HW.kormoran=30;HH.kormoran=30;HW.haeher=24;HH.haeher=30;HW.falke=28;HH.falke=30;HW.fontaene=30;HH.fontaene=50;
LUFT.reiher=1;LUFT.libelle=1;LUFT.kormoran=1;LUFT.haeher=1;LUFT.falke=1;HANG.fontaene=1;
APP.frosch=.35;OFF.frosch=153;APP.frischling=.4;OFF.frischling=169;APP.waschbaer=.4;OFF.waschbaer=169;APP.salamander=.15;OFF.salamander=77;APP.natter=.2;OFF.natter=98;APP.kalk=.3;OFF.kalk=136;
APP.reiher=.5;OFF.reiher=197;APP.libelle=.3;OFF.libelle=136;APP.kormoran=.55;OFF.kormoran=209;APP.haeher=.5;OFF.haeher=197;APP.falke=.6;OFF.falke=221;
HIT.frosch=['Der Wasserfrosch sprang genau dorthin, wo Mo hinwollte. Er quakt bis heute darüber.','Frosch getroffen. Der Wegweiser nennt das Feuchtkontakt.'];
DODGE.frosch=['Über den Frosch. Er landet im Gras und tut so, als wäre nichts gewesen.','Froschhüpfer. Ein Sprung für Mo, ein Sprung für den Frosch.'];
HIT.frischling=['Der Frischling hat es eilig und kennt keine Vorfahrtsregeln. Seine Mutter ist bestimmt in der Nähe.','Wildschwein-Frischling getroffen. Er schnaubt empört und läuft weiter.'];
DODGE.frischling=['Über den Frischling. Er flitzt unten durch und hat es nicht einmal gemerkt.','Frischling umsprungen. Gestreift, schnell und zum Glück allein unterwegs.'];
HIT.waschbaer=['Der Waschbär hat Mo in Ruhe ausgewaschen. Das war nicht geplant.','Waschbär getroffen. Er hält sich für zuständig, auch für Mo.'];
DODGE.waschbaer=['Über den Waschbär. Er sucht schon die nächste Mülltonne.','Waschbär umsprungen. Die Maske verrät nichts.'];
HIT.salamander=['Ein Feuersalamander. Nicht anfassen, nicht draufsteigen, hat Mo gerade gelernt.','Salamander getroffen. Er ist gelb und schwarz und trotzdem nicht bei der Feuerwehr.'];
DODGE.salamander=['Über den Salamander. Er kriecht langsam weiter und hat Regen im Sinn.','Salamander gesehen und gesprungen. Gut aufgepasst.'];
HIT.natter=['Eine Ringelnatter. Sie ist harmlos, aber Mo hat trotzdem geschrien.','Natter getroffen. Sie zischte nur kurz und schlängelte sich beleidigt davon.'];
DODGE.natter=['Über die Natter. Sie schlängelt weiter, ohne zu beißen, wie versprochen.','Natter umsprungen. Der gelbe Halsring blitzt noch kurz auf.'];
HIT.reiher=['Der Graureiher kam tief über das Wasser und Mo stand im Weg. Er hat es mit Würde genommen.','Reiher eins, Würde null. Er schaute dabei sehr gelassen.'];
DODGE.reiher=['Unter dem Reiher durch. Er gleitet weiter, lang und lautlos.','Geduckt. Der Reiher sucht weiter nach Fisch, nicht nach Mo.'];
HIT.libelle=['Die Riesen-Libelle schwirrte heran. Flügelschlag und Kopfnuss, so schnell ging das.','Libelle getroffen. Der Wegweiser meint, sie sei ja nicht so riesig.'];
DODGE.libelle=['Unter der Libelle durch. Sie flirrt weiter und lässt sich nicht aufhalten.','Geduckt. Die Libelle schwebt davon, grün und glitzernd.'];
HIT.kormoran=['Der Kormoran strich tief über die Mauer. Mo war im Weg und der Kormoran in Eile.','Kormoran getroffen. Er trocknet seine Flügel jetzt woanders.'];
DODGE.kormoran=['Unter dem Kormoran durch. Er fliegt weiter und sieht aus wie ein schwarzer Pfeil.','Geduckt. Der Kormoran hat Mo nicht mal eines Blickes gewürdigt.'];
HIT.haeher=['Der Eichelhäher hat Mo ausgeschimpft und erwischt. Bei Häher zählt beides.','Häher getroffen. Seine blaue Feder liegt jetzt im Weg.'];
DODGE.haeher=['Unter dem Häher durch. Er krächzt, aber Mo ist schon vorbei.','Geduckt. Der Häher versteckt wieder Eicheln und schaut nicht hin.'];
HIT.falke=['Der Turmfalke kam im Sturzflug. Mo war nicht die Maus, trotzdem tat es weh.','Falke eins, Würde null. Er rüttelt jetzt anderswo.'];
DODGE.falke=['Unter dem Falken durch. Er rüttelt in der Luft und sucht schon etwas Kleineres.','Geduckt. Der Falke hat sich am Ruinenturm verschätzt.'];
HIT.kalk=['Der Kalksteinbrocken rollte heran. Er war schwerer, als er aussah.','Kalk eins, Würde null. Er kullert weiter ins Tal.'];
DODGE.kalk=['Über den Brocken. Er rollt davon und gibt dem Steinbruch ein Geräusch.','Kalk umsprungen. Der Wegweiser nennt das Geologie in Bewegung.'];
HIT.mauerstein=['Ein Mauerstein lag mitten im Weg. Er stammt aus dem Jahr 1200 und ist immer noch hart.','Stein getroffen. Der Wegweiser meint: Burgen halten, Zehen nicht.'];
DODGE.mauerstein=['Über den Mauerstein. Er bleibt liegen und bröselt leise.','Stein umsprungen. Die Ruine verliert ihn nicht ungern.'];
HIT.fontaene=['Die Fontäne spritzte los. Mo hat jetzt feuchte Haare.','Gischt im Gesicht. Der Wegweiser nennt das Wellness an der Mauer.'];
DODGE.fontaene=['Unter der Fontäne durch. Der Hut blieb trocken.','Geduckt. Die Gischt fiel hinter Mo ins Wasser.'];
NAMEN.eichel='Goldene Eichel';NAMEN.zapfen='Tannenzapfen';NAMEN.stempel='Wanderstempel';NAMEN.kompass='Kompass';NAMEN.stulle='Kottenbutter-Stulle';NAMEN.ammonit='Ammonit';NAMEN.bergkristall='Bergkristall';NAMEN.pfifferling='Pfifferling';NAMEN.burgkey='Burgschlüssel';NAMEN.kelch='Goldkelch';NAMEN.wappen='Wappenschild';
FUNDTXT.eichel=['Eine goldene Eichel. Wer sie vergräbt, bekommt vielleicht einen Wald.','Eichel gefunden. Der Eichelhäher schaut neidisch zu.'];
FUNDTXT.zapfen=['Ein Tannenzapfen. Er riecht nach Harz und ein wenig nach Weihnachten.','Zapfen gefunden. Mo steckt ihn ein, falls die Tanne ihn vermisst.'];
FUNDTXT.thermo=['Eine Thermoskanne, noch warm. Ein Hut kehrt zurück, wenn Mo einen verloren hatte.','Thermoskanne gefunden. Heißer Tee an der Talsperre, besser geht es kaum.'];
FUNDTXT.stempel=['Ein Wanderstempel. Das Papier fehlt, der Stolz bleibt.','Stempel gefunden. Der Wegweiser verlangt sofort einen Abdruck.'];
FUNDTXT.kompass=['Ein Kompass. Er zeigt nach Norden, der Wegweiser nach überall.','Kompass gefunden. Die Nadel zittert vor Aufregung.'];
FUNDTXT.stulle=['Eine Kottenbutter-Stulle. Dick belegt, dick gestärkt. Ein Hut kehrt zurück, falls nötig.','Stulle gefunden. Der Wegweiser darf nur riechen.'];
FUNDTXT.ammonit=['Ein bemooster Ammonit. Er ist ein paar hundert Millionen Jahre älter als der Wegweiser.','Ammonit gefunden. Ein Haus für ein Tier, das längst ausgezogen ist.'];
FUNDTXT.bergkristall=['Ein Bergkristall. Er fängt das Licht und gibt es sauber zurück.','Kristall gefunden. Im Sandstein glitzert er besonders unverschämt.'];
FUNDTXT.pfifferling=['Ein Pfifferling. Gelb, fest und im Wald besonders gesucht.','Pfifferling gefunden. Mo lässt ihn lieber ganz, er gehört der Pfanne.'];
FUNDTXT.burgkey=['Ein alter Burgschlüssel. Das Schloss ist längst weg, die Tür auch.','Burgschlüssel gefunden. Er passt auf nichts, aber das mit Würde.'];
FUNDTXT.kelch=['Ein Goldkelch. Er glänzt, als hätte ihn gestern jemand poliert. Ein Hut kehrt zurück, falls nötig.','Goldkelch gefunden. Wer daraus trinkt, bekommt angeblich wieder Mut.'];
FUNDTXT.wappen=['Ein Wappenschild. Für ein paar Sekunden kann Mo nichts passieren.','Wappenschild gefunden. Ritter Mo ist unverwundbar, nur nicht lange.'];
/* ----- Tiere und Hindernisse Gebiet B: alles blickt nach links auf Mo zu ----- */
/* Flügel als Federfächer wie beim Adler: Schwingen, Armschwingen, Decken (Vogel blickt nach rechts, Flügel zeigen nach hinten) */
var GBF=[.72,.82,.92,1,1,.99,.95,.9,.84,.77,.68,.58];
function gbW(rx,ry,span,wid,c1,c2,c3,rot,a0,a1){
 var n=12,A=[],L=[],B=[],i;a0=a0==null?-122:a0;a1=a1==null?-206:a1;
 for(i=0;i<n;i++){A.push(a0+(a1-a0)*i/(n-1));L.push(span*GBF[i]);B.push(-.12+i*.02)}
 x.save();x.translate(rx,ry);x.rotate(rot);x.translate(-rx,-ry);
 feathers(rx,ry,A,L,wid,c1,B);
 feathers(rx,ry,A,L.map(function(v){return v*.62}),wid*.95,c2,B.map(function(v){return v*.8}));
 feathers(rx,ry,A.slice(3),L.slice(3).map(function(v){return v*.34}),wid*.9,c3,B.slice(3).map(function(v){return v*.6}));
 x.restore()}
function gbBirdShadow(px,w){x.fillStyle='rgba(0,0,0,.12)';x.beginPath();x.ellipse(px,FY+2,w,3.4,0,0,6.3);x.fill()}
function gbBird0(px,o,sh,hv,fq,sc,fn){
 var ph=o?o.bx:px,tt=NOW/1000,fl=Math.sin(tt*fq+ph),by=FY-(hv+3.4*Math.sin(tt*1.7+ph/55));
 gbBirdShadow(px,sh);x.save();x.translate(px,by);x.scale(-sc,sc);x.rotate(-.05+fl*.035);x.lineJoin='round';x.lineCap='round';
 fn(fl,tt);x.restore()}
function gbReiher(px,o){gbBird0(px,o,24,96,4.2,1.15,function(fl){
 gbW(6,-5,36,4.6,'#46525d','#6c7a86','#8c98a3',-fl*.5+.2,-112,-196);
 K('#9a7a2a',1.8);x.beginPath();x.moveTo(-14,3);x.lineTo(-44,9+fl*1.4);x.moveTo(-12,4);x.lineTo(-42,13+fl*1.4);x.stroke();
 K('#9a7a2a',1.1);x.beginPath();x.moveTo(-44,9+fl*1.4);x.lineTo(-48,7+fl*1.4);x.moveTo(-44,9+fl*1.4);x.lineTo(-48,11+fl*1.4);x.moveTo(-42,13+fl*1.4);x.lineTo(-46,12+fl*1.4);x.moveTo(-42,13+fl*1.4);x.lineTo(-46,16+fl*1.4);x.stroke();
 F('#7d8995');x.beginPath();x.moveTo(-18,1);x.lineTo(-31,-1);x.lineTo(-32,6);x.lineTo(-18,5);x.closePath();x.fill();
 F('#9fabb7');K('#3c4650',1.3);x.beginPath();x.moveTo(-20,2);x.bezierCurveTo(-10,-10,10,-9,17,-2);x.bezierCurveTo(12,8,-6,10,-20,2);x.closePath();x.fill();x.stroke();
 F('#e6ebef');ell(0,4.4,11,3);
 K('#3c4650',8);x.beginPath();x.moveTo(13,-3);x.bezierCurveTo(27,-4,9,-15,20,-21);x.stroke();
 K('#e8edf1',5.8);x.beginPath();x.moveTo(13,-3);x.bezierCurveTo(27,-4,9,-15,20,-21);x.stroke();
 K('#2a3038',1.2);x.beginPath();x.moveTo(17,-8);x.bezierCurveTo(20,-9,14,-14,19,-18);x.stroke();
 F('#f3f6f8');K('#3c4650',1.1);x.beginPath();x.ellipse(24,-23,6.6,4.2,.1,0,6.3);x.fill();x.stroke();
 K('#15191f',2.6);x.beginPath();x.moveTo(25,-25.4);x.quadraticCurveTo(17,-27,9,-34);x.stroke();K('#15191f',1.2);x.beginPath();x.moveTo(22,-26);x.quadraticCurveTo(15,-26,8,-30);x.stroke();
 F('#f0b43a');K('#9a6a14',1);x.beginPath();x.moveTo(29,-25);x.lineTo(54,-21.2);x.lineTo(29,-20.4);x.closePath();x.fill();x.stroke();
 F('#f6d84a');x.beginPath();x.arc(26.6,-24,2,0,6.3);x.fill();F('#0a0a0a');x.beginPath();x.arc(27,-24,1.1,0,6.3);x.fill();
 gbW(7,-6,41,5.6,'#2c343c','#8e9aa6','#c4cdd5',fl*-.5,-118,-204)})}
function gbKormoran(px,o){gbBird0(px,o,22,92,6,1.15,function(fl){
 gbW(6,-4,32,4.4,'#10161c','#232d36','#384856',-fl*.5+.2,-112,-196);
 F('#10161c');x.beginPath();x.moveTo(-18,1);x.lineTo(-33,-2);x.lineTo(-33,6);x.lineTo(-18,5);x.closePath();x.fill();
 K('#7a7a70',1.4);x.beginPath();x.moveTo(-6,5);x.lineTo(-20,10);x.moveTo(-3,5);x.lineTo(-18,12);x.stroke();
 F('#1b232b');K('#0a0e12',1.2);x.beginPath();x.moveTo(-20,2);x.bezierCurveTo(-8,-10,10,-9,17,-3);x.bezierCurveTo(12,7,-6,9,-20,2);x.closePath();x.fill();x.stroke();
 F('rgba(80,180,160,.35)');ell(-1,-3.4,10,2.2,.05);F('#f4f6f8');ell(-5,3.4,3,2);
 K('#10161c',5.6);x.beginPath();x.moveTo(14,-4);x.quadraticCurveTo(21,-6,25,-12);x.stroke();
 F('#1b232b');x.beginPath();x.ellipse(27,-13.6,5,3.5,.25,0,6.3);x.fill();F('#f1f4f6');ell(28,-10.8,2.6,1.5);
 F('#d6a838');x.beginPath();x.arc(31.2,-14,2.2,0,6.3);x.fill();
 F('#a8a490');x.beginPath();x.moveTo(30.6,-16);x.lineTo(40,-14.2);x.quadraticCurveTo(42.4,-12.6,39.4,-11.8);x.lineTo(30.6,-12.4);x.closePath();x.fill();K('#5a5a50',.8);x.stroke();
 F('#7fe8d0');x.beginPath();x.arc(27.6,-15,1.7,0,6.3);x.fill();F('#050808');x.beginPath();x.arc(27.9,-15,.9,0,6.3);x.fill();
 gbW(7,-5,38,5.2,'#141b22','#2c3844','#4d6070',fl*-.5,-118,-204)})}
function gbHaeher(px,o){gbBird0(px,o,16,94,9,1.3,function(fl){
 gbW(2,-3,25,4.4,'#6e4e3e','#8e6e58','#ac8c76',-fl*.55+.2,-108,-212);
 F('#14161c');x.beginPath();x.moveTo(-8,0);x.lineTo(-25,-2);x.lineTo(-25,6);x.lineTo(-8,5);x.closePath();x.fill();
 F('#fff');ell(-9,1,3.4,5);
 F('#cf9a82');K('#6a4a3a',1.1);x.beginPath();x.ellipse(0,1.6,10.6,6,.05,0,6.3);x.fill();x.stroke();
 F('#e8c4ae');ell(2,4.2,6.6,2.2);
 F('#d6a58c');x.beginPath();x.ellipse(11.6,-2.6,5.8,5.2,0,0,6.3);x.fill();x.stroke();
 F('#f2ede6');x.beginPath();x.moveTo(6.4,-5);x.quadraticCurveTo(10,-12.6,16,-6);x.closePath();x.fill();K('#1a1a1e',.9);x.beginPath();x.moveTo(8.4,-6);x.lineTo(8.8,-9);x.moveTo(10.6,-6.4);x.lineTo(11,-10);x.moveTo(12.8,-6.2);x.lineTo(13.4,-9);x.stroke();
 F('#14161c');x.beginPath();x.moveTo(11.4,0);x.lineTo(14.8,3.2);x.lineTo(12.2,3.2);x.closePath();x.fill();
 F('#26262c');x.beginPath();x.moveTo(16,-3.6);x.lineTo(24,-1.6);x.lineTo(16,-.2);x.closePath();x.fill();
 F('#fff');x.beginPath();x.arc(13,-3.6,1.7,0,6.3);x.fill();F('#4a6aa8');x.beginPath();x.arc(13.3,-3.6,1,0,6.3);x.fill();F('#050505');x.beginPath();x.arc(13.4,-3.6,.55,0,6.3);x.fill();
 gbW(3,-4,27,4.8,'#6a4c3c','#8a6a56','#a98a74',fl*-.55,-108,-208);
 x.save();x.translate(3,-4);x.rotate(fl*-.55);x.translate(-3,4);
 feathers(3,-4,[-150,-160,-170,-180,-190],[15,16,16,15,13],3.8,'#2a66d4',[-.1,-.1,-.08,-.06,-.04]);
 K('#0a0e30',.9);for(var j=0;j<5;j++){var an=(-150-j*10)*Math.PI/180;x.beginPath();x.moveTo(3+Math.cos(an)*6,-4+Math.sin(an)*6);x.lineTo(3+Math.cos(an)*13,-4+Math.sin(an)*13);x.stroke()}
 K('#e6f0ff',.9);for(j=0;j<5;j++){var an2=(-150-j*10)*Math.PI/180;x.beginPath();x.moveTo(3+Math.cos(an2)*9,-4+Math.sin(an2)*9);x.lineTo(3+Math.cos(an2)*10.6,-4+Math.sin(an2)*10.6);x.stroke()}
 x.restore()})}
function gbFalke(px,o){gbBird0(px,o,20,96,7,1.2,function(fl){
 gbW(3,-3,34,3.6,'#6a3418','#a8582e','#c8784a',-fl*.4+.15,-118,-200);
 F('#8e9aa6');K('#4a5560',1);x.beginPath();x.moveTo(-10,-1);x.lineTo(-38,-2.6);x.lineTo(-42,3);x.lineTo(-11,5);x.closePath();x.fill();x.stroke();
 F('#15171c');x.beginPath();x.moveTo(-30,-2.4);x.lineTo(-42,3);x.lineTo(-37,4.6);x.lineTo(-28,-.8);x.closePath();x.fill();
 F('#c8784a');K('#5a3016',1);x.beginPath();x.ellipse(0,1.4,11.6,5.2,.05,0,6.3);x.fill();x.stroke();
 F('#ecc8a0');ell(2,3.6,7.6,2);F('#14161c');[[-4,-.4],[2,-1.6],[-1,2],[5,1.4],[-8,.6]].forEach(function(d){x.beginPath();x.arc(d[0],d[1],.9,0,6.3);x.fill()});
 F('#9aa6b2');x.beginPath();x.ellipse(12,-1.6,5.2,4.5,0,0,6.3);x.fill();x.stroke();
 F('#14161c');x.beginPath();x.moveTo(11.4,0);x.lineTo(15,3.4);x.lineTo(12.2,3.4);x.closePath();x.fill();
 F('#e8c030');K('#8a5a10',.8);x.beginPath();x.moveTo(15.6,-2.8);x.quadraticCurveTo(19.4,-2.2,19.6,1.2);x.lineTo(15.6,-.4);x.closePath();x.fill();x.stroke();
 F('#fff');x.beginPath();x.arc(12.8,-2.8,1.7,0,6.3);x.fill();F('#050505');x.beginPath();x.arc(13.1,-2.8,1,0,6.3);x.fill();
 gbW(4,-4,36,3.8,'#3a1e10','#b8643a','#d88a58',fl*-.4,-116,-200)})}
function gbLibelle(px,o){
 var ph=o?o.bx:px,tt=NOW/1000,by=FY-(84+6*Math.sin(tt*1.4+ph/40)),fa=Math.sin(tt*24+ph)*.28,i;
 gbBirdShadow(px,14);x.save();x.translate(px,by);x.scale(-1.25,1.25);x.rotate(-.04+Math.sin(tt*1.4+ph/40)*.03);x.lineJoin='round';x.lineCap='round';
 var wing=function(len,lw,al,tilt){x.save();x.translate(4,-3);x.rotate(tilt);F('rgba(206,236,246,'+al+')');K('rgba(70,140,160,.9)',.8);x.beginPath();x.moveTo(0,0);x.bezierCurveTo(-2,-lw*.9,-len*.6,-lw*1.1,-len,-lw*.4);x.bezierCurveTo(-len*1.02,0,-len*.4,lw*.2,0,0);x.closePath();x.fill();x.stroke();
  K('rgba(70,140,160,.7)',.6);x.beginPath();x.moveTo(-2,-1);x.lineTo(-len*.92,-lw*.35);x.moveTo(-5,-lw*.5);x.lineTo(-len*.7,-lw*.8);x.moveTo(-5,.4);x.lineTo(-len*.6,-lw*.05);x.stroke();F('#14485a');x.fillRect(-len*.92,-lw*.5,3.4,1.6);x.restore()};
 /* ferne Flügel */
 wing(30,9,.4,-1.3-fa);wing(27,8,.4,-1.7+fa);
 /* Hinterleib */
 for(i=0;i<9;i++){var sx=-5-i*6.2,sy=Math.sin(i*.45+tt*2)*.7;F(i%2?'#1c6a80':'#2fa8b8');K('#0e4252',.7);x.beginPath();x.ellipse(sx,sy,4.4,3-i*.12,0,0,6.3);x.fill();x.stroke()}
 F('#14485a');x.beginPath();x.moveTo(-62,0);x.lineTo(-69,-2.2);x.lineTo(-69,2.2);x.closePath();x.fill();
 K('#0e4252',.9);x.beginPath();x.moveTo(4,4);x.lineTo(8,10);x.moveTo(2,4);x.lineTo(3,11);x.moveTo(0,4);x.lineTo(-3,10);x.stroke();
 F('#2a9a90');K('#0e4252',.8);x.beginPath();x.ellipse(2,0,6.6,4.8,0,0,6.3);x.fill();x.stroke();F('#e8d24a');x.fillRect(-1,-3.8,1.6,7.4);x.fillRect(3,-3.8,1.6,7.4);
 F('#34b8a4');x.beginPath();x.arc(10.6,-.6,4.4,0,6.3);x.fill();x.stroke();
 F('#e4502c');x.beginPath();x.ellipse(11.8,-2.8,4,3.6,.2,0,6.3);x.fill();K('#8a2a14',.6);x.stroke();
 F('rgba(255,255,255,.55)');x.beginPath();x.arc(10.8,-4.2,1.2,0,6.3);x.fill();F('#14102a');x.beginPath();x.arc(13,-2.4,1.4,0,6.3);x.fill();
 /* nahe Flügel */
 wing(32,10,.55,1.25+fa);wing(29,9,.55,1.0-fa);
 x.restore()}
function gbBoden(px,o,fn){var ph=o?o.bx:px;fn(ph,NOW/1000)}
/* Beinphase aus der Strecke, die das Tier am Boden zurücklegt (Fuß rutscht nicht) */
function gbGait(o,t,A){var k=APP[t]||0;return o?k*Math.max(0,g.run-(o.bx-W-60))*1.57/A:NOW/90}
function gbLeg(hx,hy,fx,fy,ph,A,lift,L1,L2,r1,r2,col,hoof,sg){
 var tx=fx+Math.sin(ph)*A,ty=fy-Math.max(0,Math.cos(ph))*lift,kn=ik([hx,hy],[tx,ty],L1,L2,sg);
 F(col);cap(hx,hy,kn[0],kn[1],r1,r2);cap(kn[0],kn[1],tx,ty,r2,r2*.8);F(hoof);ell(tx+1.4,ty+.2,r2*.95+.8,r2*.6)}
function gbFrosch(px,o){
 var ph=o?o.bx:px,tt=NOW/1000,cyc=(((tt*.8+ph*.0137)%1)+1)%1,jp=cyc>.62?(cyc-.62)/.38:0,air=jp>0?Math.sin(jp*Math.PI)*21:0,
  ex=jp>0?Math.pow(Math.sin(jp*Math.PI),.5):0,pre=cyc>.5&&cyc<=.62?(cyc-.5)/.12:0,br=Math.sin(tt*5+ph),tilt=jp>0?-.5+jp*.95:pre*.06;
 x.fillStyle='rgba(0,0,0,.2)';x.beginPath();x.ellipse(px,FY+2,16-air*.25,3.6,0,0,6.3);x.fill();
 x.save();x.translate(px,FY+1-air);x.scale(-1,1);x.translate(0,-11);x.rotate(tilt);x.translate(0,11);x.lineCap='round';x.lineJoin='round';
 var G1='#6fae48',G2='#4a8030',G3='#2e5a22',BL='#e6eebc',cr=pre*1.8;
 /* Hinterbein: Oberschenkel, Schienbein, Fuß mit Schwimmhaut */
 var hp=[-7,-9-cr*.4],ft=[-17+(-14*ex),-1-5*ex+cr*0],kn=ik(hp,ft,12,13,1);
 F(G2);cap(hp[0],hp[1],kn[0],kn[1],6.4,3.6);F(G1);cap(kn[0],kn[1],ft[0],ft[1],3.4,2);
 F(G2);x.beginPath();x.moveTo(ft[0],ft[1]);x.lineTo(ft[0]-8,ft[1]+1.4);x.lineTo(ft[0]-5,ft[1]-1.4);x.lineTo(ft[0]-8,ft[1]-4.4);x.lineTo(ft[0]-1,ft[1]-2.4);x.closePath();x.fill();K(G3,.8);x.stroke();
 /* Körper */
 var bg=x.createLinearGradient(0,-24,0,-2);bg.addColorStop(0,'#78b850');bg.addColorStop(1,'#b4d46e');
 F(bg);K(G3,1.3);x.beginPath();x.ellipse(0,-11+cr*.4,15.5,9.6-cr*.8,0,0,6.3);x.fill();x.stroke();
 F(BL);x.beginPath();x.ellipse(5,-5,10,3.6,0,0,6.3);x.fill();
 K('#dce878',2.4);x.beginPath();x.moveTo(-10,-19.4);x.quadraticCurveTo(1,-23.4,13,-18.6);x.stroke();
 F(G2);[[-7,-16],[-1,-19],[5,-14],[-3,-12],[-10,-11]].forEach(function(d){x.beginPath();x.ellipse(d[0],d[1],2.4,1.7,.2,0,6.3);x.fill()});
 F('rgba(255,255,255,.22)');x.beginPath();x.ellipse(-3,-18,9,2,-.1,0,6.3);x.fill();
 /* Kopf */
 F('#7cba54');K(G3,1.2);x.beginPath();x.moveTo(8,-17);x.bezierCurveTo(14,-23,26,-20,27,-13);x.bezierCurveTo(27,-8,20,-6,12,-8);x.bezierCurveTo(7,-10,6,-14,8,-17);x.closePath();x.fill();x.stroke();
 F(BL);var sk=1+.35*br;x.beginPath();x.ellipse(19,-7.4,5*sk,2.2*sk,0,0,6.3);x.fill();
 K(G3,1);x.beginPath();x.moveTo(15,-10.6);x.quadraticCurveTo(22,-8.4,27.4,-11);x.stroke();
 /* Auge: auf dem Kopf, goldene Iris, waagerechte Pupille */
 F('#7cba54');K(G3,1);x.beginPath();x.arc(16,-20.6,5,0,6.3);x.fill();x.stroke();
 F('#f2c230');x.beginPath();x.arc(16.4,-21,3.5,0,6.3);x.fill();F('#050505');x.beginPath();x.ellipse(16.8,-21,2.2,.9,0,0,6.3);x.fill();F('rgba(255,255,255,.75)');x.beginPath();x.arc(15.2,-22.6,.9,0,6.3);x.fill();
 F('#050505');x.fillRect(25,-15.6,1.1,1.1);
 /* Vorderbein */
 var fp=[9,-6],ff=[12+ex*5,-1-ex*8],fk=ik(fp,ff,6,6,-1);
 F(G2);cap(fp[0],fp[1],fk[0],fk[1],3,2);F(G1);cap(fk[0],fk[1],ff[0],ff[1],2,1.6);F(G2);ell(ff[0]+2,ff[1]+.4,3.2,1.4);
 F('#b88a58');K('#4a3010',.8);x.beginPath();x.arc(1,-20,2.6,0,6.3);x.fill();x.stroke();
 x.restore()}
function gbFrischling(px,o){
 var tt=NOW/1000,A=3.6,ph=gbGait(o,'frischling',A),i,bob=Math.abs(Math.sin(ph))*.9;shadow(px,28);
 x.save();x.translate(px,FY+1-bob);x.scale(-1,1);x.lineCap='round';x.lineJoin='round';
 var B1='#6e4a2c',B2='#4a3020',BL='#d8bd84',BD='#2a1a10';
 /* Schwanz mit Quaste */
 var tw=Math.sin(tt*9+(o?o.bx:0))*1.6;K(B2,2);x.beginPath();x.moveTo(-19,-17);x.quadraticCurveTo(-25,-19+tw*.4,-24,-25);x.quadraticCurveTo(-23,-29,-27+tw,-27);x.stroke();
 /* ferne Läufe */
 gbLeg(-11,-9,-11,-1,ph+3.14,A,3,5,5.5,3.2,2.4,'#3e2a1a',BD,1);gbLeg(11,-9,12,-1,ph,A,3,5,5.5,3.2,2.4,'#3e2a1a',BD,-1);
 /* Körper: dunkelbraun mit hellen Längsstreifen */
 F(B1);x.beginPath();x.moveTo(-20,-12);x.bezierCurveTo(-19,-26,0,-28,13,-23);x.bezierCurveTo(22,-19,23,-8,14,-5);x.bezierCurveTo(4,-2,-19,-3,-20,-12);x.closePath();x.fill();
 x.save();x.clip();F(B2);x.fillRect(-22,-30,46,9);F('#ead2a0');ell(-2,-2,18,5);
 K(BL,2.2);x.beginPath();x.moveTo(-20,-19);x.bezierCurveTo(-8,-24,6,-24,22,-17);x.moveTo(-20,-14);x.bezierCurveTo(-6,-19,8,-19,24,-12);x.moveTo(-19,-9);x.bezierCurveTo(-4,-13.4,10,-13.4,23,-8);x.stroke();
 K('rgba(40,24,12,.45)',1);x.beginPath();x.moveTo(-20,-16.6);x.bezierCurveTo(-8,-21.6,6,-21.6,22,-14.6);x.moveTo(-20,-11.6);x.bezierCurveTo(-6,-16.6,8,-16.6,24,-9.6);x.stroke();
 F('rgba(255,255,255,.14)');ell(-4,-24,13,2.4,-.04);x.restore();
 /* Borsten auf dem Rücken */
 F(B2);for(i=0;i<9;i++){var bx=-15+i*3.6,by=-25.4+Math.abs(i-4)*.7;x.beginPath();x.moveTo(bx-1.5,by+1.4);x.lineTo(bx+(i%2?.5:-.5),by-4.2-(i%3)*.8);x.lineTo(bx+1.5,by+1.4);x.closePath();x.fill()}
 /* nahe Läufe */
 gbLeg(-6,-9,-7,-1,ph,A,3,5,5.5,3.8,2.7,B1,BD,1);gbLeg(15,-9,16,-1,ph+3.14,A,3,5,5.5,3.8,2.7,B1,BD,-1);
 /* Kopf: Nacken, Backe, Ohr, Rüsselscheibe, Hauer */
 F(B1);K('#3a2616',1);x.beginPath();x.moveTo(11,-23);x.bezierCurveTo(14,-27,26,-25,29,-19);x.bezierCurveTo(31,-13,25,-8,17,-8);x.bezierCurveTo(12,-9,9,-17,11,-23);x.closePath();x.fill();x.stroke();
 F('#8a6238');x.beginPath();x.moveTo(16,-24);x.bezierCurveTo(21,-26,26,-23,28,-19);x.bezierCurveTo(24,-19,20,-20,16,-19);x.closePath();x.fill();
 F(BL);x.beginPath();x.moveTo(15,-12);x.bezierCurveTo(19,-9,25,-8.4,29,-10);x.lineTo(27,-6);x.bezierCurveTo(21,-4,16,-6,15,-12);x.closePath();x.fill();
 F(B2);x.beginPath();x.moveTo(14,-23);x.lineTo(13,-33);x.lineTo(23,-25);x.closePath();x.fill();F('#c8928a');x.beginPath();x.moveTo(15.6,-24);x.lineTo(15,-30);x.lineTo(21,-25);x.closePath();x.fill();
 F('#d29c90');K('#8a5a50',.8);x.beginPath();x.ellipse(31,-13,5.4,4.4,.12,0,6.3);x.fill();x.stroke();F('#e8b4a8');x.beginPath();x.ellipse(31.2,-15,3.8,1.4,.1,0,6.3);x.fill();F('#3a2420');ell(33,-13.6,1.1,1.3);ell(33,-11.2,1.1,1.3);
 F('#efe6cc');x.beginPath();x.moveTo(27,-9);x.lineTo(25.4,-5);x.lineTo(29,-8.2);x.closePath();x.fill();
 K('#2a1a10',2.2);x.beginPath();x.moveTo(18,-20);x.quadraticCurveTo(21,-21.6,24,-19.6);x.stroke();
 F('#fff');ell(22,-16.8,2.6,2.4);F('#0a0a0a');ell(22.8,-16.6,1.6,1.6);F('#fff');ell(23.3,-17.3,.55,.55);
 x.restore()}
function gbWaschbaer(px,o){
 var ph=o?o.bx:px,tt=NOW/1000,pw=gbGait(o,'waschbaer',3),sw=Math.sin(pw),cw=Math.cos(pw),i;shadow(px,28);
 x.save();x.translate(px,FY+1-Math.abs(sw)*1.2);x.scale(-1,1);
 var G1='#8e8e98',G2='#6c6c76',G3='#aeaeb6',DK='#25252c';
 /* Schwanz mit Ringen */
 var ts2=Math.sin(tt*3+ph)*.1;x.save();x.translate(-18,-17);x.rotate(-.42+ts2);
 F(G3);x.beginPath();x.moveTo(0,-5);x.bezierCurveTo(-10,-10,-24,-9,-31,-3);x.bezierCurveTo(-34,1,-30,6,-24,6);x.bezierCurveTo(-12,7,-4,5,0,5);x.closePath();x.fill();
 x.save();x.clip();F(DK);for(i=0;i<5;i++)x.fillRect(-32+i*7,-12,3.6,24);F('rgba(255,255,255,.25)');x.fillRect(-32,-9,34,3);x.restore();x.restore();
 /* ferne Läufe */
 [[-10,sw],[10,-sw]].forEach(function(l){var lx=l[0]+l[1]*3,ly=Math.max(0,l[1]>0?cw:-cw)*2.4;F('#4a4a54');cap(l[0],-10,lx,-3-ly,3.8,2.8);F('#16161a');ell(lx+.8,-1.6-ly,3.2,1.8)});
 /* Körper */
 F(G1);x.beginPath();x.moveTo(-20,-14);x.bezierCurveTo(-19,-28,6,-29,14,-22);x.bezierCurveTo(20,-17,17,-8,8,-6);x.bezierCurveTo(-4,-4,-19,-6,-20,-14);x.closePath();x.fill();
 x.save();x.clip();F(G2);x.fillRect(-22,-29,46,8);F(G3);x.beginPath();x.ellipse(0,-6,17,5,0,0,6.3);x.fill();F('rgba(30,30,36,.35)');ell(-15,-12,6,8);
 x.strokeStyle='rgba(40,40,48,.5)';x.lineWidth=.9;x.beginPath();for(i=0;i<26;i++){var fx=-18+(i%13)*3.1,fy=-26+Math.floor(i/13)*8+(i%3);x.moveTo(fx,fy);x.lineTo(fx+2,fy+3.2)}x.stroke();
 x.strokeStyle='rgba(255,255,255,.28)';x.beginPath();for(i=0;i<9;i++){x.moveTo(-14+i*3.2,-26);x.lineTo(-12+i*3.2,-28.4)}x.stroke();x.restore();
 /* nahe Läufe mit Fingern */
 [[-4,-sw],[14,sw]].forEach(function(l){var lx=l[0]+l[1]*3,ly=Math.max(0,l[1]>0?cw:-cw)*2.4;F(G1);cap(l[0],-10,lx,-3-ly,4.2,3);F(DK);ell(lx+.8,-1.6-ly,3.6,2);x.strokeStyle='#d8d8de';x.lineWidth=.7;x.beginPath();for(i=0;i<3;i++){x.moveTo(lx+2+i*1.6,-1.6-ly);x.lineTo(lx+3.6+i*1.6,-.6-ly)}x.stroke()});
 /* Kopf: Ohren mit weißem Rand, Maske, weiße Schnauze */
 [[13,-23],[22,-24.6]].forEach(function(e){F(G2);x.beginPath();x.arc(e[0],e[1],3.8,0,6.3);x.fill();F('#f4f4f6');x.beginPath();x.arc(e[0],e[1]-.5,2.2,0,6.3);x.fill();F('#b49aa0');ell(e[0],e[1]+.2,1,1.2)});
 F('#a0a0aa');x.beginPath();x.moveTo(11,-20);x.bezierCurveTo(12,-27,27,-26,29,-19);x.bezierCurveTo(31,-12,24,-9,17,-10);x.bezierCurveTo(11,-11,10,-15,11,-20);x.closePath();x.fill();
 F('#f0f0f4');x.beginPath();x.moveTo(24,-22);x.bezierCurveTo(28,-21,30,-18,29,-14);x.lineTo(22,-13);x.closePath();x.fill();
 F(DK);x.beginPath();x.moveTo(11,-20);x.quadraticCurveTo(20,-24.6,29,-20);x.quadraticCurveTo(26,-14.4,20,-16);x.quadraticCurveTo(14,-14.4,11,-20);x.closePath();x.fill();
 F('#f0f0f4');x.beginPath();x.moveTo(26,-17);x.quadraticCurveTo(32,-14,30,-9);x.quadraticCurveTo(25,-8.4,22,-12.4);x.closePath();x.fill();x.strokeStyle=DK;x.lineWidth=.8;x.stroke();
 F('#101014');ell(30.6,-11.8,1.9,1.5);F('rgba(255,255,255,.6)');ell(30,-12.5,.6,.5);
 F('#fff');ell(20.6,-19.4,2,1.8);ell(25.4,-19.2,1.8,1.7);F('#050505');ell(21,-19.2,1.1,1.2);ell(25.8,-19,1,1.1);
 K(DK,1.2);x.beginPath();x.moveTo(18.6,-22);x.lineTo(22.4,-21);x.moveTo(23.6,-21);x.lineTo(27.4,-22);x.stroke();
 x.strokeStyle='#ececf2';x.lineWidth=.6;x.beginPath();x.moveTo(27,-12);x.lineTo(35,-14);x.moveTo(27,-11);x.lineTo(35,-10);x.moveTo(27,-12.6);x.lineTo(34,-17);x.stroke();
 x.restore()}
function gbSalamander(px,o){
 var ph=o?o.bx:px,tt=NOW/1000,i,N=18,pts=[];shadow(px,28);
 for(i=0;i<=N;i++){var u=i/N;pts.push([-30+u*58,-5-Math.sin(u*7-tt*6+ph)*2.2*(.4+u*.2)])}
 x.save();x.translate(px,FY);x.scale(-1,1);x.lineCap='round';
 [[.62,-1],[.62,1],[.16,-1],[.16,1]].forEach(function(l,j){var p=pts[Math.round(l[0]*N)],sw=Math.sin(tt*6+j*1.6+ph)*3;x.strokeStyle='#14141a';x.lineWidth=3;x.beginPath();x.moveTo(p[0],p[1]);x.lineTo(p[0]+sw+(l[0]>.5?4:-3),p[1]+(l[1]>0?7:6));x.stroke();x.beginPath();x.moveTo(p[0]+sw+(l[0]>.5?4:-3),p[1]+7);x.lineTo(p[0]+sw+(l[0]>.5?7:-6),p[1]+8);x.stroke()});
 for(i=0;i<=N;i++){var p2=pts[i],u2=i/N,r=2.2+Math.sin(u2*3.14)*3+(u2>.85?1.2:0);x.fillStyle=i%2?'#1a1a20':'#101016';x.beginPath();x.arc(p2[0],p2[1],r,0,6.3);x.fill()}
 x.strokeStyle='rgba(120,130,150,.5)';x.lineWidth=1;x.beginPath();for(i=2;i<N-2;i++){var q2=pts[i];x.lineTo(q2[0],q2[1]-3)}x.stroke();
 [[3,-1],[5,1],[8,-1],[10,1],[13,-1],[15,1],[17,0]].forEach(function(b,j){var p3=pts[b[0]];x.fillStyle=j%2?'#f2c230':'#f6d040';x.beginPath();x.ellipse(p3[0]+b[1]*.4,p3[1]-1.6,3.6-(j>4?.6:0),2.6,.1,0,6.3);x.fill()});
 var hp=pts[N];x.fillStyle='#14141a';x.beginPath();x.ellipse(hp[0]+4,hp[1],6,4.6,0,0,6.3);x.fill();x.fillStyle='#f2c230';x.beginPath();x.ellipse(hp[0]+2,hp[1]-3.2,2.6,1.6,0,0,6.3);x.fill();
 x.fillStyle='#fff';x.beginPath();x.arc(hp[0]+6,hp[1]-1.6,1.6,0,6.3);x.fill();x.fillStyle='#000';x.beginPath();x.arc(hp[0]+6.3,hp[1]-1.6,.9,0,6.3);x.fill();x.fillStyle='rgba(255,255,255,.35)';for(i=1;i<N-3;i+=2){var q3=pts[i];x.beginPath();x.ellipse(q3[0],q3[1]-2.4,2.2,1,0,0,6.3);x.fill()}x.fillStyle='#d8cdb0';for(i=2;i<N-1;i+=3){var q4=pts[i];x.beginPath();x.arc(q4[0],q4[1]+2.4,.9,0,6.3);x.fill()}[[.16,-1],[.16,1]].forEach(function(l){var p5=pts[Math.round(l[0]*N)];x.fillStyle='#14141a';x.beginPath();x.ellipse(p5[0]-1,p5[1]+7.4,2.6,1,0,0,6.3);x.fill()});
 x.restore()}
function gbNatter(px,o){
 var ph=o?o.bx:px,tt=NOW/1000,i,N=34,L=62;shadow(px,34);
 x.save();x.translate(px,FY);x.scale(-1,1);
 var pt=function(i2){var u=i2/N,hx=L*(.5-u),hy=-2-Math.sin(u*9-tt*5+ph)*(1.6+u*2.4)-(u<.12?(.12-u)*60:0);return[hx,hy,u]};
 for(i=N;i>=0;i--){var p=pt(i),r=1.5+Math.sin(Math.min(1,p[2]*1.35)*1.5)*3.2;if(p[2]>.8)r=Math.max(1.2,(1-p[2])*16+.4);
  x.fillStyle=i%6<3?'#6f8e3c':'#587432';x.beginPath();x.arc(p[0],p[1],r,0,6.3);x.fill();
  if(i%4===0&&p[2]>.1){x.fillStyle='#1e3010';x.beginPath();x.arc(p[0],p[1]-r*.35,r*.34,0,6.3);x.fill()}
  x.fillStyle='rgba(230,240,180,.28)';x.beginPath();x.arc(p[0]-.4,p[1]+r*.45,r*.5,0,6.3);x.fill()}
 var h=pt(0);x.fillStyle='#e8d85a';x.beginPath();x.ellipse(h[0]-5,h[1]-.4,2,5.6,.1,0,6.3);x.fill();x.fillStyle='#14161a';x.beginPath();x.ellipse(h[0]-8.6,h[1]-.2,1.8,5,.1,0,6.3);x.fill();
 x.fillStyle='#6f8e3c';x.strokeStyle='#2a3a14';x.lineWidth=.8;x.beginPath();x.moveTo(h[0]-4,h[1]-4);x.quadraticCurveTo(h[0]+3,h[1]-7,h[0]+11,h[1]-2);x.quadraticCurveTo(h[0]+13,h[1]+1,h[0]+8,h[1]+2.6);x.quadraticCurveTo(h[0]+1,h[1]+4.4,h[0]-4,h[1]+3);x.closePath();x.fill();x.stroke();
 x.fillStyle='#e8f0d0';x.beginPath();x.ellipse(h[0]+4,h[1]+3,6,1.8,0,0,6.3);x.fill();
 x.fillStyle='#f2c230';x.beginPath();x.arc(h[0]+5,h[1]-2,1.9,0,6.3);x.fill();x.fillStyle='#050505';x.beginPath();x.ellipse(h[0]+5.4,h[1]-2,.6,1.5,0,0,6.3);x.fill();
 var tg=Math.max(0,Math.sin(tt*3+ph));if(tg>.2){var tl=6*tg;x.strokeStyle='#d02a2a';x.lineWidth=1;x.beginPath();x.moveTo(h[0]+12,h[1]+.4);x.lineTo(h[0]+12+tl,h[1]+.4);x.lineTo(h[0]+14+tl,h[1]-1);x.moveTo(h[0]+12+tl,h[1]+.4);x.lineTo(h[0]+14+tl,h[1]+1.8);x.stroke()}var cnt=0;
 x.restore()}
function gbKalk(px,o){
 var rot=o?-APP.kalk*Math.max(0,g.run-(o.bx-W-60))/20:-g.run*.04,i;
 shadow(px,22);x.fillStyle='rgba(190,175,140,.25)';for(i=0;i<3;i++){x.beginPath();x.ellipse(px+22+i*8,FY-3-i*3,4+i*2,2.6+i,0,0,6.3);x.fill()}
 x.save();x.translate(px,FY-19);x.rotate(rot);
 x.fillStyle='#bdb8a4';x.strokeStyle='#5a564a';x.lineWidth=1.4;x.beginPath();x.moveTo(-19,-2);x.lineTo(-15,-14);x.lineTo(-6,-20);x.lineTo(7,-19);x.lineTo(17,-11);x.lineTo(20,2);x.lineTo(14,14);x.lineTo(2,19);x.lineTo(-10,16);x.lineTo(-18,9);x.closePath();x.fill();x.stroke();
 x.fillStyle='#d6d2c0';x.beginPath();x.moveTo(-15,-14);x.lineTo(-6,-20);x.lineTo(7,-19);x.lineTo(2,-9);x.lineTo(-9,-8);x.closePath();x.fill();
 x.fillStyle='#938e7a';x.beginPath();x.moveTo(20,2);x.lineTo(14,14);x.lineTo(2,19);x.lineTo(4,8);x.lineTo(12,2);x.closePath();x.fill();
 x.strokeStyle='rgba(70,66,54,.7)';x.lineWidth=1;x.beginPath();x.moveTo(-8,-3);x.lineTo(-2,2);x.lineTo(-4,10);x.moveTo(5,-8);x.lineTo(9,-1);x.moveTo(-14,4);x.lineTo(-8,6);x.stroke();
 x.fillStyle='#5f8a3a';x.beginPath();x.ellipse(-12,-8,4,2.4,.6,0,6.3);x.ellipse(8,12,3.4,2,-.4,0,6.3);x.fill();
 x.fillStyle='#e6e2d2';[[-3,-12,1.6],[3,6,1.2],[11,-5,1.4]].forEach(function(d){x.beginPath();x.arc(d[0],d[1],d[2],0,6.3);x.fill()});
 x.restore()}
function gbMauerstein(px,o){
 var tt=NOW/1000,i;shadow(px,34);
 x.fillStyle='rgba(190,175,140,.3)';for(i=0;i<3;i++){var du=((tt*.5+i/3)%1);x.beginPath();x.ellipse(px-10+i*10,FY-6-du*14,3+du*5,2+du*3,0,0,6.3);x.globalAlpha=.5*(1-du);x.fill();x.globalAlpha=1}
 var blk=function(bx,by,w,h,rot,c1,c2){x.save();x.translate(bx,by);x.rotate(rot);x.fillStyle=c1;x.strokeStyle='#4a4638';x.lineWidth=1.2;x.beginPath();x.moveTo(-w/2,-h);x.lineTo(w/2-2,-h);x.lineTo(w/2,-3);x.lineTo(w/2-4,0);x.lineTo(-w/2+3,0);x.lineTo(-w/2,-h+4);x.closePath();x.fill();x.stroke();x.fillStyle=c2;x.fillRect(-w/2+2,-h+1,w-6,4);x.strokeStyle='rgba(60,54,40,.5)';x.beginPath();x.moveTo(-w/2+5,-h*.5);x.lineTo(w/2-6,-h*.5);x.moveTo(-3,-h);x.lineTo(-3,-h*.5);x.stroke();x.restore()};
 blk(px-8,FY,36,22,-.04,'#9a9482','#b4ae9a');blk(px+14,FY-1,22,18,.14,'#8a8472','#a8a28e');blk(px+2,FY-21,24,14,-.08,'#a09a86','#bab49e');
 x.fillStyle='#5f8a3a';x.beginPath();x.ellipse(px-18,FY-21,8,3,0,0,6.3);x.fill();x.beginPath();x.ellipse(px+24,FY-17,5,2.4,.3,0,6.3);x.fill();
 x.fillStyle='#4a7a2e';x.beginPath();x.moveTo(px-14,FY-21);x.lineTo(px-12,FY-28);x.lineTo(px-10,FY-21);x.moveTo(px-18,FY-21);x.lineTo(px-20,FY-26);x.lineTo(px-15,FY-21);x.fill()}
function gbFontaene(px,o){
 var tt=NOW/1000,ph=o?o.bx:px,i,pu=.8+.2*Math.sin(tt*7+ph);shadow(px,34);
 x.fillStyle='#5a6068';x.fillRect(px-40,FY-10,30,12);x.fillStyle='#7a8088';x.fillRect(px-42,FY-14,34,5);x.fillStyle='#3a4048';x.fillRect(px-36,FY-4,6,6);
 x.fillStyle='#5a6068';x.fillRect(px+16,FY-3,26,5);
 var ap=FY-54*pu;
 x.lineCap='round';x.strokeStyle='rgba(166,208,234,.55)';x.lineWidth=11;x.beginPath();x.moveTo(px-34,FY-10);x.bezierCurveTo(px-30,ap-8,px+10,ap-10,px+34,FY-2);x.stroke();
 x.strokeStyle='rgba(222,240,250,.85)';x.lineWidth=5;x.beginPath();x.moveTo(px-34,FY-10);x.bezierCurveTo(px-30,ap-8,px+10,ap-10,px+34,FY-2);x.stroke();
 x.strokeStyle='#fff';x.lineWidth=1.6;x.beginPath();x.moveTo(px-32,FY-14);x.bezierCurveTo(px-28,ap-4,px+8,ap-6,px+30,FY-4);x.stroke();
 for(i=0;i<14;i++){var u=((tt*1.4+i/14)%1),bx0=px-34+u*68,by0=FY-10+(ap-8-(FY-10))*Math.sin(u*3.14)*.95+u*8;x.fillStyle='rgba(210,236,250,'+(.8*(1-Math.abs(u-.5)*.8))+')';x.beginPath();x.arc(bx0+Math.sin(i*5+tt*6)*3,by0-4-Math.cos(i*3)*5,1.4+(i%3)*.6,0,6.3);x.fill()}
 x.fillStyle='rgba(236,246,252,.75)';for(i=0;i<5;i++){var su=((tt*1.2+i/5)%1);x.beginPath();x.ellipse(px+30+Math.sin(i*2)*8,FY-su*14,6+su*8,3+su*3,0,0,6.3);x.globalAlpha=.7*(1-su);x.fill();x.globalAlpha=1}
 x.strokeStyle='rgba(166,208,234,.7)';x.lineWidth=1.4;x.beginPath();x.ellipse(px+30,FY+1,18,4,0,0,6.3);x.stroke()}
function gbObst(t,px,o){
 if(t==='reiher'){gbReiher(px,o);return}if(t==='kormoran'){gbKormoran(px,o);return}if(t==='haeher'){gbHaeher(px,o);return}if(t==='falke'){gbFalke(px,o);return}if(t==='libelle'){gbLibelle(px,o);return}
 if(t==='frosch'){gbFrosch(px,o);return}if(t==='frischling'){gbFrischling(px,o);return}if(t==='waschbaer'){gbWaschbaer(px,o);return}if(t==='salamander'){gbSalamander(px,o);return}if(t==='natter'){gbNatter(px,o);return}
 if(t==='kalk'){gbKalk(px,o);return}if(t==='mauerstein'){gbMauerstein(px,o);return}if(t==='fontaene')gbFontaene(px,o)}
/* ----- Funde Gebiet B ----- */
function drawItem5(k,X){
 var cy=FY-10,i;
 if(k==='eichel'){x.fillStyle='#6a4a1c';x.fillRect(X-1,cy-15,2,5);x.fillStyle='#f0c43a';x.strokeStyle='#8a6a14';x.lineWidth=1;x.beginPath();x.moveTo(X-7,cy-3);x.quadraticCurveTo(X-8,cy+9,X,cy+11);x.quadraticCurveTo(X+8,cy+9,X+7,cy-3);x.closePath();x.fill();x.stroke();x.fillStyle='#fff3b0';x.beginPath();x.ellipse(X-3,cy+1,1.6,3.6,.2,0,6.3);x.fill();
  x.fillStyle='#b88a28';x.strokeStyle='#7a5a14';x.beginPath();x.moveTo(X-9,cy-3);x.quadraticCurveTo(X-9,cy-12,X,cy-12);x.quadraticCurveTo(X+9,cy-12,X+9,cy-3);x.closePath();x.fill();x.stroke();x.strokeStyle='rgba(90,60,10,.55)';x.beginPath();for(i=-6;i<8;i+=4){x.moveTo(X+i,cy-4);x.lineTo(X+i+2,cy-9)}x.stroke()}
 else if(k==='zapfen'){x.save();x.translate(X,cy);x.rotate(-.18);x.fillStyle='#7a4a28';x.strokeStyle='#3a2210';x.lineWidth=1;x.beginPath();x.moveTo(0,-14);x.quadraticCurveTo(10,-8,9,4);x.quadraticCurveTo(6,13,0,14);x.quadraticCurveTo(-6,13,-9,4);x.quadraticCurveTo(-10,-8,0,-14);x.closePath();x.fill();x.stroke();
  x.strokeStyle='#3a2210';x.fillStyle='#a06a3c';for(var r=0;r<5;r++){for(var c=-1;c<=1;c++){var sx=c*5+(r%2?2.5:0),sy=-10+r*5;if(Math.abs(sx)<9-r*.4+(r>2?r*.6:0)){x.beginPath();x.moveTo(sx-3,sy);x.quadraticCurveTo(sx,sy+5.5,sx+3,sy);x.closePath();x.fill();x.stroke()}}}
  x.restore()}
 else if(k==='stempel'){x.fillStyle='#8a5a32';x.strokeStyle='#4a2c14';x.lineWidth=1;x.beginPath();x.arc(X,cy-9,5,0,6.3);x.fill();x.stroke();x.fillRect(X-2,cy-5,4,6);x.fillStyle='#6a727c';x.strokeStyle='#33383e';x.fillRect(X-9,cy+1,18,5);x.strokeRect(X-9,cy+1,18,5);x.fillStyle='#c0392b';x.fillRect(X-8,cy+7,16,2);x.fillStyle='rgba(192,57,43,.6)';x.fillRect(X-10,cy+10,20,1.6)}
 else if(k==='kompass'){x.fillStyle='#d8b04a';x.strokeStyle='#6a4a14';x.lineWidth=1.6;x.beginPath();x.arc(X,cy,12,0,6.3);x.fill();x.stroke();x.fillStyle='#f6efd8';x.beginPath();x.arc(X,cy,9,0,6.3);x.fill();x.stroke();
  x.fillStyle='#c0392b';x.beginPath();x.moveTo(X,cy);x.lineTo(X+3,cy-1);x.lineTo(X+1,cy-8);x.closePath();x.fill();x.fillStyle='#33383e';x.beginPath();x.moveTo(X,cy);x.lineTo(X-3,cy+1);x.lineTo(X-1,cy+8);x.closePath();x.fill();x.fillStyle='#6a4a14';x.beginPath();x.arc(X,cy,1.4,0,6.3);x.fill();x.fillRect(X-1,cy-14,2,3);x.beginPath();x.arc(X,cy-17,2.6,3.2,0,false);x.strokeStyle='#d8b04a';x.stroke()}
 else if(k==='stulle'){x.save();x.translate(X,cy+1);x.rotate(-.08);x.fillStyle='#d8a860';x.strokeStyle='#6a4a20';x.lineWidth=1;x.beginPath();x.moveTo(-13,-2);x.quadraticCurveTo(-15,-12,-7,-13);x.quadraticCurveTo(0,-17,7,-13);x.quadraticCurveTo(15,-12,13,-2);x.lineTo(12,8);x.lineTo(-12,8);x.closePath();x.fill();x.stroke();
  x.fillStyle='#f6e07a';x.beginPath();x.roundRect(-11,-8,22,9,2);x.fill();x.fillStyle='rgba(255,255,255,.5)';x.fillRect(-8,-6,6,2);x.fillStyle='#5f9a3a';x.beginPath();x.ellipse(5,-2,3.6,1.6,.3,0,6.3);x.fill();x.fillStyle='#e0405a';x.beginPath();x.arc(-4,0,1.4,0,6.3);x.arc(-8,-3,1.2,0,6.3);x.fill();x.restore()}
 else if(k==='ammonit'){x.save();x.translate(X,cy);x.fillStyle='#a8884a';x.strokeStyle='#5a4414';x.lineWidth=1;x.beginPath();x.arc(0,0,12,0,6.3);x.fill();x.stroke();x.strokeStyle='#7a5e22';x.lineWidth=1.6;x.beginPath();for(var a=0;a<12;a+=.25){var rr=1+a*.9;x.lineTo(Math.cos(a)*rr,Math.sin(a)*rr)}x.stroke();x.lineWidth=.8;x.strokeStyle='rgba(60,40,10,.5)';x.beginPath();for(a=0;a<6.3;a+=.6){x.moveTo(Math.cos(a)*4,Math.sin(a)*4);x.lineTo(Math.cos(a)*11,Math.sin(a)*11)}x.stroke();x.fillStyle='#5f8a3a';x.beginPath();x.ellipse(-7,6,4,2.2,.6,0,6.3);x.fill();x.restore()}
 else if(k==='bergkristall'){x.fillStyle='#c0dff0';x.strokeStyle='#4a8aa8';x.lineWidth=1;x.beginPath();x.moveTo(X-12,cy+9);x.lineTo(X-9,cy-3);x.lineTo(X-5,cy+9);x.closePath();x.fill();x.stroke();x.beginPath();x.moveTo(X+5,cy+9);x.lineTo(X+9,cy-1);x.lineTo(X+13,cy+9);x.closePath();x.fill();x.stroke();
  x.fillStyle='#d6ecf4';x.beginPath();x.moveTo(X-6,cy+9);x.lineTo(X-6,cy-6);x.lineTo(X,cy-14);x.lineTo(X+6,cy-6);x.lineTo(X+6,cy+9);x.closePath();x.fill();x.stroke();x.fillStyle='rgba(255,255,255,.7)';x.beginPath();x.moveTo(X-4,cy+7);x.lineTo(X-4,cy-5);x.lineTo(X-1,cy-9);x.lineTo(X-1,cy+7);x.closePath();x.fill();x.strokeStyle='#8ac0d8';x.beginPath();x.moveTo(X,cy-14);x.lineTo(X,cy+9);x.stroke()}
 else if(k==='pfifferling'){x.fillStyle='#f0c83a';x.strokeStyle='#8a6a14';x.lineWidth=1;x.beginPath();x.moveTo(X-3,cy-1);x.lineTo(X+3,cy-1);x.lineTo(X+4,cy+9);x.quadraticCurveTo(X,cy+12,X-4,cy+9);x.closePath();x.fill();x.stroke();
  x.fillStyle='#f6d04a';x.beginPath();x.moveTo(X-13,cy-1);x.quadraticCurveTo(X-12,cy-12,X,cy-13);x.quadraticCurveTo(X+12,cy-12,X+13,cy-1);x.quadraticCurveTo(X+6,cy+3,X,cy);x.quadraticCurveTo(X-6,cy+3,X-13,cy-1);x.closePath();x.fill();x.stroke();x.strokeStyle='rgba(200,150,20,.7)';x.beginPath();x.moveTo(X-8,cy);x.lineTo(X-4,cy-8);x.moveTo(X,cy);x.lineTo(X,cy-10);x.moveTo(X+8,cy);x.lineTo(X+4,cy-8);x.stroke()}
 else if(k==='burgkey'){x.save();x.translate(X,cy);x.rotate(-.5);x.strokeStyle='#5a5f68';x.lineWidth=3;x.lineCap='round';x.beginPath();x.arc(-11,0,5,0,6.3);x.stroke();x.beginPath();x.moveTo(-6,0);x.lineTo(13,0);x.stroke();x.fillStyle='#5a5f68';x.fillRect(8,0,3,7);x.fillRect(12.4,0,3,5);x.strokeStyle='rgba(255,255,255,.4)';x.lineWidth=1;x.beginPath();x.moveTo(-5,-1.2);x.lineTo(10,-1.2);x.stroke();x.restore()}
 else if(k==='kelch'){x.fillStyle='#f2c230';x.strokeStyle='#8a6a14';x.lineWidth=1.2;x.beginPath();x.moveTo(X-11,cy-12);x.lineTo(X+11,cy-12);x.quadraticCurveTo(X+11,cy+1,X,cy+3);x.quadraticCurveTo(X-11,cy+1,X-11,cy-12);x.closePath();x.fill();x.stroke();x.fillRect(X-2,cy+3,4,6);x.strokeRect(X-2,cy+3,4,6);x.beginPath();x.ellipse(X,cy+10,8,2.6,0,0,6.3);x.fill();x.stroke();
  x.fillStyle='#d62c4a';x.beginPath();x.moveTo(X,cy-9);x.lineTo(X+3,cy-6);x.lineTo(X,cy-3);x.lineTo(X-3,cy-6);x.closePath();x.fill();x.fillStyle='rgba(255,255,255,.5)';x.fillRect(X-8,cy-11,2.4,9)}
 else if(k==='wappen'){x.fillStyle='#c0392b';x.strokeStyle='#6a1a10';x.lineWidth=1.4;x.beginPath();x.moveTo(X-11,cy-12);x.lineTo(X+11,cy-12);x.lineTo(X+11,cy-1);x.quadraticCurveTo(X+10,cy+8,X,cy+12);x.quadraticCurveTo(X-10,cy+8,X-11,cy-1);x.closePath();x.fill();x.stroke();
  x.save();x.clip();x.fillStyle='#f6efd8';x.fillRect(X-1.8,cy-13,3.6,26);x.fillRect(X-12,cy-6,24,3.6);x.fillStyle='#f2c230';x.beginPath();x.moveTo(X-8,cy-9);x.lineTo(X-6,cy-12);x.lineTo(X-4,cy-9);x.moveTo(X+4,cy-9);x.lineTo(X+6,cy-12);x.lineTo(X+8,cy-9);x.fill();x.restore();x.fillStyle='rgba(255,255,255,.3)';x.fillRect(X-9,cy-10,2,12)}}
/* ----- Vordergrund Gebiet B ----- */
var GFG={schilf:1,farn:1,mauerrest:1};
function gbFgItem(k,px,by,ts){
 var tt=ts/1000,i;
 if(k==='schilf'){x.fillStyle='rgba(0,0,0,.14)';x.beginPath();x.ellipse(px,by-1,30,4,0,0,6.3);x.fill();for(i=0;i<9;i++){var fx=px-24+i*6,fh=46+(i*13)%34,sw=Math.sin(tt*1.2+i*.8)*3;x.strokeStyle=i%2?'#4a7a2e':'#5f8f3a';x.lineWidth=2;x.beginPath();x.moveTo(fx,by);x.quadraticCurveTo(fx+sw*.5,by-fh*.5,fx+sw,by-fh);x.stroke();
   if(i%3===1){x.fillStyle='#6a4426';x.beginPath();x.roundRect(fx+sw-2.4,by-fh-14,4.8,15,2.4);x.fill();x.strokeStyle='#3a2410';x.lineWidth=.8;x.beginPath();x.moveTo(fx+sw,by-fh-14);x.lineTo(fx+sw,by-fh-18);x.stroke()}}}
 else if(k==='farn'){x.fillStyle='rgba(0,0,0,.14)';x.beginPath();x.ellipse(px,by-1,28,4,0,0,6.3);x.fill();for(i=0;i<7;i++){var an=-2.7+i*.56,sw2=Math.sin(tt*1.1+i)*.05,L=34+(i%3)*7;x.save();x.translate(px,by-2);x.rotate(an+sw2+1.57);x.strokeStyle='#3a6a2a';x.lineWidth=1.6;x.beginPath();x.moveTo(0,0);x.quadraticCurveTo(L*.5,-8,L,2);x.stroke();x.fillStyle=i%2?'#4f8a3a':'#5f9a46';for(var j=1;j<9;j++){var u=j/9,lx=L*u,ly=-8*Math.sin(u*3.14)+2*u*u,wd=7*(1-u*.8);x.beginPath();x.ellipse(lx,ly-wd*.5,2.2,wd*.5,0,0,6.3);x.ellipse(lx,ly+wd*.5,2.2,wd*.5,0,0,6.3);x.fill()}x.restore()}}
 else if(k==='mauerrest'){x.fillStyle='rgba(0,0,0,.2)';x.beginPath();x.ellipse(px,by-1,44,5,0,0,6.3);x.fill();x.fillStyle='#8a8574';x.strokeStyle='#4a4638';x.lineWidth=1.2;x.beginPath();x.moveTo(px-38,by);x.lineTo(px-38,by-34);x.lineTo(px-26,by-40);x.lineTo(px-16,by-30);x.lineTo(px-4,by-44);x.lineTo(px+10,by-36);x.lineTo(px+22,by-48);x.lineTo(px+38,by-28);x.lineTo(px+38,by);x.closePath();x.fill();x.stroke();
  x.strokeStyle='rgba(60,54,40,.55)';x.beginPath();for(i=0;i<4;i++){x.moveTo(px-38,by-8-i*9);x.lineTo(px+38,by-8-i*9)}for(i=0;i<8;i++){x.moveTo(px-34+i*10+(i%2)*5,by-8-(i%2)*9);x.lineTo(px-34+i*10+(i%2)*5,by-17-(i%2)*9)}x.stroke();
  x.fillStyle='#4f8a3a';x.beginPath();x.ellipse(px-18,by-30,10,3.4,0,0,6.3);x.ellipse(px+20,by-46,8,3,0,0,6.3);x.fill();x.strokeStyle='#3a7a2e';x.lineWidth=1.4;x.beginPath();x.moveTo(px+22,by-46);x.quadraticCurveTo(px+34,by-30,px+30,by-10);x.stroke()}}
/* ----- Bäume Gebiet B: eigene Zeichnungen (Fichte, Buche, Eiche, Birke, Kiefer, Weide), einmal in Leinwände gezeichnet ----- */
var gbTC={},gbTn=0,gbHL='#ffffff';
function gbSpr(key,draw){var c=gbTC[key];if(c)return c;if(gbTn>90){gbTC={};gbTn=0}c=document.createElement('canvas');c.width=320;c.height=340;var sv=x,cx=c.getContext('2d');x=cx;x.scale(2,2);x.translate(80,160);x.lineJoin='round';x.lineCap='round';try{draw()}finally{x=sv}gbTC[key]=c;gbTn++;return c}
function gbFichte(c1,c2,v,far){
 var H=116+v*4,n=7+v%2,i,k,cD=mix(c2,'#000000',.3),cL=mix(c1,gbHL,.2),lean=(v-1)*1.4;
 F('#4a3322');x.fillRect(-3.2,-26,6.4,26);F('#6e4e32');x.fillRect(-3.2,-26,2,26);
 for(i=n-1;i>=0;i--){
  var u=i/(n-1),yt=-H+u*(H-34)-3,th=27+u*10,yb=yt+th,w=7+u*(21+R(v*9+i)*4),cx0=lean*(1-u),m=3+(i>3?1:0);
  var edge=function(dy){x.beginPath();x.moveTo(cx0,yt+dy);x.quadraticCurveTo(cx0+w*.3,yt+th*.5+dy,cx0+w,yb+dy-2);
   for(k=0;k<m;k++){var xa=cx0+w-2*w*k/m,xb=cx0+w-2*w*(k+1)/m;x.quadraticCurveTo((xa+xb)/2,yb+dy+6,xb,yb+dy-1)}
   x.quadraticCurveTo(cx0-w*.3,yt+th*.5+dy,cx0,yt+dy);x.closePath()};
  F(cD);edge(3.4);x.fill();
  F(c2);edge(0);x.fill();
  x.save();edge(0);x.clip();
  F(c1);x.beginPath();x.moveTo(cx0,yt);x.lineTo(cx0-w-3,yb+5);x.lineTo(cx0-w*.05,yb+5);x.quadraticCurveTo(cx0+w*.12,yt+th*.5,cx0,yt);x.fill();
  F('rgba(0,0,0,.14)');x.beginPath();x.moveTo(cx0,yt);x.lineTo(cx0+w+3,yb+5);x.lineTo(cx0+w*.3,yb+5);x.quadraticCurveTo(cx0+w*.2,yt+th*.5,cx0,yt);x.fill();
  F('rgba(0,0,0,.18)');x.fillRect(cx0-w-2,yb-5,2*w+4,7);
  if(!far){K(cL,1.1);x.beginPath();for(k=0;k<7;k++){var fx=cx0+(R(v*13+i*7+k)-.62)*w*1.5,fy=yt+th*.28+R(v*5+i*3+k)*th*.55;x.moveTo(fx,fy);x.lineTo(fx-2.4,fy+3.4)}x.stroke()}
  x.restore();
  if(!far){K(mix(c1,'#ffffff',.1),1.3);x.beginPath();for(k=0;k<m;k++){var xt=cx0+w-2*w*(k+.5)/m;x.moveTo(xt,yb+1);x.lineTo(xt-1.2,yb+4.2)}x.stroke()}}
 F(c2);x.beginPath();x.moveTo(lean-1.4,-H+3);x.lineTo(lean,-H-5);x.lineTo(lean+1.4,-H+3);x.closePath();x.fill()}
function gbLaub(c1,c2,v,far,wide){
 var cD=mix(c2,'#000000',.32),cL=mix(c1,gbHL,.24),cH=mix(c1,gbHL,.46),i,sx=wide?1.22:1,jt=function(k){return(R(v*11+k)-.5)*5};
 var tw=wide?7:5.4;
 F('#563a24');x.beginPath();x.moveTo(-tw-1.4,0);x.bezierCurveTo(-tw+1,-20,-tw*.6,-36,-4,-54);x.lineTo(4,-54);x.bezierCurveTo(tw*.6,-36,tw+2,-20,tw+2.6,0);x.closePath();x.fill();
 F('#7c5c3e');x.beginPath();x.moveTo(-tw-1.4,0);x.bezierCurveTo(-tw+1,-20,-tw*.6,-36,-4,-54);x.lineTo(-1.4,-54);x.bezierCurveTo(-2.4,-36,-tw*.4,-18,-tw*.5,0);x.closePath();x.fill();
 K('#563a24',3.6);x.beginPath();x.moveTo(0,-40);x.quadraticCurveTo(-14*sx,-52,-28*sx,-64);x.moveTo(1,-44);x.quadraticCurveTo(14*sx,-56,28*sx,-62);x.moveTo(0,-50);x.lineTo(2,-72);x.stroke();
 if(!far){K('rgba(40,26,14,.5)',1);x.beginPath();x.moveTo(-1,-6);x.lineTo(-.4,-24);x.moveTo(3,-12);x.lineTo(3.4,-30);x.stroke();F('#5f8a3a');x.beginPath();x.ellipse(-tw-1,-3,5,2.4,0,0,6.3);x.fill()}
 var cl=[[-32,-66,20],[32,-64,21],[0,-62,25],[-20,-86,23],[20,-88,22],[0,-103,22],[-38,-86,15],[38,-84,16],[-8,-80,20],[10,-76,19]];
 var kk=cl.map(function(c,k){return[c[0]*sx+jt(k),c[1]+jt(k+20)*.6,c[2]+jt(k+40)*.4]});
 kk.forEach(function(c){F(cD);x.beginPath();x.arc(c[0],c[1]+3,c[2]+1.4,0,6.3);x.fill()});
 kk.forEach(function(c){F(c2);x.beginPath();x.arc(c[0],c[1],c[2],0,6.3);x.fill()});
 kk.forEach(function(c,k){if(c[1]<-58){F(c1);x.beginPath();x.arc(c[0]-c[2]*.18,c[1]-c[2]*.22,c[2]*.72,0,6.3);x.fill()}});
 kk.forEach(function(c,k){if(c[1]<-70&&c[0]<14){F(cL);x.beginPath();x.arc(c[0]-c[2]*.28,c[1]-c[2]*.34,c[2]*.4,0,6.3);x.fill()}});
 if(!far){
  F(cH);for(i=0;i<16;i++){x.beginPath();x.arc(-30*sx+R(v*7+i)*50*sx,-112+R(v*5+i)*40,1.5+R(i+3)*1.2,0,6.3);x.fill()}
  F(mix(cD,c2,.4));for(i=0;i<9;i++){x.beginPath();x.arc(-34*sx+R(v*9+i)*68*sx,-58-R(v*2+i)*14,1.6+R(i+5)*1.2,0,6.3);x.fill()}
  F('rgba(0,0,0,.14)');x.beginPath();x.ellipse(0,-56,34*sx,7,0,0,6.3);x.fill()}}
function gbBirke(c1,c2,v,far){
 var cD=mix(c2,'#000000',.2),cm=mix(c1,'#d0e07a',.22),cL=mix(c1,'#e8f6a0',.45),i;
 F('#f1ece0');x.beginPath();x.moveTo(-3.6,0);x.bezierCurveTo(-3,-30,-1.6,-52,-2.4+(v-1)*1.4,-78);x.lineTo(2.2+(v-1)*1.4,-78);x.bezierCurveTo(2.2,-52,3.6,-30,4.2,0);x.closePath();x.fill();
 F('#c8c0b0');x.beginPath();x.moveTo(1.6,0);x.bezierCurveTo(1.6,-30,.6,-52,.8,-78);x.lineTo(2.2,-78);x.bezierCurveTo(2.4,-52,3.6,-30,4.2,0);x.closePath();x.fill();
 if(!far){F('#3a342c');for(i=0;i<7;i++){x.fillRect(-3.4+(i%2)*.4,-6-i*9,3+R(v+i)*2.4,1.8)}K('#d8d0be',1.4);x.beginPath();x.moveTo(0,-56);x.lineTo(-10,-74);x.moveTo(1,-64);x.lineTo(12,-82);x.moveTo(0,-72);x.lineTo(-3,-92);x.stroke()}
 var cr=[[0,-96,20,31],[-14,-80,14,22],[14,-82,14,22],[-6,-112,13,18],[9,-108,12,17],[-20,-98,10,16],[20,-98,10,16]];
 cr.forEach(function(c){F(cD);x.beginPath();x.ellipse(c[0],c[1]+3,c[2]+1,c[3]+1,0,0,6.3);x.fill()});
 cr.forEach(function(c){F(c1);x.beginPath();x.ellipse(c[0],c[1],c[2],c[3],0,0,6.3);x.fill()});
 cr.forEach(function(c,k){if(k%2===0){F(cm);x.beginPath();x.ellipse(c[0]-c[2]*.2,c[1]-c[3]*.2,c[2]*.7,c[3]*.7,0,0,6.3);x.fill()}});
 F(cL);[[-8,-108,6,9],[-14,-92,5,8],[6,-100,4.6,7]].forEach(function(c){x.beginPath();x.ellipse(c[0],c[1],c[2],c[3],0,0,6.3);x.fill()});
 if(!far){K(c1,1.8);x.beginPath();for(i=0;i<16;i++){var a2=-3.14+i*.2,rx=Math.cos(a2)*(20+R(v+i)*8),ry=-96+Math.sin(a2)*30;if(ry>-84){x.moveTo(rx,ry);x.quadraticCurveTo(rx+1.4,ry+5,rx+(R(i)-.5)*3,ry+10+R(i+2)*5)}}x.stroke()}}
function gbKiefer(c1,c2,v,far){
 var cD=mix(c2,'#000000',.32),cL=mix(c1,gbHL,.3),i,lean=(v-1)*3;
 F('#6e4a30');x.beginPath();x.moveTo(-4.6,0);x.bezierCurveTo(-4,-30,-2.6+lean,-60,-1.6+lean,-98);x.lineTo(2.4+lean,-98);x.bezierCurveTo(2.2,-60,4.2,-30,5.2,0);x.closePath();x.fill();
 F('#b86c3a');x.beginPath();x.moveTo(-3,-44);x.bezierCurveTo(-2.6,-68,-2+lean,-84,-1.4+lean,-98);x.lineTo(2.4+lean,-98);x.bezierCurveTo(2.2,-84,3.2,-68,3.6,-44);x.closePath();x.fill();
 if(!far){K('rgba(50,30,16,.55)',.9);x.beginPath();for(i=0;i<9;i++){x.moveTo(-3.8,-4-i*5);x.lineTo(-1,-2-i*5.4);x.moveTo(1,-6-i*5);x.lineTo(4.4,-4-i*5)}x.stroke()}
 K('#6e4a30',2.4);x.beginPath();x.moveTo(lean,-70);x.lineTo(-20,-84);x.moveTo(lean+1,-82);x.lineTo(22,-94);x.moveTo(lean,-58);x.lineTo(18,-70);x.stroke();
 var pf=function(cx,cy,r,col,ph){x.fillStyle=col;x.beginPath();var n=17;for(var k=0;k<n*2;k++){var an=k*Math.PI/n+ph,rr=(k%2?r*.8:r)*(.94+R(k+ph*9)*.1);x.lineTo(cx+Math.cos(an)*rr,cy+Math.sin(an)*rr*.82)}x.closePath();x.fill()};
 var tf=[[-22+lean,-82,14],[18+lean,-92,16],[lean-2,-106,14],[24+lean,-70,11],[-18+lean,-66,10],[lean+2,-84,15],[-8+lean,-96,12]];
 tf.forEach(function(t,k){pf(t[0],t[1]+2.4,t[2]+1,cD,k)});
 tf.forEach(function(t,k){pf(t[0],t[1],t[2],k%2?c1:c2,k+.3)});
 tf.forEach(function(t,k){pf(t[0]-t[2]*.22,t[1]-t[2]*.26,t[2]*.55,mix(c1,gbHL,.14),k+.7)});
 if(!far){K(cL,.9);x.beginPath();tf.forEach(function(t,k){for(var j=0;j<5;j++){var an2=-2.6+j*.45+k*.3,r1=t[2]*.7,r2=t[2]*1.05;x.moveTo(t[0]+Math.cos(an2)*r1,t[1]+Math.sin(an2)*r1*.82);x.lineTo(t[0]+Math.cos(an2)*r2,t[1]+Math.sin(an2)*r2*.82)}});x.stroke()}}
function gbWeide(c1,c2,v,far){
 var cD=mix(c2,'#000000',.25),cl=mix(c1,'#c8d880',.32),i;
 F('#5e4a30');x.beginPath();x.moveTo(-9,0);x.bezierCurveTo(-8,-18,-2,-34,-3,-52);x.lineTo(5,-52);x.bezierCurveTo(5,-34,9,-18,10,0);x.closePath();x.fill();F('#7a6040');x.beginPath();x.moveTo(-9,0);x.bezierCurveTo(-8,-18,-2,-34,-3,-52);x.lineTo(0,-52);x.bezierCurveTo(-3,-34,-5,-18,-5,0);x.closePath();x.fill();
 var rx=48,ry=26,cy=-76;
 F(cD);x.beginPath();x.ellipse(0,cy+3,rx+1,ry+1,0,0,6.3);x.fill();F(c2);x.beginPath();x.ellipse(0,cy,rx,ry,0,0,6.3);x.fill();F(cl);x.beginPath();x.ellipse(-8,cy-6,rx*.7,ry*.6,0,0,6.3);x.fill();
 for(i=0;i<34;i++){var sx2=-rx+2+i*2.8,ed=Math.sqrt(Math.max(0,1-(sx2/rx)*(sx2/rx)))*ry*.9,len=34+R(v*4+i)*34*(1-Math.abs(sx2)/rx*.5),sw=(R(i+9)-.5)*6;K(i%2?c2:cl,2.2);x.beginPath();x.moveTo(sx2,cy+ed*.4);x.quadraticCurveTo(sx2+sw,cy+ed+len*.5,sx2+sw*.6,cy+ed+len);x.stroke()}
 if(!far){F(mix(cl,'#ffffff',.3));for(i=0;i<14;i++){x.beginPath();x.arc(-36+R(i+v)*60,cy-12-R(i+2)*10,1.8,0,6.3);x.fill()}}}
function gbTree(kd,v,px,gy,h,P,far){
 var wm=cur==='Hardenstein',c1=far?mix(P.tree[0],P.hill[1],.55):P.tree[0],c2=far?mix(P.tree[1],P.hill[1],.55):P.tree[1];
 gbHL=wm?'#ffb080':'#ffffff';if(wm&&!far)c1=mix(c1,'#b87058',.2);
 var sp=gbSpr(cur+'|'+kd+v+(far?'f':'n'),function(){if(kd==='fichte')gbFichte(c1,c2,v,far);else if(kd==='birke')gbBirke(c1,c2,v,far);else if(kd==='kiefer')gbKiefer(c1,c2,v,far);else if(kd==='weide')gbWeide(c1,c2,v,far);else gbLaub(c1,c2,v,far,kd==='eiche')}),s=h/120;
 if(!far){x.fillStyle='rgba(0,0,0,.14)';x.beginPath();x.ellipse(px+4,gy+1,h*.3,h*.05,0,0,6.3);x.fill()}
 x.drawImage(sp,px-80*s,gy-160*s,160*s,170*s)}
function gbLayer(P,o,gy,sp,hh,far,kinds){
 var n=Math.ceil(LOOP/sp),i;
 for(i=0;i<n;i++){var bx=i*sp+R(i)*sp*.4,h=hh*1.25+R(i+3)*hh*.4,kd=kinds[Math.floor(R(i+9)*kinds.length)],v=Math.floor(R(i+17)*3),p=md(bx-o,LOOP);
  [p,p-LOOP].forEach(function(q){if(q>-80&&q<W+80){if(ACLR){var ca=Math.min(1,Math.max(0,(Math.abs(q-ACLR[0])-ACLR[1])/50));if(ca<.02)return;x.globalAlpha=ca}
   gbTree(kd,v,q,gy,h,P,far);x.globalAlpha=1}})}}
/* Kleine Bäume auf dem Höhenzug (Waldkante) */
function gbRidge(o,base,a1,k1,p1,a2,k2,p2,col,pine){
 var n=Math.ceil(LOOP/13),i;x.fillStyle=col;x.beginPath();
 for(i=0;i<n;i++){var sx=md(i*13+R(i)*7-o,LOOP);if(sx<-12||sx>W+12)continue;var yy=hy(o,base,a1,k1,p1,a2,k2,p2,sx)+2,h=9+R(i+5)*8;
  if(pine){x.moveTo(sx,yy-h);x.lineTo(sx+h*.34,yy-h*.35);x.lineTo(sx+h*.22,yy-h*.35);x.lineTo(sx+h*.46,yy+1);x.lineTo(sx-h*.46,yy+1);x.lineTo(sx-h*.22,yy-h*.35);x.lineTo(sx-h*.34,yy-h*.35);x.closePath()}
  else{x.moveTo(sx+h*.42,yy-h*.62);x.arc(sx,yy-h*.62,h*.42,0,6.3);x.rect(sx-.8,yy-h*.3,1.6,h*.34)}}
 x.fill()}
/* Schilf am Ufer */
function gbSchilf(o,t,y0){
 var i,j;x.lineCap='round';
 for(i=0;i<16;i++){var sx=md(i*61+R(i)*30-o*.5,W+120)-60,hh=16+R(i+4)*14;
  for(j=0;j<5;j++){var bx=sx+(j-2)*3.4,sw=Math.sin(t*1.3+i+j)*1.6;x.strokeStyle=j%2?'#4a7a2e':'#6a9a40';x.lineWidth=1.8;x.beginPath();x.moveTo(bx,y0);x.quadraticCurveTo(bx+sw*.4,y0-hh*.5,bx+sw+(j-2)*1.6,y0-hh*(.8+(j%3)*.1));x.stroke();
   if(j===1||(j===3&&i%2)){x.fillStyle='#6a4426';x.beginPath();x.roundRect(bx+sw+(j-2)*1.6-1.5,y0-hh*(.8+(j%3)*.1)-7,3,8,1.5);x.fill()}}}}
/* ----- Ruhrtalfähre: kleine Fähre am Anleger, legt langsam ab und kommt zurück ----- */
function gbFaehreStatic(){
 var i;
 F('#5a3a22');K('#2a1a10',1.4);x.beginPath();x.moveTo(-54,-3);x.lineTo(-48,10);x.lineTo(48,10);x.lineTo(54,-3);x.lineTo(42,-8);x.lineTo(-42,-8);x.closePath();x.fill();x.stroke();
 K('rgba(20,10,4,.5)',.9);x.beginPath();for(i=0;i<3;i++){x.moveTo(-50+i*2,-.5+i*3.4);x.lineTo(50-i*2,-.5+i*3.4)}x.stroke();
 F('#b2321f');x.fillRect(-54,-5,108,3.2);F('#f4efe2');[-40,-20,0,20,40].forEach(function(d){ell(d,5,2.4,1.8)});
 F('#6a4a2a');x.fillRect(-50,-20,2.4,14);x.fillRect(48,-20,2.4,14);x.fillRect(-26,-22,2,14);x.fillRect(24,-22,2,14);K('#6a4a2a',1.8);x.beginPath();x.moveTo(-50,-19);x.lineTo(-26,-20);x.moveTo(-50,-12);x.lineTo(-26,-13);x.moveTo(26,-20);x.lineTo(50,-19);x.moveTo(26,-13);x.lineTo(50,-12);x.stroke();
 F('#efe6cc');K('#6a5a3a',1.2);x.beginPath();x.rect(-26,-36,52,28);x.fill();x.stroke();
 F('#e0d4b4');x.fillRect(-26,-12,52,4);
 for(i=0;i<4;i++){var wx=-21+i*11.4;F('#ffd890');K('#5a3a22',1.1);x.beginPath();x.moveTo(wx,-14);x.lineTo(wx,-26);x.arc(wx+4,-26,4,Math.PI,0);x.lineTo(wx+8,-14);x.closePath();x.fill();x.stroke();K('#5a3a22',.8);x.beginPath();x.moveTo(wx+4,-30);x.lineTo(wx+4,-14);x.stroke()}
 F('#7a3a2a');K('#3a1a10',1.2);x.beginPath();x.moveTo(-32,-36);x.lineTo(-24,-45);x.lineTo(24,-45);x.lineTo(32,-36);x.closePath();x.fill();x.stroke();F('#8e4a38');x.fillRect(-24,-45,48,3);
 F('#f6ebc8');x.font='bold 7px Georgia,serif';x.textAlign='center';x.fillText('FÄHRE',0,-38.6);x.textAlign='left';
 K('#3a3430',1.4);x.beginPath();x.moveTo(0,-45);x.lineTo(0,-60);x.stroke();F('#d83a2a');x.beginPath();x.moveTo(0,-60);x.lineTo(13,-56);x.lineTo(0,-52);x.closePath();x.fill();
 F('#fff');K('#c0392b',2.4);x.beginPath();x.arc(36,-22,4.6,0,6.3);x.stroke();
 /* Fährmann am Heck, Fahrgäste am Bug */
 F('#2f4a6a');x.beginPath();x.roundRect(40,-34,7,14,2);x.fill();F('#e0b894');ell(43.4,-37,3.2,3.4);F('#1c2a3c');x.beginPath();x.moveTo(40,-38);x.quadraticCurveTo(43.4,-43,47,-38);x.closePath();x.fill();
 F('#a0481a');x.beginPath();x.roundRect(-46,-30,7,12,2);x.fill();F('#e0b894');ell(-42.4,-33,3,3.2);F('#4a3a2a');x.beginPath();x.arc(-42.4,-34,3.2,Math.PI,0);x.fill();
 F('#5a7a3a');x.beginPath();x.roundRect(-36,-28,6.4,10,2);x.fill();F('#e0b894');ell(-32.8,-31,2.8,3);F('#d8c8a0');x.beginPath();x.arc(-32.8,-32,3,Math.PI,0);x.fill()}
function gbFaehre(q,t){
 /* Anleger am Ufer */
 var cy=(t%44)/44,u=cy<.22?0:cy<.5?(cy-.22)/.28:cy<.72?1:1-(cy-.72)/.28;u=u<=0?0:u>=1?1:u*u*(3-2*u);
 var dx=u*92,wy=232+u*5,bob=Math.sin(t*1.4)*1.1,i;
 F('#4a3420');x.fillRect(q-136,wy-8,64,5);x.fillStyle='#6a4a2a';x.fillRect(q-136,wy-11,64,4);K('#2a1a10',.8);x.beginPath();for(i=0;i<8;i++){x.moveTo(q-136+i*8,wy-11);x.lineTo(q-136+i*8,wy-7)}x.stroke();
 F('#3a2818');[-134,-110,-86,-74].forEach(function(d){x.fillRect(q+d-1.6,wy-14,3.2,22)});
 /* Wasser: Spiegelung und Wellen */
 x.fillStyle='rgba(20,18,40,.28)';x.beginPath();x.ellipse(q+dx,wy+13,58,4.4,0,0,6.3);x.fill();
 x.fillStyle='rgba(255,224,150,'+(.26+.08*Math.sin(t*3))+')';for(i=0;i<5;i++){x.fillRect(q+dx-12+i*7+Math.sin(t*2+i)*2,wy+12+i*2.4,4,1.4)}
 x.strokeStyle='rgba(255,236,190,.55)';x.lineWidth=1;x.beginPath();x.ellipse(q+dx,wy+8,62+Math.sin(t*1.6)*2,3.4,0,0,6.3);x.stroke();
 if(u>0&&u<1){x.strokeStyle='rgba(255,236,190,.4)';x.beginPath();for(i=0;i<3;i++){var wk=((t*.7+i/3)%1);x.moveTo(q+dx-56-wk*30,wy+9+wk*2);x.lineTo(q+dx-62-wk*30,wy+11+wk*2)}x.stroke()}
 /* Fähre */
 x.save();x.translate(q+dx,wy+bob);x.rotate(Math.sin(t*1.1)*.012);
 var fl2=.8+.2*Math.sin(t*7);glowS(0,-52,16,'255,200,110',.5*fl2);glowS(0,-22,34,'255,214,140',.28);
 zBlit(zSprite('faehreH3',140,90,70,66,gbFaehreStatic),0,0);
 F('rgba(255,236,170,'+(.85*fl2)+')');x.beginPath();x.arc(0,-48.4,1.8,0,6.3);x.fill();
 x.restore();
 /* Tau zum Poller, solange sie festliegt */
 if(u<.04){K('#a89a78',1.2);x.beginPath();x.moveTo(q-72,wy-8);x.quadraticCurveTo(q-60,wy+4,q-52,wy-6+bob);x.stroke()}}
/* ----- Kulissen Gebiet B ----- */
function windrad(cx,by,s,t,ph){
 var i,hy=by-60*s;
 x.fillStyle='rgba(0,0,0,.1)';x.beginPath();x.ellipse(cx+3,by,6*s,1.6*s,0,0,6.3);x.fill();
 x.fillStyle='#e8ecee';x.beginPath();x.moveTo(cx-2.4*s,by);x.lineTo(cx-1.2*s,hy);x.lineTo(cx+1.2*s,hy);x.lineTo(cx+2.4*s,by);x.closePath();x.fill();
 x.fillStyle='rgba(120,134,148,.4)';x.beginPath();x.moveTo(cx+.4*s,hy);x.lineTo(cx+1.2*s,hy);x.lineTo(cx+2.4*s,by);x.lineTo(cx+1*s,by);x.closePath();x.fill();
 x.fillStyle='#dfe4e8';x.fillRect(cx-2.4*s,hy-2*s,7*s,4.4*s);x.fillStyle='#c0c8ce';x.fillRect(cx+2.4*s,hy-2*s,2.2*s,4.4*s);
 for(i=0;i<3;i++){var a=t*1.15+ph+i*2.0944;x.save();x.translate(cx-2*s,hy);x.rotate(a);x.fillStyle='#f4f6f8';x.beginPath();x.moveTo(-.6*s,0);x.lineTo(-1.1*s,-10*s);x.lineTo(-.2*s,-34*s);x.lineTo(.9*s,-10*s);x.lineTo(.6*s,0);x.closePath();x.fill();x.fillStyle='rgba(150,162,176,.45)';x.beginPath();x.moveTo(0,0);x.lineTo(.9*s,-10*s);x.lineTo(-.2*s,-34*s);x.closePath();x.fill();x.restore()}
 x.fillStyle='#c8d0d6';x.beginPath();x.arc(cx-2*s,hy,1.9*s,0,6.3);x.fill()}
function segler(px,py,t){
 x.save();x.translate(px,py);x.rotate(Math.sin(t*.6)*.07);
 x.fillStyle='#fbfcfd';x.strokeStyle='#8a929a';x.lineWidth=.7;
 x.beginPath();x.moveTo(-34,-3);x.quadraticCurveTo(-4,-9,26,-3);x.quadraticCurveTo(10,2,-34,0);x.closePath();x.fill();x.stroke();
 x.fillStyle='#d0392b';x.beginPath();x.moveTo(26,-3);x.quadraticCurveTo(30,-1,28,.4);x.lineTo(18,0);x.closePath();x.fill();
 x.fillStyle='rgba(130,190,225,.9)';x.beginPath();x.moveTo(2,-7);x.quadraticCurveTo(10,-11,16,-4);x.lineTo(2,-3);x.closePath();x.fill();
 x.fillStyle='#f4f6f8';x.beginPath();x.moveTo(-34,-3);x.lineTo(-38,-14);x.lineTo(-33,-14);x.lineTo(-30,-3);x.closePath();x.fill();x.stroke();
 x.fillRect(-40,-14,10,2.2);
 x.beginPath();x.moveTo(-4,-4);x.quadraticCurveTo(-22,-5,-60,-9);x.quadraticCurveTo(-22,-2,-4,-2);x.moveTo(-4,-4);x.quadraticCurveTo(20,-6,52,-12);x.quadraticCurveTo(20,0,-4,-2);x.fillStyle='#f4f6f8';x.fill();x.stroke();
 x.strokeStyle='#d0392b';x.lineWidth=1.4;x.beginPath();x.moveTo(-60,-9);x.lineTo(-56,-8.4);x.moveTo(52,-12);x.lineTo(48,-10.8);x.stroke();
 x.restore()}
function segelboot(px,py,t){
 x.save();x.translate(px,py+Math.sin(t*1.4+px*.02)*1.4);x.rotate(Math.sin(t*1.1+px*.03)*.03);x.scale(.7,.7);
 x.fillStyle='#f4f6f8';x.strokeStyle='#8a929a';x.lineWidth=.7;x.beginPath();x.moveTo(0,-34);x.lineTo(0,-4);x.lineTo(15,-4);x.closePath();x.fill();x.stroke();x.beginPath();x.moveTo(-1.6,-30);x.lineTo(-1.6,-4);x.lineTo(-12,-4);x.closePath();x.fillStyle='#e8ecf0';x.fill();x.stroke();
 x.fillStyle='#b2321f';x.beginPath();x.moveTo(-17,-3);x.lineTo(19,-3);x.lineTo(14,3);x.lineTo(-12,3);x.closePath();x.fill();x.fillStyle='#f4f6f8';x.fillRect(-16,-3,34,1.4);
 x.fillStyle='#d9b34a';x.beginPath();x.moveTo(0,-34);x.lineTo(6,-32);x.lineTo(0,-30);x.fill();x.restore()}
function ente(px,py,t,ph){x.save();x.translate(px,py+Math.sin(t*2+ph)*.8);x.fillStyle='#8a6a42';x.beginPath();x.ellipse(0,0,5,3,0,0,6.3);x.fill();x.fillStyle='#e8ecf0';x.beginPath();x.ellipse(-1,-.6,3.2,1.4,0,0,6.3);x.fill();x.fillStyle='#1c6a50';x.beginPath();x.arc(5,-3,2.6,0,6.3);x.fill();x.fillStyle='#e0a82a';x.beginPath();x.moveTo(7.4,-3);x.lineTo(10.6,-2.4);x.lineTo(7.4,-1.8);x.fill();x.restore()}
function lakeStatic(){
 var gr=x.createLinearGradient(0,0,0,60);gr.addColorStop(0,'#9dd0ea');gr.addColorStop(1,'#5aa0c4');x.fillStyle=gr;x.fillRect(0,0,W,60);
 x.fillStyle='rgba(255,255,255,.18)';x.fillRect(0,0,W,3)}
function drawUfer(ts){
 var P=S['Ufer'],o=D,t=ts/1000,i;
 aSky(P);
 glowS(500,70,90,'255,240,190',.55);x.fillStyle=P.sun;x.beginPath();x.arc(500,70,26,0,6.3);x.fill();
 cloud(md(130-o*.05,W+200)-100,52,1.1,.85);cloud(md(380-o*.035,W+200)-100,92,.8,.8);cloud(md(580-o*.06,W+200)-100,40,.9,.85);
 segler(md(t*16+60,W+300)-150,66+Math.sin(t*.5)*12,t);
 hills(o*.05,162,16,2,0,6,5,1.3,P.hill[0],'rgba(255,255,255,.3)');gbRidge(o*.05,162,16,2,0,6,5,1.3,mix(P.hill[0],'#1a4a2a',.4),true);
 /* Windräder auf dem Höhenzug */
 for(i=0;i<4;i++){var wq=md(i*337+90-o*.05,1350)-100;if(wq>-60&&wq<W+60)windrad(wq,hy(o*.05,162,16,2,0,6,5,1.3,wq)+2,.58+(i%2)*.1,t,i*1.7)}
 /* Segelflugplatz am Hang: Rollfeld, Hangar, Windsack */
 var sq=md(660-o*.05,1350)-150;if(sq>-150&&sq<W+150){x.save();x.translate(0,hy(o*.05,162,16,2,0,6,5,1.3,sq)-178);x.fillStyle='#90bc6c';x.beginPath();x.moveTo(sq-70,184);x.quadraticCurveTo(sq,176,sq+70,184);x.lineTo(sq+60,190);x.lineTo(sq-60,190);x.closePath();x.fill();x.fillStyle='#d8dcc6';x.fillRect(sq-56,184,112,3);x.fillStyle='#d4ccb4';x.fillRect(sq-30,170,28,14);x.fillStyle='#b2321f';x.beginPath();x.moveTo(sq-32,170);x.lineTo(sq-16,162);x.lineTo(sq,170);x.closePath();x.fill();x.fillStyle='#5a5448';x.fillRect(sq-22,174,12,10);
  x.strokeStyle='#8a8a90';x.lineWidth=1.4;x.beginPath();x.moveTo(sq+44,184);x.lineTo(sq+44,160);x.stroke();var ws=Math.sin(t*2.2)*.12;x.fillStyle='#e8601c';x.beginPath();x.moveTo(sq+44,160);x.lineTo(sq+60,160+ws*30+2);x.lineTo(sq+60,166+ws*30);x.lineTo(sq+44,165);x.fill();x.fillStyle='#fff';x.fillRect(sq+50,160.6+ws*14,3,5);x.restore()}
 /* See */
 zBlit(zSprite('lakeT',W,60,0,0,lakeStatic),0,186);
 x.fillStyle='rgba(255,255,255,.5)';for(i=0;i<14;i++){var lx=md(i*53+t*6,W),ly=190+(i*17)%44;x.fillRect(lx,ly,8+(i%3)*5,1.2)}
 x.fillStyle='rgba(255,248,210,.65)';for(i=0;i<9;i++){var gl=500+Math.sin(t*2+i*1.9)*(10+i*3),gy2=190+i*5;x.fillRect(gl-6-i,gy2,12+i*2,1.4)}
 var bq=md(t*7+150-o*.06,980)-140;if(bq>-60&&bq<W+60)segelboot(bq,222,t);
 var dq=md(300-o*.12+t*3,900)-120;if(dq>-40&&dq<W+40){ente(dq,226,t,0);ente(dq+14,228,t,1);ente(dq+26,227,t,2)}
 gbLayer(P,o*.15,240,38,52,true,['fichte','fichte','birke']);
 gbSchilf(o,t,GY-1);gbLayer(P,o*.5,GY,96,80,false,['fichte','buche','fichte','weide','birke','fichte']);
 aGround(P);fence(P,D);deco(P,D,GY+8,GY+24,30,1);
 bonusSign(zSignX('hei',700),'Heilenbecke Talsperre');
 aPath(P);deco(P,D*1.12,FY+22,FY+34,22,1.25)}
/* ----- Szene 2: Staumauer, Zoo und Tuffi ----- */
function dammStatic(){
 var i;zRc('#b4b1a6',0,-150,256,150);zRc('#cfccc0',0,-158,256,8);zRc('#8f8c82',0,-160,256,2);
 x.strokeStyle='#7a776c';x.lineWidth=2;x.beginPath();x.moveTo(0,-176);x.lineTo(256,-176);for(i=0;i<=16;i++){x.moveTo(i*16,-176);x.lineTo(i*16,-158)}x.stroke();
 x.strokeStyle='rgba(80,76,66,.35)';x.lineWidth=1;x.beginPath();for(i=1;i<12;i++){x.moveTo(0,-150+i*12.5);x.lineTo(256,-150+i*12.5)}for(i=0;i<4;i++){x.moveTo(i*64,-150);x.lineTo(i*64,0)}x.stroke();
 x.strokeStyle='rgba(70,66,56,.55)';x.lineWidth=1.6;x.beginPath();for(i=0;i<4;i++){x.moveTo(i*64,-150);x.lineTo(i*64,0)}x.stroke();
 for(i=0;i<5;i++){var sx=18+i*52+R(i)*20;x.fillStyle='rgba(60,70,56,.22)';x.beginPath();x.moveTo(sx,-150);x.lineTo(sx+8,-150);x.lineTo(sx+5+R(i+3)*10,-30-R(i+7)*60);x.lineTo(sx+1,-30-R(i+7)*60);x.closePath();x.fill()}
 x.fillStyle='rgba(90,130,70,.32)';for(i=0;i<6;i++){x.beginPath();x.ellipse(14+R(i+11)*226,-8-R(i+5)*30,10+R(i+2)*10,3.6,0,0,6.3);x.fill()}
 [60,188].forEach(function(dx){zRc('#2a2e34',dx-10,-24,20,24);x.fillStyle='#2a2e34';x.beginPath();x.arc(dx,-24,10,Math.PI,0);x.fill();x.strokeStyle='#8a8678';x.lineWidth=2;x.beginPath();x.moveTo(dx-10,0);x.lineTo(dx-10,-24);x.arc(dx,-24,10,Math.PI,0);x.lineTo(dx+10,0);x.stroke()});
 [24,152].forEach(function(lx){zRc('#3a3f46',lx-1.2,-196,2.4,22);zRc('#3a3f46',lx-6,-198,12,3);zEl('#fff0b0',lx,-194,3.4,2.4)})}
function turmStatic(){
 zRc('#a8a498',-16,-62,32,62);zRc('#bcb8ac',-16,-62,10,62);zRc('#8a867a',-16,-30,32,2);zRc('#8a867a',-16,-50,32,2);
 zPl('#7a4a3a',[-22,-62,0,-92,22,-62]);zPl('#8a5a46',[-22,-62,0,-92,-4,-92,-26,-62]);
 [[-8,-54],[2,-54]].forEach(function(w){zRc('#2a2e34',w[0],w[1],6,9);zRc('#2a2e34',w[0]+1,w[1]-3,4,4)});
 zRc('#2a2e34',-5,-20,10,20);zEl('#2a2e34',0,-20,5,5);zEl('#f0d070',0,-96,2.4,2.4)}
function zooStatic(){
 var i;zRc('#8a8574',-100,-6,200,6);
 x.fillStyle='#5f8a3a';x.beginPath();x.moveTo(-96,-6);x.quadraticCurveTo(-40,-38,10,-24);x.quadraticCurveTo(60,-12,96,-6);x.closePath();x.fill();
 x.fillStyle='#8a6238';x.beginPath();x.moveTo(-100,-44);x.lineTo(-70,-44);x.lineTo(-70,-36);x.lineTo(-100,-36);x.fill();
 zRc('#7a7a72',-92,-86,14,86);zRc('#7a7a72',78,-86,14,86);zRc('#8a8a82',-96,-90,22,5);zRc('#8a8a82',74,-90,22,5);
 x.fillStyle='#4a8a4a';x.beginPath();x.moveTo(-92,-86);x.quadraticCurveTo(0,-132,92,-86);x.lineTo(92,-70);x.quadraticCurveTo(0,-114,-92,-70);x.closePath();x.fill();
 x.fillStyle='#f6ebc8';x.font='bold 17px Georgia,serif';x.textAlign='center';x.fillText('ZOO',0,-98);x.textAlign='left';
 x.strokeStyle='#d8b84a';x.lineWidth=1.4;x.beginPath();x.moveTo(-30,-99);x.lineTo(-22,-99);x.moveTo(22,-99);x.lineTo(30,-99);x.stroke();
 zRc('#6a4a2a',-70,-44,3,44);x.fillStyle='#e8d098';x.beginPath();x.roundRect(-92,-60,48,16,2);x.fill();x.strokeStyle='#6a4a2a';x.lineWidth=1;x.stroke();x.fillStyle='#3a2410';x.font='bold 10px Georgia,serif';x.textAlign='center';x.fillText('Tuffi',-68,-48);x.textAlign='left'}
function gbElefant(px,by,ts){
 /* Zeichnung nach Björns Vorlage: frontal, runde Riesenohren, große Augen, Rüssel hängt herab und rollt sich ein, Schwänzchen mit brauner Quaste (Koordinaten der Vorlage 530 x 500) */
 var t=ts/1000,i,K0='#14141a',G1='#a9acaf',G2='#9b9ea2',G3='#c2c5c7',blink=(t%4.6)>4.45,ea=Math.sin(t*1.3)*.04,tw=Math.sin(t*1.7)*5,sw=Math.sin(t*1.1)*4;
 x.save();x.translate(px,by);x.scale(.235,.235);x.translate(-250,-482);x.lineJoin='round';x.lineCap='round';
 x.fillStyle='rgba(0,0,0,.2)';x.beginPath();x.ellipse(262,484,215,17,0,0,6.3);x.fill();
 var ol=function(c){x.fillStyle=c;x.fill();x.strokeStyle=K0;x.lineWidth=8;x.stroke()};
 var nail=function(cx,cy,w){x.fillStyle='#efe0c0';x.strokeStyle=K0;x.lineWidth=3;[-w,0,w].forEach(function(d){x.beginPath();x.ellipse(cx+d,cy,w*.55,w*.62,0,Math.PI,0);x.fill();x.stroke()})};
 /* Schwanz */
 x.strokeStyle=K0;x.lineWidth=15;x.beginPath();x.moveTo(484,196);x.bezierCurveTo(508+tw*.3,250,512+tw,320,504+tw,370);x.stroke();x.strokeStyle=G1;x.lineWidth=7;x.beginPath();x.moveTo(484,196);x.bezierCurveTo(508+tw*.3,250,512+tw,320,504+tw,370);x.stroke();
 x.beginPath();x.moveTo(500+tw,366);x.lineTo(494+tw,392);x.quadraticCurveTo(500+tw,414,516+tw,418);x.quadraticCurveTo(512+tw,396,512+tw,368);x.closePath();ol('#8f4420');
 /* hintere Beine */
 x.beginPath();x.moveTo(350,330);x.lineTo(352,440);x.quadraticCurveTo(352,474,380,476);x.quadraticCurveTo(404,474,406,446);x.lineTo(404,330);x.closePath();ol(G2);nail(380,472,9);
 x.beginPath();x.moveTo(414,326);x.lineTo(414,440);x.quadraticCurveTo(414,474,442,476);x.quadraticCurveTo(468,474,470,446);x.lineTo(470,330);x.closePath();ol(G1);nail(442,472,9);
 /* Körper */
 var bg=x.createLinearGradient(0,140,0,400);bg.addColorStop(0,'#b4b7ba');bg.addColorStop(1,G1);
 x.beginPath();x.moveTo(280,206);x.bezierCurveTo(318,158,394,138,442,160);x.bezierCurveTo(486,182,500,242,498,300);x.bezierCurveTo(496,352,470,388,430,394);x.bezierCurveTo(380,400,330,394,290,372);x.bezierCurveTo(258,350,256,262,280,206);x.closePath();ol(bg);
 x.strokeStyle='rgba(60,64,70,.28)';x.lineWidth=5;x.beginPath();x.moveTo(430,200);x.quadraticCurveTo(452,260,440,330);x.stroke();
 /* rechtes Ohr (vor dem Körper) */
 x.save();x.translate(278,100);x.rotate(-ea);x.translate(-278,-100);
 x.beginPath();x.moveTo(258,66);x.bezierCurveTo(320,36,384,44,408,86);x.bezierCurveTo(428,150,396,236,330,284);x.bezierCurveTo(298,270,288,248,290,206);x.closePath();ol(G1);
 x.strokeStyle='rgba(60,64,70,.25)';x.lineWidth=5;x.beginPath();x.moveTo(300,100);x.bezierCurveTo(340,90,380,110,376,170);x.stroke();x.restore();
 /* vordere Beine: fern, dann nah */
 var lgp=function(xl,xr,yt,yb,c){var pth=function(){x.beginPath();x.moveTo(xl,yt);x.lineTo(xl,yb-34);x.quadraticCurveTo(xl,yb+2,(xl+xr)/2,yb+2);x.quadraticCurveTo(xr,yb+2,xr,yb-34);x.lineTo(xr,yt)};pth();x.closePath();x.fillStyle=c;x.fill();pth();x.strokeStyle=K0;x.lineWidth=8;x.stroke()};
 lgp(148,206,250,478,G2);nail(177,474,9);
 lgp(232,292,244,480,G1);nail(262,476,9);
 /* linkes Ohr (hinter dem Kopf) */
 x.save();x.translate(140,100);x.rotate(ea);x.translate(-140,-100);
 x.beginPath();x.moveTo(150,62);x.bezierCurveTo(100,38,22,52,6,112);x.bezierCurveTo(-6,170,30,240,100,280);x.bezierCurveTo(126,258,128,224,124,192);x.closePath();ol(G1);
 x.strokeStyle='rgba(60,64,70,.25)';x.lineWidth=5;x.beginPath();x.moveTo(132,96);x.bezierCurveTo(90,84,50,106,48,160);x.stroke();x.restore();
 /* Kopf */
 x.beginPath();x.moveTo(104,150);x.bezierCurveTo(98,88,142,54,200,52);x.bezierCurveTo(262,50,302,92,300,148);x.bezierCurveTo(298,206,272,238,234,250);x.bezierCurveTo(200,256,166,246,140,228);x.bezierCurveTo(114,208,106,182,104,150);x.closePath();ol(G1);
 x.fillStyle='rgba(255,255,255,.22)';x.beginPath();x.ellipse(180,78,40,12,-.1,0,6.3);x.fill();
 /* Rüssel: hängt von der Mitte herab, rollt sich unten nach rechts ein */
 var sgm=function(u){var a=[184,214],b=[166+sw*.3,270],c=[150+sw*.6,340],d=[170+sw,388];if(u<=1){var v=u,m=1-v;return[m*m*m*a[0]+3*m*m*v*b[0]+3*m*v*v*c[0]+v*v*v*d[0],m*m*m*a[1]+3*m*m*v*b[1]+3*m*v*v*c[1]+v*v*v*d[1]]}
  var w=u-1,n=1-w,e=[180+sw,412],f=[222+sw,418],h=[238+sw*.6,392];return[n*n*n*d[0]+3*n*n*w*e[0]+3*n*w*w*f[0]+w*w*w*h[0],n*n*n*d[1]+3*n*n*w*e[1]+3*n*w*w*f[1]+w*w*w*h[1]]};
 var tp=[];for(i=0;i<=40;i++)tp.push(sgm(i/20));
 x.fillStyle=K0;tp.forEach(function(p,j){var r=30-j*.42;x.beginPath();x.arc(p[0],p[1],r+4.2,0,6.3);x.fill()});
 x.fillStyle=G1;tp.forEach(function(p,j){var r=30-j*.42;x.beginPath();x.arc(p[0],p[1],r,0,6.3);x.fill()});
 x.strokeStyle='rgba(50,54,60,.55)';x.lineWidth=4;for(i=2;i<15;i++){var q=tp[i],q2=tp[i+1],ang=Math.atan2(q2[1]-q[1],q2[0]-q[0])+1.5708,rr=26-i*.5;x.beginPath();x.moveTo(q[0]-Math.cos(ang)*rr,q[1]-Math.sin(ang)*rr);x.quadraticCurveTo(q[0]+Math.cos(ang+1.57)*3,q[1]+Math.sin(ang+1.57)*3+4,q[0]+Math.cos(ang)*rr,q[1]+Math.sin(ang)*rr);x.stroke()}
 x.fillStyle=K0;var tl=tp[40];x.beginPath();x.ellipse(tl[0]-2,tl[1]+4,5,3.4,.4,0,6.3);x.fill();
 /* Gesicht */
 [[142,168],[244,168]].forEach(function(e,j){x.fillStyle='#fff';x.strokeStyle=K0;x.lineWidth=5;x.beginPath();x.ellipse(e[0],e[1],19,blink?2.4:25,j?.1:-.1,0,6.3);x.fill();x.stroke();
  if(!blink){x.fillStyle=K0;x.beginPath();x.ellipse(e[0]+(j?3:-3),e[1]+4,12.4,18,0,0,6.3);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(e[0]+(j?-1:-7),e[1]-4,5.4,0,6.3);x.arc(e[0]+(j?6:0),e[1]+12,2.8,0,6.3);x.fill()}
  x.strokeStyle=K0;x.lineWidth=4;x.beginPath();x.moveTo(e[0]-20,e[1]-34+(j?4:0));x.quadraticCurveTo(e[0],e[1]-44,e[0]+18,e[1]-34+(j?0:4));x.stroke()});
 x.strokeStyle=K0;x.lineWidth=4.4;x.beginPath();x.moveTo(150,236);x.quadraticCurveTo(168,246,186,238);x.moveTo(224,240);x.quadraticCurveTo(248,246,270,224);x.stroke();
 x.strokeStyle='rgba(60,64,70,.35)';x.lineWidth=3.2;x.beginPath();x.moveTo(176,214);x.quadraticCurveTo(190,222,204,214);x.stroke();
 x.fillStyle='rgba(232,150,152,.4)';x.beginPath();x.ellipse(122,214,12,7,0,0,6.3);x.ellipse(284,208,12,7,0,0,6.3);x.fill();
 x.restore()}
function zooFenceStatic(){
 var i;x.strokeStyle='#6a4a2a';x.lineWidth=3;x.beginPath();x.moveTo(-100,-16);x.lineTo(100,-16);x.moveTo(-100,-30);x.lineTo(100,-30);x.stroke();for(i=0;i<=10;i++){x.fillStyle='#6a4a2a';x.fillRect(-100+i*20-2.4,-36,4.8,36);x.fillStyle='#8a6238';x.fillRect(-100+i*20-2.4,-36,1.6,36)}}
function drawStaumauer(ts){
 var P=S['Staumauer'],o=D,t=ts/1000,i;
 aSky(P);
 glowS(160,86,80,'255,244,200',.5);x.fillStyle=P.sun;x.beginPath();x.arc(160,86,26,0,6.3);x.fill();
 cloud(md(120-o*.05,W+200)-100,56,1.1,.85);cloud(md(420-o*.035,W+200)-100,44,.9,.85);
 hills(o*.05,172,22,2,0,9,5,1.3,P.hill[0],'rgba(255,255,255,.3)');gbRidge(o*.05,172,22,2,0,9,5,1.3,mix(P.hill[0],'#1a4a2a',.3),false);
 /* Mauer füllt die ganze Breite und läuft als Kachel durch, dazu Wassertropfen und Turm */
 var vt=zSprite('dammT',256,210,0,196,dammStatic),vo=((o*.2)%256+256)%256;
 for(var vk=-1;vk<4;vk++)zBlit(vt,vk*256-vo,GY-4);
 var tq=md(500-o*.2,1280)-150;if(tq>-40&&tq<W+40)zBlit(zSprite('turmM',60,110,30,100,turmStatic),tq,GY-158);
 for(i=0;i<5;i++){var dq0=md(i*256/2+60-o*.2,256)+0;x.fillStyle='rgba(210,236,250,.7)';var sy=((t*1.1+i*.3)%1);x.fillRect(dq0,GY-24+sy*22,2,3+sy*4)}
 gbLayer(P,o*.15,238,38,52,true,['buche','birke','eiche']);
 hills(o*.1,218,14,3,2,6,7,.4,P.hill[1],'rgba(255,255,255,.25)');
 var zq=aLm(1,1500,1),zbase=FY-12;
 ACLR=(zq>-300&&zq<W+300)?[zq,150]:null;
 gbLayer(P,o*.5,GY,96,80,false,['buche','eiche','birke','buche','eiche']);ACLR=null;
 aGround(P);fence(P,D);deco(P,D,GY+8,GY+24,30,1);
 if(zq>-300&&zq<W+300){ASG.push(zq);ASG.push(zq-70);
  x.save();x.translate(zq,zbase);x.scale(1.25,1.25);zBlit(zSprite('zooS',220,150,110,142,zooStatic),0,0);x.restore();
  gbElefant(zq+36,zbase-18,ts);x.save();x.translate(zq,zbase);x.scale(1.25,1.25);zBlit(zSprite('zooF',220,50,110,44,zooFenceStatic),0,0);x.restore()}
 bonusSign(zSignX('wup',STAGE+700),'Wuppertalsperre');
 aPath(P);deco(P,D*1.12,FY+22,FY+34,22,1.25)}
/* ----- Szene 3: Steinbruch Imberg und Universität ----- */
function sandStatic(){
 var i,cols=['#cfae7c','#bd9a68','#d6b886','#c4a272','#b08a58'];
 x.fillStyle='#c4a272';x.beginPath();x.moveTo(0,0);x.lineTo(0,-170);
 for(i=0;i<=16;i++){x.lineTo(i*16,-170-Math.sin(i*1.3)*10-R(i+4)*18)}x.lineTo(256,0);x.closePath();x.fill();
 for(i=0;i<9;i++){x.fillStyle=cols[i%5];x.fillRect(0,-176+i*22,256,11+(i%3)*4);}
 x.strokeStyle='rgba(70,50,20,.4)';x.lineWidth=1;x.beginPath();for(i=0;i<9;i++){x.moveTo(0,-176+i*22);x.lineTo(256,-176+i*22+Math.sin(i)*3)}x.stroke();
 x.strokeStyle='rgba(60,42,16,.55)';x.lineWidth=1.6;x.beginPath();[[34,-170,30,-110,38,-70],[108,-172,114,-120,106,-60],[190,-168,186,-96,196,-40],[236,-160,240,-110]].forEach(function(c){x.moveTo(c[0],c[1]);for(var k=2;k<c.length;k+=2)x.lineTo(c[k],c[k+1])});x.stroke();
 x.fillStyle='rgba(95,138,58,.55)';for(i=0;i<9;i++){x.beginPath();x.ellipse(10+R(i)*236,-20-R(i+3)*140,6+R(i+8)*10,3,0,0,6.3);x.fill()}
 x.fillStyle='#4f7a32';for(i=0;i<16;i++){var gx=i*16+R(i)*8;x.beginPath();x.ellipse(gx,-172-R(i+4)*14-Math.sin(i*1.3)*10,9,4,0,0,6.3);x.fill()}
 x.fillStyle='rgba(0,0,0,.18)';x.fillRect(0,-4,256,4)}
function uniStatic(){
 var i,j;zRc('#d4d6d8',-130,-76,260,76);zRc('#b8bcc0',-130,-80,260,5);
 zRc('#c8cacc',-26,-124,52,124);zRc('#aeb2b6',-30,-128,60,6);
 for(i=0;i<8;i++){for(j=0;j<3;j++){zRc('#7aa4c8',-122+i*31,-70+j*22,22,15);zRc('rgba(255,255,255,.35)',-122+i*31,-70+j*22,22,4);x.strokeStyle='#6a7078';x.lineWidth=1;x.strokeRect(-122+i*31,-70+j*22,22,15)}}
 for(i=0;i<3;i++){zRc('#7aa4c8',-18,-116+i*30,36,22);x.strokeStyle='#6a7078';x.strokeRect(-18,-116+i*30,36,22);zRc('rgba(255,255,255,.3)',-18,-116+i*30,36,5)}
 zRc('#5a5e64',-24,-26,48,26);zRc('#3a3e44',-18,-22,36,22);zRc('#8a8e94',-30,-30,60,5);
 x.fillStyle='#2a6a8a';x.beginPath();x.roundRect(-52,-110,104,17,3);x.fill();x.fillStyle='#fff';x.font='bold 11px system-ui,sans-serif';x.textAlign='center';x.fillText('Universität',0,-98);x.textAlign='left';
 x.strokeStyle='#6a7078';x.lineWidth=1.6;x.beginPath();x.moveTo(0,-128);x.lineTo(0,-152);x.stroke();zPl('#d83a2a',[0,-152,16,-147,0,-142]);
 zRc('#a8aaae',-130,-4,260,4)}
function kranStatic(){
 x.strokeStyle='#5a4a3a';x.lineWidth=4;x.beginPath();x.moveTo(-18,0);x.lineTo(-18,-110);x.moveTo(18,0);x.lineTo(18,-110);x.stroke();x.lineWidth=2;x.beginPath();for(var i=0;i<6;i++){x.moveTo(-18,-i*20);x.lineTo(18,-i*20-20);x.moveTo(18,-i*20);x.lineTo(-18,-i*20-20)}x.stroke();
 x.strokeStyle='#4a4038';x.lineWidth=5;x.beginPath();x.moveTo(-60,-112);x.lineTo(70,-112);x.stroke();x.lineWidth=2;x.beginPath();x.moveTo(0,-112);x.lineTo(60,-132);x.moveTo(0,-112);x.lineTo(-40,-132);x.moveTo(-40,-132);x.lineTo(60,-132);x.stroke()}
function drawSandstein(ts){
 var P=S['Sandstein'],o=D,t=ts/1000,i;
 aSky(P);
 glowS(540,78,80,'255,240,190',.5);x.fillStyle=P.sun;x.beginPath();x.arc(540,78,24,0,6.3);x.fill();
 cloud(md(130-o*.05,W+200)-100,52,1.0,.85);cloud(md(430-o*.035,W+200)-100,84,.8,.8);
 hills(o*.05,176,22,2,0,9,5,1.3,P.hill[0],'rgba(255,255,255,.3)');
 var uq=aLm(2,1900,.5);
 gbLayer(P,o*.15,238,38,52,true,['kiefer','buche','birke']);
 var vt=zSprite('sandT',256,200,0,190,sandStatic),vo=((o*.3)%256+256)%256;
 var cq0=aLm(2,2900,.3);
 for(var vk=-1;vk<4;vk++){var bxq=vk*256-vo;zBlit(vt,bxq,GY+2)}
 var kq=md(400-o*.3,1100)-120;if(kq>-80&&kq<W+80){x.save();x.translate(kq,GY-142);zBlit(zSprite('kranS',150,170,70,150,kranStatic),0,0);var sw=Math.sin(t*.8)*6;x.strokeStyle='#2a2a30';x.lineWidth=1.4;x.beginPath();x.moveTo(30+sw*.2,-20);x.lineTo(30+sw,16);x.stroke();x.fillStyle='#c8c4b4';x.strokeStyle='#4a4638';x.fillRect(22+sw,16,16,12);x.strokeRect(22+sw,16,16,12);x.restore()}
 hills(o*.1,226,14,3,2,6,7,.4,P.hill[1],'rgba(255,255,255,.2)');
 if(uq>-210&&uq<W+210){x.save();x.translate(uq,GY-2);x.scale(1.15,1.15);zBlit(zSprite('uniS',280,170,140,160,uniStatic),0,0);x.restore()}
 ACLR=(uq>-300&&uq<W+300)?[uq,180]:null;
 gbLayer(P,o*.5,GY,96,80,false,['kiefer','birke','buche','kiefer','eiche']);ACLR=null;
 aGround(P);fence(P,D);deco(P,D,GY+8,GY+24,30,1);
 bonusSign(zSignX('imb',2*STAGE+700),'Steinbruch Imberg');
 aPath(P);deco(P,D*1.12,FY+22,FY+34,22,1.25)}
/* ----- Szene 4: Burgruine Hardenstein und Ruhrtalfähre ----- */
function ruineStatic(){
 var i;
 x.fillStyle='#4a4e5c';x.beginPath();x.moveTo(-150,0);x.quadraticCurveTo(-70,-40,0,-48);x.quadraticCurveTo(80,-40,150,0);x.closePath();x.fill();
 zRc('#7a7684',-70,-120,52,120);zRc('#5e5a68',-34,-120,16,120);
 for(i=0;i<4;i++)zRc(i%2?'#7a7684':'#5e5a68',-70+i*13,-130+(i%2)*8,10,12);
 zPl('#7a7684',[-70,-120,-70,-106,-58,-120]);
 zRc('#6a6674',-18,-86,96,86);
 for(i=0;i<5;i++)zRc(i%2?'#6a6674':'#7a7684',-18+i*20,-96+(i*7%11),14,12+(i*7%11));
 x.fillStyle='#14121e';x.beginPath();x.moveTo(8,0);x.lineTo(8,-34);x.arc(22,-34,14,Math.PI,0);x.lineTo(36,0);x.fill();
 zRc('#14121e',-56,-98,9,20);zEl('#14121e',-51.5,-98,4.5,4.5);zRc('#14121e',-40,-70,8,16);
 zRc('#6a6674',80,-56,48,56);for(i=0;i<3;i++)zRc(i%2?'#6a6674':'#7a7684',80+i*16,-64+(i*5%7),12,10);
 zPl('#6a6674',[-130,0,-130,-30,-112,-40,-100,0]);
 x.strokeStyle='#2f4a40';x.lineWidth=2.4;x.beginPath();x.moveTo(-18,-60);x.quadraticCurveTo(-30,-40,-24,-10);x.moveTo(-70,-90);x.quadraticCurveTo(-82,-60,-76,-20);x.stroke();
 x.fillStyle='#2f4a40';for(i=0;i<10;i++){x.beginPath();x.ellipse(-26+(i%2)*6,-14-i*6,4,2.4,.5,0,6.3);x.fill()}
 x.strokeStyle='rgba(30,26,40,.55)';x.lineWidth=1;x.beginPath();for(i=0;i<8;i++){x.moveTo(-70,-110+i*14);x.lineTo(-18,-110+i*14)}x.stroke()}
function drawHardenstein(ts){
 var P=S['Hardenstein'],o=D,t=ts/1000,i;
 aSky(P);
 x.fillStyle='#fff';for(i=0;i<22;i++){x.globalAlpha=(.15+.45*Math.abs(Math.sin(t*.7+i)))*(1-(i*53%120)/150);x.fillRect((i*97)%W,(i*37)%70,1.4,1.4)}x.globalAlpha=1;
 glowS(190,150,120,'255,200,130',.6);x.fillStyle='#ffd9a0';x.beginPath();x.arc(190,150,26,0,6.3);x.fill();
 cloud(md(150-o*.05,W+200)-100,60,1.1,.5);cloud(md(450-o*.035,W+200)-100,100,.8,.45);
 hills(o*.05,178,22,2,0,9,5,1.3,'#6a5a78','rgba(255,200,170,.22)');gbRidge(o*.05,178,22,2,0,9,5,1.3,'#3e3a52',false);
 /* Burgruine mit Gespenst */
 var rq=aLm(3,1700,.4);
 if(rq>-230&&rq<W+230){x.save();x.translate(rq,206);x.scale(1.4,1.4);zBlit(zSprite('ruineH',300,170,150,160,ruineStatic),0,0);
  var fl=.75+.25*Math.sin(t*9);glowS(-51.5,-98,18,'255,200,110',.5*fl);x.fillStyle='rgba(255,214,130,'+(.85*fl)+')';x.fillRect(-56,-98,9,16);
  var gy2=-150+Math.sin(t*1.1)*8,gx2=-48+Math.sin(t*.7)*16;x.fillStyle='rgba(240,244,255,.55)';x.beginPath();x.moveTo(gx2-9,gy2+16);x.quadraticCurveTo(gx2-12,gy2-4,gx2,gy2-6);x.quadraticCurveTo(gx2+12,gy2-4,gx2+9,gy2+16);x.quadraticCurveTo(gx2+4,gy2+12,gx2,gy2+17);x.quadraticCurveTo(gx2-4,gy2+12,gx2-9,gy2+16);x.fill();x.fillStyle='rgba(20,20,40,.7)';x.beginPath();x.ellipse(gx2-3.4,gy2+1,1.6,2.4,0,0,6.3);x.ellipse(gx2+3.4,gy2+1,1.6,2.4,0,0,6.3);x.fill();x.beginPath();x.ellipse(gx2,gy2+8,2,2.6,0,0,6.3);x.fill();
  x.restore()}
 /* Ruhr mit Fähre am Seil */
 zBlit(zSprite('ruhrT',W,56,0,0,function(){var gr=x.createLinearGradient(0,0,0,56);gr.addColorStop(0,'#e0a07a');gr.addColorStop(1,'#6a6a8e');x.fillStyle=gr;x.fillRect(0,0,W,56);x.fillStyle='#4a4a5a';x.beginPath();x.moveTo(0,0);for(var q=0;q<=W;q+=20)x.lineTo(q,1+Math.sin(q/37)*1.6);x.lineTo(W,-3);x.lineTo(0,-3);x.closePath();x.fill()}),0,200);
 x.fillStyle='rgba(255,224,170,.5)';for(i=0;i<12;i++){var lx=md(i*61+t*5,W),ly=200+(i*13)%40;x.fillRect(lx,ly,10+(i%3)*5,1.3)}
 var fq=aLm(3,1500,.5);if(fq>-200&&fq<W+260)gbFaehre(fq,t);
 ACLR=(fq>-260&&fq<W+300)?[fq-6,150]:null;gbLayer(P,o*.5,GY,100,60,false,['eiche','fichte','buche','eiche']);ACLR=null;
 aGround(P);fence(P,D);deco(P,D,GY+8,GY+24,30,1);
 for(i=0;i<8;i++){var s2=((t*.3+i/8)%1);x.fillStyle='rgba(255,236,150,'+(.6*Math.sin(s2*3.14))+')';x.beginPath();x.arc(md(i*97+30-o*.4,W+60)-30,GY-10-s2*50+Math.sin(t+i)*8,1.5,0,6.3);x.fill()}
 bonusSign(zSignX('har',3*STAGE+700),'Ruine Hardenstein');
 aPath(P);deco(P,D*1.12,FY+22,FY+34,22,1.25);
 var gq=TOTAL+260-g.run;if(gq>-90&&gq<W+90){ASG.push(gq);zBlit(zSprite('zielB',190,170,95,150,zielStatic),gq,FY+8)}}
/* ----- Karte: Gebiet wählen (nach dem Friedhof und nach Gebiet A) ----- */
var MAPP=[{bn:0,x:76,y:262,t:'Wanderquest',s:'6 Etappen',up:1},{bn:1,x:182,y:152,t:'Höhle und Grat',s:'2 Szenen',up:1},{bn:2,x:300,y:240,t:'Moor und Küste',s:'2 Szenen',up:0},{bn:3,x:416,y:150,t:'Altstadt und Friedhof',s:'2 Szenen',up:1},{bn:4,x:548,y:96,t:'Gebiet A',s:'Hammerwerke, 4 Szenen',up:0,nw:1},{bn:5,x:556,y:246,t:'Gebiet B',s:'Talsperre, 4 Szenen',up:0,nw:1}];
function openMap(){g.mode='map';g.msel=4;g.tMap=0;mm.hold=false;mm.duckKey=false;mm.duckPtr=false;msgT=0}
function mapPick(i){var p=MAPP[i];if(!p)return;if(p.lock){say('Gebiet B kommt bald. Der Wegweiser sucht noch die Schilder.',4);return}start(p.bn)}
function mapTap(lx,ly){
 if(lx>W-34&&ly>H-40){muted=!muted;if(!muted)sfx('ok');return}
 for(var i=0;i<MAPP.length;i++){var p=MAPP[i],lyb=p.up?p.y-52:p.y+16;if(Math.hypot(lx-p.x,ly-p.y)<24||(lx>p.x-66&&lx<p.x+66&&ly>lyb&&ly<lyb+36)){g.msel=i;mapPick(i);return}}
 if(ly>H-40&&lx<250){start(0)}}
function mapKey(e){
 if(e.code==='KeyM'){muted=!muted;if(!muted)sfx('ok');return}
 if(e.code==='KeyN'||e.code==='Escape'){e.preventDefault();start(0);return}
 var d=e.code.match(/^(Digit|Numpad)([1-6])$/);if(d){e.preventDefault();g.msel=+d[2]-1;mapPick(g.msel);return}
 if(e.code==='ArrowRight'||e.code==='ArrowDown'){e.preventDefault();g.msel=(g.msel+1)%MAPP.length;return}
 if(e.code==='ArrowLeft'||e.code==='ArrowUp'){e.preventDefault();g.msel=(g.msel+MAPP.length-1)%MAPP.length;return}
 if(e.code==='Enter'||e.code==='Space'){e.preventDefault();mapPick(g.msel)}}
function drawMap(ts){
 var t=ts/1000,i;
 x.fillStyle='#d8c79a';x.fillRect(0,0,W,H);
 x.fillStyle='#f3e6c8';x.beginPath();x.moveTo(14,16);x.lineTo(70,10);x.lineTo(150,17);x.lineTo(250,9);x.lineTo(360,17);x.lineTo(470,10);x.lineTo(570,16);x.lineTo(666,9);x.lineTo(670,100);x.lineTo(666,190);x.lineTo(671,290);x.lineTo(660,328);x.lineTo(560,332);x.lineTo(450,325);x.lineTo(340,332);x.lineTo(230,326);x.lineTo(120,333);x.lineTo(20,327);x.lineTo(12,230);x.lineTo(16,120);x.closePath();x.fill();x.strokeStyle='#b8925a';x.lineWidth=2;x.stroke();
 x.fillStyle='rgba(184,146,90,.16)';x.beginPath();x.ellipse(52,48,30,18,0,0,6.3);x.fill();x.beginPath();x.ellipse(628,296,34,20,0,0,6.3);x.fill();
 x.strokeStyle='#8fb8d4';x.lineWidth=8;x.lineCap='round';x.beginPath();x.moveTo(50,300);x.bezierCurveTo(100,240,190,290,250,246);x.bezierCurveTo(320,200,400,290,480,230);x.bezierCurveTo(530,194,570,214,610,170);x.stroke();
 x.fillStyle='#4f7f9f';x.font='italic 11px system-ui,sans-serif';x.textAlign='left';x.fillText('Wupper',520,214);
 /* Pfad */
 x.strokeStyle='#7a5a38';x.lineWidth=2.4;x.setLineDash([1,6]);x.beginPath();x.moveTo(76,262);x.quadraticCurveTo(110,170,182,152);x.quadraticCurveTo(200,240,300,240);x.quadraticCurveTo(400,240,416,150);x.stroke();
 x.setLineDash([7,6]);x.strokeStyle='#b8925a';x.beginPath();x.moveTo(416,150);x.quadraticCurveTo(480,150,548,96);x.moveTo(416,150);x.quadraticCurveTo(470,230,556,246);x.stroke();x.setLineDash([]);
 /* Kompassrose */
 x.save();x.translate(70,98);x.strokeStyle='#7a5a38';x.lineWidth=1.1;x.beginPath();x.arc(0,0,26,0,6.3);x.stroke();x.fillStyle='rgba(160,72,26,.85)';x.beginPath();x.moveTo(0,-26);x.lineTo(5,-5);x.lineTo(26,0);x.lineTo(5,5);x.lineTo(0,26);x.lineTo(-5,5);x.lineTo(-26,0);x.lineTo(-5,-5);x.closePath();x.fill();x.fillStyle='#fbf3e0';x.beginPath();x.moveTo(0,-17);x.lineTo(3,-3);x.lineTo(17,0);x.lineTo(3,3);x.lineTo(0,17);x.lineTo(-3,3);x.lineTo(-17,0);x.lineTo(-3,-3);x.closePath();x.fill();x.restore();
 x.fillStyle='#3a2918';x.font='bold 11px Georgia,serif';x.textAlign='center';x.fillText('N',70,64);x.fillStyle='#7a5a38';x.font='italic 10px system-ui,sans-serif';x.fillText('Norden, glaube ich',70,142);
 /* Kleinigkeiten: Fuchs, Gummiente, Biber, Berge, Tuffi */
 x.save();x.translate(200,284);x.scale(1.1,1.1);x.fillStyle='#e08436';x.strokeStyle='#6b3a14';x.lineWidth=.8;x.beginPath();x.ellipse(0,0,13,6.5,0,0,6.3);x.fill();x.stroke();x.beginPath();x.moveTo(-12,-1);x.quadraticCurveTo(-26,-8,-24,-16);x.quadraticCurveTo(-16,-10,-9,-4);x.fill();x.stroke();x.fillStyle='#fff';x.beginPath();x.moveTo(-24,-16);x.quadraticCurveTo(-26,-19,-22,-19);x.fill();x.fillStyle='#e08436';x.beginPath();x.moveTo(10,-3);x.quadraticCurveTo(15,-10,21,-8);x.lineTo(27,-4);x.lineTo(20,0);x.quadraticCurveTo(14,2,10,-3);x.fill();x.stroke();x.beginPath();x.moveTo(12,-7);x.lineTo(13,-14);x.lineTo(17,-8);x.moveTo(17,-8);x.lineTo(21,-14);x.lineTo(22,-7);x.fill();x.fillStyle='#fbefe0';x.beginPath();x.moveTo(20,0);x.lineTo(27,-4);x.lineTo(24,2);x.fill();x.fillStyle='#3a2418';x.fillRect(-7,4,3,7);x.fillRect(6,4,3,7);x.fillStyle='#1a1a1a';x.beginPath();x.arc(26,-4,1.2,0,6.3);x.fill();x.restore();
 x.fillStyle='#7a5a38';x.font='italic 10px system-ui,sans-serif';x.textAlign='center';x.fillText('Fuchs (hat alles gesehen)',200,308);
 x.save();x.translate(392,292);x.fillStyle='#f2c94c';x.strokeStyle='#a37d1a';x.lineWidth=.9;x.beginPath();x.ellipse(0,0,9,5,0,0,6.3);x.fill();x.stroke();x.beginPath();x.arc(6,-6,4.4,0,6.3);x.fill();x.stroke();x.fillStyle='#e07b2a';x.beginPath();x.moveTo(10,-6);x.lineTo(15,-5);x.lineTo(10,-3.5);x.fill();x.fillStyle='#3a2918';x.beginPath();x.arc(7,-7,.9,0,6.3);x.fill();x.restore();
 x.fillStyle='#4f7f9f';x.font='italic 10px system-ui,sans-serif';x.fillText('Quak!',414,290);
 x.save();x.translate(612,212);x.fillStyle='#9aa1ad';x.strokeStyle='#5f6672';x.lineWidth=.9;x.beginPath();x.ellipse(0,0,12,7.5,0,0,6.3);x.fill();x.stroke();x.beginPath();x.arc(11,-6,6.2,0,6.3);x.fill();x.stroke();x.lineWidth=2.6;x.lineCap='round';x.beginPath();x.moveTo(16,-4);x.quadraticCurveTo(24,-2,22,6);x.stroke();x.fillStyle='#b8bec9';x.beginPath();x.ellipse(8,-5,3.6,5,0,0,6.3);x.fill();x.fillStyle='#1a1a1a';x.beginPath();x.arc(13,-8,1,0,6.3);x.fill();x.restore();
 x.fillStyle='#7a5a38';x.fillText('Tuffi sprang hier',606,190);
 x.fillStyle='#c9b588';x.strokeStyle='#7a5a38';x.lineWidth=1;x.beginPath();x.moveTo(260,100);x.lineTo(276,76);x.lineTo(286,92);x.lineTo(296,70);x.lineTo(312,100);x.closePath();x.fill();x.stroke();x.fillStyle='#7a5a38';x.fillText('Berge (eher Hügel)',286,116);
 x.strokeStyle='#b2321f';x.lineWidth=3.2;x.lineCap='round';x.beginPath();x.moveTo(624,134);x.lineTo(638,148);x.moveTo(638,134);x.lineTo(624,148);x.stroke();x.fillStyle='#b2321f';x.font='10px system-ui,sans-serif';x.fillText('Schatz?',631,162);
 /* Schriftband */
 x.fillStyle='#fbf3e0';x.strokeStyle='#b8925a';x.lineWidth=1.4;x.beginPath();x.moveTo(214,18);x.lineTo(466,18);x.lineTo(458,34);x.lineTo(466,50);x.lineTo(214,50);x.lineTo(222,34);x.closePath();x.fill();x.stroke();
 x.fillStyle='#3a2918';x.font='bold 19px Georgia,serif';x.fillText('Wohin jetzt?',340,41);
 /* Pins */
 for(i=0;i<MAPP.length;i++){var p=MAPP[i],sel=g.msel===i,pul=sel?3*Math.sin(t*5):0;
  x.fillStyle=p.lock?'#fbf3e0':(p.nw?'#fbf3e0':'#4a8c3f');x.strokeStyle=p.lock?'#a0a0a0':(p.nw?'#a0481a':'#2f5f28');x.lineWidth=2;if(p.nw||p.lock)x.setLineDash([4,3]);
  x.beginPath();x.arc(p.x,p.y,15+pul*.3,0,6.3);x.fill();x.stroke();x.setLineDash([]);
  x.fillStyle=p.lock?'#8a8a8a':(p.nw?'#a0481a':'#fff');x.font='bold 15px Georgia,serif';x.fillText(p.lock?'?':String(i+1),p.x,p.y+5.5);
  var lw=p.nw?136:p.s.length>16?132:120,lyb=p.up?p.y-52:p.y+17,lx0=p.x-lw/2;if(lx0<16)lx0=16;if(lx0+lw>W-16)lx0=W-16-lw;
  x.fillStyle='#fbf3e0';x.strokeStyle=sel?'#a0481a':(p.lock||p.nw?'#a0481a':'#b8925a');x.lineWidth=sel?2.2:1;if(p.nw||p.lock)x.setLineDash([4,3]);x.beginPath();x.roundRect(lx0,lyb,lw,36,5);x.fill();x.stroke();x.setLineDash([]);
  x.fillStyle=p.lock?'#8a8a8a':p.nw?'#a0481a':'#3a2918';x.font='bold 11px system-ui,sans-serif';x.fillText(p.t,lx0+lw/2,lyb+15);x.fillStyle='#7a5a38';x.font='10px system-ui,sans-serif';x.fillText(p.s,lx0+lw/2,lyb+29);
  if(p.nw&&Math.floor(t*2)%2){x.fillStyle='#a0481a';x.font='bold 10px system-ui,sans-serif';x.fillText('NEU',p.x,p.y-20)}}
 x.textAlign='left';x.fillStyle='#7a5a38';x.font='11px system-ui,sans-serif';x.fillText(TOUCH?'Gebiet antippen · unten links: Quest von vorn':'Antippen oder Ziffer 1 bis 6 · Pfeile und Enter · N: Quest von vorn',74,H-17);x.textAlign='left'}
/* ----- Vordergrund: passend zur Szene ziehen Bäume, Laternen, Bänke, Blumen, Felsen usw. vorbei (blenden bei Mo und bei Schildern aus) ----- */
var ASG=[];
var AFG={Kotten:['bush','blumen','fels','bank','stamm','blumen','holz'],Viadukt:['laterne','blumen','fels','bank','bush','stamm','laterne'],Tunnel:['pfeiler','kiste','lampe','fass','pfeiler','rohr'],Schmiede:['feuer','fels','zaun','bank','lampion','feuer','tanne'],Ufer:['schilf','blumen','fels','bank','tanne','schilf','stamm'],Staumauer:['laterne','blumen','bank','bush','fels','laterne','zaun'],Sandstein:['farn','fels','stamm','holz','farn','fels','bush'],Hardenstein:['mauerrest','farn','tanne','fels','stamm','mauerrest','bush']};
function aFade(q){var a=.4+.6*cl((Math.abs(q-150)-30)/110,0,1);for(var i=0;i<ASG.length;i++)a=Math.min(a,cl((Math.abs(q-ASG[i])-70)/60,0,1));return a}
function gbFgTree(k,px,by){
 x.fillStyle='rgba(0,0,0,.18)';x.beginPath();x.ellipse(px+4,by,k==='tanne'?36:26,5,0,0,6.3);x.fill();
 if(k==='tanne'){var P=S[cur],sp=gbSpr('fg|'+cur,function(){gbFichte(mix(P.tree[1],'#000000',.35),mix(P.tree[1],'#000000',.52),1,true)});x.drawImage(sp,px-100,by-200,200,212);return}
 x.fillStyle='#3b2a1c';x.beginPath();x.moveTo(px-20,by);x.quadraticCurveTo(px-11,by-8,px-9,by-34);x.lineTo(px-8,by-172);x.lineTo(px+8,by-172);x.lineTo(px+9,by-34);x.quadraticCurveTo(px+12,by-8,px+22,by);x.closePath();x.fill();
 x.fillStyle='#5a4430';x.beginPath();x.moveTo(px-20,by);x.quadraticCurveTo(px-11,by-8,px-9,by-34);x.lineTo(px-8,by-172);x.lineTo(px-3,by-172);x.lineTo(px-4,by-34);x.quadraticCurveTo(px-6,by-8,px-8,by);x.closePath();x.fill();
 x.strokeStyle='#241810';x.lineWidth=1.4;x.beginPath();for(var i=0;i<9;i++){var yy=by-12-i*18,xx=px-5+(i%3)*5;x.moveTo(xx,yy);x.lineTo(xx+(i%2?1.6:-1.4),yy-12)}x.stroke();
 x.fillStyle='#1a120a';x.beginPath();x.ellipse(px+2,by-80,3.4,6,0,0,6.3);x.fill();
 x.fillStyle='#5f8a3a';x.beginPath();x.ellipse(px-8,by-40,5,12,0,0,6.3);x.ellipse(px-16,by-4,15,4.4,0,0,6.3);x.fill();x.fillStyle='#7aa84a';x.beginPath();x.ellipse(px-9,by-44,2.4,6,0,0,6.3);x.fill()}
function aFgItem(k,px,by,ts){
 if(GFG[k]){gbFgItem(k,px,by,ts);return}
 if(g.bonus===5&&(k==='tanne'||k==='stamm')){gbFgTree(k,px,by);return}
 var tt=ts/1000,i;
 if(k==='bush'){x.fillStyle='rgba(0,0,0,.18)';x.beginPath();x.ellipse(px,by-1,42,5,0,0,6.3);x.fill();[['#2a5a26',0,-12,28,16],['#2a5a26',-24,-8,20,12],['#2a5a26',24,-8,20,12],['#3f8a3a',-4,-18,20,11],['#4f9a48',10,-20,10,6]].forEach(function(e){ellc(px+e[1],by+e[2],e[3],e[4],e[0])});x.fillStyle='#e8d85a';[[-10,-14],[8,-22],[18,-8]].forEach(function(d){x.beginPath();x.arc(px+d[0],by+d[1],1.8,0,6.3);x.fill()})}
 else if(k==='blumen'){var cs=['#e24b3a','#f2c94c','#fff','#c06ad8','#f08a2a'];for(i=0;i<7;i++){var fx=px-24+i*8,fh=16+(i*5)%14,sw=Math.sin(tt*1.4+i)*1.6;x.strokeStyle='#2f6a2a';x.lineWidth=1.6;x.beginPath();x.moveTo(fx,by);x.quadraticCurveTo(fx+sw,by-fh*.5,fx+sw*1.5,by-fh);x.stroke();x.fillStyle=cs[i%5];x.beginPath();x.arc(fx+sw*1.5,by-fh,3.4,0,6.3);x.fill();x.fillStyle='#fff3b0';x.beginPath();x.arc(fx+sw*1.5,by-fh,1.2,0,6.3);x.fill()}}
 else if(k==='fels'){x.fillStyle='rgba(0,0,0,.2)';x.beginPath();x.ellipse(px+2,by,34,5,0,0,6.3);x.fill();x.fillStyle='#7d838a';x.beginPath();x.moveTo(px-32,by);x.quadraticCurveTo(px-34,by-26,px-10,by-34);x.quadraticCurveTo(px+14,by-42,px+30,by-14);x.lineTo(px+32,by);x.closePath();x.fill();x.fillStyle='#9aa0a6';x.beginPath();x.moveTo(px-20,by-24);x.quadraticCurveTo(px-6,by-36,px+8,by-32);x.quadraticCurveTo(px-4,by-26,px-20,by-24);x.fill();x.fillStyle='#5f8a3a';x.beginPath();x.ellipse(px-18,by-3,10,3,0,0,6.3);x.fill()}
 else if(k==='bank'){x.fillStyle='rgba(0,0,0,.18)';x.beginPath();x.ellipse(px,by,36,4,0,0,6.3);x.fill();x.fillStyle='#4a3322';x.fillRect(px-28,by-18,4,18);x.fillRect(px+24,by-18,4,18);x.fillStyle='#8a5a34';x.fillRect(px-32,by-24,64,7);x.fillStyle='#a06a3c';x.fillRect(px-32,by-24,64,2);x.fillStyle='#7a4a2a';x.fillRect(px-30,by-44,60,6);x.fillRect(px-30,by-36,60,5);x.fillStyle='#4a3322';x.fillRect(px-28,by-44,3,22);x.fillRect(px+25,by-44,3,22)}
 else if(k==='stamm'){x.fillStyle='#3b2a1c';x.beginPath();x.moveTo(px-12,by);x.lineTo(px-8,by-170);x.lineTo(px+8,by-170);x.lineTo(px+13,by);x.closePath();x.fill();x.fillStyle='rgba(255,255,255,.1)';x.fillRect(px-6,by-168,3,166);x.strokeStyle='#2a1c12';x.lineWidth=1.2;x.beginPath();x.moveTo(px+2,by-30);x.lineTo(px+4,by-80);x.moveTo(px-4,by-60);x.lineTo(px-3,by-120);x.stroke();x.fillStyle='#4f8a3a';x.beginPath();x.ellipse(px-14,by-3,14,4,0,0,6.3);x.fill()}
 else if(k==='holz'){x.fillStyle='rgba(0,0,0,.18)';x.beginPath();x.ellipse(px,by,34,4,0,0,6.3);x.fill();[[-22,-8],[-8,-8],[6,-8],[20,-8],[-15,-23],[-1,-23],[13,-23],[-8,-38],[6,-38]].forEach(function(d,j){x.fillStyle='#8a5a34';x.beginPath();x.arc(px+d[0],by+d[1]+2,7.2,0,6.3);x.fill();x.fillStyle='#d3a56d';x.beginPath();x.arc(px+d[0],by+d[1]+2,5,0,6.3);x.fill();x.strokeStyle='#a97a46';x.lineWidth=.8;x.beginPath();x.arc(px+d[0],by+d[1]+2,2.6,0,6.3);x.stroke()})}
 else if(k==='laterne'){x.fillStyle='rgba(0,0,0,.18)';x.beginPath();x.ellipse(px,by,14,3,0,0,6.3);x.fill();x.fillStyle='#2f3a30';x.fillRect(px-3,by-124,6,124);x.fillRect(px-8,by-10,16,10);x.fillRect(px-5,by-28,10,4);x.fillStyle='#2f3a30';x.fillRect(px-9,by-134,18,6);var gl=x.createRadialGradient(px,by-146,2,px,by-146,34);gl.addColorStop(0,'rgba(255,226,140,.55)');gl.addColorStop(1,'rgba(255,226,140,0)');x.fillStyle=gl;x.beginPath();x.arc(px,by-146,34,0,6.3);x.fill();x.fillStyle='#fff0b0';x.beginPath();x.roundRect(px-6,by-158,12,18,2);x.fill();x.strokeStyle='#2f3a30';x.lineWidth=1.6;x.stroke();zPl('#2f3a30',[px-9,by-158,px,by-166,px+9,by-158])}
 else if(k==='pfeiler'){x.fillStyle='#2a2024';x.fillRect(px-9,by-190,18,190);x.fillStyle='#3a2c30';x.fillRect(px-9,by-190,5,190);x.fillStyle='#1a1214';x.fillRect(px-16,by-8,32,8);x.fillRect(px-13,by-196,26,8);x.fillStyle='#6a5a5e';for(i=0;i<8;i++){x.beginPath();x.arc(px+4,by-24-i*22,1.4,0,6.3);x.fill()}x.fillStyle='rgba(255,110,80,.14)';x.fillRect(px+9,by-190,6,190)}
 else if(k==='kiste'){x.fillStyle='rgba(0,0,0,.25)';x.beginPath();x.ellipse(px,by,34,4,0,0,6.3);x.fill();[[-14,0,26],[14,0,26],[0,-26,26]].forEach(function(c){x.fillStyle='#6b4a2a';x.fillRect(px+c[0]-c[2]/2,by+c[1]-26,c[2],26);x.strokeStyle='#3a2a18';x.lineWidth=1.4;x.strokeRect(px+c[0]-c[2]/2,by+c[1]-26,c[2],26);x.beginPath();x.moveTo(px+c[0]-c[2]/2,by+c[1]-26);x.lineTo(px+c[0]+c[2]/2,by+c[1]);x.stroke()})}
 else if(k==='lampe'){x.fillStyle='#2a2a30';x.fillRect(px-2,by-52,4,52);x.fillRect(px-8,by-5,16,5);var pu=.7+.3*Math.sin(tt*3);var rg=x.createRadialGradient(px,by-60,2,px,by-60,44);rg.addColorStop(0,'rgba(255,90,70,'+(.5*pu)+')');rg.addColorStop(1,'rgba(255,90,70,0)');x.fillStyle=rg;x.beginPath();x.arc(px,by-60,44,0,6.3);x.fill();x.fillStyle='#e24b3a';x.beginPath();x.arc(px,by-60,8,0,6.3);x.fill();x.fillStyle='#ffd0c0';x.beginPath();x.arc(px-2,by-62,2.4,0,6.3);x.fill()}
 else if(k==='fass'){x.fillStyle='rgba(0,0,0,.25)';x.beginPath();x.ellipse(px,by,22,4,0,0,6.3);x.fill();x.fillStyle='#7a4a24';x.beginPath();x.roundRect(px-18,by-40,36,40,12);x.fill();x.strokeStyle='#2a1a0c';x.lineWidth=3;x.beginPath();x.moveTo(px-17,by-30);x.lineTo(px+17,by-30);x.moveTo(px-17,by-10);x.lineTo(px+17,by-10);x.stroke();x.strokeStyle='rgba(255,255,255,.12)';x.lineWidth=1.4;x.beginPath();x.moveTo(px-6,by-38);x.lineTo(px-6,by-2);x.stroke()}
 else if(k==='rohr'){x.fillStyle='rgba(0,0,0,.25)';x.beginPath();x.ellipse(px,by,46,4,0,0,6.3);x.fill();x.fillStyle='#5a5258';x.fillRect(px-44,by-18,88,14);x.fillStyle='#7a727a';x.fillRect(px-44,by-18,88,4);x.fillStyle='#3a3238';x.fillRect(px-46,by-22,6,22);x.fillRect(px+40,by-22,6,22);x.fillRect(px-4,by-22,8,22)}
 else if(k==='feuer'){x.fillStyle='rgba(0,0,0,.22)';x.beginPath();x.ellipse(px,by,22,4,0,0,6.3);x.fill();var fg2=x.createRadialGradient(px,by-46,2,px,by-46,60);fg2.addColorStop(0,'rgba(255,150,60,.5)');fg2.addColorStop(1,'rgba(255,150,60,0)');x.fillStyle=fg2;x.beginPath();x.arc(px,by-46,60,0,6.3);x.fill();x.strokeStyle='#2a2028';x.lineWidth=3;x.beginPath();x.moveTo(px-14,by);x.lineTo(px-7,by-30);x.moveTo(px+14,by);x.lineTo(px+7,by-30);x.stroke();x.fillStyle='#2a2028';x.beginPath();x.moveTo(px-14,by-34);x.lineTo(px+14,by-34);x.lineTo(px+9,by-26);x.lineTo(px-9,by-26);x.closePath();x.fill();
  for(i=0;i<3;i++){var fh=16+8*Math.sin(tt*9+i*2);x.fillStyle=i===1?'#ffd36a':'#ff8a2a';x.beginPath();x.moveTo(px-8+i*8,by-34);x.quadraticCurveTo(px-9+i*8,by-34-fh*.6,px-8+i*8+Math.sin(tt*7+i)*2,by-34-fh);x.quadraticCurveTo(px-3+i*8,by-34-fh*.5,px-3+i*8,by-34);x.fill()}}
 else if(k==='zaun'){x.fillStyle='#3a2c32';for(i=0;i<5;i++)x.fillRect(px-36+i*18,by-34,5,34);x.fillRect(px-38,by-28,76,4);x.fillRect(px-38,by-14,76,4)}
 else if(k==='lampion'){x.fillStyle='#3a2c32';x.fillRect(px-2,by-120,4,120);x.strokeStyle='#4a3a3a';x.lineWidth=1.2;x.beginPath();x.moveTo(px,by-116);x.lineTo(px+28,by-106);x.moveTo(px,by-116);x.lineTo(px-28,by-106);x.stroke();[['#e24b3a',-28],['#f2c94c',0],['#3a8c3f',28]].forEach(function(l,j){var ly=by-100+(j===1?-8:0),gl2=x.createRadialGradient(px+l[1],ly,1,px+l[1],ly,22);gl2.addColorStop(0,'rgba(255,220,150,.45)');gl2.addColorStop(1,'rgba(255,220,150,0)');x.fillStyle=gl2;x.beginPath();x.arc(px+l[1],ly,22,0,6.3);x.fill();x.fillStyle=l[0];x.beginPath();x.ellipse(px+l[1],ly,6,8,0,0,6.3);x.fill();x.fillStyle='rgba(255,255,255,.35)';x.fillRect(px+l[1]-3,ly-5,2,6)})}
 else if(k==='tanne'){x.fillStyle='#2a2230';x.fillRect(px-3,by-14,6,14);for(i=0;i<4;i++){var w=14+i*8,top=by-96+i*19;x.beginPath();x.moveTo(px,top);x.lineTo(px+w,top+30);x.lineTo(px-w,top+30);x.closePath();x.fill()}}}
function aFront(ts){
 var list=AFG[cur],FL=1680,fo=D*1.6,mfg=(g.mode==='title'||g.mode==='intro')?0:Math.min(1,g.run/150);
 if(!list||mfg<=0)return;
 for(var i=0;i<list.length;i++){var base=i*(FL/list.length)+60,p=md(base-fo,FL),k=list[i],by=H-3-((i*5)%9);
  [p,p-FL].forEach(function(q){if(q>-70&&q<W+70){var a=aFade(q)*mfg;if(a>.03){x.globalAlpha=a;aFgItem(k,q,by,ts);x.globalAlpha=1}}})}}
function frame(ts0){
 var ts;if(g.paused){if(!pauseT0)pauseT0=ts0;ts=pauseT0-pauseSh}else{if(pauseT0){pauseSh+=ts0-pauseT0;pauseT0=0}ts=ts0-pauseSh}
 NOW=ts;
 var dt=g.paused?0:Math.min(.05,(ts0-last)/1000||0);last=ts0;
 if(!g.paused)update(dt);
 var P=S[cur];
 if(g.mode==='map'){x.save();drawMap(ts);x.restore();muteIcon();wasserzeichen();if(msgT>0)msgT-=dt;bubble();requestAnimationFrame(frame);return}
 if(g.mode==='film'){x.save();drawFilm(g.tFilm);x.restore();filmUI();wasserzeichen();muteIcon();if(msgT>0)msgT-=dt;bubble();requestAnimationFrame(frame);return}
 x.save();
 if(g.shake>0)x.translate((Math.random()-.5)*7*g.shake*2,(Math.random()-.5)*7*g.shake*2);
 if(isBonusScene())bonusScene(ts);else{
 for(var i=0;i<4;i++){x.fillStyle=P.sky[i];x.fillRect(0,i*H/4,W,H/4+1)}
 if(P.night){x.fillStyle='#e8ecf6';for(var s=0;s<34;s++){x.globalAlpha=.4+.6*Math.abs(Math.sin(ts/700+s));x.fillRect((s*97)%W,(s*53)%120,s%4?1.6:2.6,s%4?1.6:2.6)}x.globalAlpha=1}
 if(P.night){
  x.fillStyle='rgba(244,236,200,.08)';x.beginPath();x.arc(520,72,48,0,6.3);x.fill();
  x.fillStyle='rgba(244,236,200,.12)';x.beginPath();x.arc(520,72,38,0,6.3);x.fill();
  x.fillStyle=P.sun;x.beginPath();x.arc(520,72,28,0,6.3);x.fill();
  x.fillStyle='rgba(176,166,126,.5)';x.beginPath();x.arc(511,64,5.5,0,6.3);x.arc(529,82,7,0,6.3);x.arc(527,58,3.4,0,6.3);x.arc(508,84,3,0,6.3);x.arc(536,68,2.4,0,6.3);x.fill();
 }else{
  x.fillStyle='rgba(255,255,255,.16)';x.beginPath();x.arc(520,72,44,0,6.3);x.fill();x.fillStyle='rgba(255,255,255,.2)';x.beginPath();x.arc(520,72,36,0,6.3);x.fill();
  x.fillStyle=P.sun;x.beginPath();x.arc(520,72,28,0,6.3);x.fill();
 }
 mountains(D*.05,P);
 var ca=P.night?.18:.85;cloud(md(120-D*.06,W+160)-80,58,1.1,ca);cloud(md(340-D*.04,W+160)-80,92,.8,ca*.9);cloud(md(560-D*.07,W+160)-80,40,.9,ca);
 if(!P.night&&!P.snow){bird(md(260-ts*.03,W+60)-30,70+Math.sin(ts/900)*4,ts/90);bird(md(300-ts*.03,W+60)-30,82+Math.sin(ts/800)*4,ts/84+1);bird(md(240-ts*.03,W+60)-30,90+Math.sin(ts/700)*4,ts/95+2)}
 if(!g.bonus){if(cur==='Sommer'){var stz=Math.floor(g.run/STAGE);if(stz===1)bruecke(ts,P);else if(stz===5)zeppelin(ts)}else if(cur==='Frühling')burg(ts,P);else if(cur==='Herbst')dom(ts,P);else if(cur==='Winter')huette(ts,P)}
 hills(D*.1,160,22,2,0,10,5,1.3,P.hill[0],'rgba(255,255,255,.35)');
 x.fillStyle=P.night?'rgba(60,80,120,.25)':'rgba(255,255,255,.3)';x.fillRect(0,170,W,16);
 hills(D*.2,182,18,3,2,8,7,.4,P.hill[1],'rgba(255,255,255,.3)');
 hut(P,D*.2,ts);
 layer(P,D*.35,205,34,46,true,3);
 layer(P,D*.65,GY,96,96,false,6);
 x.fillStyle='rgba(0,0,0,.14)';x.fillRect(0,GY,W,H-GY);
 x.fillStyle=P.gr;x.fillRect(0,GY,W,H-GY);
 x.fillStyle='rgba(255,255,255,.22)';x.fillRect(0,GY,W,2);
 fence(P,D);
 deco(P,D,GY+8,GY+24,30,1);
 signpost(P,g.run);if(!g.bonus&&cur==='Frühling')landSign(1300,'Schloss Burg');if(!g.bonus&&cur==='Sommer'&&Math.floor(g.run/STAGE)===1)landSign(zSignX('muen',STAGE+1000),'Müngsten');
 x.fillStyle=P.path;x.beginPath();x.moveTo(0,FY-8);
 for(var q=0;q<=W;q+=10)x.lineTo(q,FY-8+Math.sin((q+D)/70)*2);
 x.lineTo(W,FY+16);for(var q2=W;q2>=0;q2-=10)x.lineTo(q2,FY+16+Math.sin((q2+D)/90)*2);x.closePath();x.fill();
 x.fillStyle='rgba(0,0,0,.07)';for(var rr=0;rr<2;rr++){x.fillRect(0,FY+(rr?9:-2),W,3)}
 for(var pb=0;pb<26;pb++){var pq=md(pb*53-D,LOOP);if(pq<W){x.fillStyle=pb%3?'rgba(0,0,0,.12)':'rgba(255,255,255,.2)';x.beginPath();x.ellipse(pq,FY-4+R(pb)*18,2.2+R(pb+1)*2,1.2,0,0,6.3);x.fill()}}
 deco(P,D*1.12,FY+22,FY+34,22,1.25);
 startHut(P,ts);goalHut(P,ts);}itemsDraw(ts);
 g.obs.forEach(function(o){var X=ox(o);if(X>-60&&X<W+60)obst(o.t,X,g.run*.07,o)});
 g.obs.forEach(function(o){if(!o.lab||o.done||o.hit||g.mode!=='play'||g.paused)return;var X=ox(o);if(X<180||X>W+20)return;labelPill(X,o.t==='eagle'?FY-(78+(X>300?Math.min(110,(X-300)*.55):0))-52:FY-HH[o.t]-4,o.lab)});
 var px=g.mode==='intro'?g.mx:150,gy=FY-mm.y,moA=g.mode==='title'?0:(g.mode==='intro'?g.moA:1);
 if(moA>0){x.globalAlpha=moA;shadow(px,Math.max(8,18-mm.y*.08));x.globalAlpha=1}
 var sx=1,sy=1;
 if(mm.air){sy=1+Math.min(.1,-mm.vy/5600);sx=1/sy}else if(mm.sq>0){sy=1-mm.sq*.8;sx=1+mm.sq*.7}
 x.save();
 x.globalAlpha=moA*((g.inv>0&&Math.floor(ts/80)%2)?.45:1);
 x.translate(px,gy);
 if(mm.hurt>0)x.rotate(-.35*mm.hurt/.9);
 x.scale(.115*sx,.115*sy);x.translate(-335,-872);
 var ef=eatInfo();mo(ts,mm.air,mm.ph,g.gs<8&&!mm.air&&!g.walk,mm.dk,mm.sit,ef?(ef.open?2:1):0);
 if(ef){x.save();x.translate(lp(505,496,ef.up),lp(322,272,ef.up));x.rotate(lp(.05,-.12,ef.up));x.scale(6,6);x.translate(-13.6*(1-ef.len),4);rollDraw(ef.len);x.restore()}
 x.restore();
 if(ef)eatCrumbs(px,gy,ef);
 if(isBonusScene())bonusFront(ts);else{
 drawParts(P,ts,D);
 x.fillStyle=P.fg;
 var o=D*1.3;for(var b=0;b<90;b++){var bx=md(b*15-o,LOOP);[bx,bx-LOOP].forEach(function(qq){if(qq>-12&&qq<W+12){var hh=14+(b*7)%14;x.beginPath();x.moveTo(qq-5,H);x.lineTo(qq+(b%2?-3:3),H-hh);x.lineTo(qq+5,H);x.closePath();x.fill()}})}
 var FL=1680,fo=D*1.7,mfg=(g.mode==='title'||g.mode==='intro')?0:Math.min(1,g.run/150);
 [0,560,1120].forEach(function(base,bi){var p=md(base+330-fo,FL),k0=Math.floor((base+330-fo)/FL);[[p,k0],[p-FL,k0-1]].forEach(function(pp){var q=pp[0];if(q>-90&&q<W+90){var a=(.3+.7*Math.min(1,Math.max(0,(Math.abs(q-150)-30)/110)))*mfg,id=pp[1]*3+bi;if(a>.02)fgTree(P,q,a,bi*7+3,((id%5)+5)%5===2)}})});
 }
 x.restore();
 fade();
 if(!g.clean&&g.mode!=='title'&&g.mode!=='intro'){hud();drawFx(ts);pfandUI(ts)}
 if(!g.clean){banner2();introUI(ts);titel(ts);zeugnis(ts)}wasserzeichen();if(!g.clean){pauseUI();muteIcon();pauseIcon()}
 if(msgT>0)msgT-=dt;if(g.mode!=='title'||true)bubble();
 requestAnimationFrame(frame)}
requestAnimationFrame(frame);
})();
