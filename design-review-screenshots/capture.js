#!/usr/bin/env node
/**
 * Playwright Visual Design Review Script — Improved for reusability & evidence preservation
 *
 * Purpose: Capture real rendered output of device frames (Hero + Showcase) at realistic
 * mobile/tablet/desktop viewports. Used to diagnose and verify the "phone inside phone"
 * visual bug fix (and ongoing regression detection).
 *
 * Key improvements in this version (addressing reviewer feedback):
 * - Configurable target URL via TARGET_URL env var (defaults to relative file:// next to repo root).
 *   No more hardcoded absolute personal paths.
 * - Phase separation (--phase before|after|current) writes to dedicated subdirectories.
 *   Prevents overwriting pre-fix evidence on post-fix runs.
 * - Added critical missing scenarios:
 *   1. Landscape orientation (real-world rotation on iPhone/iPad)
 *   2. Reduced-motion context (`prefers-reduced-motion: reduce`) — critical for HIG compliance
 *   3. Phase-isolated runs + explicit evidence directories (solves "before state lost" problem)
 * - Usage examples:
 *     node design-review-screenshots/capture.js --phase after
 *     TARGET_URL="http://localhost:5173" node design-review-screenshots/capture.js --phase before
 * - Still lightweight Node script (no @playwright/test required for this review tooling).
 *
 * Note on limitations (honest):
 * - True Dynamic Type "maximum" text scaling is best tested manually in Safari Responsive Design Mode
 *   or on real iOS devices (Playwright context has limited font scaling emulation).
 * - Broken-image / network failure states are low-priority for this polished static page.
 */
const { chromium, webkit } = require('playwright');
const fs = require('fs');
const path = require('path');

// --- Configuration (now flexible) ---
const OUTPUT_DIR = path.resolve(__dirname, '..', 'design-review-screenshots');

// Resolve target URL relative to CWD so the script works from any checkout / machine
const DEFAULT_TARGET = `file://${path.resolve(process.cwd(), 'index.html')}`;
const TARGET_URL = process.env.TARGET_URL || DEFAULT_TARGET;

// Simple CLI arg parsing (no extra deps)
function getArg(name, defaultVal = null) {
  const args = process.argv.slice(2);
  const idx = args.indexOf(name);
  if (idx !== -1 && idx + 1 < args.length) return args[idx + 1];
  return defaultVal;
}

const PHASE = (getArg('--phase') || process.env.PHASE || 'current').toLowerCase();
const PHASE_DIR = path.join(OUTPUT_DIR, PHASE);

const VIEWPORTS = [
  { name: 'iphone-se', width: 375, height: 667, label: 'iPhone SE (375px)' },
  { name: 'iphone-14', width: 390, height: 844, label: 'iPhone 14/16 (390px)' },
  { name: 'iphone-16-pro', width: 402, height: 874, label: 'iPhone 16 Pro (402px)' },
  { name: 'ipad-portrait', width: 768, height: 1024, label: 'iPad Portrait (768px)' },
  { name: 'desktop', width: 1280, height: 800, label: 'Desktop (1280px)' },
  // Critical added scenario: Landscape (device frames must survive rotation)
  { name: 'iphone-14-landscape', width: 844, height: 390, label: 'iPhone 14 Landscape (844x390)' }
];

