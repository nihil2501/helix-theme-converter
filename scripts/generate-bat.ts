/**
 * Generate tmTheme (TextMate theme) from Helix theme for bat
 *
 * Converts themes/helix.toml to themes/bat.tmTheme
 *
 * Usage: bun run scripts/generate-bat.ts
 */

import { type HelixValue, parseHelixTheme } from "./lib/helix";

interface TokenRule {
  name: string;
  scope: string;
  foreground?: string;
  background?: string;
  fontStyle?: string;
}

interface GlobalSettings {
  background?: string;
  foreground?: string;
}

// -----------------------------------------------------------------------------
// Scope Mapping: tmTheme -> Helix
// -----------------------------------------------------------------------------

let SCOPE_MAP = [
  // Comments
  { tmTheme: "comment", helix: "comment", name: "Comments" },
  { tmTheme: "comment.block", helix: "comment.block", name: "Block Comments" },
  { tmTheme: "comment.block.documentation", helix: "comment.block.documentation", name: "Documentation Comments" },
  { tmTheme: "comment.line", helix: "comment.line", name: "Line Comments" },

  // Constants
  { tmTheme: "constant", helix: "constant", name: "Constants" },
  { tmTheme: "constant.character", helix: "constant.character", name: "Characters" },
  { tmTheme: "constant.character.escape", helix: "constant.character.escape", name: "Escape Characters" },
  { tmTheme: "constant.language", helix: "constant.builtin", name: "Built-in Constants" },
  { tmTheme: "constant.numeric", helix: "constant.numeric", name: "Numbers" },
  { tmTheme: "constant.other.symbol", helix: "string.special.symbol", name: "Symbols" },

  // Entities
  { tmTheme: "entity.name.function", helix: "function", name: "Functions" },
  { tmTheme: "entity.name.function.constructor", helix: "constructor", name: "Constructors" },
  { tmTheme: "entity.name.function.macro", helix: "function.macro", name: "Macros" },
  { tmTheme: "entity.name.function.method", helix: "function.method", name: "Methods" },
  { tmTheme: "entity.name.label", helix: "label", name: "Labels" },
  { tmTheme: "entity.name.module", helix: "module", name: "Modules" },
  { tmTheme: "entity.name.namespace", helix: "namespace", name: "Namespaces" },
  { tmTheme: "entity.name.tag", helix: "tag", name: "Tags" },
  { tmTheme: "entity.name.type", helix: "type", name: "Types" },
  { tmTheme: "entity.name.type.enum", helix: "type.enum.variant", name: "Enum Variants" },
  { tmTheme: "entity.other.attribute-name", helix: "attribute", name: "Attributes" },

  // Keywords
  { tmTheme: "keyword", helix: "keyword", name: "Keywords" },
  { tmTheme: "keyword.control", helix: "keyword.control", name: "Control Keywords" },
  { tmTheme: "keyword.control.exception", helix: "keyword.control.exception", name: "Exception Keywords" },
  { tmTheme: "keyword.control.import", helix: "keyword.control.import", name: "Import Keywords" },
  { tmTheme: "keyword.control.loop", helix: "keyword.control.repeat", name: "Loop Keywords" },
  { tmTheme: "keyword.control.return", helix: "keyword.control.return", name: "Return Keywords" },
  { tmTheme: "keyword.operator", helix: "keyword.operator", name: "Operator Keywords" },
  { tmTheme: "keyword.other", helix: "special", name: "Special Keywords" },
  { tmTheme: "keyword.other.directive", helix: "keyword.directive", name: "Directives" },

  // Markup
  { tmTheme: "markup.bold", helix: "markup.bold", name: "Bold" },
  { tmTheme: "markup.changed", helix: "diff.delta", name: "Changed (Diff)" },
  { tmTheme: "markup.deleted", helix: "diff.minus", name: "Deleted (Diff)" },
  { tmTheme: "markup.heading", helix: "markup.heading", name: "Headings" },
  { tmTheme: "markup.heading.1", helix: "markup.heading.1", name: "Heading 1" },
  { tmTheme: "markup.heading.2", helix: "markup.heading.2", name: "Heading 2" },
  { tmTheme: "markup.heading.3", helix: "markup.heading.3", name: "Heading 3" },
  { tmTheme: "markup.heading.4", helix: "markup.heading.4", name: "Heading 4" },
  { tmTheme: "markup.heading.5", helix: "markup.heading.5", name: "Heading 5" },
  { tmTheme: "markup.heading.6", helix: "markup.heading.6", name: "Heading 6" },
  { tmTheme: "markup.inserted", helix: "diff.plus", name: "Inserted (Diff)" },
  { tmTheme: "markup.italic", helix: "markup.italic", name: "Italic" },
  { tmTheme: "markup.link", helix: "markup.link", name: "Links" },
  { tmTheme: "markup.link.url", helix: "markup.link.url", name: "Link URLs" },
  { tmTheme: "markup.list", helix: "markup.list", name: "Lists" },
  { tmTheme: "markup.list.numbered", helix: "markup.list.numbered", name: "Numbered Lists" },
  { tmTheme: "markup.list.unnumbered", helix: "markup.list.unnumbered", name: "Bullet Lists" },
  { tmTheme: "markup.quote", helix: "markup.quote", name: "Quotes" },
  { tmTheme: "markup.raw", helix: "markup.raw", name: "Raw/Code" },
  { tmTheme: "markup.raw.block", helix: "markup.raw.block", name: "Code Blocks" },
  { tmTheme: "markup.raw.inline", helix: "markup.raw.inline", name: "Inline Code" },
  { tmTheme: "markup.strikethrough", helix: "markup.strikethrough", name: "Strikethrough" },

  // Operators & Punctuation
  { tmTheme: "operator", helix: "operator", name: "Operators" },
  { tmTheme: "punctuation", helix: "punctuation", name: "Punctuation" },
  { tmTheme: "punctuation.bracket", helix: "punctuation.bracket", name: "Brackets" },
  { tmTheme: "punctuation.separator", helix: "punctuation.delimiter", name: "Separators" },

  // Storage
  { tmTheme: "storage.type.function", helix: "keyword.function", name: "Function Keywords" },

  // Strings
  { tmTheme: "string", helix: "string", name: "Strings" },
  { tmTheme: "string.other", helix: "string.special", name: "Special Strings" },
  { tmTheme: "string.other.link", helix: "string.special.url", name: "URLs" },
  { tmTheme: "string.regexp", helix: "string.regexp", name: "Regular Expressions" },

  // Support
  { tmTheme: "support.function", helix: "function.builtin", name: "Built-in Functions" },
  { tmTheme: "support.type", helix: "type.builtin", name: "Built-in Types" },

  // Variables
  { tmTheme: "variable", helix: "variable", name: "Variables" },
  { tmTheme: "variable.function", helix: "variable.function", name: "Function References" },
  { tmTheme: "variable.language", helix: "variable.builtin", name: "Built-in Variables" },
  { tmTheme: "variable.other.member", helix: "variable.other.member", name: "Member Variables" },
  { tmTheme: "variable.parameter", helix: "variable.parameter", name: "Parameters" },
];

