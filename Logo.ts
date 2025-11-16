import figlet from "figlet";
import gradient from "gradient-string";

const DEFAULT_PALETTE: PaletteName = "sunset";
const DEFAULT_FONT: figlet.FontName = "ANSI Shadow";
const DEFAULT_TEXT_WIDTH = 100;

const PRESET_GRADIENTS = {
  cristal: gradient.cristal,
  teen: gradient.teen,
  mind: gradient.mind,
  morning: gradient.morning,
  vice: gradient.vice,
  passion: gradient.passion,
  fruit: gradient.fruit,
  instagram: gradient.instagram,
  atlas: gradient.atlas,
  retro: gradient.retro,
  summer: gradient.summer,
  pastel: gradient.pastel,
  rainbow: gradient.rainbow,
} as const;

const CUSTOM_GRADIENTS: { [key: string]: string[] } = {
  // Classic & Popular
  sunset: ["#ff9966", "#ff5e62", "#ffa34e"],
  ocean: ["#667eea", "#764ba2"],
  fire: ["#ff0844", "#ffb199"],
  forest: ["#134e5e", "#71b280"],
  gold: ["#f7971e", "#ffd200"],
  copper: ["#b87333", "#d4af37", "#cd7f32"],

  // Cool tones
  blue: ["#4ea8ff", "#7f88ff"],
  mint: ["#00d2ff", "#3a7bd5"],
  aqua: ["#00ffff", "#00ced1", "#20b2aa"],
  ice: ["#e0ffff", "#b0e0e6", "#87ceeb"],
  dawn: ["#00c6ff", "#0072ff"],

  // Warm tones
  lava: ["#ff4500", "#ffa500", "#ff0000"],
  volcano: ["#8b0000", "#ff4500", "#ffd700"],
  coral: ["#ff9a9e", "#fecfef"],
  cherry: ["#ff1493", "#ff69b4", "#ff85c1"],

  // Vibrant & Modern
  cyberpunk: ["#ff00ff", "#00ffff", "#ff00ff"],
  neon: ["#39ff14", "#7fff00", "#adff2f"],
  aurora: ["#00ff87", "#60efff", "#a78bfa"],
  lavender: ["#e6e6fa", "#dda0dd", "#ba55d3"],
  emerald: ["#50c878", "#2ecc71", "#00d084"],

  // Special effects
  matrix: ["#00ff41", "#008f11"],
  nebula: ["#654ea3", "#eaafc8"],
};

const PALETTE_NAMES = [
  ...Object.keys(CUSTOM_GRADIENTS),
  ...Object.keys(PRESET_GRADIENTS),
] as const;

type CustomGradient = keyof typeof CUSTOM_GRADIENTS;
type PresetGradient = keyof typeof PRESET_GRADIENTS;
type PaletteName = (typeof PALETTE_NAMES)[number];

type AnimationType = "fade-in" | "slide-in" | "typing";

interface DisplayOptions {
  gradient?: PaletteName;
  animation?: AnimationType;
  duration?: number;
  clearBefore?: boolean;
}


class Logo {
  private text: string = "";

  public createLogo(
    text: string,
    palette: PaletteName = DEFAULT_PALETTE
  ): string {
    return this.setText(text).addFontStyle().addGradient(palette);
  }

  public createRandomLogo(text: string): string {
    const randomIndex = Math.floor(Math.random() * PALETTE_NAMES.length);
    const randomPalette = PALETTE_NAMES[randomIndex]!;
    return this.setText(text).addFontStyle().addGradient(randomPalette);
  }

  public setText(text: string): this {
    if (!text || text.trim().length === 0) {
      throw new Error("Text cannot be empty");
    }
    this.text = text;
    return this;
  }

  public getText(): string {
    return this.text;
  }

  public addFontStyle(
    font: figlet.FontName = DEFAULT_FONT,
    width: number = DEFAULT_TEXT_WIDTH
  ): this {
    this.text = figlet.textSync(this.text, {
      font,
      horizontalLayout: "default",
      verticalLayout: "default",
      width,
      whitespaceBreak: true,
    });
    return this;
  }

  public addRandomGradient(): string {
    const randomIndex = Math.floor(Math.random() * PALETTE_NAMES.length);
    const randomPalette = PALETTE_NAMES[randomIndex]!;
    return this.addGradient(randomPalette);
  }

  public addGradient(palette: PaletteName): string {
    if (!this.text) {
      throw new Error("No text set. Call setText() or addFontStyle() first.");
    }

    let gradientFunc;

    if (palette in PRESET_GRADIENTS) {
      gradientFunc = PRESET_GRADIENTS[palette as PresetGradient];
    } else if (palette in CUSTOM_GRADIENTS) {
      gradientFunc = gradient(CUSTOM_GRADIENTS[palette as CustomGradient]);
    } else {
      gradientFunc = gradient(CUSTOM_GRADIENTS[DEFAULT_PALETTE]);
    }

    return gradientFunc.multiline(this.text);
  }

