import { isAdminAuthorized } from "../lib/admin-auth";
import { getEvents, getViews, monthKey, summarize, summarizeEvents, todayKey } from "../lib/analytics";

function utcStartOfDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function since<T extends { timestamp: string }>(records: T[], start: Date) {
  const startMs = start.getTime();
  return records.filter((record) => Date.parse(record.timestamp) >= startMs);
}

export default async (req: Request) => {
  if (req.method !== "GET") return new Response("Method not allowed", { status: 405 });
  if (!isAdminAuthorized(req)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const now = new Date();
  const [allRecords, allEvents] = await Promise.all([getViews(), getEvents()]);
  const currentMonthKey = monthKey(now);
  const today = todayKey(now);
  const todayStart = utcStartOfDay(now);
  const last7Start = new Date(todayStart); last7Start.setUTCDate(last7Start.getUTCDate() - 6);
  const last30Start = new Date(todayStart); last30Start.setUTCDate(last30Start.getUTCDate() - 29);
  const yearStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));

  const currentMonthViews = allRecords.filter((record) => record.timestamp.startsWith(currentMonthKey));
  const todayViews = allRecords.filter((record) => record.timestamp.startsWith(today));
  const currentMonthEvents = allEvents.filter((record) => record.timestamp.startsWith(currentMonthKey));
  const todayEvents = allEvents.filter((record) => record.timestamp.startsWith(today));

  return Response.json(
    {
      generatedAt: now.toISOString(),
      periods: {
        allTime: summarize(allRecords, "All time"),
        currentYear: summarize(since(allRecords, yearStart), String(now.getUTCFullYear())),
        currentMonth: summarize(currentMonthViews, currentMonthKey),
        last30Days: summarize(since(allRecords, last30Start), "Last 30 days"),
        last7Days: summarize(since(allRecords, last7Start), "Last 7 days"),
        today: summarize(todayViews, today),
      },
      eventPeriods: {
        allTime: summarizeEvents(allEvents, "All time"),
        currentYear: summarizeEvents(since(allEvents, yearStart), String(now.getUTCFullYear())),
        currentMonth: summarizeEvents(currentMonthEvents, currentMonthKey),
        last30Days: summarizeEvents(since(allEvents, last30Start), "Last 30 days"),
        last7Days: summarizeEvents(since(allEvents, last7Start), "Last 7 days"),
        today: summarizeEvents(todayEvents, today),
      },
    },
    { headers: { "cache-control": "no-store" } }
  );
};
