"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Delivery {
  id: string
  item: string
  recipient: string
  date: string
  notes: string
}

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [newDelivery, setNewDelivery] = useState({
    item: "",
    recipient: "",
    notes: "",
  })

  const addDelivery = () => {
    if (newDelivery.item && newDelivery.recipient) {
      setDeliveries([
        ...deliveries,
        {
          ...newDelivery,
          id: Date.now().toString(),
          date: new Date().toISOString(),
        },
      ])
      setNewDelivery({
        item: "",
        recipient: "",
        notes: "",
      })
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Histórico de Entregas</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nova Entrega</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              placeholder="Item Entregue"
              value={newDelivery.item}
              onChange={(e) => setNewDelivery({ ...newDelivery, item: e.target.value })}
            />
            <Input
              placeholder="Destinatário"
              value={newDelivery.recipient}
              onChange={(e) => setNewDelivery({ ...newDelivery, recipient: e.target.value })}
            />
            <Input
              placeholder="Observações"
              value={newDelivery.notes}
              onChange={(e) => setNewDelivery({ ...newDelivery, notes: e.target.value })}
            />
          </div>
          <Button onClick={addDelivery}>Registrar Entrega</Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {deliveries.map((delivery) => (
          <Card key={delivery.id}>
            <CardHeader>
              <CardTitle>{delivery.item}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="outline">Entregue em: {new Date(delivery.date).toLocaleDateString()}</Badge>
                <p className="text-sm">
                  <strong>Destinatário:</strong> {delivery.recipient}
                </p>
                {delivery.notes && <p className="text-sm text-muted-foreground">{delivery.notes}</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

