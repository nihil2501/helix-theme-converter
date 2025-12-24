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
Helix uses tree-sitter scopes similar to Sublime/TextMate. Most map 1:1, some need translation.

See `docs/scope-mapping.md` for the canonical mapping.

Full 26-color palette preserved (tmTheme supports arbitrary hex).

A generator script (`scripts/generate-tmtheme.ts`) will parse helix.toml and emit tmTheme.
Reference implementations in `vendor/converters/` provide tmTheme structure examples.

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
- `docs/scope-mapping.md` — **canonical helix → tmTheme scope mapping** (drives tmTheme generation)
- `docs/converters.md` — converter analysis (reference only)
- `docs/vscode.md` — upstream VSCode theme (historical)
- `docs/tuis/helix.md` — palette analysis, scope inventory, VSCode deviation notes
- `docs/tuis/ghostty.md` — ANSI-16 mapping decisions
- `docs/tuis/bat.md` — tmTheme scope mapping
- `docs/tuis/opencode.md` — tmTheme integration

## Next Steps
1. [ ] Finalize `docs/scope-mapping.md` — review/adjust scope translations
2. [ ] Write `scripts/generate-tmtheme.ts` — parse helix.toml, emit tmTheme XML (run with `bun`)
3. [ ] Generate `themes/bat.tmTheme` from script
4. [ ] Define ANSI-16 color collapse in `docs/tuis/ghostty.md`
5. [ ] Create `themes/ghostty.toml`
6. [ ] Validate bat theme with actual syntax files
7. [ ] Test opencode with bat.tmTheme
