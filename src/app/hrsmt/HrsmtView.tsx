"use client";

import { useEffect, useState } from "react";

import styles from "./hrsmt.module.css";

/* ADVメッセージ本文（タイプライターで1文字ずつ表示） */
const MESSAGE =
  "……やあ、よく見つけてくれたね。ここは 逆光と 白飛びで できた、ちいさな 自己紹介の へや。まぶしかったら、目を そっと ほそめて。";

/* 選択肢メニュー（ADVの選択肢＝縦積みのリンク） */
const choices = [
  { label: "ステータスを ひらく", href: "#status" },
  { label: "バックログを みる", href: "#backlog" },
  {
    label: "はるさめ に あいさつ",
    href: "https://x.com/hrs0_0m",
    external: true,
  },
];

/* ステータス画面：プロフィールの定義リスト */
const profile = [
  { k: "なまえ", v: "はるさめ / HRSM" },
  { k: "しょくぎょう", v: "エンジニア" },
  { k: "とくい", v: "システム・Rust" },
  { k: "いばしょ", v: "夏のそら の したあたり" },
  { k: "コンディション", v: "逆光ぎみ" },
];

/* パラメータバー（ラベル / バー / 数値） */
const params = [
  { k: "RUST", v: 92 },
  { k: "TYPESCRIPT", v: 74 },
  { k: "SYSTEMS", v: 88 },
  { k: "SLEEP", v: 36 },
  { k: "なつ耐性", v: 100 },
];

/* バックログ（日付 / 1行テキスト） */
const backlog = [
  { d: "2024.04", t: "最初の へや をつくった。まだ 夜だった。" },
  { d: "2025.08", t: "Rust で なにかを こわして、ちゃんと なおした。" },
  { d: "2026.03", t: "青より 水色が すきだと 気づいた。" },
  { d: "2026.07", t: "逆光の 自己紹介ページ を ひらいた。← いまここ" },
];

/* タイプライター：prefers-reduced-motion のときは即時に全文表示 */
function useTypewriter(text: string, speed = 45) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduce) {
      setCount(text.length);
      return;
    }

    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) window.clearInterval(id);
    }, speed);

    return () => window.clearInterval(id);
  }, [text, speed]);

  return text.slice(0, count);
}

export default function HrsmtView() {
  const shown = useTypewriter(MESSAGE);

  return (
    <main className={styles.stage}>
      {/*
        ▼▼▼ 背景担当はこの1要素だけ ▼▼▼
        後で1枚画像に差し替える場合は hrsmt.module.css の .bg の
        background を url(...) center/cover に置き換える（下記CSS参照）。
      */}
      <div className={styles.bg} aria-hidden="true" />

      {/* 1. ファーストビュー ------------------------------------------ */}
      <section className={styles.fv}>
        <h1 className={styles.logo}>
          <span className={styles.logoEn}>SUMMER ADV</span>
          <span className={styles.logoJa}>白飛びの、夏。</span>
        </h1>

        <div className={styles.bottom}>
          {/* 選択肢メニュー（メッセージウィンドウの上） */}
          <nav aria-label="選択肢">
            <ul className={styles.choices}>
              {choices.map((c) => (
                <li key={c.href}>
                  <a
                    className={styles.choice}
                    href={c.href}
                    rel={c.external ? "noopener noreferrer" : undefined}
                    target={c.external ? "_blank" : undefined}
                  >
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* ADVメッセージウィンドウ */}
          <div className={styles.msgWin}>
            <span className={styles.nameBox}>はるさめ</span>
            <p className={styles.msgBody}>
              <span aria-hidden="true">{shown}</span>
              {/* 全文は常にDOMに置き、スクリーンリーダー・演出停止時も欠けない */}
              <span className={styles.srOnly}>{MESSAGE}</span>
            </p>
            <span className={styles.next} aria-hidden="true">
              ▼
            </span>
          </div>
        </div>
      </section>

      {/* 2. ステータス画面 -------------------------------------------- */}
      <section className={styles.section} id="status">
        <h2 className={styles.h2}>
          ステータス
          <small>STATUS</small>
        </h2>

        <div className={styles.statusGrid}>
          {/* 立ち絵の差し替え枠：画像を入れるときは下のキャプションを
              消して <img src="..." alt="" className={styles.tachieImg}/> を置く */}
          <div className={styles.tachie}>
            <span className={styles.tachieCap}>立ち絵</span>
          </div>

          <dl className={styles.deflist}>
            {profile.map((row) => (
              <div className={styles.defRow} key={row.k}>
                <dt>{row.k}</dt>
                <dd>{row.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* パラメータバー（ラベル / バー / 数値の3カラム） */}
        <div className={styles.params}>
          {params.map((p) => (
            <div className={styles.paramRow} key={p.k}>
              <span className={styles.paramLabel}>{p.k}</span>
              <span className={styles.paramTrack}>
                <span
                  className={styles.paramFill}
                  style={{ width: `${p.v}%` }}
                />
              </span>
              <span className={styles.paramVal}>{p.v}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. バックログ ------------------------------------------------ */}
      <section className={styles.section} id="backlog">
        <h2 className={styles.h2}>
          バックログ
          <small>BACKLOG</small>
        </h2>

        <ol className={styles.logList}>
          {backlog.map((b) => (
            <li className={styles.logRow} key={b.d}>
              <time className={styles.logDate}>{b.d}</time>
              <span className={styles.logText}>{b.t}</span>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
