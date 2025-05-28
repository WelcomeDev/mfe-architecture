import { IEvoApi } from './clientTypes';
import { AsyncBus } from './asyncBus';

// @ts-expect-error Using global object stores all references to AsyncBus and ensures only exists per client
window.__busRegistry = window.__busRegistry ?? new Map<string, AsyncBus<any>>();

export function getBus<TApiClient extends IEvoApi>(apiName: string): AsyncBus<TApiClient> {
    // @ts-expect-error
    const busRegistry: Map<string, AsyncBus<any>> = window.__busRegistry;
    if (!busRegistry.has(apiName)) {
        busRegistry.set(apiName, new AsyncBus<TApiClient>(apiName));
    }
    return busRegistry.get(apiName)!;
}
