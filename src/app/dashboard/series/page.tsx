import { count, desc, eq } from "drizzle-orm";

import { SeriesManager } from "@/components/SeriesManager";
import { db } from "@/db";
import { posts, series } from "@/db/schema";
import { requireOwner } from "@/lib/auth-guard";

export default async function DashboardSeriesPage() {
  await requireOwner();

  const seriesList = await db
    .select({
      id: series.id,
      slug: series.slug,
      title: series.title,
      description: series.description,
      coverImageUrl: series.coverImageUrl,
      postCount: count(posts.id),
    })
    .from(series)
    .leftJoin(posts, eq(posts.seriesId, series.id))
    .groupBy(series.id)
    .orderBy(desc(series.createdAt));

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-5 py-8 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-[#949ba4]">
          blog-dashboard
        </p>
        <h1 className="text-4xl font-semibold text-white">Series manager</h1>
        <p className="text-sm text-[#b5bac1]">
          Keep long-form arcs organized and ready for public navigation.
        </p>
      </header>
      <SeriesManager initialSeries={seriesList} />
    </main>
  );
}
