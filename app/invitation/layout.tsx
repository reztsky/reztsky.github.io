import type { Metadata } from "next";
import { unbounded, montserrat } from "./fonts";

export const metadata: Metadata = {
  title: "Undangan Tasyakuran Pelatihan Perawat Dialisis Angkatan 13 | RS Dr. Soetomo",
  description:
    "Undangan resmi Tasyakuran Pelatihan Perawat Dialisis Angkatan 13 Rumah Sakit Dr. Soetomo Surabaya. Kamis, 19 November 2026.",
  openGraph: {
    title: "Tasyakuran Pelatihan Perawat Dialisis Angkatan 13",
    description:
      "Undangan resmi Tasyakuran Pelatihan Perawat Dialisis Angkatan 13 RS Dr. Soetomo Surabaya. Kamis, 19 November 2026.",
    type: "website",
    locale: "id_ID",
  },
};

export default function InvitationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      lang="id"
      className={`${unbounded.variable} ${montserrat.variable} min-h-screen bg-[#541A1A] antialiased selection:bg-[#F1E2D1] selection:text-[#810B38]`}
    >
      {children}
    </div>
  );
}

