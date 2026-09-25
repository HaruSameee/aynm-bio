"use client";

import Link from "next/link";

import styles from "./scenario.module.css";
import type { Episode } from "../_lib/scenario";
import { useReadState } from "../_lib/readState";
import EpisodeBadge from "./EpisodeBadge";

export default function EpisodeList({ episodes }: { episodes: Episode[] }) {
  const readState = useReadState();

  return (
    <ol className={styles.list}>
      {episodes.map((episode) => (
        <li key={episode.slug}>
          <Link className={styles.card} href={episode.href}>
            <span className={styles.cardLabel}>{episode.label}</span>
            <span className={styles.cardTitle}>{episode.title}</span>
            <span className={styles.cardMeta}>
              <time dateTime={episode.publishedAt}>【{episode.publishedLabel}】</time>
              <EpisodeBadge
                publishedAt={episode.publishedAt}
                slug={episode.slug}
                state={readState}
              />
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
