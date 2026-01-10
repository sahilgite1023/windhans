// app/layout.js
// Root Layout - Applies to all pages

import './globals.css'

export const metadata = {
  title: 'Wind Hans - Share Your Reels',
  description: 'Instagram-style reels platform built with Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
