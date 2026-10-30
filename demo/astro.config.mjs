// @ts-check
import { loadEnvFile } from 'node:process';
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';

import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';

try {
    loadEnvFile();
} catch (error) {
    const code = error && typeof error === 'object' && 'code' in error ? error.code : undefined;
    if (code !== 'ENOENT') throw error;
}

const devMode = process.env.DEV_MODE === 'true';

// https://astro.build/config
export default defineConfig({
    session: false,
    output: 'static',
    ...(devMode ? {} : { adapter: cloudflare() }),
    integrations: [react(), markdoc(), keystatic()],
    vite: {
        define: {
            __KEYSTATIC_DEV_MODE__: JSON.stringify(devMode),
        },
        optimizeDeps: {
            include: [
                'react',
                'react-dom',
                'react/jsx-runtime',
                'react/jsx-dev-runtime',
                'react-dom/server',
                'react-dom/server.edge',
                '@keystatic/core > cookie',
                '@braintree/sanitize-url',
                'emery',
            ],
        },
    },
});
