import { asc, eq, lte } from "drizzle-orm";
import { notFound } from "next/navigation";
import { cache } from "react";

import { db } from "@/db";
import { posts, series as seriesTable } from "@/db/schema";
import {
  formatBlogDate,
  normalizeBlogSlug,
  requireOwnerBlogUsername,
} from "@/lib/blog";

/*
 * シナリオ（ブログ）のデータ。既存のブログ（series / posts テーブル）をそのまま使う。
 *   章 = series（作成順に 第1章, 第2章 …）
 *   話 = posts（series_order 順。話数も series_order。無ければ並び順から採番）
 *   シリーズに属さない記事 = 「番外編」（slug: "post"。既存の予約スラッグと同じ）
 */

const HRSM_USERNAME = "hrsm";
export const EXTRA_CHAPTER_SLUG = "post";

export type Episode = {
  slug: string;
  title: string;
  /** 「第3話」「EX.1」など */
  label: string;
  href: string;
  publishedAt: string;
  publishedLabel: string;
};

export type Chapter = {
  slug: string;
  /** 「第1章」「番外編」など */
  label: string;
  title: string;
  description: string | null;
  href: string;
  episodes: Episode[];
};

export function chapterHref(chapterSlug: string) {
  return `/hrsm/blog/${chapterSlug}`;
}

/* 公開済みの章・話をすべて取得（リクエスト内でキャッシュ） */
export const getScenarioArchive = cache(async (): Promise<Chapter[]> => {
  await requireOwnerBlogUsername(HRSM_USERNAME);
  const now = new Date();

  const [seriesRows, postRows] = await Promise.all([
    db.select().from(seriesTable).orderBy(asc(seriesTable.createdAt)),
    db
      .select({
        slug: posts.slug,
        title: posts.title,
        seriesId: posts.seriesId,
        seriesOrder: posts.seriesOrder,
        publishedAt: posts.publishedAt,
      })
      .from(posts)
      .where(lte(posts.publishedAt, now))
      .orderBy(asc(posts.seriesOrder), asc(posts.publishedAt), asc(posts.title)),
  ]);

  const toEpisode = (
    post: (typeof postRows)[number],
    label: string,
    chapterSlug: string,
  ): Episode => ({
    slug: post.slug,
    title: post.title,
    label,
    href: `${chapterHref(chapterSlug)}/${post.slug}`,
    // lte(publishedAt, now) で null は除外済み
    publishedAt: post.publishedAt!.toISOString(),
    publishedLabel: formatBlogDate(post.publishedAt),
  });

  const chapters: Chapter[] = [];

  for (const item of seriesRows) {
    const seriesPosts = postRows.filter((post) => post.seriesId === item.id);

    // 公開済みの話がない章は出さない（既存のブログ一覧と同じ挙動）
    if (seriesPosts.length === 0) {
      continue;
    }

    chapters.push({
      slug: item.slug,
      label: `第${chapters.length + 1}章`,
      title: item.title,
      description: item.description,
      href: chapterHref(item.slug),
      episodes: seriesPosts.map((post, index) =>
        toEpisode(post, `第${post.seriesOrder ?? index + 1}話`, item.slug),
      ),
    });
  }

  const standalonePosts = postRows
    .filter((post) => post.seriesId === null)
    .sort((a, b) => a.publishedAt!.getTime() - b.publishedAt!.getTime());

  if (standalonePosts.length > 0) {
    chapters.push({
      slug: EXTRA_CHAPTER_SLUG,
      label: "番外編",
      title: "単発の話",
      description: "シリーズに属さない、ひとつだけの話。",
      href: chapterHref(EXTRA_CHAPTER_SLUG),
      episodes: standalonePosts.map((post, index) =>
        toEpisode(post, `EX.${index + 1}`, EXTRA_CHAPTER_SLUG),
      ),
    });
  }

  return chapters;
});

export const getChapter = cache(async (chapterSlug: string) => {
  const chapters = await getScenarioArchive();
  const chapter = chapters.find((item) => item.slug === normalizeBlogSlug(chapterSlug));

  if (!chapter) {
    notFound();
  }

  return chapter;
});

/* 記事本体と前後の話 */
export const getEpisode = cache(async (chapterSlug: string, episodeSlug: string) => {
  const chapter = await getChapter(chapterSlug);
  const index = chapter.episodes.findIndex(
    (item) => item.slug === normalizeBlogSlug(episodeSlug),
  );

  if (index === -1) {
    notFound();
  }

  const episode = chapter.episodes[index];
  const [post] = await db
    .select({ body: posts.body })
    .from(posts)
    .where(eq(posts.slug, episode.slug))
    .limit(1);

  if (!post) {
    notFound();
  }

  return {
    chapter,
    episode,
    body: post.body,
    previous: index > 0 ? chapter.episodes[index - 1] : null,
    next: index < chapter.episodes.length - 1 ? chapter.episodes[index + 1] : null,
  };
});

/* OGP の description 用に Markdown から素のテキストを抜き出す */
export function excerptFromMarkdown(markdown: string, length = 110) {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/^[\s|:-]*-{3,}[\s|:-]*$/gm, " ") // 表の区切り行・水平線
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, "")
    .replace(/[*_~|]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return text.length > length ? `${text.slice(0, length)}…` : text;
}
