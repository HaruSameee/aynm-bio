import type { Metadata } from "next";

import { hrsmMetadata } from "./metadata";
import { excerptFromMarkdown, getEpisode } from "./scenario";

export async function episodeMetadata(
  chapterSlug: string,
  episodeSlug: string,
): Promise<Metadata> {
  const { chapter, episode, body } = await getEpisode(chapterSlug, episodeSlug);

  return hrsmMetadata({
    title: `${episode.title} | HRSM`,
    description: excerptFromMarkdown(body) || `${chapter.label} ${episode.label}`,
    path: episode.href,
    type: "article",
    publishedTime: episode.publishedAt,
  });
}
