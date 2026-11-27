// 既読・しおり・表示モードはこの端末だけに覚える（使えない環境では黙って諦める）

const READ_KEY = "nv-read";

export function readStore(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStore(key: string, value: string) {
  try {
    if (value) {
      window.localStorage.setItem(key, value);
    } else {
      window.localStorage.removeItem(key);
    }
  } catch {
    // 保存できなくても読むのには困らない
  }
}

export function readSet(): Set<string> {
  try {
    const parsed = JSON.parse(readStore(READ_KEY) ?? "[]");

    return new Set(Array.isArray(parsed) ? parsed.map(String) : []);
  } catch {
    return new Set();
  }
}

export function markRead(storageKey: string) {
  const set = readSet();

  if (set.has(storageKey)) {
    return;
  }

  set.add(storageKey);
  writeStore(READ_KEY, JSON.stringify([...set]));
}
