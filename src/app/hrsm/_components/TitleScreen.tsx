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
      <h1 className={styles.logo}>
        <span className={styles.logoSub}>aynm.dev</span>
        <span className={styles.logoMain}>HRSM</span>
        <span className={styles.logoJa}>― はるさめのへや ―</span>
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
                  <span className={styles.menuSub}>{item.sub}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : (
        <button className={styles.start} onClick={handleStart} type="button">
          <span className={styles.startText}>
            <span className={styles.startFine}>CLICK TO START</span>
            <span className={styles.startCoarse}>TAP TO START</span>
          </span>
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
