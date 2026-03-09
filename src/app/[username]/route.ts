import { eq } from "drizzle-orm";

import { db } from "@/db";
import { profiles } from "@/db/schema";
import { isReservedUsername, normalizeUsername } from "@/lib/username";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ username: string }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  const { username } = await params;
  const normalizedUsername = normalizeUsername(username);

  if (isReservedUsername(normalizedUsername)) {
    return new Response("Not Found", { status: 404 });
  }

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.username, normalizedUsername))
    .limit(1);

  if (!profile) {
    return new Response("Not Found", { status: 404 });
  }

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${profile.displayName}</title>
  <style>${profile.rawCss}</style>
</head>
<body>
  ${profile.rawHtml}
  <script>${profile.rawJs}<\/script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  });
}
