import { IEvoApi } from './clientTypes';
import { AsyncBus } from './asyncBus';

const busInstance: Map<string, AsyncBus<any>> = new Map<string, AsyncBus<any>>();

export function getBus<TApiClient extends IEvoApi>(apiName: string): AsyncBus<TApiClient> {
    const busRegistry: Map<string, AsyncBus<any>> = busInstance;
    if (!busRegistry.has(apiName)) {
        busRegistry.set(apiName, new AsyncBus<TApiClient>(apiName));
    }
    return busRegistry.get(apiName)!;
}
