import type { Metadata } from "next";

import { hrsmMetadata } from "../../_lib/metadata";
import { getChapter } from "../../_lib/scenario";
import ChapterPage from "../../_components/ChapterPage";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ series: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const chapter = await getChapter((await params).series);

  return hrsmMetadata({
    title: `${chapter.label} ${chapter.title} | HRSM`,
    description:
      chapter.description ?? `${chapter.title}（全${chapter.episodes.length}話）`,
    path: chapter.href,
  });
}

export default async function HrsmChapterPage({ params }: PageProps) {
  const chapter = await getChapter((await params).series);

  return <ChapterPage chapter={chapter} />;
}
