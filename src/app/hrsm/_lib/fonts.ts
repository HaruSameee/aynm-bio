import { Shippori_Mincho, Zen_Maru_Gothic } from "next/font/google";

/*
 * /hrsm のWebフォント（Google Fonts を next/font でセルフホスト）。
 * ここでは CSS 変数（--hrsm-font-src-*）を用意するだけで、実際にどこで使うか・
 * フォールバックは theme.module.css の --hrsm-font-* で決める。
 * 差し替えるときはここの import と theme.module.css の2か所だけ触ればよい。
 */

/* 見出し（和文明朝） */
export const hrsmHeadingFont = Shippori_Mincho({
  weight: ["700", "800"],
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
  variable: "--hrsm-font-src-heading",
});

/* 本文・小さいラベル（丸ゴシック） */
export const hrsmBodyFont = Zen_Maru_Gothic({
  weight: ["500", "700"],
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
  variable: "--hrsm-font-src-body",
});
