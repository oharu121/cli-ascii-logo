/**
 * cli-ascii-logo - Create beautiful ASCII art logos with gradient colors for your CLI applications
 *
 * @license MIT
 */

'use strict';

const Logo = require('./dist/Logo');

// Export the default singleton instance as the main export
module.exports = Logo.default;

// Also export as named exports
module.exports.default = Logo.default;
module.exports.Logo = Logo.default;
module.exports.PALETTE_NAMES = Logo.PALETTE_NAMES;
module.exports.CUSTOM_GRADIENTS = Logo.CUSTOM_GRADIENTS;
module.exports.PRESET_GRADIENTS = Logo.PRESET_GRADIENTS;
