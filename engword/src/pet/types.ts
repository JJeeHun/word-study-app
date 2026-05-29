export type UserPetType = 'main' | 'domain'

export interface Pet {
  id: string
  species: string
  variant: string
  name: string
}

export interface UserPet {
  id: string
  user_id: string
  pet_id: string
  type: UserPetType
  domain: string | null
  created_at: string
}

export interface CreateUserPetDto {
  user_id: string
  pet_id: string
  type: UserPetType
  domain?: string
}

export type PetEvent =
  | 'correct_answer'
  | 'wrong_answer'
  | 'done_achieved'
  | 'queue_complete'
  | 'long_absence'
  | 'new_word_added'
