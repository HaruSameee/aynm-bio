import Link from "next/link";

import styles from "./AdvFrame.module.css";
import QuickMenu from "./QuickMenu";

type AdvFrameProps = {
  /** 画面名（英字） */
  screen: string;
  /** 画面名（日本語） */
  title: string;
  back?: { href: string; label: string };
  children: React.ReactNode;
};

/* タイトル画面以外の共通枠：当時の公式サイト風（バナー＋ナビ＋固定幅の本文＋フッター） */
export default function AdvFrame({ screen, title, back, children }: AdvFrameProps) {
  return (
    <div className={styles.site}>
      <header className={styles.banner}>
        {/* バナー画像の差し替え枠。今はCSSのグラデーションと文字だけ */}
        <Link className={styles.bannerLink} href="/hrsm">
          <span className={styles.bannerTitle}>はるさめのへや</span>
          <span className={styles.bannerEn}>HRSM&apos;s Sky-Blue Room ― Official Web Site</span>
        </Link>
      </header>

      <QuickMenu />

      <div className={styles.pageHead}>
        <p className={styles.pageTitle}>
          <span className={styles.pageTitleEn}>{screen}</span>
          <span className={styles.pageTitleJa}>{title}</span>
        </p>
        {back ? (
          <Link className={styles.back} href={back.href}>
            <span aria-hidden="true">◀</span> {back.label}
          </Link>
        ) : null}
      </div>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <p>Copyright © HRSM All Rights Reserved.</p>
      </footer>
    </div>
  );
}
