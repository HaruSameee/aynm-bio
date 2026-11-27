import type { Metadata, Viewport } from "next";
import { Fragment } from "react";
import { DM_Mono, Klee_One, Zen_Kaku_Gothic_New } from "next/font/google";

import DiveEffects from "./DiveEffects";
import AnonContacts from "./AnonContacts";
import MailLink from "./MailLink";
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
  description:
    "Rustでリアルタイム音声処理と声質変換を書いている、HRSM（はるさめ）のポートフォリオ。",
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#f6fbf9",
};

const skills = [
  { label: "音声DSP", value: "リアルタイムの音声入出力、フォルマント・ピッチ処理（STFT / ケプストラム）" },
  { label: "声質変換", value: "RVC系モデルの推論、ONNX Runtimeでの実行" },
  { label: "バックエンド", value: "Rust（axum / sqlx）とPostgreSQL、Discord連携" },
  { label: "フロント", value: "TypeScript、Next.js、ブラウザ拡張" },
  { label: "VRChat", value: "ギミック制作、アバター改変" },
];

type Work = {
  name: string;
  tag: string;
  text: string;
  stack?: string;
  links?: ReadonlyArray<{ label: string; href: string }>;
};

const works: ReadonlyArray<Work> = [
  {
    name: "Assay",
    tag: "Webサービス ・ 運用終了",
    text:
      "ポケモンユナイトの非公式ランクマッチ。設計から本番構築まで12日で作り、開幕初日に340人が参加した。2vCPU / 6GBのVPS 1台、月20ドルほどで回しきった。",
    stack: "Rust / axum / sqlx / PostgreSQL / Discord OAuth",
    links: [{ label: "GitHub", href: "https://github.com/HaruSameee/Assay" }],
  },
  {
    name: "Rust-VC",
    tag: "ツール ・ Rust",
    text:
      "RVCのリアルタイム声質変換を、Rust と ONNX Runtime で動かす推論エンジン。音声の入出力、SOLAでのつなぎ、無音判定までRustで書いた。",
    stack: "Rust / Tauri / ONNX Runtime / cpal",
    links: [
      { label: "GitHub", href: "https://github.com/HaruSameee/Rust-VoiceConversion" },
      { label: "開発日誌", href: "/hrsm/blog/rust-realtime-rvc-devlog" },
    ],
  },
  {
    name: "RFST",
    tag: "ツール ・ Rust",
    text:
      "フォルマントとピッチを別々に動かせる、リアルタイムのボイスエフェクト。ケプストラムで声の響きだけを取り出して動かす。",
    stack: "Rust / rustfft / cpal / egui",
    links: [{ label: "GitHub", href: "https://github.com/HaruSameee/Scientific-Advisor-for-Voice" }],
  },
  {
    name: "Avatar Illusioner",
    tag: "VRChatギミック ・ 無料配布",
    text: "アバターを分身として立体投影するギミック。",
    links: [{ label: "BOOTH", href: "https://haruhasame.booth.pm" }],
  },
];

/** スパム避けのため逆順で持ち、表示時に MailLink で組み立てる */
const mails = [{ user: "msrh", domain: "ia.esum" }];

type Row = { key: string; label: string; href: string; main?: boolean };

/** お仕事の連絡先。main はいちばん早く返事できるところ */
const contacts: ReadonlyArray<Row> = [
  { key: "DISCORD", label: "illusion", href: "https://discord.gg/mDQHNAM22X", main: true },
  { key: "X", label: "@hrs0_0m", href: "https://x.com/hrs0_0m", main: true },
];

const elsewhere: ReadonlyArray<Row> = [
  { key: "GITHUB", label: "HaruSameee", href: "https://github.com/HaruSameee" },
  { key: "BLOG", label: "開発日誌など", href: "/hrsm/blog" },
  { key: "BOOTH", label: "haruhasame", href: "https://haruhasame.booth.pm" },
  {
    key: "VRCHAT",
    label: "hrs0_0m",
    href: "https://vrchat.com/home/user/usr_4d291333-4bbd-4128-87c8-b8442f35d433",
  },
];

