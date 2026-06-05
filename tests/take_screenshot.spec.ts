import { test, expect } from '@playwright/test';

test('take dropdown screenshots', async ({ page }) => {
  // Navigate to index.html
  await page.goto('/index.html');
  
  // Take screenshot of the closed dropdown in header
  await page.screenshot({ path: '/home/dimka/.gemini/antigravity-cli/brain/1525f2b6-8bc7-4874-bcee-af326f8cd6c0/dropdown_closed.png' });
  
  // Click on the language toggle
  await page.click('.topbar-actions .lang-toggle');
  await page.waitForTimeout(200);
  
  // Take screenshot of the open dropdown
  await page.screenshot({ path: '/home/dimka/.gemini/antigravity-cli/brain/1525f2b6-8bc7-4874-bcee-af326f8cd6c0/dropdown_open.png' });
  
  // Close the topbar dropdown by clicking body
  await page.click('body', { position: { x: 0, y: 0 } });
  await page.waitForTimeout(100);
  
  // Scroll to footer dropdown and open it
  const footerToggle = page.locator('footer .lang-toggle');
  await footerToggle.scrollIntoViewIfNeeded();
  await footerToggle.click();
  await page.waitForTimeout(200);
  
  // Take screenshot of the footer dropdown open
  await page.screenshot({ path: '/home/dimka/.gemini/antigravity-cli/brain/1525f2b6-8bc7-4874-bcee-af326f8cd6c0/dropdown_footer_open.png' });
});
