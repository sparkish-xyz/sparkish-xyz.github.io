import { expect, test } from '@playwright/test';

for (const path of ['/aquatick/android/review/health-connect/', '/aquatick/android/ko/review/health-connect/']) {
  test(`Android review video loads and plays with readable mobile layout: ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(path);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
    const video = page.locator('#health-demo');
    await expect(video).toHaveAttribute('controls', '');
    await expect(video).not.toHaveAttribute('autoplay', /.*/);
    await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.readyState)).toBeGreaterThanOrEqual(1);
    const metadata = await video.evaluate((node: HTMLVideoElement) => ({ width: node.videoWidth, height: node.videoHeight, duration: node.duration }));
    expect(metadata.width).toBe(1080);
    expect(metadata.height).toBe(2424);
    expect(metadata.duration).toBeGreaterThan(30);
    await video.evaluate((node: HTMLVideoElement) => node.play());
    await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.currentTime)).toBeGreaterThan(0);
    await video.evaluate((node: HTMLVideoElement) => node.pause());
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
    await expect(page.locator('main')).toContainText('350mL');
    await expect(page.locator('main')).toContainText('750mL');
  });
}
