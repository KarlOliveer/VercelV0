import { Inter } from "next/font/google"
import { Providers } from "./providers"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"
import Image from "next/image"
import "./globals.css"
import type React from "react"
import { Toaster } from "@/components/ui/toaster"
import { validateEnv } from "@/lib/env"
import { getSession } from "@/lib/auth"

const inter = Inter({ subsets: ["latin"] })

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  validateEnv()
  const session = await getSession()

  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            {session && (
              <div className="border-b bg-background">
                <div className="flex h-16 items-center px-6">
                  <div className="relative h-10 w-40 mr-8">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logomcmsmall-MH7WnbS141eHihOnlLCoLPPEFMlMQF.png"
                      alt="MCM Systems Logo"
                      fill
                      priority
                      className="object-contain dark:[&:not(:has(>path))]:brightness-0 dark:[&:not(:has(>path))]:invert"
                    />
                  </div>
                  <MainNav className="mx-6" />
                  <div className="ml-auto flex items-center space-x-4">
                    <Search />
                    <ModeToggle />
                    <UserNav />
                  </div>
                </div>
              </div>
            )}
            <div className="flex-1">{children}</div>
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  )
}



import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };
