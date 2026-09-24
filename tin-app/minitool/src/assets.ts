import raw from './inventory.json';
import curated from './curated-inventory.json';
import type {AssetDefinition,Category,Carrier,PlacedObject,Surface} from './types';
import {uid} from './types';
export const categories:{id:Category;label:string;short:string}[]=[{id:'yours',label:'我的',short:'我的'},{id:'toys_charms',label:'玩具挂件',short:'玩具挂件'},{id:'daily_stuff',label:'随身物品',short:'随身物品'},{id:'paper_memories',label:'纸片票根',short:'纸片票根'},{id:'culture',label:'音乐游戏',short:'音乐游戏'},{id:'random_shit',label:'小零件',short:'小零件'},{id:'found_outside',label:'花草贝壳',short:'花草贝壳'}];
export const publicAssets=[...curated.objects,...raw.objects] as AssetDefinition[];
export const carrierLabels:Record<Carrier,string>={postcard:'明信片',photobooth_strip:'连拍条',stamp:'邮票',frame:'相框',dymo_label:'压字标签',handwritten_note:'手写纸条',letter_beads:'字母珠'};
export const customAssets:AssetDefinition[]=(Object.keys(carrierLabels) as Carrier[]).map(id=>({id,name:carrierLabels[id],category:'yours',family:id,variant:'custom',material:id==='letter_beads'?'plastic':'paper',physical_size_mm:{width:id==='photobooth_strip'?27:id==='stamp'?32:id==='letter_beads'?64:62,height:id==='photobooth_strip'?75:id==='stamp'?40:id==='dymo_label'?14:id==='letter_beads'?12:45,depth:.4},asset_path:null,alpha_bounds:null,source_method:'original_canvas',source:{record:'src/textures.ts'},allow_partial_overflow:false}));
export const assets=[...publicAssets,...customAssets];
export const assetById=(id:string)=>assets.find(a=>a.id===id)!;
const objectColors:Record<string,string>={star_foil_01:'#cbb173',clover_pressed_01:'#6d8d50',hotel_tag_01:'#cf92a2',button_pearl_01:'#b6c9bb',bow_dotted_01:'#779aa6',calendar_01:'#b76a7e',birthday_numbers_01:'#b76a7e',wax_seal_01:'#923d4a',moon_patch_01:'#d8bb72',washi_stripe_01:'#9ba7bf'};
export function createObject(assetId:string,surface:Surface,layer:number):PlacedObject{return{id:uid(),assetId,surface,layer,position:{x:0,y:0},rotation:[-9,-5,3,7,11][((layer%5)+5)%5],scale:1,content:assetId==='landscape_card_01'?{variant:'memory_coast'}:assetId.startsWith('ticket')?{event:'ONE GOOD NIGHT',date:'SEP 24 · 2026',seat:'B 12',tone:assetId.includes('blue')?'blue':'cream'}:objectColors[assetId]?{color:objectColors[assetId]}:{}};}
