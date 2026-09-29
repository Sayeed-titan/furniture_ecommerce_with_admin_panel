/**
 * Bridges the rich-text editor (Tiptap, restricted to heading (H2/H3)/
 * bullet-list/numbered-list/bold/italic/link) and the plain-text subset
 * `renderPolicyContent` in src/lib/policy-markdown.tsx already knows how to
 * render: "## " heading, "### " sub-heading, "- " bullet, "1. " numbered,
 * "**bold**", "*italic*", "[text](url)" link. The storefront renderer and
 * stored content format stay a plain string — only the admin's input method
 * is visual instead of typed syntax.
 */

/** Only these schemes are ever rendered as a real link on the public
 *  storefront — anything else (javascript:, data:, etc.) renders as plain
 *  text instead. Shared with policy-markdown.tsx's public renderer. */
export function isSafeUrl(url: string): boolean {
  return /^(https?:\/\/|mailto:)/i.test(url.trim());
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const INLINE_PATTERN = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;

/** Escapes first, then applies bold, italic, and link syntax to the
 *  escaped text — so a literal "<" or "&" typed by an admin can never
 *  become real markup, and an unsafe URL scheme never becomes a real
 *  href, even inside the editor's own preview. */
function inlineToHtml(text: string): string {
  const escaped = escapeHtml(text);
  return escaped.replace(INLINE_PATTERN, (part) => {
    if (part.startsWith("**")) return `<strong>${part.slice(2, -2)}</strong>`;
    const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (linkMatch) {
      const [, label, url] = linkMatch;
      return isSafeUrl(url) ? `<a href="${url}">${label}</a>` : label;
    }
    if (part.startsWith("*")) return `<em>${part.slice(1, -1)}</em>`;
    return part;
  });
}

/** Converts stored policy markdown into HTML for the editor to load as its
 *  initial content. */
export function policyMarkdownToHtml(content: string): string {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: string[] = [];
  let paragraphLines: string[] = [];
  let listItems: string[] = [];
  let listType: "bullet" | "number" | null = null;

  const flushParagraph = () => {
    if (paragraphLines.length === 0) return;
    blocks.push(`<p>${inlineToHtml(paragraphLines.join(" "))}</p>`);
    paragraphLines = [];
  };
  const flushList = () => {
    if (listItems.length === 0) return;
    const tag = listType === "number" ? "ol" : "ul";
    blocks.push(`<${tag}>${listItems.map((item) => `<li><p>${inlineToHtml(item)}</p></li>`).join("")}</${tag}>`);
    listItems = [];
    listType = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push(`<h2>${inlineToHtml(line.slice(3).trim())}</h2>`);
      continue;
    }
    if (line.startsWith("### ")) {
      flushParagraph();
      flushList();
      blocks.push(`<h3>${inlineToHtml(line.slice(4).trim())}</h3>`);
      continue;
    }
    const numberedMatch = /^(\d+)\.\s+(.*)$/.exec(line);
    if (numberedMatch) {
      flushParagraph();
      if (listType === "bullet") flushList();
      listType = "number";
      listItems.push(numberedMatch[2]);
      continue;
    }
    if (line.startsWith("- ") || line.startsWith("· ")) {
      flushParagraph();
      if (listType === "number") flushList();
      listType = "bullet";
      listItems.push(line.slice(2).trim());
      continue;
    }
    if (line === "") {
      flushParagraph();
      flushList();
      continue;
    }
    flushList();
    paragraphLines.push(line);
  }
  flushParagraph();
  flushList();

  return blocks.join("") || "<p></p>";
}

type EditorTextNode = { type: "text"; text?: string; marks?: { type: string; attrs?: { href?: string } }[] };
type EditorNode = { type: string; attrs?: { level?: number }; content?: EditorNode[] };

function inlineFromNodes(nodes: EditorNode[] = []): string {
  return nodes
    .map((n) => {
      if (n.type !== "text") return "";
      const textNode = n as unknown as EditorTextNode;
      const text = textNode.text ?? "";
      const link = textNode.marks?.find((m) => m.type === "link");
      const bold = textNode.marks?.some((m) => m.type === "bold");
      const italic = textNode.marks?.some((m) => m.type === "italic");
      let out = text;
      if (bold) out = `**${out}**`;
      if (italic) out = `*${out}*`;
      if (link?.attrs?.href && isSafeUrl(link.attrs.href)) out = `[${out}](${link.attrs.href})`;
      return out;
    })
    .join("");
}

/** Converts the editor's JSON document back into the stored markdown
 *  subset — the inverse of policyMarkdownToHtml. */
export function policyDocToMarkdown(doc: EditorNode): string {
  const lines: string[] = [];
  for (const node of doc.content ?? []) {
    if (node.type === "heading") {
      const prefix = node.attrs?.level === 3 ? "###" : "##";
      lines.push(`${prefix} ${inlineFromNodes(node.content)}`, "");
    } else if (node.type === "bulletList") {
      for (const item of node.content ?? []) {
        const text = (item.content ?? []).map((p) => inlineFromNodes(p.content)).join(" ");
        lines.push(`- ${text}`);
      }
      lines.push("");
    } else if (node.type === "orderedList") {
      (node.content ?? []).forEach((item, i) => {
        const text = (item.content ?? []).map((p) => inlineFromNodes(p.content)).join(" ");
        lines.push(`${i + 1}. ${text}`);
      });
      lines.push("");
    } else if (node.type === "paragraph") {
      lines.push(inlineFromNodes(node.content), "");
    }
  }
  return lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
