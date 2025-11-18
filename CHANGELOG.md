# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2025-11-18

### Changed

- **Migrated to ESM** - Package now uses ES modules instead of CommonJS
  - Added `"type": "module"` to package.json
  - Updated all imports to use `.js` extensions
  - Updated TypeScript configuration for ESM output
  - Removed CommonJS `require` support (breaking change for CommonJS users)

### Added

- **Testing Infrastructure**
  - Added Vitest for unit and integration testing
  - Comprehensive test suite with 44 test cases
  - Code coverage reporting with `@vitest/coverage-v8`
  - Test scripts: `test`, `test:watch`, `test:ui`, `test:coverage`
- **Code Quality Tools**
  - ESLint 9 with flat config format
  - TypeScript ESLint plugin for strict type checking
  - Prettier for code formatting
  - Pre-configured linting and formatting scripts
  - Scripts: `lint`, `lint:fix`, `format`, `format:check`
- **Animation Support** (already existed, now properly tested)
  - `display()` method with animation options
  - Animation types: `fade-in`, `slide-in`, `typing`
  - Configurable duration and clear options

### Fixed

- Fixed TypeScript type definitions for `figlet.Fonts` (was incorrectly using `figlet.FontName`)
- Removed unused parameters from animation helper methods
- Fixed ANSI escape code handling in test environments

### Developer Experience

- Added `.prettierrc` and `.prettierignore` for consistent formatting
- Added `eslint.config.js` with TypeScript and Prettier integration
- Updated `.gitignore` to exclude coverage reports
- All code now passes strict ESLint rules with zero warnings

## [2.0.0] - 2025-11-09

### Added

- **CLI Command Support** - Package can now be used directly from the command line with npx
  - Added `cli-ascii-logo` binary command
  - Support for `npx cli-ascii-logo` usage without installation
  - Global installation support with `npm install -g cli-ascii-logo`
- **CLI Options**
  - `-p, --palette <name>` - Select specific gradient palette
  - `-r, --random` - Generate with random gradient
  - `-l, --list` - Display all available palettes with visual examples
  - `-h, --help` - Show help message
- **Programmatic API** - Create ASCII art logos with gradient colors
  - Simple API: `createLogo()` and `createRandomLogo()`
  - Builder pattern API for advanced usage
  - TypeScript support with full type definitions
- **Gradient Palettes** - 35+ built-in gradient palettes
  - Custom gradients: sunset, ocean, fire, forest, gold, copper, and more
  - Preset gradients from gradient-string library
  - `PALETTE_NAMES` export for programmatic access
- **ASCII Art Generation** - Powered by figlet with customizable fonts
- **Documentation**
  - Comprehensive README with usage examples
  - API reference documentation
  - CLI usage guide
  - TypeScript examples

### Technical

- Built with TypeScript
- Dependencies: figlet, gradient-string
- Node.js >= 14.0.0 required
- MIT License

[1.0.0]: https://github.com/oharu121/cli-ascii-logo/releases/tag/v1.0.0
