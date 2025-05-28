import {
    exposeApi,
    type ProcedureResolverOptions,
    createReactQueryClient,
} from '@app.lib/mfe-api-kit/request-api';
import { name } from '../package.json';

export interface LicenseDto {
    id: string;
    dueDate: string;
}

export interface IsLicenseMatchDto {
    isValid: true;
}

export interface IsLicenseHasOptionDto {
    isIncluded: boolean;
}

export const api = exposeApi({ apiName: name }, ({ builder, apiClient }) => ({
    getLicense: builder.query(async ({}: ProcedureResolverOptions) => {
        await sleep(500);
        return apiClient('/license')
            .then(resp => resp.json())
            .then(data => data as LicenseDto);

    }),
    checkOption: builder.query(async ({ input }: ProcedureResolverOptions<{ option: string }>) => {
        await sleep(1000);
        return apiClient(`/license/has-option?option=${input.option}`)
            .then(resp => resp.json())
            .then(data => data as IsLicenseHasOptionDto);
    }),
    refreshLicense: builder.mutation(async ({}: ProcedureResolverOptions) => {
        await sleep(1000);
        await apiClient('/license/refresh');
    }),
    isValid: builder.mutation(async ({ input }: ProcedureResolverOptions<{ key: string }>) => {
        await sleep(250);
        return await apiClient(`/license/check-validity`, {
            method: 'POST',
            body: JSON.stringify({
                key: input.key,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then(resp => resp.json())
            .then(data => data as IsLicenseMatchDto);
    }),
}));

export const reactQueryClient = createReactQueryClient(api.requestFactory);

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
