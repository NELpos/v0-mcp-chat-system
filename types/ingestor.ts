export interface ApiConfig {
  url: string
  method: "GET" | "POST"
  headers: Record<string, string>
  body?: string
}

export interface TableInfo {
  id: string
  name: string
  schema: string
  description: string
}

export interface ColumnInfo {
  name: string
  type: string
  nullable: boolean
  primaryKey: boolean
  description?: string
}

export interface DataMapping {
  sourceField: string
  targetColumn: string
  transformation?: string
}

export interface MappingTemplate {
  id: string
  name: string
  description: string
  apiConfig: ApiConfig
  tableId: string
  mappings: DataMapping[]
  createdAt: Date
  updatedAt: Date
}

export interface IngestorStep {
  id: number
  title: string
  description: string
  completed: boolean
}
