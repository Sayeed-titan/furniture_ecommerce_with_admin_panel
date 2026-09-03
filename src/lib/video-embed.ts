/**
 * Detects a pasted YouTube/Vimeo link and normalizes it to an embeddable
 * player URL. Used so the admin's single "paste URL" field can tell a video
 * link apart from a plain image URL without a separate control.
 */
export function toEmbedUrl(rawUrl: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = parsed.pathname.slice(1);
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }

  if (host === "youtube.com" || host === "m.youtube.com") {
    if (parsed.pathname === "/watch") {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (parsed.pathname.startsWith("/embed/")) {
      return rawUrl;
    }
    if (parsed.pathname.startsWith("/shorts/")) {
      const id = parsed.pathname.split("/")[2];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
  }

  if (host === "vimeo.com") {
    const id = parsed.pathname.split("/").filter(Boolean)[0];
    return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
  }

  if (host === "player.vimeo.com") {
    return rawUrl;
  }

  return null;
}

/**
 * A real preview image for a stored embed URL, when one is available for
 * free (YouTube's thumbnail CDN). Vimeo doesn't offer a URL-pattern
 * thumbnail — its embeds fall back to the generic video placeholder tile.
 */
export function embedThumbnail(embedUrl: string): string | null {
  const match = embedUrl.match(/youtube\.com\/embed\/([^/?]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}
