import * as React from 'react';
import type { PiletApi } from '@app/host-app';

const Page = React.lazy(() => import('./Page'));

export function setup(app: PiletApi) {
    app.registerPage('/licence', Page);
}
