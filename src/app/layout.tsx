import "@fontsource/rajdhani/400.css";
import "@fontsource/rajdhani/600.css";
import "@fontsource/rajdhani/700.css";
import Script from "next/script";
import "../styles.css";
import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Gamopedia — The video game index",
  description:
    "Search the video game index for game details, creators, platforms, ratings, and screenshots.",
  icons: { icon: "/favicon.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f1eee5",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="gamopedia-theme-init" strategy="beforeInteractive">
          {`(() => {
            try {
              const saved = localStorage.getItem("gamopedia-theme");
              const theme = saved === "light" || saved === "dark"
                ? saved
                : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
              document.documentElement.dataset.theme = theme;
              document.documentElement.style.colorScheme = theme;
              document.querySelector('meta[name="theme-color"]')?.setAttribute(
                "content",
                theme === "dark" ? "#18201b" : "#f1eee5"
              );
            } catch {
              document.documentElement.dataset.theme = "light";
            }
          })();`}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