/** 仕事の外でやっていること */
const hobbies = [
  { label: "VRChat", value: "写真とアバター改変。ふだんは座ってのんびりしてる" },
  { label: "Beat Saber", value: "うどんセイバーも本家も。テック譜面もダンス譜面も" },
  { label: "ポケモンユナイト", value: "いちばん本気でやってるゲーム" },
  { label: "歌", value: "カラオケとボイトレ。十八番は東京テディベア" },
  { label: "MMD", value: "中学のころから。IAとゆかりさんがうちにいる" },
];

const isExternal = (href: string) => /^https?:/.test(href);

function LinkRow({ row }: { row: Row }) {
  const ext = isExternal(row.href);
  return (
    <a
      className={styles.row}
      href={row.href}
      rel={ext ? "noopener noreferrer" : undefined}
      target={ext ? "_blank" : undefined}
    >
      <span className={styles.k}>{row.key}</span>
      <span className={styles.v}>
        {row.label}
        {row.main ? <span className={styles.main}>メイン</span> : null}
      </span>
      <span className={styles.go}>→</span>
    </a>
  );
}

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
              <p className={styles.line}>
                Rustでリアルタイム音声処理と声質変換を書いているエンジニア。
              </p>
              <p className={styles.sub}>フリーランスで開発の相談を受けています。</p>
              <p className={styles.cta}>
                <a href="https://github.com/HaruSameee" rel="noopener noreferrer" target="_blank">
                  GitHub
                </a>
                <a href="#works">作品を見る</a>
                <a href="/hrsm/blog">ブログ</a>
                <a href="#links">連絡する</a>
              </p>
              <p className={styles.hint}>スクロールで潜る</p>
            </div>
          </div>
        </header>

        <div aria-hidden="true" className={`${styles.open} ${styles.o1}`}>
          <Shark />
        </div>

        <section className={`${styles.zone} ${styles.shallows}`} id="skills">
          <div className={styles.col}>
            <Eyebrow depth="10" zone="表層" />
            <h2 className={styles.heading}>できること</h2>
            <dl className={styles.facts}>
              {skills.map((f) => (
                <Fragment key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
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
                  {w.stack ? <p className={styles.stack}>{w.stack}</p> : null}
                  {w.links ? (
                    <p className={styles.workLinks}>
                      {w.links.map((l) => (
                        <a
                          href={l.href}
                          key={l.href}
                          rel={isExternal(l.href) ? "noopener noreferrer" : undefined}
                          target={isExternal(l.href) ? "_blank" : undefined}
                        >
                          {l.label} →
                        </a>
                      ))}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div aria-hidden="true" className={`${styles.open} ${styles.o3}`}>
          <Shark />
        </div>

        <section className={`${styles.zone} ${styles.deep}`} id="hobbies">
          <div className={styles.col}>
            <Eyebrow depth="1,000" zone="漸深層" />
            <h2 className={styles.heading}>すきなこと</h2>
            <dl className={styles.hobbies}>
              {hobbies.map((f) => (
                <Fragment key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </Fragment>
              ))}
            </dl>
          </div>
        </section>

        <section className={`${styles.zone} ${styles.deep}`} id="links">
          <div className={styles.col}>
            <Eyebrow depth="4,000" zone="深海層" />
            <h2 className={styles.heading}>つながる</h2>
            <p className={styles.contact}>
              お仕事の相談は Discord か X の DM がいちばん早いです。メールでも受け付けています。
            </p>
            <ul className={styles.links}>
              {contacts.map((l) => (
                <li key={l.key}>
                  <LinkRow row={l} />
                </li>
              ))}
              {mails.map((m) => (
                <li key={m.domain}>
                  <MailLink domain={m.domain} user={m.user} />
                </li>
              ))}
            </ul>

            <AnonContacts />

            <p className={styles.anonTitle}>ほかの場所</p>
            <ul className={styles.links}>
              {elsewhere.map((l) => (
                <li key={l.key}>
                  <LinkRow row={l} />
                </li>
              ))}
            </ul>


            <pre className={styles.log}>
              {"> せんすい かいし ...... "}
              <b>OK</b>
              {"\n> すいしん 4,000 m .... "}
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
