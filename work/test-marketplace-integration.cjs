const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const {chromium} = require('C:/Users/JAD/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
  const errors = [];
  try {
    const page = await browser.newPage({viewport:{width:1440,height:1000}});
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto('http://127.0.0.1:8000/homepage.html');
    await page.getByRole('link',{name:'Browse marketplace'}).click();
    await page.waitForURL('**/marketplace.html');
    assert.equal(await page.locator('.product-card').count(),12);
    await page.goto('http://127.0.0.1:8000/verdict.html');
    await page.locator('.selling-options summary').click();
    await page.getByRole('link',{name:'Compare similar listings'}).click();
    await page.waitForURL('**/marketplace.html?q=iPhone');
    assert.equal(await page.locator('#catalog-search').inputValue(),'iPhone');
    assert.equal(await page.locator('.product-card').count(),3);

    async function boardChecks() {
      const home = page.frameLocator('iframe[data-page="home"]');
      await home.getByRole('link',{name:'Browse marketplace'}).click();
      const market = page.frameLocator('iframe[data-page="marketplace"]');
      await market.locator('.product-card').first().waitFor();
      assert.equal(await market.locator('.product-card').count(),12);
      await page.frameLocator('iframe[data-page="verdict"]').locator('.selling-options summary').click();
      await page.frameLocator('iframe[data-page="verdict"]').getByRole('link',{name:'Compare similar listings'}).click();
      await market.locator('#catalog-search').filter({visible:true}).waitFor();
      await page.waitForFunction(() => {
        const frame = document.querySelector('iframe[data-page="marketplace"]');
        return frame.contentDocument && frame.contentDocument.getElementById('catalog-search').value === 'iPhone';
      });
      assert.equal(await market.locator('.product-card').count(),3);
      await market.getByRole('link',{name:'Evaluate my device'}).click();
      await page.waitForFunction(() => Math.abs(document.querySelector('iframe[data-page="evaluate"]').closest('.board').getBoundingClientRect().top)<5);
      assert.equal(await page.locator('.board iframe').count(),6);
    }
    await page.goto('http://127.0.0.1:8000/');
    await boardChecks();
    const board = fs.readFileSync('outputs/E-wise-design-baseline.html');
    const server = http.createServer((request,response)=>{response.setHeader('Content-Type','text/html; charset=utf-8');response.end(board);});
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    try {await page.goto(`http://127.0.0.1:${server.address().port}/`);await boardChecks();}
    finally {await new Promise(resolve=>server.close(resolve));}
    assert.deepEqual(errors,[]);
    console.log('PASS: Homepage → Marketplace; Verdict comparison query; Marketplace → Evaluate; search preset handoff in native, live, and portable boards; all six screens; no pageerrors.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
