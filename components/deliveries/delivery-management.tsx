"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Package } from "lucide-react"

interface Delivery {
  id: string
  item: string
  recipient: string
  date: string
  notes: string
}

export function DeliveryManagement() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [newDelivery, setNewDelivery] = useState({
    item: "",
    recipient: "",
    notes: "",
  })

  const addDelivery = () => {
    if (newDelivery.item && newDelivery.recipient) {
      setDeliveries([
        {
          ...newDelivery,
          id: Date.now().toString(),
          date: new Date().toISOString(),
        },
        ...deliveries,
      ])
      setNewDelivery({
        item: "",
        recipient: "",
        notes: "",
      })
    }
  }

  return (
    <div className="space-y-4">
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
          <Button onClick={addDelivery} className="w-full">
            Registrar Entrega
          </Button>
        </CardContent>
      </Card>

      <ScrollArea className="h-[calc(100vh-400px)]">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {deliveries.map((delivery) => (
            <Card key={delivery.id} className="relative overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  <span className="truncate">{delivery.item}</span>
                </CardTitle>
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
      </ScrollArea>
    </div>
  )
}

