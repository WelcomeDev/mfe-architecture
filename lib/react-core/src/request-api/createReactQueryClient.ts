import { UseMutationResult, UseQueryResult, NoInfer, useQuery, useMutation } from '@tanstack/react-query';
import { IEvoApi, Unpromise, IEvoApiReturn, IEvoApiParams, IApiRequestFactory } from '@app-lib/core';
import type {
    UseQueryOptions as UseQueryOptionsBase,
    UseMutationOptions as UseMutationOptionsBase,
} from '@tanstack/react-query';

type Keys<TType extends IEvoApi, TQueryType> = {
    [Key in keyof TType]: TType[Key]['type'] extends TQueryType ? Key : never
}[keyof TType]

type QueryApiReturn<TApiClient extends IEvoApi, K extends keyof TApiClient> = Unpromise<IEvoApiReturn<TApiClient, K>>

type MutationApiReturn<TApiClient extends IEvoApi, K extends keyof TApiClient> = Unpromise<IEvoApiReturn<TApiClient, K>>
type UseMutationApiReturn<TApiClient extends IEvoApi, K extends keyof TApiClient> = UseMutationResult<MutationApiReturn<TApiClient, K>, Error, IEvoApiParams<TApiClient, K>>;

export type UseQueryOptions = Omit<UseQueryOptionsBase, `query${string}`> & { queryKey?: string[] }
export type UseMutationOptions = Omit<UseMutationOptionsBase, `mutationFn${string}`>;

interface UseClientInitReturn {
    status: UseQueryResult['status'];
    isFetching: boolean;

    tryAgain(): void;
}

export interface ApiReactClient<TApiClient extends IEvoApi> {
    useQueryClient: <K extends Keys<TApiClient, 'query'>>(key: K, params: IEvoApiParams<TApiClient, K>, options?: UseQueryOptions) => UseQueryResult<NoInfer<QueryApiReturn<TApiClient, K>>, Error>;

    useMutationClient: <K extends Keys<TApiClient, 'mutation'>>(key: K, options?: UseMutationOptions) => UseMutationApiReturn<TApiClient, K>;

    useClientInit: () => UseClientInitReturn;
}

// todo: add infer method to create types from client method params and return

export function createReactQueryClient<TApiClient extends IEvoApi>(requestFactory: IApiRequestFactory<TApiClient>): ApiReactClient<TApiClient> {

    function useQueryClient<K extends Keys<TApiClient, 'query'>>(key: K, params: IEvoApiParams<TApiClient, K>, options: UseQueryOptions = {}): UseQueryResult<NoInfer<QueryApiReturn<TApiClient, K>>, Error> {
        const queryKey = [ requestFactory.clientName, key as string, params ].concat(options?.queryKey ?? []);
        return useQuery<unknown, Error, any>({
            queryKey,
            queryFn: () => requestFactory.handle(key, params),
            ...options,
        });
    };

    const useMutationClient: ApiReactClient<TApiClient>['useMutationClient'] = (key, options = {}) => {
        return useMutation<any, Error, any>({
            mutationFn: (params) => requestFactory.handle(key, params),
            ...options,
        });
    };

    const useClientInit: ApiReactClient<TApiClient>['useClientInit'] = () => {
        const { isFetching, refetch, status } = useQuery({
            queryKey: [ `clientInit:${requestFactory.clientName}` ],
            queryFn: () => requestFactory.ping()
                                         .then(() => true),
            retry: false,
            refetchOnWindowFocus: false,
            refetchInterval: false,
        });

        return {
            status: status,
            tryAgain: () => {
                refetch({});
            },
            isFetching,
        };
    };

    return { useQueryClient, useMutationClient, useClientInit };
}
