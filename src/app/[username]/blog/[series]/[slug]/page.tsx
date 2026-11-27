import type { Metadata } from "next";
import { and, asc, eq, lte } from "drizzle-orm";
import { notFound } from "next/navigation";

import NovelReader from "@/components/novel/NovelReader";
import NovelStage from "@/components/novel/NovelStage";
import { db } from "@/db";
import { posts, series as seriesTable } from "@/db/schema";
import {
  formatBlogDateTime,
  normalizeBlogSlug,
  requireOwnerBlogUsername,
} from "@/lib/blog";
import { excerptOf, renderNovelPages } from "@/lib/novel";

type PageProps = {
  params: Promise<{ username: string; series: string; slug: string }>;
};

async function loadPost(series: string, slug: string) {
  const [result] = await db
    .select({
      post: posts,
      series: seriesTable,
    })
    .from(posts)
    .innerJoin(seriesTable, eq(posts.seriesId, seriesTable.id))
    .where(
      and(
        eq(seriesTable.slug, normalizeBlogSlug(series)),
        eq(posts.slug, normalizeBlogSlug(slug)),
        lte(posts.publishedAt, new Date()),
      ),
    )
    .limit(1);

  return result ?? null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { series, slug } = await params;
  const result = await loadPost(series, slug);

  return {
    title: result ? `${result.post.title} | 春鮫` : "ブログ | 春鮫",
    description: result ? excerptOf(result.post.body) : undefined,
  };
}

export default async function SeriesPostPage({ params }: PageProps) {
  const { username, series, slug } = await params;
  const ownerUsername = await requireOwnerBlogUsername(username);
  const now = new Date();
  const result = await loadPost(series, slug);

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
  const episode = (item: { seriesOrder: number | null }, index: number) =>
    `第${item.seriesOrder ?? index + 1}話`;
  const seriesHref = `/${ownerUsername}/blog/${result.series.slug}`;
  const choices = [
    nextPost
      ? {
          href: `${seriesHref}/${nextPost.slug}`,
          label: "次の話へ",
          sub: `${episode(nextPost, currentIndex + 1)}　${nextPost.title}`,
        }
      : null,
    previousPost
      ? {
          href: `${seriesHref}/${previousPost.slug}`,
          label: "前の話へ",
          sub: `${episode(previousPost, currentIndex - 1)}　${previousPost.title}`,
        }
      : null,
    { href: seriesHref, label: "話の一覧に戻る", sub: result.series.title },
  ].filter((choice) => choice !== null);

  return (
    <NovelStage>
      <NovelReader
        back={{ href: seriesHref, label: "BACK" }}
        choices={choices}
        dateLabel={formatBlogDateTime(result.post.publishedAt)}
        kicker={`${result.series.title}　${episode(result.post, currentIndex)}`}
        pages={renderNovelPages(result.post.body, { title: result.post.title })}
        speaker="春鮫"
        storageKey={`series:${result.series.slug}/${result.post.slug}`}
        title={result.post.title}
      />
    </NovelStage>
  );
}
