const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const viewports = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 375, height: 812 },
  ];
  
  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:8080');
    await page.waitForTimeout(1000);
    
    const corpus = await page.$('#corpus');
    if (corpus) {
      await corpus.screenshot({ path: `/tmp/corpus-${vp.name}.png` });
      console.log(`✓ corpus ${vp.name}`);
    } else {
      console.log(`✗ #corpus not found`);
    }
  }
  
  await browser.close();
})();
