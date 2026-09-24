// Small, local fallbacks for APIs used by TIN. No network / worker polyfills.
const g=window as any;if(!g.globalThis)g.globalThis=g;
if(!g.structuredClone)g.structuredClone=(value:any)=>JSON.parse(JSON.stringify(value));
if(!Array.prototype.at)Object.defineProperty(Array.prototype,'at',{value:function(i:number){return this[i<0?this.length+i:i];}});
if(!String.prototype.replaceAll)Object.defineProperty(String.prototype,'replaceAll',{value:function(a:string,b:string){return this.split(a).join(b);}});
if(!Promise.allSettled)(Promise as any).allSettled=(values:any[])=>Promise.all(values.map(p=>Promise.resolve(p).then(value=>({status:'fulfilled',value}),reason=>({status:'rejected',reason}))));
if(!Promise.prototype.finally)(Promise.prototype as any).finally=function(cb:()=>any){return this.then((v:any)=>Promise.resolve(cb()).then(()=>v),(e:any)=>Promise.resolve(cb()).then(()=>{throw e;}));};
if(!g.ResizeObserver)g.ResizeObserver=class {nodes=new Map<Element,string>();timer:any;constructor(public cb:()=>void){}observe(el:Element){this.nodes.set(el,'');if(!this.timer)this.timer=setInterval(()=>{if(document.hidden)return;let changed=false;this.nodes.forEach((old,el)=>{const r=el.getBoundingClientRect(),next=r.width+','+r.height;if(next!==old){changed=true;this.nodes.set(el,next);}});if(changed)this.cb();},220);}disconnect(){clearInterval(this.timer);this.nodes.clear();}};
if(!CanvasRenderingContext2D.prototype.roundRect)CanvasRenderingContext2D.prototype.roundRect=function(x:number,y:number,w:number,h:number,r:any){r=Math.min(Math.abs(w)/2,Math.abs(h)/2,Array.isArray(r)?r[0]:r||0);this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath();return undefined as any;};
const flex=document.createElement('div');flex.style.cssText='display:flex;flex-direction:column;row-gap:1px;position:absolute;visibility:hidden';flex.append(document.createElement('i'),document.createElement('i'));document.body.appendChild(flex);if(flex.scrollHeight!==1)document.documentElement.classList.add('no-flex-gap');flex.remove();

if(!Element.prototype.replaceChildren)Element.prototype.replaceChildren=function(...nodes:(Node|string)[]){while(this.firstChild)this.removeChild(this.firstChild);nodes.forEach(n=>this.appendChild(typeof n==='string'?document.createTextNode(n):n));};

if(!window.CSS||!CSS.supports('padding-top','env(safe-area-inset-top)')){for(const side of ['top','bottom','left','right']){const name='--safe-area-inset-'+side;if(!getComputedStyle(document.documentElement).getPropertyValue(name).trim())document.documentElement.style.setProperty(name,'0px');}}
