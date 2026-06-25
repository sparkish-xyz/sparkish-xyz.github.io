const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');

const root = path.resolve(__dirname, '..');
const manifestPath = path.join(root, 'site-src/data/assets.json');

class AssetCheckError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AssetCheckError';
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function assertSafeRelativePath(relativePath) {
  if (path.isAbsolute(relativePath) || relativePath.split(/[\\/]/).includes('..')) {
    throw new AssetCheckError(`Unsafe asset path: ${relativePath}`);
  }
}

function hashFile(relativePath) {
  assertSafeRelativePath(relativePath);
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) {
    throw new AssetCheckError(`Missing asset: ${relativePath}`);
  }
  return createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function mirroredAssets() {
  const manifest = readJson(manifestPath);
  const images = manifest.aquatickLegacyImageMirror;
  if (!Array.isArray(images) || images.some((entry) => typeof entry !== 'string')) {
    throw new AssetCheckError('site-src/data/assets.json must define aquatickLegacyImageMirror as strings');
  }
  return images;
}

function main() {
  const mismatches = [];
  for (const name of mirroredAssets()) {
    const legacy = `assets/${name}`;
    const canonical = `aquatick/assets/${name}`;
    const legacyHash = hashFile(legacy);
    const canonicalHash = hashFile(canonical);
    if (legacyHash !== canonicalHash) {
      mismatches.push(`${legacy} != ${canonical}`);
    }
  }

  if (mismatches.length > 0) {
    throw new AssetCheckError(`AquaTick legacy mirror drift:\n${mismatches.join('\n')}`);
  }

  console.log('[check:assets] AquaTick legacy image mirror is byte-identical.');
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    if (error instanceof AssetCheckError) {
      console.error(`[check:assets] ${error.message}`);
      process.exit(1);
    }
    throw error;
  }
}
