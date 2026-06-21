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
  let out = md.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, ""); // YAML frontmatter
  out = out.replace(/<!--[\s\S]*?-->/g, ""); // HTML comments (internal notes)
  if (options?.stripSources) {
    out = out.replace(/\[(?:FONTE|SOURCE|FONTES|SOURCES)[^\]]*\]/gi, "");
  }
  return out.replace(/\n{3,}/g, "\n\n").trim(); // collapse blank lines + trim
}
