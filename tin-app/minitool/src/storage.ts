import type {PhotoRecord,TinDocument} from './types';import {normalizeDocument} from './types';
import {mini,hasStorage,environment,blobData} from './container';import * as browser from './browser-storage';
export const preparePhoto=browser.preparePhoto;
let writes:Promise<unknown>=Promise.resolve();
const put=(key:string,data:unknown)=>mini().setStorage({key,data:JSON.stringify(data)});
const get=async(key:string)=>{const r=await mini().getStorage({key});return r.data?JSON.parse(r.data):undefined;};
export async function saveDocument(doc:TinDocument){if(!await hasStorage())return browser.saveDocument(doc);const job=writes.catch(()=>{}).then(()=>put('tin.document',doc));writes=job;await job;}
export async function savePhoto(photo:PhotoRecord){if(!await hasStorage())return browser.savePhoto(photo);const data=await blobData(photo.blob),sdk=mini(),env=await environment();let nativePath:string|undefined;
 if(env.version>=9490&&typeof sdk.saveFile==='function'&&typeof sdk.writeTempFile==='function'){const temp=await sdk.writeTempFile({data});nativePath=(await sdk.saveFile({tempFilePath:temp.filePath})).savedFilePath;}
 const value={id:photo.id,name:photo.name,width:photo.width,height:photo.height,createdAt:photo.createdAt,nativePath,data:nativePath?undefined:data};if(JSON.stringify(value).length>950000)throw new Error('照片过大，请换一张小图');await put('tin.photo.'+photo.id,value);
}
export async function loadLocal(){if(!await hasStorage())return browser.loadLocal();const sdk=mini(),info=await sdk.getStorageInfo(),keys:string[]=info.keys||[],doc=keys.includes('tin.document')?await get('tin.document'):undefined,photos:PhotoRecord[]=[];
 for(const key of keys.filter(k=>k.startsWith('tin.photo.'))){const p=await get(key);if(!p)continue;if(p.nativePath)photos.push({...p,blob:new Blob()});else{const raw=atob(p.data.split(',')[1]),bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);photos.push({...p,blob:new Blob([bytes],{type:'image/jpeg'})});}}
 return {document:doc?normalizeDocument(doc):undefined,photos};
}
