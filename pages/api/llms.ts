import type { NextApiRequest, NextApiResponse } from "next";
import { buildLlmsTxt } from "@/lib/llms";

// Served at /llms.txt via a rewrite in next.config.mjs.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).end();
  }
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
  res.setHeader("X-Robots-Tag", "noindex");
  return res.status(200).send(await buildLlmsTxt());
}
