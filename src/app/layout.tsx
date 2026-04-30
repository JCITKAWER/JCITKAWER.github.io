import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JCI Tkawer 2.0 — Tournoi de Football | JCI ElFejja Bessetine",
  description:
    "Rejoignez le Tournoi JCI Tkawer 2.0 le 09 Mai 2026 au Stade Mornaguia. Inscription 10 DT. Organisé par JCI ElFejja Bessetine. ⚽🦁",
  keywords: [
    "JCI Tkawer",
    "JCI ElFejja Bessetine",
    "tournoi football",
    "Mornaguia",
    "football Tunisie",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "JCI Tkawer 2.0 — Tournoi de Football",
    description:
      "Le plus grand tournoi de football à Mornaguia. 09 Mai 2026. Inscription 10 DT par personne.",
    url: "https://www.facebook.com/61571810806339",
    type: "website",
    locale: "fr_TN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning data-scroll-behavior="smooth" className={jakarta.variable}>
      <body suppressHydrationWarning className="min-h-screen bg-[#0A1130] text-white antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
