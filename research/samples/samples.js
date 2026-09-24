import * as THREE from './vendor/three.module.js';
import {createTin, makeStudioEnvironment} from './tin-model.js';
import {makeTicketSVG,ticketDefaults} from './paper-template.js';

const inventory=window.TIN_INVENTORY;
const samples=inventory.objects.filter(a=>a.sample_material);
const order=['metal','paper','plastic','plush','transparent','cable'];
samples.sort((a,b)=>order.indexOf(a.sample_material)-order.indexOf(b.sample_material));
const names={metal:'Metal / 金属',paper:'Paper / 纸张',plastic:'Plastic / 塑料',plush:'Plush / 毛绒',transparent:'Clear / 透明',cable:'Cable / 线材'};
const notes={metal:'看匙齿与开孔是否可信，银色高光不应泛黄；检查深色背景上的边缘。',paper:'纤维、撕线和折痕保持克制；名称、日期和座位由模板绘制，可在下方修改。',plastic:'白色凹点、成型边缘与少量磨损。检查是否像一颗真实的廉价骰子。',plush:'保留短毛、接缝和小五金。重点检查轮廓有没有白边，以及与硬质物件的对比。',transparent:'检查空泡罩与金属背衬的区别、局部透明和撕口。叠在深浅背景上比较。',cable:'检查两只耳塞、Y 形分线与插头的连续性；线圈空隙应真正透出背景。'};
const statusText={prototype_ready:'原型就绪',planned:'待补齐',sample_in_progress:'制作中',sample_ready:'样品待审',revision_required:'需修整',approved:'已通过'};
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let ticketURL=URL.createObjectURL(new Blob([makeTicketSVG()],{type:'image/svg+xml'}));
const sourceOf=a=>a.id==='ticket_cream_01'?ticketURL:a.asset_path||`assets/${a.id}.png`;

document.querySelector('#sample-grid').innerHTML=samples.map((a,i)=>{
 const size=a.physical_size_mm;
 return `<article class="sample-card" data-id="${a.id}"><a class="sample-photo" data-material="${a.sample_material}" href="${sourceOf(a)}" target="_blank" rel="noopener" aria-label="查看${escape(a.name)}原图"><span class="sample-number">0${i+1} / ${a.sample_material.toUpperCase()}</span><img src="${sourceOf(a)}" alt="${escape(a.name)}透明底材质样品"></a><h3>${escape(a.name)}<span>${names[a.sample_material]}</span></h3><p>${notes[a.sample_material]}</p><p class="sample-meta">${size.width} × ${size.height} × ${size.depth} mm · ${a.source_method==='procedural_svg'?'原创 SVG 模板':'AI 预生成 / PNG'}</p><span class="sample-tag">${statusText[a.status]}</span></article>`;
}).join('');
document.querySelectorAll('.sample-photo img').forEach(img=>img.addEventListener('error',()=>{img.hidden=true;const p=document.createElement('span');p.className='placeholder';p.textContent='样品尚未就绪';img.after(p);}));
for(const a of samples){
 const card=document.querySelector(`[data-id="${a.id}"]`);
 if(a.alpha_bounds&&a.pixel_size){const b=a.alpha_bounds,p=a.pixel_size;const proportion=Math.max((b[2]-b[0])/p[0],(b[3]-b[1])/p[1]);card.querySelector('img').style.transform=`scale(${1/proportion})`;}
 if(a.qa?.visual_note){const note=document.createElement('p');note.className='qa-note';note.textContent=a.qa.visual_note;card.append(note);}
}
document.querySelectorAll('[data-background]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-background]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
 document.querySelectorAll('.sample-photo').forEach(p=>{p.classList.remove('dark','checker');if(button.dataset.background!=='light')p.classList.add(button.dataset.background);});
}));

