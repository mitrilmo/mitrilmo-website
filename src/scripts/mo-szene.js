/* Mo-Szenen für die Wissensseiten. © 2026 mitrilmo.
   Die Zeichenfunktionen (Palette, Hügel, Bäume, Zaun, Hütte, Fuchs, Mo) sind aus dem Spiel „Mo’s Hike Quest“ (src/game/mos-hike-quest.js)
   übernommen und laufen hier in einer eigenen Hülle (bauSzene). Das Skript lädt nichts nach und speichert nichts.
   Erzeugt mit einem einmaligen Schneide-Skript, danach von Hand erweitert (Ablauf, Rad, Wolken, Tageszeit). */

var SAISON = { fruehling: 'Frühling', sommer: 'Sommer', herbst: 'Herbst', winter: 'Winter' };

function bauSzene(cv, art, phase, saison) {
  var x = cv.getContext('2d'); x.scale(2, 2);
  var NOW = 0, W = 680, H = 340, GY = 252, FY = 286, LOOP = 1350, cur = saison;
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
function shadow(px,w){x.fillStyle='rgba(0,0,0,.2)';x.beginPath();x.ellipse(px,FY+2,w,4,0,0,6.3);x.fill()}
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
function fl(k,ph,fn){var sh=Math.sin(ph+k)*120,lf=Math.max(0,Math.cos(ph+k))*60; /* Schritt und Hub größer als im Spiel (dort 26 und 22), weil der Fuchs hier sehr klein ist; FUCHS_SCHRITT = 120 * .042 = 5 px */x.save();x.translate(sh,-lf);fn();x.restore()}
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


/* Sitzpose auf dem Rad (eigene Zeichnung, aus mo() abgeleitet): Rumpf nach vorn geneigt um das Becken, ohne Stöcke,
   Beine folgen den Pedalen, Hände am Lenker. Koordinaten in Mo-Einheiten (Mo steht bei 335 / 872 auf dem Boden, Maßstab .115). */
function moRad(ts,ph,B){
 var TH=.42,H0=B.hip,CX=B.bb[0],CY=B.bb[1],RC=B.rc;
 function lok(w){var ux=w[0]-H0[0],uy=w[1]-H0[1],c=Math.cos(-TH),sn=Math.sin(-TH);return[335+ux*c-uy*sn,600+ux*sn+uy*c]}
 var G=lok(B.grip),SF=[430,395],SN=[278,372],GN=[G[0]-24,G[1]+6],GF=G;
 function pedal(a){return[CX+RC*Math.cos(a),CY+RC*Math.sin(a)]}
 function fuss(pd){return[pd[0]-32,pd[1]-92]}
 var pn=pedal(ph),pf=pedal(ph+Math.PI);
 function kurbel(pd,far){K(far?'#3c3c42':'#26262b',34);x.beginPath();x.moveTo(CX,CY);x.lineTo(pd[0],pd[1]);x.stroke();F(far?'#3c3c42':'#26262b');x.beginPath();x.roundRect(pd[0]-48,pd[1]-8,96,26,8);x.fill()}
 function arm(S,Gp,col,r1,r2,r3,hr){var el=ik(S,Gp,95,80,1);F(col);capA(S,el,r1,r2);capA(el,Gp,r2,r3);F('#2b2b30');ell(Gp[0],Gp[1],hr+2,hr-4,.3)}
 function helm(){
  /* Fahrradhelm statt Hut: grüne Schale, helle Lüftungsschlitze, kleiner Schirm vorn, Kinnriemen */
  K('#26262b',5);x.beginPath();x.moveTo(352,198);x.lineTo(356,262);x.stroke();
  F('#2a6634');x.beginPath();x.moveTo(282,214);x.bezierCurveTo(272,128,336,86,396,86);x.bezierCurveTo(458,86,500,134,500,200);x.lineTo(500,212);x.bezierCurveTo(440,190,340,192,282,214);x.closePath();x.fill();
  F('#3a8446');x.beginPath();x.moveTo(300,170);x.bezierCurveTo(310,122,350,98,396,98);x.bezierCurveTo(430,98,462,112,480,140);x.bezierCurveTo(440,118,350,120,300,170);x.closePath();x.fill();
  K('rgba(255,255,255,.55)',9);[[336,128,330,186],[384,112,380,186],[432,118,432,188]].forEach(function(v){x.beginPath();x.moveTo(v[0],v[1]);x.lineTo(v[2],v[3]);x.stroke()});
  F('#1d4a26');x.beginPath();x.moveTo(486,196);x.bezierCurveTo(516,194,540,204,550,218);x.lineTo(478,214);x.closePath();x.fill();
  F('rgba(0,0,0,.18)');x.beginPath();x.moveTo(282,214);x.bezierCurveTo(340,192,440,190,500,212);x.lineTo(500,218);x.bezierCurveTo(440,198,340,198,282,222);x.closePath();x.fill();
  F('#f2c230');x.beginPath();x.roundRect(380,86,26,10,4);x.fill();
 }
 var HN=[H0[0]-8,H0[1]],HF=[H0[0]+8,H0[1]];
 kurbel(pf,true);
 drawLeg(HF,fuss(pf),true,0,0);
 x.save();x.translate(H0[0],H0[1]);x.rotate(TH);x.translate(-335,-600);
 arm(SF,GF,'#d95a0a',36,31,27,30);
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
  arm(SN, GN, '#f56a10', 42, 37, 31, 34);
 F('#8a5a34');x.fill(HAIRB);F('#6f4526');x.beginPath();x.moveTo(262,235);x.bezierCurveTo(258,262,272,288,292,296);x.bezierCurveTo(276,278,270,256,276,232);x.closePath();x.fill();
 F('#f0b48c');x.fill(FACE);
 F('#8a5a34');x.fill(HAIRF);
 F('#a06c40');x.beginPath();x.moveTo(300,172);x.bezierCurveTo(330,160,364,160,390,170);x.bezierCurveTo(364,172,336,180,310,194);x.closePath();x.fill();
 K('#6f4526',3);x.beginPath();x.moveTo(300,200);x.bezierCurveTo(320,190,346,186,372,184);x.stroke();
 F('#b89d7a');x.fill(BEARD);
 F('#f0b48c');ell(332,232,27,27);K('#d98a66',6);x.beginPath();x.arc(334,234,13,.6,4.4);x.stroke();
 F('#5e3a1c');x.fill(SIDEBURN);
 F('#6e4426');x.fill(MOUSTACHE);
 if(false){F('#6e2a1c');x.beginPath();x.ellipse(462,266,22,16,.12,0,6.3);x.fill();F('#c9625a');x.beginPath();x.ellipse(462,274,12,7,.12,0,6.3);x.fill()}
 else{K('#5a3418',6);x.beginPath();x.moveTo(424,252);x.quadraticCurveTo(455,278,490,262);x.stroke()}
 F('#f29b88');ell(487,220,26,25);F('#f7b8a8');ell(478,210,9,7);
 var bl=(ts%3400)<140;
 if(bl){K('#15110e',7);x.beginPath();x.moveTo(418,206);x.quadraticCurveTo(436,216,456,204);x.stroke()}
 else{F('#ffffff');ell(436,205,22,false?29:26);F('#15110e');ell(447,203,10,14);F('#ffffff');ell(451,197,3.4,3.4)}
 K('#7a4a26',13);x.beginPath();var ra=false?-16:0;x.moveTo(408,180+ra);x.quadraticCurveTo(436,160+ra,478,184+ra);x.stroke();
 helm();
 x.restore();
 drawLeg(HN,fuss(pn),false,0,0);
 kurbel(pn,false);
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
  /* ---------- eigener Teil: Szene zusammensetzen ---------- */
  cur = saison; // der übernommene Spielcode setzt cur auf „Frühling“, hier gilt die Jahreszeit der Seite
  var SONNE = [[150, 104], [330, 52], [500, 96], [590, 150]];
  function sonne(P) {
    var s = SONNE[phase] || SONNE[0];
    x.fillStyle = 'rgba(255,255,255,.16)'; x.beginPath(); x.arc(s[0], s[1], 44, 0, 6.3); x.fill();
    x.fillStyle = 'rgba(255,255,255,.2)'; x.beginPath(); x.arc(s[0], s[1], 36, 0, 6.3); x.fill();
    x.fillStyle = phase === 3 ? '#ffb070' : P.sun; x.beginPath(); x.arc(s[0], s[1], 28, 0, 6.3); x.fill();
  }
  /* Fahrrad für Mo (kleiner Maßstab, passend zu seinen kurzen Beinen); Maße in Pixeln relativ zu Mo, Mo-Einheiten über U() */
  function U(dx, dy) { return [335 + dx / .115, 872 + dy / .115] }
  var BR = { hip: U(-12, -39), bb: U(-6, -10), grip: U(25, -41), rc: 43 };
  function fahrrad(px, D) {
    var r = 12, by = FY - r, ax = px - 30, fx = px + 24, rot = D / r;
    function rad(cx) {
      x.strokeStyle = '#26262b'; x.lineWidth = 2.8; x.beginPath(); x.arc(cx, by, r, 0, 6.3); x.stroke();
      x.strokeStyle = '#9aa0a6'; x.lineWidth = .7;
      for (var i = 0; i < 6; i++) { var a = rot + i * Math.PI / 6; x.beginPath(); x.moveTo(cx + Math.cos(a) * r, by + Math.sin(a) * r); x.lineTo(cx - Math.cos(a) * r, by - Math.sin(a) * r); x.stroke() }
    }
    x.fillStyle = 'rgba(0,0,0,.18)'; x.beginPath(); x.ellipse(px - 3, FY + 2, 44, 4, 0, 0, 6.3); x.fill();
    rad(ax); rad(fx);
    K('#4a8c3f', 3);
    x.beginPath(); x.moveTo(ax, by); x.lineTo(px - 6, FY - 10); x.lineTo(px - 12, FY - 35); x.lineTo(px + 17, FY - 33); x.lineTo(px - 6, FY - 10); x.moveTo(px - 12, FY - 35); x.lineTo(ax, by); x.moveTo(px + 17, FY - 33); x.lineTo(fx, by); x.stroke();
    K('#26262b', 2.6); x.beginPath(); x.moveTo(px + 17, FY - 33); x.lineTo(px + 22, FY - 40); x.moveTo(px + 20, FY - 41); x.lineTo(px + 30, FY - 41); x.moveTo(px - 17, FY - 37); x.lineTo(px - 5, FY - 37); x.stroke();
  }
  function fuchs(px, ts, ph, dir) { dir = dir || 1; shadow(px, 14); x.save(); x.translate(px, FY + 1); x.scale(.042 * dir, .042); x.translate(-800, -800); foxVec(ts, ph); x.restore() }
  /* Steinadler aus dem Spiel: kreist langsam über die Landschaft, Flügelschlag aus eagleVec */
  function adler(ts) {
    var t = ts / 7000, ex = W / 2 + Math.sin(t) * (W * .38), ey = 74 + Math.sin(t * 2.3) * 18, dir = Math.cos(t) >= 0 ? 1 : -1;
    x.save(); x.translate(ex, ey); x.scale(.085 * dir, .085); x.translate(-372, -322); eagleVec(ts * .35); x.restore();
  }

  var fuchsS = 0, fuchsX = 430, fuchsT = 0;
  return function (ts, D, ph, ziel) {
    NOW = ts;
    var P = S[cur];
    x.save();
    for (var i = 0; i < 4; i++) { x.fillStyle = P.sky[i]; x.fillRect(0, i * H / 4, W, H / 4 + 1) }
    sonne(P);
    mountains(D * .05, P);
    cloud(md(120 - D * .06, W + 160) - 80, 58, 1.1, .85); cloud(md(340 - D * .04, W + 160) - 80, 92, .8, .76); cloud(md(560 - D * .07, W + 160) - 80, 40, .9, .85);
    if (!P.snow) { bird(md(260 - ts * .03, W + 60) - 30, 70 + Math.sin(ts / 900) * 4, ts / 90); bird(md(300 - ts * .03, W + 60) - 30, 82 + Math.sin(ts / 800) * 4, ts / 84 + 1) }
    adler(ts);
    hills(D * .1, 160, 22, 2, 0, 10, 5, 1.3, P.hill[0], 'rgba(255,255,255,.35)');
    x.fillStyle = 'rgba(255,255,255,.3)'; x.fillRect(0, 170, W, 16);
    hills(D * .2, 182, 18, 3, 2, 8, 7, .4, P.hill[1], 'rgba(255,255,255,.3)');
    layer(P, D * .35, 205, 34, 46, true, 3);
    layer(P, D * .65, GY, 96, 96, false, 6);
    x.fillStyle = 'rgba(0,0,0,.14)'; x.fillRect(0, GY, W, H - GY);
    x.fillStyle = P.gr; x.fillRect(0, GY, W, H - GY);
    x.fillStyle = 'rgba(255,255,255,.22)'; x.fillRect(0, GY, W, 2);
    fence(P, D);
    deco(P, D, GY + 8, GY + 24, 30, 1);
    x.fillStyle = P.path; x.beginPath(); x.moveTo(0, FY - 8);
    for (var q = 0; q <= W; q += 10) x.lineTo(q, FY - 8 + Math.sin((q + D) / 70) * 2);
    x.lineTo(W, FY + 16); for (var q2 = W; q2 >= 0; q2 -= 10) x.lineTo(q2, FY + 16 + Math.sin((q2 + D) / 90) * 2);
    x.closePath(); x.fill();
    x.fillStyle = 'rgba(0,0,0,.07)'; for (var rr = 0; rr < 2; rr++) x.fillRect(0, FY + (rr ? 9 : -2), W, 3);
    deco(P, D * 1.12, FY + 22, FY + 34, 22, 1.25);
    if (ziel) hutDraw(P, ts, 520, 1, 'Hütte');
    var px = ziel ? 285 : 230;
    /* Beinphase aus der Strecke: Der Standfuß gleitet mit der Geschwindigkeit des Bodens (D * 1.12) zurück, Schritt 5 px je Radiant */
    var fph = D * 1.12 / 5;
    if (art === 'entdecken' && !ziel) fuchs(px + 190, ts, fph);
    if (art === 'wandern' && !ziel) fuchs(px - 125, ts, fph + 1.3); // trottet hinter Mo her
    if (ziel) { // streift vor der Hütte umher; Beine nach zurückgelegter Strecke
      var ft = ts / 3200, fx = 430 + Math.sin(ft) * 80;
      if (ts < fuchsT) fuchsS = 0; else fuchsS += Math.abs(fx - fuchsX);
      fuchsT = ts; fuchsX = fx;
      fuchs(fx, ts, fuchsS / 5, Math.cos(ft) >= 0 ? 1 : -1);
    }
    if (art === 'rad') {
      fahrrad(px, ziel ? 0 : D);
      x.save(); x.translate(px, FY); x.scale(.115, .115); x.translate(-335, -872);
      moRad(ts, ziel ? 2.4 : ph, BR);
      x.restore();
    } else {
      shadow(px, 18);
      x.save(); x.translate(px, FY); x.scale(.115, .115); x.translate(-335, -872);
      mo(ts, false, ph, !!ziel, 0, 0);
      x.restore();
    }
    x.fillStyle = P.fg;
    for (var b = 0; b < 90; b++) { var bx = md(b * 15 - D * 1.3, LOOP); [bx, bx - LOOP].forEach(function (qq) { if (qq > -12 && qq < W + 12) { var hh = 14 + (b * 7) % 14; x.beginPath(); x.moveTo(qq - 5, H); x.lineTo(qq + (b % 2 ? -3 : 3), H - hh); x.lineTo(qq + 5, H); x.closePath(); x.fill() } }) }
    /* Tageszeit: Morgen weich, Mittag klar, später Nachmittag warm, Abend orange-violett */
    if (phase === 0) { x.fillStyle = 'rgba(255,236,190,.10)'; x.fillRect(0, 0, W, H) }
    if (phase === 2) { x.fillStyle = 'rgba(255,150,70,.17)'; x.fillRect(0, 0, W, H) }
    if (phase === 3) { var gr = x.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, 'rgba(90,60,150,.30)'); gr.addColorStop(1, 'rgba(255,130,50,.20)'); x.fillStyle = gr; x.fillRect(0, 0, W, H) }
    x.restore();
  };
}

