/**
 * Generate tmTheme (TextMate theme) from Helix theme for bat
 *
 * Converts themes/helix.toml to themes/bat.tmTheme
 *
 * Usage: bun run scripts/generate-bat.ts
 */

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface HelixStyle {
  fg?: string;
  bg?: string;
  modifiers?: string[];
  underline?: { color?: string; style?: string };
}

type HelixValue = string | HelixStyle;

interface HelixTheme {
  palette: Record<string, string>;
  [scope: string]: HelixValue | Record<string, string>;
}

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
  caret?: string;
  selection?: string;
  lineHighlight?: string;
  gutterForeground?: string;
}

// -----------------------------------------------------------------------------
// Scope Mapping: Helix -> tmTheme
// -----------------------------------------------------------------------------

// Direct mappings (helix scope === tmTheme scope)
const DIRECT_SCOPES = [
  "comment",
  "comment.line",
  "comment.block",
  "comment.block.documentation",
  "string",
  "string.regexp",
  "constant",
  "constant.numeric",
  "constant.character",
  "constant.character.escape",
  "variable",
  "variable.parameter",
  "keyword",
  "keyword.control",
  "keyword.operator",
  "operator",
  "punctuation",
  "markup.heading",
  "markup.bold",
  "markup.italic",
  "markup.strikethrough",
  "markup.quote",
  "markup.raw",
  "markup.list",
] as const;

// Translated mappings: helix scope -> tmTheme scope
const TRANSLATED_SCOPES: Record<string, string> = {
  // Functions
  function: "entity.name.function",
  "function.method": "entity.name.function.method",
  "function.macro": "entity.name.function.macro",
  "function.builtin": "support.function",
  constructor: "entity.name.function.constructor",

  // Types
  type: "entity.name.type",
  "type.builtin": "support.type",
  "type.enum.variant": "entity.name.type.enum",

  // Tags/Attributes
  tag: "entity.name.tag",
  attribute: "entity.other.attribute-name",

  // Namespaces/Modules
  namespace: "entity.name.namespace",
  module: "entity.name.module",
  label: "entity.name.label",

  // Variables
  "variable.builtin": "variable.language",
  "variable.other.member": "variable.other.member",
  "variable.function": "variable.function",

  // Constants
  "constant.builtin": "constant.language",
  "string.special.symbol": "constant.other.symbol",
  "string.special": "string.other",
  "string.special.url": "string.other.link",

  // Keywords
  "keyword.function": "storage.type.function",
  "keyword.directive": "keyword.other.directive",
  "keyword.control.repeat": "keyword.control.loop",
  "keyword.control.import": "keyword.control.import",
  "keyword.control.return": "keyword.control.return",
  "keyword.control.exception": "keyword.control.exception",
  special: "keyword.other",

  // Punctuation
  "punctuation.delimiter": "punctuation.separator",
  "punctuation.bracket": "punctuation.bracket",

  // Markup extensions
  "markup.heading.1": "markup.heading.1",
  "markup.heading.2": "markup.heading.2",
  "markup.heading.3": "markup.heading.3",
  "markup.heading.4": "markup.heading.4",
  "markup.heading.5": "markup.heading.5",
  "markup.heading.6": "markup.heading.6",
  "markup.link": "markup.link",
  "markup.link.url": "markup.link.url",
  "markup.list.numbered": "markup.list.numbered",
  "markup.list.unnumbered": "markup.list.unnumbered",
  "markup.raw.inline": "markup.raw.inline",
  "markup.raw.block": "markup.raw.block",

  // Diff
  "diff.plus": "markup.inserted",
  "diff.minus": "markup.deleted",
  "diff.delta": "markup.changed",
};

// Helix modifier -> tmTheme fontStyle
const MODIFIER_MAP: Record<string, string> = {
  bold: "bold",
  italic: "italic",
  underline: "underline",
  crossed_out: "strikethrough",
};

