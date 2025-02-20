"use client"

import type React from "react" // Import React
import { SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SearchProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Search({ className, ...props }: SearchProps) {
  return (
    <div className={cn("relative w-full md:w-64", className)} {...props}>
      <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input type="search" placeholder="Buscar em todos os módulos..." className="pl-8" />
    </div>
  )
}

