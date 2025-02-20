import { updateUser, deleteUser } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const userData = await request.json()
    const updatedUser = await updateUser(params.id, userData)
    const { password: _, ...userWithoutPassword } = updatedUser
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao atualizar usuário"
    return new NextResponse(message, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    await deleteUser(params.id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao excluir usuário"
    return new NextResponse(message, { status: 500 })
  }
}

