import { type HelixTheme, normalizeHelixValue } from "./helix";

const SYNTAX_MAP: Record<string, string> = {
  syntaxComment: "comment",
  syntaxFunction: "function",
  syntaxKeyword: "keyword",
  syntaxNumber: "constant.numeric",
  syntaxOperator: "operator",
  syntaxPunctuation: "punctuation",
  syntaxString: "string",
  syntaxType: "type",
  syntaxVariable: "variable",
};

const THEME_KEYS: string[] = [
  ...Object.keys(SYNTAX_MAP),
  "accent",
  "background",
  "backgroundElement",
  "backgroundMenu",
  "backgroundPanel",
  "border",
  "borderActive",
  "borderSubtle",
  "diffAdded",
  "diffAddedBg",
  "diffAddedLineNumberBg",
  "diffContext",
  "diffContextBg",
  "diffHighlightAdded",
  "diffHighlightRemoved",
  "diffHunkHeader",
  "diffLineNumber",
  "diffRemoved",
  "diffRemovedBg",
  "diffRemovedLineNumberBg",
  "error",
  "info",
  "markdownBlockQuote",
  "markdownCode",
  "markdownCodeBlock",
  "markdownEmph",
  "markdownHeading",
  "markdownHorizontalRule",
  "markdownImage",
  "markdownImageText",
  "markdownLink",
  "markdownLinkText",
  "markdownListEnumeration",
  "markdownListItem",
  "markdownStrong",
  "markdownText",
  "primary",
  "secondary",
  "selectedListItemText",
  "success",
  "text",
  "textMuted",
  "warning",
].sort((a, b) => a.localeCompare(b));

const SYSTEM = "system" as const;

export function generate({ scopes, palette }: HelixTheme): string {
  const defs = Object.fromEntries(
    Object.entries(palette).sort(([a], [b]) => a.localeCompare(b)),
  );

  const theme = Object.fromEntries(
    THEME_KEYS.map((key) => {
      const value = key in SYNTAX_MAP
        ? normalizeHelixValue(scopes[SYNTAX_MAP[key] as string]).fg
        : SYSTEM;

      return [
        key,
        value,
      ];
    }),
  );

  const json = {
    $schema: "https://opencode.ai/theme.json",
    defs,
    theme,
  };
  return `${JSON.stringify(json, null, 2)}\n`;
}
