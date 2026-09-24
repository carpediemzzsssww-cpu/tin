import {useEffect,useRef,useState} from 'react';
import type {PointerEvent as ReactPointerEvent} from 'react';
import {assetById,carrierLabels,categories,createObject,publicAssets} from './assets';
import {TinScene} from './adaptive-scene';
import Icon from './Icon';
import SelectionLayers from './SelectionLayers';
import ImageViewer from './ImageViewer';
import ObjectInspector from './ObjectInspector';
import PaperEditor from './PaperEditor';
import {canEdit,changeOrder,variantPatch,paperFields} from './customization';
import StylePanel from './StylePanel';
import {composeWholeTin,grabSome,randomPreset} from './styles-presets';
import type {StylePreset} from './styles-presets';
import {objectCanvas} from './textures';
import {feedback,setMuted as muteAudio} from './feedback';
import {loadLocal,preparePhoto,saveDocument,savePhoto} from './storage';
import {emptyDocument} from './types';
import type {Carrier,Category,CustomContent,Mode,PhotoMap,PlacedObject,Surface,TinDocument} from './types';

const photoCarriers:Carrier[]=['postcard','photobooth_strip','stamp','frame'];
const textCarriers:Carrier[]=['dymo_label','handwritten_note','letter_beads'];
type Editor={kind:'photo'|'text'|'ticket'|'decoration'|'paper';objectId?:string;assetId:string;content:CustomContent};
const clone=(d:TinDocument):TinDocument=>structuredClone(d);

function Thumbnail({object,photos,className=''}:{object:PlacedObject;photos:PhotoMap;className?:string}){
 const ref=useRef<HTMLCanvasElement>(null),[failed,setFailed]=useState(false);const signature=object.assetId+JSON.stringify(object.content);
 useEffect(()=>{let active=true;setFailed(false);void objectCanvas(object,photos).then(source=>{if(!active||!ref.current)return;const c=ref.current;c.width=source.width;c.height=source.height;c.getContext('2d')!.drawImage(source,0,0);}).catch(()=>{if(active)setFailed(true);});return()=>{active=false;};},[signature,photos]);
 return failed?<span className="missing">未能加载</span>:<canvas ref={ref} className={className} aria-hidden="true"/>;
}

