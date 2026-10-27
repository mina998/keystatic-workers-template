// keystatic.config.ts
import { config, fields, collection } from '@keystatic/core';

export default config({
    storage: {
        // kind: 'local',
        kind: 'github',
        repo: 'mina998/keystatic-workers-template',
    },
    collections: {
        // 文章
        posts: collection({
            label: 'Posts',
            slugField: 'title',
            path: 'src/content/posts/*',
            format: { contentField: 'content' },
            schema: {
                title: fields.slug({ name: { label: 'Title' } }),
                content: fields.markdoc({ label: 'Content' }),
            },
        }),
        // 产品
        products: collection({
            label: 'Products',
            slugField: 'title',
            path: 'src/content/products/*',
            
            format: { contentField: 'content' },
            schema: {
                title: fields.slug({ name: { label: 'Title' } }),
                content: fields.markdoc({ label: 'Content' }),
            },
        }),
        // ---
    },
});
