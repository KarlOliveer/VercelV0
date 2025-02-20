"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Boxes, ClipboardList, Package, Settings, ShoppingCart, TestTube2, Truck } from "lucide-react"
import type React from "react"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  // Don't render navigation on login page
  if (pathname === "/login") {
    return null
  }

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <Link
        href="/projects"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/projects" ? "text-primary" : "text-muted-foreground",
        )}
      >
        <div className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4" />
          Projetos
        </div>
      </Link>
      <Link
        href="/stock"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/stock" ? "text-primary" : "text-muted-foreground",
        )}
      >
        <div className="flex items-center gap-2">
          <Boxes className="h-4 w-4" />
          Estoque
        </div>
      </Link>
      <Link
        href="/tests"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/tests" ? "text-primary" : "text-muted-foreground",
        )}
      >
        <div className="flex items-center gap-2">
          <TestTube2 className="h-4 w-4" />
          Testes
        </div>
      </Link>
      <Link
        href="/orders"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/orders" ? "text-primary" : "text-muted-foreground",
        )}
      >
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4" />
          Pedidos
        </div>
      </Link>
      <Link
        href="/deliveries"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/deliveries" ? "text-primary" : "text-muted-foreground",
        )}
      >
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4" />
          Entregas
        </div>
      </Link>
      <Link
        href="/shipping"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/shipping" ? "text-primary" : "text-muted-foreground",
        )}
      >
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          Envios
        </div>
      </Link>
      <Link
        href="/settings"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/settings" ? "text-primary" : "text-muted-foreground",
        )}
      >
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Configurações
        </div>
      </Link>
    </nav>
  )
}

