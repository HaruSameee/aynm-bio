import AdvFrame from "../_components/AdvFrame";
import ui from "../_components/ui.module.css";
import { hrsmMetadata } from "../_lib/metadata";
import styles from "./profile.module.css";

export const metadata = hrsmMetadata({
  title: "プロフィール | HRSM",
  description: "はるさめ（HRSM）のプロフィール。",
  path: "/hrsm/profile",
});

/* ▼ 仮テキスト。内容は後で差し替える */
const profileRows = [
  { label: "なまえ", value: "HRSM (はるさめ)" },
  { label: "ROLE", value: "Engineer" },
  { label: "MAIN", value: "Rust" },
  { label: "SUB", value: "TypeScript" },
  { label: "FIELD", value: "Systems" },
];

const links = [
  { label: "GitHub", href: "https://github.com/HaruSameee", detail: "HaruSameee" },
  { label: "X", href: "https://x.com/hrs0_0m", detail: "@hrs0_0m" },
  { label: "Telegram", href: "https://t.me/HRSM_L", detail: "HRSM_L" },
  { label: "Discord", href: "https://discord.gg/aynm", detail: "aynm" },
];

const bio = [
  "……ここに 自己紹介の 文章が 入ります。（仮テキスト）",
  "すきなもの、つくっているもの、さいきんの こと など。",
];

export default function HrsmProfilePage() {
  return (
    <AdvFrame back={{ href: "/hrsm", label: "タイトル" }} screen="PROFILE" title="プロフィール">
      <div className={styles.layout}>
        {/* 立ち絵の差し替え枠（画像や動画を置く場所） */}
        <div className={`${ui.message} ${styles.portrait}`}>
          <span className={ui.nameBox}>Character</span>
          <span className={styles.portraitCap}>立ち絵</span>
        </div>

        <section aria-labelledby="profile-name" className={`${ui.message} ${styles.status}`}>
          <span className={ui.nameBox}>Profile</span>
          <h1 className={styles.name} id="profile-name">
            HRSM
            <small>はるさめ</small>
          </h1>

          <dl className={styles.rows}>
            {profileRows.map((row) => (
              <div className={styles.row} key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>

          <h2 className={styles.subheading}>LINKS</h2>
          <ul className={styles.links}>
            {links.map((link) => (
              <li key={link.href}>
                <span className={styles.linkLabel}>{link.label}</span>
                <a
                  className={styles.link}
                  href={link.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {link.detail}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section aria-label="ひとこと" className={ui.message}>
        <span className={ui.nameBox}>はるさめ</span>
        {bio.map((line) => (
          <p className={styles.bio} key={line}>
            {line}
          </p>
        ))}
      </section>
    </AdvFrame>
  );
}
