export type VideoSource =
  | { kind: "direct"; src: string; provider: string }
  | { kind: "embed"; src: string; provider: string }
  | { kind: "external"; src: string; provider: string };

export type VideoResolveMode = "preview" | "player";

function safeUrl(raw: string) {
  try {
    const url = new URL(raw.trim());
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}

export function resolveVideoSource(raw?: string, mode: VideoResolveMode = "preview"): VideoSource | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return { kind: "direct", src: trimmed, provider: "Uploaded video" };
  }
  const url = safeUrl(trimmed);
  if (!url) return null;
  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  const path = url.pathname;
  const player = mode === "player";

  if (/\.(mp4|webm|ogg|m4v)(?:$|\?)/i.test(url.href)) {
    return { kind: "direct", src: url.href, provider: "Video" };
  }

  if (host === "youtu.be" || host.endsWith("youtube.com")) {
    let id = "";
    if (host === "youtu.be") id = path.split("/").filter(Boolean)[0] || "";
    else if (path.startsWith("/shorts/")) id = path.split("/")[2] || "";
    else if (path.startsWith("/embed/")) id = path.split("/")[2] || "";
    else id = url.searchParams.get("v") || "";
    if (id && /^[\w-]{6,20}$/.test(id)) {
      return {
        kind: "embed",
        src: player
          ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&playsinline=1`
          : `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&rel=0&modestbranding=1&playsinline=1`,
        provider: "YouTube",
      };
    }
  }

  if (host.endsWith("vimeo.com")) {
    const id = path.split("/").filter(Boolean).find((part) => /^\d+$/.test(part));
    if (id) {
      return {
        kind: "embed",
        src: player
          ? `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0`
          : `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&background=1`,
        provider: "Vimeo",
      };
    }
  }

  if (host.endsWith("loom.com")) {
    const parts = path.split("/").filter(Boolean);
    const id = parts[parts.indexOf("share") + 1] || parts[parts.indexOf("embed") + 1];
    if (id) {
      return {
        kind: "embed",
        src: player
          ? `https://www.loom.com/embed/${id}?hide_owner=true&hide_share=true&hide_title=true`
          : `https://www.loom.com/embed/${id}?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true&autoplay=1`,
        provider: "Loom",
      };
    }
  }

  if (host === "drive.google.com") {
    const match = path.match(/\/file\/d\/([^/]+)/);
    if (match?.[1]) return { kind: "embed", src: `https://drive.google.com/file/d/${match[1]}/preview`, provider: "Google Drive" };
  }

  if (host.endsWith("dailymotion.com") || host === "dai.ly") {
    const id = host === "dai.ly" ? path.split("/").filter(Boolean)[0] : path.match(/\/video\/([^_/?]+)/)?.[1];
    if (id) {
      return {
        kind: "embed",
        src: player
          ? `https://www.dailymotion.com/embed/video/${id}?autoplay=1`
          : `https://www.dailymotion.com/embed/video/${id}?autoplay=1&mute=1`,
        provider: "Dailymotion",
      };
    }
  }

  if (host === "streamable.com") {
    const id = path.split("/").filter(Boolean)[0];
    if (id) {
      return {
        kind: "embed",
        src: player ? `https://streamable.com/e/${id}?autoplay=1` : `https://streamable.com/e/${id}?autoplay=1&muted=1`,
        provider: "Streamable",
      };
    }
  }

  if (host.endsWith("tiktok.com")) {
    const id = path.match(/\/video\/(\d+)/)?.[1];
    if (id) {
      return {
        kind: "embed",
        src: player
          ? `https://www.tiktok.com/player/v1/${id}?autoplay=1&loop=0&music_info=1&description=1`
          : `https://www.tiktok.com/player/v1/${id}?autoplay=1&loop=1&music_info=0&description=0`,
        provider: "TikTok",
      };
    }
  }

  if (host.endsWith("instagram.com")) {
    const match = path.match(/\/(reel|p|tv)\/([^/]+)/);
    if (match?.[1] && match?.[2]) return { kind: "embed", src: `https://www.instagram.com/${match[1]}/${match[2]}/embed/`, provider: "Instagram" };
  }

  if (host.endsWith("facebook.com") || host === "fb.watch") {
    return {
      kind: "embed",
      src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url.href)}&show_text=false&autoplay=true${player ? "" : "&mute=true"}`,
      provider: "Facebook",
    };
  }

  // Unknown providers remain safe external links. In preview and in the full-player
  // modal the portfolio offers the original URL rather than rendering a broken iframe.
  return { kind: "external", src: url.href, provider: host || "External video" };
}
