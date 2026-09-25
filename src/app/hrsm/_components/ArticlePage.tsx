import Link from "next/link";

import { renderMarkdown } from "@/lib/markdown";

import styles from "./article.module.css";
import { MarkAsRead } from "../_lib/readState";
import type { getEpisode } from "../_lib/scenario";
import AdvFrame from "./AdvFrame";
import ui from "./ui.module.css";

type ArticlePageProps = Awaited<ReturnType<typeof getEpisode>>;

/* 記事画面。ADVの枠の中に、クリック送りではない通常の本文レイアウトで表示する */
export default async function ArticlePage({
  chapter,
  episode,
  body,
  previous,
  next,
}: ArticlePageProps) {
  const html = await renderMarkdown(body);

  return (
    <AdvFrame back={{ href: chapter.href, label: chapter.label }} screen="SCENARIO" title="シナリオ">
      <MarkAsRead slug={episode.slug} />

      <article className={`${ui.message} ${styles.article}`}>
        <span className={ui.nameBox}>
          {chapter.label} {chapter.title}
        </span>

        <header className={styles.header}>
          <p className={styles.episodeLabel}>{episode.label}</p>
          <h1 className={styles.title}>{episode.title}</h1>
          <time className={styles.date} dateTime={episode.publishedAt}>
            {episode.publishedLabel}
          </time>
        </header>

        <div className={styles.body} dangerouslySetInnerHTML={{ __html: html }} />
      </article>

      <nav aria-label="前後の話" className={styles.pager}>
        {previous ? (
          <Link className={styles.pagerLink} href={previous.href} rel="prev">
            <span className={styles.pagerDir}>◀ 前の話</span>
            <span className={styles.pagerTitle}>
              {previous.label} {previous.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link className={`${styles.pagerLink} ${styles.pagerNext}`} href={next.href} rel="next">
            <span className={styles.pagerDir}>次の話 ▶</span>
            <span className={styles.pagerTitle}>
              {next.label} {next.title}
            </span>
          </Link>
        ) : (
          <Link className={`${styles.pagerLink} ${styles.pagerNext}`} href={chapter.href}>
            <span className={styles.pagerDir}>おわり</span>
            <span className={styles.pagerTitle}>{chapter.label}の一覧へ</span>
          </Link>
        )}
      </nav>
    </AdvFrame>
  );
}
