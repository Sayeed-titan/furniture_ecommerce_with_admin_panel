import { PolicySection } from "@/components/site/policy-layout";

/**
 * Minimal, safe renderer for admin-edited policy content (see
 * src/lib/policy-content.ts for the default text and syntax it supports):
 * "## Heading" starts a new section, "- " / "· " starts a bullet list,
 * "**text**" is bold, and blank lines separate paragraphs. No HTML is ever
 * parsed from the input — admin-entered text can't inject markup, since
 * every piece of text is rendered as React text nodes, never dangerouslySetInnerHTML.
 */
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={`${keyPrefix}-${i}`}>{part}</span>
    )
  );
}

export function renderPolicyContent(content: string): React.ReactNode {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];

  let currentHeading: string | null = null;
  let currentBody: React.ReactNode[] = [];
  let paragraphLines: string[] = [];
  let listItems: string[] = [];

  const flushParagraph = (key: string) => {
    if (paragraphLines.length === 0) return;
    currentBody.push(<p key={key}>{renderInline(paragraphLines.join(" "), key)}</p>);
    paragraphLines = [];
  };

  const flushList = (key: string) => {
    if (listItems.length === 0) return;
    currentBody.push(
      <ul key={key} className="list-disc space-y-1 pl-5">
        {listItems.map((item, i) => (
          <li key={`${key}-${i}`}>{renderInline(item, `${key}-${i}`)}</li>
        ))}
      </ul>
    );
    listItems = [];
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
    if (line.startsWith("- ") || line.startsWith("· ")) {
      flushParagraph(`p-${i}`);
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
