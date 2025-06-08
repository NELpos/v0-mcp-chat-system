export interface UserAPIKey {
  id: string
  name: string
  key: string
  maskedKey: string
  createdAt: Date
  expiresAt?: Date
  lastUsed?: Date
}
