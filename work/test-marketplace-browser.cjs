const assert = require('node:assert/strict');
const fs = require('node:fs');
const {chromium} = require('C:/Users/JAD/node_modules/playwright');
const captureDir = '.impeccable/review/marketplace';

(async()=>{
  fs.mkdirSync(captureDir,{recursive:true});
  const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
  const page = await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  const cards = ()=>page.locator('.product-card');
  const option = (name,value)=>page.locator(`input[name="${name}"][value="${value}"]`);
  async function capture(name) {
    await page.evaluate(async()=>{await document.fonts.ready; window.scrollTo(0,0);});
    await page.screenshot({path:`${captureDir}/${name}.png`,fullPage:true});
  }
  async function fits() {
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow');
  }
  try {
    await page.goto('http://127.0.0.1:8000/marketplace.html');
    assert.equal(await cards().count(),12);
    assert.ok(await page.locator('.filter-sidebar').evaluate(side=>side.getBoundingClientRect().right<document.querySelector('.results-area').getBoundingClientRect().left));
    await fits(); await capture('desktop');
    await page.getByRole('button',{name:'Smartphones',exact:true}).click();
    assert.equal(await cards().count(),6);
    await page.locator('.filter-group').filter({has:page.locator('#brand-options')}).locator('summary').click();
    await option('brand','Apple').check();
    assert.equal(await cards().count(),3);
    assert.equal(await page.locator('.option-count[data-group="brand"][data-value="Apple"]').innerText(),'3');
    await option('sale','fixed').check();
    assert.equal(await cards().count(),1);
    assert.equal(await cards().first().getAttribute('data-id'),'iphone-13');
    await capture('filtered');
    await page.getByRole('button',{name:'Remove filter: Fixed price',exact:true}).click();
    assert.equal(await cards().count(),3);
    await page.getByRole('button',{name:'Clear all',exact:true}).click();
    for(const name of ['condition','classification']) {
      const group = page.locator('.filter-group').filter({has:page.locator('#'+name+'-options')});
      if(await group.getAttribute('open')===null) await group.locator('summary').click();
    }
    await option('classification','Repairable').check();
    assert.equal(await cards().count(),2);
    await option('condition','Good').check();
    assert.equal(await cards().count(),0);
    await option('condition','Good').uncheck();
    await option('condition','Fair').check();
    assert.equal(await cards().count(),2);
    await page.getByRole('button',{name:'Clear all',exact:true}).click();
    await page.getByRole('searchbox',{name:'Search marketplace'}).fill('apple 128');
    assert.equal(await cards().count(),1);
    await page.getByRole('searchbox',{name:'Search marketplace'}).fill('<img src=x onerror=alert(1)>');
    assert.equal(await cards().count(),0);
    await capture('empty');
    assert.equal(await page.locator('#active-filters img').count(),0,'Search is rendered as text');
    await page.getByRole('button',{name:'Clear search & filters'}).click();
    assert.equal(await cards().count(),12);
    await page.locator('#sort').selectOption('price-low');
    assert.equal(await cards().first().getAttribute('data-id'),'iphone-11');
    await page.locator('#sort').selectOption('price-high');
    assert.equal(await cards().first().getAttribute('data-id'),'macbook-air');
    await page.locator('#sort').selectOption('newest');
    assert.equal(await cards().first().getAttribute('data-id'),'iphone-12-mini');
    await page.locator('#price-min').fill('10000');
    await page.locator('#price-max').fill('20000');
    assert.equal(await cards().count(),4);
    await page.locator('#price-max').fill('5000');
    assert.equal(await cards().count(),0);
    assert.match(await page.locator('#price-error').innerText(),/minimum/);
    await capture('price-error');
    await page.getByRole('button',{name:'Clear all',exact:true}).click();
    await page.locator('#sort').selectOption('featured');
    await cards().first().locator('summary').focus();
    await page.keyboard.press('Enter');
    assert.equal(await cards().first().locator('details').getAttribute('open'),'');
    assert.match(await cards().first().locator('.listing-copy').innerText(),/camera fault/);
    await capture('listing-open');
    await page.goto('http://127.0.0.1:8000/marketplace.html?category=laptops&q=Lenovo');
    assert.equal(await cards().count(),1);
    assert.equal(await cards().first().getAttribute('data-id'),'thinkpad-t14');
    await page.evaluate(()=>document.dispatchEvent(new CustomEvent('ewise:browse',{detail:{category:'gaming',q:''}})));
    assert.equal(await cards().count(),1);
    assert.equal(await cards().first().getAttribute('data-id'),'switch-lite');
    await page.evaluate(()=>document.dispatchEvent(new CustomEvent('ewise:browse',{detail:{category:'__proto__',q:''}})));
    assert.equal(await cards().count(),12,'Unknown preset categories are ignored');
    for(const width of [1280,1024,800,760,390,320]) {
      await page.setViewportSize({width,height:900});
      await fits();
      if(width===390) await capture('mobile');
      if(width===320) await capture('mobile-320');
    }
    await page.locator('#filter-toggle').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#filter-toggle').getAttribute('aria-expanded'),'true');
    await option('category','audio').check();
    assert.equal(await cards().count(),1);
    await capture('mobile-filters');
    await page.locator('#filter-toggle').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#filter-body').isVisible(),false);
    assert.deepEqual(errors,[]);
    console.log('PASS: left sidebar; search; combined filters/chips/reset; sort; price ranges/errors; empty recovery; keyboard details/mobile filters; native and event presets; 320–1440px overflow; no page errors.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
