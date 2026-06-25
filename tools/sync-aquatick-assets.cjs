const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const manifestPath = path.join(root, 'site-src/data/assets.json');

class AssetSyncError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AssetSyncError';
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function assertSafeRelativePath(relativePath) {
  if (path.isAbsolute(relativePath) || relativePath.split(/[\\/]/).includes('..')) {
    throw new AssetSyncError(`Unsafe asset path: ${relativePath}`);
  }
}

function mirroredAssets() {
  const manifest = readJson(manifestPath);
  const images = manifest.aquatickLegacyImageMirror;
  if (!Array.isArray(images) || images.some((entry) => typeof entry !== 'string')) {
    throw new AssetSyncError('site-src/data/assets.json must define aquatickLegacyImageMirror as strings');
  }
  return images;
}

function main() {
  const images = mirroredAssets();
  for (const name of images) {
    assertSafeRelativePath(name);
    const canonical = path.join(root, 'aquatick/assets', name);
    const legacy = path.join(root, 'assets', name);
    if (!fs.existsSync(canonical)) {
      throw new AssetSyncError(`Missing canonical AquaTick asset: aquatick/assets/${name}`);
    }
    fs.copyFileSync(canonical, legacy);
  }
  console.log(`[sync:assets] Synced ${images.length} AquaTick legacy image assets.`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    if (error instanceof AssetSyncError) {
      console.error(`[sync:assets] ${error.message}`);
      process.exit(1);
    }
    throw error;
  }
}
