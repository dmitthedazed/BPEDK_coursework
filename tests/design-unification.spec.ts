import { test, expect } from '@playwright/test';

const pageChecks = [
  {
    name: 'materials hub',
    url: '/m/index.html',
    heading: '.hub-header h1',
    surfaces: ['.mat-card', '.hub-action-card'],
  },
  {
    name: 'story page',
    url: '/m/spb/index.html',
    heading: '.story-header h1',
    surfaces: ['.story-content', '.origin-disclosure', '.story-home-btn'],
  },
  {
    name: 'video redirect',
    url: '/m/grk/index.html',
    heading: '.redirect-card h1',
    surfaces: ['.redirect-card', '.redirect-status', '#goNowBtn', '.origin-disclosure'],
  },
  {
    name: 'survey closed page',
    url: '/survey/educators/index.html',
    heading: '.redirect-card h1',
    surfaces: ['.redirect-card', '.closed-status', '.closed-home-btn'],
  },
  {
    name: 'survey hub',
    url: '/survey/index.html',
    heading: '.survey-hub-title',
    surfaces: ['.survey-hub-card', '.survey-hub-btn'],
  },
  {
    name: 'paper viewer',
    url: '/paper/index.html',
    heading: '.sidebar-title',
    surfaces: ['.paper-sidebar', '.sidebar-download', '.cite-block pre'],
  },
  {
    name: 'literature',
    url: '/literature/index.html',
    heading: '.literature-header h1',
    surfaces: ['.ai-note', '.literature-list li'],
  },
  {
    name: 'reports',
    url: '/reports/index.html',
    heading: '.reports-header h1',
    surfaces: ['.report-card', '.data-note', '.scan-panel', '.scan-card'],
  },
  {
    name: 'data entry',
    url: '/data-entry/index.html',
    heading: '.hero-header h1',
    surfaces: ['.panel', '.meta-grid', '.meta-item', '.question-group'],
  },
  {
    name: '404',
    url: '/404.html',
    heading: '.error-card h1',
    surfaces: ['.error-card', '.error-link'],
  },
];

test.describe('landing-style design unification', () => {
  for (const pageCheck of pageChecks) {
    test(`${pageCheck.name} uses the landing visual grammar`, async ({ page }) => {
      await page.goto(pageCheck.url);
      if (pageCheck.name === 'data entry') {
        await page.locator('#questionnaireId').fill('Б-03-07-T2V1');
        await expect(page.locator('.question-group').first()).toBeVisible();
      }

      const heading = page.locator(pageCheck.heading).first();
      await expect(heading).toBeVisible();
      const headingStyle = await heading.evaluate((el) => {
        const style = getComputedStyle(el);
        return {
          family: style.fontFamily,
          spacing: style.letterSpacing === 'normal' ? 0 : Number.parseFloat(style.letterSpacing),
        };
      });

      expect(headingStyle.family).toContain('Bricolage Grotesque');
      expect(headingStyle.spacing).toBeGreaterThanOrEqual(0);

      const nav = page.locator('.site-nav, .topbar').first();
      if (await nav.count()) {
        await expect(nav).toBeVisible();
        const navHeight = await nav.evaluate((el) => el.getBoundingClientRect().height);
        expect(navHeight).toBeGreaterThanOrEqual(68);
      }

      const fadeStates = await page.locator('.fade-up').evaluateAll((elements) =>
        elements.map((el) => getComputedStyle(el).opacity),
      );
      expect(fadeStates.every((opacity) => Number.parseFloat(opacity) === 1)).toBe(true);

      for (const selector of pageCheck.surfaces) {
        const surface = page.locator(selector).first();
        await expect(surface, `${selector} is visible`).toBeVisible();
        const radius = await surface.evaluate((el) => {
          const style = getComputedStyle(el);
          return Math.max(
            Number.parseFloat(style.borderTopLeftRadius),
            Number.parseFloat(style.borderTopRightRadius),
            Number.parseFloat(style.borderBottomLeftRadius),
            Number.parseFloat(style.borderBottomRightRadius),
          );
        });

        expect(radius, `${pageCheck.name} ${selector} radius`).toBeLessThanOrEqual(8);
      }
    });
  }
});
