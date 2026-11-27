import type { Metadata } from "next";
import { and, asc, desc, eq, isNull, lte } from "drizzle-orm";

import NovelArchive, { type ArchiveEntry } from "@/components/novel/NovelArchive";
import NovelStage from "@/components/novel/NovelStage";
import { db } from "@/db";
import { posts, series } from "@/db/schema";
import { formatBlogDate, requireOwnerBlogUsername } from "@/lib/blog";
import { getPublishedStaticPosts } from "@/lib/static-posts";

type PageProps = {
  params: Promise<{ username: string }>;
};

export const metadata: Metadata = {
  title: "ブログ | 春鮫",
  description: "HRSM（はるさめ）のブログ。開発日誌と、ときどき単発の記事。",
};

export default async function BlogIndexPage({ params }: PageProps) {
  const { username } = await params;
  const ownerUsername = await requireOwnerBlogUsername(username);
  const now = new Date();

  const seriesRows = await db
    .select({
      id: series.id,
      slug: series.slug,
      title: series.title,
      description: series.description,
      createdAt: series.createdAt,
      postSlug: posts.slug,
      publishedAt: posts.publishedAt,
    })
    .from(series)
    .innerJoin(
      posts,
      and(eq(posts.seriesId, series.id), lte(posts.publishedAt, now)),
    )
    .orderBy(desc(series.createdAt), asc(posts.seriesOrder));

  const seriesMap = new Map<
    string,
    {
      slug: string;
      title: string;
      description: string | null;
      postSlugs: string[];
      latest: Date | null;
    }
  >();

  for (const row of seriesRows) {
    const item = seriesMap.get(row.id) ?? {
      slug: row.slug,
      title: row.title,
      description: row.description,
      postSlugs: [],
      latest: null,
    };

    item.postSlugs.push(row.postSlug);

    if (row.publishedAt && (!item.latest || row.publishedAt > item.latest)) {
      item.latest = row.publishedAt;
    }

    seriesMap.set(row.id, item);
  }

  const seriesEntries: ArchiveEntry[] = [...seriesMap.values()].map((item) => ({
    href: `/${ownerUsername}/blog/${item.slug}`,
    badge: `全${item.postSlugs.length}話`,
    title: item.title,
    description: item.description,
    sub: `最終更新 ${formatBlogDate(item.latest)}`,
    readKeys: item.postSlugs.map((slug) => `series:${item.slug}/${slug}`),
  }));

  const dbStandalone = await db
    .select({
      slug: posts.slug,
      title: posts.title,
      publishedAt: posts.publishedAt,
    })
    .from(posts)
    .where(and(isNull(posts.seriesId), lte(posts.publishedAt, now)));

  const staticPosts = await getPublishedStaticPosts(now);
  const dbSlugs = new Set(dbStandalone.map((post) => post.slug));

  const standalone = [
    ...dbStandalone.map((post) => ({
      slug: post.slug,
      title: post.title,
      publishedAt: post.publishedAt,
    })),
    // 同じスラッグが DB にあれば DB を優先する
    ...staticPosts
      .filter((post) => !dbSlugs.has(post.slug))
      .map((post) => ({
        slug: post.slug,
        title: post.title,
        publishedAt: post.publishedAt as Date | null,
      })),
  ].sort(
    (a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0),
  );

  const standaloneEntries: ArchiveEntry[] = standalone.map((post) => ({
    href: `/${ownerUsername}/blog/post/${post.slug}`,
    badge: "短編",
    title: post.title,
    sub: formatBlogDate(post.publishedAt),
    readKeys: [`post:${post.slug}`],
  }));

  return (
    <NovelStage>
      <NovelArchive
        back={
          ownerUsername === "hrsm"
            ? { href: "/hrsm", label: "TITLE" }
            : undefined
        }
        heading="記録の閲覧"
        lead="開発の記録と、ときどき書いた単発の記事。"
        prompt="どれを閲覧しますか？"
        sections={[
          {
            label: "連載",
            entries: seriesEntries,
            empty: "まだ公開中の連載はありません。",
          },
          {
            label: "単発の記事",
            entries: standaloneEntries,
            empty: "まだ公開中の記事はありません。",
          },
        ]}
      />
    </NovelStage>
  );
}
