"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Heading2, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { policyMarkdownToHtml, policyDocToMarkdown } from "@/lib/policy-editor";

/** Rich-text editor restricted to exactly what the storefront's policy-page
 *  renderer supports (heading, bullet list, bold) — see policy-editor.ts.
 *  Anything else (links, tables, colors, arbitrary HTML) is deliberately
 *  not offered, so admin-entered content can't drift out of what the
 *  public pages know how to render. */
export function RichTextEditor({ name, defaultValue }: { name: string; defaultValue: string }) {
  const [markdown, setMarkdown] = useState(defaultValue);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        blockquote: false,
        code: false,
        codeBlock: false,
        hardBreak: false,
        horizontalRule: false,
        italic: false,
        link: false,
        orderedList: false,
        strike: false,
        underline: false,
        heading: { levels: [2] },
      }),
    ],
    content: policyMarkdownToHtml(defaultValue),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "min-h-[180px] px-3 py-2 text-sm text-neutral-700 focus:outline-none",
          "[&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-neutral-900 [&_h2]:first:mt-0",
          "[&_p]:mb-2 [&_p]:leading-relaxed",
          "[&_ul]:mb-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5",
          "[&_strong]:font-semibold [&_strong]:text-neutral-900"
        ),
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const onUpdate = () => setMarkdown(policyDocToMarkdown(editor.getJSON()));
    editor.on("update", onUpdate);
    return () => {
      editor.off("update", onUpdate);
    };
  }, [editor]);

  return (
    <div className="rounded-md border border-neutral-300 bg-white focus-within:ring-2 focus-within:ring-neutral-900">
      <div className="flex items-center gap-1 border-b border-neutral-200 px-2 py-1.5">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Bold"
          className={cn("h-8 w-8", editor?.isActive("bold") && "bg-neutral-100")}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Heading"
          className={cn("h-8 w-8", editor?.isActive("heading", { level: 2 }) && "bg-neutral-100")}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Bullet list"
          className={cn("h-8 w-8", editor?.isActive("bulletList") && "bg-neutral-100")}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={markdown} readOnly />
    </div>
  );
}
