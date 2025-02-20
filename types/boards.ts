export type BoardType =
  | "RIO"
  | "Master"
  | "Amplificador"
  | "Vibrador"
  | "Microsorter"
  | "Placa de volta"
  | "Localizador"
  | "Conversor VV"
  | "Conversor IV"
  | "Driver de LEDs"
  | "Placa LEDs WT"
  | "Placa LEDs IR"

export interface BoardDetails {
  type: BoardType
  quantity: number
  codes?: string[] // Optional because some boards don't need codes
}

export interface BoardsData {
  boards: BoardDetails[]
}

export const BOARDS_WITHOUT_CODES = ["Conversor IV", "Conversor VV", "Placa LEDs WT", "Placa LEDs IR"] as const

export const BOARD_TYPES: BoardType[] = [
  "RIO",
  "Master",
  "Amplificador",
  "Vibrador",
  "Microsorter",
  "Placa de volta",
  "Localizador",
  "Conversor VV",
  "Conversor IV",
  "Driver de LEDs",
  "Placa LEDs WT",
  "Placa LEDs IR",
]

