"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Package, PenToolIcon as Tool, Cpu, ClipboardList } from "lucide-react"
import type { Project } from "@/types/project"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { useToast } from "@/components/ui/use-toast"

interface ProjectReportProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project
}

export function ProjectReport({ open, onOpenChange, project }: ProjectReportProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)
  const [currentTab, setCurrentTab] = useState("geral")

  const generateReport = async () => {
    // Check if project is completed
    if (project.status !== "concluido") {
      toast({
        title: "Erro ao gerar relatório",
        description: "O relatório só pode ser gerado quando o projeto estiver concluído.",
        variant: "destructive",
      })
      return
    }

    if (!reportRef.current) return
    setLoading(true)

    try {
      // Create PDF instance with proper configuration
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      })

      // Get all available sections
      const sections = ["geral"]
      if (project.hardware) sections.push("hardware")
      if (project.boardsData?.boards.length) sections.push("placas")
      if (project.hardware?.repairDetails) sections.push("reparacao")

      // Make all sections visible temporarily
      const originalDisplays = new Map()
      sections.forEach((section) => {
        const element = document.getElementById(`report-section-${section}`)
        if (element) {
          originalDisplays.set(section, element.style.display)
          element.style.display = "block"
        }
      })

      // Wait for content to render
      await new Promise((resolve) => setTimeout(resolve, 500))

      let currentPage = 1
      const margin = 20
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      // Function to add header
      const addHeader = (title: string) => {
        pdf.setFontSize(16)
        pdf.setTextColor(0)
        pdf.text(title, margin, margin)
      }

      // Process each section
      for (const section of sections) {
        const element = document.getElementById(`report-section-${section}`)
        if (!element) continue

        try {
          // Add new page for each section (except first)
          if (currentPage > 1) {
            pdf.addPage()
          }

          // Capture section content
          const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
            windowWidth: element.scrollWidth,
            height: element.scrollHeight,
          })

          // Calculate dimensions
          const imgWidth = pageWidth - 2 * margin
          const imgHeight = (canvas.height * imgWidth) / canvas.width
          const imgData = canvas.toDataURL("image/jpeg", 1.0)

          // Add image to PDF
          pdf.addImage(imgData, "JPEG", margin, margin, imgWidth, imgHeight)

          currentPage++
        } catch (err) {
          console.error(`Error capturing section ${section}:`, err)
        }
      }

      // Add signature page
      pdf.addPage()
      pdf.setFontSize(14)
      pdf.text("Termo de Responsabilidade Técnica", pageWidth / 2, 30, { align: "center" })

      pdf.setFontSize(12)
      const text =
        "Declaro que os serviços descritos neste relatório foram executados de acordo com as normas técnicas aplicáveis e que o equipamento encontra-se em condições adequadas de funcionamento."
      const textLines = pdf.splitTextToSize(text, pageWidth - 2 * margin)
      pdf.text(textLines, margin, 50)

      // Add signature line
      pdf.line(margin, 100, pageWidth - margin, 100)
      pdf.setFontSize(10)
      pdf.text("Técnico Responsável", margin, 110)
      pdf.text("Data: ____/____/________", pageWidth - 70, 110)

      // Add footer to all pages
      const totalPages = pdf.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i)
        pdf.setFontSize(8)
        pdf.setTextColor(128)
        pdf.text(`MCM Systems - Relatório Técnico - Página ${i} de ${totalPages}`, pageWidth / 2, pageHeight - 10, {
          align: "center",
        })
      }

      // Save PDF
      pdf.save(`relatorio-${project.id}.pdf`)

      // Restore original display states
      sections.forEach((section) => {
        const element = document.getElementById(`report-section-${section}`)
        if (element) {
          const originalDisplay = originalDisplays.get(section)
          element.style.display = originalDisplay || "none"
        }
      })
    } catch (error) {
      console.error("Erro ao gerar PDF:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string) => {
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
  }

  const renderGeneralInfo = () => (
    <div className="space-y-8">
      {/* Cabeçalho do Relatório */}
      <div className="text-center space-y-4 pb-8 border-b">
        <h1 className="text-2xl font-bold">Relatório Técnico</h1>
        <p className="text-muted-foreground">MCM Systems - Soluções em Tecnologia</p>
        <p className="text-sm">Documento gerado em {formatDate(new Date().toISOString())}</p>
      </div>

      {/* Informações do Projeto */}
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Código do Projeto</h3>
            <p>{project.id}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Status</h3>
            <p className="capitalize">
              {project.status === "pendente"
                ? "Pendente"
                : project.status === "em_andamento"
                  ? "Em Andamento"
                  : "Concluído"}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Data de Criação</h3>
            <p>{formatDate(project.createdAt)}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Prazo de Entrega</h3>
            <p>{formatDate(project.deadline)}</p>
          </div>
          {project.completedAt && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Data de Conclusão</h3>
              <p>{formatDate(project.completedAt)}</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-muted-foreground">Título do Projeto</h3>
          <p className="text-lg font-medium">{project.title}</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-muted-foreground">Categoria</h3>
          <p className="capitalize">{project.category}</p>
        </div>

        {project.notes && (
          <div className="space-y-2">
            <h3 className="font-semibold text-base">Observações</h3>
            <p className="text-base leading-relaxed text-foreground p-4 bg-muted/50 rounded-lg">{project.notes}</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderHardwareInfo = () => {
    if (!project.hardware) return null

    return (
      <div className="space-y-8">
        {/* Cabeçalho da Seção de Hardware */}
        <div className="text-center space-y-4 pb-8 border-b">
          <h2 className="text-2xl font-bold">Especificações Técnicas de Hardware</h2>
          <p className="text-muted-foreground">
            {project.hardware.type === "montagem" ? "Relatório de Montagem" : "Relatório de Reparação"}
          </p>
        </div>

        <div className="space-y-6">
          {/* Componentes Básicos */}
          {(project.hardware.components.processor ||
            project.hardware.components.motherboard ||
            project.hardware.components.ram ||
            project.hardware.components.storage) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Componentes Básicos</h3>
              <div className="grid grid-cols-2 gap-4">
                {project.hardware.components.processor && (
                  <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium">Processador</h4>
                    <p className="text-sm text-muted-foreground">
                      Modelo: {project.hardware.components.processor.model}
                    </p>
                  </div>
                )}

                {project.hardware.components.motherboard && (
                  <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium">Placa Mãe</h4>
                    <p className="text-sm text-muted-foreground">
                      Modelo: {project.hardware.components.motherboard.model}
                    </p>
                  </div>
                )}

                {project.hardware.components.ram && (
                  <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium">Memória RAM</h4>
                    <p className="text-sm text-muted-foreground">
                      Modelo: {project.hardware.components.ram.model}
                      <br />
                      Quantidade: {project.hardware.components.ram.quantity} unidade(s)
                    </p>
                  </div>
                )}

                {project.hardware.components.storage && (
                  <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium">Armazenamento</h4>
                    <p className="text-sm text-muted-foreground">
                      Modelo: {project.hardware.components.storage.model}
                      <br />
                      Quantidade: {project.hardware.components.storage.quantity} unidade(s)
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Componentes de Rede */}
          {(project.hardware.components.networkCard ||
            project.hardware.components.serialCard ||
            project.hardware.components.wifiAdapter ||
            project.hardware.components.switch) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Componentes de Rede</h3>
              <div className="grid grid-cols-2 gap-4">
                {project.hardware.components.networkCard && (
                  <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium">Placa de Rede</h4>
                    <p className="text-sm text-muted-foreground">
                      Portas: {project.hardware.components.networkCard.ports}
                      <br />
                      Quantidade: {project.hardware.components.networkCard.quantity}
                    </p>
                  </div>
                )}

                {project.hardware.components.serialCard && (
                  <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium">Placa Serial</h4>
                    <p className="text-sm text-muted-foreground">
                      Portas: {project.hardware.components.serialCard.ports}
                      <br />
                      Quantidade: {project.hardware.components.serialCard.quantity}
                    </p>
                  </div>
                )}

                {project.hardware.components.wifiAdapter && (
                  <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium">Adaptador Wi-Fi</h4>
                    <p className="text-sm text-muted-foreground">Instalado</p>
                  </div>
                )}

                {project.hardware.components.switch && (
                  <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium">Switch de Rede</h4>
                    <p className="text-sm text-muted-foreground">Instalado</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Componentes Específicos do Calibrador */}
          {"mioBoard" in project.hardware.components && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Componentes do Calibrador</h3>
              <div className="grid grid-cols-2 gap-4">
                {project.hardware.components.mioBoard && (
                  <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium">Placa MIO</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {project.hardware.components.mioBoard.hasConditioner && <p>Com cabo e condicionamento</p>}
                      {!project.hardware.components.mioBoard.hasConditioner && <p>Sem cabo e condicionamento</p>}
                    </div>
                  </div>
                )}

                {project.hardware.components.shentekBoard && (
                  <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium">Placa Shentek</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>{project.hardware.components.shentekBoard.type === "2P" ? "2 portas" : "4 portas"}</p>
                      {project.hardware.components.shentekBoard.hasConditioner && <p>Com cabo e condicionamento</p>}
                      {!project.hardware.components.shentekBoard.hasConditioner && <p>Sem cabo e condicionamento</p>}
                    </div>
                  </div>
                )}

                {project.hardware.components.camera && (
                  <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium">Câmera</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Tipo: {project.hardware.components.camera.type}</p>
                      <p>Quantidade: {project.hardware.components.camera.quantity}</p>
                      {project.hardware.components.camera.hasLens && (
                        <>
                          <p>Tipo de Lente: {project.hardware.components.camera.lensType}</p>
                          <p>Quantidade de Lentes: {project.hardware.components.camera.lensQuantity}</p>
                        </>
                      )}
                      {project.hardware.components.camera.hasCable && (
                        <>
                          <p>Tipo de Cabo: {project.hardware.components.camera.cableType}</p>
                          <p>Quantidade de Cabos: {project.hardware.components.camera.cableQuantity}</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Componentes Adicionais */}
          {project.hardware.additionalComponents && project.hardware.additionalComponents.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Componentes Adicionais</h3>
              <div className="grid grid-cols-2 gap-4">
                {project.hardware.additionalComponents.map((component, index) => (
                  <div key={index} className="space-y-2 p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium">{component.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Modelo: {component.model}
                      <br />
                      Quantidade: {component.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderBoardsInfo = () => {
    if (!project.boardsData?.boards.length) return null

    return (
      <div className="space-y-8">
        {/* Cabeçalho da Seção de Placas */}
        <div className="text-center space-y-4 pb-8 border-b">
          <h2 className="text-2xl font-bold">Especificações das Placas</h2>
          <p className="text-muted-foreground">Detalhamento das placas utilizadas no projeto</p>
        </div>

        <div className="space-y-6">
          {project.boardsData.boards.map((board, index) => (
            <div key={index} className="p-6 rounded-lg bg-muted/50">
              <h3 className="text-lg font-semibold mb-4">{board.type}</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Quantidade</h4>
                    <p>{board.quantity} unidade(s)</p>
                  </div>
                  {board.codes && board.codes.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Códigos</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {board.codes.map((code, idx) => (
                          <li key={idx} className="text-sm">
                            {code || "Não especificado"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderRepairInfo = () => {
    if (!project.hardware?.repairDetails) return null

    return (
      <div className="space-y-8">
        {/* Cabeçalho da Seção de Reparação */}
        <div className="text-center space-y-4 pb-8 border-b">
          <h2 className="text-2xl font-bold">Detalhes da Reparação</h2>
          <p className="text-muted-foreground">Informações sobre o serviço de reparação realizado</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Descrição do Problema</h3>
            <p className="whitespace-pre-wrap p-4 rounded-lg bg-muted/50">
              {project.hardware.repairDetails.problemDescription}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Serviço Realizado</h3>
            <p className="whitespace-pre-wrap p-4 rounded-lg bg-muted/50">
              {project.hardware.repairDetails.servicePerformed}
            </p>
          </div>

          {project.hardware.repairDetails.replacedParts.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Peças Substituídas</h3>
              <div className="grid grid-cols-2 gap-4">
                {project.hardware.repairDetails.replacedParts.map((part, index) => (
                  <div key={index} className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium">{part.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Modelo: {part.model}
                      <br />
                      Quantidade: {part.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {project.hardware.repairDetails.addedParts.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Peças Adicionadas</h3>
              <div className="grid grid-cols-2 gap-4">
                {project.hardware.repairDetails.addedParts.map((part, index) => (
                  <div key={index} className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium">{part.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Modelo: {part.model}
                      <br />
                      Quantidade: {part.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl max-h-[90vh]"
        description="Visualize e exporte o relatório técnico do projeto"
      >
        <div className="flex justify-end mb-4">
          <Button onClick={generateReport} disabled={loading || project.status !== "concluido"}>
            <Download className="mr-2 h-4 w-4" />
            {loading ? "Gerando PDF..." : "Exportar PDF"}
          </Button>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="geral" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Geral
            </TabsTrigger>
            {project.hardware && (
              <TabsTrigger value="hardware" className="flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                Hardware
              </TabsTrigger>
            )}
            {project.boardsData?.boards.length > 0 && (
              <TabsTrigger value="placas" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Placas
              </TabsTrigger>
            )}
            {project.hardware?.repairDetails && (
              <TabsTrigger value="reparacao" className="flex items-center gap-2">
                <Tool className="h-4 w-4" />
                Reparação
              </TabsTrigger>
            )}
          </TabsList>

          <ScrollArea className="h-[calc(90vh-180px)]">
            <div className="p-6" ref={reportRef}>
              <div
                id="report-section-geral"
                className="mt-0"
                style={{ display: currentTab === "geral" ? "block" : "none" }}
              >
                {renderGeneralInfo()}
              </div>

              <div
                id="report-section-hardware"
                className="mt-0"
                style={{ display: currentTab === "hardware" ? "block" : "none" }}
              >
                {renderHardwareInfo()}
              </div>

              <div
                id="report-section-placas"
                className="mt-0"
                style={{ display: currentTab === "placas" ? "block" : "none" }}
              >
                {renderBoardsInfo()}
              </div>

              <div
                id="report-section-reparacao"
                className="mt-0"
                style={{ display: currentTab === "reparacao" ? "block" : "none" }}
              >
                {renderRepairInfo()}
              </div>
            </div>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

