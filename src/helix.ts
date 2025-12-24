export const FG = "fg" as const;
export const BG = "bg" as const;

export type HelixProp = typeof FG | typeof BG;

type HelixColors = { [K in HelixProp]?: string };

type HelixStyle = HelixColors & {
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

export async function loadHelixTheme(path: string): Promise<HelixTheme> {
  const themeText = await Bun.file(path).text();
  const theme = Bun.TOML.parse(themeText) as Record<string, unknown>;
  const { palette = {}, ...scopes } = theme;
  return { palette, scopes } as HelixTheme;
}
