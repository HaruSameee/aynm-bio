import { ImageResponse } from "next/og";

/*
 * /hrsm 配下共通の OGP 画像（仮）。空のグラデーション + ロゴ。
 * 既定フォントは日本語グリフを持たないため英字のみ。本番用の画像ができたら
 * このファイルを opengraph-image.png に置き換える。
 */
export const alt = "HRSM | aynm.dev";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(180deg, #eaf7ff 0%, #c3e4f6 60%, #f4f9ee 100%)",
          color: "#2a3b4d",
        }}
      >
        <div style={{ fontSize: 36, letterSpacing: 16, color: "#5c7085" }}>
          aynm.dev
        </div>
        <div style={{ fontSize: 200, fontWeight: 700, letterSpacing: 24 }}>
          HRSM
        </div>
      </div>
    ),
    size,
  );
}
