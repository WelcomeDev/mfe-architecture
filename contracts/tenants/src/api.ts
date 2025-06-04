import {
  exposeApi,
  type ProcedureResolverOptions,
  createReactQueryClient,
} from '@app-lib/mfe-api-kit';
import { name } from '../package.json';

export interface TenantDto {
  id: string;
  name: string;
  description: string;
}

export interface UpdateTenantDto {
  title: string;
}

// типы методов автоматически формируются из декларативного объявления
export const api = exposeApi({ apiName: name }, ({ builder, apiClient }) => ({
  // it is required to specify "ProcedureResolverOptions" type
  getTenants: builder.query(async ({}: ProcedureResolverOptions) => {
    return apiClient('/tenants')
      .then(resp => resp.json())
      .then(data => data as TenantDto[]);
  }),
  getTenantById: builder.query(async ({ input }: ProcedureResolverOptions<{ id: string }>) => {
    return apiClient(`/tenants/${input.id}`)
      .then(resp => resp.json())
      .then(data => data as TenantDto);
  }),
  updateTenant: builder.mutation(async ({ input }: ProcedureResolverOptions<{ id: string, data: UpdateTenantDto }>) => {
    return apiClient(`/tenants/${input.id}`, {
      method: 'PUT',
      body: JSON.stringify(input.data),
    })
      .then(resp => resp.json())
      .then(data => data as TenantDto);
  }),
}));

export const reactQueryClient = createReactQueryClient(api.requestFactory);
//reactQueryClient.useQueryClient('getTenants', undefined);
//reactQueryClient.useQueryClient('getTenantById', { id: '1' });
//// 🚨 it's invalid call, updateTenant is a mutation
//reactQueryClient.useQueryClient('updateTenant', { id: '1' });
//// ✅ that's correct call
//reactQueryClient.useMutationClient('updateTenant');

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
