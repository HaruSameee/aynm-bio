import AdvFrame from "./AdvFrame";
import EpisodeList from "./EpisodeList";
import ui from "./ui.module.css";
import type { Chapter } from "../_lib/scenario";
import styles from "./scenario.module.css";

/* 章（話の一覧）画面。/hrsm/blog/[series] と /hrsm/blog/post（番外編）で共用 */
export default function ChapterPage({ chapter }: { chapter: Chapter }) {
  return (
    <AdvFrame back={{ href: "/hrsm/blog", label: "章選択" }} screen="SCENARIO" title="シナリオ">
      <header className={`${ui.window} ${styles.chapterHeader}`}>
        <p className={styles.chapterLabel}>{chapter.label}</p>
        <h1 className={styles.chapterTitle}>{chapter.title}</h1>
        {chapter.description ? (
          <p className={styles.chapterDescription}>{chapter.description}</p>
        ) : null}
      </header>

      <EpisodeList episodes={chapter.episodes} />
    </AdvFrame>
  );
}
