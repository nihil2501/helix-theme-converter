# Converter Comparison

Evaluate which converter is best suited for VSCode JSON → tmTheme (+ Ghostty).

## Candidates

| Converter | Language | Location |
|-----------|----------|----------|
| vscode_theme_converter | Python | `vendor/converters/vscode_theme_converter` |
| json2tm | Rust | `vendor/converters/json2tm` |
| theme-converter | Rust | `vendor/converters/theme-converter` |
| code-theme-converter | Node | `vendor/converters/code-theme-converter` |
| root-loops | Svelte/TS | `vendor/converters/root-loops` |

## Summary

| Converter | Input | tmTheme | Ghostty | ANSI | CLI | Quality |
|-----------|-------|---------|---------|------|-----|---------|
| vscode_theme_converter | file (JSONC) | 14 colors | manual | yes | good | high |
| json2tm | file (JSONC) | 6 colors | no | no | minimal | low |
| theme-converter | file (JSON) | 2 colors | no | no | none (lib) | medium |
| code-theme-converter | git URL only | 10 colors | no | no | fair | medium |
| root-loops | params (generator) | N/A | yes | yes | web only | high |

**Recommendation:** `vscode_theme_converter` — most complete mapping, ANSI support, Ghostty workflow (manual but documented).

**Alternative:** `root-loops` export modules are excellent reference implementations for Ghostty/Helix/VSCode formats, even though it's a generator not a converter.

---

## Detailed Analysis

### vscode_theme_converter (Python)

**Input Handling:**
- JSONC via `json5` library
- Validates with Pydantic models
- Rejects themes with `include` — requires compiled themes
- Normalizes tokenColors (deduplicates, splits comma-separated scopes)

**tmTheme Mapping (14 fields):**
| tmTheme | VSCode |
|---------|--------|
| background | editor.background |
| foreground | editor.foreground |
| caret | editorCursor.foreground |
| lineHighlight | editor.lineHighlightBackground |
| selection | editor.selectionBackground |
| selectionForeground | editor.selectionForeground |
| inactiveSelection | editor.inactiveSelectionBackground |
| highlight | editor.findMatchBorder |
| findHighlight | editor.findMatchBackground |
| findHighlightForeground | editor.findMatchForeground |
| guide | editorIndentGuide.background |
| activeGuide | editorIndentGuide.activeBackground |
| gutter | editorGutter.background |
| gutterForeground | editorLineNumber.foreground |

**ANSI-16 Mapping:**
- Generates mapping template from theme colors
- Replaces RGB with bat's ANSI encoding (`#02000000` for green, etc.)
- Manual assignment required but tooling helps

**Ghostty:**
- Does NOT auto-generate Ghostty configs
- Provides examples in `themes/` and `print-terminal-colors` command
- ANSI palette must be manually created

**CLI:** `convert`, `ansi-map-gen`, `ansi-map-show`, `print-terminal-colors`, `check-contrast`

**Code Quality:** High — Pydantic, mypy strict, ruff, clear separation.

---

### json2tm (Rust)

**Input Handling:**
- JSONC via `json_comments` crate
- No validation — panics on any error
- Handles both string and array scopes

**tmTheme Mapping (6 fields only):**
| tmTheme | VSCode |
|---------|--------|
| background | editor.background |
| caret | editorCursor.foreground |
| foreground | editor.foreground |
| invisibles | editorWhitespace.foreground |
| lineHighlight | editor.lineHighlightBackground |
| selection | editor.selectionBackground |

**Limitations:**
- No error handling (`.unwrap()` everywhere)
- Drops all other colors silently
- No tests, minimal docs

**CLI:** `json2tm <input.json> <output.tmTheme>` — bare minimum

**Code Quality:** Low — ~140 LOC, clean structure but fragile.

---

### theme-converter (Rust)

**Input Handling:**
- JSON only (no JSONC support)
- Handles tokenColors well
- Uses `anyhow` for error propagation

**tmTheme Mapping (2 fields only):**
| tmTheme | VSCode |
|---------|--------|
| foreground | editor.foreground |
| background | editor.background |

**Bug:** Tries to map `editor.fontStyle` which doesn't exist in VSCode.

**Limitations:**
- Library only — no CLI binary
- Would need wrapper code to use
- No tests

**Code Quality:** Medium — good Rust idioms, extensible via `Parser` trait.

---

### code-theme-converter (Node/TypeScript)

**Input Handling:**
- **Git URL only** — cannot process local files directly
- JSONC via `json5`
- Clones repo to temp dir, finds themes

