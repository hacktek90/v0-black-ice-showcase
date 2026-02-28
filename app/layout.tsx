import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import { Geist, Geist_Mono, Inter_Tight } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight" })

export const metadata: Metadata = {
  title: "BlackICE Portal — AI, Productivity & Web Tools Platform",
  description: "The operating system for your web productivity. Seamlessly integrated AI, Utilities, and Workspace tools.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={_interTight.variable}>
      <head>
        <Script 
          src="https://blackice-ac.vercel.app/test/portal.js" 
          defer 
          strategy="lazyOnload"
          onError={(e) => console.log("[v0] Portal script failed to load:", e)}
        />
        <Script 
          src="https://blackice-ac.vercel.app/test/darky.js" 
          defer 
          strategy="lazyOnload"
          onError={(e) => console.log("[v0] Darky script failed to load:", e)}
        />
      </head>
      <body className={`font-sans antialiased bg-[#09090b]`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
