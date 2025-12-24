# Goal
Propagate my `pop-dark` theme across TUI contexts.

## Source of Truth
**Helix theme** (`themes/helix.toml`) is the canonical source.

The helix theme was originally derived from VSCodePopTheme but has diverged significantly (keyword/type color inversion, richer palette). We treat helix as authoritative, not VSCode.

## Palette
The helix theme defines 26 named colors:

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
| TUI | Format | Strategy |
|-----|--------|----------|
| helix | TOML | done (source) |
| ghostty | TOML | map 26 colors → ANSI-16 + UI colors |
| bat | tmTheme (XML) | map helix scopes → TextMate scopes |
| opencode | tmTheme | same as bat |

## Mapping Approach

### Ghostty (ANSI-16 + UI)
See `docs/tuis/ghostty.md` for complete mapping. Key points:
- UI colors (background, foreground, cursor, selection) map directly from helix `ui.*` scopes
- ANSI-16 palette collapses 26 colors to 16 slots
- No magenta in helix palette — use warm colors (salmon/orange) as stand-ins
- **Ready to generate** — theme content is drafted in the doc

### bat/opencode (tmTheme)
Helix uses tree-sitter scopes similar to Sublime/TextMate. Most map 1:1, some need translation.

See `docs/scope-mapping.md` for the canonical mapping.

Full 26-color palette preserved (tmTheme supports arbitrary hex).

A generator script (`scripts/generate-tmtheme.ts`) will parse helix.toml and emit tmTheme.
Reference implementations in `vendor/converters/` provide tmTheme structure examples.

## Converters (Reference Only)
Evaluated but **not directly usable** — all expect VSCode JSON input, not helix TOML.

Useful as **reference implementations** for output format structure:
- `vendor/converters/vscode_theme_converter/` — tmTheme structure (`tm_theme.py`), plist generation
- `vendor/converters/root-loops/src/lib/export/` — Ghostty (`ghostty.ts`), Helix (`helix.ts`) format examples
- `vendor/converters/code-theme-converter/src/sublime/` — tmTheme field mappings (`tmTheme.ts`)
- `vendor/converters/json2tm/src/` — minimal Rust tmTheme generation (`tm.rs`)

See `docs/converters.md` for full analysis.

## Artifacts
| Path | Description | Status |
|------|-------------|--------|
| `themes/helix.toml` | source theme (canonical) | done |
| `themes/vscode/pop-dark.json` | upstream reference (historical) | done |
| `themes/ghostty` | ghostty theme | ready to create |
| `themes/bat.tmTheme` | bat/opencode theme | needs generator |

## Documents
- `docs/scope-mapping.md` — **canonical helix → tmTheme scope mapping** (drives tmTheme generation)
- `docs/converters.md` — converter analysis (reference implementations)
- `docs/vscode.md` — upstream VSCode theme (historical)
- `docs/tuis/helix.md` — palette analysis, scope inventory, VSCode deviation notes
- `docs/tuis/ghostty.md` — **complete mapping with ready-to-use theme**
- `docs/tuis/bat.md` — tmTheme notes
- `docs/tuis/opencode.md` — tmTheme integration notes

---

## Next Steps

### Immediate (Ghostty)
1. [x] Define ANSI-16 + UI mapping — see `docs/tuis/ghostty.md`
2. [ ] Create `themes/ghostty` — copy from drafted theme in doc
3. [ ] Validate in ghostty terminal

### tmTheme Generator
4. [ ] Review `docs/scope-mapping.md` — finalize any scope translations
5. [ ] Write `scripts/generate-tmtheme.ts`:
   - Parse `themes/helix.toml` (TOML → palette + scopes)
   - Apply scope mapping from `docs/scope-mapping.md`
   - Emit XML plist format (see `vendor/converters/` for examples)
   - Run with: `bun run scripts/generate-tmtheme.ts`
6. [ ] Generate `themes/bat.tmTheme`

### Validation
7. [ ] Test bat theme: `bat --theme-file themes/bat.tmTheme <source-file>`
8. [ ] Test opencode integration
9. [ ] Iterate on colors/scopes as needed

---

## How to Proceed

**For the next agent session:**

1. **Start with Ghostty** (quick win):
   - Open `docs/tuis/ghostty.md`
   - Copy the "Generated Theme" block to `themes/ghostty`
   - Test it

2. **Then build the tmTheme generator**:
   - Read `docs/scope-mapping.md` for the helix → tmTheme mapping
   - Read `themes/helix.toml` to understand the source format
   - Reference `vendor/converters/code-theme-converter/src/sublime/tmTheme.ts` for tmTheme structure
   - Write a TypeScript script that:
     - Parses TOML (use a library like `@iarna/toml` or `smol-toml`)
     - Resolves palette references to hex values
     - Maps scopes per `docs/scope-mapping.md`
     - Outputs XML plist

3. **Validate and iterate**:
   - Test outputs in actual tools
   - Adjust mappings as needed
