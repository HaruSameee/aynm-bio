import type { ReactNode } from "react";

import { novelFontClass } from "./fonts";
import styles from "./novel.module.css";

// 背景（空と水面）とフォントだけを受け持つ外枠
export default function NovelStage({ children }: { children: ReactNode }) {
  return (
    <div className={`${styles.stage} ${novelFontClass}`}>
      <div aria-hidden className={styles.backdrop}>
        <div className={styles.sky} />
        <div className={styles.sun} />
        <div className={`${styles.cloud} ${styles.cloudA}`} />
        <div className={`${styles.cloud} ${styles.cloudB}`} />
        <div className={`${styles.cloud} ${styles.cloudC}`} />
        <div className={styles.sea}>
          <div className={styles.seaShine} />
          <div className={styles.seaWaves} />
        </div>
        <div className={styles.motes} />
        <div className={styles.vignette} />
      </div>
      <div className={styles.stageContent}>{children}</div>
    </div>
  );
}
