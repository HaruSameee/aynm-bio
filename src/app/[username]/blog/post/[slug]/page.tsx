import Link from "next/link";
import { and, eq, isNull, lte } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/db";
import { posts } from "@/db/schema";
import {
  formatBlogDateTime,
  normalizeBlogSlug,
  requireOwnerBlogUsername,
} from "@/lib/blog";
import { renderMarkdown } from "@/lib/markdown";

type PageProps = {
  params: Promise<{ username: string; slug: string }>;
};

export default async function StandalonePostPage({ params }: PageProps) {
  const { username, slug } = await params;
  const ownerUsername = await requireOwnerBlogUsername(username);
  const now = new Date();
  const postSlug = normalizeBlogSlug(slug);

  const [post] = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, postSlug), isNull(posts.seriesId), lte(posts.publishedAt, now)))
    .limit(1);

  if (!post) {
    notFound();
  }

  const html = await renderMarkdown(post.body);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 px-5 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <Link
          className="text-sm font-medium text-[#8ea1ff] hover:text-white"
          href={`/${ownerUsername}/blog`}
        >
          Back to blog
        </Link>
        <h1 className="text-4xl font-semibold text-white">{post.title}</h1>
        <div className="text-sm text-[#949ba4]">
          {formatBlogDateTime(post.publishedAt)}
        </div>
      </header>

      <article
        className="prose prose-invert max-w-none rounded-3xl border border-white/10 bg-[#10131e] px-6 py-6 prose-a:text-[#8ea1ff]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </main>
  );
}
