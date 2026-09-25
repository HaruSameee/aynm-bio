"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { createBgmController, type BgmController } from "../_lib/bgm";

type HrsmContextValue = {
  /** タイトル画面で「スタート」済みか。/hrsm 配下をクライアント遷移している間は保持される */
  started: boolean;
  /** スタート処理。必ずクリック／タップのイベントハンドラ内から呼ぶこと（BGM再生の起点） */
  start: () => void;
};

const HrsmContext = createContext<HrsmContextValue | null>(null);

export function HrsmProvider({ children }: { children: React.ReactNode }) {
  const [started, setStarted] = useState(false);
  const bgmRef = useRef<BgmController | null>(null);

  const start = useCallback(() => {
    bgmRef.current ??= createBgmController();
    bgmRef.current.play();
    setStarted(true);
  }, []);

  // /hrsm の外へ出たら BGM を止める
  useEffect(() => () => bgmRef.current?.stop(), []);

  const value = useMemo(() => ({ started, start }), [started, start]);

  return <HrsmContext.Provider value={value}>{children}</HrsmContext.Provider>;
}

export function useHrsm() {
  const context = useContext(HrsmContext);

  if (!context) {
    throw new Error("useHrsm must be used within HrsmProvider");
  }

  return context;
}
