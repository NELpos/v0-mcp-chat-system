export interface APIKey {
  id: string
  name: string
  description: string
  key: string
  maskedKey: string
  createdAt: Date
  lastUsed?: Date
  isActive: boolean
  permissions: string[]
  expiresAt?: Date
}

export interface CreateAPIKeyRequest {
  name: string
  description: string
  permissions: string[]
  expiresAt?: Date
}
