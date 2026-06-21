# AGENTS.md — @treecombinator/sdk-util

Small, pure, isomorphic helpers. Zero dependencies; works the same on server and client.

## cleanMarkdown(md, options?)
Serve markdown lean. Strips YAML frontmatter and HTML comments, optionally `[SOURCE/FONTE ...]`
tags (`stripSources: true`), and collapses runs of blank lines. Convention: store a RICH source file, serve a LEAN one to the reader.

```ts
import { cleanMarkdown } from "@treecombinator/sdk-util";
const lean = cleanMarkdown(rich, { stripSources: true });
```
