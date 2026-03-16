"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { marked } from "marked";
import { useEffect, useState, useTransition } from "react";

import { createPost, updatePost } from "@/app/actions/blog";

type SeriesOption = {
  id: string;
  title: string;
  slug: string;
};

type InitialPost = {
  id: string;
  title: string;
  slug: string;
  seriesId: string | null;
  seriesOrder: number | null;
  body: string;
  publishedAt: string;
};

type BlogPostFormProps = {
  mode: "create" | "edit";
  seriesOptions: SeriesOption[];
  initialPost?: InitialPost;
};

function createSlugDraft(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "")
    .slice(0, 32);
}

export function BlogPostForm({
  mode,
  seriesOptions,
  initialPost,
}: BlogPostFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [slug, setSlug] = useState(initialPost?.slug ?? "");
  const [seriesId, setSeriesId] = useState(initialPost?.seriesId ?? "");
  const [seriesOrder, setSeriesOrder] = useState(
    initialPost?.seriesOrder?.toString() ?? "",
  );
  const [body, setBody] = useState(initialPost?.body ?? "");
  const [publishedAt, setPublishedAt] = useState(initialPost?.publishedAt ?? "");
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");
  const [previewHtml, setPreviewHtml] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [slugEdited, setSlugEdited] = useState(Boolean(initialPost?.slug));

  useEffect(() => {
    let cancelled = false;

    async function updatePreview() {
      const html = await marked.parse(body || "_No content yet._");

      if (!cancelled) {
        setPreviewHtml(typeof html === "string" ? html : String(html));
      }
    }

    updatePreview();

    return () => {
      cancelled = true;
    };
  }, [body]);

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slugEdited) {
      setSlug(createSlugDraft(value));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const parsedSeriesOrder = seriesOrder.trim()
      ? Number(seriesOrder.trim())
      : null;

    if (parsedSeriesOrder !== null && Number.isNaN(parsedSeriesOrder)) {
      setErrorMessage("Series order must be a number.");
      return;
    }

    const parsedPublishedAt = publishedAt ? new Date(publishedAt) : null;

    if (publishedAt && Number.isNaN(parsedPublishedAt?.getTime())) {
      setErrorMessage("Published at is invalid.");
      return;
    }

    startTransition(async () => {
      try {
        if (mode === "create") {
          await createPost({
            title,
            slug,
            seriesId: seriesId || null,
            seriesOrder: parsedSeriesOrder,
            body,
            publishedAt: parsedPublishedAt,
          });
        } else if (initialPost) {
          await updatePost(initialPost.id, {
            title,
            slug,
            seriesId: seriesId || null,
            seriesOrder: parsedSeriesOrder,
            body,
            publishedAt: parsedPublishedAt,
          });
        }

        router.push("/dashboard/blog");
        router.refresh();
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to save post.",
        );
      }
    });
  }

  return (
    <form
      className="space-y-6 rounded-3xl border border-white/10 bg-[#111523]/80 p-6 shadow-[0_24px_50px_rgba(0,0,0,0.25)]"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-[#c8ccd2]">
          <span className="font-medium text-white">Title</span>
          <input
            className="rounded-2xl border border-white/10 bg-[#0b0f1a] px-4 py-3 text-white"
            onChange={(event) => handleTitleChange(event.target.value)}
            placeholder="A new note"
            required
            value={title}
          />
        </label>
        <label className="grid gap-2 text-sm text-[#c8ccd2]">
          <span className="font-medium text-white">Slug</span>
          <input
            className="rounded-2xl border border-white/10 bg-[#0b0f1a] px-4 py-3 text-white"
            onChange={(event) => {
              setSlugEdited(true);
              setSlug(event.target.value.toLowerCase());
            }}
            placeholder="a-new-note"
            required
            value={slug}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-2 text-sm text-[#c8ccd2]">
          <span className="font-medium text-white">Series</span>
          <select
            className="rounded-2xl border border-white/10 bg-[#0b0f1a] px-4 py-3 text-white"
            onChange={(event) => setSeriesId(event.target.value)}
            value={seriesId}
          >
            <option value="">Standalone post</option>
            {seriesOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.title} ({option.slug})
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-[#c8ccd2]">
          <span className="font-medium text-white">Series order</span>
          <input
            className="rounded-2xl border border-white/10 bg-[#0b0f1a] px-4 py-3 text-white"
            min="1"
            onChange={(event) => setSeriesOrder(event.target.value)}
            placeholder="1"
            type="number"
            value={seriesOrder}
          />
        </label>
        <label className="grid gap-2 text-sm text-[#c8ccd2]">
          <span className="font-medium text-white">Published at</span>
          <input
            className="rounded-2xl border border-white/10 bg-[#0b0f1a] px-4 py-3 text-white"
            onChange={(event) => setPublishedAt(event.target.value)}
            type="datetime-local"
            value={publishedAt}
          />
        </label>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-medium text-white">Body</div>
          <div className="inline-flex rounded-full border border-white/10 bg-[#0b0f1a] p-1">
            {(["editor", "preview"] as const).map((tab) => (
              <button
                key={tab}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  activeTab === tab
                    ? "bg-[#5865f2] text-white"
                    : "text-[#949ba4] hover:text-white"
                }`}
                onClick={() => setActiveTab(tab)}
                type="button"
              >
                {tab === "editor" ? "Editor" : "Preview"}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "editor" ? (
          <textarea
            className="min-h-[420px] w-full rounded-3xl border border-white/10 bg-[#0b0f1a] px-4 py-4 font-mono text-sm leading-6 text-white"
            onChange={(event) => setBody(event.target.value)}
            placeholder="# Hello"
            value={body}
          />
        ) : (
          <div
            className="prose prose-invert min-h-[420px] max-w-none rounded-3xl border border-white/10 bg-[#0b0f1a] px-5 py-4 prose-a:text-[#8ea1ff]"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        )}
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-[#f23f43]/40 bg-[#2a1318] px-4 py-3 text-sm text-[#ffb7b8]">
          {errorMessage}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          className="rounded-2xl bg-[#5865f2] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6d78f7] disabled:opacity-60"
          disabled={isPending}
          type="submit"
        >
          {isPending
            ? "Saving..."
            : mode === "create"
              ? "Create post"
              : "Save changes"}
        </button>
        <Link
          className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-[#c8ccd2] transition hover:border-[#5865f2] hover:text-white"
          href="/dashboard/blog"
        >
          Back
        </Link>
      </div>
    </form>
  );
}
