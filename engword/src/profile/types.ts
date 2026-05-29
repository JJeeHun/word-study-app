export type PetPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export interface Profile {
  id: string
  email: string
  synced_at: string | null
  current_streak: number
  last_study_date: string | null
  pet_position: PetPosition
  has_seen_nav_hint: boolean
  created_at: string
  updated_at: string
}

export interface UpdateProfileDto {
  pet_position?: PetPosition
  has_seen_nav_hint?: boolean
  current_streak?: number
  last_study_date?: string | null
  synced_at?: string | null
}
