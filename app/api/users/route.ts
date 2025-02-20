import { getUsers, createUser } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const users = await getUsers()
    return NextResponse.json(users.map(({ password: _, ...user }) => user))
  } catch (error) {
    return new NextResponse("Erro ao buscar usuários", { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const userData = await request.json()

    // Validate required fields
    if (!userData.firstName || !userData.lastName || !userData.username || !userData.password) {
      return new NextResponse(JSON.stringify({ error: "Missing required fields" }), { status: 400 })
    }

    const newUser = await createUser(userData)
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Error in POST /api/users:", error)

    return new NextResponse(
      JSON.stringify({
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}

