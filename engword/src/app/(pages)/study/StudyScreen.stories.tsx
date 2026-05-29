import type { Meta, StoryObj } from '@storybook/react'
import { StudyScreen } from './StudyScreen'

const meta: Meta<typeof StudyScreen> = {
  component: StudyScreen,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof StudyScreen>

export const Default: Story = {}
