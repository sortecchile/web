import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MIIDO Contractors',
  description:
    'MIIDO Contractors — La IA que opera tu campo todo el año. Formal, medible, sin sorpresas.',
  metadataBase: new URL('https://miido.work'),
  openGraph: {
    title: 'MIIDO Contractors',
    description:
      'MIIDO Contractors — La IA que opera tu campo todo el año. Formal, medible, sin sorpresas.',
    url: 'https://miido.work',
    siteName: 'MIIDO Contractors',
    type: 'website',
    locale: 'es_CL',
  },
  twitter: {
    card: 'summary',
    title: 'MIIDO Contractors',
    description:
      'MIIDO Contractors — La IA que opera tu campo todo el año. Formal, medible, sin sorpresas.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
