export type Surface='tray'|'lid'|'desk';
export type Category='toys_charms'|'daily_stuff'|'paper_memories'|'culture'|'random_shit'|'found_outside'|'yours';
export type Carrier='postcard'|'photobooth_strip'|'stamp'|'frame'|'dymo_label'|'handwritten_note'|'letter_beads';
export type Background='stone'|'wine'|'notebook'|'gingham'|'stripe'|'midnight';
export type Lining='paper'|'gingham'|'dots'|'bare';
export interface Presentation {background:Background;caption:string;backgroundColor:string;patternColor:string;tinColor:string;lining:Lining;liningColor:string;accent:string;styleId:string;titleFont:'script'|'hand'|'serif'|'type';titleColor:string;titleSize:number;titlePosition:'top'|'bottom'|'split';titleRotation:number;decoration:'stars'|'orbit'|'none';ratio:'portrait'|'square';}
export type Mode='closed'|'editing';
export interface AssetDefinition {id:string;name:string;category:Category;family:string;variant:string;material:string;physical_size_mm:{width:number;height:number;depth:number};asset_path:string|null;alpha_bounds:number[]|null;source_method:string;source:Record<string,unknown>;license_note?:string;allow_partial_overflow:boolean;customizable_fields?:{key:string;label:string;max_length:number}[];}
export interface CustomContent {text?:string;color?:string;event?:string;date?:string;seat?:string;tone?:string;photoId?:string;photoIds?:string[];variant?:string;details?:Record<string,string>;carrier?:Carrier;crop?:{zoom:number;x:number;y:number};}
export interface PlacedObject {id:string;assetId:string;surface:Surface;position:{x:number;y:number};rotation:number;scale:number;layer:number;content:CustomContent;presetDecor?:boolean;}
export interface TinDocument {version:1;id:string;title:string;createdAt:number;updatedAt:number;objects:PlacedObject[];presentation:Presentation;lidOpen:boolean;}
export interface PhotoRecord {id:string;blob:Blob;name:string;width:number;height:number;createdAt:number;}
export type PhotoMap=Map<string,{url:string;record:PhotoRecord}>;
export const uid=()=>globalThis.crypto?.randomUUID?.()||`tin-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`;
export const defaultPresentation=():Presentation=>({background:'stone',caption:'little things, a world of mine.',backgroundColor:'#d4d1c5',patternColor:'#8b9b9b',tinColor:'#c2c8cb',lining:'paper',liningColor:'#eeeee7',accent:'#527c89',styleId:'',titleFont:'script',titleColor:'#35443e',titleSize:1,titlePosition:'split',titleRotation:-3,decoration:'stars',ratio:'portrait'});
export const emptyDocument=():TinDocument=>({version:1,id:uid(),title:'我的日常收藏',createdAt:Date.now(),updatedAt:Date.now(),objects:[],presentation:defaultPresentation(),lidOpen:false});
// Older v1 documents only saved background and caption. Keep every object and photo.
export function normalizeDocument(doc:TinDocument):TinDocument {const old=doc.presentation;return {...doc,presentation:{...defaultPresentation(),...(old?.background==='wine'?{backgroundColor:'#672439',titleColor:'#f2e9da'}:old?.background==='notebook'?{backgroundColor:'#eeeae1'}:{}),...old}};}
declare global {interface Window {render_game_to_text:()=>string;advanceTime:(ms:number)=>void;TIN_DEBUG?:unknown;}}
