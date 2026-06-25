const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const sourceRoot = path.join(root, 'site-src');
const templateRoot = path.join(sourceRoot, 'templates');
const manifestPath = path.join(sourceRoot, 'generated-files.json');

class GeneratorError extends Error {
  constructor(message) {
    super(message);
    this.name = 'GeneratorError';
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function parseArgs(argv) {
  const outIndex = argv.indexOf('--out');

  if (outIndex === -1) {
    return { outDir: root };
  }

  const outDir = argv[outIndex + 1];

  if (outDir === undefined || outDir.startsWith('--')) {
    throw new GeneratorError('Missing value for --out');
  }

  return { outDir: path.resolve(outDir) };
}

function assertSafeRelativePath(relativePath) {
  if (path.isAbsolute(relativePath) || relativePath.split(/[\\/]/).includes('..')) {
    throw new GeneratorError(`Unsafe generated path: ${relativePath}`);
  }
}

function ensureTemplate(relativePath) {
  const sourcePath = path.join(templateRoot, relativePath);

  if (!fs.existsSync(sourcePath)) {
    throw new GeneratorError(`Missing source template: site-src/templates/${relativePath}`);
  }

  return sourcePath;
}

function writeGeneratedFile(relativePath, outDir) {
  assertSafeRelativePath(relativePath);

  const sourcePath = ensureTemplate(relativePath);
  const targetPath = path.join(outDir, relativePath);

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
}

function generatedFiles() {
  const manifest = readJson(manifestPath);
  const files = manifest.generatedTextFiles;

  if (!Array.isArray(files) || files.some((entry) => typeof entry !== 'string')) {
    throw new GeneratorError('site-src/generated-files.json must define generatedTextFiles as strings');
  }

  return files;
}

function generateSite(options) {
  const files = generatedFiles();

  for (const relativePath of files) {
    writeGeneratedFile(relativePath, options.outDir);
  }

  return files;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const files = generateSite(options);
  console.log(`[generate] Wrote ${files.length} generated files to ${path.relative(root, options.outDir) || '.'}.`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    if (error instanceof GeneratorError) {
      console.error(`[generate] ${error.message}`);
      process.exit(1);
    }

    throw error;
  }
}

module.exports = {
  generateSite,
  generatedFiles,
  GeneratorError,
};
