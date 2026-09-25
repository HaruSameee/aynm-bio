import ui from "./ui.module.css";

/* 未実装画面の中身 */
export default function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <section className={ui.message}>
      <span className={ui.nameBox}>SYSTEM</span>
      <p className={ui.messageText}>{children}</p>
    </section>
  );
}
