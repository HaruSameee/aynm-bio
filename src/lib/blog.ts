import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/db";
import { accounts, profiles } from "@/db/schema";
import { OWNER_DISCORD_ID } from "@/lib/auth-guard";

const BLOG_SLUG_REGEX = /^[a-z0-9_-]{3,32}$/;
const RESERVED_SERIES_SLUGS = new Set(["post"]);
const BLOG_TIME_ZONE = "Asia/Tokyo";

export function normalizeBlogSlug(value: string) {
  return value.trim().toLowerCase();
}

export function assertValidBlogSlug(value: string) {
  const normalized = normalizeBlogSlug(value);

  if (!BLOG_SLUG_REGEX.test(normalized)) {
    throw new Error(
      "Slug must be 3-32 chars using lowercase letters, numbers, '_' or '-'.",
    );
  }

  return normalized;
}

export function assertValidSeriesSlug(value: string) {
  const normalized = assertValidBlogSlug(value);

  if (RESERVED_SERIES_SLUGS.has(normalized)) {
    throw new Error("This slug is reserved.");
  }

  return normalized;
}

export async function getOwnerBlogUsername() {
  const [ownerProfile] = await db
    .select({
      username: profiles.username,
    })
    .from(profiles)
    .innerJoin(accounts, eq(accounts.userId, profiles.userId))
    .where(
      and(
        eq(accounts.provider, "discord"),
        eq(accounts.providerAccountId, OWNER_DISCORD_ID),
      ),
    )
    .limit(1);

  return ownerProfile?.username ?? null;
}

export async function requireOwnerBlogUsername(username: string) {
  const ownerUsername = await getOwnerBlogUsername();

  if (!ownerUsername || normalizeBlogSlug(username) !== ownerUsername) {
    notFound();
  }

  return ownerUsername;
}

function getBlogDateTimeParts(value: Date) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: BLOG_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(value);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
    second: get("second"),
  };
}

export function formatBlogDate(value?: Date | null) {
  if (!value) {
    return "Draft";
  }

  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: BLOG_TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(value);
}

export function formatBlogDateTime(value?: Date | null) {
  if (!value) {
    return "Draft";
  }

  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: BLOG_TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(value);
}

export function formatDateTimeLocalValue(value?: Date | null) {
  if (!value) {
    return "";
  }

  const { year, month, day, hour, minute } = getBlogDateTimeParts(value);

  return `${year}-${month}-${day}T${hour}:${minute}`;
}
