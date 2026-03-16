import Link from "next/link";
import { count, desc, eq } from "drizzle-orm";

import { deletePost, deleteSeries } from "@/app/actions/blog";
import { db } from "@/db";
import { posts, series } from "@/db/schema";
import { requireOwner } from "@/lib/auth-guard";

export default async function DashboardBlogPage() {
  await requireOwner();

  const allSeries = await db
    .select({
      id: series.id,
      slug: series.slug,
      title: series.title,
      description: series.description,
      postCount: count(posts.id),
    })
    .from(series)
    .leftJoin(posts, eq(posts.seriesId, series.id))
    .groupBy(series.id)
    .orderBy(desc(series.createdAt));

  const allPosts = await db
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      publishedAt: posts.publishedAt,
      seriesTitle: series.title,
    })
    .from(posts)
    .leftJoin(series, eq(posts.seriesId, series.id))
    .orderBy(desc(posts.createdAt));

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-5 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.24em] text-[#949ba4]">
            blog-dashboard
          </p>
          <h1 className="text-4xl font-semibold text-white">Blog manager</h1>
          <p className="text-sm text-[#b5bac1]">
            Manage standalone posts and multi-part series from one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-[#d8dbe3] transition hover:border-[#5865f2] hover:text-white"
            href="/dashboard/series"
          >
            Manage series
          </Link>
          <Link
            className="rounded-2xl bg-[#5865f2] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#6d78f7]"
            href="/dashboard/blog/new"
          >
            New post
          </Link>
        </div>
      </header>

      <section className="space-y-4 rounded-3xl border border-white/10 bg-[#111523]/80 p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-white">Series</h2>
          <span className="text-sm text-[#949ba4]">{allSeries.length} total</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {allSeries.map((item) => (
            <article
              className="space-y-3 rounded-2xl border border-white/10 bg-[#0b0f1a] p-4"
              key={item.id}
            >
              <div className="space-y-1">
                <div className="text-lg font-semibold text-white">{item.title}</div>
                <div className="text-sm text-[#8d94a0]">/{item.slug}</div>
                <div className="text-sm text-[#b5bac1]">
                  {item.description || "No description yet."}
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm text-[#949ba4]">
                <span>{item.postCount} posts</span>
                <form
                  action={async () => {
                    "use server";
                    await deleteSeries(item.id);
                  }}
                >
                  <button
                    className="rounded-xl border border-[#f23f43]/40 px-3 py-2 font-semibold text-[#ffb7b8] transition hover:bg-[#2a1318]"
                    type="submit"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </article>
          ))}
          {allSeries.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-[#0b0f1a] p-5 text-sm text-[#949ba4]">
              No series yet. Create one from the series page when you need an arc.
            </div>
          ) : null}
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-white/10 bg-[#111523]/80 p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-white">Posts</h2>
          <span className="text-sm text-[#949ba4]">{allPosts.length} total</span>
        </div>
        <div className="space-y-3">
          {allPosts.map((post) => (
            <article
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#0b0f1a] p-4 md:flex-row md:items-center md:justify-between"
              key={post.id}
            >
              <div className="space-y-1">
                <div className="text-lg font-semibold text-white">{post.title}</div>
                <div className="text-sm text-[#8d94a0]">/{post.slug}</div>
                <div className="text-sm text-[#b5bac1]">
                  {post.seriesTitle ? `Series: ${post.seriesTitle}` : "Standalone post"}
                </div>
                <div className="text-sm text-[#949ba4]">
                  {post.publishedAt
                    ? `Published ${post.publishedAt.toLocaleString()}`
                    : "Draft"}
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  className="rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-[#d8dbe3] transition hover:border-[#5865f2] hover:text-white"
                  href={`/dashboard/blog/${post.id}/edit`}
                >
                  Edit
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await deletePost(post.id);
                  }}
                >
                  <button
                    className="rounded-xl border border-[#f23f43]/40 px-3 py-2 text-sm font-semibold text-[#ffb7b8] transition hover:bg-[#2a1318]"
                    type="submit"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </article>
          ))}
          {allPosts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-[#0b0f1a] p-5 text-sm text-[#949ba4]">
              No posts yet. Start with a draft and publish when it is ready.
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
