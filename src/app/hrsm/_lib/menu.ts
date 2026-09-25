export type HrsmMenuItem = {
  href: string;
  label: string;
  sub: string;
};

/* タイトル画面のメニュー＝各画面の入口。クイックメニューも同じ並びを使う */
export const HRSM_MENU: HrsmMenuItem[] = [
  { href: "/hrsm/profile", label: "はじめから", sub: "PROFILE" },
  { href: "/hrsm/blog", label: "シナリオ", sub: "SCENARIO" },
  { href: "/hrsm/gallery", label: "ギャラリー", sub: "GALLERY" },
  { href: "/hrsm/config", label: "コンフィグ", sub: "CONFIG" },
];
