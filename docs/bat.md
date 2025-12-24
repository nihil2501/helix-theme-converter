# bat Theme

tmTheme format for [bat](https://github.com/sharkdp/bat) syntax highlighting.

**Output:** `themes/bat.tmTheme`
**Generator:** `bun run scripts/generate-bat.ts`

## Format

tmTheme is an XML plist format used by TextMate, Sublime Text, bat, and other tools.

## Global Settings

| tmTheme Setting | Helix Scope | Extraction |
|-----------------|-------------|------------|
| `background` | `ui.background` | bg |
| `foreground` | `ui.text` | fg |
| `caret` | `ui.cursor` | bg |
| `selection` | `ui.selection` | bg |
| `lineHighlight` | `ui.cursorline` | bg |
| `gutterForeground` | `ui.linenr` | fg |

## Scope Mapping

### Direct Mappings

Helix scopes that map directly to tmTheme (identical names):

| Scope |
|-------|
| `comment` |
| `comment.line` |
| `comment.block` |
| `comment.block.documentation` |
| `string` |
| `string.regexp` |
| `constant` |
| `constant.numeric` |
| `constant.character` |
| `constant.character.escape` |
| `variable` |
| `variable.parameter` |
| `keyword` |
| `keyword.control` |
| `keyword.operator` |
| `operator` |
| `punctuation` |
| `markup.heading` |
| `markup.bold` |
| `markup.italic` |
| `markup.strikethrough` |
| `markup.quote` |
| `markup.raw` |
| `markup.list` |

### Translated Mappings

Helix → tmTheme scope translations:

| Helix Scope | tmTheme Scope |
|-------------|---------------|
| `function` | `entity.name.function` |
| `function.method` | `entity.name.function.method` |
| `function.macro` | `entity.name.function.macro` |
| `function.builtin` | `support.function` |
| `constructor` | `entity.name.function.constructor` |
| `type` | `entity.name.type` |
| `type.builtin` | `support.type` |
| `type.enum.variant` | `entity.name.type.enum` |
| `tag` | `entity.name.tag` |
| `attribute` | `entity.other.attribute-name` |
| `namespace` | `entity.name.namespace` |
| `module` | `entity.name.module` |
| `label` | `entity.name.label` |
| `variable.builtin` | `variable.language` |
| `variable.other.member` | `variable.other.member` |
| `variable.function` | `variable.function` |
| `constant.builtin` | `constant.language` |
| `string.special.symbol` | `constant.other.symbol` |
| `string.special` | `string.other` |
| `string.special.url` | `string.other.link` |
| `keyword.function` | `storage.type.function` |
| `keyword.directive` | `keyword.other.directive` |
| `keyword.control.repeat` | `keyword.control.loop` |
| `keyword.control.import` | `keyword.control.import` |
| `keyword.control.return` | `keyword.control.return` |
| `keyword.control.exception` | `keyword.control.exception` |
| `special` | `keyword.other` |
| `punctuation.delimiter` | `punctuation.separator` |
| `punctuation.bracket` | `punctuation.bracket` |

### Markup

| Helix Scope | tmTheme Scope |
|-------------|---------------|
| `markup.heading.1` | `markup.heading.1` |
| `markup.heading.2` | `markup.heading.2` |
| `markup.heading.3` | `markup.heading.3` |
| `markup.heading.4` | `markup.heading.4` |
| `markup.heading.5` | `markup.heading.5` |
| `markup.heading.6` | `markup.heading.6` |
| `markup.link` | `markup.link` |
| `markup.link.url` | `markup.link.url` |
| `markup.list.numbered` | `markup.list.numbered` |
| `markup.list.unnumbered` | `markup.list.unnumbered` |
| `markup.raw.inline` | `markup.raw.inline` |
| `markup.raw.block` | `markup.raw.block` |

### Diff

| Helix Scope | tmTheme Scope |
|-------------|---------------|
| `diff.plus` | `markup.inserted` |
| `diff.minus` | `markup.deleted` |
| `diff.delta` | `markup.changed` |

## Font Styles

| Helix Modifier | tmTheme fontStyle |
|----------------|-------------------|
| `bold` | `bold` |
| `italic` | `italic` |
| `underline` | `underline` |
| `crossed_out` | `strikethrough` |

Multiple modifiers combine: `bold italic` → `"bold italic"`

## Installation

```bash
# Generate theme
bun run scripts/generate-bat.ts

# Install for bat
cp themes/bat.tmTheme ~/.config/bat/themes/pop-dark.tmTheme
bat cache --build

# Use
bat --theme="pop-dark" <file>
```
