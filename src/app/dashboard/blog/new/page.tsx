import { asc } from "drizzle-orm";

import { BlogPostForm } from "@/components/BlogPostForm";
import { db } from "@/db";
import { series } from "@/db/schema";
import { requireOwner } from "@/lib/auth-guard";

export default async function NewBlogPostPage() {
  await requireOwner();

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
        <h1 className="text-4xl font-semibold text-white">New post</h1>
        <p className="text-sm text-[#b5bac1]">
          Draft in Markdown, assign a series if needed, and publish when ready.
        </p>
      </header>
      <BlogPostForm mode="create" seriesOptions={seriesOptions} />
    </main>
  );
}
