import { clientEvents } from './constants';

export function createEvoEventName(...args: string[]) {
    return createEventName(clientEvents.__prefix, ...args);
}

export function createEventName(...args: string[]) {
    return args.filter(Boolean)
               .join(':');
}
