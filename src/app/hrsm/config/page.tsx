import AdvFrame from "../_components/AdvFrame";
import Placeholder from "../_components/Placeholder";
import { hrsmMetadata } from "../_lib/metadata";

export const metadata = hrsmMetadata({
  title: "コンフィグ | HRSM",
  description: "はるさめ（HRSM）のサイト設定。",
  path: "/hrsm/config",
});

export default function HrsmConfigPage() {
  return (
    <AdvFrame back={{ href: "/hrsm", label: "タイトル" }} screen="CONFIG" title="コンフィグ">
      <h1 className="sr-only">コンフィグ</h1>
      <Placeholder>コンフィグは じゅんびちゅう です。</Placeholder>
    </AdvFrame>
  );
}
