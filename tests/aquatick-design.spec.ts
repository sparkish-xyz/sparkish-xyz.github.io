import { expect, test } from '@playwright/test';

const REVIEW_WIDTHS = [320, 375, 414, 768, 1280] as const;
const LOCALES = ['ko', 'en', 'ja'] as const;

test.describe('AquaTick design contracts', () => {
  test('Korean copy and controls stay readable at audited widths', async ({ page }) => {
    for (const width of REVIEW_WIDTHS) {
      // Given the Korean landing page at one of the audited viewport widths.
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/aquatick/ko/');

      // When the rendered layout and text metrics are inspected.
      const metrics = await page.evaluate(() => {
        const rootStyle = getComputedStyle(document.documentElement);
        const bodyStyle = getComputedStyle(document.body);
        const wrappedControls = Array.from(document.querySelectorAll('a, summary')).flatMap((element) => {
          if (!(element instanceof HTMLElement)) {
            return [];
          }

          const rect = element.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) {
            return [];
          }

          const lineTops = new Set<number>();
          const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
          let textNode = walker.nextNode();
          while (textNode !== null) {
            const range = document.createRange();
            range.selectNodeContents(textNode);
            for (const textRect of range.getClientRects()) {
              if (textRect.width > 0 && textRect.height > 0) {
                lineTops.add(Math.round(textRect.top));
              }
            }
            textNode = walker.nextNode();
          }

          return lineTops.size > 1 ? [element.textContent?.trim() ?? ''] : [];
        });

        return {
          bodyOverflow: bodyStyle.overflowX,
          documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          rootOverflow: rootStyle.overflowX,
          wordBreak: bodyStyle.wordBreak,
          wrappedControls,
        };
      });

      // Then no horizontal scroll or split clickable labels are present.
      expect(metrics.documentOverflow, `${width}px horizontal overflow`).toBe(0);
      expect(metrics.rootOverflow, `${width}px root overflow`).toBe('clip');
      expect(metrics.bodyOverflow, `${width}px body overflow`).toBe('clip');
      expect(metrics.wordBreak, `${width}px Korean word-break`).toBe('keep-all');
      expect(metrics.wrappedControls, `${width}px wrapped controls`).toEqual([]);
    }

    // Given the tablet breakpoint where the previous hero split too early.
    await page.setViewportSize({ width: 768, height: 900 });
    await page.goto('/aquatick/ko/');

    // When the hero geometry is measured.
    const heroMetrics = await page.evaluate(() => {
      const hero = document.querySelector('.hero-inner');
      const heading = document.querySelector('.hero h1');
      if (!(hero instanceof HTMLElement) || !(heading instanceof HTMLElement)) {
        return null;
      }

      const headingStyle = getComputedStyle(heading);
      const lineHeight = Number.parseFloat(headingStyle.lineHeight);
      return {
        columns: getComputedStyle(hero).gridTemplateColumns.split(' ').length,
        headingLines: Math.round(heading.getBoundingClientRect().height / lineHeight),
      };
    });

    // Then the hero remains a compact single-column composition.
    expect(heroMetrics, '768px hero metrics').not.toBeNull();
    expect(heroMetrics?.columns, '768px hero columns').toBe(1);
    expect(heroMetrics?.headingLines, '768px Korean h1 lines').toBeLessThanOrEqual(3);
  });

  test('mobile navigation uses one compact accessible disclosure', async ({ page }) => {
    // Given the narrow Korean page.
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/aquatick/ko/');

    // When the closed header is inspected.
    const headerHeight = await page.locator('.site-header').evaluate((header) => header.getBoundingClientRect().height);
    const menu = page.locator('details.nav-menu');

    // Then the header stays compact and exposes a native disclosure.
    expect(headerHeight, 'closed mobile header height').toBeLessThanOrEqual(76);
    await expect(menu).toBeVisible();
    await expect(menu.locator('summary')).toHaveAccessibleName('메뉴');

    // When the disclosure is opened.
    await menu.locator('summary').click();

    // Then every required destination is visible and keyboard reachable.
    await expect(menu).toHaveAttribute('open', '');
    await expect(menu.locator('.nav-menu-panel a')).toHaveCount(7);
    for (const link of await menu.locator('.nav-menu-panel a').all()) {
      await expect(link).toBeVisible();
      await page.keyboard.press('Tab');
      await expect(link).toBeFocused();
    }
  });

  test('localized screenshots, privacy disclosure, and footer remain accessible', async ({ page }) => {
    for (const locale of LOCALES) {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(`/aquatick/${locale}/`);

      await expect(page.locator('.hero-phone img'), `${locale} localized home capture`).toHaveAttribute(
        'src', `/aquatick/assets/landing/${locale}/home.png`,
      );

      const disclosure = page.locator('#privacy details');
      const policyLink = disclosure.locator('a[href$="/Privacy-Policy"]');
      await expect(policyLink).not.toBeVisible();
      await disclosure.locator('summary').focus();
      await page.keyboard.press('Enter');
      await expect(disclosure).toHaveJSProperty('open', true);
      await expect(policyLink).toBeVisible();
      await expect(disclosure).toContainText('iCloud');

      const footer = page.locator('.site-footer nav');
      await expect(footer).toHaveAccessibleName(/.+/);
      await expect(footer.locator('a')).toHaveCount(4);
      for (const link of await footer.locator('a').all()) {
        await expect(link).toBeVisible();
        await expect(link).toHaveAccessibleName(/.+/);
      }
    }
  });
});
