import { ApiRegistrationEvent } from './apiRegistration';
import { IEvoApi, IEvoApiParams, IEvoApiReturn, IEvoApiMethod } from './clientTypes';
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
        this.cleanUpRegistrationListener = ApiRegistrationEvent.createListener(this.clientRegistrationHandler);
    }

    private clientRegistrationHandler = (e: ApiRegistrationEvent) => {
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
