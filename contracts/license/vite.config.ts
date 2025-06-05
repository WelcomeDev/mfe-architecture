import { getBuildConfig } from '@app-system/config';
import { defineConfig } from 'vite';
import { name, peerDependencies } from './package.json';

export default defineConfig(getBuildConfig({ name, peerDependencies }));
