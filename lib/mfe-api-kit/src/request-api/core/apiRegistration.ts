import { clientEvents } from './constants';
import { IEvoApi } from './clientTypes';
import { createEvoEventName } from './eventNamingStrategy';

interface RegistrationEventDetails<TClient extends IEvoApi = IEvoApi> {
    clientName: string;
    client: TClient;
}

export class ApiRegistrationEvent<TClient extends IEvoApi = IEvoApi> extends CustomEvent<RegistrationEventDetails<TClient>> {
    static type = createEvoEventName(clientEvents.INIT_CLIENT);

    constructor(clientName: string, client: TClient) {
        super(ApiRegistrationEvent.type, {
            detail: {
                clientName,
                client,
            },
        });
    }

    static createListener(callback: (e: ApiRegistrationEvent) => void) {
        function onHandleCallback(e: Event) {
            // If we use here "instanceof" event is handled incorrectly. I assume the reason is that module's code with declaration of ApiRegistrationEvent is loaded multiple times.

            callback(e as ApiRegistrationEvent);
        }

        window.addEventListener(ApiRegistrationEvent.type, onHandleCallback);
        return () => window.removeEventListener(ApiRegistrationEvent.type, onHandleCallback);
    };

    static dispatch(clientName: string, client: IEvoApi) {
        console.log(`dispatch ${clientName}: ${ApiRegistrationEvent.type}`);
        window.dispatchEvent(new ApiRegistrationEvent(clientName, client));
    }
}

interface UnregisterEventDetails {
    clientName: string;
}

export class ApiUnregisterEvent extends CustomEvent<UnregisterEventDetails> {
    static type = createEvoEventName(clientEvents.INIT_CLIENT);

    constructor(clientName: string) {
        super(ApiUnregisterEvent.type, {
            detail: {
                clientName
            },
        });
    }

    static createListener(callback: (e: ApiUnregisterEvent) => void) {
        function onHandleCallback(e: Event) {
            if (!(e instanceof ApiUnregisterEvent)) return;
            callback(e);
        }

        window.addEventListener(ApiUnregisterEvent.type, onHandleCallback);
        return () => window.removeEventListener(ApiUnregisterEvent.type, onHandleCallback);
    }

    static dispatch(clientName: string) {
        window.dispatchEvent(new ApiUnregisterEvent(clientName));
    }
}
