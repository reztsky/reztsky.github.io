import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Karaoke & Prompter Lirik Lagu – Reztsky",
  description: "Penampil lirik lagu dan prompter karaoke dengan kustomisasi ukuran teks, warna panggung, dan mode latihan.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0f1117",
};

export default function KaraokeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
