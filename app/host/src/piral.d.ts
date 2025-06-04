import type { ApiRegistryPlugin } from './plugins/apiRegisterPlugin';
import {
  PiletDashboardApi,
  PiletLocaleApi,
  PiletMenuApi,
  PiletNotificationsApi,
  PiletModalsApi,
  PiletFeedsApi,
} from 'piral';
import { ComponentType, PropsWithChildren } from 'react';

//declare module 'piral-core/lib/types/custom' {
declare module 'piral' {
  interface PiletCustomApi extends ApiRegistryPlugin,
    PiletDashboardApi, PiletLocaleApi, PiletMenuApi, PiletNotificationsApi, PiletModalsApi, PiletFeedsApi {}

  interface ErrorComponentsState {

  }

  interface ComponentsState {
    DashboardContainer: ComponentType<PropsWithChildren>;
    DashboardTile: ComponentType<PropsWithChildren<{ columns: string, rows: string }>>;
    MenuContainer: ComponentType<PropsWithChildren>;
    MenuItem: ComponentType<PropsWithChildren>;
    NotificationsHost: ComponentType<PropsWithChildren>;
    NotificationsToast: ComponentType<PropsWithChildren<{
      onClose: () => void,
      options: { title: string, type: string }
    }>>;
  }
}
