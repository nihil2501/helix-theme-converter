# opencode Theme

Custom JSON format for [opencode](https://github.com/sst/opencode) TUI.

**Output:** `themes/opencode.json`
**Generator:** `bun run scripts/generate-opencode.ts`

## Format

opencode uses a custom JSON theme format with 53 color fields organized into categories. Themes are placed in `.opencode/themes/` or `~/.config/opencode/themes/`.

Reference: `vendor/tuis/opencode/packages/opencode/src/cli/cmd/tui/context/theme.tsx`

## Theme Structure

```json
{
  "$schema": "https://opencode.ai/theme.json",
  "defs": { /* palette definitions */ },
  "theme": { /* color assignments */ }
}
```

## Color Categories (53 fields)

### UI Semantic (7)

| Field | Helix Scope | Notes |
|-------|-------------|-------|
| `primary` | — | Primary accent (use blueH) |
| `secondary` | — | Secondary accent (use redL) |
| `accent` | — | Accent color (use blueH) |
| `error` | `error` | Error color |
| `warning` | `warning` | Warning color |
| `success` | — | Success color (use greenN) |
| `info` | `info` | Info color |

### Text (3)

| Field | Helix Scope |
|-------|-------------|
| `text` | `ui.text` fg |
| `textMuted` | `comment` fg |
| `selectedListItemText` | `ui.background` bg |

### Background (4)

| Field | Helix Scope |
|-------|-------------|
| `background` | `ui.background` bg |
| `backgroundPanel` | `ui.window` bg |
| `backgroundElement` | `ui.cursorline` bg |
| `backgroundMenu` | `ui.help` bg |

### Border (3)

| Field | Helix Scope |
|-------|-------------|
| `border` | `ui.window` fg |
| `borderActive` | `ui.selection` bg |
| `borderSubtle` | `ui.virtual` fg |

### Diff (12)

| Field | Helix Scope |
|-------|-------------|
| `diffAdded` | `diff.plus` fg |
| `diffRemoved` | `diff.minus` fg |
| `diffContext` | `diff.delta` fg |
| `diffHunkHeader` | `diff.delta` fg |
| `diffHighlightAdded` | `diff.plus` fg |
| `diffHighlightRemoved` | `diff.minus` fg |
| `diffAddedBg` | `diff.plus.gutter` bg |
| `diffRemovedBg` | `diff.minus.gutter` bg |
| `diffContextBg` | `ui.background` bg |
| `diffLineNumber` | `ui.linenr` fg |
| `diffAddedLineNumberBg` | `diff.plus.gutter` bg |
| `diffRemovedLineNumberBg` | `diff.minus.gutter` bg |

### Markdown (14)

| Field | Helix Scope |
|-------|-------------|
| `markdownText` | `ui.text` fg |
| `markdownHeading` | `markup.heading` fg |
| `markdownLink` | `markup.link` fg |
| `markdownLinkText` | `markup.link.text` fg |
| `markdownCode` | `markup.raw` fg |
| `markdownBlockQuote` | `markup.quote` fg |
| `markdownEmph` | `markup.italic` fg |
| `markdownStrong` | `markup.bold` fg |
| `markdownHorizontalRule` | `ui.virtual` fg |
| `markdownListItem` | `markup.list` fg |
| `markdownListEnumeration` | `markup.list` fg |
| `markdownImage` | `markup.link` fg |
| `markdownImageText` | `markup.link.text` fg |
| `markdownCodeBlock` | `markup.raw.block` fg |

### Syntax (9)

| Field | Helix Scope |
|-------|-------------|
| `syntaxComment` | `comment` fg |
| `syntaxKeyword` | `keyword` fg |
| `syntaxFunction` | `function` fg |
| `syntaxVariable` | `variable` fg |
| `syntaxString` | `string` fg |
| `syntaxNumber` | `constant.numeric` fg |
| `syntaxType` | `type` fg |
| `syntaxOperator` | `operator` fg |
| `syntaxPunctuation` | `punctuation` fg |

## Syntax Highlighting

opencode uses tree-sitter with nvim-treesitter highlight queries. The 9 `syntax*` colors are mapped to tree-sitter capture names via `getSyntaxRules()` in theme.tsx.

Key mappings from tree-sitter captures to syntax colors:

| Tree-sitter Capture | Syntax Color |
|---------------------|--------------|
| `comment`, `comment.documentation` | `syntaxComment` |
| `string`, `symbol`, `character.special` | `syntaxString` |
| `number`, `boolean`, `constant` | `syntaxNumber` |
| `keyword`, `keyword.*` | `syntaxKeyword` |
| `function`, `variable.member`, `constructor` | `syntaxFunction` |
| `variable`, `variable.parameter`, `property`, `parameter` | `syntaxVariable` |
| `type`, `module`, `class` | `syntaxType` |
| `operator`, `keyword.operator`, `punctuation.delimiter` | `syntaxOperator` |
| `punctuation`, `punctuation.bracket` | `syntaxPunctuation` |

## Installation

```bash
# Generate theme
bun run scripts/generate-opencode.ts

# Install (option 1: global)
cp themes/opencode.json ~/.config/opencode/themes/pop-dark.json

# Install (option 2: project-local)
cp themes/opencode.json .opencode/themes/pop-dark.json

# Use (in opencode config or via /theme command)
```
