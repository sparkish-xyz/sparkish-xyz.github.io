const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

class JsBuildError extends Error {
  constructor(message) {
    super(message);
    this.name = 'JsBuildError';
  }
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

function assertSafeRelativePath(relativePath) {
  if (path.isAbsolute(relativePath) || relativePath.split(/[\\/]/).includes('..')) {
    throw new JsBuildError(`Unsafe JS path: ${relativePath}`);
  }
}

function main() {
  const config = readJson('site-src/scripts/aquatick/manifest.json');
  const partials = config.partials;
  if (!Array.isArray(partials) || partials.some((entry) => typeof entry !== 'string')) {
    throw new JsBuildError('site-src/scripts/aquatick/manifest.json must define string partials');
  }
  if (typeof config.output !== 'string' || typeof config.templateOutput !== 'string') {
    throw new JsBuildError('site-src/scripts/aquatick/manifest.json must define output and templateOutput');
  }

  const js = partials
    .map((partial) => {
      assertSafeRelativePath(partial);
      return fs.readFileSync(path.join(root, 'site-src/scripts/aquatick', partial), 'utf8');
    })
    .join('\n\n');

  for (const output of [config.output, config.templateOutput]) {
    assertSafeRelativePath(output);
    const targetPath = path.join(root, output);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, js);
  }

  console.log(`[build:js] Built ${config.output}.`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    if (error instanceof JsBuildError) {
      console.error(`[build:js] ${error.message}`);
      process.exit(1);
    }
    throw error;
  }
}
