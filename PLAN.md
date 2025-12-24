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

### Ghostty (ANSI-16)
Collapse 26 colors to 16 ANSI slots. Decisions needed:
- Which oranges → yellow vs red?
- Which blues → blue vs cyan?
- Bright vs normal semantics

### bat/opencode (tmTheme)
Helix uses tree-sitter scopes similar to Sublime/TextMate. Direct mapping:
- helix `comment` → tmTheme `comment`
- helix `string` → tmTheme `string`
- helix `keyword.control` → tmTheme `keyword.control`
- etc.

Full 26-color palette preserved (tmTheme supports arbitrary hex).

## Converters (Reference Only)
Evaluated but **not directly usable** — all expect VSCode JSON input, not helix TOML.

Useful as **reference implementations** for output format structure:
- `vscode_theme_converter` — tmTheme structure, ANSI mapping logic
- `root-loops` — Ghostty/Helix export format examples
- `code-theme-converter` — tmTheme field mappings

See `docs/converters.md` for full analysis.

## Artifacts
| Path | Description |
|------|-------------|
| `themes/helix.toml` | source theme (canonical) |
| `themes/vscode.json` | upstream reference (historical, not source of truth) |
| `themes/ghostty.toml` | TBD |
| `themes/bat.tmTheme` | TBD |

## Documents
- `docs/converters.md` — converter analysis (reference only)
- `docs/vscode.md` — upstream VSCode theme (historical)
- `docs/tuis/helix.md` — palette analysis, scope inventory, VSCode deviation notes
- `docs/tuis/ghostty.md` — ANSI-16 mapping decisions
- `docs/tuis/bat.md` — tmTheme scope mapping
- `docs/tuis/opencode.md` — tmTheme integration

## Next Steps
1. [ ] Define ANSI-16 mapping from helix palette (update `docs/tuis/ghostty.md`)
2. [ ] Create `themes/ghostty.toml`
3. [ ] Map helix scopes → tmTheme scopes (update `docs/tuis/bat.md`)
4. [ ] Create `themes/bat.tmTheme`
5. [ ] Validate bat theme with actual syntax files
6. [ ] Test opencode with bat.tmTheme
