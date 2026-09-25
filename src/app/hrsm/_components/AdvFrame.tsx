import Link from "next/link";

import styles from "./AdvFrame.module.css";
import QuickMenu from "./QuickMenu";

type AdvFrameProps = {
  /** 画面名（英字・小さく表示） */
  screen: string;
  /** 画面名（日本語） */
  title: string;
  back?: { href: string; label: string };
  children: React.ReactNode;
};

/* タイトル画面以外の共通枠：上部に画面名と「もどる」、下部にクイックメニュー */
export default function AdvFrame({ screen, title, back, children }: AdvFrameProps) {
  return (
    <div className={styles.frame}>
      <header className={styles.header}>
        {back ? (
          <Link className={styles.back} href={back.href}>
            <span aria-hidden="true">◀</span> {back.label}
          </Link>
        ) : (
          <span />
        )}
        <p className={styles.screenName}>
          <span className={styles.screenEn}>{screen}</span>
          <span className={styles.screenJa}>{title}</span>
        </p>
      </header>

      <main className={styles.main}>{children}</main>

      <QuickMenu />
    </div>
  );
}
