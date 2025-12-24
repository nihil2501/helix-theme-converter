# Goal
Propagate my `pop-dark` theme across terminal tooling contexts.

## Lineage
```
VSCodePopTheme (upstream) → helix pop-dark (current) → ghostty, bat, opencode
```

## Formats
| Context | Format | Notes |
|---------|--------|-------|
| VSCodePopTheme | VSCode JSON | upstream source; converters expect this |
| helix | TOML | already done |
| ghostty | TOML | ANSI-16 + UI; semantic mapping TBD (e.g. bright vs dark) |
| bat | tmTheme (XML) | TextMate scopes |
| opencode | tmTheme | uses tmTheme under the hood |

## Converters
All consume VSCode JSON. Compare implementations before choosing.

| Converter | Output | Notes |
|-----------|--------|-------|
| vscode_theme_converter | tmTheme + Ghostty + ANSI map | Python; most complete |
| json2tm | tmTheme | Rust; minimal |
| theme-converter | tmTheme | Rust; lib only |
| code-theme-converter | tmTheme (or sublime-color-scheme) | Node; takes repo URL |
| root-loops | 18 formats (VSCode, Helix, Ghostty, etc.) | Svelte; generator not converter |

Note: `root-loops` is a **color scheme generator** with export capabilities, not a format converter. It generates palettes from parameters and exports to many formats. Useful as reference for export format implementations.

## Strategy
1. Pull VSCodePopTheme as source artifact
2. Review existing VSCode → helix mapping for quality/gaps
3. Evaluate converters → produce tmTheme (bat, opencode) + Ghostty
4. Ghostty may need manual tuning (bright/dark semantics)

## Documents
- `docs/converters.md` — converter comparison and selection
- `docs/vscode.md` — VSCodePopTheme upstream source
- `docs/helix.md` — helix theme review
- `docs/ghostty.md` — ANSI mapping decisions
- `docs/bat.md` — tmTheme generation
- `docs/opencode.md` — tmTheme integration
