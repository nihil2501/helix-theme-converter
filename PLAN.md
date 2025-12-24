# Goal
I have a `helix` theme that I really like called `pop-dark`. There are a couple of other terminal contexts to which I'd like to propagate this theming.

## Source
| Tool | Format | Semantics |
|------|--------|-----------|
| helix | TOML | editor UI + treesitter scopes |

## Targets
| Tool | Format | Semantics | Mapping Strategy |
|------|--------|-----------|------------------|
| ghostty | TOML | terminal UI (16 ANSI + extras) | direct palette extraction |
| bat | tmTheme (XML) | TextMate scopes | scope translation needed |
| opencode | TBD | TBD | TBD |

## Converters
| Converter | Path | Notes |
|-----------|------|-------|
| json2tm | JSON → tmTheme | useful if we produce intermediate JSON |
| theme-converter | helix ↔ VSCode? | investigate |
| vscode_theme_converter | VSCode → ? | indirect path |
| code-theme-converter | VSCode ↔ JetBrains | probably irrelevant |

## Next Steps
1. [ ] Locate pop-dark helix theme
2. [ ] Investigate each target format
3. [ ] Decide: manual vs. tooling
