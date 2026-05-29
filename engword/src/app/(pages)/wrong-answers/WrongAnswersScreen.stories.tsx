import type { Meta, StoryObj } from '@storybook/react'
import { WrongAnswersScreen } from './WrongAnswersScreen'

const meta: Meta<typeof WrongAnswersScreen> = {
  component: WrongAnswersScreen,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof WrongAnswersScreen>

export const Default: Story = {}
