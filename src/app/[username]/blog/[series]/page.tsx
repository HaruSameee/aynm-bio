import type { Metadata } from "next";
import { and, asc, eq, lte } from "drizzle-orm";
import { notFound } from "next/navigation";

import NovelArchive from "@/components/novel/NovelArchive";
import NovelStage from "@/components/novel/NovelStage";
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

async function loadSeries(slug: string) {
  const [seriesItem] = await db
    .select()
    .from(seriesTable)
    .where(eq(seriesTable.slug, normalizeBlogSlug(slug)))
    .limit(1);

  return seriesItem ?? null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { series } = await params;
  const seriesItem = await loadSeries(series);

  return {
    title: seriesItem ? `${seriesItem.title} | 春鮫` : "ブログ | 春鮫",
    description: seriesItem?.description ?? undefined,
  };
}

export default async function SeriesPage({ params }: PageProps) {
  const { username, series } = await params;
  const ownerUsername = await requireOwnerBlogUsername(username);
  const now = new Date();
  const seriesItem = await loadSeries(series);

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
    <NovelStage>
      <NovelArchive
        back={{ href: `/${ownerUsername}/blog`, label: "ARCHIVE" }}
        heading={seriesItem.title}
        lead={seriesItem.description}
        prompt="どの話を閲覧しますか？"
        sections={[
          {
            label: "エピソード",
            entries: seriesPosts.map((post, index) => ({
              href: `/${ownerUsername}/blog/${seriesItem.slug}/${post.slug}`,
              badge: `第${post.seriesOrder ?? index + 1}話`,
              title: post.title,
              sub: formatBlogDate(post.publishedAt),
              readKeys: [`series:${seriesItem.slug}/${post.slug}`],
            })),
            empty: "この連載にはまだ公開中の話がありません。",
          },
        ]}
      />
    </NovelStage>
  );
}
