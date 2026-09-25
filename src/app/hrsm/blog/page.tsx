import AdvFrame from "../_components/AdvFrame";
import ChapterList from "../_components/ChapterList";
import ui from "../_components/ui.module.css";
import { hrsmMetadata } from "../_lib/metadata";
import { getScenarioArchive } from "../_lib/scenario";
import styles from "../_components/scenario.module.css";

export const dynamic = "force-dynamic";

export const metadata = hrsmMetadata({
  title: "シナリオ | HRSM",
  description: "はるさめ（HRSM）のブログ。章ごとに記事をまとめたシナリオアーカイブ。",
  path: "/hrsm/blog",
});

export default async function HrsmScenarioPage() {
  const chapters = await getScenarioArchive();

  return (
    <AdvFrame back={{ href: "/hrsm", label: "タイトル" }} screen="SCENARIO" title="シナリオ">
      <h1 className="sr-only">シナリオ</h1>
      <section className={`${ui.message} ${styles.prompt}`}>
        <span className={ui.nameBox}>SYSTEM</span>
        <p className={ui.messageText}>どれを閲覧しますか？</p>
      </section>

      {chapters.length > 0 ? (
        <ChapterList chapters={chapters} />
      ) : (
        <p className={styles.empty}>まだ 公開されている シナリオは ありません。</p>
      )}
    </AdvFrame>
  );
}
