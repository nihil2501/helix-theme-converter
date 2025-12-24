/**
 * Generate opencode theme JSON from Helix theme
 *
 * Converts themes/helix.toml to themes/opencode.json
 *
 * Usage: bun run scripts/generate-opencode.ts
 */

import { type HelixTheme, parseHelixTheme } from "./lib/helix";

interface OpenCodeTheme {
  $schema: string;
  defs: Record<string, string>;
  theme: Record<string, string>;
}

interface ThemeMapping {
  scope: string;
  prop: "fg" | "bg";
}

// -----------------------------------------------------------------------------
// Theme Mapping: opencode field -> helix source (or null for "none")
// -----------------------------------------------------------------------------

const THEME_MAP: Record<string, ThemeMapping | null> = {
  // UI Semantic (7)
  primary: { scope: "ui.selection", prop: "bg" },
  secondary: null,
  accent: { scope: "ui.cursor", prop: "bg" },
  error: { scope: "error", prop: "fg" },
  warning: { scope: "warning", prop: "fg" },
  success: null,
  info: { scope: "info", prop: "fg" },

  // Text (3)
  text: { scope: "ui.text", prop: "fg" },
  textMuted: { scope: "comment", prop: "fg" },
  selectedListItemText: { scope: "ui.background", prop: "bg" },

  // Background (4)
  background: { scope: "ui.background", prop: "bg" },
  backgroundPanel: { scope: "ui.window", prop: "bg" },
  backgroundElement: { scope: "ui.cursorline", prop: "bg" },
  backgroundMenu: { scope: "ui.help", prop: "bg" },

  // Border (3)
  border: { scope: "ui.window", prop: "fg" },
  borderActive: { scope: "ui.selection", prop: "bg" },
  borderSubtle: { scope: "ui.virtual", prop: "fg" },

  // Diff (12)
  diffAdded: { scope: "diff.plus", prop: "fg" },
  diffRemoved: { scope: "diff.minus", prop: "fg" },
  diffContext: { scope: "diff.delta", prop: "fg" },
  diffHunkHeader: { scope: "diff.delta", prop: "fg" },
  diffHighlightAdded: { scope: "diff.plus", prop: "fg" },
  diffHighlightRemoved: { scope: "diff.minus", prop: "fg" },
  diffAddedBg: null,
  diffRemovedBg: null,
  diffContextBg: { scope: "ui.background", prop: "bg" },
  diffLineNumber: { scope: "ui.linenr", prop: "fg" },
  diffAddedLineNumberBg: null,
  diffRemovedLineNumberBg: null,

  // Markdown (14)
  markdownText: { scope: "ui.text", prop: "fg" },
  markdownHeading: { scope: "markup.heading", prop: "fg" },
  markdownLink: { scope: "markup.link", prop: "fg" },
  markdownLinkText: { scope: "markup.link.text", prop: "fg" },
  markdownCode: { scope: "markup.raw.inline", prop: "fg" },
  markdownBlockQuote: { scope: "markup.quote", prop: "fg" },
  markdownEmph: null,
  markdownStrong: null,
  markdownHorizontalRule: { scope: "ui.virtual", prop: "fg" },
  markdownListItem: { scope: "markup.list", prop: "fg" },
  markdownListEnumeration: { scope: "markup.list", prop: "fg" },
  markdownImage: { scope: "markup.link", prop: "fg" },
  markdownImageText: { scope: "markup.link.text", prop: "fg" },
  markdownCodeBlock: { scope: "markup.raw.block", prop: "fg" },

  // Syntax (9)
  syntaxComment: { scope: "comment", prop: "fg" },
  syntaxKeyword: { scope: "keyword", prop: "fg" },
  syntaxFunction: { scope: "function", prop: "fg" },
  syntaxVariable: { scope: "variable", prop: "fg" },
  syntaxString: { scope: "string", prop: "fg" },
  syntaxNumber: { scope: "constant.numeric", prop: "fg" },
  syntaxType: { scope: "type", prop: "fg" },
  syntaxOperator: { scope: "operator", prop: "fg" },
  syntaxPunctuation: { scope: "punctuation", prop: "fg" },
};

// -----------------------------------------------------------------------------
// Value Extraction
// -----------------------------------------------------------------------------

function getHelixValue(
  theme: HelixTheme,
  scope: string,
  prop: "fg" | "bg"
): string | undefined {
  const value = theme[scope];
  if (!value) return undefined;

  // Skip palette object
  if (typeof value === "object" && "palette" in value) return undefined;

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
  helixTheme: HelixTheme,
  palette: Record<string, string>
): Record<string, string> {
  const theme: Record<string, string> = {};

  const sortedFields = Object.keys(THEME_MAP).sort((a, b) =>
    a.localeCompare(b)
  );

  for (const field of sortedFields) {
    const mapping = THEME_MAP[field] as ThemeMapping | null | undefined;

    if (mapping === null || mapping === undefined) {
      theme[field] = "none";
    } else {
      const value = getHelixValue(helixTheme, mapping.scope, mapping.prop);
      if (value) {
        // Validate palette reference
        if (!value.startsWith("#") && !palette[value]) {
          console.warn(
            `Warning: ${field} references unknown palette color: ${value}`
          );
        }
        theme[field] = value;
      } else {
        theme[field] = "none";
      }
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
  const helixTheme = parseHelixTheme(tomlContent);
  const palette = helixTheme.palette;

  console.log(`Found ${Object.keys(palette).length} palette colors`);

  console.log("Building defs...");
  const defs = buildDefs(palette);

  console.log("Building theme...");
  const theme = buildTheme(helixTheme, palette);

  const mappedCount = Object.values(theme).filter((v) => v !== "none").length;
  const noneCount = Object.values(theme).filter((v) => v === "none").length;
  console.log(
    `Mapped ${mappedCount} theme fields, ${noneCount} set to "none"`
  );

  const output: OpenCodeTheme = {
    $schema: "https://opencode.ai/theme.json",
    defs,
    theme,
  };

  console.log(`Writing ${outputPath}...`);
  await Bun.write(outputPath, JSON.stringify(output, null, 2) + "\n");

  console.log("Done!");
}

main().catch(console.error);
