import type { Preview } from '@storybook/react';

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Za-z].*' },
        controls: {
            expanded: true,
            include: /^on[A-Za-z].*$/,
            sort: 'requiredFirst',
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
};

export default preview;
