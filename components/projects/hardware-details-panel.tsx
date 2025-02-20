"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { ComputerHardware, CalibratorHardware } from "@/types/hardware"

interface HardwareDetailsPanelProps {
  type: "computador" | "calibrador"
  component: string
  value: ComputerHardware | CalibratorHardware
  onChange: (value: ComputerHardware | CalibratorHardware) => void
}

export function HardwareDetailsPanel({ type, component, value, onChange }: HardwareDetailsPanelProps) {
  const calibratorValue = value as CalibratorHardware

  const renderMIOBoardDetails = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Modelo</Label>
        <Input
          value={calibratorValue.components.mioBoard?.model || ""}
          onChange={(e) =>
            onChange((prevValue) => ({
              ...prevValue,
              components: {
                ...prevValue.components,
                mioBoard: {
                  ...prevValue.components.mioBoard,
                  model: e.target.value,
                  hasConditioner: prevValue.components.mioBoard?.hasConditioner || false,
                  hasRibbon: prevValue.components.mioBoard?.hasRibbon || false,
                },
              },
            }))
          }
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={calibratorValue.components.mioBoard?.hasConditioner || false}
            onCheckedChange={(checked) => {
              onChange((prevValue) => ({
                ...prevValue,
                components: {
                  ...prevValue.components,
                  mioBoard: {
                    ...prevValue.components.mioBoard!,
                    hasConditioner: !!checked,
                  },
                },
                selectedComponents: {
                  ...prevValue.selectedComponents,
                  mioConditioner: !!checked,
                },
              }))
            }}
          />
          <Label>Condicionador MIO</Label>
        </div>

        {calibratorValue.components.mioBoard?.hasConditioner && (
          <div className="ml-6 space-y-2">
            <Label>Modelo do Condicionador</Label>
            <Input
              value={calibratorValue.components.mioBoard?.conditionerModel || ""}
              onChange={(e) =>
                onChange((prevValue) => ({
                  ...prevValue,
                  components: {
                    ...prevValue.components,
                    mioBoard: {
                      ...prevValue.components.mioBoard!,
                      conditionerModel: e.target.value,
                    },
                  },
                }))
              }
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            checked={calibratorValue.components.mioBoard?.hasRibbon || false}
            onCheckedChange={(checked) => {
              onChange((prevValue) => ({
                ...prevValue,
                components: {
                  ...prevValue.components,
                  mioBoard: {
                    ...prevValue.components.mioBoard!,
                    hasRibbon: !!checked,
                  },
                },
              }))
            }}
          />
          <Label>Cabo MIO</Label>
        </div>

        {calibratorValue.components.mioBoard?.hasRibbon && (
          <div className="ml-6 space-y-2">
            <Label>Modelo do Cabo</Label>
            <Input
              value={calibratorValue.components.mioBoard?.ribbonModel || ""}
              onChange={(e) =>
                onChange((prevValue) => ({
                  ...prevValue,
                  components: {
                    ...prevValue.components,
                    mioBoard: {
                      ...prevValue.components.mioBoard!,
                      ribbonModel: e.target.value,
                    },
                  },
                }))
              }
            />
          </div>
        )}
      </div>
    </div>
  )

  const renderShentekBoardDetails = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Modelo</Label>
        <Input
          value={calibratorValue.components.shentekBoard?.model || ""}
          onChange={(e) =>
            onChange((prevValue) => ({
              ...prevValue,
              components: {
                ...prevValue.components,
                shentekBoard: {
                  ...prevValue.components.shentekBoard,
                  model: e.target.value,
                  type: prevValue.components.shentekBoard?.type || "2P",
                  hasConditioner: prevValue.components.shentekBoard?.hasConditioner || false,
                  hasRibbon: prevValue.components.shentekBoard?.hasRibbon || false,
                },
              },
            }))
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Tipo</Label>
        <Select
          value={calibratorValue.components.shentekBoard?.type || "2P"}
          onValueChange={(v) =>
            onChange((prevValue) => ({
              ...prevValue,
              components: {
                ...prevValue.components,
                shentekBoard: {
                  ...prevValue.components.shentekBoard!,
                  type: v as "2P" | "4P",
                },
              },
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2P">2 Portas</SelectItem>
            <SelectItem value="4P">4 Portas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={calibratorValue.components.shentekBoard?.hasConditioner || false}
            onCheckedChange={(checked) => {
              onChange((prevValue) => ({
                ...prevValue,
                components: {
                  ...prevValue.components,
                  shentekBoard: {
                    ...prevValue.components.shentekBoard!,
                    hasConditioner: !!checked,
                  },
                },
                selectedComponents: {
                  ...prevValue.selectedComponents,
                  shentekConditioner: !!checked,
                },
              }))
            }}
          />
          <Label>Condicionador Shentek</Label>
        </div>

        {calibratorValue.components.shentekBoard?.hasConditioner && (
          <div className="ml-6 space-y-2">
            <Label>Modelo do Condicionador</Label>
            <Input
              value={calibratorValue.components.shentekBoard?.conditionerModel || ""}
              onChange={(e) =>
                onChange((prevValue) => ({
                  ...prevValue,
                  components: {
                    ...prevValue.components,
                    shentekBoard: {
                      ...prevValue.components.shentekBoard!,
                      conditionerModel: e.target.value,
                    },
                  },
                }))
              }
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            checked={calibratorValue.components.shentekBoard?.hasRibbon || false}
            onCheckedChange={(checked) => {
              onChange((prevValue) => ({
                ...prevValue,
                components: {
                  ...prevValue.components,
                  shentekBoard: {
                    ...prevValue.components.shentekBoard!,
                    hasRibbon: !!checked,
                  },
                },
              }))
            }}
          />
          <Label>Cabo Shentek</Label>
        </div>

        {calibratorValue.components.shentekBoard?.hasRibbon && (
          <div className="ml-6 space-y-2">
            <Label>Modelo do Cabo</Label>
            <Input
              value={calibratorValue.components.shentekBoard?.ribbonModel || ""}
              onChange={(e) =>
                onChange((prevValue) => ({
                  ...prevValue,
                  components: {
                    ...prevValue.components,
                    shentekBoard: {
                      ...prevValue.components.shentekBoard!,
                      ribbonModel: e.target.value,
                    },
                  },
                }))
              }
            />
          </div>
        )}
      </div>
    </div>
  )

  const renderProcessorDetails = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Modelo</Label>
        <Input
          value={value.components.processor?.model || ""}
          onChange={(e) =>
            onChange((prevValue) => ({
              ...prevValue,
              components: {
                ...prevValue.components,
                processor: {
                  ...prevValue.components.processor,
                  model: e.target.value,
                  type: prevValue.components.processor?.type || "",
                },
              },
            }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label>Tipo</Label>
        <Input
          value={value.components.processor?.type || ""}
          onChange={(e) =>
            onChange((prevValue) => ({
              ...prevValue,
              components: {
                ...prevValue.components,
                processor: {
                  ...prevValue.components.processor,
                  type: e.target.value,
                },
              },
            }))
          }
        />
      </div>
    </div>
  )

  const renderMotherboardDetails = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Modelo</Label>
        <Input
          value={value.components.motherboard?.model || ""}
          onChange={(e) =>
            onChange((prevValue) => ({
              ...prevValue,
              components: {
                ...prevValue.components,
                motherboard: {
                  ...prevValue.components.motherboard,
                  model: e.target.value,
                  type: prevValue.components.motherboard?.type || "",
                },
              },
            }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label>Tipo</Label>
        <Input
          value={value.components.motherboard?.type || ""}
          onChange={(e) =>
            onChange((prevValue) => ({
              ...prevValue,
              components: {
                ...prevValue.components,
                motherboard: {
                  ...prevValue.components.motherboard,
                  type: e.target.value,
                },
              },
            }))
          }
        />
      </div>
    </div>
  )

  const renderRAMDetails = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Modelo</Label>
        <Input
          value={value.components.ram?.model || ""}
          onChange={(e) =>
            onChange((prevValue) => ({
              ...prevValue,
              components: {
                ...prevValue.components,
                ram: {
                  ...prevValue.components.ram,
                  model: e.target.value,
                  type: prevValue.components.ram?.type || "",
                  capacity: prevValue.components.ram?.capacity || "",
                  quantity: prevValue.components.ram?.quantity || 1,
                },
              },
            }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label>Tipo</Label>
        <Input
          value={value.components.ram?.type || ""}
          onChange={(e) =>
            onChange((prevValue) => ({
              ...prevValue,
              components: {
                ...prevValue.components,
                ram: {
                  ...prevValue.components.ram,
                  type: e.target.value,
                },
              },
            }))
          }
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Capacidade</Label>
          <Input
            value={value.components.ram?.capacity || ""}
            onChange={(e) =>
              onChange((prevValue) => ({
                ...prevValue,
                components: {
                  ...prevValue.components,
                  ram: {
                    ...prevValue.components.ram,
                    capacity: e.target.value,
                  },
                },
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Quantidade</Label>
          <Input
            type="number"
            value={value.components.ram?.quantity || ""}
            onChange={(e) =>
              onChange((prevValue) => ({
                ...prevValue,
                components: {
                  ...prevValue.components,
                  ram: {
                    ...prevValue.components.ram,
                    quantity: Number(e.target.value),
                  },
                },
              }))
            }
          />
        </div>
      </div>
    </div>
  )

  const renderStorageDetails = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Modelo</Label>
        <Input
          value={value.components.storage?.model || ""}
          onChange={(e) =>
            onChange((prevValue) => ({
              ...prevValue,
              components: {
                ...prevValue.components,
                storage: {
                  ...prevValue.components.storage,
                  model: e.target.value,
                  type: "ssd",
                  capacity: prevValue.components.storage?.capacity || "",
                  quantity: prevValue.components.storage?.quantity || 1,
                },
              },
            }))
          }
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Capacidade</Label>
          <Input
            value={value.components.storage?.capacity || ""}
            onChange={(e) =>
              onChange((prevValue) => ({
                ...prevValue,
                components: {
                  ...prevValue.components,
                  storage: {
                    ...prevValue.components.storage,
                    capacity: e.target.value,
                  },
                },
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Quantidade</Label>
          <Input
            type="number"
            value={value.components.storage?.quantity || ""}
            onChange={(e) =>
              onChange((prevValue) => ({
                ...prevValue,
                components: {
                  ...prevValue.components,
                  storage: {
                    ...prevValue.components.storage,
                    quantity: Number(e.target.value),
                  },
                },
              }))
            }
          />
        </div>
      </div>
    </div>
  )

  const renderCameraDetails = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Modelo</Label>
        <Input
          value={calibratorValue.components.camera?.model || ""}
          onChange={(e) =>
            onChange((prevValue) => ({
              ...prevValue,
              components: {
                ...prevValue.components,
                camera: {
                  ...prevValue.components.camera,
                  model: e.target.value,
                  type: prevValue.components.camera?.type || "",
                  quantity: prevValue.components.camera?.quantity || 1,
                  hasLens: prevValue.components.camera?.hasLens || false,
                },
              },
            }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label>Tipo</Label>
        <Input
          value={calibratorValue.components.camera?.type || ""}
          onChange={(e) =>
            onChange((prevValue) => ({
              ...prevValue,
              components: {
                ...prevValue.components,
                camera: {
                  ...prevValue.components.camera,
                  type: e.target.value,
                },
              },
            }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label>Quantidade</Label>
        <Input
          type="number"
          value={calibratorValue.components.camera?.quantity || ""}
          onChange={(e) =>
            onChange((prevValue) => ({
              ...prevValue,
              components: {
                ...prevValue.components,
                camera: {
                  ...prevValue.components.camera,
                  quantity: Number(e.target.value),
                },
              },
            }))
          }
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={calibratorValue.components.camera?.hasLens || false}
            onCheckedChange={(checked) => {
              onChange((prevValue) => ({
                ...prevValue,
                components: {
                  ...prevValue.components,
                  camera: {
                    ...prevValue.components.camera!,
                    hasLens: !!checked,
                  },
                },
              }))
            }}
          />
          <Label>Lente</Label>
        </div>

        {calibratorValue.components.camera?.hasLens && (
          <div className="ml-6 space-y-4">
            <div className="space-y-2">
              <Label>Tipo da Lente</Label>
              <Input
                value={calibratorValue.components.camera?.lensType || ""}
                onChange={(e) =>
                  onChange((prevValue) => ({
                    ...prevValue,
                    components: {
                      ...prevValue.components,
                      camera: {
                        ...prevValue.components.camera!,
                        lensType: e.target.value,
                      },
                    },
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Quantidade de Lentes</Label>
              <Input
                type="number"
                value={calibratorValue.components.camera?.lensQuantity || ""}
                onChange={(e) =>
                  onChange((prevValue) => ({
                    ...prevValue,
                    components: {
                      ...prevValue.components,
                      camera: {
                        ...prevValue.components.camera!,
                        lensQuantity: Number(e.target.value),
                      },
                    },
                  }))
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderSecurityKeyDetails = () => (
    <div className="space-y-2">
      <Label>Código</Label>
      <Input
        value={calibratorValue.components.securityKey?.code || ""}
        onChange={(e) =>
          onChange((prevValue) => ({
            ...prevValue,
            components: {
              ...prevValue.components,
              securityKey: {
                code: e.target.value,
              },
            },
          }))
        }
      />
    </div>
  )

  const getComponentTitle = () => {
    switch (component) {
      case "mioBoard":
        return "Placa MIO"
      case "shentekBoard":
        return "Placa Shentek"
      case "processor":
        return "Processador"
      case "motherboard":
        return "Placa Mãe"
      case "ram":
        return "Memória RAM"
      case "storage":
        return "Armazenamento"
      case "camera":
        return "Câmera"
      case "securityKey":
        return "Pen de Segurança"
      default:
        return "Detalhes do Componente"
    }
  }

  const renderComponentDetails = () => {
    switch (component) {
      case "mioBoard":
        return renderMIOBoardDetails()
      case "shentekBoard":
        return renderShentekBoardDetails()
      case "processor":
        return renderProcessorDetails()
      case "motherboard":
        return renderMotherboardDetails()
      case "ram":
        return renderRAMDetails()
      case "storage":
        return renderStorageDetails()
      case "camera":
        return renderCameraDetails()
      case "securityKey":
        return renderSecurityKeyDetails()
      default:
        return null
    }
  }

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>{getComponentTitle()}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-6">{renderComponentDetails()}</div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

