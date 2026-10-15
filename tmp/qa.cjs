const {chromium}=require('C:/Users/ACER/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const b=await chromium.launch({headless:true,channel:'msedge'});
 try{
  const page=await b.newPage({viewport:{width:1440,height:1000}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:5501');await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('img').evaluateAll(xs=>xs.every(x=>x.complete && x.naturalWidth>0)),true);
  await page.locator('#cake-scene').focus();await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('#cake').evaluate(e=>e.style.getPropertyValue('--rz')),'-2deg');
  await page.locator('#reset-rotation').click();
  assert.equal(await page.locator('#cake').evaluate(e=>e.style.getPropertyValue('--rz')),'-12deg');
  await page.locator('#motion-toggle').click();assert.equal(await page.locator('#motion-toggle').getAttribute('aria-pressed'),'true');
  await page.locator('#review-name').fill('Prueba');await page.locator('#review-comment').fill('Una reseña');
  await page.locator('#review-form input[type=checkbox]').check();await page.locator('#review-form button[type=submit]').click();
  assert.match(await page.locator('#review-message').textContent(),/no se ha enviado/);
  await page.screenshot({path:'tmp/desktop.png',fullPage:true});
  await page.locator('#inicio').screenshot({path:'tmp/hero.png'});
  for(const width of [320,390,768,1440]){
   await page.setViewportSize({width,height:900});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`overflow at ${width}`);
  }
  await page.setViewportSize({width:390,height:844});await page.locator('#inicio').screenshot({path:'tmp/mobile-hero.png'});
  const posts=[];let rows=[];let fail=false;
  await page.route('**/config.js',r=>r.fulfill({contentType:'application/javascript',body:'window.BOCATTO_CONFIG={supabaseUrl:"https://test.supabase.co",supabaseKey:"sb_publishable_test"};'}));
  await page.route('https://test.supabase.co/**',async r=>{
   if(fail) return r.fulfill({status:500,body:'error'});
   if(r.request().method()==='POST'){
    const data=r.request().postDataJSON();posts.push({url:r.request().url(),data});
    if(r.request().url().includes('resenas')) rows.unshift({...data,fecha:'2026-10-14T15:00:00Z'});
    return r.fulfill({status:201,body:''});
   }
   return r.fulfill({contentType:'application/json',body:JSON.stringify(rows)});
  });
  await page.reload();await page.locator('#review-name').fill('<img src=x onerror=alert(1)>');
  await page.locator('#review-comment').fill('Me gustó <script>alert(1)</script>');
  await page.locator('#review-form input[type=checkbox]').check();await page.locator('#review-form button[type=submit]').click();
  await page.waitForFunction(()=>document.querySelector('#review-message').textContent.includes('correctamente'));
  await page.waitForSelector('.review-card');assert.equal(await page.locator('.review-card img,.review-card script').count(),0);
  assert.equal(posts.length,1);
  await page.locator('#contact-name').fill('Prueba');await page.locator('#contact-email').fill('prueba@example.com');
  await page.locator('#contact-form input[type=checkbox]').check();await page.locator('#contact-form button[type=submit]').click();
  await page.waitForFunction(()=>document.querySelector('#contact-message').textContent.includes('Registramos'));
  assert.equal(posts.length,2);assert.equal(posts[1].data.consentimiento,true);
  fail=true;await page.locator('#refresh-reviews').click();
  await page.waitForFunction(()=>document.querySelector('#reviews-status').textContent.includes('No pudimos'));
  assert.equal(await page.locator('#refresh-reviews').isEnabled(),true);
  assert.deepEqual(errors,[]);console.log('PASS: responsive 320/390/768/1440, images, keyboard rotation/reset/pause, unavailable state, mocked review/contact submissions, escaped user content, loading failure recovery. No JS errors.');
 }finally{await b.close()}
})();