var D_START = [260, 1100, 700, 300];

function starteSzene(cv) {
  var art = cv.dataset.art || 'wandern', phase = Number(cv.dataset.phase) || 0, statisch = cv.hasAttribute('data-statisch');
  var ziel = phase === 3;
  var zeichne = bauSzene(cv, art, phase, SAISON[document.documentElement.getAttribute('data-season')] || 'Herbst');
  var D = D_START[phase] || 0, ph = 1.0, letzt = 0, laeuft = false, sichtbar = false, t0 = performance.now();
  var wenig = window.matchMedia('(prefers-reduced-motion: reduce)');
  var still = function () { return statisch || wenig.matches || !!cv.closest('.ruhe') };
  function einzel() { zeichne(1000, D, ph, ziel) }
  function tick(jetzt) {
    if (!sichtbar || still()) { laeuft = false; einzel(); return }
    var dt = Math.min(.05, (jetzt - letzt) / 1000 || 0); letzt = jetzt;
    var v = art === 'rad' ? 95 : 65;
    // zu Fuß: Mos Beinphase aus dem Bodentempo (Schritt 8 px je Radiant), damit seine Füße nicht über den Boden gleiten; Rad: Pedale unabhängig
    if (!ziel) { D += dt * v; ph += art === 'rad' ? dt * 9 * Math.max(.6, v / 150) : dt * v * 1.12 / 8 }
    zeichne(jetzt - t0, D, ph, ziel);
    requestAnimationFrame(tick);
  }
  function an() { if (laeuft) return; if (still()) { einzel(); return } laeuft = true; letzt = performance.now(); requestAnimationFrame(tick) }
  einzel();
  if (statisch || !('IntersectionObserver' in window)) { return }
  new IntersectionObserver(function (e) { sichtbar = e[0].isIntersecting; if (sichtbar) an() }).observe(cv);
  window.addEventListener('wissen-bewegung', function () { if (sichtbar) an(); else einzel() });
}

document.querySelectorAll('canvas[data-mo-szene]').forEach(starteSzene);
