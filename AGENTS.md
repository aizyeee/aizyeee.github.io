# 项目交接说明（AGENTS.md）

> 面向后续接手的 AI agent / 协作者：读完这一份就能快速上手，不必翻遍代码。
> 更细的操作手册见文末「延伸文档」。
> 本项目只维护 `AGENTS.md` 作为 agent 交接入口；作者已主动删除多余的 `CLAUDE.md`，不要恢复或重新创建该文件。

## 这是什么

张子灏（Zihao Zhang）的个人主页。定位是**长期维护的综合展示面**（不是简历网页版），
首要受众是 OS×AI / 系统方向的学术同行与潜在合作者。视觉上走**克制的学术气质 + 手工感墨线强调**，
不靠发光和多色相取胜。

- **当前主域名**：<https://aizyeee.com>。作者已在 Cloudflare 购买该域名并完成网站部署；2026-10-18 实测 HTTPS 首页返回 200。
- **仓库**：`aizyeee/aizyeee.github.io`。原 GitHub Pages 地址 <https://aizyeee.github.io> 当前仍可访问，但对外入口以 `aizyeee.com` 为准。
- **形态**：Astro 静态站，中英双语，当前 17 条构建路由（项目详情暂不公开）
- **日常发布工作流**：改 `.md` / 组件 → `git push` 到 `main` → Cloudflare Workers Builds 自动构建并发布到 `aizyeee.com`。仓库内的 GitHub Actions 同时独立更新原 GitHub Pages 站点。

## 技术栈

- **Astro 7**（`^7.0.6`），纯 Astro 组件，**没有** React/Vue/Tailwind——样式全是手写 CSS + design tokens
- 集成：`@astrojs/sitemap`、`@astrojs/rss`
- 字体自托管：`@fontsource-variable/{inter, source-serif-4, jetbrains-mono}`（只自托管拉丁字体，中文走系统字体栈）
- Node `>=22.12.0`
- 内容用 Astro **content collections** + zod schema 强校验（坏 frontmatter = 构建失败，错误左移）

## 快速上手

```sh
npm install
npm run dev        # 本地开发 http://localhost:4321
npm run build      # 产出到 dist/
npm run preview    # 本地预览构建产物
```

构建后务必跑一次产物断言（本项目的「回归测试」）：

```sh
npm run build && bash scripts/check-dist.sh   # 期望输出：OK: 17 routes present
```

`check-dist.sh` 除了断言 17 条路由存在，还有两条**负向断言**：不允许 dev 页泄漏进生产、
不允许 blog 出现 `/zh/blog/[slug]/` 镜像（blog 是单 canonical URL 设计，见下）。改了路由结构就同步更新这个脚本。

> ⚠️ 实操坑：本机 shell 里 `astro` 常不在 PATH（`command not found: astro`）。
> 直接调用请加 `npx` 前缀（`npx astro build`），或统一用上面的 `npm run` 脚本。

## 信息架构 / 路由

5 个模块，双语。英文是默认语言、**无前缀**；中文加 `/zh` 前缀（`prefixDefaultLocale: false`）。

| 模块 | 英文路由 | 中文路由 |
|---|---|---|
| 首页 | `/` | `/zh/` |
| 项目列表 | `/projects` | `/zh/projects` |
| 项目详情 | `/projects/[slug]` | `/zh/projects/[slug]` |
| 博客列表 | `/blog` | `/zh/blog` |
| 博客详情 | `/blog/[slug]` | （无中文镜像，见下） |
| Now | `/now` | `/zh/now` |
| 关于 | `/about` | `/zh/about` |

还有 `/rss.xml`、`/sitemap-index.xml`、`/robots.txt`、`/404`、`/favicon.svg`。

## 加内容 = 加一个 `.md` 文件

内容全在 `src/content/`，用 content collections 管理，schema 在 `src/content.config.ts`。
坏 frontmatter 会直接构建失败，是刻意的错误左移。

| 内容类型 | 放哪 | 关键 frontmatter |
|---|---|---|
| 博客 | `src/content/blog/*.md` | `title` `date` `lang(en\|zh)` `tags[]` `description` `draft?` |
| 项目（英） | `src/content/projects/en/*.md` | `title` `period` `role` `summary` `tech[]` `metrics[]` `featured?` `draft?` `order?` |
| 项目（中） | `src/content/projects/zh/*.md` | 同上，与英文版同名成对 |
| Now | `src/content/now/{en,zh}.md` | `updated` |

