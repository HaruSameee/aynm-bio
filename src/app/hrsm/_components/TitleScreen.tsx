"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { HRSM_MENU } from "../_lib/menu";
import styles from "./TitleScreen.module.css";
import { useHrsm } from "./HrsmProvider";

export default function TitleScreen() {
  const { started, start } = useHrsm();
  const firstItemRef = useRef<HTMLAnchorElement>(null);
  const focusMenuRef = useRef(false);

  // スタートボタンは押すと消えるので、キーボード操作時にフォーカスが迷子にならないよう
  // メニュー先頭へ移す（別ページから戻ってきたときは奪わない）
  useEffect(() => {
    if (started && focusMenuRef.current) {
      focusMenuRef.current = false;
      firstItemRef.current?.focus();
    }
  }, [started]);

  const handleStart = () => {
    focusMenuRef.current = true;
    start();
  };

  return (
    <main className={styles.screen}>
      {/* 4:3（800×600基準）のゲームウィンドウ */}
      <div className={styles.game}>
        {/* 背景担当。1枚絵にするときは theme.module.css の --hrsm-bg-image を差し替える */}
        <div className={styles.scene} aria-hidden="true" />

        <h1 className={styles.logo}>
          <span className={styles.logoMain}>はるさめのへや</span>
          <span className={styles.logoEn}>～ HRSM&apos;s Sky-Blue Room ～</span>
        </h1>

        {started ? (
          <nav aria-label="メインメニュー" className={styles.menu}>
            <ul className={styles.menuList}>
              {HRSM_MENU.map((item, index) => (
                <li
                  className={styles.menuItem}
                  key={item.href}
                  style={{ "--i": index } as React.CSSProperties}
                >
                  <Link
                    className={styles.menuLink}
                    href={item.href}
                    ref={index === 0 ? firstItemRef : undefined}
                  >
                    <span className={styles.menuLabel}>{item.label}</span>
                    <span className={styles.menuEn}>{item.en}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : (
          <p className={styles.prompt} aria-hidden="true">
            <span className={styles.promptFine}>CLICK TO START</span>
            <span className={styles.promptCoarse}>TAP TO START</span>
          </p>
        )}

        <p className={styles.version} aria-hidden="true">
          version 1.00
        </p>
      </div>

      {/* 画面のどこを押してもスタート（フッターのリンクだけは上に重ねて押せる） */}
      {started ? null : (
        <button className={styles.start} onClick={handleStart} type="button">
          <span className={styles.srOnly}>クリック／タップでスタート</span>
        </button>
      )}

      <footer className={styles.footer}>
        <span>© HRSM</span>
        <Link className={styles.footerLink} href="/hrsm/license">
          License
        </Link>
      </footer>
    </main>
  );
}
