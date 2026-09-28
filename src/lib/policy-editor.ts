/**
 * Bridges the rich-text editor (Tiptap, restricted to heading/bullet-list/
 * bold) and the plain-text subset `renderPolicyContent` in
 * src/lib/policy-markdown.tsx already knows how to render ("## " heading,
 * "- " bullet, "**bold**"). The storefront renderer and stored content
 * format are unchanged — only the admin's input method becomes visual
 * instead of typed syntax.
 */

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Escapes first, then applies **bold** on the escaped text — so a literal
 *  "<" or "&" typed by an admin can never become real markup. */
function inlineToHtml(text: string): string {
  return escapeHtml(text).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

/** Converts stored policy markdown into HTML for the editor to load as its
 *  initial content. */
export function policyMarkdownToHtml(content: string): string {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: string[] = [];
  let paragraphLines: string[] = [];
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length === 0) return;
    blocks.push(`<p>${inlineToHtml(paragraphLines.join(" "))}</p>`);
    paragraphLines = [];
  };
  const flushList = () => {
    if (listItems.length === 0) return;
    blocks.push(`<ul>${listItems.map((item) => `<li><p>${inlineToHtml(item)}</p></li>`).join("")}</ul>`);
    listItems = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push(`<h2>${inlineToHtml(line.slice(3).trim())}</h2>`);
      continue;
    }
    if (line.startsWith("- ") || line.startsWith("· ")) {
      flushParagraph();
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

type EditorTextNode = { type: "text"; text?: string; marks?: { type: string }[] };
type EditorNode = { type: string; content?: EditorNode[] };

function inlineFromNodes(nodes: EditorNode[] = []): string {
  return nodes
    .map((n) => {
      if (n.type !== "text") return "";
      const textNode = n as unknown as EditorTextNode;
      const bold = textNode.marks?.some((m) => m.type === "bold");
      const text = textNode.text ?? "";
      return bold ? `**${text}**` : text;
    })
    .join("");
}

/** Converts the editor's JSON document back into the stored markdown
 *  subset — the inverse of policyMarkdownToHtml. */
export function policyDocToMarkdown(doc: EditorNode): string {
  const lines: string[] = [];
  for (const node of doc.content ?? []) {
    if (node.type === "heading") {
      lines.push(`## ${inlineFromNodes(node.content)}`, "");
    } else if (node.type === "bulletList") {
      for (const item of node.content ?? []) {
        const text = (item.content ?? []).map((p) => inlineFromNodes(p.content)).join(" ");
        lines.push(`- ${text}`);
      }
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
