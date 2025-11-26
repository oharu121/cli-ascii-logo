#!/usr/bin/env node

/**
 * Displays the npm authentication token from ~/.npmrc
 * Useful for debugging or setting up CI/CD secrets
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

try {
  const npmrcPath = join(homedir(), '.npmrc');
  const content = readFileSync(npmrcPath, 'utf8');
  console.log(content);
} catch (error) {
  console.error('Error reading .npmrc:', error.message);
  process.exit(1);
}
