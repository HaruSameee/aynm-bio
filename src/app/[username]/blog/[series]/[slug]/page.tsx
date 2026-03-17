import Link from "next/link";
import { and, asc, eq, lte } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/db";
import { posts, series as seriesTable } from "@/db/schema";
import {
  formatBlogDateTime,
  normalizeBlogSlug,
  requireOwnerBlogUsername,
} from "@/lib/blog";
import { renderMarkdown } from "@/lib/markdown";

type PageProps = {
  params: Promise<{ username: string; series: string; slug: string }>;
};

export default async function SeriesPostPage({ params }: PageProps) {
  const { username, series, slug } = await params;
  const ownerUsername = await requireOwnerBlogUsername(username);
  const now = new Date();
  const seriesSlug = normalizeBlogSlug(series);
  const postSlug = normalizeBlogSlug(slug);

  const [result] = await db
    .select({
      post: posts,
      series: seriesTable,
    })
    .from(posts)
    .innerJoin(seriesTable, eq(posts.seriesId, seriesTable.id))
    .where(
      and(
        eq(seriesTable.slug, seriesSlug),
        eq(posts.slug, postSlug),
        lte(posts.publishedAt, now),
      ),
    )
    .limit(1);

  if (!result) {
    notFound();
  }

  const seriesPosts = await db
    .select({
      slug: posts.slug,
      title: posts.title,
      seriesOrder: posts.seriesOrder,
    })
    .from(posts)
    .where(and(eq(posts.seriesId, result.series.id), lte(posts.publishedAt, now)))
    .orderBy(asc(posts.seriesOrder), asc(posts.publishedAt), asc(posts.title));

  const currentIndex = seriesPosts.findIndex((item) => item.slug === result.post.slug);
  const previousPost = currentIndex > 0 ? seriesPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex >= 0 && currentIndex < seriesPosts.length - 1
      ? seriesPosts[currentIndex + 1]
      : null;
  const html = await renderMarkdown(result.post.body);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 px-5 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <Link
          className="text-sm font-medium text-[#8ea1ff] hover:text-white"
          href={`/${ownerUsername}/blog/${result.series.slug}`}
        >
          Back to {result.series.title}
        </Link>
        <div className="text-sm text-[#949ba4]">
          Episode {result.post.seriesOrder ?? currentIndex + 1}
        </div>
        <h1 className="text-4xl font-semibold text-white">{result.post.title}</h1>
        <div className="text-sm text-[#949ba4]">
          {formatBlogDateTime(result.post.publishedAt)}
        </div>
      </header>

      <article
        className="markdown-content max-w-none rounded-3xl border border-white/10 bg-[#10131e] px-6 py-6"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <nav className="grid gap-3 md:grid-cols-2">
        {previousPost ? (
          <Link
            className="rounded-3xl border border-white/10 bg-[#10131e] p-5 transition hover:border-[#5865f2]"
            href={`/${ownerUsername}/blog/${result.series.slug}/${previousPost.slug}`}
          >
            <div className="text-sm text-[#949ba4]">Previous</div>
            <div className="mt-1 text-lg font-semibold text-white">
              {previousPost.title}
            </div>
          </Link>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/10 bg-[#10131e] p-5 text-sm text-[#6f7680]">
            Start of series
          </div>
        )}

        {nextPost ? (
          <Link
            className="rounded-3xl border border-white/10 bg-[#10131e] p-5 text-right transition hover:border-[#5865f2]"
            href={`/${ownerUsername}/blog/${result.series.slug}/${nextPost.slug}`}
          >
            <div className="text-sm text-[#949ba4]">Next</div>
            <div className="mt-1 text-lg font-semibold text-white">
              {nextPost.title}
            </div>
          </Link>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/10 bg-[#10131e] p-5 text-right text-sm text-[#6f7680]">
            End of series
          </div>
        )}
      </nav>
    </main>
  );
}
