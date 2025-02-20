import type { ComputerHardware, CalibratorHardware, SSDHardware } from "./hardware"
import type { BoardsData } from "./boards"

export interface ProjectFile {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadedAt: string
}

export interface Project {
  id: string
  title: string
  category: string
  deadline: string
  priority: string
  status: "pendente" | "em_andamento" | "concluido"
  notes: string
  hardware?: ComputerHardware | CalibratorHardware | SSDHardware
  files: ProjectFile[]
  createdAt: string
  completedAt?: string
  boardsData?: BoardsData
}

