#!/usr/bin/env node

import logo, { PALETTE_NAMES, PaletteName } from "./Logo";

const args = process.argv.slice(2);

function showHelp() {
  console.log(`
    Usage: cli-ascii-logo [text] [options]

    Examples:
      cli-ascii-logo "Hello World"
      cli-ascii-logo "Hello World" --palette sunset
      cli-ascii-logo "Hello World" -p cyberpunk
      cli-ascii-logo "Hello World" --random
      cli-ascii-logo --list

    Options:
      -p, --palette <name>    Use a specific gradient palette (default: sunset)
      -r, --random            Use a random gradient
      -l, --list              List all available palettes
      -h, --help              Show this help message

    Available Palettes:
      ${PALETTE_NAMES.join(", ")}
  `);
}

function listPalettes() {
  console.log("\nAvailable Gradient Palettes:\n");
  PALETTE_NAMES.forEach((palette) => {
    console.log(logo.createLogo(palette, palette as PaletteName));
    console.log("");
  });
}

function main() {
  // No arguments or help flag
  if (args.length === 0 || args.includes("-h") || args.includes("--help")) {
    showHelp();
    process.exit(0);
  }

  // List palettes
  if (args.includes("-l") || args.includes("--list")) {
    listPalettes();
    process.exit(0);
  }

  // Parse arguments
  let text = "";
  let palette: PaletteName | undefined;
  let useRandom = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "-p" || arg === "--palette") {
      const nextArg = args[i + 1];
      if (!nextArg) {
        console.error("Error: --palette requires a palette name");
        process.exit(1);
      }
      if (!PALETTE_NAMES.includes(nextArg)) {
        console.error(
          `Error: Unknown palette "${nextArg}". Use --list to see available palettes.`
        );
        process.exit(1);
      }
      palette = nextArg as PaletteName;
      i++; // Skip next arg
    } else if (arg === "-r" || arg === "--random") {
      useRandom = true;
    } else if (!arg.startsWith("-")) {
      // Collect text arguments
      text += (text ? " " : "") + arg;
    }
  }

  // Validate text
  if (!text) {
    console.error("Error: No text provided");
    showHelp();
    process.exit(1);
  }

  // Generate logo
  try {
    let result: string;

    if (useRandom) {
      result = logo.createRandomLogo(text);
    } else {
      result = logo.createLogo(text, palette);
    }
    console.log(result);
  } catch (error) {
    console.error("Error:", (error as Error).message);
    process.exit(1);
  }
}

main();
