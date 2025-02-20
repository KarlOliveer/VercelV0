"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { BoardDetails, BoardType } from "@/types/boards"
import { BOARD_TYPES, BOARDS_WITHOUT_CODES } from "@/types/boards"

interface BoardSelectionProps {
  value: BoardDetails[]
  onChange: (boards: BoardDetails[]) => void
}

export default function BoardSelection({ value, onChange }: BoardSelectionProps) {
  const [selectedType, setSelectedType] = useState<BoardType | "">("")

  const addBoard = () => {
    if (selectedType) {
      const needsCodes = !BOARDS_WITHOUT_CODES.includes(selectedType as any)
      onChange([
        ...value,
        {
          type: selectedType,
          quantity: 1,
          ...(needsCodes ? { codes: [""] } : {}),
        },
      ])
      setSelectedType("")
    }
  }

  const removeBoard = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const updateBoardQuantity = (index: number, quantity: number) => {
    const newBoards = [...value]
    const board = newBoards[index]
    const needsCodes = !BOARDS_WITHOUT_CODES.includes(board.type as any)

    // Update quantity and adjust codes array if needed
    newBoards[index] = {
      ...board,
      quantity,
      ...(needsCodes
        ? {
            codes: Array(quantity)
              .fill("")
              .map((_, i) => board.codes?.[i] || ""),
          }
        : {}),
    }

    onChange(newBoards)
  }

  const updateBoardCode = (boardIndex: number, codeIndex: number, code: string) => {
    const newBoards = [...value]
    const board = newBoards[boardIndex]
    if (board.codes) {
      board.codes[codeIndex] = code
      onChange(newBoards)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-4">
        <div className="flex-1 space-y-2">
          <Label>Adicionar Placa</Label>
          <Select value={selectedType} onValueChange={(value) => setSelectedType(value as BoardType)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de placa" />
            </SelectTrigger>
            <SelectContent>
              {BOARD_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={addBoard} disabled={!selectedType}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {value.map((board, boardIndex) => (
            <Card key={boardIndex}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">{board.type}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground"
                  onClick={() => removeBoard(boardIndex)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Quantidade</Label>
                    <Input
                      type="number"
                      min={1}
                      value={board.quantity}
                      onChange={(e) => updateBoardQuantity(boardIndex, Number.parseInt(e.target.value) || 1)}
                    />
                  </div>

                  {!BOARDS_WITHOUT_CODES.includes(board.type as any) && board.codes && (
                    <div className="space-y-2">
                      <Label>Códigos</Label>
                      <div className="space-y-2">
                        {Array(board.quantity)
                          .fill(0)
                          .map((_, codeIndex) => (
                            <Input
                              key={codeIndex}
                              placeholder={`Código ${codeIndex + 1}`}
                              value={board.codes[codeIndex] || ""}
                              onChange={(e) => updateBoardCode(boardIndex, codeIndex, e.target.value)}
                            />
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

