# Astro + Keystatic + Workers: Basics

```shell
# 创建astro 项目
pnpm create astro@latest

# Astro 对 Markdoc 和 React 集成
npx astro add react markdoc

# 安装包
pnpm add @keystatic/core @keystatic/astro

# 安装包 
pnpm add @astrojs/vercel

```

astro.config.mjs

```TS
// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [react(), markdoc(), keystatic()]
});

```

**keystatic.config.ts** 请注意 storage 参数 kind 和 repo 要和仓库一致

```TS
// keystatic.config.ts
import { config, fields, collection } from '@keystatic/core';

export default config({
    storage: {
        kind: 'github',
        repo: 'mina998/5d',
    },
    collections: {
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
    },
});
```

## 部署

在 vercel 里连接这个仓库 构建。
第一次部署可以先完成，用来拿到域名，例如 `https://xxx.com`。此时还不能登录后台。

## 生成ENV
- 访问 http://127.0.0.1:4321/keystatic  
- 使用github login 按指引操作
- GitHub App name 账号内不重复，例如 `demo-keystatic`
- Webhook → Active -> 不勾选 
- Where can this GitHub App be installed? -> Only on this account 
- 会在本地生成 .env文件 里面包含以下参数
```
KEYSTATIC_GITHUB_CLIENT_ID
KEYSTATIC_GITHUB_CLIENT_SECRET
KEYSTATIC_SECRET
PUBLIC_KEYSTATIC_GITHUB_APP_SLUG  
```

## vercel项目设置 
- 把上一步.env 文件中的参数添加到 vercel项目环境变量(Environment Variables)里面

## 编辑 GitHub App `demo-keystatic`

- 打开 <https://github.com/settings/apps>
- 找到[生成ENV]步骤里面生成的 GitHub App `demo-keystatic`
- 编辑 `demo-keystatic` 

| 字段 | 值 |
| --- | --- |
| Homepage URL | `https://xxx.com//keystatic` |
| Callback URL | `https://xxx.com/api/keystatic/github/oauth/callback` |

## 修改权限地址
- `https://github.com/settings/apps/<app-slug>/permissions`
- 在 Repository permissions 中设置
| 字段 | 值 |
| --- | --- |
| Contents | Read and write |
| Pull requests | Read-only |
| Metadata | Read-only（勾选上面两项后一般会自动带上，不要取消） |

后台地址是 `https://xxx.com/keystatic`。

## 安装到仓库

在这个 App 的左侧打开 Install App，只选择 `keystatic.config.ts` 里 `storage.repo` 对应的仓库。当前是 `mina998/keystatic-workers`。

不安装的话，GitHub 登录能通过，但保存内容会失败。

打开 `https://xxx.com/keystatic`，用对上面那个仓库有写权限的 GitHub 账号登录。
