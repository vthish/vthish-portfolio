import { getPortfolioContent } from "../lib/portfolio-content";

export default async (req: Request) => {
  if (req.method !== "GET") return new Response("Method not allowed", { status: 405 });

  const content = await getPortfolioContent();
  return Response.json(content, {
    headers: {
      "cache-control": "no-store, max-age=0",
      "access-control-allow-origin": "*",
    },
  });
};
