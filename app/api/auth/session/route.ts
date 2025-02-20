import { getSession } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await getSession()
    return NextResponse.json(session)
  } catch (error) {
    return new NextResponse("Erro ao buscar sessão", { status: 500 })
  }
}

