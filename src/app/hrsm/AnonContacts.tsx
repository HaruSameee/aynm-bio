"use client";

import { useEffect, useState } from "react";

import styles from "./hrsm.module.css";

const SESSION_ID = "05791744d2ac0be47089752a9d7b1f55a8437204c36e0e9a6ed2a88f9ee5429a21";

/** 匿名で連絡したい人向けの控えめな連絡先。メールは MailLink と同じく表示時に組み立てる */
export default function AnonContacts() {
  const [mail, setMail] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const flip = (s: string) => s.split("").reverse().join("");
    setMail(`${flip("msrh")}@${flip("il.kcoc")}`);
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(SESSION_ID);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* クリップボードが使えない環境では手で選択してもらう */
    }
  }

  return (
    <div className={styles.anon}>
      <p className={styles.anonTitle}>匿名で連絡したい人向け</p>
      <dl>
        <dt>SESSION</dt>
        <dd>
          <code className={styles.sid}>{SESSION_ID}</code>
          <button className={styles.copy} onClick={copy} type="button">
            {copied ? "コピーした" : "コピー"}
          </button>
          <span className={styles.main}>メイン</span>
        </dd>
        <dt>MAIL</dt>
        <dd>{mail ? <a href={`mailto:${mail}`}>{mail}</a> : "（表示中…）"}</dd>
        <dt>TELEGRAM</dt>
        <dd>
          <a href="https://t.me/hrs0_0m" rel="noopener noreferrer" target="_blank">
            t.me/hrs0_0m
          </a>
        </dd>
      </dl>
    </div>
  );
}
