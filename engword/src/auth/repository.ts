import type { Result } from '@/shared/result'
import type { AuthSession, SignUpDto, SignInDto } from './types'

export interface IAuthRepository {
  signUp(dto: SignUpDto): Promise<Result<AuthSession>>
  signIn(dto: SignInDto): Promise<Result<AuthSession>>
  signOut(): Promise<Result<void>>
  getSession(): Promise<Result<AuthSession | null>>
  refreshSession(): Promise<Result<AuthSession>>
}
