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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  "name": "JCI Tkawer 2.0 — Tournoi de Football",
  "description": "Le plus grand tournoi de football amateur à Mornaguia, organisé par JCI ElFejja Bessetine.",
  "startDate": "2026-05-09T09:00",
  "endDate": "2026-05-09T18:00",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": "Stade Mornaguia",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Mornaguia",
      "addressRegion": "Manouba",
      "addressCountry": "TN"
    }
  },
  "image": [
    "https://jcitkawer.github.io/images/afficheJCITKAWER.jpeg"
  ],
  "organizer": {
    "@type": "Organization",
    "name": "JCI ElFejja Bessetine",
    "url": "https://www.facebook.com/61571810806339"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://jcitkawer.github.io/",
    "price": "10",
    "priceCurrency": "TND",
    "availability": "https://schema.org/InStock",
    "validFrom": "2026-04-01"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning data-scroll-behavior="smooth" className={jakarta.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-[#0A1130] text-white antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
