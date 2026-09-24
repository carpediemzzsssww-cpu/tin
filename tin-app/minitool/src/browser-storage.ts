import type {PhotoRecord,TinDocument} from './types';
import {uid,normalizeDocument} from './types';
let connection:Promise<IDBDatabase>|undefined;
function database(){
 if(!connection)connection=new Promise<IDBDatabase>((resolve,reject)=>{
  if(!('indexedDB' in window)){reject(new Error('此浏览器无法使用本地作品存储'));return;}
  const req=indexedDB.open('tin-local-studio',1);
  req.onupgradeneeded=()=>{const db=req.result;db.createObjectStore('documents');db.createObjectStore('photos',{keyPath:'id'});};
  req.onerror=()=>reject(req.error||new Error('无法打开本地存储'));
  req.onblocked=()=>reject(new Error('另一个 TIN 页面占用了本地存储，请关闭后重试'));
  req.onsuccess=()=>{req.result.onversionchange=()=>req.result.close();resolve(req.result);};
 }).catch(error=>{connection=undefined;throw error;});
 return connection;
}
async function write(store:string,value:unknown,key?:IDBValidKey){const db=await database();return new Promise<void>((resolve,reject)=>{const tx=db.transaction(store,'readwrite');key===undefined?tx.objectStore(store).put(value):tx.objectStore(store).put(value,key);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error||new Error('保存失败，设备空间可能不足'));tx.onabort=()=>reject(tx.error||new Error('保存被中断'));});}
export const saveDocument=(doc:TinDocument)=>write('documents',doc,'current');
export const savePhoto=(photo:PhotoRecord)=>write('photos',photo);
export async function loadLocal(){const db=await database();return new Promise<{document:TinDocument|undefined;photos:PhotoRecord[]}>((resolve,reject)=>{const tx=db.transaction(['documents','photos'],'readonly');const doc=tx.objectStore('documents').get('current');const photos=tx.objectStore('photos').getAll();tx.oncomplete=()=>resolve({document:doc.result?normalizeDocument(doc.result):undefined,photos:photos.result});tx.onerror=()=>reject(tx.error);});}
export async function preparePhoto(file:File):Promise<PhotoRecord>{
 if(file.size>30*1024*1024)throw new Error('这张照片太大，请选择 30 MB 以内的图片');
 const url=URL.createObjectURL(file);try{
  const image=await new Promise<HTMLImageElement>((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(new Error('暂时无法读取这张照片，请使用 JPG、PNG 或 WebP'));im.src=url;});
  const factor=Math.min(1,1024/Math.max(image.naturalWidth,image.naturalHeight));const canvas=document.createElement('canvas');canvas.width=Math.round(image.naturalWidth*factor);canvas.height=Math.round(image.naturalHeight*factor);canvas.getContext('2d')!.drawImage(image,0,0,canvas.width,canvas.height);
  const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('照片处理失败')),'image/jpeg',.84));
  return {id:uid(),blob,name:file.name,width:canvas.width,height:canvas.height,createdAt:Date.now()};
 }finally{URL.revokeObjectURL(url);}
}
