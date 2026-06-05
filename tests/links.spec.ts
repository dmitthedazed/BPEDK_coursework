import { test, expect } from '@playwright/test';

const INTERNAL_PAGES = [
  { name: 'Landing page', url: '/index.html' },
  { name: '404 page', url: '/404.html' },
  { name: 'Materials hub', url: '/m/index.html' },
  { name: 'Story T1 (spb)', url: '/m/spb/index.html' },
  { name: 'Story T2 (dub)', url: '/m/dub/index.html' },
  { name: 'Story T3 (ksh)', url: '/m/ksh/index.html' },
  { name: 'Story T4 (xhf)', url: '/m/xhf/index.html' },
  { name: 'Story T5 (bbp)', url: '/m/bbp/index.html' },
  { name: 'Story T6 (izh)', url: '/m/izh/index.html' },
  { name: 'Story T7 (lsk)', url: '/m/lsk/index.html' },
  { name: 'Story T8 (snc)', url: '/m/snc/index.html' },
  { name: 'Story T9 (pst)', url: '/m/pst/index.html' },
  { name: 'Video V1 (grk)', url: '/m/grk/index.html' },
  { name: 'Video V2 (pkd)', url: '/m/pkd/index.html' },
  { name: 'Video V3 (ssn)', url: '/m/ssn/index.html' },
  { name: 'Video V4 (trk)', url: '/m/trk/index.html' },
  { name: 'Video V5 (tfi)', url: '/m/tfi/index.html' },
  { name: 'Video V6 (prs)', url: '/m/prs/index.html' },
  { name: 'Survey educators', url: '/survey/educators/index.html' },
  { name: 'Survey parents', url: '/survey/parents/index.html' },
];

const EXTERNAL_URLS = [
  'https://www.googletagmanager.com/gtag/js?id=G-S590QSD215',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Source+Serif+4:ital,wght@0,400;0,600;0,700;1,400&display=swap',
];

test.describe('Internal links', () => {
  for (const pageDef of INTERNAL_PAGES) {
    test(`all internal links on ${pageDef.name} don't 404`, async ({ page, baseURL }) => {
      await page.goto(pageDef.url);

      const hrefs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a[href]'))
          .map(a => ({ href: a.getAttribute('href')!, text: a.textContent || '' }))
          .filter(a => {
            // Skip hash-only links, javascript:, and mailto:
            return a.href !== '#' && !a.href.startsWith('javascript:') && !a.href.startsWith('mailto:') && !a.href.startsWith('tel:');
          });
      });

      for (const { href } of hrefs) {
        // Only check relative/internal links
        if (href.startsWith('http') && !href.includes(baseURL || '')) {
          continue; // external link, checked separately
        }

        // Resolve the URL
        const resolved = new URL(href, baseURL + pageDef.url).href;

        // For internal relative links, fetch and check status
        try {
          const response = await page.request.get(resolved, { maxRedirects: 0 });
          const status = response.status();
          // Accept 200, 301, 302 (redirects to Drive/forms), or 403 (if Google blocks scraping)
          expect([200, 301, 302, 304]).toContain(status);
        } catch {
          // If fetch fails entirely, that's a broken link
          test.fail(true, `Link ${href} on ${pageDef.name} could not be fetched`);
        }
      }
    });
  }
});

test.describe('External link reachability', () => {
  test('Google Tag Manager is reachable', async ({ request }) => {
    const response = await request.get(EXTERNAL_URLS[0], { maxRedirects: 0 });
    expect(response.status()).toBe(200);
  });

  test('Google Fonts is reachable', async ({ request }) => {
    const response = await request.get(EXTERNAL_URLS[1], { maxRedirects: 0 });
    expect(response.status()).toBe(200);
  });

  test('Google Drive links in video pages are valid Drive URLs', async ({ page }) => {
    // Check that the SURVEY_LINKS script in video pages contains valid Google Drive URLs
    await page.goto('/m/grk/index.html');
    const driveLink = await page.evaluate(() => {
      const scripts = document.querySelectorAll('script');
      for (const s of scripts) {
        if (s.textContent?.includes('SURVEY_LINKS')) {
          const match = s.textContent?.match(/https:\/\/drive\.google\.com\/file\/d\/[^"'/]+/);
          return match ? match[0] : null;
        }
      }
      return null;
    });
    expect(driveLink).toBeTruthy();
    expect(driveLink).toMatch(/https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+/);
  });

  test('Educators survey links.js contains Google Form URLs', async ({ page }) => {
    await page.goto('/survey/educators/links.js');
    const content = await page.content();
    // links.js is JS, not HTML — just check it loads and contains form URLs
    expect(content).toContain('docs.google.com/forms');
  });

  test('Parents survey links.js contains Google Form URLs', async ({ page }) => {
    await page.goto('/survey/parents/links.js');
    const content = await page.content();
    expect(content).toContain('docs.google.com/forms');
  });
});

test.describe('Cross-page link consistency', () => {
  test('index.html links to all 15 material pages', async ({ page }) => {
    await page.goto('/index.html');
    const codes = ['grk', 'pkd', 'ssn', 'trk', 'tfi', 'prs', 'spb', 'dub', 'ksh', 'xhf', 'bbp', 'izh', 'lsk', 'snc', 'pst'];
    const links = await page.evaluate(() =>
      Array.from(document.querySelectorAll('a[href]')).map(a => a.getAttribute('href') || '')
    );

    for (const code of codes) {
      expect(links.some(h => h.includes(`m/${code}/`) || h.includes(`m/${code}`))).toBe(true);
    }
  });

  test('m/index.html links to all 15 material pages', async ({ page }) => {
    await page.goto('/m/index.html');
    const codes = ['grk', 'pkd', 'ssn', 'trk', 'tfi', 'prs', 'spb', 'dub', 'ksh', 'xhf', 'bbp', 'izh', 'lsk', 'snc', 'pst'];
    const links = await page.evaluate(() =>
      Array.from(document.querySelectorAll('a[href]')).map(a => a.getAttribute('href') || '')
    );

    for (const code of codes) {
      expect(links.some(h => h.includes(`./${code}/`) || h.includes(`/${code}`))).toBe(true);
    }
  });

  test('404.html links to main sections', async ({ page }) => {
    await page.goto('/404.html');
    const links = await page.evaluate(() =>
      Array.from(document.querySelectorAll('a[href]')).map(a => a.getAttribute('href') || '')
    );

    expect(links.some(h => h === './' || h === '/index.html')).toBe(true);
    expect(links.some(h => h.includes('m/'))).toBe(true);
    expect(links.some(h => h.includes('survey/educators'))).toBe(true);
    expect(links.some(h => h.includes('survey/parents'))).toBe(true);
  });
});
