import plist from "plist";

import { BG, FG, type HelixTheme, type HelixValue, normalizeHelixValue, run } from "./lib/helix";
import { MODIFIER_MAP, THEME_MAP } from "./lib/bat";

function compact<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v)) as Partial<T>;
}

function resolveColor(
  value: string | undefined,
  palette: Record<string, string>
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
  palette: Record<string, string>
) {
  const value = normalizeHelixValue(scopes[scope]);
  const fontStyle = value.modifiers?.map((m) => MODIFIER_MAP[m]).filter(Boolean).join(" ");
  return compact({
    foreground: resolveColor(value[FG], palette),
    background: resolveColor(value[BG], palette),
    fontStyle,
  });
}

run("themes/bat.tmTheme", ({ scopes, palette }: HelixTheme) => {
  const globalSettings = { settings: {
    background: extractStyle(scopes, "ui.background", palette).background,
    foreground: extractStyle(scopes, "ui.text", palette).foreground,
  } };

  const rules = THEME_MAP.map(({ tmTheme: scope, helix, name }) => {
    return { name, scope, settings: extractStyle(scopes, helix, palette) };
  });

  const theme = {
    author: "Pop Dark Theme",
    name: "Pop Dark",
    colorSpaceName: "sRGB",
    semanticClass: "theme.dark.pop-dark",
    settings: [globalSettings, ...rules],
  } as plist.PlistValue;

  return plist.build(theme);
});
