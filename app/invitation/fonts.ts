import { Unbounded, Montserrat } from "next/font/google";

export const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-unbounded",
  display: "swap",
});

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

