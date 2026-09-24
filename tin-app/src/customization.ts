import variants from './object-variants.json';
import {assetById,createObject} from './assets';
import type {AssetDefinition,CustomContent,PlacedObject,TinDocument} from './types';

export interface ObjectVariant {id:string;label:string;assetId?:string;path?:string;bounds?:number[];color?:string;}
const imageVariants=variants as Record<string,ObjectVariant[]>;
export function variantsFor(a:AssetDefinition):ObjectVariant[]{
 if(imageVariants[a.family])return imageVariants[a.family];
 if(a.family==='dice')return[{id:'red',label:'莓果红',assetId:'dice_red_01'},{id:'ivory',label:'奶油白',assetId:'dice_ivory_01'}];
 if(a.family==='earphones')return[{id:'white',label:'白色',assetId:'earphones_white_coiled_01'},{id:'black',label:'黑色',assetId:'earphones_black_coiled_01'}];
 if(a.family==='ticket')return[{id:'cream',label:'米白',assetId:'ticket_cream_01'},{id:'blue',label:'浅蓝',assetId:'ticket_blue_01'}];
 if(a.family==='washi')return[{id:'stripe',label:'条纹'},{id:'dots',label:'波点'},{id:'check',label:'格子'}];
 return[];
}
export function selectedVariant(o:PlacedObject){const options=variantsFor(assetById(o.assetId));return options.find(v=>v.assetId===o.assetId)||options.find(v=>v.id===o.content.variant)||options[0];}
export function variantPatch(o:PlacedObject,v:ObjectVariant):Partial<PlacedObject>{return {assetId:v.assetId||o.assetId,content:{...o.content,variant:v.id,...(v.color?{color:v.color}:{})},presetDecor:false};}
export type PaperField={key:string;label:string;defaultValue:string;max:number;type?:'date'|'digits'|'multiline'};
export const paperFields:Record<string,PaperField[]>={
 ticket:[{key:'event',label:'名称',defaultValue:'ONE GOOD NIGHT',max:24},{key:'date',label:'日期',defaultValue:'SEP 24 · 2026',max:16},{key:'seat',label:'座位',defaultValue:'B 12',max:8},{key:'details.venue',label:'影院 / 场地',defaultValue:'TIN CINEMA',max:22},{key:'details.footer',label:'票根寄语',defaultValue:'KEEP THIS LITTLE MOMENT.',max:32}],
 receipt:[{key:'details.shop',label:'店名',defaultValue:'CORNER STORE',max:22},{key:'date',label:'时间',defaultValue:'24 SEP 2026  17:42',max:24},{key:'text',label:'清单（每行一项）',defaultValue:'SODA  3.50\nA LITTLE TREAT  2.00\nAN ORDINARY DAY  0.00',max:100,type:'multiline'},{key:'details.total',label:'合计',defaultValue:'5.50',max:12},{key:'details.footer',label:'小票寄语',defaultValue:'THANK YOU. COME AGAIN.',max:30}],
 torn_paper:[{key:'details.heading',label:'小标题',defaultValue:'a small collection of ordinary days',max:40},{key:'text',label:'纸条内容',defaultValue:'',max:100,type:'multiline'}],
 envelope:[{key:'details.to',label:'收件人',defaultValue:'',max:22},{key:'details.from',label:'寄件人',defaultValue:'',max:22},{key:'text',label:'信封寄语',defaultValue:'with love,',max:35}],
 hotel_tag:[{key:'details.hotel',label:'旅馆名称',defaultValue:'THE GRAND',max:18},{key:'details.city',label:'地点',defaultValue:'WEEKEND',max:16},{key:'text',label:'房间号',defaultValue:'No. 07',max:8}],
 calendar:[{key:'date',label:'纪念日',defaultValue:'2026-09-24',max:10,type:'date'},{key:'text',label:'日历寄语',defaultValue:'a day to remember',max:26}],
 numbers:[{key:'text',label:'四位数字',defaultValue:'0819',max:4,type:'digits'}],
 landscape:[{key:'text',label:'画片说明',defaultValue:'somewhere, someday',max:32}],
 film:[{key:'text',label:'胶片说明',defaultValue:'01  ◆  400',max:20}],
 lace:[{key:'text',label:'中心文字',defaultValue:'',max:12}],
 washi:[{key:'text',label:'胶带文字',defaultValue:'',max:22}],
 seal:[{key:'text',label:'印章字母',defaultValue:'',max:3}],
};
export function fieldValue(c:CustomContent,f:PaperField){const value=f.key.startsWith('details.')?c.details?.[f.key.slice(8)]:c[f.key as 'text'|'date'|'event'|'seat'];return value??f.defaultValue;}
export function withField(c:CustomContent,f:PaperField,value:string):CustomContent {if(f.type==='digits')value=value.replace(/\D/g,'');return f.key.startsWith('details.')?{...c,details:{...c.details,[f.key.slice(8)]:value}}:{...c,[f.key]:value};}
export const canEdit=(a:AssetDefinition)=>a.category==='yours'||Boolean(paperFields[a.family]);
export const canColor=(a:AssetDefinition)=>a.source.record==='src/curated-art.ts';

export function changeOrder(doc:TinDocument,id:string,move:'up'|'down'|'top'|'bottom'):TinDocument {
 const target=doc.objects.find(o=>o.id===id);if(!target)return doc;
 const stack=doc.objects.filter(o=>o.surface===target.surface).sort((a,b)=>a.layer-b.layer),index=stack.findIndex(o=>o.id===id);
 const to=move==='top'?stack.length-1:move==='bottom'?0:Math.max(0,Math.min(stack.length-1,index+(move==='up'?1:-1)));
 if(to===index)return doc;stack.splice(index,1);stack.splice(to,0,target);const layers=new Map(stack.map((o,i)=>[o.id,i]));
 return {...doc,objects:doc.objects.map(o=>layers.has(o.id)?{...o,layer:layers.get(o.id)!,...(o.id===id?{presetDecor:false}:{})}:o)};
}
export function fitObject(o:PlacedObject){if(o.surface==='desk')return o;const a=assetById(o.assetId),r=o.rotation*Math.PI/180,w=a.physical_size_mm.width*o.scale,h=a.physical_size_mm.height*o.scale,mx=Math.max(0,65-(Math.abs(Math.cos(r))*w+Math.abs(Math.sin(r))*h)/2),my=Math.max(0,40-(Math.abs(Math.sin(r))*w+Math.abs(Math.cos(r))*h)/2);return {...o,position:{x:Math.max(-mx,Math.min(mx,o.position.x)),y:Math.max(-my,Math.min(my,o.position.y))}};}
export function makeVariantPreview(o:PlacedObject,v:ObjectVariant){return {...createObject(v.assetId||o.assetId,'tray',0),content:{...o.content,variant:v.id}};}
