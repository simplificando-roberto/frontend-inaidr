import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Estrategia LinkedIn para Hapiick - Demo by Simplificando',
  description: 'Demostración interactiva de cómo Simplificando puede transformar la estrategia de LinkedIn de Hapiick',
  keywords: ['LinkedIn', 'automatización', 'logística', 'Click & Collect', 'Hapiick', 'Simplificando'],
  authors: [{ name: 'Simplificando Team' }],
  creator: 'Simplificando',
  publisher: 'Simplificando',
  openGraph: {
    title: 'Estrategia LinkedIn para Hapiick - Demo by Simplificando',
    description: 'Descubre cómo Simplificando puede transformar la estrategia de LinkedIn de Hapiick y generar leads cualificados',
    url: 'https://hapiick-demo.vercel.app',
    siteName: 'Simplificando Demo',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Estrategia LinkedIn para Hapiick - Demo by Simplificando',
    description: 'Descubre cómo Simplificando puede transformar la estrategia de LinkedIn de Hapiick y generar leads cualificados',
    creator: '@simplificando',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-gray-50`}>
        <div id="root" className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
} 