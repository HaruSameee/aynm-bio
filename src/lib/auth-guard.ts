import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { db } from "@/db";
import { accounts } from "@/db/schema";

export const OWNER_DISCORD_ID = "452496068064837642";

export async function requireOwner() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    notFound();
  }

  const [discordAccount] = await db
    .select({
      providerAccountId: accounts.providerAccountId,
    })
    .from(accounts)
    .where(
      and(eq(accounts.userId, userId), eq(accounts.provider, "discord")),
    )
    .limit(1);

  if (discordAccount?.providerAccountId !== OWNER_DISCORD_ID) {
    notFound();
  }

  return { userId };
}
