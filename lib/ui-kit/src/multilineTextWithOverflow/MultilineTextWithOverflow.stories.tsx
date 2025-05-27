import { Meta, StoryObj } from '@storybook/react';
import { MultilineTextWithOverflow } from './MultilineTextWithOverflow';

const meta = {
 title: 'ui/MultilineTextWithOverflow',
 component: MultilineTextWithOverflow,
} satisfies Meta<typeof MultilineTextWithOverflow>;

type Story = StoryObj<typeof meta>;

export default meta;

export const Common: Story = {}
