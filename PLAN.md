# Pop Dark Theme

Propagate the `pop-dark` theme across TUI contexts.

## Source of Truth

**Helix theme** (`themes/helix.toml`) is the canonical source.

## Palette

The helix theme defines 31 named colors:

| Category | Colors |
|----------|--------|
| Browns (bg) | brownN, brownH, brownD, brownR, brownU, brownV |
| Greys | greyT, greyC, greyL, greyH, greyG, greyD |
| Oranges | orangeH, orangeL, orangeN, orangeY, orangeW, orangeS |
| Blues | blueH, blueL, blueN, blueD |
| Greens | greenN, greenS |
| Reds | redH, redL, redE, redD |
| Yellow | yellowH |
| B/W | white, black |

See `themes/helix.toml` `[palette]` section for hex values.

## Targets

| Target | Format | Mapping Doc | Output | Status |
|--------|--------|-------------|--------|--------|
| Ghostty | Key-value config | `docs/terminal.md` | `themes/ghostty` | done |
| bat | tmTheme (XML) | `docs/bat.md` | `themes/bat.tmTheme` | done |
| opencode | Custom JSON | `docs/opencode.md` | `themes/opencode.json` | pending |

## Mapping Documents

| Document | Purpose |
|----------|---------|
| `docs/terminal.md` | ANSI-16 + terminal UI colors for Ghostty |
| `docs/bat.md` | Helix → tmTheme scope mapping for bat |
| `docs/opencode.md` | Helix → opencode JSON (53 color fields) |

## Scripts

| Script | Output | Description |
|--------|--------|-------------|
| `bun run generate:bat` | `themes/bat.tmTheme` | tmTheme for bat |
| `bun run generate:opencode` | `themes/opencode.json` | JSON for opencode |
| `bun run generate` | Both | Generate all themes |

## Artifacts

| Path | Description | Status |
|------|-------------|--------|
| `themes/helix.toml` | Source theme (canonical) | done |
| `themes/ghostty` | Ghostty terminal theme | done |
| `themes/bat.tmTheme` | bat syntax theme | done |
| `themes/opencode.json` | opencode theme | pending |

## Architecture Notes

### bat (tmTheme)

Uses TextMate scope conventions. Requires translation from Helix tree-sitter scopes:
- `function` → `entity.name.function`
- `type` → `entity.name.type`
- etc.

See `docs/bat.md` for full mapping.

### opencode (Custom JSON)

Uses its own JSON format with 53 color fields. Syntax highlighting via tree-sitter with nvim-treesitter queries. Only 9 syntax colors are defined; `getSyntaxRules()` maps all tree-sitter captures to these 9 colors.

Key difference from bat: opencode scopes are nvim-treesitter capture names (same as Helix), not tmTheme scopes.

See `docs/opencode.md` for full structure.

## Reference Implementations

The `vendor/converters/` directory contains reference implementations for theme conversion:

| Converter | Language | Useful For |
|-----------|----------|------------|
| `code-theme-converter` | TypeScript | tmTheme XML structure |
| `json2tm` | Rust | plist serialization |
| `root-loops` | TypeScript | Ghostty/Helix format examples |

## Next Steps

1. ~~Generate `themes/bat.tmTheme`~~ Done
2. **Write `scripts/generate-opencode.ts`** — Generate opencode JSON theme
3. **Validate** — Test themes in target applications
