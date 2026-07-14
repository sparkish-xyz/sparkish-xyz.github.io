import { expect, test } from '@playwright/test';

const REVIEW_WIDTHS = [320, 375, 414, 768, 1280] as const;
const LOCALES = ['ko', 'en', 'ja'] as const;

test.describe('AquaTick Hallmark review contracts', () => {
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
    await expect(menu.locator('summary')).toHaveAttribute('aria-label', /메뉴/);

    // When the disclosure is opened.
    await menu.locator('summary').click();

    // Then every required destination is visible and keyboard reachable.
    await expect(menu).toHaveAttribute('open', '');
    await expect(menu.locator('.nav-menu-panel a')).toHaveCount(8);
    for (const link of await menu.locator('.nav-menu-panel a').all()) {
      await expect(link).toBeVisible();
    }
  });

  test('reviewed structure is connected across every locale', async ({ page, request }) => {
    for (const locale of LOCALES) {
      // Given a generated locale page.
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(`/aquatick/${locale}/`);

      // Then labels and hand-drawn device chrome are gone.
      await expect(page.locator('.section-label, .iphone-frame, .watch-frame'), `${locale} removed review classes`).toHaveCount(0);
      await expect(page.locator('figure.product-shot'), `${locale} semantic screenshot figures`).toHaveCount(7);

      // Then the actual privacy and footer classes receive their intended layout.
      const disclosure = page.locator('.third-party');
      await expect(disclosure).toBeVisible();
      await expect(disclosure).toHaveCSS('text-align', 'left');
      expect(await disclosure.evaluate((element) => getComputedStyle(element).paddingTop)).not.toBe('0px');

      const footerColumns = page.locator('.footer-columns');
      await expect(footerColumns).toHaveCSS('display', 'grid');
      await expect(footerColumns.locator(':scope > div').first()).toHaveCSS('display', 'flex');
    }

    // Given the desktop grid composition.
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/aquatick/ko/');

    // Then feature/pricing cards keep natural height and no universal stripe.
    const gridMetrics = await page.evaluate(() => {
      const summary = document.querySelector('.summary-grid');
      const screens = document.querySelector('.screen-grid');
      const pricing = document.querySelector('.pricing-grid');
      const card = document.querySelector('.summary-card');
      if (!(summary instanceof HTMLElement) || !(screens instanceof HTMLElement)
        || !(pricing instanceof HTMLElement) || !(card instanceof HTMLElement)) {
        return null;
      }

      return {
        pricingAlign: getComputedStyle(pricing).alignItems,
        screenAlign: getComputedStyle(screens).alignItems,
        stripeContent: getComputedStyle(card, '::before').content,
        summaryColumns: getComputedStyle(summary).gridTemplateColumns.split(' ').length,
      };
    });

    expect(gridMetrics, 'desktop grid metrics').not.toBeNull();
    expect(gridMetrics?.summaryColumns, 'summary grid columns').toBe(2);
    expect(gridMetrics?.screenAlign, 'screen card alignment').toBe('start');
    expect(gridMetrics?.pricingAlign, 'pricing card alignment').toBe('start');
    expect(gridMetrics?.stripeContent, 'summary card stripe').toBe('none');

    // Given the compiled production stylesheet.
    const stylesheet = await request.get('/aquatick/assets/aquatick-site.css');
    const css = await stylesheet.text();

    // Then its first line records the Hallmark design contract.
    expect(css.split('\n')[0]).toBe('/* Hallmark · genre: playful · macrostructure: Workbench · design-system: DESIGN.md · designed-as-app */');
  });
});
