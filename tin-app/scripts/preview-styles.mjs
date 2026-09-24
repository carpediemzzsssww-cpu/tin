import {chromium} from 'playwright';
import fs from 'node:fs/promises';
const out='output/styles';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:5175');await page.waitForFunction(()=>window.TIN_DEBUG);
await page.getByRole('button',{name:'风格与排版',exact:true}).click();
for(const [id,name] of [['midnight','怪奇午夜电台'],['grand','粉色旅馆'],['letters','魔法来信'],['weekend','蓝色周末'],['birthday','生日俱乐部']]){
 await page.getByRole('button',{name:'使用'+name,exact:true}).click();await page.waitForFunction(()=>JSON.parse(window.render_game_to_text()).loading===0);await page.waitForTimeout(900);
 const data=await page.evaluate(async()=>{const b=await window.TIN_DEBUG.scene.exportPNG();return Array.from(new Uint8Array(await b.arrayBuffer()));});await fs.writeFile(`${out}/${id}.png`,Buffer.from(data));
}
await page.screenshot({path:`${out}/studio-desktop.png`});await page.getByRole('button',{name:'关闭风格',exact:true}).click();await page.screenshot({path:`${out}/desk-desktop.png`});
await page.setViewportSize({width:390,height:844});await page.screenshot({path:`${out}/desk-mobile.png`});await page.getByRole('button',{name:'风格与排版',exact:true}).click();await page.waitForTimeout(700);await page.screenshot({path:`${out}/studio-mobile.png`});
console.log(JSON.stringify({errors,state:await page.evaluate(()=>JSON.parse(window.render_game_to_text()))}));await browser.close();
