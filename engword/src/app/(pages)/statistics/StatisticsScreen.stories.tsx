import type { Meta, StoryObj } from '@storybook/react'
import { StatisticsScreen } from './StatisticsScreen'

const meta: Meta<typeof StatisticsScreen> = {
  component: StatisticsScreen,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof StatisticsScreen>

export const Default: Story = {}
