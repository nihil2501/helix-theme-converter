import {
  BG,
  FG,
  type HelixTheme,
  type HelixValue,
  normalizeHelixValue,
} from "./helix";

const THEME_MAP = [
  {
    tmTheme: "comment",
    helix: "comment",
    name: "Comments",
  },
  {
    tmTheme: "comment.block",
    helix: "comment.block",
    name: "Block Comments",
  },
  {
    tmTheme: "comment.block.documentation",
    helix: "comment.block.documentation",
    name: "Documentation Comments",
  },
  {
    tmTheme: "comment.line",
    helix: "comment.line",
    name: "Line Comments",
  },
  {
    tmTheme: "comment.line.documentation",
    helix: "comment.line.documentation",
    name: "Line Documentation Comments",
  },
  {
    tmTheme: "constant",
    helix: "constant",
    name: "Constants",
  },
  {
    tmTheme: "constant.character",
    helix: "constant.character",
    name: "Characters",
  },
  {
    tmTheme: "constant.character.escape",
    helix: "constant.character.escape",
    name: "Escape Characters",
  },
  {
    tmTheme: "constant.language",
    helix: "constant.builtin",
    name: "Built-in Constants",
  },
  {
    tmTheme: "constant.numeric",
    helix: "constant.numeric",
    name: "Numbers",
  },
  {
    tmTheme: "constant.other",
    helix: "string.special",
    name: "Language-Specific Constants",
  },
  {
    tmTheme: "entity.name.function",
    helix: "function",
    name: "Functions",
  },
  {
    tmTheme: "entity.name.function.constructor",
    helix: "constructor",
    name: "Constructors",
  },
  {
    tmTheme: "entity.name.function.macro",
    helix: "function.macro",
    name: "Macros",
  },
  {
    tmTheme: "entity.name.function.method",
    helix: "function.method",
    name: "Methods",
  },
  {
    tmTheme: "entity.name.label",
    helix: "label",
    name: "Labels",
  },
  {
    tmTheme: "entity.name.namespace",
    helix: "namespace",
    name: "Namespaces",
  },
  {
    tmTheme: "entity.name.tag",
    helix: "tag",
    name: "Tags",
  },
  {
    tmTheme: "entity.name.type",
    helix: "type",
    name: "Types",
  },
  {
    tmTheme: "entity.name.enum",
    helix: "type.enum.variant",
    name: "Enum Variants",
  },
  {
    tmTheme: "entity.other.attribute-name",
    helix: "attribute",
    name: "Attributes",
  },
  {
    tmTheme: "keyword",
    helix: "keyword",
    name: "Keywords",
  },
  {
    tmTheme: "keyword.control",
    helix: "keyword.control",
    name: "Control Keywords",
  },
  {
    tmTheme: "keyword.control.conditional",
    helix: "keyword.control.conditional",
    name: "Conditional Keywords",
  },
  {
    tmTheme: "keyword.control.exception",
    helix: "keyword.control.exception",
    name: "Exception Keywords",
  },
  {
    tmTheme: "keyword.control.import",
    helix: "keyword.control.import",
    name: "Import Keywords",
  },
  {
    tmTheme: "keyword.control.loop",
    helix: "keyword.control.repeat",
    name: "Loop Keywords",
  },
  {
    tmTheme: "keyword.control.flow.return",
    helix: "keyword.control.return",
    name: "Return Keywords",
  },
  {
    tmTheme: "keyword.operator",
    helix: "keyword.operator",
    name: "Operator Keywords",
  },
  {
    tmTheme: "keyword.other",
    helix: "special",
    name: "Special Keywords",
  },
  {
    tmTheme: "markup.bold",
    helix: "markup.bold",
    name: "Bold",
  },
  {
    tmTheme: "markup.changed",
    helix: "diff.delta",
    name: "Changed (Diff)",
  },
  {
    tmTheme: "markup.deleted",
    helix: "diff.minus",
    name: "Deleted (Diff)",
  },
  {
    tmTheme: "markup.heading",
    helix: "markup.heading",
    name: "Headings",
  },
  {
    tmTheme: "markup.inserted",
    helix: "diff.plus",
    name: "Inserted (Diff)",
  },
  {
    tmTheme: "markup.italic",
    helix: "markup.italic",
    name: "Italic",
  },
  {
    tmTheme: "markup.underline.link",
    helix: "markup.link",
    name: "Links",
  },
  {
    tmTheme: "markup.list",
    helix: "markup.list",
    name: "Lists",
  },
  {
    tmTheme: "markup.list.numbered",
    helix: "markup.list.numbered",
    name: "Numbered Lists",
  },
  {
    tmTheme: "markup.list.unnumbered",
    helix: "markup.list.unnumbered",
    name: "Bullet Lists",
  },
  {
    tmTheme: "markup.quote",
    helix: "markup.quote",
    name: "Quotes",
  },
  {
    tmTheme: "markup.raw",
    helix: "markup.raw",
    name: "Raw/Code",
  },
  {
    tmTheme: "markup.raw.block",
    helix: "markup.raw.block",
    name: "Code Blocks",
  },
  {
    tmTheme: "markup.raw.inline",
    helix: "markup.raw.inline",
    name: "Inline Code",
  },
  {
    tmTheme: "markup.strikethrough",
    helix: "markup.strikethrough",
    name: "Strikethrough",
  },
  {
    tmTheme: "operator",
    helix: "operator",
    name: "Operators",
  },
  {
    tmTheme: "punctuation",
    helix: "punctuation",
    name: "Punctuation",
  },
  {
    tmTheme: "punctuation.section.bracket",
    helix: "punctuation.bracket",
    name: "Brackets",
  },
  {
    tmTheme: "punctuation.separator",
    helix: "punctuation.delimiter",
    name: "Separators",
  },
  {
    tmTheme: "storage.type",
    helix: "keyword.storage.type",
    name: "Type Keywords",
  },
  {
    tmTheme: "keyword.declaration.type",
    helix: "keyword.storage.type",
    name: "Type Keywords",
  },
  {
    tmTheme: "storage.modifier",
    helix: "keyword.storage.modifier",
    name: "Modifier Keywords",
  },
  {
    tmTheme: "keyword.declaration.function",
    helix: "keyword.function",
    name: "Function Keywords",
  },
  {
    tmTheme: "storage.type.function",
    helix: "keyword.function",
    name: "Function Keywords",
  },
  {
    tmTheme: "string",
    helix: "string",
    name: "Strings",
  },
  {
    tmTheme: "string.other",
    helix: "string.special",
    name: "Special Strings",
  },
  {
    tmTheme: "string.regexp",
    helix: "string.regexp",
    name: "Regular Expressions",
  },
  {
    tmTheme: "support.function",
    helix: "function.builtin",
    name: "Built-in Functions",
  },
  {
    tmTheme: "support.type",
    helix: "type.builtin",
    name: "Built-in Types",
  },
  {
    tmTheme: "variable",
    helix: "variable",
    name: "Variables",
  },
  {
    tmTheme: "variable.function",
    helix: "function",
    name: "Function References",
  },
  {
    tmTheme: "variable.language",
    helix: "variable.builtin",
    name: "Built-in Variables",
  },
  {
    tmTheme: "variable.other.member",
    helix: "variable.other.member",
    name: "Member Variables",
  },
  {
    tmTheme: "variable.parameter",
    helix: "variable.parameter",
    name: "Parameters",
  },
]
  .sort(
    (a, b) =>
      a.tmTheme.localeCompare(b.tmTheme) ||
      a.helix.localeCompare(b.helix) ||
      a.name.localeCompare(b.name),
  )
  .filter(
    (item, index, arr) =>
      arr.findIndex((i) => i.tmTheme === item.tmTheme) === index,
  );

