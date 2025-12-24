export const FG = "fg" as const;
export const BG = "bg" as const;

export type HelixProp = typeof FG | typeof BG;

type HelixColors = { [K in HelixProp]?: string };

export type HelixStyle = HelixColors & {
  modifiers?: string[];
  underline?: { color?: string; style?: string };
};

export type HelixValue = string | HelixStyle;

export interface HelixTheme {
  palette: Record<string, string>;
  scopes: Record<string, HelixValue>;
}

export function normalizeHelixValue(value: HelixValue | undefined): HelixStyle {
  if (typeof value === "string") return { [FG]: value };
  return value || {};
}

export function parseHelixTheme(tomlContent: string): HelixTheme {
  const parsed = Bun.TOML.parse(tomlContent) as any;

  // Extract palette and move everything else to scopes
  const { palette = {}, ...scopes } = parsed;

  return {
    palette,
    scopes,
  };
}