// Sort by tmTheme, then helix, then name for stable output
SCOPE_MAP = SCOPE_MAP.sort((a, b) =>
  a.tmTheme.localeCompare(b.tmTheme) ||
  a.helix.localeCompare(b.helix) ||
  a.name.localeCompare(b.name)
);

// Deduplicate by tmTheme (first occurrence wins)
SCOPE_MAP = SCOPE_MAP.filter(
  (item, index, arr) => arr.findIndex((x) => x.tmTheme === item.tmTheme) === index
);

// Helix modifier -> tmTheme fontStyle
const MODIFIER_MAP: Record<string, string> = {
  bold: "bold",
  italic: "italic",
  underline: "underline",
  crossed_out: "strikethrough",
};

// -----------------------------------------------------------------------------
// Color Resolution
// -----------------------------------------------------------------------------

function resolveColor(
  value: string | undefined,
  palette: Record<string, string>
): string | undefined {
  if (!value) return undefined;

  // Already a hex color
  if (value.startsWith("#")) {
    return value.toUpperCase();
  }

  // Palette reference
  const hex = palette[value];
  if (hex) {
    return hex.toUpperCase();
  }

  console.warn(`Unknown color reference: ${value}`);
  return undefined;
}

// -----------------------------------------------------------------------------
// Style Extraction
// -----------------------------------------------------------------------------

function extractStyle(
  value: HelixValue,
  palette: Record<string, string>
): { fg?: string; bg?: string; fontStyle?: string } {
  // Simple string value (just a color reference for fg)
  if (typeof value === "string") {
    return { fg: resolveColor(value, palette) };
  }

  // Object with fg, bg, modifiers
  const style: { fg?: string; bg?: string; fontStyle?: string } = {};

  if (value.fg) {
    style.fg = resolveColor(value.fg, palette);
  }

  if (value.bg) {
    style.bg = resolveColor(value.bg, palette);
  }

  if (value.modifiers && value.modifiers.length > 0) {
    const fontStyles = value.modifiers
      .map((m) => MODIFIER_MAP[m])
      .filter(Boolean);
    if (fontStyles.length > 0) {
      style.fontStyle = fontStyles.join(" ");
    }
  }

  return style;
}

// -----------------------------------------------------------------------------
// Global Settings Extraction
// -----------------------------------------------------------------------------

