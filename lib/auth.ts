import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import { validateUser } from "./db"

// Get the JWT secret key from environment variables
const getJWTSecretKey = () => {
  const secret = process.env.JWT_SECRET_KEY

  if (!secret) {
    throw new Error("JWT Secret key is not set in environment variables")
  }

  return new TextEncoder().encode(secret)
}

export async function login(username: string, password: string) {
  try {
    const user = await validateUser(username, password)
    if (!user) return null
    return user
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

export async function encrypt(payload: any) {
  try {
    const secret = getJWTSecretKey()

    return await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret)
  } catch (error) {
    console.error("Encryption error:", error)
    throw error
  }
}

export async function decrypt(input: string): Promise<any> {
  try {
    const secret = getJWTSecretKey()

    const { payload } = await jwtVerify(input, secret, {
      algorithms: ["HS256"],
    })
    return payload
  } catch (error) {
    console.error("Decryption error:", error)
    return null
  }
}

export async function getSession() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("session")?.value

    if (!token) return null

    return await decrypt(token)
  } catch (error) {
    console.error("Get session error:", error)
    return null
  }
}

export async function updateSession(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return null

    const token = await encrypt(session)
    request.cookies.set("session", token)

    return session
  } catch (error) {
    console.error("Update session error:", error)
    return null
  }
}

