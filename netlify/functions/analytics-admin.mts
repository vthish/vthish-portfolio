import { timingSafeEqual } from "node:crypto";
import { getViews, monthKey, summarize, todayKey } from "../lib/analytics";

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export default async (req: Request) => {
  if (req.method !== "GET") return new Response("Method not allowed", { status: 405 });

  const configuredPassword = process.env.ANALYTICS_ADMIN_PASSWORD;
  const suppliedPassword = req.headers.get("x-admin-password") || "";

  if (!configuredPassword || !safeEqual(suppliedPassword, configuredPassword)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const allRecords = await getViews();
  const currentMonth = monthKey(now);
  const today = todayKey(now);
  const monthRecords = allRecords.filter((record) => record.timestamp.startsWith(currentMonth));
  const todayRecords = allRecords.filter((record) => record.timestamp.startsWith(today));

  return Response.json(
    {
      generatedAt: now.toISOString(),
      allTime: summarize(allRecords, "All time"),
      currentMonth: summarize(monthRecords, currentMonth),
      today: summarize(todayRecords, today),
    },
    { headers: { "cache-control": "no-store" } }
  );
};
