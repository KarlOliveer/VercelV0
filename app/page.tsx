import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const session = await getSession()

  // If not authenticated, redirect to login
  if (!session) {
    redirect("/login")
  }

  // If authenticated, redirect to projects
  redirect("/projects")
}

