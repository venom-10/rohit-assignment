import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GlobeTrotter',
  description: 'Test your knowledge of world destinations and challenge your friends!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bubblegum+Sans&family=Comic+Neue:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-comic bg-cartoon-bg">
        {children}
      </body>
    </html>
  )
}