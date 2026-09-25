import type { Metadata } from "next";

export const SITE_URL = "https://aynm.dev";
const SITE_NAME = "HRSM | aynm.dev";
/* opengraph-image.tsx が生成する共通画像。ファイル規約の画像は子ページに継承されないので明示する */
const OG_IMAGE = {
  url: "/hrsm/opengraph-image",
  width: 1200,
  height: 630,
  alt: SITE_NAME,
};

type HrsmMetadataInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
};

/*
 * /hrsm 配下の title / OGP をまとめて生成する。
 * Next.js は子ページの openGraph で親の openGraph を丸ごと置き換えるため、
 * 各ページは必ずこの関数経由で全項目を指定する。
 */
export function hrsmMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
}: HrsmMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "ja_JP",
      images: [OG_IMAGE],
      ...(type === "article"
        ? { type: "article", publishedTime }
        : { type: "website" }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}
