import { marked } from "marked";

export async function renderMarkdown(body: string): Promise<string> {
  marked.setOptions({
    gfm: true,
    breaks: true,
  });

  const html = await marked.parse(body);

  return typeof html === "string" ? html : String(html);
}
