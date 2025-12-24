# Converter Comparison

Evaluate which converter is best suited for VSCode JSON → tmTheme (+ Ghostty).

## Candidates

| Converter | Language | Location |
|-----------|----------|----------|
| vscode_theme_converter | Python | `vendor/converters/vscode_theme_converter` |
| json2tm | Rust | `vendor/converters/json2tm` |
| theme-converter | Rust | `vendor/converters/theme-converter` |
| code-theme-converter | Node | `vendor/converters/code-theme-converter` |

## Summary

| Converter | Input | tmTheme | Ghostty | ANSI | CLI | Quality |
|-----------|-------|---------|---------|------|-----|---------|
| vscode_theme_converter | file (JSONC) | 14 colors | manual | yes | good | high |
| json2tm | file (JSONC) | 6 colors | no | no | minimal | low |
| theme-converter | file (JSON) | 2 colors | no | no | none (lib) | medium |
| code-theme-converter | git URL only | 10 colors | no | no | fair | medium |

**Recommendation:** `vscode_theme_converter` — most complete mapping, ANSI support, Ghostty workflow (manual but documented).

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

| Criterion | vscode_theme_converter | json2tm | theme-converter | code-theme-converter |
|-----------|------------------------|---------|-----------------|----------------------|
| Local file | yes | yes | yes | **no (git URL only)** |
| JSONC | yes | yes | no | yes |
| tokenColors | yes | yes | yes | yes |
| colors object | 14 fields | 6 fields | 2 fields | 10 fields |
| include/inheritance | rejects | ignores | ignores | ignores |

### 2. tmTheme Output Quality

| Criterion | vscode_theme_converter | json2tm | theme-converter | code-theme-converter |
|-----------|------------------------|---------|-----------------|----------------------|
| Scope preservation | yes | yes | yes | yes |
| Font styles | yes | yes | yes | yes |
| Compound scopes | yes | yes | yes | yes |
| Valid plist | yes | yes | yes | yes |

### 3. Extras

| Criterion | vscode_theme_converter | json2tm | theme-converter | code-theme-converter |
|-----------|------------------------|---------|-----------------|----------------------|
| Ghostty | manual workflow | no | no | no |
| ANSI-16 mapping | yes | no | no | no |
| CLI usability | good | minimal | none | fair |

### 4. Maintainability

| Criterion | vscode_theme_converter | json2tm | theme-converter | code-theme-converter |
|-----------|------------------------|---------|-----------------|----------------------|
| Tests | no | no | no | yes (partial) |
| Docs | good README | minimal | minimal | minimal |
| Code quality | high | low | medium | medium |
| Easy to patch | yes | yes | yes | yes |

---

## Recommendation

**Use `vscode_theme_converter`** for:
1. Most complete VSCode → tmTheme color mapping (14 fields vs 2-10 in others)
2. ANSI-16 mapping system for terminal theme consistency
3. Workflow for Ghostty (manual but supported)
4. Best code quality and maintainability

**Fallback:** Extract `toTmTheme()` logic from `code-theme-converter` if Node is preferred, but fix the bugs first.

**Avoid:** `json2tm` and `theme-converter` map too few colors to be useful for a complete theme port.
