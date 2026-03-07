import Link from "next/link";

import { auth, signIn } from "@/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
      <div className="space-y-6">
        <h1 className="text-4xl font-semibold text-slate-100">Aynm Bio</h1>
        {session ? (
          <Link
            className="inline-flex rounded-md bg-sky-400 px-5 py-3 text-sm font-medium text-slate-950"
            href="/dashboard"
          >
            Go to dashboard
          </Link>
        ) : (
          <form
            action={async () => {
              "use server";
              await signIn("discord", { redirectTo: "/dashboard" });
            }}
          >
            <button
              className="rounded-md bg-indigo-500 px-5 py-3 text-sm font-medium text-white"
              type="submit"
            >
              Sign in with Discord
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