function extractGlobalSettings(
  scopes: Record<string, HelixValue>,
  palette: Record<string, string>
): GlobalSettings {
  const settings: GlobalSettings = {};

  // ui.background -> background
  const uiBg = scopes["ui.background"];
  if (uiBg) {
    const style = extractStyle(uiBg, palette);
    if (style.bg) settings.background = style.bg;
  }

  // ui.text -> foreground
  const uiText = scopes["ui.text"];
  if (uiText) {
    const style = extractStyle(uiText, palette);
    if (style.fg) settings.foreground = style.fg;
  }

  return settings;
}

// -----------------------------------------------------------------------------
// Token Rules Generation
// -----------------------------------------------------------------------------

function generateTokenRules(
  scopes: Record<string, HelixValue>,
  palette: Record<string, string>
): TokenRule[] {
  const rules: TokenRule[] = [];

  for (const { tmTheme, helix, name } of SCOPE_MAP) {
    const value = scopes[helix];
    if (!value) continue;

    const style = extractStyle(value, palette);
    if (!style.fg && !style.bg && !style.fontStyle) continue;

    rules.push({
      name,
      scope: tmTheme,
      foreground: style.fg,
      background: style.bg,
      fontStyle: style.fontStyle,
    });
  }

  return rules;
}

// -----------------------------------------------------------------------------
// XML Generation
// -----------------------------------------------------------------------------

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateTmTheme(
  globalSettings: GlobalSettings,
  tokenRules: TokenRule[]
): string {
  const lines: string[] = [];

  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push(
    '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">'
  );
  lines.push('<plist version="1.0">');
  lines.push("<dict>");

  // Theme metadata
  lines.push("\t<key>author</key>");
  lines.push("\t<string>Pop Dark Theme</string>");

  lines.push("\t<key>name</key>");
  lines.push("\t<string>Pop Dark</string>");

  lines.push("\t<key>colorSpaceName</key>");
  lines.push("\t<string>sRGB</string>");

  lines.push("\t<key>semanticClass</key>");
  lines.push("\t<string>theme.dark.pop-dark</string>");

  // Settings array
  lines.push("\t<key>settings</key>");
  lines.push("\t<array>");

  // Global settings (first element)
  lines.push("\t\t<dict>");
  lines.push("\t\t\t<key>settings</key>");
  lines.push("\t\t\t<dict>");

  if (globalSettings.background) {
    lines.push("\t\t\t\t<key>background</key>");
    lines.push(`\t\t\t\t<string>${globalSettings.background}</string>`);
  }
  if (globalSettings.foreground) {
    lines.push("\t\t\t\t<key>foreground</key>");
    lines.push(`\t\t\t\t<string>${globalSettings.foreground}</string>`);
  }

  lines.push("\t\t\t</dict>");
  lines.push("\t\t</dict>");

  // Token rules
  for (const rule of tokenRules) {
    lines.push("\t\t<dict>");

    lines.push("\t\t\t<key>name</key>");
    lines.push(`\t\t\t<string>${escapeXml(rule.name)}</string>`);

    lines.push("\t\t\t<key>scope</key>");
    lines.push(`\t\t\t<string>${escapeXml(rule.scope)}</string>`);

    lines.push("\t\t\t<key>settings</key>");
    lines.push("\t\t\t<dict>");

    if (rule.foreground) {
      lines.push("\t\t\t\t<key>foreground</key>");
      lines.push(`\t\t\t\t<string>${rule.foreground}</string>`);
    }
    if (rule.background) {
      lines.push("\t\t\t\t<key>background</key>");
      lines.push(`\t\t\t\t<string>${rule.background}</string>`);
    }
    if (rule.fontStyle) {
      lines.push("\t\t\t\t<key>fontStyle</key>");
      lines.push(`\t\t\t\t<string>${rule.fontStyle}</string>`);
    }

    lines.push("\t\t\t</dict>");
    lines.push("\t\t</dict>");
  }

  lines.push("\t</array>");
  lines.push("</dict>");
  lines.push("</plist>");

  return lines.join("\n");
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  const inputPath = "themes/helix.toml";
  const outputPath = "themes/bat.tmTheme";

  console.log(`Reading ${inputPath}...`);
  const tomlContent = await Bun.file(inputPath).text();

  console.log("Parsing Helix theme...");
  const { scopes, palette } = parseHelixTheme(tomlContent);

  console.log(`Found ${Object.keys(palette).length} palette colors`);

  console.log("Extracting global settings...");
  const globalSettings = extractGlobalSettings(scopes, palette);

  console.log("Generating token rules...");
  const tokenRules = generateTokenRules(scopes, palette);
  console.log(`Generated ${tokenRules.length} token rules`);

  console.log("Building tmTheme XML...");
  const xml = generateTmTheme(globalSettings, tokenRules);

  console.log(`Writing ${outputPath}...`);
  await Bun.write(outputPath, xml);

  console.log("Done!");
}

main().catch(console.error);
