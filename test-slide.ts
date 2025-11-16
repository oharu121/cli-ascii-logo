import logo from "./Logo";

async function testSlide() {
  console.log("Testing REAL slide-in animation with motion:\n");

  await logo
    .setText("SLIDE")
    .addFontStyle()
    .display({
      gradient: "cyberpunk",
      animation: "slide-in",
      duration: 2000,
      clearBefore: false
    });

  console.log("\n✓ Animation complete!\n");

  // Test with different text
  await logo
    .setText("HELLO")
    .addFontStyle()
    .display({
      gradient: "sunset",
      animation: "slide-in",
      duration: 1500,
      clearBefore: false
    });

  console.log("\n✓ Done!");
}

testSlide().catch(console.error);
