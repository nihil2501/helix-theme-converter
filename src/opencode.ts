import { type HelixTheme, type HelixValue, normalizeHelixValue } from "./helix";

type ThemeMapping = {
  opencode: string;
  helix?: string;
};

const THEME_MAP: ThemeMapping[] = [
  {
    opencode: "syntaxComment",
    helix: "comment",
  },
  {
    opencode: "syntaxFunction",
    helix: "function",
  },
  {
    opencode: "syntaxKeyword",
    helix: "keyword",
  },
  {
    opencode: "syntaxNumber",
    helix: "constant.numeric",
  },
  {
    opencode: "syntaxOperator",
    helix: "operator",
  },
  {
    opencode: "syntaxPunctuation",
    helix: "punctuation",
  },
  {
    opencode: "syntaxString",
    helix: "string",
  },
  {
    opencode: "syntaxType",
    helix: "type",
  },
  {
    opencode: "syntaxVariable",
    helix: "variable",
  },
  {
    opencode: "primary",
  },
  {
    opencode: "secondary",
  },
  {
    opencode: "accent",
  },
  {
    opencode: "error",
  },
  {
    opencode: "warning",
  },
  {
    opencode: "success",
  },
  {
    opencode: "info",
  },
  {
    opencode: "text",
  },
  {
    opencode: "textMuted",
  },
  {
    opencode: "selectedListItemText",
  },
  {
    opencode: "background",
  },
  {
    opencode: "backgroundPanel",
  },
  {
    opencode: "backgroundElement",
  },
  {
    opencode: "backgroundMenu",
  },
  {
    opencode: "border",
  },
  {
    opencode: "borderActive",
  },
  {
    opencode: "borderSubtle",
  },
  {
    opencode: "diffAdded",
  },
  {
    opencode: "diffRemoved",
  },
  {
    opencode: "diffContext",
  },
  {
    opencode: "diffHunkHeader",
  },
  {
    opencode: "diffHighlightAdded",
  },
  {
    opencode: "diffHighlightRemoved",
  },
  {
    opencode: "diffAddedBg",
  },
  {
    opencode: "diffRemovedBg",
  },
  {
    opencode: "diffContextBg",
  },
  {
    opencode: "diffLineNumber",
  },
  {
    opencode: "diffAddedLineNumberBg",
  },
  {
    opencode: "diffRemovedLineNumberBg",
  },
  {
    opencode: "markdownText",
  },
  {
    opencode: "markdownHeading",
  },
  {
    opencode: "markdownLink",
  },
  {
    opencode: "markdownLinkText",
  },
  {
    opencode: "markdownCode",
  },
  {
    opencode: "markdownBlockQuote",
  },
  {
    opencode: "markdownEmph",
  },
  {
    opencode: "markdownStrong",
  },
  {
    opencode: "markdownHorizontalRule",
  },
  {
    opencode: "markdownListItem",
  },
  {
    opencode: "markdownListEnumeration",
  },
  {
    opencode: "markdownImage",
  },
  {
    opencode: "markdownImageText",
  },
  {
    opencode: "markdownCodeBlock",
  },
]
  .sort(
    (a, b) =>
      a.opencode.localeCompare(b.opencode) ||
      (a.helix ?? "").localeCompare(b.helix ?? ""),
  )
  .filter(
    (item, index, arr) =>
      arr.findIndex((i) => i.opencode === item.opencode) === index,
  );

const NONE = "none" as const;

function resolveColor(
  scopes: Record<string, HelixValue>,
  scope?: string,
): string {
  if (!scope) return NONE;
  return normalizeHelixValue(scopes[scope]).fg || NONE;
}

export function generate({ scopes, palette }: HelixTheme): string {
  const defs = Object.fromEntries(
    Object.entries(palette).sort(([a], [b]) => a.localeCompare(b)),
  );

  const theme = Object.fromEntries(
    THEME_MAP.map(({ opencode, helix: scope }) => [
      opencode,
      resolveColor(scopes, scope),
    ]),
  );

  const json = {
    $schema: "https://opencode.ai/theme.json",
    defs,
    theme,
  };
  return `${JSON.stringify(json, null, 2)}\n`;
}
