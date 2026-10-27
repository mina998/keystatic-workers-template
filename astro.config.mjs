// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
    experimental: {
        incrementalBuild: true,
    },
    session: false,
    output: 'server',
    adapter: cloudflare(),
    integrations: [react(), markdoc(), keystatic()],
    vite: {
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
