# headless-content-manager

A CLI tool for converting [SlateJS](https://www.slatejs.org/) rich-text JSON into [Lexical](https://lexical.dev/) JSON or HTML. Part of the [dictyBase](https://dictybase.org/) ecosystem — it migrates rich-text content from the older SlateJS editor to the newer Lexical editor format, and can persist converted content to the dictyBase content management gRPC service.

## Features

- **SlateJS → HTML**: Convert SlateJS JSON documents to HTML
- **SlateJS → Lexical**: Convert SlateJS JSON to Lexical editor JSON state
- **Legacy format support**: Handles an older SlateJS structure with `nodes`, `leaves`, and `marks`
- **Batch conversion**: Convert entire directories of SlateJS files at once
- **gRPC integration**: Store converted content to the dictyBase content service; query strain data from the stock service
- **Custom Lexical nodes**: Custom `ImageNode` (decorator) and `FlexLayoutNode` (element)

## Tech Stack

| Category | Technology |
|---|---|
| Runtime | [Bun](https://bun.sh) |
| Language | TypeScript (strict mode) |
| Rich-text | `lexical`, `@lexical/headless`, `@lexical/html`, `@lexical/link`, `@lexical/list`, `@lexical/rich-text`, `@lexical/table` |
| CLI | `commander` |
| DOM simulation | `jsdom` |
| FP utilities | `fp-ts`, `ts-pattern` |
| gRPC | `@connectrpc/connect`, `@bufbuild/protobuf` |
| Testing | Bun's built-in test runner (`bun:test`) |

## Architecture

```
SlateJS JSON → JSDOM elements → Lexical Headless Editor → Lexical JSON / HTML
```

The pipeline operates entirely headless (no browser needed). SlateJS blocks are parsed via pattern matching (`ts-pattern`), converted to DOM nodes via `jsdom`, then imported into a headless Lexical editor that produces the final output.

```
src/
├── converter.ts          # SlateJS → Lexical / HTML (current format)
├── legacyConverter.ts    # SlateJS → Lexical / HTML (legacy format)
├── extract.ts            # Current-format block-to-DOM extraction
├── extractLegacy.ts      # Legacy-format block-to-DOM extraction
├── editor.ts             # Headless Lexical editor setup
├── handlers.ts           # DOM element creation & formatting
├── types.ts              # SlateJS JSON type definitions
├── loader.ts             # Batch convert + persist to gRPC content service
├── grpc.ts               # gRPC client factories (content & stock services)
├── retriever.ts          # Strain data fetcher from stock gRPC service
├── ImageNode.tsx          # Custom Lexical Image decorator node
├── FlexLayoutNode.ts     # Custom Lexical FlexLayout element node
├── __tests__/            # Test suite
└── es/dictybase/         # Generated protobuf/gRPC stubs
```

## Quick Start

### Install

```bash
bun install
```

### Run

```bash
bun run index.ts <command> [options]
```

## Commands

### Single-file conversion

```bash
# SlateJS → HTML
bun run index.ts slate-to-html -f ./input.json

# SlateJS → Lexical JSON
bun run index.ts slate-to-lexical -f ./input.json

# Legacy SlateJS → HTML
bun run index.ts legacy-slate-to-html -f ./legacy-input.json

# Legacy SlateJS → Lexical JSON
bun run index.ts legacy-slate-to-lexical -f ./legacy-input.json
```

### Batch conversion

```bash
# Batch SlateJS → HTML
bun run index.ts batch-slate-to-html -i ./slatejs/ -o ./html-output/

# Batch SlateJS → Lexical JSON
bun run index.ts batch-slate-to-lexical -i ./slatejs/ -o ./lexical-output/
```

### gRPC operations

```bash
# Query strain info from stock service
bun run index.ts strain-info -i DBS0234567 -a stock-api -p 8080
```

### Loader (batch convert + persist)

The `loader.ts` module provides `loadLexicalContent(dir)` for batch-converting a directory of SlateJS files and persisting them via the `ContentService.storeContent` gRPC endpoint.

## Testing

```bash
bun test
```

Uses Bun's built-in test runner with `jsdom` for DOM simulation.