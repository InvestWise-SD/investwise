import '@/styles/globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'InvestWise - Learn Investing Without the Jargon',
  description: 'AI-powered investment education that makes investing accessible to everyone.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  )
}
