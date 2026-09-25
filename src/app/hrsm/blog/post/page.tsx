import type { Metadata } from "next";

import { hrsmMetadata } from "../../_lib/metadata";
import { EXTRA_CHAPTER_SLUG, getChapter } from "../../_lib/scenario";
import ChapterPage from "../../_components/ChapterPage";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const chapter = await getChapter(EXTRA_CHAPTER_SLUG);

  return hrsmMetadata({
    title: `${chapter.label} ${chapter.title} | HRSM`,
    description: chapter.description ?? chapter.title,
    path: chapter.href,
  });
}

export default async function HrsmExtraChapterPage() {
  const chapter = await getChapter(EXTRA_CHAPTER_SLUG);

  return <ChapterPage chapter={chapter} />;
}
