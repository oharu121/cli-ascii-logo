import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface ExecError extends Error {
  status?: number;
  stdout?: string;
  stderr?: string;
}

describe('CLI Integration Tests', () => {
  const cliPath = path.join(__dirname, 'dist', 'cli.js');

  // Check if CLI is built before running tests
  const cliExists = fs.existsSync(cliPath);

  describe('Built CLI (requires npm run build)', () => {
    it('should show help when no arguments provided', () => {
      if (!cliExists) {
        console.log('CLI not built yet, skipping test');
        return;
      }

      try {
        execSync(`node "${cliPath}"`, {
          encoding: 'utf-8',
          timeout: 5000,
        });
      } catch (error) {
        // CLI may exit with code 0 after showing help
        const execError = error as ExecError;
        const output = execError.stdout || '';
        expect(output).toContain('Usage:');
        expect(output).toContain('cli-ascii-logo');
      }
    });

    it('should show help with --help flag', () => {
      if (!cliExists) {
        console.log('CLI not built yet, skipping test');
        return;
      }

      try {
        const output = execSync(`node "${cliPath}" --help`, {
          encoding: 'utf-8',
          timeout: 5000,
        });
        expect(output).toContain('Usage:');
        expect(output).toContain('cli-ascii-logo');
      } catch (error) {
        const execError = error as ExecError;
        const output = execError.stdout || '';
        expect(output).toContain('Usage:');
      }
    });

    it('should show help with -h flag', () => {
      if (!cliExists) {
        console.log('CLI not built yet, skipping test');
        return;
      }

      try {
        const output = execSync(`node "${cliPath}" -h`, {
          encoding: 'utf-8',
          timeout: 5000,
        });
        expect(output).toContain('Usage:');
      } catch (error) {
        const execError = error as ExecError;
        const output = execError.stdout || '';
        expect(output).toContain('Usage:');
      }
    });

    it('should list palettes with --list flag', () => {
      if (!cliExists) {
        console.log('CLI not built yet, skipping test');
        return;
      }

      try {
        const output = execSync(`node "${cliPath}" --list`, {
          encoding: 'utf-8',
          timeout: 5000,
        });
        expect(output).toContain('Available Gradient Palettes');
      } catch (error) {
        const execError = error as ExecError;
        const output = execError.stdout || '';
        expect(output).toContain('Available Gradient Palettes');
      }
    });

    it('should generate logo with text', () => {
      if (!cliExists) {
        console.log('CLI not built yet, skipping test');
        return;
      }

      const output = execSync(`node "${cliPath}" Test`, {
        encoding: 'utf-8',
        timeout: 5000,
      });

      expect(output.length).toBeGreaterThan(0);
      expect(output).toContain('\n'); // Multi-line ASCII art
    });

    it('should generate logo with specified palette', () => {
      if (!cliExists) {
        console.log('CLI not built yet, skipping test');
        return;
      }

      const output = execSync(`node "${cliPath}" Hello --palette sunset`, {
        encoding: 'utf-8',
        timeout: 5000,
      });

      expect(output.length).toBeGreaterThan(0);
    });

    it('should generate logo with -p shorthand', () => {
      if (!cliExists) {
        console.log('CLI not built yet, skipping test');
        return;
      }

      const output = execSync(`node "${cliPath}" World -p ocean`, {
        encoding: 'utf-8',
        timeout: 5000,
      });

      expect(output.length).toBeGreaterThan(0);
    });

    it('should generate random logo with --random flag', () => {
      if (!cliExists) {
        console.log('CLI not built yet, skipping test');
        return;
      }

      const output = execSync(`node "${cliPath}" Random --random`, {
        encoding: 'utf-8',
        timeout: 5000,
      });

      expect(output.length).toBeGreaterThan(0);
    });

    it('should handle multi-word text', () => {
      if (!cliExists) {
        console.log('CLI not built yet, skipping test');
        return;
      }

      const output = execSync(`node "${cliPath}" Hello World`, {
        encoding: 'utf-8',
        timeout: 5000,
      });

      expect(output.length).toBeGreaterThan(0);
    });

    it('should error when palette requires value but none provided', () => {
      if (!cliExists) {
        console.log('CLI not built yet, skipping test');
        return;
      }

      try {
        execSync(`node "${cliPath}" Test --palette`, {
          encoding: 'utf-8',
          timeout: 5000,
        });
        // Should not reach here
        expect(true).toBe(false);
      } catch (error) {
        const execError = error as ExecError;
        expect(execError.status).toBe(1);
        const errorOutput = execError.stderr || '';
        expect(errorOutput).toContain('--palette requires a palette name');
      }
    });

    it('should error for unknown palette', () => {
      if (!cliExists) {
        console.log('CLI not built yet, skipping test');
        return;
      }

      try {
        execSync(`node "${cliPath}" Test --palette nonexistent`, {
          encoding: 'utf-8',
          timeout: 5000,
        });
        // Should not reach here
        expect(true).toBe(false);
      } catch (error) {
        const execError = error as ExecError;
        expect(execError.status).toBe(1);
        const errorOutput = execError.stderr || '';
        expect(errorOutput).toContain('Unknown palette');
      }
    });

    it('should error when no text provided with palette flag', () => {
      if (!cliExists) {
        console.log('CLI not built yet, skipping test');
        return;
      }

      try {
        execSync(`node "${cliPath}" --palette sunset`, {
          encoding: 'utf-8',
          timeout: 5000,
        });
        // Should not reach here
        expect(true).toBe(false);
      } catch (error) {
        const execError = error as ExecError;
        expect(execError.status).toBe(1);
        const errorOutput = execError.stderr || '';
        expect(errorOutput).toContain('No text provided');
      }
    });
  });
});
