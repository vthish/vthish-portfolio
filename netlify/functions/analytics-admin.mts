import { isAdminAuthorized } from "../lib/admin-auth";
import { getViews, monthKey, summarize, todayKey } from "../lib/analytics";

export default async (req: Request) => {
  if (req.method !== "GET") return new Response("Method not allowed", { status: 405 });

  if (!isAdminAuthorized(req)) {
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