**博客是单 canonical URL 设计**（关键约定，别踩）：博客详情页只有 `/blog/[slug]/` 一条路由，
**没有** `/zh/blog/[slug]/` 镜像。`lang` 字段只标注**正文自身语言**（用于列表页的 EN/中 标签、
`<article lang>` 属性），**不驱动站点 UI 语言**——点开一篇中文博客，站点导航仍是英文态，
不会把整站「切换」成中文。作者未来可能只用中文写博客，需要英文版的读者用浏览器翻译即可，
不做人工中英对照。项目详情页则相反，是中英成对的两条真实路由。

**当前公开内容策略（2026-10-18）**：首页标题仅保留 `heading toward OS × AI`，介绍仅保留 SJTU 本科生身份。
现有项目均标记 `draft: true`，从首页、项目列表、详情路由及 sitemap 中排除；无公开项目时显示通用占位卡片。
后续确认内容准确后再移除对应中英文稿的 `draft: true`，并同步更新 `scripts/check-dist.sh` 的详情路由断言。

被 `.gitignore` 忽略、留在本地不进仓库的个人文件：`张子灏_技术简历.pdf`、`自我介绍.md`、
`内容维护指南.md`、`discussion.md`、`CHANGELOG.md`。别手滑 `git add -A` 把它们带进仓库。

## 设计系统（改任何 UI 前先读）

完整规范是一个 Claude Skill：`.claude/skills/ink-line-design-system/SKILL.md`，改 UI 前务必读。
核心哲学一句话：**强调靠黑色线条/描边，不靠堆颜色**。几条最容易违反的硬约束：

- **5 色相封顶，不加新色相**。色板唯一权威来源是 `src/styles/tokens.css`。加强调优先用线条语言，
  颜色不够用是设计约束不是疏漏。
- **背景淡紫、文字中紫**（2026-10-18 作者确认）：卡片和标签底色保留 `--surface #CDCAE0`；
  语言切换按钮文字、边框与 hover 底色、首页 kicker、白卡状态文字使用 `--purple-mid #8A82C9`，紫卡状态文字使用白色。
  `--accent` 仅作装饰，继续引用淡紫 `--surface`（InkButton 硬投影）；蓝紫及旧 `--accent-ink` 分支弃用。
- **禁止引入中文 webfont**：中文一律吃系统字体栈，只有拉丁字符加载自托管 variable font。这是性能取舍。
- **签名组件优先复用而非发明**：`InkButton`（填墨反色按钮）、`OffsetCard`（位移+墨色硬投影卡片）、
  `CircleAnnotation`（手绘圈注）。首页 `OS × AI` 按作者要求暂不添加圈注或下划线，等待重新设计；
  其他已有圈注保留。其他页面强调关键词优先复用这些墨线组件，别加粗变色。
- **气质分层靠静态底色，不靠新 hover 语言**：同一套「位移 `translate(-3px,-3px)` + 硬投影
  `5px 5px 0 0 var(--ink)`」配不同底色即可拉开差异——`--card` 白（实体感，项目卡）/
  `--surface` 淡薰衣草（交替）/ `--bg` 米白（轮廓感，博客列表）。
- **进场动效是整页一条时间轴**：全站用单个 `CascadeGroup` 包住全部内容做从上到下的级联浮现，
  纯 CSS，不要每个区块各自触发。注意用 `:nth-child(n of :not(script))` 排除 Astro 注入的 `<script>`。

## 组件地图（`src/components/`）

- **布局**：`BaseLayout.astro`（页头页脚 + SEO meta，`locale` prop 决定 chrome 语言）、
  `SiteHeader.astro`、`SiteFooter.astro`
- **签名视觉**：`InkButton` `OffsetCard` `CircleAnnotation`
- **配角**：`NavLink`（动态下划线）、`SectionRule`（编号标尺线）、`CornerFrame`（四角括号框）、
  `CascadeGroup`（级联进场）、`ReadingProgress`（文章阅读进度条）