const MODIFIER_MAP: Record<string, string> = {
  bold: "bold",
  italic: "italic",
  underline: "underline",
  crossed_out: "strikethrough",
};

function compact<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v),
  ) as Partial<T>;
}

function resolveColor(
  value: string | undefined,
  palette: Record<string, string>,
): string | undefined {
  if (!value) return;
  if (value.startsWith("#")) return value.toUpperCase();
  if (palette[value]) return palette[value].toUpperCase();
  console.warn(`Unknown color reference: ${value}`);
  return undefined;
}

function extractStyle(
  scopes: Record<string, HelixValue>,
  scope: string,
  palette: Record<string, string>,
) {
  const value = normalizeHelixValue(scopes[scope]);
  const fontStyle = value.modifiers
    ?.map((m) => MODIFIER_MAP[m])
    .filter(Boolean)
    .join(" ");
  return compact({
    foreground: resolveColor(value[FG], palette),
    background: resolveColor(value[BG], palette),
    fontStyle,
  });
}

export function generate(
  name: string,
  { scopes, palette }: HelixTheme,
): string {
  const plist = require("plist");

  const globalSettings = {
    settings: {
      background: extractStyle(scopes, "ui.background", palette).background,
      foreground: extractStyle(scopes, "ui.text", palette).foreground,
    },
  };

  const rules = THEME_MAP.map(({ tmTheme: scope, helix, name }) => {
    const settings = extractStyle(scopes, helix, palette);
    return {
      name,
      scope,
      settings,
    };
  });

  const theme = {
    author: "helix-theme-converter",
    name,
    colorSpaceName: "sRGB",
    semanticClass: `theme.${name}`,
    settings: [
      globalSettings,
      ...rules,
    ],
  };

  return plist.build(theme);
}
