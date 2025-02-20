"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { UserPlus, Edit, Trash2, Loader2 } from "lucide-react"
import type { User, UserRole } from "@/types/user"

export default function UsersPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewUserForm, setShowNewUserForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    password: "",
    role: "tecnico" as UserRole,
    permissions: {
      createProjects: false,
      editProjects: false,
      deleteProjects: false,
      downloadReports: false,
      createUsers: false,
      editUsers: false,
      deleteUsers: false,
      createTests: false,
      editTests: false,
      deleteTests: false,
      createStock: false,
      editStock: false,
      deleteStock: false,
    },
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/users")
      if (!response.ok) throw new Error("Erro ao carregar usuários")
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de usuários",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async () => {
    if (newUser.firstName && newUser.lastName && newUser.password) {
      try {
        setFormLoading(true)
        const username = `${newUser.firstName.toLowerCase()}.${newUser.lastName.toLowerCase()}`
        const response = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...newUser,
            username,
          }),
        })

        if (!response.ok) {
          const error = await response.text()
          throw new Error(error)
        }

        const createdUser = await response.json()
        setUsers([...users, createdUser])
        setShowNewUserForm(false)
        setNewUser({
          firstName: "",
          lastName: "",
          password: "",
          role: "tecnico",
          permissions: {
            createProjects: false,
            editProjects: false,
            deleteProjects: false,
            downloadReports: false,
            createUsers: false,
            editUsers: false,
            deleteUsers: false,
            createTests: false,
            editTests: false,
            deleteTests: false,
            createStock: false,
            editStock: false,
            deleteStock: false,
          },
        })

        toast({
          title: "Sucesso",
          description: "Usuário criado com sucesso",
        })
      } catch (error) {
        toast({
          title: "Erro",
          description: error instanceof Error ? error.message : "Não foi possível criar o usuário",
          variant: "destructive",
        })
      } finally {
        setFormLoading(false)
      }
    }
  }

  const handleUpdateUser = async () => {
    if (!editingUser) return

    try {
      setFormLoading(true)
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingUser),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      const updatedUser = await response.json()
      setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
      setEditingUser(null)

      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível atualizar o usuário",
        variant: "destructive",
      })
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      setUsers(users.filter((user) => user.id !== userId))
      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível excluir o usuário",
        variant: "destructive",
      })
    }
  }

  const renderUserForm = (user: typeof newUser, setUser: any, onSubmit: () => void, isEditing = false) => (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Usuário" : "Novo Usuário"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input
              value={user.firstName}
              onChange={(e) => setUser({ ...user, firstName: e.target.value })}
              placeholder="Nome"
              disabled={formLoading}
            />
          </div>
          <div className="space-y-2">
            <Label>Sobrenome</Label>
            <Input
              value={user.lastName}
              onChange={(e) => setUser({ ...user, lastName: e.target.value })}
              placeholder="Sobrenome"
              disabled={formLoading}
            />
          </div>
        </div>

        {!isEditing && (
          <div className="space-y-2">
            <Label>Senha</Label>
            <Input
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Senha"
              disabled={formLoading}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>Cargo</Label>
          <Select
            value={user.role}
            onValueChange={(value: UserRole) => setUser({ ...user, role: value })}
            disabled={formLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o cargo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Administrador</SelectItem>
              <SelectItem value="chefe">Chefe</SelectItem>
              <SelectItem value="tecnico">Técnico</SelectItem>
              <SelectItem value="assistente">Assistente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>Permissões</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={user.permissions.createProjects}
                  onCheckedChange={(checked) =>
                    setUser({
                      ...user,
                      permissions: { ...user.permissions, createProjects: checked },
                    })
                  }
                  disabled={formLoading}
                />
                <Label>Criar Projetos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={user.permissions.editProjects}
                  onCheckedChange={(checked) =>
                    setUser({
                      ...user,
                      permissions: { ...user.permissions, editProjects: checked },
                    })
                  }
                  disabled={formLoading}
                />
                <Label>Editar Projetos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={user.permissions.deleteProjects}
                  onCheckedChange={(checked) =>
                    setUser({
                      ...user,
                      permissions: { ...user.permissions, deleteProjects: checked },
                    })
                  }
                  disabled={formLoading}
                />
                <Label>Excluir Projetos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={user.permissions.downloadReports}
                  onCheckedChange={(checked) =>
                    setUser({
                      ...user,
                      permissions: { ...user.permissions, downloadReports: checked },
                    })
                  }
                  disabled={formLoading}
                />
                <Label>Baixar Relatórios</Label>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={user.permissions.createTests}
                  onCheckedChange={(checked) =>
                    setUser({
                      ...user,
                      permissions: { ...user.permissions, createTests: checked },
                    })
                  }
                  disabled={formLoading}
                />
                <Label>Criar Testes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={user.permissions.createStock}
                  onCheckedChange={(checked) =>
                    setUser({
                      ...user,
                      permissions: { ...user.permissions, createStock: checked },
                    })
                  }
                  disabled={formLoading}
                />
                <Label>Gerenciar Estoque</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={user.permissions.createUsers}
                  onCheckedChange={(checked) =>
                    setUser({
                      ...user,
                      permissions: { ...user.permissions, createUsers: checked },
                    })
                  }
                  disabled={formLoading}
                />
                <Label>Criar Usuários</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={user.permissions.editUsers}
                  onCheckedChange={(checked) =>
                    setUser({
                      ...user,
                      permissions: { ...user.permissions, editUsers: checked },
                    })
                  }
                  disabled={formLoading}
                />
                <Label>Editar Usuários</Label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              if (isEditing) {
                setEditingUser(null)
              } else {
                setShowNewUserForm(false)
              }
            }}
            disabled={formLoading}
          >
            Cancelar
          </Button>
          <Button onClick={onSubmit} disabled={formLoading}>
            {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Salvar" : "Criar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Usuários</h2>
        <Button onClick={() => setShowNewUserForm(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      {showNewUserForm && renderUserForm(newUser, setNewUser, handleCreateUser)}
      {editingUser && renderUserForm(editingUser, setEditingUser, handleUpdateUser, true)}

      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <Card key={user.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">{user.username}</p>
                  </div>
                  <Badge>{user.role}</Badge>
                </div>

                <div className="space-y-4">
                  <div className="text-sm">
                    <p className="text-muted-foreground">Criado em: {new Date(user.createdAt).toLocaleDateString()}</p>
                    <p className="text-muted-foreground">
                      Última atualização: {new Date(user.updatedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" onClick={() => setEditingUser(user)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={user.username === "admin.admin"} // Prevent deleting admin user
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

