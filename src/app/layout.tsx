import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "SHORTCIRCUIT — URL shortener terminal",
  description:
    "A retro terminal SaaS for shortening URLs, with custom slugs and click analytics.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${plexMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-desk">
        {/* Terminal window title bar */}
        <div
          aria-hidden="true"
          className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-window px-4 py-1.5 text-xs text-ink-muted"
        >
          <span className="flex items-center gap-2">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-ink-dim" />
              <span className="size-2 rounded-full bg-ink-dim" />
              <span className="size-2 rounded-full bg-ink-dim" />
            </span>
            <span className="ml-1 truncate">~/shortcircuit — zsh</span>
          </span>
          <span className="shrink-0 text-ink-dim">utf-8 · 100×30</span>
        </div>
        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-3 py-6 sm:px-6">
          {children}
        </div>
        <footer className="px-4 py-3 text-center text-xs text-ink-dim">
          SHORTCIRCUIT v1.0 — (C) 1994 PHOSPHOR SYSTEMS INC. ALL RIGHTS RESERVED.
        </footer>
      </body>
    </html>
  );
}
