import {
    exposeApi,
    type ProcedureResolverOptions,
    createReactQueryClient,
} from '@app.lib/mfe-api-kit';
import { name } from '../package.json';

export interface TenantDto {
    id: string;
    name: string;
    description: string;
}

export const api = exposeApi({ apiName: name }, ({ builder, apiClient }) => ({
    getTenants: builder.query(async ({}: ProcedureResolverOptions) => {
        await sleep(500);
        return apiClient('/tenants')
            .then(resp => resp.json())
            .then(data => data as TenantDto[]);
    }),
}));

export const reactQueryClient = createReactQueryClient(api.requestFactory);

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
