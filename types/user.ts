export type UserRole = "admin" | "chefe" | "tecnico" | "assistente"

export interface Permission {
  createProjects: boolean
  editProjects: boolean
  deleteProjects: boolean
  downloadReports: boolean
  createUsers: boolean
  editUsers: boolean
  deleteUsers: boolean
  createTests: boolean
  editTests: boolean
  deleteTests: boolean
  createStock: boolean
  editStock: boolean
  deleteStock: boolean
}

export interface User {
  id: string
  firstName: string
  lastName: string
  username: string // formato: nome.sobrenome
  password: string // hash da senha
  role: UserRole
  permissions: Permission
  createdAt: string
  updatedAt: string
}

