/* Mo’s Hike Quest. © 2026 mitrilmo. Alle Rechte vorbehalten. Lädt nichts nach und speichert nichts. */
(function(){
var cv=document.getElementById('c'),x=cv.getContext('2d'),NOW=0;x.scale(2,2);
var W=680,H=340,GY=252,FY=286,LOOP=1350;
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
var cur='Frühling';
function R(i){var v=Math.sin(i*127.1+311.7)*43758.5453;return v-Math.floor(v)}
function md(v,m){return((v%m)+m)%m}
function mix(a,b,t){function p(h){return[parseInt(h.substr(1,2),16),parseInt(h.substr(3,2),16),parseInt(h.substr(5,2),16)]}var A=p(a),B=p(b);return'rgb('+A.map(function(v,i){return Math.round(v+(B[i]-v)*t)}).join(',')+')'}
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
function layer(P,o,gy,sp,hh,far,dx){
 var n=Math.ceil(LOOP/sp),det=!far;
 [1,0].forEach(function(sh){for(var i=0;i<n;i++){
  var bx=i*sp+(R(i)*sp*.4),h=hh+R(i+3)*hh*.35,p=md(bx-o,LOOP);
  [p,p-LOOP].forEach(function(q){if(q>-70&&q<W+70){var xx=q+(sh?dx:0),yy=gy+(sh?3:0);
   var c1=far?mix(P.tree[0],P.hill[1],.55):P.tree[0],c2=far?mix(P.tree[1],P.hill[1],.55):P.tree[1];
   if(P.k==='autumn'&&!far){var a=['#b5651d','#d08a2a','#c2461e','#8f7a2a'];c1=a[i%4];c2=a[(i+1)%4]}
   if(P.pine){if(P.snow&&i%5===0&&!far)bare(xx,yy,h,sh,det);else pine(xx,yy,h,c1,c2,P.snow,sh,det)}
   else if(i%4===0)birch(xx,yy,h,P.k==='autumn'?'#e0b030':c1,sh,det,i);
   else round(xx,yy,h,c1,c2,sh,det,i)}})}});
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
var LOGO=new Image(),LOGOOK=false;LOGO.onload=function(){LOGOOK=true};LOGO.src='data:image/jpeg;base64,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';
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
function fl(k,ph,fn){var sh=Math.sin(ph+k)*26,lf=Math.max(0,Math.cos(ph+k))*22;x.save();x.translate(sh,-lf);fn();x.restore()}
function foxVec(ts,ph){ph=ph||0;
 var tw=Math.sin(ts/380)*.035,hb=Math.sin(ts/300)*3;
 x.save();x.translate(570,420);x.rotate(tw);x.translate(-570,-420);
 F('#f07a14');x.fill(FTAIL);
 x.save();x.clip(FTAIL);F('#d65a05');x.fill(FTAILSHADE);F('#fdf3e2');x.fill(FTAILWHITE);x.restore();
 x.restore();
 F('#c24f04');cap(680,590,650,690,42,26);fl(0,ph,function(){F('#2f180c');cap(650,695,690,770,28,28);ell(722,776,64,27)});
 F('#c24f04');cap(1040,560,1105,690,52,26);fl(3.14,ph,function(){F('#2f180c');cap(1110,695,1160,766,29,28);ell(1204,772,62,26)});
 F('#f07a14');x.fill(FBODY);
 x.save();x.clip(FBODY);F('#f78b20');x.fill(FBACKLIGHT);F('rgba(200,80,0,.55)');x.fill(FHAUNCH);F('#fdf0dc');x.fill(FBELLY);x.restore();
 F('#f07a14');cap(535,548,440,690,78,30);
 K('rgba(170,60,0,.4)',7);x.beginPath();x.arc(535,548,70,2.35,3.55);x.stroke();
 fl(3.14,ph,function(){F('#2f180c');cap(432,695,432,770,31,31);ell(458,776,66,27)});
 F('#f07a14');cap(985,568,935,690,60,31);
 F('rgba(190,70,0,.3)');x.beginPath();x.moveTo(930,610);x.quadraticCurveTo(905,660,905,690);x.lineTo(925,692);x.quadraticCurveTo(930,650,950,610);x.closePath();x.fill();
 fl(0,ph,function(){F('#2f180c');cap(933,695,938,770,29,29);ell(968,778,64,27)});
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
 if(cur!=='Nacht')return;
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
function mo(ts,air,ph,idle,duck,sitP){
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
 pole(fw[0],fw[1],ftx,fty,true);
 drawLeg(HF,fA,true,fl,fs);
 drawLeg(HN,nA,false,nl,ns);
 x.save();x.translate(0,-bob);
 if(dk>.001||sit>.001){x.translate(0,DY);x.translate(PX,PY);x.rotate(TH);x.translate(-PX,-PY)}
 if(air){x.translate(300,600);x.rotate(.07);x.translate(-300,-600)}
 F('#d95a0a');cap(430,395,480,462,36,31);
 F('#f0e2c8');cap(486,455,496,478,29,27);
 gripHand(537,478,-Math.atan2(ftl[0]-fh[0],ftl[1]-fh[1]),1,true);
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
 F('#f56a10');cap(278,372,252,452,42,37);cap(252,452,316,488,37,31);
 F('rgba(150,50,0,.25)');cap(262,400,246,448,16,14);
 F('#f0e2c8');x.beginPath();x.moveTo(284,448);x.lineTo(334,470);x.lineTo(322,520);x.lineTo(284,506);x.closePath();x.fill();
 F('rgba(0,0,0,.08)');x.beginPath();x.moveTo(310,458);x.lineTo(334,470);x.lineTo(322,520);x.lineTo(304,513);x.closePath();x.fill();
 pole(nh[0],nh[1],ntl[0],ntl[1],false);
 gripHand(382,498,-Math.atan2(ntl[0]-nh[0],ntl[1]-nh[1]),1.22,false);
 F('#8a5a34');x.fill(HAIRB);F('#6f4526');x.beginPath();x.moveTo(262,235);x.bezierCurveTo(258,262,272,288,292,296);x.bezierCurveTo(276,278,270,256,276,232);x.closePath();x.fill();
 F('#f0b48c');x.fill(FACE);
 F('#8a5a34');x.fill(HAIRF);
 F('#a06c40');x.beginPath();x.moveTo(300,172);x.bezierCurveTo(330,160,364,160,390,170);x.bezierCurveTo(364,172,336,180,310,194);x.closePath();x.fill();
 K('#6f4526',3);x.beginPath();x.moveTo(300,200);x.bezierCurveTo(320,190,346,186,372,184);x.stroke();
 F('#b89d7a');x.fill(BEARD);
 F('#f0b48c');ell(332,232,27,27);K('#d98a66',6);x.beginPath();x.arc(334,234,13,.6,4.4);x.stroke();
 F('#5e3a1c');x.fill(SIDEBURN);
 F('#6e4426');x.fill(MOUSTACHE);
 if(air){F('#6e2a1c');x.beginPath();x.ellipse(462,266,22,16,.12,0,6.3);x.fill();F('#c9625a');x.beginPath();x.ellipse(462,274,12,7,.12,0,6.3);x.fill()}
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
function obst(t,px,fph){
 if(t==='eagle'){var eb=78+(px>300?Math.min(110,(px-300)*.55):px<20?Math.min(110,(20-px)*.8):0);x.fillStyle='rgba(0,0,0,'+(.2*(1-(eb-78)/130))+')';x.beginPath();x.ellipse(px,FY+2,34*(1-(eb-78)/200),4.5,0,0,6.3);x.fill();x.save();x.translate(px,FY+1-eb);x.scale(-.14,.14);x.translate(-372,-322);eagleVec(NOW);x.restore();return}
 shadow(px,t==='bear'?60:t==='wolf'?38:t==='fox'?30:19);
 if(t==='bear'){x.save();x.translate(px,FY+1);x.scale(.17,.17);x.translate(-336,-346);bearVec(NOW,px<340&&px>-20?Math.min(1,(340-px)/50):0);x.restore();return}
 if(t==='wolf'){x.save();x.translate(px,FY+1);x.scale(-.055,.055);x.translate(-800,-800);wolfVec(NOW,fph);x.restore();return}
 if(t==='fox'){x.save();x.translate(px,FY+1);x.scale(-.042,.042);x.translate(-800,-800);foxVec(NOW,fph);x.restore();return}
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
 fail:function(t){[392,349,311,262].forEach(function(f,i){tone(t+i*.22,f,f*.97,.4,'sawtooth',.14)})}
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
var REMARK={'1':'Fehlerfrei. Der Wegweiser vermutet Betrug.','2':'Ein Ausrutscher. Menschlich. Vermerkt.','3':'Angekommen. Wie, ist nicht Gegenstand des Zeugnisses.','4':'Knapp nicht angekommen. Das nennt man Charakter.','5':'Der Weg war da. Mo auch. Das reicht nicht ganz.','6':'Nächstes Mal bitte in die andere Richtung.'};
var HW={log:26,mush:17,rock:22,fox:20,wolf:26,bear:32,eagle:24},HH={log:33,mush:30,rock:36,fox:28,wolf:38,bear:38,eagle:30};
var APP={fox:.45,wolf:.3,eagle:.55},OFF={fox:183,wolf:136,eagle:209};
function pick(a){return a[Math.floor(Math.random()*a.length)]}
var mm={y:0,vy:0,air:false,sq:0,ph:0,hurt:0,buf:0,dk:0,sit:0,duckT:0,duckKey:false,duckPtr:false,hold:false};
var g={mode:'title',run:0,gs:0,wuerde:3,hits:0,dodged:0,stage:0,inv:0,slow:0,shake:0,obs:[],won:false,tOver:0,tr:-1,pend:null,ban:0,chat:5,log:[],q:null,hint:0,paused:false,items:[],funde:0,fundMax:0,fx:[],bump:0,lastGold:-9999,hutOpen:0,tIn:0,il:-1,lt:0,mx:150,moA:0,walk:false};
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
function ox(o){var k=APP[o.t];return k?o.bx-g.run-k*Math.max(0,g.run-(o.bx-W-60)):o.bx-g.run}
function banner(s){if(s>0)sfx('stage');g.ban=3.2;say(SLINE[s],6.5)}
function start(){mm.sit=0;g.hint=9;g.log=[];g.q=null;mm.hold=false;mm.dk=0;mm.duckT=0;mm.duckKey=false;mm.duckPtr=false;mm.y=0;mm.vy=0;mm.air=false;mm.sq=0;mm.hurt=0;mm.buf=0;
 g.mode='play';g.run=0;g.wuerde=3;g.hits=0;g.dodged=0;g.stage=0;g.inv=0;g.slow=0;g.shake=0;g.won=false;g.obs=genObs();g.items=genItems(g.obs);if(g.obs.length)g.obs[0].lab='Springen!';for(var li=0;li<g.obs.length;li++)if(g.obs[li].t==='eagle'){g.obs[li].lab='Ducken!';break}g.funde=0;g.fundMax=0;g.fx=[];g.bump=0;g.lastGold=-9999;g.chat=9;
 g.tr=0;g.pend=SEA[0];sfx('start');banner(0)}
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
var NAMEN={brot:'Brotdose',thermo:'Thermoskanne',riegel:'Müsliriegel',apfel:'Apfel',gold:'Goldener Hut'};
var FUNDTXT={
 brot:['Eine Brotdose. Inhalt: Butterbrot, Alter unbekannt. Mo nimmt es trotzdem.','Verlorene Brotdose. Der Wegweiser hat nichts gesehen.'],
 thermo:['Thermoskanne, noch warm. Der Besitzer war wohl in Eile.','Kaffee gefunden. Die Etappe ist gerettet.'],
 riegel:['Ein Müsliriegel. Mo isst ihn im Gehen, das zählt als Pause.','Müsliriegel eingesteckt. Nuss, Honig, kein Gewissen.'],
 apfel:['Ein Apfel. Auf dem Weg gefunden, also Bio.','Apfel gefunden. Der Wurm kommt ungefragt mit.'],
 gold:['Ein goldener Hut. Ein Leben zurück. Der Wegweiser ist beinahe gerührt.','Goldener Hut gefunden. Wer so etwas verliert, hat wohl viele.']};
function genItems(obs){
 var it=[],base=function(o){return o.bx-(OFF[o.t]||0)},bs=obs.map(base).sort(function(a,b){return a-b}),mids=[];
 for(var i=0;i+1<bs.length;i++){if(bs[i+1]-bs[i]>=330)mids.push((bs[i]+bs[i+1])/2)}
 var kinds=['brot','thermo','riegel','apfel'],used={};
 /* erste Fundstelle vor dem ersten Hindernis, mit Hinweis */
 it.push({k:'brot',bx:520,state:0,seen:false,tut:true});
 /* Goldene-Hut-Plätze: einer je Etappe, werden erst im Spiel aktiv, wenn Mo ein Leben verloren hat */
 for(var st=0;st<NST;st++){[1700].forEach(function(off){var t=st*STAGE+off,bi=-1,bd=1e9;mids.forEach(function(m,j){var d=Math.abs(m-t);if(!used[j]&&d<bd){bd=d;bi=j}});if(bi>=0&&bd<450){used[bi]=1;it.push({k:'goldslot',bx:mids[bi],state:0,seen:false})}})}
 /* normale Funde in etwa jeder zweiten Lücke */
 mids.forEach(function(m,j){if(!used[j]&&m>900&&Math.random()<.5)it.push({k:kinds[Math.floor(Math.random()*kinds.length)],bx:m,state:0,seen:false})});
 return it}
function twinkle(tx,ty,ts,ph){var q=(Math.sin(ts/260+ph)+1)/2;x.fillStyle='rgba(255,255,255,'+(.3+.6*q)+')';x.beginPath();x.moveTo(tx,ty-4*q-1);x.lineTo(tx+1.3,ty-1.3);x.lineTo(tx+4*q+1,ty);x.lineTo(tx+1.3,ty+1.3);x.lineTo(tx,ty+4*q+1);x.lineTo(tx-1.3,ty+1.3);x.lineTo(tx-4*q-1,ty);x.lineTo(tx-1.3,ty-1.3);x.closePath();x.fill()}
function itemDraw(it,X,ts){
 var k=it.k;
 x.fillStyle='rgba(0,0,0,.18)';x.beginPath();x.ellipse(X+1,FY+2,k==='gold'?17:13,3,0,0,6.3);x.fill();
 if(k==='gold'){var gl=.4+.14*Math.sin(ts/300),gg=x.createRadialGradient(X,FY-8,2,X,FY-8,30);gg.addColorStop(0,'rgba(255,226,110,'+gl+')');gg.addColorStop(1,'rgba(255,226,110,0)');x.fillStyle=gg;x.beginPath();x.arc(X,FY-8,30,0,6.3);x.fill()}
 if(k==='brot'){
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
 else if(k==='gold'){
  x.fillStyle='#a8791a';x.beginPath();x.ellipse(X,FY-3,17,4.4,0,0,6.3);x.fill();
  x.fillStyle='#e8b830';x.beginPath();x.ellipse(X,FY-4.6,17,4.4,0,0,6.3);x.fill();
  x.fillStyle='#f6d457';x.beginPath();x.ellipse(X,FY-5.4,9.5,9,0,Math.PI,0);x.fill();
  x.fillStyle='#9a6f12';x.fillRect(X-9.4,FY-7.4,18.8,3.2);
  x.fillStyle='#fff7d0';x.beginPath();x.moveTo(X-8,FY-9);x.quadraticCurveTo(X-17,FY-18,X-22,FY-22);x.quadraticCurveTo(X-12,FY-20,X-6,FY-10);x.closePath();x.fill()}
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
   it.state=1;g.funde++;var gold=it.k==='gold';
   if(gold){g.wuerde=Math.min(3,g.wuerde+1);g.lastGold=g.run}
   sfx(gold?'gold':'fund');
   var tx=pick(FUNDTXT[it.k]);note(tx,'fund');g.q={t:tx,s:5.5,age:0};
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
function endRun(w){sfx(w?'win':'fail');g.mode='over';g.won=w;g.tOver=0;say(pick(w?WINS:FAILS),9)}
function hitMo(o){sfx('hit');g.wuerde--;g.hits++;g.inv=1.6;g.slow=.7;g.shake=.35;mm.air=true;mm.vy=-360;mm.hurt=.9;mm.sq=0;
 var htx=pick(HIT[o.t]);note(htx,'hit');say(htx,6.5);g.q=null;if(g.wuerde<=0)endRun(false)}
function jumpNow(){sfx('jump');mm.air=true;mm.vy=-560;mm.sq=-.1}
function jump(){
 if(g.mode==='title'){introStart();return}
 if(g.mode==='intro'){introTap();return}
 if(g.mode==='over'){if(g.tOver>(g.won?3.2:.9))start();return}
 if(!mm.air)jumpNow();else mm.buf=.14}
cv.addEventListener('pointerdown',function(e){e.preventDefault();var rc=cv.getBoundingClientRect(),lx=(e.clientX-rc.left)/rc.width*W,ly=(e.clientY-rc.top)/rc.height*H;if(g.paused){if(lx>W-34&&ly>H-40){muted=!muted;if(!muted)sfx('ok')}else setPause(false);return}
if(g.mode==='play'&&lx>W-58&&lx<=W-34&&ly>H-40){setPause(true);return}
if(g.mode==='intro'&&lx>W-104&&ly<38){endIntro();return}if(lx>W-34&&ly>H-40){muted=!muted;if(!muted)sfx('ok');return}if(g.mode==='play'&&ly>H*.66){mm.duckPtr=true;mm.duckT=.45;return}mm.hold=true;jump()});
function duckOff(){mm.duckPtr=false;mm.hold=false}
cv.addEventListener('pointerup',duckOff);cv.addEventListener('pointercancel',duckOff);cv.addEventListener('pointerleave',duckOff);
window.addEventListener('keydown',function(e){
 if(g.paused){if(e.code==='KeyP'||e.code==='Escape'||e.code==='Space'||e.code==='Enter'||e.code==='ArrowUp'||e.code==='KeyW'){e.preventDefault();setPause(false)}else if(e.code==='KeyM'){muted=!muted;if(!muted)sfx('ok')}return}
 if((e.code==='KeyP'||e.code==='Escape')&&g.mode==='play'){e.preventDefault();setPause(true);return}
 if(e.code==='Escape'&&g.mode==='intro'){endIntro();return}
 if(e.code==='KeyM'){muted=!muted;if(!muted)sfx('ok');return}
 if(e.code==='Space'||e.code==='ArrowUp'||e.code==='KeyW'||e.code==='Enter'){e.preventDefault();mm.hold=true;if(!e.repeat)jump()}
 if(e.code==='ArrowDown'||e.code==='KeyS'){e.preventDefault();mm.duckKey=true;if(!e.repeat)mm.duckT=.45}});
window.addEventListener('keyup',function(e){if(e.code==='ArrowDown'||e.code==='KeyS')mm.duckKey=false;if(e.code==='Space'||e.code==='ArrowUp'||e.code==='KeyW'||e.code==='Enter')mm.hold=false});
window.addEventListener('blur',function(){if(g.mode==='play')setPause(true)});
document.addEventListener('visibilitychange',function(){if(document.hidden&&g.mode==='play')setPause(true)});
function update(dt){
 var target=g.mode==='play'?(150+g.stage*14)*(g.slow>0?.5:1)*(g.run>TOTAL-360?Math.max(.28,(TOTAL-g.run)/360):1):0;
 g.gs+=(target-g.gs)*Math.min(1,dt*(g.mode==='over'?2.5:5));
 if(g.gs<1)g.gs=0;
 D+=g.gs*dt;
 if(g.mode!=='title')g.run+=g.gs*dt;
 g.inv=Math.max(0,g.inv-dt);g.slow=Math.max(0,g.slow-dt);g.shake=Math.max(0,g.shake-dt);g.ban=Math.max(0,g.ban-dt);if(g.mode==='play')g.hint=Math.max(0,g.hint-dt);mm.hurt=Math.max(0,mm.hurt-dt);mm.buf=Math.max(0,mm.buf-dt);
 if(g.tr>=0){g.tr+=dt/1.1;if(g.tr>=.5&&g.pend){cur=g.pend;g.pend=null}if(g.tr>=1)g.tr=-1}
 if(g.mode==='over')g.tOver+=dt;
 if(g.mode==='intro')introStep(dt);
 mm.duckT=Math.max(0,mm.duckT-dt);mm.sit+=(((g.mode==='over'&&!g.won&&!mm.air)?1:0)-mm.sit)*Math.min(1,dt*3.5);mm.dk+=(((!mm.air&&g.mode==='play'&&(mm.duckKey||mm.duckPtr||mm.duckT>0))?1:0)-mm.dk)*Math.min(1,dt*20);
 if(mm.air){mm.vy+=((mm.hold&&mm.vy<0)?1100:1500)*dt;mm.y-=mm.vy*dt;if(mm.y<=0){mm.y=0;mm.air=false;mm.vy=0;mm.sq=.2;sfx('land');if(mm.buf>0){mm.buf=0;jumpNow()}}}
 else{if(g.gs>6)mm.ph+=dt*9*Math.max(.6,g.gs/150);var stp=Math.floor(mm.ph/Math.PI);if(stp!==mm.stp){mm.stp=stp;if(g.gs>20)sfx('step')}if(mm.sq>0)mm.sq=Math.max(0,mm.sq-dt*.9)}
 if(g.mode!=='play')return;
 var st=Math.min(NST-1,Math.floor(g.run/STAGE));
 if(st!==g.stage){g.stage=st;g.tr=0;g.pend=SEA[st];banner(st)}
 for(var i=0;i<g.obs.length&&g.mode==='play';i++){var o=g.obs[i],X=ox(o),hw=HW[o.t];
  if(!o.hit&&g.inv<=0&&Math.abs(X-150)<hw+2&&(o.t==='eagle'?(!(mm.dk>.5&&!mm.air)&&mm.y<128):mm.y<HH[o.t]*.7)){o.hit=true;hitMo(o)}
  if(!o.done&&X<150-hw-12){o.done=true;if(!o.hit){g.dodged++;sfx('ok');if(Math.random()<.4){var dtx=pick(DODGE[o.t]);note(dtx,'dodge');g.q={t:dtx,s:5.5,age:0}}}}}
 itemsStep(dt);
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
function bubble(){
 if(msgT<=0)return;var a=Math.min(1,msgT);x.globalAlpha=a;
 x.font='13px system-ui,sans-serif';var t='Wegweiser: '+msg,w=Math.min(W-32-(g.mode==='intro'?Math.round(90*FB)+8:0),x.measureText(t).width+28);
 var bh=Math.round(30*(1+(FB-1)*.8));x.fillStyle='rgba(0,0,0,.18)';x.beginPath();x.roundRect(18,17,w,bh,8);x.fill();
 x.fillStyle='#fbf3e0';x.beginPath();x.roundRect(16,14,w,bh,8);x.fill();
 x.fillStyle='#4b3320';x.fillRect(16,14,6,bh);
 x.fillStyle='#3a2918';x.fillText(t,32,14+bh/2+4.5*FB,w-24);x.globalAlpha=1}
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
 x.fillText('Etappe '+(g.stage+1)+'/6 · '+Math.min(2000,Math.round(g.run/PXM))+' m',bx+bw-10,by+hh/2+4.5*FB);x.textAlign='left';
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
 x.fillStyle='#7a5a38';x.font='11px system-ui,sans-serif';x.fillText('ETAPPE '+(g.stage+1)+' VON 6',W/2+2,116);
 x.fillStyle='#3a2918';x.font='bold 24px Georgia,serif';x.fillText(SNAME[g.stage],W/2+2,145);
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
function zeugnis(ts){
 if(g.mode!=='over')return;
 var a=Math.min(1,Math.max(0,(g.tOver-(g.won?2.6:.7))*2));if(a<=0)return;
 x.globalAlpha=a;
 var cx=330,cw=250,ch=276,cy=48+(1-a)*14,gr=grade();
 fbDicht();x.fillStyle='rgba(0,0,0,.25)';x.beginPath();x.roundRect(cx-cw/2+4,cy+5,cw,ch,6);x.fill();
 x.fillStyle='#fbf3e0';x.beginPath();x.roundRect(cx-cw/2,cy,cw,ch,6);x.fill();
 x.strokeStyle='#b8925a';x.lineWidth=2;x.beginPath();x.roundRect(cx-cw/2+7,cy+7,cw-14,ch-14,4);x.stroke();
 x.textAlign='center';
 x.fillStyle='#3a2918';x.font='bold 26px Georgia,serif';x.fillText('Zeugnis',cx,cy+40);
 x.font='12px system-ui,sans-serif';x.fillStyle='#7a5a38';x.fillText(g.won?'Mo hat die Hütte erreicht.':'Mo hat die Hütte nicht erreicht.',cx,cy+58,cw-30);
 var rows=[['Strecke',Math.min(2000,Math.round(g.run/PXM))+' von 2000 m'],['Etappe',(g.stage+1)+' von 6'],['Hindernisse umgangen',String(g.dodged)],['Stürze',String(g.hits)],['Funde',g.funde+' von '+g.fundMax]];
 x.font='12px system-ui,sans-serif';
 rows.forEach(function(r,i){var yy=cy+84+i*19;x.fillStyle='#6b4a2a';x.textAlign='left';x.fillText(r[0],cx-109,yy);x.textAlign='right';x.fillStyle='#3a2918';x.fillText(r[1],cx+109,yy);
  x.fillStyle='rgba(0,0,0,.08)';x.fillRect(cx-109,yy+5,218,1)});
 x.textAlign='center';x.fillStyle='#a0481a';x.font='bold 19px Georgia,serif';x.fillText('Note: '+gr[0]+' ('+gr[1]+')',cx,cy+203);
 x.font='italic 12px system-ui,sans-serif';x.fillStyle='#4b3320';
 wrap('Wegweiser: '+REMARK[gr[0]],cw-50).forEach(function(l,i){x.fillText(l,cx,cy+221+i*15)});
 if(g.tOver>(g.won?3.2:.9)&&Math.floor(ts/600)%2){x.font='bold 12px system-ui,sans-serif';x.fillStyle='#4a8c3f';x.fillText('Leertaste oder Tippen: nochmal',cx,cy+ch-12)}
 protokoll(a,cx,cw,cy,ch);
 x.textAlign='left';x.globalAlpha=1;FQ=FB}
function fade(){
 if(g.tr<0)return;var al=.92*(1-Math.abs(2*g.tr-1));
 x.fillStyle='rgba(20,18,28,'+al+')';x.fillRect(0,0,W,H)}

if(/[?&]dev(=|&|$)/.test(location.search))window.__game={g:g,mm:mm,start:start,jump:jump,update:update,ox:ox,set:function(k,v){g[k]=v}};
function frame(ts0){
 var ts;if(g.paused){if(!pauseT0)pauseT0=ts0;ts=pauseT0-pauseSh}else{if(pauseT0){pauseSh+=ts0-pauseT0;pauseT0=0}ts=ts0-pauseSh}
 NOW=ts;
 var dt=g.paused?0:Math.min(.05,(ts0-last)/1000||0);last=ts0;
 if(!g.paused)update(dt);
 var P=S[cur];
 x.save();
 if(g.shake>0)x.translate((Math.random()-.5)*7*g.shake*2,(Math.random()-.5)*7*g.shake*2);
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
 signpost(P,g.run);
 x.fillStyle=P.path;x.beginPath();x.moveTo(0,FY-8);
 for(var q=0;q<=W;q+=10)x.lineTo(q,FY-8+Math.sin((q+D)/70)*2);
 x.lineTo(W,FY+16);for(var q2=W;q2>=0;q2-=10)x.lineTo(q2,FY+16+Math.sin((q2+D)/90)*2);x.closePath();x.fill();
 x.fillStyle='rgba(0,0,0,.07)';for(var rr=0;rr<2;rr++){x.fillRect(0,FY+(rr?9:-2),W,3)}
 for(var pb=0;pb<26;pb++){var pq=md(pb*53-D,LOOP);if(pq<W){x.fillStyle=pb%3?'rgba(0,0,0,.12)':'rgba(255,255,255,.2)';x.beginPath();x.ellipse(pq,FY-4+R(pb)*18,2.2+R(pb+1)*2,1.2,0,0,6.3);x.fill()}}
 deco(P,D*1.12,FY+22,FY+34,22,1.25);
 startHut(P,ts);goalHut(P,ts);itemsDraw(ts);
 g.obs.forEach(function(o){var X=ox(o);if(X>-60&&X<W+60)obst(o.t,X,g.run*.07)});
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
 mo(ts,mm.air,mm.ph,g.gs<8&&!mm.air&&!g.walk,mm.dk,mm.sit);
 x.restore();
 drawParts(P,ts,D);
 x.fillStyle=P.fg;
 var o=D*1.3;for(var b=0;b<90;b++){var bx=md(b*15-o,LOOP);[bx,bx-LOOP].forEach(function(qq){if(qq>-12&&qq<W+12){var hh=14+(b*7)%14;x.beginPath();x.moveTo(qq-5,H);x.lineTo(qq+(b%2?-3:3),H-hh);x.lineTo(qq+5,H);x.closePath();x.fill()}})}
 var FL=1680,fo=D*1.7,mfg=(g.mode==='title'||g.mode==='intro')?0:Math.min(1,g.run/150);
 [0,560,1120].forEach(function(base,bi){var p=md(base+330-fo,FL),k0=Math.floor((base+330-fo)/FL);[[p,k0],[p-FL,k0-1]].forEach(function(pp){var q=pp[0];if(q>-90&&q<W+90){var a=(.3+.7*Math.min(1,Math.max(0,(Math.abs(q-150)-30)/110)))*mfg,id=pp[1]*3+bi;if(a>.02)fgTree(P,q,a,bi*7+3,((id%5)+5)%5===2)}})});
 x.restore();
 fade();
 if(g.mode!=='title'&&g.mode!=='intro'){hud();drawFx(ts)}
 banner2();introUI(ts);titel(ts);zeugnis(ts);wasserzeichen();pauseUI();muteIcon();pauseIcon();
 if(msgT>0)msgT-=dt;if(g.mode!=='title'||true)bubble();
 requestAnimationFrame(frame)}
requestAnimationFrame(frame);
})();
