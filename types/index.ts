export interface ChartConfig {
  [key: string]: {
    label: string
    color: string
  }
  primary?: {
    label: string
    color: string
  }
  secondary?: {
    label: string
    color: string
  }
  tertiary?: {
    label: string
    color: string
  }
}
