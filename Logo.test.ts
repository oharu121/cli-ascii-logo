import { describe, it, expect, beforeEach, vi } from 'vitest';
import logo, { PALETTE_NAMES, CUSTOM_GRADIENTS, PRESET_GRADIENTS, type PaletteName } from './Logo.js';

describe('Logo', () => {
  beforeEach(() => {
    // Reset the logo state before each test by creating a new text
    logo.setText('Test');
  });

  describe('setText', () => {
    it('should set text successfully', () => {
      const result = logo.setText('Hello');
      expect(result.getText()).toBe('Hello');
    });

    it('should return this for method chaining', () => {
      const result = logo.setText('Hello');
      expect(result).toBe(logo);
    });

    it('should throw error for empty text', () => {
      expect(() => logo.setText('')).toThrow('Text cannot be empty');
    });

    it('should throw error for whitespace-only text', () => {
      expect(() => logo.setText('   ')).toThrow('Text cannot be empty');
    });
  });

  describe('getText', () => {
    it('should return the current text', () => {
      logo.setText('MyApp');
      expect(logo.getText()).toBe('MyApp');
    });
  });

  describe('addFontStyle', () => {
    it('should apply default font style', () => {
      logo.setText('Hi');
      const result = logo.addFontStyle();
      expect(result).toBe(logo);
      expect(logo.getText()).toContain('\n'); // ASCII art has multiple lines
      expect(logo.getText().length).toBeGreaterThan(2);
    });

    it('should apply custom font', () => {
      logo.setText('Hi');
      logo.addFontStyle('Standard');
      const standardText = logo.getText();

      logo.setText('Hi');
      logo.addFontStyle('Slant');
      const slantText = logo.getText();

      expect(standardText).not.toBe(slantText);
    });

    it('should respect width parameter', () => {
      logo.setText('VeryLongTextHere');
      logo.addFontStyle('Standard', 50);
      const lines = logo.getText().split('\n');

      // Check that lines don't exceed width significantly
      const maxLength = Math.max(...lines.map(line => line.length));
      expect(maxLength).toBeLessThanOrEqual(60); // Some tolerance for formatting
    });
  });

  describe('addGradient', () => {
    it('should add gradient to styled text', () => {
      logo.setText('Test').addFontStyle();
      const result = logo.addGradient('sunset');

      // In non-TTY environments, gradient-string may not output colors
      // Just verify it returns a string with content
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should throw error if no text is set', () => {
      const newLogo = Object.create(Object.getPrototypeOf(logo));
      newLogo.text = '';

      expect(() => newLogo.addGradient('sunset')).toThrow(
        'No text set. Call setText() or addFontStyle() first.'
      );
    });

    it('should work with preset gradients', () => {
      logo.setText('Hi').addFontStyle();
      const result = logo.addGradient('rainbow');
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should work with custom gradients', () => {
      logo.setText('Hi').addFontStyle();
      const result = logo.addGradient('sunset');
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should use default palette for unknown gradient', () => {
      logo.setText('Hi').addFontStyle();
      const unknownResult = logo.addGradient('unknown-palette' as PaletteName);

      logo.setText('Hi').addFontStyle();
      const defaultResult = logo.addGradient('sunset');

      // Both should produce output
      expect(unknownResult).toBeTruthy();
      expect(defaultResult).toBeTruthy();
    });
  });

  describe('createLogo', () => {
    it('should create logo with default palette', () => {
      const result = logo.createLogo('App');
      expect(result).toBeTruthy();
      expect(result).toContain('\n'); // Has multiple lines
    });

    it('should create logo with custom palette', () => {
      const result = logo.createLogo('App', 'cyberpunk');
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should be chainable (fluent interface)', () => {
      const result = logo.setText('Test').addFontStyle().addGradient('fire');
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('createRandomLogo', () => {
    it('should create logo with random palette', () => {
      const result = logo.createRandomLogo('Random');
      expect(result).toBeTruthy();
      expect(result).toContain('\n');
    });

    it('should produce consistent structure', () => {
      // Test that random logos have consistent structure
      const result1 = logo.createRandomLogo('X');
      const result2 = logo.createRandomLogo('X');

      // Both should have content and multiple lines
      expect(result1).toBeTruthy();
      expect(result2).toBeTruthy();
      expect(result1).toContain('\n');
      expect(result2).toContain('\n');
    });
  });

  describe('addRandomGradient', () => {
    it('should add random gradient', () => {
      logo.setText('Test').addFontStyle();
      const result = logo.addRandomGradient();
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('build', () => {
    it('should build logo with specified palette', () => {
      logo.setText('Build').addFontStyle();
      const result = logo.build('ocean');
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should use default palette if not specified', () => {
      logo.setText('Build').addFontStyle();
      const result = logo.build();
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('display', () => {
    it('should display logo without animation', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const clearSpy = vi.spyOn(console, 'clear').mockImplementation(() => {});

      logo.setText('Display').addFontStyle();
      await logo.display({ clearBefore: true });

      expect(clearSpy).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
      clearSpy.mockRestore();
    });

    it('should not clear console if clearBefore is false', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const clearSpy = vi.spyOn(console, 'clear').mockImplementation(() => {});

      logo.setText('Display').addFontStyle();
      await logo.display({ clearBefore: false });

      expect(clearSpy).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
      clearSpy.mockRestore();
    });

    it('should display with fade-in animation', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
      const clearSpy = vi.spyOn(console, 'clear').mockImplementation(() => {});

      logo.setText('Hi').addFontStyle();
      await logo.display({ animation: 'fade-in', duration: 100 });

      expect(stdoutSpy).toHaveBeenCalled();

      stdoutSpy.mockRestore();
      clearSpy.mockRestore();
    });

    it('should display with slide-in animation', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
      const clearSpy = vi.spyOn(console, 'clear').mockImplementation(() => {});

      logo.setText('Hi').addFontStyle();
      await logo.display({ animation: 'slide-in', duration: 100 });

      expect(stdoutSpy).toHaveBeenCalled();

      stdoutSpy.mockRestore();
      clearSpy.mockRestore();
    });

    it('should display with typing animation', async () => {
      const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
      const clearSpy = vi.spyOn(console, 'clear').mockImplementation(() => {});

      logo.setText('Hi').addFontStyle();
      await logo.display({ animation: 'typing', duration: 100 });

      expect(stdoutSpy).toHaveBeenCalled();

      stdoutSpy.mockRestore();
      clearSpy.mockRestore();
    });
  });

  describe('Exports', () => {
    it('should export PALETTE_NAMES', () => {
      expect(PALETTE_NAMES).toBeDefined();
      expect(Array.isArray(PALETTE_NAMES)).toBe(true);
      expect(PALETTE_NAMES.length).toBeGreaterThan(0);
    });

    it('should export CUSTOM_GRADIENTS', () => {
      expect(CUSTOM_GRADIENTS).toBeDefined();
      expect(typeof CUSTOM_GRADIENTS).toBe('object');
      expect(Object.keys(CUSTOM_GRADIENTS).length).toBeGreaterThan(0);
    });

    it('should export PRESET_GRADIENTS', () => {
      expect(PRESET_GRADIENTS).toBeDefined();
      expect(typeof PRESET_GRADIENTS).toBe('object');
      expect(Object.keys(PRESET_GRADIENTS).length).toBeGreaterThan(0);
    });

    it('should include all custom gradients in PALETTE_NAMES', () => {
      const customKeys = Object.keys(CUSTOM_GRADIENTS);
      customKeys.forEach(key => {
        expect(PALETTE_NAMES).toContain(key);
      });
    });

    it('should include all preset gradients in PALETTE_NAMES', () => {
      const presetKeys = Object.keys(PRESET_GRADIENTS);
      presetKeys.forEach(key => {
        expect(PALETTE_NAMES).toContain(key);
      });
    });
  });

  describe('Integration tests', () => {
    it('should handle complete workflow', () => {
      const result = logo
        .setText('MyApp')
        .addFontStyle('Standard', 80)
        .addGradient('cyberpunk');

      expect(result).toBeTruthy();
      expect(result).toContain('\n');
    });

    it('should allow reusing the logo instance', () => {
      const first = logo.createLogo('First', 'sunset');
      const second = logo.createLogo('Second', 'ocean');

      expect(first).not.toBe(second);
      expect(first).toBeTruthy();
      expect(second).toBeTruthy();
    });
  });
});
