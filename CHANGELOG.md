# 项目工作日志（Changelog）

个人主页 <https://aizyeee.github.io> 从零到上线的完整工作记录，按时间正序、分阶段整理。
每条尽量附 git 提交号（可用 `git show <hash>` 查看对应改动）；设计讨论等不产生提交的事件单独记录。

---

## 阶段 0 · 设计讨论（2026-07-03 下午）

> 产出物：`discussion.md`（全部讨论结论）、`docs/superpowers/specs/2026-07-03-homepage-design.md`（正式 spec）—— 提交 `7db395a`

- **定位与受众**：综合门户 + 长期维护的个人展示面（不是简历网页版）；首要受众是 OS×AI / IPADS 方向的学术同行与潜在合作者。30 秒目标：让访问者明白"这是一个系统性走向 AI 系统方向、在做真项目、有工程品味的本科生"。
- **审美访谈**（先了解偏好再出方案）：确认喜欢简约但有交互感的画面、深紫/米色/黑色；参照 Anthropic 官网米色底、Apple 动效丝滑感、Linear 级联进场、rauno.me 的工艺感（但要补上它缺失的悬停反馈）；排除 Reflect 式华丽发光。
- **色彩系统**：5 色相封顶——米白 `#F7F4EE` / 淡薰衣草 `#CDCAE0` / 中紫 `#8A82C9` / 交互紫 `#5E6AD2` / 墨 `#1C1917` + 白卡片 + 从墨色派生的中性阶。
- **字体系统**：衬线标题（Source Serif 4/宋体栈）+ 无衬线正文（Inter/黑体栈）+ 等宽高亮 chip（JetBrains Mono）；禁止 CJK webfont（中文走系统字体栈）。
- **线条语言**（"强调靠线条不靠堆颜色"）：签名元素 = 细框按钮 InkButton / 硬投影卡片 OffsetCard / 手绘圈注 CircleAnnotation（最强偏好）；配角 = 动态下划线 / 编号标尺线 / 四角括号框。
- **踩坑记录：圈注笔画预泄漏 bug**——`stroke-dasharray` 硬编码估算值小于真实路径长度，动画开始前就露出一段笔画。修复方案（运行时 `getTotalLength()` 精确计算 + CSS 兜底大值）写入 spec 作为实现约束。
- **圈注交互定稿**：进场自动画一次 + 每次悬停重画一次。
- **技术选型**：Astro 静态站（加内容 = 加一个 .md 文件）+ GitHub Pages 免费托管；信息架构五模块（首页/项目/博客/Now/关于），双语站默认英文、`/zh` 前缀中文，博客单语不强制翻译。

## 阶段 1 · 框架实现（2026-07-03 晚，14 任务子代理驱动开发）

> 实现计划：`docs/superpowers/plans/2026-07-03-homepage-implementation.md`（提交 `5e07c83`）；每个任务由独立子代理实现 + 审查者审查

- `5298a74` **任务1** 脚手架：Astro + i18n 路由配置 + `scripts/check-dist.sh` 构建产物断言（本项目的"回归测试"）。⚠️ 事故：`git add -A` 把含学号的个人文件带进仓库，审查发现后 `git rm --cached` + 根锚定 .gitignore 修复。
- `249e6f6` **任务2** 设计 token、全局样式、拉丁 webfont 自托管（Vite `?url` 构建期解析哈希文件名做 preload）。
- `7b2f7c3` **任务3** 内容集合：blog/projects/now 三集合 + zod schema 强校验（坏 frontmatter = 构建失败，错误左移）。
- `2834fe3` **任务4** i18n 词典与 `t()/localePath()/altLocale()` 工具。
- `98998ec` **任务5** 签名组件：InkButton / OffsetCard / CircleAnnotation。
- `2d971c2` **任务6** 配角组件：NavLink / SectionRule / CornerFrame / CascadeGroup / ReadingProgress。
- `10f55da` **任务7** BaseLayout：页头页脚、语言切换、SEO meta、canonical。
- `f04a62a` **任务8** 博客：双语列表页 + 文章页（阅读进度条）+ RSS。
- `35e8ece` **任务9** 项目：列表页 + 双语成对 case study 详情页。
- `a0917c8` **任务10** 双语首页：级联 hero + 圈注标题 + 精选项目 + 最近文章。
- `9be9f06` **任务11** Now / About（简历下载）/ 404 页。
- `e5adeb0` **任务12** sitemap + robots + 墨线 monogram favicon + 中文浏览器语言提示条（后被移除，见阶段 3）。
- `a8ffde8` **任务13** 清理 dev 页面、移动端适配、Lighthouse 摸底（移动端 93 分）。⚠️ 事故：子代理遭遇网关超时，改动幸存，恢复会话后完成收尾。
- `01bcbc3` **任务14** GitHub Actions 部署工作流（withastro/action + deploy-pages）。
- `0ef3efb` **最终全分支审查**（判定 "approve with fixes"）：修复项目页语言切换按钮在对端 case study 不存在时的死链风险（改为回落列表页）；check-dist 增加博客无 /zh 镜像的负向断言。

## 阶段 2 · 部署上线（2026-07-03 深夜）

