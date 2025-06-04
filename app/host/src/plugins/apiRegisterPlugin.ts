import type { PiralPlugin } from 'piral-core';
import type { ApiRegister } from '@app-lib/mfe-api-kit';

export interface ApiRegistryPlugin {
    apiRegistry: {
        register(register: ApiRegister): () => void;
    };
}

interface ApiRegisterParams {
    hostApis?: ApiRegister[];
}

export const apiRegisterPlugin = (config: ApiRegisterParams): PiralPlugin<ApiRegistryPlugin> => (ctx) => {
    const apiRegistryPlugin = {
        register(register: ApiRegister) {
            const { dispose } = register({
                apiClient: (url, params) => fetch(`http://localhost:9001${url}`, params),
            });
            return () => dispose();
        },
    };

    config.hostApis.forEach(api => {
        apiRegistryPlugin.register(api);
    });

    console.log('Create plugin');
    return (api) => {
        return {
            apiRegistry: apiRegistryPlugin,
        };
    };
};
