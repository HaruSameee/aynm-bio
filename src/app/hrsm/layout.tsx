import type { Metadata } from "next";

import { HrsmProvider } from "./_components/HrsmProvider";
import { hrsmBodyFont, hrsmHeadingFont } from "./_lib/fonts";
import { SITE_URL } from "./_lib/metadata";
import theme from "./theme.module.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export default function HrsmLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${theme.root} ${hrsmHeadingFont.variable} ${hrsmBodyFont.variable}`}>
      <div className={theme.bg} aria-hidden="true" />
      <HrsmProvider>{children}</HrsmProvider>
    </div>
  );
}
