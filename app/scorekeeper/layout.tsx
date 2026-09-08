import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "ScoreKeeper – Pencatat Skor Permainan",
  description: "Papan pencatat skor multiplayer yang responsif untuk board game, kartu, dan turnamen.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0b0f17",
};

export default function ScoreKeeperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
