import type { Metadata, Viewport } from "next";
import { Fragment } from "react";
import { DM_Mono, Klee_One, Zen_Kaku_Gothic_New } from "next/font/google";

import DiveEffects from "./DiveEffects";
import styles from "./hrsm.module.css";

const hand = Klee_One({
  weight: "600",
  display: "swap",
  preload: false,
  variable: "--font-hand",
});

const body = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false,
  variable: "--font-body",
});

const mono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "春鮫 | HRSM",
  description: "VRChatでワールドとギミックを作っている、HRSM（はるさめ）のページ。",
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#f6fbf9",
};

const facts = [
  { label: "なまえ", value: "HRSM（はるさめ）" },
  { label: "VRChat", value: "hrs0_0m", mono: true },
  { label: "つくるもの", value: "ワールド、ギミック、アバター改変" },
  { label: "しごと", value: "フリーランスのエンジニア（Rust / TypeScript）" },
  { label: "いる場所", value: "Discordコミュニティ「illusion」" },
];

const works = [
  {
    name: "HResort",
    tag: "ワールド ・ 公開中",
    text: "VRChatで公開しているワールド。Avatar Illusionerも置いてあります。",
  },
  {
    name: "Avatar Illusioner",
    tag: "ギミック ・ 無料配布",
    text: "アバターを分身として立体投影するギミック。BOOTHで配っています。",
  },
  {
    name: "Assay",
    tag: "Webサービス",
    text: "ポケモンユナイトの非公式ランクマッチ。",
  },
  {
    name: "RFST",
    tag: "ツール ・ Rust",
    text: "声のフォルマントをリアルタイムで動かすツール。",
  },
  {
    name: "Rust-VC",
    tag: "ツール ・ Rust",
    text: "音声変換のRVCを、Rustで再実装したもの。",
  },
];

const links = [
  {
    key: "VRCHAT",
    label: "hrs0_0m",
    href: "https://vrchat.com/home/user/usr_4d291333-4bbd-4128-87c8-b8442f35d433",
  },
  { key: "X", label: "@hrs0_0m", href: "https://x.com/hrs0_0m" },
  { key: "BOOTH", label: "haruhasame", href: "https://haruhasame.booth.pm" },
  { key: "GITHUB", label: "HaruSameee", href: "https://github.com/HaruSameee" },
  { key: "DISCORD", label: "illusion", href: "https://discord.gg/mDQHNAM22X" },
];

const SHARK_PATH =
  "M4,50C28,34 62,28 96,29L118,6C116,18 120,27 132,31C160,35 184,41 204,44L236,12C226,30 220,42 219,50L232,74C218,66 208,58 200,53C176,58 152,62 128,63L108,63L106,86C98,76 88,66 80,62C52,62 24,58 4,50Z";

function Shark({ reverse = false }: { reverse?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={reverse ? `${styles.shark} ${styles.rev}` : styles.shark}
      viewBox="0 0 240 90"
    >
      <path d={SHARK_PATH} />
    </svg>
  );
}

function Eyebrow({ depth, zone }: { depth: string; zone: string }) {
  return (
    <p className={styles.eyebrow}>
      <span>水深 {depth} m</span>
      <span>{zone}</span>
    </p>
  );
}

export default function HrsmPage() {
  return (
    <div className={`${styles.ocean} ${hand.variable} ${body.variable} ${mono.variable}`}>
      <DiveEffects />

      <main>
        <header className={`${styles.zone} ${styles.surface}`}>
          <div className={styles.rays} />
          <div className={styles.col}>
            <Eyebrow depth="0" zone="水面" />
            <h1 className={styles.name}>春鮫</h1>
            <div className={styles.intro}>
              <p className={styles.handle}>
                HRSM<span>はるさめ</span>
              </p>
              <p className={styles.line}>VRChatでワールドとギミックを作っている、Rust書きです。</p>
              <p className={styles.hint}>スクロールで潜る</p>
            </div>
          </div>
        </header>

        <div aria-hidden="true" className={`${styles.open} ${styles.o1}`}>
          <Shark />
        </div>

        <section className={`${styles.zone} ${styles.shallows}`} id="about">
          <div className={styles.col}>
            <Eyebrow depth="10" zone="表層" />
            <h2 className={styles.heading}>この人について</h2>
            <dl className={styles.facts}>
              {facts.map((f) => (
                <Fragment key={f.label}>
                  <dt>{f.label}</dt>
                  <dd className={f.mono ? styles.id : undefined}>{f.value}</dd>
                </Fragment>
              ))}
            </dl>
          </div>
        </section>

        <div aria-hidden="true" className={`${styles.open} ${styles.o2}`}>
          <Shark reverse />
        </div>

        <section className={`${styles.zone} ${styles.mid}`} id="works">
          <div className={styles.col}>
            <Eyebrow depth="200" zone="中深層" />
            <h2 className={styles.heading}>つくったもの</h2>
            <ul className={styles.works}>
              {works.map((w) => (
                <li key={w.name}>
                  <div className={styles.workHead}>
                    <h3>{w.name}</h3>
                    <span className={styles.tag}>{w.tag}</span>
                  </div>
                  <p>{w.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div aria-hidden="true" className={`${styles.open} ${styles.o3}`}>
          <Shark />
        </div>

        <section className={`${styles.zone} ${styles.deep}`} id="links">
          <div className={styles.col}>
            <Eyebrow depth="1,000" zone="漸深層" />
            <h2 className={styles.heading}>つながる</h2>
            <ul className={styles.links}>
              {links.map((l) => (
                <li key={l.key}>
                  <a className={styles.row} href={l.href} rel="noopener noreferrer" target="_blank">
                    <span className={styles.k}>{l.key}</span>
                    <span className={styles.v}>{l.label}</span>
                    <span className={styles.go}>→</span>
                  </a>
                </li>
              ))}
            </ul>

            <pre className={styles.log}>
              {"> せんすい かいし ...... "}
              <b>OK</b>
              {"\n> すいしん 1,000 m .... "}
              <b>とうたつ</b>
              {"\n> Rust コンパイル ..... "}
              <b>ERROR は 愛</b>
              {"\n> ※このサメは むがい です(たぶん)"}
            </pre>
          </div>
        </section>
      </main>
    </div>
  );
}
