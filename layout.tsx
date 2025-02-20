import { Inter } from "next/font/google"
import { Providers } from "./providers"
import Image from "next/image"
import "./globals.css"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <header className="border-b bg-white dark:bg-gray-950">
              <div className="container flex h-16 items-center px-4">
                <div className="flex items-center gap-2">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lxTmN7tRG6FRwBQILejDZS1vgzxfb6.png"
                    alt="MCM Systems Logo"
                    width={140}
                    height={40}
                    className="dark:brightness-200"
                  />
                </div>
              </div>
            </header>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}

