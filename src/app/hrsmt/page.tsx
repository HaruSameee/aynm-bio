import type { Metadata } from "next";

import HrsmtView from "./HrsmtView";

export const metadata: Metadata = {
  title: "白飛びの、夏。| はるさめ",
  description: "逆光と白飛びの夏。ADV(ノベルゲー)仕立ての自己紹介ページ。",
};

export default function HrsmtPage() {
  return <HrsmtView />;
}
