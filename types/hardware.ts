// Network card details
export interface NetworkCardDetails {
  model?: string
  ports: number
  quantity: number
}

// Serial card with ports and quantity
export interface SerialCardDetails {
  model?: string
  ports: number
  quantity: number
}

// WiFi adapter
export interface WiFiAdapterDetails {
  model?: string
  quantity?: number
}

// Network switch
export interface SwitchDetails {
  model?: string
  quantity?: number
}

// Windows
export interface WindowsDetails {
  version: string
}

// Power supply
export interface PowerSupplyDetails {
  model: string
}

// MIO Board Details
export interface MIOBoardDetails {
  model: string
  hasConditioner: boolean
  conditionerModel?: string
  hasRibbon: boolean
  ribbonModel?: string
}

// Shentek Board Details
export interface ShentekBoardDetails {
  model: string
  type: "2P" | "4P"
  hasConditioner: boolean
  conditionerModel?: string
  hasRibbon: boolean
  ribbonModel?: string
}

// Camera Details
export interface CameraDetails {
  type: string
  quantity: number
  hasLens: boolean
  hasCable: boolean // Add this field
  lensType?: string
  lensQuantity?: number
  cableType?: string
  cableQuantity?: number
}

// Basic Hardware Components
export interface BasicHardwareDetails {
  processor?: {
    model: string
  }
  motherboard?: {
    model: string
  }
  ram?: {
    model: string
    quantity: number
  }
  storage?: {
    model: string
    quantity: number
  }
}

// Additional component
export interface AdditionalComponent {
  name: string
  model: string
  quantity: number
}

// Update the ComputerHardware and CalibratorHardware interfaces
export interface ComputerHardware extends BasicHardwareDetails {
  type: "montagem" | "reparacao"
  selectedComponents: {
    networkCard: boolean
    serialCard: boolean
    wifiAdapter: boolean
    switch: boolean
    windows: boolean
    powerSupply: boolean
  }
  components: {
    networkCard?: NetworkCardDetails
    serialCard?: SerialCardDetails
    wifiAdapter?: WiFiAdapterDetails
    switch?: SwitchDetails
    windows?: WindowsDetails
    powerSupply?: PowerSupplyDetails
  }
  additionalComponents?: AdditionalComponent[]
}

export interface CalibratorHardware extends BasicHardwareDetails {
  type: "montagem" | "reparacao"
  hasBoards?: boolean // Add this field
  selectedComponents: {
    mioBoard: boolean
    shentekBoard: boolean
    networkCard: boolean
    serialCard: boolean
    wifiAdapter: boolean
    switch: boolean
    windows: boolean
    camera: boolean
    powerSupply: boolean
  }
  components: {
    mioBoard?: MIOBoardDetails
    shentekBoard?: ShentekBoardDetails
    networkCard?: NetworkCardDetails
    serialCard?: SerialCardDetails
    wifiAdapter?: WiFiAdapterDetails
    switch?: SwitchDetails
    windows?: WindowsDetails
    camera?: CameraDetails
    powerSupply?: PowerSupplyDetails
  }
  additionalComponents?: AdditionalComponent[]
}

