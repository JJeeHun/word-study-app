export interface AuthUser {
  id: string
  email: string
}

export interface SignUpDto {
  email: string
  password: string
}

export interface SignInDto {
  email: string
  password: string
}

export interface AuthSession {
  user: AuthUser
  access_token: string
  refresh_token: string
  expires_at: number
}
