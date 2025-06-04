import { IEvoApi, IEvoApiParams, IEvoApiReturn, IEvoApiMethod } from './clientTypes';
import { createEvoEventName } from '../common/eventNamingStrategy';
import { clientEvents } from '../common/constants';
import { wait } from '../../utils';

const eventTimeout = Symbol('Registration wait error');
const registrationDeclined = Symbol('Registration declined error');

interface PromiseController {
    resolve: () => void;
    reject: () => void;
}

export class AsyncBus<TApiClient extends IEvoApi> {
    private client: TApiClient | null = null;
    private awaitInitPromiseControllers: PromiseController[] = [];

    private readonly cleanUpRegistrationListener: () => void;
    private readonly $id: string;

    constructor(public readonly clientName: string) {
        this.$id = `${clientName}-${Date.now() % 60000}`;
        this.cleanUpRegistrationListener = ApiRegisterEvent.createListener(this.clientRegistrationHandler);
    }

    private clientRegistrationHandler = (e: ApiRegisterEvent) => {
        if (e.detail.clientName !== this.clientName) return;

        this.client = e.detail.client as TApiClient;
        this.awaitInitPromiseControllers?.forEach(it => it.resolve());
    };

    private ensureClientExists = async (): Promise<TApiClient> => {
        if (this.client) return Promise.resolve(this.client);

        const { promise, promiseController } = this.createClientWatcher();
        const registryUpdatedPromise = promise
            .then(() => this.client || registrationDeclined);

        const result = await Promise.race([
            registryUpdatedPromise.catch(() => registrationDeclined),
            this.registrationTimeout()
                .then(() => eventTimeout),
        ]);

        if (result === eventTimeout) {
            // закрываем промис с реджектом, если отработал таймаут, чтобы выполнить отчистку
            promiseController.reject?.();
            throw new AsyncBusException(this.clientName, 'registrationTimeout');
        }

        if (result === registrationDeclined) {
            throw new AsyncBusException(this.clientName, 'registrationAborted');
        }

        return result as TApiClient;
    };

    private createClientWatcher = () => {
        const promiseController: Partial<PromiseController> = {};
        const promise = new Promise<void>((resolve, reject) => {
            const onFinally = () => {
                this.awaitInitPromiseControllers = this.awaitInitPromiseControllers
                                                       .filter(Boolean)
                                                       .filter(it => it !== promiseController);
            };
            const handleReject = () => {
                reject();
                onFinally();
            };

            promiseController.reject = handleReject;

            promiseController.resolve = () => {
                const apiClient = this.client;
                if (!apiClient) {
                    handleReject();
                    return;
                }
                resolve();
                onFinally();
            };
        });
        this.awaitInitPromiseControllers.push(promiseController as PromiseController);
        return {
            promiseController,
            promise,
        };
    };

    ping = async () => {
        await this.ensureClientExists();
    };

    private registrationTimeout = () => {
        const timeout = 5000;
        return wait(timeout);
    };

    callPromise = async <
        K extends IEvoApiMethod<TApiClient>,
        TParams extends IEvoApiParams<TApiClient, K>
    >(method: K, params: TParams): IEvoApiReturn<TApiClient, K> => {
        const client = await this.ensureClientExists();
        return client[method].handler(params);
    };

    dispose = () => {
        this.cleanUpRegistrationListener();
        this.awaitInitPromiseControllers = [];
        this.client = null;
    };
}

export class AsyncBusException extends Error {
    constructor(public readonly clientName: string, public readonly type: 'registrationTimeout' | 'registrationAborted') {
        super(`"${clientName}" registration failed`);
    }
}

interface RegistrationEventDetails<TClient extends IEvoApi = IEvoApi> {
    clientName: string;
    client: TClient;
}

export class ApiRegisterEvent<TClient extends IEvoApi = IEvoApi> extends CustomEvent<RegistrationEventDetails<TClient>> {
    static type = createEvoEventName(clientEvents.INIT_CLIENT);

    constructor(clientName: string, client: TClient) {
        super(ApiRegisterEvent.type, {
            detail: {
                clientName,
                client,
            },
        });
    }

    static createListener(callback: (e: ApiRegisterEvent) => void) {
        function onHandleCallback(e: Event) {
            // If we use here "instanceof" event is handled incorrectly. I assume the reason is that module's code with declaration of ApiRegisterEvent is loaded multiple times.

            callback(e as ApiRegisterEvent);
        }

        window.addEventListener(ApiRegisterEvent.type, onHandleCallback);
        return () => window.removeEventListener(ApiRegisterEvent.type, onHandleCallback);
    };

    static dispatch(clientName: string, client: IEvoApi) {
        console.log(`dispatch ${clientName}: ${ApiRegisterEvent.type}`);
        window.dispatchEvent(new ApiRegisterEvent(clientName, client));
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
                clientName,
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