async function captureForBrowser(browserType, browserName, extraContextOpts = {}) {
  const browser = await browserType.launch({ headless: true });
  const context = await browser.newContext({ 
    deviceScaleFactor: 2, // Retina quality
    javaScriptEnabled: true,
    ...extraContextOpts
  });

  for (const vp of VIEWPORTS) {
    const page = await context.newPage();
    await page.setViewportSize({ width: vp.width, height: vp.height });

    console.log(`[${browserName}] Navigating at ${vp.label}...`);
    await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
    // Allow any transitions/animations to settle
    await page.waitForTimeout(800);

    // Write to PHASE-specific directory (prevents overwrite of before/after evidence)
    const outDir = PHASE_DIR;
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    // Full page screenshot for context
    const fullName = `${browserName}-${vp.name}-full.png`;
    await page.screenshot({ 
      path: path.join(outDir, fullName),
      fullPage: true,
      type: 'png'
    });
    console.log(`  Saved ${fullName}`);

    // Targeted: Hero section (first .hero)
    const hero = await page.locator('section.hero').first();
    if (await hero.count() > 0) {
      const heroName = `${browserName}-${vp.name}-hero.png`;
      await hero.screenshot({ 
        path: path.join(outDir, heroName),
        type: 'png'
      });
      console.log(`  Saved ${heroName}`);
    }

    // Targeted: Showcase ecosystem row
    const showcase = await page.locator('section.showcase').first();
    if (await showcase.count() > 0) {
      const showcaseName = `${browserName}-${vp.name}-showcase.png`;
      await showcase.screenshot({ 
        path: path.join(outDir, showcaseName),
        type: 'png'
      });
      console.log(`  Saved ${showcaseName}`);
    }

    // Specific device frames
    const iphoneFrames = await page.locator('.iphone-frame').all();
    for (let i = 0; i < iphoneFrames.length; i++) {
      const frameName = `${browserName}-${vp.name}-iphone-frame-${i+1}.png`;
      await iphoneFrames[i].screenshot({ 
        path: path.join(outDir, frameName),
        type: 'png'
      });
      console.log(`  Saved ${frameName}`);
    }

    const watchFrames = await page.locator('.watch-frame').all();
    for (let i = 0; i < watchFrames.length; i++) {
      const frameName = `${browserName}-${vp.name}-watch-frame-${i+1}.png`;
      await watchFrames[i].screenshot({ 
        path: path.join(outDir, frameName),
        type: 'png'
      });
      console.log(`  Saved ${frameName}`);
    }

    await page.close();
  }

  await browser.close();
}

// Dedicated pass for reduced-motion (critical HIG scenario that was previously missing)
async function captureReducedMotion(browserType, browserName) {
  console.log(`\n[${browserName}] Running dedicated reduced-motion pass (prefers-reduced-motion: reduce)...`);
  const browser = await browserType.launch({ headless: true });
  const context = await browser.newContext({
    deviceScaleFactor: 2,
    reducedMotion: 'reduce',
    javaScriptEnabled: true
  });

  // Focused on the two most important viewports for motion-sensitive UI
  const reducedViewports = VIEWPORTS.filter(v => ['iphone-14', 'ipad-portrait'].includes(v.name));

  const outDir = PHASE_DIR;
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  for (const vp of reducedViewports) {
    const page = await context.newPage();
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);

    const suffix = '-reduced-motion';

    const hero = await page.locator('section.hero').first();
    if (await hero.count() > 0) {
      await hero.screenshot({ path: path.join(outDir, `${browserName}-${vp.name}-hero${suffix}.png`), type: 'png' });
      console.log(`  [reduced] Saved hero for ${vp.name}`);
    }

    const showcase = await page.locator('section.showcase').first();
    if (await showcase.count() > 0) {
      await showcase.screenshot({ path: path.join(outDir, `${browserName}-${vp.name}-showcase${suffix}.png`), type: 'png' });
      console.log(`  [reduced] Saved showcase for ${vp.name}`);
    }

    await page.close();
  }

  await browser.close();
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  if (!fs.existsSync(PHASE_DIR)) {
    fs.mkdirSync(PHASE_DIR, { recursive: true });
  }

  console.log('=== Playwright Visual Design Review Starting ===');
  console.log(`Phase: ${PHASE}   → writing to ${PHASE_DIR}`);
  console.log(`Target: ${TARGET_URL}\n`);

  try {
    // Chromium (most common rendering)
    console.log('--- Chromium ---');
    await captureForBrowser(chromium, 'chromium');
    await captureReducedMotion(chromium, 'chromium');

    // WebKit (Safari simulation - critical for iOS device frame perception)
    console.log('\n--- WebKit (Safari) ---');
    await captureForBrowser(webkit, 'webkit');
    await captureReducedMotion(webkit, 'webkit');

    console.log('\n=== All captures complete ===');
    console.log(`Evidence stored under: ${PHASE_DIR}`);
    console.log('Run with --phase before (or after) to separate states and preserve history.');
  } catch (err) {
    console.error('Playwright capture failed:', err);
    process.exit(1);
  }
}

main();