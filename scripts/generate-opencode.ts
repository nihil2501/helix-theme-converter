/**
 * Generate opencode theme JSON from Helix theme
 *
 * Converts themes/helix.toml to themes/opencode.json
 *
 * Usage: bun run scripts/generate-opencode.ts
 */

import { type HelixValue, parseHelixTheme } from "./lib/helix";

// -----------------------------------------------------------------------------
// Theme Mapping: opencode -> Helix
// -----------------------------------------------------------------------------

const THEME_MAP_INIT = [
  // UI Semantic
  { opencode: "accent", helix: { scope: "ui.cursor", prop: "bg" } },
  { opencode: "error", helix: { scope: "error", prop: "fg" } },
  { opencode: "info", helix: { scope: "info", prop: "fg" } },
  { opencode: "primary", helix: { scope: "ui.selection", prop: "bg" } },
  { opencode: "secondary", helix: null },
  { opencode: "success", helix: null },
  { opencode: "warning", helix: { scope: "warning", prop: "fg" } },

  // Text
  { opencode: "selectedListItemText", helix: { scope: "ui.background", prop: "bg" } },
  { opencode: "text", helix: { scope: "ui.text", prop: "fg" } },
  { opencode: "textMuted", helix: { scope: "comment", prop: "fg" } },

  // Background
  { opencode: "background", helix: { scope: "ui.background", prop: "bg" } },
  { opencode: "backgroundElement", helix: { scope: "ui.cursorline", prop: "bg" } },
  { opencode: "backgroundMenu", helix: { scope: "ui.help", prop: "bg" } },
  { opencode: "backgroundPanel", helix: { scope: "ui.window", prop: "bg" } },

  // Border
  { opencode: "border", helix: { scope: "ui.window", prop: "fg" } },
  { opencode: "borderActive", helix: { scope: "ui.selection", prop: "bg" } },
  { opencode: "borderSubtle", helix: { scope: "ui.virtual", prop: "fg" } },

  // Diff
  { opencode: "diffAdded", helix: { scope: "diff.plus", prop: "fg" } },
  { opencode: "diffAddedBg", helix: null },
  { opencode: "diffAddedLineNumberBg", helix: null },
  { opencode: "diffContext", helix: { scope: "diff.delta", prop: "fg" } },
  { opencode: "diffContextBg", helix: { scope: "ui.background", prop: "bg" } },
  { opencode: "diffHighlightAdded", helix: { scope: "diff.plus", prop: "fg" } },
  { opencode: "diffHighlightRemoved", helix: { scope: "diff.minus", prop: "fg" } },
  { opencode: "diffHunkHeader", helix: { scope: "diff.delta", prop: "fg" } },
  { opencode: "diffLineNumber", helix: { scope: "ui.linenr", prop: "fg" } },
  { opencode: "diffRemoved", helix: { scope: "diff.minus", prop: "fg" } },
  { opencode: "diffRemovedBg", helix: null },
  { opencode: "diffRemovedLineNumberBg", helix: null },

  // Markdown
  { opencode: "markdownBlockQuote", helix: { scope: "markup.quote", prop: "fg" } },
  { opencode: "markdownCode", helix: { scope: "markup.raw.inline", prop: "fg" } },
  { opencode: "markdownCodeBlock", helix: { scope: "markup.raw.block", prop: "fg" } },
  { opencode: "markdownEmph", helix: null },
  { opencode: "markdownHeading", helix: { scope: "markup.heading", prop: "fg" } },
  { opencode: "markdownHorizontalRule", helix: { scope: "ui.virtual", prop: "fg" } },
  { opencode: "markdownImage", helix: { scope: "markup.link", prop: "fg" } },
  { opencode: "markdownImageText", helix: { scope: "markup.link.text", prop: "fg" } },
  { opencode: "markdownLink", helix: { scope: "markup.link", prop: "fg" } },
  { opencode: "markdownLinkText", helix: { scope: "markup.link.text", prop: "fg" } },
  { opencode: "markdownListEnumeration", helix: { scope: "markup.list", prop: "fg" } },
  { opencode: "markdownListItem", helix: { scope: "markup.list", prop: "fg" } },
  { opencode: "markdownStrong", helix: null },
  { opencode: "markdownText", helix: { scope: "ui.text", prop: "fg" } },

  // Syntax
  { opencode: "syntaxComment", helix: { scope: "comment", prop: "fg" } },
  { opencode: "syntaxFunction", helix: { scope: "function", prop: "fg" } },
  { opencode: "syntaxKeyword", helix: { scope: "keyword", prop: "fg" } },
  { opencode: "syntaxNumber", helix: { scope: "constant.numeric", prop: "fg" } },
  { opencode: "syntaxOperator", helix: { scope: "operator", prop: "fg" } },
  { opencode: "syntaxPunctuation", helix: { scope: "punctuation", prop: "fg" } },
  { opencode: "syntaxString", helix: { scope: "string", prop: "fg" } },
  { opencode: "syntaxType", helix: { scope: "type", prop: "fg" } },
  { opencode: "syntaxVariable", helix: { scope: "variable", prop: "fg" } },
] as const;