// Human-readable names for scopes
const SCOPE_NAMES: Record<string, string> = {
  comment: "Comments",
  "comment.line": "Line Comments",
  "comment.block": "Block Comments",
  "comment.block.documentation": "Documentation Comments",
  string: "Strings",
  "string.regexp": "Regular Expressions",
  constant: "Constants",
  "constant.numeric": "Numbers",
  "constant.character": "Characters",
  "constant.character.escape": "Escape Characters",
  "constant.language": "Built-in Constants",
  "constant.other.symbol": "Symbols",
  variable: "Variables",
  "variable.parameter": "Parameters",
  "variable.language": "Built-in Variables",
  "variable.other.member": "Member Variables",
  "variable.function": "Function References",
  keyword: "Keywords",
  "keyword.control": "Control Keywords",
  "keyword.control.loop": "Loop Keywords",
  "keyword.control.import": "Import Keywords",
  "keyword.control.return": "Return Keywords",
  "keyword.control.exception": "Exception Keywords",
  "keyword.operator": "Operator Keywords",
  "keyword.other": "Special Keywords",
  "keyword.other.directive": "Directives",
  operator: "Operators",
  punctuation: "Punctuation",
  "punctuation.separator": "Separators",
  "punctuation.bracket": "Brackets",
  "entity.name.function": "Functions",
  "entity.name.function.method": "Methods",
  "entity.name.function.macro": "Macros",
  "entity.name.function.constructor": "Constructors",
  "support.function": "Built-in Functions",
  "entity.name.type": "Types",
  "support.type": "Built-in Types",
  "entity.name.type.enum": "Enum Variants",
  "entity.name.tag": "Tags",
  "entity.other.attribute-name": "Attributes",
  "entity.name.namespace": "Namespaces",
  "entity.name.module": "Modules",
  "entity.name.label": "Labels",
  "storage.type.function": "Function Keywords",
  "string.other": "Special Strings",
  "string.other.link": "URLs",
  "markup.heading": "Headings",
  "markup.heading.1": "Heading 1",
  "markup.heading.2": "Heading 2",
  "markup.heading.3": "Heading 3",
  "markup.heading.4": "Heading 4",
  "markup.heading.5": "Heading 5",
  "markup.heading.6": "Heading 6",
  "markup.bold": "Bold",
  "markup.italic": "Italic",
  "markup.strikethrough": "Strikethrough",
  "markup.quote": "Quotes",
  "markup.raw": "Raw/Code",
  "markup.raw.inline": "Inline Code",
  "markup.raw.block": "Code Blocks",
  "markup.list": "Lists",
  "markup.list.numbered": "Numbered Lists",
  "markup.list.unnumbered": "Bullet Lists",
  "markup.link": "Links",
  "markup.link.url": "Link URLs",
  "markup.inserted": "Inserted (Diff)",
  "markup.deleted": "Deleted (Diff)",
  "markup.changed": "Changed (Diff)",
};

// -----------------------------------------------------------------------------
// Parsing
// -----------------------------------------------------------------------------

function parseHelixTheme(tomlContent: string): HelixTheme {
  return Bun.TOML.parse(tomlContent) as HelixTheme;
}

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

  // ui.background -> background (use bg)
  const uiBg = theme["ui.background"] as HelixStyle | undefined;
  if (uiBg?.bg) {
    settings.background = resolveColor(uiBg.bg, palette);
  }

  // ui.text -> foreground (use fg)
  const uiText = theme["ui.text"] as HelixStyle | undefined;
  if (uiText?.fg) {
    settings.foreground = resolveColor(uiText.fg, palette);
  }

  // ui.cursor -> caret (use bg)
  const uiCursor = theme["ui.cursor"] as HelixStyle | undefined;
  if (uiCursor?.bg) {
    settings.caret = resolveColor(uiCursor.bg, palette);
  }

  // ui.selection -> selection (use bg)
  const uiSelection = theme["ui.selection"] as HelixStyle | undefined;
  if (uiSelection?.bg) {
    settings.selection = resolveColor(uiSelection.bg, palette);
  }

  // ui.cursorline -> lineHighlight (use bg)
  const uiCursorline = theme["ui.cursorline"] as HelixStyle | undefined;
  if (uiCursorline?.bg) {
    settings.lineHighlight = resolveColor(uiCursorline.bg, palette);
  }

  // ui.linenr -> gutterForeground (use fg)
  const uiLinenr = theme["ui.linenr"] as HelixStyle | undefined;
  if (uiLinenr?.fg) {
    settings.gutterForeground = resolveColor(uiLinenr.fg, palette);
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

  // Helper to add a rule
  const addRule = (helixScope: string, tmScope: string) => {
    if (processedScopes.has(tmScope)) return;

    const value = theme[helixScope];
    if (!value || typeof value === "object" && "palette" in value) return;

    const style = extractStyle(value as HelixValue, palette);
    if (!style.fg && !style.bg && !style.fontStyle) return;

    processedScopes.add(tmScope);
    rules.push({
      name: SCOPE_NAMES[tmScope] || tmScope,
      scope: tmScope,
      foreground: style.fg,
      background: style.bg,
      fontStyle: style.fontStyle,
    });
  };

  // Process direct mappings
  for (const scope of DIRECT_SCOPES) {
    addRule(scope, scope);
  }

  // Process translated mappings
  for (const [helixScope, tmScope] of Object.entries(TRANSLATED_SCOPES)) {
    addRule(helixScope, tmScope);
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
  if (globalSettings.caret) {
    lines.push("\t\t\t\t<key>caret</key>");
    lines.push(`\t\t\t\t<string>${globalSettings.caret}</string>`);
  }
  if (globalSettings.selection) {
    lines.push("\t\t\t\t<key>selection</key>");
    lines.push(`\t\t\t\t<string>${globalSettings.selection}</string>`);
  }
  if (globalSettings.lineHighlight) {
    lines.push("\t\t\t\t<key>lineHighlight</key>");
    lines.push(`\t\t\t\t<string>${globalSettings.lineHighlight}</string>`);
  }
  if (globalSettings.gutterForeground) {
    lines.push("\t\t\t\t<key>gutterForeground</key>");
    lines.push(`\t\t\t\t<string>${globalSettings.gutterForeground}</string>`);
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