- 本地 `feat/site-framework` 分支合并回 `main`；17 个提交作者用 `git filter-branch` 统一重写为 GitHub 主邮箱身份。
- `7caa838` ⚠️ **纠错**：建仓时发现 GitHub 用户名实际是 `lukaizyeee` 而非记忆中的 `aizyeee`，修正 5 处硬编码域名/链接。
- 用 gh CLI 创建 `lukaizyeee.github.io` 仓库并推送。⚠️ **坑**：GitHub 对用户站点仓库自动启用了 legacy branch 部署模式，与我们的 Actions workflow 模式冲突，首次部署失败；用 API 把 `build_type` 改为 `workflow` 后重跑成功。
- 上线验证：全部 14 条路由线上 200，站点在 `https://lukaizyeee.github.io` 可访问。
- 📌 **沉淀的运维经验**：GitHub Pages 偶发 "Deployment failed, try again later"（本项目共遇到 3 次）——这是服务端瞬时问题，与代码无关，Actions 页面 Re-run 即可恢复。

## 阶段 3 · 上线后迭代打磨（2026-07-03 深夜 〜 07-04）

**视觉与交互修复**

- `818d194` 修复首页大标题拥挤：Astro 编译器吞掉组件标签前的换行空白导致 "toward" 与圈注粘连（显式 `{' '}` 修复）+ 圈注 SVG 出血挤压邻词（`.anno` 加 `margin-inline`）。
- `191f375` 打磨一轮（三项）：进场浮现动效扩展到首屏以下区块（滚动触发）；删除"检测到中文浏览器"提示条（语言切换只保留手动按钮）；中文首页 kicker 和大标题固定为英文（个人签名式标语）。
- `7682e5d` **进场动效重构**：改为整页单一从上到下时间轴（纯 CSS，回退掉上一轮的滚动触发方案）——章节标题、卡片网格、文章列表全部纳入同一条级联序列，消除"各区块各自浮现"的割裂感和卡片从左到右的横向感。顺带修复隐性 bug：Astro 注入的 `<script>` 子元素会占用 `nth-child` 计数槽位导致延迟错位，用 `:nth-child(n of :not(script))` 排除。
- `26c7de4` 导航栏 Projects 左侧新增 Home 项（主页路径需精确匹配高亮，否则处处高亮）。
- `ce82f68` 浏览器标签页标题全站固定为 "Zihao Zhang"（不随页面/语言变化；og:title 分享预览仍保留各页标题）。
- `d911fc5` + `0bdd6dc` Now 页 CornerFrame 悬停动效调速：.3s → .55s → .7s（两轮用户反馈）。

**性能**

- `be12122` 开启全站悬停预取（`prefetch: { prefetchAll: true }`）：悬停链接即后台加载目标页，点击接近秒开。诊断结论：站内切换慢的偶发感来自国内到 GitHub 链路波动（页面本身仅 6–12KB），prefetch 改善常规延迟但无法解决链路抽风。

**文档与知识沉淀**

- `3074006` 《内容维护指南.md》：面向自主维护的中文操作手册（写博客/加项目/更新 Now/换简历的完整流程 + 常见报错排查）。
- `f8f0965` 设计系统 skill（`.claude/skills/ink-line-design-system/SKILL.md`）：把整套墨线视觉语言浓缩为可复用参考；经独立子代理盲测验证可用性，并据其反馈补充了圆角基准规范。

**域名迁移（07-04 下午）**

- `519deac` GitHub 账号改名 `lukaizyeee` → `aizyeee` 后的迁移。⚠️ **事故与恢复**：账号改名后仓库未自动重命名，仓库名与账号名不匹配导致 Pages 用户站点规则被破坏，**网站短暂 404**；手动将仓库重命名为 `aizyeee.github.io` 后立即恢复。随后更新代码中全部旧域名/用户名引用（site URL、robots.txt、GitHub 链接 ×3、文档）+ 本地 git remote。旧域名 `lukaizyeee.github.io` 已永久失效（无重定向），对外分享过的旧链接需自行更新。
- 📌 **网络经验**：国内直连 GitHub push 偶发完全不通，配置本地代理（127.0.0.1:10808）解决。

**无障碍优化（07-04 傍晚，用户首次独立修改 ✦）**

- `b9716c4` 小号文字 WCAG AA 对比度修复：新增文字级深靛 `--accent-ink #5460CC`（kicker、项目卡分类小标、语言切换按钮等 ≤14px 紫色文字，对比度 4.88:1）；`--text-3` 深化 `#78716C` → `#746D67`（13.5px 摘要文字达 4.5:1）；`--accent` 保留为装饰色（按钮投影、悬停填充）。设计系统 skill 同步更新（色板表 + 新增 Common Mistake 条目）。

---

## 当前状态（2026-07-04）

- **线上**：<https://aizyeee.github.io>，中英双语 17 个页面，Lighthouse 移动端 93。
- **日常工作流**：改 `.md` → `git push` → 2〜3 分钟自动部署上线（详见《内容维护指南.md》）。
- **内容阶段待办**（框架已就绪，等待填充）：首页 headline 定稿、About 页真实简介、Now 页首版内容、两篇 case study 正文、zh 项目 frontmatter 本地化、圈注笔色终选（墨黑 vs 淡墨/中紫，改色零成本）。
- **未来可选项**（讨论中预留）：深色模式（色板已验证黑底可行）、站内搜索（Pagefind）、评论（giscus）、访问统计（GoatCounter）、自定义域名 + 国内友好 CDN。
