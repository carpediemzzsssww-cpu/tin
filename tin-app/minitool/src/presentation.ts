import type {TinDocument,Presentation} from './types';
export const titleFonts:Record<Presentation['titleFont'],string>={script:'"TIN Script", "TIN Hand", cursive',hand:'"TIN Hand", "TIN Script", cursive',serif:'Georgia, "Songti SC", serif',type:'"Courier New", monospace'};
export async function loadTitleFonts(){await Promise.all([document.fonts.load('72px "TIN Script"'),document.fonts.load('72px "TIN Hand"')]);}
export function drawPresentation(ctx:CanvasRenderingContext2D,doc:TinDocument,w:number,h:number){
 const p=doc.presentation,s=w/1100,color=p.titleColor;ctx.save();ctx.fillStyle=color;ctx.strokeStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';
 const title=(text:string,y:number,scale=1)=>{ctx.save();ctx.translate(w/2,y);ctx.rotate(p.titleRotation*Math.PI/180);let size=92*s*p.titleSize*scale;ctx.font=`${size}px ${titleFonts[p.titleFont]}`;const measure=ctx.measureText(text).width;if(measure>w*.82){size*=w*.82/measure;ctx.font=`${size}px ${titleFonts[p.titleFont]}`;}ctx.fillText(text,0,0);ctx.restore();};
 if(p.titlePosition==='split'){title("What's in",h*.078,.92);title(doc.title||'My little world',h*.90,1);}else title(doc.title||'My little world',h*(p.titlePosition==='top'?.083:.90));
 ctx.font=`${15*s}px Arial`;ctx.globalAlpha=.82;ctx.fillText(p.caption.slice(0,64),w/2,h*.957,w*.82);ctx.globalAlpha=1;
 if(p.decoration==='stars'){for(const [a,b,r,angle] of [[.08,.28,15,.2],[.91,.42,19,-.2],[.11,.77,10,.4],[.88,.78,12,.1]]){ctx.save();ctx.translate(w*a,h*b);ctx.rotate(angle);ctx.beginPath();for(let i=0;i<10;i++){const d=i%2?r*.45:r,t=i*Math.PI/5-Math.PI/2;ctx.lineTo(Math.cos(t)*d*s,Math.sin(t)*d*s);}ctx.closePath();ctx.globalAlpha=.8;ctx.fill();ctx.restore();}}
 if(p.decoration==='orbit'){ctx.lineWidth=.8*s;ctx.globalAlpha=.65;for(const a of [.08,.92]){ctx.beginPath();ctx.arc(w*a,h*.51,15*s,0,7);ctx.stroke();ctx.beginPath();ctx.ellipse(w*a,h*.51,23*s,6*s,-.5,0,7);ctx.stroke();}ctx.globalAlpha=1;}
 ctx.restore();
}
