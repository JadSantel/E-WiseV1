const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const { chromium } = require('C:/Users/JAD/node_modules/playwright');

const captureDir = '.impeccable/review/routing';
const errors = [];
const captures = [];
async function capture(page, name) {
  await page.evaluate(async () => { await document.fonts.ready; window.scrollTo(0, 0); });
  await page.screenshot({path: `${captureDir}/${name}.png`, fullPage: true});
  captures.push(name);
}
async function fits(page) {
  const size = await page.evaluate(() => ({width: innerWidth, scroll: document.documentElement.scrollWidth}));
  assert.ok(size.scroll <= size.width, `Horizontal overflow: ${JSON.stringify(size)}`);
}

(async () => {
  fs.mkdirSync(captureDir, {recursive: true});
  const browser = await chromium.launch({executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true});
  const page = await browser.newPage({viewport: {width: 1440, height: 1050}, reducedMotion: 'reduce'});
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:8000/verdict.html');
  await page.getByRole('link', {name: 'Choose my route'}).click();
  await page.waitForURL('**/routing.html');
  assert.match(await page.locator('.steps [aria-current="step"]').innerText(), /3\s*Route/);
  await fits(page);
  await capture(page, 'desktop');

  await page.locator('input[name="method"][value="bidding"]').check();
  assert.match(await page.locator('#selection-title').innerText(), /Open for bids/);
  await page.locator('#next-preview summary').click();
  assert.match(await page.locator('#next-content').innerText(), /bidding listing/);
  await capture(page, 'bidding');

  for (const [route, expected] of [['repair', /repair request/], ['salvage', /parts listing/], ['dispose', /recycling request/]]) {
    await page.locator(`input[name="route"][value="${route}"]`).check();
    assert.equal(await page.locator('#next-preview').getAttribute('open'), null, 'Changed route closes an outdated preview');
    assert.equal(await page.locator('#selling-methods').isVisible(), route === 'salvage');
    await page.locator('#next-preview summary').click();
    assert.match(await page.locator('#next-title').innerText(), expected);
    assert.equal(await page.locator('.tag').innerText(), 'Resellable', 'Route selection preserves classification');
    assert.match(await page.locator('.device-facts').innerText(), /Camera not working/);
    await fits(page);
    await capture(page, route);
  }

  await page.locator('input[name="route"][value="resell"]').check();
  await page.locator('input[name="method"][value="fixed"]').check();
  await page.locator('input[name="route"][value="resell"]').focus();
  await page.keyboard.press('ArrowDown');
  assert.equal(await page.locator('input[name="route"][value="repair"]').isChecked(), true);
  await page.keyboard.press('ArrowUp');
  assert.equal(await page.locator('input[name="route"][value="resell"]').isChecked(), true);
  await page.locator('#next-preview summary').focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('#next-preview').getAttribute('open'), '');
  await page.keyboard.press('Enter');

  for (const width of [1280, 900, 800, 390, 320]) {
    await page.setViewportSize({width, height: 900});
    await fits(page);
    if (width === 390) await capture(page, 'mobile');
    if (width === 320) await capture(page, 'mobile-320');
  }
  await page.locator('input[name="route"][value="repair"]').check();
  await page.locator('#next-preview summary').click();
  await capture(page, 'mobile-repair');
  await page.getByRole('link', {name: 'Back to your verdict'}).click();
  await page.waitForURL('**/verdict.html');

  await page.setViewportSize({width: 1440, height: 1050});
  await page.goto('http://127.0.0.1:8000/');
  const live = page.frameLocator('iframe[data-page="verdict"]');
  await live.getByRole('link', {name: 'Choose my route'}).click();
  assert.ok(await page.locator('iframe[data-page="routing"]').evaluate(frame => Math.abs(frame.closest('.board').getBoundingClientRect().top) < 5));
  await page.frameLocator('iframe[data-page="routing"]').locator('input[value="salvage"]').check();
  assert.match(await page.frameLocator('iframe[data-page="routing"]').locator('#estimate').innerText(), /3,000/);

  // Serve the portable export over HTTP to verify the packaged, offline assets and frame navigation.
  const board = fs.readFileSync('outputs/E-wise-design-baseline.html');
  const server = http.createServer((request, response) => { response.setHeader('Content-Type', 'text/html; charset=utf-8'); response.end(board); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    const packed = page.frameLocator('iframe[data-page="routing"]');
    await packed.locator('input[value="repair"]').check();
    assert.match(await packed.locator('#selection-title').innerText(), /Repair/);
    await packed.getByRole('link', {name: 'Back to your verdict'}).click();
    assert.ok(await page.locator('iframe[data-page="verdict"]').evaluate(frame => Math.abs(frame.closest('.board').getBoundingClientRect().top) < 5));
    assert.equal(await page.locator('.board iframe').count(), 6);
  } finally { await new Promise(resolve => server.close(resolve)); }
  assert.deepEqual(errors, []);
  await browser.close();
  console.log('PASS: verdict → routing; all four routes; both methods; keyboard; 320–1440px layouts; live and portable board navigation; no browser exceptions.');
  console.log('Captured: ' + captures.join(', '));
})().catch(error => { console.error(error); process.exit(1); });
