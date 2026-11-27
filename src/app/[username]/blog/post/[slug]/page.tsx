import type { Metadata } from "next";
import { and, eq, isNull, lte } from "drizzle-orm";
import { notFound } from "next/navigation";

import NovelReader from "@/components/novel/NovelReader";
import NovelStage from "@/components/novel/NovelStage";
import { db } from "@/db";
import { posts } from "@/db/schema";
import {
  formatBlogDateTime,
  normalizeBlogSlug,
  requireOwnerBlogUsername,
} from "@/lib/blog";
import { excerptOf, renderNovelPages } from "@/lib/novel";
import { getStaticPost } from "@/lib/static-posts";

type PageProps = {
  params: Promise<{ username: string; slug: string }>;
};

// DB の単発記事を先に探し、なければリポジトリの Markdown 記事を探す
async function loadPost(slug: string) {
  const postSlug = normalizeBlogSlug(slug);
  const [post] = await db
    .select()
    .from(posts)
    .where(
      and(eq(posts.slug, postSlug), isNull(posts.seriesId), lte(posts.publishedAt, new Date())),
    )
    .limit(1);

  if (post) {
    return {
      slug: post.slug,
      title: post.title,
      publishedAt: post.publishedAt,
      speaker: "春鮫",
      origin: null as string | null,
      description: excerptOf(post.body),
      pages: renderNovelPages(post.body, { title: post.title }),
    };
  }

  const staticPost = await getStaticPost(postSlug);

  if (!staticPost) {
    return null;
  }

  return {
    slug: staticPost.slug,
    title: staticPost.title,
    publishedAt: staticPost.publishedAt as Date | null,
    speaker: staticPost.speaker ?? "春鮫",
    origin: staticPost.origin,
    description: excerptOf(staticPost.body),
    // 移してきた記事は元サイトの表示（見出しを1段下げ、単独の改行は詰める）に合わせる
    pages: renderNovelPages(staticPost.body, { shiftHeadings: true, breaks: false }),
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadPost(slug);

  return {
    title: post ? `${post.title} | 春鮫` : "ブログ | 春鮫",
    description: post?.description,
  };
}

export default async function StandalonePostPage({ params }: PageProps) {
  const { username, slug } = await params;
  const ownerUsername = await requireOwnerBlogUsername(username);
  const post = await loadPost(slug);

  if (!post) {
    notFound();
  }

  const blogHref = `/${ownerUsername}/blog`;

  return (
    <NovelStage>
      <NovelReader
        back={{ href: blogHref, label: "ARCHIVE" }}
        choices={[{ href: blogHref, label: "記録の一覧に戻る" }]}
        dateLabel={formatBlogDateTime(post.publishedAt)}
        kicker="短編"
        note={post.origin}
        pages={post.pages}
        speaker={post.speaker}
        storageKey={`post:${post.slug}`}
        title={post.title}
      />
    </NovelStage>
  );
}
