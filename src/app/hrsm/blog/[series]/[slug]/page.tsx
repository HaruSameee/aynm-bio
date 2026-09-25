import type { Metadata } from "next";

import ArticlePage from "../../../_components/ArticlePage";
import { episodeMetadata } from "../../../_lib/episodeMetadata";
import { getEpisode } from "../../../_lib/scenario";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ series: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { series, slug } = await params;

  return episodeMetadata(series, slug);
}

export default async function HrsmEpisodePage({ params }: PageProps) {
  const { series, slug } = await params;

  return <ArticlePage {...await getEpisode(series, slug)} />;
}
