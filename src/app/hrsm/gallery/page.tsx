import AdvFrame from "../_components/AdvFrame";
import Placeholder from "../_components/Placeholder";
import { hrsmMetadata } from "../_lib/metadata";

export const metadata = hrsmMetadata({
  title: "ギャラリー | HRSM",
  description: "はるさめ（HRSM）のギャラリー。",
  path: "/hrsm/gallery",
});

export default function HrsmGalleryPage() {
  return (
    <AdvFrame back={{ href: "/hrsm", label: "タイトル" }} screen="GALLERY" title="ギャラリー">
      <h1 className="sr-only">ギャラリー</h1>
      <Placeholder>ギャラリーは じゅんびちゅう です。</Placeholder>
    </AdvFrame>
  );
}
