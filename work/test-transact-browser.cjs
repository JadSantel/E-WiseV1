const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const {chromium} = require('C:/Users/JAD/node_modules/playwright');
const captureDir = '.impeccable/review/transact';
const root = 'http://127.0.0.1:8000/';
const failures = [];
async function fits(page) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No horizontal overflow');
}
async function capture(page, name) {
  await page.evaluate(async () => { await document.fonts.ready; scrollTo(0, 0); });
  await page.screenshot({path: `${captureDir}/${name}.png`, fullPage: true});
}
async function checkForm(frame) {
  await frame.locator('#acknowledge').check();
  await frame.locator('#review-button').click();
  await frame.locator('#review').waitFor({state: 'visible'});
  assert.match(await frame.locator('#review-facts').innerText(), /Camera not working/);
}

(async () => {
  fs.mkdirSync(captureDir, {recursive:true});
  const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
  try {
    const page = await browser.newPage({viewport:{width:1440,height:1050},reducedMotion:'reduce'});
    page.on('pageerror', error => failures.push(error.message));
    await page.goto(root + 'routing.html');
    await page.getByRole('link', {name:'Continue to Transact'}).click();
    await page.waitForURL('**/transact.html?route=resell&method=fixed');
    assert.match(await page.locator('.steps [aria-current="step"]').innerText(), /4\s*Transact/);
    await capture(page, 'desktop');

    await page.locator('#review-button').click();
    assert.equal(await page.locator('#review').isVisible(), false);
    assert.match(await page.locator('#form-error').innerText(), /camera fault/);
    await page.locator('#listing-title').fill('   ');
    await page.locator('#review-button').click();
    assert.equal(await page.locator('#listing-title').evaluate(input => input.validity.valid), false);
    await page.locator('#listing-title').fill('Sample iPhone 13 with disclosed camera fault');
    assert.match(await page.locator('#preview-title').innerText(), /disclosed camera/);
    await page.locator('#price').fill('-1');
    await page.locator('#review-button').click();
    assert.equal(await page.locator('#price').evaluate(input => input.validity.valid), false);
    await capture(page, 'validation');
    await page.locator('#price').fill('18500');
    assert.match(await page.locator('#preview-price').innerText(), /18,500/);

    const picker = page.locator('#photo-input');
    await picker.setInputFiles({name:'bad.txt',mimeType:'text/plain',buffer:Buffer.from('not an image')});
    assert.match(await page.locator('#photo-error').innerText(), /JPG/);
    await picker.setInputFiles({name:'corrupt.png',mimeType:'image/png',buffer:Buffer.from('not a valid PNG')});
    await page.locator('#photo-error').filter({hasText:'could not be opened'}).waitFor();
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64');
    await picker.setInputFiles({name:'sample.png',mimeType:'image/png',buffer:png});
    await page.locator('#photos img').waitFor();
    assert.equal(await page.locator('#preview-photo img').count(),1);
    await page.getByRole('button',{name:'Remove photo 1'}).click();
    assert.equal(await page.locator('#photo-empty').isVisible(), true);
    assert.equal(await page.locator('#preview-photo img').count(),0);

    await checkForm(page);
    assert.match(await page.locator('#review-facts').innerText(), /18,500/);
    await capture(page, 'review');
    await page.locator('#edit-details').click();
    assert.equal(await page.locator('#price').inputValue(),'18500');
    await checkForm(page);
    await page.locator('#complete-demo').click();
    assert.match(await page.locator('#completion').innerText(), /Nothing has been published/);
    await capture(page, 'completion');
    await page.locator('#edit-again').click();
    assert.equal(await page.locator('#listing-title').inputValue(),'Sample iPhone 13 with disclosed camera fault');

    for (const [route,method] of [['resell','bidding'],['salvage','fixed'],['salvage','bidding'],['repair','fixed'],['dispose','fixed']]) {
      await page.goto(root + 'routing.html');
      await page.locator(`input[name="route"][value="${route}"]`).check();
      if (route === 'resell' || route === 'salvage') await page.locator(`input[name="method"][value="${method}"]`).check();
      await page.locator('#continue-transact').click();
      await page.waitForURL('**/transact.html?**');
      assert.match(await page.locator('#preview-route').innerText(), new RegExp(route === 'resell' ? 'Resell' : route === 'salvage' ? 'Salvage' : route === 'repair' ? 'Repair' : 'Recycle'));
      assert.equal(await page.locator('#price').isEnabled(), ['resell','salvage'].includes(route));
      assert.equal(await page.locator('#duration-field').isVisible(), ['resell','salvage'].includes(route) && method === 'bidding');
      await checkForm(page);
      await page.locator('#complete-demo').click();
      assert.equal(await page.locator('#completion').isVisible(),true);
      await page.locator('#edit-again').click();
      await capture(page, route + '-' + method);
      await page.locator('.route-back').click();
      await page.waitForURL('**/routing.html?**');
      assert.equal(await page.locator(`input[name="route"][value="${route}"]`).isChecked(),true);
      if (['resell','salvage'].includes(route)) assert.equal(await page.locator(`input[name="method"][value="${method}"]`).isChecked(),true);
    }

    await page.goto(root + 'transact.html?route=unknown&method=unknown');
    assert.match(await page.locator('#preview-route').innerText(), /Resell · Fixed price/);
    for (const width of [1440,1280,900,800,390,320]) {
      await page.setViewportSize({width,height:900});
      await fits(page);
      if (width === 390) await capture(page,'mobile');
      if (width === 320) await capture(page,'mobile-320');
    }
    await page.locator('#listing-title').fill('A'.repeat(100));
    await fits(page);
    await page.locator('#description').fill('Long sample text '.repeat(100));
    await checkForm(page);
    await fits(page);
    await capture(page,'mobile-review');
    await page.setViewportSize({width:1440,height:1050});
    await page.goto(root);
    const routing = page.frameLocator('iframe[data-page="routing"]');
    await routing.locator('input[value="salvage"]').check();
    await routing.locator('input[value="bidding"]').check();
    await routing.locator('#continue-transact').click();
    const transact = page.frameLocator('iframe[data-page="transact"]');
    await transact.locator('#preview-route').filter({hasText:'Salvage · Open for bids'}).waitFor();
    await checkForm(transact);
    await transact.locator('.route-back').click();
    assert.equal(await routing.locator('input[value="salvage"]').isChecked(),true);
    assert.equal(await routing.locator('input[value="bidding"]').isChecked(),true);

    const board = fs.readFileSync('outputs/E-wise-design-baseline.html');
    const server = http.createServer((request,response)=>{response.setHeader('Content-Type','text/html; charset=utf-8');response.end(board);});
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    try {
      await page.goto(`http://127.0.0.1:${server.address().port}/`);
      const packedRoute = page.frameLocator('iframe[data-page="routing"]');
      await packedRoute.locator('input[value="repair"]').check();
      await packedRoute.locator('#continue-transact').click();
      const packedTransact = page.frameLocator('iframe[data-page="transact"]');
      await packedTransact.locator('#preview-route').filter({hasText:'Repair / Reuse'}).waitFor();
      await checkForm(packedTransact);
      await packedTransact.locator('#complete-demo').click();
      assert.equal(await packedTransact.locator('#completion').isVisible(),true);
    } finally {await new Promise(resolve=>server.close(resolve));}
    assert.deepEqual(failures,[]);
    console.log('PASS: Transact 6 route/method variants, validation, editable preview, optional photo add/remove and invalid files, review/edit/demo completion, query fallback, selection round-trip, standalone/live/portable boards, 320–1440px no overflow, no page errors.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
