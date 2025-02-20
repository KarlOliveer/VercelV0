"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Gerencie suas preferências de notificação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Switch id="notifications" />
              <Label htmlFor="notifications">Alertas de Estoque Baixo</Label>
            </div>
            <div className="flex items-center space-x-4">
              <Switch id="email-notifications" />
              <Label htmlFor="email-notifications">Notificações por Email</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exportação de Dados</CardTitle>
            <CardDescription>Exporte seus dados do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">
              Exportar Relatórios
            </Button>
            <Button variant="outline" className="w-full">
              Exportar Histórico
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aparência</CardTitle>
            <CardDescription>Personalize a aparência do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Switch id="dark-mode" />
              <Label htmlFor="dark-mode">Modo Escuro</Label>
            </div>
            <div className="flex items-center space-x-4">
              <Switch id="compact-mode" />
              <Label htmlFor="compact-mode">Modo Compacto</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sistema</CardTitle>
            <CardDescription>Configurações do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Switch id="auto-backup" />
              <Label htmlFor="auto-backup">Backup Automático</Label>
            </div>
            <Button variant="outline" className="w-full">
              Limpar Cache
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

