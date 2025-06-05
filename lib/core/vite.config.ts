import { name } from './package.json';
import { defineConfig } from 'vite';
import { getBuildConfig } from '@app-system/config';

export default defineConfig(getBuildConfig({ name }));
