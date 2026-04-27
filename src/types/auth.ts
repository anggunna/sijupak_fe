export type UserRole = 'admin' | 'user'

export interface AuthUser {
  nama: string
  email: string
  role: UserRole
  token: string
}
