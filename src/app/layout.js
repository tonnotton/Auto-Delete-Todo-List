import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Auto Delete Todo',
  description: 'Auto Delete Todo List Application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body id="__next" className={inter.className}>{children}</body>
    </html>
  )
}