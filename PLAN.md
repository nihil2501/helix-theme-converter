# Goal
I have a `helix` theme that I really like called `pop-dark`. There are a couple of other terminal contexts to which I'd like to propagate this theming.

## Source
| Tool | Format | Semantics | Location |
|------|--------|-----------|----------|
| helix | TOML (palette + scopes) | editor UI + treesitter scopes | `vendor/tools/helix/runtime/themes/pop-dark.toml` |

**Upstream**: Derived from [VSCodePopTheme](https://github.com/ArtisanByteCrafter/VSCodePopTheme) by Nathaniel Webb. This VSCode theme should be pulled in as an artifact since converters expect VSCode JSON input.

## Targets
| Tool | Format | Semantics | Mapping Strategy |
|------|--------|-----------|------------------|
| ghostty | TOML | terminal UI (16 ANSI + extras) | direct palette extraction |
| bat | tmTheme (XML plist) | TextMate scopes | VSCode JSON → tmTheme via converter |
| opencode | custom JSON | 9 syntax tokens + UI colors | direct mapping (simple token set) |

### opencode theme format
- Schema: `https://opencode.ai/theme.json`
- Syntax tokens: `syntaxComment`, `syntaxKeyword`, `syntaxFunction`, `syntaxVariable`, `syntaxString`, `syntaxNumber`, `syntaxType`, `syntaxOperator`, `syntaxPunctuation`
- UI: `primary`, `background`, `text`, `border`, etc.
- Essentially a distillation compatible with VSCode/tmTheme semantics

## Converters
All assume **VSCode JSON as input** — none directly consume helix TOML.

| Converter | In → Out | Useful? |
|-----------|----------|---------|
| vscode_theme_converter | VSCode JSON → tmTheme + ANSI map + Ghostty | **YES** — best fit, has Ghostty output |
| json2tm | VSCode JSON → tmTheme | yes, simpler alternative for bat |
| theme-converter | VSCode/Neovim → tmTheme (lib only) | maybe, needs wrapper |
| code-theme-converter | VSCode repo → Sublime/JetBrains | no |

## Strategy
1. Pull VSCodePopTheme as artifact (the true upstream source)
2. Use `vscode_theme_converter` for: VSCode → tmTheme (bat) + Ghostty
3. Manual mapping for opencode (only 9 tokens)
4. Helix theme already exists — no work needed

## Next Steps
1. [ ] Pull VSCodePopTheme repo/JSON
2. [ ] Test vscode_theme_converter on it
3. [ ] Map opencode's 9 tokens to VSCode equivalents

# Notes from the user
- If opencode's situation is such that it's really just tmTheme configuration under the hood, then please make that adjustment now
- We'll eventually want to compare these converters' implementations to judge which is best
- We should keep this distilled to the highest level contour of the project and then figure out other documents that pertain to the source and each target individually to organize later work
- Hold in mind that we might need to discover the right semantics we want for ghostty, e.g. bright colors maybe shouldn't actually be the darker ones
