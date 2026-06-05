import { test, expect } from '@playwright/test';

test.describe('Landing desktop density', () => {
  test('landing uses a compact desktop tile board', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/index.html');

    const hero = page.locator('.paper-hero');
    await expect(hero).toBeVisible();
    const heroBox = await hero.boundingBox();
    expect(heroBox?.height ?? 0).toBeLessThanOrEqual(620);

    const board = page.locator('.landing-tile-board');
    await expect(board).toBeVisible();

    const tiles = board.locator(':scope > .paper-section');
    await expect(tiles).toHaveCount(7);

    const boardRhythm = await board.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        gap: Number.parseFloat(style.columnGap),
        tilePadding: Number.parseFloat(getComputedStyle(element.querySelector('.paper-section')!).paddingTop),
      };
    });
    expect(boardRhythm.gap).toBeGreaterThanOrEqual(22);
    expect(boardRhythm.tilePadding).toBeGreaterThanOrEqual(24);

    const gridColumns = await tiles.evaluateAll((elements) =>
      elements.map((element) => {
        const style = getComputedStyle(element);
        return `${style.gridColumnStart}/${style.gridColumnEnd}`;
      }),
    );
    expect(new Set(gridColumns).size).toBeGreaterThanOrEqual(4);

    const resourcesY = await page
      .locator('#resources')
      .evaluate((element) => element.getBoundingClientRect().top + window.scrollY);
    expect(resourcesY).toBeLessThan(2050);
  });
});