document.querySelector('#inventory-list').innerHTML=inventory.objects.map((a,i)=>{
 const z=a.physical_size_mm;
 const fields=[['资产 ID',a.id],['物件族 / 变体',`${a.family} / ${a.variant}`],['分类 / 材质',`${a.category_label} / ${a.material}`],['标准尺寸',`${z.width} × ${z.height} × ${z.depth} mm，缩放 0.8–1.2×`],['来源 / 制作方式',a.source_method],['许可与外观检查',a.copyright_review],['抠图 / 正反面',`${a.needs_cutout?'真实透明底 alpha':'程序直接生成透明背景'}；首版正面，暂不需要反面`],['可自定义',a.customizable_fields.map(f=>f.label).join('、')||'无'],['反馈 / 越界',`${a.physics_feedback}；${a.allow_partial_overflow?'允许线材局部越界':'默认限制在所属空间'}`],['建议空间 / MVP',`${a.preferred_surface} / 是；不做物理模拟`],['来源记录',a.source.record],['资产文件',a.asset_path||'尚未生产']];
 return `<details class="inventory-item"><summary><span class="idx">${String(i+1).padStart(2,'0')}</span><span>${escape(a.name)}</span><span class="cat">${a.category_label}</span><span class="dim">${z.width} × ${z.height} mm</span><span class="state ${a.status==='sample_ready'?'ready':''}">${statusText[a.status]}</span></summary><div class="inventory-details">${fields.map(([key,value])=>`<p><b>${key}</b>${escape(value)}</p>`).join('')}</div></details>`;
}).join('');

