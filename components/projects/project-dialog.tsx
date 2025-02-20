"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import HardwareDetails from "./hardware-details"
import BoardSelection from "./board-selection"
import type { ComputerHardware, CalibratorHardware, SSDHardware } from "@/types/hardware"

interface ProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: {
    title: string
    category: string
    deadline: string
    priority: string
    status: "pendente" | "em_andamento" | "concluido"
    notes: string
    hardware?: ComputerHardware | CalibratorHardware | SSDHardware
    boardsData: { boards: [] }
  }) => void
  editMode?: boolean
  initialData?: {
    title: string
    category: string
    deadline: string
    priority: string
    status: "pendente" | "em_andamento" | "concluido"
    notes: string
    hardware?: ComputerHardware | CalibratorHardware | SSDHardware
    boardsData?: { boards: [] }
  }
}

export function ProjectDialog({ open, onOpenChange, onSubmit, editMode, initialData }: ProjectDialogProps) {
  const [activeTab, setActiveTab] = useState("geral")
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    category: initialData?.category || "",
    deadline: initialData?.deadline || new Date().toISOString().split("T")[0],
    priority: initialData?.priority || "",
    status: initialData?.status || ("pendente" as const),
    notes: initialData?.notes || "",
    hardware: initialData?.hardware || {
      type: "montagem",
      selectedComponents: {},
      components: {},
    },
    boardsData: initialData?.boardsData || { boards: [] },
  })

  const [serviceType, setServiceType] = useState<"montagem" | "reparacao">(initialData?.hardware?.type || "montagem")

  const handleHardwareChange = (hardware: ComputerHardware | CalibratorHardware) => {
    setFormData((prev) => ({
      ...prev,
      hardware,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.title && formData.category && formData.deadline && formData.priority) {
      onSubmit(formData)
      setFormData({
        title: "",
        category: "",
        deadline: new Date().toISOString().split("T")[0],
        priority: "",
        status: "pendente",
        notes: "",
        hardware: {
          type: "montagem",
          selectedComponents: {},
          components: {},
        },
        boardsData: { boards: [] },
      })
    }
  }

  const handleCategoryChange = (value: string) => {
    const initialHardware =
      value === "computadores" || value === "calibradores"
        ? {
            type: serviceType,
            hasBoards: false,
            selectedComponents:
              value === "computadores"
                ? {
                    networkCard: false,
                    serialCard: false,
                    processor: false,
                    motherboard: false,
                    ram: false,
                    storage: false,
                    wifiAdapter: false,
                    windows: false,
                    powerSupply: false,
                  }
                : {
                    mioBoard: false,
                    shentekBoard: false,
                    networkCard: false,
                    serialCard: false,
                    processor: false,
                    motherboard: false,
                    ram: false,
                    storage: false,
                    wifiAdapter: false,
                    windows: false,
                    securityKey: false,
                    camera: false,
                    powerSupply: false,
                  },
            components: {},
          }
        : value === "placas"
          ? {
              type: serviceType,
              selectedComponents: {
                ssdBoard: false,
                firmware: false,
                case: false,
              },
              components: {},
            }
          : undefined

    setFormData({
      ...formData,
      category: value,
      hardware: initialHardware,
      boardsData: { boards: [] },
    })
  }

  const showHardwareTabs = formData.category === "computadores" || formData.category === "calibradores"
  const showBoardsTabs =
    formData.category === "placas" || (formData.category === "calibradores" && formData.hardware?.hasBoards)
  const showRepairTab = serviceType === "reparacao"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editMode ? "Editar Projeto" : "Novo Projeto"}</DialogTitle>
          <DialogDescription>Crie um novo projeto técnico preenchendo os campos abaixo</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList
              className="grid w-full"
              style={{
                gridTemplateColumns: `1fr ${showHardwareTabs ? "1fr" : ""} ${showBoardsTabs ? "1fr" : ""} ${
                  showRepairTab ? "1fr" : ""
                }`,
              }}
            >
              <TabsTrigger value="geral">Geral</TabsTrigger>
              {showHardwareTabs && <TabsTrigger value="hardware">Hardware</TabsTrigger>}
              {showBoardsTabs && <TabsTrigger value="placas">Placas</TabsTrigger>}
              {showRepairTab && <TabsTrigger value="reparacao">Detalhes da Reparação</TabsTrigger>}
            </TabsList>

            <TabsContent value="geral" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Projeto</Label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Digite o título do projeto"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={formData.category} onValueChange={handleCategoryChange} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="calibradores">Calibradores</SelectItem>
                      <SelectItem value="computadores">Computadores</SelectItem>
                      <SelectItem value="placas">Placas</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Data Limite</Label>
                  <Input
                    id="deadline"
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Digite observações adicionais"
                />
              </div>

              {(formData.category === "computadores" ||
                formData.category === "calibradores" ||
                formData.category === "placas") && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="mb-4 block">Tipo de Serviço</Label>
                        <RadioGroup
                          value={serviceType}
                          onValueChange={(value: "montagem" | "reparacao") => {
                            setServiceType(value)
                            if (formData.hardware) {
                              setFormData({
                                ...formData,
                                hardware: {
                                  ...formData.hardware,
                                  type: value,
                                  repairDetails:
                                    value === "reparacao"
                                      ? {
                                          problemDescription: "",
                                          replacedParts: [],
                                          addedParts: [],
                                          servicePerformed: "",
                                        }
                                      : undefined,
                                },
                              })
                            }
                          }}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="montagem" id="montagem" />
                            <Label htmlFor="montagem">Montagem</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="reparacao" id="reparacao" />
                            <Label htmlFor="reparacao">Reparação</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {formData.category === "calibradores" && (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="hasBoards"
                            checked={formData.hardware?.hasBoards}
                            onCheckedChange={(checked) => {
                              setFormData({
                                ...formData,
                                hardware: {
                                  ...formData.hardware!,
                                  hasBoards: !!checked,
                                },
                              })
                            }}
                          />
                          <Label htmlFor="hasBoards">Com placas</Label>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {showHardwareTabs && (
              <TabsContent value="hardware" className="space-y-4">
                <HardwareDetails
                  type={formData.category === "computadores" ? "computador" : "calibrador"}
                  value={formData.hardware}
                  onChange={handleHardwareChange}
                />
              </TabsContent>
            )}

            {showBoardsTabs && (
              <TabsContent value="placas" className="space-y-4">
                <BoardSelection
                  value={formData.boardsData.boards}
                  onChange={(boards) =>
                    setFormData({
                      ...formData,
                      boardsData: { boards },
                    })
                  }
                />
              </TabsContent>
            )}

            {showRepairTab && (
              <TabsContent value="reparacao" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Descrição do Problema</Label>
                    <Textarea
                      value={formData.hardware?.repairDetails?.problemDescription || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hardware: {
                            ...formData.hardware!,
                            repairDetails: {
                              ...formData.hardware!.repairDetails!,
                              problemDescription: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder="Descreva o problema apresentado"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Serviço Realizado</Label>
                    <Textarea
                      value={formData.hardware?.repairDetails?.servicePerformed || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hardware: {
                            ...formData.hardware!,
                            repairDetails: {
                              ...formData.hardware!.repairDetails!,
                              servicePerformed: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder="Descreva o serviço realizado"
                    />
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>

          <div className="flex justify-end mt-6">
            <Button type="submit">{editMode ? "Salvar Alterações" : "Criar Projeto"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

