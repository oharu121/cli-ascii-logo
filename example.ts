import logo, { PALETTE_NAMES } from "./Logo";

// Simple usage
console.log(logo.createLogo("Hello", "sunset"));

console.log("\n");

// Random logo
console.log(logo.createRandomLogo("Random"));

console.log("\n");

// Builder pattern
const customLogo = logo
  .setText("Builder")
  .addFontStyle("ANSI Shadow", 100)
  .build("ocean");

console.log(customLogo);

console.log("\n--- All Available Palettes ---\n");

PALETTE_NAMES.forEach((palette) => {
  console.log(`\n${palette}:`);
  console.log(logo.createLogo("DEMO", palette));
});
