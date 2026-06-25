const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

class CssBuildError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CssBuildError';
  }
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

function assertSafeRelativePath(relativePath) {
  if (path.isAbsolute(relativePath) || relativePath.split(/[\\/]/).includes('..')) {
    throw new CssBuildError(`Unsafe CSS path: ${relativePath}`);
  }
}

function buildOne(configPath) {
  const config = readJson(configPath);
  const sourceDir = path.dirname(configPath);
  const partials = config.partials;
  if (!Array.isArray(partials) || partials.some((entry) => typeof entry !== 'string')) {
    throw new CssBuildError(`${configPath} must define string partials`);
  }
  if (typeof config.output !== 'string' || typeof config.templateOutput !== 'string') {
    throw new CssBuildError(`${configPath} must define output and templateOutput`);
  }

  const css = partials
    .map((partial) => {
      assertSafeRelativePath(partial);
      return fs.readFileSync(path.join(root, sourceDir, partial), 'utf8');
    })
    .join('');

  for (const output of [config.output, config.templateOutput]) {
    assertSafeRelativePath(output);
    const targetPath = path.join(root, output);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, css);
  }

  return config.output;
}

function main() {
  const outputs = [
    buildOne('site-src/styles/aquatick/manifest.json'),
    buildOne('site-src/styles/korea-map-link/manifest.json'),
  ];
  console.log(`[build:css] Built ${outputs.join(', ')}.`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    if (error instanceof CssBuildError) {
      console.error(`[build:css] ${error.message}`);
      process.exit(1);
    }
    throw error;
  }
}
