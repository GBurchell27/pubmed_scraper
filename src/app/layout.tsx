import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PubMed Scraper",
  description: "Search and extract data from PubMed scientific publications",
  keywords: "PubMed, research, medical, scientific, publications",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <header className="bg-white dark:bg-gray-800 shadow">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                PubMed Scraper
              </h1>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
