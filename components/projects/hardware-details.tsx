"use client"

import { useState, useEffect } from "react"
import { Plus, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ComputerHardware, CalibratorHardware, AdditionalComponent } from "@/types/hardware"

interface HardwareDetailsProps {
  type: "computador" | "calibrador"
  value: ComputerHardware | CalibratorHardware
  onChange: (value: ComputerHardware | CalibratorHardware) => void
}

export default function HardwareDetails({ type, value, onChange }: HardwareDetailsProps) {
  const [newComponent, setNewComponent] = useState<AdditionalComponent>({
    name: "",
    model: "",
    quantity: 1,
  })

  // Initialize state with proper type casting
  const calibratorValue = value as CalibratorHardware

  // Initialize the hardware configuration
  useEffect(() => {
    if (!value.selectedComponents || Object.keys(value.selectedComponents).length === 0) {
      const initialSelectedComponents =
        type === "computador"
          ? {
              networkCard: false,
              serialCard: false,
              wifiAdapter: false,
              switch: false,
              windows: false,
              powerSupply: false,
            }
          : {
              mioBoard: false,
              shentekBoard: false,
              networkCard: false,
              serialCard: false,
              wifiAdapter: false,
              switch: false,
              windows: false,
              camera: false,
              powerSupply: false,
            }

      onChange({
        ...value,
        type: value.type || "montagem",
        selectedComponents: initialSelectedComponents,
        components: {},
      })
    }
  }, [value, onChange, type])

  // Ensure components object exists
  const components = value.components || {}
  const selectedComponents = value.selectedComponents || {}
  const additionalComponents = value.additionalComponents || []

  const updateComponent = (component: string, field: string, newValue: any) => {
    onChange({
      ...value,
      components: {
        ...components,
        [component]: {
          ...(components[component] || {}),
          [field]: newValue,
        },
      },
    })
  }

  const toggleComponent = (component: string) => {
    onChange({
      ...value,
      selectedComponents: {
        ...selectedComponents,
        [component]: !selectedComponents[component],
      },
      components: {
        ...components,
        [component]: selectedComponents[component] ? undefined : {},
      },
    })
  }

  const addAdditionalComponent = () => {
    if (newComponent.name && newComponent.model) {
      onChange({
        ...value,
        additionalComponents: [...(additionalComponents || []), newComponent],
      })
      setNewComponent({ name: "", model: "", quantity: 1 })
    }
  }

  const removeAdditionalComponent = (index: number) => {
    onChange({
      ...value,
      additionalComponents: additionalComponents.filter((_, i) => i !== index),
    })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            {/* Basic Components Section */}
            <div className="space-y-4">
              <h3 className="font-medium">Componentes Básicos</h3>

              {/* Processor */}
              <div className="space-y-2">
                <Label htmlFor="processor">Processador</Label>
                <Input
                  id="processor"
                  placeholder="Modelo do processador"
                  value={components.processor?.model || ""}
                  onChange={(e) => updateComponent("processor", "model", e.target.value)}
                />
              </div>

              {/* Motherboard */}
              <div className="space-y-2">
                <Label htmlFor="motherboard">Placa Mãe</Label>
                <Input
                  id="motherboard"
                  placeholder="Modelo da placa-mãe"
                  value={components.motherboard?.model || ""}
                  onChange={(e) => updateComponent("motherboard", "model", e.target.value)}
                />
              </div>

              {/* RAM */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ram-model">RAM (Modelo)</Label>
                  <Input
                    id="ram-model"
                    placeholder="Modelo da RAM"
                    value={components.ram?.model || ""}
                    onChange={(e) => updateComponent("ram", "model", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ram-quantity">Quantidade</Label>
                  <Input
                    id="ram-quantity"
                    type="number"
                    min="1"
                    value={components.ram?.quantity || ""}
                    onChange={(e) => updateComponent("ram", "quantity", Number(e.target.value))}
                  />
                </div>
              </div>

              {/* SSD */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ssd-model">SSD (Modelo)</Label>
                  <Input
                    id="ssd-model"
                    placeholder="Modelo do SSD"
                    value={components.storage?.model || ""}
                    onChange={(e) => updateComponent("storage", "model", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ssd-quantity">Quantidade</Label>
                  <Input
                    id="ssd-quantity"
                    type="number"
                    min="1"
                    value={components.storage?.quantity || ""}
                    onChange={(e) => updateComponent("storage", "quantity", Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Network Components Section */}
            <div className="space-y-4">
              <h3 className="font-medium">Componentes de Rede</h3>

              {/* Network Card */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="networkCard"
                    checked={selectedComponents.networkCard}
                    onCheckedChange={() => toggleComponent("networkCard")}
                  />
                  <Label htmlFor="networkCard">Placa Ethernet</Label>
                </div>

                {selectedComponents.networkCard && (
                  <div className="ml-6 grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Número de Portas</Label>
                      <Input
                        type="number"
                        min="1"
                        value={components.networkCard?.ports || ""}
                        onChange={(e) => updateComponent("networkCard", "ports", Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Quantidade</Label>
                      <Input
                        type="number"
                        min="1"
                        value={components.networkCard?.quantity || ""}
                        onChange={(e) => updateComponent("networkCard", "quantity", Number(e.target.value))}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Serial Card */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="serialCard"
                    checked={selectedComponents.serialCard}
                    onCheckedChange={() => toggleComponent("serialCard")}
                  />
                  <Label htmlFor="serialCard">Placa Serial</Label>
                </div>

                {selectedComponents.serialCard && (
                  <div className="ml-6 grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Número de Portas</Label>
                      <Input
                        type="number"
                        min="1"
                        value={components.serialCard?.ports || ""}
                        onChange={(e) => updateComponent("serialCard", "ports", Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Quantidade</Label>
                      <Input
                        type="number"
                        min="1"
                        value={components.serialCard?.quantity || ""}
                        onChange={(e) => updateComponent("serialCard", "quantity", Number(e.target.value))}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* WiFi Adapter */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wifiAdapter"
                  checked={selectedComponents.wifiAdapter}
                  onCheckedChange={() => toggleComponent("wifiAdapter")}
                />
                <Label htmlFor="wifiAdapter">Adaptador Wi-Fi</Label>
              </div>

              {/* Network Switch */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="switch"
                  checked={selectedComponents.switch}
                  onCheckedChange={() => toggleComponent("switch")}
                />
                <Label htmlFor="switch">Switch</Label>
              </div>
            </div>

            <Separator />

            {/* System Components Section */}
            <div className="space-y-4">
              <h3 className="font-medium">Sistema</h3>

              {/* Windows Version */}
              <div className="space-y-2">
                <Label htmlFor="windows">Sistema Operacional</Label>
                <Input
                  id="windows"
                  placeholder="Ex: Windows 10 Pro"
                  value={components.windows?.version || ""}
                  onChange={(e) => updateComponent("windows", "version", e.target.value)}
                />
              </div>

              {/* Power Supply */}
              <div className="space-y-2">
                <Label htmlFor="powerSupply">Fonte de Alimentação</Label>
                <Input
                  id="powerSupply"
                  placeholder="Modelo da fonte"
                  value={components.powerSupply?.model || ""}
                  onChange={(e) => updateComponent("powerSupply", "model", e.target.value)}
                />
              </div>
            </div>

            {type === "calibrador" && (
              <>
                <Separator />

                {/* Calibrator-specific components */}
                <div className="space-y-4">
                  <h3 className="font-medium">Componentes do Calibrador</h3>

                  {/* MIO Board */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="mioBoard"
                        checked={selectedComponents.mioBoard}
                        onCheckedChange={() => toggleComponent("mioBoard")}
                      />
                      <Label htmlFor="mioBoard">Placa MIO</Label>
                    </div>

                    {selectedComponents.mioBoard && (
                      <div className="ml-6 space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="mioConditioner"
                            checked={components.mioBoard?.hasConditioner || false}
                            onCheckedChange={(checked) => updateComponent("mioBoard", "hasConditioner", checked)}
                          />
                          <Label htmlFor="mioConditioner">Cabo e Condicionamento MIO</Label>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Shentek Board */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="shentekBoard"
                        checked={selectedComponents.shentekBoard}
                        onCheckedChange={() => toggleComponent("shentekBoard")}
                      />
                      <Label htmlFor="shentekBoard">Placa Shentek</Label>
                    </div>

                    {selectedComponents.shentekBoard && (
                      <div className="ml-6 space-y-4">
                        <Select
                          value={components.shentekBoard?.type || "2P"}
                          onValueChange={(value) => updateComponent("shentekBoard", "type", value as "2P" | "4P")}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2P">2 Portas</SelectItem>
                            <SelectItem value="4P">4 Portas</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="shentekConditioner"
                            checked={components.shentekBoard?.hasConditioner || false}
                            onCheckedChange={(checked) => updateComponent("shentekBoard", "hasConditioner", checked)}
                          />
                          <Label htmlFor="shentekConditioner">Cabo e Condicionamento Shentek</Label>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Camera */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="camera"
                        checked={selectedComponents.camera}
                        onCheckedChange={() => toggleComponent("camera")}
                      />
                      <Label htmlFor="camera">Câmera</Label>
                    </div>

                    {selectedComponents.camera && (
                      <div className="ml-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Tipo da Câmera</Label>
                            <Input
                              value={components.camera?.type || ""}
                              onChange={(e) => updateComponent("camera", "type", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Quantidade</Label>
                            <Input
                              type="number"
                              min="1"
                              value={components.camera?.quantity || ""}
                              onChange={(e) => updateComponent("camera", "quantity", Number(e.target.value))}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="cameraLens"
                              checked={components.camera?.hasLens || false}
                              onCheckedChange={(checked) => updateComponent("camera", "hasLens", checked)}
                            />
                            <Label htmlFor="cameraLens">Lente</Label>
                          </div>

                          {components.camera?.hasLens && (
                            <div className="ml-6 grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Tipo da Lente</Label>
                                <Input
                                  value={components.camera?.lensType || ""}
                                  onChange={(e) => updateComponent("camera", "lensType", e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Quantidade</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  value={components.camera?.lensQuantity || ""}
                                  onChange={(e) => updateComponent("camera", "lensQuantity", Number(e.target.value))}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="cameraCable"
                              checked={components.camera?.hasCable || false}
                              onCheckedChange={(checked) => updateComponent("camera", "hasCable", checked)}
                            />
                            <Label htmlFor="cameraCable">Cabo</Label>
                          </div>

                          {components.camera?.hasCable && (
                            <div className="ml-6 grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Tipo do Cabo</Label>
                                <Input
                                  value={components.camera?.cableType || ""}
                                  onChange={(e) => updateComponent("camera", "cableType", e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Quantidade</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  value={components.camera?.cableQuantity || ""}
                                  onChange={(e) => updateComponent("camera", "cableQuantity", Number(e.target.value))}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Additional Components Section */}
            <div className="space-y-4">
              <h3 className="font-medium">Componentes Adicionais</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome do Componente</Label>
                  <Input
                    placeholder="Ex: Cabo HDMI"
                    value={newComponent.name}
                    onChange={(e) => setNewComponent({ ...newComponent, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Modelo</Label>
                  <Input
                    placeholder="Ex: 2.0 High Speed"
                    value={newComponent.model}
                    onChange={(e) => setNewComponent({ ...newComponent, model: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quantidade</Label>
                  <Input
                    type="number"
                    min="1"
                    value={newComponent.quantity}
                    onChange={(e) => setNewComponent({ ...newComponent, quantity: Number(e.target.value) })}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addAdditionalComponent} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </div>

              {additionalComponents.length > 0 && (
                <div className="space-y-2">
                  {additionalComponents.map((component, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <div>
                        <span className="font-medium">{component.name}</span>
                        <span className="text-muted-foreground"> - {component.model}</span>
                        <span className="text-muted-foreground"> (Qtd: {component.quantity})</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeAdditionalComponent(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

