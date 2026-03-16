"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  createSeries,
  deleteSeries,
  updateSeries,
} from "@/app/actions/blog";

type SeriesItem = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  postCount: number;
};

type SeriesManagerProps = {
  initialSeries: SeriesItem[];
};

function SeriesCard({ item }: { item: SeriesItem }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [slug, setSlug] = useState(item.slug);
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(item.coverImageUrl ?? "");
  const [errorMessage, setErrorMessage] = useState("");

  function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    startTransition(async () => {
      try {
        await updateSeries(item.id, {
          slug,
          title,
          description,
          coverImageUrl,
        });
        router.refresh();
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to save series.",
        );
      }
    });
  }

  return (
    <form
      className="space-y-4 rounded-3xl border border-white/10 bg-[#111523]/80 p-5"
      onSubmit={handleSave}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-white">{item.title}</div>
          <div className="text-sm text-[#949ba4]">{item.postCount} posts</div>
        </div>
        <button
          className="rounded-xl border border-[#f23f43]/40 px-3 py-2 text-sm font-semibold text-[#ffb7b8] transition hover:bg-[#2a1318]"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              try {
                await deleteSeries(item.id);
                router.refresh();
              } catch (error) {
                setErrorMessage(
                  error instanceof Error
                    ? error.message
                    : "Failed to delete series.",
                );
              }
            });
          }}
          type="button"
        >
          Delete
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-[#c8ccd2]">
          <span className="font-medium text-white">Title</span>
          <input
            className="rounded-2xl border border-white/10 bg-[#0b0f1a] px-4 py-3 text-white"
            onChange={(event) => setTitle(event.target.value)}
            value={title}
          />
        </label>
        <label className="grid gap-2 text-sm text-[#c8ccd2]">
          <span className="font-medium text-white">Slug</span>
          <input
            className="rounded-2xl border border-white/10 bg-[#0b0f1a] px-4 py-3 text-white"
            onChange={(event) => setSlug(event.target.value.toLowerCase())}
            value={slug}
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm text-[#c8ccd2]">
        <span className="font-medium text-white">Description</span>
        <textarea
          className="min-h-28 rounded-2xl border border-white/10 bg-[#0b0f1a] px-4 py-3 text-white"
          onChange={(event) => setDescription(event.target.value)}
          value={description}
        />
      </label>

      <label className="grid gap-2 text-sm text-[#c8ccd2]">
        <span className="font-medium text-white">Cover image URL</span>
        <input
          className="rounded-2xl border border-white/10 bg-[#0b0f1a] px-4 py-3 text-white"
          onChange={(event) => setCoverImageUrl(event.target.value)}
          value={coverImageUrl}
        />
      </label>

      {errorMessage ? (
        <div className="rounded-2xl border border-[#f23f43]/40 bg-[#2a1318] px-4 py-3 text-sm text-[#ffb7b8]">
          {errorMessage}
        </div>
      ) : null}

      <button
        className="rounded-2xl bg-[#5865f2] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#6d78f7] disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Saving..." : "Save series"}
      </button>
    </form>
  );
}

export function SeriesManager({ initialSeries }: SeriesManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    startTransition(async () => {
      try {
        await createSeries({
          slug,
          title,
          description,
          coverImageUrl,
        });
        setSlug("");
        setTitle("");
        setDescription("");
        setCoverImageUrl("");
        router.refresh();
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to create series.",
        );
      }
    });
  }

  return (
    <div className="space-y-6">
      <form
        className="space-y-4 rounded-3xl border border-white/10 bg-[#111523]/80 p-6"
        onSubmit={handleCreate}
      >
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-white">Create series</h2>
          <p className="text-sm text-[#949ba4]">
            Group related posts and optionally attach a cover image.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm text-[#c8ccd2]">
            <span className="font-medium text-white">Title</span>
            <input
              className="rounded-2xl border border-white/10 bg-[#0b0f1a] px-4 py-3 text-white"
              onChange={(event) => setTitle(event.target.value)}
              value={title}
            />
          </label>
          <label className="grid gap-2 text-sm text-[#c8ccd2]">
            <span className="font-medium text-white">Slug</span>
            <input
              className="rounded-2xl border border-white/10 bg-[#0b0f1a] px-4 py-3 text-white"
              onChange={(event) => setSlug(event.target.value.toLowerCase())}
              value={slug}
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm text-[#c8ccd2]">
          <span className="font-medium text-white">Description</span>
          <textarea
            className="min-h-28 rounded-2xl border border-white/10 bg-[#0b0f1a] px-4 py-3 text-white"
            onChange={(event) => setDescription(event.target.value)}
            value={description}
          />
        </label>

        <label className="grid gap-2 text-sm text-[#c8ccd2]">
          <span className="font-medium text-white">Cover image URL</span>
          <input
            className="rounded-2xl border border-white/10 bg-[#0b0f1a] px-4 py-3 text-white"
            onChange={(event) => setCoverImageUrl(event.target.value)}
            value={coverImageUrl}
          />
        </label>

        {errorMessage ? (
          <div className="rounded-2xl border border-[#f23f43]/40 bg-[#2a1318] px-4 py-3 text-sm text-[#ffb7b8]">
            {errorMessage}
          </div>
        ) : null}

        <button
          className="rounded-2xl bg-[#5865f2] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#6d78f7] disabled:opacity-60"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Creating..." : "Create series"}
        </button>
      </form>

      <div className="space-y-4">
        {initialSeries.map((item) => (
          <SeriesCard item={item} key={item.id} />
        ))}
      </div>
    </div>
  );
}
