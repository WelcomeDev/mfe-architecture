import { ProcedureBuilder, UnsetMarker, createBuilder } from './core/apiRequestBuilder';
import { AsyncBus } from './core/asyncBus';
import { IEvoApi, IApiRequestFactory, IEvoApiParams, IEvoApiReturn } from './core/clientTypes';
import { ApiRegistrationEvent, ApiUnregisterEvent } from './core/apiRegistration';

type FactoryParams = {
    // todo: replace with Apollo-stuff
    apiClient: typeof fetch
    builder: ProcedureBuilder<UnsetMarker, UnsetMarker>
}

export type RegisterParams = Pick<FactoryParams, 'apiClient'>

type Factory<T extends IEvoApi> = (params: FactoryParams) => T;

export type ExposeApiParams = {
    apiName: string;
}

export interface ApiRegister {
    (params: RegisterParams): { dispose: () => void; };
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

    const bus = new AsyncBus<TApiClient>(apiName);

    const requestFactory = createRequestFactory<TApiClient>(bus);

    const register: ApiRegister = (registerParams: RegisterParams) => {
        const factoryInitParams: FactoryParams = {
            ...registerParams,
            builder: createBuilder({}),
        };
        const client = factory(factoryInitParams);
        ApiRegistrationEvent.dispatch(apiName, client);

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
        const result = bus.callPromise(key, params);
        result.then(it => {
            console.log('key result', it);
            return it;
        });
        return result;
    };

    return {
        clientName: bus.clientName,
        handle,
        ping: bus.ping,
    };
}
