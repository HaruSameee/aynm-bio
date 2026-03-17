import Link from "next/link";
import { and, count, desc, eq, isNull, lte } from "drizzle-orm";

import { db } from "@/db";
import { posts, series } from "@/db/schema";
import { formatBlogDate, requireOwnerBlogUsername } from "@/lib/blog";

type PageProps = {
  params: Promise<{ username: string }>;
};

export default async function BlogIndexPage({ params }: PageProps) {
  const { username } = await params;
  const ownerUsername = await requireOwnerBlogUsername(username);
  const now = new Date();

  const seriesCards = await db
    .select({
      id: series.id,
      slug: series.slug,
      title: series.title,
      description: series.description,
      coverImageUrl: series.coverImageUrl,
      postCount: count(posts.id),
    })
    .from(series)
    .innerJoin(
      posts,
      and(eq(posts.seriesId, series.id), lte(posts.publishedAt, now)),
    )
    .groupBy(series.id)
    .orderBy(desc(series.createdAt));

  const standalonePosts = await db
    .select({
      slug: posts.slug,
      title: posts.title,
      publishedAt: posts.publishedAt,
    })
    .from(posts)
    .where(and(isNull(posts.seriesId), lte(posts.publishedAt, now)))
    .orderBy(desc(posts.publishedAt));

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 px-5 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.24em] text-[#949ba4]">
          {ownerUsername}/blog
        </p>
        <h1 className="text-4xl font-semibold text-white">Blog</h1>
        <p className="max-w-2xl text-sm leading-6 text-[#b5bac1]">
          Notes, essays, and series published from the same profile workspace.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Series</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {seriesCards.map((item) => (
            <Link
              className="overflow-hidden rounded-3xl border border-white/10 bg-[#10131e] transition hover:border-[#5865f2]"
              href={`/${ownerUsername}/blog/${item.slug}`}
              key={item.id}
            >
              {item.coverImageUrl ? (
                <div
                  className="h-40 w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.coverImageUrl})` }}
                />
              ) : (
                <div className="h-40 w-full bg-[linear-gradient(135deg,#181d30,#0d111b)]" />
              )}
              <div className="space-y-2 p-5">
                <div className="text-xl font-semibold text-white">{item.title}</div>
                <div className="text-sm leading-6 text-[#b5bac1]">
                  {item.description || "No description provided yet."}
                </div>
                <div className="text-sm text-[#949ba4]">{item.postCount} posts</div>
              </div>
            </Link>
          ))}
          {seriesCards.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-[#10131e] p-5 text-sm text-[#949ba4]">
              No public series yet.
            </div>
          ) : null}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Standalone posts</h2>
        <div className="space-y-3">
          {standalonePosts.map((post) => (
            <Link
              className="block rounded-3xl border border-white/10 bg-[#10131e] p-5 transition hover:border-[#5865f2]"
              href={`/${ownerUsername}/blog/post/${post.slug}`}
              key={post.slug}
            >
              <div className="text-xl font-semibold text-white">{post.title}</div>
              <div className="mt-2 text-sm text-[#949ba4]">
                {formatBlogDate(post.publishedAt)}
              </div>
            </Link>
          ))}
          {standalonePosts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-[#10131e] p-5 text-sm text-[#949ba4]">
              No standalone posts published yet.
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
