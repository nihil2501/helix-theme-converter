/**
 * Helix theme types and parsing utilities
 */

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface HelixStyle {
  fg?: string;
  bg?: string;
  modifiers?: string[];
  underline?: { color?: string; style?: string };
}

export type HelixValue = string | HelixStyle;

export interface HelixTheme {
  palette: Record<string, string>;
  [scope: string]: HelixValue | Record<string, string>;
}

// -----------------------------------------------------------------------------
// Parsing
// -----------------------------------------------------------------------------

export function parseHelixTheme(tomlContent: string): HelixTheme {
  return Bun.TOML.parse(tomlContent) as HelixTheme;
}
