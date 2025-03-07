import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MIIDO / Digitalización simple",
  description: "El copilot agrícola para tu empresa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
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
      </body>
    </html>
  );
}
