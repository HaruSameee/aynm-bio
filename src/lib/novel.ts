import { Marked, type Token, type Tokens } from "marked";

// 記事の Markdown を、ノベルゲー風ビューワーの「ページ」に切り分ける。
// ADV モードでは 1 ページずつメッセージウィンドウに出し、
// NVL モードでは全ページを 1 枚のウィンドウに並べる。

export type NovelPage = {
  html: string;
  /** そのページの見出し（見出しで始まるページだけ） */
  heading: string | null;
  /** コードや表など、ウィンドウ内でスクロールが要りそうなページ */
  wide: boolean;
};

export type NovelOptions = {
  /** 記事内の見出しを 1 段下げる（ページのタイトルが h1 なので） */
  shiftHeadings?: boolean;
  /** 単独の改行を <br> にする（DB の記事の既定に合わせる） */
  breaks?: boolean;
  /** 本文の先頭がこのタイトルと同じ h1 なら省く（ページのタイトルと重なるので） */
  title?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slugifyFootnoteId(id: string) {
  return id.replace(/[^a-zA-Z0-9_-]/g, "_");
}

// marked は脚注に対応していないので、[^id] と [^id]: 本文 を自前で処理する
function extractFootnotes(body: string) {
  const notes: { id: string; text: string }[] = [];
  const lines = body.split("\n");
  const kept: string[] = [];
  let inFence = false;

  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
    }

    const match = !inFence ? line.match(/^\[\^([^\]]+)\]:\s*(.*)$/) : null;

    if (match) {
      notes.push({ id: match[1], text: match[2] });
    } else {
      kept.push(line);
    }
  }

  if (notes.length === 0) {
    return { body, notes };
  }

  const textById = new Map(notes.map((note) => [note.id, note.text]));
  let fence = false;
  const replaced = kept
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        fence = !fence;
      }

      if (fence) {
        return line;
      }

      return line.replace(/\[\^([^\]]+)\]/g, (whole, id: string) => {
        const text = textById.get(id);

        if (text === undefined) {
          return whole;
        }

        const safe = slugifyFootnoteId(id);

        return `<sup class="nv-fnref"><a href="#fn-${safe}" id="fnref-${safe}" title="${escapeHtml(text)}">${escapeHtml(id)}</a></sup>`;
      });
    })
    .join("\n");

  return { body: replaced, notes };
}

function headingText(token: Token) {
  return token.type === "heading" ? (token as Tokens.Heading).text : null;
}

export function renderNovelPages(
  body: string,
  { shiftHeadings = false, breaks = true, title }: NovelOptions = {},
): NovelPage[] {
  const marked = new Marked({ gfm: true, breaks });
  const { body: prepared, notes } = extractFootnotes(body);
  const tokens = marked.lexer(prepared);
  const links = tokens.links;
  const firstIndex = tokens.findIndex((token) => token.type !== "space");
  const first = tokens[firstIndex];

  if (
    title &&
    first?.type === "heading" &&
    (first as Tokens.Heading).depth === 1 &&
    (first as Tokens.Heading).text.trim() === title.trim()
  ) {
    tokens.splice(firstIndex, 1);
  }

  if (shiftHeadings) {
    for (const token of tokens) {
      if (token.type === "heading") {
        (token as Tokens.Heading).depth = Math.min(
          (token as Tokens.Heading).depth + 1,
          6,
        );
      }
    }
  }

  const pages: NovelPage[] = [];
  let pendingHeadings: Token[] = [];

  const flush = (blockTokens: Token[]) => {
    const list = Object.assign([...pendingHeadings, ...blockTokens], { links });
    const html = marked.parser(list);
    const first = pendingHeadings[0] ?? blockTokens[0];

    pages.push({
      html,
      heading: first ? headingText(first) : null,
      wide: blockTokens.some(
        (token) => token.type === "code" || token.type === "table",
      ),
    });
    pendingHeadings = [];
  };

  for (const token of tokens) {
    if (token.type === "space" || token.type === "def") {
      continue;
    }

    if (token.type === "heading") {
      pendingHeadings.push(token);
      continue;
    }

    flush([token]);
  }

  if (pendingHeadings.length > 0) {
    flush([]);
  }

  if (notes.length > 0) {
    const items = notes
      .map((note) => {
        const safe = slugifyFootnoteId(note.id);
        const text = marked.parseInline(note.text) as string;

        return `<li id="fn-${safe}">${text} <a class="nv-fnback" href="#fnref-${safe}" aria-label="本文に戻る">↩</a></li>`;
      })
      .join("");

    pages.push({
      html: `<section class="nv-footnotes"><p class="nv-footnotes-title">注</p><ol>${items}</ol></section>`,
      heading: null,
      wide: false,
    });
  }

  return pages;
}