function ContentEditor({editor,photos,onClose,onSave,onUpload}:{editor:Editor;photos:PhotoMap;onClose:()=>void;onSave:(assetId:string,content:CustomContent)=>void;onUpload:(file:File)=>Promise<string|undefined>}){
 const [assetId,setAsset]=useState(editor.assetId),[content,setContent]=useState<CustomContent>(editor.content);
 const preview={...createObject(assetId,'tray',0),content};const crop=content.crop||{zoom:1,x:0,y:0};
 const change=(patch:Partial<CustomContent>)=>setContent(c=>({...c,...patch}));
 if(editor.kind==='paper')return <PaperEditor assetId={assetId} initial={editor.content} photos={photos} renderThumb={o=><Thumbnail object={o} photos={photos}/>} onSave={c=>onSave(assetId,c)} onClose={onClose} onUpload={onUpload}/>;
 return <div className="modal-shade" onPointerDown={e=>{if(e.target===e.currentTarget)onClose();}}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="editor-title">
  <div className="modal-heading"><div><h2 id="editor-title">{editor.kind==='photo'?'照片':editor.kind==='text'?'文字':editor.kind==='decoration'?'纸件':'票根'}</h2></div><button className="icon-button" onClick={onClose} aria-label="关闭编辑">×</button></div>
  <div className="carrier-preview"><Thumbnail object={preview} photos={photos}/></div>
  {(editor.kind==='photo'||editor.kind==='text')&&<div className="carrier-tabs">{(editor.kind==='photo'?photoCarriers:textCarriers).map(c=><button key={c} className={assetId===c?'active':''} onClick={()=>setAsset(c)}>{carrierLabels[c]}</button>)}</div>}
  {editor.kind==='photo'&&<><label className="range-label">放大裁切 <input aria-label="照片放大" type="range" min="1" max="3" step=".01" value={crop.zoom} onChange={e=>change({crop:{...crop,zoom:+e.target.value}})}/></label><div className="crop-pans">{(['x','y'] as const).map(axis=><label key={axis}>{axis==='x'?'左右位置':'上下位置'}<input aria-label={axis==='x'?'裁切左右位置':'裁切上下位置'} type="range" min="-1" max="1" step=".01" value={crop[axis]} onChange={e=>change({crop:{...crop,[axis]:+e.target.value}})}/></label>)}</div></>}
  {editor.kind==='decoration'?<label>{assetById(assetId).family==='calendar'?'纪念日':'四位数字'}<input aria-label={assetById(assetId).family==='calendar'?'纪念日':'四位数字'} type={assetById(assetId).family==='calendar'?'date':'text'} maxLength={4} value={assetById(assetId).family==='calendar'?content.date||'2026-09-24':content.text||'0819'} onChange={e=>change(assetById(assetId).family==='calendar'?{date:e.target.value}:{text:e.target.value.replace(/[^0-9]/g,'')})}/></label>:editor.kind==='ticket'?<div className="ticket-fields"><label>名称<input autoFocus maxLength={24} value={content.event||''} onChange={e=>change({event:e.target.value})}/></label><div><label>日期<input maxLength={16} value={content.date||''} onChange={e=>change({date:e.target.value})}/></label><label>座位<input maxLength={8} value={content.seat||''} onChange={e=>change({seat:e.target.value})}/></label></div></div>:<label>{editor.kind==='photo'?'说明':'内容'}<textarea autoFocus={editor.kind==='text'} maxLength={assetId==='letter_beads'?14:assetId==='dymo_label'?30:editor.kind==='photo'?36:80} rows={editor.kind==='text'?2:1} value={content.text||''} placeholder={editor.kind==='text'?'今天也值得收藏':'a little piece of my life'} onChange={e=>change({text:e.target.value})}/></label>}
  {editor.kind==='text'&&<div className="ink-colors" aria-label="文字颜色">{['#354039','#9b3540','#38578a','#775d8c'].map(color=><button key={color} aria-label={`颜色 ${color}`} style={{background:color}} className={content.color===color?'active':''} onClick={()=>change({color})}/>)}</div>}
  <footer className="modal-footer"><small>{editor.kind==='photo'?'仅存于本机':''}</small><button className="primary" onClick={()=>onSave(assetId,{...content,carrier:assetId as Carrier})}>{editor.objectId?'保存':'放入'}</button></footer>
 </section></div>;
}

