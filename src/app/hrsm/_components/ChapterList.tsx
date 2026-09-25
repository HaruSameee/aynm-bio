"use client";

import Link from "next/link";

import styles from "./scenario.module.css";
import type { Chapter } from "../_lib/scenario";
import { useReadState } from "../_lib/readState";

export default function ChapterList({ chapters }: { chapters: Chapter[] }) {
  const readState = useReadState();

  return (
    <ol className={styles.list}>
      {chapters.map((chapter) => {
        const newCount = readState
          ? chapter.episodes.filter((episode) =>
              readState.isNew(episode.slug, episode.publishedAt),
            ).length
          : 0;
        const latest = chapter.episodes.reduce((a, b) =>
          a.publishedAt >= b.publishedAt ? a : b,
        );

        return (
          <li key={chapter.slug}>
            <Link className={styles.card} href={chapter.href}>
              <span className={styles.cardLabel}>{chapter.label}</span>
              <span className={styles.cardTitle}>{chapter.title}</span>
              {chapter.description ? (
                <span className={styles.cardDescription}>{chapter.description}</span>
              ) : null}
              <span className={styles.cardMeta}>
                <span>全{chapter.episodes.length}話</span>
                <span>最終更新【{latest.publishedLabel}】</span>
                {newCount > 0 ? (
                  <span className={`${styles.badge} ${styles.badgeNew}`}>
                    NEW {newCount}
                  </span>
                ) : null}
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
