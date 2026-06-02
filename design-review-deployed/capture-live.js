const { chromium, webkit } = require('playwright');

(async () => {
  const url = process.env.TARGET_URL || 'https://sparkish-xyz.github.io/aquatick/ko/';
  // NOTE (review #4): Captures the primary Korean design. en/ja translations share the same visual system but are not auto-captured here.
  const viewports = [
    { name: 'iphone-se', width: 375, height: 667 },
    { name: 'iphone-14', width: 390, height: 844 },
    { name: 'ipad-portrait', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 800 },
  ];

  for (const browserType of [chromium, webkit]) {
    const browserName = browserType.name();
    const browser = await browserType.launch();
    
    for (const vp of viewports) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2,
      });
      const page = await context.newPage();
      
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(800);

      // Full page
      await page.screenshot({
        path: `design-review-deployed/${browserName}-${vp.name}-full.png`,
        fullPage: true
      });

      // Hero section specifically (the critical area for device frames)
      const hero = page.locator('section.hero');
      if (await hero.count() > 0) {
        await hero.screenshot({
          path: `design-review-deployed/${browserName}-${vp.name}-hero.png`
        });
      }

      // Showcase section
      const showcase = page.locator('section.showcase');
      if (await showcase.count() > 0) {
        await showcase.screenshot({
          path: `design-review-deployed/${browserName}-${vp.name}-showcase.png`
        });
      }

      await page.close();
      await context.close();
      console.log(`Captured: ${browserName} ${vp.name}`);
    }
    await browser.close();
  }
  console.log('Done capturing deployed site screenshots.');
})();
