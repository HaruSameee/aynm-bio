import TitleScreen from "./_components/TitleScreen";
import { hrsmMetadata } from "./_lib/metadata";

export const metadata = hrsmMetadata({
  title: "HRSM | aynm.dev",
  description: "はるさめ（HRSM）のサイト。プロフィール・ブログ・ギャラリー。",
  path: "/hrsm",
});

export default function HrsmTitlePage() {
  return <TitleScreen />;
}
