import { createClient } from '@supabase/supabase-js'
import type { User } from "@/types/user"

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Helper function to convert database user to application user
function dbUserToAppUser(dbUser: any): User {
  return {
    id: dbUser.id,
    firstName: dbUser.first_name,
    lastName: dbUser.last_name,
    username: dbUser.username,
    password: dbUser.password,
    role: dbUser.role,
    permissions: dbUser.permissions,
    createdAt: dbUser.created_at,
    updatedAt: dbUser.updated_at
  }
}

export async function validateUser(username: string, password: string): Promise<Omit<User, "password"> | null> {
  try {
    console.log(`Attempting to validate user: ${username}`)

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single()

    if (error || !user) {
      console.log(`Invalid credentials for user: ${username}`)
      return null
    }

    console.log(`User ${username} validated successfully`)
    const appUser = dbUserToAppUser(user)
    const { password: _, ...userWithoutPassword } = appUser
    return userWithoutPassword
  } catch (error) {
    console.error("Error validating user:", error)
    return null
  }
}

export async function getUsers(): Promise<User[]> {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      throw error
    }

    return users.map(dbUserToAppUser)
  } catch (error) {
    console.error("Error reading users:", error)
    throw error
  }
}

export async function createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
  try {
    // Prevent creating another admin.admin user
    if (userData.username === "admin.admin") {
      throw new Error("Cannot create another admin user")
    }

    const { data: user, error } = await supabase
      .from('users')
      .insert({
        first_name: userData.firstName,
        last_name: userData.lastName,
        username: userData.username,
        password: userData.password,
        role: userData.role,
        permissions: userData.permissions
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    console.log(`User created successfully: ${userData.username}`)
    return dbUserToAppUser(user)
  } catch (error) {
    console.error("Error creating user:", error)
    throw error instanceof Error ? error : new Error("Unknown error occurred while creating user")
  }
}

export async function updateUser(id: string, userData: Partial<User>): Promise<User> {
  try {
    // First check if user exists and is not admin
    const { data: existingUser } = await supabase
      .from('users')
      .select('username')
      .eq('id', id)
      .single()

    if (!existingUser) {
      throw new Error("User not found")
    }

    if (existingUser.username === "admin.admin") {
      throw new Error("Cannot update admin user")
    }

    // Prepare update data
    const updateData: any = {}
    if (userData.firstName) updateData.first_name = userData.firstName
    if (userData.lastName) updateData.last_name = userData.lastName
    if (userData.username) updateData.username = userData.username
    if (userData.password) updateData.password = userData.password
    if (userData.role) updateData.role = userData.role
    if (userData.permissions) updateData.permissions = userData.permissions

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return dbUserToAppUser(updatedUser)
  } catch (error) {
    console.error("Error updating user:", error)
    throw error instanceof Error ? error : new Error("Unknown error occurred while updating user")
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    // First check if user exists and is not admin
    const { data: user } = await supabase
      .from('users')
      .select('username')
      .eq('id', id)
      .single()

    if (!user) {
      throw new Error("User not found")
    }

    if (user.username === "admin.admin") {
      throw new Error("Cannot delete admin user")
    }

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }
  } catch (error) {
    console.error("Error deleting user:", error)
    throw error instanceof Error ? error : new Error("Unknown error occurred while deleting user")
  }
}