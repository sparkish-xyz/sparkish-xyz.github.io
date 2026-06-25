const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { generateSite, generatedFiles } = require('./generate-site.cjs');

const root = path.resolve(__dirname, '..');

class VerificationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'VerificationError';
  }
}

function readBuffer(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new VerificationError(`Missing file: ${path.relative(root, filePath)}`);
  }

  return fs.readFileSync(filePath);
}

function compareFile(relativePath, generatedRoot) {
  const committedPath = path.join(root, relativePath);
  const generatedPath = path.join(generatedRoot, relativePath);
  const committed = readBuffer(committedPath);
  const generated = readBuffer(generatedPath);

  if (!committed.equals(generated)) {
    throw new VerificationError(`Generated output differs: ${relativePath}`);
  }
}

function verifyGenerated() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sparkish-generated-'));

  try {
    generateSite({ outDir: tempRoot });

    for (const relativePath of generatedFiles()) {
      compareFile(relativePath, tempRoot);
    }
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

function main() {
  verifyGenerated();
  console.log('[verify:generated] Generated output matches committed files.');
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    if (error instanceof VerificationError) {
      console.error(`[verify:generated] ${error.message}`);
      process.exit(1);
    }

    throw error;
  }
}

module.exports = {
  verifyGenerated,
  VerificationError,
};
