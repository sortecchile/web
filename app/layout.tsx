import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import "./globals.css";
import { LanguageProvider } from "./i18n/LanguageProvider";

const fraunces = localFont({
  src: "../public/fonts/Fraunces-Variable.ttf",
  variable: '--font-fraunces',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "MIIDO / Agentic Farming",
  description: "El copilot agrícola para tu empresa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fraunces.variable}>
      <body className={fraunces.className}>
        <LanguageProvider>
          {/* Hidden navigation for accessibility/SEO */}
          <header className="sr-only">
            <nav>
              <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/deck">Deck</Link></li>
                <li><Link href="/demo">Demo</Link></li>
              </ul>
            </nav>
          </header>
          {/* El contenido de la página */}
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
