import type { Metadata } from "next";
import Link from "next/link";

import styles from "./hrsm.module.css";

const profileLinks = [
  {
    label: "GitHub",
    href: "https://github.com/HaruSameee",
    detail: "HaruSameee",
  },
  {
    label: "X",
    href: "https://x.com/hrs0_0m",
    detail: "@hrs0_0m",
  },
  {
    label: "Telegram",
    href: "https://t.me/HRSM_L",
    detail: "HRSM_L",
  },
  {
    label: "Discord",
    href: "https://discord.gg/aynm",
    detail: "aynm",
  },
];

const profileRows = [
  { label: "なまえ", value: "HRSM (はるさめ)" },
  { label: "ROLE", value: "Engineer" },
  { label: "MAIN", value: "Rust" },
  { label: "SUB", value: "TypeScript" },
  { label: "FIELD", value: "Systems" },
  { label: "AGE", value: "17" },
  { label: "STATE", value: "Available" },
];

const signalLog = [
  "でんぱ じゅしんちゅう …………… OK",
  "あきば はっしんきょてん ………… OK",
  "Rust コンパイル ………………… ERROR は 愛",
  "のうは どうきりつ 99.9% (さように エラー)",
  "※このページは せいじょう です(たぶん)",
];

const marqueeText =
  "★ ようこそ はるさめのへや へ ★ でんぱ じゅしんちゅう ★ かんりにん: hrsm ★ リンクは じゆう に どうぞ ★ ";

export const metadata: Metadata = {
  title: "hrsmのへや | aynm.dev",
  description: "HRSM profile on aynm.dev",
};

function isExternalLink(href: string) {
  return href.startsWith("http");
}

export default function HrsmPage() {
  return (
    <main className={styles.stage}>
      <div className={styles.window}>
        <div className={styles.titleBar}>
          <span className={styles.titleBarText}>
            hrsm.exe ― でんぱ じゅしんちゅう
          </span>
          <span className={styles.winButtons} aria-hidden="true">
            <span className={styles.winBtn}>_</span>
            <span className={styles.winBtn}>□</span>
            <span className={styles.winBtn}>×</span>
          </span>
        </div>

        <div className={styles.windowBody}>
          <div className={styles.marquee} aria-hidden="true">
            <div className={styles.marqueeTrack}>
              <span>{marqueeText}</span>
              <span>{marqueeText}</span>
            </div>
          </div>

          <header className={styles.header}>
            <p className={styles.headerKaomoji}>(๑•̀ㅂ•́)و✧</p>
            <h1 className={styles.title}>
              <span className={styles.blink}>★</span> HRSM{" "}
              <span className={styles.blink}>★</span>
            </h1>
            <p className={styles.titleSub}>～ はるさめのへや ～</p>
            <p className={styles.headerNote}>
              ※このページは 800×600 のかいぞうどで みてね
            </p>
          </header>

          <div className={styles.rainbowBar} aria-hidden="true" />

          <section aria-labelledby="profile-title">
            <h2 id="profile-title" className={styles.sectionTitle}>
              ◆ プロフちょう ◆
            </h2>
            <dl className={styles.profTable}>
              {profileRows.map((row) => (
                <div className={styles.profRow} key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="denpa-title">
            <h2 id="denpa-title" className={styles.sectionTitle}>
              ◆ でんぱログ ◆
            </h2>
            <div className={styles.terminal}>
              {signalLog.map((line) => (
                <p className={styles.termLine} key={line}>
                  &gt; {line}
                </p>
              ))}
              <p className={styles.termLine}>
                &gt; <span className={styles.termCursor}>▮</span>
              </p>
            </div>
          </section>

          <p className={styles.bio}>
            ★ ひとこと ★ 追記よてい…………………………でんぱが よわい
          </p>

          <div className={styles.rainbowBar} aria-hidden="true" />

          <section aria-labelledby="link-title">
            <h2 id="link-title" className={styles.sectionTitle}>
              ◆ りんくしゅう ◆
            </h2>
            <div className={styles.linkGrid}>
              {profileLinks.map((item) => {
                const external = isExternalLink(item.href);

                return (
                  <Link
                    aria-label={`${item.label}: ${item.detail}`}
                    className={styles.linkBtn}
                    href={item.href}
                    key={item.href}
                    rel={external ? "noopener noreferrer" : undefined}
                    target={external ? "_blank" : undefined}
                  >
                    <span>{item.label}</span>
                    <strong>{item.detail}</strong>
                  </Link>
                );
              })}
            </div>
          </section>

          <footer className={styles.footer}>
            <p>
              キミは <span className={styles.counterNum}>0131072</span>{" "}
              にんめの ほうもんしゃ だよ! キリばん ふんだら おしえてね
            </p>
            <p>
              かんりにん: hrsm / since 2024 /{" "}
              <Link className={styles.licenseLink} href="/hrsm/license">
                License
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
