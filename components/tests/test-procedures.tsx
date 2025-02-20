"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Download } from "lucide-react"

interface TestItem {
  id: string
  description: string
  completed: boolean
  result: "success" | "failure" | null
}

interface TestProcedure {
  id: string
  name: string
  date: string
  items: TestItem[]
}

export function TestProcedures() {
  const [procedures, setProcedures] = useState<TestProcedure[]>([])
  const [newProcedure, setNewProcedure] = useState({
    name: "",
    items: [
      { id: "1", description: "Verificar conexões", completed: false, result: null },
      { id: "2", description: "Testar alimentação", completed: false, result: null },
      { id: "3", description: "Verificar componentes", completed: false, result: null },
    ],
  })

  const addProcedure = () => {
    if (newProcedure.name) {
      setProcedures([
        ...procedures,
        {
          ...newProcedure,
          id: Date.now().toString(),
          date: new Date().toISOString(),
        },
      ])
      setNewProcedure({
        name: "",
        items: [
          { id: "1", description: "Verificar conexões", completed: false, result: null },
          { id: "2", description: "Testar alimentação", completed: false, result: null },
          { id: "3", description: "Verificar componentes", completed: false, result: null },
        ],
      })
    }
  }

  const toggleTestResult = (procedureId: string, itemId: string, result: "success" | "failure") => {
    setProcedures(
      procedures.map((procedure) =>
        procedure.id === procedureId
          ? {
              ...procedure,
              items: procedure.items.map((item) => (item.id === itemId ? { ...item, completed: true, result } : item)),
            }
          : procedure,
      ),
    )
  }

  const generateReport = (procedure: TestProcedure) => {
    const report = `
Relatório de Testes - ${procedure.name}
Data: ${new Date(procedure.date).toLocaleDateString()}

Resultados:
${procedure.items
  .map(
    (item) =>
      `- ${item.description}: ${
        item.result === "success" ? "Sucesso" : item.result === "failure" ? "Falha" : "Não testado"
      }`,
  )
  .join("\n")}
`
    // Na prática, você pode usar uma biblioteca para gerar PDF
    console.log(report)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Nome do Procedimento"
          value={newProcedure.name}
          onChange={(e) => setNewProcedure({ ...newProcedure, name: e.target.value })}
        />
        <Button onClick={addProcedure}>Adicionar Procedimento</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {procedures.map((procedure) => (
          <Card key={procedure.id}>
            <CardHeader>
              <CardTitle>{procedure.name}</CardTitle>
              <CardDescription>{new Date(procedure.date).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {procedure.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={() => toggleTestResult(procedure.id, item.id, "success")}
                      />
                      <span>{item.description}</span>
                    </div>
                    {item.completed && (
                      <Badge variant={item.result === "success" ? "default" : "destructive"}>
                        {item.result === "success" ? "Sucesso" : "Falha"}
                      </Badge>
                    )}
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => generateReport(procedure)}>
                  <Download className="mr-2 h-4 w-4" />
                  Gerar Relatório
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

