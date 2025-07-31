# 60s API 前端展示项目

这是一个基于 React + Vite + TypeScript 构建的 60s API 前端展示项目，提供了完整的 API 接口展示、测试和使用示例。

## 📋 项目特性

- **完整的 API 覆盖**: 支持所有 28 个 API 端点
- **分类展示**: 按功能分类展示接口（日更资讯、热门榜单、实用功能、消遣娱乐等）
- **交互式测试**: 每个接口都有专门的测试页面
- **实时数据**: 支持实时获取和展示 API 数据
- **响应式设计**: 适配移动端和桌面端
- **现代化 UI**: 使用 Tailwind CSS 和 shadcn/ui 组件

## 🚀 支持的 API 接口

### 🗞️ 日更资讯
- `/v2/60s` - 每日60秒读懂世界新闻摘要
- `/v2/bing` - 必应每日壁纸
- `/v2/exchange_rate` - 当日货币汇率
- `/v2/today_in_history` - 历史上的今天

### 🔥 热门榜单
- `/v2/bili` - 哔哩哔哩热搜榜
- `/v2/maoyan` - 猫眼票房排行榜
- `/v2/weibo` - 微博热搜榜
- `/v2/zhihu` - 知乎热门话题
- `/v2/douyin` - 抖音热搜榜
- `/v2/toutiao` - 头条热搜榜

### 🛠️ 实用功能
- `/v2/epic` - Epic Games 免费游戏
- `/v2/baike` - 百度百科词条
- `/v2/fanyi` - 在线翻译（支持109种语言）
- `/v2/fanyi/langs` - 翻译支持的语言列表
- `/v2/ip` - 公网IP地址查询
- `/v2/og` - 链接OG信息获取
- `/v2/hash` - 哈希计算
- `/v2/weather` - 天气查询
- `/v2/weather/7d` - 7天天气预报
- `/v2/lunar` - 农历信息查询

### 🎮 消遣娱乐
- `/v2/changya` - 随机唱歌音频
- `/v2/chemical` - 随机化合物
- `/v2/hitokoto` - 随机一言
- `/v2/luck` - 随机运势
- `/v2/duanzi` - 随机搞笑段子
- `/v2/fabing` - 随机发病文学
- `/v2/answer` - 随机答案之书
- `/v2/kfc` - KFC疯狂星期四文案

### 📸 其他
- `/v2/bizhi` - 随机壁纸（已弃用）
- `/v2/dog` - 随机狗狗图片（已弃用）

## 🛠️ 技术栈

- **前端框架**: React 19
- **构建工具**: Vite 7
- **类型检查**: TypeScript
- **样式框架**: Tailwind CSS 4
- **UI 组件**: shadcn/ui
- **路由**: React Router 7
- **图标**: Lucide React
- **代码质量**: ESLint

## 📦 安装和运行

### 环境要求
- Node.js 18+
- pnpm (推荐) 或 npm

### 安装依赖
```bash
pnpm install
```

### 开发模式
```bash
pnpm dev
```

### 构建生产版本
```bash
pnpm build
```

### 预览构建结果
```bash
pnpm preview
```

## ⚙️ 环境配置

项目支持通过环境变量配置 API 基础 URL：

```bash
# .env.local
VITE_API_URL=https://your-api-domain.com
```

如果不设置，默认使用 `https://60s.viki.moe`

## 📱 页面结构

- **首页** (`/`) - API 概览和分类展示
- **接口测试页** (`/endpoint/:name`) - 通用接口测试
- **专门页面** (`/api/:name`) - 针对特定接口的详细页面

## 🎨 设计特色

- **分类展示**: 将 28 个接口按功能分为 4 个主要类别
- **交互体验**: 每个接口都可以直接测试和查看结果
- **数据可视化**: 支持图片、音频、表格等多种数据展示形式
- **错误处理**: 完善的错误提示和处理机制
- **响应式设计**: 完美适配各种屏幕尺寸

## 📄 许可证

本项目使用 MIT 许可证。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进项目！

## 相关链接

- [60s API 文档](https://docs.60s-api.viki.moe)
- [GitHub 仓库](https://github.com/vikiboss/60s)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
