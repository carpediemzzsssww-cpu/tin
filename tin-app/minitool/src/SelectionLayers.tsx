import {useEffect,useRef} from 'react';
import Icon from './Icon';
import type {TinScene} from './scene';
interface Props {scene:()=>TinScene|null;id:string;canUp:boolean;canDown:boolean;onMove:(move:'up'|'down')=>void;onNudge:()=>void;}
export default function SelectionLayers({scene,id,canUp,canDown,onMove,onNudge}:Props){
 const ref=useRef<HTMLDivElement>(null),handle=useRef<HTMLButtonElement>(null);
 useEffect(()=>{let frame=0;function follow(){const engine=scene(),bounds=engine?.selectionBounds(id),el=ref.current,h=handle.current;
  if(el&&h){el.hidden=!bounds||Boolean(engine?.drag);h.hidden=!bounds||Boolean(engine?.drag&&!engine.drag.handle);
   if(bounds){const dock=document.querySelector('.material-drawer')?.getBoundingClientRect().top||innerHeight,top=(document.querySelector('.desk-toolbar')?.getBoundingClientRect().bottom||58)+12;
    el.style.left=`${Math.max(8,Math.min(innerWidth-100,bounds.right-92))}px`;el.style.top=`${Math.max(top,Math.min(dock-118,bounds.top-48))}px`;
    if(!engine?.drag?.handle){let x=Math.max(4,Math.min(innerWidth-48,bounds.right-8)),y=Math.max(top+48,Math.min(dock-118,bounds.bottom-8));const random=document.querySelector('.switch-tin')?.getBoundingClientRect();if(random&&x+44>random.left-8&&y+44>random.top-8&&y<random.bottom+8)x=Math.max(4,random.left-52);h.style.left=`${x}px`;h.style.top=`${y}px`;}
   }}frame=requestAnimationFrame(follow);}follow();return()=>cancelAnimationFrame(frame);},[id,scene]);
 return <><div ref={ref} className="selection-layers" role="toolbar" aria-label="调整叠放"><button title="上移一层" aria-label="上移一层" disabled={!canUp} onClick={()=>onMove('up')}><Icon name="up"/></button><button title="下移一层" aria-label="下移一层" disabled={!canDown} onClick={()=>onMove('down')}><Icon name="down"/></button></div>
  <button ref={handle} className="transform-handle" aria-label="拖动旋转与缩放" title="拖动旋转和缩放 · 双指也可调整" onPointerDown={e=>{if(e.button!==0)return;e.preventDefault();e.stopPropagation();scene()?.beginTransform(id,e.pointerId,e.clientX,e.clientY);}} onClick={e=>{if(e.detail===0)onNudge();}}><Icon name="transform"/></button></>;
}
