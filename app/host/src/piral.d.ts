import { ApiRegistryPlugin } from './plugins/apiRegisterPlugin';

declare module 'piral-core/lib/types/custom' {
    interface PiletCustomApi extends ApiRegistryPlugin {}
}
