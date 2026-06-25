const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

class BuiltAssetVerificationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BuiltAssetVerificationError';
  }
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

function assertSafeRelativePath(relativePath) {
  if (path.isAbsolute(relativePath) || relativePath.split(/[\\/]/).includes('..')) {
    throw new BuiltAssetVerificationError(`Unsafe asset path: ${relativePath}`);
  }
}

function readBuiltBuffer(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new BuiltAssetVerificationError(`Missing file: ${path.relative(root, filePath)}`);
  }

  return fs.readFileSync(filePath);
}

function verifyManifest(manifestRelativePath, joiner, label) {
  const manifest = readJson(manifestRelativePath);
  const sourceDir = path.dirname(manifestRelativePath);
  const partials = manifest.partials;

  if (!Array.isArray(partials) || partials.some((entry) => typeof entry !== 'string')) {
    throw new BuiltAssetVerificationError(`${manifestRelativePath} must define string partials`);
  }

  if (typeof manifest.output !== 'string' || typeof manifest.templateOutput !== 'string') {
    throw new BuiltAssetVerificationError(`${manifestRelativePath} must define output and templateOutput`);
  }

  const built = Buffer.from(
    partials
      .map((partial) => {
        assertSafeRelativePath(partial);
        return fs.readFileSync(path.join(root, sourceDir, partial), 'utf8');
      })
      .join(joiner),
    'utf8',
  );

  const mismatches = [];
  for (const output of [manifest.output, manifest.templateOutput]) {
    assertSafeRelativePath(output);
    const targetPath = path.join(root, output);
    const target = readBuiltBuffer(targetPath);
    if (!target.equals(built)) {
      mismatches.push(path.relative(root, targetPath));
    }
  }

  if (mismatches.length > 0) {
    throw new BuiltAssetVerificationError(`${label} drift: ${mismatches.join(', ')}`);
  }
}

function main() {
  verifyManifest('site-src/styles/aquatick/manifest.json', '', 'AquaTick CSS');
  verifyManifest('site-src/styles/korea-map-link/manifest.json', '', 'Korea Map Link CSS');
  verifyManifest('site-src/scripts/aquatick/manifest.json', '\n\n', 'AquaTick JS');
  console.log('[verify:built-assets] Built CSS/JS outputs match committed outputs and templates.');
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    if (error instanceof BuiltAssetVerificationError) {
      console.error(`[verify:built-assets] ${error.message}`);
      process.exit(1);
    }

    throw error;
  }
}
