import * as React from 'react';
import type { PiletApi } from '@app/host-app';
import { name } from '../package.json';

const Page = React.lazy(() => import('./Page'));

export function setup(app: PiletApi) {
    console.log(`${name} registration happened`);
    app.registerPage('/users', Page);
}