**tmTheme Mapping (10 fields):**
| tmTheme | VSCode |
|---------|--------|
| accent | list.highlightForeground |
| background | editor.background |
| caret | editorCursor.background / editor.foreground |
| foreground | editor.foreground |
| lineHighlight | editor.lineHighlightBackground |
| selection | editor.selectionBackground |
| activeGuide | editorIndentGuide.background |
| findHighlight | editor.findMatchHighlightBackground |
| misspelling | editorError.foreground |

**Extras:**
- Auto-generates GitGutter scopes (Sublime plugin)
- Also outputs `.sublime-color-scheme` format

**Bugs:**
- Syntax error in error handling (`convert.ts:89`)
- Promise handling race conditions
- `download-git-repo` dep last updated 2018

**CLI:** `code2subl <repo-url> [-T as-tmTheme]`

**Code Quality:** Medium — TypeScript types, but maintenance issues.

---

## Evaluation Checklist

### 1. Input Handling

| Criterion | vscode_theme_converter | json2tm | theme-converter | code-theme-converter | root-loops |
|-----------|------------------------|---------|-----------------|----------------------|------------|
| Local file | yes | yes | yes | **no (git URL only)** | **no (generator)** |
| JSONC | yes | yes | no | yes | N/A |
| tokenColors | yes | yes | yes | yes | N/A |
| colors object | 14 fields | 6 fields | 2 fields | 10 fields | N/A |
| include/inheritance | rejects | ignores | ignores | ignores | N/A |

### 2. tmTheme Output Quality

| Criterion | vscode_theme_converter | json2tm | theme-converter | code-theme-converter | root-loops |
|-----------|------------------------|---------|-----------------|----------------------|------------|
| Scope preservation | yes | yes | yes | yes | N/A |
| Font styles | yes | yes | yes | yes | N/A |
| Compound scopes | yes | yes | yes | yes | N/A |
| Valid plist | yes | yes | yes | yes | N/A |

### 3. Extras

| Criterion | vscode_theme_converter | json2tm | theme-converter | code-theme-converter | root-loops |
|-----------|------------------------|---------|-----------------|----------------------|------------|
| Ghostty | manual workflow | no | no | no | yes (export) |
| Helix | no | no | no | no | yes (export) |
| VSCode | input format | no | no | no | yes (export) |
| ANSI-16 mapping | yes | no | no | no | yes |
| CLI usability | good | minimal | none | fair | web only |

### 4. Maintainability

| Criterion | vscode_theme_converter | json2tm | theme-converter | code-theme-converter | root-loops |
|-----------|------------------------|---------|-----------------|----------------------|------------|
| Tests | no | no | no | yes (partial) | yes |
| Docs | good README | minimal | minimal | minimal | moderate |
| Code quality | high | low | medium | medium | high |
| Easy to patch | yes | yes | yes | yes | yes |

---

## Recommendation

**Use `vscode_theme_converter`** for:
1. Most complete VSCode → tmTheme color mapping (14 fields vs 2-10 in others)
2. ANSI-16 mapping system for terminal theme consistency
3. Workflow for Ghostty (manual but supported)
4. Best code quality and maintainability

**Fallback:** Extract `toTmTheme()` logic from `code-theme-converter` if Node is preferred, but fix the bugs first.

**Avoid:** `json2tm` and `theme-converter` map too few colors to be useful for a complete theme port.

---

## root-loops (Svelte/TypeScript)

**Not a converter** — a web-based color scheme **generator** with export capabilities.

**What it is:**
- Interactive UI at https://rootloops.sh
- Generates 16 ANSI colors + fg/bg from "recipe" parameters
- Uses OkHSL color space for perceptually uniform colors

**Export Formats (18 targets):**
| Category | Formats |
|----------|---------|
| Terminals | Alacritty, Foot, Ghostty, iTerm2, Kitty, Tabby, Warp, WezTerm, Windows Terminal, Xresources |
| Editors | VSCode (180+ UI colors), Helix (90+ tokens), vim, neovim |
| CLI | fzf, Zellij |
| General | JSON, Nix |

**Useful for our task:**
- **Ghostty exporter** (`src/lib/export/ghostty.ts`) — reference for format
- **Helix exporter** (`src/lib/export/helix.ts`) — 90+ semantic tokens mapped
- **VSCode exporter** (`src/lib/export/vscode.ts`) — 180+ UI colors + TextMate rules
- **textmate.ts** — shared TextMate syntax scope definitions

**Limitations:**
- No CLI — web-only
- Cannot import existing themes
- Generates from parameters, not converts

**Code Quality:** High — TypeScript, tested, modular exporters.

**Value:** Reference implementation for export format structure, not a conversion tool.
