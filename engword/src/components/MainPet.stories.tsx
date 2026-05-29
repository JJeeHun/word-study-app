import type { Meta, StoryObj } from '@storybook/react'
import { MainPet } from './MainPet'

const meta: Meta<typeof MainPet> = {
  component: MainPet,
  parameters: { layout: 'fullscreen' },
  args: {
    position: 'bottom-right',
    hasSeenNavHint: true,
    reaction: null,
    onHintSeen: () => {},
  },
}
export default meta

type Story = StoryObj<typeof MainPet>

export const Excited: Story = { args: { mood: 'excited' } }
export const Normal: Story = { args: { mood: 'normal' } }
export const Tired: Story = { args: { mood: 'tired' } }
export const Exhausted: Story = { args: { mood: 'exhausted' } }
export const WithReaction: Story = {
  args: { mood: 'excited', reaction: { emoji: '😋', message: '냠냠 맛있었어!' } },
}
export const FirstHint: Story = {
  args: { mood: 'normal', hasSeenNavHint: false },
}