// Sort by opencode, then helix.scope, then helix.prop for stable output
let THEME_MAP = [...THEME_MAP_INIT].sort((a, b) =>
  a.opencode.localeCompare(b.opencode) ||
  (a.helix?.scope ?? "").localeCompare(b.helix?.scope ?? "") ||
  (a.helix?.prop ?? "").localeCompare(b.helix?.prop ?? "")
);

// Deduplicate by opencode (first occurrence wins)
THEME_MAP = THEME_MAP.filter(
  (item, index, arr) => arr.findIndex((x) => x.opencode === item.opencode) === index
);

// -----------------------------------------------------------------------------
// Value Extraction
// -----------------------------------------------------------------------------

function getHelixValue(
  scopes: Record<string, HelixValue>,
  scope: string,
  prop: "fg" | "bg"
): string | undefined {
  const value = scopes[scope];
  if (!value) return undefined;

  // Simple string value (color reference for fg)
  if (typeof value === "string") {
    return prop === "fg" ? value : undefined;
  }

  // Object with fg/bg
  return value[prop];
}

// -----------------------------------------------------------------------------
// Theme Building
// -----------------------------------------------------------------------------

function buildDefs(palette: Record<string, string>): Record<string, string> {
  const defs: Record<string, string> = {};
  const sortedKeys = Object.keys(palette).sort((a, b) => a.localeCompare(b));

  for (const key of sortedKeys) {
    defs[key] = palette[key]!;
  }

  return defs;
}

function buildTheme(
  scopes: Record<string, HelixValue>,
  palette: Record<string, string>
): Record<string, string> {
  const theme: Record<string, string> = {};

  for (const { opencode, helix } of THEME_MAP) {
    if (!helix) {
      theme[opencode] = "none";
      continue;
    }

    const value = getHelixValue(scopes, helix.scope, helix.prop as "fg" | "bg");
    if (value) {
      // Validate palette reference
      if (!value.startsWith("#") && !palette[value]) {
        console.warn(
          `Warning: ${opencode} references unknown palette color: ${value}`
        );
      }
      theme[opencode] = value;
    } else {
      theme[opencode] = "none";
    }
  }

  return theme;
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  const inputPath = "themes/helix.toml";
  const outputPath = "themes/opencode.json";

  console.log(`Reading ${inputPath}...`);
  const tomlContent = await Bun.file(inputPath).text();

  console.log("Parsing Helix theme...");
  const { scopes, palette } = parseHelixTheme(tomlContent);

  console.log(`Found ${Object.keys(palette).length} palette colors`);

  console.log("Building defs...");
  const defs = buildDefs(palette);

  console.log("Building theme...");
  const theme = buildTheme(scopes, palette);

  const mappedCount = Object.values(theme).filter((v) => v !== "none").length;
  const noneCount = Object.values(theme).filter((v) => v === "none").length;
  console.log(`Mapped ${mappedCount} theme fields, ${noneCount} set to "none"`);

  const output = {
    $schema: "https://opencode.ai/theme.json",
    defs,
    theme,
  };

  console.log(`Writing ${outputPath}...`);
  await Bun.write(outputPath, JSON.stringify(output, null, 2) + "\n");

  console.log("Done!");
}

main().catch(console.error);
