/* ==========================================================================
   SuperStorys Analytics Dashboard
   utils.js — Color & Gradient Utility Functions
   ========================================================================== */

'use strict';

/**
 * Convert a hex color + alpha into an rgba() string.
 * @param {string} hex   - e.g. '#6366F1'
 * @param {number} alpha - 0‒1
 * @returns {string}
 */
function hexAlpha(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
}

/**
 * Create a horizontal linear gradient across the canvas width.
 * @param {CanvasRenderingContext2D} ctx
 * @param {string[]} colors - Array of color stops (equally spaced)
 * @returns {CanvasGradient}
 */
function gradientH(ctx, colors) {
    const g = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
    colors.forEach((c, i) => g.addColorStop(i / (colors.length - 1), c));
    return g;
}

/**
 * Create a vertical linear gradient from top to bottom of the canvas.
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} colorTop
 * @param {string} colorBottom
 * @returns {CanvasGradient}
 */
function gradientV(ctx, colorTop, colorBottom) {
    const g = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    g.addColorStop(0, colorTop);
    g.addColorStop(1, colorBottom);
    return g;
}

/**
 * Linearly interpolate between two hex colours.
 * @param {string} c1 - Start hex colour
 * @param {string} c2 - End hex colour
 * @param {number} t  - 0‒1 interpolation factor
 * @returns {string} rgb() string
 */
function lerpColor(c1, c2, t) {
    const r = parseInt(c1.slice(1, 3), 16), g = parseInt(c1.slice(3, 5), 16), b = parseInt(c1.slice(5, 7), 16);
    const r2 = parseInt(c2.slice(1, 3), 16), g2 = parseInt(c2.slice(3, 5), 16), b2 = parseInt(c2.slice(5, 7), 16);
    return `rgb(${Math.round(r + (r2 - r) * t)},${Math.round(g + (g2 - g) * t)},${Math.round(b + (b2 - b) * t)})`;
}

/**
 * Map a retention percentage (0-100) to a heatmap cell colour.
 * Palette: Red (0%) → Yellow (Mid) → Green (100%).
 * @param {number} pct
 * @returns {string} hex string
 */
function heatmapColor(pct) {
    if (pct === 100) return '#62c174'; // Green for 100%
    if (pct === 0) return '#f45a5d';   // Red for 0%

    // Gradient between bright yellow and lighter red for middle values
    if (pct >= 15) return '#f0d96d'; // Bright Yellow
    if (pct >= 8) return '#f1ef87'; // Pale Yellow
    if (pct > 0) return '#f08969'; // Orange-Red

    return '#f45a5d'; // Fallback Red
}

/**
 * Choose a legible text colour (white or dark slate) for a given heatmap cell.
 * @param {number} pct
 * @returns {string}
 */
function textColorForBg(pct) {
    return '#333333'; // Always dark text for this specific pastel scale
}
