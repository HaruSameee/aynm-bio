"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { HRSM_MENU } from "../_lib/menu";
import styles from "./AdvFrame.module.css";

export default function QuickMenu() {
  const pathname = usePathname();

  return (
    <nav aria-label="クイックメニュー" className={styles.quick}>
      <ul className={styles.quickList}>
        {HRSM_MENU.map((item) => {
          const current =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href}>
              <Link
                aria-current={current ? "page" : undefined}
                className={styles.quickLink}
                href={item.href}
              >
                {item.sub}
              </Link>
            </li>
          );
        })}
        <li>
          <Link className={styles.quickLink} href="/hrsm">
            TITLE
          </Link>
        </li>
      </ul>
    </nav>
  );
}
