"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormStatus } from "react-dom";

import { saveProfile } from "@/app/actions";
import type { Profile } from "@/db/schema";

type ProfileEditorProps = {
  currentUser: {
    email: string;
    image: string;
    name: string;
  };
  profile?: Profile;
};

type SectionProps = {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
};

const previewAccents = [
  "bg-[#5865f2]",
  "bg-[#57f287]",
  "bg-[#eb459e]",
  "bg-[#fee75c]",
];

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="inline-flex items-center justify-center rounded-2xl bg-[#5865f2] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(88,101,242,0.35)] transition hover:bg-[#6d78f7] disabled:cursor-not-allowed disabled:opacity-70"
      disabled={pending}
      type="submit"
    >
      {pending ? "Saving..." : "Save"}
    </button>
  );
}

function Section({ children, eyebrow, title, description }: SectionProps) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-[#151827]/85 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur">
      <div className="mb-5 space-y-2">
        <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#949ba4]">
          {eyebrow}
        </div>
        <div className="text-xl font-semibold text-white">{title}</div>
        <p className="max-w-xl text-sm leading-6 text-[#b5bac1]">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}

function getInitials(value: string) {
  const source = value.trim();

  if (!source) {
    return "AY";
  }

  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((token) => token[0]?.toUpperCase() ?? "")
    .join("");
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function lineCount(value: string) {
  if (!value.trim()) {
    return 0;
  }

  return value.split(/\r?\n/).length;
}

export function ProfileEditor({ currentUser, profile }: ProfileEditorProps) {
  const [activeTab, setActiveTab] = useState<"card" | "live">("card");
  const [username, setUsername] = useState(profile?.username ?? "");
  const [displayName, setDisplayName] = useState(profile?.displayName ?? "");
  const [rawHtml, setRawHtml] = useState(profile?.rawHtml ?? "");
  const [rawCss, setRawCss] = useState(profile?.rawCss ?? "");
  const [rawJs, setRawJs] = useState(profile?.rawJs ?? "");

  const previewName = displayName.trim() || currentUser.name || "Your Display Name";
  const previewHandle = username.trim() || "username";
  const previewBio =
    stripHtml(rawHtml).slice(0, 180) ||
    "Write a short intro, drop in custom markup, or ship a full mini profile page.";
  const initials = getInitials(previewName);
  const publicHref = username.trim() ? `/${username.trim()}` : undefined;
  const srcdoc = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${displayName || "Preview"}</title>
  <style>${rawCss}</style>
</head>
<body>
  ${rawHtml}
  <script>${rawJs}<\/script>
</body>
</html>`;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_380px]">
      <form action={saveProfile} className="grid gap-6">
        <Section
          description="Shape the identity block first. This is the part Discord users notice immediately."
          eyebrow="Identity"
          title="Core profile"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#949ba4]">
                Username
              </span>
              <input
                autoCapitalize="off"
                autoCorrect="off"
                className="rounded-2xl border border-[#2c3148] bg-[#0f1220] px-4 py-3 text-sm text-white transition placeholder:text-[#6d7480] focus:border-[#5865f2]"
                name="username"
                onChange={(event) => setUsername(event.target.value)}
                pattern="[a-z0-9_-]{3,32}"
                placeholder="aynm"
                required
                type="text"
                value={username}
              />
              <span className="text-xs text-[#949ba4]">
                3-32 chars, lowercase letters, numbers, `_`, `-`
              </span>
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#949ba4]">
                Display name
              </span>
              <input
                className="rounded-2xl border border-[#2c3148] bg-[#0f1220] px-4 py-3 text-sm text-white transition placeholder:text-[#6d7480] focus:border-[#5865f2]"
                name="displayName"
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="HRSM"
                required
                type="text"
                value={displayName}
              />
              <span className="text-xs text-[#949ba4]">
                Keep it punchy. This drives the header and preview card.
              </span>
            </label>
          </div>
        </Section>

        <Section
          description="Drop in any HTML you want rendered on the public page. The preview mirrors your content as plain text."
          eyebrow="Markup"
          title="Profile body"
        >
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#949ba4]">
              HTML
            </span>
            <textarea
              className="min-h-60 rounded-[24px] border border-[#2c3148] bg-[#0f1220] px-4 py-4 text-sm leading-6 text-white transition placeholder:text-[#6d7480] focus:border-[#5865f2]"
              name="rawHtml"
              onChange={(event) => setRawHtml(event.target.value)}
              placeholder="<section><h1>Hello</h1><p>Build your mini bio here.</p></section>"
              value={rawHtml}
            />
          </label>
        </Section>

        <Section
          description="Style and behavior stay separated, just like theme layers. Keep CSS and JS focused so the card stays fast."
          eyebrow="Behavior"
          title="Styling and scripts"
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#949ba4]">
                CSS
              </span>
              <textarea
                className="min-h-52 rounded-[24px] border border-[#2c3148] bg-[#0f1220] px-4 py-4 font-mono text-sm leading-6 text-white transition placeholder:text-[#6d7480] focus:border-[#5865f2]"
                name="rawCss"
                onChange={(event) => setRawCss(event.target.value)}
                placeholder="body { color: white; }"
                value={rawCss}
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#949ba4]">
                JavaScript
              </span>
              <textarea
                className="min-h-52 rounded-[24px] border border-[#2c3148] bg-[#0f1220] px-4 py-4 font-mono text-sm leading-6 text-white transition placeholder:text-[#6d7480] focus:border-[#5865f2]"
                name="rawJs"
                onChange={(event) => setRawJs(event.target.value)}
                placeholder="console.log('profile ready');"
                value={rawJs}
              />
            </label>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <SubmitButton />
            {publicHref ? (
              <Link
                className="inline-flex items-center justify-center rounded-2xl border border-[#343b60] bg-[#1b2036] px-5 py-3 text-sm font-semibold text-[#dfe3ff] transition hover:border-[#5865f2] hover:bg-[#242a45]"
                href={publicHref}
                target="_blank"
              >
                Open public page
              </Link>
            ) : (
              <span className="inline-flex items-center justify-center rounded-2xl border border-[#2b2f42] bg-[#121522] px-5 py-3 text-sm font-medium text-[#7d8590]">
                Choose a username to unlock preview link
              </span>
            )}
          </div>
        </Section>
      </form>

      <aside className="xl:sticky xl:top-8 xl:self-start">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#11131f]/92 shadow-[0_28px_90px_rgba(0,0,0,0.35)] backdrop-blur">
          <div className="border-b border-white/10 px-5 py-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#949ba4]">
              Preview
            </div>
            <div className="mt-1 text-lg font-semibold text-white">
              Discord-style card
            </div>
            <div className="mt-2 flex gap-2">
              {["card", "live"].map((tab) => (
                <button
                  key={tab}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    activeTab === tab
                      ? "bg-[#5865f2] text-white"
                      : "text-[#949ba4] hover:text-white"
                  }`}
                  onClick={() => setActiveTab(tab as "card" | "live")}
                  type="button"
                >
                  {tab === "card" ? "Card" : "Live"}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4">
            {activeTab === "card" ? (
              <div className="overflow-hidden rounded-[28px] border border-[#3a3f60] bg-[#1e2235] shadow-[0_22px_50px_rgba(0,0,0,0.25)]">
                <div className="h-28 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),transparent_35%),linear-gradient(120deg,#5865f2_0%,#7a5cf5_35%,#eb459e_100%)]" />
                <div className="px-5 pb-5">
                  <div className="-mt-11 flex items-end justify-between gap-3">
                    <div className="relative">
                      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-[#1e2235] bg-[#2b2f45] text-2xl font-bold text-white shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
                        {currentUser.image ? (
                          <img
                            alt={previewName}
                            className="h-full w-full object-cover"
                            src={currentUser.image}
                          />
                        ) : (
                          initials
                        )}
                      </div>
                      <span className="absolute bottom-2 right-1 h-5 w-5 rounded-full border-4 border-[#1e2235] bg-[#43b581]" />
                    </div>
                    <div className="rounded-full border border-[#3d4467] bg-[#f2f3f5] px-4 py-2 text-sm font-semibold text-[#4f5660] shadow-[0_10px_20px_rgba(0,0,0,0.15)]">
                      Add status
                    </div>
                  </div>

                  <div className="mt-4 rounded-[24px] bg-[linear-gradient(180deg,rgba(17,19,31,0.18),rgba(255,255,255,0.06))] p-4">
                    <div className="text-3xl font-semibold tracking-tight text-white">
                      {previewName}
                    </div>
                    <div className="mt-1 text-sm text-[#b5bac1]">
                      @{previewHandle}
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      {previewAccents.map((accent) => (
                        <span
                          key={accent}
                          className={`h-2.5 w-2.5 rounded-full ${accent}`}
                        />
                      ))}
                      <span className="text-xs uppercase tracking-[0.22em] text-[#949ba4]">
                        Profile signals
                      </span>
                    </div>

                    <div className="mt-5 rounded-[22px] border border-white/10 bg-[#10131f]/75 p-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#949ba4]">
                        About me
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[#dbdee1]">
                        {previewBio}
                      </p>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-3">
                      <div className="rounded-[20px] border border-white/10 bg-[#10131f]/75 p-3">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-[#949ba4]">
                          HTML
                        </div>
                        <div className="mt-1 text-lg font-semibold text-white">
                          {lineCount(rawHtml)}
                        </div>
                        <div className="text-xs text-[#949ba4]">lines</div>
                      </div>
                      <div className="rounded-[20px] border border-white/10 bg-[#10131f]/75 p-3">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-[#949ba4]">
                          CSS
                        </div>
                        <div className="mt-1 text-lg font-semibold text-white">
                          {lineCount(rawCss)}
                        </div>
                        <div className="text-xs text-[#949ba4]">lines</div>
                      </div>
                      <div className="rounded-[20px] border border-white/10 bg-[#10131f]/75 p-3">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-[#949ba4]">
                          JS
                        </div>
                        <div className="mt-1 text-lg font-semibold text-white">
                          {lineCount(rawJs)}
                        </div>
                        <div className="text-xs text-[#949ba4]">lines</div>
                      </div>
                    </div>

                    <div className="mt-5 rounded-[22px] border border-[#5562b8] bg-[#5865f2] px-4 py-3 text-center text-sm font-semibold text-white shadow-[0_16px_28px_rgba(88,101,242,0.35)]">
                      Button example
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <iframe
                className="w-full rounded-[28px] border-0"
                sandbox="allow-scripts"
                srcDoc={srcdoc}
                style={{ height: "600px" }}
                title="Live preview"
              />
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
