import { isAdminAuthorized } from "../lib/admin-auth";
import {
  getPortfolioContent,
  normalizePortfolioContent,
  savePortfolioContent,
} from "../lib/portfolio-content";

export default async (req: Request) => {
  if (!isAdminAuthorized(req)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (req.method === "GET") {
    return Response.json(await getPortfolioContent(), {
      headers: { "cache-control": "no-store" },
    });
  }

  if (req.method !== "PUT") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const payload = await req.json();
    const normalized = normalizePortfolioContent(payload);
    normalized.updatedAt = new Date().toISOString();
    await savePortfolioContent(normalized);
    return Response.json(normalized, {
      headers: { "cache-control": "no-store" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save portfolio content";
    return Response.json({ error: message }, { status: 400 });
  }
};
