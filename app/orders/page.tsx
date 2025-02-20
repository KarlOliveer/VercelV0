"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface Order {
  id: string
  requester: string
  description: string
  date: string
  status: "pending" | "completed"
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [newOrder, setNewOrder] = useState({
    requester: "",
    description: "",
  })

  const addOrder = () => {
    if (newOrder.requester && newOrder.description) {
      setOrders([
        ...orders,
        {
          ...newOrder,
          id: Date.now().toString(),
          date: new Date().toISOString(),
          status: "pending",
        },
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
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Pedidos e Solicitações</h2>
      </div>

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
          <Button onClick={addOrder}>Adicionar Pedido</Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {order.requester}
                <Badge
                  variant={order.status === "completed" ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => toggleOrderStatus(order.id)}
                >
                  {order.status === "completed" ? "Concluído" : "Pendente"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
              <p className="mt-2">{order.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

