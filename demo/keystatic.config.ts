// keystatic.config.ts
import { config, fields, collection } from '@keystatic/core';
import { slugify } from './src/libs/slug';

export default config({
    storage: __KEYSTATIC_DEV_MODE__
        ? { kind: 'local' }
        : { kind: 'github', repo: 'mina998/keystatic' },
    collections: {
        // 文章
        posts: collection({
            label: '文章',
            slugField: 'title',
            path: 'src/content/posts/*/',
            format: { contentField: 'content' },
            entryLayout: 'content',
            schema: {
                title: fields.slug({
                    name: { label: '标题' },
                    slug: { generate: slugify },
                }),
                date: fields.date({
                    label: '发布日期',
                    defaultValue: { kind: 'today' }
                }),
                draft: fields.checkbox({
                    label: '设为草稿',
                    defaultValue: false,
                }),
                category: fields.relationship({
                    label: '类别',
                    collection: 'categories',
                    validation: { isRequired: true },
                }),
                tags: fields.array(
                    fields.relationship({
                        label: '标签',
                        collection: 'tags',
                    }),
                    {
                        label: '标签',
                        itemLabel: (props) => props.value ?? '请选择',
                    },
                ),
                content: fields.markdoc({ label: '正文' }),
                description: fields.text({ label: '文章简介', multiline: true }),
            },
            columns: ['date', 'category'],
        }),
        // 类别
        categories: collection({
            label: '类别',
            slugField: 'title',
            path: 'src/content/categories/*/',
            format: 'json',
            entryLayout: 'form',
            schema: {
                title: fields.slug({
                    name: { label: '类别名称' },
                    slug: { generate: slugify },
                }),
                icon: fields.image({ label: '类别图标' }),
                description: fields.markdoc({ label: '类别描述' }),
            },
        }),
        // 标签
        tags: collection({
            label: '标签',
            slugField: 'title',
            path: 'src/content/tags/*/',
            format: 'json',
            entryLayout: 'form',
            schema: {
                title: fields.slug({
                    name: { label: '标签名称' },
                    slug: { generate: slugify },
                }),
                description: fields.markdoc({ label: '标签描述' }),
            },
        }),
    },
    singletons: {
        settings: {
            label: '站点设置',
            path: 'src/content/settings',
            format: 'json',
            entryLayout: 'form',
            schema: {
                siteTitle: fields.text({ label: '站点名' }),
                siteLogo: fields.image({ label: '站点标识' }),
                siteDescription: fields.text({ label: '站点描述' }),
            },
        },
    }
});