export default function App(){
 const [doc,setDoc]=useState<TinDocument>(emptyDocument),docRef=useRef(doc),[photos,setPhotos]=useState<PhotoMap>(new Map()),photosRef=useRef(photos);
 const [loaded,setLoaded]=useState(false),[mode,setMode]=useState<Mode>('closed'),modeRef=useRef(mode),[selected,setSelected]=useState<string|null>(null);
 const [category,setCategory]=useState<Category|'all'>('all'),[surface,setSurface]=useState<Surface>('tray'),[muted,setMuted]=useState(false),[low,setLow]=useState(false),[reduced,setReduced]=useState(matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [saved,setSaved]=useState('加载中'),[toast,setToast]=useState(''),[fatal,setFatal]=useState(''),[editor,setEditor]=useState<Editor|null>(null),[settings,setSettings]=useState(false),[styling,setStyling]=useState(false),[more,setMore]=useState(false),[clearConfirm,setClearConfirm]=useState(false),[exportUrl,setExportUrl]=useState(''),[busy,setBusy]=useState(false),[historyCount,setHistoryCount]=useState({undo:0,redo:0});
 const dock=useRef<HTMLElement>(null),host=useRef<HTMLDivElement>(null),scene=useRef<TinScene|null>(null),fileInput=useRef<HTMLInputElement>(null),undo=useRef<TinDocument[]>([]),redo=useRef<TinDocument[]>([]),dragBefore=useRef<TinDocument|null>(null),toastTimer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
 const announce=(message:string)=>{setToast(message);clearTimeout(toastTimer.current);toastTimer.current=setTimeout(()=>setToast(''),4200);};
 const history=()=>setHistoryCount({undo:undo.current.length,redo:redo.current.length});
 const update=(next:TinDocument,record=false)=>{if(record){undo.current.push(clone(docRef.current));undo.current=undo.current.slice(-40);redo.current=[];history();}next={...next,updatedAt:Date.now()};docRef.current=next;setDoc(next);scene.current?.setDocument(next);};
 const patchObject=(id:string,patch:Partial<PlacedObject>,record=false)=>{const old=docRef.current.objects.find(o=>o.id===id);if(record&&old&&scene.current&&(patch.rotation!==undefined||patch.scale!==undefined||patch.surface))patch={...patch,...scene.current.constrain({...old,...patch})};update({...docRef.current,objects:docRef.current.objects.map(o=>o.id===id?{...o,...patch}:o)},record);};
 const select=(id:string|null)=>{setSelected(id);setMore(false);const o=docRef.current.objects.find(o=>o.id===id);if(o&&o.surface!=='desk')setSurface(o.surface);scene.current?.setSelected(id);};
 const changeMode=(next:Mode)=>{modeRef.current=next;setMode(next);scene.current?.setMode(next);};
 const nextStage=()=>{if(modeRef.current==='closed'){changeMode('editing');update({...docRef.current,lidOpen:true});feedback('metal');}};
 const remove=(id:string,record=false)=>{update({...docRef.current,objects:docRef.current.objects.filter(o=>o.id!==id)},record);select(null);};
 const commitDrag=()=>{if(dragBefore.current&&JSON.stringify(dragBefore.current.objects)!==JSON.stringify(docRef.current.objects)){undo.current.push(dragBefore.current);redo.current=[];history();}dragBefore.current=null;};

 useEffect(()=>{let active=true;void loadLocal().then(data=>{if(!active)return;const map:PhotoMap=new Map(data.photos.map(p=>[p.id,{url:p.nativePath||URL.createObjectURL(p.blob),record:p}]));photosRef.current=map;setPhotos(map);if(data.document){docRef.current=data.document;setDoc(data.document);modeRef.current='closed';setMode(modeRef.current);}setSaved('已存于本机');}).catch(()=>{if(active){setSaved('本机存储不可用');announce('本机存储不可用，离开前请保存 PNG。');}}).finally(()=>{if(active)setLoaded(true);});return()=>{active=false;};},[]);
 useEffect(()=>{if(!loaded||!host.current)return;let engine:TinScene;try{engine=new TinScene(host.current,docRef.current,photosRef.current,{select,begin:()=>{dragBefore.current=clone(docRef.current);},move:(id,patch)=>patchObject(id,patch),commit:commitDrag,remove:id=>remove(id),stage:nextStage,error:announce,quality:setLow});scene.current=engine;engine.setMode(modeRef.current);engine.setReduced(reduced);window.render_game_to_text=()=>JSON.stringify({...engine.textState(),saved:document.querySelector('[data-save-state]')?.getAttribute('data-save-state'),photoCount:photosRef.current.size});window.advanceTime=ms=>{for(let t=0;t<ms;t+=16)engine.step(Math.min(16,ms-t));};window.TIN_DEBUG={scene:engine,assetIds:publicAssets.map(a=>a.id)};}catch(error){setFatal('3D 暂不可用，切换轻量版继续创作。');console.warn('TIN WebGL unavailable',error);return;}return()=>{engine.dispose();scene.current=null;};},[loaded]);
 useEffect(()=>{if(!loaded||!dock.current)return;const fit=()=>{const landscape=innerWidth>innerHeight&&innerHeight<600,rect=dock.current!.getBoundingClientRect(),inset=landscape?16:innerHeight-rect.top;dock.current?.parentElement?.style.setProperty('--dock-inset',`${inset}px`);scene.current?.setDockInset(inset,landscape?innerWidth-rect.left:0);};const observer=new ResizeObserver(fit);observer.observe(dock.current);window.addEventListener('resize',fit);fit();return()=>{observer.disconnect();window.removeEventListener('resize',fit);};},[loaded]);
 useEffect(()=>{if(scene.current)scene.current.blocked=Boolean(editor||settings||styling||clearConfirm||exportUrl);},[editor,settings,styling,clearConfirm,exportUrl,loaded]);
 useEffect(()=>{photosRef.current=photos;scene.current?.setPhotos(photos);},[photos]);
 useEffect(()=>{scene.current?.setReduced(reduced);},[reduced]);
 useEffect(()=>{scene.current?.setLow(low);},[low]);
 useEffect(()=>{muteAudio(muted);},[muted]);
 useEffect(()=>()=>{if(exportUrl)URL.revokeObjectURL(exportUrl);},[exportUrl]);
 useEffect(()=>{if(!loaded)return;setSaved('保存中');const timer=setTimeout(()=>{void saveDocument(doc).then(()=>setSaved('已存于本机')).catch(()=>{setSaved('未能保存');announce('保存失败，可能是设备空间不足。请先保存 PNG。');});},450);return()=>clearTimeout(timer);},[doc,loaded]);
 useEffect(()=>()=>{photosRef.current.forEach(p=>URL.revokeObjectURL(p.url));clearTimeout(toastTimer.current);},[]);
 useEffect(()=>{const handler=(e:KeyboardEvent)=>{if(e.key==='Escape'&&exportUrl){setExportUrl('');return;}if(e.key==='Escape'){setEditor(null);setSettings(false);setStyling(false);setClearConfirm(false);setExportUrl('');setMore(false);}if((e.metaKey||e.ctrlKey)&&e.key==='z'&&!editor&&!settings&&!styling&&!clearConfirm&&!exportUrl&&!(e.target as HTMLElement).closest('input,textarea')){e.preventDefault();travel(e.shiftKey?'redo':'undo');}};window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler);});

 function travel(direction:'undo'|'redo'){const from=direction==='undo'?undo:redo,to=direction==='undo'?redo:undo;const old=from.current.pop();if(!old)return;to.current.push(clone(docRef.current));update(old);select(null);history();}
 function add(assetId:string,content?:CustomContent,point?:{x:number;y:number}){
  nextStage();
  if(docRef.current.objects.length>=60){announce('最多放入 60 件物品。');return null;}
  const count=docRef.current.objects.length,o=createObject(assetId,surface,count?Math.max(...docRef.current.objects.map(p=>p.layer))+1:0);o.position={x:(count%3-1)*24,y:(Math.floor(count/3)%2-.5)*20};if(content)o.content=content;else if(docRef.current.presentation.styleId&&['torn_paper','hotel_tag','button','bow','calendar','numbers','washi'].includes(assetById(assetId).family))o.content={...o.content,color:docRef.current.presentation.accent};if(['torn_paper','lace','envelope'].includes(assetById(assetId).family))o.layer=Math.min(0,...docRef.current.objects.map(p=>p.layer))-1;
  if(point&&scene.current){o.surface=scene.current.surfaceAt(point.x,point.y);const p=scene.current.point(point.x,point.y,o.surface);o.position={x:p.x,y:p.y};}
  update({...docRef.current,objects:[...docRef.current.objects,o]},true);select(o.id);feedback(assetById(assetId).material);return o;
 }
 function usePreset(preset:StylePreset){nextStage();select(null);update(composeWholeTin(docRef.current,preset),true);feedback('paper');}
 function spill(){usePreset(randomPreset(docRef.current.presentation.styleId));}
 function grab(){nextStage();const next=grabSome(docRef.current,category,surface);if(next===docRef.current){announce('最多放入 60 件物品。');return;}update(next,true);select(next.objects.at(-1)?.id||null);feedback('paper');}
 function clearObjects(){update({...docRef.current,objects:[]},true);select(null);setClearConfirm(false);announce('已清空，可撤销');}
 function reorder(move:'up'|'down'|'top'|'bottom'){if(!selected)return;const next=changeOrder(docRef.current,selected,move);if(next!==docRef.current)update(next,true);}
 function dragAsset(event:ReactPointerEvent,assetId:string){if(event.button!==0)return;const {clientX:x,clientY:y,pointerId}=event;let started=false,scrolling=false;const move=(e:PointerEvent)=>{if(e.pointerId!==pointerId||scrolling)return;if(Math.hypot(e.clientX-x,e.clientY-y)>9&&!started){if(e.pointerType==='touch'&&Math.abs(e.clientX-x)>Math.abs(e.clientY-y)*1.15){scrolling=true;return;}e.preventDefault();started=true;const o=add(assetId,undefined,{x:e.clientX,y:e.clientY});if(o)scene.current?.beginDrag(o.id,pointerId,e.clientX,e.clientY);}};const up=(e:PointerEvent)=>{if(e.pointerId!==pointerId)return;window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',cancel);if(!started&&!scrolling)add(assetId);};const cancel=()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',cancel);};window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',cancel);}
 async function importPhoto(file:File){try{const p=await preparePhoto(file);try{await savePhoto(p);}catch{announce('照片暂时无法保存到本机，离开前请保存 PNG。');}const map=new Map(photosRef.current);map.set(p.id,{url:p.nativePath||URL.createObjectURL(p.blob),record:p});photosRef.current=map;setPhotos(map);return p.id;}catch(e){announce((e as Error).message);return undefined;}}
 async function upload(file:File){setBusy(true);try{const id=await importPhoto(file);if(id)setEditor({kind:'photo',assetId:'postcard',content:{photoId:id,text:'',crop:{zoom:1,x:0,y:0}}});}finally{setBusy(false);if(fileInput.current)fileInput.current.value='';}}
 function editObject(o:PlacedObject){const a=assetById(o.assetId);if(paperFields[a.family]){setMore(false);setEditor({kind:'paper',objectId:o.id,assetId:o.assetId,content:o.content});}else if(a.category==='yours'){setMore(false);setEditor({kind:o.content.photoId?'photo':'text',objectId:o.id,assetId:o.assetId,content:o.content});}}
 function saveContent(assetId:string,content:CustomContent){if(editor?.objectId)patchObject(editor.objectId,{assetId,content,presetDecor:false},true);else add(assetId,content);setEditor(null);}
 function closeTin(){select(null);changeMode('closed');update({...docRef.current,lidOpen:false});feedback('metal');}
 async function exportImage(){if(!scene.current||busy)return;setToast('');setBusy(true);try{const blob=await scene.current.exportPNG();if(exportUrl)URL.revokeObjectURL(exportUrl);const url=URL.createObjectURL(blob);setExportUrl(url);}catch(e){announce((e as Error).message);}finally{setBusy(false);}}
 const selectedObject=doc.objects.find(o=>o.id===selected),selectedAsset=selectedObject?assetById(selectedObject.assetId):null;
 const objects=category==='all'?publicAssets:publicAssets.filter(a=>a.category===category);
 function moveTo(target:Surface){if(!selectedObject)return;if(target!=='desk')setSurface(target);patchObject(selectedObject.id,{surface:target,position:{x:0,y:target==='desk'?-65:0}},true);}

 const bg=doc.presentation.backgroundColor;const dark=parseInt(bg.slice(1,3),16)*.299+parseInt(bg.slice(3,5),16)*.587+parseInt(bg.slice(5,7),16)*.114<125;
 return <div className={`app mode-${mode} background-${doc.presentation.background} ${selected?'has-selection':''} ${dark?'dark-desk':''}`}>
  <main inert={Boolean(editor||settings||styling||clearConfirm||exportUrl)} className="desk" aria-label="创作桌面">
   <div className="stage" ref={host}/>
   {!loaded&&<div className="loading">加载中…</div>}
   {fatal&&<div className="fallback" role="alert"><h2>无法显示铁盒</h2><p>{fatal}</p><button onClick={()=>location.reload()}>重试</button></div>}
   {loaded&&!fatal&&mode==='closed'&&<button className="lid-hint" data-stage-next aria-label="打开盒盖" onClick={nextStage}>点击开盖</button>}
  </main>
  <header inert={Boolean(editor||settings||styling||clearConfirm||exportUrl)} className="desk-toolbar">
   <div className="brand-mark">TIN<span className={`save-indicator ${saved==='未能保存'?'failed':''}`} role="status" data-save-state={saved} title={saved} aria-label={saved}><i/><span className="visually-hidden">{saved}</span></span></div>
   <div className="desk-actions">
    {mode==='editing'&&<><button className="tool-button history-button" title="撤销" aria-label="撤销" disabled={!historyCount.undo} onClick={()=>travel('undo')}><Icon name="undo"/></button><button className="tool-button history-button" title="重做" aria-label="重做" disabled={!historyCount.redo} onClick={()=>travel('redo')}><Icon name="redo"/></button><button className="tool-button lid-button" onClick={closeTin}><Icon name="box"/><span>合盖</span></button></>}
    <button className="tool-button" title="风格" aria-label="风格与排版" onClick={()=>{select(null);setStyling(true);}}><Icon name="palette"/></button>
    <button className="tool-button" title="设置" aria-label="设置" onClick={()=>setSettings(true)}><Icon name="settings"/></button>
    <button className="tool-button" title="预览与保存" aria-label="预览与保存" disabled={!doc.objects.length||busy||Boolean(fatal)} onClick={exportImage}><Icon name="download"/></button>
   </div>
  </header>
  {!fatal&&loaded&&!editor&&!settings&&!styling&&!clearConfirm&&!exportUrl&&<button className="switch-tin" aria-label="随机整盒" title="随机一套完整搭配，可撤销" onClick={spill}><Icon name="random"/>随机</button>}
  {mode==='editing'&&selectedObject&&!more&&!editor&&!settings&&!styling&&!clearConfirm&&!exportUrl&&<SelectionLayers scene={()=>scene.current} id={selectedObject.id} canUp={doc.objects.some(o=>o.surface===selectedObject.surface&&o.layer>selectedObject.layer)} canDown={doc.objects.some(o=>o.surface===selectedObject.surface&&o.layer<selectedObject.layer)} onMove={reorder} onNudge={()=>patchObject(selectedObject.id,{rotation:selectedObject.rotation+15},true)}/>}
  {mode==='editing'&&selectedObject&&selectedAsset&&!fatal&&<div inert={Boolean(editor||settings||styling||clearConfirm||exportUrl)} className="object-tools" role="toolbar" aria-label="物件工具">
   <span className="object-name">{selectedAsset.name}</span>
   <button className="tool-button transfer" onClick={()=>moveTo(selectedObject.surface==='lid'?'tray':'lid')}>{selectedObject.surface==='lid'?'移到底盘':'移到盒盖'}</button>
   {(canEdit(selectedAsset))&&<button className="tool-button" aria-label="编辑内容" title="编辑内容" onClick={()=>editObject(selectedObject)}><Icon name="edit"/></button>}
   <button className="tool-button" aria-label="放回抽屉" title="放回抽屉" onClick={()=>remove(selectedObject.id,true)}><Icon name="trash"/></button>
   <button className={`tool-button ${more?'active':''}`} aria-label="更多物件操作" title="更多" aria-expanded={more} onClick={()=>setMore(!more)}><Icon name="more"/></button>
   {more&&<ObjectInspector object={selectedObject} renderThumb={o=><Thumbnail object={o} photos={photos}/>} onVariant={v=>patchObject(selectedObject.id,variantPatch(selectedObject,v),true)} onColor={color=>patchObject(selectedObject.id,{content:{...selectedObject.content,color},presetDecor:false},true)} onSize={scale=>patchObject(selectedObject.id,{scale},true)} onEdit={()=>editObject(selectedObject)}/>}

  </div>}
  {loaded&&!fatal&&<section inert={Boolean(editor||settings||styling||clearConfirm||exportUrl)} ref={dock} className="material-drawer" data-drawer-drop aria-label="物件抽屉">
   <div className="drawer-rail"><nav className="categories" aria-label="素材分类"><button className={category==='all'?'active':''} aria-pressed={category==='all'} onClick={()=>setCategory('all')}>全部</button><button className={category==='yours'?'active':''} aria-pressed={category==='yours'} onClick={()=>setCategory('yours')}>我的</button>{categories.filter(c=>c.id!=='yours').map(c=><button key={c.id} aria-label={c.label} aria-pressed={category===c.id} className={category===c.id?'active':''} onClick={()=>setCategory(c.id)}>{c.short}</button>)}</nav><button className="random-button" title="随机取物" aria-label="随机取物" onClick={grab}><Icon name="random"/><span>取物</span></button></div>
   <div className={`asset-shelf ${category==='yours'?'yours-shelf':''}`}>
    {category==='yours'?<><button className="personal-item" aria-label="添加照片" onClick={()=>fileInput.current?.click()} disabled={busy}><span className="mini-photo">＋</span><span>照片</span></button><button className="personal-item" aria-label="添加文字" onClick={()=>setEditor({kind:'text',assetId:'dymo_label',content:{text:'MY LITTLE WORLD',color:'#354039'}})}><span className="mini-label">Aa</span><span>文字</span></button>{[...photos.values()].map(p=><button className="saved-photo" key={p.record.id} title={p.record.name} aria-label={`再次使用照片 ${p.record.name}`} onClick={()=>setEditor({kind:'photo',assetId:'postcard',content:{photoId:p.record.id,crop:{zoom:1,x:0,y:0}}})}><img src={p.url} alt={p.record.name}/></button>)}</>:objects.map((a,i)=><button className="asset-item" key={a.id} title={a.name} aria-label={`添加${a.name}`} onPointerDown={e=>dragAsset(e,a.id)} onClick={e=>{if(e.detail===0)add(a.id);}}><span className="object-rest" style={{width:Math.max(28,Math.min(96,a.physical_size_mm.width*1.4)),height:Math.max(28,Math.min(82,a.physical_size_mm.height*1.4)),transform:`rotate(${[-8,6,-4,9,-7,4][i%6]}deg)`}}><Thumbnail object={createObject(a.id,'tray',0)} photos={photos}/></span></button>)}
   </div><span className="drawer-handle" aria-hidden="true"/>
  </section>}
  <input ref={fileInput} type="file" accept="image/*" className="visually-hidden" aria-label="选择私人照片" onChange={e=>{const file=e.target.files?.[0];if(file)void upload(file);}}/>
  {editor&&<ContentEditor key={editor.objectId||editor.content.photoId||editor.kind} editor={editor} photos={photos} onClose={()=>setEditor(null)} onSave={saveContent} onUpload={importPhoto}/>}
  {settings&&<div className="modal-shade" onPointerDown={e=>{if(e.target===e.currentTarget)setSettings(false);}}><section className="modal settings" role="dialog" aria-modal="true" aria-labelledby="settings-title"><div className="modal-heading"><h2 id="settings-title">设置</h2><button className="icon-button" aria-label="关闭设置" onClick={()=>setSettings(false)}><Icon name="close"/></button></div><label className="check-label"><span>声音与轻触反馈</span><input type="checkbox" checked={!muted} onChange={e=>setMuted(!e.target.checked)}/></label><label className="check-label"><span>减少动态效果</span><input type="checkbox" checked={reduced} onChange={e=>setReduced(e.target.checked)}/></label><label className="check-label"><span>轻量显示</span><input type="checkbox" checked={low} onChange={e=>setLow(e.target.checked)}/></label><button className="clear-entry" disabled={!doc.objects.length} onClick={()=>{setSettings(false);setClearConfirm(true);}}>清空物件 <Icon name="trash"/></button><p className="local-note">作品仅存于本机。清除浏览器数据前，请保存图片。</p><button className="primary" onClick={()=>setSettings(false)}>完成</button></section></div>}
  {clearConfirm&&<div className="modal-shade" onPointerDown={e=>{if(e.target===e.currentTarget)setClearConfirm(false);}}><section className="modal confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="clear-title" onKeyDown={e=>{if(e.key==='Tab'){const nodes=e.currentTarget.querySelectorAll<HTMLButtonElement>('button');if(e.shiftKey&&document.activeElement===nodes[0]){e.preventDefault();nodes[1].focus();}else if(!e.shiftKey&&document.activeElement===nodes[1]){e.preventDefault();nodes[0].focus();}}}}><h2 id="clear-title">清空当前铁盒？</h2><p>移除盒盖、底盘和桌面上的物件。<br/>照片素材与配色保留，可撤销。</p><div className="confirm-actions"><button autoFocus onClick={()=>setClearConfirm(false)}>取消</button><button className="danger-button" onClick={clearObjects}>确认清空</button></div></section></div>}
  {styling&&<StylePanel doc={doc} onChange={patch=>update({...docRef.current,presentation:{...docRef.current.presentation,...patch}},true)} onTitle={title=>update({...docRef.current,title})} onPreset={usePreset} onClose={()=>setStyling(false)} onExport={()=>{setStyling(false);void exportImage();}} onPreview={()=>void exportImage()} renderPreview={()=>scene.current!.exportPNG(520)}/>}
  {exportUrl&&<ImageViewer src={exportUrl} title={doc.title} onClose={()=>setExportUrl('')}/>}
  {toast&&<div className="toast" role="status">{toast}</div>}
 </div>;
}
