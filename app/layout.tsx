import type { Metadata } from "next";
import "./globals.css";
import { ConditionalNavbar } from "@/components/navbar/ConditionalNavbar";
import { SiteFooter } from "@/components/footer/SiteFooter";

export const metadata: Metadata = {
  title: "TV Kalendar - Historijski događaji",
  description: "Digitalno očuvanje kulturnog i historijskog naslijeđa kroz interaktivnu web platformu",
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
