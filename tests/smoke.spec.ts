import { test, expect } from '@playwright/test';

test.describe('Smoke tests', () => {
  test('index.html loads with key elements', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page).toHaveTitle(/Психологічна безпека/);

    // Hero section
    const hero = page.locator('.paper-hero');
    await expect(hero).toBeVisible();
    await expect(hero.locator('h1')).toContainText(/Вплив ШІ-контенту/);

    // Navigation
    const nav = page.locator('.topbar');
    await expect(nav).toBeVisible();
    const navLinks = nav.locator('.paper-nav a');
    await expect(navLinks).toHaveCount(7);

    // Key sections
    await expect(page.locator('#corpus')).toBeVisible();
    await expect(page.locator('#methodology')).toBeVisible();
    await expect(page.locator('#resources')).toBeVisible();

    // Materials grid with links to m/ pages
    const materialsGrid = page.locator('.materials-grid');
    await expect(materialsGrid).toBeVisible();
    await expect(page.locator('.materials-grid a')).toHaveCount(15);

    // Footer
    await expect(page.locator('.paper-footer')).toBeVisible();
  });

  test('404.html renders with error message and navigation', async ({ page }) => {
    await page.goto('/404.html');
    await expect(page).toHaveTitle(/Сторінку не знайдено/);

    // Error code and card
    await expect(page.locator('.error-code')).toContainText('404');
    await expect(page.locator('.error-card')).toBeVisible();
    await expect(page.locator('.error-card h1')).toContainText(/Сторінку не знайдено/);

    // Navigation links
    const errorLinks = page.locator('.error-links a');
    await expect(errorLinks).toHaveCount(4);
    await expect(errorLinks.nth(0)).toContainText('Головна сторінка');
    await expect(errorLinks.nth(1)).toContainText('Корпус матеріалів');
    await expect(errorLinks.nth(2)).toContainText('Опитування вихователів');
    await expect(errorLinks.nth(3)).toContainText('Опитування батьків');
  });

  test('m/index.html has material cards', async ({ page }) => {
    await page.goto('/m/index.html');
    await expect(page).toHaveTitle(/Корпус матеріалів/);

    // Header
    await expect(page.locator('.hub-header h1')).toContainText(/Корпус матеріалів/);
    await expect(page.locator('.hub-pills span')).toHaveCount(3);

    // Video section with 6 cards
    const videoSection = page.locator('.hub-section').first();
    await expect(videoSection).toBeVisible();
    const videoCards = page.locator('.mat-card--video');
    await expect(videoCards).toHaveCount(6);

    // Text section with 9 cards
    const textCards = page.locator('.mat-card--text');
    await expect(textCards).toHaveCount(9);

    // Action cards at bottom
    await expect(page.locator('.hub-actions a')).toHaveCount(3);
    await expect(page.locator('.site-footer')).toBeVisible();
  });

  test('story page m/spb/ renders correctly', async ({ page }) => {
    await page.goto('/m/spb/index.html');
    await expect(page).toHaveTitle(/Навіщо кажуть/);

    // Body class for theming
    await expect(page.locator('body')).toHaveClass(/story-thanks/);

    // Navigation
    await expect(page.locator('.site-nav')).toBeVisible();
    await expect(page.locator('.site-nav-logo')).toContainText('Курсова');
    await expect(page.locator('.site-nav-back')).toContainText('Назад до корпусу');

    // Story content
    await expect(page.locator('.story-header h1')).toBeVisible();
    await expect(page.locator('.story-header .badge')).toContainText('Текстовий матеріал T1');
    const storyContent = page.locator('.story-content');
    await expect(storyContent).toBeVisible();
    await expect(storyContent.locator('p')).toHaveCount(7);

    // Origin disclosure
    await expect(page.locator('.origin-disclosure')).toBeVisible();
    await expect(page.locator('.origin-disclosure summary')).toContainText('Походження матеріалу');

    // Home button
    await expect(page.locator('.story-home-btn')).toBeVisible();
    await expect(page.locator('.story-home-btn')).toContainText('Хочете познайомитись');

    // Footer
    await expect(page.locator('.site-footer')).toBeVisible();
  });

  test('video page m/grk/ has redirect countdown', async ({ page }) => {
    await page.goto('/m/grk/index.html');
    await expect(page).toHaveTitle(/Відеофрагмент V1/);

    // Body class for video theme
    await expect(page.locator('body')).toHaveClass(/theme-video/);

    // Redirect card with badge
    await expect(page.locator('.redirect-card')).toBeVisible();
    await expect(page.locator('.redirect-card .badge')).toContainText('Відеофрагмент V1');

    // Timer and progress bar
    await expect(page.locator('#timer')).toBeVisible();
    await expect(page.locator('#progressBar')).toBeVisible();
    await expect(page.locator('#compliment')).toBeVisible();
    await expect(page.locator('#subtitle')).toBeVisible();
    await expect(page.locator('#goNowBtn')).toBeVisible();

    // Media player
    await expect(page.locator('tgs-player')).toBeVisible();

    // Origin disclosure
    await expect(page.locator('.origin-disclosure')).toBeVisible();
    await expect(page.locator('.origin-disclosure summary')).toContainText('Походження матеріалу');

    // Footer
    await expect(page.locator('.site-footer')).toBeVisible();
  });

  test('survey/educators/ page loads', async ({ page }) => {
    await page.goto('/survey/educators/index.html');
    await expect(page).toHaveTitle(/Анкета для вихователів/);

    // Body class for educators theme
    await expect(page.locator('body')).toHaveClass(/theme-educators/);

    // Card with completion state
    await expect(page.locator('.redirect-card')).toBeVisible();
    await expect(page.locator('.badge-closed')).toContainText('Завершено');
    await expect(page.locator('.closed-title')).toContainText('Збір відповідей завершено');

    // Footer
    await expect(page.locator('.site-footer')).toBeVisible();
  });

  test('survey/parents/ page loads', async ({ page }) => {
    await page.goto('/survey/parents/index.html');
    await expect(page).toHaveTitle(/Анкета для батьків/);

    // Body class for parents theme
    await expect(page.locator('body')).toHaveClass(/theme-parents/);

    // Card with completion state
    await expect(page.locator('.redirect-card')).toBeVisible();
    await expect(page.locator('.badge-closed')).toContainText('Завершено');

    // Footer
    await expect(page.locator('.site-footer')).toBeVisible();
  });

  test('language toggle changes language and persists state', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page).toHaveTitle(/Психологічна безпека/);

    const toggle = page.locator('.lang-toggle').first();
    await expect(toggle).toBeVisible();
    await toggle.click();

    // Verify switched to English
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page).toHaveTitle(/Psychological Safety/);

    // Click again: Switch to Slovak
    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'sk');
    await expect(page).toHaveTitle(/Psychologická bezpečnosť/);

    // Verify localStorage persistence by navigating to another page
    await page.goto('/m/index.html');
    await expect(page.locator('html')).toHaveAttribute('lang', 'sk');
    await expect(page).toHaveTitle(/Korpus materiálov/);

    // Switch back to Ukrainian
    const toggleM = page.locator('.lang-toggle').first();
    await toggleM.click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'uk');
  });
});
