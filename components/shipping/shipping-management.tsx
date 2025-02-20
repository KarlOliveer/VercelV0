"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Package, CheckSquare } from "lucide-react"

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

export function ShippingManagement() {
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
        {
          ...newShipping,
          id: Date.now().toString(),
          date: new Date().toISOString(),
        },
        ...shippingItems,
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

  const isReadyToShip = (checklist: ShippingItem["checklist"]) => {
    return Object.values(checklist).every(Boolean)
  }

  return (
    <div className="space-y-4">
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
          <Button onClick={addShippingItem} className="w-full">
            Adicionar Envio
          </Button>
        </CardContent>
      </Card>

      <ScrollArea className="h-[calc(100vh-400px)]">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {shippingItems.map((item) => (
            <Card key={item.id} className="relative overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    <span className="truncate">{item.name}</span>
                  </span>
                  {isReadyToShip(item.checklist) && (
                    <Badge variant="default" className="ml-2">
                      <CheckSquare className="h-4 w-4 mr-1" />
                      Pronto
                    </Badge>
                  )}
                </CardTitle>
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
      </ScrollArea>
    </div>
  )
}

