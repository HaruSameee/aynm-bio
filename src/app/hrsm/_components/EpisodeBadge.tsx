"use client";

import type { ReadState } from "../_lib/readState";
import styles from "./scenario.module.css";

type EpisodeBadgeProps = {
  state: ReadState | null;
  slug: string;
  publishedAt: string;
};

export default function EpisodeBadge({ state, slug, publishedAt }: EpisodeBadgeProps) {
  if (!state) {
    return null;
  }

  if (state.isRead(slug)) {
    return <span className={`${styles.badge} ${styles.badgeRead}`}>既読</span>;
  }

  if (state.isNew(slug, publishedAt)) {
    return <span className={`${styles.badge} ${styles.badgeNew}`}>NEW</span>;
  }

  return null;
}
