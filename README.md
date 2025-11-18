# CLI ASCII Logo

[![npm version](https://badge.fury.io/js/cli-ascii-logo.svg)](https://badge.fury.io/js/cli-ascii-logo)
![License](https://img.shields.io/npm/l/cli-ascii-logo)
![Types](https://img.shields.io/npm/types/cli-ascii-logo)
![NPM Downloads](https://img.shields.io/npm/dw/cli-ascii-logo)
![Last Commit](https://img.shields.io/github/last-commit/oharu121/cli-ascii-logo)
![GitHub Stars](https://img.shields.io/github/stars/oharu121/cli-ascii-logo?style=social)

Create beautiful ASCII art logos with gradient colors for your CLI applications.

## Installation

```bash
npm install cli-ascii-logo
```

> **Note:** Version 2.1.0+ uses ES modules (ESM). If you need CommonJS support, use version 2.0.x or earlier.

## Usage

### CLI Usage

Use directly with npx (no installation required):

```bash
npx cli-ascii-logo "Hello World"
```

Or install globally:

```bash
npm install -g cli-ascii-logo
cli-ascii-logo "My App"
```

#### CLI Options

```bash
# Basic usage with default gradient (sunset)
cli-ascii-logo "Hello World"

# Use a specific gradient palette
cli-ascii-logo "Hello World" --palette cyberpunk
cli-ascii-logo "Hello World" -p ocean

# Use a random gradient
cli-ascii-logo "Hello World" --random
cli-ascii-logo "Hello World" -r

# List all available palettes
cli-ascii-logo --list
cli-ascii-logo -l

# Show help
cli-ascii-logo --help
cli-ascii-logo -h
```

#### CLI Examples

```bash
# Create a logo with the sunset gradient
npx cli-ascii-logo "MyApp"

# Create a logo with cyberpunk theme
npx cli-ascii-logo "CLI Tool" -p cyberpunk

# Generate with random colors
npx cli-ascii-logo "Surprise" --random

# See all available gradient options
npx cli-ascii-logo --list
```

### Programmatic Usage

## Quick Start

```typescript
import logo from "cli-ascii-logo";

// Simple usage with default gradient
console.log(logo.createLogo("Hello"));

// Use a specific gradient
console.log(logo.createLogo("My App", "rainbow"));

// Random gradient
console.log(logo.createRandomLogo("Surprise!"));
```

## API Reference

### Simple Methods

#### `createLogo(text: string, palette?: PaletteName): string`

Create a logo with a single call.

```typescript
logo.createLogo("MyApp", "sunset");
```

#### `createRandomLogo(text: string): string`

Create a logo with a random gradient palette.

```typescript
logo.createRandomLogo("Lucky");
```

### Builder Pattern (Advanced)

For more control, use the fluent builder API:

```typescript
logo.setText("MyApp").addFontStyle("ANSI Shadow", 120).build("ocean");
```

#### Methods

- **`setText(text: string): this`** - Set the text for the logo
- **`addFontStyle(font?: figlet.Fonts, width?: number): this`** - Apply ASCII art font
- **`build(palette?: PaletteName): string`** - Build and return the final logo
- **`addGradient(palette: PaletteName): string`** - Apply gradient and return (alternative to build)
- **`addRandomGradient(): string`** - Apply random gradient and return

## Available Gradients

### Custom Gradients

**Classic & Popular:**

- `sunset` - Warm orange to red (default)
- `ocean` - Deep blue to purple
- `fire` - Bold red to pink
- `forest` - Teal to green
- `gold` - Orange to yellow
- `copper` - Metallic bronze

![Popular Gradients](./assets/popular-gradients.png)

**Cool Tones:**

- `blue` - Bright blue gradient
- `mint` - Cyan to blue
- `aqua` - Turquoise tones
- `ice` - Icy white-blue tones

![Cool Gradients](./assets/cool-gradients.png)

**Warm Tones:**

- `lava` - Hot reds and oranges
- `volcano` - Dark red to gold
- `coral` - Soft pink gradient
- `cherry` - Pink-red

![Warm Gradients](./assets/warm-gradients.png)

**Vibrant & Modern:**

- `cyberpunk` - Neon pink-cyan
- `neon` - Radioactive green
- `aurora` - Northern lights effect
- `lavender` - Soft purples
- `emerald` - Northern lights effect

![Vibrant Gradients](./assets/vibrant-gradients.png)

**Special Effects:**

- `matrix` - Classic terminal green
- `nebula` - Purple to pink space

![Special Gradients](./assets/special-gradients.png)

### Preset Gradients

From the `gradient-string` library: `cristal`, `teen`, `mind`, `morning`, `vice`, `passion`, `fruit`, `instagram`, `atlas`, `retro`, `summer`, `pastel`, `rainbow`

You can get the list programmatically:

```typescript
import { PALETTE_NAMES } from "cli-ascii-logo";

console.log(PALETTE_NAMES); // Array of all available palette names
```

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import logo, {
  PaletteName,
  PALETTE_NAMES,
  CUSTOM_GRADIENTS,
} from "cli-ascii-logo";

const palette: PaletteName = "sunset";
```

## Examples

### Basic Example

```typescript
import logo from "cli-ascii-logo";

console.log(logo.createLogo("Welcome", "rainbow"));
```

### Builder Pattern Example

```typescript
import logo from "cli-ascii-logo";

const myLogo = logo.setText("MyApp").addFontStyle("ANSI Shadow").build("ocean");

console.log(myLogo);
```

### Show All Palettes

```typescript
import logo, { PALETTE_NAMES } from "cli-ascii-logo";

PALETTE_NAMES.forEach((palette) => {
  console.log(`\n--- ${palette} ---`);
  console.log(logo.createLogo("Logo", palette));
});
```

### Rich Application Banner

Create a full banner with metadata (version, timestamp, etc.):

```typescript
import logo from "cli-ascii-logo";
import fs from "fs";

function printAppBanner() {
  const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
  const logoText = logo.createLogo("wonderful\napp", "cyberpunk");

  const banner = [
    "=".repeat(80),
    logoText,
    `Version: ${pkg.version}`,
    `Started: ${new Date().toLocaleString()}`,
    "=".repeat(80),
  ].join("\n");

  console.log(banner);
}

printAppBanner();
```

![Banner with Meta](./assets/banner-with-meta.png)

You can also apply gradients to the entire banner:

```typescript
function printColoredBanner() {
  const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
  const logoText = logo.setText("wonderful\napp").addFontStyle().getText();

  const bannerText = [
    "=".repeat(80),
    logoText,
    `Version: ${pkg.version}`,
    `Started: ${new Date().toLocaleString()}`,
    "=".repeat(80),
  ].join("\n");

  // Apply gradient to the entire banner
  console.log(logo.setText(bannerText).addRandomGradient());
}

printColoredBanner();
```

![Entire Banner Gradiented](./assets/entire-banner-gradiented.png)

## Advanced Features

### Animation Support

Display logos with animations:

```typescript
import logo from 'cli-ascii-logo';

// Display with fade-in animation
await logo.setText('MyApp').addFontStyle().display({
  gradient: 'cyberpunk',
  animation: 'fade-in',
  duration: 2000,
  clearBefore: true,
});

// Other animation types: 'slide-in', 'typing'
await logo.setText('Hello').addFontStyle().display({
  animation: 'typing',
  duration: 1500,
});
```

## Development

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Code Quality

```bash
# Lint code
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting
npm run format:check
```

### Building

```bash
# Build TypeScript to dist/
npm run build
```

## Dependencies

- [figlet](https://www.npmjs.com/package/figlet) - ASCII art text generation
- [gradient-string](https://www.npmjs.com/package/gradient-string) - Gradient color effects

## Dev Dependencies

- TypeScript 5.3+
- Vitest for testing
- ESLint 9 with flat config
- Prettier for code formatting

## Requirements

- Node.js >= 14.0.0
- ES Module support (ESM)

## License

MIT

## Contributing

Contributions welcome! Please ensure:

1. All tests pass (`npm test`)
2. Code is linted (`npm run lint`)
3. Code is formatted (`npm run format`)
4. Add tests for new features

Open an issue or PR on GitHub.
