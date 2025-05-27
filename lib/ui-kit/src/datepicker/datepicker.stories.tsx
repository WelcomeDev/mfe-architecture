import { Meta, StoryObj } from '@storybook/react';
import { Datepicker } from './datepicker';
import { Input } from '../input/input';

const meta = {
    title: 'ui-kit/Datepicker',
    component: Datepicker,
    subcomponents: { Input },
    parameters: {
    },
    args:{
        label: 'Дата от',
    }
} satisfies Meta<typeof Datepicker>;

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {};
