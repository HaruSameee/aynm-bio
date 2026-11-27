import Link from "next/link";

import ReadStamp from "./ReadStamp";
import styles from "./novel.module.css";

export type ArchiveEntry = {
  href: string;
  badge: string;
  title: string;
  sub: string;
  description?: string | null;
  readKeys: string[];
};

export type ArchiveSection = {
  label: string;
  entries: ArchiveEntry[];
  empty: string;
};

type Props = {
  heading: string;
  lead?: string | null;
  sections: ArchiveSection[];
  prompt: string;
  back?: { href: string; label: string };
};

// ソシャゲのシナリオアーカイブ風「どれを閲覧しますか？」画面
export default function NovelArchive({ heading, lead, sections, prompt, back }: Props) {
  return (
    <div className={styles.archive}>
      <nav aria-label="システム" className={styles.systemBar}>
        {back ? (
          <Link className={styles.sysButton} href={back.href}>
            {back.label}
          </Link>
        ) : null}
      </nav>

      <header className={styles.archiveHeader}>
        <p className={styles.archiveEyebrow}>ARCHIVE</p>
        <h1 className={styles.archiveTitle}>{heading}</h1>
        {lead ? <p className={styles.archiveLead}>{lead}</p> : null}
      </header>

      <div className={styles.archivePanel}>
        {sections.map((section) => (
          <section className={styles.archiveSection} key={section.label}>
            <h2 className={styles.archiveSectionLabel}>{section.label}</h2>
            {section.entries.length > 0 ? (
              <ol className={styles.archiveList}>
                {section.entries.map((entry) => (
                  <li key={entry.href}>
                    <Link className={styles.archiveItem} href={entry.href}>
                      <span className={styles.archiveBadge}>{entry.badge}</span>
                      <span className={styles.archiveText}>
                        <span className={styles.archiveItemTitle}>{entry.title}</span>
                        {entry.description ? (
                          <span className={styles.archiveItemDesc}>
                            {entry.description}
                          </span>
                        ) : null}
                        <span className={styles.archiveItemSub}>{entry.sub}</span>
                      </span>
                      <ReadStamp keys={entry.readKeys} />
                    </Link>
                  </li>
                ))}
              </ol>
            ) : (
              <p className={styles.archiveEmpty}>{section.empty}</p>
            )}
          </section>
        ))}
      </div>

      <div className={styles.promptWindow}>
        <p className={styles.promptText}>
          {prompt}
          <span aria-hidden className={styles.promptCursor}>
            ▼
          </span>
        </p>
      </div>
    </div>
  );
}
