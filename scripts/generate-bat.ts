/**
 * Generate tmTheme (TextMate theme) from Helix theme for bat
 *
 * Converts themes/helix.toml to themes/bat.tmTheme
 *
 * Usage: bun run scripts/generate-bat.ts
 */

import { type HelixTheme, type HelixValue, parseHelixTheme } from "./lib/helix";

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
// Scope Mapping: Helix -> tmTheme
// -----------------------------------------------------------------------------

// Helix scope -> { tmTheme scope, human-readable name }
const SCOPE_MAP: Record<string, { scope: string; name: string }> = {
  // Comments
  "comment": { scope: "comment", name: "Comments" },
  "comment.line": { scope: "comment.line", name: "Line Comments" },
  "comment.block": { scope: "comment.block", name: "Block Comments" },
  "comment.block.documentation": { scope: "comment.block.documentation", name: "Documentation Comments" },

  // Strings
  "string": { scope: "string", name: "Strings" },
  "string.regexp": { scope: "string.regexp", name: "Regular Expressions" },
  "string.special": { scope: "string.other", name: "Special Strings" },
  "string.special.symbol": { scope: "constant.other.symbol", name: "Symbols" },
  "string.special.url": { scope: "string.other.link", name: "URLs" },

  // Constants
  "constant": { scope: "constant", name: "Constants" },
  "constant.numeric": { scope: "constant.numeric", name: "Numbers" },
  "constant.character": { scope: "constant.character", name: "Characters" },
  "constant.character.escape": { scope: "constant.character.escape", name: "Escape Characters" },
  "constant.builtin": { scope: "constant.language", name: "Built-in Constants" },

  // Variables
  "variable": { scope: "variable", name: "Variables" },
  "variable.parameter": { scope: "variable.parameter", name: "Parameters" },
  "variable.builtin": { scope: "variable.language", name: "Built-in Variables" },
  "variable.other.member": { scope: "variable.other.member", name: "Member Variables" },
  "variable.function": { scope: "variable.function", name: "Function References" },

  // Keywords
  "keyword": { scope: "keyword", name: "Keywords" },
  "keyword.control": { scope: "keyword.control", name: "Control Keywords" },
  "keyword.control.repeat": { scope: "keyword.control.loop", name: "Loop Keywords" },
  "keyword.control.import": { scope: "keyword.control.import", name: "Import Keywords" },
  "keyword.control.return": { scope: "keyword.control.return", name: "Return Keywords" },
  "keyword.control.exception": { scope: "keyword.control.exception", name: "Exception Keywords" },
  "keyword.operator": { scope: "keyword.operator", name: "Operator Keywords" },
  "keyword.function": { scope: "storage.type.function", name: "Function Keywords" },
  "keyword.directive": { scope: "keyword.other.directive", name: "Directives" },

  // Operators & Punctuation
  "operator": { scope: "operator", name: "Operators" },
  "punctuation": { scope: "punctuation", name: "Punctuation" },
  "punctuation.delimiter": { scope: "punctuation.separator", name: "Separators" },
  "punctuation.bracket": { scope: "punctuation.bracket", name: "Brackets" },
  "special": { scope: "keyword.other", name: "Special Keywords" },

  // Functions
  "function": { scope: "entity.name.function", name: "Functions" },
  "function.method": { scope: "entity.name.function.method", name: "Methods" },
  "function.macro": { scope: "entity.name.function.macro", name: "Macros" },
  "function.builtin": { scope: "support.function", name: "Built-in Functions" },
  "constructor": { scope: "entity.name.function.constructor", name: "Constructors" },

  // Types
  "type": { scope: "entity.name.type", name: "Types" },
  "type.builtin": { scope: "support.type", name: "Built-in Types" },
  "type.enum.variant": { scope: "entity.name.type.enum", name: "Enum Variants" },

  // Tags/Attributes/Namespaces
  "tag": { scope: "entity.name.tag", name: "Tags" },
  "attribute": { scope: "entity.other.attribute-name", name: "Attributes" },
  "namespace": { scope: "entity.name.namespace", name: "Namespaces" },
  "module": { scope: "entity.name.module", name: "Modules" },
  "label": { scope: "entity.name.label", name: "Labels" },

  // Markup
  "markup.heading": { scope: "markup.heading", name: "Headings" },
  "markup.heading.1": { scope: "markup.heading.1", name: "Heading 1" },
  "markup.heading.2": { scope: "markup.heading.2", name: "Heading 2" },
  "markup.heading.3": { scope: "markup.heading.3", name: "Heading 3" },
  "markup.heading.4": { scope: "markup.heading.4", name: "Heading 4" },
  "markup.heading.5": { scope: "markup.heading.5", name: "Heading 5" },
  "markup.heading.6": { scope: "markup.heading.6", name: "Heading 6" },
  "markup.bold": { scope: "markup.bold", name: "Bold" },
  "markup.italic": { scope: "markup.italic", name: "Italic" },
  "markup.strikethrough": { scope: "markup.strikethrough", name: "Strikethrough" },
  "markup.quote": { scope: "markup.quote", name: "Quotes" },
  "markup.raw": { scope: "markup.raw", name: "Raw/Code" },
  "markup.raw.inline": { scope: "markup.raw.inline", name: "Inline Code" },
  "markup.raw.block": { scope: "markup.raw.block", name: "Code Blocks" },
  "markup.list": { scope: "markup.list", name: "Lists" },
  "markup.list.numbered": { scope: "markup.list.numbered", name: "Numbered Lists" },
  "markup.list.unnumbered": { scope: "markup.list.unnumbered", name: "Bullet Lists" },
  "markup.link": { scope: "markup.link", name: "Links" },
  "markup.link.url": { scope: "markup.link.url", name: "Link URLs" },

  // Diff
  "diff.plus": { scope: "markup.inserted", name: "Inserted (Diff)" },
  "diff.minus": { scope: "markup.deleted", name: "Deleted (Diff)" },
  "diff.delta": { scope: "markup.changed", name: "Changed (Diff)" },
};

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
  theme: HelixTheme,
  palette: Record<string, string>
): GlobalSettings {
  const settings: GlobalSettings = {};

  // ui.background -> background
  const uiBg = theme["ui.background"];
  if (uiBg) {
    const style = extractStyle(uiBg, palette);
    if (style.bg) settings.background = style.bg;
  }

  // ui.text -> foreground
  const uiText = theme["ui.text"];
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
  theme: HelixTheme,
  palette: Record<string, string>
): TokenRule[] {
  const rules: TokenRule[] = [];
  const processedScopes = new Set<string>();

  for (const [helixScope, { scope: tmScope, name }] of Object.entries(SCOPE_MAP)) {
    if (processedScopes.has(tmScope)) continue;

    const value = theme[helixScope];
    if (!value || (typeof value === "object" && "palette" in value)) continue;

    const style = extractStyle(value as HelixValue, palette);
    if (!style.fg && !style.bg && !style.fontStyle) continue;

    processedScopes.add(tmScope);
    rules.push({
      name,
      scope: tmScope,
      foreground: style.fg,
      background: style.bg,
      fontStyle: style.fontStyle,
    });
  }

  // Sort by scope for stable output
  return rules.sort((a, b) => a.scope.localeCompare(b.scope));
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
  const theme = parseHelixTheme(tomlContent);
  const palette = theme.palette;

  console.log(`Found ${Object.keys(palette).length} palette colors`);

  console.log("Extracting global settings...");
  const globalSettings = extractGlobalSettings(theme, palette);

  console.log("Generating token rules...");
  const tokenRules = generateTokenRules(theme, palette);
  console.log(`Generated ${tokenRules.length} token rules`);

  console.log("Building tmTheme XML...");
  const xml = generateTmTheme(globalSettings, tokenRules);

  console.log(`Writing ${outputPath}...`);
  await Bun.write(outputPath, xml);

  console.log("Done!");
}

main().catch(console.error);
