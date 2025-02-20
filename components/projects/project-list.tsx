"use client"

import { useState } from "react"
import {
  Plus,
  Search,
  Folder,
  FolderOpen,
  Upload,
  File,
  FileText,
  ImageIcon,
  Paperclip,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Edit,
  Check,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { ProjectDialog } from "./project-dialog"
import { FileUploadDialog } from "./file-upload-dialog"
import { ProjectReport } from "./project-report"

interface ProjectFile {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadedAt: string
}

interface Project {
  id: string
  title: string
  category: string
  deadline: string
  priority: string
  status: "pendente" | "em_andamento" | "concluido"
  notes: string
  files: ProjectFile[]
  createdAt: string
  completedAt?: string
}

const categories = [
  { id: "todos", name: "Todos", icon: Folder },
  { id: "calibradores", name: "Calibradores", icon: Folder },
  { id: "computadores", name: "Computadores", icon: Folder },
  { id: "placas", name: "Placas", icon: Folder },
  { id: "outros", name: "Outros", icon: Folder },
]

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedCategory, setSelectedCategory] = useState("todos")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [selectedProjectForEdit, setSelectedProjectForEdit] = useState<Project | null>(null)
  const [selectedProjectForReport, setSelectedProjectForReport] = useState<Project | null>(null)

  // Move isOverdue function before it's used
  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date()
  }

  const sortProjects = (projects: Project[]) => {
    return [...projects].sort((a, b) => {
      // Primeiro critério: projetos atrasados primeiro
      const aIsOverdue = isOverdue(a.deadline) && a.status !== "concluido"
      const bIsOverdue = isOverdue(b.deadline) && b.status !== "concluido"
      if (aIsOverdue && !bIsOverdue) return -1
      if (!aIsOverdue && bIsOverdue) return 1

      // Segundo critério: prioridade
      const priorityOrder = { alta: 0, media: 1, baixa: 2 }
      const priorityDiff =
        priorityOrder[a.priority as keyof typeof priorityOrder] -
        priorityOrder[b.priority as keyof typeof priorityOrder]
      if (priorityDiff !== 0) return priorityDiff

      // Terceiro critério: data de entrega mais próxima
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    })
  }

  const filteredProjects = sortProjects(
    projects.filter((project) => {
      const matchesCategory = selectedCategory === "todos" || project.category === selectedCategory
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    }),
  )

  const projectsByStatus = {
    em_andamento: filteredProjects.filter((p) => p.status !== "concluido"),
    concluido: filteredProjects.filter((p) => p.status === "concluido"),
  }

  const getStatusStyles = (project: Project) => {
    if (project.status === "concluido") {
      return {
        cardClass: "bg-muted border-l-4 border-l-green-500",
        textClass: "text-green-600 dark:text-green-400",
        icon: <CheckCircle2 className="h-4 w-4" />,
        label: "Concluído",
      }
    }

    if (isOverdue(project.deadline)) {
      return {
        cardClass: "border-l-4 border-l-destructive bg-destructive/5",
        textClass: "text-destructive",
        icon: <AlertTriangle className="h-4 w-4" />,
        label: "Atrasado",
      }
    }

    return {
      cardClass: "border-l-4 border-l-yellow-500 bg-yellow-500/5",
      textClass: "text-yellow-600 dark:text-yellow-400",
      icon: <Clock className="h-4 w-4" />,
      label: "Em Andamento",
    }
  }

  const getStatusIcon = (status: Project["status"]) => {
    switch (status) {
      case "pendente":
        return <Clock className="h-4 w-4" />
      case "em_andamento":
        return <AlertTriangle className="h-4 w-4" />
      case "concluido":
        return <CheckCircle2 className="h-4 w-4" />
    }
  }

  const toggleProjectStatus = (projectId: string) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          const newStatus = project.status === "concluido" ? "pendente" : "concluido"
          return {
            ...project,
            status: newStatus,
            completedAt: newStatus === "concluido" ? new Date().toISOString() : undefined,
          }
        }
        return project
      }),
    )
  }

  const handleNewProject = (projectData: Omit<Project, "id" | "files" | "createdAt" | "completedAt">) => {
    setProjects([
      {
        ...projectData,
        id: Date.now().toString(),
        files: [],
        createdAt: new Date().toISOString(),
      },
      ...projects,
    ])
    setIsNewProjectOpen(false)
  }

  const handleFileUpload = (projectId: string, files: FileList) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          const newFiles: ProjectFile[] = Array.from(files).map((file) => ({
            id: Date.now().toString(),
            name: file.name,
            type: file.type,
            size: file.size,
            url: URL.createObjectURL(file),
            uploadedAt: new Date().toISOString(),
          }))
          return {
            ...project,
            files: [...project.files, ...newFiles],
          }
        }
        return project
      }),
    )
    setIsUploadOpen(false)
  }

  return (
    <div className="flex h-[calc(100vh-100px)]">
      {/* Sidebar */}
      <div className="w-64 border-r p-4 space-y-2">
        {categories.map((category) => {
          const count = projects.filter((p) => (category.id === "todos" ? true : p.category === category.id)).length

          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "flex items-center w-full gap-2 p-2 rounded-lg text-sm transition-colors",
                selectedCategory === category.id ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              {selectedCategory === category.id ? (
                <FolderOpen className="h-4 w-4" />
              ) : (
                <category.icon className="h-4 w-4" />
              )}
              <span>{category.name}</span>
              <Badge variant="secondary" className="ml-auto">
                {count}
              </Badge>
            </button>
          )
        })}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar projetos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button onClick={() => setIsNewProjectOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Projeto
          </Button>
        </div>

        <Tabs defaultValue="em_andamento" className="space-y-4">
          <TabsList>
            <TabsTrigger value="em_andamento">Em Andamento</TabsTrigger>
            <TabsTrigger value="concluido">Concluídos</TabsTrigger>
          </TabsList>

          {["em_andamento", "concluido"].map((status) => (
            <TabsContent key={status} value={status}>
              {projectsByStatus[status as keyof typeof projectsByStatus].length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Folder className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Nenhum projeto {status === "em_andamento" ? "em andamento" : "concluído"} encontrado
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <ScrollArea className="h-[calc(100vh-250px)]">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {projectsByStatus[status as keyof typeof projectsByStatus].map((project) => {
                      const statusStyles = getStatusStyles(project)

                      return (
                        <Card
                          key={project.id}
                          className={cn("relative transition-all duration-200", statusStyles.cardClass)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div className="space-y-1">
                                <h3 className="font-semibold flex items-center gap-2">
                                  {project.title}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => toggleProjectStatus(project.id)}
                                  >
                                    {project.status === "concluido" ? (
                                      <Check className="h-4 w-4 text-primary" />
                                    ) : (
                                      <div className="h-4 w-4 rounded-sm border-2" />
                                    )}
                                  </Button>
                                </h3>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant={
                                      project.priority === "alta"
                                        ? "destructive"
                                        : project.priority === "media"
                                          ? "default"
                                          : "secondary"
                                    }
                                  >
                                    {project.priority}
                                  </Badge>
                                  <Badge variant="outline" className={cn("gap-1", statusStyles.textClass)}>
                                    {statusStyles.icon}
                                    {statusStyles.label}
                                  </Badge>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedProject(project)
                                  setIsUploadOpen(true)
                                }}
                              >
                                <Upload className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span
                                  className={cn(
                                    "text-sm",
                                    isOverdue(project.deadline) && project.status !== "concluido"
                                      ? "text-destructive font-medium"
                                      : "text-muted-foreground",
                                  )}
                                >
                                  Prazo: {new Date(project.deadline).toLocaleDateString()}
                                </span>
                              </div>

                              {project.notes && <p className="text-sm text-muted-foreground">{project.notes}</p>}

                              <div className="flex items-center gap-2 mt-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                  onClick={() => setSelectedProjectForEdit(project)}
                                  disabled={project.status === "concluido"}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                  onClick={() => setSelectedProjectForReport(project)}
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  Relatório
                                </Button>
                              </div>

                              {project.files.length > 0 ? (
                                <div className="space-y-2">
                                  {project.files.map((file) => {
                                    const FileIcon = file.type.startsWith("image/")
                                      ? ImageIcon
                                      : file.type.includes("pdf")
                                        ? FileText
                                        : File
                                    return (
                                      <a
                                        key={file.id}
                                        href={file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"
                                      >
                                        <FileIcon className="h-4 w-4" />
                                        <span className="text-sm truncate">{file.name}</span>
                                        <span className="text-xs text-muted-foreground ml-auto">
                                          {(file.size / 1024).toFixed(1)}KB
                                        </span>
                                      </a>
                                    )
                                  })}
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center py-4 text-muted-foreground">
                                  <Paperclip className="h-8 w-8 mb-2" />
                                  <p className="text-sm">Nenhum arquivo anexado</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <ProjectDialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen} onSubmit={handleNewProject} />

      {selectedProject && (
        <FileUploadDialog
          open={isUploadOpen}
          onOpenChange={setIsUploadOpen}
          onUpload={(files) => handleFileUpload(selectedProject.id, files)}
        />
      )}

      {selectedProjectForEdit && (
        <ProjectDialog
          open={!!selectedProjectForEdit}
          onOpenChange={(open) => !open && setSelectedProjectForEdit(null)}
          onSubmit={(data) => {
            setProjects(
              projects.map((p) =>
                p.id === selectedProjectForEdit.id
                  ? {
                      ...p,
                      ...data,
                    }
                  : p,
              ),
            )
            setSelectedProjectForEdit(null)
          }}
          editMode
          initialData={selectedProjectForEdit}
        />
      )}

      {selectedProjectForReport && (
        <ProjectReport
          open={!!selectedProjectForReport}
          onOpenChange={(open) => !open && setSelectedProjectForReport(null)}
          project={selectedProjectForReport}
        />
      )}
    </div>
  )
}

