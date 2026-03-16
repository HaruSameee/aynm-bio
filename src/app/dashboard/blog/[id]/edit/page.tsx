import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { BlogPostForm } from "@/components/BlogPostForm";
import { db } from "@/db";
import { posts, series } from "@/db/schema";
import { requireOwner } from "@/lib/auth-guard";
import { formatDateTimeLocalValue } from "@/lib/blog";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBlogPostPage({ params }: PageProps) {
  await requireOwner();

  const { id } = await params;

  const [post] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);

  if (!post) {
    notFound();
  }

  const seriesOptions = await db
    .select({
      id: series.id,
      title: series.title,
      slug: series.slug,
    })
    .from(series)
    .orderBy(asc(series.title));

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-5 py-8 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-[#949ba4]">
          blog-dashboard
        </p>
        <h1 className="text-4xl font-semibold text-white">Edit post</h1>
        <p className="text-sm text-[#b5bac1]">
          Update content, scheduling, or move the post into a series.
        </p>
      </header>
      <BlogPostForm
        initialPost={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          seriesId: post.seriesId,
          seriesOrder: post.seriesOrder,
          body: post.body,
          publishedAt: formatDateTimeLocalValue(post.publishedAt),
        }}
        mode="edit"
        seriesOptions={seriesOptions}
      />
    </main>
  );
}
