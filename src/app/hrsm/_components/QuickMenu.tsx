"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { HRSM_MENU } from "../_lib/menu";
import styles from "./AdvFrame.module.css";

export default function QuickMenu() {
  const pathname = usePathname();

  return (
    <nav aria-label="サイトメニュー" className={styles.nav}>
      <ul className={styles.navList}>
        {HRSM_MENU.map((item) => {
          const current =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href}>
              <Link
                aria-current={current ? "page" : undefined}
                className={styles.navLink}
                href={item.href}
              >
                {item.sub}
              </Link>
            </li>
          );
        })}
        <li>
          <Link className={styles.navLink} href="/hrsm">
            TITLE
          </Link>
        </li>
      </ul>
    </nav>
  );
}
