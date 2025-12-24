# Helix Theme Converter

> 🚧 Work in Progress

Convert Helix editor themes to tmTheme (for bat/TextMate) and OpenCode JSON formats.

## Usage

```bash
# Install dependencies
bun install

# Generate themes
bun run generate <name>
```

This reads `themes/<name>/helix.toml` and generates:
- `themes/<name>/theme.tmTheme` - for bat, TextMate, etc.
- `themes/<name>/opencode.json` - for OpenCode

## Adding a New Theme

1. Create a directory: `themes/<name>/`
2. Add your Helix theme: `themes/<name>/helix.toml`
3. Run: `bun run generate <name>`
4. Commit the results

## Example

```bash
bun run generate pop-dark
```

## Project Structure

```
.
├── src/                        # Converter library
│   ├── helix.ts                # Helix theme parser
│   ├── tmtheme.ts              # tmTheme converter
│   └── opencode.ts             # OpenCode converter
├── bin/
│   └── generate.ts             # CLI script
└── themes/
    └── <name>/
        ├── helix.toml          # Input
        ├── theme.tmTheme       # Output
        └── opencode.json       # Output
```
