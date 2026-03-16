import { readFileSync } from "node:fs";
import { join } from "node:path";

const profileHtml = readFileSync(
  join(process.cwd(), "src", "app", "hrsm", "profile.html"),
  "utf8",
);

export const dynamic = "force-static";

export async function GET() {
  return new Response(profileHtml, {
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  });
}
