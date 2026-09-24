import {TinScene as GLScene} from './scene';import {CanvasScene} from './canvas-scene';
// Keep the same public scene API while moving to Canvas on GPU failure or low mode.
export const TinScene=function(...args:ConstructorParameters<typeof GLScene>){
 let active:GLScene|CanvasScene;let inset=180,side=0;
 try{active=new GLScene(...args);}catch(error){console.warn('TIN 3D unavailable, using Canvas',error);args[0].replaceChildren();active=new CanvasScene(...args);}
 function light(){if(active instanceof CanvasScene)return;const old=active,{doc,photos,mode,selected,blocked,lid,reduced}=old;old.dispose();active=new CanvasScene(args[0],doc,photos,args[3]);active.setDockInset(inset,side);active.setMode(mode);active.lid=lid;active.blocked=blocked;active.setSelected(selected);active.setReduced(reduced);}
 return new Proxy({},{get(_target,key){if(key==='setDockInset')return (n:number,s=0)=>{inset=n;side=s;active.setDockInset(n,s);};if(key==='setLow')return (value:boolean)=>{if(value)light();else if(active instanceof GLScene)active.setLow(false);};const value=(active as any)[key];return typeof value==='function'?value.bind(active):value;},set(_target,key,value){(active as any)[key]=value;return true;}});
} as unknown as typeof GLScene;
export type TinScene=GLScene;
