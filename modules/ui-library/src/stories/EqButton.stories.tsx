import type { Meta, StoryObj } from '@storybook/react'

import { EqButton } from '../EqButton'

const meta: Meta<typeof EqButton> = {
  component: EqButton,
}

export default meta

type Story = StoryObj<typeof EqButton>

export const Primary: Story = {
  render: () => <EqButton>Button</EqButton>,
}
