import { test, expect } from '@playwright/test';

const MOBILE_SIZES = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 12', width: 390, height: 844 },
  { name: 'Pixel 5', width: 393, height: 851 },
];

const KEY_PAGES = [
  { name: 'Landing page', url: '/index.html' },
  { name: '404 page', url: '/404.html' },
  { name: 'Materials hub', url: '/m/index.html' },
  { name: 'Story page (T1)', url: '/m/spb/index.html' },
  { name: 'Video redirect (V1)', url: '/m/grk/index.html' },
  { name: 'Survey educators', url: '/survey/educators/index.html' },
  { name: 'Survey parents', url: '/survey/parents/index.html' },
];

for (const device of MOBILE_SIZES) {
  test.describe(`Mobile viewport: ${device.name} (${device.width}x${device.height})`, () => {
    for (const pageDef of KEY_PAGES) {
      test(`${pageDef.name} loads without horizontal overflow`, async ({ page }) => {
        await page.setViewportSize({ width: device.width, height: device.height });
        await page.goto(pageDef.url);

        // Verify no horizontal overflow on the body
        const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
        // Allow 1px tolerance for sub-pixel rendering differences
        const tolerance = clientWidth + 1;
        expect(scrollWidth, `${pageDef.name} has horizontal overflow`).toBeLessThanOrEqual(tolerance);
      });

      test(`${pageDef.name} has key elements visible`, async ({ page }) => {
        await page.setViewportSize({ width: device.width, height: device.height });
        await page.goto(pageDef.url);

        if (pageDef.url.includes('/index.html') && !pageDef.url.includes('/m/') && !pageDef.url.includes('/survey/')) {
          await expect(page.locator('.topbar')).toBeVisible();
          await expect(page.locator('.paper-hero')).toBeVisible();
          await expect(page.locator('.paper-footer')).toBeVisible();
        } else if (pageDef.url.includes('/404')) {
          await expect(page.locator('.error-container')).toBeVisible();
          await expect(page.locator('.error-code')).toContainText('404');
        } else if (pageDef.url.includes('/m/index')) {
          await expect(page.locator('.hub-header')).toBeVisible();
          await expect(page.locator('.site-footer')).toBeVisible();
          await expect(page.locator('.mat-card').first()).toBeVisible();
        } else if (pageDef.url.includes('/m/spb/')) {
          await expect(page.locator('.site-nav')).toBeVisible();
          await expect(page.locator('.story-header')).toBeVisible();
          await expect(page.locator('.story-content')).toBeVisible();
          await expect(page.locator('.site-footer')).toBeVisible();
        } else if (pageDef.url.includes('/m/grk/')) {
          await expect(page.locator('.redirect-card')).toBeVisible();
          await expect(page.locator('#timer')).toBeVisible();
          await expect(page.locator('#goNowBtn')).toBeVisible();
          await expect(page.locator('.site-footer')).toBeVisible();
        } else if (pageDef.url.includes('/survey/')) {
          await expect(page.locator('.redirect-card')).toBeVisible();
          await expect(page.locator('.closed-title')).toBeVisible();
        }
      });
    }
  });
}
