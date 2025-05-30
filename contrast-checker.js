#!/usr/bin/env node

function luminance(r, g, b) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function hexToRgb(hex) {
  hex = hex.replace("#", "");
  if (hex.length === 3)
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  const bigint = parseInt(hex, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function rgbToHex(r, g, b) {
  const toHex = (v) => v.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function contrastRatio(hex1, hex2) {
  const lum1 = luminance(...hexToRgb(hex1));
  const lum2 = luminance(...hexToRgb(hex2));
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  const ratio = (brightest + 0.05) / (darkest + 0.05);
  // Affichage clair dans la fonction, au cas où
  console.log(
    `Contrast calculation between ${hex1} and ${hex2} = ${ratio.toFixed(2)}:1`
  );
  return ratio;
}

function generateColors(step = 51) {
  const colors = [];
  for (let r = 0; r <= 255; r += step) {
    for (let g = 0; g <= 255; g += step) {
      for (let b = 0; b <= 255; b += step) {
        colors.push(rgbToHex(r, g, b));
      }
    }
  }
  return colors;
}

const args = process.argv.slice(2);

if (args.length === 0 || args.length > 2) {
  console.error(
    "❌ Usage:\n - contrast-checker <#hex1> <#hex2>\n - contrast-checker <#hex1>"
  );
  process.exit(1);
}

const threshold = 4.5;

if (args.length === 2) {
  const ratio = contrastRatio(args[0], args[1]);
  console.log(
    `🌗 contrast ratio between ${args[0]} and ${args[1]} = ${ratio.toFixed(
      2
    )}:1`
  );
} else {
  const baseColor = args[0];
  console.log(
    `🔎 Colors with a ratio ≥ ${threshold} par rapport à ${baseColor} :`
  );

  const colors = generateColors();

  colors.forEach((color) => {
    const ratio = contrastRatio(baseColor, color);
    if (ratio >= threshold) {
      console.log(` - ${color} (ratio: ${ratio.toFixed(2)})`);
    }
  });
}
console.log("✅ Finished checking colors.");
process.exit(0);
