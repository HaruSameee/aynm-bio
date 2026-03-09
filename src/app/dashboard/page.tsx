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
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#3f4371] bg-[#171a2d]/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#b5bac1]">
          Dashboard
          <span className="h-1 w-1 rounded-full bg-[#5865f2]" />
          Discord-style studio
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Profile Studio
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-[#b5bac1] sm:text-base">
              Tune your public card with a Discord-inspired editor and preview
              the result before you publish it.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#dbdee1] shadow-[0_20px_45px_rgba(0,0,0,0.18)] backdrop-blur">
            <div className="text-xs uppercase tracking-[0.22em] text-[#949ba4]">
              Signed in as
            </div>
            <div className="mt-1 font-medium text-white">
              {session.user.name ?? "Discord User"}
            </div>
            <div className="text-xs text-[#b5bac1]">{session.user.email}</div>
          </div>
        </div>
        {profile ? (
          <Link
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[#4e5d94] bg-[#23283f] px-4 py-2 text-sm font-medium text-[#dee1ff] transition hover:border-[#5865f2] hover:bg-[#2b3150]"
            href={`/${profile.username}`}
          >
            View public profile
          </Link>
        ) : null}
      </header>
      <ProfileEditor
        currentUser={{
          email: session.user.email ?? "",
          image: session.user.image ?? "",
          name: session.user.name ?? "",
        }}
        profile={profile}
      />
    </main>
  );
}
