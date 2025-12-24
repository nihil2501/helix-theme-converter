import { BG, FG, type HelixProp, type HelixTheme, type HelixValue, normalizeHelixValue } from "./helix";

type ThemeMapping = {
  opencode: string;
  helix?: { scope: string; prop: HelixProp };
};

const THEME_MAP: ThemeMapping[] = [
  { opencode: "accent", helix: { scope: "ui.cursor", prop: BG } },
  { opencode: "error", helix: { scope: "error", prop: FG } },
  { opencode: "info", helix: { scope: "info", prop: FG } },
  { opencode: "primary", helix: { scope: "ui.selection", prop: BG } },
  { opencode: "secondary" },
  { opencode: "success" },
  { opencode: "warning", helix: { scope: "warning", prop: FG } },

  { opencode: "selectedListItemText", helix: { scope: "ui.background", prop: BG } },
  { opencode: "text", helix: { scope: "ui.text", prop: FG } },
  { opencode: "textMuted", helix: { scope: "comment", prop: FG } },

  { opencode: "background", helix: { scope: "ui.background", prop: BG } },
  { opencode: "backgroundElement", helix: { scope: "ui.cursorline", prop: BG } },
  { opencode: "backgroundMenu", helix: { scope: "ui.help", prop: BG } },
  { opencode: "backgroundPanel", helix: { scope: "ui.window", prop: BG } },

  { opencode: "border", helix: { scope: "ui.window", prop: FG } },
  { opencode: "borderActive", helix: { scope: "ui.selection", prop: BG } },
  { opencode: "borderSubtle", helix: { scope: "ui.virtual", prop: FG } },

  { opencode: "diffAdded", helix: { scope: "diff.plus", prop: FG } },
  { opencode: "diffAddedBg" },
  { opencode: "diffAddedLineNumberBg" },
  { opencode: "diffContext", helix: { scope: "diff.delta", prop: FG } },
  { opencode: "diffContextBg", helix: { scope: "ui.background", prop: BG } },
  { opencode: "diffHighlightAdded", helix: { scope: "diff.plus", prop: FG } },
  { opencode: "diffHighlightRemoved", helix: { scope: "diff.minus", prop: FG } },
  { opencode: "diffHunkHeader", helix: { scope: "diff.delta", prop: FG } },
  { opencode: "diffLineNumber", helix: { scope: "ui.linenr", prop: FG } },
  { opencode: "diffRemoved", helix: { scope: "diff.minus", prop: FG } },
  { opencode: "diffRemovedBg" },
  { opencode: "diffRemovedLineNumberBg" },

  { opencode: "markdownBlockQuote", helix: { scope: "markup.quote", prop: FG } },
  { opencode: "markdownCode", helix: { scope: "markup.raw.inline", prop: FG } },
  { opencode: "markdownCodeBlock", helix: { scope: "markup.raw.block", prop: FG } },
  { opencode: "markdownEmph" },
  { opencode: "markdownHeading", helix: { scope: "markup.heading", prop: FG } },
  { opencode: "markdownHorizontalRule", helix: { scope: "ui.virtual", prop: FG } },
  { opencode: "markdownImage", helix: { scope: "markup.link", prop: FG } },
  { opencode: "markdownImageText", helix: { scope: "markup.link.text", prop: FG } },
  { opencode: "markdownLink", helix: { scope: "markup.link", prop: FG } },
  { opencode: "markdownLinkText", helix: { scope: "markup.link.text", prop: FG } },
  { opencode: "markdownListEnumeration", helix: { scope: "markup.list", prop: FG } },
  { opencode: "markdownListItem", helix: { scope: "markup.list", prop: FG } },
  { opencode: "markdownStrong" },
  { opencode: "markdownText", helix: { scope: "ui.text", prop: FG } },

  { opencode: "syntaxComment", helix: { scope: "comment", prop: FG } },
  { opencode: "syntaxFunction", helix: { scope: "function", prop: FG } },
  { opencode: "syntaxKeyword", helix: { scope: "keyword", prop: FG } },
  { opencode: "syntaxNumber", helix: { scope: "constant.numeric", prop: FG } },
  { opencode: "syntaxOperator", helix: { scope: "operator", prop: FG } },
  { opencode: "syntaxPunctuation", helix: { scope: "punctuation", prop: FG } },
  { opencode: "syntaxString", helix: { scope: "string", prop: FG } },
  { opencode: "syntaxType", helix: { scope: "type", prop: FG } },
  { opencode: "syntaxVariable", helix: { scope: "variable", prop: FG } },
]
  .sort((a, b) =>
    a.opencode.localeCompare(b.opencode) ||
    (a.helix?.scope ?? "").localeCompare(b.helix?.scope ?? "") ||
    (a.helix?.prop ?? "").localeCompare(b.helix?.prop ?? "")
  )
  .filter((item, index, arr) => arr.findIndex((i) => i.opencode === item.opencode) === index);

const NONE = "none" as const;

function resolveColor(
  scopes: Record<string, HelixValue>,
  helix?: { scope: string; prop: HelixProp }
): string {
  if (!helix) return NONE;
  return normalizeHelixValue(scopes[helix.scope])[helix.prop] || NONE;
}

export function generate({ scopes, palette }: HelixTheme): string {
  const defs = Object.fromEntries(
    Object.entries(palette).sort(([a], [b]) => a.localeCompare(b))
  );

  const theme = Object.fromEntries(
    THEME_MAP.map(({ opencode, helix }) => [opencode, resolveColor(scopes, helix)])
  );

  const json = { $schema: "https://opencode.ai/theme.json", defs, theme };
  return `${JSON.stringify(json, null, 2)}\n`;
}
