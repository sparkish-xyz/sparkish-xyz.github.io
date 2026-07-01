import { expect, type APIRequestContext, type Locator, type Page } from '@playwright/test';
import { createHash } from 'node:crypto';

export const BASE_URL = 'https://sparkish-xyz.github.io';

export const AQUATICK_LOCALES = ['ko', 'en', 'ja'] as const;
export const KMB_LOCALES = ['en', 'fr', 'ko', 'ja', 'zh-Hans', 'zh-Hant'] as const;

export const AQUATICK_IMAGE_ASSETS = [
  'aquatick-app-icon.png',
  'cat-empty.png',
  'cat-hero.png',
  'cat-thirsty.png',
  'screenshot-iphone-home.png',
  'screenshot-iphone-vault.png',
  'screenshot-iphone-history.png',
  'screenshot-iphone-settings.png',
  'screenshot-watch-home.png',
] as const;

export const AQUATICK_SCREENSHOTS = [
  'screenshot-iphone-home.png',
  'screenshot-iphone-vault.png',
  'screenshot-iphone-history.png',
  'screenshot-watch-home.png',
  'screenshot-iphone-settings.png',
] as const;

export const KMB_SCREENSHOTS = [
  'screenshot-onboarding.png',
  'screenshot-home.png',
  'screenshot-resolve.png',
  'screenshot-place-detail.png',
  'screenshot-taxi.png',
] as const;

export function aquatickUrl(locale: (typeof AQUATICK_LOCALES)[number]): string {
  return `${BASE_URL}/aquatick/${locale}/`;
}

export function kmbUrl(locale: (typeof KMB_LOCALES)[number]): string {
  return `${BASE_URL}/korea-map-link/${locale}/`;
}

export async function requiredAttribute(locator: Locator, name: string, label: string): Promise<string> {
  const value = await locator.getAttribute(name);
  expect(value, label).not.toBeNull();
  if (value === null) {
    throw new Error(`Missing ${label}`);
  }
  return value;
}

export async function requiredText(locator: Locator, label: string): Promise<string> {
  const value = await locator.textContent();
  expect(value, label).not.toBeNull();
  if (value === null) {
    throw new Error(`Missing ${label}`);
  }
  return value;
}

export async function localStorageValue(page: Page, key: string): Promise<string | null> {
  return page.evaluate((storageKey) => localStorage.getItem(storageKey), key);
}

export async function expectImageResponse(request: APIRequestContext, path: string): Promise<Buffer> {
  const res = await request.get(path);
  expect(res.status(), path).toBe(200);
  expect(res.headers()['content-type'], path).toMatch(/image/);
  return res.body();
}

export function sha256(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex');
}

export async function expectHtmlRoute(request: APIRequestContext, path: string): Promise<void> {
  const res = await request.get(path);
  expect(res.status(), path).toBe(200);
  expect(res.headers()['content-type'], path).toMatch(/text\/html/);
}
