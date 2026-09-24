async page => {
  const base='http://127.0.0.1:5174/samples/';
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width:1440,height:1100});
  await page.goto(base);await page.waitForFunction(()=>window.TIN_SAMPLE_STATE?.stage==='ready');
  const assert=(test,message)=>{if(!test)throw new Error(message);};
  const report={engine:'Chromium',date:'2026-09-24',actual_phone_tested:false};
  report.loaded=await page.evaluate(()=>window.TIN_SAMPLE_STATE.loaded.length);assert(report.loaded===6,'Expected six loaded samples');
  report.inventory_rows=await page.locator('.inventory-item').count();assert(report.inventory_rows===18,'Expected 18 inventory entries');
  report.broken_images=await page.locator('.sample-photo img').evaluateAll(imgs=>imgs.filter(i=>!i.complete||i.naturalWidth===0).length);assert(report.broken_images===0,'Broken sample images');
  await page.locator('#lid-toggle').click();await page.waitForTimeout(650);assert(await page.evaluate(()=>!window.TIN_SAMPLE_STATE.open),'Lid failed to close');
  await page.locator('#studio-canvas').screenshot({path:'output/playwright/samples-closed-final.png'});
  await page.locator('#lid-toggle').click();await page.waitForTimeout(650);assert(await page.evaluate(()=>window.TIN_SAMPLE_STATE.open),'Lid failed to reopen');report.lid_close_reopen=true;
  await page.locator('[data-background=dark]').click();await page.waitForTimeout(250);assert(await page.locator('.sample-photo.dark').count()===6,'Background toggle failed');
  await page.locator('#materials').screenshot({path:'output/playwright/samples-dark-final.png'});
  await page.locator('[data-background=checker]').click();await page.waitForTimeout(250);assert(await page.locator('.sample-photo.checker').count()===6,'Checker toggle failed');report.background_modes=3;
  await page.locator('#ticket-form [name=event]').fill('一起看电影 <3');await page.locator('#ticket-form [name=date]').fill('2026.09.24');await page.locator('#ticket-form [name=seat]').fill('A 07');
  await page.locator('#ticket-form button').click();await page.waitForFunction(()=>window.TIN_SAMPLE_STATE.ticket?.seat==='A 07');
  const ticketText=await page.locator('[data-id=ticket_cream_01] img').evaluate(async img=>await(await fetch(img.src)).text());
  assert(ticketText.includes('&lt;3')&&ticketText.includes('A 07'),'Ticket text/escaping failed');report.ticket_edit_and_escape=true;
  await page.locator('#studio-canvas').screenshot({path:'output/playwright/samples-ticket-edited.png'});
  await page.locator('.inventory-item').nth(6).locator('summary').click();assert(await page.locator('.inventory-item').nth(6).getAttribute('open')!==null,'Inventory detail failed');report.inventory_details=true;
  report.local_resource_status={};for(const path of ['data/inventory.json','ASSET_INVENTORY.md','generation-log.json','assets/generation-log.json','tin-model.js','paper-template.js','vendor/THREE-LICENSE.txt']){const r=await page.request.get(base+path);report.local_resource_status[path]=r.status();assert(r.ok(),`Missing local record: ${path}`);}
  report.viewports=[];
  for(const [width,height] of [[1440,1100],[390,844],[320,740]]){
    await page.setViewportSize({width,height});await page.goto(base);await page.waitForFunction(()=>window.TIN_SAMPLE_STATE?.stage==='ready');
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert(!overflow,`Horizontal overflow at ${width}`);
    report.viewports.push({width,height,horizontal_overflow:overflow});
    if(width!==320)await page.screenshot({path:`output/playwright/samples-${width}-final.png`,fullPage:true});
  }
  await page.emulateMedia({reducedMotion:'reduce'});await page.locator('#lid-toggle').click();await page.waitForTimeout(50);assert(await page.evaluate(()=>!window.TIN_SAMPLE_STATE.open),'Reduced motion lid failed');report.reduced_motion=true;await page.emulateMedia({reducedMotion:'no-preference'});
  const fallback=await page.context().newPage();
  await fallback.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/i.test(type)?null:original.call(this,type,...args);};});
  await fallback.goto(base);await fallback.waitForFunction(()=>window.TIN_SAMPLE_STATE?.stage==='webgl_unavailable');
  assert(await fallback.locator('.sample-card').count()===6,'Fallback hides samples');assert(await fallback.locator('#lid-toggle').isDisabled(),'Fallback control not disabled');report.webgl_fallback=true;await fallback.close();
  const missing=await page.context().newPage();await missing.route('**/assets/key_silver_01-v3.png',route=>route.abort());
  await missing.goto(base);await missing.waitForFunction(()=>window.TIN_SAMPLE_STATE?.stage==='partial');
  assert(await missing.locator('.placeholder').count()===1,'Missing asset placeholder absent');report.asset_load_failure=true;await missing.close();
  await page.setViewportSize({width:1440,height:1100});await page.goto('http://127.0.0.1:5174/');
  assert(await page.locator('.reference-card').count()===40,'Research references changed');assert((await page.locator('.gate').textContent()).includes('A 已确认'),'Gate A not updated');report.research_board_40_refs=true;
  await page.goto('http://127.0.0.1:5174/ART_BIBLE.html');assert((await page.locator('h1').textContent()).includes('v0.2'),'Art Bible stale');report.art_bible_updated=true;
  await page.goto(base);await page.waitForFunction(()=>window.TIN_SAMPLE_STATE?.stage==='ready');
  report.javascript_exceptions=errors;assert(errors.length===0,'Unexpected JavaScript exception');
  return report;
}
