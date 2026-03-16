"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { posts, profiles, series } from "@/db/schema";
import {
  assertValidBlogSlug,
  assertValidSeriesSlug,
  getOwnerBlogUsername,
} from "@/lib/blog";
import { requireOwner } from "@/lib/auth-guard";

type CreatePostInput = {
  slug: string;
  title: string;
  seriesId?: string | null;
  seriesOrder?: number | null;
  body: string;
  publishedAt?: Date | null;
};

type UpdatePostInput = Partial<{
  title: string;
  slug: string;
  seriesId: string | null;
  seriesOrder: number | null;
  body: string;
  publishedAt: Date | null;
}>;

type CreateSeriesInput = {
  slug: string;
  title: string;
  description?: string | null;
  coverImageUrl?: string | null;
};

type UpdateSeriesInput = Partial<{
  slug: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
}>;

function assertTitle(value: string, fieldName = "Title") {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${fieldName} is required.`);
  }

  return normalized;
}

function normalizeOptionalText(value?: string | null) {
  if (value == null) {
    return null;
  }

  const normalized = value.trim();

  return normalized ? normalized : null;
}

function normalizeSeriesId(value?: string | null) {
  if (value == null) {
    return null;
  }

  const normalized = value.trim();

  return normalized ? normalized : null;
}

function normalizeSeriesOrder(value?: number | null) {
  if (value == null) {
    return null;
  }

  if (!Number.isInteger(value) || value < 1) {
    throw new Error("Series order must be a positive integer.");
  }

  return value;
}

function normalizePublishedAt(value?: Date | null) {
  if (value == null) {
    return null;
  }

  if (Number.isNaN(value.getTime())) {
    throw new Error("Published at is invalid.");
  }

  return value;
}

async function resolveSessionUsername(userId: string) {
  const [profile] = await db
    .select({
      username: profiles.username,
    })
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  return profile?.username ?? (await getOwnerBlogUsername());
}

async function revalidateBlogPaths(userId: string) {
  revalidatePath("/dashboard/blog");
  revalidatePath("/dashboard/blog/new");
  revalidatePath("/dashboard/series");

  const username = await resolveSessionUsername(userId);

  if (username) {
    revalidatePath(`/${username}/blog`);
  }
}

export async function createPost(data: CreatePostInput): Promise<{ id: string }> {
  const { userId } = await requireOwner();

  const [created] = await db
    .insert(posts)
    .values({
      slug: assertValidBlogSlug(data.slug),
      title: assertTitle(data.title),
      seriesId: normalizeSeriesId(data.seriesId),
      seriesOrder: normalizeSeriesOrder(data.seriesOrder),
      body: data.body ?? "",
      publishedAt: normalizePublishedAt(data.publishedAt),
    })
    .returning({ id: posts.id });

  await revalidateBlogPaths(userId);

  return created;
}

export async function updatePost(id: string, data: UpdatePostInput): Promise<void> {
  const { userId } = await requireOwner();

  const nextData: {
    body?: string;
    publishedAt?: Date | null;
    seriesId?: string | null;
    seriesOrder?: number | null;
    slug?: string;
    title?: string;
    updatedAt: Date;
  } = {
    updatedAt: new Date(),
  };

  if (data.title !== undefined) {
    nextData.title = assertTitle(data.title);
  }

  if (data.slug !== undefined) {
    nextData.slug = assertValidBlogSlug(data.slug);
  }

  if (data.seriesId !== undefined) {
    nextData.seriesId = normalizeSeriesId(data.seriesId);
  }

  if (data.seriesOrder !== undefined) {
    nextData.seriesOrder = normalizeSeriesOrder(data.seriesOrder);
  }

  if (data.body !== undefined) {
    nextData.body = data.body;
  }

  if (data.publishedAt !== undefined) {
    nextData.publishedAt = normalizePublishedAt(data.publishedAt);
  }

  await db.update(posts).set(nextData).where(eq(posts.id, id));
  await revalidateBlogPaths(userId);
}

export async function deletePost(id: string): Promise<void> {
  const { userId } = await requireOwner();

  await db.delete(posts).where(eq(posts.id, id));
  await revalidateBlogPaths(userId);
}

export async function createSeries(
  data: CreateSeriesInput,
): Promise<{ id: string }> {
  const { userId } = await requireOwner();

  const [created] = await db
    .insert(series)
    .values({
      slug: assertValidSeriesSlug(data.slug),
      title: assertTitle(data.title),
      description: normalizeOptionalText(data.description),
      coverImageUrl: normalizeOptionalText(data.coverImageUrl),
    })
    .returning({ id: series.id });

  await revalidateBlogPaths(userId);

  return created;
}

export async function updateSeries(
  id: string,
  data: UpdateSeriesInput,
): Promise<void> {
  const { userId } = await requireOwner();

  const nextData: {
    coverImageUrl?: string | null;
    description?: string | null;
    slug?: string;
    title?: string;
  } = {};

  if (data.slug !== undefined) {
    nextData.slug = assertValidSeriesSlug(data.slug);
  }

  if (data.title !== undefined) {
    nextData.title = assertTitle(data.title);
  }

  if (data.description !== undefined) {
    nextData.description = normalizeOptionalText(data.description);
  }

  if (data.coverImageUrl !== undefined) {
    nextData.coverImageUrl = normalizeOptionalText(data.coverImageUrl);
  }

  if (Object.keys(nextData).length === 0) {
    return;
  }

  await db.update(series).set(nextData).where(eq(series.id, id));
  await revalidateBlogPaths(userId);
}

export async function deleteSeries(id: string): Promise<void> {
  const { userId } = await requireOwner();

  await db.delete(series).where(eq(series.id, id));
  await revalidateBlogPaths(userId);
}
