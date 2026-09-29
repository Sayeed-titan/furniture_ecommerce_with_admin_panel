import { PolicySection } from "@/components/site/policy-layout";
import { isSafeUrl } from "@/lib/policy-editor";

/**
 * Minimal, safe renderer for admin-edited policy content (see
 * src/lib/policy-content.ts for the default text and syntax it supports):
 * "## Heading" starts a new section, "### Sub-heading" a sub-heading inside
 * one, "- " / "· " starts a bullet list, "1. " starts a numbered list,
 * "**bold**", "*italic*", "[text](url)" a link (http/https/mailto only —
 * anything else renders as plain text, never a real link), and blank lines
 * separate paragraphs. No HTML is ever parsed from the input — admin-entered
 * text can't inject markup, since every piece of text is rendered as React
 * text nodes, never dangerouslySetInnerHTML.
 */
const INLINE_PATTERN = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  return text.split(INLINE_PATTERN).map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (linkMatch) {
      const [, label, url] = linkMatch;
      return isSafeUrl(url) ? (
        <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
          {label}
        </a>
      ) : (
        <span key={key}>{label}</span>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }
    return <span key={key}>{part}</span>;
  });
}

export function renderPolicyContent(content: string): React.ReactNode {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];

  let currentHeading: string | null = null;
  let currentBody: React.ReactNode[] = [];
  let paragraphLines: string[] = [];
  let listItems: string[] = [];
  let listType: "bullet" | "number" | null = null;

  const flushParagraph = (key: string) => {
    if (paragraphLines.length === 0) return;
    currentBody.push(<p key={key}>{renderInline(paragraphLines.join(" "), key)}</p>);
    paragraphLines = [];
  };

  const flushList = (key: string) => {
    if (listItems.length === 0) return;
    const items = listItems;
    const ordered = listType === "number";
    listItems = [];
    listType = null;
    const ListTag = ordered ? "ol" : "ul";
    currentBody.push(
      <ListTag key={key} className={ordered ? "list-decimal space-y-1 pl-5" : "list-disc space-y-1 pl-5"}>
        {items.map((item, i) => (
          <li key={`${key}-${i}`}>{renderInline(item, `${key}-${i}`)}</li>
        ))}
      </ListTag>
    );
  };

  const flushSection = (key: string) => {
    flushParagraph(`${key}-p`);
    flushList(`${key}-l`);
    if (currentHeading !== null) {
      blocks.push(
        <PolicySection key={key} heading={currentHeading}>
          {currentBody}
        </PolicySection>
      );
    } else if (currentBody.length > 0) {
      blocks.push(
        <div key={key} className="space-y-3 text-sm leading-relaxed">
          {currentBody}
        </div>
      );
    }
    currentBody = [];
  };

  lines.forEach((rawLine, i) => {
    const line = rawLine.trim();
    if (line.startsWith("## ")) {
      flushSection(`section-${i}`);
      currentHeading = line.slice(3).trim();
      return;
    }
    if (line.startsWith("### ")) {
      flushParagraph(`p-${i}`);
      flushList(`l-${i}`);
      currentBody.push(
        <p key={`h3-${i}`} className="font-semibold text-neutral-900">
          {renderInline(line.slice(4).trim(), `h3-${i}`)}
        </p>
      );
      return;
    }
    const numberedMatch = /^\d+\.\s+(.*)$/.exec(line);
    if (numberedMatch) {
      flushParagraph(`p-${i}`);
      if (listType === "bullet") flushList(`l-${i}`);
      listType = "number";
      listItems.push(numberedMatch[1]);
      return;
    }
    if (line.startsWith("- ") || line.startsWith("· ")) {
      flushParagraph(`p-${i}`);
      if (listType === "number") flushList(`l-${i}`);
      listType = "bullet";
      listItems.push(line.slice(2).trim());
      return;
    }
    if (line === "") {
      flushParagraph(`p-${i}`);
      flushList(`l-${i}`);
      return;
    }
    flushList(`l-${i}`);
    paragraphLines.push(line);
  });
  flushSection("section-final");

  return <>{blocks}</>;
}
