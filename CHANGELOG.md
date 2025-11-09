# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
