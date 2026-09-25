"use client";

import { useEffect, useState } from "react";

/*
 * 既読管理（localStorage）。
 * プライベートブラウズ・容量超過・ストレージ無効化などで読み書きが失敗しても
 * 例外を外に出さず「未読扱い」で表示を続ける。
 */

const STORAGE_KEY = "hrsm:scenario:read:v1";
const CHANGE_EVENT = "hrsm:scenario:read-change";

/** 公開からこの日数以内の未読話に NEW を付ける */
export const NEW_PERIOD_DAYS = 30;

function readSlugs(): Set<string> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];

    return new Set(
      Array.isArray(parsed)
        ? parsed.filter((item): item is string => typeof item === "string")
        : [],
    );
  } catch {
    return new Set();
  }
}

export function markEpisodeRead(slug: string) {
  try {
    const slugs = readSlugs();

    if (slugs.has(slug)) {
      return;
    }

    slugs.add(slug);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...slugs]));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // 保存できなくても閲覧は続けられる
  }
}

export type ReadState = {
  isRead: (slug: string) => boolean;
  isNew: (slug: string, publishedAt: string) => boolean;
};

/**
 * 既読状態を返す。サーバー描画時とハイドレーション直後は null
 * （バッジを出さない）で、マウント後に localStorage を読んで確定する。
 */
export function useReadState(): ReadState | null {
  const [state, setState] = useState<{ slugs: Set<string>; now: number } | null>(null);

  useEffect(() => {
    const sync = () => setState({ slugs: readSlugs(), now: Date.now() });

    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync); // 別タブでの既読も反映

    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (!state) {
    return null;
  }

  const { slugs, now } = state;
  const newPeriodMs = NEW_PERIOD_DAYS * 24 * 60 * 60 * 1000;

  return {
    isRead: (slug) => slugs.has(slug),
    isNew: (slug, publishedAt) =>
      !slugs.has(slug) && now - new Date(publishedAt).getTime() <= newPeriodMs,
  };
}

/* 記事ページに置くと、表示した時点でその話を既読にする */
export function MarkAsRead({ slug }: { slug: string }) {
  useEffect(() => {
    markEpisodeRead(slug);
  }, [slug]);

  return null;
}
