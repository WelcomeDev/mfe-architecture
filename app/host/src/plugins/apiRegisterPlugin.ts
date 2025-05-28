import { PiralPlugin } from 'piral-core';
import type { ApiRegister } from '@app.lib/mfe-api-kit/request-api';

export interface ApiRegistryPlugin {
    apiRegistry: {
        register(register: ApiRegister): () => void;
    };
}

export const apiRegisterPlugin: PiralPlugin<ApiRegistryPlugin> = (ctx) => {
    return (api) => ({
        apiRegistry: {
            register(register: ApiRegister) {
                const { dispose } = register({
                    apiClient: (url, params) => fetch(`http://localhost:9001${url}`, params),
                });
                return () => dispose();
            },
        },
    });
};
