import { writeFile, readFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import type { User } from "@/types/user"

// Add this helper function at the top of the file with other imports
function validateUserObject(user: any): user is User {
  return (
    typeof user === "object" &&
    user !== null &&
    typeof user.id === "string" &&
    typeof user.firstName === "string" &&
    typeof user.lastName === "string" &&
    typeof user.username === "string" &&
    typeof user.password === "string" &&
    typeof user.role === "string" &&
    typeof user.permissions === "object" &&
    user.permissions !== null &&
    typeof user.createdAt === "string" &&
    typeof user.updatedAt === "string"
  )
}

// Define database paths
const DB_PATH = path.join(process.cwd(), "data")
const USERS_FILE = path.join(DB_PATH, "users.json")

// Admin user configuration - IMPORTANT: DO NOT CHANGE THESE CREDENTIALS
const ADMIN_USER: User = {
  id: "1",
  firstName: "Admin",
  lastName: "Admin",
  username: "admin.admin",
  password: "admingenerico", // Fixed admin password
  role: "admin",
  permissions: {
    createProjects: true,
    editProjects: true,
    deleteProjects: true,
    downloadReports: true,
    createUsers: true,
    editUsers: true,
    deleteUsers: true,
    createTests: true,
    editTests: true,
    deleteTests: true,
    createStock: true,
    editStock: true,
    deleteStock: true,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

// Initialize database and ensure admin user exists
async function initializeDatabase() {
  try {
    // Create data directory if it doesn't exist
    if (!existsSync(DB_PATH)) {
      await mkdir(DB_PATH, { recursive: true })
    }

    // Initialize with admin user
    let users: User[] = []

    // Try to read existing users
    if (existsSync(USERS_FILE)) {
      try {
        const content = await readFile(USERS_FILE, "utf-8")
        users = JSON.parse(content)
      } catch (error) {
        console.error("Error reading users file, initializing with admin only:", error)
        users = []
      }
    }

    // Ensure admin user exists with correct credentials
    const adminIndex = users.findIndex((user) => user.username === "admin.admin")
    if (adminIndex !== -1) {
      users[adminIndex] = ADMIN_USER // Replace existing admin with correct credentials
    } else {
      users.unshift(ADMIN_USER) // Add admin at the beginning if not exists
    }

    // Write users to file
    await writeFile(USERS_FILE, JSON.stringify(users, null, 2))
    console.log("Database initialized successfully with admin user")
    return true
  } catch (error) {
    console.error("Failed to initialize database:", error)
    return false
  }
}

// Initialize database on module load
initializeDatabase().catch(console.error)

export async function validateUser(username: string, password: string): Promise<Omit<User, "password"> | null> {
  try {
    console.log(`Attempting to validate user: ${username}`)

    // Special case for admin user
    if (username === "admin.admin" && password === "admingenerico") {
      console.log("Admin login attempt successful")
      const { password: _, ...adminWithoutPassword } = ADMIN_USER
      return adminWithoutPassword
    }

    const users = await getUsers()
    const user = users.find((u) => u.username === username && u.password === password)

    if (user) {
      console.log(`User ${username} validated successfully`)
      const { password: _, ...userWithoutPassword } = user
      return userWithoutPassword
    }

    console.log(`Invalid credentials for user: ${username}`)
    return null
  } catch (error) {
    console.error("Error validating user:", error)
    return null
  }
}

export async function getUsers(): Promise<User[]> {
  try {
    if (!existsSync(USERS_FILE)) {
      console.log("Users file doesn't exist, initializing with admin user")
      await initializeDatabase()
      return [ADMIN_USER]
    }

    const content = await readFile(USERS_FILE, "utf-8")
    const users: User[] = JSON.parse(content)

    // Always ensure admin user exists with correct credentials
    const adminIndex = users.findIndex((user) => user.username === "admin.admin")
    if (adminIndex !== -1) {
      users[adminIndex] = ADMIN_USER
    } else {
      users.unshift(ADMIN_USER)
    }

    return users
  } catch (error) {
    console.error("Error reading users:", error)
    return [ADMIN_USER]
  }
}

export async function createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
  try {
    // Ensure DB directory exists
    if (!existsSync(DB_PATH)) {
      await mkdir(DB_PATH, { recursive: true })
    }

    const users = await getUsers()

    // Validate user data
    if (!userData.firstName || !userData.lastName || !userData.username || !userData.password) {
      throw new Error("Missing required user data")
    }

    // Prevent creating another admin.admin user
    if (userData.username === "admin.admin") {
      throw new Error("Cannot create another admin user")
    }

    // Check if username already exists
    if (users.some((user) => user.username === userData.username)) {
      throw new Error("Username already exists")
    }

    const newUser: User = {
      ...userData,
      id: (users.length + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Validate the new user object
    if (!validateUserObject(newUser)) {
      throw new Error("Invalid user data structure")
    }

    users.push(newUser)

    // Write to file with proper formatting and error handling
    try {
      await writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8")
    } catch (writeError) {
      console.error("Error writing to users file:", writeError)
      throw new Error("Failed to save user data")
    }

    console.log(`User created successfully: ${newUser.username}`)
    return newUser
  } catch (error) {
    console.error("Error creating user:", error)
    throw error instanceof Error ? error : new Error("Unknown error occurred while creating user")
  }
}

export async function updateUser(id: string, userData: Partial<User>): Promise<User> {
  try {
    const users = await getUsers()
    const index = users.findIndex((user) => user.id === id)
    
    if (index === -1) {
      throw new Error("User not found")
    }

    // Prevent updating admin user
    if (users[index].username === "admin.admin") {
      throw new Error("Cannot update admin user")
    }

    const updatedUser = {
      ...users[index],
      ...userData,
      updatedAt: new Date().toISOString(),
    }

    users[index] = updatedUser
    await writeFile(USERS_FILE, JSON.stringify(users, null, 2))

    return updatedUser
  } catch (error) {
    console.error("Error updating user:", error)
    throw error instanceof Error ? error : new Error("Unknown error occurred while updating user")
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    const users = await getUsers()
    const user = users.find((u) => u.id === id)

    if (!user) {
      throw new Error("User not found")
    }

    // Prevent deleting admin user
    if (user.username === "admin.admin") {
      throw new Error("Cannot delete admin user")
    }

    const filteredUsers = users.filter((u) => u.id !== id)
    await writeFile(USERS_FILE, JSON.stringify(filteredUsers, null, 2))
  } catch (error) {
    console.error("Error deleting user:", error)
    throw error instanceof Error ? error : new Error("Unknown error occurred while deleting user")
  }
}