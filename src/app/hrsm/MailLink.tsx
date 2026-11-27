"use client";

import { useEffect, useState } from "react";

import styles from "./hrsm.module.css";

/**
 * メールアドレスをHTMLにそのまま書かず、表示時に組み立てる（簡単なスパム避け）。
 * user と domain は逆順の文字列で渡す。JSが動かない環境では案内だけ出す。
 */
export default function MailLink({ user, domain }: { user: string; domain: string }) {
  const [addr, setAddr] = useState<string | null>(null);

  useEffect(() => {
    const flip = (s: string) => s.split("").reverse().join("");
    setAddr(`${flip(user)}@${flip(domain)}`);
  }, [user, domain]);

  return (
    <a className={styles.row} href={addr ? `mailto:${addr}` : undefined}>
      <span className={styles.k}>MAIL</span>
      <span className={styles.v}>{addr ?? "（表示中…）"}</span>
      <span className={styles.go}>→</span>
    </a>
  );
}