const host=document.querySelector('#studio-canvas');
const status=document.querySelector('#scene-status');
const toggle=document.querySelector('#lid-toggle');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let renderer,scene,camera,tin,ticketMesh,render,animationId;
let lidAmount=1,lidTarget=1;
const loaded=[];
window.TIN_SAMPLE_STATE={stage:'loading',loaded,errors:[],displayed_dimensions:{},open:true,gate:'B_approved'};
const loadImage=src=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error(`Cannot load ${src}`));img.src=src;});
function textureFromImage(img,bounds) {
  const b=bounds||[0,0,img.width,img.height];
  const canvas=document.createElement('canvas');canvas.width=b[2]-b[0];canvas.height=b[3]-b[1];
  canvas.getContext('2d').drawImage(img,b[0],b[1],canvas.width,canvas.height,0,0,canvas.width,canvas.height);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());return texture;
}
async function addObject(a,position) {
 const img=await loadImage(sourceOf(a));
 const texture=textureFromImage(img,a.alpha_bounds);
 const size=a.physical_size_mm;
 // Cutouts already contain photographic shading. Preserve their neutral source colors.
 const material=new THREE.MeshBasicMaterial({map:texture,transparent:true,alphaTest:.07,side:THREE.FrontSide,depthWrite:true,toneMapped:false});
 const ratio=texture.image.width/texture.image.height;
 const height=Math.min(size.height,size.width/ratio),width=height*ratio;
 const mesh=new THREE.Mesh(new THREE.PlaneGeometry(width,height),material);mesh.name=a.id;mesh.castShadow=true;mesh.receiveShadow=true;
 window.TIN_SAMPLE_STATE.displayed_dimensions[a.id]={width,height};
 mesh.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:texture,alphaTest:.1,side:THREE.DoubleSide});
 mesh.position.set(position.x,position.y,position.z);mesh.rotation.z=position.r*Math.PI/180;
 if(position.surface==='lid'){mesh.rotation.x=Math.PI;tin.lid.add(mesh);}else tin.tray.add(mesh);
 loaded.push(a.id);if(a.id==='ticket_cream_01')ticketMesh=mesh;return mesh;
}
function animateLid() {
 cancelAnimationFrame(animationId);
 const start=performance.now(),from=lidAmount,to=lidTarget,duration=reduced.matches?0:550;
 function frame(now){const t=duration?Math.min(1,(now-start)/duration):1;const smooth=1-Math.pow(1-t,3);lidAmount=from+(to-from)*smooth;tin.setOpen(lidAmount);render();if(t<1)animationId=requestAnimationFrame(frame);}
 animationId=requestAnimationFrame(frame);
}
async function initStudio() {
 try {
  renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.9;
  host.appendChild(renderer.domElement);
  renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();status.textContent='3D 显示已暂停，请刷新恢复；下方原图仍可查看。';toggle.disabled=true;window.TIN_SAMPLE_STATE.stage='context_lost';});
  scene=new THREE.Scene();scene.background=new THREE.Color(0xe4e7e4);
  const environment=makeStudioEnvironment(renderer);scene.environment=environment.texture;
  scene.add(new THREE.HemisphereLight(0xffffff,0xc6caca,.7));
  const key=new THREE.DirectionalLight(0xfffdf7,2);key.position.set(-130,180,320);key.castShadow=true;
  key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-190,right:190,top:250,bottom:-180,near:20,far:800});key.shadow.bias=-.001;key.shadow.normalBias=.8;key.shadow.radius=3;scene.add(key);
  const fill=new THREE.DirectionalLight(0xe4eef7,.6);fill.position.set(120,-80,250);scene.add(fill);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(1500,1500),new THREE.MeshStandardMaterial({color:0xbfc8c0,roughness:.95}));ground.position.z=-1;ground.receiveShadow=true;scene.add(ground);
  tin=createTin(environment.texture);scene.add(tin.group);
  camera=new THREE.OrthographicCamera();camera.up.set(0,1,0);camera.position.set(0,55-150,706);camera.lookAt(0,55,0);camera.near=1;camera.far=1800;
  render=()=>{const centerY=44*lidAmount;camera.position.set(0,centerY-150,706);camera.lookAt(0,centerY,0);renderer.render(scene,camera);};
  const resize=()=>{const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);const span=Math.max(260,175*h/w);camera.left=-span*w/h/2;camera.right=span*w/h/2;camera.top=span/2;camera.bottom=-span/2;camera.updateProjectionMatrix();render();};
  new ResizeObserver(resize).observe(host);resize();
  const positions={
    ticket_cream_01:{x:-2,y:-3,z:3.05,r:-7,surface:'lid'},
    plush_gray_01:{x:-43,y:6,z:4,r:10},
    key_silver_01:{x:45,y:8,z:5,r:-12},
    blister_clear_01:{x:23,y:-9,z:2,r:-8},
    earphones_white_coiled_01:{x:-12,y:-8,z:8,r:5},
    dice_red_01:{x:48,y:-27,z:10,r:-18}
  };
  const results=await Promise.allSettled(samples.map(a=>addObject(a,positions[a.id])));
  const failures=results.filter(r=>r.status==='rejected');
  window.TIN_SAMPLE_STATE.errors=failures.map(r=>r.reason.message);
  status.textContent=failures.length?`${loaded.length}/6 个样品已加载 · 未就绪的样品可在下方检查`:'6 种材质 · 实际比例合样';
  window.TIN_SAMPLE_STATE.stage=failures.length?'partial':'ready';toggle.disabled=false;render();
 } catch(error){
  window.TIN_SAMPLE_STATE.stage='webgl_unavailable';window.TIN_SAMPLE_STATE.errors.push(error.message);
  status.textContent='当前浏览器无法显示 3D；请继续查看下方六种材质原图。';host.classList.add('unavailable');
 }
}
toggle.addEventListener('click',()=>{lidTarget=lidTarget===1?0:1;toggle.setAttribute('aria-pressed',String(lidTarget===1));toggle.innerHTML=lidTarget===1?'合上盒盖 <span>↘</span>':'打开盒盖 <span>↗</span>';window.TIN_SAMPLE_STATE.open=lidTarget===1;animateLid();});
document.querySelector('#ticket-form').addEventListener('submit',async event=>{
 event.preventDefault();const form=event.currentTarget;const v=Object.fromEntries(new FormData(form));
 for(const key of ['event','date','seat'])if(!v[key].trim())v[key]=ticketDefaults[key];
 const oldURL=ticketURL;ticketURL=URL.createObjectURL(new Blob([makeTicketSVG(v)],{type:'image/svg+xml'}));
 const card=document.querySelector('[data-id="ticket_cream_01"]');card.querySelector('img').src=ticketURL;card.querySelector('a').href=ticketURL;
 if(ticketMesh){try{const img=await loadImage(ticketURL);const map=textureFromImage(img,inventory.objects.find(a=>a.id==='ticket_cream_01').alpha_bounds);ticketMesh.material.map.dispose();ticketMesh.material.map=map;ticketMesh.customDepthMaterial.map=map;ticketMesh.material.needsUpdate=true;render();}catch(error){window.TIN_SAMPLE_STATE.errors.push(error.message);}}
 URL.revokeObjectURL(oldURL);window.TIN_SAMPLE_STATE.ticket=v;document.querySelector('#ticket-status').textContent=`已更新：${v.event} · ${v.date} · ${v.seat}`;
});
initStudio();
