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
  // A fence is a run of 3+ backticks or tildes; only a run of the same character at least as
  // long as the opener closes it, so ``` inside a ```` block stays part of the code sample.
  const fenceRun = (line: string) => /^(`{3,}|~{3,})/.exec(line.trimStart())?.[1];
  for (const line of md.split("\n")) {
    if (fence) {
      out.push(line);
      const run = fenceRun(line);
      if (run && run[0] === fence[0] && run.length >= fence.length) fence = null;
      continue;
    }
    const open = fenceRun(line);
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
