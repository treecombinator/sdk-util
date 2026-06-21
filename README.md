# @treecombinator/sdk-util

---

> Developed by Danthur Lice.\
> Copyright © 2026 Tree Combinator.\
> Contact: dev (at) treecombinator.com

---

The **utilities** of the Tree Combinator SDK — small, pure, isomorphic helpers (today `cleanMarkdown`) with zero runtime dependencies, safe to drop into either the server or the client.

## Install

```bash
npm install github:treecombinator/sdk-util
```

## Use

```ts
import { cleanMarkdown } from "@treecombinator/sdk-util";

// store a RICH markdown file, serve a LEAN one to the reader
const lean = cleanMarkdown(rich, { stripSources: true });
```

`cleanMarkdown(md, options?)` strips YAML frontmatter and HTML comments, optionally the `[SOURCE/FONTE …]` citation tags (`stripSources: true`), and collapses runs of blank lines. Pure and isomorphic — identical result on server and client.
