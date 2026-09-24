import {createObject,publicAssets} from './assets';
import {layouts} from './preset-layouts';
import type {Piece} from './preset-layouts';
import {assetById} from './assets';
import {fitObject} from './customization';
import {defaultPresentation} from './types';
import type {Presentation,TinDocument,Category,Surface,PlacedObject} from './types';

export interface StylePreset {id:string;name:string;inspiration:string;title:string;palette:string[];appearance:Partial<Presentation>;pieces:Piece[];}
export const stylePresets:StylePreset[]=[
 {id:'midnight',name:'怪奇午夜电台',inspiration:'怪奇物语 · 80s 记忆',title:'After Hours, 1986',palette:['#171e27','#9f343e','#c0c8ce'],appearance:{background:'midnight',backgroundColor:'#171e27',patternColor:'#536178',tinColor:'#bcc6ce',lining:'bare',liningColor:'#ddd8cb',accent:'#9f343e',titleColor:'#e9ded0',titleFont:'type',decoration:'orbit',caption:'AFTER HOURS CLUB · VOL. 01 · SIDE A'},pieces:layouts.midnight},
 {id:'grand',name:'粉色旅馆',inspiration:'布达佩斯大饭店 · 旅行',title:'Room 07, With Love',palette:['#742d3c','#dfacb6','#e6d7b7'],appearance:{background:'wine',backgroundColor:'#742d3c',tinColor:'#dac9c3',lining:'paper',liningColor:'#f2dfda',accent:'#bd7785',titleColor:'#fff0d6',titleFont:'script',decoration:'stars',caption:'THE GRAND WEEKEND · ROOM 07 · DO NOT DISTURB'},pieces:layouts.grand},
 {id:'letters',name:'魔法来信',inspiration:'哈利·波特 · 书信与收藏',title:'The Secret Post',palette:['#394b3c','#ddcfaf','#963d40'],appearance:{background:'stripe',backgroundColor:'#dbd4be',patternColor:'#75806a',tinColor:'#cbc5b1',lining:'paper',liningColor:'#e3dac2',accent:'#775c3e',titleColor:'#394b3c',titleFont:'serif',decoration:'stars',caption:'THE SECRET POST · NO. 003 · KEEP THE MAGIC'},pieces:layouts.letters},
 {id:'weekend',name:'蓝色周末',inspiration:'日常生活 · 海风与蓝格',title:'Sunday, Slowly',palette:['#dce4e1','#739bad','#715e48'],appearance:{background:'stripe',backgroundColor:'#ede8dc',patternColor:'#7ba1b3',tinColor:'#c2c8cb',lining:'gingham',liningColor:'#eeeede',accent:'#7aacc0',titleColor:'#64503d',titleFont:'script',decoration:'none',caption:'THE SUNDAY CLUB · SEA AIR & SMALL JOYS'},pieces:layouts.weekend},
 {id:'birthday',name:'生日俱乐部',inspiration:'值得记住的日子',title:'Born to Make Wishes',palette:['#ece3cb','#c27d8f','#e1b85f'],appearance:{background:'gingham',backgroundColor:'#f1e7d9',patternColor:'#c6a0a7',tinColor:'#d2c8c0',lining:'dots',liningColor:'#f2e9db',accent:'#c391a2',titleColor:'#895260',titleFont:'hand',decoration:'stars',caption:'BIRTHDAY CLUB · ONE MORE YEAR OF YOU'},pieces:layouts.birthday}
];
export const backgroundNames:Record<Presentation['background'],string>={stone:'日常桌面',wine:'酒红针织',notebook:'折痕纸页',gingham:'柔软方格',stripe:'条纹棉布',midnight:'午夜桌面'};
export const backgroundDefaults:Record<Presentation['background'],string>={stone:'#d4d1c5',wine:'#672439',notebook:'#eeeae1',gingham:'#f1e7db',stripe:'#eee9de',midnight:'#171e27'};
export function composeWholeTin(doc:TinDocument,preset:StylePreset):TinDocument {
 const objects=preset.pieces.map(([id,surface,x,y,r,content,scale],i)=>fitObject({...createObject(id,surface,i),position:{x,y},rotation:r,scale:scale||1,content:content||createObject(id,surface,i).content,presetDecor:true}));
 return {...doc,title:preset.title,lidOpen:true,objects,presentation:{...defaultPresentation(),...preset.appearance,styleId:preset.id}};
}
// Pick from all other themes, never a disguised sequential carousel.
export function randomPreset(current?:string){const choices=stylePresets.filter(p=>p.id!==current);return choices[Math.floor(Math.random()*choices.length)];}
function footprint(o:PlacedObject){const a=assetById(o.assetId),r=o.rotation*Math.PI/180,w=a.physical_size_mm.width*o.scale,h=a.physical_size_mm.height*o.scale;return {w:Math.abs(Math.cos(r))*w+Math.abs(Math.sin(r))*h,h:Math.abs(Math.sin(r))*w+Math.abs(Math.cos(r))*h};}
function placeInGap(o:PlacedObject,placed:PlacedObject[]){
 const peers=placed.filter(p=>p.surface===o.surface),size=footprint(o);let best=o,score=Infinity;
 // A slightly irregular grid retains composed spacing while looking naturally placed.
 for(let i=0;i<96;i++){const x=(i%8-3.5)*15+(Math.random()-.5)*8,y=(Math.floor(i/8)%6-2.5)*12+(Math.random()-.5)*7;
  const candidate=fitObject({...o,position:{x,y}});let cost=0;
  for(const p of peers){const b=footprint(p),dx=Math.abs(candidate.position.x-p.position.x),dy=Math.abs(candidate.position.y-p.position.y),overlap=Math.max(0,(size.w+b.w)/2-dx)*Math.max(0,(size.h+b.h)/2-dy),backing=['torn_paper','lace','envelope'].includes(assetById(p.assetId).family);cost+=overlap/(size.w*size.h)*(backing?.1:2);if(!backing)cost+=Math.max(0,18-Math.hypot(dx,dy))*.04;}
  cost+=Math.abs(candidate.position.x)*.0008+Math.abs(candidate.position.y)*.001+Math.random()*.025;
  if(cost<score){score=cost;best=candidate;}
 }return best;
}
export function grabSome(doc:TinDocument,category:Category|'all'='all',target:Surface='tray'):TinDocument {
 const limit=Math.min(3,60-doc.objects.length);if(limit<=0)return doc;
 const candidates=publicAssets.filter(a=>category==='all'||category==='yours'||a.category===category).map(a=>a.id);
 for(let i=candidates.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[candidates[i],candidates[j]]=[candidates[j],candidates[i]];}
 const existing=new Set(doc.objects.map(o=>o.assetId)),sorted=[...candidates.filter(id=>!existing.has(id)),...candidates.filter(id=>existing.has(id))],seen=new Set<string>();
 const picks=sorted.filter(id=>{const family=assetById(id).family;if(seen.has(family))return false;seen.add(family);return true;}).slice(0,limit);
 const placed=[...doc.objects],top=Math.max(0,...doc.objects.map(o=>o.layer)),bottom=Math.min(0,...doc.objects.map(o=>o.layer));
 picks.forEach((id,i)=>{let o=createObject(id,target,top+i+1);o.rotation=(Math.random()-.5)*24;o.scale=.82+Math.random()*.18;
  if(['torn_paper','hotel_tag','button','bow','calendar','numbers','washi','star','seal'].includes(assetById(id).family))o.content={...o.content,color:doc.presentation.accent};
  if(['torn_paper','lace','envelope'].includes(assetById(id).family))o.layer=bottom-i-1;
  o=placeInGap(o,placed);placed.push(o);
 });return {...doc,lidOpen:true,objects:placed};
}
