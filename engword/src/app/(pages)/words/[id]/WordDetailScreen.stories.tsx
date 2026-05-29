import type { Meta, StoryObj } from '@storybook/react'
import { WordDetailScreen } from './WordDetailScreen'

const meta: Meta<typeof WordDetailScreen> = {
  component: WordDetailScreen,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof WordDetailScreen>

export const Default: Story = {
  args: { id: 'mock-id' },
}
