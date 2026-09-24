import * as THREE from 'three';

// Millimetres. One scene and one coordinate system for the tin and all samples.
export const TIN = {width:140, length:90, depth:19, corner:12, wall:0.65};
export function roundedPath(width, height, radius, hole=false) {
  const s=hole?new THREE.Path():new THREE.Shape(), x=-width/2,y=-height/2,r=radius;
  s.moveTo(x+r,y);s.lineTo(x+width-r,y);s.quadraticCurveTo(x+width,y,x+width,y+r);
  s.lineTo(x+width,y+height-r);s.quadraticCurveTo(x+width,y+height,x+width-r,y+height);
  s.lineTo(x+r,y+height);s.quadraticCurveTo(x,y+height,x,y+height-r);
  s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);s.closePath();return s;
}
function sheet(w,h,r,thickness,material) {
  const g=new THREE.ExtrudeGeometry(roundedPath(w,h,r),{depth:thickness,bevelEnabled:false,curveSegments:20});
  const mesh=new THREE.Mesh(g,material);mesh.castShadow=true;mesh.receiveShadow=true;return mesh;
}
function shell(w,h,r,depth,wall,material) {
  const outline=roundedPath(w,h,r);outline.holes.push(roundedPath(w-2*wall,h-2*wall,r-wall,true));
  const g=new THREE.ExtrudeGeometry(outline,{depth,bevelEnabled:false,curveSegments:24});
  const mesh=new THREE.Mesh(g,material);mesh.castShadow=true;mesh.receiveShadow=true;return mesh;
}
function rim(w,h,r,z,material) {
  const path=roundedPath(w,h,r).getPoints(160).map(p=>new THREE.Vector3(p.x,p.y,z));
  const curve=new THREE.CatmullRomCurve3(path,true,'centripetal');
  const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,200,.55,8,true),material);mesh.castShadow=true;return mesh;
}
function paperTexture() {
  const c=document.createElement('canvas');c.width=512;c.height=768;const ctx=c.getContext('2d');
  ctx.fillStyle='#eeeee7';ctx.fillRect(0,0,512,768);
  // Fixed seed keeps the original material reproducible across devices.
  let seed=1847;const rand=()=>((seed=(seed*16807)%2147483647)-1)/2147483646;
  for(let i=0;i<22000;i++){const v=rand()>.5?255:150;ctx.fillStyle=`rgba(${v},${v},${v},${.025+rand()*.05})`;ctx.fillRect(rand()*512,rand()*768,1,1+rand()*3);}
  for(const [y,tilt] of [[95,12],[652,-9]]) {const g=ctx.createLinearGradient(0,y-5,0,y+7);g.addColorStop(0,'rgba(100,105,95,0)');g.addColorStop(.5,'rgba(100,105,95,.1)');g.addColorStop(.65,'rgba(255,255,255,.25)');g.addColorStop(1,'rgba(100,105,95,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,y-7);ctx.lineTo(512,y+tilt-7);ctx.lineTo(512,y+tilt+7);ctx.lineTo(0,y+7);ctx.fill();}
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
function brushedMetalTexture() {
  const c=document.createElement('canvas');c.width=1024;c.height=1024;const ctx=c.getContext('2d');
  ctx.fillStyle='#808080';ctx.fillRect(0,0,1024,1024);
  let seed=215;const rand=()=>((seed=(seed*16807)%2147483647)-1)/2147483646;
  for(let i=0;i<4300;i++){const v=rand()>.5?200:70;ctx.strokeStyle=`rgba(${v},${v},${v},${.025+rand()*.045})`;ctx.lineWidth=.4+rand()*.3;const x=rand()*1024,y=rand()*1024;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+40+rand()*400,y+.5);ctx.stroke();}
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(1/140,1/90);t.offset.set(.5,.5);return t;
}
function interiorTexture(){
  const c=document.createElement('canvas');c.width=1024;c.height=660;const x=c.getContext('2d');
  const g=x.createLinearGradient(0,0,1024,660);g.addColorStop(0,'#919b9b');g.addColorStop(.13,'#c5cccb');g.addColorStop(.38,'#edf0eb');g.addColorStop(.7,'#b8c2c0');g.addColorStop(1,'#98a2a1');x.fillStyle=g;x.fillRect(0,0,1024,660);
  x.save();x.strokeStyle='#313d4288';x.lineWidth=23;x.filter='blur(15px)';x.beginPath();x.roundRect(3,3,1018,654,70);x.stroke();x.restore();
  let seed=393;for(let i=0;i<2400;i++){seed=seed*16807%2147483647;const y=seed%660;seed=seed*16807%2147483647;const a=seed%1024;x.strokeStyle=i%2?'#ffffff10':'#2537380a';x.lineWidth=.6;x.beginPath();x.moveTo(a,y);x.lineTo(a+80+(seed%200),y);x.stroke();}
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(1/136,1/86);t.offset.set(.5,.5);return t;
}
export function createTin(environment) {
  const group=new THREE.Group();group.name='tin_silver_01';
  const metal=new THREE.MeshStandardMaterial({color:0xc2c8cb,metalness:1,roughness:.31,envMap:environment,envMapIntensity:1.15,bumpMap:brushedMetalTexture(),bumpScale:.06,side:THREE.DoubleSide});
  const inner=metal.clone();inner.roughness=.42;inner.color.set(0xbcc4c7);inner.map=interiorTexture();
  const bright=metal.clone();bright.roughness=.23;
  const tray=new THREE.Group();tray.name='tray';group.add(tray);
  tray.add(sheet(140,90,12,.8,inner));tray.add(shell(140,90,12,19,.65,metal));
  tray.add(rim(139.5,89.5,11.8,18.8,bright));tray.add(rim(139,89,11.5,1.5,metal));
  const liner=sheet(135,85,10,.15,new THREE.MeshStandardMaterial({map:paperTexture(),color:0xffffff,roughness:.98,side:THREE.DoubleSide}));
  liner.position.z=.86;liner.name='lining_white_folded_01';tray.add(liner);
  const lidPivot=new THREE.Group();lidPivot.position.set(0,46.4,19.8);group.add(lidPivot);
  const lid=new THREE.Group();lid.position.set(0,-46.4,0);lid.name='lid';lidPivot.add(lid);
  const top=sheet(141.5,91.5,12.5,.65,metal);top.position.z=3.7;lid.add(top);
  const crown=new THREE.Mesh(new THREE.ExtrudeGeometry(roundedPath(138.5,88.5,11),{depth:.2,bevelEnabled:true,bevelThickness:.7,bevelSize:1.2,bevelSegments:5,curveSegments:24}),metal);
  crown.position.z=4.35;crown.castShadow=true;crown.receiveShadow=true;lid.add(crown);
  lid.add(shell(141.5,91.5,12.5,3.7,.6,metal));lid.add(rim(141,91,12.2,.1,bright));
  const inset=sheet(135.5,85.5,10,.18,inner);inset.position.z=3.45;lid.add(inset);
  for(const x of [-43,43]) {
    const hinge=new THREE.Mesh(new THREE.CylinderGeometry(1.6,1.6,13,16),bright);
    hinge.rotation.z=Math.PI/2;hinge.position.set(x,46.4,19.8);hinge.castShadow=true;group.add(hinge);
    const leaf=new THREE.Mesh(new THREE.BoxGeometry(13,6,.45),metal);leaf.position.set(x,43.7,18.6);group.add(leaf);
  }
  // Negative rotation lifts the front edge above the tray. Hinge sits outside both shells.
  // At -186 degrees the far edge rests above the desk; interior faces the viewer.
  lidPivot.rotation.x=THREE.MathUtils.degToRad(-186);
  return {group,tray,lid,lidPivot,liner,setColor(color){metal.color.set(color);bright.color.set(color);},setOpen(amount){lidPivot.rotation.x=THREE.MathUtils.degToRad(-186*amount);}};
}

export function makeStudioEnvironment(renderer) {
  const studio=new THREE.Scene();studio.background=new THREE.Color(0xb9c0c1);
  const panel=(w,h,color,intensity,x,y,z)=>{
    const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:new THREE.Color(color).multiplyScalar(intensity),side:THREE.DoubleSide}));
    m.position.set(x,y,z);m.lookAt(0,0,0);studio.add(m);
  };
  panel(350,500,0xffffff,3,-250,200,350);panel(150,400,0xffffff,1.5,250,-50,200);
  panel(600,100,0x414b50,.7,0,-200,100);panel(80,450,0x20272c,.8,-400,0,0);
  const pmrem=new THREE.PMREMGenerator(renderer);const env=pmrem.fromScene(studio,.04,1,1500,{size:128});
  studio.traverse(o=>{if(o.isMesh){o.geometry.dispose();o.material.dispose();}});pmrem.dispose();return env;
}
