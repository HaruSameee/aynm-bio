import { redirect } from "next/navigation";

/** aynm.dev のトップはポートフォリオ（/hrsm）へ。ログイン画面は /login に移した */
export default function RootPage() {
  redirect("/hrsm");
}
