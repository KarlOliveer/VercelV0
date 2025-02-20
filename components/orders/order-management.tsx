"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle2, Clock } from "lucide-react"

interface Order {
  id: string
  requester: string
  description: string
  date: string
  status: "pending" | "completed"
}

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [newOrder, setNewOrder] = useState({
    requester: "",
    description: "",
  })

  const addOrder = () => {
    if (newOrder.requester && newOrder.description) {
      setOrders([
        {
          ...newOrder,
          id: Date.now().toString(),
          date: new Date().toISOString(),
          status: "pending",
        },
        ...orders,
      ])
      setNewOrder({
        requester: "",
        description: "",
      })
    }
  }

  const toggleOrderStatus = (orderId: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: order.status === "pending" ? "completed" : "pending",
            }
          : order,
      ),
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Novo Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              placeholder="Nome do Solicitante"
              value={newOrder.requester}
              onChange={(e) => setNewOrder({ ...newOrder, requester: e.target.value })}
            />
            <Textarea
              placeholder="Descrição do Pedido"
              value={newOrder.description}
              onChange={(e) => setNewOrder({ ...newOrder, description: e.target.value })}
            />
          </div>
          <Button onClick={addOrder} className="w-full">
            Adicionar Pedido
          </Button>
        </CardContent>
      </Card>

      <ScrollArea className="h-[calc(100vh-400px)]">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <Card key={order.id} className="relative overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{order.requester}</span>
                  <Badge
                    variant={order.status === "completed" ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => toggleOrderStatus(order.id)}
                  >
                    <span className="flex items-center gap-2">
                      {order.status === "completed" ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                      {order.status === "completed" ? "Concluído" : "Pendente"}
                    </span>
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{new Date(order.date).toLocaleDateString()}</p>
                <p className="text-sm">{order.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

