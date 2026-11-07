import "@fontsource/rajdhani/400.css";
import "@fontsource/rajdhani/600.css";
import "@fontsource/rajdhani/700.css";
import "../styles.css";

export const metadata = {
  title: "Gamopedia — The video game index",
  description:
    "Search the video game index for game details, creators, platforms, ratings, and screenshots.",
  icons: { icon: "/favicon.png" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f1eee5",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
