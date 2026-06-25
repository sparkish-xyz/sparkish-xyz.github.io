import { expect, test } from '@playwright/test';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

test.describe('future generated output parity', () => {
  test('generated static output matches committed GitHub Pages files', async () => {
    const result = await execFileAsync('npm', ['run', 'verify:generated'], {
      cwd: process.cwd(),
      env: process.env,
    });

    expect(result.stdout).toContain('Generated output matches committed files');
  });
});
