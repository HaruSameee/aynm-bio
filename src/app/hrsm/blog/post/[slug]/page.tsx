import type { Metadata } from "next";

import ArticlePage from "../../../_components/ArticlePage";
import { episodeMetadata } from "../../../_lib/episodeMetadata";
import { EXTRA_CHAPTER_SLUG, getEpisode } from "../../../_lib/scenario";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return episodeMetadata(EXTRA_CHAPTER_SLUG, (await params).slug);
}

export default async function HrsmExtraEpisodePage({ params }: PageProps) {
  return <ArticlePage {...await getEpisode(EXTRA_CHAPTER_SLUG, (await params).slug)} />;
}
