import { type HelixValue, parseHelixTheme } from "./lib/helix";
import { MODIFIER_MAP, SCOPE_MAP } from "./lib/bat";

interface TMThemeStyle {
  foreground?: string;
  background?: string;
  fontStyle?: string;
};

interface TMThemeRule {
  name: string;
  scope: string;
  style: TMThemeStyle;
}

interface GlobalSettings {
  background?: string;
  foreground?: string;
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
): TMThemeStyle {
  let value = scopes[scope] || {};
  if (typeof value === "string") value = { fg: value };
  const fontStyle = value.modifiers?.map((m) => MODIFIER_MAP[m]).filter(Boolean).join(" ");

  return {
    foreground: resolveColor(value.fg, palette),
    background: resolveColor(value.bg, palette),
    fontStyle,
  };
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateTmTheme(
  globalSettings: GlobalSettings,
  tmThemeRules: TMThemeRule[]
): string {
  const lines: string[] = [];

  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push(
    '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">'
  );
  lines.push('<plist version="1.0">');
  lines.push("<dict>");

  lines.push("\t<key>author</key>");
  lines.push("\t<string>Pop Dark Theme</string>");

  lines.push("\t<key>name</key>");
  lines.push("\t<string>Pop Dark</string>");

  lines.push("\t<key>colorSpaceName</key>");
  lines.push("\t<string>sRGB</string>");

  lines.push("\t<key>semanticClass</key>");
  lines.push("\t<string>theme.dark.pop-dark</string>");

  lines.push("\t<key>settings</key>");
  lines.push("\t<array>");

  lines.push("\t\t<dict>");
  lines.push("\t\t\t<key>settings</key>");
  lines.push("\t\t\t<dict>");

  if (globalSettings.background) {
    lines.push("\t\t\t\t<key>background</key>");
    lines.push(`\t\t\t\t<string>${globalSettings.background}</string>`);
  }
  if (globalSettings.foreground) {
    lines.push("\t\t\t\t<key>foreground</key>");
    lines.push(`\t\t\t\t<string>${globalSettings.foreground}</string>`);
  }

  lines.push("\t\t\t</dict>");
  lines.push("\t\t</dict>");

  for (const rule of tmThemeRules) {
    lines.push("\t\t<dict>");

    lines.push("\t\t\t<key>name</key>");
    lines.push(`\t\t\t<string>${escapeXml(rule.name)}</string>`);

    lines.push("\t\t\t<key>scope</key>");
    lines.push(`\t\t\t<string>${escapeXml(rule.scope)}</string>`);

    lines.push("\t\t\t<key>settings</key>");
    lines.push("\t\t\t<dict>");

    if (rule.style.foreground) {
      lines.push("\t\t\t\t<key>foreground</key>");
      lines.push(`\t\t\t\t<string>${rule.style.foreground}</string>`);
    }

    if (rule.style.background) {
      lines.push("\t\t\t\t<key>background</key>");
      lines.push(`\t\t\t\t<string>${rule.style.background}</string>`);
    }

    if (rule.style.fontStyle) {
      lines.push("\t\t\t\t<key>fontStyle</key>");
      lines.push(`\t\t\t\t<string>${rule.style.fontStyle}</string>`);
    }

    lines.push("\t\t\t</dict>");
    lines.push("\t\t</dict>");
  }

  lines.push("\t</array>");
  lines.push("</dict>");
  lines.push("</plist>");

  return lines.join("\n");
}

async function main() {
  const inputPath = "themes/helix.toml";
  const outputPath = "themes/bat.tmTheme";

  console.log(`Reading ${inputPath}...`);
  const tomlContent = await Bun.file(inputPath).text();

  console.log("Parsing Helix theme...");
  const { scopes, palette } = parseHelixTheme(tomlContent);

  console.log(`Found ${Object.keys(palette).length} palette colors`);

  console.log("Extracting global settings...");
  const globalSettings = {
    background: extractStyle(scopes, "ui.background", palette).background,
    foreground: extractStyle(scopes, "ui.text", palette).foreground,
  };

  console.log("Generating tmTheme rules...");
  const tmThemeRules = SCOPE_MAP.flatMap(({ tmTheme: scope, helix, name }) => {
    return { name, scope, style: extractStyle(scopes, helix, palette) };
  });

  console.log(`Generated ${tmThemeRules.length} tmTheme rules`);

  console.log("Building tmTheme XML...");
  const xml = generateTmTheme(globalSettings, tmThemeRules);

  console.log(`Writing ${outputPath}...`);
  await Bun.write(outputPath, xml);

  console.log("Done!");
}

main().catch(console.error);
