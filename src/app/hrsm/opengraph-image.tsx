import { ImageResponse } from "next/og";

/*
 * /hrsm 配下共通の OGP 画像（仮）。青空のグラデーション + 縁取りロゴ。
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
            "linear-gradient(180deg, #1b8fe6 0%, #43c6f5 45%, #bdefff 78%, #ffffff 100%)",
          color: "#ffffff",
        }}
      >
        <div style={{ fontSize: 36, letterSpacing: 16, color: "#00525c" }}>
          aynm.dev
        </div>
        <div
          style={{
            fontSize: 200,
            fontWeight: 700,
            letterSpacing: 24,
            textShadow: "0 0 6px #00525c, 4px 6px 8px rgba(0, 30, 50, 0.45)",
          }}
        >
          HRSM
        </div>
      </div>
    ),
    size,
  );
}
