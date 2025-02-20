"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface ShippingItem {
  id: string
  name: string
  destination: string
  date: string
  checklist: {
    packaging: boolean
    testing: boolean
    documents: boolean
  }
}

export default function ShippingPage() {
  const [shippingItems, setShippingItems] = useState<ShippingItem[]>([])
  const [newShipping, setNewShipping] = useState({
    name: "",
    destination: "",
    checklist: {
      packaging: false,
      testing: false,
      documents: false,
    },
  })

  const addShippingItem = () => {
    if (newShipping.name && newShipping.destination) {
      setShippingItems([
        ...shippingItems,
        {
          ...newShipping,
          id: Date.now().toString(),
          date: new Date().toISOString(),
        },
      ])
      setNewShipping({
        name: "",
        destination: "",
        checklist: {
          packaging: false,
          testing: false,
          documents: false,
        },
      })
    }
  }

  const updateChecklist = (itemId: string, field: keyof ShippingItem["checklist"]) => {
    setShippingItems(
      shippingItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              checklist: {
                ...item.checklist,
                [field]: !item.checklist[field],
              },
            }
          : item,
      ),
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Checklist de Envios</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Novo Envio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              placeholder="Item para Envio"
              value={newShipping.name}
              onChange={(e) => setNewShipping({ ...newShipping, name: e.target.value })}
            />
            <Input
              placeholder="Destino"
              value={newShipping.destination}
              onChange={(e) => setNewShipping({ ...newShipping, destination: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={newShipping.checklist.packaging}
                onCheckedChange={() =>
                  setNewShipping({
                    ...newShipping,
                    checklist: {
                      ...newShipping.checklist,
                      packaging: !newShipping.checklist.packaging,
                    },
                  })
                }
              />
              <label>Embalagem Adequada</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={newShipping.checklist.testing}
                onCheckedChange={() =>
                  setNewShipping({
                    ...newShipping,
                    checklist: {
                      ...newShipping.checklist,
                      testing: !newShipping.checklist.testing,
                    },
                  })
                }
              />
              <label>Testes Realizados</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={newShipping.checklist.documents}
                onCheckedChange={() =>
                  setNewShipping({
                    ...newShipping,
                    checklist: {
                      ...newShipping.checklist,
                      documents: !newShipping.checklist.documents,
                    },
                  })
                }
              />
              <label>Documentação Completa</label>
            </div>
          </div>
          <Button onClick={addShippingItem}>Adicionar Envio</Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {shippingItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="outline">Data: {new Date(item.date).toLocaleDateString()}</Badge>
                <p className="text-sm">
                  <strong>Destino:</strong> {item.destination}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={item.checklist.packaging}
                      onCheckedChange={() => updateChecklist(item.id, "packaging")}
                    />
                    <label>Embalagem Adequada</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={item.checklist.testing}
                      onCheckedChange={() => updateChecklist(item.id, "testing")}
                    />
                    <label>Testes Realizados</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={item.checklist.documents}
                      onCheckedChange={() => updateChecklist(item.id, "documents")}
                    />
                    <label>Documentação Completa</label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

