import type { Metadata } from "next";
import "./globals.css";
import { ConditionalNavbar } from "@/components/navbar/ConditionalNavbar";
import { SiteFooter } from "@/components/footer/SiteFooter";

export const metadata: Metadata = {
  title: "TV Kalendar - Historijski događaji",
  description: "Digitalno očuvanje kulturnog i historijskog naslijeđa kroz interaktivnu web platformu",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },
  openGraph: {
    title: "TV Kalendar - Historijski događaji",
    description: "Digitalno očuvanje kulturnog i historijskog naslijeđa kroz interaktivnu web platformu",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TV Kalendar - Historijski događaji",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TV Kalendar - Historijski događaji",
    description: "Digitalno očuvanje kulturnog i historijskog naslijeđa kroz interaktivnu web platformu",
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bs" className="scrollbar-stable">
      <body className="antialiased">
        <div className="min-h-screen flex flex-col">
          <ConditionalNavbar />
          <main className="flex-1 bg-[--color-bg]">
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
