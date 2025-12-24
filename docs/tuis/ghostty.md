# Ghostty Theme

Target: `themes/ghostty.toml`

## Format

Ghostty themes are simple key-value files. Based on builtin themes at `~/.config/ghostty/themes-builtin/`, the standard options are:

```
background = #RRGGBB
foreground = #RRGGBB
cursor-color = #RRGGBB
cursor-text = #RRGGBB
selection-background = #RRGGBB
selection-foreground = #RRGGBB
palette = 0=#RRGGBB
palette = 1=#RRGGBB
...
palette = 15=#RRGGBB
```

## UI Color Mapping (from Helix)

| Ghostty | Helix Source | Helix Color | Hex |
|---------|--------------|-------------|-----|
| `background` | `ui.background` bg | brownN | #3E3B39 |
| `foreground` | `ui.text` fg | greyT | #DEDEDE |
| `cursor-color` | `ui.cursor` bg | orangeY | #FDC33B |
| `cursor-text` | `ui.cursor` fg | greyD | #444444 |
| `selection-background` | `ui.selection` bg | blueH | #8DEEF9 |
| `selection-foreground` | `ui.selection` fg | white | #FFFFFF |

## ANSI-16 Palette Mapping

The helix palette has 26 colors but no magenta/purple. We need to collapse to 16 ANSI slots.

### Proposed Mapping

| Slot | ANSI Name | Helix Color | Hex | Rationale |
|------|-----------|-------------|-----|-----------|
| 0 | black | black | #000000 | standard |
| 1 | red | redE | #FF2200 | errors, bright red |
| 2 | green | greenN | #73C48F | strings |
| 3 | yellow | orangeN | #FDAF1F | cursor accent, warnings |
| 4 | blue | blueD | #4AAAD6 | constructors, deep blue |
| 5 | magenta | redH | #F78C6C | *salmon as magenta stand-in* |
| 6 | cyan | blueH | #8DEEF9 | keywords, functions |
| 7 | white | greyT | #DEDEDE | normal text |
| 8 | bright black | greyD | #444444 | cursor text |
| 9 | bright red | redL | #F96964 | constant.builtin |
| 10 | bright green | greenS | #6FC475 | labels |
| 11 | bright yellow | yellowH | #FFCC00 | hints |
| 12 | bright blue | blueL | #6DD2FA | keyword.control |
| 13 | bright magenta | orangeL | #FFCB6B | *types, warm accent* |
| 14 | bright cyan | blueN | #39B7C7 | markup.link |
| 15 | bright white | white | #FFFFFF | bright text |

### Magenta Decision

The helix pop-dark palette has no purple/magenta. Options considered:

1. **Use salmon (redH)** for magenta, orange (orangeL) for bright magenta — warm theme stays warm
2. Derive a purple by blending — would introduce a color not in the source palette
3. Use greys — loses semantic meaning

**Decision**: Option 1 — keep the warm palette character. Magenta slots become additional red/orange variants.

### Unmapped Helix Colors

These helix colors don't map to ANSI-16 but are available for future use:
- orangeH (#FFD68A) — member variables
- orangeW (#FF9500) — warnings, special strings  
- orangeY (#FDC33B) — operators (used for cursor)
- orangeS (#F79A6C) — unused in helix theme
- redD (#CC3333) — unused
- greyH (#CFCFCF) — function.macro
- greyG (#DDFFDD) — constant
- greyL (#9A9A9A) — line numbers
- greyC (#A0B4A7) — comments
- brownV, brownH, brownR, brownD, brownU — UI backgrounds

## Generated Theme

```
# Pop Dark for Ghostty
# Generated from helix pop-dark theme

background = #3E3B39
foreground = #DEDEDE
cursor-color = #FDC33B
cursor-text = #444444
selection-background = #8DEEF9
selection-foreground = #FFFFFF

palette = 0=#000000
palette = 1=#FF2200
palette = 2=#73C48F
palette = 3=#FDAF1F
palette = 4=#4AAAD6
palette = 5=#F78C6C
palette = 6=#8DEEF9
palette = 7=#DEDEDE
palette = 8=#444444
palette = 9=#F96964
palette = 10=#6FC475
palette = 11=#FFCC00
palette = 12=#6DD2FA
palette = 13=#FFCB6B
palette = 14=#39B7C7
palette = 15=#FFFFFF
```

## Status
- [x] Define UI color mapping from helix
- [x] Define ANSI-16 collapse strategy
- [x] Draft theme content
- [ ] Create `themes/ghostty.toml`
- [ ] Validate in ghostty
