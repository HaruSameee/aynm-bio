import { DM_Mono, Klee_One, Zen_Kaku_Gothic_New } from "next/font/google";

// /hrsm と同じ書体（名前・見出しは手書き風、本文はゴシック）
export const novelHand = Klee_One({
  weight: "600",
  display: "swap",
  preload: false,
  variable: "--nv-font-hand",
});

export const novelBody = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false,
  variable: "--nv-font-body",
});

export const novelMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
  variable: "--nv-font-mono",
});

export const novelFontClass = `${novelHand.variable} ${novelBody.variable} ${novelMono.variable}`;
