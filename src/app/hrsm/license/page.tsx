import type { Metadata } from "next";
import Link from "next/link";

import styles from "./license.module.css";

const creditSections = [
  {
    title: "使用モデル",
    rows: [
      ["Model", "TBD"],
      ["Author / Distributor", "TBD"],
      ["License", "TBD"],
    ],
  },
  {
    title: "モーション / 背景",
    rows: [
      ["Motion", "TBD"],
      ["Stage / Background", "TBD"],
      ["Video Encode", "WebM VP9 / 60fps"],
    ],
  },
  {
    title: "オマージュ元",
    rows: [
      ["Visual Reference", "Zenless Zone Zero character detail UI"],
      ["Scope", "Layout, panel composition, and HUD mood reference"],
      ["Note", "This is a personal fan-made homage and is not affiliated with HoYoverse."],
    ],
  },
];

export const metadata: Metadata = {
  title: "License | HRSM",
  description: "Credits and license notes for the HRSM bio page.",
};

export default function HrsmLicensePage() {
  return (
    <main className={styles.licenseStage}>
      <div className={styles.licenseShell}>
        <header className={styles.licenseHeader}>
          <Link className={styles.licenseButton} href="/hrsm">
            HRSM
          </Link>
          <p>LICENSE / CREDITS</p>
        </header>

        <article className={styles.licensePanel}>
          <p className={styles.panelEyebrow}>AYNM.DEV / BIO</p>
          <h1>License</h1>
          <p className={styles.licenseLead}>
            このページで使用しているモデル、動画素材、参考にしたUI表現のクレジットをまとめる場所です。
            未確定の項目は `TBD` として仮置きしています。
          </p>

          <div className={styles.creditGrid}>
            {creditSections.map((section) => (
              <section className={styles.creditSection} key={section.title}>
                <h2>{section.title}</h2>
                <dl>
                  {section.rows.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </article>
      </div>
    </main>
  );
}
