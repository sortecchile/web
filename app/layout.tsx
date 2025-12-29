import type { Metadata } from "next";
import localFont from "next/font/local";
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
          {/* Aquí agregamos el menú de navegación */}
          <header>
            <nav>
              <ul>
                <li><a href="/"></a></li>
                <li><a href="/deck"></a></li> {/* Enlace a la nueva página */}
                <li><a href="/demo"></a></li> {/* Enlace a la nueva página */}
                <li><a href="/newsletter"></a></li> {/* Enlace a la nueva página */}
                {/* Puedes agregar más enlaces aquí según sea necesario */}
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
