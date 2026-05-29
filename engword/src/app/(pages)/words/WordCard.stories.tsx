import type { Meta, StoryObj } from '@storybook/react'
import { WordCard } from './WordCard'

const sampleWord = {
  id: '1',
  text: 'ubiquitous',
  meaning: '어디에나 있는, 편재하는',
  difficulty: 4,
  frequency: 3,
  cefr: 'C1' as const,
  part_of_speech: 'adjective' as const,
  origin: 'Latin',
  domain: 'GENERAL',
  status: '승인' as const,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  deleted_at: null,
}

const meta: Meta<typeof WordCard> = {
  component: WordCard,
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj<typeof WordCard>

export const Default: Story = {
  args: { word: sampleWord },
}

export const LongMeaning: Story = {
  args: {
    word: {
      ...sampleWord,
      meaning: '어디에나 있는, 편재하는, 아주 흔한\n도처에서 발견되는',
    },
  },
}