  /**
   * Build and return the final logo with gradient applied.
   * This is an alternative to addGradient() for a more fluent builder pattern.
   */
  public build(palette: PaletteName = DEFAULT_PALETTE): string {
    return this.addGradient(palette);
  }

  /**
   * Display the logo with optional animation and gradient.
   * This is a terminal method that outputs to console.
   */
  public async display(options: DisplayOptions = {}): Promise<void> {
    const {
      gradient: palette = DEFAULT_PALETTE,
      animation,
      duration = 2000,
      clearBefore = true,
    } = options;

    // Apply gradient
    const coloredLogo = this.addGradient(palette);

    // Clear console if requested
    if (clearBefore) {
      console.clear();
    }

    // If no animation, just print it
    if (!animation) {
      console.log(coloredLogo);
      return;
    }

    // Reserve space for the logo immediately
    const lines = coloredLogo.split("\n");
    const lineCount = lines.length;

    // Print empty lines to reserve space
    console.log("\n".repeat(lineCount - 1));

    // Move cursor back to the start of reserved space
    process.stdout.write(`\x1b[${lineCount}A`);

    // Apply animation
    switch (animation) {
      case "fade-in":
        await this.animateFadeIn(coloredLogo, duration, lineCount);
        break;
      case "slide-in":
        await this.animateSlideIn(coloredLogo, duration, lineCount);
        break;
      case "typing":
        await this.animateTyping(coloredLogo, duration, lineCount);
        break;
    }
  }

  private async animateFadeIn(text: string, duration: number, lineCount: number): Promise<void> {
    const lines = text.split("\n");
    const delayPerLine = duration / lines.length;

    for (let i = 0; i < lines.length; i++) {
      // Clear the current line and write the new one
      process.stdout.write("\x1b[2K"); // Clear entire line
      process.stdout.write(lines[i]);

      // Move to next line (except for the last one)
      if (i < lines.length - 1) {
        process.stdout.write("\n");
      }

      await this.sleep(delayPerLine);
    }

    // Move cursor to end
    process.stdout.write("\n");
  }

  private async animateSlideIn(text: string, duration: number, lineCount: number): Promise<void> {
    const lines = text.split("\n");
    const maxLineLength = Math.max(...lines.map(line => this.stripAnsi(line).length));

    // Calculate frames for smooth animation
    const fps = 30; // Frames per second
    const totalFrames = Math.floor((duration / 1000) * fps);
    const frameDelay = duration / totalFrames;

    // Animate from right to left
    for (let frame = 0; frame <= totalFrames; frame++) {
      // Calculate offset (starts from maxLineLength, ends at 0)
      const progress = frame / totalFrames;
      const offset = Math.floor(maxLineLength * (1 - progress));

      // Move cursor to start of reserved area
      if (frame > 0) {
        process.stdout.write(`\x1b[${lineCount}A`); // Move cursor up
      }

      // Draw each line with the current offset
      for (let i = 0; i < lines.length; i++) {
        process.stdout.write("\x1b[2K"); // Clear entire line

        // Add padding to create sliding effect
        const padding = " ".repeat(offset);
        process.stdout.write(padding + lines[i]);

        // Move to next line (except for the last one)
        if (i < lines.length - 1) {
          process.stdout.write("\n");
        }
      }

      if (frame < totalFrames) {
        await this.sleep(frameDelay);
      }
    }

    // Move cursor to end
    process.stdout.write("\n");
  }

  // Helper to strip ANSI color codes for accurate length calculation
  private stripAnsi(str: string): string {
    return str.replace(/\x1b\[[0-9;]*m/g, "");
  }

  private async animateTyping(text: string, duration: number, lineCount: number): Promise<void> {
    const lines = text.split("\n");
    const totalChars = text.length;
    const delayPerChar = duration / totalChars;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Clear the current line
      process.stdout.write("\x1b[2K");

      // Type out each character
      for (const char of line) {
        process.stdout.write(char);
        await this.sleep(delayPerChar);
      }

      // Move to next line (except for the last one)
      if (i < lines.length - 1) {
        process.stdout.write("\n");
      }
    }

    // Move cursor to end
    process.stdout.write("\n");
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export types for TypeScript users
export type { PaletteName, CustomGradient, PresetGradient, AnimationType, DisplayOptions };

// Export constants for discovering available palettes
export { PALETTE_NAMES, CUSTOM_GRADIENTS, PRESET_GRADIENTS };

// Export the singleton instance as default
export default new Logo();
