import { ProcedureBuilder, UnsetMarker, createBuilder } from './core/apiRequestBuilder';
import { ApiRegisterEvent, ApiUnregisterEvent, AsyncBus } from './core/asyncBus';
import { IEvoApi, IApiRequestFactory } from './core/clientTypes';
import { getBus } from './core/apiRegistration';

type InternalRegisterFactoryParams = {
    // todo: replace with Apollo-stuff
    apiClient: typeof fetch
//    debug?: boolean;
    builder: ProcedureBuilder<UnsetMarker, UnsetMarker>
}

export type PublicRegisterParams = Omit<InternalRegisterFactoryParams, 'builder'>

type Factory<T extends IEvoApi> = (params: InternalRegisterFactoryParams) => T;

export type ExposeApiParams = {
    apiName: string;
}

export interface ApiRegister {
    (params: PublicRegisterParams): { dispose: () => void; };
}

export type ExposeApi<TApiClient extends IEvoApi> = {
    register: ApiRegister;
    requestFactory: IApiRequestFactory<TApiClient>;
}

//export type InferMethodInfo<TExposure, TMethod> = TExposure extends ExposeApi<infer TApiClient> ?
//    TMethod extends keyof TApiClient ? {
//            p: IEvoApiParams<TApiClient, TMethod>;
//            r: IEvoApiReturn<TApiClient, TMethod>
//        }
//        : never
//    : never;

export function exposeApi<TApiClient extends IEvoApi>(params: ExposeApiParams, factory: Factory<TApiClient>): ExposeApi<TApiClient> {
    const {
        apiName,
    } = params;

    const bus = getBus<TApiClient>(apiName);

    const requestFactory = createRequestFactory<TApiClient>(bus);

    const register: ApiRegister = (registerParams: PublicRegisterParams) => {
        const factoryInitParams: InternalRegisterFactoryParams = {
            ...registerParams,
            builder: createBuilder({}),
        };
        const client = factory(factoryInitParams);
        ApiRegisterEvent.dispatch(apiName, client);

        return {
            dispose: () => {
                ApiUnregisterEvent.dispatch(apiName);
            },
        };

    };

    return { register, requestFactory };
}

function createRequestFactory<TApiClient extends IEvoApi>(bus: AsyncBus<TApiClient>): IApiRequestFactory<TApiClient> {
    const handle: IApiRequestFactory<TApiClient>['handle'] = (key, params) => {
        console.log('call', key, 'params:', params);
        return bus.callPromise(key, params);
    };

    return {
        clientName: bus.clientName,
        handle,
        ping: bus.ping,
    };
}
