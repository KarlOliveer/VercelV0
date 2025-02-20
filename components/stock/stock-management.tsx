"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

interface StockItem {
  id: string
  name: string
  quantity: number
  minQuantity: number
  category: string
}

export function StockManagement() {
  const [stockItems, setStockItems] = useState<StockItem[]>([])
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 0,
    minQuantity: 0,
    category: "",
  })

  const addItem = () => {
    if (newItem.name && newItem.quantity >= 0 && newItem.minQuantity >= 0) {
      setStockItems([
        ...stockItems,
        {
          ...newItem,
          id: Date.now().toString(),
        },
      ])
      setNewItem({
        name: "",
        quantity: 0,
        minQuantity: 0,
        category: "",
      })
    }
  }

  const lowStockItems = stockItems.filter((item) => item.quantity <= item.minQuantity)

  return (
    <div className="space-y-4">
      {lowStockItems.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Alerta de Estoque Baixo</AlertTitle>
          <AlertDescription>
            Os seguintes itens estão com estoque baixo:
            {lowStockItems.map((item) => (
              <Badge key={item.id} variant="outline" className="ml-2">
                {item.name}
              </Badge>
            ))}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <Input
          placeholder="Nome do Item"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Quantidade"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: Number.parseInt(e.target.value) })}
        />
        <Input
          type="number"
          placeholder="Quantidade Mínima"
          value={newItem.minQuantity}
          onChange={(e) => setNewItem({ ...newItem, minQuantity: Number.parseInt(e.target.value) })}
        />
        <Button onClick={addItem}>Adicionar Item</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Quantidade Mínima</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stockItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.minQuantity}</TableCell>
              <TableCell>
                <Badge variant={item.quantity <= item.minQuantity ? "destructive" : "secondary"}>
                  {item.quantity <= item.minQuantity ? "Estoque Baixo" : "Em Estoque"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

