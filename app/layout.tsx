import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Neighbor Hood - Community Platform',
  description: 'Solving community problems through strategic design and compelling collaboration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
