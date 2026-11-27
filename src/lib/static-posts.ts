import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

// リポジトリに置いた Markdown の記事（よそのブログから移してきた記事など）。
// DB の記事と同じく「単発の記事」として /[username]/blog/post/[slug] に出る。

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "blog");

export type StaticPost = {
  slug: string;
  title: string;
  publishedAt: Date;
  speaker: string | null;
  origin: string | null;
  body: string;
};

function parseFrontMatter(source: string) {
  if (!source.startsWith("---\n")) {
    return { data: {} as Record<string, string>, body: source };
  }

  const end = source.indexOf("\n---\n", 4);

  if (end === -1) {
    return { data: {} as Record<string, string>, body: source };
  }

  const data: Record<string, string> = {};

  for (const line of source.slice(4, end).split("\n")) {
    const index = line.indexOf(":");

    if (index > 0) {
      data[line.slice(0, index).trim()] = line.slice(index + 1).trim();
    }
  }

  return { data, body: source.slice(end + 5) };
}

async function loadAll(): Promise<StaticPost[]> {
  let files: string[];

  try {
    files = await readdir(CONTENT_DIR);
  } catch {
    return [];
  }

  const loaded = await Promise.all(
    files
      .filter((file) => file.endsWith(".md"))
      .map(async (file) => {
        const source = await readFile(path.join(CONTENT_DIR, file), "utf8");
        const { data, body } = parseFrontMatter(source);
        const publishedAt = new Date(data.publishedAt ?? "");

        if (!data.title || Number.isNaN(publishedAt.getTime())) {
          return null;
        }

        return {
          slug: file.replace(/\.md$/, ""),
          title: data.title,
          publishedAt,
          speaker: data.speaker || null,
          origin: data.origin || null,
          body,
        } satisfies StaticPost;
      }),
  );

  return loaded.filter((post): post is StaticPost => post !== null);
}

export async function getPublishedStaticPosts(now = new Date()) {
  const all = await loadAll();

  return all
    .filter((post) => post.publishedAt <= now)
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

export async function getStaticPost(slug: string, now = new Date()) {
  const all = await getPublishedStaticPosts(now);

  return all.find((post) => post.slug === slug) ?? null;
}
