"use client";

import { useFormStatus } from "react-dom";

import { saveProfile } from "@/app/actions";
import type { Profile } from "@/db/schema";

type ProfileEditorProps = {
  profile?: Profile;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="inline-flex items-center justify-center rounded-md bg-sky-400 px-4 py-2 text-sm font-medium text-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
      disabled={pending}
      type="submit"
    >
      {pending ? "Saving..." : "Save"}
    </button>
  );
}

export function ProfileEditor({ profile }: ProfileEditorProps) {
  return (
    <form action={saveProfile} className="grid gap-5">
      <label className="grid gap-2">
        <span className="text-sm font-medium text-slate-200">username</span>
        <input
          className="rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100"
          defaultValue={profile?.username ?? ""}
          name="username"
          required
          type="text"
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-medium text-slate-200">displayName</span>
        <input
          className="rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100"
          defaultValue={profile?.displayName ?? ""}
          name="displayName"
          required
          type="text"
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-medium text-slate-200">rawHtml</span>
        <textarea
          className="min-h-48 rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100"
          defaultValue={profile?.rawHtml ?? ""}
          name="rawHtml"
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-medium text-slate-200">rawCss</span>
        <textarea
          className="min-h-40 rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100"
          defaultValue={profile?.rawCss ?? ""}
          name="rawCss"
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-medium text-slate-200">rawJs</span>
        <textarea
          className="min-h-40 rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100"
          defaultValue={profile?.rawJs ?? ""}
          name="rawJs"
        />
      </label>
      <SubmitButton />
    </form>
  );
}
