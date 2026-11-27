"use client";

import Link from "next/link";
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { NovelPage } from "@/lib/novel";

import { markRead, readStore, writeStore } from "./storage";
import styles from "./novel.module.css";

type EndLink = { href: string; label: string; sub?: string };

type Props = {
  /** 既読・しおりの保存に使うキー（記事ごとに一意） */
  storageKey: string;
  title: string;
  /** タイトルの上に出す小見出し（「第3話」「短編」など） */
  kicker: string;
  dateLabel: string;
  speaker: string;
  note?: string | null;
  pages: NovelPage[];
  back: EndLink;
  choices: EndLink[];
};

type Mode = "adv" | "nvl";

const MODE_KEY = "nv-mode";
const AUTO_MIN_MS = 2600;
const AUTO_PER_CHAR_MS = 55;

function textLength(html: string) {
  return html.replace(/<[^>]+>/g, "").length;
}

function isInteractive(target: EventTarget | null) {
  return (
    target instanceof Element &&
    target.closest("a, button, pre, code, img, input, summary, table") !== null
  );
}

export default function NovelReader({
  storageKey,
  title,
  kicker,
  dateLabel,
  speaker,
  note,
  pages,
  back,
  choices,
}: Props) {
  // NVL（全文）を既定にする。技術記事はコピペや流し読みが多いので
  const [mode, setMode] = useState<Mode>("nvl");
  // -1 = 章タイトル、pages.length = 読了画面
  const [index, setIndex] = useState(-1);
  const [logOpen, setLogOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [auto, setAuto] = useState(false);
  const [resumeAt, setResumeAt] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const nvlEndRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const bookmarkKey = `nv-bookmark:${storageKey}`;

  useEffect(() => {
    const saved = readStore(MODE_KEY);

    if (saved === "adv" || saved === "nvl") {
      setMode(saved);
    }

    const bookmark = Number(readStore(bookmarkKey));

    if (Number.isInteger(bookmark) && bookmark > 0 && bookmark < pages.length) {
      setResumeAt(bookmark);
    }
  }, [bookmarkKey, pages.length]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 1600);
  }, []);

  const changeMode = useCallback((next: Mode) => {
    setMode(next);
    writeStore(MODE_KEY, next);
    setAuto(false);
    setLogOpen(false);
    setHidden(false);
  }, []);

  const go = useCallback(
    (next: number) => {
      const clamped = Math.max(-1, Math.min(next, pages.length));

      setIndex(clamped);
      setResumeAt(null);

      if (clamped >= 0 && clamped < pages.length) {
        writeStore(bookmarkKey, String(clamped));
      }

      if (clamped === pages.length) {
        writeStore(bookmarkKey, "");
        markRead(storageKey);
        setAuto(false);
      }
    },
    [bookmarkKey, pages.length, storageKey],
  );

  const advance = useCallback(() => go(index + 1), [go, index]);
  const retreat = useCallback(() => go(index - 1), [go, index]);

  // ADV: キー操作
  useEffect(() => {
    if (mode !== "adv") {
      return;
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }

      if (logOpen) {
        if (event.key === "Escape" || event.key === "l" || event.key === "L") {
          setLogOpen(false);
        }
        return;
      }

      if (hidden) {
        setHidden(false);
        event.preventDefault();
        return;
      }

      switch (event.key) {
        case "Enter":
        case " ":
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          advance();
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "Backspace":
          event.preventDefault();
          retreat();
          break;
        case "l":
        case "L":
          setLogOpen(true);
          break;
        case "a":
        case "A":
          setAuto((value) => !value);
          break;
        case "h":
        case "H":
          setHidden(true);
          break;
        default:
      }
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [advance, hidden, logOpen, mode, retreat]);

  // ADV: オート
  useEffect(() => {
    if (mode !== "adv" || !auto || logOpen || hidden || index >= pages.length) {
      return;
    }

    const current = index >= 0 ? pages[index] : null;
    const wait = current
      ? Math.max(AUTO_MIN_MS, textLength(current.html) * AUTO_PER_CHAR_MS)
      : AUTO_MIN_MS;
    const timer = window.setTimeout(advance, wait);

    return () => window.clearTimeout(timer);
  }, [advance, auto, hidden, index, logOpen, mode, pages]);

  // ADV: ページが変わったらウィンドウ内のスクロールを先頭へ
  useEffect(() => {
    windowRef.current?.scrollTo({ top: 0 });
  }, [index]);

  // NVL: 最後まで読んだら既読にする
  useEffect(() => {
    if (mode !== "nvl" || !nvlEndRef.current) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        markRead(storageKey);
      }
    });

    observer.observe(nvlEndRef.current);

    return () => observer.disconnect();
  }, [mode, storageKey]);

  const logPages = useMemo(
    () => pages.slice(0, Math.max(0, Math.min(index + 1, pages.length))),
    [index, pages],
  );

  const systemBar = (
    <nav aria-label="システム" className={styles.systemBar}>
      <Link className={styles.sysButton} href={back.href}>
        {back.label}
      </Link>
      {mode === "adv" ? (
        <>
          <button
            className={styles.sysButton}
            onClick={() => setLogOpen(true)}
            type="button"
          >
            LOG
          </button>
          <button
            aria-pressed={auto}
            className={`${styles.sysButton} ${auto ? styles.sysOn : ""}`}
            onClick={() => setAuto((value) => !value)}
            type="button"
          >
            AUTO
          </button>
          <button
            className={styles.sysButton}
            onClick={() => go(pages.length)}
            type="button"
          >
            SKIP
          </button>
          <button
            className={styles.sysButton}
            onClick={() => setHidden(true)}
            type="button"
          >
            HIDE
          </button>
        </>
      ) : null}
      <button
        className={styles.sysButton}
        onClick={() => {
          if (mode === "adv" && index >= 0 && index < pages.length) {
            writeStore(bookmarkKey, String(index));
            showToast("しおりを挟みました");
          } else {
            showToast("ADVモードで使えます");
          }
        }}
        type="button"
      >
        SAVE
      </button>
      <button
        className={`${styles.sysButton} ${styles.sysMode}`}
        onClick={() => changeMode(mode === "adv" ? "nvl" : "adv")}
        title={mode === "adv" ? "全文表示に切り替え" : "1ページずつ読む表示に切り替え"}
        type="button"
      >
        {mode === "adv" ? "ADV → 全文" : "全文 → ADV"}
      </button>
    </nav>
  );

  const choiceList = (
    <div className={styles.choices}>
      {choices.map((choice) => (
        <Link className={styles.choice} href={choice.href} key={choice.href}>
          <span className={styles.choiceLabel}>{choice.label}</span>
          {choice.sub ? <span className={styles.choiceSub}>{choice.sub}</span> : null}
        </Link>
      ))}
    </div>
  );

  if (mode === "nvl") {
    return (
      <div className={styles.readerNvl}>
        {systemBar}
        <article className={styles.nvlWindow}>
          <header className={styles.nvlHeader}>
            <p className={styles.kicker}>{kicker}</p>
            <h1 className={styles.nvlTitle}>{title}</h1>
            <p className={styles.metaLine}>
              <span className={styles.speakerTag}>{speaker}</span>
              <span>{dateLabel}</span>
            </p>
            {note ? <p className={styles.note}>{note}</p> : null}
          </header>
          <div className={styles.prose}>
            {pages.map((page, i) => (
              <div
                // biome-ignore lint/security/noDangerouslySetInnerHtml: 記事本文
                dangerouslySetInnerHTML={{ __html: page.html }}
                key={i}
              />
            ))}
          </div>
          <div className={styles.fin} ref={nvlEndRef}>
            ― 了 ―
          </div>
          {choiceList}
        </article>
        {toast ? <div className={styles.toast}>{toast}</div> : null}
      </div>
    );
  }

  const current = index >= 0 && index < pages.length ? pages[index] : null;
  const progress = pages.length > 0 ? Math.max(0, index + 1) / pages.length : 0;

  return (
    <div className={styles.readerAdv}>
      {hidden ? (
        <button
          aria-label="ウィンドウを戻す"
          className={styles.hiddenCatcher}
          onClick={() => setHidden(false)}
          type="button"
        />
      ) : (
        systemBar
      )}

      {index === -1 ? (
        <button
          className={styles.titleCard}
          onClick={(event) => {
            if (!isInteractive(event.target)) {
              advance();
            }
          }}
          type="button"
        >
          <span className={styles.kicker}>{kicker}</span>
          <span className={styles.titleCardTitle}>{title}</span>
          <span className={styles.metaLine}>
            <span className={styles.speakerTag}>{speaker}</span>
            <span>{dateLabel}</span>
          </span>
          {note ? <span className={styles.note}>{note}</span> : null}
          <span className={styles.clickHint}>クリック / Enter ではじめる</span>
        </button>
      ) : null}

      {index === -1 && resumeAt !== null ? (
        <div className={styles.resume}>
          <button className={styles.choice} onClick={() => go(resumeAt)} type="button">
            <span className={styles.choiceLabel}>つづきから</span>
            <span className={styles.choiceSub}>
              しおり：{resumeAt + 1} / {pages.length} ページ
            </span>
          </button>
        </div>
      ) : null}

      {index === pages.length ? (
        <div className={styles.endCard}>
          <div className={styles.fin}>― 了 ―</div>
          <p className={styles.endPrompt}>どうしますか？</p>
          {choiceList}
          <button className={styles.textButton} onClick={() => go(0)} type="button">
            はじめから読み直す
          </button>
        </div>
      ) : null}

      {current && !hidden ? (
        <section
          aria-live="polite"
          className={`${styles.advWindow} ${current.wide ? styles.advWide : ""}`}
          onClick={(event) => {
            if (!isInteractive(event.target) && !window.getSelection()?.toString()) {
              advance();
            }
          }}
          onKeyDown={() => {}}
          role="presentation"
        >
          <div className={styles.nameBox}>{speaker}</div>
          <div className={styles.advInner} ref={windowRef}>
            <div
              className={`${styles.prose} ${styles.advText}`}
              // biome-ignore lint/security/noDangerouslySetInnerHtml: 記事本文
              dangerouslySetInnerHTML={{ __html: current.html }}
              key={index}
            />
          </div>
          <div className={styles.advFooter}>
            <span className={styles.pageCount}>
              {index + 1} / {pages.length}
            </span>
            <span
              aria-hidden
              className={styles.progress}
              style={{ "--nv-progress": String(progress) } as CSSProperties}
            />
            <button
              aria-label="前のページ"
              className={styles.pageButton}
              disabled={index <= 0}
              onClick={(event) => {
                event.stopPropagation();
                retreat();
              }}
              type="button"
            >
              ◀
            </button>
            <button
              aria-label="次のページ"
              className={`${styles.pageButton} ${styles.nextCursor}`}
              onClick={(event) => {
                event.stopPropagation();
                advance();
              }}
              type="button"
            >
              ▼
            </button>
          </div>
        </section>
      ) : null}

      {logOpen ? (
        <div aria-label="バックログ" className={styles.logOverlay} role="dialog">
          <div className={styles.logHeader}>
            <span className={styles.logTitle}>BACKLOG</span>
            <button
              className={styles.sysButton}
              onClick={() => setLogOpen(false)}
              type="button"
            >
              閉じる
            </button>
          </div>
          <div className={styles.logBody}>
            {logPages.map((page, i) => (
              <div className={styles.logEntry} key={i}>
                <div className={styles.logEntryHead}>
                  <span className={styles.logSpeaker}>{speaker}</span>
                  <button
                    className={styles.textButton}
                    onClick={() => {
                      setLogOpen(false);
                      go(i);
                    }}
                    type="button"
                  >
                    ここに戻る
                  </button>
                </div>
                <div
                  className={styles.prose}
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: 記事本文
                  dangerouslySetInnerHTML={{ __html: page.html }}
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {toast ? <div className={styles.toast}>{toast}</div> : null}
    </div>
  );
}
