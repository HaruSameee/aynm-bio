"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/db";
import { profiles } from "@/db/schema";

export async function saveProfile(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const username = String(formData.get("username") ?? "").trim();
  const displayName = String(formData.get("displayName") ?? "").trim();
  const rawHtml = String(formData.get("rawHtml") ?? "");
  const rawCss = String(formData.get("rawCss") ?? "");
  const rawJs = String(formData.get("rawJs") ?? "");

  await db
    .insert(profiles)
    .values({
      userId: session.user.id,
      username,
      displayName,
      rawHtml,
      rawCss,
      rawJs,
    })
    .onConflictDoUpdate({
      target: profiles.userId,
      set: {
        username,
        displayName,
        rawHtml,
        rawCss,
        rawJs,
        updatedAt: sql`now()`,
      },
    });

  revalidatePath("/dashboard");
}
