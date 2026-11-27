"use client";

import { useEffect, useState } from "react";

import { readSet } from "./storage";
import styles from "./novel.module.css";

// アーカイブの各項目に「既読」の判子を押す
export default function ReadStamp({ keys }: { keys: string[] }) {
  const [state, setState] = useState<"none" | "some" | "all">("none");
  const joined = keys.join("\n");

  useEffect(() => {
    const read = readSet();
    const list = joined.split("\n").filter(Boolean);
    const count = list.filter((key) => read.has(key)).length;

    setState(count === 0 ? "none" : count === list.length ? "all" : "some");
  }, [joined]);

  if (state === "none") {
    return <span className={styles.stampNew}>未読</span>;
  }

  return (
    <span className={state === "all" ? styles.stamp : styles.stampSome}>
      {state === "all" ? "既読" : "途中"}
    </span>
  );
}
