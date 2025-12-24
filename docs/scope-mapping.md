# Helix → tmTheme Scope Mapping

This document defines the canonical mapping from helix scopes to TextMate scopes.
It drives generation of tmTheme files for bat, opencode, and potentially others.

## Overview

Helix uses tree-sitter scopes which are similar to Sublime Text / TextMate scopes.
Most mappings are direct (1:1), some require translation.

## Scope Categories

### Direct Mappings (1:1)
These helix scopes map directly to tmTheme with identical names:
- `comment`, `comment.line`, `comment.block`, `comment.line.documentation`, `comment.block.documentation`
- `string`, `string.regexp`
- `constant`, `constant.numeric`, `constant.character`, `constant.character.escape`
- `variable`, `variable.parameter`
- `keyword`, `keyword.control`, `keyword.operator`
- `markup.heading`, `markup.bold`, `markup.italic`, `markup.quote`, `markup.raw`, `markup.list`

### Translated Mappings
These helix scopes need translation to tmTheme equivalents:

| Helix | tmTheme |
|-------|---------|
| `function` | `entity.name.function` |
| `function.builtin` | `support.function` |
| `function.method` | `entity.name.function.method` |
| `function.macro` | `entity.name.function.macro` |
| `type` | `entity.name.type` |
| `type.builtin` | `support.type` |
| `type.enum.variant` | `entity.name.type.enum` |
| `variable.builtin` | `variable.language` |
| `variable.other.member` | `variable.other.member` |
| `variable.function` | `variable.function` |
| `constant.builtin` | `constant.language` |
| `tag` | `entity.name.tag` |
| `attribute` | `entity.other.attribute-name` |
| `namespace` | `entity.name.namespace` |
| `constructor` | `entity.name.function.constructor` |
| `label` | `entity.name.label` |
| `module` | `entity.name.module` |
| `operator` | `keyword.operator` |
| `punctuation` | `punctuation` |
| `punctuation.delimiter` | `punctuation.separator` |
| `punctuation.bracket` | `punctuation.bracket` |
| `string.special` | `string.other` |
| `string.special.path` | `string.other.path` |
| `string.special.url` | `string.other.link` |
| `string.special.symbol` | `constant.other.symbol` |
| `keyword.function` | `storage.type.function` |
| `keyword.directive` | `keyword.other.directive` |
| `keyword.control.repeat` | `keyword.control.loop` |
| `special` | `keyword.other` |

### Helix-only (no tmTheme equivalent)
These scopes are helix UI/editor specific and don't map to tmTheme:
- `ui.*` — editor UI elements
- `diagnostic.*` — LSP diagnostics
- `error`, `warning`, `hint`, `info` — gutter indicators
- `diff.*` — version control markers

## Color Assignment

Colors come from the helix theme's `[palette]` section.
The mapping preserves the helix scope → color assignments exactly.

For each scope, we emit:
- `foreground` — from helix `fg`
- `background` — from helix `bg` (if present)
- `fontStyle` — from helix `modifiers` (bold, italic, underline)

## Generator

A TypeScript program (`scripts/generate-tmtheme.ts`) will:

1. Parse `themes/helix.toml` to extract palette and scope definitions
2. Apply the scope mapping above
3. Emit `themes/bat.tmTheme` (XML plist format)

Reference implementations for tmTheme structure:
- `vendor/converters/vscode_theme_converter/src/vscode_theme_converter/tm_theme.py`
- `vendor/converters/json2tm/src/tm.rs`
- `vendor/converters/code-theme-converter/src/sublime/tmTheme.ts`

Run with: `bun run scripts/generate-tmtheme.ts`

## Notes

1. tmTheme uses XML plist format — can use a plist library or template strings
2. Scope specificity: tmTheme matches longest prefix, same as helix
3. Multiple scopes can share a rule via comma-separated scope strings
