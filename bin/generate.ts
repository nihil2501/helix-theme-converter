#!/usr/bin/env bun
import { loadHelixTheme } from "../src/helix";
import { generate as generateOpenCode } from "../src/opencode";
import { generate as generateTmTheme } from "../src/tmtheme";

const name = process.argv[2];

if (!name) {
  console.error("Usage: bun run generate <name>");
  console.error("");
  console.error("  Reads:   themes/<name>/helix.toml");
  console.error("  Writes:  themes/<name>/theme.tmTheme");
  console.error("           themes/<name>/opencode.json");
  process.exit(1);
}

const dir = `themes/${name}`;
const inputPath = `${dir}/helix.toml`;
const tmThemePath = `${dir}/theme.tmTheme`;
const opencodePath = `${dir}/opencode.json`;

const theme = await loadHelixTheme(inputPath);

await Promise.all([
  Bun.write(tmThemePath, generateTmTheme(name, theme)),
  Bun.write(opencodePath, generateOpenCode(theme)),
]);

console.log(`Generated:`);
console.log(`  ${tmThemePath}`);
console.log(`  ${opencodePath}`);
