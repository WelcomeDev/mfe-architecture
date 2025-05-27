import * as React from 'react';
import type { PiletApi } from '@app/host-app';

const Page = React.lazy(() => import('./Page'));

export function setup(app: PiletApi) {
  console.log('registration happened users');
  app.registerPage('/users', ()=><p>Users page</p>);
}
