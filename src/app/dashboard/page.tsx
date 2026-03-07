import Link from "next/link";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { ProfileEditor } from "@/components/ProfileEditor";
import { db } from "@/db";
import { profiles } from "@/db/schema";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, session.user.id))
    .limit(1);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-100">Dashboard</h1>
        <p className="text-sm text-slate-400">{session.user.email}</p>
        {profile ? (
          <Link
            className="inline-flex text-sm text-sky-300 underline-offset-4 hover:underline"
            href={`/${profile.username}`}
          >
            View public profile
          </Link>
        ) : null}
      </header>
      <ProfileEditor profile={profile} />
    </main>
  );
}
