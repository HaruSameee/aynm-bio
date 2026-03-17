import Link from "next/link";
import { and, asc, eq, lte } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/db";
import { posts, series as seriesTable } from "@/db/schema";
import {
  formatBlogDate,
  normalizeBlogSlug,
  requireOwnerBlogUsername,
} from "@/lib/blog";

type PageProps = {
  params: Promise<{ username: string; series: string }>;
};

export default async function SeriesPage({ params }: PageProps) {
  const { username, series } = await params;
  const ownerUsername = await requireOwnerBlogUsername(username);
  const now = new Date();
  const seriesSlug = normalizeBlogSlug(series);

  const [seriesItem] = await db
    .select()
    .from(seriesTable)
    .where(eq(seriesTable.slug, seriesSlug))
    .limit(1);

  if (!seriesItem) {
    notFound();
  }

  const seriesPosts = await db
    .select({
      slug: posts.slug,
      title: posts.title,
      publishedAt: posts.publishedAt,
      seriesOrder: posts.seriesOrder,
    })
    .from(posts)
    .where(and(eq(posts.seriesId, seriesItem.id), lte(posts.publishedAt, now)))
    .orderBy(asc(posts.seriesOrder), asc(posts.publishedAt), asc(posts.title));

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-5 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <Link
          className="text-sm font-medium text-[#8ea1ff] hover:text-white"
          href={`/${ownerUsername}/blog`}
        >
          Back to blog
        </Link>
        <h1 className="text-4xl font-semibold text-white">{seriesItem.title}</h1>
        <p className="max-w-2xl text-sm leading-6 text-[#b5bac1]">
          {seriesItem.description || "No description provided yet."}
        </p>
      </header>

      {seriesItem.coverImageUrl ? (
        <div
          className="h-56 rounded-3xl border border-white/10 bg-cover bg-center"
          style={{ backgroundImage: `url(${seriesItem.coverImageUrl})` }}
        />
      ) : null}

      <section className="space-y-3">
        {seriesPosts.map((post, index) => (
          <Link
            className="block rounded-3xl border border-white/10 bg-[#10131e] p-5 transition hover:border-[#5865f2]"
            href={`/${ownerUsername}/blog/${seriesItem.slug}/${post.slug}`}
            key={post.slug}
          >
            <div className="text-sm text-[#949ba4]">
              Episode {post.seriesOrder ?? index + 1}
            </div>
            <div className="mt-1 text-2xl font-semibold text-white">
              {post.title}
            </div>
            <div className="mt-2 text-sm text-[#949ba4]">
              {formatBlogDate(post.publishedAt)}
            </div>
          </Link>
        ))}
        {seriesPosts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-[#10131e] p-5 text-sm text-[#949ba4]">
            This series has no published posts yet.
          </div>
        ) : null}
      </section>
    </main>
  );
}
