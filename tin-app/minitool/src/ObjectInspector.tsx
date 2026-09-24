import type {ReactNode} from 'react';
import {assetById} from './assets';
import {canColor,canEdit,makeVariantPreview,selectedVariant,variantsFor} from './customization';
import type {ObjectVariant} from './customization';
import type {PlacedObject} from './types';
interface Props {object:PlacedObject;renderThumb:(o:PlacedObject)=>ReactNode;onVariant:(v:ObjectVariant)=>void;onColor:(color:string)=>void;onSize:(size:number)=>void;onEdit:()=>void;}
export default function ObjectInspector(p:Props){const a=assetById(p.object.assetId),variants=variantsFor(a),current=selectedVariant(p.object);
 return <div className="object-more object-inspector compact-inspector" role="region" aria-label="物件定制"><div className="inspector-content">
  {variants.length>0&&<div className="variant-options" aria-label="款式">{variants.map(v=><button key={v.id} aria-label={`款式 ${v.label}`} aria-pressed={current?.id===v.id} onClick={()=>p.onVariant(v)}><span>{p.renderThumb(makeVariantPreview(p.object,v))}</span><small>{v.label}</small></button>)}</div>}
  {canColor(a)&&<label className="object-color-label">颜色<input aria-label="物件颜色" type="color" value={p.object.content.color||'#7296a1'} onChange={e=>p.onColor(e.target.value)}/></label>}
  {canEdit(a)&&<button className="inspector-edit" onClick={p.onEdit}>编辑内容 <span>↗</span></button>}
  <label>大小<input aria-label="物件尺寸" type="range" min=".55" max="1.6" step=".01" value={p.object.scale} onChange={e=>p.onSize(+e.target.value)}/></label>
 </div></div>;
}
