import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { createInstance, Piral, createStandardApi } from 'piral';
import { layout, errors } from './layout';
import { apiRegisterPlugin } from './plugins/apiRegisterPlugin';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { api as tenantsApi } from '@evo.contracts/tenants';

const feedUrl = 'http://localhost:9999/feed';
//const feedUrl = 'http://localhost:9999/direct-feed';

const instance = createInstance({
  state: {
    components: layout,
    errorComponents: errors,
  },
  plugins: [
    ...createStandardApi(),
    apiRegisterPlugin({
      hostApis: [ tenantsApi.register ],
    }),
  ],
  // it dramatically speeds up loading (it doesn't require all pilets to be loaded to show up smth)
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
