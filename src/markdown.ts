/**
 * Serve markdown lean: strip the rich-source bits that shouldn't reach the reader.
 * The convention: store a RICH file (frontmatter, internal notes), serve a LEAN one to
 * the reader. Pure + isomorphic (works on server and client).
 */
export interface CleanMarkdownOptions {
  /** Also strip `[FONTE/SOURCE ...]` citation tags (editorial). Default: false. */
  stripSources?: boolean;
}

export function cleanMarkdown(md: string, options?: CleanMarkdownOptions): string {
  // YAML frontmatter — the closing delimiter must be a whole "---" line, so a leading hr isn't swallowed.
  let out = md.replace(/^---\r?\n[\s\S]*?\r?\n---[ \t]*(?:\r?\n|$)/, "");
  out = outsideFences(out, (text) => {
    let t = text.replace(/<!--[\s\S]*?-->/g, ""); // HTML comments (internal notes)
    if (options?.stripSources) {
      // Citation tags only — a markdown link like `[Source code](url)` is kept (lookahead on "(").
      t = t.replace(/\[(?:FONTE|SOURCE)S?\b[^\]]*\](?!\()/gi, "");
    }
    return t;
  });
  return out.replace(/\n{3,}/g, "\n\n").trim(); // collapse blank lines + trim
}

/** Apply `transform` only to text outside fenced code blocks (``` or ~~~), leaving code samples intact. */
function outsideFences(md: string, transform: (text: string) => string): string {
  const out: string[] = [];
  let plain: string[] = [];
  let fence: string | null = null;
  const flush = () => {
    if (plain.length) {
      out.push(transform(plain.join("\n")));
      plain = [];
    }
  };
  for (const line of md.split("\n")) {
    if (fence) {
      out.push(line);
      if (line.trimStart().startsWith(fence)) fence = null;
      continue;
    }
    const open = /^(```|~~~)/.exec(line.trimStart())?.[1];
    if (open) {
      flush();
      fence = open;
      out.push(line);
    } else {
      plain.push(line);
    }
  }
  flush();
  return out.join("\n");
}
