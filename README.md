# Astro + Keystatic + Workers: Basics

```shell
# 创建astro 项目
pnpm create astro@latest

# Astro 对 Markdoc 和 React 集成
npx astro add react markdoc

# 安装包
pnpm add @keystatic/core @keystatic/astro

# 安装包 
pnpm add -D wrangler
pnpm add @astrojs/cloudflare

# 如果报错  开授权
pnpm approve-builds
```

astro.config.mjs

```TS
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
```

**keystatic.config.ts** 请注意 storage 参数 kind 和 repo 要和仓库一致

```TS
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
        // ---
    },
});

```

## 部署

在 Cloudflare Workers 里连接这个仓库，用 Workers Builds 构建。

- Build command: `pnpm run build`
- Deploy command: `npx wrangler deploy`

`astro.config.mjs` 里的 `session: false` 要保留。改回默认后，Wrangler 会创建名为 `keystatic-workers-template-session` 的 KV；这个名字已经存在时，下一次部署会失败。

第一次部署可以先完成，用来拿到域名，例如 `https://xxx.com`。此时还不能登录后台。

## 创建 GitHub App

打开 <https://github.com/settings/apps>，选择 New GitHub App。

| 字段 | 值 |
| --- | --- |
| GitHub App name | 账号内不重复，例如 `demo-keystatic` |
| Homepage URL | `https://xxx.com//keystatic`（站点根地址） |
| Callback URL | `https://xxx.com/api/keystatic/github/oauth/callback` |
| Webhook → Active | 不勾选 |
| Contents | Read and write |
| Pull requests | Read-only |
| Metadata | Read-only（勾选上面两项后一般会自动带上，不要取消） |
| Where can this GitHub App be installed? | Only on this account |

后台地址是 `https://xxx.com/keystatic`。

## 安装到仓库

在这个 App 的左侧打开 Install App，只选择 `keystatic.config.ts` 里 `storage.repo` 对应的仓库。当前是 `mina998/keystatic-workers-template`。

不安装的话，GitHub 登录能通过，但保存内容会失败。

## 填写变量

App 的 slug 是设置页地址的最后一段。`https://github.com/settings/apps/demo-keystatic` 的 slug 就是 `demo-keystatic`。

在 App 页面复制：

- Client ID
- Client secrets (**Credentials**)  里新建的 Client Secret（只显示一次）

`KEYSTATIC_SECRET` 自己生成，至少 32 个字符，用 64 位小写字母和数字即可。它用来加密登录 cookie，不是 GitHub 发的。

这三个是运行时密钥，加在 Worker 的 Settings → Variables and Secrets，类型选 Secret：

```text
KEYSTATIC_GITHUB_CLIENT_ID
KEYSTATIC_GITHUB_CLIENT_SECRET
KEYSTATIC_SECRET
```

`PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` 会在 `astro build` 时写进前端，只加在 Worker 运行时变量里不会生效。把它加到 Workers Builds 的 Build variables，值为 App slug，例如 `demo-keystatic`。改完要重新部署一次。

打开 `https://xxx.com/keystatic`，用对上面那个仓库有写权限的 GitHub 账号登录。
