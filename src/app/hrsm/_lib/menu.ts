export type HrsmMenuItem = {
  href: string;
  label: string;
  /** タイトル画面のボタンに添える英字 */
  en: string;
  /** サブページのナビゲーションに出す英字 */
  sub: string;
};

/* タイトル画面のメニュー＝各画面の入口。サブページのナビも同じ並びを使う */
export const HRSM_MENU: HrsmMenuItem[] = [
  { href: "/hrsm/profile", label: "はじめから", en: "NEW GAME", sub: "PROFILE" },
  { href: "/hrsm/blog", label: "シナリオ", en: "SCENARIO", sub: "SCENARIO" },
  { href: "/hrsm/gallery", label: "ギャラリー", en: "GALLERY", sub: "GALLERY" },
  { href: "/hrsm/config", label: "コンフィグ", en: "CONFIG", sub: "CONFIG" },
];
