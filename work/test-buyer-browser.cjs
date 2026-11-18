const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const {chromium} = require('C:/Users/JAD/node_modules/playwright');
const root = 'http://127.0.0.1:8000/';
const captureDir = '.impeccable/review/buyer';
async function fits(page) {
  const dimensions = await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(dimensions.scroll<=dimensions.width,JSON.stringify(dimensions));
}
async function capture(page,name) {
  await page.evaluate(async()=>{await document.fonts.ready;scrollTo(0,0);});
  await page.screenshot({path:`${captureDir}/${name}.png`,fullPage:true});
}
async function review(frame,amount) {
  await frame.locator('#amount').fill(String(amount));
  await frame.locator('#acknowledge').check();
  await frame.locator('#review-button').click();
  await frame.locator('#review').waitFor({state:'visible'});
}

(async()=>{
  fs.mkdirSync(captureDir,{recursive:true});
  const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
  try {
    const page=await browser.newPage({viewport:{width:1440,height:1050},reducedMotion:'reduce'});
    const errors=[],writes=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('request',request=>{if(request.method()!=='GET')writes.push(request.url());});
    await page.goto(root+'marketplace.html');
    const catalog=await page.evaluate(()=>window.EwiseCatalog);
    assert.equal(await page.locator('.buyer-action').count(),catalog.length);
    assert.equal(await page.getByRole('link',{name:/Place a bid on/}).count(),catalog.filter(product=>product.sale==='bidding').length);
    assert.equal(await page.getByRole('link',{name:/Make an offer on/}).count(),catalog.filter(product=>product.sale!=='bidding').length);
    await capture(page,'marketplace-desktop');
    await page.getByRole('link',{name:'Make an offer on Apple iPhone 13',exact:true}).click();
    await page.waitForURL('**/buyer.html?listing=iphone-13');
    await capture(page,'desktop');

    for(const value of ['', '0','-1','0.5','10000000']) {
      await page.locator('#amount').fill(value);
      await page.locator('#review-button').click();
      assert.equal(await page.locator('#review').isVisible(),false);
      assert.match(await page.locator('#amount-error').innerText(),/whole-peso/);
    }
    await capture(page,'amount-error');
    await page.locator('#amount').fill('17500');
    await page.locator('#review-button').click();
    assert.match(await page.locator('#form-error').innerText(),/disclosed condition/);
    await page.locator('#message').fill('Could we discuss handover? This is a sample offer.');
    await review(page,17500);
    assert.match(await page.locator('#review-amount').innerText(),/17,500/);
    assert.match(await page.locator('#review-facts').innerText(),/Camera not working/);
    await capture(page,'offer-review');
    await page.locator('#edit-proposal').click();
    assert.equal(await page.locator('#amount').inputValue(),'17500');
    await review(page,18000);
    await page.locator('#submit-demo').click();
    assert.match(await page.locator('#confirmation').innerText(),/No offer was sent/);
    assert.match(await page.locator('#confirmation-facts').innerText(),/18,000/);
    await capture(page,'offer-complete');
    await page.locator('#edit-again').click();
    assert.equal(await page.locator('#amount').inputValue(),'18000');

    await page.goto(root+'marketplace.html');
    await page.getByRole('link',{name:'Place a bid on Samsung Galaxy S21',exact:true}).click();
    await capture(page,'bid-desktop');
    assert.equal(await page.locator('#message-field').isVisible(),false);
    assert.equal(await page.locator('#amount').getAttribute('min'),'9000');
    await page.locator('#amount').fill('8999');
    await page.locator('#review-button').click();
    assert.match(await page.locator('#amount-error').innerText(),/9,000/);
    await review(page,9000);
    assert.match(await page.locator('#review-amount').innerText(),/9,000/);
    await page.locator('#edit-proposal').click();
    await review(page,9500);
    await capture(page,'bid-review');
    await page.locator('#submit-demo').click();
    assert.match(await page.locator('#confirmation').innerText(),/No live bid was placed/);
    assert.match(await page.locator('#next-step-copy').innerText(),/does not mean you’ve won/);
    await capture(page,'bid-complete');

    for(const product of catalog) {
      await page.goto(root+'buyer.html?listing='+product.id);
      assert.equal(await page.locator('#device-name').innerText(),product.name);
      assert.match(await page.locator('#form-listing').innerText(),new RegExp(product.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
      assert.equal(await page.locator('#listing-condition').innerText(),product.issue);
      assert.equal(await page.locator('#classification').innerText(),product.classification);
      assert.equal(await page.locator('#amount').getAttribute('min'),String(product.sale==='bidding'?product.price:1));
    }
    await page.goto(root+'buyer.html?listing=iphone-11');
    await review(page,2000);
    assert.match(await page.locator('#review-facts').innerText(),/For parts/);
    assert.match(await page.locator('#review-facts').innerText(),/Won’t power on/);
    await capture(page,'parts-review');
    await page.goto(root+'buyer.html?listing=unknown-device');
    assert.equal(await page.locator('#not-found').isVisible(),true);
    assert.equal(await page.locator('#buyer-layout').isVisible(),false);
    await capture(page,'not-found');
    await page.getByRole('link',{name:'Browse sample listings'}).click();
    await page.waitForURL('**/marketplace.html');

    await page.goto(root+'buyer.html');
    for(const width of [1440,1280,900,800,390,320]) {
      await page.setViewportSize({width,height:900});
      await fits(page);
      assert.ok(await page.locator('#form-listing').evaluate(context=>context.getBoundingClientRect().bottom<document.getElementById('amount').getBoundingClientRect().top),'Selected listing precedes the amount input');
      if(width===390)await capture(page,'mobile');
      if(width===320)await capture(page,'mobile-320');
    }
    await page.locator('#message').fill('<img src=x onerror=alert(1)> '+ 'Long sample message. '.repeat(20));
    await page.locator('#amount').fill('17500');
    await page.locator('#acknowledge').check();
    await page.locator('#amount').focus();
    await page.keyboard.press('Enter');
    await page.locator('#review').waitFor({state:'visible'});
    assert.equal(await page.locator('#review-message img').count(),0);
    await fits(page);
    await capture(page,'mobile-review');
    await page.goto(root+'buyer.html?listing=galaxy-s21');
    await review(page,9500);
    await fits(page);
    await capture(page,'mobile-bid-review');

    await page.setViewportSize({width:1440,height:1050});
    await page.goto(root+'homepage.html');
    const homeBid=page.getByRole('link',{name:'Place bid',exact:true}).first();
    const homeBidHref=await homeBid.getAttribute('href');
    await homeBid.click();
    await page.waitForURL(root+homeBidHref);
    await page.goto(root+'homepage.html');
    const homeOffer=page.getByRole('link',{name:'Make offer',exact:true}).first();
    const homeOfferHref=await homeOffer.getAttribute('href');
    await homeOffer.click();
    await page.waitForURL(root+homeOfferHref);

    async function boardChecks() {
      const market=page.frameLocator('iframe[data-page="marketplace"]');
      await market.getByRole('link',{name:'Place a bid on Samsung Galaxy S21',exact:true}).click();
      const buyer=page.frameLocator('iframe[data-page="buyer"]');
      await buyer.locator('#device-name').filter({hasText:'Samsung Galaxy S21'}).waitFor();
      await review(buyer,9500);
      await buyer.locator('#submit-demo').click();
      assert.equal(await buyer.locator('#confirmation').isVisible(),true);
      await buyer.getByRole('link',{name:'Back to marketplace →',exact:true}).click();
      await market.getByRole('link',{name:'Make an offer on Apple iPhone 11',exact:true}).click();
      await buyer.locator('#device-name').filter({hasText:'Apple iPhone 11'}).waitFor();
      await review(buyer,2000);
      assert.equal(await page.locator('.board iframe').count(),7);
    }
    await page.goto(root);
    await boardChecks();
    const board=fs.readFileSync('outputs/E-wise-design-baseline.html');
    const server=http.createServer((request,response)=>{response.setHeader('Content-Type','text/html; charset=utf-8');response.end(board);});
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    try {await page.goto(`http://127.0.0.1:${server.address().port}/`);await boardChecks();}
    finally {await new Promise(resolve=>server.close(resolve));}
    assert.deepEqual(errors,[]);
    assert.deepEqual(writes,[],'Prototype never submits a network write');
    console.log('PASS: '+catalog.length+' listing identities; offer/bid/parts flows; amount and acknowledgement validation; minimum bid; review/edit/demo completion; unknown-listing recovery; safe messages; keyboard; widths320–1440; native/home/live/portable handoff; no pageerrors or network writes.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
