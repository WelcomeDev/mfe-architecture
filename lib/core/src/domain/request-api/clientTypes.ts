export interface ApiRequestBuilder {
    mutation: {
        type: 'mutation'
        handler: (params: any) => Promise<any>
    };
    query: {
        type: 'query',
        handler: (params: any) => Promise<any>
    };
}

export type QueryType = {
    [Key in keyof ApiRequestBuilder]: ApiRequestBuilder[Key]
}[keyof ApiRequestBuilder]

export type IEvoApi = Record<string, QueryType>;

export type IEvoApiMethod<TApiClient extends IEvoApi> = keyof TApiClient;
export type IEvoApiParams<TApiClient extends IEvoApi, K extends keyof TApiClient> = Parameters<TApiClient[K]['handler']>[0];
export type IEvoApiReturn<TApiClient extends IEvoApi, K extends keyof TApiClient> = Promise<Unpromise<ReturnType<TApiClient[K]['handler']>>>

export type IApiRequestFactory<TApiClient extends IEvoApi> = {
    clientName: string;
    handle: <K extends IEvoApiMethod<TApiClient>>(key: K, params: IEvoApiParams<TApiClient, K>) => IEvoApiReturn<TApiClient, K>
    ping: () => Promise<void>
}

export type Unpromise<T> = T extends Promise<infer TType> ? TType : T;