- **内容卡片**：`ProjectCard`（首页/列表用）、`PostList`（博客列表）
- **i18n**：`LangSwitch`（手动语言切换按钮，不做浏览器语言自动识别）

## i18n 关键约定（`src/i18n/ui.ts`）

- `t(locale)(key)` 取词典文案，`localePath(locale, path)` 生成带/不带 `/zh` 前缀的路径，
  `altLocale(locale)` 取另一语言。
- 首页 hero 的 kicker 和大标题**固定英文**（个人签名式标语，不随语言切换），这是刻意设计。
- 博客详情页固定传 `BaseLayout locale="en"`，别用 `post.data.lang` 驱动 chrome，否则点开中文博客会把整站切成中文态。

## 部署与运维

- **当前生产托管**：Cloudflare Workers 静态资源托管，项目名 `aizyeee-github-io`，绑定自定义域名 <https://aizyeee.com>；域名也在 Cloudflare 购买。2026-10-18 已通过 Cloudflare 控制台确认，使用的是 Workers，而非 Cloudflare Pages。
- **生产发布链路**：Cloudflare Workers Builds 已连接 `aizyeee/aizyeee.github.io` 的 `main` 分支。push 后自动构建部署，根目录为 `/`，Build command 为 `npm run build`，Deploy command 为 `npx wrangler deploy`。这些设置由 Cloudflare 控制台管理，本仓库当前没有 Wrangler 配置文件。日常发布无需本机登录 Wrangler。
- **主域名配置**：`astro.config.mjs` 的 `site` 与 `public/robots.txt` 的 sitemap 地址统一使用 `https://aizyeee.com`。canonical、`og:url`、sitemap 和 RSS 由此生成；构建后应确认生成地址均为新主域名。仓库名称和 GitHub 代码链接仍保留 `aizyeee.github.io`，不要做全仓库盲目替换。
- **保留的 GitHub Pages 发布链路**：push 到 `main` → `.github/workflows/deploy.yml`（`withastro/action@v6` + `deploy-pages@v5`）自动构建部署原 GitHub Pages 站点。这与 Cloudflare 生产部署是两条独立链路，GitHub Actions 成功不能单独证明新域名已更新。
- **原 GitHub 用户站点的仓库命名约定**：保留 `aizyeee.github.io` 默认用户站点时，仓库名须与账号对应。历史上账号改名后仓库未同步重命名，曾导致默认站点 404；不要把这条历史约束直接套用为新域名或 Cloudflare 托管的规则。
- **GitHub Pages 偶发部署失败**：有时报 `"Deployment failed, try again later"`（build 成功、deploy 失败），
  这是服务端瞬时问题，`gh run rerun <id> --failed` 即可。但**旧 run 的 artifact 会过期**——
  对过期 run rerun deploy 会报 `No artifacts named "github-pages"`，此时需要新 push 重新生成 artifact。
- **国内网络**：直连 GitHub push 偶发不通，必要时配本地代理（端口按当时可用情况定，最近一次是 unset 代理后直连成功）。

## 常见坑速查

- 想加新强调手法就换个颜色 → 先想线条/描边/圈注，色相已用满。
- 给新容器发明新 hover 语言做区分 → 先只换静态底色（`--card`/`--surface`/`--bg`）。
- 凭颜色名称判断色值 → 核对 `tokens.css` 与具体用途；当前背景紫与中紫是两个不同的色板条目。
- 给中文标题引入好看的中文 webfont → 不要，系统字体栈是性能优先的刻意选择。
- 改了路由结构没同步 `scripts/check-dist.sh` → 断言会失效。
- `git add -A` 把 `.gitignore` 里的个人文件带进仓库 → 只 add 明确的目标文件。

## 延伸文档

- `.claude/skills/ink-line-design-system/SKILL.md` — 完整设计系统规范（改 UI 必读）
- `内容维护指南.md` — 面向作者自主维护的中文操作手册（本地，未进仓库）
- `CHANGELOG.md` — 从设计到上线的完整工作日志（本地，未进仓库）
- `docs/superpowers/specs/2026-07-03-homepage-design.md` — 初始设计 spec
- `docs/superpowers/plans/2026-07-03-homepage-implementation.md` — 初始实现计划
- 上游文档：<https://docs.astro.build>（路由、组件、content collections、i18n 等指南）
