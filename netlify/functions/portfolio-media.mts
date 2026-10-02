import { getStore } from "@netlify/blobs";

const STORE_NAME = "portfolio-media-v1";

function mediaStore() {
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

export default async (req: Request) => {
  if (req.method !== "GET") return new Response("Method not allowed", { status: 405 });
  const id = new URL(req.url).searchParams.get("id")?.trim();
  if (!id || !/^[a-z0-9-]+$/i.test(id)) return new Response("Not found", { status: 404 });

  try {
    const stored = await mediaStore().get(id, { type: "json", consistency: "strong" }) as { mime?: string; base64?: string } | null;
    if (!stored?.mime || !stored.base64) return new Response("Not found", { status: 404 });
    const bytes = Buffer.from(stored.base64, "base64");
    return new Response(bytes, {
      headers: {
        "content-type": stored.mime,
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
};
