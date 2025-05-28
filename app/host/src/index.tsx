import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { createInstance, Piral, createStandardApi } from 'piral';
import { layout, errors } from './layout';
import { apiRegisterPlugin } from './plugins/apiRegisterPlugin';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const feedUrl = 'http://localhost:9999/feed';
//const feedUrl = 'http://localhost:9999/direct-feed';

const instance = createInstance({
    state: {
        components: layout,
        errorComponents: errors,
    },
    plugins: [
        ...createStandardApi(),
        apiRegisterPlugin,
    ],
    // it dramatically speeds up loading
    async: true,
    debug: {
        defaultFeedUrl: feedUrl,
    },
    requestPilets() {
        return fetch(feedUrl)
            .then((res) => res.json())
            .then((res) => res.items);
    },
});

const root = createRoot(document.querySelector('#app'));

const queryClient = new QueryClient({});
root.render(
    <QueryClientProvider client={queryClient}>
        <Piral instance={instance}/>
    </QueryClientProvider>,
);
