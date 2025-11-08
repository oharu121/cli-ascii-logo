import logo, { PALETTE_NAMES } from "./Logo";
import fs from "fs";

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
