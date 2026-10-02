import { getStore } from "@netlify/blobs";
import { isAdminAuthorized } from "../lib/admin-auth";

const STORE_NAME = "portfolio-media-v1";
const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"]);

function mediaStore() {
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

export default async (req: Request) => {
  if (!isAdminAuthorized(req)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  try {
    const form = await req.formData();
    const value = form.get("file");
    if (!value || typeof value === "string" || typeof value.arrayBuffer !== "function") {
      return Response.json({ error: "Choose an image or video first." }, { status: 400 });
    }
    const file = value as File;
    if (!ALLOWED.has(file.type)) return Response.json({ error: "Use JPG, PNG, WebP, MP4 or WebM files." }, { status: 400 });
    if (file.size > MAX_BYTES) return Response.json({ error: "Media file must be 4 MB or smaller." }, { status: 400 });

    const bytes = new Uint8Array(await file.arrayBuffer());
    const base64 = Buffer.from(bytes).toString("base64");
    const id = `${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 12)}`;
    await mediaStore().setJSON(id, {
      mime: file.type,
      base64,
      name: file.name.slice(0, 180),
      createdAt: new Date().toISOString(),
    });

    return Response.json({
      id,
      url: `/.netlify/functions/portfolio-media?id=${encodeURIComponent(id)}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not upload media";
    return Response.json({ error: message }, { status: 400 });
  }
};
