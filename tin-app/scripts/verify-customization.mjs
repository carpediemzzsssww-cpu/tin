import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const out='output/acceptance-customization';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true}),checks=[],errors=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const button=n=>page.getByRole('button',{name:n,exact:true});
const state=()=>page.evaluate(()=>JSON.parse(window.render_game_to_text()));
const ready=()=>page.waitForFunction(()=>window.render_game_to_text&&JSON.parse(window.render_game_to_text()).loading===0);
const clean=objects=>objects.map(({screen,...o})=>o);
const record=(name,detail=true)=>{checks.push({name,pass:true,detail});console.log('PASS',name);};
const texture=()=>page.evaluate(async()=>{const e=window.TIN_DEBUG.scene,{objectCanvas}=await import('/src/textures.ts');return(await objectCanvas(e.doc.objects.find(o=>o.id===e.selected),e.photos)).toDataURL();});
const add=async(category,name)=>{await button(category).click();await button('添加'+name).click();await ready();};
try{
 await page.goto('http://127.0.0.1:5175');await ready();
 const familyChecks=[['随身物品','琥珀眼镜',['鼠尾草','香槟金']],['随身物品','蓝格发圈',['藕粉','草绿']],['花草贝壳','奶油兰花',['浅粉','奶油黄']],['玩具挂件','手作布偶',['苔绿小兔']],['玩具挂件','红骰子',['奶油白']],['随身物品','白色半卷耳机',['黑色']],['纸片票根','白纸电影票根',['浅蓝']]];
 for(const [category,name,choices] of familyChecks){await add(category,name);const before=(await state()).objects.at(-1);await button('更多物件操作').click();let previous=await texture();for(const choice of choices){await button('款式 '+choice).click();await ready();const next=await texture();assert.notEqual(next,previous);previous=next;const o=(await state()).objects.at(-1);assert.deepEqual(o.position,before.position);assert.equal(o.layer,before.layer);assert.equal(o.rotation,before.rotation);}await button('更多物件操作').click();}
 record('seven object families switch visible variants without changing placement');
 await add('纸片票根','条纹纸胶带');await button('更多物件操作').click();for(const label of ['波点','格子','条纹']){const before=await texture();await button('款式 '+label).click();await ready();assert.notEqual(await texture(),before);}await page.getByLabel('物件颜色',{exact:true}).fill('#bd8292');assert.equal((await state()).objects.at(-1).content.color,'#bd8292');await button('更多物件操作').click();record('washi patterns and procedural colors update live');
 // Two direct actions remain outside the customization popup.
 let s=await state();const selected=s.objects.at(-1),surface=selected.surface;const stack=()=>s.objects.filter(o=>o.surface===surface).sort((a,b)=>b.layer-a.layer);assert.equal(stack()[0].id,selected.id);
 await button('下移一层').click();s=await state();assert.equal(stack()[1].id,selected.id);await button('上移一层').click();s=await state();assert.equal(stack()[0].id,selected.id);assert.equal(await button('上移一层').isDisabled(),true);await page.waitForTimeout(200);await page.screenshot({path:out+'/layers-mobile.png'});await button('更多物件操作').click();assert.equal(await button('叠放顺序').count(),0);assert.equal(await page.locator('.layer-stack').count(),0);await button('更多物件操作').click();record('up / down sit beside selected object, with no layer list or tab');
 // Editing values must change the rendered carrier, not only its stored data.
 const papers=[
 ['白纸电影票根',{'名称':'AFTER HOURS','日期':'2026.10.02','座位':'C 08','影院 / 场地':'OUR CINEMA','票根寄语':'JUST US TWO'}],
 ['普通小票',{'店名':'MIDNIGHT STORE','时间':'2026.10.02 23:18','清单（每行一项）':'FLOWERS  12.00\nMILK  3.00','合计':'15.00','小票寄语':'KEEP THE CHANGE'}],
 ['撕边信纸',{'小标题':'dear tomorrow','纸条内容':'今天也有值得收藏的小事。'}],
 ['未寄出的信',{'收件人':'小雨','寄件人':'林','信封寄语':'see you in spring'}],
 ['纪念日历',{'纪念日':'2027-04-16','日历寄语':'OUR FIRST TRIP'}],
 ['剪贴数字',{'四位数字':'1016'}],
 ['蕾丝纸垫',{'中心文字':'for you'}],
 ['条纹纸胶带',{'胶带文字':'OUR LITTLE DAYS'}],
 ];
 for(const [name,fields] of papers){await add('纸片票根',name);const before=await texture();await button('编辑内容').click();if(await button('更多文字').count())await button('更多文字').click();for(const [label,value] of Object.entries(fields))await page.getByLabel(label,{exact:true}).fill(value);await button('保存').click();await ready();assert.notEqual(await texture(),before,name);}
 await add('玩具挂件','旅馆钥匙牌');await button('编辑内容').click();for(const [name,value] of [['旅馆名称','HOTEL MOON'],['地点','PARIS'],['房间号','128']])await page.getByLabel(name,{exact:true}).fill(value);await button('保存').click();await ready();
 await add('小零件','星月火漆');await button('编辑内容').click();await page.getByLabel('印章字母').fill('AB');await button('保存').click();await ready();record('ten printed paper / tag / seal families edit actual rendered content');
 await add('纸片票根','旅行画片');const originalCard=await texture();await button('编辑内容').click();await page.getByLabel('画片说明').fill('somewhere with you');await page.getByLabel('导入纸件照片').setInputFiles('output/acceptance-desk/original-photo-fixture.png');await page.waitForFunction(()=>JSON.parse(window.render_game_to_text()).photoCount===1);await button('保存').click();await ready();assert.notEqual(await texture(),originalCard);const photoId=(await state()).objects.at(-1).content.photoId;assert.ok(photoId);
 await add('纸片票根','短段负片');const originalFilm=await texture();await button('编辑内容').click();await page.getByLabel('胶片说明').fill('OCT 02 · US');for(const slot of [1,2,3]){await button('第 '+slot+' 格').click();await page.getByLabel('纸件照片',{exact:true}).selectOption(photoId);}await page.screenshot({path:out+'/film-editor-mobile.png'});await button('保存').click();await ready();assert.notEqual(await texture(),originalFilm);assert.deepEqual((await state()).objects.at(-1).content.photoIds,[photoId,photoId,photoId]);record('picture card and three film frames use locally uploaded photo');
 const prior=await state();await button('随机取物').click();await page.screenshot({path:out+'/direct-random-mobile.png'});await ready();s=await state();assert.equal(s.objects.length,prior.objects.length+3);assert.deepEqual(s.presentation,prior.presentation);assert.deepEqual(clean(s.objects.slice(0,prior.objects.length)),clean(prior.objects));const grabbed=s;
 await button('随机整盒').click();await ready();s=await state();assert.ok(s.presentation.styleId);assert.ok(s.objects.every(o=>!grabbed.objects.find(p=>p.id===o.id)));assert.equal(s.photoCount,1);await button('撤销').click();await ready();assert.deepEqual(clean((await state()).objects),clean(grabbed.objects));record('grab is additive; whole tin changes composition; undo restores private content');
 await button('设置').click();await button('清空物件').click();await page.getByRole('alertdialog').waitFor();assert.equal((await state()).objects.length,grabbed.objects.length);await page.screenshot({path:out+'/clear-confirmation.png'});await button('取消').click();assert.equal((await state()).objects.length,grabbed.objects.length);
 await button('设置').click();await button('清空物件').click();await button('确认清空').click();s=await state();assert.equal(s.objects.length,0);assert.equal(s.photoCount,1);assert.deepEqual(s.presentation,grabbed.presentation);await button('撤销').click();await ready();assert.deepEqual(clean((await state()).objects),clean(grabbed.objects));record('clear requires confirmation, cancels safely, preserves photos / colors and is undoable');
 const saved=await state();await page.waitForTimeout(750);await page.reload();await ready();assert.deepEqual(clean((await state()).objects),clean(saved.objects));assert.equal((await state()).photoCount,1);await button('打开盒盖').click();record('all variants, paper fields, layers and photo references survive reload');
 await button('预览与保存').click();const download=page.waitForEvent('download');await page.getByRole('link',{name:'保存 PNG',exact:true}).click();await(await download).saveAs(out+'/customized-tin.png');await button('关闭成品预览').click();assert.ok((await fs.stat(out+'/customized-tin.png')).size>100000);record('customized composition exports PNG');
 for(const width of [320,390,1440]){await page.setViewportSize({width,height:width===1440?1000:844});await add('随身物品','琥珀眼镜');await button('更多物件操作').click();await button('款式 香槟金').click();await ready();const box=await page.locator('.object-inspector').boundingBox();assert.ok(box.x>=0&&box.x+box.width<=width+1&&box.y>=0);await page.screenshot({path:`${out}/variants-${width}.png`});await button('更多物件操作').click();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}record('variant controls fit 320 / 390 / 1440 px');
 assert.deepEqual(errors,[]);record('no runtime or console errors');
}catch(e){checks.push({name:'failure',pass:false,detail:e.stack});console.error(e);await page.screenshot({path:out+'/failure.png'});process.exitCode=1;}
finally{await fs.writeFile(out+'/report.json',JSON.stringify({date:new Date().toISOString(),realPhone:false,checks,errors},null,2));await browser.close();}
