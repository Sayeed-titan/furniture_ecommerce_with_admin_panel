"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Link as LinkIcon, Unlink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { policyMarkdownToHtml, policyDocToMarkdown, isSafeUrl } from "@/lib/policy-editor";

/** Rich-text editor restricted to exactly what the storefront's policy-page
 *  renderer supports (heading H2/H3, bullet/numbered list, bold, italic,
 *  link) — see policy-editor.ts. Anything else (tables, colors, images,
 *  arbitrary HTML) is deliberately not offered, so admin-entered content
 *  can't drift out of what the public pages know how to render. */
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
        link: false, // configured separately below, with URL-scheme validation
        strike: false,
        underline: false,
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        autolink: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
        // Belt-and-braces: even a pasted link with an unsafe scheme
        // (javascript:, data:, ...) is rejected here, not just at the
        // toolbar's own prompt.
        validate: (href) => isSafeUrl(href),
      }),
    ],
    content: policyMarkdownToHtml(defaultValue),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "min-h-[180px] px-3 py-2 text-sm text-neutral-700 focus:outline-none",
          "[&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-neutral-900 [&_h2]:first:mt-0",
          "[&_h3]:mb-1.5 [&_h3]:mt-3 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-neutral-900",
          "[&_p]:mb-2 [&_p]:leading-relaxed",
          "[&_ul]:mb-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5",
          "[&_ol]:mb-2 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5",
          "[&_strong]:font-semibold [&_strong]:text-neutral-900",
          "[&_em]:italic",
          "[&_a]:underline [&_a]:underline-offset-2"
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

  function toggleLink() {
    if (!editor) return;
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const url = window.prompt("Link URL (http/https or mailto only):");
    if (!url) return;
    if (!isSafeUrl(url)) {
      toast.error("Only http(s):// or mailto: links are allowed.");
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  }

  return (
    <div className="rounded-md border border-neutral-300 bg-white focus-within:ring-2 focus-within:ring-neutral-900">
      <div className="flex flex-wrap items-center gap-1 border-b border-neutral-200 px-2 py-1.5">
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
          aria-label="Italic"
          className={cn("h-8 w-8", editor?.isActive("italic") && "bg-neutral-100")}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
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
          aria-label="Sub-heading"
          className={cn("h-8 w-8", editor?.isActive("heading", { level: 3 }) && "bg-neutral-100")}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="h-4 w-4" />
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
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Numbered list"
          className={cn("h-8 w-8", editor?.isActive("orderedList") && "bg-neutral-100")}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={editor?.isActive("link") ? "Remove link" : "Add link"}
          className={cn("h-8 w-8", editor?.isActive("link") && "bg-neutral-100")}
          onClick={toggleLink}
        >
          {editor?.isActive("link") ? <Unlink className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
        </Button>
      </div>
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={markdown} readOnly />
    </div>
  );
}
